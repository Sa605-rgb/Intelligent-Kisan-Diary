





// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   TextInput,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   TouchableWithoutFeedback,
//   Dimensions
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { farmerAPI, adminAPI } from './api';
// import T from './localization/T';  // ✅ Smart Translation Component

// const { width } = Dimensions.get('window');

// // ✅ DropdownModal Component - FIXED
// const DropdownModal = ({ visible, items, onSelect, onClose, title }) => {
//   return (
//     <Modal visible={visible} transparent animationType="fade">
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.modalOverlay}>
//           <TouchableWithoutFeedback>
//             <View style={styles.dropdownMenu}>
//               <Text style={styles.dropdownTitle}>{title}</Text>
//               <ScrollView style={styles.dropdownScrollView}>
//                 {items.map((item, index) => {
//                   // ✅ Skip section headers - don't make them clickable
//                   if (item.section) {
//                     return (
//                       <View key={index} style={styles.sectionHeader}>
//                         <Text style={styles.sectionHeaderText}>{item.title}</Text>
//                       </View>
//                     );
//                   }
                  
//                   return (
//                     <TouchableOpacity
//                       key={index}
//                       style={styles.dropdownItem}
//                       onPress={() => {
//                         console.log('📱 Crop item pressed:', item);
//                         onSelect(item);
//                       }}
//                     >
//                       <View>
//                         <Text style={styles.cropNameText}>
//                           {typeof item === 'object' ? item.name || item.crop_name : item}
//                         </Text>
//                         <Text style={styles.seedTypeText}>
//                           {item.seed_type ? `Seed: ${item.seed_type}` : 'Seed: N/A'}
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           </TouchableWithoutFeedback>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );
// };

// const CropInputPage = ({ navigation, route }) => {
//   // State variables
//   const [selectedLand, setSelectedLand] = useState(null);
//   const [cropName, setCropName] = useState('');
//   const [sowingDate, setSowingDate] = useState(null);
//   const [harvestDate, setHarvestDate] = useState(null);
//   const [showSowingPicker, setShowSowingPicker] = useState(false);
//   const [showHarvestPicker, setShowHarvestPicker] = useState(false);
//   const [season, setSeason] = useState('');
//   const [yieldPer40kg, setYieldPer40kg] = useState('');
  
//   const [loading, setLoading] = useState(false);
//   const [landsLoading, setLandsLoading] = useState(false);
//   const [showCropDropdown, setShowCropDropdown] = useState(false);
//   const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  
//   // ✅ NEW: Location-based crops state
//   const [locationBasedCrops, setLocationBasedCrops] = useState([]);
//   const [loadingLocationCrops, setLoadingLocationCrops] = useState(false);
  
//   // ✅ Admin proposed dates state
//   const [adminProposedSowingDate, setAdminProposedSowingDate] = useState(null);
//   const [adminProposedHarvestDate, setAdminProposedHarvestDate] = useState(null);
  
//   // ✅ Schedule States
//   const [proposedActivities, setProposedActivities] = useState([]);
//   const [editableActivities, setEditableActivities] = useState([]);
//   const [scheduleLoading, setScheduleLoading] = useState(false);

//   // ✅ FERTILIZER & PESTICIDE SCHEDULED DATES
//   const [fertilizerDates, setFertilizerDates] = useState([]);
//   const [pesticideDates, setPesticideDates] = useState([]);
//   const [showFertilizerDatePicker, setShowFertilizerDatePicker] = useState({});
//   const [showPesticideDatePicker, setShowPesticideDatePicker] = useState({});
  
//   // ✅ NEW: Selected fertilizer/pesticide names (user selected from FertilizerInputPage)
//   const [selectedFertilizerNames, setSelectedFertilizerNames] = useState({}); // { 0: "DAP", 1: "Urea" }
//   const [selectedPesticideNames, setSelectedPesticideNames] = useState({}); // { 0: "Chlorpyrifos" }
  
//   // ✅ NEW: Track which fertilizers/pesticides are confirmed (applied)
//   const [confirmedFertilizers, setConfirmedFertilizers] = useState({}); // { 0: true, 1: false }
//   const [confirmedPesticides, setConfirmedPesticides] = useState({}); // { 0: true }
  
//   // ✅ NEW: Crop schedule data from backend
//   const [cropScheduleData, setCropScheduleData] = useState(null);
//   const [sowingDateRange, setSowingDateRange] = useState(null); // { start: Date, end: Date, text: "25 Oct – 15 Nov" }
//   const [harvestDateRange, setHarvestDateRange] = useState(null); // { text: "15 Apr – 5 May" }
//   const [calculatedActivities, setCalculatedActivities] = useState([]); // fertilizer, pesticide dates based on sowing
  
//   // ✅ NEW: Region-specific ranges from backend
//   const [fertilizerRangeText, setFertilizerRangeText] = useState(''); // "Urea1: 20–25 DAS. Urea2: 45–50 DAS."
//   const [pesticideRangeText, setPesticideRangeText] = useState(''); // "Weed control: 20–30 DAS..."
//   const [harvestRangeText, setHarvestRangeText] = useState(''); // "15 Apr – 5 May"

//   const [cropsList, setCropsList] = useState([]);
//   const [cropsLoading, setCropsLoading] = useState(false);
//   const [farmerLands, setFarmerLands] = useState([]);
//   const [landsWithCrops, setLandsWithCrops] = useState([]);
//   const [emptyLands, setEmptyLands] = useState([]);
//   const [farmerId, setFarmerId] = useState(null);
//   const [currentRealCropId, setCurrentRealCropId] = useState(null);
//   const [creatingCrop, setCreatingCrop] = useState(false);

//   const seasons = ['Rabi', 'Kharif'];

//   // Load initial data from backend
//   useEffect(() => {
//     loadFarmerData();
//     loadCropsFromDB();
//   }, []);

//   // Refresh lands on focus
//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', async () => {
//       if (farmerId) {
//         loadFarmerLandsWithStatus(farmerId);
//       }
      
//       // ✅ Check if returning from FertilizerInputPage with selected item (from AsyncStorage)
//       try {
//         const confirmedFertilizerData = await AsyncStorage.getItem('confirmedFertilizer');
//         if (confirmedFertilizerData) {
//           const { selectedFertilizer, fertilizerIndex } = JSON.parse(confirmedFertilizerData);
//           console.log('🌾 Received selected fertilizer from AsyncStorage:', selectedFertilizer, 'for index:', fertilizerIndex);
          
//           setSelectedFertilizerNames(prev => ({
//             ...prev,
//             [fertilizerIndex]: selectedFertilizer
//           }));
//           // ✅ Mark this fertilizer as confirmed (selected)
//           setConfirmedFertilizers(prev => ({
//             ...prev,
//             [fertilizerIndex]: true
//           }));
          
//           // Clear from AsyncStorage to avoid re-processing
//           await AsyncStorage.removeItem('confirmedFertilizer');
//         }
        
//         // ✅ Check if returning from PesticideInputPage with selected item (from AsyncStorage)
//         const confirmedPesticideData = await AsyncStorage.getItem('confirmedPesticide');
//         if (confirmedPesticideData) {
//           const { selectedPesticide, pesticideIndex } = JSON.parse(confirmedPesticideData);
//           console.log('🐛 Received selected pesticide from AsyncStorage:', selectedPesticide, 'for index:', pesticideIndex);
          
//           setSelectedPesticideNames(prev => ({
//             ...prev,
//             [pesticideIndex]: selectedPesticide
//           }));
//           // ✅ Mark this pesticide as confirmed (selected)
//           setConfirmedPesticides(prev => ({
//             ...prev,
//             [pesticideIndex]: true
//           }));
          
//           // Clear from AsyncStorage to avoid re-processing
//           await AsyncStorage.removeItem('confirmedPesticide');
//         }
//       } catch (error) {
//         console.log('Error reading confirmed data from AsyncStorage:', error);
//       }
//     });
//     return unsubscribe;
//   }, [navigation, farmerId]);

//   // ✅ NEW: Load location-based crops when land is selected
//   useEffect(() => {
//     if (selectedLand && selectedLand.city) {
//       loadCropsByLocation(selectedLand.city);
//     }
//   }, [selectedLand]);
//   useEffect(() => {
//   if (cropName && selectedLand && farmerId) {
//     loadAdminProposedDates(cropName);
//   }
// }, [cropName, selectedLand, farmerId]);

//    // ✅ Load farmer data from AsyncStorage
// const loadFarmerData = async () => {
//   try {
//     const savedFarmerId = await AsyncStorage.getItem('farmerId');
//     if (savedFarmerId) {
//       const fid = parseInt(savedFarmerId);
//       setFarmerId(fid);
//       loadFarmerLandsWithStatus(fid);
//     }
//   } catch (error) {
//     console.error('Error loading farmer data:', error);
//     Alert.alert('Error', 'Failed to load farmer data');
//   }
// };

// // ✅ Load farmer lands with status from backend
// const loadFarmerLandsWithStatus = async (fid) => {
//   setLandsLoading(true);
//   try {
//     const response = await farmerAPI.getFarmerLandsWithStatus(fid);
//     if (response.success) {
//       const landsData = response.lands.map(land => ({
//         ...land,
//         land_id: land.land_id || land.id,
//         id: land.land_id || land.id
//       }));

//       const occupiedLands = landsData.filter(land => land.status === 'occupied');
//       const emptyLandsData = landsData.filter(land => land.status === 'empty');

//       setLandsWithCrops(occupiedLands);
//       setEmptyLands(emptyLandsData);
//       setFarmerLands(landsData);
//     } else {
//       Alert.alert('Error', 'Failed to load lands data');
//     }
//   } catch (error) {
//     console.error('Error loading lands:', error);
//     Alert.alert('Error', 'Failed to load lands data');
//   } finally {
//     setLandsLoading(false);
//   }
// };

// // ✅ Load crops from database
// const loadCropsFromDB = async () => {
//   setCropsLoading(true);
//   try {
//     const response = await farmerAPI.getCrops();
//     if (response.success) {
//       setCropsList(response.crops);
//     } else {
//       Alert.alert('Error', 'Failed to load crops from database');
//     }
//   } catch (error) {
//     console.error('Error loading crops:', error);
//     Alert.alert('Error', 'Failed to load crops list');
//   } finally {
//     setCropsLoading(false);
//   }
// };

//   // ✅ Load crops based on location
//   const loadCropsByLocation = async (cityName) => {
//     setLoadingLocationCrops(true);
//     try {
//       const response = await farmerAPI.getCropsByCity(cityName);
//       if (response.success) {
//         setLocationBasedCrops(response.crops || []);
//         console.log(`🌾 Found ${response.crops.length} crops in ${cityName}`);
//       } else {
//         console.log('No location-based crops found');
//         setLocationBasedCrops([]);
//       }
//     } catch (error) {
//       console.error('Error loading location-based crops:', error);
//       setLocationBasedCrops([]);
//     } finally {
//       setLoadingLocationCrops(false);
//     }
//   };

//   // ✅ Handle land selection with location-based crops
//   const handleLandSelect = (land) => {
//     setSelectedLand(land);
    
//     // Reset crop selection when land changes
//     if (currentRealCropId) {
//       Alert.alert(
//         'Change Land?',
//         'Changing land will reset your current crop selection. Continue?',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { 
//             text: 'Continue', 
//             onPress: () => {
//               resetCropSelection();
//             }
//           }
//         ]
//       );
//     }
//   };

//   // ✅ Reset crop selection
//   const resetCropSelection = () => {
//     setCropName('');
//     setCurrentRealCropId(null);
//     setProposedActivities([]);
//     setEditableActivities([]);
//     setFertilizerDates([]);
//     setPesticideDates([]);
//     setSowingDate(null);
//     setHarvestDate(null);
//     setAdminProposedSowingDate(null);
//     setAdminProposedHarvestDate(null);
//     // ✅ Reset new states
//     setCropScheduleData(null);
//     setSowingDateRange(null);
//     setHarvestDateRange(null);
//     setCalculatedActivities([]);
//     // ✅ Reset range texts
//     setFertilizerRangeText('');
//     setPesticideRangeText('');
//     setHarvestRangeText('');
//   };

//   // ✅ NEW: Enhanced crop selection with change functionality
//   const handleCropSelect = async (crop) => {
//     console.log('🌾 handleCropSelect called with:', crop);
    
//     let selectedCropName = typeof crop === 'object' ? (crop.crop_name || crop.name || crop) : crop;
//     console.log('🌾 Selected crop name:', selectedCropName);
    
//     // Close dropdown first
//     setShowCropDropdown(false);
    
