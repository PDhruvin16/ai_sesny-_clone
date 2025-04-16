import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import GoogleSignInButton from '../Components/Googlesign';
import CustomInput from '../Components/Custominput';
import CustomButton from '../Components/Custombutton';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../Redux/authSlice';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const dispatch = useDispatch();
const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    dispatch(loginUser({ email, password }))
    .unwrap()
    .then((res) => {
      if (res.role === 'super_admin') {
        navigation.navigate('RoleSelection');
      } else {
        navigation.navigate('Tab'); // Or your home screen
      }
    })
    .catch((err) => {
      Alert.alert('Login Error', err);
    });
  
  };
  const handleGoogleSignInSuccess = userInfo => {
    console.log('User Info:', userInfo);
    // Navigate or perform further actions here
  };

  const handleGoogleSignInFailure = error => {
    console.error('Sign-In Failed:', error);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign In Or Create an Account</Text>
        <GoogleSignInButton
          onSignInSuccess={handleGoogleSignInSuccess}
          onSignInFailure={handleGoogleSignInFailure}
          buttonStyle={{backgroundColor: 'green'}}
          textStyle={{fontSize: 16, color: '#black'}}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
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
          isPassword={true}
          // secureTextEntry
        />
      </View>

      <View style={styles.footer}>
        <CustomButton
          title="Sign In"
          onPress={handleLogin}
          style={styles.button}
          textStyle={styles.buttonText}
        />

        <CustomButton
          title="Create a New Account"
          onPress={() => navigation.navigate('SignupScreen')}
          style={styles.createAccountbutton}
          textStyle={styles.createAccountText}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  button: {
    backgroundColor: '#03CF65',
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
  createAccountText: {
    color: 'green',
    textAlign: 'center',
    fontSize: 16,
  },
  createAccountbutton: {
    backgroundColor: 'transparent',
    padding: 16,
 
    alignItems: 'center',
    marginBottom: 16,
  
  },
});

export default LoginScreen;
