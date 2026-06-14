// src/components/MapPlaceholder.js
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

export default function MapPlaceholder({ children }) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>🗺️ Carte disponible sur l'application mobile</Text>
        <Text style={styles.placeholderSubtext}>
          Pour une meilleure expérience de géolocalisation, utilisez l'application mobile.
        </Text>
      </View>
    );
  }
  
  return children;
}

const styles = StyleSheet.create({
  placeholder: {
    height: 300,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
