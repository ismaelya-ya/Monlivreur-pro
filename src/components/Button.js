// src/components/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

export default function Button({ title, onPress, type = 'primary', style }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === 'primary' ? styles.primaryButton : styles.secondaryButton,
        style
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.buttonText,
        type === 'primary' ? styles.primaryText : styles.secondaryText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Platform.OS === 'web' ? 12 : 15,
    paddingHorizontal: Platform.OS === 'web' ? 24 : 15,
    borderRadius: 8,
    alignItems: 'center',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
});
