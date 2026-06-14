// screens/LoginScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Alert, StyleSheet, Platform,
  ScrollView, TextInput, TouchableOpacity
} from 'react-native';
import { auth, firestore } from '../services/firebase';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef(null);

  // Initialiser le reCAPTCHA invisible sur le web
  useEffect(() => {
    if (Platform.OS === 'web') {
      // On attend que le DOM soit prêt
      setTimeout(() => {
        try {
          recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              console.log('reCAPTCHA résolu');
            },
          });
        } catch (e) {
          console.warn('reCAPTCHA init error:', e.message);
        }
      }, 500);
    }
  }, []);

  // Envoi du code SMS
  const sendCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Numéro invalide', 'Entrez un numéro au format +227XXXXXXXX');
      return;
    }

    setLoading(true);
    try {
      let appVerifier = recaptchaVerifier.current;

      // Sur mobile sans reCAPTCHA, on passe null (Firebase gère automatiquement)
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirm(confirmation);
      Alert.alert('Code envoyé', `Un code a été envoyé à ${phoneNumber}`);
    } catch (error) {
      console.error('Erreur envoi code:', error);
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Vérification du code
  const verifyCode = async () => {
    if (!code || code.length < 6) {
      Alert.alert('Code invalide', 'Entrez le code à 6 chiffres');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await confirm.confirm(code);
      await createOrUpdateUser(userCredential.user);
      Alert.alert('Succès', 'Connecté !');
      navigation.replace('RoleSelection', { userId: userCredential.user.uid });
    } catch (error) {
      console.error('Erreur vérification:', error);
      Alert.alert('Code invalide', 'Le code saisi est incorrect ou a expiré');
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateUser = async (user) => {
    const userRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        phone: user.phoneNumber,
        nom: '',
        role: null,
        createdAt: new Date(),
      });
    }
  };

  // Écran de saisie du numéro
  if (!confirm) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Conteneur invisible pour le reCAPTCHA web */}
        {Platform.OS === 'web' && <View nativeID="recaptcha-container" />}

        <View style={styles.card}>
          <Text style={styles.title}>Mon Livreur</Text>
          <Text style={styles.subtitle}>Connectez-vous avec votre téléphone</Text>

          <TextInput
            style={styles.input}
            placeholder="+227 90 12 34 56"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={sendCode}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Envoi en cours...' : 'Envoyer le code SMS'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Écran de saisie du code
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Vérification</Text>
        <Text style={styles.subtitle}>Entrez le code reçu par SMS</Text>

        <TextInput
          style={styles.input}
          placeholder="123456"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={verifyCode}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Vérification...' : 'Vérifier'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setConfirm(null);
            setCode('');
          }}
        >
          <Text style={styles.retryButtonText}>Resaisir mon numéro</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: isWeb ? 40 : 24,
    width: isWeb ? 400 : '100%',
    maxWidth: '100%',
    ...(isWeb
      ? { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }
    ),
  },
  title: {
    fontSize: isWeb ? 32 : 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  retryButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#2196F3',
    fontSize: 14,
  },
});
