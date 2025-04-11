import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MessageInput = ({ message, setMessage, onSend, onTogglePopup }) => {
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity onPress={onTogglePopup} style={styles.plusButton}>
        <Icon name="add" size={28} color="#075E54" />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.sendButton} onPress={() => onSend({ text: message })}>
        <Icon name="send" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
    elevation: 4,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#075E54',
    padding: 10,
    borderRadius: 20,
  },
});

export default MessageInput;