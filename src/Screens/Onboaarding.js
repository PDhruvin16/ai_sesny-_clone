import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList
} from 'react-native';

import images from '../Constant/images';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: images.aisesny,
    title: 'Welcome to AiSensy',
    subtitle: 'Smart WhatsApp Marketing',
  },
  {
    id: '2',
    image: images.aisesny,
    title: 'Reach your Customers',
    subtitle: 'Broadcast, Automate, and Analyze',
  },
  {
    id: '3',
    image: images.aisesny,
    title: 'Get Started Now!',
    subtitle: 'Start building your campaigns today',
  },
];

const OnboardingScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef();
  
    const handleNext = () => {
      if (currentIndex < slides.length - 1) {
        flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      } else {
        navigation.replace('LoginScreen'); // Or whatever screen comes next
      }
    };
  
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
      setCurrentIndex(viewableItems[0].index);
    }).current;
  
    return (
      <View style={styles.container}>
        <FlatList
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          ref={flatListRef}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />
        <View style={styles.footer}>
          <View style={styles.indicators}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index && { backgroundColor: '#0066FF' },
                ]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  export default OnboardingScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    slide: {
      width,
      alignItems: 'center',
      padding: 20,
    },
    image: {
      height: 300,
      width: 300,
      marginVertical: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginTop: 10,
    },
    footer: {
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
    },
    indicators: {
      flexDirection: 'row',
      marginBottom: 15,
    },
    dot: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: '#ccc',
      marginHorizontal: 5,
    },
    button: {
      backgroundColor: '#0066FF',
      paddingVertical: 14,
      paddingHorizontal: 40,
      borderRadius: 25,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });