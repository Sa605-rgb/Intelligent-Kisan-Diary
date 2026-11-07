// ✅ Language Context Provider
// Manages the current language state across the entire app

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from './translations';

// Create Context
const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default: English
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language on app start
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('appLanguage');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Change language and save to storage
  const changeLanguage = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem('appLanguage', newLanguage);
      console.log('✅ Language changed to:', newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  // Toggle between English and Urdu
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ur' : 'en';
    changeLanguage(newLang);
  };

  // Get translation for a key
  const t = (key) => {
    if (translations[key]) {
      return translations[key][language] || translations[key]['en'] || key;
    }
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };

  // Check if current language is Urdu (for RTL styling)
  const isUrdu = language === 'ur';
  const isRTL = language === 'ur';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        toggleLanguage,
        t,
        isUrdu,
        isRTL,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider;

