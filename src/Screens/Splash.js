import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../Constant/images';

const Splashscreen = ({ navigation }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      navigation.replace(isAuthenticated ? 'RoleSelection' : 'Onboarding');
    }, 2000);
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <Image source={images.aisesny} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 150,
    width: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066FF',
    marginTop: 10,
  },
});

export default Splashscreen;
