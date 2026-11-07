
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { adminAPI } from './api'; 

const AdminDashboard = ({ navigation }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await adminAPI.getSystemStatistics();
      if (response.success) {
        setStatistics(response);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      
      {/* Statistics Cards */}
      {statistics && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="people" size={30} color="#2E7D32" />
            <Text style={styles.statNumber}>{statistics.statistics.total_farmers}</Text>
            <Text style={styles.statLabel}>Total Farmers</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="landscape" size={30} color="#1976D2" />
            <Text style={styles.statNumber}>{statistics.statistics.total_lands}</Text>
            <Text style={styles.statLabel}>Total Lands</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="agriculture" size={30} color="#FF9800" />
            <Text style={styles.statNumber}>{statistics.statistics.total_crops}</Text>
            <Text style={styles.statLabel}>Total Crops History</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="event" size={30} color="#D32F2F" />
            <Text style={styles.statNumber}>{statistics.statistics.total_activities}</Text>
            <Text style={styles.statLabel}>Total Activities</Text>
          </View>
        </View>
      )}

      {/* Menu Cards - ✅ NAVIGATION FIXED */}
      <TouchableOpacity 
        style={styles.menuCard}
        onPress={() => navigation.navigate('CropSchedulesTab')} // ✅ Tab name use karein
      >
        <Icon name="event-note" size={24} color="#2E7D32" />
        <Text style={styles.menuText}>Manage Crop Schedules</Text>
        <Icon name="arrow-forward" size={20} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuCard}
        onPress={() => navigation.navigate('FarmersTab')} // ✅ Tab name use karein
      >
        <Icon name="people" size={24} color="#2E7D32" />
        <Text style={styles.menuText}>View All Farmers</Text>
        <Icon name="arrow-forward" size={20} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuCard}
        onPress={() => navigation.navigate('ManagementTab')} // ✅ Tab name use karein
      >
        <Icon name="build" size={24} color="#2E7D32" />
        <Text style={styles.menuText}>Fertilizer & Pesticide Management</Text>
        <Icon name="arrow-forward" size={20} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuCard}
        onPress={() => navigation.navigate('AnalyticsTab')} // ✅ Tab name use karein
      >
        {/* <Icon name="analytics" size={24} color="#2E7D32" />
        <Text style={styles.menuText}>System Analytics</Text>
        <Icon name="arrow-forward" size={20} color="#666" /> */}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2E7D32' },
  statsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    marginBottom: 20 
  },
  statCard: { 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statNumber: { fontSize: 24, fontWeight: 'bold', marginVertical: 8, color: '#333' },
  statLabel: { fontSize: 14, color: '#666' },
  menuCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  menuText: { flex: 1, fontSize: 16, marginLeft: 12, fontWeight: '500', color: '#333' }
});

export default AdminDashboard;