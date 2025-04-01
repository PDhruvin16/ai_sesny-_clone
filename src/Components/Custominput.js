import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ style, ...props }) => {
  return (
    <TextInput
      style={[styles.input, style]} // Combine default and custom styles
      placeholderTextColor="#888"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});

export default CustomInput;
