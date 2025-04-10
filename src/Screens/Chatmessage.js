import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../Components/Custominput';
import Realm from 'realm';
// import { getSocket } from '../Services/socket';
import {useFocusEffect} from '@react-navigation/native';

import ImageCropPicker from 'react-native-image-crop-picker';
import {getSocket} from '../Services/socket';
import {clearActiveChatId} from '../Redux/chatSlice';
import {useDispatch} from 'react-redux';
import {syncMessagesToRealm, upsertMessageToRealm} from '../Utils/realmhelper';
import {getRealm} from '../Utils/Database';
import RenderMessage from '../Components/Rendermessge';
import TemplateItem from '../Components/Templateitem';
import { log } from 'console';
import { parseTemplates } from '../Components/Parsetemplate';

const ChatMessageScreen = ({route, navigation}) => {
  const {chatName, id, profilePic} = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
const [templates, setTemplates] = useState([]);
const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        console.log(id, 'Clearing active chat ID on back or gesture');

        dispatch(clearActiveChatId());
      
      };
    }, [id]),
  );
  const togglePopup = () => {
    setPopupVisible(prev => !prev);
  };
  const pickImage = fieldName => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        const imageObj = {
          uri: image.path,
          name: image.filename || 'uploaded_image.jpg',
          type: image.mime,
        };
        setSelectedImage(imageObj); // Save image for preview
        handleChange(fieldName, imageObj); // Optional if form-based
      })
      .catch(e => {
        console.log('Image pick cancelled or error:', e);
      });
  };
  
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
          IsChatbot:msg.IsChatbot,
          chatBotMessage: msg.chatBotMessage ? JSON.parse(msg.chatBotMessage) : null,
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

  const handleSend = async () => {
    if (!message.trim() && !selectedTemplate) return;
  
    const tempId = Date.now().toString();
    const isTemplate = !!selectedTemplate;
  
    const newMessage = {
      id: tempId,
      text: isTemplate ? selectedTemplate.body : message,
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
  
      // Common payload base
      const payload = {
        to: [chatName],
        type: isTemplate ? 'template' : 'text',
      };
  
      // Add content depending on type
      if (isTemplate) {
     payload.template_name = selectedTemplate.name;
      } else {
        payload.text = { body: message };
      }
  
      const res = await axios.post(
        'http://192.168.1.62:6004/whatsapp/send-message',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const { textId } = res.data.result || {};
      if (textId) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === tempId ? { ...msg, id: textId } : msg
          )
        );
      }
  
      setMessage('');
      setSelectedTemplate(null); // clear template after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // const handleSend = async () => {
  //   if (message.trim()) {
  //     const tempId = Date.now().toString();
  //     const newMessage = {
  //       id: tempId,
  //       text: message,
  //       IsIncoming: false,
  //       status: 'message_sent',
  //       updatedAt: new Date().toISOString(),
  //     };
  //     setMessages(prevMessages => [newMessage, ...prevMessages]);

  //     try {
  //       const token = await AsyncStorage.getItem('token');
  //       if (!token) {
  //         console.error('No token found');
  //         return;
  //       }

  //       const payload = {
  //         to: [chatName],
  //         type: 'text',
  //         text: {body: message},
  //       };

  //       const res = await axios.post(
  //         'http://192.168.1.62:6004/whatsapp/send-message',
  //         payload,
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${token}`,
  //           },
  //         },
  //       );

  //       const {textId} = res.data.result || {};
  //       if (textId) {
  //         setMessages(prevMessages =>
  //           prevMessages.map(msg =>
  //             msg.id === tempId ? {...msg, id: textId} : msg,
  //           ),
  //         );
  //       }

  //       setMessage('');
  //     } catch (error) {
  //       console.error('Error sending message:', error);
  //     }
  //   }
  // };
 
const fetchTemplates = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.get('http://192.168.1.62:6004/whatsapp/template-meta', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 👉 Make sure templates are inside `result.templates`
    if (response.data.success && Array.isArray(response.data.result)) {
      const parsed = parseTemplates({ result: response.data.result }); 
      console.log(parsed, 'Parsed templates:');
      
      setTemplates(parsed); // assumes setTemplates is in your scope
    } else {
      console.warn('Unexpected template structure:', response.data);
    }
  } catch (error) {
    console.error('Error fetching templates:', error);
  }
};
  
  const handleTemplatesPress = () => {
    setTemplatesVisible(prev => !prev);
    if (!templatesVisible) {
      fetchTemplates();
    }
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


    const handleStatusUpdate = data => {
      console.log('Status Update Event:', data);

      setMessages(prevMessages =>
        prevMessages.map(msg => {
     
          return {...msg, status: data.status};
          
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
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    <TouchableWithoutFeedback
      onPress={() => {
        setPopupVisible(false);
        setTemplatesVisible(false);
        Keyboard.dismiss();
      }}
    >
    <View style={styles.container}>
      {/* Header with Back Button and Chat Name */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => handleBackPress()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {profilePic ? (
          <Image
            source={{ uri: profilePic }}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }}
          />
        ) : (
          <Icon name="account-circle" size={36} color="#888" style={{ marginRight: 10 }} />
        )}
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
            // renderItem={renderMessage}
            renderItem={({ item }) => <RenderMessage item={item}/>}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            extraData={messages}
            inverted
          />

          <View style={styles.inputContainer}>
          <TouchableOpacity onPress={togglePopup} style={styles.plusButton}>
    <Icon name="add" size={28} color="#075E54" />
  </TouchableOpacity>
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
      {popupVisible && (
  <View style={styles.popupMenu}>
    <TouchableOpacity style={styles.popupItem}  onPress={() => pickImage('photo')}>
      <Icon name="image" size={20} color="#075E54" />
      <Text style={styles.popupText}>Photo</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.popupItem}>
      <Icon name="insert-drive-file" size={20} color="#075E54" />
      <Text style={styles.popupText}>Document</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.popupItem}>
      <Icon name="contacts" size={20} color="#075E54" />
      <Text style={styles.popupText}>Contact</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.popupItem} onPress={handleTemplatesPress}>
  <Icon name="view-list" size={20} color="#075E54" />
  <Text style={styles.popupText}>Templates</Text>
</TouchableOpacity>
  </View>
)}

{templatesVisible && (
  <View style={styles.templatesContainer}>
    <View style={styles.templatesHeader}>
      <Text style={styles.templatesTitle}>Templates</Text>
      <TouchableOpacity onPress={() => setTemplatesVisible(false)}>
        <Icon name="close" size={22} color="#000" />
      </TouchableOpacity>
    </View>
    <FlatList
      data={templates}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TemplateItem
        item={item}
        onSelect={(template) => {
          setSelectedTemplate(template); // full object
          setMessage(template.name);     // show template text
          setTemplatesVisible(false);
        }}
      />
      )}
    />
  </View>
)}

{selectedImage && (
  <View style={styles.previewContainer}>
    <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
    <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.closeButton}>
      <Icon name="close" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
)}


    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  popupMenu: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  previewContainer: {
    position: 'relative',
    margin: 10,
    alignSelf: 'flex-start',
  },
 
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  
  closeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  popupText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#075E54',
  },
  plusButton: {
    padding: 2,
    marginBottom: 16,
  },
  templatesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  
  templatesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  
  templatesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  
  showListButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#34B7F1',
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderTopWidth:1
  },
  showListButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
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
  headerImage: {
    width: 200,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode:'center'
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  documentButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 6,
    marginBottom: 8,
  },
  documentText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  button: {
    padding: 8,
    backgroundColor: '#E0F7FA',
    borderRadius: 6,
    marginTop: 4,
  },
  buttonText: {
    color: '#00796B',
    fontWeight: '600',
  },
});

export default ChatMessageScreen;
