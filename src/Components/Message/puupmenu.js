import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PopupMenu = ({onPickImage, onPickVideo, onPickDocument, onTemplatesPress}) => {
  return (
    <View style={styles.popupMenu}>
      <TouchableOpacity style={styles.popupItem} onPress={onPickImage}>
        <Icon name="image" size={20} color="#075E54" />
        <Text style={styles.popupText}>Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.popupItem} onPress={onPickVideo}>
        <Icon name="videocam" size={20} color="#075E54" />
        <Text style={styles.popupText}>Video</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.popupItem} onPress={onPickDocument}>
        <Icon name="insert-drive-file" size={20} color="#075E54" />
        <Text style={styles.popupText}>Document</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.popupItem}>
        <Icon name="contacts" size={20} color="#075E54" />
        <Text style={styles.popupText}>Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.popupItem} onPress={onTemplatesPress}>
        <Icon name="view-list" size={20} color="#075E54" />
        <Text style={styles.popupText}>Templates</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    popupMenu: {
        position: 'absolute',
        bottom: 60,
        left: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 2},
      },
  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  popupText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default PopupMenu;
