import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ContactsScreen = () => {
  const contacts = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Robert Brown' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.contactCard}>
      <Text style={styles.contactName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contacts</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contactCard: {
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  contactName: {
    fontSize: 18,
    color: '#333',
  },
});

export default ContactsScreen;
