// import React from 'react';
// import { View, StyleSheet, FlatList } from 'react-native';
// import ChatItem from '../Components/ChatItem';

// const dummyChats = [
//   {
//     id: '1',
//     name: 'John Doe',
//     profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
//     lastMessage: 'Hey, how are you?',
//     time: '10:30 AM',
//   },
//   {
//     id: '2',
//     name: 'Alice Smith',
//     profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
//     lastMessage: 'Let\'s catch up soon!',
//     time: '9:15 AM',
//   },
//   {
//     id: '3',
//     name: 'Bob Brown',
//     profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
//     lastMessage: 'Got it, thanks!',
//     time: 'Yesterday',
//   },
// ];

// const ActiveChat = ({ navigation }) => {
//   const handleChatPress = (chat) => {
//     navigation.navigate('ChatMesaageScreen', { chat });
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={dummyChats}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <ChatItem chat={item} onPress={() => handleChatPress(item)} />
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
// });

// export default ActiveChat;