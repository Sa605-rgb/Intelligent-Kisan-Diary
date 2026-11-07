// ✅ Profile Screen with Language Toggle
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from './localization';
import T from './localization/T';  // ✅ Smart Translation Component

const ProfileScreen = ({ navigation }) => {
  const { toggleLanguage, isUrdu } = useLanguage();  // Keep isUrdu for toggle
  
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      const phone = await AsyncStorage.getItem('userPhone');
      const location = await AsyncStorage.getItem('userLocation');
      
      setUserName(name || 'Farmer');
      setUserPhone(phone || '');
      setUserLocation(location || '');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const savedLanguage = await AsyncStorage.getItem('appLanguage');
              await AsyncStorage.clear();
              if (savedLanguage) {
                await AsyncStorage.setItem('appLanguage', savedLanguage);
              }
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <T style={styles.headerTitle}>Profile</T>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Icon name="person" size={60} color="#fff" />
          </View>
          <Text style={styles.userName}>{userName}</Text>
          {userPhone ? (
            <View style={styles.infoRow}>
              <Icon name="phone" size={16} color="#666" />
              <Text style={styles.infoText}>{userPhone}</Text>
            </View>
          ) : null}
          {userLocation ? (
            <View style={styles.infoRow}>
              <Icon name="location-on" size={16} color="#666" />
              <Text style={styles.infoText}>{userLocation}</Text>
            </View>
          ) : null}
        </View>

        {/* Settings Section */}
        <View style={styles.sectionCard}>
          <T style={styles.sectionTitle}>Settings</T>

          {/* Language Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="language" size={24} color="#2E7D32" />
              <T style={styles.settingLabel}>Language</T>
            </View>
            
            <View style={styles.languageToggle}>
              <Text style={[styles.langText, !isUrdu && styles.activeLang]}>
                EN
              </Text>
              <Switch
                value={isUrdu}
                onValueChange={toggleLanguage}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                thumbColor={isUrdu ? '#2E7D32' : '#f4f3f4'}
              />
              <Text style={[styles.langText, isUrdu && styles.activeLang]}>
                اردو
              </Text>
            </View>
          </View>

          {/* Current Language Display */}
          <View style={styles.currentLangContainer}>
            <Text style={styles.currentLangText}>
              {isUrdu ? '🌐 موجودہ زبان: اردو' : '🌐 Current Language: English'}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionCard}>
          <T style={styles.sectionTitle}>Quick Actions</T>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('HomeTab', { screen: 'FarmerActivitiesScreen' })}
          >
            <Icon name="history" size={24} color="#2E7D32" />
            <T style={styles.actionText}>Farming History</T>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('HomeTab', { screen: 'AddMoreEntry' })}
          >
            <Icon name="add-circle" size={24} color="#2E7D32" />
            <T style={styles.actionText}>New Entry</T>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.sectionCard}>
          <T style={styles.sectionTitle}>App Info</T>
          
          <View style={styles.infoItem}>
            <T style={styles.infoLabel}>Version</T>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          
          <View style={styles.infoItem}>
            <T style={styles.infoLabel}>App Name</T>
            <T style={styles.infoValue}>Intelligent Kisan Diary</T>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#fff" />
          <T style={styles.logoutText}>Logout</T>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langText: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 6,
  },
  activeLang: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  currentLangContainer: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  currentLangText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpace: {
    height: 30,
  },
});

export default ProfileScreen;
