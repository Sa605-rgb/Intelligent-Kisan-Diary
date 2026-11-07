import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';

const SelectionScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Intelligent Online Kisan Diary</Text>
        <Text style={styles.welcome}>Welcome!</Text>
        
        <Text style={styles.subtitle}>
          Please choose how you want to log in:
        </Text>

        <View style={styles.buttonsContainer}>
          {/* Admin Login Button */}
          <TouchableOpacity 
            style={styles.loginOption} 
            onPress={() => navigation.navigate('AdminLogin')}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Login as Admin</Text>
              <Text style={styles.optionDescription}>
                Manage data, recommendations & tips
              </Text>
            </View>
          </TouchableOpacity>

          {/* Farmer Login Button */}
          <TouchableOpacity 
            style={styles.loginOption} 
            onPress={() => navigation.navigate('Login', { userType: 'farmer' })}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Login as Farmer</Text>
              <Text style={styles.optionDescription}>
                Access crop tips, history & suggestions
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonsContainer: {
    gap: 20,
  },
  loginOption: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  optionContent: {
    paddingLeft: 10,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default SelectionScreen;