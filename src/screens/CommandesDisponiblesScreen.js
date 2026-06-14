// src/screens/CommandesDisponiblesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { firestore, auth } from '../services/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

export default function CommandesDisponiblesScreen({ navigation }) {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const chargerCommandes = async () => {
    const q = query(
      collection(firestore, 'commandes'),
      where('statut', '==', 'en_attente')
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

  const accepterCommande = async (commandeId) => {
    Alert.alert(
      'Accepter la course',
      'Voulez-vous vraiment accepter cette livraison ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Accepter',
          onPress: async () => {
            const user = auth.currentUser;
            const commandeRef = doc(firestore, 'commandes', commandeId);
            await updateDoc(commandeRef, {
              statut: 'acceptee',
              livreurId: user.uid,
              dateAcceptation: new Date()
            });
            Alert.alert('Succès', 'Commande acceptée !');
            chargerCommandes();
            navigation.navigate('MesCourses');
          }
        }
      ]
    );
  };

  const renderCommande = ({ item }) => {
    const date = item.dateCreation?.toDate();
    
    return (
      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>#{item.id.slice(-6)}</Text>
          <Text style={styles.cardPrix}>{item.prix} €</Text>
        </View>
        
        <Text style={styles.cardLabel}>📦 Départ :</Text>
        <Text style={styles.cardAdresse} numberOfLines={2}>{item.pickupAdresse}</Text>
        
        <Text style={styles.cardLabel}>🏁 Arrivée :</Text>
        <Text style={styles.cardAdresse} numberOfLines={2}>{item.dropoffAdresse}</Text>
        
        {item.description ? (
          <Text style={styles.cardDescription}>📝 {item.description}</Text>
        ) : null}
        
        <View style={styles.cardFooter}>
          <Text style={styles.cardDate}>
            📅 {date ? date.toLocaleDateString() : 'Date inconnue'}
          </Text>
          <Button 
            title="Accepter" 
            onPress={() => accepterCommande(item.id)}
            style={styles.acceptButton}
          />
        </View>
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
          <Text style={styles.emptyText}>🚚 Aucune commande disponible</Text>
          <Text style={styles.emptySubtext}>Revenez plus tard !</Text>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardId: { fontSize: 14, color: '#666', fontFamily: 'monospace' },
  cardPrix: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50' },
  cardLabel: { fontSize: 12, color: '#999', marginTop: 8, marginBottom: 2 },
  cardAdresse: { fontSize: 14, color: '#333', marginBottom: 4 },
  cardDescription: { fontSize: 13, color: '#666', marginTop: 8, fontStyle: 'italic' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  cardDate: { fontSize: 12, color: '#999' },
  acceptButton: { paddingVertical: 8, paddingHorizontal: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 40 },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#999' },
});
