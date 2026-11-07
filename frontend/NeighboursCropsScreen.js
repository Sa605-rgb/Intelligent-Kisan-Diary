// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
//   RefreshControl,
//   ScrollView,
//   Alert
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { farmerAPI } from '../services/api'; // ✅ API service import karein

// const NeighboursCropsScreen = ({ navigation }) => {
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [farmerId, setFarmerId] = useState(null);

//   // Farmer ID get karein AsyncStorage se
//   useEffect(() => {
//     const getFarmerId = async () => {
//       try {
//         const id = await AsyncStorage.getItem('farmerId');
//         if (id) {
//           setFarmerId(id);
//         } else {
//           setError('Farmer ID not found. Please login again.');
//         }
//       } catch (err) {
//         setError('Error fetching farmer ID');
//       }
//     };
//     getFarmerId();
//   }, []);

//   // API call karein
//   const fetchNeighboursCrops = async () => {
//     if (!farmerId) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const result = await farmerAPI.get5kmNeighboursCrops(farmerId);
      
//       if (result.success) {
//         setData(result);
//       } else {
//         setError(result.message || 'Error fetching neighbours data');
//         Alert.alert('Error', result.message || 'Unable to fetch data');
//       }
//     } catch (err) {
//       console.error('API Error:', err);
//       setError('Network error. Please check your connection.');
//       Alert.alert('Network Error', 'Please check your internet connection and try again.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Farmer ID milne par API call karein
//   useEffect(() => {
//     if (farmerId) {
//       fetchNeighboursCrops();
//     }
//   }, [farmerId]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchNeighboursCrops();
//   };

//   const renderCropItem = ({ item, index }) => (
//     <TouchableOpacity 
//       style={styles.cropCard}
//       onPress={() => {
//         // Crop details par navigate kar sakte hain
//         navigation.navigate('CropDetails', {
//           cropName: item.crop_name,
//           season: item.season
//         });
//       }}
//     >
//       <View style={styles.cropRank}>
//         <Text style={styles.rankText}>{index + 1}</Text>
//       </View>
      
//       <View style={styles.cropInfo}>
//         <View style={styles.cropHeader}>
//           <Text style={styles.cropName}>{item.crop_name}</Text>
//           <View style={[
//             styles.seasonBadge,
//             { backgroundColor: getSeasonColor(item.season) }
//           ]}>
//             <Text style={styles.seasonText}>{item.season}</Text>
//           </View>
//         </View>
        
//         <View style={styles.cropMeta}>
//           <View style={styles.metaItem}>
//             <Icon name="people" size={14} color="#666" />
//             <Text style={styles.metaText}>{item.crop_count} کاشتکار</Text>
//           </View>
          
//           {item.avg_yield && (
//             <View style={styles.metaItem}>
//               <Icon name="trending-up" size={14} color="#666" />
//               <Text style={styles.metaText}>
//                 {item.avg_yield.toFixed(1)} اوسط پیداوار
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>
      
//       <Icon name="chevron-right" size={24} color="#ccc" />
//     </TouchableOpacity>
//   );

//   const getSeasonColor = (season) => {
//     const colors = {
//       'Rabi': '#4CAF50',
//       'Kharif': '#FF9800',
//       'Summer': '#2196F3',
//       'Winter': '#9C27B0',
//       'Autumn': '#795548'
//     };
//     return colors[season] || '#9E9E9E';
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//         <Text style={styles.loadingText}>پڑوسیوں کی فصلیں لوڈ ہو رہی ہیں...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centerContainer}>
//         <Icon name="wifi-off" size={80} color="#f44336" />
//         <Text style={styles.errorTitle}>نیٹ ورک ایرر</Text>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity 
//           style={styles.retryButton} 
//           onPress={fetchNeighboursCrops}
//         >
//           <Icon name="refresh" size={20} color="#fff" />
//           <Text style={styles.retryText}>دوبارہ کوشش کریں</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton} 
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>پڑوسیوں کی فصلیں</Text>
//         <TouchableOpacity 
//           style={styles.infoButton}
//           onPress={() => Alert.alert(
//             'معلومات',
//             'یہ اسکرین 5 کلومیٹر کے دائرے میں آپ کے پڑوسی کسانوں کی مقبول فصلیں دکھاتی ہے۔'
//           )}
//         >
//           <Icon name="info-outline" size={22} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView 
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl 
//             refreshing={refreshing} 
//             onRefresh={onRefresh}
//             colors={['#4CAF50']}
//             tintColor="#4CAF50"
//           />
//         }
//       >
//         {/* Location Card */}
//         {data?.farmer_location && (
//           <View style={styles.locationCard}>
//             <Icon name="location-pin" size={28} color="#4CAF50" />
//             <View style={styles.locationDetails}>
//               <Text style={styles.locationArea}>{data.farmer_location.area}</Text>
//               <Text style={styles.locationCity}>{data.farmer_location.city}</Text>
//             </View>
//             <View style={styles.radiusContainer}>
//               <Text style={styles.radiusText}>{data.radius_km} کلومیٹر</Text>
//               <View style={styles.radiusCircle} />
//             </View>
//           </View>
//         )}

