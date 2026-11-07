// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   FlatList,
//   Pressable,
//   StyleSheet,
//   Alert,
//   RefreshControl,
//   ActivityIndicator
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { activityAPI } from './api';

// const PALETTE = {
//   bg: '#FFFFFF',
//   text: '#111829ff',
//   muted: '#6B7280',
//   green: '#16A34A',
//   greenLite: '#E7F8EA',
//   blue: '#3B82F6',
//   red: '#EF4444',
//   yellow: '#F59E0B',
//   gray: '#F3F4F6',
// };

// const PublicFeedScreen = ({ navigation }) => {
//   const [feed, setFeed] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // Load public feed
//   const loadPublicFeed = async () => {
//     try {
//       setLoading(true);
//       console.log('🔄 Loading public feed...');
      
//       const response = await activityAPI.getPublicFeed();
      
//       console.log('📡 API Response:', response);
      
//       if (response.success) {
//         console.log('📊 Feed data received:', response.feed);
//         setFeed(response.feed || []);
//       } else {
//         console.log('❌ API success: false');
//         Alert.alert('Error', 'Failed to load public activities');
//       }
//     } catch (error) {
//       console.error('❌ Error loading feed:', error);
//       Alert.alert('Error', 'Server connection failed');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     loadPublicFeed();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadPublicFeed();
//   };

//   // ✅ FIXED: Like activity without farmer_id
//   const handleLike = async (activityId) => {
//     try {
//       console.log('❤️ Liking activity:', activityId);
      
//       const response = await activityAPI.likeActivity(activityId);
      
//       console.log('👍 Like response:', response);
      
//       if (response.success) {
//         setFeed(prevFeed => 
//           prevFeed.map(item => {
//             if (item.id === activityId) {
//               return {
//                 ...item,
//                 likes_count: response.likes_count
//               };
//             }
//             return item;
//           })
//         );
//       }
//     } catch (error) {
//       console.error('👎 Like error:', error);
//       Alert.alert('Error', 'Failed to like activity');
//     }
//   };

//   // Get activity icon
//   const getActivityIcon = (type) => {
//     const icons = {
//       planting: 'spa',
//       irrigation: 'water-drop',
//       fertilization: 'eco',
//       pesticide: 'bug-report',
//       harvesting: 'agriculture',
//       weeding: 'delete',
//       default: 'event-note'
//     };
//     return icons[type] || icons.default;
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   // Activity card component
//   const ActivityCard = ({ item }) => (
//     <View style={styles.activityCard}>
//       <View style={styles.cardHeader}>
//         <View style={styles.farmerInfo}>
//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>
//               {item.farmer_name?.charAt(0) || 'F'}
//             </Text>
//           </View>
//           <View style={styles.farmerDetails}>
//             <Text style={styles.farmerName}>
//               {item.farmer_name}
//             </Text>
//             <Text style={styles.activityType}>
//               {item.activity_type}
//             </Text>
//           </View>
//         </View>
//         <Icon 
//           name={getActivityIcon(item.activity_type)} 
//           size={24} 
//           color={PALETTE.green} 
//         />
//       </View>

//       <View style={styles.cardContent}>
//         <Text style={styles.cropName}>
//           {item.crop_name}
//         </Text>
//         <Text style={styles.description}>
//           {item.description}
//         </Text>
        
//         <View style={styles.location}>
//           <Icon name="location-on" size={16} color={PALETTE.muted} />
//           <Text style={styles.locationText}>{item.location}</Text>
//         </View>
//       </View>

//       <View style={styles.cardFooter}>
//         <View style={styles.likeSection}>
//           <Pressable 
//             style={styles.likeButton}
//             onPress={() => handleLike(item.id)}
//           >
//             <Icon 
//               name="favorite-border" 
//               size={20} 
//               color={PALETTE.red} 
//             />
//             <Text style={styles.likeCount}>
//               {item.likes_count || 0} likes
//             </Text>
//           </Pressable>
//         </View>
//         <Text style={styles.dateText}>
//           {formatDate(item.activity_date)}
//         </Text>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={PALETTE.green} />
//           <Text style={styles.loadingText}>Loading activities...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Public Activities</Text>
//         <Text style={styles.headerSubtitle}>
//           See what other farmers are doing
//         </Text>
//       </View>

//       <FlatList
//         data={feed}
//         renderItem={({ item }) => <ActivityCard item={item} />}
//         keyExtractor={(item) => item.id?.toString()}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[PALETTE.green]}
//           />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <Icon name="public" size={64} color={PALETTE.gray} />
//             <Text style={styles.emptyTitle}>No Public Activities</Text>
//             <Text style={styles.emptyText}>
//               Check console logs for debugging information
//             </Text>
//           </View>
//         }
//         contentContainerStyle={styles.listContent}
//       />
//     </SafeAreaView>
//   );
// };



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: PALETTE.bg,
//   },
//   header: {
//     padding: 16,
//     paddingBottom: 8,
//     backgroundColor: PALETTE.greenLite,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     textAlign: 'center',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     textAlign: 'center',
//     marginTop: 4,
//   },
//   listContent: {
//     padding: 16,
//     paddingTop: 8,
//   },
//   activityCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   farmerInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: PALETTE.green,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   avatarText: {
//     color: '#FFF',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   farmerDetails: {
//     flex: 1,
//   },
//   farmerName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: PALETTE.text,
//   },
//   activityType: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     marginTop: 2,
//     textTransform: 'capitalize',
//   },
//   cardContent: {
//     marginBottom: 12,
//   },
//   cropName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: PALETTE.green,
//     marginBottom: 8,
//   },
//   description: {
//     fontSize: 14,
//     color: PALETTE.text,
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   location: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   locationText: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginLeft: 4,
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: PALETTE.gray,
//   },
//   likeSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   likeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 4,
//   },
//   likeCount: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginLeft: 4,
//   },
//   dateText: {
//     fontSize: 12,
//     color: PALETTE.muted,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: PALETTE.muted,
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: PALETTE.muted,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
// });

// export default PublicFeedScreen;



// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   FlatList,
//   Pressable,
//   StyleSheet,
//   Alert,
//   RefreshControl,
//   ActivityIndicator
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { activityAPI } from './api';

// const PALETTE = {
//   bg: '#FFFFFF',
//   text: '#111829ff',
//   muted: '#6B7280',
//   green: '#16A34A',
//   greenLite: '#E7F8EA',
//   blue: '#3B82F6',
//   red: '#EF4444',
//   yellow: '#F59E0B',
//   gray: '#F3F4F6',
// };

// const PublicFeedScreen = ({ navigation }) => {
//   const [feed, setFeed] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // Load public feed
//   const loadPublicFeed = async () => {
//     try {
//       setLoading(true);
//       console.log('🔄 Loading public feed...');
      
//       const response = await activityAPI.getPublicFeed();
      
//       console.log('📡 API Response:', response);
      
//       // ✅ FIXED: Check if response and feed exists
//       if (response && response.success && response.feed) {
//         console.log('📊 Feed data received:', response.feed);
        
