// // import React, { useState, useEffect } from 'react';
// // import {
// //   SafeAreaView,
// //   View,
// //   Text,
// //   FlatList,
// //   Switch,
// //   StyleSheet,
// //   Alert,
// //   RefreshControl,
// //   ActivityIndicator
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import { activityAPI } from './api';

// // const PALETTE = {
// //   bg: '#FFFFFF',
// //   text: '#111829ff',
// //   muted: '#6B7280',
// //   green: '#16A34A',
// //   greenLite: '#E7F8EA',
// //   blue: '#3B82F6',
// //   red: '#EF4444',
// //   gray: '#F3F4F6',
// // };

// // const ActivityPrivacyScreen = ({ route }) => {
// //   const { farmerId } = route.params || {};
// //   const [activities, setActivities] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);

// //   // Load farmer activities from your backend
// //   const loadActivities = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await activityAPI.getFarmerActivities(farmerId);
      
// //       if (response.success) {
// //         setActivities(response.activities || response.data || []);
// //       } else {
// //         Alert.alert('Error', 'Failed to load activities');
// //       }
// //     } catch (error) {
// //       console.error('Error loading activities:', error);
// //       Alert.alert('Error', 'Server connection failed');
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (farmerId) {
// //       loadActivities();
// //     }
// //   }, [farmerId]);

// //   // Toggle privacy using your backend API
// //   const togglePrivacy = async (activityId, currentStatus) => {
// //     try {
// //       const newStatus = !currentStatus;
      
// //       // Optimistic update
// //       setActivities(prev => 
// //         prev.map(activity => 
// //           activity.id === activityId 
// //             ? { ...activity, is_public: newStatus }
// //             : activity
// //         )
// //       );

// //       // API call to your backend
// //       const response = await activityAPI.updateActivityPrivacy(activityId, newStatus);
      
// //       if (response.success) {
// //         Alert.alert(
// //           'Success', 
// //           newStatus ? 'Activity is now public' : 'Activity is now private'
// //         );
// //       } else {
// //         throw new Error('API call failed');
// //       }
// //     } catch (error) {
// //       console.error('Error updating privacy:', error);
      
// //       // Revert on error
// //       setActivities(prev => 
// //         prev.map(activity => 
// //           activity.id === activityId 
// //             ? { ...activity, is_public: currentStatus }
// //             : activity
// //         )
// //       );
      
// //       Alert.alert('Error', 'Failed to update privacy setting');
// //     }
// //   };

// //   const onRefresh = () => {
// //     setRefreshing(true);
// //     loadActivities();
// //   };

// //   // Get activity icon
// //   const getActivityIcon = (type) => {
// //     const icons = {
// //       planting: 'spa',
// //       irrigation: 'water-drop',
// //       fertilization: 'eco',
// //       pesticide: 'bug-report',
// //       harvesting: 'agriculture',
// //       weeding: 'delete',
// //       default: 'event-note'
// //     };
// //     return icons[type] || icons.default;
// //   };

// //   // Format date from your backend
// //   const formatDate = (dateString) => {
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       month: 'short',
// //       day: 'numeric',
// //       year: 'numeric'
// //     });
// //   };

// //   // Activity item component
// //   const ActivityItem = ({ item }) => (
// //     <View style={styles.activityItem}>
// //       <View style={styles.activityHeader}>
// //         <View style={styles.activityIcon}>
// //           <Icon 
// //             name={getActivityIcon(item.activity_type)} 
// //             size={20} 
// //             color={PALETTE.green} 
// //           />
// //         </View>
// //         <View style={styles.activityInfo}>
// //           <Text style={styles.cropName}>{item.crop_name}</Text>
// //           <Text style={styles.activityType}>{item.activity_type}</Text>
// //           <Text style={styles.description}>{item.description}</Text>
// //           <Text style={styles.date}>{formatDate(item.activity_date)}</Text>
// //         </View>
// //       </View>
      
// //       <View style={styles.privacySection}>
// //         <Text style={styles.privacyLabel}>
// //           {item.is_public ? 'Public' : 'Private'}
// //         </Text>
// //         <Switch
// //           value={item.is_public}
// //           onValueChange={() => togglePrivacy(item.id, item.is_public)}
// //           trackColor={{ false: PALETTE.gray, true: PALETTE.greenLite }}
// //           thumbColor={item.is_public ? PALETTE.green : '#f4f3f4'}
// //         />
// //       </View>
// //     </View>
// //   );

// //   if (loading) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <View style={styles.loadingContainer}>
// //           <ActivityIndicator size="large" color={PALETTE.green} />
// //           <Text style={styles.loadingText}>Loading activities...</Text>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <Text style={styles.headerTitle}>Manage Activity Privacy</Text>
// //         <Text style={styles.headerSubtitle}>
// //           Control which activities are visible to other farmers
// //         </Text>
// //       </View>

// //       {/* Privacy Info */}
// //       <View style={styles.infoCard}>
// //         <Icon name="info" size={20} color={PALETTE.blue} />
// //         <Text style={styles.infoText}>
// //           Public activities will be visible to other farmers in the community feed
// //         </Text>
// //       </View>

// //       {/* Activities List */}
// //       <FlatList
// //         data={activities}
// //         renderItem={({ item }) => <ActivityItem item={item} />}
// //         keyExtractor={(item) => item.id.toString()}
// //         showsVerticalScrollIndicator={false}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             colors={[PALETTE.green]}
// //           />
// //         }
// //         ListEmptyComponent={
// //           <View style={styles.emptyState}>
// //             <Icon name="event-note" size={64} color={PALETTE.gray} />
// //             <Text style={styles.emptyTitle}>No Activities Found</Text>
// //             <Text style={styles.emptyText}>
// //               Your farming activities will appear here
// //             </Text>
// //           </View>
// //         }
// //         contentContainerStyle={styles.listContent}
// //       />
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: PALETTE.bg,
// //   },
// //   header: {
// //     padding: 16,
// //     paddingBottom: 8,
// //     backgroundColor: PALETTE.greenLite,
// //   },
// //   headerTitle: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: PALETTE.text,
// //     textAlign: 'center',
// //   },
// //   headerSubtitle: {
// //     fontSize: 14,
// //     color: PALETTE.muted,
// //     textAlign: 'center',
// //     marginTop: 4,
// //   },
// //   infoCard: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#EFF6FF',
// //     padding: 16,
// //     margin: 16,
// //     borderRadius: 8,
// //     borderLeftWidth: 4,
// //     borderLeftColor: PALETTE.blue,
// //   },
// //   infoText: {
// //     flex: 1,
// //     fontSize: 14,
// //     color: PALETTE.text,
// //     marginLeft: 12,
// //     lineHeight: 20,
// //   },
// //   listContent: {
// //     padding: 16,
// //     paddingTop: 8,
// //   },
// //   activityItem: {
// //     backgroundColor: '#FFF',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 12,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   activityHeader: {
// //     flexDirection: 'row',
// //     flex: 1,
// //   },
// //   activityIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: PALETTE.greenLite,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginRight: 12,
// //   },
// //   activityInfo: {
// //     flex: 1,
// //   },
// //   cropName: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: PALETTE.text,
// //     marginBottom: 2,
// //   },
// //   activityType: {
// //     fontSize: 14,
// //     color: PALETTE.green,
// //     marginBottom: 4,
// //     textTransform: 'capitalize',
// //   },
// //   description: {
// //     fontSize: 12,
// //     color: PALETTE.muted,
// //     marginBottom: 4,
// //   },
// //   date: {
// //     fontSize: 11,
// //     color: PALETTE.muted,
// //   },
// //   privacySection: {
// //     alignItems: 'center',
// //   },
// //   privacyLabel: {
// //     fontSize: 12,
// //     color: PALETTE.muted,
// //     marginBottom: 4,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   loadingText: {
// //     marginTop: 12,
// //     fontSize: 16,
// //     color: PALETTE.muted,
// //   },
// //   emptyState: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 40,
// //   },
// //   emptyTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: PALETTE.muted,
// //     marginTop: 16,
// //     marginBottom: 8,
// //   },
// //   emptyText: {
// //     fontSize: 14,
// //     color: PALETTE.muted,
// //     textAlign: 'center',
// //     lineHeight: 20,
// //   },
// // });

// // export default ActivityPrivacyScreen;
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { activityAPI } from "../api/activityAPI"; // 👈 make sure correct import path

// const ActivityPrivacyScreen = ({ route }) => {
//   const { farmerId } = route.params; // 👈 from navigation
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch farmer activities from backend
//   const fetchActivities = async () => {
//     setLoading(true);
//     try {
//       const response = await activityAPI.getFarmerActivities(farmerId);
//       console.log("🟢 API Response:", response);

//       if (response.success && Array.isArray(response.activities)) {
//         setActivities(response.activities);
//       } else {
//         console.log("⚠️ Unexpected format:", response);
//         setActivities([]);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching activities:", error);
//       Alert.alert("Error", "Failed to fetch activities.");
//       setActivities([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Like toggle handler
//   const handleLike = async (activityId) => {
//     try {
//       const response = await activityAPI.likeActivity(activityId);
//       console.log("❤️ Like Response:", response);

//       if (response.success) {
//         // Update likes count locally
//         setActivities((prev) =>
//           prev.map((a) =>
//             a.id === activityId ? { ...a, likes_count: response.likes_count } : a
//           )
//         );
//       } else {
//         Alert.alert("Error", response.message || "Failed to like activity.");
//       }
//     } catch (error) {
//       console.error("Like error:", error);
//       Alert.alert("Error", "Unable to process like action.");
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#2E8B57" />
//         <Text style={styles.loadingText}>Loading activities...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Farmer Activities</Text>

//       {activities.length === 0 ? (
//         <Text style={styles.emptyText}>No activities found.</Text>
//       ) : (
//         activities.map((activity) => (
//           <View key={activity.id} style={styles.card}>
//             <Text style={styles.title}>{activity.activity_type}</Text>
//             <Text style={styles.desc}>{activity.description}</Text>
//             <Text style={styles.detail}>
//               📅 {activity.activity_date || "No date"}
//             </Text>
//             <Text style={styles.detail}>
//               🧪 {activity.chemical_or_fertilizer_used || "N/A"}
//             </Text>
//             <Text style={styles.detail}>
//               💬 {activity.remarks || "No remarks"}
//             </Text>
//             <Text style={styles.detail}>
//               🔒 Privacy:{" "}
//               {activity.is_public === 1 || activity.is_public === true
//                 ? "Public"
//                 : "Private"}
//             </Text>

//             <View style={styles.likeContainer}>
//               <TouchableOpacity
//                 onPress={() => handleLike(activity.id)}
//                 style={styles.likeButton}
//               >
//                 <Text style={styles.likeText}>❤️ {activity.likes_count}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// // ------------------ Styles ------------------ //
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//     paddingHorizontal: 16,
//     paddingTop: 10,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#2E8B57",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   desc: {
//     fontSize: 14,
//     color: "#555",
//     marginVertical: 5,
//   },
//   detail: {
//     fontSize: 13,
//     color: "#666",
//     marginTop: 2,
//   },
//   likeContainer: {
//     marginTop: 10,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   likeButton: {
//     backgroundColor: "#2E8B57",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 6,
//   },
//   likeText: {
//     color: "white",
//     fontWeight: "600",
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: 40,
//     color: "#777",
//     fontSize: 16,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     color: "#666",
//     marginTop: 10,
//   },
// });

// export default ActivityPrivacyScreen;




// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { activityAPI } from "../api"; // ✅ Make sure correct import path

// const ActivityPrivacyScreen = ({ route, navigation }) => {
//   // ✅ Safely extract farmerId
//   const farmerId = route?.params?.farmerId;

//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Function to fetch farmer activities
//   const fetchActivities = async () => {
//     if (!farmerId) {
//       Alert.alert("Missing Data", "Farmer ID is missing!");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await activityAPI.getFarmerActivities(farmerId);
//       console.log("🟢 API Response:", response);

//       if (response.success && Array.isArray(response.activities)) {
//         // Ensure likes_count is always a number
//         const cleanData = response.activities.map((a) => ({
//           ...a,
//           likes_count: a.likes_count || 0,
//         }));
//         setActivities(cleanData);
//       } else {
//         console.log("⚠️ Unexpected format:", response);
//         setActivities([]);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching activities:", error);
//       Alert.alert("Error", "Failed to fetch activities from server.");
//       setActivities([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Like toggle handler
//   const handleLike = async (activityId) => {
//     try {
//       const response = await activityAPI.likeActivity(activityId);
//       console.log("❤️ Like Response:", response);

//       if (response.success) {
//         setActivities((prev) =>
//           prev.map((a) =>
//             a.id === activityId
//               ? { ...a, likes_count: response.likes_count }
//               : a
//           )
//         );
//       } else {
//         Alert.alert("Error", response.message || "Failed to like activity.");
//       }
//     } catch (error) {
//       console.error("Like error:", error);
//       Alert.alert("Error", "Unable to process like action.");
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//   }, [farmerId]);

//   // ✅ Loading state
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#2E8B57" />
//         <Text style={styles.loadingText}>Loading activities...</Text>
//       </View>
//     );
//   }

//   // ✅ If no farmerId provided
//   if (!farmerId) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.emptyText}>❌ Farmer ID not provided!</Text>
//       </View>
//     );
//   }

//   // ✅ UI rendering
//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Farmer Activities</Text>

//       {activities.length === 0 ? (
//         <Text style={styles.emptyText}>No activities found.</Text>
//       ) : (
//         activities.map((activity) => (
//           <View key={activity.id} style={styles.card}>
//             <Text style={styles.title}>{activity.activity_type}</Text>
//             <Text style={styles.desc}>{activity.description}</Text>
//             <Text style={styles.detail}>
//               📅 {activity.activity_date || "No date"}
//             </Text>
//             <Text style={styles.detail}>
//               🧪 {activity.chemical_or_fertilizer_used || "N/A"}
//             </Text>
//             <Text style={styles.detail}>
//               💬 {activity.remarks || "No remarks"}
//             </Text>
//             <Text style={styles.detail}>
//               🔒 Privacy:{" "}
//               {activity.is_public === 1 || activity.is_public === true
//                 ? "Public"
//                 : "Private"}
//             </Text>

//             <View style={styles.likeContainer}>
//               <TouchableOpacity
//                 onPress={() => handleLike(activity.id)}
//                 style={styles.likeButton}
//               >
//                 <Text style={styles.likeText}>
//                   ❤️ {activity.likes_count ?? 0}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// // ------------------ Styles ------------------ //
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//     paddingHorizontal: 16,
//     paddingTop: 10,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#2E8B57",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   desc: {
//     fontSize: 14,
//     color: "#555",
//     marginVertical: 5,
//   },
//   detail: {
//     fontSize: 13,
//     color: "#666",
//     marginTop: 2,
//   },
//   likeContainer: {
//     marginTop: 10,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   likeButton: {
//     backgroundColor: "#2E8B57",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 6,
//   },
//   likeText: {
//     color: "white",
//     fontWeight: "600",
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: 40,
//     color: "#777",
//     fontSize: 16,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     color: "#666",
//     marginTop: 10,
//   },
// });

// export default ActivityPrivacyScreen;



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  RefreshControl
} from "react-native";
import { activityAPI, authAPI } from "./api"; // ✅ authAPI bhi import karein