//         {/* Stats Cards */}
//         <View style={styles.statsContainer}>
//           <View style={styles.statCard}>
//             <Icon name="people" size={28} color="#4CAF50" />
//             <Text style={styles.statNumber}>{data?.neighbours_count || 0}</Text>
//             <Text style={styles.statLabel}>پڑوسی کسان</Text>
//           </View>
          
//           <View style={styles.statCard}>
//             <Icon name="spa" size={28} color="#4CAF50" />
//             <Text style={styles.statNumber}>{data?.popular_crops?.length || 0}</Text>
//             <Text style={styles.statLabel}>مختلف فصلیں</Text>
//           </View>
          
//           {data?.popular_crops?.[0] && (
//             <View style={styles.statCard}>
//               <Icon name="star" size={28} color="#FF9800" />
//               <Text style={styles.statNumber}>
//                 {data.popular_crops[0].crop_count}
//               </Text>
//               <Text style={styles.statLabel}>مقام: {data.popular_crops[0].crop_name}</Text>
//             </View>
//           )}
//         </View>

//         {/* Crops List */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>🌾 مقبول فصلیں</Text>
          
//           {data?.popular_crops?.length > 0 ? (
//             <FlatList
//               data={data.popular_crops}
//               renderItem={renderCropItem}
//               keyExtractor={(item, index) => `${item.crop_name}-${item.season}-${index}`}
//               scrollEnabled={false}
//               ItemSeparatorComponent={() => <View style={styles.separator} />}
//             />
//           ) : (
//             <View style={styles.emptyState}>
//               <Icon name="grass" size={70} color="#E0E0E0" />
//               <Text style={styles.emptyTitle}>کوئی فصل نہیں ملی</Text>
//               <Text style={styles.emptySubtitle}>
//                 5 کلومیٹر کے دائرے میں کوئی فصل نہیں ملی۔
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* Map Button */}
//         {data?.farmer_location && (
//           <TouchableOpacity 
//             style={styles.mapButton}
//             onPress={() => {
//               // Open map screen with location
//               navigation.navigate('NeighboursMap', {
//                 farmerLocation: data.farmer_location,
//                 radius: data.radius_km
//               });
//             }}
//           >
//             <Icon name="map" size={24} color="#fff" />
//             <Text style={styles.mapButtonText}>نقشہ دیکھیں</Text>
//           </TouchableOpacity>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fa' },
//   centerContainer: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     padding: 20,
//     backgroundColor: '#f8f9fa'
//   },
  
//   // Header
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 16,
//     paddingTop: 50,
//     paddingBottom: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)'
//   },
//   headerTitle: { 
//     color: '#fff', 
//     fontSize: 20, 
//     fontWeight: 'bold',
//     textAlign: 'center',
//     flex: 1,
//     marginHorizontal: 10
//   },
//   infoButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)'
//   },
  
//   // Scroll Content
//   scrollContent: { paddingBottom: 30 },
  
//   // Location Card
//   locationCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     margin: 16,
//     padding: 16,
//     borderRadius: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   locationDetails: { 
//     flex: 1, 
//     marginLeft: 12 
//   },
//   locationArea: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     color: '#333',
//     marginBottom: 2
//   },
//   locationCity: { 
//     fontSize: 14, 
//     color: '#666' 
//   },
//   radiusContainer: { 
//     alignItems: 'center' 
//   },
//   radiusText: { 
//     fontSize: 12, 
//     color: '#4CAF50', 
//     fontWeight: 'bold',
//     marginBottom: 4
//   },
//   radiusCircle: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 3,
//     borderColor: '#4CAF50',
//     borderStyle: 'dashed'
//   },
  
