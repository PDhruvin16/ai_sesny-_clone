import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomButton from '../Components/Custombutton';

const RoleSelectionScreen = ({ navigation }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const tokenA = await AsyncStorage.getItem('token');
      const response = await axios.get('http://192.168.1.62:6004/user/user?role=admin', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenA}`,
        },
      });
  
      // Extract and remove duplicate managedBy values
      const rawRoles = response.data?.result?.data || [];
      const uniqueRolesMap = {};
  
      rawRoles.forEach((user) => {
        if (!uniqueRolesMap[user.managedBy]) {
          uniqueRolesMap[user.managedBy] = { id: user._id, managedBy: user.managedBy };
        }
      });
  
      const uniqueRoles = Object.values(uniqueRolesMap);
      setRoles(uniqueRoles);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };
  const handleSelectRole = async () => {
    if (!selectedRole) {
      Alert.alert('Select Role', 'Please select a role');
      return;
    }
  
    try {
      const tokenA = await AsyncStorage.getItem('token');
  
      const response = await axios.post(
        'http://192.168.1.62:6004/user/admin',
        { managedBy: selectedRole.managedBy },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenA}`,
          },
        }
      );
  
      console.log('ROLE RESPONSE:', response.data);
  
      const newTokenB = response.data?.result?.token;

  
      if (newTokenB) {
        await AsyncStorage.setItem('token', newTokenB);
        await AsyncStorage.setItem('managedBy', selectedRole.managedBy); 
        navigation.navigate('Tab');
      } else {
        Alert.alert('Error', 'Role token not received');
      }
    } catch (error) {
      console.log('ROLE ERROR:', error?.response?.data || error.message);
      Alert.alert('Error', 'Role selection failed');
    }
  };
  

  const handleCancel = () => {
    navigation.goBack();
  };
  const renderRoleItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.roleItemBox,
        selectedRole?.id === item.id && styles.selectedRoleBox,
      ]}
      onPress={() => setSelectedRole(item)}
    >
      <Text style={[
        styles.roleText,
        selectedRole?.id === item.id && styles.selectedRoleText
      ]}>
        {item.managedBy}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <FlatList
        data={roles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRoleItem}
      />

      <CustomButton
        title="OK"
        onPress={handleSelectRole}
        style={styles.okButton}
        textStyle={styles.okButtonText}
      />
      <CustomButton
        title="Cancel"
        onPress={handleCancel}
        style={styles.cancelButton}
        textStyle={styles.cancelButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  roleItemBox: {
    backgroundColor: '#F9F9F9',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  
  selectedRoleBox: {
    backgroundColor: '#03CF65',
  },
  
  roleText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  
  selectedRoleText: {
    color: '#fff',
  },
  
  okButton: {
    backgroundColor: '#03CF65',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RoleSelectionScreen;
