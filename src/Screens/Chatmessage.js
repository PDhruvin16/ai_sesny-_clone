import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
} from 'react-native';
import {keepLocalCopy, pick, types} from '@react-native-documents/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {clearActiveChatId} from '../Redux/chatSlice';
import {useDispatch} from 'react-redux';
import {syncMessagesToRealm, upsertMessageToRealm} from '../Utils/realmhelper';
// import {getRealm} from '../Utils/Database';
import TemplateItem from '../Components/Templateitem';
import {parseChatbots, parseTemplates} from '../Components/Parsetemplate';
import {getSocket} from '../Services/socket';
import PopupMenu from '../Components/Message/poupmenu';
import Header from '../Components/Header';
import MessageList from '../Components/Message/Messagelist';
import MessageInput from '../Components/Message/messagInput';
import MediaPreview from '../Components/Message/Mediapreview';
import ChatbotItem from '../Components/chatbotitem';
import { useRealm } from '../Utils/realmcontext';
import NetInfo from '@react-native-community/netinfo';
const ChatMessageScreen = ({route, navigation}) => {
  const {chatName, id, profilePic} = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [chatbotVisible, setchatbotVisible] = useState(false);
  const [chatbotData, setChatbotData] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);

const realm = useRealm();  
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        console.log(id, 'Clearing active chat ID on back or gesture');

        dispatch(clearActiveChatId());
      };
    }, [id]),
  );
  useEffect(() => {
    const loadCachedMessages = () => {
      const cachedMessages = realm
        .objects('Message')
        .filtered('conversationId == $0', id)
        .sorted('createdAt', true); // true = descending order
      const newMessageArray = cachedMessages.map(msg => ({
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
      setMessages(newMessageArray); // Display cached messages instantly
    };

    loadCachedMessages(); 
  },[realm,id]);
  const pickAudio = async () => {
    try {
      const result = await pick({
        type: [
          'audio/mpeg', 'audio/mp3', 'audio/aac', 'audio/mp4',
          'audio/amr', 'audio/ogg', 'audio/*',
        ],
        allowMultiSelection: false,
      });
  
      if (result?.length > 0) {
        const file = result[0];
  
        const [localCopy] = await keepLocalCopy({
          files: [
            {
              uri: file.uri,
              fileName: file.name ?? 'audio.mp3',
            },
          ],
          destination: 'documentDirectory',
        });
  
        const fileObj = {
          uri: localCopy.localUri,
          name: file.name,
          type: file.type,
        };
  
        setSelectedImage(null);
        setSelectedVideo(null);
        setSelectedDocument(null);
        setSelectedAudio(fileObj);
        setMessage('[Audio selected]');
        console.log('🎵 Audio ready:', fileObj);
      } else {
        console.log('No audio selected');
      }
    } catch (err) {
      if (err?.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('User cancelled audio picking');
      } else {
        console.error('Audio Picker Error:', err);
      }
    }
  };
  
  const pickDocument = async () => {
    try {
      const result = await pick({
        type: [types.pdf, types.doc, types.docx, types.xls, types.xlsx],
        allowMultiSelection: false,
      });

      if (result?.length > 0) {
        const file = result[0];

        // ✅ Save a local copy (important for Android content:// URIs)
        const [localCopy] = await keepLocalCopy({
          files: [
            {
              uri: file.uri,
              fileName: file.name ?? 'document.pdf',
            },
          ],
          destination: 'documentDirectory', // or 'cacheDirectory' if you prefer
        });
        console.log('Local copy:', localCopy);

        const fileObj = {
          uri: localCopy.localUri, // ✅ Now this will be a file:// URI
          name: file.name,
          type: file.type,
        };

        setSelectedImage(null);
        setSelectedVideo(null);
        setSelectedDocument(fileObj);
        setMessage('[Document selected]');
        console.log('📄 Local file ready for upload:', fileObj);
      } else {
        console.log('No document selected');
      }
    } catch (err) {
      if (err?.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('User cancelled document picking');
      } else {
        console.error('Document Picker Error:', err);
      }
    }
  };
  const pickImage = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      // cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        const imageObj = {
          uri: image.path,
          name: image.filename,
          type: image.mime,
        };
        setSelectedVideo(null);
        setSelectedImage(imageObj);
        setMessage('[Image selected]'); // Show placeholder in TextInput
      })
      .catch(e => {
        console.log('Image pick cancelled or error:', e);
      });
  };

  const pickVideo = () => {
    ImageCropPicker.openPicker({
      mediaType: 'video',
    })
      .then(video => {
        const videoObj = {
          uri: video.path,
          name: video.filename || 'uploaded_video.mp4',
          type: video.mime || 'video/mp4',
        };
        setSelectedImage(null);
        setSelectedVideo(videoObj);
        setMessage('[Video selected]');
      })
      .catch(e => {
        console.log('Video pick cancelled or error:', e);
      });
  };
  const fetchMessages = async () => {
    try {
      const netInfo = await NetInfo.fetch(); // Check network connectivity
      if (netInfo.isConnected) {
        // If connected, fetch messages from the API
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
        ) {
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
        // If not connected, load messages from Realm
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


  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (
      !message.trim() &&
      !selectedTemplate &&
      !selectedImage &&
      !selectedVideo &&
      !selectedDocument &&
      !selectedAudio &&
      !chatbotData
    )
      return;

    const tempId = Date.now().toString();
    const isTemplate = !!selectedTemplate;
    const isVideo = !!selectedVideo;
    const isImage = !!selectedImage;
    const isDocument = !!selectedDocument;
    const isAudio = !!selectedAudio;
    const isChatbot = !!selectedChatbot;

    const newMessage = {
      id: tempId,
     
      text: isTemplate
        ? selectedTemplate.body
        : isChatbot
        ? selectedChatbot.name
        : isImage || isVideo || isDocument || isAudio
        ? ''
        : message,
      image: isImage ? selectedImage : null,
      video: isVideo ? selectedVideo : null,
      audio:isAudio?  selectedAudio:null,
      document: isDocument ? selectedDocument : null, // <-- add this
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

      // const url = 'http://192.168.1.62:6004/whatsapp/send-message';
      const url = isChatbot
      ? 'http://192.168.1.62:6004/whatsapp/sendChatbot'
      : 'http://192.168.1.62:6004/whatsapp/send-message';
      let headers = {
        Authorization: `Bearer ${token}`,
      };
      let data;

      
      if (isTemplate || isChatbot || (!isImage && !isVideo && !isDocument && !isAudio)) {
     
        data = {
          to: isChatbot ? chatName : [chatName],
        };
        if (isTemplate) {
          data.type = 'template';
          data.template_name = selectedTemplate.name;
        } else if (isChatbot) {
          data.chatbot_name = selectedChatbot.name;
        } else {
          data.type = 'text';
          data.text = { body: message };
        }
        headers['Content-Type'] = 'application/json';
        console.log('Payload:', data);
       
        const res = isChatbot
        ? await axios.post(url, data, { headers }) 
        : await axios.post(url, JSON.stringify(data), { headers }); 
console.log('Response:', res.data);

        const {textId} = res.data.result || {};
        if (textId) {
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === tempId ? {...msg, id: textId} : msg,
            ),
          );
        }
      } else {
        if (selectedImage || selectedVideo || selectedDocument || selectedAudio) {
          const fileObj = selectedImage || selectedVideo || selectedDocument || selectedAudio;

          const formData = new FormData();
          formData.append('to[0]', chatName);
          // formData.append('type', selectedImage ? 'image' : 'video');
          if (selectedImage) {
            formData.append('type', 'image');
          } else if (selectedVideo) {
            formData.append('type', 'video');
          } else if (selectedDocument) {
            formData.append('type', 'document');
          }  else if (selectedAudio) {
            formData.append('type', 'audio');
          }

          formData.append('file', fileObj);

          console.log('File data:', formData);

          const res = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            body: formData, // <-- This is your FormData object
          });
          const json = await res.json();
          console.log('Response:', json);
         
        }
      }

      // ✅ Clear inputs
      setMessage('');
      setSelectedTemplate(null);
      setSelectedImage(null);
      setSelectedVideo(null);
      setSelectedDocument(null);
      setSelectedChatbot(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const fetchChatbotData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      const response = await axios.get(
        'http://192.168.1.62:6004/whatsapp/chatbotlist', // Replace with your chatbot API endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Check if the response contains chatbot data
      if (response.data.success && Array.isArray(response.data.result.data)) {
        const parsedChatbots = parseChatbots(response.data.result.data); // Use the correct path
        setChatbotData(parsedChatbots);
       
       // setChatbotData(response.data.result); // Assuming you have a state variable for chatbot data
      } else {
        console.warn('Unexpected chatbot data structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching chatbot data:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get(
        'http://192.168.1.62:6004/whatsapp/template-meta',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 👉 Make sure templates are inside `result.templates`
      if (response.data.success && Array.isArray(response.data.result)) {
        const parsed = parseTemplates({result: response.data.result});
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
  const handleChatbotPress = () => {
    setchatbotVisible(prev => !prev);
    if (!chatbotVisible) {
      fetchChatbotData();
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
          await upsertMessageToRealm(realm,newMessage);

          console.log('✅ Message saved to Realm:', newMessage);
          fetchMessages(); 
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
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback
        onPress={() => {
          setPopupVisible(false);
          setTemplatesVisible(false);
          Keyboard.dismiss();
        }}>
        <View style={styles.container}>
          <Header
            chatName={chatName}
            profilePic={profilePic}
            onBackPress={handleBackPress}
          />
          {/* {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#075E54" />
            </View>
          ) : (
            <>
              <MessageList messages={messages} />
              <MessageInput
                message={message}
                setMessage={setMessage}
                onSend={handleSend}
                onTogglePopup={() => setPopupVisible(!popupVisible)}
              />
            </>
          )} */}
           <MessageList messages={messages} />
              <MessageInput
                message={message}
                setMessage={setMessage}
                onSend={handleSend}
                onTogglePopup={() => setPopupVisible(!popupVisible)}
              />
          {popupVisible && (
            <PopupMenu
              onPickImage={pickImage}
              onPickVideo={pickVideo}
              onPickDocument={pickDocument}
              onTemplatesPress={handleTemplatesPress}
              onPickAudio={pickAudio}
              onChatbotPress={handleChatbotPress}
            />
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
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <TemplateItem
                    item={item}
                    onSelect={template => {
                      setSelectedTemplate(template); // full object
                      setMessage(template.name); // show template text
                      setTemplatesVisible(false);
                    }}
                  />
                )}
              />
            </View>
          )}
      
{chatbotVisible && (
  <View style={styles.chatbotContainer}>
    <View style={styles.templatesHeader}>
      <Text style={styles.templatesTitle}>Chatbots</Text>
      <TouchableOpacity onPress={() => setchatbotVisible(false)}>
        <Icon name="close" size={22} color="#000" />
      </TouchableOpacity>
    </View>
    <FlatList
      data={chatbotData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ChatbotItem
          item={item}
          onSelect={(chatbot) => {
            setSelectedChatbot(chatbot); // full object
            setMessage(chatbot.name); // Set chatbot name in the input
            setchatbotVisible(false); // Close the chatbot list
          }}
        />
      )}
    />
  </View>
)}

          <MediaPreview
            selectedImage={selectedImage}
            selectedVideo={selectedVideo}
            selectedDocument={selectedDocument}
            onClearMedia={type => {
              if (type === 'image') setSelectedImage(null);
              if (type === 'video') setSelectedVideo(null);
              if (type === 'document') setSelectedDocument(null);
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({

  chatbotContainer: {
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
  chatbotItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  chatbotText: {
    fontSize: 16,
    color: '#333',
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
    shadowOffset: {width: 0, height: -2},
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

  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
