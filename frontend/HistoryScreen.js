
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { adminAPI } from './api';

const PALETTE = {
  bg: '#FFFFFF',
  text: '#111829',
  muted: '#6B7280',
  green: '#16A34A',
  greenLite: '#E7F8EA',
  greenSoft: '#D1FAE5',
  orange: '#F59E0B',
  orangeLite: '#FEF3C7',
  blue: '#3B82F6',
  blueLite: '#DBEAFE',
  red: '#EF4444',
  redLite: '#FEE2E2',
  purple: '#8B5CF6',
  purpleLite: '#EDE9FE',
  gray: '#F3F4F6',
};

// ✅ All Crops List with Icons & Urdu Names
const ALL_CROPS = [
  { english: 'WHEAT', urdu: 'گندم', icon: '🌾' },
  { english: 'RICE', urdu: 'چاول', icon: '🍚' },
  { english: 'MAIZE', urdu: 'مکئی', icon: '🌽' },
  { english: 'COTTON', urdu: 'کپاس', icon: '☁️' },
  { english: 'SUGARCANE', urdu: 'گنا', icon: '🎋' },
  { english: 'MUSTARD', urdu: 'سرسوں', icon: '🌼' },
  { english: 'SUNFLOWER', urdu: 'سورج مکھی', icon: '🌻' },
  { english: 'CHICKPEAS', urdu: 'چنے', icon: '🟤' },
  { english: 'PEANUT', urdu: 'مونگ پھلی', icon: '🥜' },
  { english: 'BARLEY', urdu: 'جو', icon: '📏' },
  { english: 'BAJRA', urdu: 'باجرا', icon: '🌱' },
  { english: 'SORGHUM', urdu: 'جوار', icon: '🌿' },
  { english: 'TOBACCO', urdu: 'تمباکو', icon: '🚬' },
  { english: 'SESAMUM', urdu: 'تل', icon: '⚫' },
  { english: 'PADDY', urdu: 'دھان', icon: '💧' },
];

// ✅ Activity Type Colors & Icons
const getActivityStyle = (type) => {
  const styles = {
    'Land Preparation': { color: PALETTE.orange, bgColor: PALETTE.orangeLite, icon: '🚜' },
    'Sowing': { color: PALETTE.green, bgColor: PALETTE.greenLite, icon: '🌱' },
    'Fertilization': { color: PALETTE.blue, bgColor: PALETTE.blueLite, icon: '💊' },
    'Irrigation': { color: PALETTE.blue, bgColor: PALETTE.blueLite, icon: '💧' },
    'Pest Control': { color: PALETTE.red, bgColor: PALETTE.redLite, icon: '🐛' },
    'Weed Control': { color: PALETTE.purple, bgColor: PALETTE.purpleLite, icon: '🌿' },
    'Harvesting': { color: PALETTE.green, bgColor: PALETTE.greenSoft, icon: '🌾' },
    'Post-Harvest': { color: PALETTE.muted, bgColor: PALETTE.gray, icon: '📦' },
  };
  return styles[type] || { color: PALETTE.muted, bgColor: PALETTE.gray, icon: '📋' };
};

