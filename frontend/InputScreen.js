// InputScreen.js
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const InputScreen = ({ onNavigate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Input Screen</Text>
      <Pressable 
        style={styles.button}
        onPress={() => onNavigate('home')}
      >
        <Text style={styles.buttonText}>Home پر جائیں</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#16A34A',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default InputScreen;