//     // If already have a crop selected, show change confirmation
//     if (currentRealCropId && cropName !== selectedCropName) {
//       console.log('🔄 Changing crop from:', cropName, 'to:', selectedCropName);
//       Alert.alert(
//         'Change Crop?', 
//         `Change from "${cropName}" to "${selectedCropName}"?`,
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { 
//             text: 'Change Crop', 
//             onPress: async () => {
//               await createNewCropEntry(selectedCropName); // ✅ Change: Use createNewCropEntry to get timing alert
//             }
//           }
//         ]
//       );
//     } else {
//       // New crop selection
//       console.log('🆕 New crop selection:', selectedCropName);
//       await createNewCropEntry(selectedCropName);
//     }
//   };

//   // ✅ NEW: Update existing crop
//   const updateExistingCrop = async (newCropName) => {
//     if (!currentRealCropId) {
//       Alert.alert('Error', 'No crop selected to update');
//       return;
//     }

//     setCreatingCrop(true);
//     try {
//       const updateData = {
//         crop_name: newCropName,
//         // Reset other fields if needed
//         sowing_date: sowingDate ? formatDateForBackend(sowingDate) : null,
//         harvest_date: harvestDate ? formatDateForBackend(harvestDate) : null,
//       };

//       const response = await farmerAPI.updateCrop(currentRealCropId, updateData);
      
//       if (response.success) {
//         setCropName(newCropName);
//         // Reload admin proposed dates for new crop
//         await loadAdminProposedDates(newCropName);
//         Alert.alert('Success', `Crop changed to ${newCropName} successfully!`);
//       } else {
//         Alert.alert('Error', response.message || 'Failed to update crop');
//       }
//     } catch (error) {
//       console.error('Error updating crop:', error);
//       Alert.alert('Error', 'Failed to update crop');
//     } finally {
//       setCreatingCrop(false);
//     }
//   };

//   // ✅ Handle Add New Land
// const handleAddNewLand = () => {
//   navigation.navigate('LandInputPage');
// };

// // ✅ Handle Season Select
// const handleSeasonSelect = (selectedSeason) => {
//   setSeason(selectedSeason);
//   setShowSeasonDropdown(false);
// };

// // ✅ Handle Admin Sowing Date Click
// const handleAdminSowingDateClick = () => {
//   if (adminProposedSowingDate) {
//     setSowingDate(adminProposedSowingDate);
//     Alert.alert('Success', 'Admin proposed sowing date set successfully!');
//   }
// };

// // ✅ Format Date for Backend
// const formatDateForBackend = (date) => {
//   if (!date) return null;
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// // ✅ Handle Add Crop
// // const handleAddCrop = async () => {
// //   if (!selectedLand || !cropName || !sowingDate || !harvestDate) {
// //     Alert.alert('Error', 'Please fill all required fields');
// //     return;
// //   }

// //   if (!currentRealCropId) {
// //     Alert.alert('Error', 'Crop not properly created');
// //     return;
// //   }

// //   setLoading(true);
// //   try {
// //     const updateData = {
// //       season: season || null,
// //       yield_per_40kg: yieldPer40kg ? parseFloat(yieldPer40kg) : null,
// //       sowing_date: formatDateForBackend(sowingDate),
// //       harvest_date: formatDateForBackend(harvestDate),
// //     };

// //     const response = await farmerAPI.updateCrop(currentRealCropId, updateData);
    
// //     if (response.success) {
// //       // ✅ Save confirmed fertilizer activities
// //       await saveConfirmedFertilizerActivities();
      
// //       // ✅ Save confirmed pesticide activities
// //       await saveConfirmedPesticideActivities();
      
// //       Alert.alert('Success', 'Crop & Schedule saved successfully!', [
// //         {
// //           text: 'OK',
// //           onPress: () => {
// //             // ✅ Navigate to CropActivitiesScreen with crop info
// //             navigation.navigate('CropActivitiesScreen', {
// //               cropHistoryId: currentRealCropId,
// //               cropName: cropName,
// //               landName: selectedLand?.name || selectedLand?.address || 'Land'
// //             });
// //           }
// //         }
// //       ]);
// //       resetForm();
// //       loadFarmerLandsWithStatus(farmerId);
// //     } else {
// //       Alert.alert('Error', response.message || 'Failed to save crop details');
// //     }
// //   } catch (error) {
// //     console.error('Error saving crop:', error);
// //     Alert.alert('Error', 'Failed to save crop details');
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// const handleAddCrop = async () => {
//   if (!selectedLand || !cropName || !sowingDate || !harvestDate) {
//     Alert.alert('Error', 'Please fill all required fields');
//     return;
//   }

//   if (!currentRealCropId) {
//     Alert.alert('Error', 'Crop not properly created');
//     return;
//   }

//   setLoading(true);
//   try {
//     const updateData = {
//       season: season || null,
//       yield_per_40kg: yieldPer40kg ? parseFloat(yieldPer40kg) : null,
//       sowing_date: formatDateForBackend(sowingDate),
//       harvest_date: formatDateForBackend(harvestDate),
//     };

//     console.log('💾 Starting SINGLE crop save process...');
    
//     const response = await farmerAPI.updateCrop(currentRealCropId, updateData);
    
//     if (response.success) {
//       console.log('✅ Crop updated successfully');
      
//       // ✅ SIRF EK HI FUNCTION CALL KARO - DUPLICATE ROKO
//       console.log('💾 Saving ALL activities at once...');
//       const totalSaved = await saveAllActivitiesOnce();
      
//       console.log(`🎯 TOTAL Activities Saved: ${totalSaved}`);
      
//       // ✅ Wait for database
//       console.log('⏳ Waiting for database to update...');
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       console.log('✅ ALL activities saved successfully! Navigating...');
      
//       Alert.alert('Success', `Crop & Activities saved successfully!\nTotal Activities: ${totalSaved}`, [
//         {
//           text: 'OK',
//           onPress: () => {
//             navigation.navigate('CropActivitiesScreen', {
//               cropHistoryId: currentRealCropId,
//               cropName: cropName,
//               landName: selectedLand?.name || selectedLand?.address || 'Land',
//               refreshTimestamp: new Date().getTime()
//             });
//           }
//         }
//       ]);
      
//       // resetForm();
//       loadFarmerLandsWithStatus(farmerId);
//     } else {
//       Alert.alert('Error', response.message || 'Failed to save crop details');
//     }
//   } catch (error) {
//     console.error('Error saving crop:', error);
//     Alert.alert('Error', 'Failed to save crop details');
//   } finally {
//     setLoading(false);
//   }
// };// ✅ SINGLE FUNCTION: Saari activities ek hi baar save karein
// const saveAllActivitiesOnce = async () => {
//   try {
//     if (!currentRealCropId) {
//       console.log('❌ No crop ID for saving activities');
//       return 0;
//     }

//     console.log('💾 Saving ALL activities ONCE to avoid duplicates...');
    
//     let savedCount = 0;
//     const savedActivityKeys = new Set(); // Track unique activities

//     // ✅ 1. Sowing Activity (Always save)
//     const sowingKey = `Sowing-${formatDateForBackend(sowingDate)}`;
//     if (!savedActivityKeys.has(sowingKey)) {
//       const sowingActivity = {
//         crop_history_id: currentRealCropId,
//         activity_date: formatDateForBackend(sowingDate),
//         activity_type: 'Sowing',
//         description: `Sowing of ${cropName}`,
//         chemical_or_fertilizer_used: null,
//         remarks: 'Main sowing activity',
//         is_public: false
//       };
      
//       console.log('💾 Saving sowing activity:', sowingActivity);
//       const sowingResult = await farmerAPI.addCropActivity(sowingActivity);
//       if (sowingResult.success) {
//         console.log('✅ Sowing activity saved:', sowingResult.activity_id);
//         savedCount++;
//         savedActivityKeys.add(sowingKey);
//       }
//     }

//     // ✅ 2. Harvesting Activity (Always save)
//     const harvestKey = `Harvesting-${formatDateForBackend(harvestDate)}`;
//     if (!savedActivityKeys.has(harvestKey)) {
//       const harvestingActivity = {
//         crop_history_id: currentRealCropId,
//         activity_date: formatDateForBackend(harvestDate),
//         activity_type: 'Harvesting',
//         description: `Harvesting of ${cropName}`,
//         chemical_or_fertilizer_used: null,
//         remarks: 'Main harvesting activity',
//         is_public: false
//       };
      
//       console.log('💾 Saving harvesting activity:', harvestingActivity);
//       const harvestResult = await farmerAPI.addCropActivity(harvestingActivity);
//       if (harvestResult.success) {
//         console.log('✅ Harvesting activity saved:', harvestResult.activity_id);
//         savedCount++;
//         savedActivityKeys.add(harvestKey);
//       }
//     }

//     // ✅ 3. Calculated Activities (Fertilizer, Pest Control, Irrigation, etc.)
//     if (calculatedActivities.length > 0) {
//       for (const activity of calculatedActivities) {
//         // Skip sowing and harvesting - already saved above
//         if (activity.type === 'Sowing' || activity.type === 'Harvesting') {
//           continue;
//         }

//         const activityKey = `${activity.type}-${activity.daysAfter}-${activity.description}`;
//         if (savedActivityKeys.has(activityKey)) {
//           console.log('⏩ Skipping duplicate calculated activity:', activityKey);
//           continue;
//         }

//         // Check for user-selected chemicals
//         let chemicalUsed = null;
        
//         if (activity.type === 'Fertilization') {
//           const fertIndex = fertilizerDates.findIndex(f => 
//             f.daysAfter === activity.daysAfter
//           );
//           if (fertIndex !== -1 && confirmedFertilizers[fertIndex]) {
//             chemicalUsed = selectedFertilizerNames[fertIndex];
//           }
//         } else if (activity.type === 'Pest Control') {
//           const pestIndex = pesticideDates.findIndex(p => 
//             p.daysAfter === activity.daysAfter
//           );
//           if (pestIndex !== -1 && confirmedPesticides[pestIndex]) {
//             chemicalUsed = selectedPesticideNames[pestIndex];
//           }
//         }

//         // ✅ Map new activity types to old names (for backend filter compatibility)
//         const activityTypeMapping = {
//           'Land Preparation': 'Plowing',
//           'Pest Control': 'Spraying',
//         };
//         const mappedActivityType = activityTypeMapping[activity.type] || activity.type;

//         const activityData = {
//           crop_history_id: currentRealCropId,
//           activity_date: formatDateForBackend(activity.date),
//           activity_type: mappedActivityType,
//           description: activity.description,
//           chemical_or_fertilizer_used: chemicalUsed,
//           remarks: `Scheduled: ${activity.rangeText} (${activity.daysRangeText})`,
//           is_public: false
//         };
        
//         console.log('💾 Saving calculated activity:', activityData);
//         const result = await farmerAPI.addCropActivity(activityData);
        
//         if (result.success) {
//           console.log('✅ Calculated activity saved:', result.activity_id);
//           savedCount++;
//           savedActivityKeys.add(activityKey);
//         } else {
//           console.log('❌ Failed to save calculated activity:', result.message);
//         }
//       }
//     }

//     console.log(`🎯 TOTAL UNIQUE Activities Saved: ${savedCount}`);
//     return savedCount;
    
//   } catch (error) {
//     console.error('❌ Error saving activities:', error);
//     return 0;
//   }
// };

// // ✅ Urdu to English crop name mapping (from backend)
// const URDU_TO_ENGLISH_CROP = {
//   'گندم': 'WHEAT',
//   'مکئی': 'MAIZE',
//   'چاول': 'RICE',
//   'دھان': 'RICE',
//   'گنا': 'SUGARCANE',
//   'کپاس': 'COTTON',
//   'جو': 'BARLEY',
//   'مونگ پھلی': 'PEANUT',
//   'چنے': 'CHICKPEAS',
//   'سورج مکھی': 'SUNFLOWER',
//   'باجرا': 'BAJRA',
//   'باجرہ': 'BAJRA',
//   'جوار': 'SORGHUM',
//   'تمباکو': 'TOBACCO',
//   'تل': 'SESAMUM',
//   'سرسوں': 'MUSTARD',
// };

// // ✅ Convert crop name to English for backend lookup
// const convertCropNameToEnglish = (cropName) => {
//   if (!cropName) return '';
  
//   // Check if it's already English
//   const upperName = cropName.toUpperCase();
//   if (['WHEAT', 'MAIZE', 'RICE', 'SUGARCANE', 'COTTON', 'BARLEY', 'PEANUT', 'CHICKPEAS', 'SUNFLOWER', 'BAJRA', 'SORGHUM', 'TOBACCO', 'SESAMUM', 'MUSTARD'].includes(upperName)) {
//     return upperName;
//   }
  
//   // Check Urdu mapping
//   const englishName = URDU_TO_ENGLISH_CROP[cropName];
//   if (englishName) {
//     console.log('🔄 Converted Urdu to English:', cropName, '→', englishName);
//     return englishName;
//   }
  
//   // Return uppercase as fallback
//   return upperName;
// };

// // ✅ Backend sy crop timing check karo
// const checkCropTimingFromBackend = async (selectedCropName, cityName) => {
//   try {
//     console.log('🔄 Checking crop timing from backend for:', selectedCropName, 'in', cityName);
    
//     const response = await adminAPI.getCropSchedules();
//     console.log('📡 Backend response:', response ? 'Got data' : 'No data');
    
//     if (!response || !response.success || !response.schedules) {
//       console.log('❌ Failed to get crop schedules from backend');
//       // ✅ Return basic alert even if backend fails
//       return {
//         alertMessage: `📋 ${selectedCropName} select ho gaya!\n\nBackend sy schedule nahi mil saka. Apni marzi sy dates set karein.`,
//         sowingWindow: '',
//         cropSchedule: null
//       };
//     }
    
//     const schedules = response.schedules;
//     console.log('📋 Available crops in backend:', Object.keys(schedules).join(', '));
    
//     // ✅ Convert Urdu crop name to English
//     const cropNameEnglish = convertCropNameToEnglish(selectedCropName);
//     console.log('🔄 Looking for crop:', selectedCropName, '→', cropNameEnglish);
    
//     const cropSchedule = schedules[cropNameEnglish];
    
//     if (!cropSchedule) {
//       console.log('❌ No schedule found for crop:', selectedCropName, '(tried:', cropNameEnglish, ')');
//       // ✅ Show alert that crop schedule not found
//       return {
//         alertMessage: `📋 ${selectedCropName} select ho gaya!\n\n⚠️ Is crop ka schedule backend mein nahi mila.\nAvailable crops: ${Object.keys(schedules).slice(0, 5).join(', ')}...`,
//         sowingWindow: '',
//         cropSchedule: null
//       };
//     }
    
//     console.log('✅ Found crop schedule for:', cropNameEnglish);
    
//     // ✅ Current date info
//     const today = new Date();
//     const currentMonth = today.getMonth() + 1;
//     const currentDay = today.getDate();
    
//     // ✅ Check region-specific sowing time
//     const cityLower = cityName ? cityName.toLowerCase().trim() : '';
//     console.log('🏙️ Looking for city:', cityLower);
//     console.log('🏙️ Available regions:', cropSchedule.regions ? Object.keys(cropSchedule.regions).join(', ') : 'No regions');
    
//     const regionData = cropSchedule.regions ? cropSchedule.regions[cityLower] : null;
    
//     let alertMessage = '';
//     let sowingWindow = '';
//     let recommendedSeason = '';
    
//     // ✅ Agar region nahi mila tou general info dikhao
//     if (!regionData || !regionData.sowing) {
//       console.log('⚠️ No region data found for city:', cityLower);
      
//       // Try to get any region's data as fallback
//       const availableRegions = cropSchedule.regions ? Object.keys(cropSchedule.regions) : [];
//       if (availableRegions.length > 0) {
//         const firstRegion = availableRegions[0];
//         const fallbackData = cropSchedule.regions[firstRegion];
        
//         alertMessage = `📋 ${selectedCropName} ki timing info:\n\n` +
//                        `⚠️ "${cityName}" ki specific info nahi mili.\n\n` +
//                        `${firstRegion.charAt(0).toUpperCase() + firstRegion.slice(1)} ke liye:\n` +
//                        `📅 Sowing: ${fallbackData.sowing || 'N/A'}\n` +
//                        `🌾 Harvest: ${fallbackData.harvest || 'N/A'}\n\n` +
//                        `Available regions: ${availableRegions.join(', ')}`;
        
//         return {
//           alertMessage: alertMessage,
//           sowingWindow: fallbackData.sowing || '',
//           cropSchedule: cropSchedule
//         };
//       }
      
//       return {
//         alertMessage: `📋 ${selectedCropName} select ho gaya!\n\nRegion data available nahi hai.`,
//         sowingWindow: '',
//         cropSchedule: cropSchedule
//       };
//     }
    
//     // ✅ Region data mil gaya
//     console.log('✅ Found region data for:', cityLower);
//     console.log('📋 Region fertilizer:', regionData.fertilizer);
//     console.log('📋 Region pesticide:', regionData.pesticide);
//     console.log('📋 Region harvest:', regionData.harvest);
    
//     sowingWindow = regionData.sowing;
    
//     // ✅ Parse sowing window (e.g., "25 Oct – 15 Nov")
//     const timingInfo = parseSowingWindow(sowingWindow, currentMonth, currentDay);
    
//     // ✅ Backend sy sowing window ka season detect karo
//     const cropSeason = detectSeasonFromSowingWindow(sowingWindow);
    
//     if (timingInfo.status === 'early') {
//       alertMessage = `⚠️ Ap ${timingInfo.daysEarly} din JALDI laga rahy hain!\n\n` +
//                      `${selectedCropName} ki ${cityName} mein sowing window:\n` +
//                      `📅 ${sowingWindow}\n` +
//                      `🌾 Season: ${cropSeason}\n\n` +
//                      `${regionData.harvest ? 'Harvest: ' + regionData.harvest : ''}`;
//     } else if (timingInfo.status === 'late') {
//       alertMessage = `⚠️ Ap ${timingInfo.daysLate} din LATE laga rahy hain!\n\n` +
//                      `${selectedCropName} ki ${cityName} mein sowing window:\n` +
//                      `📅 ${sowingWindow}\n` +
//                      `🌾 Season: ${cropSeason}\n\n` +
//                      `${regionData.harvest ? 'Harvest: ' + regionData.harvest : ''}`;
//     } else {
//       alertMessage = `✅ Sahi waqt hai!\n\n` +
//                      `${selectedCropName} ki ${cityName} mein sowing window:\n` +
//                      `📅 ${sowingWindow}\n` +
//                      `🌾 Season: ${cropSeason}`;
//     }
    
//     return {
//       alertMessage: alertMessage,
//       sowingWindow: sowingWindow,
//       cropSchedule: cropSchedule,
//       // ✅ NEW: Region-specific ranges
//       regionData: {
//         fertilizer: regionData.fertilizer || '',
//         pesticide: regionData.pesticide || '',
//         harvest: regionData.harvest || ''
//       }
//     };
    
//   } catch (error) {
//     console.error('❌ Error checking crop timing:', error);
//     return null;
//   }
// };

// // ✅ Backend ki sowing window sy season detect karo (no hardcoding)
// const detectSeasonFromSowingWindow = (sowingWindow) => {
//   try {
//     if (!sowingWindow || sowingWindow === 'Not major' || sowingWindow === 'Not common') {
//       return 'Unknown';
//     }
    
//     const monthMap = {
//       'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
//       'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
//     };
    
//     // Parse start month from sowing window
//     const parts = sowingWindow.split('–').map(s => s.trim());
//     if (parts.length < 1) return 'Unknown';
    
//     const startParts = parts[0].split(' ');
//     if (startParts.length < 2) return 'Unknown';
    
//     const startMonthStr = startParts[1] || startParts[0];
//     const startMonth = monthMap[startMonthStr.toLowerCase().substring(0, 3)];
    
//     if (!startMonth) return 'Unknown';
    
//     // ✅ Season detect from sowing month (from backend data)
//     // Rabi: Oct, Nov, Dec, Jan, Feb, Mar (months 10-12, 1-3)
//     // Kharif: Apr, May, Jun, Jul, Aug, Sep (months 4-9)
//     if (startMonth >= 10 || startMonth <= 3) {
//       return 'Rabi (Oct-Mar)';
//     } else {
//       return 'Kharif (Apr-Sep)';
//     }
//   } catch (error) {
//     console.log('Error detecting season:', error);
//     return 'Unknown';
//   }
// };

// // ✅ Sowing window parse karo
// const parseSowingWindow = (sowingWindow, currentMonth, currentDay) => {
//   try {
//     // Format: "25 Oct – 15 Nov" or "15 Jun – 15 Jul"
//     const monthMap = {
//       'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
//       'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
//     };
    
//     const parts = sowingWindow.split('–').map(s => s.trim());
//     if (parts.length !== 2) return { status: 'unknown' };
    
//     // Parse start date
//     const startParts = parts[0].split(' ');
//     const startDay = parseInt(startParts[0]);
//     const startMonth = monthMap[startParts[1].toLowerCase().substring(0, 3)];
    
//     // Parse end date
//     const endParts = parts[1].split(' ');
//     const endDay = parseInt(endParts[0]);
//     const endMonth = monthMap[endParts[1].toLowerCase().substring(0, 3)];
    
//     if (!startMonth || !endMonth) return { status: 'unknown' };
    
//     // ✅ Compare with current date
//     const currentDate = new Date(2024, currentMonth - 1, currentDay);
//     const startDate = new Date(2024, startMonth - 1, startDay);
//     const endDate = new Date(2024, endMonth - 1, endDay);
    
//     // Handle year wrap (e.g., Oct - Mar)
//     if (endMonth < startMonth) {
//       if (currentMonth <= endMonth) {
//         // We're in the next year part
//         currentDate.setFullYear(2025);
//         endDate.setFullYear(2025);
//       }
//     }
    
//     if (currentDate < startDate) {
//       const diffDays = Math.ceil((startDate - currentDate) / (1000 * 60 * 60 * 24));
//       return { status: 'early', daysEarly: diffDays };
//     } else if (currentDate > endDate) {
//       const diffDays = Math.ceil((currentDate - endDate) / (1000 * 60 * 60 * 24));
//       return { status: 'late', daysLate: diffDays };
//     } else {
//       return { status: 'ontime' };
//     }
    
//   } catch (error) {
//     console.log('Error parsing sowing window:', error);
//     return { status: 'unknown' };
//   }
// };

// // ✅ Create new crop entry in database
// const createNewCropEntry = async (selectedCropName) => {
//   console.log('🌱 createNewCropEntry called with:', selectedCropName);
  
//   if (!selectedLand) {
//     Alert.alert('Error', 'Please select a land first');
//     return;
//   }

//   setCreatingCrop(true);
  
//   // ✅ BACKEND SY CROP TIMING CHECK KARO
//   const cityName = selectedLand.city || '';
//   console.log('🏙️ City name:', cityName);
  
//   let timingInfo = null;
  
//   try {
//     timingInfo = await checkCropTimingFromBackend(selectedCropName, cityName);
//     console.log('📋 Timing info received:', timingInfo ? 'Yes' : 'No');
//   } catch (error) {
//     console.log('❌ Error in checkCropTimingFromBackend:', error);
//   }
  
//   // ✅ HAMESHA ALERT DIKHAO - chahe timing info ho ya na ho
//   const alertTitle = `📋 ${selectedCropName}`;
//   const alertMsg = timingInfo && timingInfo.alertMessage 
//     ? timingInfo.alertMessage 
//     : `${selectedCropName} select kiya gaya.\n\nAp crop laga sakty hain.`;
  
//   console.log('🔔 Showing alert:', alertTitle);
  
//   Alert.alert(
//     alertTitle,
//     alertMsg,
//     [
//       {
//         text: 'Cancel',
//         style: 'cancel',
//         onPress: () => {
//           console.log('❌ User cancelled');
//           setCreatingCrop(false);
//         }
//       },
//       {
//         text: 'Lagao',
//         onPress: async () => {
//           console.log('✅ User confirmed, proceeding...');
//           await proceedWithCropCreation(selectedCropName, timingInfo);
//         }
//       }
//     ]
//   );
// };

// // ✅ Crop creation proceed karo
// const proceedWithCropCreation = async (selectedCropName, timingInfo) => {
//   try {
//     const realCropHistoryId = await createRealCropEntry(selectedCropName);
    
//     if (!realCropHistoryId) {
//       Alert.alert('Error', 'Failed to create crop entry in database');
//       setCreatingCrop(false);
//       return;
//     }

//     setCurrentRealCropId(realCropHistoryId);
//     setCropName(selectedCropName);
    
//     // ✅ Save crop schedule data from timing info
//     if (timingInfo && timingInfo.cropSchedule) {
//       setCropScheduleData(timingInfo.cropSchedule);
      
//       // ✅ Parse sowing date range
//       if (timingInfo.sowingWindow) {
//         const parsedRange = parseDateRangeFromBackend(timingInfo.sowingWindow);
//         setSowingDateRange(parsedRange);
//         console.log('📅 Sowing range set:', parsedRange);
//       }
      
//       // ✅ Save region-specific range texts
//       if (timingInfo.regionData) {
//         setFertilizerRangeText(timingInfo.regionData.fertilizer || '');
//         setPesticideRangeText(timingInfo.regionData.pesticide || '');
//         setHarvestRangeText(timingInfo.regionData.harvest || '');
//         console.log('🌾 Fertilizer range:', timingInfo.regionData.fertilizer);
//         console.log('🐛 Pesticide range:', timingInfo.regionData.pesticide);
//         console.log('📅 Harvest range:', timingInfo.regionData.harvest);
//       }
//     }
    
//     // ✅ Load admin proposed dates for the new crop
//     await loadAdminProposedDates(selectedCropName, timingInfo);
    
//     Alert.alert('Success!', `${selectedCropName} created successfully!\n\nAb sowing date select karein.`);
//   } catch (error) {
//     console.error('Error:', error);
//     Alert.alert('Error', 'Failed to create crop');
//   } finally {
//     setCreatingCrop(false);
//   }
// };

// // ✅ Parse date range from backend string (e.g., "25 Oct – 15 Nov")
// const parseDateRangeFromBackend = (rangeText) => {
//   try {
//     if (!rangeText || rangeText === 'Not major' || rangeText === 'Not common') {
//       return null;
//     }
    
//     const monthMap = {
//       'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
//       'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
//     };
    
//     const parts = rangeText.split('–').map(s => s.trim());
//     if (parts.length !== 2) return { text: rangeText, start: null, end: null };
    
//     // Parse start date
//     const startParts = parts[0].split(' ');
//     const startDay = parseInt(startParts[0]);
//     const startMonthStr = startParts[1] || '';
//     const startMonth = monthMap[startMonthStr.toLowerCase().substring(0, 3)];
    
//     // Parse end date
//     const endParts = parts[1].split(' ');
//     const endDay = parseInt(endParts[0]);
//     const endMonthStr = endParts[1] || '';
//     const endMonth = monthMap[endMonthStr.toLowerCase().substring(0, 3)];
    
//     if (startMonth === undefined || endMonth === undefined) {
//       return { text: rangeText, start: null, end: null };
//     }
    
//     const currentYear = new Date().getFullYear();
//     let startDate = new Date(currentYear, startMonth, startDay);
//     let endDate = new Date(currentYear, endMonth, endDay);
    
//     // Handle year wrap (e.g., Oct - Mar spans two years)
//     if (endMonth < startMonth) {
//       endDate = new Date(currentYear + 1, endMonth, endDay);
//     }
    
//     return {
//       text: rangeText,
//       start: startDate,
//       end: endDate
//     };
//   } catch (error) {
//     console.log('Error parsing date range:', error);
//     return { text: rangeText, start: null, end: null };
//   }
// };

// // ✅ Calculate all activity dates from sowing date - WITH RANGES
// const calculateActivityDates = (selectedSowingDate) => {
//   if (!selectedSowingDate || !cropScheduleData || !cropScheduleData.activities) {
//     return;
//   }
  
//   console.log('🔄 Calculating activity dates from sowing:', selectedSowingDate);
  
//   const activities = cropScheduleData.activities;
//   const calculatedDates = [];
  
//   // ✅ Range buffer - ±5 days for flexibility
//   const RANGE_BUFFER = 5;
  
//   activities.forEach(activity => {
//     const activityDate = new Date(selectedSowingDate);
//     activityDate.setDate(activityDate.getDate() + activity.days_after);
    
//     // ✅ Calculate range (start and end dates)
//     const rangeStart = new Date(selectedSowingDate);
//     rangeStart.setDate(rangeStart.getDate() + Math.max(0, activity.days_after - RANGE_BUFFER));
    
//     const rangeEnd = new Date(selectedSowingDate);
//     rangeEnd.setDate(rangeEnd.getDate() + activity.days_after + RANGE_BUFFER);
    
//     calculatedDates.push({
//       type: activity.type,
//       description: activity.desc,
//       daysAfter: activity.days_after,
//       date: activityDate,
//       dateText: activityDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
//       // ✅ NEW: Range info
//       rangeStart: rangeStart,
//       rangeEnd: rangeEnd,
//       rangeStartText: rangeStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
//       rangeEndText: rangeEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
//       rangeText: `${rangeStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${rangeEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
//       daysRangeText: `${Math.max(0, activity.days_after - RANGE_BUFFER)}–${activity.days_after + RANGE_BUFFER} DAS`
//     });
//   });
  
//   setCalculatedActivities(calculatedDates);
  
//   // ✅ Find and set fertilizer dates
//   const fertDates = calculatedDates.filter(a => a.type === 'Fertilization');
//   setFertilizerDates(fertDates);
  
//   // ✅ Find and set pesticide dates
//   const pestDates = calculatedDates.filter(a => a.type === 'Pest Control');
//   setPesticideDates(pestDates);
  
//   // ✅ Find and set harvest date
//   const harvestActivity = calculatedDates.find(a => a.type === 'Harvesting');
//   if (harvestActivity) {
//     setHarvestDate(harvestActivity.date);
//   }
  
//   console.log('✅ Calculated activities with ranges:', calculatedDates.length);
// };

// // ✅ Create real crop entry in database
// // ✅ CORRECTED: Create real crop entry in database
// const createRealCropEntry = async (selectedCropName) => {
//   try {
//     if (!selectedLand || !selectedCropName) return null;

//     const landId = selectedLand.land_id || selectedLand.id;
//     const currentMonth = new Date().getMonth() + 1;
//     const autoSeason = (currentMonth >= 10 || currentMonth <= 3) ? 'Rabi' : 'Kharif';
    
//     // ✅ Format dates properly
//     const sowingDateFormatted = sowingDate ? formatDateForBackend(sowingDate) : formatDateForBackend(new Date());
//     const harvestDateFormatted = harvestDate ? formatDateForBackend(harvestDate) : formatDateForBackend(new Date(Date.now() + 120 * 24 * 60 * 60 * 1000));
    
//     const cropData = {
//       land_id: landId,
//       crop_name: selectedCropName,
//       season: season || autoSeason,
//       yield_per_40kg: yieldPer40kg ? parseFloat(yieldPer40kg) : null,
//       sowing_date: sowingDateFormatted,
//       harvest_date: harvestDateFormatted,
//       fertilizer_used: null,
//       pesticide_used: null
//     };

//     console.log('🔄 Creating crop with data:', cropData);

//     let response;
    
//     // ✅ Use your existing API methods
//     if (selectedLand.status === 'empty') {
//       response = await farmerAPI.addCropToEmptyLand(farmerId, cropData);
//     } else {
//       response = await farmerAPI.addCropToLand(farmerId, landId, cropData);
//     }
    
//     console.log('📡 API Response:', response);
    
//     if (response.success && response.crop_history_id) {
//       console.log('✅ Crop created successfully with ID:', response.crop_history_id);
//       return response.crop_history_id;
//     } else {
//       Alert.alert('Error', response.message || 'Failed to create crop');
//       return null;
//     }
//   } catch (error) {
//     console.error('❌ Error creating crop:', error);
//     Alert.alert('Error', 'Failed to create crop in database');
//     return null;
//   }
// };

// // ✅ Load admin proposed dates - BACKEND SY DATA LEGA
// const loadAdminProposedDates = async (cropNameParam, timingInfo = null) => {
//   try {
//     console.log('🔄 Loading dates from backend for:', cropNameParam);
    
//     let duration = 120; // Default
    
//     // ✅ Agar timingInfo hai tou us sy duration nikalo
//     if (timingInfo && timingInfo.cropSchedule && timingInfo.cropSchedule.activities) {
//       const activities = timingInfo.cropSchedule.activities;
//       const harvestActivity = activities.find(a => a.type === 'Harvesting');
//       if (harvestActivity && harvestActivity.days_after) {
//         duration = harvestActivity.days_after;
//         console.log('✅ Duration from backend:', duration, 'days');
//       }
//     } else {
//       // ✅ Backend sy fresh data lo
//       try {
//         const response = await adminAPI.getCropSchedules();
//         if (response.success && response.schedules) {
//           const cropNameUpper = cropNameParam.toUpperCase();
//           const cropSchedule = response.schedules[cropNameUpper];
          
//           if (cropSchedule && cropSchedule.activities) {
//             const harvestActivity = cropSchedule.activities.find(a => a.type === 'Harvesting');
//             if (harvestActivity && harvestActivity.days_after) {
//               duration = harvestActivity.days_after;
//               console.log('✅ Duration from backend API:', duration, 'days');
//             }
//           }
//         }
//       } catch (apiError) {
//         console.log('❌ Could not fetch from backend, using default:', apiError);
//       }
//     }
    
//     const sowingDateNew = new Date();
//     const harvestDateNew = new Date(sowingDateNew);
//     harvestDateNew.setDate(sowingDateNew.getDate() + duration);
    
//     // ✅ Set dates
//     setAdminProposedSowingDate(sowingDateNew);
//     setAdminProposedHarvestDate(harvestDateNew);
//     setSowingDate(sowingDateNew);
//     setHarvestDate(harvestDateNew);
    
//     console.log(`✅ ${cropNameParam}: ${duration} days (from backend)`);
//     console.log('📅 Sowing:', sowingDateNew.toLocaleDateString());
//     console.log('🌾 Harvest:', harvestDateNew.toLocaleDateString());
    
//   } catch (error) {
//     console.error('❌ Error:', error);
//     // Simple fallback
//     const sowingDateFallback = new Date();
//     const harvestDateFallback = new Date();
//     harvestDateFallback.setDate(sowingDateFallback.getDate() + 120);
    
//     setSowingDate(sowingDateFallback);
//     setHarvestDate(harvestDateFallback);
//   }
// };
// return (
//   <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.sectionTitle}>Crop Information</Text>

//         {/* ✅ Land Selection Section - YEH ADD KARO */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Select Land *</Text>
          
//           {landsLoading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="small" color="#2E7D32" />
//               <Text style={styles.loadingText}>Loading lands from database...</Text>
//             </View>
//           ) : farmerLands.length > 0 ? (
//             <View style={styles.landsListContainer}>
//               <View style={styles.landsHeader}>
//                 <Text style={styles.landsListTitle}>Your Lands ({farmerLands.length})</Text>
//                 <TouchableOpacity style={styles.addLandButton} onPress={handleAddNewLand}>
//                   <Icon name="add" size={16} color="white" />
//                   <Text style={styles.addLandButtonText}>New Land</Text>
//                 </TouchableOpacity>
//               </View>

//               {emptyLands.length > 0 && (
//                 <View style={styles.landsSection}>
//                   <Text style={styles.landsSectionTitle}>✅ Empty Lands ({emptyLands.length})</Text>
//                   {emptyLands.map((land) => {
//                     const landId = land.land_id || land.id;
//                     return (
//                       <TouchableOpacity
//                         key={landId}
//                         style={[
//                           styles.landOption,
//                           selectedLand && (selectedLand.land_id === landId) && styles.landOptionSelected,
//                           styles.emptyLandOption
//                         ]}
//                         onPress={() => handleLandSelect(land)}
//                       >
//                         <Text style={styles.landOptionText}>{land.city} - {land.area} - {land.zone}</Text>
//                         <Text style={styles.landOptionSubtext}>
//                           {land.area_size} {land.area_unit} • {land.soil_type}
//                         </Text>
//                         {selectedLand && (selectedLand.land_id === landId) && (
//                           <Text style={styles.selectedBadge}>✓ SELECTED</Text>
//                         )}
//                         <Text style={styles.emptyBadge}>EMPTY</Text>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>
//               )}

//               {landsWithCrops.length > 0 && (
//                 <View style={styles.landsSection}>
//                   <Text style={styles.landsSectionTitle}>🌾 Occupied Lands ({landsWithCrops.length})</Text>
//                   {landsWithCrops.map((land) => {
//                     const landId = land.land_id || land.id;
//                     return (
//                       <TouchableOpacity
//                         key={landId}
//                         style={[
//                           styles.landOption,
//                           selectedLand && (selectedLand.land_id === landId) && styles.landOptionSelected,
//                           styles.occupiedLandOption
//                         ]}
//                         onPress={() => handleLandSelect(land)}
//                       >
//                         <Text style={styles.landOptionText}>{land.city} - {land.area} - {land.zone}</Text>
//                         <Text style={styles.landOptionSubtext}>
//                           {land.area_size} {land.area_unit} • {land.soil_type}
//                         </Text>
//                         <Text style={styles.landOptionSubtext}>
//                           Current Crop: {land.current_crop || 'N/A'}
//                         </Text>
//                         {selectedLand && (selectedLand.land_id === landId) && (
//                           <Text style={styles.selectedBadge}>✓ SELECTED</Text>
//                         )}
//                         <Text style={styles.occupiedBadge}>OCCUPIED</Text>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>
//               )}
//             </View>
//           ) : (
//             <View style={styles.noLandsContainer}>
//               <Text style={styles.noLandsText}>No lands found in database</Text>
//               <TouchableOpacity style={styles.addLandButtonLarge} onPress={handleAddNewLand}>
//                 <Icon name="add" size={20} color="white" />
//                 <Text style={styles.addLandButtonText}>Add Your First Land</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* ✅ Crop Name Section - FIXED: Textfield ma hi crop dikhay */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Crop Name *</Text>
//           <TouchableOpacity
//             style={[
//               styles.dropdownButton,
//               cropName && styles.dropdownButtonSelected,
//               (!selectedLand || creatingCrop || cropsLoading) && styles.dropdownButtonDisabled
//             ]}
//             onPress={() => {
//               console.log('🌾 Crop dropdown button pressed');
//               console.log('selectedLand:', selectedLand);
//               console.log('creatingCrop:', creatingCrop);
//               console.log('cropsLoading:', cropsLoading);
              
//               if (!selectedLand) {
//                 Alert.alert('⚠️ Land Select Karein', 'Pehle land select karein, phir crop select kar sakty hain.');
//                 return;
//               }
//               if (creatingCrop) {
//                 Alert.alert('⏳ Wait', 'Crop create ho rahi hai...');
//                 return;
//               }
//               if (cropsLoading) {
//                 Alert.alert('⏳ Wait', 'Crops load ho rahi hain...');
//                 return;
//               }
              
//               setShowCropDropdown(true);
//             }}
//             activeOpacity={0.7}
//           >
//             <Text style={[
//               styles.dropdownText, 
//               !cropName && { color: '#999' },
//               cropName && { color: '#2E7D32', fontWeight: 'bold' }
//             ]}>
//               {!selectedLand ? '⚠️ Pehle Land Select Karein' : 
//                creatingCrop ? '⏳ Creating Crop...' : 
//                cropsLoading ? '⏳ Loading crops...' : 
//                cropName ? `✅ ${cropName}` : 'Select Crop'}
//             </Text>
//             <Icon name="arrow-drop-down" size={20} color={cropName ? '#2E7D32' : '#666'} />
//           </TouchableOpacity>
          
//           {/* Crop ID info neechy show karo */}
         
//         </View>

//         {/* ✅ MISSING SECTIONS - YEH ADD KARO */}

//         {/* Season Section */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Season</Text>
//           <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowSeasonDropdown(true)}>
//             <Text style={[styles.dropdownText, !season && { color: '#999' }]}>
//               {season || 'Select Season'}
//             </Text>
//             <Icon name="arrow-drop-down" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>

        
// <View style={styles.inputContainer}>
//   <Text style={styles.label}>Sowing Date *</Text>
  
//   {/* ✅ Show Sowing Date Range from Backend */}
//   {sowingDateRange && sowingDateRange.text && (
//     <View style={styles.dateRangeContainer}>
//       <Text style={styles.dateRangeLabel}>Recommended Sowing Window:</Text>
//       <View style={styles.dateRangeBox}>
//         <Text style={styles.dateRangeText}>{sowingDateRange.text}</Text>
//         <Text style={styles.dateRangeSubtext}>Aap koi bhi date select kar sakte hain</Text>
//       </View>
//     </View>
//   )}

//   {/* Selected Sowing Date - SIMPLE TEXT */}
//   <View style={styles.dateSection}>
//     <Text style={styles.dateLabel}>Selected Sowing Date:</Text>
//     <TouchableOpacity 
//       style={[styles.dateInputButton, sowingDate && styles.dateInputButtonSelected]} 
//       onPress={() => setShowSowingPicker(true)}
//     >
//       <Text style={[styles.dateInputText, sowingDate ? { color: '#2E7D32', fontWeight: 'bold' } : { color: '#999' }]}>
//         {sowingDate ? sowingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select Sowing Date'}
//       </Text>
//       <Icon name="calendar-today" size={20} color={sowingDate ? '#2E7D32' : '#666'} />
//     </TouchableOpacity>
//   </View>
// </View>

// {showSowingPicker && (
//   <DateTimePicker
//     value={sowingDate || new Date()}
//     mode="date"
//     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//     onChange={(event, selectedDate) => {
//       setShowSowingPicker(false);
//       if (selectedDate) {
//         const localDate = new Date(selectedDate);
//         localDate.setHours(12, 0, 0, 0);
//         setSowingDate(localDate);
//         calculateActivityDates(localDate);
//       }
//     }}
//   />
// )}
//         {/* ✅ Fertilizer Schedule - Range + Clickable Dates */}
//         {(fertilizerRangeText || fertilizerDates.length > 0) && (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>🌾 Fertilizer Schedule</Text>
            
//             {/* Recommended Range from Backend */}
//             {fertilizerRangeText && (
//               <View style={styles.rangeInfoBox}>
//                 <Text style={styles.rangeInfoLabel}>📋 Recommended (Backend sy):</Text>
//                 <Text style={styles.rangeInfoText}>{fertilizerRangeText}</Text>
//               </View>
//             )}
            
//             {/* Clickable Date Ranges - Navigate to FertilizerInputPage */}
//             {sowingDate && fertilizerDates.length > 0 && (
//               <View style={styles.calculatedDatesContainer}>
//                 <Text style={styles.calculatedDatesLabel}>📅 Apki Sowing Date ({sowingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}) ky hisab sy:</Text>
//                 {fertilizerDates.map((fert, index) => (
//                   <TouchableOpacity 
//                     key={index} 
//                     style={[
//                       styles.activityDateBoxClickable,
//                       confirmedFertilizers[index] && styles.activityDateBoxConfirmed
//                     ]}
//                     onPress={() => {
//                       console.log('🌾 Navigating to FertilizerInputPage for:', fert);
//                       // ✅ Extract recommended fertilizer name from description
//                       let recommendedFert = '';
//                       if (fert.description) {
//                         if (fert.description.toLowerCase().includes('urea')) recommendedFert = 'Urea';
//                         else if (fert.description.toLowerCase().includes('dap')) recommendedFert = 'DAP';
//                         else if (fert.description.toLowerCase().includes('npk')) recommendedFert = 'NPK';
//                         else if (fert.description.toLowerCase().includes('potash')) recommendedFert = 'Potash';
//                         else recommendedFert = 'Urea'; // Default
//                       }
                      
//                       navigation.navigate('FertilizerInputPage', {
//                         cropName: cropName,
//                         cropHistoryId: currentRealCropId,
//                         scheduledDate: fert.date.toISOString(),
//                         rangeStart: fert.rangeStart.toISOString(),
//                         rangeEnd: fert.rangeEnd.toISOString(),
//                         activityType: fert.type,
//                         description: fert.description,
//                         fertilizerNumber: index + 1,
//                         fertilizerIndex: index,
//                         recommendedFertilizer: selectedFertilizerNames[index] || recommendedFert,
//                         returnScreen: 'CropInputPage'
//                       });
//                     }}
//                   >
//                     {/* ✅ Show SELECTED badge (not saved yet, just selected) */}
//                     {confirmedFertilizers[index] && (
//                       <View style={styles.confirmedBadge}>
//                         <Text style={styles.confirmedBadgeText}>✅ Selected</Text>
//                       </View>
//                     )}
                    
//                     <View style={styles.activityDateHeader}>
//                       <Text style={[
//                         styles.activityDateTitle,
//                         confirmedFertilizers[index] && styles.activityDateTitleConfirmed
//                       ]}>
//                         {index === 0 ? '1st Fertilizer' : `${index + 1}${index === 1 ? 'nd' : 'rd'} Fertilizer`}
//                       </Text>
//                       <Text style={styles.activityDaysAfter}>{fert.daysRangeText}</Text>
//                     </View>
//                     {/* ✅ Show Date RANGE */}
//                     <View style={styles.dateRangeRow}>
//                       <Text style={styles.activityRangeText}>📅 {fert.rangeText}</Text>
//                     </View>
//                     <Text style={styles.activityDescription}>{fert.description}</Text>
                    
//                     {/* ✅ Show Selected Fertilizer if user selected one */}
//                     {selectedFertilizerNames[index] ? (
//                       <View style={[
//                         styles.selectedItemBadge,
//                         confirmedFertilizers[index] && styles.selectedItemBadgeConfirmed
//                       ]}>
//                         <Text style={styles.selectedItemText}>✅ {selectedFertilizerNames[index]}</Text>
//                       </View>
//                     ) : (
//                       <Text style={styles.clickToAddText}>👆 Tap to add fertilizer details</Text>
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>
//         )}

//         {/* ✅ Pesticide Schedule - Range + Clickable Dates */}
//         {(pesticideRangeText || pesticideDates.length > 0) && (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>🐛 Pesticide Schedule</Text>
            
//             {/* Recommended Range from Backend */}
//             {pesticideRangeText && (
//               <View style={styles.rangeInfoBoxPest}>
//                 <Text style={styles.rangeInfoLabel}>📋 Recommended (Backend sy):</Text>
//                 <Text style={styles.rangeInfoText}>{pesticideRangeText}</Text>
//               </View>
//             )}
            
//             {/* Clickable Date Ranges - Navigate to PesticideInputPage */}
//             {sowingDate && pesticideDates.length > 0 && (
//               <View style={styles.calculatedDatesContainer}>
//                 <Text style={styles.calculatedDatesLabel}>📅 Apki Sowing Date ({sowingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}) ky hisab sy:</Text>
//                 {pesticideDates.map((pest, index) => (
//                   <TouchableOpacity 
//                     key={index} 
//                     style={[
//                       styles.activityDateBoxPestClickable,
//                       confirmedPesticides[index] && styles.activityDateBoxPestConfirmed
//                     ]}
//                     onPress={() => {
//                       console.log('🐛 Navigating to PesticideInputPage for:', pest);
//                       // ✅ Extract recommended pesticide name from description
//                       let recommendedPest = '';
//                       if (pest.description) {
//                         if (pest.description.toLowerCase().includes('aphid')) recommendedPest = 'Imidacloprid';
//                         else if (pest.description.toLowerCase().includes('weed')) recommendedPest = 'Herbicide';
//                         else if (pest.description.toLowerCase().includes('fungus') || pest.description.toLowerCase().includes('rust')) recommendedPest = 'Fungicide';
//                         else if (pest.description.toLowerCase().includes('borer')) recommendedPest = 'Chlorpyrifos';
//                         else recommendedPest = 'Pesticide'; // Default
//                       }
                      
//                       navigation.navigate('PesticideInputPage', {
//                         cropName: cropName,
//                         cropHistoryId: currentRealCropId,
//                         scheduledDate: pest.date.toISOString(),
//                         rangeStart: pest.rangeStart.toISOString(),
//                         rangeEnd: pest.rangeEnd.toISOString(),
//                         activityType: pest.type,
//                         description: pest.description,
//                         pesticideNumber: index + 1,
//                         pesticideIndex: index,
//                         recommendedPesticide: selectedPesticideNames[index] || recommendedPest,
//                         returnScreen: 'CropInputPage'
//                       });
//                     }}
//                   >
//                     {/* ✅ Show SELECTED badge (not saved yet, just selected) */}
//                     {confirmedPesticides[index] && (
//                       <View style={styles.confirmedBadgePest}>
//                         <Text style={styles.confirmedBadgeTextPest}>✅ Selected</Text>
//                       </View>
//                     )}
                    
//                     <View style={styles.activityDateHeader}>
//                       <Text style={[
//                         styles.activityDateTitle,
//                         confirmedPesticides[index] && styles.activityDateTitleConfirmedPest
//                       ]}>
//                         {index === 0 ? '1st Pesticide' : `${index + 1}${index === 1 ? 'nd' : 'rd'} Pesticide`}
//                       </Text>
//                       <Text style={styles.activityDaysAfterPest}>{pest.daysRangeText}</Text>
//                     </View>
//                     {/* ✅ Show Date RANGE */}
//                     <View style={styles.dateRangeRow}>
//                       <Text style={styles.activityRangeTextPest}>📅 {pest.rangeText}</Text>
//                     </View>
//                     <Text style={styles.activityDescription}>{pest.description}</Text>
                    
//                     {/* ✅ Show Selected Pesticide if user selected one */}
//                     {selectedPesticideNames[index] ? (
//                       <View style={[
//                         styles.selectedItemBadgePest,
//                         confirmedPesticides[index] && styles.selectedItemBadgePestConfirmed
//                       ]}>
//                         <Text style={styles.selectedItemTextPest}>✅ {selectedPesticideNames[index]}</Text>
//                       </View>
//                     ) : (
//                       <Text style={styles.clickToAddTextPest}>👆 Tap to add pesticide details</Text>
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>
//         )}

//         {/* ✅ Harvest Date - Clickable Range */}
//         {(harvestRangeText || harvestDate) && (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>🌾 Harvest Schedule</Text>
            
//             {/* Clickable Recommended Range from Backend */}
//             {harvestRangeText && (
//               <TouchableOpacity 
//                 style={styles.rangeInfoBoxHarvestClickable}
//                 onPress={() => setShowHarvestPicker(true)}
//               >
//                 <Text style={styles.rangeInfoLabel}>📋 Recommended Harvest Window:</Text>
//                 <Text style={styles.harvestRangeText}>{harvestRangeText}</Text>
//                 <Text style={styles.clickToSelectText}>👆 Tap to select harvest date</Text>
//               </TouchableOpacity>
//             )}
            
//             {/* Selected/Calculated Harvest Date */}
//             {harvestDate && (
//               <TouchableOpacity 
//                 style={styles.harvestDateBoxClickable}
//                 onPress={() => setShowHarvestPicker(true)}
//               >
//                 <Text style={styles.calculatedDatesLabel}>📅 Selected Harvest Date:</Text>
//                 <Text style={styles.harvestDateText}>
//                   ✅ {harvestDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//                 </Text>
//                 {calculatedActivities.find(a => a.type === 'Harvesting') && (
//                   <Text style={styles.harvestDaysAfter}>
//                     +{calculatedActivities.find(a => a.type === 'Harvesting').daysAfter} days from sowing
//                   </Text>
//                 )}
//                 <Text style={styles.clickToChangeText}>👆 Tap to change date</Text>
//               </TouchableOpacity>
//             )}
            
//             {!harvestDate && !harvestRangeText && (
//               <Text style={styles.noDateText}>Sowing date select karo - harvest date calculate hogi</Text>
//             )}
//           </View>
//         )}
        
//         {showHarvestPicker && (
//           <DateTimePicker
//             value={harvestDate || new Date()}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={(event, selectedDate) => {
//               setShowHarvestPicker(false);
//               if (selectedDate) {
//                 const localDate = new Date(selectedDate);
//                 localDate.setHours(12, 0, 0, 0);
//                 setHarvestDate(localDate);
//               }
//             }}
//           />
//         )}

//         {/* Yield Section */}
//         {/* <View style={styles.inputContainer}>
//           <Text style={styles.label}>Yield (per 40kg)</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g., 10.5"
//             value={yieldPer40kg}
//             onChangeText={setYieldPer40kg}
//             keyboardType="numeric"
//             placeholderTextColor="#999"
//           />
//         </View> */}

//         {/* Submit Button */}
//         <TouchableOpacity
//           style={[styles.submitButton, (loading || !currentRealCropId) && styles.submitButtonDisabled]}
//           onPress={handleAddCrop}
//           disabled={loading || !currentRealCropId}
//         >
//           {loading ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text style={styles.submitButtonText}>
//               {!currentRealCropId ? 'Select Crop First' : 'Save Crop & Schedule'}
//             </Text>
//           )}
//         </TouchableOpacity>

//         {/* Add New Land Button */}
//         <TouchableOpacity style={styles.secondaryButton} onPress={handleAddNewLand}>
//           <Text style={styles.secondaryButtonText}>Add New Land to Database</Text>
//         </TouchableOpacity>

//         {/* ✅ Dropdown Modals */}
//         <DropdownModal
//           visible={showCropDropdown}
//           items={[
//             ...(locationBasedCrops.length > 0 ? [
//               { section: true, title: `🌱 Commonly Grown in ${selectedLand?.city || 'This Area'}` },
//               ...locationBasedCrops.map(crop => ({ name: crop, isLocationBased: true }))
//             ] : []),
//             ...(cropsList.length > 0 ? [
//               { section: true, title: '🌾 All Available Crops' },
//               ...cropsList
//             ] : [])
//           ]}
//           onSelect={handleCropSelect}
//           onClose={() => setShowCropDropdown(false)}
//           title={`Select Crop${selectedLand ? ` for ${selectedLand.city}` : ''}`}
//         />

//         <DropdownModal
//           visible={showSeasonDropdown}
//           items={seasons}
//           onSelect={handleSeasonSelect}
//           onClose={() => setShowSeasonDropdown(false)}
//           title="Select Season"
//         />
//       </ScrollView>
//     </SafeAreaView>
//   </KeyboardAvoidingView>
// );
// };

// // ✅ UPDATED Styles Section
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5' },
//   safeArea: { flex: 1 },
//   scrollContainer: { padding: 16 },
//   sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  
//   // ✅ Date range styles
//   dateRangeContainer: {
//     marginBottom: 12,
//     backgroundColor: '#FFF3E0',
//     padding: 12,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF9800',
//   },
//   dateRangeLabel: {
//     fontSize: 13,
//     fontWeight: 'bold',
//     color: '#E65100',
//     marginBottom: 6,
//   },
//   dateRangeBox: {
//     backgroundColor: '#FFE0B2',
//     padding: 10,
//     borderRadius: 6,
//   },
//   dateRangeText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#E65100',
//     textAlign: 'center',
//   },
//   dateRangeSubtext: {
//     fontSize: 11,
//     color: '#F57C00',
//     textAlign: 'center',
//     marginTop: 4,
//   },
//   dateInputButtonSelected: {
//     borderColor: '#2E7D32',
//     borderWidth: 2,
//     backgroundColor: '#E8F5E9',
//   },
  
//   // ✅ Activity date styles
//   activityDateBox: {
//     backgroundColor: '#E3F2FD',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#1976D2',
//   },
//   activityDateBoxClickable: {
//     backgroundColor: '#E3F2FD',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#1976D2',
//     borderWidth: 1,
//     borderColor: '#BBDEFB',
//   },
//   activityDateBoxPestClickable: {
//     backgroundColor: '#FFCDD2',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#D32F2F',
//     borderWidth: 1,
//     borderColor: '#EF9A9A',
//   },
  
//   // ✅ CONFIRMED (Applied) styles - Light gray background
//   activityDateBoxConfirmed: {
//     backgroundColor: '#E0E0E0',
//     borderLeftColor: '#9E9E9E',
//     borderColor: '#BDBDBD',
//   },
//   activityDateBoxPestConfirmed: {
//     backgroundColor: '#E0E0E0',
//     borderLeftColor: '#9E9E9E',
//     borderColor: '#BDBDBD',
//   },
//   activityDateTitleConfirmed: {
//     color: '#616161',
//   },
//   activityDateTitleConfirmedPest: {
//     color: '#616161',
//   },
//   confirmedBadge: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 12,
//     alignSelf: 'flex-end',
//     marginBottom: 8,
//   },
//   confirmedBadgeText: {
//     fontSize: 11,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   confirmedBadgePest: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 12,
//     alignSelf: 'flex-end',
//     marginBottom: 8,
//   },
//   confirmedBadgeTextPest: {
//     fontSize: 11,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   selectedItemBadgeConfirmed: {
//     backgroundColor: '#E0E0E0',
//     borderColor: '#9E9E9E',
//   },
//   selectedItemBadgePestConfirmed: {
//     backgroundColor: '#E0E0E0',
//     borderColor: '#9E9E9E',
//   },
  
//   clickToAddText: {
//     fontSize: 11,
//     color: '#1565C0',
//     marginTop: 6,
//     fontWeight: '500',
//   },
//   clickToAddTextPest: {
//     fontSize: 11,
//     color: '#C62828',
//     marginTop: 6,
//     fontWeight: '500',
//   },
//   rangeInfoModalSubtext: {
//   fontSize: 12,
//   color: '#F57C00',
//   textAlign: 'center',
//   marginTop: 4,
// },
// dateRangeSubtext: {
//   fontSize: 11,
//   color: '#F57C00',
//   textAlign: 'center',
//   marginTop: 4,
// },
//   // ✅ Selected item badge (for selected fertilizer/pesticide)
//   selectedItemBadge: {
//     backgroundColor: '#E8F5E9',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     marginTop: 8,
//     alignSelf: 'flex-start',
//     borderWidth: 1,
//     borderColor: '#4CAF50',
//   },
//   selectedItemText: {
//     fontSize: 13,
//     color: '#2E7D32',
//     fontWeight: 'bold',
//   },
//   selectedItemBadgePest: {
//     backgroundColor: '#FFEBEE',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     marginTop: 8,
//     alignSelf: 'flex-start',
//     borderWidth: 1,
//     borderColor: '#E57373',
//   },
//   selectedItemTextPest: {
//     fontSize: 13,
//     color: '#C62828',
//     fontWeight: 'bold',
//   },
//   // ✅ Date range row
//   dateRangeRow: {
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//     marginVertical: 4,
//   },
//   activityRangeText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#0D47A1',
//     textAlign: 'center',
//   },
//   activityRangeTextPest: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#B71C1C',
//     textAlign: 'center',
//   },
//   activityDaysAfterPest: {
//     fontSize: 12,
//     color: '#D32F2F',
//     backgroundColor: '#FFCDD2',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   activityDateHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   activityDateTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#1565C0',
//   },
//   activityDaysAfter: {
//     fontSize: 12,
//     color: '#1976D2',
//     backgroundColor: '#BBDEFB',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   activityDateText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#0D47A1',
//   },
//   activityDescription: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   },
  
//   // ✅ Range info boxes (Backend sy)
//   rangeInfoBox: {
//     backgroundColor: '#FFF8E1',
//     padding: 12,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#FFA000',
//     marginBottom: 10,
//   },
//   rangeInfoBoxPest: {
//     backgroundColor: '#FFEBEE',
//     padding: 12,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#D32F2F',
//     marginBottom: 10,
//   },
//   rangeInfoBoxHarvest: {
//     backgroundColor: '#E8F5E9',
//     padding: 12,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#388E3C',
//     marginBottom: 10,
//   },
//   rangeInfoBoxHarvestClickable: {
//     backgroundColor: '#E8F5E9',
//     padding: 12,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#388E3C',
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#A5D6A7',
//   },
//   clickToSelectText: {
//     fontSize: 11,
//     color: '#2E7D32',
//     marginTop: 6,
//     fontWeight: '500',
//   },
//   rangeInfoLabel: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#666',
//     marginBottom: 4,
//   },
//   rangeInfoText: {
//     fontSize: 14,
//     color: '#333',
//     fontWeight: '500',
//   },
//   harvestRangeText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//   },
  
//   // ✅ Calculated dates container
//   calculatedDatesContainer: {
//     marginTop: 8,
//   },
//   calculatedDatesLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//     fontWeight: '500',
//   },
  
//   // ✅ Pesticide activity box
//   activityDateBoxPest: {
//     backgroundColor: '#FFCDD2',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#D32F2F',
//   },
  
//   // ✅ Harvest date styles
//   harvestDateBox: {
//     backgroundColor: '#C8E6C9',
//     padding: 12,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2E7D32',
//   },
//   harvestDateBoxClickable: {
//     backgroundColor: '#C8E6C9',
//     padding: 12,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2E7D32',
//     borderWidth: 1,
//     borderColor: '#81C784',
//   },
//   clickToChangeText: {
//     fontSize: 11,
//     color: '#1B5E20',
//     marginTop: 6,
//     fontWeight: '500',
//   },
//   harvestDateText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1B5E20',
//   },
//   harvestDaysAfter: {
//     fontSize: 12,
//     color: '#388E3C',
//     marginTop: 4,
//   },
//   noDateText: {
//     fontSize: 13,
//     color: '#999',
//     fontStyle: 'italic',
//     padding: 12,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//   },
  
//   // ✅ Section header styles for dropdown
//   sectionHeader: {
//     backgroundColor: '#E8F5E9',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#C8E6C9',
//   },
//   sectionHeaderText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//   },
  
//   // ✅ NEW: Crop selected textfield style
//   dropdownButtonSelected: {
//     borderColor: '#2E7D32',
//     borderWidth: 2,
//     backgroundColor: '#E8F5E9',
//   },
//   dropdownButtonDisabled: {
//     backgroundColor: '#f0f0f0',
//     borderColor: '#ccc',
//   },
//   cropIdText: {
//     fontSize: 11,
//     color: '#666',
//     marginTop: 4,
//     marginLeft: 4,
//   },
  
//   // ✅ NEW: Crop Header Styles
//   cropHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   changeCropButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E3F2FD',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//   },
//   changeCropText: {
//     fontSize: 12,
//     color: '#1976D2',
//     fontWeight: 'bold',
//     marginRight: 4,
//   },
  
//   // ✅ Selected Crop Container
//   selectedCropContainer: {
//     marginTop: 8,
//   },
//   selectedCropBox: {
//     backgroundColor: '#E8F5E8',
//     padding: 12,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2E7D32',
//   },
//   selectedCropName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//   },
//   selectedCropSubtext: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
  
//   // ✅ Location-based crops styles
//   locationCropsLoading: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   locationCropsText: {
//     fontSize: 11,
//     color: '#666',
//     marginLeft: 6,
//   },
//   locationCropsContainer: {
//     marginTop: 6,
//     padding: 8,
//     backgroundColor: '#F3E5F5',
//     borderRadius: 6,
//   },
//   locationCropsTitle: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#7B1FA2',
//   },
//   locationCropsList: {
//     fontSize: 11,
//     color: '#333',
//     fontWeight: 'normal',
//   },
  
//   // Existing styles (keep all your existing styles)
//   inputContainer: { marginBottom: 16 },
//   label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
//   dropdownButton: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
//     paddingHorizontal: 12, paddingVertical: 14,
//   },
//   dropdownText: { fontSize: 16, color: '#333' },
//   selectedLandInfo: {
//     backgroundColor: '#E8F5E8', padding: 12, borderRadius: 8, marginBottom: 16,
//     borderLeftWidth: 4, borderLeftColor: '#2E7D32',
//   },
//   selectedLandTitle: { fontSize: 14, fontWeight: 'bold', color: '#2E7D32', marginBottom: 4 },
//   selectedLandText: { fontSize: 14, color: '#333', fontWeight: '600' },
//   selectedLandSubtext: { fontSize: 12, color: '#666', marginTop: 2 },
//   landStatusOccupied: { fontSize: 12, color: '#FF9800', fontWeight: 'bold', marginTop: 4 },
//   landStatusEmpty: { fontSize: 12, color: '#4CAF50', fontWeight: 'bold', marginTop: 4 },
  
//   container: { flex: 1, backgroundColor: '#f5f5f5' },
//   safeArea: { flex: 1 },
//   header: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'white',
//     borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
//   },
//   backButton: { padding: 4 },
//   headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
//   headerPlaceholder: { width: 24 },
//   scrollContainer: { padding: 16 },
//   sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
//   inputContainer: { marginBottom: 16 },
//   label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  
//   // ✅ NEW: Date Sections Styles
//   dateSection: { 
//     marginBottom: 12 
//   },
//   adminDateSection: { 
//     marginBottom: 12 
//   },
//   dateLabel: { 
//     fontSize: 12, 
//     fontWeight: '600', 
//     color: '#666', 
//     marginBottom: 4 
//   },
//   proposedDateBox: {
//     backgroundColor: '#E3F2FD', 
//     padding: 12, 
//     borderRadius: 8,
//     borderLeftWidth: 4, 
//     borderLeftColor: '#1976D2',
//   },
//   proposedDateText: { 
//     fontSize: 14, 
//     fontWeight: 'bold', 
//     color: '#1976D2' 
//   },
//   proposedDateSubtext: { 
//     fontSize: 12, 
//     color: '#666', 
//     marginTop: 2 
//   },
//   clickToUseText: {
//     fontSize: 11,
//     color: '#FF9800',
//     fontWeight: 'bold',
//     marginTop: 4,
//   },
  
//   // Scheduled Dates Styles
//   scheduledDateContainer: {
//     marginBottom: 16,
//   },
//   scheduledDateHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   scheduledDateLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   changedBadge: {
//     fontSize: 10,
//     color: '#FF9800',
//     fontWeight: 'bold',
//     backgroundColor: '#FFF3E0',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   editableDateContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   scheduledDateBox: {
//     backgroundColor: '#E8F5E8',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#2E7D32',
//     flex: 1,
//     marginRight: 8,
//   },
//   changedDateBox: {
//     backgroundColor: '#FFF3E0',
//     borderColor: '#FF9800',
//   },
//   scheduledDateText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//   },
//   scheduledDateSubtext: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   scheduledDateDesc: {
//     fontSize: 11,
//     color: '#888',
//     fontStyle: 'italic',
//     marginTop: 2,
//   },
//   clickToEditText: {
//     fontSize: 10,
//     color: '#FF9800',
//     fontWeight: 'bold',
//     marginTop: 4,
//   },
//   editFertilizerButton: {
//     backgroundColor: '#2E7D32',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 6,
//     justifyContent: 'center',
//   },
//   editFertilizerButtonText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   editPesticideButton: {
//     backgroundColor: '#D32F2F',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 6,
//     justifyContent: 'center',
//   },
//   editPesticideButtonText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },

//   // Existing styles
//   dropdownButton: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
//     paddingHorizontal: 12, paddingVertical: 14,
//   },
//   dropdownText: { fontSize: 16, color: '#333' },
//   input: {
//     backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
//     paddingHorizontal: 12, paddingVertical: 14, fontSize: 16, color: '#333',
//   },
//   dateInputButton: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
//     paddingHorizontal: 12, paddingVertical: 14,
//   },
//   dateInputText: { fontSize: 16, color: '#333' },
//   submitButton: {
//     backgroundColor: '#2E7D32', borderRadius: 8, paddingVertical: 16,
//     alignItems: 'center', marginTop: 8, marginBottom: 12,
//   },
//   submitButtonDisabled: {
//     backgroundColor: '#A5D6A7',
//   },
//   submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
//   secondaryButton: {
//     backgroundColor: 'white', borderRadius: 8, paddingVertical: 16,
//     alignItems: 'center', borderWidth: 1, borderColor: '#2E7D32', marginBottom: 20,
//   },
//   secondaryButtonText: { color: '#2E7D32', fontSize: 16, fontWeight: 'bold' },
//   loadingContainer: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16,
//   },
//   loadingText: { marginLeft: 8, color: '#666' },
  
//   // Land selection styles
//   landsListContainer: { backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0' },
//   landsHeader: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     padding: 12, backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
//   },
//   landsListTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
//   addLandButton: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E7D32',
//     paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6,
//   },
//   addLandButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
//   landsSection: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
//   landsSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
//   landOption: {
//     padding: 12, borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: '#e0e0e0',
//   },
//   landOptionSelected: { borderColor: '#2E7D32', backgroundColor: '#f1f8e9' },
//   emptyLandOption: { backgroundColor: '#f8f9fa' },
//   occupiedLandOption: { backgroundColor: '#fff8e1' },
//   landOptionText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
//   landOptionSubtext: { fontSize: 12, color: '#666', marginTop: 2 },
//   selectedBadge: { fontSize: 10, color: '#2E7D32', fontWeight: 'bold', marginTop: 4 },
//   emptyBadge: { fontSize: 10, color: '#4caf50', fontWeight: 'bold', marginTop: 4 },
//   occupiedBadge: { fontSize: 10, color: '#ff9800', fontWeight: 'bold', marginTop: 4 },
  
//   // Selected land info
//   selectedLandInfo: {
//     backgroundColor: '#E8F5E8', padding: 12, borderRadius: 8, marginBottom: 16,
//     borderLeftWidth: 4, borderLeftColor: '#2E7D32',
//   },
//   selectedLandTitle: { fontSize: 14, fontWeight: 'bold', color: '#2E7D32', marginBottom: 4 },
//   selectedLandText: { fontSize: 14, color: '#333', fontWeight: '600' },
//   selectedLandSubtext: { fontSize: 12, color: '#666', marginTop: 2 },
//   landStatusOccupied: { fontSize: 12, color: '#FF9800', fontWeight: 'bold', marginTop: 4 },
//   landStatusEmpty: { fontSize: 12, color: '#4CAF50', fontWeight: 'bold', marginTop: 4 },
  
//   // Real crop status
//   realCropStatusContainer: {
//     backgroundColor: '#E3F2FD', padding: 12, borderRadius: 8, marginBottom: 16,
//     borderLeftWidth: 4, borderLeftColor: '#1976D2',
//   },
//   realCropStatusTitle: { fontSize: 14, fontWeight: 'bold', color: '#1976D2', marginBottom: 4 },
//   realCropStatusText: { fontSize: 12, color: '#333' },
  
//   // No lands container
//   noLandsContainer: { alignItems: 'center', padding: 20 },
//   noLandsText: { fontSize: 14, color: '#666', marginBottom: 12 },
//   addLandButtonLarge: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E7D32',
//     paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8,
//   },
  
//   // Modal styles
//   modalOverlay: {
//     flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
//   },
//   dropdownMenu: {
//     backgroundColor: 'white', borderRadius: 12, padding: 16, width: '80%', maxHeight: '60%',
//   },
//   dropdownTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#333' },
//   dropdownScrollView: { maxHeight: 400 },
//   dropdownItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
//   cropNameText: { fontSize: 16, color: '#333' },
//   seedTypeText: { fontSize: 12, color: '#666' },
// });

// export default CropInputPage;











import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { farmerAPI, adminAPI } from './api';
import T from './localization/T';  // ✅ Smart Translation Component

const { width } = Dimensions.get('window');

// ✅ DropdownModal Component - FIXED
const DropdownModal = ({ visible, items, onSelect, onClose, title }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dropdownMenu}>
              <Text style={styles.dropdownTitle}>{title}</Text>
              <ScrollView style={styles.dropdownScrollView}>
                {items.map((item, index) => {
                  // ✅ Skip section headers - don't make them clickable
                  if (item.section) {
                    return (
                      <View key={index} style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>{item.title}</Text>
                      </View>
                    );
                  }
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        console.log('📱 Crop item pressed:', item);
                        onSelect(item);
                      }}
                    >
                      <View>
                        <Text style={styles.cropNameText}>
                          {typeof item === 'object' ? item.name || item.crop_name : item}
                        </Text>
                        <Text style={styles.seedTypeText}>
                          {item.seed_type ? `Seed: ${item.seed_type}` : 'Seed: N/A'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const CropInputPage = ({ navigation, route }) => {
  // State variables
  const [selectedLand, setSelectedLand] = useState(null);
  const [cropName, setCropName] = useState('');
  const [sowingDate, setSowingDate] = useState(null);
  const [harvestDate, setHarvestDate] = useState(null);
  const [showSowingPicker, setShowSowingPicker] = useState(false);
  const [showHarvestPicker, setShowHarvestPicker] = useState(false);
  const [season, setSeason] = useState('');
  const [yieldPer40kg, setYieldPer40kg] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [landsLoading, setLandsLoading] = useState(false);
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  
  // ✅ NEW: Location-based crops state
  const [locationBasedCrops, setLocationBasedCrops] = useState([]);
  const [loadingLocationCrops, setLoadingLocationCrops] = useState(false);
  
  // ✅ Admin proposed dates state
  const [adminProposedSowingDate, setAdminProposedSowingDate] = useState(null);
  const [adminProposedHarvestDate, setAdminProposedHarvestDate] = useState(null);
  
  // ✅ Schedule States
  const [proposedActivities, setProposedActivities] = useState([]);
  const [editableActivities, setEditableActivities] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // ✅ FERTILIZER & PESTICIDE SCHEDULED DATES
  const [fertilizerDates, setFertilizerDates] = useState([]);
  const [pesticideDates, setPesticideDates] = useState([]);
  const [showFertilizerDatePicker, setShowFertilizerDatePicker] = useState({});
  const [showPesticideDatePicker, setShowPesticideDatePicker] = useState({});
  
  // ✅ NEW: Selected fertilizer/pesticide names (user selected from FertilizerInputPage)
  const [selectedFertilizerNames, setSelectedFertilizerNames] = useState({}); // { 0: "DAP", 1: "Urea" }
  const [selectedPesticideNames, setSelectedPesticideNames] = useState({}); // { 0: "Chlorpyrifos" }
  
  // ✅ NEW: Track which fertilizers/pesticides are confirmed (applied)
  const [confirmedFertilizers, setConfirmedFertilizers] = useState({}); // { 0: true, 1: false }
  const [confirmedPesticides, setConfirmedPesticides] = useState({}); // { 0: true }
  
  // ✅ NEW: Crop schedule data from backend
  const [cropScheduleData, setCropScheduleData] = useState(null);
  const [sowingDateRange, setSowingDateRange] = useState(null); // { start: Date, end: Date, text: "25 Oct – 15 Nov" }
  const [harvestDateRange, setHarvestDateRange] = useState(null); // { text: "15 Apr – 5 May" }
  const [calculatedActivities, setCalculatedActivities] = useState([]); // fertilizer, pesticide dates based on sowing
  
  // ✅ NEW: Region-specific ranges from backend
  const [fertilizerRangeText, setFertilizerRangeText] = useState(''); // "Urea1: 20–25 DAS. Urea2: 45–50 DAS."
  const [pesticideRangeText, setPesticideRangeText] = useState(''); // "Weed control: 20–30 DAS..."
  const [harvestRangeText, setHarvestRangeText] = useState(''); // "15 Apr – 5 May"

  const [cropsList, setCropsList] = useState([]);
  const [cropsLoading, setCropsLoading] = useState(false);
  const [farmerLands, setFarmerLands] = useState([]);
  const [landsWithCrops, setLandsWithCrops] = useState([]);
  const [emptyLands, setEmptyLands] = useState([]);
  const [farmerId, setFarmerId] = useState(null);
  const [currentRealCropId, setCurrentRealCropId] = useState(null);
  const [creatingCrop, setCreatingCrop] = useState(false);

  const seasons = ['Rabi', 'Kharif'];

  // Kharif and Rabi crop definitions for grouping
  const kharifCrops = ['مکئی', 'کپاس', 'چاول', 'گنا', 'مونگ', 'ماش', 'باجرہ', 'جوار', 'تل', 'مونگ پھلی', 'Maize', 'Cotton', 'Rice', 'Sugarcane', 'Mung', 'Mash', 'Bajra', 'Jowar', 'Til', 'Groundnut'];
  const rabiCrops = ['گندم', 'جو', 'چنا', 'سرسوں', 'مسور', 'آلو', 'پیاز', 'لہسن', 'مٹر', 'Wheat', 'Barley', 'Chickpea', 'Mustard', 'Lentil', 'Potato', 'Onion', 'Garlic', 'Peas'];

  // Function to get crop season
  const getCropSeason = (cropName) => {
    const cropNameLower = cropName?.toLowerCase() || '';
    const cropNameOriginal = cropName || '';
    
    if (kharifCrops.some(c => c.toLowerCase() === cropNameLower || cropNameOriginal.includes(c))) {
      return 'Kharif';
    }
    if (rabiCrops.some(c => c.toLowerCase() === cropNameLower || cropNameOriginal.includes(c))) {
      return 'Rabi';
    }
    return null; // Unknown season
  };

  // Load initial data from backend
  useEffect(() => {
    loadFarmerData();
    loadCropsFromDB();
  }, []);

  // Refresh lands on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (farmerId) {
        loadFarmerLandsWithStatus(farmerId);
      }
      
      // ✅ Check if returning from FertilizerInputPage with selected item (from AsyncStorage)
      try {
        const confirmedFertilizerData = await AsyncStorage.getItem('confirmedFertilizer');
        if (confirmedFertilizerData) {
          const { selectedFertilizer, fertilizerIndex } = JSON.parse(confirmedFertilizerData);
          console.log('🌾 Received selected fertilizer from AsyncStorage:', selectedFertilizer, 'for index:', fertilizerIndex);
          
          setSelectedFertilizerNames(prev => ({
            ...prev,
            [fertilizerIndex]: selectedFertilizer
          }));
          // ✅ Mark this fertilizer as confirmed (selected)
          setConfirmedFertilizers(prev => ({
            ...prev,
            [fertilizerIndex]: true
          }));
          
          // Clear from AsyncStorage to avoid re-processing
          await AsyncStorage.removeItem('confirmedFertilizer');
        }
        
        // ✅ Check if returning from PesticideInputPage with selected item (from AsyncStorage)
        const confirmedPesticideData = await AsyncStorage.getItem('confirmedPesticide');
        if (confirmedPesticideData) {
          const { selectedPesticide, pesticideIndex } = JSON.parse(confirmedPesticideData);
          console.log('🐛 Received selected pesticide from AsyncStorage:', selectedPesticide, 'for index:', pesticideIndex);
          
          setSelectedPesticideNames(prev => ({
            ...prev,
            [pesticideIndex]: selectedPesticide
          }));
          // ✅ Mark this pesticide as confirmed (selected)
          setConfirmedPesticides(prev => ({
            ...prev,
            [pesticideIndex]: true
          }));
          
          // Clear from AsyncStorage to avoid re-processing
          await AsyncStorage.removeItem('confirmedPesticide');
        }
      } catch (error) {
        console.log('Error reading confirmed data from AsyncStorage:', error);
      }
    });
    return unsubscribe;
  }, [navigation, farmerId]);

  // ✅ NEW: Load location-based crops when land is selected
  useEffect(() => {
    if (selectedLand && selectedLand.city) {
      loadCropsByLocation(selectedLand.city);
    }
  }, [selectedLand]);
  useEffect(() => {
  if (cropName && selectedLand && farmerId) {
    loadAdminProposedDates(cropName);
  }
}, [cropName, selectedLand, farmerId]);

   // ✅ Load farmer data from AsyncStorage
