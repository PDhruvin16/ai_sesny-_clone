// import React, {useCallback, useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import ChatItem from '../Components/ChatItem';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useFocusEffect} from '@react-navigation/native';
// import {getSocket} from '../Services/socket';
// import {useDispatch, useSelector} from 'react-redux';
// import {clearActiveChatId, setActiveChatId} from '../Redux/chatSlice';
// import {
//   ConversationSchema,
//   LastTextSchema,
//   ReceiverDataSchema,
// } from '../Utils/ConversationSchema';

// import {syncConversationsToRealm} from '../Utils/realmhelper';
// import Header from '../Components/Header';
// import SearchBar from '../Components/Searchbar';
// import {useRealm} from '../Utils/realmcontext';
// import NetInfo from '@react-native-community/netinfo';
// const ChatScreen = ({navigation}) => {
//   const [searchText, setSearchText] = useState('');
//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(false);
//   // const [unreadCounts, setUnreadCounts] = useState({});
//   const [selectedChatId, setSelectedChatId] = useState(null);
//   const socket = getSocket();
//   const activeChatId = useSelector(state => state.chat.activeChatId);
//   const dispatch = useDispatch();
//   const realm = useRealm();

//   useEffect(() => {
//     const loadCachedConversations = () => {
//       const cachedConversations = realm
//         .objects('Conversation')
//         .sorted('updatedAt', true);
//       setChats([...cachedConversations]); // Display cached data instantly
//     };

//     loadCachedConversations(); // Load cached data
//   }, [realm]);
//   useEffect(() => {
//     const handleIncomingMessage = async data => {
//       console.log('New Incoming Message:', data);

//       if (data.conversationId) {
//         try {
//           realm.write(() => {
//             // Update the conversation if it exists
//             let existingConversation = realm.objectForPrimaryKey(
//               'Conversation',
//               data.conversationId,
//             );
//             const newMessage = {text: data.text};
//             if (existingConversation) {
//               existingConversation.lastText = newMessage;
//               existingConversation.updatedAt = new Date();
//               existingConversation.unreadCount =
//                 activeChatId === data.conversationId
//                   ? 0
//                   : (existingConversation.unreadCount || 0) + 1;
//             } else {

//               realm.create('Conversation', {
//                 _id: data.conversationId,
//                 senderId: data.senderId || '', // Provide default values if missing
//                 isDeleted: false,
//                 lastTextId: data.lastText?._id || null,
//                 unreadCount: 1,
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//                 receiverData: {
//                   _id: data.from || '', // Use `from` as the `_id` if `receiverData` is missing
//                   email: null, // Default value if email is missing
//                   phoneNumber: data.from || '', // Use `from` as the phone number
//                 },
//                 lastText: data.message
//                   ? {
//                       _id: data.message._id || '',
//                       text: data.message.text || '',
//                       conversationId: data.message.conversationId || '',
//                       to: data.message.to || '',
//                       from: data.message.from || '',
//                       type: data.message.type || 'text',
//                       IsIncoming: data.message.IsIncoming || true,
//                       textId: data.message.textId || '',
//                       status: data.message.status || '',
//                       createdAt: new Date(data.message.createdAt || Date.now()),
//                       updatedAt: new Date(data.message.updatedAt || Date.now()),
//                     }
//                   : null,
//               });
//             }
//           });
// console.log(updatedChats, 'updatedChats=====>');

//           const updatedChats = realm
//             .objects('Conversation')
//             .sorted('updatedAt', true);
//           setChats([...updatedChats]);
//         } catch (err) {
//           console.error('Error updating Realm on new message:', err);
//         }
//       }
//     };

//     socket.on('newIncomingMessage', handleIncomingMessage);

//     return () => {
//       socket.off('newIncomingMessage', handleIncomingMessage);
//     };
//   }, [activeChatId]);

//   const fetchChats = async () => {
//     setLoading(true);
//     try {
//       const netInfo = await NetInfo.fetch();
//       if (netInfo.isConnected) {
//         const token = await AsyncStorage.getItem('token');
//         const response = await fetch(
//           'http://192.168.1.62:6004/whatsapp/conversation?searchWith=all',
//           {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );

