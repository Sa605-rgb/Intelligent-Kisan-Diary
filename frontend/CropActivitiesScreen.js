
// yeh bgair marketrate wali screen hai jis ma sirf yield wala kam hai 


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
//   RefreshControl,
//   Alert,
//   Modal,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   BackHandler
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { farmerAPI } from './api';
// import T from './localization/T';  // ✅ Smart Translation Component

// const PALETTE = {
//   bg: '#FFFFFF',
//   text: '#111829',
//   muted: '#6B7280',
//   green: '#16A34A',
//   greenLite: '#E7F8EA',
//   gray: '#F3F4F6',
//   blue: '#1E40AF',
//   orange: '#EA580C',
//   red: '#DC2626'
// };

// // ✅ Progress Bar Component
// const ProgressBar = ({ completed, total, cropName, onCompletion }) => {
//   const percentage = total > 0 ? (completed / total) * 100 : 0;
//   const isCompleted = percentage === 100 && total > 0;
  
//   React.useEffect(() => {
//     if (isCompleted && onCompletion) {
//       onCompletion();
//     }
//   }, [isCompleted, onCompletion]);
  
//   return (
//     <View style={styles.progressContainer}>
//       <View style={styles.progressHeader}>
//         <Text style={styles.progressText}>
//           Progress: {completed}/{total} ({Math.round(percentage)}%)
//         </Text>
//         {isCompleted && (
//           <View style={styles.completedBadge}>
//             <Icon name="verified" size={14} color="white" />
//             <Text style={styles.completedBadgeText}>COMPLETED</Text>
//           </View>
//         )}
//       </View>
//       <View style={styles.progressBar}>
//         <View 
//           style={[
//             styles.progressFill,
//             { width: `${percentage}%` },
//             isCompleted && styles.progressComplete
//           ]} 
//         />
//       </View>
//       {isCompleted && (
//         <Text style={styles.completionMessage}>
//           🎉 Ready to move to history!
//         </Text>
//       )}
//     </View>
//   );
// };

// function CropActivitiesScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();
  
//   const [crops, setCrops] = useState([]);
//   const [selectedCropId, setSelectedCropId] = useState(null);
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);

//   // ✅ State for Activity Completion
//   const [completingActivity, setCompletingActivity] = useState(null);
  
//   // ✅ Yield Modal State
//   const [showYieldModal, setShowYieldModal] = useState(false);
//   const [actualYield, setActualYield] = useState('');
//   const [selectedHarvestingActivity, setSelectedHarvestingActivity] = useState(null);
//   const [savingYield, setSavingYield] = useState(false);
//   const [yieldError, setYieldError] = useState('');

//   // ✅ Auto-completion state
//   const [autoCompleting, setAutoCompleting] = useState(false);
//   const [showAutoCompleteConfirm, setShowAutoCompleteConfirm] = useState(false);

//   // ✅ FIX: Notification control refs
//   const notificationShownRef = useRef(false);
//   const hasNavigatedRef = useRef(false);
//   const notificationTimeoutRef = useRef(null);

//   // ✅ Date comparison
//   const isActivityCompleted = (activityDate) => {
//     try {
//       if (!activityDate) return false;
      
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       const activityDateObj = new Date(activityDate);
//       activityDateObj.setHours(0, 0, 0, 0);
      
//       return activityDateObj <= today;
//     } catch (error) {
//       console.error('Date comparison error:', error);
//       return false;
//     }
//   };

//   // ✅ User selection-based status
//   const getActivityStatus = (activity) => {
//     let isCompleted = false;
    
//     if (activity.activity_type === 'Sowing') {
//       isCompleted = isActivityCompleted(activity.activity_date);
//     }
//     else if (activity.activity_type === 'Fertilization' || activity.activity_type === 'Pest Control') {
//       const hasChemical = !!activity.chemical_or_fertilizer_used;
//       const datePassed = isActivityCompleted(activity.activity_date);
//       isCompleted = hasChemical && datePassed;
//     }
//     else {
//       isCompleted = isActivityCompleted(activity.activity_date);
//     }
    
//     return {
//       isCompleted,
//       statusColor: isCompleted ? PALETTE.green : PALETTE.blue,
//       statusText: isCompleted ? 'Completed' : 'Upcoming'
//     };
//   };

//   // ✅ FIXED: Auto-navigate to FarmerActivitiesScreen (Single Notification)
//   const handleAutoNavigate = () => {
//     const cropName = selectedCrop?.crop_name;
    
//     // Check if already shown or navigating
//     if (hasNavigatedRef.current || notificationShownRef.current) {
//       console.log('⚠️ Notification already shown or navigating');
//       return;
//     }
    
//     notificationShownRef.current = true;
//     hasNavigatedRef.current = true;
    
//     console.log('🎉 Showing completion notification');
    
//     Alert.alert(
//       'Crop Completed! 🎉',
//       `All activities for ${cropName} are completed!\n\nThis crop will be moved to your history.`,
//       [
//         {
//           text: 'View History',
//           onPress: () => {
//             // Reset flags
//             notificationShownRef.current = false;
//             hasNavigatedRef.current = false;
            
//             // Clear timeout if exists
//             if (notificationTimeoutRef.current) {
//               clearTimeout(notificationTimeoutRef.current);
//               notificationTimeoutRef.current = null;
//             }
            
//             // Navigate to history
//             loadFarmerCrops();
//             navigation.navigate('FarmerActivitiesScreen');
//           }
//         }
//       ]
    
//     );
//   };

//   // ✅ Load only crops with pending activities
//   const loadFarmerCrops = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const savedFarmerId = await AsyncStorage.getItem('farmerId');
      
//       if (!savedFarmerId) {
//         setError('Farmer not found. Please login again.');
//         setLoading(false);
//         return;
//       }

//       const farmerId = parseInt(savedFarmerId);
      
//       console.log('Loading ALL crops for farmer:', farmerId);
//       const response = await farmerAPI.getFarmerCurrentCrops(farmerId);
      
//       if (response.success && response.crops) {
//         const cropsWithStatus = [];
        
//         for (const crop of response.crops) {
//           try {
//             const activitiesResponse = await farmerAPI.getCropActivities(crop.crop_history_id);
            
//             if (activitiesResponse.success && activitiesResponse.activities) {
//               const allActivities = activitiesResponse.activities;
//               const completedCount = allActivities.filter(activity => {
//                 const status = getActivityStatus(activity);
//                 return status.isCompleted;
//               }).length;
              
//               const totalCount = allActivities.length;
//               const isCompleted = (completedCount === totalCount) && (totalCount > 0);
              
//               if (!isCompleted) {
//                 cropsWithStatus.push({
//                   ...crop,
//                   crop_history_id: crop.crop_history_id,
//                   crop_name: crop.crop_name,
//                   city: crop.city,
//                   area: crop.area,
//                   zone: crop.zone,
//                   land_id: crop.land_id,
//                   season: crop.season,
//                   sowing_date: crop.sowing_date,
//                   harvest_date: crop.harvest_date,
//                   yield_per_40kg: crop.yield_per_40kg,
//                   completion_status: 'active',
//                   completed_activities: completedCount,
//                   total_activities: totalCount
//                 });
//               } else {
//                 console.log(`🚫 Skipping completed crop: ${crop.crop_name}`);
//               }
//             } else {
//               cropsWithStatus.push({
//                 ...crop,
//                 yield_per_40kg: crop.yield_per_40kg,
//                 completion_status: 'active',
//                 completed_activities: 0,
//                 total_activities: 0
//               });
//             }
//           } catch (error) {
//             console.error(`Error checking activities for crop ${crop.crop_name}:`, error);
//             cropsWithStatus.push({
//               ...crop,
//               yield_per_40kg: crop.yield_per_40kg,
//               completion_status: 'active',
//               completed_activities: 0,
//               total_activities: 0
//             });
//           }
//         }
        
//         setCrops(cropsWithStatus);
//         console.log(`✅ Active crops: ${cropsWithStatus.length}/${response.crops.length}`);
        
//         // ✅ FIX: Check if selected crop is still in the active list
//         const selectedCropStillActive = cropsWithStatus.find(c => c.crop_history_id === selectedCropId);
        
//         if (cropsWithStatus.length > 0) {
//           if (!selectedCropStillActive) {
//             // ✅ Selected crop was completed - select first available crop
//             console.log('🔄 Previously selected crop completed, selecting new crop');
//             const firstCropId = cropsWithStatus[0].crop_history_id;
//             setSelectedCropId(firstCropId);
//             setActivities([]); // Clear old activities
//             loadCropActivities(firstCropId, cropsWithStatus[0].crop_name);
//           }
//         } else {
//           // ✅ No active crops - clear selection and show empty state
//           console.log('📭 No active crops remaining');
//           setSelectedCropId(null);
//           setActivities([]);
//           setError(null);
//         }
//       } else {
//         setError(response.message || 'Failed to load crops data');
//       }
//     } catch (error) {
//       console.error('Error loading farmer crops:', error);
//       setError('Failed to load crops: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FIXED: Load crop activities (No duplicate notifications)
//   const loadCropActivities = async (cropHistoryId, selectedCropName) => {
//     try {
//       setError(null);
//       setLoading(true);
      
//       console.log('🔄 Loading activities for crop:', cropHistoryId);
      
//       const activitiesResponse = await farmerAPI.getCropActivities(cropHistoryId);
      
//       if (activitiesResponse.success && activitiesResponse.activities) {
//         const allActivities = activitiesResponse.activities;
        
//         const activitiesWithStatus = allActivities.map(activity => {
//           const status = getActivityStatus(activity);
//           return {
//             ...activity,
//             isCompleted: status.isCompleted
//           };
//         });
        
//         const completedCount = activitiesWithStatus.filter(a => a.isCompleted).length;
//         const totalCount = activitiesWithStatus.length;
        
//         console.log(`📈 Completion: ${completedCount}/${totalCount}`);
        
//         setActivities(activitiesWithStatus);
        
//         // ✅ FIX: Don't auto-navigate - wait for yield to be entered
//         if (completedCount === totalCount && totalCount > 0) {
//           console.log('✅ ALL ACTIVITIES COMPLETED! Waiting for yield entry...');
//           // Don't auto-navigate - user needs to enter yield first
//         }
        
//         if (allActivities.length === 0) {
//           setError(`No activities found for ${selectedCropName}.`);
//         }
//       } else {
//         console.log('🟡 No activities found');
//         setActivities([]);
//         setError(`No activities found for ${selectedCropName}.`);
//       }
      
//     } catch (error) {
//       console.error('❌ Error loading activities:', error);
//       setError('Failed to load activities');
//       setActivities([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Handle Crop Selection
//   const handleCropSelect = (crop) => {
//     console.log('Crop selected:', crop.crop_history_id, crop.crop_name);
//     setSelectedCropId(crop.crop_history_id);
//     setActivities([]);
//     loadCropActivities(crop.crop_history_id, crop.crop_name);
//   };

//   // ✅ MARK ACTIVITY AS COMPLETE (NEW LOGIC: Harvesting pehle complete ho, phir yield)
//   const markActivityAsComplete = async (activity) => {
//     try {
//       setCompletingActivity(activity.id);
      
//       // ✅ Check if it's Harvesting activity
//       if (activity.activity_type === 'Harvesting') {
//         // ✅ PEHLE HARVESTING COMPLETE KARO (YIELD KE BAGHAIR)
//         const today = new Date();
//         const completedDate = today.toISOString();
        
//         const response = await farmerAPI.updateActivityCompletion({
//           activityId: activity.id,
//           cropHistoryId: selectedCropId,
//           completed: true,
//           completedDate: completedDate,
//           remarks: 'Harvesting completed. Yield to be entered.'
//         });
        
//         if (response.success) {
//           console.log('✅ Harvesting activity marked as complete');
          
//           // ✅ UPDATE LOCAL STATE IMMEDIATELY with completed_date
//           const updatedActivities = activities.map(a => 
//             a.id === activity.id ? { ...a, isCompleted: true, completed_date: completedDate } : a
//           );
//           setActivities(updatedActivities);
          
//           // ✅ PHIR YIELD MODAL DIKHAO
//           setSelectedHarvestingActivity(activity);
//           setActualYield('');
//           setYieldError('');
//           setShowYieldModal(true);
          
//           // Show success message
//           Alert.alert(
//             'Harvesting Complete! ✅',
//             'Harvesting marked as complete. Now enter yield.',
//             [{ text: 'OK' }]
//           );
          
