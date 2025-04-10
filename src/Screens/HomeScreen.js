import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from 'react-native';
import CustomButton from '../Components/Custombutton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import images from '../Constant/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../Redux/authSlice';
const HomeScreen = ({ navigation }) => {
  const [selectedProject, setSelectedProject] = useState('Project A');
  const [wccCredits, setWccCredits] = useState(1000); // Example WCC credit value
  
  const [managedBy, setManagedBy] = useState('');

  const data = [
    { id: '1', title: 'Broadcast Messages' },
    { id: '2', title: 'Manage Templates' },
    { id: '3', title: 'Analytics' },
  ];
  useEffect(() => {
    const getManagedBy = async () => {
      const value = await AsyncStorage.getItem('managedBy');
      if (value) setManagedBy(value);
    };
    getManagedBy();
  }, []);
  const handleConnectWhatsAppAPI = () => {
    Linking.openURL('https://business.facebook.com/wa/manage/');
  };

  const handleCreateCampaign = () => {
    Alert.alert('Create New Campaign');
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    dispatch(logout()); // Clear Redux + AsyncStorage
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  const handleNavigateToProjectSelection = () => {
    navigation.navigate('ProjectSelectionScreen', {
      onProjectSelect: (project) => setSelectedProject(project),
    });
  };

  const handleAddWccCredits = () => {
    navigation.navigate('AddWccCreditsScreen', {
      currentCredits: wccCredits,
      onCreditsUpdate: (newCredits) => setWccCredits(newCredits),
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* <Text style={styles.header}>Dashboard</Text> */}
        <Image source={images.aisesny} style={styles.logo}/>
        <View style={styles.wccRow}>
          <Text style={styles.credits}>WCC: {wccCredits}</Text>
          <TouchableOpacity onPress={handleAddWccCredits} style={styles.addCreditsButton}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
       
      </View>

      <View style={styles.projectContainer}>
        <View style={styles.projectRow}>
          <Feather name="folder" size={20} color="#333" />
          <Text style={styles.projectName}>{managedBy}</Text>
          <TouchableOpacity onPress={handleNavigateToProjectSelection} style={styles.switchButton}>
            <MaterialIcons name="arrow-drop-down" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.stepsBox}>
        <Text style={styles.stepsTitle}>Get Started With Aisensy! </Text>
     
        <View style={styles.step}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#03CF65" />
          <Text style={styles.stepText}>Step 1: Connect WhatsApp API</Text>
        </View>
        <View style={styles.step}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#03CF65" />
          <Text style={styles.stepText}>Step 2: Create a Campaign</Text>
        </View>
        <View style={styles.step}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#03CF65" />
          <Text style={styles.stepText}>Step 3: Track Analytics</Text>
        </View>
        <View style={styles.step}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#03CF65" />
          <Text style={styles.stepText}>Step 4: Track Analytics</Text>
        </View>
        <View style={styles.columnButtonContainer}>
          <CustomButton
            title="Connect WhatsApp API"
            onPress={handleConnectWhatsAppAPI}
            style={styles.apiButton}
            textStyle={styles.apiButtonText}
          />
            <CustomButton
          title="Create New Campaign"
          onPress={handleCreateCampaign}
          style={styles.createButton}
          textStyle={styles.createButtonText}
        />
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
       <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#333" />
        </TouchableOpacity>
      <View style={styles.buttonContainer}>
     
      
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding:5
  },
  header:{
fontSize:20,
fontWeight:'bold'
  },
  logo:{
    width:150,
    height:40
  },
  wccRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth:1,
    paddingHorizontal:10,
    paddingVertical:5,
        borderRadius:20
  },
  credits: {
    fontSize: 14,
    color: '#fffff',
    marginRight: 8,
    fontWeight:'500'
  },
  addCreditsButton: {
    backgroundColor: '#696969',
    padding: 6,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
  },
  projectContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  switchButton: {
    padding: 4,
  },
  stepsBox: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 20,
    borderRadius: 8,
    elevation: 2,
    marginBottom:10
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginBottom:20
  },
  stepText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  list: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  cardText: {
    fontSize: 18,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
  },
  apiButton: {
    backgroundColor: '#03CF65',
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
  },
  apiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: 'transparent',
    padding: 5,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;

      {/* Chat List */}
      {/* <FlatList
        data={dummyChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem chat={item} onPress={() => handleChatPress(item)} />
        )}
      /> */}
      // const dummyChats = [
      //   {
      //     id: '1',
      //     name: 'John Doe',
      //     profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
      //     lastMessage: 'Hey, how are you?',
      //     time: '10:30 AM',
      //   },
      //   {
      //     id: '2',
      //     name: 'Alice Smith',
      //     profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
      //     lastMessage: 'Let\'s catch up soon!',
      //     time: '9:15 AM',
      //   },
      //   {
      //     id: '3',
      //     name: 'Bob Brown',
      //     profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
      //     lastMessage: 'Got it, thanks!',
      //     time: 'Yesterday',
      //   },
      // ];