//         const data = await response.json();
//         console.log(data, 'response=====>');
//         if (data.success && Array.isArray(data.result.conversations)) {
//           await syncConversationsToRealm(realm, data.result.conversations);

//           const allConversations = realm
//             .objects('Conversation')
//             .sorted('updatedAt', true);
//           setChats([...allConversations]);
//         }
//       } else{
//         console.log('No internet connection. Displaying local data.');
//         const allConversations = realm
//           .objects('Conversation')
//           .sorted('updatedAt', true);
//         setChats([...allConversations]);

//       }
//     } catch (error) {
//       console.error('Error fetching chats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       fetchChats();
//     }, []),
//   );
//   const handleChatPress = async chat => {
//     const phoneNumber = Array.isArray(chat.receiverData)
//       ? chat.receiverData[0]?.phoneNumber
//       : chat.receiverData?.phoneNumber;
//     const id = chat?._id;

//     dispatch(setActiveChatId(id));
//     const profilePic = Array.isArray(chat.receiverData)
//       ? chat.receiverData[0]?.profilePic
//       : chat.receiverData?.profilePic;
//     // Reset unread count for this chat only

//     realm.write(() => {
//       const conv = realm.objectForPrimaryKey('Conversation', id);
//       if (conv) {
//         conv.unreadCount = 0;
//       }
//     });

//     navigation.navigate('ChatMessageScreen', {
//       chatName: phoneNumber,
//       id,
//       profilePic,
//       refreshChats: fetchChats,
//     });
//   };
//   const handleLongPress = (chatId) => {
//     setSelectedChatId(chatId);}
//     const handleDelete = async () => {
//       if (selectedChatId){
//         console.log('No chat selected for deletion.');

//         return;
//       }

//       // Optional: Confirmation Alert
//       Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const token = await AsyncStorage.getItem('token');
//               const response = await fetch(
//                 `http://192.168.1.62:6004/whatsapp/conversation/${selectedChatId}`,
//                 {
//                   method: 'DELETE',
//                   headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                   },
//                 },
//               );

//               const data = await response.json();

//               if (data.success) {
//                 // Remove from Realm
//                 realm.write(() => {
//                   const chatToDelete = realm.objectForPrimaryKey('Conversation', selectedChatId);
//                   if (chatToDelete) realm.delete(chatToDelete);
//                 });

//                 // Update state
//                 const updatedChats = realm.objects('Conversation').sorted('updatedAt', true);
//                 setChats([...updatedChats]);
//               }
//             } catch (error) {
//               console.error('Error deleting conversation:', error);
//             } finally {
//               setDeleteMode(false);
//               setSelectedChatId(null);
//             }
//           },
//         },
//       ]);
//     };

//   return (

//     <View style={styles.container}>
//     {/* Header */}
//     <Header title="Chats"
//     rightIcon={selectedChatId ? 'delete' : null} onRightIconPress={handleDelete}/>
//     <SearchBar value={searchText} onChangeText={setSearchText} />

