

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';

const SplashScreen = ({ navigation }) => {
  // ✅ Auto-navigate after 2 seconds animation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000); // 2 seconds
    
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      <View style={styles.content}>
        <Text style={styles.title}>KISAN DIARY</Text>
        
        <Text style={styles.subtitle}>
          Please wait while we prepare your farming insights.
        </Text>

        {/* ✅ Loading animation instead of button */}
        <View style={styles.loaderContainer}>
          <View style={styles.loader} />
        </View>

        <Text style={styles.footer}></Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 22,
  },
  loaderContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  loader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#E8F5E8',
    borderTopColor: '#4CAF50',
  },
  footer: {
    fontSize: 14,
    color: '#777',
    marginTop: 20,
  },
});

export default SplashScreen;