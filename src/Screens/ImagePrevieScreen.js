import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const ImagePreviewScreen = ({navigation,route}) => {
    const {imageUrl} = route.params;

    return(
        <View style={styles.container}>
<TouchableOpacity
style={styles.closeButton}
onPress={()=> navigation.goBack()}
>
    <Icon name = "close" size={30} color = "#fff"/>
</TouchableOpacity>

<Image
source={{uri:imageUrl}}
style={styles.image}
resizeMode='contain'
/>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 1,
    },
  });
  
  export default ImagePreviewScreen;