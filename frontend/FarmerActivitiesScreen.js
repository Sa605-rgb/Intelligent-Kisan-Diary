
// // yeh wali screeen meri yield jab harest ma show krwati hn wo wali hai 

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   BackHandler
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';
// import { farmerAPI, activityAPI } from './api';
// import T from './localization/T';  // Smart Translation Component

// const FarmerActivitiesScreen = ({ navigation }) => {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [farmerId, setFarmerId] = useState(null);
//   const [farmerName, setFarmerName] = useState('');
//   const [togglingPrivacy, setTogglingPrivacy] = useState({});  // Track which activities are being toggled
  
//   // State for expanded sections
//   const [expandedYears, setExpandedYears] = useState({});
//   const [expandedSeasons, setExpandedSeasons] = useState({});
//   const [expandedCrops, setExpandedCrops] = useState({});

//   // useFocusEffect: Jab bhi screen focus ho, data reload ho jaaye
//   useFocusEffect(
//     useCallback(() => {
//       loadFarmerActivities();
//     }, [])
//   );

//   // Hardware Back Button → AddMoreEntry
//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         navigation.navigate('AddMoreEntry');
//         return true; // Prevent default back behavior
//       };

//       const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
//       return () => subscription.remove();
//     }, [navigation])
//   );

//   // Helper: Current season determine karo based on month
//   const getCurrentSeason = () => {
//     const month = new Date().getMonth(); // 0-11
//     // Rabi: Oct(9) - Mar(2), Kharif: Apr(3) - Sep(8)
//     if (month >= 9 || month <= 2) {
//       return 'Rabi';
//     }
//     return 'Kharif';
//   };

//   const loadFarmerActivities = async () => {
//     try {
//       const savedFarmerId = await AsyncStorage.getItem('farmerId');
//       if (!savedFarmerId) {
//         Alert.alert('Error', 'Farmer ID not found. Please login again.');
//         navigation.goBack();
//         return;
//       }

//       setFarmerId(parseInt(savedFarmerId));
      
//       const response = await farmerAPI.getFarmerAllActivities(parseInt(savedFarmerId));
      
//       // DEBUG: Dekho API se kya data aa raha hai
//       console.log(' FarmerActivities API Response:', response);
//       console.log(' Total activities:', response.activities?.length);
//       console.log(' Seasons in data:', [...new Set(response.activities?.map(a => a.season))]);
      
//       if (response.success) {
//         setActivities(response.activities);
//         setFarmerName(response.farmer_name);
        
//         // Auto-expand current year
//         const currentYear = new Date().getFullYear();
//         setExpandedYears({ [currentYear]: true });
        
//         // Auto-expand current season bhi (Rabi ya Kharif)
//         const currentSeason = getCurrentSeason();
//         setExpandedSeasons({ [`${currentYear}-${currentSeason}`]: true });
//       } else {
//         Alert.alert('Error', 'Failed to load activities');
//       }
//     } catch (error) {
//       console.error('Error loading activities:', error);
//       Alert.alert('Error', 'Failed to load activities');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadFarmerActivities();
//   };

//   // Group activities by year, season, and crop
//     const groupedActivities = activities.reduce((acc, activity) => {
//     const date = new Date(activity.activity_date);
//     let year = date.getFullYear();

//     // Rabi season usually Oct–Mar hota hai
//     if (activity.season === 'Rabi' && date.getMonth() <= 5) {
//       year = year - 1;
//     }

//     const season = activity.season || 'Unknown';
//     const cropName = activity.crop_name;

//     if (!acc[year]) acc[year] = {};
//     if (!acc[year][season]) acc[year][season] = {};
//     if (!acc[year][season][cropName]) acc[year][season][cropName] = [];

//     acc[year][season][cropName].push(activity);
//     return acc;
//   }, {});

//   // Current year mein Rabi aur Kharif HAMESHA show hon (chahe empty hon)
//   const currentYear = new Date().getFullYear();
//   if (!groupedActivities[currentYear]) {
//     groupedActivities[currentYear] = {};
//   }
//   if (!groupedActivities[currentYear]['Rabi']) {
//     groupedActivities[currentYear]['Rabi'] = {}; // Empty Rabi season
//   }
//   if (!groupedActivities[currentYear]['Kharif']) {
//     groupedActivities[currentYear]['Kharif'] = {}; // Empty Kharif season
//   }

//   // yeh line zaroor honi chahiye
//   const years = Object.keys(groupedActivities).sort((a, b) => b - a);
//     const toggleYear = (year) => {
//     setExpandedYears(prev => ({
//       ...prev,
//       [year]: !prev[year],
//     }));
//   };
//   const toggleSeason = (year, season) => {
//     const key = `${year}-${season}`;
//     setExpandedSeasons(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const toggleCrop = (year, season, crop) => {
//     const key = `${year}-${season}-${crop}`;
//     setExpandedCrops(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getActivityIcon = (activityType) => {
//     switch (activityType) {
//       case 'Sowing':
//         return '';
//       case 'Fertilization':
//         return '';
//       case 'Pest Control':
//         return '';
//       case 'Expected Harvest':
//         return '';
//       case 'Harvest':
//         return '';
//       case 'Irrigation':
//         return '';
//       case 'Weeding':
//         return '';
//       case 'Plowing':
//         return '';
//       case 'Spraying':
//         return '';
//       case 'Post Harvest':
//         return '';
//       default:
//         return '';
//     }
//   };

//   // Display label mapping (database name → display name)
//   const getDisplayActivityType = (activityType) => {
//     const displayMap = {
//       'Plowing': 'Land Preparation',
//       'Spraying': 'Pest Control',
//     };
//     return displayMap[activityType] || activityType;
//   };

//   // Toggle Public/Private for an activity
//   const toggleActivityPrivacy = async (activityId, currentIsPublic) => {
//     try {
//       setTogglingPrivacy(prev => ({ ...prev, [activityId]: true }));
      
//       const newIsPublic = !currentIsPublic;
//       console.log(` Toggling activity ${activityId} to ${newIsPublic ? 'Public' : 'Private'}`);
      
//       const response = await activityAPI.updateActivityPrivacy(activityId, newIsPublic);
      
//       if (response.success) {
//         // Update local state
//         setActivities(prev => prev.map(activity => 
//           activity.id === activityId 
//             ? { ...activity, is_public: newIsPublic }
//             : activity
//         ));
        
//         Alert.alert(
//           'Success', 
//           newIsPublic 
//             ? ' Activity is now Public! It will appear in Public Feed.' 
//             : ' Activity is now Private.'
//         );
//       } else {
//         Alert.alert('Error', response.message || 'Failed to update privacy');
//       }
//     } catch (error) {
//       console.error('Error toggling privacy:', error);
//       Alert.alert('Error', 'Failed to update privacy setting');
//     } finally {
//       setTogglingPrivacy(prev => ({ ...prev, [activityId]: false }));
//     }
//   };

//   // Activity sequence order for sorting
//   const getActivitySequence = (activityType) => {
//     const sequenceMap = {
//       'Plowing': 1,
//       'Land Preparation': 1,
//       'Sowing': 2,
//       'Irrigation': 3,
//       'Fertilization': 4,
//       'Spraying': 5,
//       'Pest Control': 5,
//       'Weeding': 6,
//       'Harvesting': 7,
//     };
//     return sequenceMap[activityType] || 99;
//   };

//   // Sort activities by farming sequence, then by date
//   const sortActivitiesBySequence = (activities) => {
//     return [...activities].sort((a, b) => {
//       const seqA = getActivitySequence(a.activity_type);
//       const seqB = getActivitySequence(b.activity_type);
      
//       if (seqA !== seqB) {
//         return seqA - seqB; // Sort by sequence first
//       }
//       // Same sequence, sort by date
//       return new Date(a.activity_date) - new Date(b.activity_date);
//     });
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#2E7D32" />
//         <T style={styles.loadingText}>Loading activities...</T>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header removed */}
      
//       <ScrollView
//         contentContainerStyle={styles.scrollContainer}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {/* Farmer Info */}
//         <View style={styles.farmerInfo}>
//           <Text style={styles.farmerName}>{farmerName}</Text>
//           <Text style={styles.activitiesCount}>
//             {activities.length} activities across {years.length} years
//           </Text>
//         </View>

//         {/* Activities List by Year > Season > Crop */}
//         {years.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Icon name="agriculture" size={64} color="#ccc" />
//             <T style={styles.emptyText}>No activities found</T>
//             <T style={styles.emptySubtext}>Start by adding crops to your lands</T>
//             <TouchableOpacity 
//               style={styles.addCropButton}
//               onPress={() => navigation.navigate('CropInput')}
//             >
//               <T style={styles.addCropButtonText}>Add Your First Crop</T>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           years.map(year => (
//             <View key={year} style={styles.yearSection}>
//               {/* Year Header */}
//               <TouchableOpacity 
//                 style={styles.yearHeader}
//                 onPress={() => toggleYear(year)}
//               >
//                 <Text style={styles.yearText}> {year}</Text>
//                 <Icon 
//                   name={expandedYears[year] ? "expand-less" : "expand-more"} 
//                   size={24} 
//                   color="#666" 
//                 />
//               </TouchableOpacity>

//               {/* Seasons List */}
//               {expandedYears[year] && Object.keys(groupedActivities[year]).map(season => (
//                 <View key={season} style={styles.seasonSection}>
//                   {/* Season Header */}
//                   <TouchableOpacity 
//                     style={styles.seasonHeader}
//                     onPress={() => toggleSeason(year, season)}
//                   >
//                     <T style={styles.seasonText}>
//                       {season === 'Rabi' ? ' Rabi Season' : ' Kharif Season'}
//                     </T>
//                     <Icon 
//                       name={expandedSeasons[`${year}-${season}`] ? "expand-less" : "expand-more"} 
//                       size={20} 
//                       color="#666" 
//                     />
//                   </TouchableOpacity>

