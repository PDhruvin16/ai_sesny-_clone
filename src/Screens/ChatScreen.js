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
import {
  ConversationSchema,
  LastTextSchema,
  ReceiverDataSchema,
} from '../Utils/ConversationSchema';

import {syncConversationsToRealm} from '../Utils/realmhelper';
import Header from '../Components/Header';
import SearchBar from '../Components/Searchbar';
import {useRealm} from '../Utils/realmcontext';
import NetInfo from '@react-native-community/netinfo';
const ChatScreen = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [unreadCounts, setUnreadCounts] = useState({});

  const socket = getSocket();
  const activeChatId = useSelector(state => state.chat.activeChatId);
  const dispatch = useDispatch();
  const realm = useRealm();


  useEffect(() => {
    const loadCachedConversations = () => {
      const cachedConversations = realm
        .objects('Conversation')
        .sorted('updatedAt', true);
      setChats([...cachedConversations]); // Display cached data instantly
    };

    loadCachedConversations(); // Load cached data
  }, [realm]);
  useEffect(() => {
    const handleIncomingMessage = async data => {
      console.log('New Incoming Message:', data);

      if (data.conversationId) {
        try {
          realm.write(() => {
            // Update the conversation if it exists
            let existingConversation = realm.objectForPrimaryKey(
              'Conversation',
              data.conversationId,
            );
            const newMessage = {text: data.text};
            if (existingConversation) {
              existingConversation.lastText = newMessage;
              existingConversation.updatedAt = new Date();
              existingConversation.unreadCount =
                activeChatId === data.conversationId
                  ? 0
                  : (existingConversation.unreadCount || 0) + 1;
            } else {
              // If conversation not found, create a new one (based on incoming structure)
              realm.create('Conversation', {
                _id: data.conversationId,
                lastText: data.message,
                updatedAt: new Date(),
                unreadCount: 1,
                receiverData: [
                  {
                    phoneNumber: data.from, // Adjust depending on your schema
                  },
                ],
              });
            }
          });

          const updatedChats = realm
            .objects('Conversation')
            .sorted('updatedAt', true);
          setChats([...updatedChats]);
        } catch (err) {
          console.error('Error updating Realm on new message:', err);
        }
      }
    };

    socket.on('newIncomingMessage', handleIncomingMessage);

    return () => {
      socket.off('newIncomingMessage', handleIncomingMessage);
    };
  }, [activeChatId]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        const token = await AsyncStorage.getItem('token');
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
        console.log(data, 'response=====>');
        if (data.success && Array.isArray(data.result.conversations)) {
          await syncConversationsToRealm(realm, data.result.conversations);

          const allConversations = realm
            .objects('Conversation')
            .sorted('updatedAt', true);
          setChats([...allConversations]);
        }
      } else{
        console.log('No internet connection. Displaying local data.');
        // const allConversations = realm
        //   .objects('Conversation')
        //   .sorted('updatedAt', true);
        // setChats([...allConversations]);
   
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchChats();
    }, []),
  );
  const handleChatPress = async chat => {
    const phoneNumber = Array.isArray(chat.receiverData)
      ? chat.receiverData[0]?.phoneNumber
      : chat.receiverData?.phoneNumber;
    const id = chat?._id;

    dispatch(setActiveChatId(id));
    const profilePic = Array.isArray(chat.receiverData)
      ? chat.receiverData[0]?.profilePic
      : chat.receiverData?.profilePic;
    // Reset unread count for this chat only

    realm.write(() => {
      const conv = realm.objectForPrimaryKey('Conversation', id);
      if (conv) {
        conv.unreadCount = 0;
      }
    });

    navigation.navigate('ChatMessageScreen', {
      chatName: phoneNumber,
      id,
      profilePic,
      refreshChats: fetchChats,
    });
  };

  return (
  
    <View style={styles.container}>
    {/* Header */}
    <Header title="Chats" />
    <SearchBar value={searchText} onChangeText={setSearchText} />

    {/* Conversation List */}
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
