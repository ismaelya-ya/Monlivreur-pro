// src/components/Input.js
import React from 'react';
import { TextInput, StyleSheet, Platform } from 'react-native';

export default function Input({ placeholder, value, onChangeText, multiline, style, keyboardType }) {
  return (
    <TextInput
      style={[styles.input, multiline && styles.textArea, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      keyboardType={keyboardType}
      {...(Platform.OS === 'web' && { 
        onKeyPress: (e) => {
          if (e.key === 'Enter' && !multiline) {
            e.target.blur();
          }
        }
      })}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginVertical: 8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