//         } else {
//           Alert.alert('Error', response.message || 'Failed to complete harvesting');
//         }
        
//         setCompletingActivity(null);
//         return;
//       }
      
//       // ✅ For non-Harvesting activities
//       const today = new Date();
//       const completedDate = today.toISOString();
      
//       const response = await farmerAPI.updateActivityCompletion({
//         activityId: activity.id,
//         cropHistoryId: selectedCropId,
//         completed: true,
//         completedDate: completedDate,
//         remarks: `Manually completed on ${today.toLocaleDateString()}`
//       });
      
//       if (response.success) {
//         console.log('✅ Activity marked as complete:', activity.activity_type);
        
//         // ✅ UPDATE LOCAL STATE IMMEDIATELY with completed_date
//         const updatedActivities = activities.map(a => 
//           a.id === activity.id ? { ...a, isCompleted: true, completed_date: completedDate } : a
//         );
//         setActivities(updatedActivities);
        
//         // ✅ Check if completed on time, early, or late
//         const scheduledDate = new Date(activity.activity_date);
//         scheduledDate.setHours(0, 0, 0, 0);
//         const todayDate = new Date();
//         todayDate.setHours(0, 0, 0, 0);
        
//         let statusMessage = '';
//         if (todayDate.getTime() === scheduledDate.getTime()) {
//           statusMessage = '\n\n✅ Aap ki date aa gayi thi - on time complete kiya!';
//         } else if (todayDate > scheduledDate) {
//           const daysLate = Math.floor((todayDate - scheduledDate) / (1000 * 60 * 60 * 24));
//           statusMessage = `\n\n⚠️ Aap ${daysLate} din late ho gaye hain!`;
//         } else {
//           const daysEarly = Math.floor((scheduledDate - todayDate) / (1000 * 60 * 60 * 24));
//           statusMessage = `\n\n🎉 Aap ne ${daysEarly} din pehle complete kar diya!`;
//         }
        
//         // Show success message with timing info
//         Alert.alert(
//           'Activity Completed! ✅',
//           `${getDisplayActivityType(activity.activity_type)} marked as complete.${statusMessage}`,
//           [{ text: 'OK' }]
//         );
        
//         // ✅ Check if all activities are now completed
//         const newCompletedCount = updatedActivities.filter(a => a.isCompleted).length;
//         if (newCompletedCount === updatedActivities.length && updatedActivities.length > 0) {
//           console.log('🎯 All activities completed after this action');
//           // ✅ Refresh crop list to remove this completed crop
//           setTimeout(() => {
//             loadFarmerCrops();
//           }, 500);
//         }
//       } else {
//         Alert.alert('Error', response.message || 'Failed to complete activity');
//       }
//     } catch (error) {
//       console.error('❌ Error completing activity:', error);
//       Alert.alert('Error', 'Failed to complete activity');
//     } finally {
//       if (activity.activity_type !== 'Harvesting') {
//         setCompletingActivity(null);
//       }
//     }
//   };

//   // ✅ MARK ACTIVITY AS INCOMPLETE (Uncheck functionality)
//   const markActivityAsIncomplete = async (activity) => {
//     try {
//       setCompletingActivity(activity.id);
      
//       const response = await farmerAPI.updateActivityCompletion({
//         activityId: activity.id,
//         cropHistoryId: selectedCropId,
//         completed: false,
//         completedDate: null,
//         remarks: 'Marked as incomplete'
//       });
      
//       if (response.success) {
//         console.log('✅ Activity marked as incomplete:', activity.activity_type);
        
//         // ✅ UPDATE LOCAL STATE - remove completion
//         const updatedActivities = activities.map(a => 
//           a.id === activity.id ? { ...a, isCompleted: false, completed_date: null } : a
//         );
//         setActivities(updatedActivities);
        
//         Alert.alert(
//           'Activity Unchecked ↩️',
//           `${getDisplayActivityType(activity.activity_type)} marked as incomplete.`,
//           [{ text: 'OK' }]
//         );
//       } else {
//         Alert.alert('Error', response.message || 'Failed to uncheck activity');
//       }
//     } catch (error) {
//       console.error('❌ Error unchecking activity:', error);
//       Alert.alert('Error', 'Failed to uncheck activity');
//     } finally {
//       setCompletingActivity(null);
//     }
//   };

//   // ✅ AUTO-COMPLETE ACTIVITIES (Date-based)
//   const autoCompleteActivities = async () => {
//     try {
//       setAutoCompleting(true);
      
//       const today = new Date();
//       const completedDate = today.toISOString();
      
//       // Find activities that should be auto-completed
//       const activitiesToComplete = activities.filter(activity => {
//         return !activity.isCompleted && isActivityCompleted(activity.activity_date);
//       });
      
//       if (activitiesToComplete.length === 0) {
//         Alert.alert('No Activities to Complete', 'All activities are already completed or not yet due.');
//         setAutoCompleting(false);
//         return;
//       }
      
//       console.log(`🔄 Auto-completing ${activitiesToComplete.length} activities`);
      
//       // Check if harvesting is in the list
//       const harvestingActivity = activitiesToComplete.find(a => a.activity_type === 'Harvesting');
      
//       if (harvestingActivity) {
//         // Harvesting ko pehle complete karo, phir yield modal dikhao
//         const response = await farmerAPI.updateActivityCompletion({
//           activityId: harvestingActivity.id,
//           cropHistoryId: selectedCropId,
//           completed: true,
//           completedDate: completedDate,
//           remarks: 'Harvesting completed. Yield to be entered.'
//         });
        
//         if (response.success) {
//           // Update local state with completed_date
//           const updatedActivities = activities.map(a => 
//             a.id === harvestingActivity.id ? { ...a, isCompleted: true, completed_date: completedDate } : a
//           );
//           setActivities(updatedActivities);
          
//           // Show yield modal
//           setSelectedHarvestingActivity(harvestingActivity);
//           setActualYield('');
//           setYieldError('');
//           setShowYieldModal(true);
//         }
        
//         setAutoCompleting(false);
//         return;
//       }
      
//       // For non-harvesting activities, complete them all
//       let completedCount = 0;
      
//       for (const activity of activitiesToComplete) {
//         try {
//           const response = await farmerAPI.updateActivityCompletion({
//             activityId: activity.id,
//             cropHistoryId: selectedCropId,
//             completed: true,
//             completedDate: completedDate,
//             remarks: `Auto-completed on ${today.toLocaleDateString()}`
//           });
          
//           if (response.success) {
//             completedCount++;
//           }
//         } catch (error) {
//           console.error(`Error auto-completing activity ${activity.id}:`, error);
//         }
//       }
      
//       // ✅ UPDATE LOCAL STATE IMMEDIATELY with completed_date
//       const updatedActivities = activities.map(a => 
//         activitiesToComplete.some(atc => atc.id === a.id) ? { ...a, isCompleted: true, completed_date: completedDate } : a
//       );
//       setActivities(updatedActivities);
      
//       Alert.alert(
//         'Auto-Completion Complete! ✅',
//         `${completedCount} activities have been auto-completed.`,
//         [{ text: 'OK' }]
//       );
      
//       // ✅ Check for completion but notification will come from loadCropActivities
//       const newCompletedCount = updatedActivities.filter(a => a.isCompleted).length;
//       if (newCompletedCount === updatedActivities.length && updatedActivities.length > 0) {
//         console.log('🎯 All activities completed after auto-complete');
//         // Don't show notification here
//       }
      
//     } catch (error) {
//       console.error('❌ Error in auto-completion:', error);
//       Alert.alert('Error', 'Failed to auto-complete activities');
//     } finally {
//       setAutoCompleting(false);
//       setShowAutoCompleteConfirm(false);
//     }
//   };

//   // ✅ FIXED: SAVE YIELD AFTER HARVESTING COMPLETE (Correct API calls)
//   const saveYieldToCropHistory = async () => {
//     // Validate yield input
//     if (!actualYield || actualYield.trim() === '') {
//       setYieldError('Yield must be entered!');
//       return;
//     }
    
//     const yieldValue = parseFloat(actualYield);
//     if (isNaN(yieldValue) || yieldValue <= 0) {
//       setYieldError('Please enter a valid yield amount');
//       return;
//     }
    
//     setSavingYield(true);
//     setYieldError('');
    
//     try {
//       console.log('💾 Saving yield to crop_history:', selectedCropId, yieldValue);
      
//       // ✅ FIX: Correct API call according to your API structure
//       // Tumhare API mein function yeh hai: updateCropYieldOnly(cropHistoryId, yieldValue)
//       const yieldResponse = await farmerAPI.updateCropYieldOnly(selectedCropId, yieldValue);
      
//       if (yieldResponse && yieldResponse.success) {
//         console.log('✅ Yield saved successfully');
        
//         // ✅ Update remarks for harvesting activity with yield info
//         const today = new Date();
//         await farmerAPI.updateActivityCompletion({
//           activityId: selectedHarvestingActivity.id,
//           cropHistoryId: selectedCropId,
//           completed: true,
//           completedDate: today.toISOString(),
//           remarks: `Harvesting completed. Yield: ${yieldValue} per 40kg`
//         });
        
//         // Refresh crops list to update yield display
//         loadFarmerCrops();
        
//         const completedCount = activities.filter(a => a.isCompleted).length;
//         const totalCount = activities.length;
        
//         setShowYieldModal(false);
//         setActualYield('');
        
//         // ✅ Check if all activities are completed - Navigate to FarmerActivitiesScreen
//         if (completedCount === totalCount && totalCount > 0) {
//           console.log('🎯 All activities completed + Yield saved → Navigate to History');
//           Alert.alert(
//             'Crop Completed! 🎉',
//             `Yield: ${yieldValue} per 40kg\n\nAll activities completed. Moving to history.`,
//             [
//               {
//                 text: 'View History',
//                 onPress: () => {
//                   navigation.navigate('FarmerActivitiesScreen');
//                 }
//               }
//             ]
//           );
//         } else {
//           Alert.alert('Yield Saved! ✅', `Yield: ${yieldValue} per 40kg saved.`);
//         }
//       } else {
//         // Handle API response error
//         const errorMessage = yieldResponse?.message || 'Failed to save yield data';
//         Alert.alert('Error', errorMessage);
//         console.error('Yield save failed:', yieldResponse);
//       }
//     } catch (error) {
//       console.error('❌ Error saving yield:', error);
//       Alert.alert('Error', 'Failed to save yield data. Please try again.');
//     } finally {
//       setSavingYield(false);
//     }
//   };

//   // ✅ Initial Load
//   useEffect(() => {
//     // Reset flags on component mount
//     notificationShownRef.current = false;
//     hasNavigatedRef.current = false;
//     if (notificationTimeoutRef.current) {
//       clearTimeout(notificationTimeoutRef.current);
//       notificationTimeoutRef.current = null;
//     }
    
//     loadFarmerCrops();
//   }, []);

//   // ✅ Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       // Clear timeout when component unmounts
//       if (notificationTimeoutRef.current) {
//         clearTimeout(notificationTimeoutRef.current);
//         notificationTimeoutRef.current = null;
//       }
//     };
//   }, []);

//   // ✅ Hardware Back Button → AddMoreEntry
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

//   // ✅ Route parameters change par refresh
//   useEffect(() => {
//     if (route.params?.refreshTimestamp) {
//       console.log('Refresh triggered from navigation');
//       loadFarmerCrops();
//     }
//   }, [route.params?.refreshTimestamp]);

//   // ✅ Refresh Functionality
//   const onRefresh = () => {
//     setRefreshing(true);
//     loadFarmerCrops().finally(() => setRefreshing(false));
//   };

//   // ✅ Get Selected Crop Info
//   const selectedCrop = crops.find(crop => crop.crop_history_id === selectedCropId);

//   // ✅ Display label mapping (database name → display name)
//   const getDisplayActivityType = (activityType) => {
//     const displayMap = {
//       'Plowing': 'Land Preparation',
//       'Spraying': 'Pest Control',
//     };
//     return displayMap[activityType] || activityType;
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
//     };
//     return sequenceMap[activityType] || 99;
//   };

//   // ✅ Sort activities by farming sequence, then by date
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

