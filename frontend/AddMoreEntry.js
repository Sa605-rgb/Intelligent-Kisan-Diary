import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import T from './localization/T';
import { farmerAPI } from './api';

const PALETTE = {
  bg: '#FFFFFF',
  text: '#111829ff',
  muted: '#6B7280',
  green: '#16A34A',
  greenLite: '#E7F8EA',
  greenSoft: '#CFf6D5',
  gray: '#F3F4F6',
};

function AddMoreEntry({ navigation }) {
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivities();
  }, []);

  const loadRecentActivities = async () => {
    try {
      setLoading(true);
      const farmerId = await AsyncStorage.getItem('farmerId');
      
      if (farmerId) {
        const response = await farmerAPI.getFarmerAllActivities(farmerId);
        
        if (response && response.activities) {
          const sortedActivities = response.activities
            .sort((a, b) => new Date(b.completed_date || b.activity_date) - new Date(a.completed_date || a.activity_date))
            .slice(0, 5);
          
          setRecentActivities(sortedActivities);
        }
      }
    } catch (error) {
      console.log('Error loading recent activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} منٹ پہلے`;
    if (diffHours < 24) return `${diffHours} گھنٹے پہلے`;
    if (diffDays < 7) return `${diffDays} دن پہلے`;
    return date.toLocaleDateString('ur-PK');
  };

  const getActivityIcon = (activityType) => {
    const iconMap = {
      'Sowing': 'spa',
      'Plowing': 'agriculture',
      'Irrigation': 'water-drop',
      'Fertilization': 'eco',
      'Pest Control': 'bug-report',
      'Spraying': 'bug-report',
      'Weeding': 'grass',
      'Harvesting': 'agriculture',
    };
    return iconMap[activityType] || 'event';
  };

  const getDisplayActivityType = (activityType) => {
    const displayMap = {
      'Sowing': 'بوائی',
      'Plowing': 'ہل چلانا',
      'Irrigation': 'آبپاشی',
      'Fertilization': 'کھاد ڈالنا',
      'Pest Control': 'کیڑے مار دوا',
      'Spraying': 'سپرے',
      'Weeding': 'گھاس صاف کرنا',
      'Harvesting': 'کٹائی',
    };
    return displayMap[activityType] || activityType;
  };

  const formatActivityDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleAddCrop = () => {
    navigation.navigate('CropInputPage');
  };

  const handleActivitiesOptions = () => {
    navigation.navigate('ActivityOptionsScreen');
  };

  const handleViewPublicFeed = () => {
    navigation.navigate('PublicFeedScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Options Grid */}
        <View style={styles.gridContainer}>
          {/* Add New Crop */}
          <Pressable 
            style={styles.optionCard}
            onPress={handleAddCrop}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E7F8EA' }]}>
              <Icon name="spa" size={32} color={PALETTE.green} />
            </View>
            <T style={styles.optionTitle}>Add New Crop</T>
            <T style={styles.optionSubtitle}>Register your new crop</T>
          </Pressable>

          {/* My Activities */}
          <Pressable 
            style={styles.optionCard}
            onPress={handleActivitiesOptions}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FFF3CD' }]}>
              <Icon name="agriculture" size={32} color="#856404" />
            </View>
            <T style={styles.optionTitle}>My Activities</T>
            <T style={styles.optionSubtitle}>View your crop activities</T>
          </Pressable>

          {/* View Public Feed */}
          <Pressable 
            style={styles.optionCard}
            onPress={handleViewPublicFeed}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E8EAF6' }]}>
              <Icon name="public" size={32} color="#3F51B5" />
            </View>
            <T style={styles.optionTitle}>View Public Feed</T>
            <T style={styles.optionSubtitle}>See other farmers activities</T>
          </Pressable>

          {/* Local Recommendations */}
          <Pressable 
            style={styles.optionCard}
            onPress={() => navigation.navigate('LocalRecommendationsScreen')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2F1' }]}>
              <Icon name="location-on" size={32} color="#00897B" />
            </View>
            <Text style={styles.optionTitle}>مقامی زرعی سفارشات</Text>
            <Text style={styles.optionSubtitle}>قریبی کسانوں کی سرگرمیاں</Text>
          </Pressable>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.activitySection}>
          <T style={styles.sectionTitle}>Recent Activities</T>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={PALETTE.green} />
              <Text style={styles.loadingText}>لوڈ ہو رہا ہے...</Text>
            </View>
          ) : recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <View key={activity.id || index} style={styles.activityItem}>
                <View style={[
                  styles.activityIcon,
                  activity.isCompleted && { backgroundColor: PALETTE.greenSoft }
                ]}>
                  <Icon 
                    name={getActivityIcon(activity.activity_type)} 
                    size={20} 
                    color={activity.isCompleted ? PALETTE.green : PALETTE.muted} 
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>
                    {activity.crop_name} کی {getDisplayActivityType(activity.activity_type)} {activity.isCompleted ? 'کی' : 'ہونی ہے'}
                  </Text>
                  <Text style={styles.activityTime}>
                    {formatActivityDate(activity.completed_date || activity.activity_date)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="event-note" size={40} color={PALETTE.muted} />
              <Text style={styles.emptyText}>ابھی کوئی سرگرمی نہیں</Text>
              <Text style={styles.emptySubtext}>فصل شامل کریں اور سرگرمیاں مکمل کریں</Text>
            </View>
          )}
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  optionCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PALETTE.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 12,
    color: PALETTE.muted,
    textAlign: 'center',
  },
  activitySection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PALETTE.text,
    textAlign: 'right',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.gray,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PALETTE.greenLite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: PALETTE.text,
    textAlign: 'right',
  },
  activityTime: {
    fontSize: 12,
    color: PALETTE.muted,
    textAlign: 'right',
    marginTop: 2,
  },
  activitySubtext: {
    fontSize: 12,
    color: PALETTE.muted,
    textAlign: 'right',
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    color: PALETTE.muted,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: PALETTE.text,
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 13,
    color: PALETTE.muted,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default AddMoreEntry;