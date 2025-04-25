// import { syncMessagesToRealm, upsertMessageToRealm } from '../Utils/realmhelper';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { syncConversationsToRealm, syncMessagesToRealm, upsertMessageToRealm } from '../../Utils/realmhelper';

export const fetchMessages = async (realm, id, setMessages) => {
  try {
    const netInfo = await NetInfo.fetch(); // Check network connectivity
    if (netInfo.isConnected) {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(
        `http://192.168.1.62:6004/whatsapp/conversation/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success && Array.isArray(response.data.result.textData)) {
        console.log('Fetched messages from API:', response.data.result.textData);

        // Sync messages to Realm
        await syncMessagesToRealm(realm, response.data.result.textData);

        // Update the UI with the latest messages
        const updatedMessages = realm
          .objects('Message')
          .filtered('conversationId == $0', id)
          .sorted('createdAt', true);
        const messagesArray = updatedMessages.map(msg => ({
          id: msg._id,
          text: msg.text,
          mediaUrl: msg.mediaUrl,
          type: msg.type,
          IsIncoming: msg.IsIncoming,
          IsChatbot: msg.IsChatbot,
          chatBotMessage: msg.chatBotMessage
            ? JSON.parse(msg.chatBotMessage)
            : null,
          from: msg.from,
          to: msg.to,
          status: msg.status,
          updatedAt: msg.updatedAt,
        }));
        setMessages(messagesArray);
      } else {
        console.error('Unexpected data format:', response.data);
      }
    } else {
      console.log('No internet connection. Loading messages from Realm...');
      const cachedMessages = realm
        .objects('Message')
        .filtered('conversationId == $0', id)
        .sorted('createdAt', true);
      const messagesArray = cachedMessages.map(msg => ({
        id: msg._id,
        text: msg.text,
        mediaUrl: msg.mediaUrl,
        type: msg.type,
        IsIncoming: msg.IsIncoming,
        IsChatbot: msg.IsChatbot,
        chatBotMessage: msg.chatBotMessage
          ? JSON.parse(msg.chatBotMessage)
          : null,
        from: msg.from,
        to: msg.to,
        status: msg.status,
        updatedAt: msg.updatedAt,
      }));
      setMessages(messagesArray);
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

export const handleNewMessage = async (data, id, realm, setMessages, fetchMessages) => {
  if (data.conversationId === id) {
    const newMessage = {
      id: data.textId || Date.now().toString(),
      text: data.text || 'Message not available',
      IsIncoming: data.IsIncoming,
      updatedAt: data.updatedAt || new Date().toISOString(),
      status: data.status,
    };
    console.log('Message not saved to Realm:', newMessage);

    try {
      await upsertMessageToRealm(realm, newMessage);
      console.log('✅ Message saved to Realm:', newMessage);
      fetchMessages(); // Refresh messages
    } catch (err) {
      console.error('Error saving message to Realm:', err);
    }

    setMessages(prevMessages => [newMessage, ...prevMessages]);
  }
};

export const handleStatusUpdate = (data, setMessages) => {
  console.log('Status Update Event:', data);

  setMessages(prevMessages =>
    prevMessages.map(msg => {
      return { ...msg, status: data.status };
    }),
  );
};