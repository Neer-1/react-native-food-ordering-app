import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../context/AppContext';
const { loadDemoState, saveDemoProfile, endDemoSession } = require('../utils/demoProfile');

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { clearCart } = useAppContext();

  // Load user data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const { profile, active } = await loadDemoState(AsyncStorage);
      if (!profile || !active) {
        navigation.getParent().replace('Login');
        return;
      }
      setUsername(profile.username);
      setEmail(profile.email);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // If we're exiting edit mode without saving, reload original data
      loadUserData();
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    // Form validation
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const profile = await saveDemoProfile(AsyncStorage, username);
      setUsername(profile.username);
      setEmail(profile.email);

      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false); // Exit edit mode after successful save
      
    } catch (error) {
      console.error('Failed to save user data:', error);
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            setIsLoading(true);
            try {
              await endDemoSession(AsyncStorage);
              await clearCart();
              navigation.getParent().replace('Login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerSpacing} /> 
          <View style={styles.header}>
            <Text style={styles.title}>{isEditing ? 'Edit Profile' : 'My Profile'}</Text>
            {isEditing && (
              <TouchableOpacity style={styles.cancelButton} onPress={toggleEditMode}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../assets/snack-icon.png')}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View style={styles.editNameContainer}>
                <TextInput
                  style={styles.editNameInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Demo alias"
                />
              </View>
            ) : (
              <Text style={styles.username}>{username}</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={24} color="#2e7d32" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Synthetic demo email</Text>
                <Text style={styles.infoValue}>{email}</Text>
                {isEditing && <Text style={styles.helperText}>Generated from the demo alias</Text>}
              </View>
            </View>

          </View>

          {isEditing ? (
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={24} color="#fff" />
                  <Text style={styles.saveText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={toggleEditMode}>
                <Ionicons name="create-outline" size={24} color="#2e7d32" />
                <Text style={styles.actionText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="time-outline" size={24} color="#2e7d32" />
                <Text style={styles.actionText}>Order History</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={24} color="#2e7d32" />
                <Text style={styles.actionText}>Favorites</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="settings-outline" size={24} color="#2e7d32" />
                <Text style={styles.actionText}>Settings</Text>
              </TouchableOpacity>
            </View>
          )}

          {!isEditing && (
            <>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
              
              <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Foodies App v1.0.0</Text>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerSpacing: {  
  height: 40, 
},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cancelText: {
    color: '#777',
    fontSize: 16,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2e7d32',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  editNameContainer: {
    marginTop: 8,
    width: '60%',
  },
  editNameInput: {
    fontSize: 22,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2e7d32',
    paddingVertical: 4,
  },
  infoContainer: {
    padding: 16,
    marginVertical: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
  editInfoInput: {
    fontSize: 16,
    marginTop: 4,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  helperText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: {
    color: '#999',
    fontSize: 14,
  },
});

export default ProfileScreen;