//                   {/* Crops List */}
//                   {expandedSeasons[`${year}-${season}`] && (
//                     Object.keys(groupedActivities[year][season]).length === 0 ? (
//                       // Empty Season Message
//                       <View style={styles.emptySeasonContainer}>
//                         <Text style={styles.emptySeasonText}>
//                            No {season} crops yet
//                         </Text>
//                         <T style={styles.emptySeasonSubtext}>Add crop and complete activities</T>
//                       </View>
//                     ) : (
//                       Object.keys(groupedActivities[year][season]).map(crop => (
//                     <View key={crop} style={styles.cropSection}>
//                       {/* Crop Header */}
//                       <TouchableOpacity 
//                         style={styles.cropHeader}
//                         onPress={() => toggleCrop(year, season, crop)}
//                       >
//                         <Text style={styles.cropText}> {crop}</Text>
//                         <Icon 
//                           name={expandedCrops[`${year}-${season}-${crop}`] ? "expand-less" : "expand-more"} 
//                           size={18} 
//                           color="#666" 
//                         />
//                       </TouchableOpacity>

//                       {/* Activities List for this Crop */}
//                       {expandedCrops[`${year}-${season}-${crop}`] && (
//                         <View style={styles.activitiesList}>
//                           {sortActivitiesBySequence(groupedActivities[year][season][crop])
//                             .map(activity => (
//                               <View key={activity.id} style={styles.activityCard}>
//                                 <View style={styles.activityHeader}>
//                                   <Text style={styles.activityIcon}>
//                                     {getActivityIcon(activity.activity_type)}
//                                   </Text>
//                                   <View style={styles.activityHeaderText}>
//                                     <Text style={styles.activityType}>
//                                       {getDisplayActivityType(activity.activity_type)}
//                                     </Text>
//                                     <Text style={styles.activityDate}>
//                                       {formatDate(activity.activity_date)}
//                                     </Text>
//                                   </View>
//                                   {/* Show Profit/Loss badge for Harvesting */}
//                                   {activity.activity_type === 'Harvesting' && activity.isCompleted && activity.yield_per_40kg && (
//                                     <View style={[
//                                       styles.profitBadge,
//                                       (activity.yield_per_40kg * 2000 - (activity.total_cost || 0)) >= 0 
//                                         ? styles.profitBadgeBg 
//                                         : styles.lossBadgeBg
//                                     ]}>
//                                       <Text style={styles.profitBadgeText}>
//                                         {(() => {
//                                           const income = activity.yield_per_40kg * 2000;
//                                           const cost = activity.total_cost || 0;
//                                           const profit = income - cost;
//                                           const percent = cost > 0 ? ((profit / cost) * 100).toFixed(0) : 0;
//                                           return profit >= 0 ? `+${percent}%` : `${percent}%`;
//                                         })()}
//                                       </Text>
//                                     </View>
//                                   )}
//                                 </View>

//                                 <Text style={styles.activityDescription}>
//                                   {activity.description}
//                                 </Text>

//                                 <View style={styles.detailsContainer}>
//                                   <View style={styles.detailRow}>
//                                     <Icon name="location-on" size={14} color="#666" />
//                                     <Text style={styles.detailText}>
//                                       {activity.city} - {activity.area} ({activity.zone})
//                                     </Text>
//                                   </View>

//                                   {activity.chemical_or_fertilizer_used && (
//                                     <View style={styles.detailRow}>
//                                       <Icon name="science" size={14} color="#666" />
//                                       <Text style={styles.detailText}>
//                                         Used: {activity.chemical_or_fertilizer_used}
//                                       </Text>
//                                     </View>
//                                   )}

//                                   {activity.remarks && (
//                                     <View style={styles.detailRow}>
//                                       <Icon name="notes" size={14} color="#666" />
//                                       <Text style={styles.detailText}>
//                                         {activity.remarks}
//                                       </Text>
//                                     </View>
//                                   )}
                                  
//                                   {/* Show profit details for Harvesting */}
//                                   {activity.activity_type === 'Harvesting' && activity.yield_per_40kg && (
//                                     <View style={styles.profitDetailsRow}>
//                                       <Text style={styles.profitDetailsText}>
//                                         Income: Rs {(activity.yield_per_40kg * 2000).toFixed(0)} | 
//                                         Cost: Rs {(activity.total_cost || 0).toFixed(0)} | 
//                                         {(() => {
//                                           const profit = (activity.yield_per_40kg * 2000) - (activity.total_cost || 0);
//                                           return profit >= 0 
//                                             ? ` Profit: Rs ${profit.toFixed(0)}`
//                                             : ` Loss: Rs ${Math.abs(profit).toFixed(0)}`;
//                                         })()}
//                                       </Text>
//                                     </View>
//                                   )}
                                  
//                                   {/* Public/Private Toggle Button - Only for Harvesting */}
//                                   {activity.activity_type === 'Harvesting' && (
//                                     <TouchableOpacity
//                                       style={[
//                                         styles.privacyToggleButton,
//                                         activity.is_public ? styles.publicButton : styles.privateButton
//                                       ]}
//                                       onPress={() => toggleActivityPrivacy(activity.id, activity.is_public)}
//                                       disabled={togglingPrivacy[activity.id]}
//                                     >
//                                       {togglingPrivacy[activity.id] ? (
//                                         <ActivityIndicator size="small" color="#fff" />
//                                       ) : (
//                                         <>
//                                           <Icon 
//                                             name={activity.is_public ? "public" : "lock"} 
//                                             size={16} 
//                                             color="#fff" 
//                                           />
//                                           <Text style={styles.privacyToggleText}>
//                                             {activity.is_public ? 'Public' : 'Private'}
//                                           </Text>
//                                         </>
//                                       )}
//                                     </TouchableOpacity>
//                                   )}
//                                 </View>
//                               </View>
//                             ))
//                           }
//                         </View>
//                       )}
//                     </View>
//                   ))
//                     )
//                   )}
//                 </View>
//               ))}
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//   },
//   placeholder: {
//     width: 32,
//   },
//   scrollContainer: {
//     padding: 16,
//   },
//   farmerInfo: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     alignItems: 'center',
//   },
//   farmerName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   activitiesCount: {
//     fontSize: 14,
//     color: '#666',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: '#666',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   addCropButton: {
//     backgroundColor: '#2E7D32',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   addCropButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   // Year Section
//   yearSection: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     marginBottom: 12,
//     overflow: 'hidden',
//   },
//   yearHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: '#2E7D32',
//   },
//   yearText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   // Season Section
//   seasonSection: {
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//   },
//   seasonHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 14,
//     backgroundColor: '#E8F5E8',
//   },
//   seasonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2E7D32',
//   },
//   // ✅ Empty Season Styles
//   emptySeasonContainer: {
//     padding: 20,
//     alignItems: 'center',
//     backgroundColor: '#fafafa',
//   },
//   emptySeasonText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   emptySeasonSubtext: {
//     fontSize: 12,
//     color: '#999',
//   },
//   // Crop Section
//   cropSection: {
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   cropHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 12,
//     paddingLeft: 20,
//     backgroundColor: '#F1F8E9',
//   },
//   cropText: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#333',
//   },
//   // Activities List
//   activitiesList: {
//     padding: 8,
//     backgroundColor: '#fafafa',
//   },
//   activityCard: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 8,
//     borderLeftWidth: 3,
//     borderLeftColor: '#4CAF50',
//   },
//   activityHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   activityIcon: {
//     fontSize: 20,
//     marginRight: 8,
//   },
//   activityHeaderText: {
//     flex: 1,
//   },
//   activityType: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   activityDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   activityDescription: {
//     fontSize: 13,
//     color: '#333',
//     lineHeight: 18,
//     marginBottom: 8,
//   },
//   detailsContainer: {
//     backgroundColor: '#f8f9fa',
//     padding: 8,
//     borderRadius: 6,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   detailText: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 6,
//     flex: 1,
//   },
//   profitBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   profitBadgeBg: {
//     backgroundColor: '#E8F5E9',
//   },
//   lossBadgeBg: {
//     backgroundColor: '#FFEBEE',
//   },
//   profitBadgeText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//   },
//   profitDetailsRow: {
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//   },
//   profitDetailsText: {
//     fontSize: 11,
//     color: '#333',
//     lineHeight: 16,
//   },
//   // Privacy Toggle Button Styles
//   privacyToggleButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginTop: 10,
//     alignSelf: 'flex-start',
//   },
//   publicButton: {
//     backgroundColor: '#2196F3',
//   },
//   privateButton: {
//     backgroundColor: '#757575',
//   },
//   privacyToggleText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginLeft: 6,
//   },
// });

// export default FarmerActivitiesScreen;









//YEH WALA CODE AIK ACREE PA KTNY MUND HAI 
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   BackHandler
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';
// import { farmerAPI, activityAPI } from './api';
// import T from './localization/T';

// const FarmerActivitiesScreen = ({ navigation }) => {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [farmerId, setFarmerId] = useState(null);
//   const [farmerName, setFarmerName] = useState('');
//   const [togglingPrivacy, setTogglingPrivacy] = useState({});
  
//   const [expandedYears, setExpandedYears] = useState({});
//   const [expandedSeasons, setExpandedSeasons] = useState({});
//   const [expandedCrops, setExpandedCrops] = useState({});

//   useFocusEffect(
//     useCallback(() => {
//       loadFarmerActivities();
//     }, [])
//   );

//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         navigation.navigate('AddMoreEntry');
//         return true;
//       };
//       const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
//       return () => subscription.remove();
//     }, [navigation])
//   );

//   const getCurrentSeason = () => {
//     const month = new Date().getMonth();
//     if (month >= 9 || month <= 2) return 'Rabi';
//     return 'Kharif';
//   };

//   const loadFarmerActivities = async () => {
//     try {
//       const savedFarmerId = await AsyncStorage.getItem('farmerId');
//       if (!savedFarmerId) {
//         Alert.alert('Error', 'Farmer ID not found. Please login again.');
//         navigation.goBack();
//         return;
//       }

//       setFarmerId(parseInt(savedFarmerId));
//       const response = await farmerAPI.getFarmerAllActivities(parseInt(savedFarmerId));
      
//       if (response.success) {
//         console.log('📊 Activities loaded:', response.activities?.length);
//         console.log('📊 Sample activity area_size:', response.activities?.[0]?.area_size);
//         setActivities(response.activities);
//         setFarmerName(response.farmer_name);
        
