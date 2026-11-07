import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { farmerAPI } from './api';
import T from './localization/T';  // ✅ Smart Translation Component

const PALETTE = {
  bg: '#FFFFFF',
  text: '#111829ff',
  muted: '#6B7280',
  green: '#16A34A',
  greenLite: '#E7F8EA',
  greenSoft: '#CFf6D5',
  gray: '#F3F4F6',
};

function ActivitiesOptionsScreen({ navigation }) {
  // ✅ Button 1: Crop Activities
  const handleCropActivities = async () => {
    try {
      const farmerId = await AsyncStorage.getItem('farmerId');
      if (farmerId) {
        navigation.navigate('CropActivitiesScreen', { 
          farmerId: parseInt(farmerId)
        });
      } else {
        Alert.alert('Error', 'Farmer ID not found. Please login again.');
      }
    } catch (error) {
      console.error('Error navigating to crop activities:', error);
      Alert.alert('Error', 'Failed to load crops');
    }
  };

  // ✅ Button 2: All Activities
  const handleAllActivities = async () => {
    try {
      const farmerId = await AsyncStorage.getItem('farmerId');
      if (farmerId) {
        navigation.navigate('FarmerActivitiesScreen', { 
          farmerId: parseInt(farmerId)
        });
      } else {
        Alert.alert('Error', 'Farmer ID not found. Please login again.');
      }
    } catch (error) {
      console.error('Error navigating to all activities:', error);
      Alert.alert('Error', 'Failed to load activities');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* ✅ 2 Buttons - Vertical Layout */}
        <View style={styles.buttonsContainer}>
          
          {/* Button 1: Crop Activities */}
          <Pressable 
            style={styles.optionCard}
            onPress={handleCropActivities}
          >
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#E7F8EA' }]}>
                <Icon name="spa" size={32} color={PALETTE.green} />
              </View>
              <View style={styles.textContainer}>
                <T style={styles.optionTitle}>Activity Tracker</T>
                <T style={styles.optionSubtitle}>Sowing, Irrigation, Fertilizer, Pesticide etc.</T>
              </View>
              <Icon name="arrow-forward" size={24} color={PALETTE.muted} />
            </View>
          </Pressable>

          {/* Button 2: All Activities */}
          <Pressable 
            style={styles.optionCard}
            onPress={handleAllActivities}
          >
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#E8EAF6' }]}>
                <Icon name="list" size={32} color="#3F51B5" />
              </View>
              <View style={styles.textContainer}>
                <T style={styles.optionTitle}>Farm Diary</T>
                <T style={styles.optionSubtitle}>Complete list of lands, crops and all activities</T>
              </View>
              <Icon name="arrow-forward" size={24} color={PALETTE.muted} />
            </View>
          </Pressable>

        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PALETTE.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: PALETTE.muted,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonsContainer: {
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PALETTE.text,
    textAlign: 'right',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: PALETTE.muted,
    textAlign: 'right',
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PALETTE.text,
    textAlign: 'right',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.gray,
  },
  infoText: {
    fontSize: 14,
    color: PALETTE.text,
    textAlign: 'right',
    marginRight: 12,
    flex: 1,
  },
});

export default ActivitiesOptionsScreen;