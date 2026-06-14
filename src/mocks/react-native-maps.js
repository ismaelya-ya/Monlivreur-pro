// src/mocks/react-native-maps.js
import React from 'react';
import { View, Text } from 'react-native';

// Composant MapView mock pour le web
export const MapView = ({ children, style, ...props }) => (
  <View style={[style, { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }]}>
    <Text style={{ color: '#666' }}>🗺️ Carte disponible sur mobile</Text>
    {children}
  </View>
);

export const Marker = ({ children, ...props }) => children || null;
export const Polyline = () => null;
export const Callout = () => null;

export default { MapView, Marker, Polyline, Callout };