const ActivityPrivacyScreen = ({ navigation }) => {
  const [farmerId, setFarmerId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Automatically fetch current farmer on screen load
  useEffect(() => {
    fetchCurrentFarmer();
  }, []);

  // ✅ Get current logged-in farmer
  
const fetchCurrentFarmer = async () => {
  try {
    console.log('🔍 Fetching current farmer...');
    
    // ✅ Backend se current user ka data lein
    const response = await authAPI.getCurrentUser();
    console.log('👨‍🌾 Current User Response:', response);

    // ✅ Backend ka response me "farmer_id" hota hai
    if (response?.farmer_id) {
      const currentFarmerId = response.farmer_id;
      console.log('✅ Current Farmer ID:', currentFarmerId);

      setFarmerId(currentFarmerId);
      fetchActivities(currentFarmerId); // farmer ki activities fetch karo
    } else {
      console.log('❌ No user logged in, redirecting to login...');
      Alert.alert("Session Expired", "Please login again", [
        { text: "OK", onPress: () => navigation.navigate('Login') }
      ]);
    }
  } catch (error) {
    console.error('❌ Error fetching current user:', error);
    Alert.alert("Error", "Unable to fetch user data. Please login again.", [
      { text: "OK", onPress: () => navigation.navigate('Login') }
    ]);
  }
};


  // ✅ Fetch farmer activities
  const fetchActivities = async (id) => {
    setLoading(true);
    try {
      console.log('📡 Fetching activities for farmer:', id);
      const response = await activityAPI.getFarmerActivities(id);
      console.log("🟢 Activities API Response:", response);

      if (response.success && Array.isArray(response.activities)) {
        // Ensure likes_count is always a number
        const cleanData = response.activities.map((a) => ({
          ...a,
          likes_count: a.likes_count || 0,
        }));
        setActivities(cleanData);
        console.log(`✅ Loaded ${cleanData.length} activities`);
      } else {
        console.log("⚠️ Unexpected format:", response);
        setActivities([]);
      }
    } catch (error) {
      console.error("❌ Error fetching activities:", error);
      Alert.alert("Error", "Failed to fetch activities from server.");
      setActivities([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ Like toggle handler
  const handleLike = async (activityId) => {
    try {
      console.log('❤️ Liking activity:', activityId);
      const response = await activityAPI.likeActivity(activityId);
      console.log("❤️ Like Response:", response);

      if (response.success) {
        setActivities((prev) =>
          prev.map((a) =>
            a.id === activityId
              ? { ...a, likes_count: response.likes_count }
              : a
          )
        );
      } else {
        Alert.alert("Error", response.message || "Failed to like activity.");
      }
    } catch (error) {
      console.error("Like error:", error);
      Alert.alert("Error", "Unable to process like action.");
    }
  };

  // ✅ Privacy toggle handler
  const togglePrivacy = async (activityId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      console.log('🔒 Toggling privacy for activity:', activityId, 'New status:', newStatus);
      
      const response = await activityAPI.updateActivityPrivacy(activityId, newStatus);
      
      if (response.success) {
        setActivities(prev =>
          prev.map(a =>
            a.id === activityId
              ? { ...a, is_public: newStatus }
              : a
          )
        );
        Alert.alert("Success", `Activity is now ${newStatus ? 'public' : 'private'}`);
      } else {
        Alert.alert("Error", "Failed to update privacy");
      }
    } catch (error) {
      console.error("Privacy toggle error:", error);
      Alert.alert("Error", "Unable to update privacy setting.");
    }
  };

  // ✅ Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    if (farmerId) {
      fetchActivities(farmerId);
    } else {
      fetchCurrentFarmer();
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E8B57" />
        <Text style={styles.loadingText}>
          Loading your activities...
        </Text>
      </View>
    );
  }

  // ✅ UI rendering
  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#2E8B57"]}
        />
      }
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My Activities & Privacy</Text>
        <Text style={styles.subHeader}>
          Manage your activities and their visibility
        </Text>
        {farmerId && (
          <Text style={styles.farmerIdText}>Farmer ID: {farmerId}</Text>
        )}
      </View>

      {activities.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No activities found.</Text>
          <Text style={[styles.emptyText, { fontSize: 14 }]}>
            Start by adding your first farming activity.
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={onRefresh}
          >
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        activities.map((activity) => (
          <View key={activity.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{activity.activity_type}</Text>
              <Text style={styles.cropName}>{activity.crop_name}</Text>
            </View>
            
            <Text style={styles.desc}>{activity.description}</Text>
            
            <View style={styles.detailsContainer}>
              <Text style={styles.detail}>
                📅 {activity.activity_date || "No date"}
              </Text>
              {activity.chemical_or_fertilizer_used && (
                <Text style={styles.detail}>
                  🧪 {activity.chemical_or_fertilizer_used}
                </Text>
              )}
              {activity.remarks && (
                <Text style={styles.detail}>
                  💬 {activity.remarks}
                </Text>
              )}
            </View>

            <View style={styles.actionsContainer}>
              <View style={styles.privacyContainer}>
                <Text style={styles.privacyLabel}>
                  {activity.is_public ? 'Public' : 'Private'}
                </Text>
                <Switch
                  value={activity.is_public}
                  onValueChange={() => togglePrivacy(activity.id, activity.is_public)}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={activity.is_public ? '#2E8B57' : '#f4f3f4'}
                />
              </View>

              <TouchableOpacity
                onPress={() => handleLike(activity.id)}
                style={styles.likeButton}
              >
                <Text style={styles.likeText}>
                  ❤️ {activity.likes_count ?? 0}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

// ------------------ Styles ------------------ //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E8B57",
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    textAlign: 'center',
    marginBottom: 5,
  },
  farmerIdText: {
    fontSize: 12,
    color: "#888",
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  cropName: {
    fontSize: 14,
    color: "#2E8B57",
    fontWeight: '600',
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 12,
  },
  detail: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
    fontWeight: '500',
  },
  likeButton: {
    backgroundColor: "#2E8B57",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  likeText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#666",
    marginTop: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2E8B57",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ActivityPrivacyScreen;