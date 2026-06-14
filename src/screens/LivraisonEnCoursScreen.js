// src/screens/LivraisonEnCoursScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { firestore, auth } from '../services/firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { demarrerSuiviLivreur } from '../services/locationService';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

export default function LivraisonEnCoursScreen({ route, navigation }) {
  const { commandeId } = route.params;
  const [commande, setCommande] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const stopSuiviRef = useRef(null);
  
  const user = auth.currentUser;

  useEffect(() => {
    const commandeRef = doc(firestore, 'commandes', commandeId);
    const unsubscribe = onSnapshot(commandeRef, (doc) => {
      if (doc.exists()) {
        setCommande({ id: doc.id, ...doc.data() });
      }
    });
    return unsubscribe;
  }, [commandeId]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const livreurRef = doc(firestore, 'livreurs', user.uid);
      await updateDoc(livreurRef, {
        disponible: false,
        derniereMiseAJour: new Date()
      });
      
      stopSuiviRef.current = demarrerSuiviLivreur(user.uid, (newPosition) => {
        setPosition(newPosition);
      });
      
      setLoading(false);
    })();
    
    return () => {
      if (stopSuiviRef.current) {
        stopSuiviRef.current();
      }
    };
  }, []);

  const confirmerLivraison = async () => {
    Alert.alert(
      'Confirmer la livraison',
      'Avez-vous bien livré le colis et reçu le paiement en cash ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          onPress: async () => {
            const commandeRef = doc(firestore, 'commandes', commandeId);
            await updateDoc(commandeRef, {
              statut: 'livree',
              dateLivraison: new Date()
            });
            
            const livreurRef = doc(firestore, 'livreurs', user.uid);
            await updateDoc(livreurRef, {
              disponible: true
            });
            
            Alert.alert('Succès', 'Livraison confirmée !');
            navigation.navigate('MesCourses');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <Layout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </Layout>
    );
  }

  return (
    <Layout scrollable={false}>
      <Card style={styles.header}>
        <Text style={styles.headerTitle}>Livraison en cours</Text>
        <Text style={styles.headerPrix}>{commande?.prix} €</Text>
      </Card>
      
      {position && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
          showsUserLocation={true}
        >
          <Marker coordinate={position} title="Votre position" pinColor="green" />
        </MapView>
      )}
      
      <Card style={styles.infoContainer}>
        <Text style={styles.infoTitle}>📍 Adresse de livraison</Text>
        <Text style={styles.infoAddress}>{commande?.dropoffAdresse}</Text>
        
        <Text style={styles.infoTitle}>📦 Description</Text>
        <Text style={styles.infoText}>{commande?.description || 'Aucune description'}</Text>
      </Card>
      
      <View style={styles.footer}>
        <Button 
          title="✅ Confirmer la livraison et le paiement" 
          onPress={confirmerLivraison} 
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', margin: 15, backgroundColor: '#4CAF50' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerPrix: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  map: { flex: 1, marginHorizontal: 15, borderRadius: 12, minHeight: 200 },
  infoContainer: { margin: 15 },
  infoTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 5, marginTop: 10 },
  infoAddress: { fontSize: 16, color: '#333', marginBottom: 5 },
  infoText: { fontSize: 14, color: '#666' },
  footer: { paddingHorizontal: 15, paddingBottom: 20 },
});