const HistoryScreen = ({ navigation, route }) => {
  const [cropSchedules, setCropSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [expandedCrop, setExpandedCrop] = useState(null);
  
  // ✅ Get zone and city from route params
  const zone = route?.params?.zone || '';
  const cityName = route?.params?.city || '';
  
  // ✅ Check if it's Barani (rain-fed) area - no irrigation needed
  // Database may return: "بارانی", "barani", "Barani", etc.
  const zoneLower = zone.toLowerCase();
  const isBarani = zoneLower.includes('barani') || 
                   zone.includes('بارانی') || 
                   zoneLower.includes('rain');

  // ✅ Check if crop was passed from HomeScreen
  useEffect(() => {
    if (route?.params?.cropName) {
      // Convert Urdu to English if needed
      const passedCrop = route.params.cropName;
      const foundCrop = ALL_CROPS.find(c => c.urdu === passedCrop || c.english === passedCrop.toUpperCase());
      if (foundCrop) {
        setSelectedCrop(foundCrop.english);
        setExpandedCrop(foundCrop.english);
      }
    }
  }, [route?.params?.cropName]);

  // ✅ Load Crop Schedules from Backend
  useEffect(() => {
    loadCropSchedules();
  }, []);

  const loadCropSchedules = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCropSchedules();
      if (response.success && response.schedules) {
        setCropSchedules(response.schedules);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get crop info helper
  const getCropInfo = (englishName) => {
    return ALL_CROPS.find(c => c.english === englishName) || { urdu: englishName, icon: '🌱' };
  };

  // ✅ Toggle crop expansion
  const toggleCrop = (cropName) => {
    setExpandedCrop(expandedCrop === cropName ? null : cropName);
  };

  // ✅ Format days text properly
  const formatDaysText = (daysAfter) => {
    if (daysAfter < 0) {
      return `${Math.abs(daysAfter)} دن پہلے`; // X days before
    } else if (daysAfter === 0) {
      return `بوائی کا دن`; // Sowing day
    } else {
      return `${daysAfter} دن بعد`; // X days after
    }
  };

  // ✅ Render Activity Timeline Item
  const renderActivityItem = (activity, index, isLast) => {
    const style = getActivityStyle(activity.type);
    
    return (
      <View key={index} style={styles.timelineItem}>
        {/* Timeline Line */}
        <View style={styles.timelineLeft}>
          <View style={[styles.timelineDot, { backgroundColor: style.color }]}>
            <Text style={styles.timelineDotIcon}>{style.icon}</Text>
          </View>
          {!isLast && <View style={[styles.timelineLine, { backgroundColor: style.color }]} />}
        </View>
        
        {/* Activity Content */}
        <View style={[styles.timelineContent, { backgroundColor: style.bgColor, borderLeftColor: style.color }]}>
          <View style={styles.activityHeader}>
            <Text style={[styles.activityType, { color: style.color }]}>{activity.type}</Text>
            <View style={styles.daysBadge}>
              <Text style={styles.daysText}>{formatDaysText(activity.days_after)}</Text>
            </View>
          </View>
          <Text style={styles.activityDesc}>{activity.desc}</Text>
          
          {/* ✅ Show Fertilizer/Pesticide details if available */}
          {activity.fertilizer && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>💊 کھاد:</Text>
              <Text style={styles.detailValue}>{activity.fertilizer}</Text>
            </View>
          )}
          {activity.pesticide && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🐛 دوائی:</Text>
              <Text style={styles.detailValue}>{activity.pesticide}</Text>
            </View>
          )}
          {activity.dosage && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📏 مقدار:</Text>
              <Text style={styles.detailValue}>{activity.dosage}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // ✅ Render Crop Card with Activities
  const renderCropCard = (crop) => {
    const schedule = cropSchedules[crop.english];
    const isExpanded = expandedCrop === crop.english;
    const allActivities = schedule?.activities || [];
    
    // ✅ Filter out Irrigation for Barani (rain-fed) areas
    const activities = isBarani 
      ? allActivities.filter(a => a.type !== 'Irrigation')
      : allActivities;
    
    return (
      <View key={crop.english} style={styles.cropCard}>
        {/* Crop Header - Clickable */}
        <Pressable 
          style={({ pressed }) => [
            styles.cropHeader,
            pressed && { opacity: 0.8 }
          ]}
          onPress={() => toggleCrop(crop.english)}
        >
          <View style={styles.cropInfo}>
            <Text style={styles.cropIcon}>{crop.icon}</Text>
            <View>
              <Text style={styles.cropUrdu}>{crop.urdu}</Text>
              <Text style={styles.cropEnglish}>{crop.english}</Text>
            </View>
          </View>
          
          <View style={styles.cropMeta}>
            <View style={styles.activitiesBadge}>
              <Text style={styles.activitiesCount}>{activities.length} سرگرمیاں</Text>
            </View>
            <Icon 
              name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
              size={28} 
              color={PALETTE.green} 
            />
          </View>
        </Pressable>

        {/* Activities Timeline - Expandable */}
        {isExpanded && (
          <View style={styles.activitiesContainer}>
            {activities.length > 0 ? (
              <>
                <Text style={styles.timelineTitle}>📋 فصل کی سرگرمیوں کا شیڈول</Text>
                <View style={styles.timeline}>
                  {activities
                    .sort((a, b) => a.days_after - b.days_after)
                    .map((activity, index) => 
                      renderActivityItem(activity, index, index === activities.length - 1)
                    )}
                </View>
              </>
            ) : (
              <View style={styles.emptyActivities}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyText}>اس فصل کے لیے کوئی سرگرمی نہیں ملی</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PALETTE.green} />
          <Text style={styles.loadingText}>فصلوں کی معلومات لوڈ ہو رہی ہیں...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Subtitle */}
      {/* <View style={styles.subtitle}>
        <Text style={styles.subtitleText}>
          ہر فصل پر کلک کریں اور دیکھیں کہ کون سی سرگرمی کب کرنی ہے
        </Text>
      </View> */}

      {/* ✅ Zone Info Banner - Only show if zone is passed */}
      {zone ? (
        <View style={[styles.zoneBanner, isBarani && styles.zoneBannerBarani]}>
          <Text style={styles.zoneBannerText}>
            {isBarani ? '🌧️' : '💧'} {cityName} - {isBarani ? 'بارانی علاقہ' : 'نہری / چاہی علاقہ'}
          </Text>
          {isBarani && (
            <Text style={styles.zoneBannerNote}>
              آبپاشی کی سرگرمیاں نہیں دکھائی جائیں گی
            </Text>
          )}
        </View>
      ) : null}

      {/* Crops List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ALL_CROPS.map(crop => renderCropCard(crop))}
        
        {/* Bottom Spacer */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: PALETTE.muted,
    fontFamily: 'System',
  },
  
  // Subtitle
  subtitle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: PALETTE.greenLite,
  },
  subtitleText: {
    fontSize: 14,
    color: PALETTE.green,
    textAlign: 'right',
    fontWeight: '500',
  },
  
  // Zone Banner
  zoneBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    backgroundColor: PALETTE.blueLite,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: PALETTE.blue,
  },
  zoneBannerBarani: {
    backgroundColor: PALETTE.orangeLite,
    borderLeftColor: PALETTE.orange,
  },
  zoneBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: PALETTE.text,
    textAlign: 'right',
  },
  zoneBannerNote: {
    fontSize: 12,
    color: PALETTE.orange,
    textAlign: 'right',
    marginTop: 4,
  },
  
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  
  // Crop Card
  cropCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cropHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: PALETTE.greenLite,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cropUrdu: {
    fontSize: 18,
    fontWeight: '700',
    color: PALETTE.text,
    textAlign: 'right',
  },
  cropEnglish: {
    fontSize: 12,
    color: PALETTE.muted,
    textTransform: 'uppercase',
  },
  cropMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activitiesBadge: {
    backgroundColor: PALETTE.green,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  activitiesCount: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Activities Container
  activitiesContainer: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.text,
    textAlign: 'right',
    marginBottom: 16,
  },
  
  // Timeline
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 40,
  },
  timelineDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineDotIcon: {
    fontSize: 16,
  },
  timelineLine: {
    width: 3,
    flex: 1,
    minHeight: 30,
    marginTop: -4,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityType: {
    fontSize: 14,
    fontWeight: '700',
  },
  daysBadge: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  daysText: {
    fontSize: 12,
    color: PALETTE.text,
    fontWeight: '600',
  },
  activityDesc: {
    fontSize: 14,
    color: PALETTE.text,
    textAlign: 'right',
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: 12,
    color: PALETTE.muted,
    marginLeft: 6,
  },
  detailValue: {
    fontSize: 12,
    color: PALETTE.text,
    fontWeight: '600',
  },
  
  // Empty State
  emptyActivities: {
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: PALETTE.muted,
    textAlign: 'center',
  },
});

export default HistoryScreen;
