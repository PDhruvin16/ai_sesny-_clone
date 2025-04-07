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

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Show a loading indicator while checking login status
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#03CF65" />
      </View>
    );
  }

 


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated?'Tab':'LoginScreen'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="Tab" component={BottomTabNavigator} />
        <Stack.Screen name="ProjectSelectionScreen" component={ProjectSelectionScreen} />
        <Stack.Screen name="AddWccCreditsScreen" component={AddWccCreditsScreen} />
        
        <Stack.Screen name='ChatMessageScreen' component={ChatMesaageScreen}/>
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