//         // ✅ GROUP ACTIVITIES BY FARMER
//         const groupedFeed = groupActivitiesByFarmer(response.feed);
//         console.log('👨‍🌾 Grouped by farmer:', groupedFeed);
        
//         setFeed(groupedFeed);
//       } else {
//         console.log('❌ API response issue:', response);
//         Alert.alert('Error', 'No public activities found');
//         setFeed([]); // ✅ Set empty array if no data
//       }
//     } catch (error) {
//       console.error('❌ Error loading feed:', error);
//       Alert.alert('Error', 'Server connection failed');
//       setFeed([]); // ✅ Set empty array on error
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // ✅ GROUP ACTIVITIES BY FARMER (with safety checks)
//   const groupActivitiesByFarmer = (activities) => {
//     // ✅ Check if activities is valid array
//     if (!activities || !Array.isArray(activities)) {
//       console.log('❌ Invalid activities data:', activities);
//       return [];
//     }
    
//     const grouped = {};
    
//     activities.forEach(activity => {
//       // ✅ Check if activity is valid
//       if (!activity) return;
      
//       const farmerName = activity.farmer_name || 'Unknown Farmer';
      
//       if (!grouped[farmerName]) {
//         grouped[farmerName] = {
//           farmer_name: farmerName,
//           location: activity.location || 'Unknown Location',
//           activities: [],
//           total_likes: 0
//         };
//       }
      
//       grouped[farmerName].activities.push({
//         id: activity.id || Math.random().toString(),
//         crop_name: activity.crop_name || 'Unknown Crop',
//         activity_type: activity.activity_type || 'Activity',
//         description: activity.description || 'No description',
//         activity_date: activity.activity_date || new Date().toISOString(),
//         likes_count: activity.likes_count || 0
//       });
      
//       grouped[farmerName].total_likes += activity.likes_count || 0;
//     });
    
//     return Object.values(grouped);
//   };

//   useEffect(() => {
//     loadPublicFeed();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadPublicFeed();
//   };

//   // ✅ Like activity (with safety checks)
//   const handleLike = async (activityId) => {
//     try {
//       if (!activityId) {
//         console.log('❌ No activity ID provided');
//         return;
//       }
      
//       console.log('❤️ Liking activity:', activityId);
      
//       const response = await activityAPI.likeActivity(activityId);
      
//       console.log('👍 Like response:', response);
      
//       if (response && response.success) {
//         // Update the specific activity's like count
//         setFeed(prevFeed => 
//           prevFeed.map(farmerGroup => ({
//             ...farmerGroup,
//             activities: farmerGroup.activities.map(activity => 
//               activity.id === activityId 
//                 ? { ...activity, likes_count: response.likes_count || 0 }
//                 : activity
//             ),
//             total_likes: farmerGroup.activities.reduce((sum, activity) => 
//               sum + (activity.id === activityId ? (response.likes_count || 0) : (activity.likes_count || 0)), 0
//             )
//           }))
//         );
//       }
//     } catch (error) {
//       console.error('👎 Like error:', error);
//       Alert.alert('Error', 'Failed to like activity');
//     }
//   };

//   // Get activity icon
//   const getActivityIcon = (type) => {
//     const icons = {
//       planting: 'spa',
//       irrigation: 'water-drop',
//       fertilization: 'eco',
//       pesticide: 'bug-report',
//       harvesting: 'agriculture',
//       weeding: 'delete',
//       sowing: 'spa',
//       'Pest Control': 'bug-report',
//       'Expected Harvest': 'agriculture',
//       'Sowing': 'spa',
//       'Fertilization': 'eco',
//       default: 'event-note'
//     };
//     return icons[type] || icons.default;
//   };

//   // Format date (with safety check)
//   const formatDate = (dateString) => {
//     try {
//       if (!dateString) return 'Unknown date';
//       return new Date(dateString).toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   // ✅ FARMER CARD - Ek farmer ki saari activities
//   const FarmerCard = ({ farmerGroup }) => {
//     // ✅ Safety check
//     if (!farmerGroup || !farmerGroup.activities) {
//       return null;
//     }
    
//     return (
//       <View style={styles.farmerCard}>
//         {/* ✅ FARMER HEADER */}
//         <View style={styles.farmerHeader}>
//           <View style={styles.farmerAvatar}>
//             <Text style={styles.avatarText}>
//               {farmerGroup.farmer_name?.charAt(0) || 'F'}
//             </Text>
//           </View>
//           <View style={styles.farmerInfo}>
//             <Text style={styles.farmerName}>
//               {farmerGroup.farmer_name || 'Unknown Farmer'}
//             </Text>
//             {farmerGroup.location && (
//               <View style={styles.location}>
//                 <Icon name="location-on" size={14} color={PALETTE.muted} />
//                 <Text style={styles.locationText}>{farmerGroup.location}</Text>
//               </View>
//             )}
//           </View>
//           <View style={styles.stats}>
//             <Text style={styles.activityCount}>
//               {farmerGroup.activities.length} activities
//             </Text>
//             <Text style={styles.likesCount}>
//               ❤️ {farmerGroup.total_likes || 0} total likes
//             </Text>
//           </View>
//         </View>

//         {/* ✅ ACTIVITIES LIST - Farmer ki saari activities */}
//         <View style={styles.activitiesList}>
//           {farmerGroup.activities.map((activity, index) => (
//             <View key={activity.id} style={styles.activityItem}>
//               <View style={styles.activityLeft}>
//                 <View style={[styles.activityIcon, { backgroundColor: '#E7F8EA' }]}>
//                   <Icon name={getActivityIcon(activity.activity_type)} size={18} color={PALETTE.green} />
//                 </View>
//                 <View style={styles.activityDetails}>
//                   <Text style={styles.cropName}>
//                     {activity.crop_name}
//                   </Text>
//                   <Text style={styles.activityDescription}>
//                     {activity.description}
//                   </Text>
//                   <Text style={styles.activityType}>
//                     {activity.activity_type} • {formatDate(activity.activity_date)}
//                   </Text>
//                 </View>
//               </View>
              
//               <Pressable 
//                 style={styles.likeButton}
//                 onPress={() => handleLike(activity.id)}
//               >
//                 <Icon name="favorite-border" size={16} color={PALETTE.red} />
//                 <Text style={styles.likeCount}>
//                   {activity.likes_count || 0}
//                 </Text>
//               </Pressable>
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={PALETTE.green} />
//           <Text style={styles.loadingText}>Loading farmers activities...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>👨‍🌾 Farmers Activities</Text>
//         <Text style={styles.headerSubtitle}>
//           See what farmers in your community are doing
//         </Text>
        
//         {/* ✅ Show farmers count */}
//         {feed.length > 0 && (
//           <Text style={styles.farmersCount}>
//             {feed.length} farmers sharing their activities
//           </Text>
//         )}
//       </View>

