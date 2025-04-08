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
import Realm from 'realm';
// import { getSocket } from '../Services/socket';
import {useFocusEffect} from '@react-navigation/native';

import {getSocket} from '../Services/socket';
import {clearActiveChatId} from '../Redux/chatSlice';
import {useDispatch} from 'react-redux';
import {syncMessagesToRealm, upsertMessageToRealm} from '../Utils/realmhelper';
import {getRealm} from '../Utils/Database';

const ChatMessageScreen = ({route, navigation}) => {
  const {chatName, id} = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ws, setWs] = useState(null);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        console.log(id, 'Clearing active chat ID on back or gesture');

        dispatch(clearActiveChatId());
        // Clear active chat ID on blur
      };
    }, [id]),
  );

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

      if (
        response.data.success &&
        Array.isArray(response.data.result.textData)
        // Log the fetched messages
      ) {
        console.log('Fetched messages:', response.data.result.textData);
        // First sync to Realm
        await syncMessagesToRealm(response.data.result.textData);

        // Now read messages from Realm
        const realm = await getRealm();
        const realmMessages = realm
          .objects('Message')
          .filtered('conversationId == $0', id)
          .sorted('createdAt', true); // true = descending

        // Convert to JS array
        const messagesArray = realmMessages.map(msg => ({
          id: msg._id,
          text: msg.text,
          IsIncoming: msg.IsIncoming,
          from: msg.from,
          to: msg.to,
          status: msg.status,
          updatedAt: msg.updatedAt,
        }));
        console.log('Messages from Realm:', messagesArray);
        setMessages(messagesArray);
      } else {
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // const handleSend = async () => {
  //   if (message.trim()) {
  //     const newMessage = {id: Date.now().toString(), text: message, sent: true};
  //     setMessages(prevMessages => [newMessage, ...prevMessages]);

  //     try {
  //       const token = await AsyncStorage.getItem('token');
  //       if (!token) {
  //         console.error('No token found');
  //         return;
  //       }

  //       let payload = {
  //         to: [chatName], // chatName is passed from ChatScreen as the recipient's phone number
  //         type: 'text',

  //         text: {
  //           body: message,
  //         },
  //       };

  //       console.log('Payload ===>>>', payload);

  //       // Use the correct endpoint URL without additional parameters
  //       const endpointUrl = 'http://192.168.1.62:6004/whatsapp/send-message';

  //       await axios.post(endpointUrl, payload, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setMessage('');
  //     } catch (error) {
  //       console.error('Error sending message:', error);
  //     }
  //   }
  // };
  const handleSend = async () => {
    if (message.trim()) {
      const tempId = Date.now().toString();
      const newMessage = {
        id: tempId,
        text: message,
        IsIncoming: false,
        status: 'message_sent',
        updatedAt: new Date().toISOString(),
      };
      setMessages(prevMessages => [newMessage, ...prevMessages]);

      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const payload = {
          to: [chatName],
          type: 'text',
          text: {body: message},
        };

        const res = await axios.post(
          'http://192.168.1.62:6004/whatsapp/send-message',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const {textId} = res.data.result || {};
        if (textId) {
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === tempId ? {...msg, id: textId} : msg,
            ),
          );
        }

        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderMessage = ({item}) => {
    let header = '';
    let body = '';
    let footer = '';
    let buttons = [];
    let messageText = 'Message not available';

    const formatTime = timestamp => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    const getStatusIcon = status => {
      if (status?.startsWith('Error')) {
        return (
          <Icon
            name="error-outline"
            size={16}
            color="red"
            style={styles.statusIcon}
          />
        );
      }
      switch (status) {
        case 'message_delivered':
          return (
            <Icon
              name="done-all"
              size={16}
              color="#888"
              style={styles.statusIcon}
            />
          );
        case 'message_read':
          return (
            <Icon
              name="done-all"
              size={16}
              color="#34B7F1"
              style={styles.statusIcon}
            />
          );
        default:
          return (
            <Icon
              name="done"
              size={16}
              color="#888"
              style={styles.statusIcon}
            />
          );
      }
    };

    // 🧠 If outgoing message and possibly templated
    if (!item.IsIncoming && item.text) {
      let parsedText = item.text;

      if (typeof item.text === 'string') {
        try {
          parsedText = JSON.parse(item.text);
        } catch (e) {
          // console.log('❌ Failed to parse item.text:', item.text);
          parsedText = null;
        }
      }
      // parsedText = item.text
      if (parsedText?.components) {
        parsedText.components.forEach(component => {
          switch (component.type) {
            case 'HEADER':
              header = component.text || '';
              break;
            case 'BODY':
              body = component.text || '';
              if (parsedText.variables) {
                parsedText.variables.forEach((val, idx) => {
                  const placeholder = `{{${idx + 1}}}`;
                  body = body.replace(placeholder, val);
                });
              }
              break;
            case 'FOOTER':
              footer = component.text || '';
              break;
            case 'BUTTONS':
              buttons = component.buttons || [];
              break;
          }
        });

        messageText = [header, body, footer].filter(Boolean).join('\n\n');
      } else {
        messageText =
          typeof item.text === 'string' ? item.text : 'Message not available';
      }
    } else {
      // 📨 Incoming message — normal text
      messageText = item.text ?? 'Message not available';
    }

    const messageTime = item.updatedAt ? formatTime(item.updatedAt) : '';

    return (
      <View
        style={[
          styles.messageContainer,
          item.IsIncoming ? styles.received : styles.sent,
        ]}>
        <Text style={styles.messageText}>{messageText}</Text>

        {/* Template buttons if any */}
        {buttons.map((btn, index) => (
          <TouchableOpacity
            key={index}
            style={styles.messageText}
            onPress={() => btn.url && Linking.openURL(btn.url)}>
            <Text style={styles.buttonText}>{btn.text}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.statusContainer}>
          <Text style={styles.messageTime}>{messageTime}</Text>
          {!item.IsIncoming && getStatusIcon(item.status)}
        </View>
      </View>
    );
  };

  useEffect(() => {
    const socket = getSocket();

    const handleNewMessage = async data => {
      console.log('New Incoming Message:', data);

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
          await upsertMessageToRealm(newMessage);

          console.log('✅ Message saved to Realm:', newMessage);
        } catch (err) {
          console.error('Error saving message to Realm:', err);
        }

        setMessages(prevMessages => [newMessage, ...prevMessages]);
      }
    };

    // const handleStatusUpdate = data => {
    //   console.log('Status Update Event:', data);

    //   setMessages(prevMessages =>
    //     prevMessages.map(msg => {
    //       const match = msg.id?.toString() === data._id?.toString();
    //       if (match) {
    //         console.log('✅ Status updated for:', msg.id, 'to', data.status);
    //         return {...msg, status: data.status};
    //       }
    //       return msg;
    //     }),
    //   );
    // };
    const handleStatusUpdate = data => {
      console.log('Status Update Event:', data);

      setMessages(prevMessages =>
        prevMessages.map(msg => {
          // const isSameId = msg.id?.toString() === data._id?.toString(); // ✅ Compare updated IDs
          // console.log(
          //   'Matching:',
          //   msg.id,
          //   'with',
          //   data._id,
          //   'sdasdasdasd []szdklzdmlkszdmflkldzf',
          //   msg.id?.toString() === data._id?.toString(),
          //   data._id?.toString(),
          //   msg.id?.toString(),
          // );
          // if (isSameId) {
          //   console.log('✅ Status updated for:', msg.id, 'to', data.status);
          return {...msg, status: data.status};
          // } else {
          //   return {...msg, status: data.status};
          // }
          // return msg;
        }),
      );
    };
    socket.on('newIncomingMessage', handleNewMessage);
    socket.on('UpdateStatusEvent', handleStatusUpdate);

    return () => {
      socket.off('newIncomingMessage', handleNewMessage);
      socket.off('UpdateStatusEvent', handleStatusUpdate);
    };
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
            extraData={messages}
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
