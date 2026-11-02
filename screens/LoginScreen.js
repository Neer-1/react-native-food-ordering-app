import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { loadDemoState, saveDemoProfile, startDemoSession } = require('../utils/demoProfile');

export default function LoginScreen({ navigation }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      try {
        const { profile, active } = await loadDemoState(AsyncStorage);
        if (!mounted) return;
        if (profile) setUsername(profile.username);
        if (active) navigation.replace('Main');
        else setIsReady(true);
      } catch (error) {
        if (mounted) Alert.alert('Storage unavailable', 'Restart the demo to retry.');
      }
    };
    initialize();
    return () => { mounted = false; };
  }, [navigation]);

  const continueDemo = async (create) => {
    if (!isReady || isLoading) return;
    setIsLoading(true);
    try {
      if (create) await saveDemoProfile(AsyncStorage, username);
      await startDemoSession(AsyncStorage, username);
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Demo profile', error.message || 'Unable to save the local demo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/snack-icon.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>
            Foodies Demo
          </Text>
          <Text style={styles.link}>Local prototype only. No account authentication or backend is provided. Do not enter real credentials or personal details.</Text>
        </View>

        {isSignUp ? (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Demo alias (3-30 letters, numbers, _ or -)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.button}
              onPress={() => continueDemo(true)}
              disabled={isLoading || !isReady}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Demo Profile</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setIsSignUp(false)}>
              <Text style={styles.link}>Use an existing local demo profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Saved demo alias"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.button}
              onPress={() => continueDemo(false)}
              disabled={isLoading || !isReady}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Continue Demo</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setIsSignUp(true)}>
              <Text style={styles.link}>Create a local demo profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff'
  },
  keyboardAvoidView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center',
    color: '#2e7d32',
  },
  formContainer: {
    width: '100%',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd',
    marginBottom: 15, 
    padding: 15, 
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: { 
    color: '#2e7d32', 
    marginTop: 20, 
    textAlign: 'center',
    fontWeight: '500',
  },
});