const loadFarmerData = async () => {
  try {
    const savedFarmerId = await AsyncStorage.getItem('farmerId');
    if (savedFarmerId) {
      const fid = parseInt(savedFarmerId);
      setFarmerId(fid);
      loadFarmerLandsWithStatus(fid);
    }
  } catch (error) {
    console.error('Error loading farmer data:', error);
    Alert.alert('Error', 'Failed to load farmer data');
  }
};

// ✅ Load farmer lands with status from backend
const loadFarmerLandsWithStatus = async (fid) => {
  setLandsLoading(true);
  try {
    const response = await farmerAPI.getFarmerLandsWithStatus(fid);
    if (response.success) {
      const landsData = response.lands.map(land => ({
        ...land,
        land_id: land.land_id || land.id,
        id: land.land_id || land.id
      }));

      const occupiedLands = landsData.filter(land => land.status === 'occupied');
      const emptyLandsData = landsData.filter(land => land.status === 'empty');

      setLandsWithCrops(occupiedLands);
      setEmptyLands(emptyLandsData);
      setFarmerLands(landsData);
    } else {
      Alert.alert('Error', 'Failed to load lands data');
    }
  } catch (error) {
    console.error('Error loading lands:', error);
    Alert.alert('Error', 'Failed to load lands data');
  } finally {
    setLandsLoading(false);
  }
};

