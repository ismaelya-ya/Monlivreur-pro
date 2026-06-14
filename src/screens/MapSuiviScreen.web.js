// src/screens/MapSuiviScreen.web.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MapSuiviScreen({ route, navigation }) {
  const { commandeId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Suivi de livraison</Text>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>🗺️</Text>
        <Text style={styles.infoTitle}>Géolocalisation disponible sur mobile</Text>
        <Text style={styles.infoText}>
          Pour suivre votre livreur en temps réel, veuillez utiliser l'application mobile.
        </Text>
        <Text style={styles.infoText}>
          Vous pouvez contacter votre livreur via le chat.
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.chatButton}
        onPress={() => navigation.navigate('Chat', { commandeId })}
      >
        <Text style={styles.chatButtonText}>💬 Contacter le livreur</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  chatButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
