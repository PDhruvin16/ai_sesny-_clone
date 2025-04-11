import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';

const MediaPreview = ({
  selectedImage,
  selectedVideo,
  selectedDocument,
  onClearMedia,
}) => {
  return (
    <View style={styles.container}>
      {selectedImage && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.previewImage}
          />
          <TouchableOpacity
            onPress={() => onClearMedia('image')}
            style={styles.closeButton}
          >
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {selectedVideo && (
        <View style={styles.previewContainer}>
          <Video
            source={{ uri: selectedVideo.uri }}
            style={styles.previewVideo}
            resizeMode="contain"
            controls
          />
          <TouchableOpacity
            onPress={() => onClearMedia('video')}
            style={styles.closeButton}
          >
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {selectedDocument && (
        <View style={styles.previewContainer}>
          <TouchableOpacity
            onPress={() => Linking.openURL(selectedDocument.uri)}
            style={styles.documentContainer}
          >
            <Icon name="insert-drive-file" size={20} color="#075E54" />
            <Text style={styles.documentName}>{selectedDocument.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onClearMedia('document')}
            style={styles.closeButton}
          >
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 10,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  previewVideo: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  documentName: {
    color: '#000',
    marginLeft: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
});

export default MediaPreview;