//         const currentYear = new Date().getFullYear();
//         setExpandedYears({ [currentYear]: true });
//         const currentSeason = getCurrentSeason();
//         setExpandedSeasons({ [`${currentYear}-${currentSeason}`]: true });
//       } else {
//         Alert.alert('Error', 'Failed to load activities');
//       }
//     } catch (error) {
//       console.error('Error loading activities:', error);
//       Alert.alert('Error', 'Failed to load activities');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadFarmerActivities();
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // ✅ SHOW HARVESTING DETAILS WITH YIELD PER ACRE
//   // ✅ SHOW HARVESTING DETAILS WITH YIELD PER ACRE
// const showHarvestingDetails = (activity) => {
//   console.log('🎯 Harvesting card clicked:', activity.crop_name);
//   console.log('📊 Activity data:', {
//     yield: activity.yield_per_40kg,
//     area_size: activity.area_size,
//     area_unit: activity.area_unit,
//     activity_cost: activity.activity_cost  // ✅ YEH CHECK KARO
//   });
  
//   if (!activity.yield_per_40kg) {
//     Alert.alert('Info', 'Yield not entered yet for this harvest.');
//     return;
//   }

//   const income = activity.yield_per_40kg * 2000;
//   const cost = activity.activity_cost || 0;  // ✅ YAHAN CHANGE KIYA
//   const profit = income - cost;
//   const isProfit = profit >= 0;
//   const roi = cost > 0 ? ((profit / cost) * 100).toFixed(1) : '100';
  
//   // ✅ Calculate Yield per Acre
//   const areaSize = activity.area_size ? parseFloat(activity.area_size) : 1;
//   const totalBags = activity.yield_per_40kg;
//   const totalKg = totalBags * 40;
//   const bagsPerAcre = (totalBags / areaSize).toFixed(1);
//   const kgPerAcre = (totalKg / areaSize).toFixed(0);
//   const maundPerAcre = (kgPerAcre / 40).toFixed(1);

//   Alert.alert(
//     `🌾 Harvest Details - ${activity.crop_name || 'Crop'}`,
//     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//     `📊 **HARVEST SUMMARY**\n` +
//     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
//     `🌾 **Crop:** ${activity.crop_name || 'N/A'}\n` +
//     `📅 **Date:** ${formatDate(activity.activity_date)}\n` +
//     `📍 **Location:** ${activity.city || 'N/A'} - ${activity.area || 'N/A'}\n` +
//     `📏 **Area:** ${areaSize} ${activity.area_unit || 'acres'}\n\n` +
//     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//     `💰 **FINANCIAL SUMMARY**\n` +
//     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//     `💵 **Total Cost:** Rs ${cost.toFixed(0)}\n` +
//     `🌾 **Total Yield:** ${totalBags} bags (${totalKg} kg)\n` +
//     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//     `📏 **YIELD PER ACRE:**\n` +
//     `   🧺 ${bagsPerAcre} bags\n` +
//     `   ⚖️ ${kgPerAcre} kg\n` +
//     `   📦 ${maundPerAcre} maund\n` +
//     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//     `💵 **Revenue:** Rs ${income.toFixed(0)}\n` +
//     `${isProfit ? `✅ **Profit:** +Rs ${profit.toFixed(0)}` : `❌ **Loss:** -Rs ${Math.abs(profit).toFixed(0)}`}\n` +
//     `📈 **ROI:** ${roi}%\n` +
//     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//     `💡 **Note:** 1 maund = 40 kg`,
//     [{ text: 'Close', style: 'default' }]
//   );
// };
//   const getActivityIcon = (activityType) => {
//     const icons = {
//       'Sowing': '🌱', 'Fertilization': '🌿', 'Pest Control': '🐛',
//       'Expected Harvest': '📅', 'Harvest': '🌾', 'Harvesting': '🌾',
//       'Irrigation': '💧', 'Weeding': '🌾', 'Plowing': '🚜',
//       'Spraying': '💨', 'Post Harvest': '📦', 'Land Preparation': '🚜'
//     };
//     return icons[activityType] || '📝';
//   };

//   const getDisplayActivityType = (activityType) => {
//     const displayMap = {
//       'Plowing': 'Land Preparation',
//       'Spraying': 'Pest Control',
//     };
//     return displayMap[activityType] || activityType;
//   };

//   const toggleActivityPrivacy = async (activityId, currentIsPublic) => {
//     try {
//       setTogglingPrivacy(prev => ({ ...prev, [activityId]: true }));
//       const newIsPublic = !currentIsPublic;
//       const response = await activityAPI.updateActivityPrivacy(activityId, newIsPublic);
//       if (response.success) {
//         setActivities(prev => prev.map(activity => 
//           activity.id === activityId ? { ...activity, is_public: newIsPublic } : activity
//         ));
//         Alert.alert('Success', newIsPublic ? 'Activity is now Public!' : 'Activity is now Private.');
//       } else {
//         Alert.alert('Error', response.message || 'Failed to update privacy');
//       }
//     } catch (error) {
//       console.error('Error toggling privacy:', error);
//       Alert.alert('Error', 'Failed to update privacy setting');
//     } finally {
//       setTogglingPrivacy(prev => ({ ...prev, [activityId]: false }));
//     }
//   };

//   const getActivitySequence = (activityType) => {
//     const sequenceMap = {
//       'Plowing': 1, 'Land Preparation': 1, 'Sowing': 2, 'Irrigation': 3,
//       'Fertilization': 4, 'Spraying': 5, 'Pest Control': 5, 'Weeding': 6, 'Harvesting': 7,
//     };
//     return sequenceMap[activityType] || 99;
//   };

//   const sortActivitiesBySequence = (activities) => {
//     return [...activities].sort((a, b) => {
//       const seqA = getActivitySequence(a.activity_type);
//       const seqB = getActivitySequence(b.activity_type);
//       if (seqA !== seqB) return seqA - seqB;
//       return new Date(a.activity_date) - new Date(b.activity_date);
//     });
//   };

//   // Group activities
//   const groupedActivities = activities.reduce((acc, activity) => {
//     const date = new Date(activity.activity_date);
//     let year = date.getFullYear();
//     if (activity.season === 'Rabi' && date.getMonth() <= 5) {
//       year = year - 1;
//     }
//     const season = activity.season || 'Unknown';
//     const cropName = activity.crop_name;
//     if (!acc[year]) acc[year] = {};
//     if (!acc[year][season]) acc[year][season] = {};
//     if (!acc[year][season][cropName]) acc[year][season][cropName] = [];
//     acc[year][season][cropName].push(activity);
//     return acc;
//   }, {});

//   const currentYear = new Date().getFullYear();
//   if (!groupedActivities[currentYear]) {
//     groupedActivities[currentYear] = {};
//   }
//   if (!groupedActivities[currentYear]['Rabi']) {
//     groupedActivities[currentYear]['Rabi'] = {};
//   }
//   if (!groupedActivities[currentYear]['Kharif']) {
//     groupedActivities[currentYear]['Kharif'] = {};
//   }

//   const years = Object.keys(groupedActivities).sort((a, b) => b - a);
  
//   const toggleYear = (year) => {
//     setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
//   };
  
//   const toggleSeason = (year, season) => {
//     const key = `${year}-${season}`;
//     setExpandedSeasons(prev => ({ ...prev, [key]: !prev[key] }));
//   };

//   const toggleCrop = (year, season, crop) => {
//     const key = `${year}-${season}-${crop}`;
//     setExpandedCrops(prev => ({ ...prev, [key]: !prev[key] }));
//   };

//   // ✅ Render Activity Item with clickable Harvesting
//   const renderActivityItem = (activity) => {
//     const isHarvesting = activity.activity_type === 'Harvesting';
//     const hasYield = activity.yield_per_40kg && activity.yield_per_40kg > 0;
//     const isClickable = isHarvesting && hasYield;
    
//     const income = hasYield ? activity.yield_per_40kg * 2000 : 0;
//     const cost = activity.total_cost || 0;
//     const profit = income - cost;
//     const isProfit = profit >= 0;
//     const percent = cost > 0 ? ((profit / cost) * 100).toFixed(0) : 0;

//     return (
//       <TouchableOpacity
//         key={activity.id}
//         activeOpacity={isClickable ? 0.7 : 1}
//         onPress={() => {
//           if (isClickable) {
//             showHarvestingDetails(activity);
//           }
//         }}
//         style={styles.activityCard}
//       >
//         <View style={styles.activityHeader}>
//           <Text style={styles.activityIcon}>{getActivityIcon(activity.activity_type)}</Text>
//           <View style={styles.activityHeaderText}>
//             <Text style={styles.activityType}>{getDisplayActivityType(activity.activity_type)}</Text>
//             <Text style={styles.activityDate}>{formatDate(activity.activity_date)}</Text>
//           </View>
//           {isHarvesting && hasYield && (
//             <View style={[styles.profitBadge, isProfit ? styles.profitBadgeBg : styles.lossBadgeBg]}>
//               <Text style={styles.profitBadgeText}>{isProfit ? `+${percent}%` : `${percent}%`}</Text>
//             </View>
//           )}
//         </View>

//         <Text style={styles.activityDescription}>{activity.description}</Text>

//         <View style={styles.detailsContainer}>
//           <View style={styles.detailRow}>
//             <Icon name="location-on" size={14} color="#666" />
//             <Text style={styles.detailText}>
//               {activity.city} - {activity.area} ({activity.zone})
//             </Text>
//           </View>

//           {activity.chemical_or_fertilizer_used && (
//             <View style={styles.detailRow}>
//               <Icon name="science" size={14} color="#666" />
//               <Text style={styles.detailText}>Used: {activity.chemical_or_fertilizer_used}</Text>
//             </View>
//           )}

//           {activity.remarks && (
//             <View style={styles.detailRow}>
//               <Icon name="notes" size={14} color="#666" />
//               <Text style={styles.detailText}>{activity.remarks}</Text>
//             </View>
//           )}
          
//           {/* ✅ Click hint for Harvesting */}
//           {isClickable && (
//             <View style={styles.clickHintContainer}>
//               <Icon name="touch-app" size={12} color="#4CAF50" />
//               <Text style={styles.clickHintText}>👆 Click for complete harvest details (Yield per Acre)</Text>
//             </View>
//           )}
          