// ✅ Load crops from database
const loadCropsFromDB = async () => {
  setCropsLoading(true);
  try {
    const response = await farmerAPI.getCrops();
    if (response.success) {
      setCropsList(response.crops);
    } else {
      Alert.alert('Error', 'Failed to load crops from database');
    }
  } catch (error) {
    console.error('Error loading crops:', error);
    Alert.alert('Error', 'Failed to load crops list');
  } finally {
    setCropsLoading(false);
  }
};

  // ✅ Load crops based on location
  const loadCropsByLocation = async (cityName) => {
    setLoadingLocationCrops(true);
    try {
      const response = await farmerAPI.getCropsByCity(cityName);
      if (response.success) {
        setLocationBasedCrops(response.crops || []);
        console.log(`🌾 Found ${response.crops.length} crops in ${cityName}`);
      } else {
        console.log('No location-based crops found');
        setLocationBasedCrops([]);
      }
    } catch (error) {
      console.error('Error loading location-based crops:', error);
      setLocationBasedCrops([]);
    } finally {
      setLoadingLocationCrops(false);
    }
  };

  // ✅ Handle land selection with location-based crops
  const handleLandSelect = (land) => {
    setSelectedLand(land);
    
    // Reset crop selection when land changes
    if (currentRealCropId) {
      Alert.alert(
        'Change Land?',
        'Changing land will reset your current crop selection. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Continue', 
            onPress: () => {
              resetCropSelection();
            }
          }
        ]
      );
    }
  };

  // ✅ Reset crop selection
  const resetCropSelection = () => {
    setCropName('');
    setCurrentRealCropId(null);
    setProposedActivities([]);
    setEditableActivities([]);
    setFertilizerDates([]);
    setPesticideDates([]);
    setSowingDate(null);
    setHarvestDate(null);
    setAdminProposedSowingDate(null);
    setAdminProposedHarvestDate(null);
    // ✅ Reset new states
    setCropScheduleData(null);
    setSowingDateRange(null);
    setHarvestDateRange(null);
    setCalculatedActivities([]);
    setFertilizerRangeText('');
    setPesticideRangeText('');
    setHarvestRangeText('');
  };

  // ✅ NEW: Enhanced crop selection with change functionality
  const handleCropSelect = async (crop) => {
    console.log('handleCropSelect called with:', crop);
    
    let selectedCropName = typeof crop === 'object' ? (crop.crop_name || crop.name || crop) : crop;
    console.log('Selected crop name:', selectedCropName);
    
    // Auto-select season based on crop
    const cropSeason = crop.season || getCropSeason(selectedCropName);
    if (cropSeason) {
      setSeason(cropSeason);
      console.log('Auto-selected season:', cropSeason);
    }
    
    // Close dropdown first
    setShowCropDropdown(false);
    
    // If already have a crop selected, show change confirmation
    if (currentRealCropId && cropName !== selectedCropName) {
      console.log('Changing crop from:', cropName, 'to:', selectedCropName);
      Alert.alert(
        'Change Crop?', 
        `Change from "${cropName}" to "${selectedCropName}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Change Crop', 
            onPress: async () => {
              await createNewCropEntry(selectedCropName);
            }
          }
        ]
      );
    } else {
      // New crop selection
      console.log('New crop selection:', selectedCropName);
      await createNewCropEntry(selectedCropName);
    }
  };

  // ✅ NEW: Update existing crop
  const updateExistingCrop = async (newCropName) => {
    if (!currentRealCropId) {
      Alert.alert('Error', 'No crop selected to update');
      return;
    }

    setCreatingCrop(true);
    try {
      const updateData = {
        crop_name: newCropName,
        sowing_date: sowingDate ? formatDateForBackend(sowingDate) : null,
        harvest_date: harvestDate ? formatDateForBackend(harvestDate) : null,
      };

      const response = await farmerAPI.updateCrop(currentRealCropId, updateData);
      
      if (response.success) {
        setCropName(newCropName);
        await loadAdminProposedDates(newCropName);
        Alert.alert('Success', `Crop changed to ${newCropName} successfully!`);
      } else {
        Alert.alert('Error', response.message || 'Failed to update crop');
      }
    } catch (error) {
      console.error('Error updating crop:', error);
      Alert.alert('Error', 'Failed to update crop');
    } finally {
      setCreatingCrop(false);
    }
  };

  // ✅ Handle Add New Land
const handleAddNewLand = () => {
  navigation.navigate('LandInputPage');
};

// ✅ Handle Season Select
const handleSeasonSelect = (selectedSeason) => {
  setSeason(selectedSeason);
  setShowSeasonDropdown(false);
};

// ✅ Handle Admin Sowing Date Click
const handleAdminSowingDateClick = () => {
  if (adminProposedSowingDate) {
    setSowingDate(adminProposedSowingDate);
    Alert.alert('Success', 'Admin proposed sowing date set successfully!');
  }
};

// ✅ Format Date for Backend
const formatDateForBackend = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ✅ Handle Add Crop
// const handleAddCrop = async () => {
//   if (!selectedLand || !cropName || !sowingDate || !harvestDate) {
//     Alert.alert('Error', 'Please fill all required fields');
//     return;
//   }

//   if (!currentRealCropId) {
//     Alert.alert('Error', 'Crop not properly created');
//     return;
//   }

//   setLoading(true);
//   try {
//     const updateData = {
//       season: season || null,
//       yield_per_40kg: yieldPer40kg ? parseFloat(yieldPer40kg) : null,
//       sowing_date: formatDateForBackend(sowingDate),
//       harvest_date: formatDateForBackend(harvestDate),
//     };

//     const response = await farmerAPI.updateCrop(currentRealCropId, updateData);
    
//     if (response.success) {
//       // ✅ Save confirmed fertilizer activities
//       await saveConfirmedFertilizerActivities();
      
//       // ✅ Save confirmed pesticide activities
//       await saveConfirmedPesticideActivities();
      
//       Alert.alert('Success', 'Crop & Schedule saved successfully!', [
//         {
//           text: 'OK',
//           onPress: () => {
//             // ✅ Navigate to CropActivitiesScreen with crop info
//             navigation.navigate('CropActivitiesScreen', {
//               cropHistoryId: currentRealCropId,
//               cropName: cropName,
//               landName: selectedLand?.name || selectedLand?.address || 'Land'
//             });
//           }
//         }
//       ]);
//       resetForm();
//       loadFarmerLandsWithStatus(farmerId);
//     } else {
//       Alert.alert('Error', response.message || 'Failed to save crop details');
//     }
//   } catch (error) {
//     console.error('Error saving crop:', error);
//     Alert.alert('Error', 'Failed to save crop details');
//   } finally {
//     setLoading(false);
//   }
// };
const handleAddCrop = async () => {
  if (!selectedLand || !cropName || !sowingDate || !harvestDate) {
    Alert.alert('Error', 'Please fill all required fields');
    return;
  }

  if (!currentRealCropId) {
    Alert.alert('Error', 'Crop not properly created');
    return;
  }

  setLoading(true);
  try {
    const updateData = {
      season: season || null,
      yield_per_40kg: yieldPer40kg ? parseFloat(yieldPer40kg) : null,
      sowing_date: formatDateForBackend(sowingDate),
      harvest_date: formatDateForBackend(harvestDate),
    };

    console.log('💾 Starting SINGLE crop save process...');
    
    const response = await farmerAPI.updateCrop(currentRealCropId, updateData);
    
    if (response.success) {
      console.log('✅ Crop updated successfully');
      
      // ✅ SIRF EK HI FUNCTION CALL KARO - DUPLICATE ROKO
      console.log('💾 Saving ALL activities at once...');
      const totalSaved = await saveAllActivitiesOnce();
      
      console.log(`🎯 TOTAL Activities Saved: ${totalSaved}`);
      
      // ✅ Wait for database
      console.log('⏳ Waiting for database to update...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ ALL activities saved successfully! Navigating...');
      
      Alert.alert('Success', `Crop & Activities saved successfully!\nTotal Activities: ${totalSaved}`, [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('CropActivitiesScreen', {
              cropHistoryId: currentRealCropId,
              cropName: cropName,
              landName: selectedLand?.name || selectedLand?.address || 'Land',
              refreshTimestamp: new Date().getTime()
            });
          }
        }
      ]);
      
      // resetForm();
      loadFarmerLandsWithStatus(farmerId);
    } else {
      Alert.alert('Error', response.message || 'Failed to save crop details');
    }
  } catch (error) {
    console.error('Error saving crop:', error);
    Alert.alert('Error', 'Failed to save crop details');
  } finally {
    setLoading(false);
  }
};// ✅ SINGLE FUNCTION: Saari activities ek hi baar save karein
const saveAllActivitiesOnce = async () => {
  try {
    if (!currentRealCropId) {
      console.log('❌ No crop ID for saving activities');
      return 0;
    }

    console.log('💾 Saving ALL activities ONCE to avoid duplicates...');
    
    let savedCount = 0;
    const savedActivityKeys = new Set(); // Track unique activities

    // ✅ 1. Sowing Activity (Always save)
    const sowingKey = `Sowing-${formatDateForBackend(sowingDate)}`;
    if (!savedActivityKeys.has(sowingKey)) {
      const sowingActivity = {
        crop_history_id: currentRealCropId,
        activity_date: formatDateForBackend(sowingDate),
        activity_type: 'Sowing',
        description: `Sowing of ${cropName}`,
        chemical_or_fertilizer_used: null,
        remarks: 'Main sowing activity',
        is_public: false
      };
      
      console.log('💾 Saving sowing activity:', sowingActivity);
      const sowingResult = await farmerAPI.addCropActivity(sowingActivity);
      if (sowingResult.success) {
        console.log('✅ Sowing activity saved:', sowingResult.activity_id);
        savedCount++;
        savedActivityKeys.add(sowingKey);
      }
    }

    // ✅ 2. Harvesting Activity (Always save)
    const harvestKey = `Harvesting-${formatDateForBackend(harvestDate)}`;
    if (!savedActivityKeys.has(harvestKey)) {
      const harvestingActivity = {
        crop_history_id: currentRealCropId,
        activity_date: formatDateForBackend(harvestDate),
        activity_type: 'Harvesting',
        description: `Harvesting of ${cropName}`,
        chemical_or_fertilizer_used: null,
        remarks: 'Main harvesting activity',
        is_public: false
      };
      
      console.log('💾 Saving harvesting activity:', harvestingActivity);
      const harvestResult = await farmerAPI.addCropActivity(harvestingActivity);
      if (harvestResult.success) {
        console.log('✅ Harvesting activity saved:', harvestResult.activity_id);
        savedCount++;
        savedActivityKeys.add(harvestKey);
      }
    }

    // ✅ 3. Calculated Activities (Fertilizer, Pest Control, Irrigation, etc.)
    if (calculatedActivities.length > 0) {
      for (const activity of calculatedActivities) {
        // Skip sowing and harvesting - already saved above
        if (activity.type === 'Sowing' || activity.type === 'Harvesting') {
          continue;
        }

        const activityKey = `${activity.type}-${activity.daysAfter}-${activity.description}`;
        if (savedActivityKeys.has(activityKey)) {
          console.log('⏩ Skipping duplicate calculated activity:', activityKey);
          continue;
        }

        // Check for user-selected chemicals
        let chemicalUsed = null;
        
        if (activity.type === 'Fertilization') {
          const fertIndex = fertilizerDates.findIndex(f => 
            f.daysAfter === activity.daysAfter
          );
          if (fertIndex !== -1 && confirmedFertilizers[fertIndex]) {
            chemicalUsed = selectedFertilizerNames[fertIndex];
          }
        } else if (activity.type === 'Pest Control') {
          const pestIndex = pesticideDates.findIndex(p => 
            p.daysAfter === activity.daysAfter
          );
          if (pestIndex !== -1 && confirmedPesticides[pestIndex]) {
            chemicalUsed = selectedPesticideNames[pestIndex];
          }
        }

        // ✅ Map new activity types to old names (for backend filter compatibility)
        const activityTypeMapping = {
          'Land Preparation': 'Plowing',
          'Pest Control': 'Spraying',
        };
        const mappedActivityType = activityTypeMapping[activity.type] || activity.type;

        const activityData = {
          crop_history_id: currentRealCropId,
          activity_date: formatDateForBackend(activity.date),
          activity_type: mappedActivityType,
          description: activity.description,
          chemical_or_fertilizer_used: chemicalUsed,
          remarks: `Scheduled: ${activity.rangeText} (${activity.daysRangeText})`,
          is_public: false
        };
        
        console.log('💾 Saving calculated activity:', activityData);
        const result = await farmerAPI.addCropActivity(activityData);
        
        if (result.success) {
          console.log('✅ Calculated activity saved:', result.activity_id);
          savedCount++;
          savedActivityKeys.add(activityKey);
        } else {
          console.log('❌ Failed to save calculated activity:', result.message);
        }
      }
    }

    console.log(`🎯 TOTAL UNIQUE Activities Saved: ${savedCount}`);
    return savedCount;
    
  } catch (error) {
    console.error('❌ Error saving activities:', error);
    return 0;
  }
};

// ✅ Urdu to English crop name mapping (from backend)
const URDU_TO_ENGLISH_CROP = {
  'گندم': 'WHEAT',
  'مکئی': 'MAIZE',
  'چاول': 'RICE',
  'دھان': 'RICE',
  'گنا': 'SUGARCANE',
  'کپاس': 'COTTON',
  'جو': 'BARLEY',
  'مونگ پھلی': 'PEANUT',
  'چنے': 'CHICKPEAS',
  'سورج مکھی': 'SUNFLOWER',
  'باجرا': 'BAJRA',
  'باجرہ': 'BAJRA',
  'جوار': 'SORGHUM',
  'تمباکو': 'TOBACCO',
  'تل': 'SESAMUM',
  'سرسوں': 'MUSTARD',
};

// ✅ Convert crop name to English for backend lookup
const convertCropNameToEnglish = (cropName) => {
  if (!cropName) return '';
  
  // Check if it's already English
  const upperName = cropName.toUpperCase();
  if (['WHEAT', 'MAIZE', 'RICE', 'SUGARCANE', 'COTTON', 'BARLEY', 'PEANUT', 'CHICKPEAS', 'SUNFLOWER', 'BAJRA', 'SORGHUM', 'TOBACCO', 'SESAMUM', 'MUSTARD'].includes(upperName)) {
    return upperName;
  }
  
  // Check Urdu mapping
  const englishName = URDU_TO_ENGLISH_CROP[cropName];
  if (englishName) {
    console.log('🔄 Converted Urdu to English:', cropName, '→', englishName);
    return englishName;
  }
  
  // Return uppercase as fallback
  return upperName;
};

// ✅ Backend sy crop timing check karo
const checkCropTimingFromBackend = async (selectedCropName, cityName) => {
  try {
    console.log('🔄 Checking crop timing from backend for:', selectedCropName, 'in', cityName);
    
    const response = await adminAPI.getCropSchedules();
    console.log('📡 Backend response:', response ? 'Got data' : 'No data');
    
    if (!response || !response.success || !response.schedules) {
      console.log('❌ Failed to get crop schedules from backend');
      // ✅ Return basic alert even if backend fails
      return {
        alertMessage: `📋 ${selectedCropName} select ho gaya!\n\nBackend sy schedule nahi mil saka. Apni marzi sy dates set karein.`,
        sowingWindow: '',
        cropSchedule: null
      };
    }
    
    const schedules = response.schedules;
    console.log('📋 Available crops in backend:', Object.keys(schedules).join(', '));
    
    // ✅ Convert Urdu crop name to English
    const cropNameEnglish = convertCropNameToEnglish(selectedCropName);
    console.log('🔄 Looking for crop:', selectedCropName, '→', cropNameEnglish);
    
    const cropSchedule = schedules[cropNameEnglish];
    
    if (!cropSchedule) {
      console.log('❌ No schedule found for crop:', selectedCropName, '(tried:', cropNameEnglish, ')');
      // ✅ Show alert that crop schedule not found
      return {
        alertMessage: `📋 ${selectedCropName} select ho gaya!\n\n⚠️ Is crop ka schedule backend mein nahi mila.\nAvailable crops: ${Object.keys(schedules).slice(0, 5).join(', ')}...`,
        sowingWindow: '',
        cropSchedule: null
      };
    }
    
    console.log('✅ Found crop schedule for:', cropNameEnglish);
    
    // ✅ Current date info
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    
    // ✅ Check region-specific sowing time
    const cityLower = cityName ? cityName.toLowerCase().trim() : '';
    console.log('🏙️ Looking for city:', cityLower);
    console.log('🏙️ Available regions:', cropSchedule.regions ? Object.keys(cropSchedule.regions).join(', ') : 'No regions');
    
    const regionData = cropSchedule.regions ? cropSchedule.regions[cityLower] : null;
    
    let alertMessage = '';
    let sowingWindow = '';
    let recommendedSeason = '';
    
    // ✅ Agar region nahi mila tou general info dikhao
    if (!regionData || !regionData.sowing) {
      console.log('⚠️ No region data found for city:', cityLower);
      
      // Try to get any region's data as fallback
      const availableRegions = cropSchedule.regions ? Object.keys(cropSchedule.regions) : [];
      if (availableRegions.length > 0) {
        const firstRegion = availableRegions[0];
        const fallbackData = cropSchedule.regions[firstRegion];
        
        alertMessage = `📋 ${selectedCropName} ki timing info:\n\n` +
                       `⚠️ "${cityName}" ki specific info nahi mili.\n\n` +
                       `${firstRegion.charAt(0).toUpperCase() + firstRegion.slice(1)} ke liye:\n` +
                       `📅 Sowing: ${fallbackData.sowing || 'N/A'}\n` +
                       `🌾 Harvest: ${fallbackData.harvest || 'N/A'}\n\n` +
                       `Available regions: ${availableRegions.join(', ')}`;
        
        return {
          alertMessage: alertMessage,
          sowingWindow: fallbackData.sowing || '',
          cropSchedule: cropSchedule
        };
      }
      
      return {
        alertMessage: `📋 ${selectedCropName} select ho gaya!\n\nRegion data available nahi hai.`,
        sowingWindow: '',
        cropSchedule: cropSchedule
      };
    }
    
    // ✅ Region data mil gaya
    console.log('✅ Found region data for:', cityLower);
    console.log('📋 Region fertilizer:', regionData.fertilizer);
    console.log('📋 Region pesticide:', regionData.pesticide);
    console.log('📋 Region harvest:', regionData.harvest);
    
    sowingWindow = regionData.sowing;
    
    // ✅ Parse sowing window (e.g., "25 Oct – 15 Nov")
    const timingInfo = parseSowingWindow(sowingWindow, currentMonth, currentDay);
    
    // ✅ Backend sy sowing window ka season detect karo
    const cropSeason = detectSeasonFromSowingWindow(sowingWindow);
    
    if (timingInfo.status === 'early') {
      alertMessage = `⚠️ Ap ${timingInfo.daysEarly} din JALDI laga rahy hain!\n\n` +
                     `${selectedCropName} ki ${cityName} mein sowing window:\n` +
                     `📅 ${sowingWindow}\n` +
                     `🌾 Season: ${cropSeason}\n\n` +
                     `${regionData.harvest ? 'Harvest: ' + regionData.harvest : ''}`;
    } else if (timingInfo.status === 'late') {
      alertMessage = `⚠️ Ap ${timingInfo.daysLate} din LATE laga rahy hain!\n\n` +
                     `${selectedCropName} ki ${cityName} mein sowing window:\n` +
                     `📅 ${sowingWindow}\n` +
                     `🌾 Season: ${cropSeason}\n\n` +
                     `${regionData.harvest ? 'Harvest: ' + regionData.harvest : ''}`;
    } else {
      alertMessage = `✅ Sahi waqt hai!\n\n` +
                     `${selectedCropName} ki ${cityName} mein sowing window:\n` +
                     `📅 ${sowingWindow}\n` +
                     `🌾 Season: ${cropSeason}`;
    }
    
    return {
      alertMessage: alertMessage,
      sowingWindow: sowingWindow,
      cropSchedule: cropSchedule,
      // ✅ NEW: Region-specific ranges
      regionData: {
        fertilizer: regionData.fertilizer || '',
        pesticide: regionData.pesticide || '',
        harvest: regionData.harvest || ''
      }
    };
    
  } catch (error) {
    console.error('❌ Error checking crop timing:', error);
    return null;
  }
};

// ✅ Backend ki sowing window sy season detect karo (no hardcoding)
const detectSeasonFromSowingWindow = (sowingWindow) => {
  try {
    if (!sowingWindow || sowingWindow === 'Not major' || sowingWindow === 'Not common') {
      return 'Unknown';
    }
    
    const monthMap = {
      'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
      'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
    };
    
    // Parse start month from sowing window
    const parts = sowingWindow.split('–').map(s => s.trim());
    if (parts.length < 1) return 'Unknown';
    
    const startParts = parts[0].split(' ');
    if (startParts.length < 2) return 'Unknown';
    
    const startMonthStr = startParts[1] || startParts[0];
    const startMonth = monthMap[startMonthStr.toLowerCase().substring(0, 3)];
    
    if (!startMonth) return 'Unknown';
    
    // ✅ Season detect from sowing month (from backend data)
    // Rabi: Oct, Nov, Dec, Jan, Feb, Mar (months 10-12, 1-3)
    // Kharif: Apr, May, Jun, Jul, Aug, Sep (months 4-9)
    if (startMonth >= 10 || startMonth <= 3) {
      return 'Rabi (Oct-Mar)';
    } else {
      return 'Kharif (Apr-Sep)';
    }
  } catch (error) {
    console.log('Error detecting season:', error);
    return 'Unknown';
  }
};

// ✅ Sowing window parse karo
const parseSowingWindow = (sowingWindow, currentMonth, currentDay) => {
  try {
    // Format: "25 Oct – 15 Nov" or "15 Jun – 15 Jul"
    const monthMap = {
      'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
      'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
    };
    
    const parts = sowingWindow.split('–').map(s => s.trim());
    if (parts.length !== 2) return { status: 'unknown' };
    
    // Parse start date
    const startParts = parts[0].split(' ');
    const startDay = parseInt(startParts[0]);
    const startMonth = monthMap[startParts[1].toLowerCase().substring(0, 3)];
    
    // Parse end date
    const endParts = parts[1].split(' ');
    const endDay = parseInt(endParts[0]);
    const endMonth = monthMap[endParts[1].toLowerCase().substring(0, 3)];
    
    if (!startMonth || !endMonth) return { status: 'unknown' };
    
    // ✅ Compare with current date
    const currentDate = new Date(2024, currentMonth - 1, currentDay);
    const startDate = new Date(2024, startMonth - 1, startDay);
    const endDate = new Date(2024, endMonth - 1, endDay);
    
    // Handle year wrap (e.g., Oct - Mar)
    if (endMonth < startMonth) {
      if (currentMonth <= endMonth) {
        // We're in the next year part
        currentDate.setFullYear(2025);
        endDate.setFullYear(2025);
      }
    }
    
    if (currentDate < startDate) {
      const diffDays = Math.ceil((startDate - currentDate) / (1000 * 60 * 60 * 24));
      return { status: 'early', daysEarly: diffDays };
    } else if (currentDate > endDate) {
      const diffDays = Math.ceil((currentDate - endDate) / (1000 * 60 * 60 * 24));
      return { status: 'late', daysLate: diffDays };
    } else {
      return { status: 'ontime' };
    }
    
  } catch (error) {
    console.log('Error parsing sowing window:', error);
    return { status: 'unknown' };
  }
};

// ✅ Create new crop entry in database
const createNewCropEntry = async (selectedCropName) => {
  console.log('🌱 createNewCropEntry called with:', selectedCropName);
  
  if (!selectedLand) {
    Alert.alert('Error', 'Please select a land first');
    return;
  }

  setCreatingCrop(true);
  
  // ✅ BACKEND SY CROP TIMING CHECK KARO
  const cityName = selectedLand.city || '';
  console.log('🏙️ City name:', cityName);
  
  let timingInfo = null;
  
  try {
    timingInfo = await checkCropTimingFromBackend(selectedCropName, cityName);
    console.log('📋 Timing info received:', timingInfo ? 'Yes' : 'No');
  } catch (error) {
    console.log('❌ Error in checkCropTimingFromBackend:', error);
  }
  
  // ✅ HAMESHA ALERT DIKHAO - chahe timing info ho ya na ho
  const alertTitle = `📋 ${selectedCropName}`;
  const alertMsg = timingInfo && timingInfo.alertMessage 
    ? timingInfo.alertMessage 
    : `${selectedCropName} select kiya gaya.\n\nAp crop laga sakty hain.`;
  
  console.log('🔔 Showing alert:', alertTitle);
  
  Alert.alert(
    alertTitle,
    alertMsg,
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          console.log('❌ User cancelled');
          setCreatingCrop(false);
        }
      },
      {
        text: 'Lagao',
        onPress: async () => {
          console.log('✅ User confirmed, proceeding...');
          await proceedWithCropCreation(selectedCropName, timingInfo);
        }
      }
    ]
  );
};

// ✅ Crop creation proceed karo
const proceedWithCropCreation = async (selectedCropName, timingInfo) => {
  try {
    const realCropHistoryId = await createRealCropEntry(selectedCropName);
    
    if (!realCropHistoryId) {
      Alert.alert('Error', 'Failed to create crop entry in database');
      setCreatingCrop(false);
      return;
    }

    setCurrentRealCropId(realCropHistoryId);
    setCropName(selectedCropName);
    
    // ✅ Save crop schedule data from timing info
    if (timingInfo && timingInfo.cropSchedule) {
      setCropScheduleData(timingInfo.cropSchedule);
      
      // ✅ Parse sowing date range
      if (timingInfo.sowingWindow) {
        const parsedRange = parseDateRangeFromBackend(timingInfo.sowingWindow);
        setSowingDateRange(parsedRange);
        console.log('📅 Sowing range set:', parsedRange);
      }
      
      // ✅ Save region-specific range texts
      if (timingInfo.regionData) {
        setFertilizerRangeText(timingInfo.regionData.fertilizer || '');
        setPesticideRangeText(timingInfo.regionData.pesticide || '');
        setHarvestRangeText(timingInfo.regionData.harvest || '');
        console.log('🌾 Fertilizer range:', timingInfo.regionData.fertilizer);
        console.log('🐛 Pesticide range:', timingInfo.regionData.pesticide);
        console.log('📅 Harvest range:', timingInfo.regionData.harvest);
      }
    }
    
    // ✅ Load admin proposed dates for the new crop
    await loadAdminProposedDates(selectedCropName, timingInfo);
    
    Alert.alert('Success!', `${selectedCropName} created successfully!\n\nAb sowing date select karein.`);
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'Failed to create crop');
  } finally {
    setCreatingCrop(false);
  }
};

// ✅ Parse date range from backend string (e.g., "25 Oct – 15 Nov")
const parseDateRangeFromBackend = (rangeText) => {
  try {
    if (!rangeText || rangeText === 'Not major' || rangeText === 'Not common') {
      return null;
    }
    
    const monthMap = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    
    const parts = rangeText.split('–').map(s => s.trim());
    if (parts.length !== 2) return { text: rangeText, start: null, end: null };
    
    // Parse start date
    const startParts = parts[0].split(' ');
    const startDay = parseInt(startParts[0]);
    const startMonthStr = startParts[1] || '';
    const startMonth = monthMap[startMonthStr.toLowerCase().substring(0, 3)];
    
    // Parse end date
    const endParts = parts[1].split(' ');
    const endDay = parseInt(endParts[0]);
    const endMonthStr = endParts[1] || '';
    const endMonth = monthMap[endMonthStr.toLowerCase().substring(0, 3)];
    
    if (startMonth === undefined || endMonth === undefined) {
      return { text: rangeText, start: null, end: null };
    }
    
    const currentYear = new Date().getFullYear();
    let startDate = new Date(currentYear, startMonth, startDay);
    let endDate = new Date(currentYear, endMonth, endDay);
    
    // Handle year wrap (e.g., Oct - Mar spans two years)
    if (endMonth < startMonth) {
      endDate = new Date(currentYear + 1, endMonth, endDay);
    }
    
    return {
      text: rangeText,
      start: startDate,
      end: endDate
    };
  } catch (error) {
    console.log('Error parsing date range:', error);
    return { text: rangeText, start: null, end: null };
  }
};

// ✅ Calculate all activity dates from sowing date - WITH RANGES
const calculateActivityDates = (selectedSowingDate) => {
  if (!selectedSowingDate || !cropScheduleData || !cropScheduleData.activities) {
    return;
  }
  
  console.log('🔄 Calculating activity dates from sowing:', selectedSowingDate);
  
  const activities = cropScheduleData.activities;
  const calculatedDates = [];
  
  // ✅ Range buffer - ±5 days for flexibility
  const RANGE_BUFFER = 5;
  
  activities.forEach(activity => {
    const activityDate = new Date(selectedSowingDate);
    activityDate.setDate(activityDate.getDate() + activity.days_after);
    
    // ✅ Calculate range (start and end dates)
    const rangeStart = new Date(selectedSowingDate);
    rangeStart.setDate(rangeStart.getDate() + Math.max(0, activity.days_after - RANGE_BUFFER));
    
    const rangeEnd = new Date(selectedSowingDate);
    rangeEnd.setDate(rangeEnd.getDate() + activity.days_after + RANGE_BUFFER);
    
    calculatedDates.push({
      type: activity.type,
      description: activity.desc,
      daysAfter: activity.days_after,
      date: activityDate,
      dateText: activityDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      // ✅ NEW: Range info
      rangeStart: rangeStart,
      rangeEnd: rangeEnd,
      rangeStartText: rangeStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      rangeEndText: rangeEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      rangeText: `${rangeStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${rangeEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
      daysRangeText: `${Math.max(0, activity.days_after - RANGE_BUFFER)}–${activity.days_after + RANGE_BUFFER} DAS`
    });
  });
  
  setCalculatedActivities(calculatedDates);
  
  // ✅ Find and set fertilizer dates
  const fertDates = calculatedDates.filter(a => a.type === 'Fertilization');
  setFertilizerDates(fertDates);
  
  // ✅ Find and set pesticide dates
  const pestDates = calculatedDates.filter(a => a.type === 'Pest Control');
  setPesticideDates(pestDates);
  
  // ✅ Find and set harvest date
  const harvestActivity = calculatedDates.find(a => a.type === 'Harvesting');
  if (harvestActivity) {
    setHarvestDate(harvestActivity.date);
  }
  
  console.log('✅ Calculated activities with ranges:', calculatedDates.length);
};

