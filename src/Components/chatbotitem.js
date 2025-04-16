import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';


const ChatbotItem = ({item, onSelect, onClose}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
      <Text style={styles.chatbotName}>{item.name}</Text>

      {/* Description */}
      {item.description ? (
        <Text style={styles.description}>{item.description}</Text>
      ) : null}

      {/* Source */}
      <Text style={styles.source}>Source: {item.source}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 12,
    padding: 14,
    borderRadius: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  chatbotName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 22,
  },
  source: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  selectButton: {
    marginTop: 10,
    backgroundColor: '#0a7cff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatbotItem;
