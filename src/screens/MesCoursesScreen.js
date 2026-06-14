// src/screens/MesCoursesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { firestore, auth } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

export default function MesCoursesScreen({ navigation }) {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const chargerCourses = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(
      collection(firestore, 'commandes'),
      where('livreurId', '==', user.uid)
    );
    const snapshot = await getDocs(q);
    const commandesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCommandes(commandesData);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    chargerCourses();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    chargerCourses();
  };

  const getStatutText = (statut) => {
    switch(statut) {
      case 'acceptee': return { text: '🟡 En cours', color: '#FF9800' };
      case 'livree': return { text: '✅ Livrée', color: '#4CAF50' };
      default: return { text: statut, color: '#666' };
    }
  };

  const renderCommande = ({ item }) => {
    const statut = getStatutText(item.statut);
    
    return (
      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>#{item.id.slice(-6)}</Text>
          <Text style={[styles.cardStatut, { color: statut.color }]}>{statut.text}</Text>
        </View>
        <Text style={styles.cardPrix}>{item.prix} €</Text>
        <Text style={styles.cardAdresse} numberOfLines={1}>📍 {item.pickupAdresse}</Text>
        <Text style={styles.cardAdresse} numberOfLines={1}>🏁 {item.dropoffAdresse}</Text>
        
        {item.statut === 'acceptee' && (
          <Button 
            title="Commencer la livraison" 
            onPress={() => navigation.navigate('LivraisonEnCours', { commandeId: item.id })}
            style={styles.startButton}
          />
        )}
      </Card>
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
      {commandes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🛵 Aucune course en cours</Text>
          <Button 
            title="Voir les commandes disponibles" 
            onPress={() => navigation.navigate('CommandesDisponibles')}
          />
        </View>
      ) : (
        <FlatList
          data={commandes}
          renderItem={renderCommande}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  listContent: { paddingBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardId: { fontSize: 12, color: '#666', fontFamily: 'monospace' },
  cardStatut: { fontSize: 12, fontWeight: '600' },
  cardPrix: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50', marginBottom: 8 },
  cardAdresse: { fontSize: 14, color: '#333', marginBottom: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 40 },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 15 },
  startButton: { marginTop: 12 },
});