// ✅ Create real crop entry in database
// ✅ CORRECTED: Create real crop entry in database
const createRealCropEntry = async (selectedCropName) => {
  try {
    if (!selectedLand || !selectedCropName) return null;

    const landId = selectedLand.land_id || selectedLand.id;
    const currentMonth = new Date().getMonth() + 1;
    const autoSeason = (currentMonth >= 10 || currentMonth <= 3) ? 'Rabi' : 'Kharif';
    
    // ✅ Format dates properly
    const sowingDateFormatted = sowingDate ? formatDateForBackend(sowingDate) : formatDateForBackend(new Date());
    const harvestDateFormatted = harvestDate ? formatDateForBackend(harvestDate) : formatDateForBackend(new Date(Date.now() + 120 * 24 * 60 * 60 * 1000));
    
    const cropData = {
      land_id: landId,
      crop_name: selectedCropName,
      season: season || autoSeason,
      yield_per_40kg: yieldPer40kg ? parseFloat(yieldPer40kg) : null,
      sowing_date: sowingDateFormatted,
      harvest_date: harvestDateFormatted,
      fertilizer_used: null,
      pesticide_used: null
    };

    console.log('🔄 Creating crop with data:', cropData);

    let response;
    
    // ✅ Use your existing API methods
    if (selectedLand.status === 'empty') {
      response = await farmerAPI.addCropToEmptyLand(farmerId, cropData);
    } else {
      response = await farmerAPI.addCropToLand(farmerId, landId, cropData);
    }
    
    console.log('📡 API Response:', response);
    
    if (response.success && response.crop_history_id) {
      console.log('✅ Crop created successfully with ID:', response.crop_history_id);
      return response.crop_history_id;
    } else {
      Alert.alert('Error', response.message || 'Failed to create crop');
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating crop:', error);
    Alert.alert('Error', 'Failed to create crop in database');
    return null;
  }
};

// ✅ Load admin proposed dates - BACKEND SY DATA LEGA
const loadAdminProposedDates = async (cropNameParam, timingInfo = null) => {
  try {
    console.log('🔄 Loading dates from backend for:', cropNameParam);
    
    let duration = 120; // Default
    
    // ✅ Agar timingInfo hai tou us sy duration nikalo
    if (timingInfo && timingInfo.cropSchedule && timingInfo.cropSchedule.activities) {
      const activities = timingInfo.cropSchedule.activities;
      const harvestActivity = activities.find(a => a.type === 'Harvesting');
      if (harvestActivity && harvestActivity.days_after) {
        duration = harvestActivity.days_after;
        console.log('✅ Duration from backend:', duration, 'days');
      }
    } else {
      // ✅ Backend sy fresh data lo
      try {
        const response = await adminAPI.getCropSchedules();
        if (response.success && response.schedules) {
          const cropNameUpper = cropNameParam.toUpperCase();
          const cropSchedule = response.schedules[cropNameUpper];
          
          if (cropSchedule && cropSchedule.activities) {
            const harvestActivity = cropSchedule.activities.find(a => a.type === 'Harvesting');
            if (harvestActivity && harvestActivity.days_after) {
              duration = harvestActivity.days_after;
              console.log('✅ Duration from backend API:', duration, 'days');
            }
          }
        }
      } catch (apiError) {
        console.log('❌ Could not fetch from backend, using default:', apiError);
      }
    }
    
    const sowingDateNew = new Date();
    const harvestDateNew = new Date(sowingDateNew);
    harvestDateNew.setDate(sowingDateNew.getDate() + duration);
    
    // ✅ Set dates
    setAdminProposedSowingDate(sowingDateNew);
    setAdminProposedHarvestDate(harvestDateNew);
    setSowingDate(sowingDateNew);
    setHarvestDate(harvestDateNew);
    
    console.log(`✅ ${cropNameParam}: ${duration} days (from backend)`);
    console.log('📅 Sowing:', sowingDateNew.toLocaleDateString());
    console.log('🌾 Harvest:', harvestDateNew.toLocaleDateString());
    
  } catch (error) {
    console.error('❌ Error:', error);
    // Simple fallback
    const sowingDateFallback = new Date();
    const harvestDateFallback = new Date();
    harvestDateFallback.setDate(sowingDateFallback.getDate() + 120);
    
    setSowingDate(sowingDateFallback);
    setHarvestDate(harvestDateFallback);
  }
};
return (
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Crop Information</Text>

        {/* ✅ Land Selection Section - YEH ADD KARO */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Land *</Text>
          
          {landsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2E7D32" />
              <Text style={styles.loadingText}>Loading lands from database...</Text>
            </View>
          ) : farmerLands.length > 0 ? (
            <View style={styles.landsListContainer}>
              <View style={styles.landsHeader}>
                <Text style={styles.landsListTitle}>Your Lands ({farmerLands.length})</Text>
                <TouchableOpacity style={styles.addLandButton} onPress={handleAddNewLand}>
                  <Icon name="add" size={16} color="white" />
                  <Text style={styles.addLandButtonText}>New Land</Text>
                </TouchableOpacity>
              </View>

              {emptyLands.length > 0 && (
                <View style={styles.landsSection}>
                  <Text style={styles.landsSectionTitle}>✅ Empty Lands ({emptyLands.length})</Text>
                  {emptyLands.map((land) => {
                    const landId = land.land_id || land.id;
                    return (
                      <TouchableOpacity
                        key={landId}
                        style={[
                          styles.landOption,
                          selectedLand && (selectedLand.land_id === landId) && styles.landOptionSelected,
                          styles.emptyLandOption
                        ]}
                        onPress={() => handleLandSelect(land)}
                      >
                        <Text style={styles.landOptionText}>{land.city} - {land.area} - {land.zone}</Text>
                        <Text style={styles.landOptionSubtext}>
                          {land.area_size} {land.area_unit} • {land.soil_type}
                        </Text>
                        {selectedLand && (selectedLand.land_id === landId) && (
                          <Text style={styles.selectedBadge}>✓ SELECTED</Text>
                        )}
                        <Text style={styles.emptyBadge}>EMPTY</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {landsWithCrops.length > 0 && (
                <View style={styles.landsSection}>
                  <Text style={styles.landsSectionTitle}>🌾 Occupied Lands ({landsWithCrops.length})</Text>
                  {landsWithCrops.map((land) => {
                    const landId = land.land_id || land.id;
                    return (
                      <TouchableOpacity
                        key={landId}
                        style={[
                          styles.landOption,
                          selectedLand && (selectedLand.land_id === landId) && styles.landOptionSelected,
                          styles.occupiedLandOption
                        ]}
                        onPress={() => handleLandSelect(land)}
                      >
                        <Text style={styles.landOptionText}>{land.city} - {land.area} - {land.zone}</Text>
                        <Text style={styles.landOptionSubtext}>
                          {land.area_size} {land.area_unit} • {land.soil_type}
                        </Text>
                        <Text style={styles.landOptionSubtext}>
                          Current Crop: {land.current_crop || 'N/A'}
                        </Text>
                        {selectedLand && (selectedLand.land_id === landId) && (
                          <Text style={styles.selectedBadge}>✓ SELECTED</Text>
                        )}
                        <Text style={styles.occupiedBadge}>OCCUPIED</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.noLandsContainer}>
              <Text style={styles.noLandsText}>No lands found in database</Text>
              <TouchableOpacity style={styles.addLandButtonLarge} onPress={handleAddNewLand}>
                <Icon name="add" size={20} color="white" />
                <Text style={styles.addLandButtonText}>Add Your First Land</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ✅ Crop Name Section - FIXED: Textfield ma hi crop dikhay */}
       {/* ✅ Crop Name Section - FIXED: Pehle check karo ke land empty hai */}
<View style={styles.inputContainer}>
  <Text style={styles.label}>Select Crop *</Text>
  
  {/* ✅ Agar land selected hai aur occupied hai */}
  {selectedLand && selectedLand.status === 'occupied' && (
    <View style={styles.occupiedLandWarning}>
      <Icon name="warning" size={20} color="#FF9800" />
      <View style={styles.occupiedLandWarningText}>
        <Text style={styles.occupiedLandTitle}>⚠️ This land is already occupied!</Text>
        <Text style={styles.occupiedLandMessage}>
          Current crop: {selectedLand.current_crop || 'Unknown'}
        </Text>
        <Text style={styles.occupiedLandHint}>
          👉 Please select an empty land to add a new crop
        </Text>
      </View>
    </View>
  )}
  
  <TouchableOpacity
    style={[
      styles.dropdownButton,
      cropName && styles.dropdownButtonSelected,
      (!selectedLand || creatingCrop || cropsLoading || selectedLand?.status === 'occupied') && styles.dropdownButtonDisabled
    ]}
    onPress={() => {
      if (!selectedLand) {
        Alert.alert('⚠️ Land Select Karein', 'Pehle land select karein, phir crop select kar sakty hain.');
        return;
      }
      
      // ✅ CRITICAL CHECK: Agar land occupied hai toh crop select nahi karne do
      if (selectedLand.status === 'occupied') {
        Alert.alert(
          '🚫 Cannot Add Crop',
          `This land is already occupied with "${selectedLand.current_crop || 'a crop'}".\n\n` +
          `Please select an EMPTY land from the list above to add a new crop.\n\n` +
          `• Empty lands are marked with "EMPTY" badge\n` +
          `• Occupied lands show "OCCUPIED" badge`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      if (creatingCrop) {
        Alert.alert('⏳ Wait', 'Crop create ho rahi hai...');
        return;
      }
      if (cropsLoading) {
        Alert.alert('⏳ Wait', 'Crops load ho rahi hain...');
        return;
      }
      
      setShowCropDropdown(true);
    }}
    activeOpacity={0.7}
  >
    <Text style={[
      styles.dropdownText, 
      !cropName && { color: '#999' },
      cropName && { color: '#2E7D32', fontWeight: 'bold' }
    ]}>
      {!selectedLand ? '⚠️ Pehle Land Select Karein' : 
       selectedLand.status === 'occupied' ? '🚫 Land Occupied - Select Empty Land' :
       creatingCrop ? '⏳ Creating Crop...' : 
       cropsLoading ? '⏳ Loading crops...' : 
       cropName ? `✅ ${cropName}` : 'Select Crop'}
    </Text>
    <Icon name="arrow-drop-down" size={20} color={cropName ? '#2E7D32' : '#666'} />
  </TouchableOpacity>
</View>

        {/* ✅ MISSING SECTIONS - YEH ADD KARO */}

        {/* Season Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Season</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowSeasonDropdown(true)}>
            <Text style={[styles.dropdownText, !season && { color: '#999' }]}>
              {season || 'Select Season'}
            </Text>
            <Icon name="arrow-drop-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        
<View style={styles.inputContainer}>
  <Text style={styles.label}>Sowing Date *</Text>
  
  {/* ✅ Show Sowing Date Range from Backend */}
  {sowingDateRange && sowingDateRange.text && (
    <View style={styles.dateRangeContainer}>
      <Text style={styles.dateRangeLabel}>Recommended Sowing Window:</Text>
      <View style={styles.dateRangeBox}>
        <Text style={styles.dateRangeText}>{sowingDateRange.text}</Text>
        <Text style={styles.dateRangeSubtext}>Aap koi bhi date select kar sakte hain</Text>
      </View>
    </View>
  )}

  {/* Selected Sowing Date - SIMPLE TEXT */}
  <View style={styles.dateSection}>
    <Text style={styles.dateLabel}>Selected Sowing Date:</Text>
    <TouchableOpacity 
      style={[styles.dateInputButton, sowingDate && styles.dateInputButtonSelected]} 
      onPress={() => setShowSowingPicker(true)}
    >
      <Text style={[styles.dateInputText, sowingDate ? { color: '#2E7D32', fontWeight: 'bold' } : { color: '#999' }]}>
        {sowingDate ? sowingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select Sowing Date'}
      </Text>
      <Icon name="calendar-today" size={20} color={sowingDate ? '#2E7D32' : '#666'} />
    </TouchableOpacity>
  </View>
</View>

{showSowingPicker && (
  <DateTimePicker
    value={sowingDate || new Date()}
    mode="date"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    onChange={(event, selectedDate) => {
      setShowSowingPicker(false);
      if (selectedDate) {
        const localDate = new Date(selectedDate);
        localDate.setHours(12, 0, 0, 0);
        setSowingDate(localDate);
        calculateActivityDates(localDate);
      }
    }}
  />
)}
        {/* ✅ Fertilizer Schedule - Range + Clickable Dates */}
        {(fertilizerRangeText || fertilizerDates.length > 0) && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>🌾 Fertilizer Schedule</Text>
            
            {/* Recommended Range from Backend */}
            {fertilizerRangeText && (
              <View style={styles.rangeInfoBox}>
                <Text style={styles.rangeInfoLabel}>📋 Recommended (Backend sy):</Text>
                <Text style={styles.rangeInfoText}>{fertilizerRangeText}</Text>
              </View>
            )}
            
            {/* Clickable Date Ranges - Navigate to FertilizerInputPage */}
            {sowingDate && fertilizerDates.length > 0 && (
              <View style={styles.calculatedDatesContainer}>
                <Text style={styles.calculatedDatesLabel}>📅 Apki Sowing Date ({sowingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}) ky hisab sy:</Text>
                {fertilizerDates.map((fert, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[
                      styles.activityDateBoxClickable,
                      confirmedFertilizers[index] && styles.activityDateBoxConfirmed
                    ]}
                    onPress={() => {
                      console.log('🌾 Navigating to FertilizerInputPage for:', fert);
                      // ✅ Extract recommended fertilizer name from description
                      let recommendedFert = '';
                      if (fert.description) {
                        if (fert.description.toLowerCase().includes('urea')) recommendedFert = 'Urea';
                        else if (fert.description.toLowerCase().includes('dap')) recommendedFert = 'DAP';
                        else if (fert.description.toLowerCase().includes('npk')) recommendedFert = 'NPK';
                        else if (fert.description.toLowerCase().includes('potash')) recommendedFert = 'Potash';
                        else recommendedFert = 'Urea'; // Default
                      }
                      
                      navigation.navigate('FertilizerInputPage', {
                        cropName: cropName,
                        cropHistoryId: currentRealCropId,
                        scheduledDate: fert.date.toISOString(),
                        rangeStart: fert.rangeStart.toISOString(),
                        rangeEnd: fert.rangeEnd.toISOString(),
                        activityType: fert.type,
                        description: fert.description,
                        fertilizerNumber: index + 1,
                        fertilizerIndex: index,
                        recommendedFertilizer: selectedFertilizerNames[index] || recommendedFert,
                        returnScreen: 'CropInputPage'
                      });
                    }}
                  >
                    {/* ✅ Show SELECTED badge (not saved yet, just selected) */}
                    {confirmedFertilizers[index] && (
                      <View style={styles.confirmedBadge}>
                        <Text style={styles.confirmedBadgeText}>✅ Selected</Text>
                      </View>
                    )}
                    
                    <View style={styles.activityDateHeader}>
                      <Text style={[
                        styles.activityDateTitle,
                        confirmedFertilizers[index] && styles.activityDateTitleConfirmed
                      ]}>
                        {index === 0 ? '1st Fertilizer' : `${index + 1}${index === 1 ? 'nd' : 'rd'} Fertilizer`}
                      </Text>
                      <Text style={styles.activityDaysAfter}>{fert.daysRangeText}</Text>
                    </View>
                    {/* ✅ Show Date RANGE */}
                    <View style={styles.dateRangeRow}>
                      <Text style={styles.activityRangeText}>📅 {fert.rangeText}</Text>
                    </View>
                    <Text style={styles.activityDescription}>{fert.description}</Text>
                    
                    {/* ✅ Show Selected Fertilizer if user selected one */}
                    {selectedFertilizerNames[index] ? (
                      <View style={[
                        styles.selectedItemBadge,
                        confirmedFertilizers[index] && styles.selectedItemBadgeConfirmed
                      ]}>
                        <Text style={styles.selectedItemText}>✅ {selectedFertilizerNames[index]}</Text>
                      </View>
                    ) : (
                      <Text style={styles.clickToAddText}>👆 Tap to add fertilizer details</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ✅ Pesticide Schedule - Range + Clickable Dates */}
        {(pesticideRangeText || pesticideDates.length > 0) && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>🐛 Pesticide Schedule</Text>
            
            {/* Recommended Range from Backend */}
            {pesticideRangeText && (
              <View style={styles.rangeInfoBoxPest}>
                <Text style={styles.rangeInfoLabel}>📋 Recommended (Backend sy):</Text>
                <Text style={styles.rangeInfoText}>{pesticideRangeText}</Text>
              </View>
            )}
            
            {/* Clickable Date Ranges - Navigate to PesticideInputPage */}
            {sowingDate && pesticideDates.length > 0 && (
              <View style={styles.calculatedDatesContainer}>
                <Text style={styles.calculatedDatesLabel}>📅 Apki Sowing Date ({sowingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}) ky hisab sy:</Text>
                {pesticideDates.map((pest, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[
                      styles.activityDateBoxPestClickable,
                      confirmedPesticides[index] && styles.activityDateBoxPestConfirmed
                    ]}
                    onPress={() => {
                      console.log('🐛 Navigating to PesticideInputPage for:', pest);
                      // ✅ Extract recommended pesticide name from description
                      let recommendedPest = '';
                      if (pest.description) {
                        if (pest.description.toLowerCase().includes('aphid')) recommendedPest = 'Imidacloprid';
                        else if (pest.description.toLowerCase().includes('weed')) recommendedPest = 'Herbicide';
                        else if (pest.description.toLowerCase().includes('fungus') || pest.description.toLowerCase().includes('rust')) recommendedPest = 'Fungicide';
                        else if (pest.description.toLowerCase().includes('borer')) recommendedPest = 'Chlorpyrifos';
                        else recommendedPest = 'Pesticide'; // Default
                      }
                      
                      navigation.navigate('PesticideInputPage', {
                        cropName: cropName,
                        cropHistoryId: currentRealCropId,
                        scheduledDate: pest.date.toISOString(),
                        rangeStart: pest.rangeStart.toISOString(),
                        rangeEnd: pest.rangeEnd.toISOString(),
                        activityType: pest.type,
                        description: pest.description,
                        pesticideNumber: index + 1,
                        pesticideIndex: index,
                        recommendedPesticide: selectedPesticideNames[index] || recommendedPest,
                        returnScreen: 'CropInputPage'
                      });
                    }}
                  >
                    {/* ✅ Show SELECTED badge (not saved yet, just selected) */}
                    {confirmedPesticides[index] && (
                      <View style={styles.confirmedBadgePest}>
                        <Text style={styles.confirmedBadgeTextPest}>✅ Selected</Text>
                      </View>
                    )}
                    
                    <View style={styles.activityDateHeader}>
                      <Text style={[
                        styles.activityDateTitle,
                        confirmedPesticides[index] && styles.activityDateTitleConfirmedPest
                      ]}>
                        {index === 0 ? '1st Pesticide' : `${index + 1}${index === 1 ? 'nd' : 'rd'} Pesticide`}
                      </Text>
                      <Text style={styles.activityDaysAfterPest}>{pest.daysRangeText}</Text>
                    </View>
                    {/* ✅ Show Date RANGE */}
                    <View style={styles.dateRangeRow}>
                      <Text style={styles.activityRangeTextPest}>📅 {pest.rangeText}</Text>
                    </View>
                    <Text style={styles.activityDescription}>{pest.description}</Text>
                    
                    {/* ✅ Show Selected Pesticide if user selected one */}
                    {selectedPesticideNames[index] ? (
                      <View style={[
                        styles.selectedItemBadgePest,
                        confirmedPesticides[index] && styles.selectedItemBadgePestConfirmed
                      ]}>
                        <Text style={styles.selectedItemTextPest}>✅ {selectedPesticideNames[index]}</Text>
                      </View>
                    ) : (
                      <Text style={styles.clickToAddTextPest}>👆 Tap to add pesticide details</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ✅ Harvest Date - Clickable Range */}
        {(harvestRangeText || harvestDate) && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>🌾 Harvest Schedule</Text>
            
            {/* Clickable Recommended Range from Backend */}
            {harvestRangeText && (
              <TouchableOpacity 
                style={styles.rangeInfoBoxHarvestClickable}
                onPress={() => setShowHarvestPicker(true)}
              >
                <Text style={styles.rangeInfoLabel}>📋 Recommended Harvest Window:</Text>
                <Text style={styles.harvestRangeText}>{harvestRangeText}</Text>
                <Text style={styles.clickToSelectText}>👆 Tap to select harvest date</Text>
              </TouchableOpacity>
            )}
            
            {/* Selected/Calculated Harvest Date */}
            {harvestDate && (
              <TouchableOpacity 
                style={styles.harvestDateBoxClickable}
                onPress={() => setShowHarvestPicker(true)}
              >
                <Text style={styles.calculatedDatesLabel}>📅 Selected Harvest Date:</Text>
                <Text style={styles.harvestDateText}>
                  ✅ {harvestDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
                {calculatedActivities.find(a => a.type === 'Harvesting') && (
                  <Text style={styles.harvestDaysAfter}>
                    +{calculatedActivities.find(a => a.type === 'Harvesting').daysAfter} days from sowing
                  </Text>
                )}
                <Text style={styles.clickToChangeText}>👆 Tap to change date</Text>
              </TouchableOpacity>
            )}
            
            {!harvestDate && !harvestRangeText && (
              <Text style={styles.noDateText}>Sowing date select karo - harvest date calculate hogi</Text>
            )}
          </View>
        )}
        
        {showHarvestPicker && (
          <DateTimePicker
            value={harvestDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowHarvestPicker(false);
              if (selectedDate) {
                const localDate = new Date(selectedDate);
                localDate.setHours(12, 0, 0, 0);
                setHarvestDate(localDate);
              }
            }}
          />
        )}

        {/* Yield Section */}
        {/* <View style={styles.inputContainer}>
          <Text style={styles.label}>Yield (per 40kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 10.5"
            value={yieldPer40kg}
            onChangeText={setYieldPer40kg}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View> */}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, (loading || !currentRealCropId) && styles.submitButtonDisabled]}
          onPress={handleAddCrop}
          disabled={loading || !currentRealCropId}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>
              {!currentRealCropId ? 'Select Crop First' : 'Save Crop & Schedule'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Add New Land Button */}
        <TouchableOpacity style={styles.secondaryButton} onPress={handleAddNewLand}>
          <Text style={styles.secondaryButtonText}>Add New Land to Database</Text>
        </TouchableOpacity>

        {/* ✅ Dropdown Modals */}
        <DropdownModal
          visible={showCropDropdown}
          items={[
            ...(locationBasedCrops.length > 0 ? [
              { section: true, title: `🌱 Commonly Grown in ${selectedLand?.city || 'This Area'}` },
              // ✅ Kharif crops from location
              { section: true, title: '☀️ Kharif Season' },
              ...locationBasedCrops
                .filter(crop => kharifCrops.some(k => k.toLowerCase() === crop.toLowerCase() || crop.includes(k)))
                .map(crop => ({ name: crop, isLocationBased: true, season: 'Kharif' })),
              // ✅ Rabi crops from location
              { section: true, title: '❄️ Rabi Season' },
              ...locationBasedCrops
                .filter(crop => rabiCrops.some(r => r.toLowerCase() === crop.toLowerCase() || crop.includes(r)))
                .map(crop => ({ name: crop, isLocationBased: true, season: 'Rabi' })),
              // ✅ Other crops (not in Kharif or Rabi)
              ...locationBasedCrops
                .filter(crop => 
                  !kharifCrops.some(k => k.toLowerCase() === crop.toLowerCase() || crop.includes(k)) &&
                  !rabiCrops.some(r => r.toLowerCase() === crop.toLowerCase() || crop.includes(r))
                )
                .map(crop => ({ name: crop, isLocationBased: true }))
            ] : []),
            ...(cropsList.length > 0 ? [
              { section: true, title: '🌾 All Available Crops' },
              // ✅ Kharif crops from all crops
              { section: true, title: '☀️ Kharif Season' },
              ...cropsList
                .filter(crop => {
                  const cropName = crop.crop_name || crop.name || crop;
                  return kharifCrops.some(k => k.toLowerCase() === cropName.toLowerCase() || cropName.includes(k));
                })
                .map(crop => ({ ...crop, season: 'Kharif' })),
              // ✅ Rabi crops from all crops
              { section: true, title: '❄️ Rabi Season' },
              ...cropsList
                .filter(crop => {
                  const cropName = crop.crop_name || crop.name || crop;
                  return rabiCrops.some(r => r.toLowerCase() === cropName.toLowerCase() || cropName.includes(r));
                })
                .map(crop => ({ ...crop, season: 'Rabi' })),
              // ✅ Other crops
              ...cropsList
                .filter(crop => {
                  const cropName = crop.crop_name || crop.name || crop;
                  return !kharifCrops.some(k => k.toLowerCase() === cropName.toLowerCase() || cropName.includes(k)) &&
                         !rabiCrops.some(r => r.toLowerCase() === cropName.toLowerCase() || cropName.includes(r));
                })
            ] : [])
          ]}
          onSelect={handleCropSelect}
          onClose={() => setShowCropDropdown(false)}
          title={`Select Crop${selectedLand ? ` for ${selectedLand.city}` : ''}`}
        />

        <DropdownModal
          visible={showSeasonDropdown}
          items={seasons}
          onSelect={handleSeasonSelect}
          onClose={() => setShowSeasonDropdown(false)}
          title="Select Season"
        />
      </ScrollView>
    </SafeAreaView>
  </KeyboardAvoidingView>
);
};

// ✅ UPDATED Styles Section
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  safeArea: { flex: 1 },
  scrollContainer: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  
  // ✅ Date range styles
  dateRangeContainer: {
    marginBottom: 12,
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  dateRangeLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 6,
  },
  dateRangeBox: {
    backgroundColor: '#FFE0B2',
    padding: 10,
    borderRadius: 6,
  },
  dateRangeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    textAlign: 'center',
  },
  dateRangeSubtext: {
    fontSize: 11,
    color: '#F57C00',
    textAlign: 'center',
    marginTop: 4,
  },
  dateInputButtonSelected: {
    borderColor: '#2E7D32',
    borderWidth: 2,
    backgroundColor: '#E8F5E9',
  },
  
  // ✅ Activity date styles
  activityDateBox: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  activityDateBoxClickable: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  activityDateBoxPestClickable: {
    backgroundColor: '#FFCDD2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
    borderWidth: 1,
    borderColor: '#EF9A9A',
  },
  
  // ✅ CONFIRMED (Applied) styles - Light gray background
  activityDateBoxConfirmed: {
    backgroundColor: '#E0E0E0',
    borderLeftColor: '#9E9E9E',
    borderColor: '#BDBDBD',
  },
  activityDateBoxPestConfirmed: {
    backgroundColor: '#E0E0E0',
    borderLeftColor: '#9E9E9E',
    borderColor: '#BDBDBD',
  },
  activityDateTitleConfirmed: {
    color: '#616161',
  },
  activityDateTitleConfirmedPest: {
    color: '#616161',
  },
  confirmedBadge: {
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  confirmedBadgeText: {
    fontSize: 11,
    color: 'white',
    fontWeight: 'bold',
  },
  confirmedBadgePest: {
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  confirmedBadgeTextPest: {
    fontSize: 11,
    color: 'white',
    fontWeight: 'bold',
  },
  selectedItemBadgeConfirmed: {
    backgroundColor: '#E0E0E0',
    borderColor: '#9E9E9E',
  },
  selectedItemBadgePestConfirmed: {
    backgroundColor: '#E0E0E0',
    borderColor: '#9E9E9E',
  },
  
  clickToAddText: {
    fontSize: 11,
    color: '#1565C0',
    marginTop: 6,
    fontWeight: '500',
  },
  clickToAddTextPest: {
    fontSize: 11,
    color: '#C62828',
    marginTop: 6,
    fontWeight: '500',
  },
  rangeInfoModalSubtext: {
  fontSize: 12,
  color: '#F57C00',
  textAlign: 'center',
  marginTop: 4,
},
dateRangeSubtext: {
  fontSize: 11,
  color: '#F57C00',
  textAlign: 'center',
  marginTop: 4,
},
  // ✅ Selected item badge (for selected fertilizer/pesticide)
  selectedItemBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  selectedItemText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  selectedItemBadgePest: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E57373',
  },
  selectedItemTextPest: {
    fontSize: 13,
    color: '#C62828',
    fontWeight: 'bold',
  },
  // ✅ Date range row
  dateRangeRow: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginVertical: 4,
  },
  activityRangeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
    textAlign: 'center',
  },
  activityRangeTextPest: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B71C1C',
    textAlign: 'center',
  },
  activityDaysAfterPest: {
    fontSize: 12,
    color: '#D32F2F',
    backgroundColor: '#FFCDD2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activityDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityDateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  activityDaysAfter: {
    fontSize: 12,
    color: '#1976D2',
    backgroundColor: '#BBDEFB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activityDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  activityDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  
  // ✅ Range info boxes (Backend sy)
  rangeInfoBox: {
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
    marginBottom: 10,
  },
  rangeInfoBoxPest: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
    marginBottom: 10,
  },
  rangeInfoBoxHarvest: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#388E3C',
    marginBottom: 10,
  },
  rangeInfoBoxHarvestClickable: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#388E3C',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  clickToSelectText: {
    fontSize: 11,
    color: '#2E7D32',
    marginTop: 6,
    fontWeight: '500',
  },
  rangeInfoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  rangeInfoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  harvestRangeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  
  // ✅ Calculated dates container
  calculatedDatesContainer: {
    marginTop: 8,
  },
  calculatedDatesLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  
  // ✅ Pesticide activity box
  activityDateBoxPest: {
    backgroundColor: '#FFCDD2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  
  // ✅ Harvest date styles
  harvestDateBox: {
    backgroundColor: '#C8E6C9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  harvestDateBoxClickable: {
    backgroundColor: '#C8E6C9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
    borderWidth: 1,
    borderColor: '#81C784',
  },
  clickToChangeText: {
    fontSize: 11,
    color: '#1B5E20',
    marginTop: 6,
    fontWeight: '500',
  },
  harvestDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  harvestDaysAfter: {
    fontSize: 12,
    color: '#388E3C',
    marginTop: 4,
  },
  noDateText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  
  // ✅ Section header styles for dropdown
  sectionHeader: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  
  // ✅ NEW: Crop selected textfield style
  dropdownButtonSelected: {
    borderColor: '#2E7D32',
    borderWidth: 2,
    backgroundColor: '#E8F5E9',
  },
  dropdownButtonDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  cropIdText: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    marginLeft: 4,
  },
  
  // ✅ NEW: Crop Header Styles
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  changeCropButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeCropText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: 'bold',
    marginRight: 4,
  },
  
  // ✅ Selected Crop Container
  selectedCropContainer: {
    marginTop: 8,
  },
  selectedCropBox: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  selectedCropName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  selectedCropSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  
  // ✅ Location-based crops styles
  locationCropsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationCropsText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 6,
  },
  locationCropsContainer: {
    marginTop: 6,
    padding: 8,
    backgroundColor: '#F3E5F5',
    borderRadius: 6,
  },
  locationCropsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7B1FA2',
  },
  locationCropsList: {
    fontSize: 11,
    color: '#333',
    fontWeight: 'normal',
  },
  
  // Existing styles (keep all your existing styles)
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  dropdownButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 14,
  },
  dropdownText: { fontSize: 16, color: '#333' },
  selectedLandInfo: {
    backgroundColor: '#E8F5E8', padding: 12, borderRadius: 8, marginBottom: 16,
    borderLeftWidth: 4, borderLeftColor: '#2E7D32',
  },
  selectedLandTitle: { fontSize: 14, fontWeight: 'bold', color: '#2E7D32', marginBottom: 4 },
  selectedLandText: { fontSize: 14, color: '#333', fontWeight: '600' },
  selectedLandSubtext: { fontSize: 12, color: '#666', marginTop: 2 },
  landStatusOccupied: { fontSize: 12, color: '#FF9800', fontWeight: 'bold', marginTop: 4 },
  landStatusEmpty: { fontSize: 12, color: '#4CAF50', fontWeight: 'bold', marginTop: 4 },
  
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'white',
    borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
  headerPlaceholder: { width: 24 },
  scrollContainer: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  
  // ✅ NEW: Date Sections Styles
  dateSection: { 
    marginBottom: 12 
  },
  adminDateSection: { 
    marginBottom: 12 
  },
  dateLabel: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#666', 
    marginBottom: 4 
  },
  proposedDateBox: {
    backgroundColor: '#E3F2FD', 
    padding: 12, 
    borderRadius: 8,
    borderLeftWidth: 4, 
    borderLeftColor: '#1976D2',
  },
  proposedDateText: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1976D2' 
  },
  proposedDateSubtext: { 
    fontSize: 12, 
    color: '#666', 
    marginTop: 2 
  },
  clickToUseText: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: 'bold',
    marginTop: 4,
  },
  
  // Scheduled Dates Styles
  scheduledDateContainer: {
    marginBottom: 16,
  },
  scheduledDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  scheduledDateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  changedBadge: {
    fontSize: 10,
    color: '#FF9800',
    fontWeight: 'bold',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  editableDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduledDateBox: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E7D32',
    flex: 1,
    marginRight: 8,
  },
  changedDateBox: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  scheduledDateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  scheduledDateSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  scheduledDateDesc: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  clickToEditText: {
    fontSize: 10,
    color: '#FF9800',
    fontWeight: 'bold',
    marginTop: 4,
  },
  editFertilizerButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  editFertilizerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editPesticideButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  editPesticideButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Existing styles
  dropdownButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 14,
  },
  dropdownText: { fontSize: 16, color: '#333' },
  input: {
    backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 14, fontSize: 16, color: '#333',
  },
  dateInputButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 14,
  },
  dateInputText: { fontSize: 16, color: '#333' },
  submitButton: {
    backgroundColor: '#2E7D32', borderRadius: 8, paddingVertical: 16,
    alignItems: 'center', marginTop: 8, marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: {
    backgroundColor: 'white', borderRadius: 8, paddingVertical: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#2E7D32', marginBottom: 20,
  },
  secondaryButtonText: { color: '#2E7D32', fontSize: 16, fontWeight: 'bold' },
  loadingContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  loadingText: { marginLeft: 8, color: '#666' },
  
  // Land selection styles
  landsListContainer: { backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  landsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12, backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
  },
  landsListTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  addLandButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E7D32',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6,
  },
  addLandButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  landsSection: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  landsSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  landOption: {
    padding: 12, borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: '#e0e0e0',
  },
  landOptionSelected: { borderColor: '#2E7D32', backgroundColor: '#f1f8e9' },
  emptyLandOption: { backgroundColor: '#f8f9fa' },
  occupiedLandOption: { backgroundColor: '#fff8e1' },
  landOptionText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  landOptionSubtext: { fontSize: 12, color: '#666', marginTop: 2 },
  selectedBadge: { fontSize: 10, color: '#2E7D32', fontWeight: 'bold', marginTop: 4 },
  emptyBadge: { fontSize: 10, color: '#4caf50', fontWeight: 'bold', marginTop: 4 },
  occupiedBadge: { fontSize: 10, color: '#ff9800', fontWeight: 'bold', marginTop: 4 },
  
  // Selected land info
  selectedLandInfo: {
    backgroundColor: '#E8F5E8', padding: 12, borderRadius: 8, marginBottom: 16,
    borderLeftWidth: 4, borderLeftColor: '#2E7D32',
  },
  selectedLandTitle: { fontSize: 14, fontWeight: 'bold', color: '#2E7D32', marginBottom: 4 },
  selectedLandText: { fontSize: 14, color: '#333', fontWeight: '600' },
  selectedLandSubtext: { fontSize: 12, color: '#666', marginTop: 2 },
  landStatusOccupied: { fontSize: 12, color: '#FF9800', fontWeight: 'bold', marginTop: 4 },
  landStatusEmpty: { fontSize: 12, color: '#4CAF50', fontWeight: 'bold', marginTop: 4 },
  
  // Real crop status
  realCropStatusContainer: {
    backgroundColor: '#E3F2FD', padding: 12, borderRadius: 8, marginBottom: 16,
    borderLeftWidth: 4, borderLeftColor: '#1976D2',
  },
  realCropStatusTitle: { fontSize: 14, fontWeight: 'bold', color: '#1976D2', marginBottom: 4 },
  realCropStatusText: { fontSize: 12, color: '#333' },
  
  // No lands container
  noLandsContainer: { alignItems: 'center', padding: 20 },
  noLandsText: { fontSize: 14, color: '#666', marginBottom: 12 },
  addLandButtonLarge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E7D32',
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8,
  },
  occupiedLandWarning: {
  flexDirection: 'row',
  backgroundColor: '#FFF3E0',
  padding: 12,
  borderRadius: 8,
  marginBottom: 12,
  borderLeftWidth: 4,
  borderLeftColor: '#FF9800',
  alignItems: 'center',
},
occupiedLandWarningText: {
  flex: 1,
  marginLeft: 10,
},
occupiedLandTitle: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#E65100',
  marginBottom: 2,
},
occupiedLandMessage: {
  fontSize: 12,
  color: '#F57C00',
  marginBottom: 2,
},
occupiedLandHint: {
  fontSize: 11,
  color: '#666',
  fontStyle: 'italic',
  marginTop: 2,
},
  // Modal styles
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: 'white', borderRadius: 12, padding: 16, width: '80%', maxHeight: '60%',
  },
  dropdownTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  dropdownScrollView: { maxHeight: 400 },
  dropdownItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  cropNameText: { fontSize: 16, color: '#333' },
  seedTypeText: { fontSize: 12, color: '#666' },
});

export default CropInputPage;















