import React, {useEffect} from 'react';
import AppNavigator from './src/Navigation/AppNavigtor';
import {persistor, store} from './src/Redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {initializeSocket} from './src/Services/socket';
import { RealmProvider } from './src/Utils/realmcontext';


const App = () => {
  useEffect(() => {
    
    initializeSocket();
  }, []);
  return (
    
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RealmProvider>
        <AppNavigator />
        </RealmProvider>
      </PersistGate>
    </Provider>
   
  );
};
export default App;
// import React, { useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   Dimensions,
//   StyleSheet,
//   Animated,
// } from 'react-native';

// const { width } = Dimensions.get('window');

// const data = [
//   { id: '1', title: 'Card 1', color: '#FFC107' },
//   { id: '2', title: 'Card 2', color: '#03A9F4' },
//   { id: '3', title: 'Card 3', color: '#4CAF50' },
//   { id: '4', title: 'Card 4', color: '#E91E63' },
// ];

// const CardCarouselScreen = () => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const scrollX = useRef(new Animated.Value(0)).current;

//   const handleScrollEnd = (event) => {
//     const index = Math.round(event.nativeEvent.contentOffset.x / width);
//     setActiveIndex(index);
//   };

//   const renderItem = ({ item, index }) => {
//     const inputRange = [
//       (index - 1) * width,
//       index * width,
//       (index + 1) * width,
//     ];

//     const scale = scrollX.interpolate({
//       inputRange,
//       outputRange: [0.01, 1, 0.1],
//       extrapolate: 'clamp',
//     });

//     const opacity = scrollX.interpolate({
//       inputRange,
//       outputRange: [0.2, 1, 0.7],
//       extrapolate: 'clamp',
//     });

//     return (
//       <Animated.View
//         style={[
//           styles.card,
//           {
//             backgroundColor: item.color,
//             transform: [{ scale }],
//             opacity,
//           },
//         ]}
//       >
//         <Text style={styles.cardText}>{item.title}</Text>
//       </Animated.View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Animated.FlatList
//         data={data}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         onMomentumScrollEnd={handleScrollEnd}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: true }
//         )}
//         scrollEventThrottle={16}
//       />

//       <View style={styles.indicatorContainer}>
//         {data.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.indicator,
//               activeIndex === index && styles.activeIndicator,
//             ]}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// export default CardCarouselScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   card: {
//     width: width - 40,
//     height: '80%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 16,
//     padding: 20,
//     marginTop: 50,
//   },
//   cardText: {
//     fontSize: 24,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   indicatorContainer: {
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 50,
//   },
//   indicator: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#aaa',
//     marginHorizontal: 5,
//   },
//   activeIndicator: {
//     backgroundColor: '#000',
//     width: 12,
//     height: 12,
//   },
// });