//       <FlatList
//         data={feed}
//         renderItem={({ item }) => <FarmerCard farmerGroup={item} />}
//         keyExtractor={(item, index) => item.farmer_name || index.toString()}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[PALETTE.green]}
//           />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <Icon name="people" size={64} color={PALETTE.gray} />
//             <Text style={styles.emptyTitle}>No Farmers Sharing Yet</Text>
//             <Text style={styles.emptyText}>
//               When farmers share their activities, they'll appear here
//             </Text>
//           </View>
//         }
//         contentContainerStyle={styles.listContent}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: PALETTE.bg,
//   },
//   header: {
//     padding: 16,
//     paddingBottom: 12,
//     backgroundColor: PALETTE.greenLite,
//     borderBottomLeftRadius: 16,
//     borderBottomRightRadius: 16,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     textAlign: 'center',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     textAlign: 'center',
//     marginTop: 4,
//   },
//   farmersCount: {
//     fontSize: 12,
//     color: PALETTE.green,
//     textAlign: 'center',
//     marginTop: 8,
//     fontWeight: '500',
//   },
//   listContent: {
//     padding: 16,
//     paddingTop: 12,
//   },
//   // ✅ FARMER CARD STYLES
//   farmerCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   farmerHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: PALETTE.gray,
//   },
//   farmerAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: PALETTE.green,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   avatarText: {
//     color: '#FFF',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   farmerInfo: {
//     flex: 1,
//   },
//   farmerName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     marginBottom: 4,
//   },
//   location: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   locationText: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginLeft: 4,
//   },
//   stats: {
//     alignItems: 'flex-end',
//   },
//   activityCount: {
//     fontSize: 12,
//     color: PALETTE.green,
//     fontWeight: '500',
//     marginBottom: 2,
//   },
//   likesCount: {
//     fontSize: 11,
//     color: PALETTE.muted,
//   },
//   // ✅ ACTIVITIES LIST STYLES
//   activitiesList: {
//     // Activities list container
//   },
//   activityItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f8f8f8',
//   },
//   activityLeft: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     flex: 1,
//   },
//   activityIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   activityDetails: {
//     flex: 1,
//   },
//   cropName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: PALETTE.green,
//     marginBottom: 2,
//   },
//   activityDescription: {
//     fontSize: 14,
//     color: PALETTE.text,
//     lineHeight: 18,
//     marginBottom: 4,
//   },
//   activityType: {
//     fontSize: 12,
//     color: PALETTE.muted,
//   },
//   likeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 8,
//   },
//   likeCount: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginLeft: 4,
//     fontWeight: '500',
//     minWidth: 20,
//     textAlign: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: PALETTE.muted,
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: PALETTE.muted,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
// });

// export default PublicFeedScreen;


// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   FlatList,
//   Pressable,
//   StyleSheet,
//   Alert,
//   RefreshControl,
//   ActivityIndicator,
//   TouchableOpacity,
//   Modal,
//   ScrollView
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { activityAPI } from './api';
// import T from './localization/T';  // ✅ Smart Translation Component

// const PALETTE = {
//   bg: '#FFFFFF',
//   text: '#111829ff',
//   muted: '#6B7280',
//   green: '#16A34A',
//   greenLite: '#E7F8EA',
//   blue: '#3B82F6',
//   red: '#EF4444',
//   yellow: '#F59E0B',
//   gray: '#F3F4F6',
// };

// const PublicFeedScreen = ({ navigation }) => {
//   const [feed, setFeed] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedActivity, setSelectedActivity] = useState(null);
//   const [cropActivities, setCropActivities] = useState([]);
//   const [showAllActivities, setShowAllActivities] = useState(false);
//   const [loadingCropActivities, setLoadingCropActivities] = useState(false);

//   // ✅ Load crop activities when an activity is clicked
//   const loadCropActivities = async (activityId) => {
//     try {
//       if (!activityId) return;
      
//       setLoadingCropActivities(true);
//       console.log('🌱 Loading crop activities for:', activityId);
      
//       const response = await activityAPI.getCropActivitiesByActivity(activityId);
//       console.log('📊 Crop activities response:', response);
      
//       if (response && response.success && response.activities) {
//         setCropActivities(response.activities);
//         setShowAllActivities(true);
//       } else {
//         Alert.alert('Error', 'Could not load crop activities');
//       }
//     } catch (error) {
//       console.error('❌ Error loading crop activities:', error);
//       Alert.alert('Error', 'Failed to load crop details');
//     } finally {
//       setLoadingCropActivities(false);
//     }
//   };

//   // ✅ Handle activity click
//   const handleActivityClick = (activity) => {
//     console.log('👆 Activity clicked:', activity);
//     setSelectedActivity(activity);
//     loadCropActivities(activity.id);
//   };

//   // Load public feed
//   const loadPublicFeed = async () => {
//     try {
//       setLoading(true);
//       console.log('🔄 Loading public feed...');
      
//       const response = await activityAPI.getPublicFeed();
      
//       console.log('📡 API Response:', response);
      
//       if (response && response.success && response.feed) {
//         console.log('📊 Feed data received:', response.feed);
        
//         const groupedFeed = groupActivitiesByFarmer(response.feed);
//         console.log('👨‍🌾 Grouped by farmer:', groupedFeed);
        
//         setFeed(groupedFeed);
//       } else {
//         console.log('❌ API response issue:', response);
//         Alert.alert('Error', 'No public activities found');
//         setFeed([]);
//       }
//     } catch (error) {
//       console.error('❌ Error loading feed:', error);
//       Alert.alert('Error', 'Server connection failed');
//       setFeed([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // ✅ GROUP ACTIVITIES BY FARMER
//   const groupActivitiesByFarmer = (activities) => {
//     if (!activities || !Array.isArray(activities)) {
//       console.log('❌ Invalid activities data:', activities);
//       return [];
//     }
    
//     const grouped = {};
    
//     activities.forEach(activity => {
//       if (!activity) return;
      
//       const farmerName = activity.farmer_name || 'Unknown Farmer';
      
//       if (!grouped[farmerName]) {
//         grouped[farmerName] = {
//           farmer_name: farmerName,
//           location: activity.location || 'Unknown Location',
//           city: activity.city || 'Unknown City',
//           activities: [],
//           total_likes: 0
//         };
//       }
      
//       grouped[farmerName].activities.push({
//         id: activity.id || Math.random().toString(),
//         crop_name: activity.crop_name || 'Unknown Crop',
//         activity_type: activity.activity_type || 'Activity',
//         description: activity.description || 'No description',
//         activity_date: activity.activity_date || new Date().toISOString(),
//         likes_count: activity.likes_count || 0,
//         city: activity.city || 'Unknown City'
//       });
      
//       grouped[farmerName].total_likes += activity.likes_count || 0;
//     });
    
//     return Object.values(grouped);
//   };

//   useEffect(() => {
//     loadPublicFeed();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadPublicFeed();
//   };

//   // ✅ Like activity
//   const handleLike = async (activityId, e) => {
//     e.stopPropagation(); // Prevent activity click
//     try {
//       if (!activityId) return;
      
