import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../Components/Custominput';

// import { getSocket } from '../Services/socket';
import {useFocusEffect} from '@react-navigation/native';

import {getSocket} from '../Services/socket';
import {clearActiveChatId} from '../Redux/chatSlice';
import { useDispatch } from 'react-redux';

const ChatMessageScreen = ({route, navigation}) => {
  const {chatName, id} = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ws, setWs] = useState(null);
const dispatch =useDispatch();

useFocusEffect(
  React.useCallback(() => {
    return () => {
      console.log(id, 'Clearing active chat ID on back or gesture');
      dispatch(clearActiveChatId()); // Clear active chat ID on blur
    };
  }, [id])
);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
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

        console.log('Fetched messages:', response.data);

        if (
          response.data.success &&
          Array.isArray(response.data.result.textData)
        ) {
          // Map API response to a simplified message list
          const formattedMessages = response.data.result.textData.map(msg => ({
            id: msg._id,
            text: msg.text,
            IsIncoming: msg.IsIncoming,
            from: msg.from,
            to: msg.to,
            status: msg.status,
            updatedAt: msg.updatedAt,
          }));

          setMessages(formattedMessages);
        } else {
          console.error('Data is not in the expected format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (message.trim()) {
      const newMessage = {id: Date.now().toString(), text: message, sent: true};
      setMessages(prevMessages => [newMessage, ...prevMessages]);

      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        let payload = {
          to: [chatName], // chatName is passed from ChatScreen as the recipient's phone number
          type: 'text',

          text: {
            body: message,
          },
        };

        console.log('Payload ===>>>', payload);

        // Use the correct endpoint URL without additional parameters
        const endpointUrl = 'http://192.168.1.62:6004/whatsapp/send-message';

        await axios.post(endpointUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  const renderMessage = ({item}) => {
    let messageText = 'Message not available';
    const formatTime = timestamp => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };
  
    // Define status icon based on message status
    const getStatusIcon = status => {
      switch (status) {
        case 'message_delivered':
          return (
            <Icon
              name="done-all"
              size={16}
              color="#888" // Gray color for delivered
              style={styles.statusIcon}
            />
          );
        case 'message_read':
          return (
            <Icon
              name="done-all"
              size={16}
              color="#34B7F1" // Blue color for read
              style={styles.statusIcon}
            />
          );
        default:
          return (
            <Icon
              name="done"
              size={16}
              color="#888" // Gray color for sent (single tick)
              style={styles.statusIcon}
            />
          );
      }
    };
    
  
    if (item.IsIncoming) {
      messageText = item.text ?? 'Message not available';
    } else {
      if (typeof item.text === 'string') {
        messageText = item.text;
      } else if (item.text && Array.isArray(item.text.components)) {
        const bodyComponent = item.text.components.find(
          component => component.type === 'BODY',
        );
        messageText = bodyComponent ? bodyComponent.text : 'Message not available';
  
        if (item.text.variables) {
          item.text.variables.forEach((variable, index) => {
            const placeholder = `{{${index + 1}}}`;
            messageText = messageText.replace(placeholder, variable);
          });
        }
      }
    }
  
    const messageTime = item.updatedAt ? formatTime(item.updatedAt) : '';
  
    return (
      <View
        style={[
          styles.messageContainer,
          item.IsIncoming ? styles.received : styles.sent,
        ]}>
        <Text style={styles.messageText}>{messageText}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.messageTime}>{messageTime}</Text>
          {!item.IsIncoming && getStatusIcon(item.status)}
        </View>
      </View>
    );
  };
  
  
  // const renderMessage = ({item}) => {
  //   let messageText = 'Message not available';
  //   const formatTime = timestamp => {
  //     const date = new Date(timestamp);
  //     return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  //   };

  //   if (item.IsIncoming) {
  //     messageText = item.text ?? 'Message not available';
  //   } else {
  //     // Outgoing message: check if text is a string or an object
  //     if (typeof item.text === 'string') {
  //       messageText = item.text;
  //     } else if (item.text && Array.isArray(item.text.components)) {
  //       const bodyComponent = item.text.components.find(
  //         component => component.type === 'BODY',
  //       );
  //       messageText = bodyComponent
  //         ? bodyComponent.text
  //         : 'Message not available';

  //       if (item.text.variables) {
  //         item.text.variables.forEach((variable, index) => {
  //           const placeholder = `{{${index + 1}}}`;
  //           messageText = messageText.replace(placeholder, variable);
  //         });
  //       }
  //     }
  //   }

  //   const messageTime = item.updatedAt ? formatTime(item.updatedAt) : '';

  //   return (
  //     <View
  //       style={[
  //         styles.messageContainer,
  //         item.IsIncoming ? styles.received : styles.sent,
  //       ]}>
  //       <Text style={styles.messageText}>{messageText}</Text>
  //       <Text style={styles.messageTime}>{messageTime}</Text>
  //     </View>
  //   );
  // };
  useEffect(() => {
    const socket = getSocket();
    // Listen for new incoming messages
    socket.on('newIncomingMessage', data => {
      console.log('New Incoming Message:', data);

      if (data.conversationId === id) {
        const newMessage = {
          id: data.textId || Date.now().toString(),
          text: data.text || 'Message not available',
          IsIncoming: true,
          updatedAt: data.updatedAt || new Date().toISOString(),
          status: data.status || 'message_sent',
        };
        setMessages(prevMessages => [newMessage, ...prevMessages]);
      } else {
        console.log('Message does not belong to this conversation');
      }
    });

  
  socket.on('UpdateStatusEvent', data => {
    console.log('Status Update Event:', data);
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === data._id ? {...msg, status: data.status} : msg,
      ),
    );
  });
    return ()=> {
socket.off('UpdateStatusEvent');
    }
  }, [id]);
  const handleBackPress = () => {
    console.log(id, 'jkghjklbhuilyijkn kjhihjhbj');
    dispatch(clearActiveChatId(id)); // Clear active chat ID
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Chat Name */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => handleBackPress()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{chatName}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#075E54" />
        </View>
      ) : (
        <>
          <FlatList
            data={messages}
            keyExtractor={item => item.id.toString()}
            renderItem={renderMessage}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            inverted
          />

          <View style={styles.inputContainer}>
            <CustomInput
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Icon name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  messageStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickIcon: {
    marginLeft: 4,
  },
  header: {
    height: 60,
    backgroundColor: '#075E54',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    elevation: 4,
  },
  backButton: {
    marginRight: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageListContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 10,
    borderRadius: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },

  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
    elevation: 4,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 8,
    paddingVertical: 5,
  },
  sendButton: {
    backgroundColor: '#075E54',
    padding: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
});

export default ChatMessageScreen;
