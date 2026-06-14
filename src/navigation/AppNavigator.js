// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import ClientHomeScreen from '../screens/ClientHomeScreen';
import LivreurHomeScreen from '../screens/LivreurHomeScreen';
import CreerCommandeScreen from '../screens/CreerCommandeScreen';
import MesCommandesScreen from '../screens/MesCommandesScreen';
import CommandesDisponiblesScreen from '../screens/CommandesDisponiblesScreen';
import MesCoursesScreen from '../screens/MesCoursesScreen';
import MapSuiviScreen from '../screens/MapSuiviScreen';
import LivraisonEnCoursScreen from '../screens/LivraisonEnCoursScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Écrans d'authentification */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ title: 'Choisissez votre rôle' }} />
        
        {/* Écrans Client */}
        <Stack.Screen name="ClientHome" component={ClientHomeScreen} options={{ title: 'Mon Livreur' }} />
        <Stack.Screen name="CreerCommande" component={CreerCommandeScreen} options={{ title: 'Nouvelle commande' }} />
        <Stack.Screen name="MesCommandes" component={MesCommandesScreen} options={{ title: 'Mes commandes' }} />
        
        {/* Écrans Livreur */}
        <Stack.Screen name="LivreurHome" component={LivreurHomeScreen} options={{ title: 'Mon Livreur - Livreur' }} />
        <Stack.Screen name="CommandesDisponibles" component={CommandesDisponiblesScreen} options={{ title: 'Commandes disponibles' }} />
        <Stack.Screen name="MesCourses" component={MesCoursesScreen} options={{ title: 'Mes courses' }} />
        
        {/* Nouveaux écrans */}
        <Stack.Screen name="MapSuivi" component={MapSuiviScreen} options={{ title: 'Suivi en direct' }} />
        <Stack.Screen name="LivraisonEnCours" component={LivraisonEnCoursScreen} options={{ title: 'Livraison en cours', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
