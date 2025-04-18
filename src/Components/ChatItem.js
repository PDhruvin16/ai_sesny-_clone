
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const ChatItem = ({ chat, onPress,onLongPress,isSelected }) => {
  // Formatting the time to a readable string (e.g., "10:45 AM")
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    // <TouchableOpacity style={styles.container} onPress={onPress} onLongPress={onLongPress}>
    <TouchableOpacity
    activeOpacity={1}
    style={[
      
      styles.container,
      isSelected && styles.selectedContainer,
      
      // Highlight if selected
    ]}
    onPress={onPress}
    onLongPress={onLongPress}
  >

      {/* <Image source={{ uri: chat.receiverData?.profilePic  }} style={styles.profilePic} /> */}
      {chat.receiverData?.profilePic ? (
          <Image
            source={{ uri: chat.receiverData.profilePic }}
            style={styles.profilePic}
          />
        ) : (
          <Icon name="account-circle" size={50} color="#888" />
        )}
      <View style={styles.textContainer}>
        <View style={styles.header}>
       
          <Text style={styles.name} numberOfLines={1}>
  {Array.isArray(chat.receiverData) ? 
    chat.receiverData[0]?.phoneNumber : 
    chat.receiverData?.phoneNumber}
</Text>
 {chat.unreadCount > 0 && (
      <View style={styles.unreadBadge}>
        <Text style={styles.unreadText}>{chat.unreadCount}</Text>
      </View>
    )}
           
          <Text style={styles.time}>{formatTime(chat.updatedAt)}</Text>
        </View>
       
        <Text style={styles.lastMessage} numberOfLines={1}>{chat.lastText?.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  selectedContainer: {
    backgroundColor: '#E0F7FA', // Highlight color for selected chat
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: '75%',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadBadge: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 5,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChatItem;