//   // ✅ Dynamic Activity Icons and Colors
//   const getActivityIcon = (activityType) => {
//     const iconMap = {
//       'Plowing': 'landscape',
//       'Land Preparation': 'landscape',
//       'Sowing': 'spa',
//       'Irrigation': 'opacity',
//       'Fertilization': 'eco',
//       'Weeding': 'nature-people',
//       'Spraying': 'bug-report',
//       'Pest Control': 'bug-report',
//       'Harvesting': 'agriculture'
//     };
    
//     return iconMap[activityType] || 'event';
//   };

//   const getActivityColor = (activityType) => {
//     const colorMap = {
//       'Plowing': '#8B4513',
//       'Land Preparation': '#8B4513',
//       'Sowing': '#16A34A',
//       'Irrigation': '#1E40AF',
//       'Fertilization': '#EA580C',
//       'Weeding': '#65A30D',
//       'Spraying': '#DC2626',
//       'Pest Control': '#DC2626',
//       'Harvesting': '#CA8A04'
//     };
    
//     return colorMap[activityType] || PALETTE.muted;
//   };

//   // ✅ Dynamic Date Formatting
//   const formatDate = (dateString) => {
//     try {
//       if (!dateString) return 'Date not set';
//       const date = new Date(dateString);
      
//       if (isNaN(date.getTime())) return 'Invalid date';
      
//       return date.toLocaleDateString('en-US', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric'
//       });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   // ✅ Calculate statistics based on actual completion
//   const completedCount = activities.filter(activity => 
//     activity.isCompleted
//   ).length;
  
//   const pendingCount = activities.length - completedCount;

//   // ✅ Render Activity Item
//   const renderActivityItem = (activity, index) => {
//     const status = getActivityStatus(activity);
//     const isDue = isActivityCompleted(activity.activity_date) && !activity.isCompleted;
    
//     return (
//       <TouchableOpacity
//         key={activity.id || `activity-${index}`}
//         style={[
//           styles.checklistItem,
//           activity.isCompleted && styles.completedItem,
//           isDue && styles.dueItem,
//           activity.activity_type === 'Harvesting' && !activity.isCompleted && styles.harvestingItem
//         ]}
//         onPress={() => {
//           if (activity.isCompleted) {
//             // Uncheck - mark as incomplete
//             markActivityAsIncomplete(activity);
//           } else {
//             // Check - mark as complete
//             markActivityAsComplete(activity);
//           }
//         }}
//         activeOpacity={0.7}
//       >
//         {/* CHECKBOX - SIMPLIFIED */}
//         <View style={styles.checkboxContainer}>
//           <View style={[
//             styles.checkbox,
//             activity.isCompleted && styles.checkboxChecked,
//             isDue && styles.checkboxDue,
//             completingActivity === activity.id && styles.checkboxProcessing
//           ]}>
//             {completingActivity === activity.id ? (
//               <ActivityIndicator size="small" color="white" />
//             ) : activity.isCompleted ? (
//               <Icon name="check" size={16} color="white" />
//             ) : activity.activity_type === 'Harvesting' ? (
//               <Icon name="agriculture" size={16} color="#FF9800" />
//             ) : isDue ? (
//               <Icon name="warning" size={16} color="#FF5722" />
//             ) : null}
//           </View>
//         </View>

//         {/* Activity Content */}
//         <View style={styles.activityContent}>
//           <View style={styles.activityHeader}>
//             <View style={styles.activityTypeContainer}>
//               <View style={styles.activityTitleRow}>
//                 <Icon 
//                   name={getActivityIcon(activity.activity_type)} 
//                   size={16} 
//                   color={getActivityColor(activity.activity_type)} 
//                 />
//                 <Text style={[
//                   styles.activityType,
//                   { color: getActivityColor(activity.activity_type) }
//                 ]}>
//                   {getDisplayActivityType(activity.activity_type)}
//                 </Text>
//               </View>
//               {activity.activity_type === 'Harvesting' && !activity.isCompleted && (
//                 <View style={styles.yieldButtonBadge}>
//                   <Icon name="agriculture" size={10} color="#FFF" />
//                   <Text style={styles.yieldButtonText}>HARVEST</Text>
//                 </View>
//               )}
//               {isDue && !activity.isCompleted && (
//                 <View style={styles.dueBadge}>
//                   <Icon name="schedule" size={10} color="#FFF" />
//                   <Text style={styles.dueBadgeText}>DUE</Text>
//                 </View>
//               )}
//               <View style={[styles.statusBadge, { backgroundColor: status.statusColor }]}>
//                 <Text style={styles.statusText}>{status.statusText}</Text>
//               </View>
//             </View>
//             <Text style={[
//               styles.activityDate,
//               isDue && !activity.isCompleted && styles.dueDate
//             ]}>
//               {formatDate(activity.activity_date)}
//               {isDue && !activity.isCompleted && ' ⚠️'}
//             </Text>
//           </View>

//           <Text style={styles.activityDescription}>
//             {activity.description}
//           </Text>

//           {/* ✅ YIELD ENTRY BOX - Harvesting ke neeche */}
//           {activity.activity_type === 'Harvesting' && activity.isCompleted && !selectedCrop?.yield_per_40kg && (
//             <TouchableOpacity
//               style={styles.yieldEntryBox}
//               onPress={() => {
//                 setSelectedHarvestingActivity(activity);
//                 setActualYield('');
//                 setYieldError('');
//                 setShowYieldModal(true);
//               }}
//             >
//               <View style={styles.yieldEntryContent}>
//                 <Icon name="edit" size={14} color="#2E7D32" />
//                 <Text style={styles.yieldEntryText}>Enter Yield</Text>
//               </View>
//             </TouchableOpacity>
//           )}

//           {/* ✅ AGAR HARVESTING COMPLETE HAI AUR YIELD HAI */}
//           {activity.activity_type === 'Harvesting' && activity.isCompleted && selectedCrop?.yield_per_40kg && (
//             <View style={styles.yieldDisplayBox}>
//               <Icon name="assessment" size={14} color="#2E7D32" />
//               <Text style={styles.yieldDisplayText}>
//                 Final Yield: {selectedCrop.yield_per_40kg} per 40kg
//               </Text>
//             </View>
//           )}

//           {activity.chemical_or_fertilizer_used && (
//             <View style={styles.chemicalContainer}>
//               <Icon name="science" size={14} color={PALETTE.orange} />
//               <Text style={styles.chemicalText}>
//                 {activity.chemical_or_fertilizer_used}
//               </Text>
//             </View>
//           )}

//           {activity.remarks && (
//             <Text style={styles.remarks}>
//               {activity.remarks}
//             </Text>
//           )}

//           {/* Show completion info for completed activities */}
//           {activity.isCompleted && (
//             <View style={styles.completedInfo}>
//               <Icon name="verified" size={12} color={PALETTE.green} />
//               <Text style={styles.completedText}>
//                 Completed on {formatDate(activity.completed_date || activity.activity_date)}
//               </Text>
//             </View>
//           )}
          
//           {/* Show auto-complete option for due activities */}
//           {isDue && !activity.isCompleted && (
//             <View style={styles.autoCompleteHint}>
//               <Icon name="touch-app" size={12} color="#2196F3" />
//               <Text style={styles.autoCompleteHintText}>
//                 Tap to mark as complete
//               </Text>
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // ✅ AUTO-COMPLETE CONFIRMATION MODAL
//   const renderAutoCompleteModal = () => (
//     <Modal
//       visible={showAutoCompleteConfirm}
//       transparent={true}
//       animationType="fade"
//       onRequestClose={() => setShowAutoCompleteConfirm(false)}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.confirmModalContent}>
//           <View style={styles.confirmModalHeader}>
//             <Icon name="auto-mode" size={32} color="#2196F3" />
//             <Text style={styles.confirmModalTitle}>Auto-Complete Activities</Text>
//           </View>
          
//           <Text style={styles.confirmModalText}>
//             Do you want to auto-complete all activities that are due today or before?
//           </Text>
          
//           <Text style={styles.confirmModalSubtext}>
//             This will mark all due activities as completed with today's date.
//           </Text>
          
//           <View style={styles.confirmActionButtons}>
//             <TouchableOpacity
//               style={[styles.confirmButton, styles.confirmButtonCancel]}
//               onPress={() => setShowAutoCompleteConfirm(false)}
//               disabled={autoCompleting}
//             >
//               <Text style={styles.confirmButtonCancelText}>Cancel</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={[styles.confirmButton, styles.confirmButtonProceed]}
//               onPress={autoCompleteActivities}
//               disabled={autoCompleting}
//             >
//               {autoCompleting ? (
//                 <ActivityIndicator size="small" color="white" />
//               ) : (
//                 <Text style={styles.confirmButtonProceedText}>Auto-Complete</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );

//   // ✅ LOADING STATE
//   if (loading && crops.length === 0) {
//     return (
//       <SafeAreaView style={styles.container}>
//         {/* ✅ Header removed */}
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={PALETTE.green} />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* ✅ Header removed - no back arrow, no refresh icon */}
      
//       <ScrollView 
//         style={styles.content}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[PALETTE.green]}
//           />
//         }
//       >
//         {/* Error Message */}
//         {error && (
//           <View style={styles.errorBanner}>
//             <Icon name="error-outline" size={20} color={PALETTE.orange} />
//             <Text style={styles.errorBannerText}>{error}</Text>
//           </View>
//         )}

//         {/* Crop Selection */}
//         {crops.length > 0 && (
//           <View style={styles.cropSelectionContainer}>
//             <T style={styles.sectionTitle}>Select Crop</T>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cropsScrollView}>
//               {crops.map((crop) => (
//                 <TouchableOpacity
//                   key={crop.crop_history_id}
//                   style={[
//                     styles.cropOption,
//                     selectedCropId === crop.crop_history_id && styles.cropOptionSelected
//                   ]}
//                   onPress={() => handleCropSelect(crop)}
//                 >
//                   <Text style={styles.cropOptionText}>{crop.crop_name}</Text>
//                   <Text style={styles.cropOptionSubtext}>
//                     {crop.city} • {crop.area}
//                   </Text>
//                   {selectedCropId === crop.crop_history_id && (
//                     <View style={styles.selectedIndicator} />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         {/* Selected Crop Info */}
//         {selectedCrop && (
//           <View style={styles.cropInfoCard}>
//             <View style={styles.cropInfoHeader}>
//               <Icon name="spa" size={32} color={PALETTE.green} />
//               <View style={styles.cropInfoTextContainer}>
//                 <Text style={styles.cropInfoTitle}>{selectedCrop.crop_name}</Text>
//                 <Text style={styles.cropInfoSubtitle}>
//                   {selectedCrop.city} - {selectedCrop.area} ({selectedCrop.zone})
//                 </Text>
//                 <Text style={styles.cropInfoDates}>
//                   {formatDate(selectedCrop.sowing_date)} to {formatDate(selectedCrop.harvest_date)}
//                 </Text>
//                 {selectedCrop.yield_per_40kg && (
//                   <Text style={styles.cropInfoYield}>
//                     🌾 Yield: {selectedCrop.yield_per_40kg} per 40kg
//                   </Text>
//                 )}
//               </View>
//             </View>
            
//             {/* ✅ PROGRESS BAR */}
//             <ProgressBar 
//               completed={completedCount} 
//               total={activities.length} 
//               cropName={selectedCrop.crop_name}
//               onCompletion={() => {
//                 console.log('ProgressBar onCompletion called');
//               }}
//             />
//           </View>
//         )}

//         {/* Activities List */}
//         {selectedCrop && activities.length > 0 && (
//           <View style={styles.activitiesSection}>
//             <View style={styles.activitiesHeader}>
//               <Text style={styles.sectionTitle}>
//                 Farming Activities ({activities.length})
//               </Text>
//               <TouchableOpacity
//                 style={styles.helpButton}
//                 onPress={() => {
//                   Alert.alert(
//                     'How to Use',
//                     '1. ✅ Click on any activity to mark it as complete\n2. 🌾 Harvesting complete hone ke baad yield enter karo\n3. 📅 Due activities (⚠️) can be auto-completed\n4. 🎯 Sab activities complete hone par history mein jao',
//                     [{ text: 'OK' }]
//                   );
//                 }}
//               >
//                 <Icon name="help-outline" size={20} color={PALETTE.blue} />
//               </TouchableOpacity>
//             </View>
            
//             {sortActivitiesBySequence(activities).map((activity, index) => renderActivityItem(activity, index))}
//           </View>
//         )}

