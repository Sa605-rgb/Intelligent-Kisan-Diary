import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import { authAPI } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminLoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials when component mounts
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('adminEmail');
      const savedPassword = await AsyncStorage.getItem('adminPassword');
      const rememberMeStatus = await AsyncStorage.getItem('rememberMe');
      
      if (savedEmail && savedPassword && rememberMeStatus === 'true') {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.log('Error loading saved credentials:', error);
    }
  };

  const saveCredentials = async () => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('adminEmail', email);
        await AsyncStorage.setItem('adminPassword', password);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        // Clear saved credentials if rememberMe is false
        await AsyncStorage.removeItem('adminEmail');
        await AsyncStorage.removeItem('adminPassword');
        await AsyncStorage.setItem('rememberMe', 'false');
      }
    } catch (error) {
      console.log('Error saving credentials:', error);
    }
  };

  const handleAdminLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.adminLogin(email, password);
      console.log('Admin login successful:', response);
      
      // Save credentials if rememberMe is enabled
      if (rememberMe) {
        await saveCredentials();
      }
      
      Alert.alert('Success', 'Admin login successful!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('AdminHomeScreen')
        }
      ]);
      
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const toggleRememberMe = () => {
    setRememberMe(previousState => !previousState);
  };

  const clearSavedCredentials = async () => {
    try {
      await AsyncStorage.removeItem('adminEmail');
      await AsyncStorage.removeItem('adminPassword');
      await AsyncStorage.setItem('rememberMe', 'false');
      setEmail('');
      setPassword('');
      setRememberMe(false);
      Alert.alert('Success', 'Saved credentials cleared!');
    } catch (error) {
      console.log('Error clearing credentials:', error);
    }
  };

  const handleSignup = () => {
    navigation.navigate('AdminSignup'); // AdminSignup screen par navigate karega
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.content}>
          <Text style={styles.title}>Admin Login</Text>
          <Text style={styles.subtitle}>Access administrative controls</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              editable={!loading}
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              editable={!loading}
              placeholderTextColor="#999"
            />

            {/* Remember Me Option */}
            <View style={styles.rememberMeContainer}>
              <View style={styles.rememberMeLeft}>
                <Switch
                  value={rememberMe}
                  onValueChange={toggleRememberMe}
                  disabled={loading}
                  trackColor={{ false: '#767577', true: '#81c784' }}
                  thumbColor={rememberMe ? '#2e7d32' : '#f4f3f4'}
                />
                <Text style={styles.rememberMeText}>Remember Me</Text>
              </View>
              
              {rememberMe && (
                <TouchableOpacity 
                  onPress={clearSavedCredentials}
                  disabled={loading}
                >
                  <Text style={styles.clearText}>Clear Saved</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.disabledButton]} 
            onPress={handleAdminLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>LOGIN AS ADMIN</Text>
            )}
          </TouchableOpacity>

          {/* Don't have account section */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity 
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>Back to Selection</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  rememberMeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    fontWeight: '500',
  },
  clearText: {
    fontSize: 14,
    color: '#ff4444',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    height: 50,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#81C784',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  signupText: {
    fontSize: 16,
    color: '#555',
  },
  signupLink: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },
});

export default AdminLoginScreen;