//       console.log('❤️ Liking activity:', activityId);
      
//       const response = await activityAPI.likeActivity(activityId);
      
//       console.log('👍 Like response:', response);
      
//       if (response && response.success) {
//         // Update in main feed
//         setFeed(prevFeed => 
//           prevFeed.map(farmerGroup => ({
//             ...farmerGroup,
//             activities: farmerGroup.activities.map(activity => 
//               activity.id === activityId 
//                 ? { ...activity, likes_count: response.likes_count || 0 }
//                 : activity
//             ),
//             total_likes: farmerGroup.activities.reduce((sum, activity) => 
//               sum + (activity.id === activityId ? (response.likes_count || 0) : (activity.likes_count || 0)), 0
//             )
//           }))
//         );
        
//         // Update in crop activities modal if open
//         if (selectedActivity) {
//           setCropActivities(prev => 
//             prev.map(activity => 
//               activity.id === activityId 
//                 ? { ...activity, likes_count: response.likes_count || 0 }
//                 : activity
//             )
//           );
//         }
//       }
//     } catch (error) {
//       console.error('👎 Like error:', error);
//       Alert.alert('Error', 'Failed to like activity');
//     }
//   };

//   // Get activity icon
//   const getActivityIcon = (type) => {
//     const icons = {
//       planting: 'spa',
//       irrigation: 'water-drop',
//       fertilization: 'eco',
//       pesticide: 'bug-report',
//       harvesting: 'agriculture',
//       weeding: 'delete',
//       sowing: 'spa',
//       'Pest Control': 'bug-report',
//       'Expected Harvest': 'agriculture',
//       'Sowing': 'spa',
//       'Fertilization': 'eco',
//       default: 'event-note'
//     };
//     return icons[type] || icons.default;
//   };

//   // Get activity color
//   const getActivityColor = (type) => {
//     const colors = {
//       planting: '#16A34A',
//       irrigation: '#3B82F6',
//       fertilization: '#F59E0B',
//       pesticide: '#EF4444',
//       harvesting: '#8B5CF6',
//       weeding: '#10B981',
//       sowing: '#16A34A',
//       'Pest Control': '#EF4444',
//       'Expected Harvest': '#8B5CF6',
//       'Fertilization': '#F59E0B',
//       default: '#6B7280'
//     };
//     return colors[type] || colors.default;
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     try {
//       if (!dateString) return 'Unknown date';
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   // Format full date
//   const formatFullDate = (dateString) => {
//     try {
//       if (!dateString) return 'Unknown date';
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   // ✅ MODAL FOR CROP ACTIVITIES
//   const CropActivitiesModal = () => {
//     if (!showAllActivities || !selectedActivity) return null;
    
//     const selectedCropName = cropActivities.length > 0 
//       ? cropActivities[0].crop_name 
//       : selectedActivity.crop_name;
    
//     const farmerName = cropActivities.length > 0 
//       ? cropActivities[0].farmer_name 
//       : selectedActivity.farmer_name;
    
//     return (
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={showAllActivities}
//         onRequestClose={() => setShowAllActivities(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             {/* Modal Header */}
//             <View style={styles.modalHeader}>
//               <TouchableOpacity 
//                 style={styles.closeButton}
//                 onPress={() => setShowAllActivities(false)}
//               >
//                 <Icon name="close" size={24} color={PALETTE.text} />
//               </TouchableOpacity>
              
//               <View style={styles.modalTitleContainer}>
//                 <Text style={styles.modalTitle}>{selectedCropName}</Text>
//                 <Text style={styles.modalSubtitle}>by {farmerName}</Text>
//               </View>
              
//               <View style={styles.placeholder} />
//             </View>
            
//             {/* Crop Stats */}
//             <View style={styles.cropStats}>
//               <View style={styles.statBox}>
//                 <Text style={styles.statNumber}>{cropActivities.length}</Text>
//                 <Text style={styles.statLabel}>Total Activities</Text>
//               </View>
              
//               <View style={styles.statBox}>
//                 <Icon name="location-on" size={20} color={PALETTE.green} />
//                 <Text style={styles.statText}>
//                   {cropActivities.length > 0 ? cropActivities[0].location : 'Unknown'}
//                 </Text>
//               </View>
//             </View>
            
//             {/* Activities List */}
//             <ScrollView 
//               style={styles.modalContent}
//               showsVerticalScrollIndicator={false}
//             >
//               {loadingCropActivities ? (
//                 <View style={styles.loadingModal}>
//                   <ActivityIndicator size="large" color={PALETTE.green} />
//                   <Text style={styles.loadingText}>Loading activities...</Text>
//                 </View>
//               ) : (
//                 <>
//                   <Text style={styles.sectionTitle}>All Activities Timeline</Text>
                  
//                   {cropActivities.map((activity, index) => (
//                     <View key={activity.id} style={styles.timelineItem}>
//                       {/* Timeline dot */}
//                       <View style={styles.timelineDotContainer}>
//                         <View 
//                           style={[
//                             styles.timelineDot, 
//                             { backgroundColor: getActivityColor(activity.activity_type) }
//                           ]}
//                         />
//                         {index !== cropActivities.length - 1 && (
//                           <View style={styles.timelineLine} />
//                         )}
//                       </View>
                      
//                       {/* Activity content */}
//                       <View style={styles.timelineContent}>
//                         <View style={styles.timelineHeader}>
//                           <View style={styles.timelineLeft}>
//                             <View style={[
//                               styles.activityIconSmall,
//                               { backgroundColor: getActivityColor(activity.activity_type) + '15' }
//                             ]}>
//                               <Icon 
//                                 name={getActivityIcon(activity.activity_type)} 
//                                 size={16} 
//                                 color={getActivityColor(activity.activity_type)} 
//                               />
//                             </View>
//                             <Text style={styles.timelineActivityType}>
//                               {activity.activity_type}
//                             </Text>
//                           </View>
                          
//                           <Pressable 
//                             style={styles.modalLikeButton}
//                             onPress={(e) => handleLike(activity.id, e)}
//                           >
//                             <Icon 
//                               name={activity.likes_count > 0 ? "favorite" : "favorite-border"} 
//                               size={16} 
//                               color={PALETTE.red} 
//                             />
//                             <Text style={styles.modalLikeCount}>
//                               {activity.likes_count || 0}
//                             </Text>
//                           </Pressable>
//                         </View>
                        
//                         <Text style={styles.timelineDate}>
//                           {formatFullDate(activity.activity_date)}
//                         </Text>
                        
//                         {activity.description && (
//                           <Text style={styles.timelineDescription}>
//                             {activity.description}
//                           </Text>
//                         )}
                        
//                         {activity.chemical_or_fertilizer_used && (
//                           <View style={styles.detailRow}>
//                             <Icon name="science" size={14} color={PALETTE.muted} />
//                             <Text style={styles.detailText}>
//                               Used: {activity.chemical_or_fertilizer_used}
//                             </Text>
//                           </View>
//                         )}
                        
//                         {activity.remarks && (
//                           <View style={styles.remarksBox}>
//                             <Text style={styles.remarksLabel}>Remarks:</Text>
//                             <Text style={styles.remarksText}>{activity.remarks}</Text>
//                           </View>
//                         )}
//                       </View>
//                     </View>
//                   ))}
//                 </>
//               )}
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     );
//   };

