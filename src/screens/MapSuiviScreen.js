// src/screens/MapSuiviScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { firestore } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

export default function MapSuiviScreen({ route, navigation }) {
  const { commandeId } = route.params;
  const [commande, setCommande] = useState(null);
  const [livreurPosition, setLivreurPosition] = useState(null);
  const [clientPosition, setClientPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);

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
    if (!commande?.livreurId) return;
    const livreurRef = doc(firestore, 'livreurs', commande.livreurId);
    const unsubscribe = onSnapshot(livreurRef, (doc) => {
      if (doc.exists() && doc.data().positionActuelle) {
        setLivreurPosition(doc.data().positionActuelle);
      }
    });
    return unsubscribe;
  }, [commande?.livreurId]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({});
        const userPos = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setClientPosition(userPos);
        setRegion({
          ...userPos,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        });
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (livreurPosition && mapRef.current) {
      mapRef.current.animateToRegion({
        ...livreurPosition,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      }, 1000);
    }
  }, [livreurPosition]);

  const getStatutText = () => {
    switch(commande?.statut) {
      case 'acceptee': return '🚚 Livreur en route vers le point de départ';
      case 'en_cours': return '📦 Livraison en cours...';
      case 'livree': return '✅ Livraison terminée !';
      default: return commande?.statut;
    }
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
        <Text style={styles.statusText}>{getStatutText()}</Text>
        <Text style={styles.prixText}>Prix: {commande?.prix} €</Text>
      </Card>
      
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {clientPosition && (
            <Marker coordinate={clientPosition} title="Votre position" pinColor="blue" />
          )}
          
          {livreurPosition && (
            <Marker coordinate={livreurPosition} title="Position du livreur" pinColor="green">
              <View style={styles.livreurMarker}>
                <Text style={styles.livreurMarkerText}>🛵</Text>
              </View>
            </Marker>
          )}
          
          {clientPosition && livreurPosition && (
            <Polyline
              coordinates={[clientPosition, livreurPosition]}
              strokeColor="#4CAF50"
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
          )}
        </MapView>
      )}
      
      <View style={styles.footer}>
        <Button 
          title="💬 Chat avec le livreur" 
          type="secondary"
          onPress={() => navigation.navigate('Chat', { commandeId, livreurId: commande?.livreurId })}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  header: { alignItems: 'center', margin: 15, backgroundColor: '#4CAF50' },
  statusText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  prixText: { color: '#fff', fontSize: 14, marginTop: 5 },
  map: { flex: 1, marginHorizontal: 15, borderRadius: 12 },
  livreurMarker: { backgroundColor: '#4CAF50', borderRadius: 20, padding: 5 },
  livreurMarkerText: { fontSize: 20 },
  footer: { padding: 15 },
});
