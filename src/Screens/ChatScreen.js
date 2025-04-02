// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet } from 'react-native';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import ActiveChat from './ActiveChats';
// import RequestedChat from './RequestedChats';
// import IntervenedChat from './Intervened';


// const Tab = createMaterialTopTabNavigator();

// const ChatScreen = () => {
//   const [searchText, setSearchText] = useState('');

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search chats..."
//         placeholderTextColor="#888"
//         value={searchText}
//         onChangeText={setSearchText}
//       />
//       <Tab.Navigator
//         screenOptions={{
//           tabBarActiveTintColor: 'green',
//           tabBarInactiveTintColor:'gray',
//           tabBarIndicatorStyle: { backgroundColor: 'green' },
//           tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
//           tabBarStyle: { backgroundColor: '#fff' },
//         }}
//       >
//         <Tab.Screen name="Active" component={ActiveChat} />
//         <Tab.Screen name="Requested" component={RequestedChat} />
//         <Tab.Screen name="Intervened" component={IntervenedChat} />
//       </Tab.Navigator>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   searchInput: {
//     height: 45,
//     margin: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
// });

// export default ChatScreen;
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChatItem from '../Components/ChatItem';
import AsyncStorage from '@react-native-async-storage/async-storage';



const ChatScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [chats, setChats] = useState([]);
  console.log(chats,'chatssssssss')
  const [loading, setLoading] = useState(false);
  // const handleChatPress = (chat) => {
  //   navigation.navigate('ChatMesaageScreen', { chat });
  // };
  const handleChatPress = (chat) => {
    // Extract the phone number from receiverData
    const phoneNumber = Array.isArray(chat.receiverData) ? 
      chat.receiverData[0]?.phoneNumber : 
      chat.receiverData?.phoneNumber;
  const id= chat._id;
    navigation.navigate('ChatMessageScreen', { chatName: phoneNumber ,id });
  };
  
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
  
        const response = await fetch('http://192.168.1.49:6004/whatsapp/conversation?searchWith=all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Fixed template string
          },
        });
  
        const data = await response.json();
        console.log('Fetched data:', data); // Log the response to check if it's an array
  
        if (data.success && data.result && Array.isArray(data.result.conversations)) {
          setChats(data.result.conversations); // Update with conversations array
        } else {
          console.error('Data is not in the expected format:', data);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchChats();
  }, []);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Icon name="search" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="more-vert" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>


       {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
       
        <FlatList
  // data={chats.filter((chat) => chat.receiverData[0]?.phoneNumber.toLowerCase().includes(searchText.toLowerCase()))}
  data={chats.filter((chat) => {
    if (Array.isArray(chat.receiverData)) {
      return chat.receiverData.length > 0 && 
        chat.receiverData[0]?.phoneNumber?.toLowerCase().includes(searchText.toLowerCase());
    } else if (chat.receiverData && typeof chat.receiverData === 'object') {
      return chat.receiverData.phoneNumber?.toLowerCase().includes(searchText.toLowerCase());
    }
    return false;
  })}
  keyExtractor={(item) => item._id} 
  renderItem={({ item }) => (
    <ChatItem chat={item} onPress={() => handleChatPress(item)} />
  )}
/>

      )} 
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 60,
    backgroundColor: '#075E54',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
    marginBottom:10  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginTop: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    elevation: 2,
    marginBottom:10
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
});

export default ChatScreen;