//   // ✅ FARMER CARD
//   const FarmerCard = ({ farmerGroup }) => {
//     if (!farmerGroup || !farmerGroup.activities) {
//       return null;
//     }
    
//     return (
//       <View style={styles.farmerCard}>
//         {/* FARMER HEADER */}
//         <View style={styles.farmerHeader}>
//           <View style={styles.farmerAvatar}>
//             <Text style={styles.avatarText}>
//               {farmerGroup.farmer_name?.charAt(0) || 'F'}
//             </Text>
//           </View>
//           <View style={styles.farmerInfo}>
//             <Text style={styles.farmerName}>
//               {farmerGroup.farmer_name || 'Unknown Farmer'}
//             </Text>
//             <View style={styles.locationRow}>
//               <View style={styles.location}>
//                 <Icon name="location-on" size={14} color={PALETTE.muted} />
//                 <Text style={styles.locationText}>{farmerGroup.location}</Text>
//               </View>
//               {farmerGroup.city && farmerGroup.city !== 'Unknown City' && (
//                 <Text style={styles.cityBadge}>🏙️ {farmerGroup.city}</Text>
//               )}
//             </View>
//           </View>
//           <View style={styles.stats}>
//             <Text style={styles.activityCount}>
//               {farmerGroup.activities.length} activities
//             </Text>
//             <Text style={styles.likesCount}>
//               ❤️ {farmerGroup.total_likes || 0} likes
//             </Text>
//           </View>
//         </View>

//         {/* ACTIVITIES LIST */}
//         <View style={styles.activitiesList}>
//           {farmerGroup.activities.map((activity) => (
//             <TouchableOpacity 
//               key={activity.id} 
//               style={styles.activityItem}
//               onPress={() => handleActivityClick(activity)}
//               activeOpacity={0.7}
//             >
//               <View style={styles.activityLeft}>
//                 <View 
//                   style={[
//                     styles.activityIcon, 
//                     { backgroundColor: getActivityColor(activity.activity_type) + '15' }
//                   ]}
//                 >
//                   <Icon 
//                     name={getActivityIcon(activity.activity_type)} 
//                     size={18} 
//                     color={getActivityColor(activity.activity_type)} 
//                   />
//                 </View>
//                 <View style={styles.activityDetails}>
//                   <Text style={styles.cropName}>
//                     {activity.crop_name}
//                   </Text>
//                   <Text style={styles.activityDescription}>
//                     {activity.description}
//                   </Text>
//                   <View style={styles.activityFooter}>
//                     <Text style={styles.activityType}>
//                       {activity.activity_type} • {formatDate(activity.activity_date)}
//                     </Text>
//                     {activity.city && activity.city !== 'Unknown City' && (
//                       <Text style={styles.cityTextSmall}>📍 {activity.city}</Text>
//                     )}
//                   </View>
//                 </View>
//               </View>
              
//               <Pressable 
//                 style={styles.likeButton}
//                 onPress={(e) => handleLike(activity.id, e)}
//               >
//                 <Icon 
//                   name={activity.likes_count > 0 ? "favorite" : "favorite-border"} 
//                   size={16} 
//                   color={PALETTE.red} 
//                 />
//                 <Text style={styles.likeCount}>
//                   {activity.likes_count || 0}
//                 </Text>
//               </Pressable>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={PALETTE.green} />
//           <Text style={styles.loadingText}>Loading farmers activities...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <T style={styles.headerTitle}>👨‍🌾 Farmers Activities</T>
//         {/* <T style={styles.headerSubtitle}>See what farmers in your community are doing</T> */}
        
//         {feed.length > 0 && (
//           <Text style={styles.farmersCount}>
//             {feed.length} farmers sharing their activities
//           </Text>
//         )}
//       </View>

//       <FlatList
//         data={feed}
//         renderItem={({ item }) => <FarmerCard farmerGroup={item} />}
//         keyExtractor={(item, index) => item.farmer_name || index.toString()}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[PALETTE.green]}
//           />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <Icon name="people" size={64} color={PALETTE.gray} />
//             <Text style={styles.emptyTitle}>No Farmers Sharing Yet</Text>
//             <Text style={styles.emptyText}>
//               When farmers share their activities, they'll appear here
//             </Text>
//           </View>
//         }
//         contentContainerStyle={styles.listContent}
//       />
      
