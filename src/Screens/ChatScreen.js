import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChatItem from '../Components/ChatItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {getSocket} from '../Services/socket';
import {useDispatch, useSelector} from 'react-redux';
import {clearActiveChatId, setActiveChatId} from '../Redux/chatSlice';

const ChatScreen = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

  const socket = getSocket();
  const activeChatId = useSelector(state => state.chat.activeChatId);
  const dispatch = useDispatch();
  console.log(activeChatId, 'sdfsdfsdfsdsdfsdf ===>>>>>>>>');

  useEffect(() => {
    socket.on('newIncomingMessage', data => {
      console.log('New Incoming Message:', data);

      if (data.conversationId) {
        if (activeChatId === data.conversationId) {
        console.log("id match");
        
          return ;
        } else {
          setUnreadCounts(prevCounts => {
            const newCount = (prevCounts[data.conversationId] || 0) + 1;
            console.log(`Unread Count for ${data.conversationId}:`, newCount); // Log unread count
            return {
              ...prevCounts,
              [data.conversationId]: newCount,
            };
          });
        }
       
        
        
        setChats(prevChats => {
          const existingChatIndex = prevChats.findIndex(
            chat => chat._id === data.conversationId,
          );

          const currentTime = new Date().toISOString();
          // const newMessage = data.text;
          const newMessage = {text: data.text};

          if (existingChatIndex !== -1) {
            const updatedChat = {
              ...prevChats[existingChatIndex],
              lastText: newMessage,
              updatedAt: currentTime,
              unreadCount: (prevChats[existingChatIndex].unreadCount || 0) + 1,
            };

            const updatedChats = [
              updatedChat,
              ...prevChats.filter((_, index) => index !== existingChatIndex),
            ];
            return updatedChats;
          } else {
            const newChat = {
              _id: data.conversationId,
              // lastMessage: newMessage,
              lastText: {text: data.text},
              updatedAt: currentTime,
              receiverData: [{phoneNumber: data.senderPhoneNumber}],
              unreadCount: 1,
            };

            return [newChat, ...prevChats];
          }
        });
      }
    });
    return () => {
      socket.off('newIncomingMessage');
    };
  }, [activeChatId]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(
        'http://192.168.1.62:6004/whatsapp/conversation?searchWith=all',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      console.log('Fetched data:', data);

      if (
        data.success &&
        data.result &&
        Array.isArray(data.result.conversations)
      ) {
        setChats(data.result.conversations);
      } else {
        console.error('Data is not in the expected format:', data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Focus listener to refresh chat list
  useFocusEffect(
    React.useCallback(() => {
      fetchChats();
    }, []),
  );
  const handleChatPress = chat => {
    const phoneNumber = Array.isArray(chat.receiverData)
      ? chat.receiverData[0]?.phoneNumber
      : chat.receiverData?.phoneNumber;
    const id = chat?._id;
    console.log('Dispatching Active Chat ID:', id);
    // Set the active chat ID
    dispatch(setActiveChatId(id));
    setUnreadCounts(prevCounts => ({
      ...prevCounts,
      [id]: 0,
    }));

    navigation.navigate('ChatMessageScreen', {chatName: phoneNumber, id});
  };

  // const handleChatPress = (chat) => {
  //   const phoneNumber = Array.isArray(chat.receiverData)
  //     ? chat.receiverData[0]?.phoneNumber
  //     : chat.receiverData?.phoneNumber;
  //   const id = chat?._id;

  //   setUnreadCounts((prevCounts) => ({
  //     ...prevCounts,
  //     [id]: 0,
  //   }));

  //   navigation.navigate('ChatMessageScreen', { chatName: phoneNumber, id });
  // };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Icon name="search" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="more-vert" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={chats.filter(chat => {
            if (Array.isArray(chat.receiverData)) {
              return (
                chat.receiverData.length > 0 &&
                chat.receiverData[0]?.phoneNumber
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase())
              );
            } else if (
              chat.receiverData &&
              typeof chat.receiverData === 'object'
            ) {
              return chat.receiverData.phoneNumber
                ?.toLowerCase()
                .includes(searchText.toLowerCase());
            }
            return false;
          })}
          keyExtractor={item => item._id}
          extraData={chats}
          renderItem={({item}) => (
            <ChatItem chat={item} onPress={() => handleChatPress(item)} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 60,
    backgroundColor: '#075E54',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
    marginBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginTop: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    elevation: 2,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
});

export default ChatScreen;
