import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CountryPicker from 'react-native-country-picker-modal';
import CustomInput from '../Components/Custominput';
import CustomButton from '../Components/Custombutton';
const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('IN'); // Default country code
  const [callingCode, setCallingCode] = useState('+91'); // Default country code
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      await firestore().collection('users').doc(userId).set({
        firstName,
        lastName,
        email,
        phoneNumber: `${callingCode}${phoneNumber}`,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('LoginScreen');
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Signup for App Now</Text>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Sign up with Google</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.row}>
          <CustomInput
            placeholder="First Name"
            placeholderTextColor="#888"
            style={[styles.input, styles.halfInput]}
            value={firstName}
            onChangeText={setFirstName}
          />
          <CustomInput
            placeholder="Last Name"
            placeholderTextColor="#888"
            style={[styles.input, styles.halfInput]}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <CustomInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <CustomInput
          placeholder="Password"
          placeholderTextColor="#888"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.row}>
        <CountryPicker
            withCallingCode
            withFilter
            withFlag
            countryCode={countryCode}
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(`+${country.callingCode}`);
            }}
            containerButtonStyle={styles.countryCodeInput}
          />
  <CustomInput
            placeholder="Phone Number"
            placeholderTextColor="#888"
            style={[styles.input, styles.phoneNumberInput]}
            value={`${callingCode} ${phoneNumber}`} // Display country code in the input
            onChangeText={(text) => {
              // Remove the calling code from the input before updating the phone number
              const number = text.replace(callingCode, '').trim();
              setPhoneNumber(number);
            }}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.footer}>
    
            <CustomButton
          title="Sign Up"
          onPress={handleSignup}
          style={styles.button}
          textStyle={styles.buttonText}
        />

        {/* <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity> */}
        <CustomButton
          title="Already have an account? Login"
          onPress={() => navigation.navigate('LoginScreen')}
          style={styles.button1}
          textStyle={styles.linkText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  countryCodeInput: {
    width: 80,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 8,
  },
  phoneNumberInput: {
    flex: 1, 
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  googleButton: {
    backgroundColor: '#03CF65',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 8,
    fontSize: 16,
    color: '#888',
  },
  row: {
    flexDirection: 'row',
    
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  button: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  button1: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: 'green',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SignupScreen;

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