// import React from 'react';
// import { TextInput, StyleSheet } from 'react-native';

// const CustomInput = ({ style, ...props }) => {
//   return (
//     <TextInput
//       style={[styles.input, style]} // Combine default and custom styles
//       placeholderTextColor="#888"
//       {...props}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
// });

// export default CustomInput;

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomInput = ({ style, isPassword, ...props }) => {
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        style={[styles.input, { color: 'black' }]} // 👈 force black text
        placeholderTextColor="#888"
        secureTextEntry={secure}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Icon
            name={secure ? 'eye-off' : 'eye'}
            size={24}
            color={secure ? 'black' : '#888'}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  icon: {
    marginLeft: 10,
  },
});

export default CustomInput;
