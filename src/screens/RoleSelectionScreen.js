// src/screens/RoleSelectionScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { firestore } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

export default function RoleSelectionScreen({ route, navigation }) {
  const { userId } = route.params;

  const choisirRole = async (role) => {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { role });
    if (role === 'livreur') {
      navigation.replace('LivreurHome');
    } else {
      navigation.replace('ClientHome');
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Card>
          <Text style={styles.title}>Bienvenue sur Mon Livreur</Text>
          <Text style={styles.subtitle}>Je suis :</Text>
          <Button 
            title="Un client" 
            onPress={() => choisirRole('client')} 
            style={styles.button}
          />
          <Button 
            title="Un livreur" 
            type="secondary"
            onPress={() => choisirRole('livreur')} 
            style={styles.button}
          />
        </Card>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', marginTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#4CAF50' },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 40, color: '#666' },
  button: { marginVertical: 10 },
});