//   // Stats
//   statsContainer: {
//     flexDirection: 'row',
//     marginHorizontal: 16,
//     marginBottom: 20,
//     justifyContent: 'space-between'
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 16,
//     alignItems: 'center',
//     marginHorizontal: 4,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   statNumber: { 
//     fontSize: 24, 
//     fontWeight: 'bold', 
//     color: '#333',
//     marginVertical: 8
//   },
//   statLabel: { 
//     fontSize: 12, 
//     color: '#666', 
//     textAlign: 'center'
//   },
  
//   // Section
//   section: { 
//     marginHorizontal: 16 
//   },
//   sectionTitle: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     color: '#333',
//     marginBottom: 16,
//     textAlign: 'right'
//   },
  
//   // Crop Card
//   cropCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//   },
//   cropRank: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#4CAF50',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   rankText: { 
//     color: '#fff', 
//     fontWeight: 'bold', 
//     fontSize: 16 
//   },
//   cropInfo: { 
//     flex: 1, 
//     marginLeft: 16 
//   },
//   cropHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8
//   },
//   cropName: { 
//     fontSize: 17, 
//     fontWeight: 'bold', 
//     color: '#333',
//     flex: 1
//   },
//   seasonBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginLeft: 8
//   },
//   seasonText: { 
//     color: '#fff', 
//     fontSize: 11, 
//     fontWeight: 'bold' 
//   },
//   cropMeta: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap' 
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//     marginBottom: 4
//   },
//   metaText: { 
//     fontSize: 13, 
//     color: '#666', 
//     marginLeft: 4 
//   },
//   separator: { 
//     height: 10 
//   },
  
//   // Empty State
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 40,
//     paddingHorizontal: 20,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     elevation: 1,
//   },
//   emptyTitle: { 
//     fontSize: 18, 
//     color: '#666', 
//     marginTop: 16,
//     marginBottom: 8
//   },
//   emptySubtitle: { 
//     fontSize: 14, 
//     color: '#999', 
//     textAlign: 'center'
//   },
  
//   // Map Button
//   mapButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#2196F3',
//     marginHorizontal: 16,
//     marginTop: 20,
//     padding: 16,
//     borderRadius: 12,
//     elevation: 2,
//   },
//   mapButtonText: { 
//     color: '#fff', 
//     fontSize: 16, 
//     fontWeight: 'bold',
//     marginLeft: 8
//   },
  
//   // Loading & Error
//   loadingText: { 
//     marginTop: 16, 
//     color: '#666', 
//     fontSize: 16 
//   },
//   errorTitle: { 
//     fontSize: 20, 
//     color: '#f44336', 
//     fontWeight: 'bold',
//     marginTop: 16,
//     marginBottom: 8
//   },
//   errorText: { 
//     fontSize: 16, 
//     color: '#666', 
//     textAlign: 'center',
//     marginBottom: 24
//   },
//   retryButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   retryText: { 
//     color: '#fff', 
//     fontSize: 16, 
//     fontWeight: 'bold',
//     marginLeft: 8
//   }
// });

