import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const AdsManagerScreen = () => {
  const ads = [
    { id: '1', title: 'Campaign 1', status: 'Active' },
    { id: '2', title: 'Campaign 2', status: 'Inactive' },
    { id: '3', title: 'Campaign 3', status: 'Scheduled' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.adCard}>
      <Text style={styles.adTitle}>{item.title}</Text>
      <Text style={styles.adStatus}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ads Manager</Text>
      <FlatList
        data={ads}
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
  adCard: {
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  adTitle: {
    fontSize: 18,
    color: '#333',
  },
  adStatus: {
    fontSize: 14,
    color: '#888',
  },
});

export default AdsManagerScreen;