//           {isHarvesting && (
//             <TouchableOpacity
//               style={[styles.privacyToggleButton, activity.is_public ? styles.publicButton : styles.privateButton]}
//               onPress={(e) => {
//                 e.stopPropagation();
//                 toggleActivityPrivacy(activity.id, activity.is_public);
//               }}
//               disabled={togglingPrivacy[activity.id]}
//             >
//               {togglingPrivacy[activity.id] ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <>
//                   <Icon name={activity.is_public ? "public" : "lock"} size={16} color="#fff" />
//                   <Text style={styles.privacyToggleText}>{activity.is_public ? 'Public' : 'Private'}</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#2E7D32" />
//         <T style={styles.loadingText}>Loading activities...</T>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContainer}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       >
//         <View style={styles.farmerInfo}>
//           <Text style={styles.farmerName}>{farmerName}</Text>
//           <Text style={styles.activitiesCount}>
//             {activities.length} activities across {years.length} years
//           </Text>
//         </View>

//         {years.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Icon name="agriculture" size={64} color="#ccc" />
//             <T style={styles.emptyText}>No activities found</T>
//             <T style={styles.emptySubtext}>Start by adding crops to your lands</T>
//             <TouchableOpacity style={styles.addCropButton} onPress={() => navigation.navigate('CropInput')}>
//               <T style={styles.addCropButtonText}>Add Your First Crop</T>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           years.map(year => (
//             <View key={year} style={styles.yearSection}>
//               <TouchableOpacity style={styles.yearHeader} onPress={() => toggleYear(year)}>
//                 <Text style={styles.yearText}> {year}</Text>
//                 <Icon name={expandedYears[year] ? "expand-less" : "expand-more"} size={24} color="#666" />
//               </TouchableOpacity>

//               {expandedYears[year] && Object.keys(groupedActivities[year]).map(season => (
//                 <View key={season} style={styles.seasonSection}>
//                   <TouchableOpacity style={styles.seasonHeader} onPress={() => toggleSeason(year, season)}>
//                     <T style={styles.seasonText}>{season === 'Rabi' ? ' Rabi Season' : ' Kharif Season'}</T>
//                     <Icon name={expandedSeasons[`${year}-${season}`] ? "expand-less" : "expand-more"} size={20} color="#666" />
//                   </TouchableOpacity>

//                   {expandedSeasons[`${year}-${season}`] && (
//                     Object.keys(groupedActivities[year][season]).length === 0 ? (
//                       <View style={styles.emptySeasonContainer}>
//                         <Text style={styles.emptySeasonText}> No {season} crops yet</Text>
//                         <T style={styles.emptySeasonSubtext}>Add crop and complete activities</T>
//                       </View>
//                     ) : (
//                       Object.keys(groupedActivities[year][season]).map(crop => (
//                         <View key={crop} style={styles.cropSection}>
//                           <TouchableOpacity style={styles.cropHeader} onPress={() => toggleCrop(year, season, crop)}>
//                             <Text style={styles.cropText}> {crop}</Text>
//                             <Icon name={expandedCrops[`${year}-${season}-${crop}`] ? "expand-less" : "expand-more"} size={18} color="#666" />
//                           </TouchableOpacity>

//                           {expandedCrops[`${year}-${season}-${crop}`] && (
//                             <View style={styles.activitiesList}>
//                               {sortActivitiesBySequence(groupedActivities[year][season][crop]).map(activity => renderActivityItem(activity))}
//                             </View>
//                           )}
//                         </View>
//                       ))
//                     )
//                   )}
//                 </View>
//               ))}
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5' },
//   centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
//   loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
//   scrollContainer: { padding: 16 },
//   farmerInfo: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, alignItems: 'center' },
//   farmerName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
//   activitiesCount: { fontSize: 14, color: '#666' },
//   emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40 },
//   emptyText: { fontSize: 18, color: '#666', marginTop: 16, marginBottom: 8 },
//   emptySubtext: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 20 },
//   addCropButton: { backgroundColor: '#2E7D32', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
//   addCropButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
//   yearSection: { backgroundColor: 'white', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
//   yearHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#2E7D32' },
//   yearText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
//   seasonSection: { borderTopWidth: 1, borderTopColor: '#e0e0e0' },
//   seasonHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, backgroundColor: '#E8F5E8' },
//   seasonText: { fontSize: 16, fontWeight: '600', color: '#2E7D32' },
//   emptySeasonContainer: { padding: 20, alignItems: 'center', backgroundColor: '#fafafa' },
//   emptySeasonText: { fontSize: 14, color: '#666', marginBottom: 4 },
//   emptySeasonSubtext: { fontSize: 12, color: '#999' },
//   cropSection: { borderTopWidth: 1, borderTopColor: '#f0f0f0' },
//   cropHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, paddingLeft: 20, backgroundColor: '#F1F8E9' },
//   cropText: { fontSize: 15, fontWeight: '500', color: '#333' },
//   activitiesList: { padding: 8, backgroundColor: '#fafafa' },
//   activityCard: { backgroundColor: 'white', borderRadius: 8, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#4CAF50' },
//   activityHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//   activityIcon: { fontSize: 20, marginRight: 8 },
//   activityHeaderText: { flex: 1 },
//   activityType: { fontSize: 14, fontWeight: 'bold', color: '#333' },
//   activityDate: { fontSize: 12, color: '#666', marginTop: 2 },
//   activityDescription: { fontSize: 13, color: '#333', lineHeight: 18, marginBottom: 8 },
//   detailsContainer: { backgroundColor: '#f8f9fa', padding: 8, borderRadius: 6 },
//   detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
//   detailText: { fontSize: 12, color: '#666', marginLeft: 6, flex: 1 },
//   profitBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
//   profitBadgeBg: { backgroundColor: '#E8F5E9' },
//   lossBadgeBg: { backgroundColor: '#FFEBEE' },
//   profitBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#2E7D32' },
//   clickHintContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#e0e0e0', gap: 4 },
//   clickHintText: { fontSize: 10, color: '#4CAF50', fontStyle: 'italic' },
//   privacyToggleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginTop: 10, alignSelf: 'flex-start' },
//   publicButton: { backgroundColor: '#2196F3' },
//   privateButton: { backgroundColor: '#757575' },
//   privacyToggleText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
// });

// export default FarmerActivitiesScreen;





















//Yeh wala code Har crop ky sath profit loss dekhny ky liya
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { farmerAPI, activityAPI } from './api';
import T from './localization/T';

