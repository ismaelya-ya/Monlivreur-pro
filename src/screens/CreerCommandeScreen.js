// src/screens/CreerCommandeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { creerCommande } from '../services/commandeService';
import { auth } from '../services/firebase';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function CreerCommandeScreen({ navigation }) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [description, setDescription] = useState('');
  const [poids, setPoids] = useState('');
  const [prix, setPrix] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!pickup || !dropoff) {
      Alert.alert('Erreur', 'Veuillez remplir les deux adresses');
      return;
    }
    if (!prix || isNaN(prix) || parseFloat(prix) <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un prix valide');
      return;
    }

    setLoading(true);
    const user = auth.currentUser;

    const commandeData = {
      clientId: user.uid,
      pickupAdresse: pickup,
      dropoffAdresse: dropoff,
      description: description,
      poids: poids || 'Non spécifié',
      prix: parseFloat(prix),
    };

    const result = await creerCommande(commandeData);

    if (result.success) {
      Alert.alert('Succès', 'Votre commande a été créée !');
      navigation.goBack();
    } else {
      Alert.alert('Erreur', result.error);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Card>
          <Text style={styles.title}>Nouvelle commande</Text>

          <Text style={styles.label}>Adresse de départ *</Text>
          <Input
            placeholder="Ex: 123 Rue de Paris, 75001 Paris"
            value={pickup}
            onChangeText={setPickup}
            multiline
          />

          <Text style={styles.label}>Adresse d'arrivée *</Text>
          <Input
            placeholder="Ex: 456 Avenue de la République, 75011 Paris"
            value={dropoff}
            onChangeText={setDropoff}
            multiline
          />

          <Text style={styles.label}>Description du colis</Text>
          <Input
            placeholder="Documents, vêtements, électronique..."
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Poids approximatif</Text>
          <Input
            placeholder="Ex: 2kg"
            value={poids}
            onChangeText={setPoids}
          />

          <Text style={styles.label}>Prix proposé (€) *</Text>
          <Input
            placeholder="Ex: 15"
            value={prix}
            onChangeText={setPrix}
            keyboardType="numeric"
          />

          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
          ) : (
            <Button title="Créer la commande" onPress={handleSubmit} style={styles.submitButton} />
          )}
        </Card>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#4CAF50' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10, marginBottom: 5, color: '#333' },
  submitButton: { marginTop: 30, marginBottom: 10 },
});
