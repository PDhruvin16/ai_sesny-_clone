import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { syncConversationsToRealm } from '../../Utils/realmhelper';
// import { syncConversationsToRealm } from '../Utils/realmhelper';

export const fetchChats = async (realm, setChats, setLoading) => {
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

export const handleIncomingMessage = async (
  data,
  realm,
  activeChatId,
  setChats,
) => {
  if (data.conversationId) {
    try {
      realm.write(() => {
        let existingConversation = realm.objectForPrimaryKey(
          'Conversation',
          data.conversationId,
        );
        const newMessage = { text: data.text };
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
            senderId: data.senderId || '',
            isDeleted: false,
            lastTextId: data.lastText?._id || null,
            unreadCount: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            receiverData: {
              _id: data.from || '',
              email: null,
              phoneNumber: data.from || '',
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

      const updatedChats = realm
        .objects('Conversation')
        .sorted('updatedAt', true);
      setChats([...updatedChats]);
    } catch (err) {
      console.error('Error updating Realm on new message:', err);
    }
  }
};

export const handleDeleteChat = async (chatId, realm, setChats) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(
      `http://192.168.1.62:6004/whatsapp/conversation/${chatId}`,
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
      realm.write(() => {
        const chatToDelete = realm.objectForPrimaryKey('Conversation', chatId);
        if (chatToDelete) realm.delete(chatToDelete);
      });

      const updatedChats = realm.objects('Conversation').sorted('updatedAt', true);
      setChats([...updatedChats]);
    }
  } catch (error) {
    console.error('Error deleting conversation:', error);
  }
};