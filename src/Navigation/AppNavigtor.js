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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
