import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../Screens/HomeScreen';
import ChatScreen from '../Screens/ChatScreen';
import AdsManagerScreen from '../Screens/Adsmanager';
import ContactsScreen from '../Screens/Contactscreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Chat':
              iconName = 'chatbubble-outline';
              break;
            case 'Ads Manager':
              iconName = 'megaphone-outline';
              break;
            case 'Contacts':
              iconName = 'people-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#03CF65',
        tabBarInactiveTintColor: '#888',
        headerShown:false
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Ads Manager" component={AdsManagerScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