//       {/* MODAL FOR SHOWING ALL CROP ACTIVITIES */}
//       <CropActivitiesModal />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: PALETTE.bg,
//   },
//   header: {
//     padding: 16,
//     paddingBottom: 12,
//     backgroundColor: PALETTE.greenLite,
//     borderBottomLeftRadius: 16,
//     borderBottomRightRadius: 16,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     textAlign: 'center',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     textAlign: 'center',
//     marginTop: 4,
//   },
//   farmersCount: {
//     fontSize: 12,
//     color: PALETTE.green,
//     textAlign: 'center',
//     marginTop: 8,
//     fontWeight: '500',
//   },
//   listContent: {
//     padding: 16,
//     paddingTop: 12,
//   },
//   // FARMER CARD STYLES
//   farmerCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   farmerHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: PALETTE.gray,
//   },
//   farmerAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: PALETTE.green,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   avatarText: {
//     color: '#FFF',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   farmerInfo: {
//     flex: 1,
//   },
//   farmerName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     marginBottom: 4,
//   },
//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   },
//   location: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   locationText: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginLeft: 4,
//   },
//   cityBadge: {
//     fontSize: 11,
//     color: PALETTE.blue,
//     backgroundColor: PALETTE.blue + '10',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 10,
//   },
//   stats: {
//     alignItems: 'flex-end',
//   },
//   activityCount: {
//     fontSize: 12,
//     color: PALETTE.green,
//     fontWeight: '500',
//     marginBottom: 2,
//   },
//   likesCount: {
//     fontSize: 11,
//     color: PALETTE.muted,
//   },
//   // ACTIVITIES LIST STYLES
//   activitiesList: {
//     // Activities list container
//   },
//   activityItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f8f8f8',
//   },
//   activityLeft: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     flex: 1,
//   },
//   activityIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   activityDetails: {
//     flex: 1,
//   },
//   cropName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: PALETTE.green,
//     marginBottom: 2,
//   },
//   activityDescription: {
//     fontSize: 14,
//     color: PALETTE.text,
//     lineHeight: 18,
//     marginBottom: 4,
//   },
//   activityFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 2,
//   },
//   activityType: {
//     fontSize: 12,
//     color: PALETTE.muted,
//   },
//   cityTextSmall: {
//     fontSize: 11,
//     color: PALETTE.blue,
//     fontStyle: 'italic',
//   },
//   likeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 8,
//     marginLeft: 8,
//   },
//   likeCount: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginLeft: 4,
//     fontWeight: '500',
//     minWidth: 20,
//     textAlign: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: PALETTE.muted,
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: PALETTE.muted,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   // MODAL STYLES
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContainer: {
//     backgroundColor: '#FFF',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     height: '85%',
//     paddingTop: 16,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: PALETTE.gray,
//   },
//   closeButton: {
//     padding: 8,
//   },
//   modalTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     textAlign: 'center',
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     textAlign: 'center',
//     marginTop: 2,
//   },
//   placeholder: {
//     width: 40,
//   },
//   cropStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 16,
//     backgroundColor: PALETTE.greenLite,
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 12,
//   },
//   statBox: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: PALETTE.green,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginTop: 4,
//   },
//   statText: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginTop: 4,
//   },
//   modalContent: {
//     flex: 1,
//     padding: 16,
//   },
//   loadingModal: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: 200,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: PALETTE.text,
//     marginBottom: 16,
//   },
//   // TIMELINE STYLES
//   timelineItem: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   timelineDotContainer: {
//     alignItems: 'center',
//     width: 30,
//   },
//   timelineDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     zIndex: 1,
//   },
//   timelineLine: {
//     width: 2,
//     flex: 1,
//     backgroundColor: PALETTE.gray,
//     marginTop: 4,
//   },
//   timelineContent: {
//     flex: 1,
//     marginLeft: 12,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: PALETTE.gray,
//   },
//   timelineHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 4,
//   },
//   timelineLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   activityIconSmall: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 8,
//   },
//   timelineActivityType: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: PALETTE.text,
//   },
//   modalLikeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 6,
//   },
//   modalLikeCount: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   timelineDate: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginBottom: 8,
//   },
//   timelineDescription: {
//     fontSize: 14,
//     color: PALETTE.text,
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   detailText: {
//     fontSize: 13,
//     color: PALETTE.muted,
//     marginLeft: 8,
//     flex: 1,
//   },
//   remarksBox: {
//     backgroundColor: PALETTE.gray,
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 8,
//   },
//   remarksLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: PALETTE.muted,
//     marginBottom: 4,
//   },
//   remarksText: {
//     fontSize: 13,
//     color: PALETTE.text,
//     lineHeight: 18,
//   },
// });

// export default PublicFeedScreen;


// yeh code hmry pas bs us farmer ki jhn jhn lands wo show krwata ha
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activityAPI, farmerAPI } from './api';
import T from './localization/T';  // Smart Translation Component

const PALETTE = {
  bg: '#FFFFFF',
  text: '#111829ff',
  muted: '#6B7280',
  green: '#16A34A',
  greenLite: '#E7F8EA',
  blue: '#3B82F6',
  red: '#EF4444',
  yellow: '#F59E0B',
  gray: '#F3F4F6',
};

const PublicFeedScreen = ({ navigation }) => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [cropActivities, setCropActivities] = useState([]);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [loadingCropActivities, setLoadingCropActivities] = useState(false);
  
  // NEW: Farmer's lands cities for filtering
  const [farmerCities, setFarmerCities] = useState([]);
  const [farmerId, setFarmerId] = useState(null);

  // Load crop activities when an activity is clicked
  const loadCropActivities = async (activityId) => {
    try {
      if (!activityId) return;
      
      setLoadingCropActivities(true);
      console.log(' Loading crop activities for:', activityId);
      
      const response = await activityAPI.getCropActivitiesByActivity(activityId);
      console.log(' Crop activities response:', response);
      
      if (response && response.success && response.activities) {
        setCropActivities(response.activities);
        setShowAllActivities(true);
      } else {
        Alert.alert('Error', 'Could not load crop activities');
      }
    } catch (error) {
      console.error(' Error loading crop activities:', error);
      Alert.alert('Error', 'Failed to load crop details');
    } finally {
      setLoadingCropActivities(false);
    }
  };

  // Handle activity click
  const handleActivityClick = (activity) => {
    console.log(' Activity clicked:', activity);
    setSelectedActivity(activity);
    loadCropActivities(activity.id);
  };

  // Load farmer's lands to get cities for filtering
  const loadFarmerLands = async () => {
    try {
      const savedFarmerId = await AsyncStorage.getItem('farmerId');
      if (savedFarmerId) {
        const fid = parseInt(savedFarmerId);
        setFarmerId(fid);
        
        const response = await farmerAPI.getFarmerLandsWithStatus(fid);
        if (response.success && response.lands) {
          // Extract unique cities from farmer's lands
          const cities = [...new Set(response.lands.map(land => land.city).filter(Boolean))];
          setFarmerCities(cities);
          console.log(' Farmer cities:', cities);
        }
      }
    } catch (error) {
      console.error('Error loading farmer lands:', error);
    }
  };

  // Load public feed
  const loadPublicFeed = async () => {
    try {
      setLoading(true);
      console.log(' Loading public feed...');
      
      const response = await activityAPI.getPublicFeed();
      
      console.log(' API Response:', response);
      
      if (response && response.success && response.feed) {
        console.log(' Feed data received:', response.feed);
        
        // Filter by farmer's cities if available
        let filteredFeed = response.feed;
        if (farmerCities.length > 0) {
          filteredFeed = response.feed.filter(activity => {
            const activityCity = activity.city || activity.location || '';
            return farmerCities.some(city => 
              activityCity.toLowerCase().includes(city.toLowerCase()) ||
              city.toLowerCase().includes(activityCity.toLowerCase())
            );
          });
          console.log(` Filtered to ${filteredFeed.length} activities from farmer's cities`);
        }
        
        // Sort by likes (highest first)
        filteredFeed.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
        console.log(' Sorted by likes');
        
        const groupedFeed = groupActivitiesByFarmer(filteredFeed);
        console.log(' Grouped by farmer:', groupedFeed);
        
        // Sort groups by total likes (highest first)
        groupedFeed.sort((a, b) => (b.total_likes || 0) - (a.total_likes || 0));
        
        setFeed(groupedFeed);
      } else {
        console.log(' API response issue:', response);
        Alert.alert('Error', 'No public activities found');
        setFeed([]);
      }
    } catch (error) {
      console.error(' Error loading feed:', error);
      Alert.alert('Error', 'Server connection failed');
      setFeed([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // GROUP ACTIVITIES BY FARMER
  const groupActivitiesByFarmer = (activities) => {
    if (!activities || !Array.isArray(activities)) {
      console.log(' Invalid activities data:', activities);
      return [];
    }
    
    const grouped = {};
    
    activities.forEach(activity => {
      if (!activity) return;
      
      const farmerName = activity.farmer_name || 'Unknown Farmer';
      
      if (!grouped[farmerName]) {
        grouped[farmerName] = {
          farmer_name: farmerName,
          location: activity.location || 'Unknown Location',
          city: activity.city || 'Unknown City',
          activities: [],
          total_likes: 0
        };
      }
      
      grouped[farmerName].activities.push({
        id: activity.id || Math.random().toString(),
        crop_name: activity.crop_name || 'Unknown Crop',
        activity_type: activity.activity_type || 'Activity',
        description: activity.description || 'No description',
        activity_date: activity.activity_date || new Date().toISOString(),
        likes_count: activity.likes_count || 0,
        city: activity.city || 'Unknown City'
      });
      
      grouped[farmerName].total_likes += activity.likes_count || 0;
    });
    
    return Object.values(grouped);
  };

  // Load farmer lands first, then load feed
  useEffect(() => {
    loadFarmerLands();
  }, []);

  // Load feed after farmer cities are loaded
  useEffect(() => {
    loadPublicFeed();
  }, [farmerCities]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPublicFeed();
  };

  // ✅ Like activity
  const handleLike = async (activityId, e) => {
    e.stopPropagation(); // Prevent activity click
    try {
      if (!activityId) return;
      
      console.log('❤️ Liking activity:', activityId);
      
      const response = await activityAPI.likeActivity(activityId);
      
      console.log('👍 Like response:', response);
      
      if (response && response.success) {
        // Update in main feed
        setFeed(prevFeed => 
          prevFeed.map(farmerGroup => ({
            ...farmerGroup,
            activities: farmerGroup.activities.map(activity => 
              activity.id === activityId 
                ? { ...activity, likes_count: response.likes_count || 0 }
                : activity
            ),
            total_likes: farmerGroup.activities.reduce((sum, activity) => 
              sum + (activity.id === activityId ? (response.likes_count || 0) : (activity.likes_count || 0)), 0
            )
          }))
        );
        
        // Update in crop activities modal if open
        if (selectedActivity) {
          setCropActivities(prev => 
            prev.map(activity => 
              activity.id === activityId 
                ? { ...activity, likes_count: response.likes_count || 0 }
                : activity
            )
          );
        }
      }
    } catch (error) {
      console.error('👎 Like error:', error);
      Alert.alert('Error', 'Failed to like activity');
    }
  };

  // Get activity icon
  const getActivityIcon = (type) => {
    const icons = {
      planting: 'spa',
      irrigation: 'water-drop',
      fertilization: 'eco',
      pesticide: 'bug-report',
      harvesting: 'agriculture',
      weeding: 'delete',
      sowing: 'spa',
      'Pest Control': 'bug-report',
      'Expected Harvest': 'agriculture',
      'Sowing': 'spa',
      'Fertilization': 'eco',
      default: 'event-note'
    };
    return icons[type] || icons.default;
  };

  // Get activity color
  const getActivityColor = (type) => {
    const colors = {
      planting: '#16A34A',
      irrigation: '#3B82F6',
      fertilization: '#F59E0B',
      pesticide: '#EF4444',
      harvesting: '#8B5CF6',
      weeding: '#10B981',
      sowing: '#16A34A',
      'Pest Control': '#EF4444',
      'Expected Harvest': '#8B5CF6',
      'Fertilization': '#F59E0B',
      default: '#6B7280'
    };
    return colors[type] || colors.default;
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown date';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format full date
  const formatFullDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown date';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // ✅ MODAL FOR CROP ACTIVITIES
  const CropActivitiesModal = () => {
    if (!showAllActivities || !selectedActivity) return null;
    
    const selectedCropName = cropActivities.length > 0 
      ? cropActivities[0].crop_name 
      : selectedActivity.crop_name;
    
    const farmerName = cropActivities.length > 0 
      ? cropActivities[0].farmer_name 
      : selectedActivity.farmer_name;
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAllActivities}
        onRequestClose={() => setShowAllActivities(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAllActivities(false)}
              >
                <Icon name="close" size={24} color={PALETTE.text} />
              </TouchableOpacity>
              
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>{selectedCropName}</Text>
                <Text style={styles.modalSubtitle}>by {farmerName}</Text>
              </View>
              
              <View style={styles.placeholder} />
            </View>
            
            {/* Crop Stats */}
            <View style={styles.cropStats}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{cropActivities.length}</Text>
                <Text style={styles.statLabel}>Total Activities</Text>
              </View>
              
              <View style={styles.statBox}>
                <Icon name="location-on" size={20} color={PALETTE.green} />
                <Text style={styles.statText}>
                  {cropActivities.length > 0 ? cropActivities[0].location : 'Unknown'}
                </Text>
              </View>
            </View>
            
            {/* Activities List */}
            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {loadingCropActivities ? (
                <View style={styles.loadingModal}>
                  <ActivityIndicator size="large" color={PALETTE.green} />
                  <Text style={styles.loadingText}>Loading activities...</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>All Activities Timeline</Text>
                  
                  {cropActivities.map((activity, index) => (
                    <View key={activity.id} style={styles.timelineItem}>
                      {/* Timeline dot */}
                      <View style={styles.timelineDotContainer}>
                        <View 
                          style={[
                            styles.timelineDot, 
                            { backgroundColor: getActivityColor(activity.activity_type) }
                          ]}
                        />
                        {index !== cropActivities.length - 1 && (
                          <View style={styles.timelineLine} />
                        )}
                      </View>
                      
                      {/* Activity content */}
                      <View style={styles.timelineContent}>
                        <View style={styles.timelineHeader}>
                          <View style={styles.timelineLeft}>
                            <View style={[
                              styles.activityIconSmall,
                              { backgroundColor: getActivityColor(activity.activity_type) + '15' }
                            ]}>
                              <Icon 
                                name={getActivityIcon(activity.activity_type)} 
                                size={16} 
                                color={getActivityColor(activity.activity_type)} 
                              />
                            </View>
                            <Text style={styles.timelineActivityType}>
                              {activity.activity_type}
                            </Text>
                          </View>
                          
                          <Pressable 
                            style={styles.modalLikeButton}
                            onPress={(e) => handleLike(activity.id, e)}
                          >
                            <Icon 
                              name={activity.likes_count > 0 ? "favorite" : "favorite-border"} 
                              size={16} 
                              color={PALETTE.red} 
                            />
                            <Text style={styles.modalLikeCount}>
                              {activity.likes_count || 0}
                            </Text>
                          </Pressable>
                        </View>
                        
                        <Text style={styles.timelineDate}>
                          {formatFullDate(activity.activity_date)}
                        </Text>
                        
                        {activity.description && (
                          <Text style={styles.timelineDescription}>
                            {activity.description}
                          </Text>
                        )}
                        
                        {activity.chemical_or_fertilizer_used && (
                          <View style={styles.detailRow}>
                            <Icon name="science" size={14} color={PALETTE.muted} />
                            <Text style={styles.detailText}>
                              Used: {activity.chemical_or_fertilizer_used}
                            </Text>
                          </View>
                        )}
                        
                        {activity.remarks && (
                          <View style={styles.remarksBox}>
                            <Text style={styles.remarksLabel}>Remarks:</Text>
                            <Text style={styles.remarksText}>{activity.remarks}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // ✅ FARMER CARD
  const FarmerCard = ({ farmerGroup }) => {
    if (!farmerGroup || !farmerGroup.activities) {
      return null;
    }
    
    return (
      <View style={styles.farmerCard}>
        {/* FARMER HEADER */}
        <View style={styles.farmerHeader}>
          <View style={styles.farmerAvatar}>
            <Text style={styles.avatarText}>
              {farmerGroup.farmer_name?.charAt(0) || 'F'}
            </Text>
          </View>
          <View style={styles.farmerInfo}>
            <Text style={styles.farmerName}>
              {farmerGroup.farmer_name || 'Unknown Farmer'}
            </Text>
            <View style={styles.locationRow}>
              <View style={styles.location}>
                <Icon name="location-on" size={14} color={PALETTE.muted} />
                <Text style={styles.locationText}>{farmerGroup.location}</Text>
              </View>
              {farmerGroup.city && farmerGroup.city !== 'Unknown City' && (
                <Text style={styles.cityBadge}>🏙️ {farmerGroup.city}</Text>
              )}
            </View>
          </View>
          <View style={styles.stats}>
            <Text style={styles.activityCount}>
              {farmerGroup.activities.length} activities
            </Text>
            <Text style={styles.likesCount}>
              ❤️ {farmerGroup.total_likes || 0} likes
            </Text>
          </View>
        </View>

        {/* ACTIVITIES LIST */}
        <View style={styles.activitiesList}>
          {farmerGroup.activities.map((activity) => (
            <TouchableOpacity 
              key={activity.id} 
              style={styles.activityItem}
              onPress={() => handleActivityClick(activity)}
              activeOpacity={0.7}
            >
              <View style={styles.activityLeft}>
                <View 
                  style={[
                    styles.activityIcon, 
                    { backgroundColor: getActivityColor(activity.activity_type) + '15' }
                  ]}
                >
                  <Icon 
                    name={getActivityIcon(activity.activity_type)} 
                    size={18} 
                    color={getActivityColor(activity.activity_type)} 
                  />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.cropName}>
                    {activity.crop_name}
                  </Text>
                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>
                  <View style={styles.activityFooter}>
                    <Text style={styles.activityType}>
                      {activity.activity_type} • {formatDate(activity.activity_date)}
                    </Text>
                    {activity.city && activity.city !== 'Unknown City' && (
                      <Text style={styles.cityTextSmall}>📍 {activity.city}</Text>
                    )}
                  </View>
                </View>
              </View>
              
              <Pressable 
                style={styles.likeButton}
                onPress={(e) => handleLike(activity.id, e)}
              >
                <Icon 
                  name={activity.likes_count > 0 ? "favorite" : "favorite-border"} 
                  size={16} 
                  color={PALETTE.red} 
                />
                <Text style={styles.likeCount}>
                  {activity.likes_count || 0}
                </Text>
              </Pressable>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PALETTE.green} />
          <Text style={styles.loadingText}>Loading farmers activities...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <T style={styles.headerTitle}>👨‍🌾 Farmers Activities</T>
        {/* <T style={styles.headerSubtitle}>See what farmers in your community are doing</T> */}
        
        {feed.length > 0 && (
          <Text style={styles.farmersCount}>
            {feed.length} farmers sharing their activities
          </Text>
        )}
      </View>

      <FlatList
        data={feed}
        renderItem={({ item }) => <FarmerCard farmerGroup={item} />}
        keyExtractor={(item, index) => item.farmer_name || index.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[PALETTE.green]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="people" size={64} color={PALETTE.gray} />
            <Text style={styles.emptyTitle}>No Farmers Sharing Yet</Text>
            <Text style={styles.emptyText}>
              When farmers share their activities, they'll appear here
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      
      {/* MODAL FOR SHOWING ALL CROP ACTIVITIES */}
      <CropActivitiesModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.bg,
  },
  header: {
    padding: 16,
    paddingBottom: 12,
    backgroundColor: PALETTE.greenLite,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: PALETTE.text,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: PALETTE.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  farmersCount: {
    fontSize: 12,
    color: PALETTE.green,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingTop: 12,
  },
  // FARMER CARD STYLES
  farmerCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  farmerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.gray,
  },
  farmerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PALETTE.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  farmerInfo: {
    flex: 1,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PALETTE.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  locationText: {
    fontSize: 12,
    color: PALETTE.muted,
    marginLeft: 4,
  },
  cityBadge: {
    fontSize: 11,
    color: PALETTE.blue,
    backgroundColor: PALETTE.blue + '10',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  stats: {
    alignItems: 'flex-end',
  },
  activityCount: {
    fontSize: 12,
    color: PALETTE.green,
    fontWeight: '500',
    marginBottom: 2,
  },
  likesCount: {
    fontSize: 11,
    color: PALETTE.muted,
  },
  // ACTIVITIES LIST STYLES
  activitiesList: {
    // Activities list container
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: PALETTE.green,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: PALETTE.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  activityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  activityType: {
    fontSize: 12,
    color: PALETTE.muted,
  },
  cityTextSmall: {
    fontSize: 11,
    color: PALETTE.blue,
    fontStyle: 'italic',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 8,
  },
  likeCount: {
    fontSize: 12,
    color: PALETTE.muted,
    marginLeft: 4,
    fontWeight: '500',
    minWidth: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: PALETTE.muted,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PALETTE.muted,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: PALETTE.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.gray,
  },
  closeButton: {
    padding: 8,
  },
  modalTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PALETTE.text,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: PALETTE.muted,
    textAlign: 'center',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  cropStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: PALETTE.greenLite,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PALETTE.green,
  },
  statLabel: {
    fontSize: 12,
    color: PALETTE.muted,
    marginTop: 4,
  },
  statText: {
    fontSize: 12,
    color: PALETTE.muted,
    marginTop: 4,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  loadingModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PALETTE.text,
    marginBottom: 16,
  },
  // TIMELINE STYLES
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDotContainer: {
    alignItems: 'center',
    width: 30,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: PALETTE.gray,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.gray,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timelineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIconSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  timelineActivityType: {
    fontSize: 16,
    fontWeight: '600',
    color: PALETTE.text,
  },
  modalLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  modalLikeCount: {
    fontSize: 12,
    color: PALETTE.muted,
    marginLeft: 4,
    fontWeight: '500',
  },
  timelineDate: {
    fontSize: 12,
    color: PALETTE.muted,
    marginBottom: 8,
  },
  timelineDescription: {
    fontSize: 14,
    color: PALETTE.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: PALETTE.muted,
    marginLeft: 8,
    flex: 1,
  },
  remarksBox: {
    backgroundColor: PALETTE.gray,
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  remarksLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.muted,
    marginBottom: 4,
  },
  remarksText: {
    fontSize: 13,
    color: PALETTE.text,
    lineHeight: 18,
  },
});

export default PublicFeedScreen;