// src/services/locationService.js
import * as Location from 'expo-location';
import { firestore } from './firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

// Demander la permission de localisation
export const demanderPermissionLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission de localisation refusée. Vous ne pourrez pas suivre les livreurs.');
    return false;
  }
  return true;
};

// Obtenir la position actuelle
export const getPositionActuelle = async () => {
  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  } catch (error) {
    console.error('Erreur de géolocalisation:', error);
    return null;
  }
};

// Mettre à jour la position du livreur en temps réel
export const demarrerSuiviLivreur = (livreurId, onPositionChange) => {
  let subscription;
  
  const startWatching = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    
    subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // toutes les 5 secondes
        distanceInterval: 10 // tous les 10 mètres
      },
      async (location) => {
        const { latitude, longitude } = location.coords;
        
        // Mettre à jour dans Firestore
        const livreurRef = doc(firestore, 'livreurs', livreurId);
        await updateDoc(livreurRef, {
          positionActuelle: { latitude, longitude },
          derniereMiseAJour: new Date()
        });
        
        if (onPositionChange) {
          onPositionChange({ latitude, longitude });
        }
      }
    );
  };
  
  startWatching();
  
  // Retourner une fonction pour arrêter le suivi
  return () => {
    if (subscription) subscription.remove();
  };
};

// Obtenir la position d'un livreur
export const getPositionLivreur = async (livreurId) => {
  const livreurRef = doc(firestore, 'livreurs', livreurId);
  const snapshot = await getDoc(livreurRef);
  if (snapshot.exists() && snapshot.data().positionActuelle) {
    return snapshot.data().positionActuelle;
  }
  return null;
};
