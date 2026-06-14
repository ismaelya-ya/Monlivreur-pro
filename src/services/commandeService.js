// src/services/commandeService.js
import { firestore } from './firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Créer une nouvelle commande
export const creerCommande = async (commandeData) => {
  try {
    const docRef = await addDoc(collection(firestore, 'commandes'), {
      ...commandeData,
      statut: 'en_attente',
      dateCreation: new Date(),
      livreurId: null
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Récupérer les commandes d'un client
export const getCommandesClient = async (clientId) => {
  const q = query(collection(firestore, 'commandes'), where('clientId', '==', clientId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Récupérer les commandes disponibles pour les livreurs
export const getCommandesDisponibles = async () => {
  const q = query(collection(firestore, 'commandes'), where('statut', '==', 'en_attente'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Accepter une commande (livreur)
export const accepterCommande = async (commandeId, livreurId) => {
  const commandeRef = doc(firestore, 'commandes', commandeId);
  await updateDoc(commandeRef, {
    statut: 'acceptee',
    livreurId: livreurId,
    dateAcceptation: new Date()
  });
};
