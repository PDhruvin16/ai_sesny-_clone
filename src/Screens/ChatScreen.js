import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ActiveChat from './ActiveChats';
import RequestedChat from './RequestedChats';
import IntervenedChat from './Intervened';


const Tab = createMaterialTopTabNavigator();

const ChatScreen = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search chats..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor:'gray',
          tabBarIndicatorStyle: { backgroundColor: 'green' },
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: '#fff' },
        }}
      >
        <Tab.Screen name="Active" component={ActiveChat} />
        <Tab.Screen name="Requested" component={RequestedChat} />
        <Tab.Screen name="Intervened" component={IntervenedChat} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchInput: {
    height: 45,
    margin: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default ChatScreen;