//     {/* Conversation List */}
//     <FlatList
//       data={chats.filter(chat => {
//         if (Array.isArray(chat.receiverData)) {
//           return (
//             chat.receiverData.length > 0 &&
//             chat.receiverData[0]?.phoneNumber
//               ?.toLowerCase()
//               .includes(searchText.toLowerCase())
//           );
//         } else if (
//           chat.receiverData &&
//           typeof chat.receiverData === 'object'
//         ) {
//           return chat.receiverData.phoneNumber
//             ?.toLowerCase()
//             .includes(searchText.toLowerCase());
//         }
//         return false;
//       })}
//       keyExtractor={item => item._id}
//       // extraData={chats}
//       extraData={selectedChatId}
//       renderItem={({item}) => (
//         <ChatItem chat={item} onPress={() => handleChatPress(item)}   onLongPress={() => handleLongPress(item)} isSelected={selectedChatId === item._id}  // Highlight selected chat
//  />
//       )}
//     />
//   </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   header: {
//     height: 60,
//     backgroundColor: '#075E54',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     elevation: 4,
//     marginBottom: 10,
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   headerIcons: {
//     flexDirection: 'row',
//   },
//   icon: {
//     marginLeft: 16,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     marginHorizontal: 8,
//     marginTop: 8,
//     paddingHorizontal: 10,
//     borderRadius: 20,
//     elevation: 2,
//     marginBottom: 10,
//   },
//   searchIcon: {
//     marginRight: 6,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default ChatScreen;
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Vibration,
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
import { SwipeListView } from 'react-native-swipe-list-view';
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
  const [selectedChat, setSelectedChat] = useState(null);
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
 
  const handleDeleteChat = async () => {
    if (!selectedChat) return;

    // Optional: Confirmation Alert
    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(
              `http://192.168.1.62:6004/whatsapp/conversation/${selectedChat._id}`,
              {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            const data = await response.json();

            if (data.success) {
              // Remove from Realm
              realm.write(() => {
                const chatToDelete = realm.objectForPrimaryKey(
                  'Conversation',
                  selectedChat._id,
                );
                if (chatToDelete) realm.delete(chatToDelete);
              });

              // Update state
              const updatedChats = realm
                .objects('Conversation')
                .sorted('updatedAt', true);
              setChats([...updatedChats]);
            }
          } catch (error) {
            console.error('Error deleting conversation:', error);
          } finally {
            setSelectedChat(null);
          }
        },
      },
    ]);
  };

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
                  if (existingConversation.unreadCount > 0) {
                    Vibration.vibrate(500); // Vibrate for 500ms
                  }
            } else {
              realm.create('Conversation', {
                _id: data.conversationId,
                senderId: data.senderId || '', // Provide default values if missing
                isDeleted: false,
                lastTextId: data.lastText?._id || null,
                unreadCount: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                receiverData: {
                  _id: data.from || '', // Use `from` as the `_id` if `receiverData` is missing
                  email: null, // Default value if email is missing
                  phoneNumber: data.from || '', // Use `from` as the phone number
                },
                lastText: data.message
                  ? {
                      _id: data.message._id || '',
                      text: data.message.text || '',
                      conversationId: data.message.conversationId || '',
                      to: data.message.to || '',
                      from: data.message.from || '',
                      type: data.message.type || 'text',
                      IsIncoming: data.message.IsIncoming || true,
                      textId: data.message.textId || '',
                      status: data.message.status || '',
                      createdAt: new Date(data.message.createdAt || Date.now()),
                      updatedAt: new Date(data.message.updatedAt || Date.now()),
                    }
                  : null,
              });
            }
          });
          Vibration.vibrate(500); // Vibrate for 500ms
         

          const updatedChats = realm
            .objects('Conversation')
            .sorted('updatedAt', true);
          setChats([...updatedChats]);
          // setTimeout(() => {
          //   fetchChats();
          // }, 3000); // Delay of 1 second before fetching chats again
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
        console.log(token, 'token=====>');
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
      } else {
        console.log('No internet connection. Displaying local data.');
        const allConversations = realm
          .objects('Conversation')
          .sorted('updatedAt', true);
        setChats([...allConversations]);
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
    if (selectedChat) {
      // If a chat is selected, clear the selection
      setSelectedChat(null);
      return;
    }
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
  const handleScreenPress = () => {
    // Clear the selected chat when the user taps anywhere on the screen
    if (selectedChat) {
      setSelectedChat(null);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View style={styles.container}>
  
        <Header
          title="Chats"
          //  // Handle delete action
        />
        <SearchBar value={searchText} onChangeText={setSearchText} />



      <SwipeListView
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
  renderItem={({ item }) => (
    <ChatItem
      chat={item}
      onPress={() => handleChatPress(item)} // Navigate to chat screen
      isSelected={selectedChat?._id === item._id} // Highlight only if swiped
    />
  )}
  renderHiddenItem={({ item }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteChat(item._id)} // Delete the swiped chat
      >
        <Icon name="delete" size={24} color="red" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  )}
  rightOpenValue={-75} // Swipe distance to reveal delete button
  disableRightSwipe={true} // Prevent right swipe
  closeOnRowPress={true} // Close row when pressed
  onRowOpen={(rowKey, rowMap) => {
    const chat = chats.find(chat => chat._id === rowKey);
    setSelectedChat(chat); // Set the swiped chat as selected
  }}
  closeOnRowOpen={true} // Close other rows when a new one is swiped
/>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: '100%',
  },
  deleteText: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
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