//         {/* No Activities Message */}
//         {selectedCrop && activities.length === 0 && !loading && (
//           <View style={styles.noActivitiesContainer}>
//             <Icon name="event" size={48} color={PALETTE.muted} />
//             <Text style={styles.noActivitiesText}>
//               No Activities Found
//             </Text>
//             <Text style={styles.noActivitiesSubtext}>
//               No activities scheduled for ${selectedCrop.crop_name} yet.
//             </Text>
//           </View>
//         )}

//         {/* No Crops Found - Simple UI without popup */}
//         {crops.length === 0 && !loading && (
//           <View style={styles.noCropsContainer}>
//             <Icon name="grass" size={64} color={PALETTE.muted} />
//             <Text style={styles.noCropsText}>No Crops Found</Text>
//             <Text style={styles.noCropsSubtext}>
//               Add a new crop to start tracking activities
//             </Text>
//             <TouchableOpacity 
//               style={styles.addCropButton}
//               onPress={() => navigation.navigate('CropInputPage')}
//             >
//               <Icon name="add" size={20} color="white" />
//               <Text style={styles.addCropButtonText}>Add New Crop</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>

//       {/* ✅ AUTO-COMPLETE CONFIRMATION MODAL */}
//       {renderAutoCompleteModal()}

//       {/* ✅ YIELD MODAL */}
//       <Modal
//         visible={showYieldModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => {
//           if (!savingYield) {
//             setShowYieldModal(false);
//             setActualYield('');
//             setYieldError('');
//           }
//         }}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.modalContainer}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.yieldModalContent}>
//               <View style={styles.yieldModalHeader}>
//                 <Icon name="agriculture" size={32} color="#2E7D32" />
//                 <View>
//                   <Text style={styles.yieldModalTitle}>
//                     Enter Harvest Yield 🌾
//                   </Text>
//                   <Text style={styles.yieldModalCropName}>
//                     {selectedCrop?.crop_name}
//                   </Text>
//                 </View>
//               </View>
              
//               <View style={styles.yieldInputContainer}>
//                 <Text style={styles.yieldLabel}>
//                   Yield per 40kg  *
//                 </Text>
//                 <View style={[
//                   styles.yieldInputWrapper,
//                   yieldError && styles.yieldInputError
//                 ]}>
//                   <TextInput
//                     style={styles.yieldInput}
//                     placeholder="e.g., 10.5"
//                     value={actualYield}
//                     onChangeText={(text) => {
//                       setActualYield(text);
//                       setYieldError('');
//                     }}
//                     keyboardType="decimal-pad"
//                     placeholderTextColor="#999"
//                     autoFocus={true}
//                   />
//                   <Text style={styles.yieldUnit}>per 40kg</Text>
//                 </View>
//                 {yieldError ? (
//                   <Text style={styles.yieldErrorText}>
//                     <Icon name="error" size={12} color="#D32F2F" /> {yieldError}
//                   </Text>
//                 ) : (
//                   <Text style={styles.yieldHelpText}>
//                     💡 1 maund= 40 KG
//                   </Text>
//                 )}
//               </View>
              
//               {/* <Text style={styles.yieldNote}>
//                 <Icon name="info" size={14} color="#2196F3" /> 
//                 Harvesting already marked as complete. Please enter yield to finish.
//               </Text>
//                */}
//               <View style={styles.yieldActionButtons}>
//                 <TouchableOpacity
//                   style={[styles.yieldButton, styles.yieldButtonSave]}
//                   onPress={saveYieldToCropHistory}
//                   disabled={savingYield}
//                 >
//                   {savingYield ? (
//                     <ActivityIndicator size="small" color="white" />
//                   ) : (
//                     <>
//                       <Icon name="save" size={18} color="white" />
//                       <Text style={styles.yieldButtonSaveText}>
//                         Save Yield
//                       </Text>
//                     </>
//                   )}
//                 </TouchableOpacity>
//               </View>
              
