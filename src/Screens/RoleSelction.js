// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import CustomButton from '../Components/Custombutton';

// const RoleSelectionScreen = ({ navigation }) => {
//   const [roles, setRoles] = useState([]);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchRoles = async () => {
//     try {
//       const tokenA = await AsyncStorage.getItem('token');
//       const response = await axios.get('http://192.168.1.62:6004/user/user?role=admin', {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${tokenA}`,
//         },
//       });
  
//       // Extract and remove duplicate managedBy values
//       const rawRoles = response.data?.result?.data || [];
//       const uniqueRolesMap = {};
  
//       rawRoles.forEach((user) => {
//         if (!uniqueRolesMap[user.managedBy]) {
//           uniqueRolesMap[user.managedBy] = { id: user._id, managedBy: user.managedBy };
//         }
//       });
  
//       const uniqueRoles = Object.values(uniqueRolesMap);
//       setRoles(uniqueRoles);
//     } catch (err) {
//       Alert.alert('Error', 'Failed to fetch roles');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleSelectRole = async () => {
//     if (!selectedRole) {
//       Alert.alert('Select Role', 'Please select a role');
//       return;
//     }
  
//     try {
//       const tokenA = await AsyncStorage.getItem('token');
  
//       const response = await axios.post(
//         'http://192.168.1.62:6004/user/admin',
//         { managedBy: selectedRole.managedBy },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${tokenA}`,
//           },
//         }
//       );
  
//       console.log('ROLE RESPONSE:', response.data);
  
//       const newTokenB = response.data?.result?.token;

  
//       if (newTokenB) {
//         await AsyncStorage.setItem('token', newTokenB);
//         await AsyncStorage.setItem('managedBy', selectedRole.managedBy); 
//         navigation.navigate('Tab');
//       } else {
//         Alert.alert('Error', 'Role token not received');
//       }
//     } catch (error) {
//       console.log('ROLE ERROR:', error?.response?.data || error.message);
//       Alert.alert('Error', 'Role selection failed');
//     }
//   };
  

//   const handleCancel = () => {
//     navigation.goBack();
//   };
//   const renderRoleItem = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.roleItemBox,
//         selectedRole?.id === item.id && styles.selectedRoleBox,
//       ]}
//       onPress={() => setSelectedRole(item)}
//     >
//       <Text style={[
//         styles.roleText,
//         selectedRole?.id === item.id && styles.selectedRoleText
//       ]}>
//         {item.managedBy}
//       </Text>
//     </TouchableOpacity>
//   );
  
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Select Your Role</Text>
//       <FlatList
//         data={roles}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderRoleItem}
//       />

//       <CustomButton
//         title="OK"
//         onPress={handleSelectRole}
//         style={styles.okButton}
//         textStyle={styles.okButtonText}
//       />
//       <CustomButton
//         title="Cancel"
//         onPress={handleCancel}
//         style={styles.cancelButton}
//         textStyle={styles.cancelButtonText}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
//   roleItemBox: {
//     backgroundColor: '#F9F9F9',
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     elevation: 3, // for Android
//     shadowColor: '#000', // for iOS
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     alignItems: 'center',
//   },
  
//   selectedRoleBox: {
//     backgroundColor: '#03CF65',
//   },
  
//   roleText: {
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#333',
//   },
  
//   selectedRoleText: {
//     color: '#fff',
//   },
  
//   okButton: {
//     backgroundColor: '#03CF65',
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   okButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   cancelButton: {
//     marginTop: 12,
//     padding: 16,
//     borderRadius: 8,
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   cancelButtonText: {
//     color: 'red',
//     textAlign: 'center',
//     fontSize: 16,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default RoleSelectionScreen;
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select'; // For enhanced dropdown

const RoleSelectionScreen = ({ navigation }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(true); // Modal visibility

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

      const rawRoles = response.data?.result?.data || [];
      const uniqueRolesMap = {};

      rawRoles.forEach((user) => {
        if (!uniqueRolesMap[user.managedBy]) {
          uniqueRolesMap[user.managedBy] = { id: user._id, managedBy: user.managedBy };
        }
      });

      const uniqueRoles = Object.values(uniqueRolesMap).map((role) => ({
        label: role.managedBy,
        value: role.managedBy,
      }));
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
        { managedBy: selectedRole },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenA}`,
          },
        }
      );

      const newTokenB = response.data?.result?.token;

      if (newTokenB) {
        await AsyncStorage.setItem('token', newTokenB);
        await AsyncStorage.setItem('managedBy', selectedRole);
        setModalVisible(false);
        navigation.navigate('Tab');
      } else {
        Alert.alert('Error', 'Role token not received');
      }
    } catch (error) {
      Alert.alert('Error', 'Role selection failed');
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Select Your Role</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#03CF65" />
            ) : (
              <RNPickerSelect
                onValueChange={(value) => setSelectedRole(value)}
                items={roles}
                placeholder={{
                  label: 'Select your role',
                  value: null,
                  color: '#888',
                }}
                style={{
                  inputIOS: styles.pickerInput,
                  inputAndroid: styles.pickerInput,
                  iconContainer: styles.pickerIconContainer,
                }}
                Icon={() => (
                  <Text style={styles.pickerIcon}>▼</Text> // Custom down-arrow icon
                )}
              />
            )}

            <TouchableOpacity
              style={styles.okButton}
              onPress={handleSelectRole}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerInput: {
    fontSize: 16,
    // paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    color: '#333',
    width: '100%',
  },
  pickerIconContainer: {
    top: 15,
    right: 12,
    
  },
  pickerIcon: {
    fontSize: 18,
    color: '#03CF65', // Custom color for the down-arrow
  },
  okButton: {
    backgroundColor: '#03CF65',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoleSelectionScreen;