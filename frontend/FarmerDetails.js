import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { adminAPI } from './api'; // Aapka API file

const FarmerDetails = ({ route, navigation }) => {
  const { farmerId } = route.params; // Farmer ID params se milegi
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Farmer details fetch karne ka function
  const fetchFarmerDetails = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getFarmerDetails(farmerId);
      
      if (response.success) {
        setFarmerData(response);
      } else {
        Alert.alert('Error', 'Farmer details fetch nahi ho paye');
      }
    } catch (error) {
      console.error('Farmer details error:', error);
      Alert.alert('Error', 'Farmer details load nahi ho paye');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFarmerDetails();
  }, [farmerId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFarmerDetails();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Farmer details load ho rahe hain...</Text>
      </View>
    );
  }

  if (!farmerData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Farmer details nahi mil paye</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchFarmerDetails}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { farmer, lands, crops, activities } = farmerData;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Farmer Basic Info */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Icon name="person" size={40} color="#1976D2" />
        </View>
        <View style={styles.farmerInfo}>
          <Text style={styles.farmerName}>{farmer.name}</Text>
          <Text style={styles.farmerDetail}>📱 {farmer.phone}</Text>
          <Text style={styles.farmerDetail}>📍 {farmer.location}</Text>
        </View>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{lands.length}</Text>
          <Text style={styles.statLabel}>Lands</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{crops.length}</Text>
          <Text style={styles.statLabel}>Crops</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activities.length}</Text>
          <Text style={styles.statLabel}>Activities</Text>
        </View>
      </View>

      {/* Lands Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lands ({lands.length})</Text>
        {lands.map((land, index) => (
          <TouchableOpacity key={land.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                {land.city} - {land.area} ({land.zone})
              </Text>
              <Text style={styles.areaSize}>
                {land.area_size} {land.area_unit}
              </Text>
            </View>
            <Text style={styles.soilType}>Soil: {land.soil_type}</Text>
          </TouchableOpacity>
        ))}
        {lands.length === 0 && (
          <Text style={styles.emptyText}>No lands registered</Text>
        )}
      </View>

      {/* Current Crops Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Crops ({crops.length})</Text>
        {crops.map((crop, index) => (
          <TouchableOpacity key={crop.crop_history_id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cropName}>{crop.crop_name}</Text>
              <Text style={styles.seasonBadge}>{crop.season}</Text>
            </View>
            <Text style={styles.cropDetail}>
              📅 Sowing: {new Date(crop.sowing_date).toLocaleDateString()}
            </Text>
            <Text style={styles.cropDetail}>
              📅 Harvest: {new Date(crop.harvest_date).toLocaleDateString()}
            </Text>
            <Text style={styles.cropDetail}>
              📍 {crop.city} - {crop.area}
            </Text>
            {crop.area_cultivated && (
              <Text style={styles.cropDetail}>
                Area: {crop.area_cultivated} acres
              </Text>
            )}
          </TouchableOpacity>
        ))}
        {crops.length === 0 && (
          <Text style={styles.emptyText}>No current crops</Text>
        )}
      </View>

      {/* Recent Activities Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities ({activities.length})</Text>
        {activities.slice(0, 5).map((activity, index) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityType}>{activity.activity_type}</Text>
              <Text style={styles.activityDate}>
                {new Date(activity.activity_date).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.activityDescription}>{activity.description}</Text>
            <Text style={styles.cropName}>Crop: {activity.crop_name}</Text>
            {activity.chemical_or_fertilizer_used && (
              <Text style={styles.chemicalText}>
                🧪 {activity.chemical_or_fertilizer_used}
              </Text>
            )}
            {activity.remarks && (
              <Text style={styles.remarksText}>💬 {activity.remarks}</Text>
            )}
          </View>
        ))}
        {activities.length === 0 && (
          <Text style={styles.emptyText}>No activities recorded</Text>
        )}
        {activities.length > 5 && (
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Activities</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  farmerInfo: {
    flex: 1,
  },
  farmerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  farmerDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 15,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  areaSize: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  soilType: {
    fontSize: 14,
    color: '#666',
  },
  cropName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  seasonBadge: {
    fontSize: 12,
    color: '#1976D2',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  cropDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  activityCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 15,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  activityType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
  },
  activityDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  chemicalText: {
    fontSize: 12,
    color: '#D32F2F',
    fontStyle: 'italic',
  },
  remarksText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  viewAllButton: {
    backgroundColor: '#1976D2',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  viewAllText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FarmerDetails;