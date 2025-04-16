// import React from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const Header = ({ chatName, profilePic, onBackPress }) => {
//   return (
//     <View style={styles.header}>
//       <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
//         <Icon name="arrow-back" size={24} color="#fff" />
//       </TouchableOpacity>
//       {profilePic ? (
//         <Image source={{ uri: profilePic }} style={styles.profilePic} />
//       ) : (
//         <Icon name="account-circle" size={36} color="#888" />
//       )}
//       <Text style={styles.headerText}>{chatName}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     height: 60,
//     backgroundColor: '#075E54',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//   },
//   backButton: {
//     marginRight: 8,
//   },
//   profilePic: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     marginRight: 10,
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });

// export default Header;
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header = ({ title, chatName, profilePic, onBackPress }) => {
  return (
    <View style={styles.header}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Profile Picture or Default Icon */}
      {profilePic ? (
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
      ) : chatName ? (
        <Icon name="account-circle" size={36} color="#888" />
      ) : null}

      {/* Title or Chat Name */}
      <View style={styles.textContainer}>
        {chatName ? (
          <Text style={styles.headerText}>{chatName}</Text>
        ) : (
          <Text style={styles.headerText}>{title}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#075E54',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backButton: {
    marginRight: 8,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Header;