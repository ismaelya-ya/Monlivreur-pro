// src/screens/LivreurHomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../services/firebase';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

export default function LivreurHomeScreen({ navigation }) {
  const deconnexion = async () => {
    await auth.signOut();
    navigation.replace('Login');
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Card>
          <Text style={styles.title}>🛵 Mon Livreur</Text>
          <Text style={styles.subtitle}>Que souhaitez-vous faire ?</Text>
          
          <Button 
            title="📋 Voir les commandes disponibles" 
            onPress={() => navigation.navigate('CommandesDisponibles')} 
            style={styles.button}
          />

          <Button 
            title="🚚 Mes courses en cours" 
            type="secondary"
            onPress={() => navigation.navigate('MesCourses')} 
            style={styles.button}
          />
          
          <TouchableOpacity style={styles.logoutButton} onPress={deconnexion}>
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', marginTop: 40 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#4CAF50' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40, color: '#666' },
  button: { marginBottom: 15 },
  logoutButton: { marginTop: 20, padding: 12, alignItems: 'center' },
  logoutText: { color: '#f44336', fontSize: 16 },
});