//               <TouchableOpacity
//                 style={styles.yieldCloseButton}
//                 onPress={() => {
//                   if (!savingYield) {
//                     setShowYieldModal(false);
//                     setActualYield('');
//                     setYieldError('');
//                   }
//                 }}
//                 disabled={savingYield}
//               >
//                 <Text style={styles.yieldCloseButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// // ✅ STYLES (SAME AS BEFORE)
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: PALETTE.bg,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: PALETTE.gray,
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//   },
//   headerTitlePlaceholder: {
//     flex: 1,
//   },
//   headerRight: {
//     padding: 4,
//   },
//   content: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: PALETTE.muted,
//   },
//   errorBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FEF3F2',
//     padding: 12,
//     margin: 16,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: PALETTE.orange,
//   },
//   errorBannerText: {
//     marginLeft: 8,
//     color: PALETTE.orange,
//     fontSize: 14,
//     flex: 1,
//   },
//   cropSelectionContainer: {
//     margin: 16,
//     marginTop: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     marginBottom: 12,
//   },
//   cropsScrollView: {
//     marginHorizontal: -4,
//   },
//   cropOption: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     marginHorizontal: 4,
//     minWidth: 120,
//     borderWidth: 1,
//     borderColor: PALETTE.gray,
//   },
//   cropOptionSelected: {
//     borderColor: PALETTE.green,
//     backgroundColor: PALETTE.greenLite,
//   },
//   cropOptionText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//   },
//   cropOptionSubtext: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginTop: 4,
//   },
//   selectedIndicator: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: PALETTE.green,
//   },
//   cropInfoCard: {
//     backgroundColor: 'white',
//     margin: 16,
//     padding: 16,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cropInfoHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   cropInfoTextContainer: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   cropInfoTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//   },
//   cropInfoSubtitle: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     marginTop: 4,
//   },
//   cropInfoDates: {
//     fontSize: 12,
//     color: PALETTE.blue,
//     marginTop: 2,
//   },
//   cropInfoYield: {
//     fontSize: 13,
//     color: '#2E7D32',
//     fontWeight: '600',
//     marginTop: 4,
//     backgroundColor: '#E8F5E9',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     alignSelf: 'flex-start',
//   },
//   // ✅ PROGRESS BAR STYLES
//   progressContainer: {
//     marginBottom: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: PALETTE.gray,
//   },
//   progressHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   progressText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: PALETTE.text,
//   },
//   completedBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: PALETTE.green,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   completedBadgeText: {
//     fontSize: 10,
//     color: 'white',
//     fontWeight: 'bold',
//     marginLeft: 4,
//   },
//   progressBar: {
//     height: 8,
//     backgroundColor: PALETTE.gray,
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: PALETTE.blue,
//     borderRadius: 4,
//   },
//   progressComplete: {
//     backgroundColor: PALETTE.green,
//   },
//   completionMessage: {
//     fontSize: 12,
//     color: PALETTE.green,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginTop: 8,
//     fontStyle: 'italic',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: PALETTE.gray,
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginTop: 4,
//   },
//   // ✅ AUTO-COMPLETE BUTTON
//   autoCompleteButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#E3F2FD',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 16,
//     borderWidth: 1,
//     borderColor: '#2196F3',
//   },
//   autoCompleteButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#2196F3',
//     marginLeft: 8,
//   },
//   // ✅ ACTIVITIES SECTION
//   activitiesSection: {
//     margin: 16,
//   },
//   activitiesHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   helpButton: {
//     padding: 4,
//   },
//   // ✅ ACTIVITY ITEMS - SIMPLIFIED
//   checklistItem: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   completedItem: {
//     backgroundColor: PALETTE.greenLite,
//     borderLeftWidth: 4,
//     borderLeftColor: PALETTE.green,
//   },
//   dueItem: {
//     backgroundColor: '#FFF3E0',
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF9800',
//   },
//   harvestingItem: {
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF9800',
//     backgroundColor: '#FFF3E0',
//   },
//   checkboxContainer: {
//     marginRight: 12,
//     justifyContent: 'center',
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderWidth: 2,
//     borderColor: PALETTE.muted,
//     borderRadius: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxChecked: {
//     backgroundColor: PALETTE.green,
//     borderColor: PALETTE.green,
//   },
//   checkboxDue: {
//     borderColor: '#FF9800',
//     backgroundColor: '#FFF3E0',
//   },
//   checkboxProcessing: {
//     backgroundColor: '#2196F3',
//     borderColor: '#2196F3',
//   },
//   activityContent: {
//     flex: 1,
//   },
//   activityHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   activityTypeContainer: {
//     flex: 1,
//   },
//   activityTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   activityType: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginLeft: 6,
//   },
//   yieldButtonBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#2E7D32',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginTop: 4,
//     alignSelf: 'flex-start',
//     gap: 4,
//   },
//   yieldButtonText: {
//     fontSize: 10,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   dueBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FF9800',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginTop: 4,
//     alignSelf: 'flex-start',
//     gap: 4,
//   },
//   dueBadgeText: {
//     fontSize: 10,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//     marginTop: 4,
//   },
//   statusText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   activityDate: {
//     fontSize: 12,
//     color: PALETTE.muted,
//   },
//   dueDate: {
//     color: '#FF5722',
//     fontWeight: '600',
//   },
//   activityDescription: {
//     fontSize: 13,
//     color: PALETTE.text,
//     marginBottom: 8,
//     lineHeight: 18,
//   },
//   // ✅ YIELD ENTRY BOX (Harvesting ke neeche)
//   yieldEntryBox: {
//     backgroundColor: '#E8F5E9',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#2E7D32',
//     borderStyle: 'dashed',
//   },
//   yieldEntryContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   yieldEntryText: {
//     fontSize: 13,
//     color: '#2E7D32',
//     fontWeight: '600',
//   },
//   yieldDisplayBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E8F5E9',
//     padding: 8,
//     borderRadius: 6,
//     marginBottom: 8,
//     gap: 6,
//   },
//   yieldDisplayText: {
//     fontSize: 12,
//     color: '#2E7D32',
//     fontWeight: '500',
//   },
//   chemicalContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: PALETTE.orange + '20',
//     padding: 8,
//     borderRadius: 6,
//     marginBottom: 8,
//   },
//   chemicalText: {
//     fontSize: 12,
//     color: PALETTE.orange,
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   remarks: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     fontStyle: 'italic',
//   },
//   completedInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: PALETTE.green + '20',
//     padding: 6,
//     borderRadius: 4,
//     marginTop: 4,
//   },
//   completedText: {
//     fontSize: 11,
//     color: PALETTE.green,
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   autoCompleteHint: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E3F2FD',
//     padding: 6,
//     borderRadius: 4,
//     marginTop: 4,
//     gap: 4,
//   },
//   autoCompleteHintText: {
//     fontSize: 11,
//     color: '#2196F3',
//     fontWeight: '500',
//   },
//   noActivitiesContainer: {
//     alignItems: 'center',
//     padding: 40,
//     backgroundColor: 'white',
//     borderRadius: 12,
//     margin: 16,
//   },
//   noActivitiesText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     marginTop: 12,
//     textAlign: 'center',
//   },
//   noActivitiesSubtext: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     marginTop: 8,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   noCropsContainer: {
//     alignItems: 'center',
//     padding: 40,
//     marginTop: 40,
//   },
//   noCropsText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     marginTop: 16,
//   },
//   noCropsSubtext: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     marginTop: 8,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   addCropButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: PALETTE.blue,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   addCropButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   // ✅ MODAL STYLES
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   // ✅ AUTO-COMPLETE CONFIRM MODAL
//   confirmModalContent: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 24,
//     width: '100%',
//     maxWidth: 400,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 10,
//   },
//   confirmModalHeader: {
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   confirmModalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2196F3',
//     marginTop: 8,
//   },
//   confirmModalText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   confirmModalSubtext: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   confirmActionButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   confirmButton: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   confirmButtonCancel: {
//     backgroundColor: '#f5f5f5',
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   confirmButtonProceed: {
//     backgroundColor: '#2196F3',
//   },
//   confirmButtonCancelText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//   },
//   confirmButtonProceedText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   // ✅ YIELD MODAL STYLES
//   yieldModalContent: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 24,
//     width: '100%',
//     maxWidth: 400,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 10,
//   },
//   yieldModalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     gap: 12,
//   },
//   yieldModalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//   },
//   yieldModalCropName: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 2,
//   },
//   yieldInputContainer: {
//     marginBottom: 20,
//   },
//   yieldLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   yieldInputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     overflow: 'hidden',
//     marginBottom: 8,
//   },
//   yieldInputError: {
//     borderColor: '#D32F2F',
//     backgroundColor: '#FFEBEE',
//   },
//   yieldInput: {
//     flex: 1,
//     padding: 14,
//     fontSize: 16,
//     color: '#333',
//   },
//   yieldUnit: {
//     backgroundColor: '#f5f5f5',
//     paddingHorizontal: 12,
//     paddingVertical: 14,
//     fontSize: 14,
//     color: '#666',
//     borderLeftWidth: 1,
//     borderLeftColor: '#ddd',
//   },
//   yieldErrorText: {
//     fontSize: 12,
//     color: '#D32F2F',
//     marginTop: 4,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   yieldHelpText: {
//     fontSize: 12,
//     color: '#666',
//     fontStyle: 'italic',
//   },
//   yieldNote: {
//     fontSize: 12,
//     color: '#2196F3',
//     backgroundColor: '#E3F2FD',
//     padding: 10,
//     borderRadius: 6,
//     marginBottom: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   yieldActionButtons: {
//     marginBottom: 16,
//   },
//   yieldButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 8,
//     gap: 8,
//   },
//   yieldButtonSave: {
//     backgroundColor: '#2E7D32',
//   },
//   yieldButtonDisabled: {
//     backgroundColor: '#A5D6A7',
//     opacity: 0.7,
//   },
//   yieldButtonSaveText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   yieldCloseButton: {
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   yieldCloseButtonText: {
//     fontSize: 14,
//     color: '#666',
//   },
// });

// export default CropActivitiesScreen;


// yeh wali screen meri marketrate all activity ki cost ky liya hai net profit

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { farmerAPI } from './api';
import T from './localization/T';

const PALETTE = {
  bg: '#FFFFFF',
  text: '#111829',
  muted: '#6B7280',
  green: '#16A34A',
  greenLite: '#E7F8EA',
  gray: '#F3F4F6',
  blue: '#1E40AF',
  orange: '#EA580C',
  red: '#DC2626'
};

// ✅ Progress Bar Component
const ProgressBar = ({ completed, total, cropName, onCompletion }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const isCompleted = percentage === 100 && total > 0;
  
  React.useEffect(() => {
    if (isCompleted && onCompletion) {
      onCompletion();
    }
  }, [isCompleted, onCompletion]);
  
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          Progress: {completed}/{total} ({Math.round(percentage)}%)
        </Text>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Icon name="verified" size={14} color="white" />
            <Text style={styles.completedBadgeText}>COMPLETED</Text>
          </View>
        )}
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${percentage}%` },
            isCompleted && styles.progressComplete
          ]} 
        />
      </View>
      {isCompleted && (
        <Text style={styles.completionMessage}>
          🎉 Ready to move to history!
        </Text>
      )}
    </View>
  );
};

function CropActivitiesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [crops, setCrops] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ✅ State for Activity Completion
  const [completingActivity, setCompletingActivity] = useState(null);
  
  // ✅ Yield Modal State
  const [showYieldModal, setShowYieldModal] = useState(false);
  const [actualYield, setActualYield] = useState('');
  const [selectedHarvestingActivity, setSelectedHarvestingActivity] = useState(null);
  const [savingYield, setSavingYield] = useState(false);
  const [yieldError, setYieldError] = useState('');

  // ✅ Cost Input State
  const [showCostModal, setShowCostModal] = useState(false);
  const [selectedActivityForCost, setSelectedActivityForCost] = useState(null);
  const [costAmount, setCostAmount] = useState('');
  const [savingCost, setSavingCost] = useState(false);

  // ✅ Financial Summary State
  const [financialSummary, setFinancialSummary] = useState(null);

  // ✅ FIX: Notification control refs
  const notificationShownRef = useRef(false);
  const hasNavigatedRef = useRef(false);
  const notificationTimeoutRef = useRef(null);

  // ✅ Date comparison
  const isActivityCompleted = (activityDate) => {
    try {
      if (!activityDate) return false;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const activityDateObj = new Date(activityDate);
      activityDateObj.setHours(0, 0, 0, 0);
      
      return activityDateObj <= today;
    } catch (error) {
      console.error('Date comparison error:', error);
      return false;
    }
  };

  // ✅ User selection-based status
  const getActivityStatus = (activity) => {
    let isCompleted = false;
    
    if (activity.activity_type === 'Sowing') {
      isCompleted = isActivityCompleted(activity.activity_date);
    }
    else if (activity.activity_type === 'Fertilization' || activity.activity_type === 'Pest Control') {
      const hasChemical = !!activity.chemical_or_fertilizer_used;
      const datePassed = isActivityCompleted(activity.activity_date);
      isCompleted = hasChemical && datePassed;
    }
    else {
      isCompleted = isActivityCompleted(activity.activity_date);
    }
    
    return {
      isCompleted,
      statusColor: isCompleted ? PALETTE.green : PALETTE.blue,
      statusText: isCompleted ? 'Completed' : 'Upcoming'
    };
  };

  // ✅ Calculate Financial Summary with PROFIT PERCENTAGE (NOT ROI)
  const calculateFinancialSummary = useCallback(() => {
    if (!activities || activities.length === 0) {
      setFinancialSummary(null);
      return;
    }

    const totalCost = activities.reduce((sum, activity) => {
      return sum + (parseFloat(activity.activity_cost) || 0);
    }, 0);

    const selectedCrop = crops.find(c => c.crop_history_id === selectedCropId);
    
    // Calculate yield value if yield exists
    let yieldValue = 0;
    let hasYield = false;
    let yieldBags = 0;
    
    if (selectedCrop?.yield_per_40kg) {
      yieldBags = selectedCrop.yield_per_40kg;
      yieldValue = yieldBags * 2000;
      hasYield = true;
    }
    
    const netProfit = yieldValue - totalCost;
    
    // ✅ PROFIT PERCENTAGE of REVENUE (NOT ROI)
    // Formula: (Profit / Revenue) × 100
    let profitPercentDisplay = 'N/A';
    let profitPercentValue = 0;
    
    if (hasYield && yieldValue > 0) {
      profitPercentValue = (netProfit / yieldValue) * 100;
      
      // Format profit percentage
      if (Math.abs(profitPercentValue) > 100) {
        profitPercentDisplay = profitPercentValue > 0 ? '>100% (Excellent)' : '<-100% (Poor)';
      } else {
        profitPercentDisplay = `${profitPercentValue.toFixed(1)}%`;
      }
    } else if (!hasYield) {
      profitPercentDisplay = 'N/A';
    }

    console.log(`✅ Final Financial Summary:
      Total Cost: Rs ${totalCost.toFixed(0)}
      Yield: ${yieldBags} bags = Rs ${yieldValue.toFixed(0)}
      Net Profit: Rs ${netProfit.toFixed(0)}
      Profit Percentage: ${profitPercentDisplay}`);

    setFinancialSummary({
      totalCost,
      yieldValue,
      yieldBags,
      netProfit,
      profitPercentage: profitPercentDisplay,
      isProfit: netProfit >= 0,
      hasYield: hasYield
    });
  }, [activities, crops, selectedCropId]);

  // ✅ Load ALL crops (even with yield)
  const loadFarmerCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const savedFarmerId = await AsyncStorage.getItem('farmerId');
      
      if (!savedFarmerId) {
        setError('Farmer not found. Please login again.');
        setLoading(false);
        return;
      }

      const farmerId = parseInt(savedFarmerId);
      
      console.log('Loading ALL crops for farmer:', farmerId);
      const response = await farmerAPI.getFarmerCurrentCrops(farmerId);
      
      if (response.success && response.crops) {
        const allCrops = response.crops.map(crop => ({
          ...crop,
          crop_history_id: crop.crop_history_id,
          crop_name: crop.crop_name,
          city: crop.city,
          area: crop.area,
          zone: crop.zone,
          land_id: crop.land_id,
          season: crop.season,
          sowing_date: crop.sowing_date,
          harvest_date: crop.harvest_date,
          yield_per_40kg: crop.yield_per_40kg,
          completion_status: 'active'
        }));
        
        setCrops(allCrops);
        console.log(`✅ Showing ALL crops: ${allCrops.length}`);
        
        if (allCrops.length > 0 && !selectedCropId) {
          const firstCropId = allCrops[0].crop_history_id;
          setSelectedCropId(firstCropId);
          loadCropActivities(firstCropId, allCrops[0].crop_name);
        }
        
      } else {
        setError(response.message || 'Failed to load crops data');
      }
    } catch (error) {
      console.error('Error loading farmer crops:', error);
      setError('Failed to load crops: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load crop activities
  const loadCropActivities = async (cropHistoryId, selectedCropName) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('🔄 Loading activities for crop:', cropHistoryId);
      
      const activitiesResponse = await farmerAPI.getCropActivities(cropHistoryId);
      
      if (activitiesResponse.success && activitiesResponse.activities) {
        const allActivities = activitiesResponse.activities;
        
        const activitiesWithStatus = allActivities.map(activity => {
          const status = getActivityStatus(activity);
          return {
            ...activity,
            isCompleted: status.isCompleted
          };
        });
        
        const completedCount = activitiesWithStatus.filter(a => a.isCompleted).length;
        const totalCount = activitiesWithStatus.length;
        
        console.log(`📈 Completion: ${completedCount}/${totalCount}`);
        
        setActivities(activitiesWithStatus);
        
        if (allActivities.length === 0) {
          setError(`No activities found for ${selectedCropName}.`);
        }
      } else {
        console.log('🟡 No activities found');
        setActivities([]);
        setError(`No activities found for ${selectedCropName}.`);
      }
      
    } catch (error) {
      console.error('❌ Error loading activities:', error);
      setError('Failed to load activities');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Crop Selection
  const handleCropSelect = (crop) => {
    console.log('Crop selected:', crop.crop_history_id, crop.crop_name);
    setSelectedCropId(crop.crop_history_id);
    setActivities([]);
    loadCropActivities(crop.crop_history_id, crop.crop_name);
  };

  // ✅ MARK ACTIVITY AS COMPLETE WITH COST
  const markActivityAsComplete = async (activity) => {
    try {
      setSelectedActivityForCost(activity);
      setCostAmount(activity.activity_cost || '');
      setShowCostModal(true);
      
    } catch (error) {
      console.error('❌ Error in markActivityAsComplete:', error);
      Alert.alert('Error', 'Failed to complete activity');
    }
  };

  // ✅ SAVE COST AND MARK ACTIVITY COMPLETE
  const saveCostAndCompleteActivity = async () => {
    if (!costAmount || parseFloat(costAmount) <= 0) {
      Alert.alert('Error', 'Please enter valid amount');
      return;
    }

    try {
      setSavingCost(true);
      
      const today = new Date();
      const completedDate = today.toISOString();
      
      if (selectedActivityForCost.activity_type === 'Harvesting') {
        const response = await farmerAPI.updateActivityCompletion({
          activityId: selectedActivityForCost.id,
          cropHistoryId: selectedCropId,
          completed: true,
          completedDate: completedDate,
          remarks: 'Harvesting completed. Yield to be entered.',
          activityCost: parseFloat(costAmount)
        });
        
        if (response.success) {
          const updatedActivities = activities.map(a => 
            a.id === selectedActivityForCost.id ? { 
              ...a, 
              isCompleted: true, 
              completed_date: completedDate,
              activity_cost: parseFloat(costAmount)
            } : a
          );
          setActivities(updatedActivities);
          
          setSelectedHarvestingActivity(selectedActivityForCost);
          setActualYield('');
          setYieldError('');
          setShowYieldModal(true);
        }
        
        setSavingCost(false);
        setShowCostModal(false);
        return;
      }
      
      const response = await farmerAPI.updateActivityCompletion({
        activityId: selectedActivityForCost.id,
        cropHistoryId: selectedCropId,
        completed: true,
        completedDate: completedDate,
        remarks: `Manually completed on ${today.toLocaleDateString()}`,
        activityCost: parseFloat(costAmount)
      });
      
      if (response.success) {
        console.log('✅ Activity marked as complete with cost:', selectedActivityForCost.activity_type);
        
        const updatedActivities = activities.map(a => 
          a.id === selectedActivityForCost.id ? { 
            ...a, 
            isCompleted: true, 
            completed_date: completedDate,
            activity_cost: parseFloat(costAmount)
          } : a
        );
        setActivities(updatedActivities);
        
        Alert.alert(
          'Activity Completed! ✅',
          `${getDisplayActivityType(selectedActivityForCost.activity_type)} marked as complete.\nCost: Rs${costAmount}`,
          [{ text: 'OK' }]
        );
        
        const newCompletedCount = updatedActivities.filter(a => a.isCompleted).length;
        const totalCount = updatedActivities.length;
        
        if (newCompletedCount === totalCount && totalCount > 0) {
          console.log('🎯 All activities completed!');
        }
      } else {
        Alert.alert('Error', response.message || 'Failed to complete activity');
      }
    } catch (error) {
      console.error('❌ Error completing activity:', error);
      Alert.alert('Error', 'Failed to complete activity');
    } finally {
      setSavingCost(false);
      setShowCostModal(false);
    }
  };

  // ✅ MARK ACTIVITY AS INCOMPLETE
  const markActivityAsIncomplete = async (activity) => {
    try {
      setCompletingActivity(activity.id);
      
      Alert.alert(
        'Undo Completion?',
        `Kya aap "${getDisplayActivityType(activity.activity_type)}" ko incomplete mark karna chahte hain?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setCompletingActivity(null)
          },
          {
            text: 'Yes, Undo',
            style: 'destructive',
            onPress: async () => {
              try {
                const response = await farmerAPI.updateActivityCompletion({
                  activityId: activity.id,
                  cropHistoryId: selectedCropId,
                  completed: false,
                  completedDate: null,
                  remarks: 'Marked as incomplete'
                });
                
                if (response.success) {
                  const updatedActivities = activities.map(a => 
                    a.id === activity.id ? { 
                      ...a, 
                      isCompleted: false, 
                      completed_date: null,
                      activity_cost: null
                    } : a
                  );
                  setActivities(updatedActivities);
                  
                  Alert.alert(
                    'Activity Unchecked! ↩️',
                    `${getDisplayActivityType(activity.activity_type)} marked as incomplete.`,
                    [{ text: 'OK' }]
                  );
                } else {
                  Alert.alert('Error', response.message || 'Failed to undo completion');
                }
              } catch (error) {
                console.error('❌ Error marking activity as incomplete:', error);
                Alert.alert('Error', 'Failed to undo completion');
              } finally {
                setCompletingActivity(null);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error in markActivityAsIncomplete:', error);
      setCompletingActivity(null);
    }
  };

  // ✅ EDIT COST FOR COMPLETED ACTIVITY
  const editActivityCost = (activity) => {
    setSelectedActivityForCost(activity);
    setCostAmount(activity.activity_cost || '');
    setShowCostModal(true);
  };

  // ✅ SAVE YIELD WITH PROFIT PERCENTAGE
  const saveYieldToCropHistory = async () => {
    if (!actualYield || actualYield.trim() === '') {
      setYieldError('Yield must be entered!');
      return;
    }
    
    const yieldValue = parseFloat(actualYield);
    if (isNaN(yieldValue) || yieldValue <= 0) {
      setYieldError('Please enter a valid yield amount');
      return;
    }
    
    const tempYieldValue = yieldValue;
    const tempCropId = selectedCropId;
    const tempHarvestingActivity = selectedHarvestingActivity;
    
    setShowYieldModal(false);
    setActualYield('');
    setYieldError('');
    
    Alert.alert(
      'Confirm Yield Entry',
      `🌾 Yield: ${tempYieldValue} bags × Rs 2,000 = Rs ${(tempYieldValue * 2000).toFixed(0)}\n\n` +
      `Kya aap yeh yield save karna chahte hain?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setShowYieldModal(true);
          }
        },
        {
          text: 'Save & Stay',
          onPress: async () => {
            await performSaveYield(tempYieldValue, tempCropId, tempHarvestingActivity, false);
          }
        },
        {
          text: 'Save & View History',
          onPress: async () => {
            await performSaveYield(tempYieldValue, tempCropId, tempHarvestingActivity, true);
          }
        }
      ]
    );
  };

  // ✅ Helper function to actually save yield with PROFIT PERCENTAGE
  const performSaveYield = async (yieldValue, cropId, harvestingActivity, shouldNavigate) => {
    setSavingYield(true);
    
    try {
      console.log('💾 Saving yield to crop_history:', cropId, yieldValue);
      
      const yieldResponse = await farmerAPI.updateCropYieldOnly(cropId, yieldValue);
      
      if (yieldResponse && yieldResponse.success) {
        const today = new Date();
        const totalCost = activities.reduce((sum, a) => sum + (parseFloat(a.activity_cost) || 0), 0);
        const yieldIncome = yieldValue * 2000;
        const netProfit = yieldIncome - totalCost;
        const isProfit = netProfit >= 0;
        
        // ✅ PROFIT PERCENTAGE of REVENUE
        const profitPercent = yieldIncome > 0 ? ((netProfit / yieldIncome) * 100).toFixed(0) : 0;
        
        await farmerAPI.updateActivityCompletion({
          activityId: harvestingActivity.id,
          cropHistoryId: cropId,
          completed: true,
          completedDate: today.toISOString(),
          remarks: isProfit 
            ? `✅ Profit: Rs ${netProfit.toFixed(0)} (${profitPercent}% of revenue)`
            : `❌ Loss: Rs ${Math.abs(netProfit).toFixed(0)} (${profitPercent}% of revenue)`
        });
        
        const updatedCrops = crops.map(crop => {
          if (crop.crop_history_id === cropId) {
            return {
              ...crop,
              yield_per_40kg: yieldValue
            };
          }
          return crop;
        });
        
        setCrops(updatedCrops);
        
        let profitPercentDisplay = 'N/A';
        if (yieldIncome > 0) {
          const profitPercentValue = (netProfit / yieldIncome) * 100;
          if (Math.abs(profitPercentValue) > 100) {
            profitPercentDisplay = profitPercentValue > 0 ? '>100% (Excellent)' : '<-100% (Poor)';
          } else {
            profitPercentDisplay = `${profitPercentValue.toFixed(1)}%`;
          }
        }
        
        setFinancialSummary({
          totalCost,
          yieldValue: yieldIncome,
          yieldBags: yieldValue,
          netProfit,
          profitPercentage: profitPercentDisplay,
          isProfit,
          hasYield: true
        });
        
        const cropName = selectedCrop?.crop_name || 'Crop';
        
        if (shouldNavigate) {
          const filteredCrops = crops.filter(crop => crop.crop_history_id !== cropId);
          setCrops(filteredCrops);
          setSelectedCropId(null);
          setActivities([]);
          
          Alert.alert(
            'Success! ✅',
            `Yield saved successfully!\n\nNet ${isProfit ? 'Profit' : 'Loss'}: Rs ${Math.abs(netProfit).toFixed(0)}\nProfit %: ${profitPercentDisplay}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('FarmerActivitiesScreen', {
                    cropId: cropId,
                    cropName: cropName,
                    refresh: true
                  });
                }
              }
            ]
          );
        } else {
          Alert.alert(
            'Yield Saved! ✅',
            `🌾 Yield: ${yieldValue} bags\n` +
            `💰 Total Expenses: Rs ${totalCost.toFixed(0)}\n` +
            `${isProfit ? '✅ Profit' : '❌ Loss'}: Rs ${Math.abs(netProfit).toFixed(0)}\n` +
            `📈 Profit %: ${profitPercentDisplay} (of revenue)`,
            [{ text: 'OK' }]
          );
        }
        
      } else {
        const errorMessage = yieldResponse?.message || 'Failed to save yield data';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('❌ Error saving yield:', error);
      Alert.alert('Error', 'Failed to save yield data. Please try again.');
    } finally {
      setSavingYield(false);
    }
  };
  
  // ✅ Handle Financial Summary Click
  const handleFinancialSummaryClick = () => {
    if (financialSummary?.hasYield) {
      Alert.alert(
        'View Complete Financial History',
        `Kya aap "${selectedCrop?.crop_name}" ki complete financial history dekhna chahtay hain?\n\n` +
        `Note: Is crop ko history mein move kar diya jayega aur yeh current crops list se hide ho jayega.`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Yes, View History',
            onPress: async () => {
              try {
                console.log(`📤 Moving crop ${selectedCropId} to history...`);
                
                navigation.navigate('FarmerActivitiesScreen', {
                  cropId: selectedCropId,
                  cropName: selectedCrop?.crop_name,
                  refresh: true
                });
                
                setTimeout(() => {
                  const filteredCrops = crops.filter(crop => crop.crop_history_id !== selectedCropId);
                  setCrops(filteredCrops);
                  
                  if (filteredCrops.length > 0) {
                    setSelectedCropId(filteredCrops[0].crop_history_id);
                    loadCropActivities(filteredCrops[0].crop_history_id, filteredCrops[0].crop_name);
                  } else {
                    setSelectedCropId(null);
                    setActivities([]);
                  }
                }, 300);
                
              } catch (error) {
                console.error('Error navigating to history:', error);
              }
            }
          }
        ]
      );
    } else {
      Alert.alert('Yield Required', 'Pehlay yield enter karein ta kay profit/loss calculate ho sake.');
    }
  };

  // ✅ Initial Load
  useEffect(() => {
    notificationShownRef.current = false;
    hasNavigatedRef.current = false;
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = null;
    }
    
    loadFarmerCrops();
  }, []);

  // ✅ Recalculate financial summary when activities change
  useEffect(() => {
    calculateFinancialSummary();
  }, [activities, calculateFinancialSummary]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
        notificationTimeoutRef.current = null;
      }
    };
  }, []);

  // ✅ Hardware Back Button → AddMoreEntry
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

  // ✅ Route parameters change par refresh
  useEffect(() => {
    if (route.params?.refreshTimestamp) {
      console.log('Refresh triggered from navigation');
      loadFarmerCrops();
    }
  }, [route.params?.refreshTimestamp]);

  // ✅ Refresh Functionality
  const onRefresh = () => {
    setRefreshing(true);
    loadFarmerCrops().finally(() => setRefreshing(false));
  };

  // ✅ Get Selected Crop Info
  const selectedCrop = crops.find(crop => crop.crop_history_id === selectedCropId);

  // ✅ Display label mapping
  const getDisplayActivityType = (activityType) => {
    const displayMap = {
      'Plowing': 'Land Preparation',
      'Spraying': 'Pest Control',
    };
    return displayMap[activityType] || activityType;
  };

  // ✅ Activity sequence order for sorting
  const getActivitySequence = (activityType) => {
    const sequenceMap = {
      'Plowing': 1,
      'Land Preparation': 1,
      'Sowing': 2,
      'Irrigation': 3,
      'Fertilization': 4,
      'Spraying': 5,
      'Pest Control': 5,
      'Weeding': 6,
      'Harvesting': 7,
    };
    return sequenceMap[activityType] || 99;
  };

  // ✅ Sort activities by farming sequence, then by date
  const sortActivitiesBySequence = (activities) => {
    return [...activities].sort((a, b) => {
      const seqA = getActivitySequence(a.activity_type);
      const seqB = getActivitySequence(b.activity_type);
      
      if (seqA !== seqB) {
        return seqA - seqB;
      }
      return new Date(a.activity_date) - new Date(b.activity_date);
    });
  };

  // ✅ Dynamic Activity Icons and Colors
  const getActivityIcon = (activityType) => {
    const iconMap = {
      'Plowing': 'landscape',
      'Land Preparation': 'landscape',
      'Sowing': 'spa',
      'Irrigation': 'opacity',
      'Fertilization': 'eco',
      'Weeding': 'nature-people',
      'Spraying': 'bug-report',
      'Pest Control': 'bug-report',
      'Harvesting': 'agriculture'
    };
    
    return iconMap[activityType] || 'event';
  };

  const getActivityColor = (activityType) => {
    const colorMap = {
      'Plowing': '#8B4513',
      'Land Preparation': '#8B4513',
      'Sowing': '#16A34A',
      'Irrigation': '#1E40AF',
      'Fertilization': '#EA580C',
      'Weeding': '#65A30D',
      'Spraying': '#DC2626',
      'Pest Control': '#DC2626',
      'Harvesting': '#CA8A04'
    };
    
    return colorMap[activityType] || PALETTE.muted;
  };

  // ✅ Dynamic Date Formatting
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date not set';
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // ✅ Calculate statistics
  const completedCount = activities.filter(activity => 
    activity.isCompleted
  ).length;
  
  const pendingCount = activities.length - completedCount;

  // ✅ Render Activity Item
  const renderActivityItem = (activity, index) => {
    const status = getActivityStatus(activity);
    const isDue = isActivityCompleted(activity.activity_date) && !activity.isCompleted;
    
    return (
      <TouchableOpacity
        key={activity.id || `activity-${index}`}
        style={[
          styles.checklistItem,
          activity.isCompleted && styles.completedItem,
          isDue && styles.dueItem,
          activity.activity_type === 'Harvesting' && !activity.isCompleted && styles.harvestingItem
        ]}
        onPress={() => {
          if (activity.isCompleted) {
            markActivityAsIncomplete(activity);
          } else {
            markActivityAsComplete(activity);
          }
        }}
        activeOpacity={0.7}
      >
        {/* CHECKBOX */}
        <View style={styles.checkboxContainer}>
          <View style={[
            styles.checkbox,
            activity.isCompleted && styles.checkboxChecked,
            isDue && styles.checkboxDue,
            completingActivity === activity.id && styles.checkboxProcessing
          ]}>
            {completingActivity === activity.id ? (
              <ActivityIndicator size="small" color="white" />
            ) : activity.isCompleted ? (
              <Icon name="check" size={16} color="white" />
            ) : activity.activity_type === 'Harvesting' ? (
              <Icon name="agriculture" size={16} color="#FF9800" />
            ) : isDue ? (
              <Icon name="warning" size={16} color="#FF5722" />
            ) : null}
          </View>
        </View>

        {/* Activity Content */}
        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            <View style={styles.activityTypeContainer}>
              <View style={styles.activityTitleRow}>
                <Icon 
                  name={getActivityIcon(activity.activity_type)} 
                  size={16} 
                  color={getActivityColor(activity.activity_type)} 
                />
                <Text style={[
                  styles.activityType,
                  { color: getActivityColor(activity.activity_type) }
                ]}>
                  {getDisplayActivityType(activity.activity_type)}
                </Text>
              </View>
              {activity.activity_type === 'Harvesting' && !activity.isCompleted && (
                <View style={styles.yieldButtonBadge}>
                  <Icon name="agriculture" size={10} color="#FFF" />
                  <Text style={styles.yieldButtonText}>HARVEST</Text>
                </View>
              )}
              {isDue && !activity.isCompleted && (
                <View style={styles.dueBadge}>
                  <Icon name="schedule" size={10} color="#FFF" />
                  <Text style={styles.dueBadgeText}>DUE</Text>
                </View>
              )}
              <View style={[styles.statusBadge, { backgroundColor: status.statusColor }]}>
                <Text style={styles.statusText}>{status.statusText}</Text>
              </View>
            </View>
            <Text style={[
              styles.activityDate,
              isDue && !activity.isCompleted && styles.dueDate
            ]}>
              {formatDate(activity.activity_date)}
              {isDue && !activity.isCompleted && ' ⚠️'}
            </Text>
          </View>

          <Text style={styles.activityDescription}>
            {activity.description}
          </Text>

          {/* ✅ COST DISPLAY SECTION */}
          {activity.activity_cost && (
            <View style={styles.costDisplayContainer}>
              <View style={styles.costBadge}>
                <Icon name="payments" size={14} color="#4CAF50" />
                <Text style={styles.costText}>
                  Rs {parseFloat(activity.activity_cost).toFixed(0)}
                </Text>
              </View>
              {activity.isCompleted && (
                <TouchableOpacity 
                  style={styles.editCostButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    editActivityCost(activity);
                  }}
                >
                  <Icon name="edit" size={14} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ✅ YIELD ENTRY BOX */}
          {activity.activity_type === 'Harvesting' && activity.isCompleted && !selectedCrop?.yield_per_40kg && (
            <TouchableOpacity
              style={styles.yieldEntryBox}
              onPress={() => {
                setSelectedHarvestingActivity(activity);
                setActualYield('');
                setYieldError('');
                setShowYieldModal(true);
              }}
            >
              <View style={styles.yieldEntryContent}>
                <Icon name="edit" size={14} color="#2E7D32" />
                <Text style={styles.yieldEntryText}>Enter Yield</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* ✅ AGAR HARVESTING COMPLETE HAI AUR YIELD HAI */}
          {activity.activity_type === 'Harvesting' && activity.isCompleted && selectedCrop?.yield_per_40kg && (
            <View style={styles.yieldDisplayBox}>
              <Icon name="assessment" size={14} color="#2E7D32" />
              <Text style={styles.yieldDisplayText}>
                Final Yield: {selectedCrop.yield_per_40kg} per 40kg
              </Text>
            </View>
          )}

          {activity.chemical_or_fertilizer_used && (
            <View style={styles.chemicalContainer}>
              <Icon name="science" size={14} color={PALETTE.orange} />
              <Text style={styles.chemicalText}>
                {activity.chemical_or_fertilizer_used}
              </Text>
            </View>
          )}

          {activity.remarks && (
            <Text style={styles.remarks}>
              {activity.remarks}
            </Text>
          )}

          {/* Show completion info for completed activities */}
          {activity.isCompleted && (
            <View style={styles.completedInfo}>
              <Icon name="verified" size={12} color={PALETTE.green} />
              <Text style={styles.completedText}>
                Completed on {formatDate(activity.completed_date || activity.activity_date)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // ✅ COST INPUT MODAL
  const renderCostModal = () => (
    <Modal
      visible={showCostModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        if (!savingCost) {
          setShowCostModal(false);
          setCostAmount('');
        }
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.costModalContent}>
            <View style={styles.costModalHeader}>
              <Icon name="attach-money" size={32} color="#4CAF50" />
              <View>
                <Text style={styles.costModalTitle}>
                  Enter Cost for {selectedActivityForCost?.activity_type}
                </Text>
                <Text style={styles.costModalSubtitle}>
                  {selectedCrop?.crop_name}
                </Text>
              </View>
            </View>
            
            <View style={styles.costInputContainer}>
              <Text style={styles.costLabel}>
                Amount (Rs) *
              </Text>
              <View style={[
                styles.costInputWrapper,
                !costAmount && styles.costInputError
              ]}>
                <Text style={styles.currencySymbol}>Rs</Text>
                <TextInput
                  style={styles.costInput}
                  placeholder="e.g., 5000"
                  value={costAmount}
                  onChangeText={setCostAmount}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                  autoFocus={true}
                />
              </View>
              {!costAmount && (
                <Text style={styles.costErrorText}>
                  <Icon name="error" size={12} color="#D32F2F" /> Please enter amount
                </Text>
              )}
            </View>
            
            <Text style={styles.costNote}>
              <Icon name="info" size={14} color="#2196F3" /> 
              This cost will be saved for this activity.
            </Text>
            
            <View style={styles.costActionButtons}>
              <TouchableOpacity
                style={[styles.costButton, styles.costButtonSave]}
                onPress={saveCostAndCompleteActivity}
                disabled={savingCost || !costAmount}
              >
                {savingCost ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon name="check" size={18} color="white" />
                    <Text style={styles.costButtonSaveText}>
                      Save Cost & Complete
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.costCloseButton}
              onPress={() => {
                if (!savingCost) {
                  setShowCostModal(false);
                  setCostAmount('');
                }
              }}
              disabled={savingCost}
            >
              <Text style={styles.costCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  // ✅ LOADING STATE
  if (loading && crops.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PALETTE.green} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[PALETTE.green]}
          />
        }
      >
        {/* Error Message */}
        {error && (
          <View style={styles.errorBanner}>
            <Icon name="error-outline" size={20} color={PALETTE.orange} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* Crop Selection */}
        {crops.length > 0 && (
          <View style={styles.cropSelectionContainer}>
            <T style={styles.sectionTitle}>Select Crop</T>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cropsScrollView}>
              {crops.map((crop) => (
                <TouchableOpacity
                  key={crop.crop_history_id}
                  style={[
                    styles.cropOption,
                    selectedCropId === crop.crop_history_id && styles.cropOptionSelected
                  ]}
                  onPress={() => handleCropSelect(crop)}
                >
                  <Text style={styles.cropOptionText}>{crop.crop_name}</Text>
                  <Text style={styles.cropOptionSubtext}>
                    {crop.city} • {crop.area}
                  </Text>
                  {selectedCropId === crop.crop_history_id && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Selected Crop Info */}
        {selectedCrop && (
          <View style={styles.cropInfoCard}>
            <View style={styles.cropInfoHeader}>
              <Icon name="spa" size={32} color={PALETTE.green} />
              <View style={styles.cropInfoTextContainer}>
                <Text style={styles.cropInfoTitle}>{selectedCrop.crop_name}</Text>
                <Text style={styles.cropInfoSubtitle}>
                  {selectedCrop.city} - {selectedCrop.area} ({selectedCrop.zone})
                </Text>
                <Text style={styles.cropInfoDates}>
                  {formatDate(selectedCrop.sowing_date)} to {formatDate(selectedCrop.harvest_date)}
                </Text>
                {selectedCrop.yield_per_40kg && (
                  <Text style={styles.cropInfoYield}>
                    🌾 Yield: {selectedCrop.yield_per_40kg} per 40kg
                  </Text>
                )}
              </View>
            </View>
            
            {/* FINANCIAL SUMMARY - with Profit Percentage */}
            {financialSummary && (
              <TouchableOpacity 
                style={styles.financialSummaryCard}
                onPress={handleFinancialSummaryClick}
              >
                <View style={styles.financialSummaryHeader}>
                  <Icon name="account-balance" size={20} color="#2E7D32" />
                  <Text style={styles.financialSummaryTitle}>Financial Summary</Text>
                  {financialSummary.hasYield && (
                    <Icon name="chevron-right" size={20} color="#2E7D32" style={{marginLeft: 'auto'}} />
                  )}
                </View>
                
                {/* Total Expenses */}
                <View style={styles.expenseSection}>
                  <Text style={styles.expenseSectionTitle}>💰 TOTAL EXPENSES:</Text>
                  <Text style={styles.expenseValue}>Rs {financialSummary.totalCost.toFixed(0)}</Text>
                </View>
                
                {/* Net Profit/Loss with Percentage */}
                <View style={[
                  styles.netProfitSection,
                  financialSummary.isProfit ? styles.profitBg : styles.lossBg
                ]}>
                  <View>
                    <Text style={styles.netProfitTitle}>
                      {financialSummary.isProfit ? '✅ NET PROFIT:' : '❌ NET LOSS:'}
                    </Text>
                    <Text style={styles.profitPercentText}>
                      Profit: {financialSummary.profitPercentage} (of revenue)
                    </Text>
                  </View>
                  <Text style={[
                    styles.netProfitValue,
                    financialSummary.isProfit ? styles.profitText : styles.lossText
                  ]}>
                    Rs {Math.abs(financialSummary.netProfit).toFixed(0)}
                  </Text>
                </View>
                
                {/* Navigation Hint */}
                <View style={styles.navigationHint}>
                  <Icon name="info" size={12} color="#2196F3" />
                  <Text style={styles.navigationHintText}>
                    Click to view complete financial history
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            
            {/* ✅ PROGRESS BAR */}
            <ProgressBar 
              completed={completedCount} 
              total={activities.length} 
              cropName={selectedCrop.crop_name}
            />
          </View>
        )}

        {/* Activities List */}
        {selectedCrop && activities.length > 0 && (
          <View style={styles.activitiesSection}>
            <View style={styles.activitiesHeader}>
              <Text style={styles.sectionTitle}>
                Farming Activities ({activities.length})
              </Text>
              <TouchableOpacity
                style={styles.helpButton}
                onPress={() => {
                  Alert.alert(
                    'How to Use',
                    '1. ✅ Click on any activity to mark it as complete\n2. 💰 Enter cost for each activity\n3. 🌾 Harvesting complete hone ke baad yield enter karo\n4. 📊 Financial Summary will show profit/loss\n5. 🖱️ Click Financial Summary to move to history',
                    [{ text: 'OK' }]
                  );
                }}
              >
                <Icon name="help-outline" size={20} color={PALETTE.blue} />
              </TouchableOpacity>
            </View>
            
            {sortActivitiesBySequence(activities).map((activity, index) => renderActivityItem(activity, index))}
          </View>
        )}

        {/* No Activities Message */}
        {selectedCrop && activities.length === 0 && !loading && (
          <View style={styles.noActivitiesContainer}>
            <Icon name="event" size={48} color={PALETTE.muted} />
            <Text style={styles.noActivitiesText}>
              No Activities Found
            </Text>
            <Text style={styles.noActivitiesSubtext}>
              No activities scheduled for {selectedCrop.crop_name} yet.
            </Text>
          </View>
        )}

        {/* No Crops Found */}
        {crops.length === 0 && !loading && (
          <View style={styles.noCropsContainer}>
            <Icon name="grass" size={64} color={PALETTE.muted} />
            <Text style={styles.noCropsText}>No Crops Found</Text>
            <Text style={styles.noCropsSubtext}>
              Add a new crop to start tracking activities
            </Text>
            <TouchableOpacity 
              style={styles.addCropButton}
              onPress={() => navigation.navigate('CropInputPage')}
            >
              <Icon name="add" size={20} color="white" />
              <Text style={styles.addCropButtonText}>Add New Crop</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ✅ COST MODAL */}
      {renderCostModal()}

      {/* ✅ YIELD MODAL */}
      <Modal
        visible={showYieldModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          if (!savingYield) {
            setShowYieldModal(false);
            setActualYield('');
            setYieldError('');
          }
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.yieldModalContent}>
              <View style={styles.yieldModalHeader}>
                <Icon name="agriculture" size={32} color="#2E7D32" />
                <View>
                  <Text style={styles.yieldModalTitle}>
                    Enter Harvest Yield 🌾
                  </Text>
                  <Text style={styles.yieldModalCropName}>
                    {selectedCrop?.crop_name}
                  </Text>
                </View>
              </View>
              
              <View style={styles.yieldInputContainer}>
                <Text style={styles.yieldLabel}>
                  Yield per acre *
                </Text>
                <View style={[
                  styles.yieldInputWrapper,
                  yieldError && styles.yieldInputError
                ]}>
                  <TextInput
                    style={styles.yieldInput}
                    placeholder="e.g., 10.5"
                    value={actualYield}
                    onChangeText={(text) => {
                      setActualYield(text);
                      setYieldError('');
                    }}
                    keyboardType="decimal-pad"
                    placeholderTextColor="#999"
                    autoFocus={true}
                  />
                  <Text style={styles.yieldUnit}>per 40kg</Text>
                </View>
                {yieldError ? (
                  <Text style={styles.yieldErrorText}>
                    <Icon name="error" size={12} color="#D32F2F" /> {yieldError}
                  </Text>
                ) : (
                  <Text style={styles.yieldHelpText}>
                    💡 1 maund= 40 KG
                  </Text>
                )}
              </View>
              
              <Text style={styles.yieldNote}>
                <Icon name="info" size={14} color="#2196F3" /> 
                Harvesting already marked as complete. Please enter yield to see profit/loss.
              </Text>
              
              <View style={styles.yieldActionButtons}>
                <TouchableOpacity
                  style={[styles.yieldButton, styles.yieldButtonSave]}
                  onPress={saveYieldToCropHistory}
                  disabled={savingYield}
                >
                  {savingYield ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Icon name="save" size={18} color="white" />
                      <Text style={styles.yieldButtonSaveText}>
                        Save Yield
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={styles.yieldCloseButton}
                onPress={() => {
                  if (!savingYield) {
                    setShowYieldModal(false);
                    setActualYield('');
                    setYieldError('');
                  }
                }}
                disabled={savingYield}
              >
                <Text style={styles.yieldCloseButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ✅ STYLES (Unchanged)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bg },
  content: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3F2', padding: 12, margin: 16, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: PALETTE.orange },
  errorBannerText: { marginLeft: 8, color: PALETTE.orange, fontSize: 14, flex: 1 },
  cropSelectionContainer: { margin: 16, marginTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: PALETTE.text, marginBottom: 12 },
  cropsScrollView: { marginHorizontal: -4 },
  cropOption: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginHorizontal: 4, minWidth: 120, borderWidth: 1, borderColor: PALETTE.gray },
  cropOptionSelected: { borderColor: PALETTE.green, backgroundColor: PALETTE.greenLite },
  cropOptionText: { fontSize: 14, fontWeight: 'bold', color: PALETTE.text },
  cropOptionSubtext: { fontSize: 12, color: PALETTE.muted, marginTop: 4 },
  selectedIndicator: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: PALETTE.green },
  cropInfoCard: { backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cropInfoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cropInfoTextContainer: { marginLeft: 12, flex: 1 },
  cropInfoTitle: { fontSize: 18, fontWeight: 'bold', color: PALETTE.text },
  cropInfoSubtitle: { fontSize: 14, color: PALETTE.muted, marginTop: 4 },
  cropInfoDates: { fontSize: 12, color: PALETTE.blue, marginTop: 2 },
  cropInfoYield: { fontSize: 13, color: '#2E7D32', fontWeight: '600', marginTop: 4, backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  financialSummaryCard: { backgroundColor: '#F8F9FA', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#E9ECEF' },
  financialSummaryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  financialSummaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32', marginLeft: 8 },
  expenseSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
  expenseSectionTitle: { fontSize: 14, fontWeight: '600', color: '#666' },
  expenseValue: { fontSize: 16, fontWeight: 'bold', color: '#DC2626' },
  netProfitSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, marginTop: 8 },
  profitBg: { backgroundColor: '#E8F5E9' },
  lossBg: { backgroundColor: '#FFEBEE' },
  netProfitTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  netProfitValue: { fontSize: 18, fontWeight: 'bold' },
  profitText: { color: '#2E7D32' },
  lossText: { color: '#DC2626' },
  profitPercentText: { fontSize: 11, color: '#666', marginTop: 2 },
  navigationHint: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', padding: 6, borderRadius: 4, marginTop: 8, gap: 4 },
  navigationHintText: { fontSize: 10, color: '#2196F3', fontStyle: 'italic' },
  progressContainer: { marginBottom: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: PALETTE.gray },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressText: { fontSize: 14, fontWeight: '600', color: PALETTE.text },
  completedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.green, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  completedBadgeText: { fontSize: 10, color: 'white', fontWeight: 'bold', marginLeft: 4 },
  progressBar: { height: 8, backgroundColor: PALETTE.gray, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: PALETTE.blue, borderRadius: 4 },
  progressComplete: { backgroundColor: PALETTE.green },
  completionMessage: { fontSize: 12, color: PALETTE.green, fontWeight: '600', textAlign: 'center', marginTop: 8, fontStyle: 'italic' },
  activitiesSection: { margin: 16 },
  activitiesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  helpButton: { padding: 4 },
  checklistItem: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 8, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  completedItem: { backgroundColor: PALETTE.greenLite, borderLeftWidth: 4, borderLeftColor: PALETTE.green },
  dueItem: { backgroundColor: '#FFF3E0', borderLeftWidth: 4, borderLeftColor: '#FF9800' },
  harvestingItem: { borderLeftWidth: 4, borderLeftColor: '#FF9800', backgroundColor: '#FFF3E0' },
  checkboxContainer: { marginRight: 12, justifyContent: 'center' },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: PALETTE.muted, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: PALETTE.green, borderColor: PALETTE.green },
  checkboxDue: { borderColor: '#FF9800', backgroundColor: '#FFF3E0' },
  checkboxProcessing: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  activityContent: { flex: 1 },
  activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  activityTypeContainer: { flex: 1 },
  activityTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  activityType: { fontSize: 14, fontWeight: 'bold', marginLeft: 6 },
  yieldButtonBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E7D32', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginTop: 4, alignSelf: 'flex-start', gap: 4 },
  yieldButtonText: { fontSize: 10, color: 'white', fontWeight: 'bold' },
  dueBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF9800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginTop: 4, alignSelf: 'flex-start', gap: 4 },
  dueBadgeText: { fontSize: 10, color: 'white', fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginTop: 4 },
  statusText: { fontSize: 10, fontWeight: 'bold', color: 'white' },
  activityDate: { fontSize: 12, color: PALETTE.muted },
  dueDate: { color: '#FF5722', fontWeight: '600' },
  activityDescription: { fontSize: 13, color: PALETTE.text, marginBottom: 8, lineHeight: 18 },
  costDisplayContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#E8F5E9', padding: 8, borderRadius: 6, marginBottom: 8 },
  costBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  costText: { fontSize: 14, color: '#2E7D32', fontWeight: '600' },
  editCostButton: { padding: 4 },
  yieldEntryBox: { backgroundColor: '#E8F5E9', padding: 10, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#2E7D32', borderStyle: 'dashed' },
  yieldEntryContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  yieldEntryText: { fontSize: 13, color: '#2E7D32', fontWeight: '600' },
  yieldDisplayBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 8, borderRadius: 6, marginBottom: 8, gap: 6 },
  yieldDisplayText: { fontSize: 12, color: '#2E7D32', fontWeight: '500' },
  chemicalContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.orange + '20', padding: 8, borderRadius: 6, marginBottom: 8 },
  chemicalText: { fontSize: 12, color: PALETTE.orange, marginLeft: 6, fontWeight: '500' },
  remarks: { fontSize: 12, color: PALETTE.muted, fontStyle: 'italic' },
  completedInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.green + '20', padding: 6, borderRadius: 4, marginTop: 4 },
  completedText: { fontSize: 11, color: PALETTE.green, marginLeft: 4, fontWeight: '500' },
  noActivitiesContainer: { alignItems: 'center', padding: 40, backgroundColor: 'white', borderRadius: 12, margin: 16 },
  noActivitiesText: { fontSize: 16, fontWeight: 'bold', color: PALETTE.text, marginTop: 12, textAlign: 'center' },
  noActivitiesSubtext: { fontSize: 14, color: PALETTE.muted, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  noCropsContainer: { alignItems: 'center', padding: 40, marginTop: 40 },
  noCropsText: { fontSize: 18, fontWeight: 'bold', color: PALETTE.text, marginTop: 16 },
  noCropsSubtext: { fontSize: 14, color: PALETTE.muted, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  addCropButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.blue, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, marginTop: 20 },
  addCropButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  costModalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 10 },
  costModalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  costModalTitle: { fontSize: 22, fontWeight: 'bold', color: '#4CAF50' },
  costModalSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  costInputContainer: { marginBottom: 20 },
  costLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  costInputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
  costInputError: { borderColor: '#D32F2F', backgroundColor: '#FFEBEE' },
  currencySymbol: { backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 14, fontSize: 16, color: '#666', borderRightWidth: 1, borderRightColor: '#ddd' },
  costInput: { flex: 1, padding: 14, fontSize: 16, color: '#333' },
  costErrorText: { fontSize: 12, color: '#D32F2F', marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  costNote: { fontSize: 12, color: '#2196F3', backgroundColor: '#E3F2FD', padding: 10, borderRadius: 6, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 6 },
  costActionButtons: { marginBottom: 16 },
  costButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 8, gap: 8 },
  costButtonSave: { backgroundColor: '#4CAF50' },
  costButtonSaveText: { fontSize: 14, fontWeight: 'bold', color: 'white' },
  costCloseButton: { alignItems: 'center', paddingVertical: 12 },
  costCloseButtonText: { fontSize: 14, color: '#666' },
  yieldModalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 10 },
  yieldModalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  yieldModalTitle: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32' },
  yieldModalCropName: { fontSize: 14, color: '#666', marginTop: 2 },
  yieldInputContainer: { marginBottom: 20 },
  yieldLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  yieldInputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
  yieldInputError: { borderColor: '#D32F2F', backgroundColor: '#FFEBEE' },
  yieldInput: { flex: 1, padding: 14, fontSize: 16, color: '#333' },
  yieldUnit: { backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 14, fontSize: 14, color: '#666', borderLeftWidth: 1, borderLeftColor: '#ddd' },
  yieldErrorText: { fontSize: 12, color: '#D32F2F', marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  yieldHelpText: { fontSize: 12, color: '#666', fontStyle: 'italic' },
  yieldNote: { fontSize: 12, color: '#2196F3', backgroundColor: '#E3F2FD', padding: 10, borderRadius: 6, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 6 },
  yieldActionButtons: { marginBottom: 16 },
  yieldButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 8, gap: 8 },
  yieldButtonSave: { backgroundColor: '#2E7D32' },
  yieldButtonSaveText: { fontSize: 14, fontWeight: 'bold', color: 'white' },
  yieldCloseButton: { alignItems: 'center', paddingVertical: 12 },
  yieldCloseButtonText: { fontSize: 14, color: '#666' },
});

export default CropActivitiesScreen;