const FarmerActivitiesScreen = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [farmerId, setFarmerId] = useState(null);
  const [farmerName, setFarmerName] = useState('');
  const [togglingPrivacy, setTogglingPrivacy] = useState({});
  
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedSeasons, setExpandedSeasons] = useState({});
  const [expandedCrops, setExpandedCrops] = useState({});

  useFocusEffect(
    useCallback(() => {
      loadFarmerActivities();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('AddMoreEntry');
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 9 || month <= 2) return 'Rabi';
    return 'Kharif';
  };

  const loadFarmerActivities = async () => {
    try {
      const savedFarmerId = await AsyncStorage.getItem('farmerId');
      if (!savedFarmerId) {
        Alert.alert('Error', 'Farmer ID not found. Please login again.');
        navigation.goBack();
        return;
      }

      setFarmerId(parseInt(savedFarmerId));
      const response = await farmerAPI.getFarmerAllActivities(parseInt(savedFarmerId));
      
      if (response.success) {
        console.log('📊 Activities loaded:', response.activities?.length);
        setActivities(response.activities);
        setFarmerName(response.farmer_name);
        
        const currentYear = new Date().getFullYear();
        setExpandedYears({ [currentYear]: true });
        const currentSeason = getCurrentSeason();
        setExpandedSeasons({ [`${currentYear}-${currentSeason}`]: true });
      } else {
        Alert.alert('Error', 'Failed to load activities');
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      Alert.alert('Error', 'Failed to load activities');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFarmerActivities();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ✅ Calculate Profit/Loss for a crop with PROFIT PERCENTAGE of REVENUE
  const calculateCropProfitLoss = (cropActivities) => {
    let totalCost = 0;
    let yield_bags = 0;
    
    cropActivities.forEach(activity => {
      totalCost += parseFloat(activity.activity_cost) || 0;
      if (activity.activity_type === 'Harvesting' && activity.yield_per_40kg) {
        yield_bags = parseFloat(activity.yield_per_40kg);
      }
    });
    
    const revenue = yield_bags * 2000;
    const profit = revenue - totalCost;
    const isProfit = profit >= 0;
    
    // ✅ PROFIT PERCENTAGE of REVENUE
    const profitPercent = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0';
    
    return {
      totalCost,
      yield_bags,
      revenue,
      profit,
      isProfit,
      profitPercent,
      hasYield: yield_bags > 0
    };
  };

  // ✅ Format profit display with PROFIT PERCENTAGE
  const formatProfitDisplay = (profit, isProfit, profitPercent, hasYield) => {
    if (!hasYield) {
      return { text: 'Pending', color: '#F59E0B', bgColor: '#FEF3C7' };
    }
    return {
      text: isProfit ? `+Rs ${profit.toFixed(0)}` : `-Rs ${Math.abs(profit).toFixed(0)}`,
      percentText: isProfit ? `+${profitPercent}%` : `${profitPercent}%`,
      color: isProfit ? '#16A34A' : '#DC2626',
      bgColor: isProfit ? '#E8F5E9' : '#FFEBEE'
    };
  };

  // ✅ SHOW HARVESTING DETAILS WITH YIELD PER ACRE AND PROFIT %
  const showHarvestingDetails = (activity) => {
    console.log('🎯 Harvesting card clicked:', activity.crop_name);
    
    if (!activity.yield_per_40kg) {
      Alert.alert('Info', 'Yield not entered yet for this harvest.');
      return;
    }

    const income = activity.yield_per_40kg * 2000;
    const cost = activity.activity_cost || 0;
    const profit = income - cost;
    const isProfit = profit >= 0;
    
    // ✅ PROFIT PERCENTAGE of REVENUE
    const profitPercent = income > 0 ? ((profit / income) * 100).toFixed(1) : '0';
    
    // ✅ Calculate Yield per Acre
    const areaSize = activity.area_size ? parseFloat(activity.area_size) : 1;
    const totalBags = activity.yield_per_40kg;
    const totalKg = totalBags * 40;
    const bagsPerAcre = (totalBags / areaSize).toFixed(1);
    const kgPerAcre = (totalKg / areaSize).toFixed(0);
    const maundPerAcre = (kgPerAcre / 40).toFixed(1);

    Alert.alert(
      `🌾 Harvest Details - ${activity.crop_name || 'Crop'}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📊 **HARVEST SUMMARY**\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🌾 **Crop:** ${activity.crop_name || 'N/A'}\n` +
      `📅 **Date:** ${formatDate(activity.activity_date)}\n` +
      `📍 **Location:** ${activity.city || 'N/A'} - ${activity.area || 'N/A'}\n` +
      `📏 **Area:** ${areaSize} ${activity.area_unit || 'acres'}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 **FINANCIAL SUMMARY**\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 **Total Cost:** Rs ${cost.toFixed(0)}\n` +
      `🌾 **Total Yield:** ${totalBags} bags (${totalKg} kg)\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📏 **YIELD PER ACRE:**\n` +
      `   🧺 ${bagsPerAcre} bags\n` +
      `   ⚖️ ${kgPerAcre} kg\n` +
      `   📦 ${maundPerAcre} maund\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 **Revenue:** Rs ${income.toFixed(0)}\n` +
      `${isProfit ? `✅ **Profit:** +Rs ${profit.toFixed(0)}` : `❌ **Loss:** -Rs ${Math.abs(profit).toFixed(0)}`}\n` +
      `📈 **Profit %:** ${profitPercent}% (of revenue)\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💡 **Note:** 1 maund = 40 kg`,
      [{ text: 'Close', style: 'default' }]
    );
  };

  const getActivityIcon = (activityType) => {
    const icons = {
      'Sowing': '🌱', 'Fertilization': '🌿', 'Pest Control': '🐛',
      'Expected Harvest': '📅', 'Harvest': '🌾', 'Harvesting': '🌾',
      'Irrigation': '💧', 'Weeding': '🌾', 'Plowing': '🚜',
      'Spraying': '💨', 'Post Harvest': '📦', 'Land Preparation': '🚜'
    };
    return icons[activityType] || '📝';
  };

  const getDisplayActivityType = (activityType) => {
    const displayMap = {
      'Plowing': 'Land Preparation',
      'Spraying': 'Pest Control',
    };
    return displayMap[activityType] || activityType;
  };

  const toggleActivityPrivacy = async (activityId, currentIsPublic) => {
    try {
      setTogglingPrivacy(prev => ({ ...prev, [activityId]: true }));
      const newIsPublic = !currentIsPublic;
      const response = await activityAPI.updateActivityPrivacy(activityId, newIsPublic);
      if (response.success) {
        setActivities(prev => prev.map(activity => 
          activity.id === activityId ? { ...activity, is_public: newIsPublic } : activity
        ));
        Alert.alert('Success', newIsPublic ? 'Activity is now Public!' : 'Activity is now Private.');
      } else {
        Alert.alert('Error', response.message || 'Failed to update privacy');
      }
    } catch (error) {
      console.error('Error toggling privacy:', error);
      Alert.alert('Error', 'Failed to update privacy setting');
    } finally {
      setTogglingPrivacy(prev => ({ ...prev, [activityId]: false }));
    }
  };

  const getActivitySequence = (activityType) => {
    const sequenceMap = {
       
      'Plowing': 1, 'Land Preparation': 1, 'Sowing': 2, 'Irrigation': 3,
      'Fertilization': 4, 'Spraying': 5, 'Pest Control': 5, 'Weeding': 6, 'Harvesting': 7,
    };
    return sequenceMap[activityType] || 99;
  };

  const sortActivitiesBySequence = (activities) => {
    return [...activities].sort((a, b) => {
      const seqA = getActivitySequence(a.activity_type);
      const seqB = getActivitySequence(b.activity_type);
      if (seqA !== seqB) return seqA - seqB;
      return new Date(a.activity_date) - new Date(b.activity_date);
    });
  };

  // Group activities by year, season, crop
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.activity_date);
    let year = date.getFullYear();
    if (activity.season === 'Rabi' && date.getMonth() <= 5) {
      year = year - 1;
    }
    const season = activity.season || 'Unknown';
    const cropName = activity.crop_name;
    if (!acc[year]) acc[year] = {};
    if (!acc[year][season]) acc[year][season] = {};
    if (!acc[year][season][cropName]) acc[year][season][cropName] = [];
    acc[year][season][cropName].push(activity);
    return acc;
  }, {});

  const currentYear = new Date().getFullYear();
  if (!groupedActivities[currentYear]) {
    groupedActivities[currentYear] = {};
  }
  if (!groupedActivities[currentYear]['Rabi']) {
    groupedActivities[currentYear]['Rabi'] = {};
  }
  if (!groupedActivities[currentYear]['Kharif']) {
    groupedActivities[currentYear]['Kharif'] = {};
  }

  const years = Object.keys(groupedActivities).sort((a, b) => b - a);
  
  const toggleYear = (year) => {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
  };
  
  const toggleSeason = (year, season) => {
    const key = `${year}-${season}`;
    setExpandedSeasons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCrop = (year, season, crop) => {
    const key = `${year}-${season}-${crop}`;
    setExpandedCrops(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ Render Activity Item
  const renderActivityItem = (activity) => {
    const isHarvesting = activity.activity_type === 'Harvesting';
    const hasYield = activity.yield_per_40kg && activity.yield_per_40kg > 0;
    const isClickable = isHarvesting && hasYield;
    
    const income = hasYield ? activity.yield_per_40kg * 2000 : 0;
    const cost = activity.activity_cost || 0;
    const profit = income - cost;
    const isProfit = profit >= 0;
    const profitPercent = income > 0 ? ((profit / income) * 100).toFixed(0) : 0;

    return (
      <TouchableOpacity
        key={activity.id}
        activeOpacity={isClickable ? 0.7 : 1}
        onPress={() => {
          if (isClickable) {
            showHarvestingDetails(activity);
          }
        }}
        style={styles.activityCard}
      >
        <View style={styles.activityHeader}>
          <Text style={styles.activityIcon}>{getActivityIcon(activity.activity_type)}</Text>
          <View style={styles.activityHeaderText}>
            <Text style={styles.activityType}>{getDisplayActivityType(activity.activity_type)}</Text>
            <Text style={styles.activityDate}>{formatDate(activity.activity_date)}</Text>
          </View>
          {isHarvesting && hasYield && (
            <View style={[styles.profitBadge, isProfit ? styles.profitBadgeBg : styles.lossBadgeBg]}>
              <Text style={[styles.profitBadgeText, isProfit ? styles.profitText : styles.lossText]}>
                {isProfit ? `+${profitPercent}%` : `${profitPercent}%`}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.activityDescription}>{activity.description}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Icon name="location-on" size={14} color="#666" />
            <Text style={styles.detailText}>
              {activity.city} - {activity.area} ({activity.zone})
            </Text>
          </View>

          {activity.chemical_or_fertilizer_used && (
            <View style={styles.detailRow}>
              <Icon name="science" size={14} color="#666" />
              <Text style={styles.detailText}>Used: {activity.chemical_or_fertilizer_used}</Text>
            </View>
          )}

          {activity.remarks && (
            <View style={styles.detailRow}>
              <Icon name="notes" size={14} color="#666" />
              <Text style={styles.detailText}>{activity.remarks}</Text>
            </View>
          )}
          
          {isClickable && (
            <View style={styles.clickHintContainer}>
              <Icon name="touch-app" size={12} color="#4CAF50" />
              <Text style={styles.clickHintText}>👆 Click for complete harvest details</Text>
            </View>
          )}
          
          {isHarvesting && (
            <TouchableOpacity
              style={[styles.privacyToggleButton, activity.is_public ? styles.publicButton : styles.privateButton]}
              onPress={(e) => {
                e.stopPropagation();
                toggleActivityPrivacy(activity.id, activity.is_public);
              }}
              disabled={togglingPrivacy[activity.id]}
            >
              {togglingPrivacy[activity.id] ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Icon name={activity.is_public ? "public" : "lock"} size={16} color="#fff" />
                  <Text style={styles.privacyToggleText}>{activity.is_public ? 'Public' : 'Private'}</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <T style={styles.loadingText}>Loading activities...</T>
      </View>
    );
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.farmerInfo}>
          <Text style={styles.farmerName}>{farmerName}</Text>
          <Text style={styles.activitiesCount}>
            {activities.length} activities across {years.length} years
          </Text>
        </View>

        {years.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="agriculture" size={64} color="#ccc" />
            <T style={styles.emptyText}>No activities found</T>
            <T style={styles.emptySubtext}>Start by adding crops to your lands</T>
            <TouchableOpacity style={styles.addCropButton} onPress={() => navigation.navigate('CropInput')}>
              <T style={styles.addCropButtonText}>Add Your First Crop</T>
            </TouchableOpacity>
          </View>
        ) : (
          years.map(year => {
            // ✅ Calculate total profit for the year
            let yearTotalProfit = 0;
            let yearTotalCost = 0;
            let yearTotalRevenue = 0;
            
            Object.keys(groupedActivities[year]).forEach(season => {
              Object.keys(groupedActivities[year][season]).forEach(crop => {
                const cropProfitData = calculateCropProfitLoss(groupedActivities[year][season][crop]);
                if (cropProfitData.hasYield) {
                  yearTotalProfit += cropProfitData.profit;
                  yearTotalCost += cropProfitData.totalCost;
                  yearTotalRevenue += cropProfitData.revenue;
                }
              });
            });
            
            const yearIsProfit = yearTotalProfit >= 0;
            // Calculate profit percentage for the year
            const yearProfitPercent = yearTotalRevenue > 0 ? ((yearTotalProfit / yearTotalRevenue) * 100).toFixed(1) : 0;
            
            return (
              <View key={year} style={styles.yearSection}>
                <TouchableOpacity style={styles.yearHeader} onPress={() => toggleYear(year)}>
                  <View style={styles.yearHeaderLeft}>
                    <Text style={styles.yearText}>📅 {year}</Text>
                    {yearTotalProfit !== 0 && (
                      <View style={[styles.yearProfitBadge, yearIsProfit ? styles.yearProfitBg : styles.yearLossBg]}>
                        <Text style={[styles.yearProfitText, yearIsProfit ? styles.profitText : styles.lossText]}>
                          {yearIsProfit ? `+Rs ${yearTotalProfit.toFixed(0)}` : `-Rs ${Math.abs(yearTotalProfit).toFixed(0)}`}
                        </Text>
                        <Text style={[styles.yearProfitPercent, yearIsProfit ? styles.profitText : styles.lossText]}>
                          ({yearIsProfit ? `+${yearProfitPercent}%` : `${yearProfitPercent}%`})
                         
                        </Text>
                      </View>
                    )}
                  </View>
                  <Icon name={expandedYears[year] ? "expand-less" : "expand-more"} size={24} color="white" />
                </TouchableOpacity>

                {expandedYears[year] && Object.keys(groupedActivities[year]).map(season => (
                  <View key={season} style={styles.seasonSection}>
                    <TouchableOpacity style={styles.seasonHeader} onPress={() => toggleSeason(year, season)}>
                      <Text style={styles.seasonText}>
                        {season === 'Rabi' ? '🌾 Rabi Season' : '☀️ Kharif Season'}
                      </Text>
                      <Icon name={expandedSeasons[`${year}-${season}`] ? "expand-less" : "expand-more"} size={20} color="#666" />
                    </TouchableOpacity>

                    {expandedSeasons[`${year}-${season}`] && (
                      Object.keys(groupedActivities[year][season]).length === 0 ? (
                        <View style={styles.emptySeasonContainer}>
                          <Text style={styles.emptySeasonText}>No {season} crops yet</Text>
                        </View>
                      ) : (
                        Object.keys(groupedActivities[year][season]).map(crop => {
                          // ✅ Calculate profit/loss for this crop
                          const cropProfitData = calculateCropProfitLoss(groupedActivities[year][season][crop]);
                          const profitDisplay = formatProfitDisplay(
                            cropProfitData.profit, 
                            cropProfitData.isProfit, 
                            cropProfitData.profitPercent,
                            cropProfitData.hasYield
                          );
                          
                          return (
                            <View key={crop} style={styles.cropSection}>
                              <TouchableOpacity 
                                style={styles.cropHeader} 
                                onPress={() => toggleCrop(year, season, crop)}
                              >
                                <View style={styles.cropHeaderLeft}>
                                  <Text style={styles.cropText}>🌱 {crop}</Text>
                                  {cropProfitData.hasYield && (
                                    <View style={[styles.cropProfitChip, { backgroundColor: profitDisplay.bgColor }]}>
                                      <Text style={[styles.cropProfitChipText, { color: profitDisplay.color }]}>
                                        {profitDisplay.text} ({profitDisplay.percentText})
                                      </Text>
                                    </View>
                                  )}
                                  {!cropProfitData.hasYield && (
                                    <View style={[styles.cropProfitChip, { backgroundColor: '#FEF3C7' }]}>
                                      <Text style={[styles.cropProfitChipText, { color: '#F59E0B' }]}>
                                        ⏳ Pending
                                      </Text>
                                    </View>
                                  )}
                                </View>
                                <Icon name={expandedCrops[`${year}-${season}-${crop}`] ? "expand-less" : "expand-more"} size={18} color="#666" />
                              </TouchableOpacity>

                              {expandedCrops[`${year}-${season}-${crop}`] && (
                                <View style={styles.activitiesList}>
                                  {sortActivitiesBySequence(groupedActivities[year][season][crop]).map(activity => renderActivityItem(activity))}
                                </View>
                              )}
                            </View>
                          );
                        })
                      )
                    )}
                  </View>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  scrollContainer: { padding: 16 },
  farmerInfo: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, alignItems: 'center' },
  farmerName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  activitiesCount: { fontSize: 14, color: '#666' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 18, color: '#666', marginTop: 16, marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 20 },
  addCropButton: { backgroundColor: '#2E7D32', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  addCropButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  yearSection: { backgroundColor: 'white', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  yearHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#2E7D32' },
  yearHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  yearText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  yearProfitBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, flexDirection: 'row', alignItems: 'center' },
  yearProfitBg: { backgroundColor: '#E8F5E9' },
  yearLossBg: { backgroundColor: '#FFEBEE' },
  yearProfitText: { fontSize: 12, fontWeight: 'bold' },
  yearProfitPercent: { fontSize: 10, fontWeight: '600', marginLeft: 4 },
  seasonSection: { borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  seasonHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, backgroundColor: '#E8F5E8' },
  seasonText: { fontSize: 16, fontWeight: '600', color: '#2E7D32' },
  emptySeasonContainer: { padding: 20, alignItems: 'center', backgroundColor: '#fafafa' },
  emptySeasonText: { fontSize: 14, color: '#666', marginBottom: 4 },
  cropSection: { borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  cropHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, paddingLeft: 20, backgroundColor: '#F1F8E9' },
  cropHeaderLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  cropText: { fontSize: 15, fontWeight: '500', color: '#333' },
  cropProfitChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  cropProfitChipText: { fontSize: 11, fontWeight: 'bold' },
  activitiesList: { padding: 8, backgroundColor: '#fafafa' },
  activityCard: { backgroundColor: 'white', borderRadius: 8, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#4CAF50' },
  activityHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  activityIcon: { fontSize: 20, marginRight: 8 },
  activityHeaderText: { flex: 1 },
  activityType: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  activityDate: { fontSize: 12, color: '#666', marginTop: 2 },
  activityDescription: { fontSize: 13, color: '#333', lineHeight: 18, marginBottom: 8 },
  detailsContainer: { backgroundColor: '#f8f9fa', padding: 8, borderRadius: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  detailText: { fontSize: 12, color: '#666', marginLeft: 6, flex: 1 },
  profitBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  profitBadgeBg: { backgroundColor: '#E8F5E9' },
  lossBadgeBg: { backgroundColor: '#FFEBEE' },
  profitBadgeText: { fontSize: 12, fontWeight: 'bold' },
  profitText: { color: '#16A34A' },
  lossText: { color: '#DC2626' },
  clickHintContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#e0e0e0', gap: 4 },
  clickHintText: { fontSize: 10, color: '#4CAF50', fontStyle: 'italic' },
  privacyToggleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginTop: 10, alignSelf: 'flex-start' },
  publicButton: { backgroundColor: '#2196F3' },
  privateButton: { backgroundColor: '#757575' },
  privacyToggleText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
});

export default FarmerActivitiesScreen;






// yeh wala code ky profit show krwa rha hai hmn yield ki jagah
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   BackHandler
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';
// import { farmerAPI, activityAPI } from './api';
// import T from './localization/T';

// const FarmerActivitiesScreen = ({ navigation }) => {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [farmerId, setFarmerId] = useState(null);
//   const [farmerName, setFarmerName] = useState('');
//   const [togglingPrivacy, setTogglingPrivacy] = useState({});  // Track which activities are being toggled
  
//   // State for expanded sections
//   const [expandedYears, setExpandedYears] = useState({});
//   const [expandedSeasons, setExpandedSeasons] = useState({});
//   const [expandedCrops, setExpandedCrops] = useState({});

//   // ✅ useFocusEffect: Jab bhi screen focus ho, data reload ho jaaye
//   useFocusEffect(
//     useCallback(() => {
//       loadFarmerActivities();
//     }, [])
//   );

//   // ✅ Hardware Back Button → AddMoreEntry
//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         navigation.navigate('AddMoreEntry');
//         return true;
//       };

//       const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
//       return () => subscription.remove();
//     }, [navigation])
//   );

//   // ✅ Helper: Current season determine karo based on month
//   const getCurrentSeason = () => {
//     const month = new Date().getMonth(); // 0-11
//     // Rabi: Oct(9) - Mar(2), Kharif: Apr(3) - Sep(8)
//     if (month >= 9 || month <= 2) {
//       return 'Rabi';
//     }
//     return 'Kharif';
//   };

//   // ✅ Calculate Profit/Loss for a harvesting activity
//   const calculateProfitLoss = (activity) => {
//     if (!activity || activity.activity_type !== 'Harvesting' || !activity.yield_per_40kg) {
//       return null;
//     }
    
//     const income = activity.yield_per_40kg * 2000; // Rs 2000 per 40kg
//     const totalCost = activity.total_cost || 0;
//     const netProfit = income - totalCost;
    
//     // Calculate percentage
//     let percentage = 0;
//     let percentageText = '0%';
    
//     if (totalCost > 0) {
//       percentage = (netProfit / totalCost) * 100;
      
//       // Format percentage properly
//       if (Math.abs(percentage) > 200) {
//         percentageText = percentage > 0 ? '>200%' : '<-200%';
//       } else {
//         percentageText = `${percentage.toFixed(1)}%`;
//       }
//     } else if (totalCost === 0 && netProfit > 0) {
//       percentage = 100;
//       percentageText = '100%';
//     }
    
//     return {
//       income,
//       totalCost,
//       netProfit,
//       percentage: percentageText,
//       isProfit: netProfit >= 0,
//       yieldBags: activity.yield_per_40kg,
//       profitLossText: netProfit >= 0 ? 
//         `Profit: ${percentageText} (+Rs ${Math.abs(netProfit).toFixed(0)})` : 
//         `Loss: ${percentageText} (-Rs ${Math.abs(netProfit).toFixed(0)})`
//     };
//   };

//   const loadFarmerActivities = async () => {
//     try {
//       const savedFarmerId = await AsyncStorage.getItem('farmerId');
//       if (!savedFarmerId) {
//         Alert.alert('Error', 'Farmer ID not found. Please login again.');
//         navigation.goBack();
//         return;
//       }

//       setFarmerId(parseInt(savedFarmerId));
      
//       const response = await farmerAPI.getFarmerAllActivities(parseInt(savedFarmerId));
      
//       console.log('📊 FarmerActivities API Response:', response);
      
//       if (response.success) {
//         setActivities(response.activities);
//         setFarmerName(response.farmer_name);
        
//         // ✅ Auto-expand current year
//         const currentYear = new Date().getFullYear();
//         setExpandedYears({ [currentYear]: true });
        
//         // ✅ Auto-expand current season bhi (Rabi ya Kharif)
//         const currentSeason = getCurrentSeason();
//         setExpandedSeasons({ [`${currentYear}-${currentSeason}`]: true });
//       } else {
//         Alert.alert('Error', 'Failed to load activities');
//       }
//     } catch (error) {
//       console.error('Error loading activities:', error);
//       Alert.alert('Error', 'Failed to load activities');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadFarmerActivities();
//   };

//   // ✅ FIXED: Simple year grouping - ALL crops in their sowing year
//   const groupedActivities = activities.reduce((acc, activity) => {
//     const date = new Date(activity.activity_date);
//     const year = date.getFullYear(); // Always use sowing year
//     const season = activity.season || 'Unknown';
//     const cropName = activity.crop_name;

//     // ✅ SIMPLE RULE: Har crop ko uske SOWING year mein show karo
//     // Rabi 2026-2027: Sowing Oct 2026 → Show in 2026
//     // Kharif 2026: Sowing Apr 2026 → Show in 2026
//     // 2027 nahi dikhay ga
    
//     if (!acc[year]) acc[year] = {};
//     if (!acc[year][season]) acc[year][season] = {};
//     if (!acc[year][season][cropName]) acc[year][season][cropName] = [];

//     acc[year][season][cropName].push(activity);
//     return acc;
//   }, {});

//   // ✅ Current year mein Rabi aur Kharif HAMESHA show hon (chahe empty hon)
//   const currentYear = new Date().getFullYear();
  
//   if (!groupedActivities[currentYear]) {
//     groupedActivities[currentYear] = {};
//   }
//   if (!groupedActivities[currentYear]['Kharif']) {
//     groupedActivities[currentYear]['Kharif'] = {};
//   }
//   if (!groupedActivities[currentYear]['Rabi']) {
//     groupedActivities[currentYear]['Rabi'] = {};
//   }

//   const years = Object.keys(groupedActivities).sort((a, b) => b - a);
  
//   const toggleYear = (year) => {
//     setExpandedYears(prev => ({
//       ...prev,
//       [year]: !prev[year],
//     }));
//   };
  
//   const toggleSeason = (year, season) => {
//     const key = `${year}-${season}`;
//     setExpandedSeasons(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const toggleCrop = (year, season, crop) => {
//     const key = `${year}-${season}-${crop}`;
//     setExpandedCrops(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getActivityIcon = (activityType) => {
//     switch (activityType) {
//       case 'Sowing':
//         return '🌱';
//       case 'Fertilization':
//         return '🌿';
//       case 'Pest Control':
//         return '🐛';
//       case 'Expected Harvest':
//         return '📊';
//       case 'Harvest':
//         return '⏰';
//       case 'Irrigation':
//         return '💧';
//       case 'Weeding':
//         return '🌾';
//       case 'Plowing':
//         return '🚜';
//       case 'Spraying':
//         return '💨';
//       case 'Post Harvest':
//         return '📦';
//       default:
//         return '📝';
//     }
//   };

//   // ✅ Display label mapping
//   const getDisplayActivityType = (activityType) => {
//     const displayMap = {
//       'Plowing': 'Land Preparation',
//       'Spraying': 'Pest Control',
//       'Harvest': 'Harvesting'
//     };
//     return displayMap[activityType] || activityType;
//   };

//   // ✅ Toggle Public/Private for an activity
//   const toggleActivityPrivacy = async (activityId, currentIsPublic) => {
//     try {
//       setTogglingPrivacy(prev => ({ ...prev, [activityId]: true }));
//       
//       const newIsPublic = !currentIsPublic;
//       console.log(`🔄 Toggling activity ${activityId} to ${newIsPublic ? 'Public' : 'Private'}`);
//       
//       const response = await activityAPI.updateActivityPrivacy(activityId, newIsPublic);
//       
//       if (response.success) {
//         // Update local state
//         setActivities(prev => prev.map(activity => 
//           activity.id === activityId 
//             ? { ...activity, is_public: newIsPublic }
//             : activity
//         ));
//         
//         Alert.alert(
//           'Success', 
//           newIsPublic 
//             ? '🌐 Activity is now Public! It will appear in Public Feed.' 
//             : '🔒 Activity is now Private.'
//         );
//       } else {
//         Alert.alert('Error', response.message || 'Failed to update privacy');
//       }
//     } catch (error) {
//       console.error('Error toggling privacy:', error);
//       Alert.alert('Error', 'Failed to update privacy setting');
//     } finally {
//       setTogglingPrivacy(prev => ({ ...prev, [activityId]: false }));
//     }
//   };

//   // ✅ Activity sequence order for sorting
//   const getActivitySequence = (activityType) => {
//     const sequenceMap = {
//       'Plowing': 1,
//       'Land Preparation': 1,
//       'Sowing': 2,
//       'Irrigation': 3,
//       'Fertilization': 4,
//       'Spraying': 5,
//       'Pest Control': 5,
//       'Weeding': 6,
//       'Harvesting': 7,
//       'Harvest': 7,
//     };
//     return sequenceMap[activityType] || 99;
//   };

//   // ✅ Sort activities by farming sequence, then by date
//   const sortActivitiesBySequence = (activities) => {
//     return [...activities].sort((a, b) => {
//       const seqA = getActivitySequence(a.activity_type);
//       const seqB = getActivitySequence(b.activity_type);
      
//       if (seqA !== seqB) {
//         return seqA - seqB;
//       }
//       return new Date(a.activity_date) - new Date(b.activity_date);
//     });
//   };

//   // ✅ Render Harvesting activity with Profit/Loss summary
//   const renderHarvestingActivity = (activity) => {
//     const profitData = calculateProfitLoss(activity);
    
//     return (
//       <View key={activity.id} style={styles.activityCard}>
//         <View style={styles.activityHeader}>
//           <Text style={styles.activityIcon}>
//             🌾
//           </Text>
//           <View style={styles.activityHeaderText}>
//             <Text style={styles.activityType}>
//               {getDisplayActivityType(activity.activity_type)}
//             </Text>
//             <Text style={styles.activityDate}>
//               {formatDate(activity.activity_date)}
//             </Text>
//           </View>
          
//           {/* Show Profit/Loss badge */}
//           {profitData && (
//             <View style={[
//               styles.profitBadge,
//               profitData.isProfit ? styles.profitBadgeBg : styles.lossBadgeBg
//             ]}>
//               <Text style={[
//                 styles.profitBadgeText,
//                 profitData.isProfit ? styles.profitText : styles.lossText
//               ]}>
//                 {profitData.isProfit ? '✅ Profit' : '❌ Loss'}
//               </Text>
//             </View>
//           )}
//         </View>

//         <Text style={styles.activityDescription}>
//           {activity.description || 'Harvesting completed'}
//         </Text>

//         <View style={styles.detailsContainer}>
//           {/* Yield Information */}
//           {activity.yield_per_40kg && (
//             <View style={styles.detailRow}>
//               <Icon name="agriculture" size={14} color="#666" />
//               <Text style={styles.detailText}>
//                 Yield: {activity.yield_per_40kg} bags per 40kg
//               </Text>
//             </View>
//           )}

//           {/* Location */}
//           <View style={styles.detailRow}>
//             <Icon name="location-on" size={14} color="#666" />
//             <Text style={styles.detailText}>
//               {activity.city} - {activity.area} ({activity.zone})
//             </Text>
//           </View>

//           {/* ✅ PROFIT/LOSS SUMMARY - IMPORTANT SECTION */}
//           {profitData && (
//             <View style={styles.profitSummaryContainer}>
//               <View style={[
//                 styles.profitSummaryBox,
//                 profitData.isProfit ? styles.profitBox : styles.lossBox
//               ]}>
//                 <View style={styles.profitSummaryHeader}>
//                   <Text style={styles.profitSummaryTitle}>
//                     {profitData.isProfit ? '✅ CROP PROFIT SUMMARY' : '❌ CROP LOSS SUMMARY'}
//                   </Text>
//                   <Text style={[
//                     styles.profitPercentage,
//                     profitData.isProfit ? styles.profitPercentageText : styles.lossPercentageText
//                   ]}>
//                     {profitData.percentage}
//                   </Text>
//                 </View>
                
//                 <View style={styles.profitDetails}>
//                   <View style={styles.profitDetailRow}>
//                     <Text style={styles.profitLabel}>🌾 Yield Income:</Text>
//                     <Text style={styles.profitValue}>
//                       {profitData.yieldBags} bags × Rs 2,000 = Rs {profitData.income.toFixed(0)}
//                     </Text>
//                   </View>
                  
//                   <View style={styles.profitDetailRow}>
//                     <Text style={styles.profitLabel}>💰 Total Expenses:</Text>
//                     <Text style={styles.profitValue}>Rs {profitData.totalCost.toFixed(0)}</Text>
//                   </View>
                  
//                   <View style={styles.profitDetailRow}>
//                     <Text style={styles.profitLabel}>
//                       {profitData.isProfit ? '✅ Net Profit:' : '❌ Net Loss:'}
//                     </Text>
//                     <Text style={[
//                       styles.profitValue,
//                       profitData.isProfit ? styles.profitValueText : styles.lossValueText
//                     ]}>
//                       Rs {Math.abs(profitData.netProfit).toFixed(0)}
//                     </Text>
//                   </View>
                  
//                   <View style={styles.profitDetailRow}>
//                     <Text style={styles.profitLabel}>📈 ROI:</Text>
//                     <Text style={[
//                       styles.profitValue,
//                       profitData.isProfit ? styles.profitValueText : styles.lossValueText
//                     ]}>
//                       {profitData.percentage}
//                     </Text>
//                   </View>
//                 </View>
                
//                 <Text style={styles.profitNote}>
//                   {profitData.isProfit 
//                     ? '🎉 Aap ne is crop se accha profit kamaya!'
//                     : '💡 Agli baar expenses kam kar ke profit badhayein'}
//                 </Text>
//               </View>
//             </View>
//           )}

//           {activity.chemical_or_fertilizer_used && (
//             <View style={styles.detailRow}>
//               <Icon name="science" size={14} color="#666" />
//               <Text style={styles.detailText}>
//                 Used: {activity.chemical_or_fertilizer_used}
//               </Text>
//             </View>
//           )}

//           {activity.remarks && (
//             <View style={styles.detailRow}>
//               <Icon name="notes" size={14} color="#666" />
//               <Text style={styles.detailText}>
//                 {activity.remarks}
//               </Text>
//             </View>
//           )}

//           {/* Public/Private Toggle Button */}
//           <TouchableOpacity
//             style={[
//               styles.privacyToggleButton,
//               activity.is_public ? styles.publicButton : styles.privateButton
//             ]}
//             onPress={() => toggleActivityPrivacy(activity.id, activity.is_public)}
//             disabled={togglingPrivacy[activity.id]}
//           >
//             {togglingPrivacy[activity.id] ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Icon 
//                   name={activity.is_public ? "public" : "lock"} 
//                   size={16} 
//                   color="#fff" 
//                 />
//                 <Text style={styles.privacyToggleText}>
//                   {activity.is_public ? 'Public' : 'Private'}
//                 </Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   // Render regular activity (non-harvesting)
//   const renderRegularActivity = (activity) => {
//     return (
//       <View key={activity.id} style={styles.activityCard}>
//         <View style={styles.activityHeader}>
//           <Text style={styles.activityIcon}>
//             {getActivityIcon(activity.activity_type)}
//           </Text>
//           <View style={styles.activityHeaderText}>
//             <Text style={styles.activityType}>
//               {getDisplayActivityType(activity.activity_type)}
//             </Text>
//             <Text style={styles.activityDate}>
//               {formatDate(activity.activity_date)}
//             </Text>
//           </View>
//         </View>

//         <Text style={styles.activityDescription}>
//           {activity.description}
//         </Text>

//         <View style={styles.detailsContainer}>
//           <View style={styles.detailRow}>
//             <Icon name="location-on" size={14} color="#666" />
//             <Text style={styles.detailText}>
//               {activity.city} - {activity.area} ({activity.zone})
//             </Text>
//           </View>

//           {activity.chemical_or_fertilizer_used && (
//             <View style={styles.detailRow}>
//               <Icon name="science" size={14} color="#666" />
//               <Text style={styles.detailText}>
//                 Used: {activity.chemical_or_fertilizer_used}
//               </Text>
//             </View>
//           )}

//           {activity.remarks && (
//             <View style={styles.detailRow}>
//               <Icon name="notes" size={14} color="#666" />
//               <Text style={styles.detailText}>
//                 {activity.remarks}
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>
//     );
//   };

//   // ✅ Render activity based on type
//   const renderActivity = (activity) => {
//     if (activity.activity_type === 'Harvesting' || activity.activity_type === 'Harvest') {
//       return renderHarvestingActivity(activity);
//     } else {
//       return renderRegularActivity(activity);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#2E7D32" />
//         <T style={styles.loadingText}>Loading activities...</T>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContainer}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {/* Farmer Info */}
//         <View style={styles.farmerInfo}>
//           <Text style={styles.farmerName}>{farmerName}</Text>
//           <Text style={styles.activitiesCount}>
//             {activities.length} activities across {years.length} years
//           </Text>
//         </View>

//         {/* Activities List by Year > Season > Crop */}
//         {years.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Icon name="agriculture" size={64} color="#ccc" />
//             <T style={styles.emptyText}>No activities found</T>
//             <T style={styles.emptySubtext}>Start by adding crops to your lands</T>
//             <TouchableOpacity 
//               style={styles.addCropButton}
//               onPress={() => navigation.navigate('CropInputPage')}
//             >
//               <T style={styles.addCropButtonText}>Add Your First Crop</T>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           years.map(year => (
//             <View key={year} style={styles.yearSection}>
//               {/* Year Header */}
//               <TouchableOpacity 
//                 style={styles.yearHeader}
//                 onPress={() => toggleYear(year)}
//               >
//                 <Text style={styles.yearText}>📅 {year}</Text>
//                 <Icon 
//                   name={expandedYears[year] ? "expand-less" : "expand-more"} 
//                   size={24} 
//                   color="#666" 
//                 />
//               </TouchableOpacity>

//               {/* Seasons List */}
//               {expandedYears[year] && Object.keys(groupedActivities[year]).map(season => (
//                 <View key={season} style={styles.seasonSection}>
//                   {/* Season Header */}
//                   <TouchableOpacity 
//                     style={styles.seasonHeader}
//                     onPress={() => toggleSeason(year, season)}
//                   >
//                     <T style={styles.seasonText}>
//                       {season === 'Rabi' ? '🌾 Rabi Season' : '☀️ Kharif Season'}
//                     </T>
//                     <Icon 
//                       name={expandedSeasons[`${year}-${season}`] ? "expand-less" : "expand-more"} 
//                       size={20} 
//                       color="#666" 
//                     />
//                   </TouchableOpacity>

//                   {/* Crops List */}
//                   {expandedSeasons[`${year}-${season}`] && (
//                     Object.keys(groupedActivities[year][season]).length === 0 ? (
//                       <View style={styles.emptySeasonContainer}>
//                         <Text style={styles.emptySeasonText}>
//                           🌱 No {season} crops yet
//                         </Text>
//                         <T style={styles.emptySeasonSubtext}>Add crop and complete activities</T>
//                       </View>
//                     ) : (
//                       Object.keys(groupedActivities[year][season]).map(crop => (
//                         <View key={crop} style={styles.cropSection}>
//                           {/* Crop Header */}
//                           <TouchableOpacity 
//                             style={styles.cropHeader}
//                             onPress={() => toggleCrop(year, season, crop)}
//                           >
//                             <Text style={styles.cropText}>🌱 {crop}</Text>
//                             <Icon 
//                               name={expandedCrops[`${year}-${season}-${crop}`] ? "expand-less" : "expand-more"} 
//                               size={18} 
//                               color="#666" 
//                             />
//                           </TouchableOpacity>

//                           {/* Activities List for this Crop */}
//                           {expandedCrops[`${year}-${season}-${crop}`] && (
//                             <View style={styles.activitiesList}>
//                               {sortActivitiesBySequence(groupedActivities[year][season][crop])
//                                 .map(activity => renderActivity(activity))
//                               }
//                             </View>
//                           )}
//                         </View>
//                       ))
//                     )
//                   )}
//                 </View>
//               ))}
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   scrollContainer: {
//     padding: 16,
//   },
//   farmerInfo: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     alignItems: 'center',
//   },
//   farmerName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   activitiesCount: {
//     fontSize: 14,
//     color: '#666',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: '#666',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   addCropButton: {
//     backgroundColor: '#2E7D32',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   addCropButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   // Year Section
//   yearSection: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     marginBottom: 12,
//     overflow: 'hidden',
//   },
//   yearHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: '#2E7D32',
//   },
//   yearText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   // Season Section
//   seasonSection: {
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//   },
//   seasonHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 14,
//     backgroundColor: '#E8F5E8',
//   },
//   seasonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2E7D32',
//   },
//   // Empty Season Styles
//   emptySeasonContainer: {
//     padding: 20,
//     alignItems: 'center',
//     backgroundColor: '#fafafa',
//   },
//   emptySeasonText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   emptySeasonSubtext: {
//     fontSize: 12,
//     color: '#999',
//   },
//   // Crop Section
//   cropSection: {
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   cropHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 12,
//     paddingLeft: 20,
//     backgroundColor: '#F1F8E9',
//   },
//   cropText: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#333',
//   },
//   // Activities List
//   activitiesList: {
//     padding: 8,
//     backgroundColor: '#fafafa',
//   },
//   activityCard: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 8,
//     borderLeftWidth: 3,
//     borderLeftColor: '#4CAF50',
//   },
//   activityHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   activityIcon: {
//     fontSize: 20,
//     marginRight: 8,
//   },
//   activityHeaderText: {
//     flex: 1,
//   },
//   activityType: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   activityDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   activityDescription: {
//     fontSize: 13,
//     color: '#333',
//     lineHeight: 18,
//     marginBottom: 8,
//   },
//   detailsContainer: {
//     backgroundColor: '#f8f9fa',
//     padding: 8,
//     borderRadius: 6,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   detailText: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 6,
//     flex: 1,
//   },
//   // Profit/Loss Badge
//   profitBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   profitBadgeBg: {
//     backgroundColor: '#E8F5E9',
//   },
//   lossBadgeBg: {
//     backgroundColor: '#FFEBEE',
//   },
//   profitBadgeText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   profitText: {
//     color: '#2E7D32',
//   },
//   lossText: {
//     color: '#DC2626',
//   },
//   // ✅ NEW STYLES FOR PROFIT SUMMARY
//   profitSummaryContainer: {
//     marginTop: 8,
//     marginBottom: 8,
//   },
//   profitSummaryBox: {
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//   },
//   profitBox: {
//     backgroundColor: '#E8F5E9',
//     borderColor: '#4CAF50',
//   },
//   lossBox: {
//     backgroundColor: '#FFEBEE',
//     borderColor: '#DC2626',
//   },
//   profitSummaryHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   profitSummaryTitle: {
//     fontSize: 13,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   profitPercentage: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   profitPercentageText: {
//     color: '#2E7D32',
//   },
//   lossPercentageText: {
//     color: '#DC2626',
//   },
//   profitDetails: {
//     marginTop: 4,
//   },
//   profitDetailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 4,
//   },
//   profitLabel: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '500',
//   },
//   profitValue: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   profitValueText: {
//     color: '#2E7D32',
//   },
//   lossValueText: {
//     color: '#DC2626',
//   },
//   profitNote: {
//     fontSize: 11,
//     color: '#666',
//     fontStyle: 'italic',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   // ✅ Privacy Toggle Button Styles
//   privacyToggleButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginTop: 10,
//     alignSelf: 'flex-start',
//   },
//   publicButton: {
//     backgroundColor: '#2196F3',
//   },
//   privateButton: {
//     backgroundColor: '#757575',
//   },
//   privacyToggleText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginLeft: 6,
//   },
// });

// export default FarmerActivitiesScreen;