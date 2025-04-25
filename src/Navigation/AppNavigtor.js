import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import SignupScreen from '../Screens/SignupScreen';
import LoginScreen from '../Screens/LoginScreen';
import BottomTabNavigator from './BottomTabBavigator';
import { ActivityIndicator, View } from 'react-native';
import ProjectSelectionScreen from '../Screens/ProjectSelction';
import AddWccCreditsScreen from '../Screens/AddWcc';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatMesaageScreen from '../Screens/Chatmessage';
import RoleSelectionScreen from '../Screens/RoleSelction';
import Splashscreen from '../Screens/Splash';
import OnboardingScreen from '../Screens/Onboaarding';
import ImagePreviewScreen from '../Screens/ImagePrevieScreen';
import VideoPreviewScreen from '../Screens/VideoPriviewScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  // const [loading, setLoading] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // // Check if the user is logged in
  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('token');
  //       if (token) {
  //         setIsAuthenticated(true);
  //       }
  //     } catch (error) {
  //       console.log('Error checking login status:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkLoginStatus();
  // }, []);

  // // Show a loading indicator while checking login status
  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#03CF65" />
  //     </View>
  //   );
  // }

 


  return (
    <NavigationContainer>
      {/* <Stack.Navigator
        initialRouteName={isAuthenticated?'RoleSelection':'LoginScreen'}
        screenOptions={{ headerShown: false }}
      > */}
            <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
         <Stack.Screen name="SplashScreen" component={Splashscreen} />
         <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="Tab" component={BottomTabNavigator} />
        <Stack.Screen name="ProjectSelectionScreen" component={ProjectSelectionScreen} />
        <Stack.Screen name="AddWccCreditsScreen" component={AddWccCreditsScreen} />

        
        <Stack.Screen name='ChatMessageScreen' component={ChatMesaageScreen}/>
        <Stack.Screen name = 'ImagePriviewScreen' component={ImagePreviewScreen}/>
        <Stack.Screen name = 'VideoPreviewScreen' component={VideoPreviewScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


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

   // useEffect(() => {
  //   socket.on('newIncomingMessage', data => {
  //     console.log('New Incoming Message:', data);

  //     if (data.conversationId) {
  //       if (activeChatId === data.conversationId) {
  //       console.log("id match");
        
  //         return ;
  //       } else {
  //         setUnreadCounts(prevCounts => {
  //           const newCount = (prevCounts[data.conversationId] || 0) + 1;
  //           console.log(`Unread Count for ${data.conversationId}:`, newCount); // Log unread count
  //           return {
  //             ...prevCounts,
  //             [data.conversationId]: newCount,
  //           };
  //         });
  //       }
       
        
        
  //       setChats(prevChats => {
  //         const existingChatIndex = prevChats.findIndex(
  //           chat => chat._id === data.conversationId,
  //         );

  //         const currentTime = new Date().toISOString();
  //         // const newMessage = data.text;
  //         const newMessage = {text: data.text};

  //         if (existingChatIndex !== -1) {
  //           const updatedChat = {
  //             ...prevChats[existingChatIndex],
  //             lastText: newMessage,
  //             updatedAt: currentTime,
  //             unreadCount: (prevChats[existingChatIndex].unreadCount || 0) + 1,
  //           };

  //           const updatedChats = [
  //             updatedChat,
  //             ...prevChats.filter((_, index) => index !== existingChatIndex),
  //           ];
  //           return updatedChats;
  //         } else {
  //           const newChat = {
  //             _id: data.conversationId,
  //             // lastMessage: newMessage,
  //             lastText: {text: data.text},
  //             updatedAt: currentTime,
  //             receiverData: [{phoneNumber: data.senderPhoneNumber}],
  //             unreadCount: 1,
  //           };

  //           return [newChat, ...prevChats];
  //         }
  //       });
  //     }
  //   });
  //   return () => {
  //     socket.off('newIncomingMessage');
  //   };
  // }, [activeChatId]);





  
    // const renderMessage = ({item}) => {
    //   let messageText = 'Message not available';
    //   const formatTime = timestamp => {
    //     const date = new Date(timestamp);
    //     return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    //   };
  
    //   // Define status icon based on message status
    //   const getStatusIcon = status => {
    //     if (status?.startsWith('Error')) {
    //       return (
    //         <Icon
    //           name="error-outline"
    //           size={16}
    //           color="red"
    //           style={styles.statusIcon}
    //         />
    //       );
    //     }
  
    //     switch (status) {
    //       case 'message_delivered':
    //         return <Icon name="done-all" size={16} color="#888" style={styles.statusIcon} />;
    //       case 'message_read':
    //         return <Icon name="done-all" size={16} color="#34B7F1" style={styles.statusIcon} />;
    //       default:
    //         return <Icon name="done" size={16} color="#888" style={styles.statusIcon} />;
    //     }
    //   };
  
    //   if (item.IsIncoming) {
    //     messageText = item.text ?? 'Message not available';
    //   } else {
    //     if (typeof item.text === 'string') {
    //       messageText = item.text;
    //     } else if (item.text && Array.isArray(item.text.components)) {
  
    //       const bodyComponent = item.text.components.find(
    //         component => component.type === 'BODY',
    //       );
    //       messageText = bodyComponent ? bodyComponent.text : 'Message not available';
  
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
    //       <View style={styles.statusContainer}>
    //         <Text style={styles.messageTime}>{messageTime}</Text>
    //         {!item.IsIncoming && getStatusIcon(item.status)}
    //       </View>
    //     </View>
    //   );
    // };


    
  // useEffect(() => {
  //   const socket = getSocket();
  //   // Listen for new incoming messages
  //   socket.on('newIncomingMessage', data => {
  //     console.log('New Incoming Message:', data);

  //     if (data.conversationId === id) {
  //       const newMessage = {
  //         id: data.textId || Date.now().toString(),
  //         text: data.text || 'Message not available',
  //         IsIncoming: true,
  //         updatedAt: data.updatedAt || new Date().toISOString(),
  //         status: data.status || 'message_sent',
  //       };
  //       setMessages(prevMessages => [newMessage, ...prevMessages]);
  //       // Fetch messages again to update the list
  //       // fetchMessages();
   
  //     } else {
  //       console.log('Message does not belong to this conversation');
  //     }
  //   });

  
  //   const handleStatusUpdate = data => {
  //     console.log('Status Update Event:', data);
  //     setMessages(prevMessages =>
  //       prevMessages.map(msg =>
  //         msg.id === data._id ? { ...msg, status: data.status } : msg
  //       )
  //     );
  //   };
  
  //   socket.on('UpdateStatusEvent', handleStatusUpdate);
  
  //   return () => {
  //     socket.off('UpdateStatusEvent', handleStatusUpdate); // 👈 Proper cleanup
  //   };
  // }, [id]);