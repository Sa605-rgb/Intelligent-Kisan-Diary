


import React, { useState } from 'react';
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
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from './api';
import T from './localization/T';  // ✅ Smart Translation Component

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter both phone and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(phone, password);

      if (response && response.success) {
        // Save user data based on type
        await AsyncStorage.setItem('userType', response.user_type);
        await AsyncStorage.setItem('accessToken', response.access_token);
        
        if (response.user_type === 'farmer') {
          // Save farmer data
          await AsyncStorage.setItem('userId', response.farmer_id.toString());
          await AsyncStorage.setItem('farmerId', response.farmer_id.toString());
          await AsyncStorage.setItem('userName', response.farmer_name);
          await AsyncStorage.setItem('userLocation', response.location);
          await AsyncStorage.setItem('farmerLocation', response.location); 
          

          navigation.navigate('Home', { 
            farmerName: response.farmer_name,
            farmerLocation: response.location 
          });
        } else if (response.user_type === 'admin') {
          // Save admin data
          await AsyncStorage.setItem('userId', response.admin_id.toString());
          await AsyncStorage.setItem('userName', response.admin_name);
          await AsyncStorage.setItem('userLocation', response.location);
         
          navigation.navigate('AdminHome', {
            adminName: response.admin_name,
            adminLocation: response.location
          });
        }
      } else {
        Alert.alert('Error', 'Invalid phone or password');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.content}>
          <T style={styles.title}>Login</T>
          

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              editable={!loading}
              placeholderTextColor="#999"
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
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <T style={styles.loginButtonText}>LOGIN</T>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <T style={styles.signupText}>Don't have an account? </T>
            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
              disabled={loading}
            >
              <T style={styles.signupLink}>Sign Up</T>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  content: { padding: 20, alignItems: 'center' },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#2E7D32', 
    marginBottom: 38, 
    textAlign: 'center' 
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center'
  },
  inputContainer: { width: '100%', marginBottom: 30 },
  input: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    fontSize: 16, 
    color: '#333' 
  },
  loginButton: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 15, 
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 20, 
    height: 50, 
    justifyContent: 'center' 
  },
  disabledButton: { backgroundColor: '#A5D6A7' },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { fontSize: 16, color: '#555' },
  signupLink: { fontSize: 16, color: '#4CAF50', fontWeight: 'bold' },
});

export default LoginScreen;