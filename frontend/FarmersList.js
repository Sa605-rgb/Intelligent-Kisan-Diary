// FarmersList.js - Create new file
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { adminAPI } from './api';

const FarmersList = ({ navigation }) => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    try {
      const response = await adminAPI.getAllFarmers();
      if (response.success) {
        setFarmers(response.farmers);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load farmers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewFarmer = (farmerId) => {
    navigation.navigate('FarmerDetails', { farmerId });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading Farmers...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>All Farmers ({farmers.length})</Text>
      
      {farmers.map((farmer) => (
        <TouchableOpacity 
          key={farmer.farmer_id}
          style={styles.farmerCard}
          onPress={() => handleViewFarmer(farmer.farmer_id)}
        >
          <View style={styles.farmerInfo}>
            <Text style={styles.farmerName}>{farmer.farmer_name}</Text>
            <Text style={styles.farmerPhone}>📱 {farmer.phone}</Text>
            <Text style={styles.farmerLocation}>📍 {farmer.location}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{farmer.total_lands}</Text>
              <Text style={styles.statLabel}>Lands</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{farmer.total_crops}</Text>
              <Text style={styles.statLabel}>Crops</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{farmer.total_activities}</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </View>
          </View>
          
          <Icon name="arrow-forward" size={20} color="#666" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2E7D32' },
  farmerCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2
  },
  farmerInfo: { flex: 1 },
  farmerName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  farmerPhone: { fontSize: 14, color: '#666', marginBottom: 2 },
  farmerLocation: { fontSize: 14, color: '#666' },
  statsContainer: { flexDirection: 'row', marginRight: 16 },
  stat: { alignItems: 'center', marginHorizontal: 8 },
  statNumber: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
  statLabel: { fontSize: 12, color: '#666' }
});

export default FarmersList;