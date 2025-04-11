// openDocumentFromUrl.js

import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { Alert } from 'react-native';

// Mapping file extensions to MIME types
const fileTypeMap = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  mp4: 'video/mp4',
  zip: 'application/zip',
};

const openDocumentFromUrl = async (url) => {
  try {
    // Get the file name from the URL
    const fileName = url.split('/').pop().split('?')[0];

    // Get the extension
    const fileExtension = fileName.split('.').pop().toLowerCase();

    // Get MIME type from map
    const mimeType = fileTypeMap[fileExtension]  // default fallback

    // Set local file path
    const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    console.log('🧾 File Name:', fileName);
    console.log('📂 File Extension:', fileExtension);
    console.log('📄 MIME Type:', mimeType);

    // Download the file
    const downloadResult = await RNFS.downloadFile({
      fromUrl: url,
      toFile: localPath,
    }).promise;

    if (downloadResult.statusCode === 200) {
      // Open the downloaded file using the viewer
      await FileViewer.open(localPath, { showOpenWithDialog: true });
    } else {
      Alert.alert('Download failed', 'Could not download the file.');
    }
  } catch (error) {
    console.error('📛 Document open error:', error);
    Alert.alert('Error', 'Could not open document.');
  }
};

export default openDocumentFromUrl;