// export default NeighboursCropsScreen;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const NeighboursCropsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState(null);
  
  // Complete Dummy Data
  const dummyData = {
    success: true,
    message: "Neighbours crops data fetched successfully",
    radius_km: 5,
    farmer_location: {
      city: "راولپنڈی",
      area: "گجر خان پہاڑی علاقہ",
      zone: "بارانی علاقہ",
      coordinates: {
        lat: 33.2655,
        lng: 73.3001
      }
    },
    neighbours_count: 48,
    total_crops: 15,
    popular_crops: [
      {
        crop_id: 1,
        crop_name: "گندم",
        variety: "گلیکسی-2013",
        season: "Rabi",
        crop_count: 38,
        avg_yield: 45.2,
        percentage: 79.2,
        icon: "🌾",
        color: "#4CAF50",
        description: "سردیوں کی اہم فصل، بارانی علاقوں کے لیے موزوں",
        suitable_areas: ["بارانی علاقے", "نیم بارانی علاقے"],
        sowing_time: "نومبر - دسمبر",
        harvest_time: "اپریل - مئی",
        farmers_using: [
          { id: 1, name: "محمد حسین", distance: "0.8 کلومیٹر", rating: 4.5 },
          { id: 2, name: "راشد محمود", distance: "1.2 کلومیٹر", rating: 4.2 },
          { id: 3, name: "شفیق احمد", distance: "2.5 کلومیٹر", rating: 4.0 },
          { id: 4, name: "طارق محمود", distance: "1.8 کلومیٹر", rating: 4.3 }
        ]
      },
      {
        crop_id: 2,
        crop_name: "چاول",
        variety: "سپر بسمتی",
        season: "Kharif",
        crop_count: 22,
        avg_yield: 38.5,
        percentage: 45.8,
        icon: "🍚",
        color: "#FF9800",
        description: "گرمیوں کی اہم فصل، پانی والے علاقوں کے لیے",
        suitable_areas: ["نہری علاقے", "ٹیوب ویل علاقے"],
        sowing_time: "جون - جولائی",
        harvest_time: "اکتوبر - نومبر",
        farmers_using: [
          { id: 5, name: "عارف جاوید", distance: "1.5 کلومیٹر", rating: 4.7 },
          { id: 6, name: "سلیم بٹ", distance: "3.0 کلومیٹر", rating: 4.4 }
        ]
      },
      {
        crop_id: 3,
        crop_name: "مکئی",
        variety: "نیلم-2016",
        season: "Kharif",
        crop_count: 18,
        avg_yield: 62.3,
        percentage: 37.5,
        icon: "🌽",
        color: "#FF9800",
        description: "چارے اور دانے دونوں کے لیے استعمال",
        suitable_areas: ["بارانی علاقے", "نیم بارانی علاقے"],
        sowing_time: "جولائی - اگست",
        harvest_time: "اکتوبر - نومبر",
        farmers_using: [
          { id: 7, name: "جمیل احمد", distance: "2.0 کلومیٹر", rating: 4.6 },
          { id: 8, name: "نوید اقبال", distance: "4.2 کلومیٹر", rating: 4.1 }
        ]
      },
      {
        crop_id: 4,
        crop_name: "سرسوں",
        variety: "فیصل سرسوں",
        season: "Rabi",
        crop_count: 15,
        avg_yield: 22.1,
        percentage: 31.2,
        icon: "🌱",
        color: "#4CAF50",
        description: "تیل والی فصل، کم پانی کی ضرورت",
        suitable_areas: ["بارانی علاقے", "سیم زدہ علاقے"],
        sowing_time: "اکتوبر - نومبر",
        harvest_time: "مارچ - اپریل",
        farmers_using: [
          { id: 9, name: "طارق محمود", distance: "1.8 کلومیٹر", rating: 4.3 },
          { id: 10, name: "ذوالفقار علی", distance: "3.5 کلومیٹر", rating: 4.0 }
        ]
      },
      {
        crop_id: 5,
        crop_name: "چنے",
        variety: "پنجاب چنے-2008",
        season: "Rabi",
        crop_count: 12,
        avg_yield: 18.5,
        percentage: 25.0,
        icon: "🥜",
        color: "#4CAF50",
        description: "دالوں کی اہم فصل، پروٹین سے بھرپور",
        suitable_areas: ["بارانی علاقے"],
        sowing_time: "اکتوبر - نومبر",
        harvest_time: "مارچ - اپریل",
        farmers_using: [
          { id: 11, name: "اسد علی", distance: "2.8 کلومیٹر", rating: 4.2 },
          { id: 12, name: "عمران ہاشمی", distance: "4.0 کلومیٹر", rating: 4.5 }
        ]
      },
      {
        crop_id: 6,
        crop_name: "آلو",
        variety: "دیسی آلو",
        season: "Rabi",
        crop_count: 10,
        avg_yield: 120.5,
        percentage: 20.8,
        icon: "🥔",
        color: "#4CAF50",
        description: "سبزیوں کی اہم فصل، مارکیٹ میں مانگ",
        suitable_areas: ["نہری علاقے", "ٹیوب ویل علاقے"],
        sowing_time: "ستمبر - اکتوبر",
        harvest_time: "دسمبر - جنوری",
        farmers_using: [
          { id: 13, name: "فضل کرم", distance: "3.2 کلومیٹر", rating: 4.6 },
          { id: 14, name: "حمید بھٹی", distance: "4.5 کلومیٹر", rating: 4.4 }
        ]
      }
    ],
    nearby_farmers: [
      {
        id: 1,
        name: "محمد حسین",
        distance: 0.8,
        crops: ["گندم", "چاول"],
        total_lands: 3,
        experience: "15 سال",
        rating: 4.5,
        location: "گجر خان پہاڑی علاقہ",
        total_crops: 5
      },
      {
        id: 2,
        name: "راشد محمود",
        distance: 1.2,
        crops: ["گندم", "مکئی"],
        total_lands: 2,
        experience: "12 سال",
        rating: 4.2,
        location: "گجر خان میدانی علاقہ",
        total_crops: 4
      },
      {
        id: 3,
        name: "عارف جاوید",
        distance: 1.5,
        crops: ["چاول", "سبزیاں"],
        total_lands: 4,
        experience: "18 سال",
        rating: 4.7,
        location: "چکری ٹیوب ویل علاقہ",
        total_crops: 7
      },
      {
        id: 4,
        name: "جمیل احمد",
        distance: 2.0,
        crops: ["مکئی", "گندم", "سرسوں"],
        total_lands: 5,
        experience: "20 سال",
        rating: 4.8,
        location: "راولپنڈی پری اربن",
        total_crops: 9
      }
    ],
    categories: [
      { id: 'all', name: 'تمام فصلیں', count: 15, icon: '🌾' },
      { id: 'rabi', name: 'ربیع', count: 8, icon: '❄️' },
      { id: 'kharif', name: 'خریف', count: 7, icon: '☀️' },
      { id: 'vegetables', name: 'سبزیاں', count: 3, icon: '🥦' },
      { id: 'fruits', name: 'پھل', count: 2, icon: '🍎' }
    ],
    zone_info: {
      zone_name: "بارانی علاقہ",
      description: "بارش پر منحصر کاشتکاری",
      suitable_crops: ["گندم", "چنے", "سرسوں", "جو", "مکئی"],
      rainfall: "500-800 ملی میٹر",
      soil_type: "چکنی مٹی",
      irrigation: "بارش پر انحصار",
      challenges: ["پانی کی کمی", "بارش کا غیر یقینی ہونا"],
      recommendations: ["خشک سالی برداشت اقسام کا استعمال", "پانی بچانے والی تکنیک"]
    },
    statistics: {
      top_crop: "گندم",
      top_crop_percentage: 79.2,
      average_yield: 42.8,
      most_common_season: "Rabi",
      farmers_per_sqkm: 9.6
    }
  };

  // Filter crops based on selected category
  const filteredCrops = selectedCategory === 'all' 
    ? dummyData.popular_crops 
    : selectedCategory === 'rabi'
    ? dummyData.popular_crops.filter(crop => crop.season === 'Rabi')
    : selectedCategory === 'kharif'
    ? dummyData.popular_crops.filter(crop => crop.season === 'Kharif')
    : dummyData.popular_crops;

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const renderCropItem = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.cropCard}
      onPress={() => setSelectedCrop(item)}
      activeOpacity={0.7}
    >
      {/* Rank and Icon */}
      <View style={styles.cropLeft}>
        <View style={[
          styles.rankBadge,
          { backgroundColor: index < 3 ? item.color : '#9E9E9E' }
        ]}>
          <Text style={styles.rankText}>{index + 1}</Text>
        </View>
        <Text style={styles.cropIcon}>{item.icon}</Text>
      </View>
      
      {/* Crop Info */}
      <View style={styles.cropCenter}>
        <View style={styles.cropHeader}>
          <Text style={styles.cropName}>{item.crop_name}</Text>
          <View style={[styles.seasonBadge, { backgroundColor: item.color }]}>
            <Text style={styles.seasonText}>{item.season === 'Rabi' ? 'ربیع' : 'خریف'}</Text>
          </View>
        </View>
        <Text style={styles.cropVariety}>{item.variety}</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.percentageLabel}>{item.percentage}% کاشتکار</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${item.percentage}%`,
                  backgroundColor: item.color
                }
              ]} 
            />
          </View>
        </View>
        
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.stat}>
            <Icon name="people" size={14} color="#666" />
            <Text style={styles.statText}>{item.crop_count}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="trending-up" size={14} color="#666" />
            <Text style={styles.statText}>{item.avg_yield}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="location-on" size={14} color="#666" />
            <Text style={styles.statText}>{item.farmers_using.length}</Text>
          </View>
        </View>
      </View>
      
      {/* Arrow */}
      <Icon name="chevron-right" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={[
        styles.categoryName,
        selectedCategory === category.id && styles.categoryNameActive
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFarmerItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.farmerCard}
      onPress={() => navigation.navigate('FarmerProfile', { farmer: item })}
    >
      <View style={styles.farmerLeft}>
        <View style={styles.farmerAvatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Icon name="star" size={12} color="#FF9800" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      
      <View style={styles.farmerInfo}>
        <Text style={styles.farmerName}>{item.name}</Text>
        <View style={styles.farmerDetails}>
          <View style={styles.detailItem}>
            <Icon name="location-on" size={12} color="#666" />
            <Text style={styles.detailText}>{item.distance} کلومیٹر</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="agriculture" size={12} color="#666" />
            <Text style={styles.detailText}>{item.experience}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="layers" size={12} color="#666" />
            <Text style={styles.detailText}>{item.total_lands} زمینیں</Text>
          </View>
        </View>
        <Text style={styles.farmerLocation}>{item.location}</Text>
        <View style={styles.cropsList}>
          {item.crops.map((crop, idx) => (
            <View key={idx} style={styles.cropChip}>
              <Text style={styles.cropChipText}>{crop}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Crop Detail Modal
  const CropDetailModal = () => {
    if (!selectedCrop) return null;
    
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedCrop.crop_name}</Text>
            <TouchableOpacity onPress={() => setSelectedCrop(null)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            {/* Basic Info */}
            <View style={styles.modalSection}>
              <View style={styles.modalRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>قسم</Text>
                  <Text style={styles.infoValue}>{selectedCrop.variety}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>موسم</Text>
                  <Text style={styles.infoValue}>
                    {selectedCrop.season === 'Rabi' ? 'ربیع' : 'خریف'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.modalRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>اوسط پیداوار</Text>
                  <Text style={styles.infoValue}>{selectedCrop.avg_yield} کلو/ایکڑ</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>مقبولیت</Text>
                  <Text style={styles.infoValue}>{selectedCrop.percentage}%</Text>
                </View>
              </View>
            </View>
            
            {/* Description */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>تفصیل</Text>
              <Text style={styles.descriptionText}>{selectedCrop.description}</Text>
            </View>
            
            {/* Timing */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>وقت</Text>
              <View style={styles.timingContainer}>
                <View style={styles.timingItem}>
                  <Icon name="date-range" size={18} color="#4CAF50" />
                  <Text style={styles.timingText}>کاشت: {selectedCrop.sowing_time}</Text>
                </View>
                <View style={styles.timingItem}>
                  <Icon name="agriculture" size={18} color="#FF9800" />
                  <Text style={styles.timingText}>کٹائی: {selectedCrop.harvest_time}</Text>
                </View>
              </View>
            </View>
            
            {/* Suitable Areas */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>موزوں علاقے</Text>
              <View style={styles.chipsContainer}>
                {selectedCrop.suitable_areas.map((area, idx) => (
                  <View key={idx} style={styles.areaChip}>
                    <Text style={styles.areaChipText}>{area}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Farmers Using This Crop */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>
                {selectedCrop.farmers_using.length} کاشتکار استعمال کر رہے ہیں
              </Text>
              {selectedCrop.farmers_using.slice(0, 3).map((farmer) => (
                <View key={farmer.id} style={styles.farmerItem}>
                  <View style={styles.farmerIcon}>
                    <Text style={styles.farmerIconText}>{farmer.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.farmerDetails}>
                    <Text style={styles.farmerName}>{farmer.name}</Text>
                    <Text style={styles.farmerMeta}>{farmer.distance} • ریٹنگ: {farmer.rating}</Text>
                  </View>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>ملاحظہ کریں</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            
            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => {
                  setSelectedCrop(null);
                  navigation.navigate('CropInputPage', { cropName: selectedCrop.crop_name });
                }}
              >
                <Icon name="add" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>یہ فصل لگائیں</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setSelectedCrop(null)}
              >
                <Text style={styles.secondaryButtonText}>بند کریں</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>پڑوسیوں کی فصلیں لوڈ ہو رہی ہیں...</Text>
        <Text style={styles.loadingSubtext}>5 کلومیٹر کے دائرے میں تلاش جاری ہے</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>پڑوسیوں کی فصلیں</Text>
          <Text style={styles.headerSubtitle}>5 کلومیٹر کے دائرے میں</Text>
        </View>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => Alert.alert(
            'معلومات',
            'یہ اسکرین 5 کلومیٹر کے دائرے میں آپ کے پڑوسی کسانوں کی مقبول فصلیں دکھاتی ہے۔ فصلیں مقبولیت کے حساب سے ترتیب دی گئی ہیں۔'
          )}
        >
          <Icon name="info" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
        style={styles.scrollView}
      >
        {/* Location Card */}
        <View style={styles.locationCard}>
          <Icon name="my-location" size={24} color="#4CAF50" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationArea}>{dummyData.farmer_location.area}</Text>
            <View style={styles.locationMeta}>
              <View style={styles.metaItem}>
                <Icon name="place" size={14} color="#666" />
                <Text style={styles.metaText}>{dummyData.farmer_location.city}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="settings" size={14} color="#666" />
                <Text style={styles.metaText}>{dummyData.farmer_location.zone}</Text>
              </View>
            </View>
          </View>
          <View style={styles.radiusBadge}>
            <Text style={styles.radiusText}>{dummyData.radius_km} کلومیٹر</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon name="people" size={28} color="#4CAF50" />
            <Text style={styles.statNumber}>{dummyData.neighbours_count}</Text>
            <Text style={styles.statLabel}>پڑوسی کسان</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="spa" size={28} color="#FF9800" />
            <Text style={styles.statNumber}>{dummyData.total_crops}</Text>
            <Text style={styles.statLabel}>فصلیں</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="trending-up" size={28} color="#2196F3" />
            <Text style={styles.statNumber}>{dummyData.statistics.average_yield}</Text>
            <Text style={styles.statLabel}>اوسط پیداوار</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="star" size={28} color="#FF9800" />
            <Text style={styles.statNumber}>{dummyData.statistics.top_crop_percentage}%</Text>
            <Text style={styles.statLabel}>{dummyData.statistics.top_crop}</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>فصلوں کی اقسام</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {dummyData.categories.map(renderCategoryButton)}
          </ScrollView>
        </View>

        {/* Popular Crops */}
        <View style={styles.cropsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'تمام مقبول فصلیں' : 
               selectedCategory === 'rabi' ? 'ربیع فصلیں' :
               selectedCategory === 'kharif' ? 'خریف فصلیں' : 'سبزیاں'}
            </Text>
            <Text style={styles.cropsCount}>{filteredCrops.length} فصلیں</Text>
          </View>
          
          {filteredCrops.length > 0 ? (
            <FlatList
              data={filteredCrops}
              renderItem={renderCropItem}
              keyExtractor={(item) => item.crop_id.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="grass" size={60} color="#E0E0E0" />
              <Text style={styles.emptyText}>اس زمرے میں کوئی فصل نہیں ملی</Text>
            </View>
          )}
        </View>

        {/* Nearby Farmers */}
        <View style={styles.farmersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>قریبی کسان</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>سب دیکھیں</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={dummyData.nearby_farmers}
            renderItem={renderFarmerItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.farmersList}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />
        </View>

        {/* Zone Info */}
        <View style={styles.zoneSection}>
          <View style={styles.zoneHeader}>
            <Icon name="landscape" size={24} color="#2196F3" />
            <Text style={styles.zoneTitle}>علاقے کی معلومات</Text>
          </View>
          
          <View style={styles.zoneCard}>
            <Text style={styles.zoneName}>{dummyData.zone_info.zone_name}</Text>
            <Text style={styles.zoneDescription}>{dummyData.zone_info.description}</Text>
            
            <View style={styles.zoneDetails}>
              <View style={styles.detailRow}>
                <Icon name="water-drop" size={16} color="#2196F3" />
                <Text style={styles.detailText}>بارش: {dummyData.zone_info.rainfall}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="terrain" size={16} color="#795548" />
                <Text style={styles.detailText}>مٹی: {dummyData.zone_info.soil_type}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="opacity" size={16} color="#00BCD4" />
                <Text style={styles.detailText}>آبپاشی: {dummyData.zone_info.irrigation}</Text>
              </View>
            </View>
            
            <Text style={styles.suitableTitle}>موزوں فصلیں:</Text>
            <View style={styles.suitableCrops}>
              {dummyData.zone_info.suitable_crops.map((crop, idx) => (
                <View key={idx} style={styles.cropTag}>
                  <Text style={styles.cropTagText}>{crop}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert(
              'موازنہ',
              'فصلوں کا موازنہ فیچر جلد ہی دستیاب ہوگا'
            )}
          >
            <Icon name="compare" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>فصلوں کا موازنہ</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => navigation.navigate('PublicFeedScreen')}
          >
            <Icon name="people" size={20} color="#4CAF50" />
            <Text style={[styles.actionButtonText, styles.secondaryActionText]}>
              تمام کسان دیکھیں
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Crop Detail Modal */}
      <CropDetailModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold'
  },
  headerSubtitle: { 
    color: 'rgba(255,255,255,0.9)', 
    fontSize: 12,
    marginTop: 2
  },
  infoButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  
  // ScrollView
  scrollView: {
    flex: 1,
  },
  
  // Location Card
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12
  },
  locationArea: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  locationMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  radiusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  radiusText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 16
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    marginHorizontal: 4,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  
  // Categories
  categoriesSection: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    marginBottom: 12
  },
  categoriesContainer: {
    paddingHorizontal: 12
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50'
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6
  },
  categoryName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  categoryNameActive: {
    color: '#fff',
    fontWeight: 'bold'
  },
  
  // Crops Section
  cropsSection: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12
  },
  cropsCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  
  // Crop Card
  cropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cropLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  cropIcon: {
    fontSize: 28
  },
  cropCenter: {
    flex: 1
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  cropName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  seasonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8
  },
  seasonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  cropVariety: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8
  },
  progressContainer: {
    marginBottom: 8
  },
  percentageLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 3
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  separator: {
    height: 10
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12
  },
  
  // Farmers Section
  farmersSection: {
    marginBottom: 24
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500'
  },
  farmersList: {
    paddingHorizontal: 16
  },
  farmerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: width * 0.8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  farmerLeft: {
    marginRight: 12,
    alignItems: 'center'
  },
  farmerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  ratingText: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: 'bold',
    marginLeft: 2
  },
  farmerInfo: {
    flex: 1
  },
  farmerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  farmerDetails: {
    flexDirection: 'row',
    marginBottom: 4
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12
  },
  detailText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4
  },
  farmerLocation: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8
  },
  cropsList: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  cropChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4
  },
  cropChipText: {
    fontSize: 10,
    color: '#666'
  },
  
  // Zone Section
  zoneSection: {
    marginBottom: 24
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12
  },
  zoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8
  },
  zoneCard: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3'
  },
  zoneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8
  },
  zoneDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12
  },
  zoneDetails: {
    marginBottom: 12
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  detailText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 8
  },
  suitableTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  suitableCrops: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  cropTag: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8
  },
  cropTagText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500'
  },
  
  // Actions Container
  actionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 30
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
  secondaryAction: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4CAF50'
  },
  secondaryActionText: {
    color: '#4CAF50'
  },
  
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  modalBody: {
    padding: 20
  },
  modalSection: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  modalRow: {
    flexDirection: 'row',
    marginBottom: 12
  },
  infoItem: {
    flex: 1
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500'
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  timingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4
  },
  timingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  areaChip: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8
  },
  areaChipText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500'
  },
  farmerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  farmerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  farmerIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  farmerDetails: {
    flex: 1
  },
  farmerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2
  },
  farmerMeta: {
    fontSize: 12,
    color: '#666'
  },
  viewButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  viewButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold'
  },
  modalActions: {
    marginTop: 20
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
  secondaryButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500'
  },
  
  // Loading
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
    fontWeight: '500'
  },
  loadingSubtext: {
    marginTop: 8,
    color: '#999',
    fontSize: 14
  }
});

export default NeighboursCropsScreen;