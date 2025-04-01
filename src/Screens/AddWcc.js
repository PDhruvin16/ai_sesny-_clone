import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CustomInput from '../Components/Custominput';

const AddWccCreditsScreen = ({ navigation, route }) => {
  const [creditsToAdd, setCreditsToAdd] = useState('');
  const { currentCredits, onCreditsUpdate } = route.params;

  const handleAddCredits = () => {
    const newCredits = parseInt(creditsToAdd, 10);
    if (isNaN(newCredits) || newCredits <= 0) {
      Alert.alert('Error', 'Please enter a valid number of credits');
      return;
    }
    const updatedCredits = currentCredits + newCredits;
    onCreditsUpdate(updatedCredits);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add WCC Credits</Text>
      <CustomInput
        placeholder="Enter credits to add"
        keyboardType="numeric"
        style={styles.input}
        value={creditsToAdd}
        onChangeText={setCreditsToAdd}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddCredits}>
        <Text style={styles.addButtonText}>Add Credits</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#03CF65',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddWccCreditsScreen;