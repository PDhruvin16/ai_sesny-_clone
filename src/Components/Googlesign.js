// src/components/GoogleSignInButton.js
import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Antdesign from 'react-native-vector-icons/AntDesign';

import { useNavigation } from '@react-navigation/native';
const GoogleSignInButton = ({ onSignInSuccess, onSignInFailure, buttonStyle = {}, textStyle = {} }) => {
  const navigation = useNavigation();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '',
      scopes: ['email', 'profile'],
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In successful:', userInfo);
      if (onSignInSuccess) onSignInSuccess(userInfo);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      if (onSignInFailure) onSignInFailure(error);
    }
  };
  
  
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={handleGoogleSignIn}>
    <Antdesign name="google" size={20} color="#fff" style={styles.icon} />
    <Text style={[styles.text, textStyle]}>Sign In with Google</Text>
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#db4437',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    width:'100%',
    gap:10
   
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoogleSignInButton;
