// ✅ Language Toggle Component
// Use this component in Profile or Settings screen

import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from './index';

const LanguageToggle = () => {
  const { language, toggleLanguage, t, isUrdu } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Icon name="language" size={24} color="#2E7D32" />
        <Text style={styles.label}>{t('language')}</Text>
      </View>
      
      <View style={styles.toggleContainer}>
        <Text style={[styles.langText, !isUrdu && styles.activeLang]}>
          English
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
  );
};

// ✅ Alternative: Button style toggle
export const LanguageToggleButtons = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View style={styles.buttonContainer}>
      <Text style={styles.sectionTitle}>{t('language')}</Text>
      
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[
            styles.langButton,
            language === 'en' && styles.activeLangButton,
          ]}
          onPress={() => setLanguage('en')}
        >
          <Text
            style={[
              styles.langButtonText,
              language === 'en' && styles.activeLangButtonText,
            ]}
          >
            English
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.langButton,
            language === 'ur' && styles.activeLangButton,
          ]}
          onPress={() => setLanguage('ur')}
        >
          <Text
            style={[
              styles.langButtonText,
              language === 'ur' && styles.activeLangButtonText,
            ]}
          >
            اردو
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langText: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 8,
  },
  activeLang: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  
  // Button style
  buttonContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  langButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  activeLangButton: {
    backgroundColor: '#E8F5E8',
    borderColor: '#2E7D32',
  },
  langButtonText: {
    fontSize: 16,
    color: '#666',
  },
  activeLangButtonText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});

export default LanguageToggle;

