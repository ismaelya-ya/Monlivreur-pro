// src/screens/MesCommandesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { firestore, auth } from '../services/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

export default function MesCommandesScreen({ navigation }) {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const chargerCommandes = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(
      collection(firestore, 'commandes'),
      where('clientId', '==', user.uid),
      orderBy('dateCreation', 'desc')
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
    chargerCommandes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    chargerCommandes();
  };

  const getStatutText = (statut) => {
    switch(statut) {
      case 'en_attente': return { text: '⏳ En attente', color: '#FF9800' };
      case 'acceptee': return { text: '✅ Acceptée', color: '#4CAF50' };
      case 'livree': return { text: '🎉 Livrée', color: '#2196F3' };
      default: return { text: statut, color: '#666' };
    }
  };

  const renderCommande = ({ item }) => {
    const statut = getStatutText(item.statut);
    const date = item.dateCreation?.toDate();
    
    return (
      <Card style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>#{item.id.slice(-6)}</Text>
          <Text style={[styles.cardStatut, { color: statut.color }]}>{statut.text}</Text>
        </View>
        <Text style={styles.cardAdresse} numberOfLines={1}>📍 {item.pickupAdresse}</Text>
        <Text style={styles.cardAdresse} numberOfLines={1}>🏁 {item.dropoffAdresse}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardPrix}>{item.prix} €</Text>
          <Text style={styles.cardDate}>
            {date ? date.toLocaleDateString() : 'Date inconnue'}
          </Text>
        </View>
        <Button 
          title="Détails" 
          type="secondary"
          onPress={() => navigation.navigate('MapSuivi', { commandeId: item.id })} 
          style={{ marginTop: 10 }}
        />
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
          <Text style={styles.emptyText}>📭 Aucune commande pour le moment</Text>
          <Button 
            title="Créer ma première commande" 
            onPress={() => navigation.navigate('CreerCommande')} 
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
  cardContainer: { padding: 15, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardId: { fontSize: 14, color: '#666', fontFamily: 'monospace' },
  cardStatut: { fontSize: 14, fontWeight: '600' },
  cardAdresse: { fontSize: 14, color: '#333', marginBottom: 5 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  cardPrix: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
  cardDate: { fontSize: 12, color: '#999' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 40 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 20 },
});
