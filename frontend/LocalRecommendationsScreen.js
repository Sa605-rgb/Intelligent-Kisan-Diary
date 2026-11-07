// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   StyleSheet,
//   ActivityIndicator,
//   TextInput,
//   Dimensions,
//   FlatList,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { farmerAPI } from './api';
// import { useLanguage } from './localization';

// const { width, height } = Dimensions.get('window');

// const PALETTE = {
//   bg: '#F5F5F5',
//   white: '#FFFFFF',
//   text: '#111829',
//   muted: '#6B7280',
//   green: '#16A34A',
//   greenLite: '#E7F8EA',
//   orange: '#F59E0B',
//   orangeLite: '#FEF3C7',
//   red: '#EF4444',
//   redLite: '#FEE2E2',
//   blue: '#3B82F6',
//   blueLite: '#DBEAFE',
// };

// // Seasons with dates
// const seasonsWithDates = [
//   { name: 'Rabi', label: 'ربیع', from: 'Oct 15', to: 'Apr 15' },
//   { name: 'Kharif', label: 'خریف', from: 'Apr 15', to: 'Oct 15' },
//   { name: 'All', label: 'سب', from: '', to: '' },
// ];

// // Analytics types
// const analyticsTypes = [
//   { id: 'popular_crop', label: 'mostPopularCrop', icon: 'spa' },
//   { id: 'popular_fertilizer', label: 'mostUsedFertilizer', icon: 'eco' },
//   { id: 'common_pest', label: 'mostCommonPestAttack', icon: 'bug-report' },
// ];

// // Cities list
// const cities = [
//   'Lahore', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujrat',
//   'Sialkot'
// ];

// function LocalRecommendationsScreen({ navigation }) {
//   const { t } = useLanguage();
  
//   // States
//   const [selectedCity, setSelectedCity] = useState('');
//   const [selectedArea, setSelectedArea] = useState('');
//   const [selectedSeason, setSelectedSeason] = useState('All');
//   const [selectedAnalyticsType, setSelectedAnalyticsType] = useState('');
  
//   // Dropdown states
//   const [showCityDropdown, setShowCityDropdown] = useState(false);
//   const [showAreaDropdown, setShowAreaDropdown] = useState(false);
//   const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
//   const [showAnalyticsDropdown, setShowAnalyticsDropdown] = useState(false);
  
//   // Data states
//   const [areasData, setAreasData] = useState([]);
//   const [areaSearch, setAreaSearch] = useState('');
//   const [loadingAreas, setLoadingAreas] = useState(false);
//   const [nearbyLands, setNearbyLands] = useState([]);
//   const [loadingNearby, setLoadingNearby] = useState(false);
//   const [analyticsResult, setAnalyticsResult] = useState(null);
//   const [loadingAnalytics, setLoadingAnalytics] = useState(false);
//   const [showResultModal, setShowResultModal] = useState(false);

//   // Load areas when city changes
//   useEffect(() => {
//     if (selectedCity) {
//       loadAreas();
//     }
//   }, [selectedCity]);

//   // Load areas for selected city
//   const loadAreas = async () => {
//     try {
//       setLoadingAreas(true);
//       const response = await farmerAPI.getAreasByCity(selectedCity);
//       if (response && response.areas) {
//         setAreasData(response.areas);
//       }
//     } catch (error) {
//       console.log('Error loading areas:', error);
//     } finally {
//       setLoadingAreas(false);
//     }
//   };

//   // Handle city selection
//   const handleCitySelect = (city) => {
//     setSelectedCity(city);
//     setSelectedArea('');
//     setAreasData([]);
//     setNearbyLands([]);
//     setAnalyticsResult(null);
//     setShowCityDropdown(false);
//   };

//   // Handle area selection
//   const handleAreaSelect = (areaName) => {
//     setSelectedArea(areaName);
//     setShowAreaDropdown(false);
//     setNearbyLands([]);
//     setAnalyticsResult(null);
//   };

//   // Handle season selection
//   const handleSeasonSelect = (seasonName) => {
//     setSelectedSeason(seasonName);
//     setShowSeasonDropdown(false);
//     setAnalyticsResult(null);
//   };

//   // Get nearby lands (5km radius) - Same as LandInputPage
//   const getNearbyLands = async () => {
//     if (!selectedArea) {
//       return;
//     }
    
//     try {
//       setLoadingNearby(true);
//       const response = await farmerAPI.getNearbyLandsByArea(selectedArea, 5);
      
//       if (response.success && response.nearby_lands) {
//         setNearbyLands(response.nearby_lands);
//       }
//     } catch (error) {
//       console.log('Error getting nearby lands:', error);
//     } finally {
//       setLoadingNearby(false);
//     }
//   };

//   // Calculate analytics based on nearby lands - Same as LandInputPage
//   const calculateAnalytics = async (type) => {
//     if (nearbyLands.length === 0) {
//       setAnalyticsResult(null);
//       return;
//     }
    
//     setLoadingAnalytics(true);
    
//     try {
//       // Fetch crops data for all nearby lands
//       const allCropsData = [];
      
//       for (const land of nearbyLands) {
//         try {
//           const response = await farmerAPI.getLandSeasonCrops(land.land_id, selectedSeason === 'All' ? '' : selectedSeason);
//           if (response.success && response.crops) {
//             allCropsData.push(...response.crops);
//           }
//         } catch (err) {
//           console.log('Error fetching crops for land:', land.land_id);
//         }
//       }
      
//       let result = null;
      
//       if (type === 'popular_crop') {
//         // Count crops
//         const cropCounts = {};
//         allCropsData.forEach(crop => {
//           if (crop.crop_name) {
//             cropCounts[crop.crop_name] = (cropCounts[crop.crop_name] || 0) + 1;
//           }
//         });
        
//         // Sort by count
//         const sortedCrops = Object.entries(cropCounts)
//           .sort((a, b) => b[1] - a[1])
//           .slice(0, 5);
        
//         result = {
//           type: 'popular_crop',
//           title: 'سب سے مقبول فصل',
//           titleEn: 'Most Popular Crop',
//           icon: 'spa',
//           color: PALETTE.green,
//           bgColor: PALETTE.greenLite,
//           topItem: sortedCrops[0] ? { name: sortedCrops[0][0], count: sortedCrops[0][1] } : null,
//           topList: sortedCrops.map(([name, count]) => ({ name, count })),
//           totalLands: nearbyLands.length,
//         };
//       } else if (type === 'popular_fertilizer') {
//         // Count fertilizers from crop data and activities - Same as LandInputPage
//         const fertilizerCounts = {};
//         allCropsData.forEach(crop => {
//           // Check crop.fertilizer_used field
//           if (crop.fertilizer_used) {
//             fertilizerCounts[crop.fertilizer_used] = (fertilizerCounts[crop.fertilizer_used] || 0) + 1;
//           }
//           // Check activities
//           if (crop.activities) {
//             crop.activities.forEach(activity => {
//               if (activity.activity_type === 'Fertilizer' && activity.chemical_or_fertilizer_used) {
//                 fertilizerCounts[activity.chemical_or_fertilizer_used] = (fertilizerCounts[activity.chemical_or_fertilizer_used] || 0) + 1;
//               }
//               // Also check Fertilization type with fertilizer_name
//               if (activity.activity_type === 'Fertilization' && activity.fertilizer_name) {
//                 fertilizerCounts[activity.fertilizer_name] = (fertilizerCounts[activity.fertilizer_name] || 0) + 1;
//               }
//             });
//           }
//         });
        
//         // Sort by count
//         const sortedFertilizers = Object.entries(fertilizerCounts)
//           .sort((a, b) => b[1] - a[1])
//           .slice(0, 5);
        
//         result = {
//           type: 'popular_fertilizer',
//           title: 'سب سے زیادہ استعمال ہونے والی کھاد',
//           titleEn: 'Most Used Fertilizer',
//           icon: 'eco',
//           color: PALETTE.orange,
//           bgColor: PALETTE.orangeLite,
//           topItem: sortedFertilizers[0] ? { name: sortedFertilizers[0][0], count: sortedFertilizers[0][1] } : null,
//           topList: sortedFertilizers.map(([name, count]) => ({ name, count })),
//           totalLands: nearbyLands.length,
//         };
//       } else if (type === 'common_pest') {
//         // Count pest attacks from activities - Same as LandInputPage
//         const pestCounts = {};
//         allCropsData.forEach(crop => {
//           if (crop.activities) {
//             crop.activities.forEach(activity => {
//               if (activity.activity_type === 'Pesticide' || activity.activity_type === 'Pest Control' || activity.activity_type === 'Spraying') {
//                 const pestName = activity.description || activity.chemical_or_fertilizer_used || activity.pesticide_name || 'Unknown Pest';
//                 if (pestName && pestName !== 'Unknown Pest') {
//                   pestCounts[pestName] = (pestCounts[pestName] || 0) + 1;
//                 }
//               }
//             });
//           }
//         });
        
//         // Sort by count
//         const sortedPests = Object.entries(pestCounts)
//           .sort((a, b) => b[1] - a[1])
//           .slice(0, 5);
        
//         result = {
//           type: 'common_pest',
//           title: 'سب سے عام کیڑے کا حملہ',
//           titleEn: 'Most Common Pest Attack',
//           icon: 'bug-report',
//           color: PALETTE.red,
//           bgColor: PALETTE.redLite,
//           topItem: sortedPests[0] ? { name: sortedPests[0][0], count: sortedPests[0][1] } : null,
//           topList: sortedPests.map(([name, count]) => ({ name, count })),
//           totalLands: nearbyLands.length,
//         };
//       }
      
//       setAnalyticsResult(result);
//       setShowResultModal(true);
//     } catch (error) {
//       console.log('Error calculating analytics:', error);
//     } finally {
//       setLoadingAnalytics(false);
//     }
//   };

//   // Handle analytics type selection
//   const handleAnalyticsSelect = async (type) => {
//     setSelectedAnalyticsType(type);
//     setShowAnalyticsDropdown(false);
    
//     // First get nearby lands if not already loaded
//     if (nearbyLands.length === 0 && selectedArea) {
//       await getNearbyLands();
//       // Wait a bit for state to update, then calculate
//       setTimeout(() => {
//         calculateAnalytics(type);
//       }, 500);
//     } else {
//       // Already have nearby lands, calculate directly
//       calculateAnalytics(type);
//     }
//   };

//   // Filtered areas for search
//   const filteredAreas = areasData.filter(area =>
//     !areaSearch || area.area_name.toLowerCase().includes(areaSearch.toLowerCase())
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.content}>
       

//         {/* Selection Form */}
//         <View style={styles.formCard}>
//           {/* City Dropdown */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>{t('city')}</Text>
//             <TouchableOpacity
//               style={styles.dropdownButton}
//               onPress={() => setShowCityDropdown(true)}
//             >
//               <Text style={[styles.dropdownText, !selectedCity && { color: '#999' }]}>
//                 {selectedCity ? t(selectedCity) : t('selectDistrict')}
//               </Text>
//               <Icon name="arrow-drop-down" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {/* Area Dropdown */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>{t('area')}</Text>
//             <TouchableOpacity
//               style={[styles.dropdownButton, !selectedCity && styles.disabledDropdown]}
//               onPress={() => selectedCity && setShowAreaDropdown(true)}
//               disabled={!selectedCity}
//             >
//               <Text style={[styles.dropdownText, !selectedArea && { color: '#999' }]}>
//                 {selectedArea ? t(selectedArea) : (selectedCity ? t('selectArea') : t('selectDistrictFirst'))}
//               </Text>
//               <Icon name="arrow-drop-down" size={24} color={selectedCity ? "#666" : "#ccc"} />
//             </TouchableOpacity>
//           </View>

//           {/* Season Dropdown */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>{t('season')}</Text>
//             <TouchableOpacity
//               style={styles.dropdownButton}
//               onPress={() => setShowSeasonDropdown(true)}
//             >
//               <Text style={styles.dropdownText}>
//                 {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'}
//               </Text>
//               <Icon name="arrow-drop-down" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {/* Analytics Type Dropdown */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>{t('analyticsType')}</Text>
//             <TouchableOpacity
//               style={[styles.dropdownButton, !selectedArea && styles.disabledDropdown]}
//               onPress={() => selectedArea && setShowAnalyticsDropdown(true)}
//               disabled={!selectedArea}
//             >
//               <Text style={[styles.dropdownText, !selectedAnalyticsType && { color: '#999' }]}>
//                 {selectedAnalyticsType 
//                   ? t(analyticsTypes.find(a => a.id === selectedAnalyticsType)?.label) 
//                   : t('selectAnalyticsType')}
//               </Text>
//               <Icon name="arrow-drop-down" size={24} color={selectedArea ? "#666" : "#ccc"} />
//             </TouchableOpacity>
//           </View>

//           {/* Info Card */}
//           <View style={styles.infoCard}>
//             <Icon name="info" size={20} color={PALETTE.blue} />
//             <Text style={styles.infoText}>
//               5 کلومیٹر کے دائرے میں قریبی کسانوں کی سرگرمیوں کا تجزیہ
//             </Text>
//           </View>
//         </View>

//         {/* Quick Analytics Buttons - REMOVED */}

//         {/* Loading Indicator */}
//         {(loadingNearby || loadingAnalytics) && (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={PALETTE.green} />
//             <Text style={styles.loadingText}>
//               {loadingNearby ? 'قریبی زمینیں لوڈ ہو رہی ہیں...' : 'تجزیات کا حساب ہو رہا ہے...'}
//             </Text>
//           </View>
//         )}
//       </ScrollView>

//       {/* City Dropdown Modal */}
//       <Modal visible={showCityDropdown} transparent animationType="fade">
//         <TouchableOpacity 
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setShowCityDropdown(false)}
//         >
//           <View style={styles.dropdownMenu}>
//             <Text style={styles.dropdownTitle}>{t('selectDistrictTitle')}</Text>
//             <ScrollView style={styles.dropdownScrollView}>
//               {cities.map((city, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.dropdownItem}
//                   onPress={() => handleCitySelect(city)}
//                 >
//                   <Text style={styles.dropdownItemText}>{t(city)}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Area Dropdown Modal */}
//       <Modal visible={showAreaDropdown} transparent animationType="fade">
//         <TouchableOpacity 
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setShowAreaDropdown(false)}
//         >
//           <View style={[styles.dropdownMenu, { height: height * 0.6 }]}>
//             <Text style={styles.dropdownTitle}>{t('selectAreaInCity')} {t(selectedCity)}</Text>
            
//             <View style={styles.searchContainer}>
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder={t('searchArea')}
//                 value={areaSearch}
//                 onChangeText={setAreaSearch}
//                 placeholderTextColor="#999"
//               />
//               <Icon name="search" size={20} color="#666" />
//             </View>
            
//             <ScrollView style={styles.dropdownScrollView}>
//               {loadingAreas ? (
//                 <View style={styles.loadingContainer}>
//                   <ActivityIndicator size="small" color={PALETTE.green} />
//                   <Text style={styles.loadingText}>{t('loadingAreas')}</Text>
//                 </View>
//               ) : filteredAreas.length > 0 ? (
//                 filteredAreas.map((area, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.dropdownItem}
//                     onPress={() => handleAreaSelect(area.area_name)}
//                   >
//                     <View style={styles.areaItemContent}>
//                       <Text style={styles.dropdownItemText}>{t(area.area_name)}</Text>
//                       <Text style={styles.areaZoneText}>{area.description}</Text>
//                     </View>
//                     <Icon name="chevron-right" size={20} color="#999" />
//                   </TouchableOpacity>
//                 ))
//               ) : (
//                 <View style={styles.noDataContainer}>
//                   <Text style={styles.noDataText}>{t('noAreasFound')}</Text>
//                 </View>
//               )}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Season Dropdown Modal */}
//       <Modal visible={showSeasonDropdown} transparent animationType="fade">
//         <TouchableOpacity 
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setShowSeasonDropdown(false)}
//         >
//           <View style={styles.dropdownMenu}>
//             <Text style={styles.dropdownTitle}>{t('selectSeasonTitle')}</Text>
//             <ScrollView style={styles.dropdownScrollView}>
//               {seasonsWithDates.map((season, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.dropdownItem,
//                     selectedSeason === season.name && { backgroundColor: PALETTE.greenLite }
//                   ]}
//                   onPress={() => handleSeasonSelect(season.name)}
//                 >
//                   <View>
//                     <Text style={styles.dropdownItemText}>{season.label} ({season.name})</Text>
//                     {season.from && (
//                       <Text style={styles.seasonDateText}>
//                         {season.from} - {season.to}
//                       </Text>
//                     )}
//                   </View>
//                   {selectedSeason === season.name && (
//                     <Icon name="check" size={20} color={PALETTE.green} />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Analytics Type Dropdown Modal */}
//       <Modal visible={showAnalyticsDropdown} transparent animationType="fade">
//         <TouchableOpacity 
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setShowAnalyticsDropdown(false)}
//         >
//           <View style={styles.dropdownMenu}>
//             <Text style={styles.dropdownTitle}>{t('selectAnalyticsType')}</Text>
//             <ScrollView style={styles.dropdownScrollView}>
//               {analyticsTypes.map((type, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.dropdownItem,
//                     selectedAnalyticsType === type.id && { backgroundColor: PALETTE.greenLite }
//                   ]}
//                   onPress={() => handleAnalyticsSelect(type.id)}
//                 >
//                   <View style={styles.analyticsItemContent}>
//                     <Icon name={type.icon} size={24} color={PALETTE.green} />
//                     <Text style={styles.dropdownItemText}>{t(type.label)}</Text>
//                   </View>
//                   {selectedAnalyticsType === type.id && (
//                     <Icon name="check" size={20} color={PALETTE.green} />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Analytics Result Modal */}
//       <Modal visible={showResultModal} transparent animationType="slide">
//         <View style={styles.resultModalOverlay}>
//           <View style={styles.resultModalContent}>
//             {/* Modal Header */}
//             <View style={styles.resultModalHeader}>
//               <Text style={styles.resultModalTitle}>
//                 {analyticsResult?.title || 'تجزیات'}
//               </Text>
//               <TouchableOpacity onPress={() => setShowResultModal(false)}>
//                 <Icon name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>

//             {loadingAnalytics ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color={PALETTE.green} />
//                 <Text style={styles.loadingText}>تجزیات کا حساب ہو رہا ہے...</Text>
//               </View>
//             ) : analyticsResult ? (
//               <ScrollView style={styles.resultScrollView}>
//                 {/* Main Result Card */}
//                 <View style={[styles.mainResultCard, { backgroundColor: analyticsResult.bgColor }]}>
//                   <Icon name={analyticsResult.icon} size={50} color={analyticsResult.color} />
//                   {analyticsResult.topItem ? (
//                     <>
//                       <Text style={styles.mainResultName}>{t(analyticsResult.topItem.name)}</Text>
//                       <Text style={styles.mainResultCount}>
//                         {analyticsResult.topItem.count} کسانوں نے استعمال کیا
//                       </Text>
//                     </>
//                   ) : (
//                     <Text style={styles.noDataText}>کوئی ڈیٹا دستیاب نہیں</Text>
//                   )}
//                 </View>

//                 {/* Stats */}
//                 <View style={styles.statsRow}>
//                   <View style={styles.statCard}>
//                     <Text style={styles.statValue}>{analyticsResult.totalLands}</Text>
//                     <Text style={styles.statLabel}>زمینوں کا تجزیہ</Text>
//                   </View>
//                   <View style={styles.statCard}>
//                     <Text style={styles.statValue}>5 کلومیٹر</Text>
//                     <Text style={styles.statLabel}>دائرہ</Text>
//                   </View>
//                 </View>

//                 {/* Top 5 List */}
//                 {analyticsResult.topList && analyticsResult.topList.length > 0 && (
//                   <View style={styles.topListCard}>
//                     <Text style={styles.topListTitle}>
//                       {analyticsResult.type === 'popular_crop' ? 'سرفہرست 5 فصلیں' :
//                        analyticsResult.type === 'popular_fertilizer' ? 'سرفہرست 5 کھادیں' :
//                        'سرفہرست 5 کیڑے مار دوائیں'}
//                     </Text>
//                     {analyticsResult.topList.map((item, index) => (
//                       <View key={index} style={styles.topListItem}>
//                         <View style={styles.topListRank}>
//                           <Text style={styles.topListRankText}>{index + 1}</Text>
//                         </View>
//                         <Text style={styles.topListName}>{t(item.name)}</Text>
//                         <Text style={styles.topListCount}>{item.count}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 )}

//                 {/* Season Info */}
//                 <View style={styles.seasonInfoCard}>
//                   <Icon name="calendar-today" size={20} color={PALETTE.muted} />
//                   <Text style={styles.seasonInfoText}>
//                     موسم: {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'}
//                   </Text>
//                 </View>
//               </ScrollView>
//             ) : (
//               <View style={styles.noDataContainer}>
//                 <Icon name="info" size={50} color={PALETTE.muted} />
//                 <Text style={styles.noDataText}>کوئی ڈیٹا دستیاب نہیں</Text>
//               </View>
//             )}

//             {/* Close Button */}
//             <TouchableOpacity
//               style={styles.closeResultButton}
//               onPress={() => setShowResultModal(false)}
//             >
//               <Text style={styles.closeResultButtonText}>{t('close')}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: PALETTE.bg,
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   header: {
//     marginBottom: 20,
//     alignItems: 'center',
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
//   formCard: {
//     backgroundColor: PALETTE.white,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   inputGroup: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: PALETTE.text,
//     marginBottom: 8,
//     textAlign: 'right',
//   },
//   dropdownButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#F9FAFB',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//   },
//   disabledDropdown: {
//     backgroundColor: '#F3F4F6',
//     borderColor: '#E5E7EB',
//   },
//   dropdownText: {
//     fontSize: 14,
//     color: PALETTE.text,
//   },
//   infoCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: PALETTE.blueLite,
//     borderRadius: 8,
//     padding: 12,
//     marginTop: 8,
//   },
//   infoText: {
//     fontSize: 12,
//     color: PALETTE.blue,
//     marginLeft: 8,
//     flex: 1,
//     textAlign: 'right',
//   },
//   quickButtonsContainer: {
//     marginBottom: 16,
//   },
//   quickButtonsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     textAlign: 'right',
//     marginBottom: 12,
//   },
//   quickButtonsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   quickButton: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//     borderRadius: 12,
//     marginHorizontal: 4,
//   },
//   quickButtonText: {
//     fontSize: 11,
//     color: PALETTE.text,
//     textAlign: 'center',
//     marginTop: 8,
//     fontWeight: '500',
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     padding: 30,
//   },
//   loadingText: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     marginTop: 12,
//     textAlign: 'center',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dropdownMenu: {
//     backgroundColor: PALETTE.white,
//     borderRadius: 12,
//     width: width * 0.85,
//     maxHeight: height * 0.5,
//     padding: 16,
//   },
//   dropdownTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     textAlign: 'center',
//     marginBottom: 12,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   dropdownScrollView: {
//     maxHeight: height * 0.35,
//   },
//   dropdownItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   dropdownItemText: {
//     fontSize: 14,
//     color: PALETTE.text,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginBottom: 12,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 10,
//     fontSize: 14,
//     color: PALETTE.text,
//   },
//   areaItemContent: {
//     flex: 1,
//   },
//   areaZoneText: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginTop: 2,
//   },
//   seasonDateText: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginTop: 2,
//   },
//   analyticsItemContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   noDataContainer: {
//     alignItems: 'center',
//     padding: 30,
//   },
//   noDataText: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   resultModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   resultModalContent: {
//     backgroundColor: PALETTE.white,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: height * 0.8,
//     padding: 20,
//   },
//   resultModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   resultModalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//   },
//   resultScrollView: {
//     maxHeight: height * 0.55,
//   },
//   mainResultCard: {
//     alignItems: 'center',
//     padding: 24,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   mainResultName: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     marginTop: 12,
//     textAlign: 'center',
//   },
//   mainResultCount: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     marginTop: 4,
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     marginHorizontal: 4,
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: PALETTE.green,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     marginTop: 4,
//   },
//   topListCard: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//   },
//   topListTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: PALETTE.text,
//     textAlign: 'right',
//     marginBottom: 12,
//   },
//   topListItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   topListRank: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: PALETTE.green,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   topListRankText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: PALETTE.white,
//   },
//   topListName: {
//     flex: 1,
//     fontSize: 14,
//     color: PALETTE.text,
//   },
//   topListCount: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: PALETTE.green,
//   },
//   seasonInfoCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F9FAFB',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   seasonInfoText: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     marginLeft: 8,
//   },
//   closeResultButton: {
//     backgroundColor: PALETTE.green,
//     borderRadius: 8,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   closeResultButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: PALETTE.white,
//   },
// });

// export default LocalRecommendationsScreen;





// //yeah data hai jis ma abi sirf profit loss ka kam 
// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   StyleSheet,
//   ActivityIndicator,
//   TextInput,
//   Dimensions,
//   FlatList,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { farmerAPI } from './api';
// import { useLanguage } from './localization';

// const { width, height } = Dimensions.get('window');

// const PALETTE = {
//   bg: '#F5F5F5',
//   white: '#FFFFFF',
//   text: '#111829',
//   muted: '#6B7280',
//   green: '#16A34A',
//   greenLite: '#E7F8EA',
//   orange: '#F59E0B',
//   orangeLite: '#FEF3C7',
//   red: '#EF4444',
//   redLite: '#FEE2E2',
//   blue: '#3B82F6',
//   blueLite: '#DBEAFE',
//   purple: '#8B5CF6',
//   purpleLite: '#EDE9FE',
// };

// // Seasons with dates
// const seasonsWithDates = [
//   { name: 'Rabi', label: 'ربیع', from: 'Oct 15', to: 'Apr 15' },
//   { name: 'Kharif', label: 'خریف', from: 'Apr 15', to: 'Oct 15' },
//   { name: 'All', label: 'سب', from: '', to: '' },
// ];

// // ✅ Analytics Types
// const analyticsTypes = [
//   { id: 'popular_crop', label: 'mostPopularCrop', icon: 'spa', color: PALETTE.green, bgColor: PALETTE.greenLite },
//   { id: 'popular_fertilizer', label: 'mostUsedFertilizer', icon: 'eco', color: PALETTE.orange, bgColor: PALETTE.orangeLite },
//   { id: 'common_pest', label: 'mostCommonPestAttack', icon: 'bug-report', color: PALETTE.red, bgColor: PALETTE.redLite },
//   { id: 'profit_loss', label: 'profitLossAnalysis', icon: 'trending-up', color: PALETTE.purple, bgColor: PALETTE.purpleLite },
// ];

// // Cities list
// const cities = [
//   'Lahore', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujrat', 'Sialkot'
// ];

// function LocalRecommendationsScreen({ navigation }) {
//   const { t } = useLanguage();
  
//   // States
//   const [selectedCity, setSelectedCity] = useState('');
//   const [selectedArea, setSelectedArea] = useState('');
//   const [selectedSeason, setSelectedSeason] = useState('All');
//   const [selectedAnalyticsType, setSelectedAnalyticsType] = useState('');
  
//   // Dropdown states
//   const [showCityDropdown, setShowCityDropdown] = useState(false);
//   const [showAreaDropdown, setShowAreaDropdown] = useState(false);
//   const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
//   const [showAnalyticsDropdown, setShowAnalyticsDropdown] = useState(false);
  
//   // Data states
//   const [areasData, setAreasData] = useState([]);
//   const [areaSearch, setAreaSearch] = useState('');
//   const [loadingAreas, setLoadingAreas] = useState(false);
//   const [nearbyLands, setNearbyLands] = useState([]);
//   const [loadingNearby, setLoadingNearby] = useState(false);
//   const [analyticsResult, setAnalyticsResult] = useState(null);
//   const [loadingAnalytics, setLoadingAnalytics] = useState(false);
//   const [showResultModal, setShowResultModal] = useState(false);

//   // Load areas when city changes
//   useEffect(() => {
//     if (selectedCity) {
//       loadAreas();
//     }
//   }, [selectedCity]);

//   // Load areas for selected city
//   const loadAreas = async () => {
//     try {
//       setLoadingAreas(true);
//       const response = await farmerAPI.getAreasByCity(selectedCity);
//       if (response && response.areas) {
//         setAreasData(response.areas);
//       }
//     } catch (error) {
//       console.log('Error loading areas:', error);
//     } finally {
//       setLoadingAreas(false);
//     }
//   };

//   // Handle city selection
//   const handleCitySelect = (city) => {
//     setSelectedCity(city);
//     setSelectedArea('');
//     setAreasData([]);
//     setNearbyLands([]);
//     setAnalyticsResult(null);
//     setShowCityDropdown(false);
//   };

//   // Handle area selection
//   const handleAreaSelect = (areaName) => {
//     setSelectedArea(areaName);
//     setShowAreaDropdown(false);
//     setNearbyLands([]);
//     setAnalyticsResult(null);
//   };

//   // Handle season selection
//   const handleSeasonSelect = (seasonName) => {
//     setSelectedSeason(seasonName);
//     setShowSeasonDropdown(false);
//     setAnalyticsResult(null);
//   };

//   // Get nearby lands (5km radius)
//   const getNearbyLands = async () => {
//     if (!selectedArea) {
//       return;
//     }
    
//     try {
//       setLoadingNearby(true);
//       const response = await farmerAPI.getNearbyLandsByArea(selectedArea, 5);
      
//       if (response.success && response.nearby_lands) {
//         setNearbyLands(response.nearby_lands);
//       }
//     } catch (error) {
//       console.log('Error getting nearby lands:', error);
//     } finally {
//       setLoadingNearby(false);
//     }
//   };

//   // ✅ NEW: Calculate Profit/Loss Analytics
//   const calculateProfitLossAnalytics = async () => {
//     if (nearbyLands.length === 0) {
//       return null;
//     }
    
//     const allCropsData = [];
//     const profitLossData = [];
    
//     for (const land of nearbyLands) {
//       try {
//         const response = await farmerAPI.getLandSeasonCrops(land.land_id, selectedSeason === 'All' ? '' : selectedSeason);
        
//         if (response.success && response.crops) {
//           for (const crop of response.crops) {
//             // Calculate total cost from activities
//             let totalCost = 0;
//             let hasYield = false;
//             let yieldValue = 0;
//             let yieldBags = 0;
//             let activitiesList = [];
            
//             // Activities se total cost nikaalo aur activities store karo
//             if (crop.activities && crop.activities.length > 0) {
//               crop.activities.forEach(activity => {
//                 const cost = parseFloat(activity.activity_cost) || 0;
//                 if (cost > 0) {
//                   totalCost += cost;
//                 }
//                 activitiesList.push({
//                   type: activity.activity_type,
//                   date: activity.activity_date,
//                   cost: cost,
//                   description: activity.description,
//                   chemical: activity.chemical_or_fertilizer_used,
//                 });
//               });
//             }
            
//             // Yield se income calculate karo (2000 per 40kg bag)
//             if (crop.yield_per_40kg && crop.yield_per_40kg > 0) {
//               hasYield = true;
//               yieldBags = parseFloat(crop.yield_per_40kg);
//               yieldValue = yieldBags * 2000;
//             }
            
//             const netProfit = yieldValue - totalCost;
//             const isProfit = netProfit >= 0;
//             const roi = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(1) : (hasYield ? '100' : 'N/A');
            
//             profitLossData.push({
//               land_id: land.land_id,
//               farmer_name: land.farmer_name,
//               farmer_phone: land.farmer_phone,
//               crop_name: crop.crop_name,
//               season: crop.season,
//               total_cost: totalCost,
//               yield_bags: yieldBags,
//               revenue: yieldValue,
//               profit_or_loss: netProfit,
//               is_profit: isProfit,
//               roi: roi,
//               has_yield: hasYield,
//               sowing_date: crop.sowing_date,
//               harvest_date: crop.harvest_date,
//               activities: activitiesList,  // ✅ SAVING ACTIVITIES
//             });
            
//             allCropsData.push(crop);
//           }
//         }
//       } catch (err) {
//         console.log('Error fetching profit data for land:', land.land_id, err);
//       }
//     }
    
//     // Sort by profit (highest first)
//     const sortedByProfit = [...profitLossData]
//       .filter(d => d.has_yield)
//       .sort((a, b) => b.profit_or_loss - a.profit_or_loss);
    
//     const sortedByLoss = [...profitLossData]
//       .filter(d => d.has_yield && !d.is_profit)
//       .sort((a, b) => a.profit_or_loss - b.profit_or_loss);
    
//     // Calculate summary
//     const profitableCrops = profitLossData.filter(d => d.is_profit && d.has_yield);
//     const lossCrops = profitLossData.filter(d => !d.is_profit && d.has_yield);
//     const pendingYield = profitLossData.filter(d => !d.has_yield);
    
//     const totalProfit = profitableCrops.reduce((sum, d) => sum + d.profit_or_loss, 0);
//     const totalLoss = Math.abs(lossCrops.reduce((sum, d) => sum + d.profit_or_loss, 0));
    
//     // Find most profitable crop type
//     const cropProfitMap = {};
//     profitableCrops.forEach(crop => {
//       if (!cropProfitMap[crop.crop_name]) {
//         cropProfitMap[crop.crop_name] = { total_profit: 0, count: 0 };
//       }
//       cropProfitMap[crop.crop_name].total_profit += crop.profit_or_loss;
//       cropProfitMap[crop.crop_name].count += 1;
//     });
    
//     const bestCropType = Object.entries(cropProfitMap)
//       .sort((a, b) => b[1].total_profit - a[1].total_profit)[0];
    
//     return {
//       type: 'profit_loss',
//       title: 'فصلوں کا منافع/نقصان تجزیہ',
//       titleEn: 'Crop Profit/Loss Analysis',
//       icon: 'trending-up',
//       color: PALETTE.purple,
//       bgColor: PALETTE.purpleLite,
//       allData: profitLossData,
//       topProfit: sortedByProfit[0] || null,
//       topLoss: sortedByLoss[0] || null,
//       mostProfitableCrop: bestCropType ? { name: bestCropType[0], total_profit: bestCropType[1].total_profit, count: bestCropType[1].count } : null,
//       summary: {
//         total_crops: profitLossData.length,
//         profitable_crops: profitableCrops.length,
//         loss_crops: lossCrops.length,
//         pending_yield: pendingYield.length,
//         total_profit: totalProfit,
//         total_loss: totalLoss,
//         net_overall: totalProfit - totalLoss,
//       },
//       totalLands: nearbyLands.length,
//     };
//   };

//   // Calculate analytics based on nearby lands
//   const calculateAnalytics = async (type) => {
//     if (nearbyLands.length === 0 && selectedArea) {
//       await getNearbyLands();
//       setTimeout(() => {
//         calculateAnalyticsWithData(type);
//       }, 500);
//       return;
//     }
//     calculateAnalyticsWithData(type);
//   };
  
//   const calculateAnalyticsWithData = async (type) => {
//     if (nearbyLands.length === 0) {
//       setAnalyticsResult(null);
//       return;
//     }
    
//     setLoadingAnalytics(true);
    
//     try {
//       if (type === 'profit_loss') {
//         const result = await calculateProfitLossAnalytics();
//         setAnalyticsResult(result);
//         setShowResultModal(true);
//         setLoadingAnalytics(false);
//         return;
//       }
      
//       // Original analytics for other types
//       const allCropsData = [];
      
//       for (const land of nearbyLands) {
//         try {
//           const response = await farmerAPI.getLandSeasonCrops(land.land_id, selectedSeason === 'All' ? '' : selectedSeason);
//           if (response.success && response.crops) {
//             allCropsData.push(...response.crops);
//           }
//         } catch (err) {
//           console.log('Error fetching crops for land:', land.land_id);
//         }
//       }
      
//       let result = null;
      
//       if (type === 'popular_crop') {
//         const cropCounts = {};
//         allCropsData.forEach(crop => {
//           if (crop.crop_name) {
//             cropCounts[crop.crop_name] = (cropCounts[crop.crop_name] || 0) + 1;
//           }
//         });
        
//         const sortedCrops = Object.entries(cropCounts)
//           .sort((a, b) => b[1] - a[1])
//           .slice(0, 5);
        
//         result = {
//           type: 'popular_crop',
//           title: 'سب سے مقبول فصل',
//           titleEn: 'Most Popular Crop',
//           icon: 'spa',
//           color: PALETTE.green,
//           bgColor: PALETTE.greenLite,
//           topItem: sortedCrops[0] ? { name: sortedCrops[0][0], count: sortedCrops[0][1] } : null,
//           topList: sortedCrops.map(([name, count]) => ({ name, count })),
//           totalLands: nearbyLands.length,
//         };
//       } else if (type === 'popular_fertilizer') {
//         const fertilizerCounts = {};
//         allCropsData.forEach(crop => {
//           if (crop.fertilizer_used) {
//             fertilizerCounts[crop.fertilizer_used] = (fertilizerCounts[crop.fertilizer_used] || 0) + 1;
//           }
//           if (crop.activities) {
//             crop.activities.forEach(activity => {
//               if (activity.activity_type === 'Fertilizer' && activity.chemical_or_fertilizer_used) {
//                 fertilizerCounts[activity.chemical_or_fertilizer_used] = (fertilizerCounts[activity.chemical_or_fertilizer_used] || 0) + 1;
//               }
//               if (activity.activity_type === 'Fertilization' && activity.fertilizer_name) {
//                 fertilizerCounts[activity.fertilizer_name] = (fertilizerCounts[activity.fertilizer_name] || 0) + 1;
//               }
//             });
//           }
//         });
        
//         const sortedFertilizers = Object.entries(fertilizerCounts)
//           .sort((a, b) => b[1] - a[1])
//           .slice(0, 5);
        
//         result = {
//           type: 'popular_fertilizer',
//           title: 'سب سے زیادہ استعمال ہونے والی کھاد',
//           titleEn: 'Most Used Fertilizer',
//           icon: 'eco',
//           color: PALETTE.orange,
//           bgColor: PALETTE.orangeLite,
//           topItem: sortedFertilizers[0] ? { name: sortedFertilizers[0][0], count: sortedFertilizers[0][1] } : null,
//           topList: sortedFertilizers.map(([name, count]) => ({ name, count })),
//           totalLands: nearbyLands.length,
//         };
//       } else if (type === 'common_pest') {
//         const pestCounts = {};
//         allCropsData.forEach(crop => {
//           if (crop.activities) {
//             crop.activities.forEach(activity => {
//               if (activity.activity_type === 'Pesticide' || activity.activity_type === 'Pest Control' || activity.activity_type === 'Spraying') {
//                 const pestName = activity.description || activity.chemical_or_fertilizer_used || activity.pesticide_name || 'Unknown Pest';
//                 if (pestName && pestName !== 'Unknown Pest') {
//                   pestCounts[pestName] = (pestCounts[pestName] || 0) + 1;
//                 }
//               }
//             });
//           }
//         });
        
//         const sortedPests = Object.entries(pestCounts)
//           .sort((a, b) => b[1] - a[1])
//           .slice(0, 5);
        
//         result = {
//           type: 'common_pest',
//           title: 'سب سے عام کیڑے کا حملہ',
//           titleEn: 'Most Common Pest Attack',
//           icon: 'bug-report',
//           color: PALETTE.red,
//           bgColor: PALETTE.redLite,
//           topItem: sortedPests[0] ? { name: sortedPests[0][0], count: sortedPests[0][1] } : null,
//           topList: sortedPests.map(([name, count]) => ({ name, count })),
//           totalLands: nearbyLands.length,
//         };
//       }
      
//       setAnalyticsResult(result);
//       setShowResultModal(true);
//     } catch (error) {
//       console.log('Error calculating analytics:', error);
//     } finally {
//       setLoadingAnalytics(false);
//     }
//   };

//   // Handle analytics type selection
//   const handleAnalyticsSelect = async (type) => {
//     setSelectedAnalyticsType(type);
//     setShowAnalyticsDropdown(false);
    
//     if (nearbyLands.length === 0 && selectedArea) {
//       await getNearbyLands();
//       setTimeout(() => {
//         calculateAnalyticsWithData(type);
//       }, 500);
//     } else {
//       calculateAnalyticsWithData(type);
//     }
//   };

//   // Filtered areas for search
//   const filteredAreas = areasData.filter(area =>
//     !areaSearch || area.area_name.toLowerCase().includes(areaSearch.toLowerCase())
//   );

//   // ✅ Helper function to get activity icon
//   const getActivityIconForType = (activityType) => {
//     const icons = {
//       'Plowing': '🚜',
//       'Sowing': '🌱',
//       'Irrigation': '💧',
//       'Fertilization': '🌿',
//       'Spraying': '💨',
//       'Pest Control': '🐛',
//       'Weeding': '🌾',
//       'Harvesting': '🌾',
//       'Harvest': '🌾',
//     };
//     return icons[activityType] || '📝';
//   };

//   // ✅ Helper function to show full details including activities
//   const showCropDetailsWithActivities = (item) => {
//     if (!item.has_yield) {
//       Alert.alert(
//         `⏳ ${item.crop_name} - ${item.farmer_name}`,
//         `یہ فصل ابھی مکمل نہیں ہوئی۔\nپیداوار درج ہونے کے بعد منافع/نقصان کا حساب لگایا جا سکے گا۔`
//       );
//       return;
//     }

//     // Build activities list string
//     let activitiesText = '';
//     if (item.activities && item.activities.length > 0) {
//       activitiesText = '\n\n📋 **سرگرمیاں (Activities):**\n';
//       item.activities.forEach((act, idx) => {
//         const costText = act.cost > 0 ? `Rs ${act.cost.toFixed(0)}` : 'No cost';
//         activitiesText += `${idx + 1}. ${getActivityIconForType(act.type)} ${act.type}\n`;
//         activitiesText += `   📅 تاریخ: ${act.date || 'N/A'}\n`;
//         activitiesText += `   💰 لاگت: ${costText}\n`;
//         if (act.chemical) {
//           activitiesText += `   🧪 استعمال: ${act.chemical}\n`;
//         }
//         activitiesText += `   📝 تفصیل: ${act.description || 'N/A'}\n\n`;
//       });
//     } else {
//       activitiesText = '\n\n⚠️ کوئی سرگرمی درج نہیں';
//     }

//     Alert.alert(
//       `📊 ${item.crop_name} - ${item.farmer_name}`,
//       `👨‍🌾 **کسان:** ${item.farmer_name}\n` +
//       `📞 **فون:** ${item.farmer_phone || 'N/A'}\n` +
//       `🌾 **فصل:** ${item.crop_name}\n` +
//       `📅 **موسم:** ${item.season}\n` +
//       `🗓️ **بوائی:** ${item.sowing_date || 'N/A'}\n` +
//       `🗓️ **کٹائی:** ${item.harvest_date || 'N/A'}\n\n` +
//       `💰 **کل لاگت:** Rs ${item.total_cost.toFixed(0)}\n` +
//       `🌾 **پیداوار:** ${item.yield_bags}بوریاں\n` +
//       `💵 **آمدنی:** Rs ${item.revenue.toFixed(0)}\n\n` +
//       `📊 **${item.is_profit ? '✅ منافع' : '❌ نقصان'}:** Rs ${Math.abs(item.profit_or_loss).toFixed(0)}\n` +
//       `📈 **ROI:** ${item.roi}%\n` +
//       `${activitiesText}\n` +
//       `💡 **تجزیه:** ${item.is_profit ? 
//         'اس فصل میں منافع ہوا ہے۔ اچھی کاشتکاری! 👍' : 
//         'اس فصل میں نقصان ہوا ہے۔ اگلی بار لاگت کم کرنے کی کوشش کریں۔ 💡'}`
//     );
//   };

//   // ✅ Render Profit/Loss Result Modal Content (CLICKABLE)
//   const renderProfitLossContent = () => {
//     if (!analyticsResult || analyticsResult.type !== 'profit_loss') return null;
    
//     const data = analyticsResult;
    
//     return (
//       <ScrollView style={styles.resultScrollView}>
//         {/* Summary Stats */}
//         <View style={styles.profitSummaryStats}>
//           <View style={styles.profitStatItem}>
//             <Text style={styles.profitStatValue}>{data.summary.total_crops}</Text>
//             <Text style={styles.profitStatLabel}>کل فصلیں</Text>
//           </View>
//           <View style={styles.profitStatItem}>
//             <Text style={[styles.profitStatValue, { color: '#16A34A' }]}>{data.summary.profitable_crops}</Text>
//             <Text style={styles.profitStatLabel}>منافع والی</Text>
//           </View>
//           <View style={styles.profitStatItem}>
//             <Text style={[styles.profitStatValue, { color: '#DC2626' }]}>{data.summary.loss_crops}</Text>
//             <Text style={styles.profitStatLabel}>نقصان والی</Text>
//           </View>
//           <View style={styles.profitStatItem}>
//             <Text style={[styles.profitStatValue, { color: '#F59E0B' }]}>{data.summary.pending_yield}</Text>
//             <Text style={styles.profitStatLabel}>پیداوار باقی</Text>
//           </View>
//         </View>

//         {/* Net Overall */}
//         <View style={[
//           styles.netOverallCard,
//           data.summary.net_overall >= 0 ? styles.netProfitCard : styles.netLossCard
//         ]}>
//           <Text style={styles.netOverallLabel}>مجموعی منافع/نقصان</Text>
//           <Text style={[
//             styles.netOverallValue,
//             data.summary.net_overall >= 0 ? styles.netProfitValue : styles.netLossValue
//           ]}>
//             {data.summary.net_overall >= 0 ? '+' : ''}Rs {Math.abs(data.summary.net_overall).toFixed(0)}
//           </Text>
//         </View>

//         {/* Top Profit - CLICKABLE */}
//         {data.topProfit && (
//           <TouchableOpacity 
//             style={styles.topProfitCard}
//             onPress={() => showCropDetailsWithActivities(data.topProfit)}
//           >
//             <View style={styles.topProfitHeader}>
//               <Icon name="emoji-events" size={20} color="#16A34A" />
//               <Text style={styles.topProfitTitle}>🏆 سب سے زیادہ منافع</Text>
//               <Icon name="info" size={16} color="#16A34A" />
//             </View>
//             <View style={styles.profitLossRow}>
//               <Text style={styles.profitLossName}>{data.topProfit.crop_name}</Text>
//               <Text style={styles.profitLossFarmer}>- {data.topProfit.farmer_name}</Text>
//             </View>
//             <View style={styles.profitLossDetails}>
//               <View style={styles.profitDetailRow}>
//                 <Icon name="payments" size={14} color="#16A34A" />
//                 <Text style={styles.profitDetail}>منافع: Rs {data.topProfit.profit_or_loss.toFixed(0)}</Text>
//               </View>
//               <View style={styles.profitDetailRow}>
//                 <Icon name="trending-up" size={14} color="#16A34A" />
//                 <Text style={styles.profitDetail}>ROI: {data.topProfit.roi}%</Text>
//               </View>
//               <View style={styles.profitDetailRow}>
//                 <Icon name="grass" size={14} color="#16A34A" />
//                 <Text style={styles.profitDetail}>پیداوار: {data.topProfit.yield_bags}بوریاں </Text>
//               </View>
//               <View style={styles.profitDetailRow}>
//                 <Icon name="receipt" size={14} color="#16A34A" />
//                 <Text style={styles.profitDetail}>لاگت: Rs {data.topProfit.total_cost.toFixed(0)}</Text>
//               </View>
//             </View>
//             <Text style={styles.clickHint}>👆 مزید تفصیلات کے لیے کلک کریں</Text>
//           </TouchableOpacity>
//         )}

//         {/* Top Loss - CLICKABLE */}
//         {data.topLoss && data.topLoss.has_yield && (
//           <TouchableOpacity 
//             style={styles.topLossCard}
//             onPress={() => showCropDetailsWithActivities(data.topLoss)}
//           >
//             <View style={styles.topLossHeader}>
//               <Icon name="warning" size={20} color="#DC2626" />
//               <Text style={styles.topLossTitle}>⚠️ سب سے زیادہ نقصان</Text>
//               <Icon name="info" size={16} color="#DC2626" />
//             </View>
//             <View style={styles.profitLossRow}>
//               <Text style={styles.profitLossName}>{data.topLoss.crop_name}</Text>
//               <Text style={styles.profitLossFarmer}>- {data.topLoss.farmer_name}</Text>
//             </View>
//             <View style={styles.profitLossDetails}>
//               <View style={styles.lossDetailRow}>
//                 <Icon name="money-off" size={14} color="#DC2626" />
//                 <Text style={styles.lossDetail}>نقصان: Rs {Math.abs(data.topLoss.profit_or_loss).toFixed(0)}</Text>
//               </View>
//               <View style={styles.lossDetailRow}>
//                 <Icon name="trending-down" size={14} color="#DC2626" />
//                 <Text style={styles.lossDetail}>ROI: {data.topLoss.roi}%</Text>
//               </View>
//             </View>
//             <Text style={styles.clickHint}>👆 مزید تفصیلات کے لیے کلک کریں</Text>
//           </TouchableOpacity>
//         )}

//         {/* Most Profitable Crop Type */}
//         {data.mostProfitableCrop && (
//           <View style={styles.mostProfitableCard}>
//             <View style={styles.mostProfitableHeader}>
//               <Icon name="star" size={20} color="#F59E0B" />
//               <Text style={styles.mostProfitableTitle}>سب سے زیادہ منافع والی فصل</Text>
//             </View>
//             <Text style={styles.mostProfitableCropName}>{data.mostProfitableCrop.name}</Text>
//             <Text style={styles.mostProfitableStats}>
//               کل منافع: Rs {data.mostProfitableCrop.total_profit.toFixed(0)} • {data.mostProfitableCrop.count} کسان
//             </Text>
//           </View>
//         )}

//         {/* All Crops List - CLICKABLE */}
//         <View style={styles.allCropsList}>
//           <Text style={styles.allCropsTitle}>تمام فصلیں ({data.allData.length})</Text>
//           {data.allData.map((item, index) => (
//             <TouchableOpacity 
//               key={index} 
//               style={[
//                 styles.cropProfitItem,
//                 item.has_yield ? (item.is_profit ? styles.profitItem : styles.lossItem) : styles.pendingItem
//               ]}
//               onPress={() => showCropDetailsWithActivities(item)}
//             >
//               <View style={styles.cropProfitHeader}>
//                 <View style={styles.cropProfitLeft}>
//                   <Text style={styles.cropProfitName}>{item.crop_name}</Text>
//                   <Text style={styles.cropProfitFarmer}>{item.farmer_name}</Text>
//                 </View>
//                 {item.has_yield ? (
//                   item.is_profit ? (
//                     <View style={styles.profitBadge}>
//                       <Icon name="trending-up" size={12} color="white" />
//                       <Text style={styles.badgeText}>منافع</Text>
//                     </View>
//                   ) : (
//                     <View style={styles.lossBadge}>
//                       <Icon name="trending-down" size={12} color="white" />
//                       <Text style={styles.badgeText}>نقصان</Text>
//                     </View>
//                   )
//                 ) : (
//                   <View style={styles.pendingBadge}>
//                     <Icon name="hourglass-empty" size={12} color="white" />
//                     <Text style={styles.badgeText}>زیر التواء</Text>
//                   </View>
//                 )}
//               </View>
              
//               <View style={styles.cropProfitFooter}>
//                 {item.has_yield ? (
//                   <>
//                     <Text style={[styles.cropProfitAmount, item.is_profit ? styles.profitAmount : styles.lossAmount]}>
//                       {item.is_profit ? `+Rs ${item.profit_or_loss.toFixed(0)}` : `-Rs ${Math.abs(item.profit_or_loss).toFixed(0)}`}
//                     </Text>
//                     <Text style={styles.cropProfitROI}>ROI: {item.roi}%</Text>
//                     <Text style={styles.cropProfitYield}>🌾 {item.yield_bags}بوریاں </Text>
//                   </>
//                 ) : (
//                   <Text style={styles.pendingText}>پیداوار درج نہیں</Text>
//                 )}
//               </View>
//               <Text style={styles.clickHintSmall}>👆 تفصیلات کے لیے کلک کریں</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Season Info */}
//         <View style={styles.seasonInfoCard}>
//           <Icon name="calendar-today" size={16} color={PALETTE.muted} />
//           <Text style={styles.seasonInfoText}>
//             موسم: {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'} • {data.totalLands} زمینوں کا تجزیہ
//           </Text>
//         </View>
//       </ScrollView>
//     );
//   };

//   // ✅ Render Regular Analytics Content
//   const renderRegularAnalyticsContent = () => {
//     if (!analyticsResult || analyticsResult.type === 'profit_loss') return null;
    
//     const data = analyticsResult;
    
//     return (
//       <ScrollView style={styles.resultScrollView}>
//         <View style={[styles.mainResultCard, { backgroundColor: data.bgColor }]}>
//           <Icon name={data.icon} size={50} color={data.color} />
//           {data.topItem ? (
//             <>
//               <Text style={styles.mainResultName}>{t(data.topItem.name)}</Text>
//               <Text style={styles.mainResultCount}>
//                 {data.topItem.count} کسانوں نے استعمال کیا
//               </Text>
//             </>
//           ) : (
//             <Text style={styles.noDataText}>کوئی ڈیٹا دستیاب نہیں</Text>
//           )}
//         </View>

//         <View style={styles.statsRow}>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>{data.totalLands}</Text>
//             <Text style={styles.statLabel}>زمینوں کا تجزیہ</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>5 کلومیٹر</Text>
//             <Text style={styles.statLabel}>دائرہ</Text>
//           </View>
//         </View>

//         {data.topList && data.topList.length > 0 && (
//           <View style={styles.topListCard}>
//             <Text style={styles.topListTitle}>
//               {data.type === 'popular_crop' ? 'سرفہرست 5 فصلیں' :
//                data.type === 'popular_fertilizer' ? 'سرفہرست 5 کھادیں' :
//                'سرفہرست 5 کیڑے مار دوائیں'}
//             </Text>
//             {data.topList.map((item, index) => (
//               <View key={index} style={styles.topListItem}>
//                 <View style={[styles.topListRank, { backgroundColor: data.color }]}>
//                   <Text style={styles.topListRankText}>{index + 1}</Text>
//                 </View>
//                 <Text style={styles.topListName}>{t(item.name)}</Text>
//                 <Text style={[styles.topListCount, { color: data.color }]}>{item.count}</Text>
//               </View>
//             ))}
//           </View>
//         )}

//         <View style={styles.seasonInfoCard}>
//           <Icon name="calendar-today" size={16} color={PALETTE.muted} />
//           <Text style={styles.seasonInfoText}>
//             موسم: {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'}
//           </Text>
//         </View>
//       </ScrollView>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.content}>
//         <View style={styles.formCard}>
//           {/* City Dropdown */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>{t('city')}</Text>
//             <TouchableOpacity
//               style={styles.dropdownButton}
//               onPress={() => setShowCityDropdown(true)}
//             >
//               <Text style={[styles.dropdownText, !selectedCity && { color: '#999' }]}>
//                 {selectedCity ? t(selectedCity) : t('selectDistrict')}
//               </Text>
//               <Icon name="arrow-drop-down" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {/* Area Dropdown */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>{t('area')}</Text>
//             <TouchableOpacity
//               style={[styles.dropdownButton, !selectedCity && styles.disabledDropdown]}
//               onPress={() => selectedCity && setShowAreaDropdown(true)}
//               disabled={!selectedCity}
//             >
//               <Text style={[styles.dropdownText, !selectedArea && { color: '#999' }]}>
//                 {selectedArea ? t(selectedArea) : (selectedCity ? t('selectArea') : t('selectDistrictFirst'))}
//               </Text>
//               <Icon name="arrow-drop-down" size={24} color={selectedCity ? "#666" : "#ccc"} />
//             </TouchableOpacity>
//           </View>

//           {/* Season Dropdown */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>{t('season')}</Text>
//             <TouchableOpacity
//               style={styles.dropdownButton}
//               onPress={() => setShowSeasonDropdown(true)}
//             >
//               <Text style={styles.dropdownText}>
//                 {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'}
//               </Text>
//               <Icon name="arrow-drop-down" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {/* Analytics Type Dropdown */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>{t('analyticsType')}</Text>
//             <TouchableOpacity
//               style={[styles.dropdownButton, !selectedArea && styles.disabledDropdown]}
//               onPress={() => selectedArea && setShowAnalyticsDropdown(true)}
//               disabled={!selectedArea}
//             >
//               <Text style={[styles.dropdownText, !selectedAnalyticsType && { color: '#999' }]}>
//                 {selectedAnalyticsType 
//                   ? t(analyticsTypes.find(a => a.id === selectedAnalyticsType)?.label) 
//                   : t('selectAnalyticsType')}
//               </Text>
//               <Icon name="arrow-drop-down" size={24} color={selectedArea ? "#666" : "#ccc"} />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.infoCard}>
//             <Icon name="info" size={20} color={PALETTE.blue} />
//             <Text style={styles.infoText}>5 کلومیٹر کے دائرے میں قریبی کسانوں کی سرگرمیوں کا تجزیہ</Text>
//           </View>
//         </View>

//         {(loadingNearby || loadingAnalytics) && (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={PALETTE.green} />
//             <Text style={styles.loadingText}>
//               {loadingNearby ? 'قریبی زمینیں لوڈ ہو رہی ہیں...' : 'تجزیات کا حساب ہو رہا ہے...'}
//             </Text>
//           </View>
//         )}
//       </ScrollView>

//       {/* City Dropdown Modal */}
//       <Modal visible={showCityDropdown} transparent animationType="fade">
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCityDropdown(false)}>
//           <View style={styles.dropdownMenu}>
//             <Text style={styles.dropdownTitle}>{t('selectDistrictTitle')}</Text>
//             <ScrollView style={styles.dropdownScrollView}>
//               {cities.map((city, index) => (
//                 <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleCitySelect(city)}>
//                   <Text style={styles.dropdownItemText}>{t(city)}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Area Dropdown Modal */}
//       <Modal visible={showAreaDropdown} transparent animationType="fade">
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAreaDropdown(false)}>
//           <View style={[styles.dropdownMenu, { height: height * 0.6 }]}>
//             <Text style={styles.dropdownTitle}>{t('selectAreaInCity')} {t(selectedCity)}</Text>
//             <View style={styles.searchContainer}>
//               <TextInput style={styles.searchInput} placeholder={t('searchArea')} value={areaSearch} onChangeText={setAreaSearch} placeholderTextColor="#999" />
//               <Icon name="search" size={20} color="#666" />
//             </View>
//             <ScrollView style={styles.dropdownScrollView}>
//               {loadingAreas ? (
//                 <View style={styles.loadingContainer}>
//                   <ActivityIndicator size="small" color={PALETTE.green} />
//                   <Text style={styles.loadingText}>{t('loadingAreas')}</Text>
//                 </View>
//               ) : filteredAreas.length > 0 ? (
//                 filteredAreas.map((area, index) => (
//                   <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleAreaSelect(area.area_name)}>
//                     <View style={styles.areaItemContent}>
//                       <Text style={styles.dropdownItemText}>{t(area.area_name)}</Text>
//                       <Text style={styles.areaZoneText}>{area.description}</Text>
//                     </View>
//                     <Icon name="chevron-right" size={20} color="#999" />
//                   </TouchableOpacity>
//                 ))
//               ) : (
//                 <View style={styles.noDataContainer}>
//                   <Text style={styles.noDataText}>{t('noAreasFound')}</Text>
//                 </View>
//               )}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Season Dropdown Modal */}
//       <Modal visible={showSeasonDropdown} transparent animationType="fade">
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSeasonDropdown(false)}>
//           <View style={styles.dropdownMenu}>
//             <Text style={styles.dropdownTitle}>{t('selectSeasonTitle')}</Text>
//             <ScrollView style={styles.dropdownScrollView}>
//               {seasonsWithDates.map((season, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[styles.dropdownItem, selectedSeason === season.name && { backgroundColor: PALETTE.greenLite }]}
//                   onPress={() => handleSeasonSelect(season.name)}
//                 >
//                   <View>
//                     <Text style={styles.dropdownItemText}>{season.label} ({season.name})</Text>
//                     {season.from && <Text style={styles.seasonDateText}>{season.from} - {season.to}</Text>}
//                   </View>
//                   {selectedSeason === season.name && <Icon name="check" size={20} color={PALETTE.green} />}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Analytics Type Dropdown Modal */}
//       <Modal visible={showAnalyticsDropdown} transparent animationType="fade">
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAnalyticsDropdown(false)}>
//           <View style={styles.dropdownMenu}>
//             <Text style={styles.dropdownTitle}>{t('selectAnalyticsType')}</Text>
//             <ScrollView style={styles.dropdownScrollView}>
//               {analyticsTypes.map((type, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[styles.dropdownItem, selectedAnalyticsType === type.id && { backgroundColor: type.bgColor }]}
//                   onPress={() => handleAnalyticsSelect(type.id)}
//                 >
//                   <View style={styles.analyticsItemContent}>
//                     <Icon name={type.icon} size={24} color={type.color} />
//                     <Text style={styles.dropdownItemText}>{t(type.label)}</Text>
//                   </View>
//                   {selectedAnalyticsType === type.id && <Icon name="check" size={20} color={type.color} />}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Analytics Result Modal */}
//       <Modal visible={showResultModal} transparent animationType="slide">
//         <View style={styles.resultModalOverlay}>
//           <View style={styles.resultModalContent}>
//             <View style={styles.resultModalHeader}>
//               <Text style={styles.resultModalTitle}>{analyticsResult?.title || 'تجزیات'}</Text>
//               <TouchableOpacity onPress={() => setShowResultModal(false)}>
//                 <Icon name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>

//             {loadingAnalytics ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color={PALETTE.green} />
//                 <Text style={styles.loadingText}>تجزیات کا حساب ہو رہا ہے...</Text>
//               </View>
//             ) : analyticsResult ? (
//               analyticsResult.type === 'profit_loss' 
//                 ? renderProfitLossContent() 
//                 : renderRegularAnalyticsContent()
//             ) : (
//               <View style={styles.noDataContainer}>
//                 <Icon name="info" size={50} color={PALETTE.muted} />
//                 <Text style={styles.noDataText}>کوئی ڈیٹا دستیاب نہیں</Text>
//               </View>
//             )}

//             <TouchableOpacity style={styles.closeResultButton} onPress={() => setShowResultModal(false)}>
//               <Text style={styles.closeResultButtonText}>{t('close')}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: PALETTE.bg },
//   content: { padding: 16, paddingBottom: 32 },
//   formCard: { backgroundColor: PALETTE.white, borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
//   inputGroup: { marginBottom: 16 },
//   inputLabel: { fontSize: 14, fontWeight: '600', color: PALETTE.text, marginBottom: 8, textAlign: 'right' },
//   dropdownButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12 },
//   disabledDropdown: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
//   dropdownText: { fontSize: 14, color: PALETTE.text },
//   infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.blueLite, borderRadius: 8, padding: 12, marginTop: 8 },
//   infoText: { fontSize: 12, color: PALETTE.blue, marginLeft: 8, flex: 1, textAlign: 'right' },
//   loadingContainer: { alignItems: 'center', padding: 30 },
//   loadingText: { fontSize: 14, color: PALETTE.muted, marginTop: 12 },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
//   dropdownMenu: { backgroundColor: PALETTE.white, borderRadius: 12, width: width * 0.85, maxHeight: height * 0.5, padding: 16 },
//   dropdownTitle: { fontSize: 16, fontWeight: 'bold', color: PALETTE.text, textAlign: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
//   dropdownScrollView: { maxHeight: height * 0.35 },
//   dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
//   dropdownItemText: { fontSize: 14, color: PALETTE.text },
//   searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
//   searchInput: { flex: 1, paddingVertical: 10, fontSize: 14 },
//   areaItemContent: { flex: 1 },
//   areaZoneText: { fontSize: 12, color: PALETTE.muted, marginTop: 2 },
//   seasonDateText: { fontSize: 12, color: PALETTE.muted, marginTop: 2 },
//   analyticsItemContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   noDataContainer: { alignItems: 'center', padding: 30 },
//   noDataText: { fontSize: 14, color: PALETTE.muted, textAlign: 'center', marginTop: 8 },
//   resultModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//   resultModalContent: { backgroundColor: PALETTE.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: height * 0.85, padding: 20 },
//   resultModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
//   resultModalTitle: { fontSize: 18, fontWeight: 'bold', color: PALETTE.text },
//   resultScrollView: { maxHeight: height * 0.6 },
//   mainResultCard: { alignItems: 'center', padding: 24, borderRadius: 12, marginBottom: 16 },
//   mainResultName: { fontSize: 22, fontWeight: 'bold', color: PALETTE.text, marginTop: 12, textAlign: 'center' },
//   mainResultCount: { fontSize: 14, color: PALETTE.muted, marginTop: 4 },
//   statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
//   statCard: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16, alignItems: 'center', marginHorizontal: 4 },
//   statValue: { fontSize: 18, fontWeight: 'bold', color: PALETTE.green },
//   statLabel: { fontSize: 12, color: PALETTE.muted, marginTop: 4 },
//   topListCard: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, marginBottom: 16 },
//   topListTitle: { fontSize: 14, fontWeight: 'bold', color: PALETTE.text, textAlign: 'right', marginBottom: 12 },
//   topListItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
//   topListRank: { width: 28, height: 28, borderRadius: 14, backgroundColor: PALETTE.green, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
//   topListRankText: { fontSize: 12, fontWeight: 'bold', color: PALETTE.white },
//   topListName: { flex: 1, fontSize: 14, color: PALETTE.text },
//   topListCount: { fontSize: 14, fontWeight: 'bold', color: PALETTE.green },
//   seasonInfoCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 16 },
//   seasonInfoText: { fontSize: 12, color: PALETTE.muted, marginLeft: 8 },
//   closeResultButton: { backgroundColor: PALETTE.green, borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
//   closeResultButtonText: { fontSize: 16, fontWeight: 'bold', color: PALETTE.white },
  
//   // ✅ PROFIT/LOSS SPECIFIC STYLES
//   profitSummaryStats: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
//   profitStatItem: { width: '48%', backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 8 },
//   profitStatValue: { fontSize: 20, fontWeight: 'bold', color: PALETTE.text },
//   profitStatLabel: { fontSize: 11, color: PALETTE.muted, marginTop: 4 },
//   netOverallCard: { borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center' },
//   netProfitCard: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#4CAF50' },
//   netLossCard: { backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: '#EF5350' },
//   netOverallLabel: { fontSize: 12, color: PALETTE.muted, marginBottom: 4 },
//   netOverallValue: { fontSize: 24, fontWeight: 'bold' },
//   netProfitValue: { color: '#2E7D32' },
//   netLossValue: { color: '#DC2626' },
//   topProfitCard: { backgroundColor: '#E8F5E9', borderRadius: 12, padding: 16, marginBottom: 16 },
//   topProfitHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
//   topProfitTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32', flex: 1 },
//   topLossCard: { backgroundColor: '#FFEBEE', borderRadius: 12, padding: 16, marginBottom: 16 },
//   topLossHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
//   topLossTitle: { fontSize: 16, fontWeight: 'bold', color: '#DC2626', flex: 1 },
//   profitLossRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   profitLossName: { fontSize: 18, fontWeight: 'bold', color: PALETTE.text },
//   profitLossFarmer: { fontSize: 14, color: PALETTE.muted, marginLeft: 6 },
//   profitLossDetails: { marginTop: 8 },
//   profitDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
//   profitDetail: { fontSize: 13, color: '#2E7D32' },
//   lossDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
//   lossDetail: { fontSize: 13, color: '#DC2626' },
//   clickHint: { fontSize: 10, color: '#666', fontStyle: 'italic', marginTop: 8, textAlign: 'center' },
//   clickHintSmall: { fontSize: 9, color: '#999', fontStyle: 'italic', marginTop: 6, textAlign: 'right' },
//   mostProfitableCard: { backgroundColor: '#FEF3C7', borderRadius: 12, padding: 16, marginBottom: 16 },
//   mostProfitableHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
//   mostProfitableTitle: { fontSize: 14, fontWeight: 'bold', color: '#F59E0B' },
//   mostProfitableCropName: { fontSize: 20, fontWeight: 'bold', color: PALETTE.text, marginBottom: 4 },
//   mostProfitableStats: { fontSize: 12, color: PALETTE.muted },
//   allCropsList: { marginBottom: 16 },
//   allCropsTitle: { fontSize: 16, fontWeight: 'bold', color: PALETTE.text, marginBottom: 12, textAlign: 'right' },
//   cropProfitItem: { backgroundColor: '#F9FAFB', borderRadius: 10, padding: 12, marginBottom: 8 },
//   profitItem: { borderLeftWidth: 4, borderLeftColor: '#16A34A' },
//   lossItem: { borderLeftWidth: 4, borderLeftColor: '#DC2626' },
//   pendingItem: { borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
//   cropProfitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   cropProfitLeft: { flex: 1 },
//   cropProfitName: { fontSize: 16, fontWeight: 'bold', color: PALETTE.text },
//   cropProfitFarmer: { fontSize: 12, color: PALETTE.muted, marginTop: 2 },
//   profitBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16A34A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
//   lossBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DC2626', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
//   pendingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
//   badgeText: { fontSize: 10, fontWeight: 'bold', color: 'white' },
//   cropProfitFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   cropProfitAmount: { fontSize: 16, fontWeight: 'bold' },
//   profitAmount: { color: '#16A34A' },
//   lossAmount: { color: '#DC2626' },
//   cropProfitROI: { fontSize: 12, color: PALETTE.muted },
//   cropProfitYield: { fontSize: 12, color: PALETTE.green },
//   pendingText: { fontSize: 12, color: '#F59E0B', fontStyle: 'italic' },
// });

// export default LocalRecommendationsScreen;




//yeh data hai aik acre pa ktny mund crop hoi wla 
// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   StyleSheet,
//   ActivityIndicator,
//   TextInput,
//   Dimensions,
//   FlatList,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { farmerAPI } from './api';
// import { useLanguage } from './localization';

// const { width, height } = Dimensions.get('window');

// const PALETTE = {
//   bg: '#F5F5F5',
//   white: '#FFFFFF',
//   text: '#111829',
//   muted: '#6B7280',
//   green: '#16A34A',
//   greenLite: '#E7F8EA',
//   orange: '#F59E0B',
//   orangeLite: '#FEF3C7',
//   red: '#EF4444',
//   redLite: '#FEE2E2',
//   blue: '#3B82F6',
//   blueLite: '#DBEAFE',
//   purple: '#8B5CF6',
//   purpleLite: '#EDE9FE',
// };

// // Seasons with dates
// const seasonsWithDates = [
//   { name: 'Rabi', label: 'ربیع', from: 'Oct 15', to: 'Apr 15' },
//   { name: 'Kharif', label: 'خریف', from: 'Apr 15', to: 'Oct 15' },
//   { name: 'All', label: 'سب', from: '', to: '' },
// ];

// // Analytics Types
// const analyticsTypes = [
//   { id: 'popular_crop', label: 'mostPopularCrop', icon: 'spa', color: PALETTE.green, bgColor: PALETTE.greenLite },
//   { id: 'popular_fertilizer', label: 'mostUsedFertilizer', icon: 'eco', color: PALETTE.orange, bgColor: PALETTE.orangeLite },
//   { id: 'common_pest', label: 'mostCommonPestAttack', icon: 'bug-report', color: PALETTE.red, bgColor: PALETTE.redLite },
//   { id: 'profit_loss', label: 'profitLossAnalysis', icon: 'trending-up', color: PALETTE.purple, bgColor: PALETTE.purpleLite },
// ];

// // Cities list
// const cities = ['Lahore', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujrat', 'Sialkot'];

// function LocalRecommendationsScreen({ navigation }) {
//   const { t } = useLanguage();
  
//   // States
//   const [selectedCity, setSelectedCity] = useState('');
//   const [selectedArea, setSelectedArea] = useState('');
//   const [selectedSeason, setSelectedSeason] = useState('All');
//   const [selectedAnalyticsType, setSelectedAnalyticsType] = useState('');
  
//   // Dropdown states
//   const [showCityDropdown, setShowCityDropdown] = useState(false);
//   const [showAreaDropdown, setShowAreaDropdown] = useState(false);
//   const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
//   const [showAnalyticsDropdown, setShowAnalyticsDropdown] = useState(false);
  
//   // Data states
//   const [areasData, setAreasData] = useState([]);
//   const [areaSearch, setAreaSearch] = useState('');
//   const [loadingAreas, setLoadingAreas] = useState(false);
//   const [nearbyLands, setNearbyLands] = useState([]);
//   const [loadingNearby, setLoadingNearby] = useState(false);
//   const [analyticsResult, setAnalyticsResult] = useState(null);
//   const [loadingAnalytics, setLoadingAnalytics] = useState(false);
//   const [showResultModal, setShowResultModal] = useState(false);

//   // Load areas when city changes
//   useEffect(() => {
//     if (selectedCity) {
//       loadAreas();
//     }
//   }, [selectedCity]);

//   // Load areas for selected city
//   const loadAreas = async () => {
//     try {
//       setLoadingAreas(true);
//       const response = await farmerAPI.getAreasByCity(selectedCity);
//       if (response && response.areas) {
//         setAreasData(response.areas);
//       }
//     } catch (error) {
//       console.log('Error loading areas:', error);
//     } finally {
//       setLoadingAreas(false);
//     }
//   };

//   // Handle city selection
//   const handleCitySelect = (city) => {
//     setSelectedCity(city);
//     setSelectedArea('');
//     setAreasData([]);
//     setNearbyLands([]);
//     setAnalyticsResult(null);
//     setShowCityDropdown(false);
//   };

//   // Handle area selection
//   const handleAreaSelect = (areaName) => {
//     setSelectedArea(areaName);
//     setShowAreaDropdown(false);
//     setNearbyLands([]);
//     setAnalyticsResult(null);
//   };

//   // Handle season selection
//   const handleSeasonSelect = (seasonName) => {
//     setSelectedSeason(seasonName);
//     setShowSeasonDropdown(false);
//     setAnalyticsResult(null);
//   };

//   // Get nearby lands (5km radius)
//   const getNearbyLands = async () => {
//     if (!selectedArea) {
//       return;
//     }
    
//     try {
//       setLoadingNearby(true);
//       const response = await farmerAPI.getNearbyLandsByArea(selectedArea, 5);
      
//       if (response.success && response.nearby_lands) {
//         setNearbyLands(response.nearby_lands);
//       }
//     } catch (error) {
//       console.log('Error getting nearby lands:', error);
//     } finally {
//       setLoadingNearby(false);
//     }
//   };

//   // ✅ Calculate Profit/Loss Analytics with Profit Percentage (NOT ROI)
//   // ✅ FIXED: Calculate Profit/Loss Analytics with CORRECT area_size from land_info
// const calculateProfitLossAnalytics = async () => {
//   if (nearbyLands.length === 0) {
//     return null;
//   }
  
//   const profitLossData = [];
  
//   for (const land of nearbyLands) {
//     try {
//       const response = await farmerAPI.getLandSeasonCrops(land.land_id, selectedSeason === 'All' ? '' : selectedSeason);
      
//       if (response.success && response.crops) {
//         // ✅ FIX: Area size land_info se lo (crop se nahi)
//         const landAreaSize = response.land_info?.area_size ? parseFloat(response.land_info.area_size) : 1;
//         const landAreaUnit = response.land_info?.area_unit || 'acres';
        
//         console.log(`📊 Land ID: ${land.land_id}, Area: ${landAreaSize} ${landAreaUnit}`);
        
//         for (const crop of response.crops) {
//           // Calculate total cost from activities
//           let totalCost = 0;
//           let hasYield = false;
//           let yieldValue = 0;
//           let yieldBags = 0;
//           let activitiesList = [];
          
//           if (crop.activities && crop.activities.length > 0) {
//             crop.activities.forEach(activity => {
//               const cost = parseFloat(activity.activity_cost) || 0;
//               if (cost > 0) {
//                 totalCost += cost;
//               }
//               activitiesList.push({
//                 type: activity.activity_type,
//                 date: activity.activity_date,
//                 cost: cost,
//                 description: activity.description,
//                 chemical: activity.chemical_or_fertilizer_used,
//               });
//             });
//           }
          
//           // Yield se income calculate karo (2000 per 40kg bag)
//           if (crop.yield_per_40kg && crop.yield_per_40kg > 0) {
//             hasYield = true;
//             yieldBags = parseFloat(crop.yield_per_40kg);
//             yieldValue = yieldBags * 2000;
//           }
          
//           const netProfit = yieldValue - totalCost;
//           const isProfit = netProfit >= 0;
          
//           // ✅ PROFIT PERCENTAGE of REVENUE
//           let profitPercentage = 'N/A';
//           if (hasYield && yieldValue > 0) {
//             const percentValue = (netProfit / yieldValue) * 100;
//             profitPercentage = percentValue.toFixed(1);
//           }
          
//           // ✅ FIX: Yield per Acre - LAND KI ACTUAL AREA USE KARO
//           const totalKg = yieldBags * 40;
//           const bagsPerAcre = (yieldBags / landAreaSize).toFixed(1);
//           const kgPerAcre = (totalKg / landAreaSize).toFixed(0);
//           const maundPerAcre = (kgPerAcre / 40).toFixed(1);
          
//           profitLossData.push({
//             land_id: land.land_id,
//             farmer_name: land.farmer_name,
//             farmer_phone: land.farmer_phone,
//             crop_name: crop.crop_name,
//             season: crop.season,
//             total_cost: totalCost,
//             yield_bags: yieldBags,
//             revenue: yieldValue,
//             profit_or_loss: netProfit,
//             is_profit: isProfit,
//             profitPercentage: profitPercentage,
//             has_yield: hasYield,
//             sowing_date: crop.sowing_date,
//             harvest_date: crop.harvest_date,
//             area_size: landAreaSize,  // ✅ LAND KI ACTUAL AREA
//             area_unit: landAreaUnit,
//             bags_per_acre: bagsPerAcre,
//             kg_per_acre: kgPerAcre,
//             maund_per_acre: maundPerAcre,
//             total_kg: totalKg,
//             activities: activitiesList,
//           });
//         }
//       }
//     } catch (err) {
//       console.log('Error fetching profit data for land:', land.land_id, err);
//     }
//   }
  
//   // Sort by profit (highest first)
//   const sortedByProfit = [...profitLossData]
//     .filter(d => d.has_yield)
//     .sort((a, b) => b.profit_or_loss - a.profit_or_loss);
  
//   const sortedByLoss = [...profitLossData]
//     .filter(d => d.has_yield && !d.is_profit)
//     .sort((a, b) => a.profit_or_loss - b.profit_or_loss);
  
//   // Calculate summary
//   const profitableCrops = profitLossData.filter(d => d.is_profit && d.has_yield);
//   const lossCrops = profitLossData.filter(d => !d.is_profit && d.has_yield);
//   const pendingYield = profitLossData.filter(d => !d.has_yield);
  
//   const totalProfit = profitableCrops.reduce((sum, d) => sum + d.profit_or_loss, 0);
//   const totalLoss = Math.abs(lossCrops.reduce((sum, d) => sum + d.profit_or_loss, 0));
  
//   // Find most profitable crop type
//   const cropProfitMap = {};
//   profitableCrops.forEach(crop => {
//     if (!cropProfitMap[crop.crop_name]) {
//       cropProfitMap[crop.crop_name] = { total_profit: 0, count: 0 };
//     }
//     cropProfitMap[crop.crop_name].total_profit += crop.profit_or_loss;
//     cropProfitMap[crop.crop_name].count += 1;
//   });
  
//   const bestCropType = Object.entries(cropProfitMap)
//     .sort((a, b) => b[1].total_profit - a[1].total_profit)[0];
  
//   return {
//     type: 'profit_loss',
//     title: 'فصلوں کا منافع/نقصان تجزیہ',
//     titleEn: 'Crop Profit/Loss Analysis',
//     icon: 'trending-up',
//     color: PALETTE.purple,
//     bgColor: PALETTE.purpleLite,
//     allData: profitLossData,
//     topProfit: sortedByProfit[0] || null,
//     topLoss: sortedByLoss[0] || null,
//     mostProfitableCrop: bestCropType ? { name: bestCropType[0], total_profit: bestCropType[1].total_profit, count: bestCropType[1].count } : null,
//     summary: {
//       total_crops: profitLossData.length,
//       profitable_crops: profitableCrops.length,
//       loss_crops: lossCrops.length,
//       pending_yield: pendingYield.length,
//       total_profit: totalProfit,
//       total_loss: totalLoss,
//       net_overall: totalProfit - totalLoss,
//     },
//     totalLands: nearbyLands.length,
//   };
// };

//   // Calculate analytics based on nearby lands
//   const calculateAnalytics = async (type) => {
//     if (nearbyLands.length === 0 && selectedArea) {
//       await getNearbyLands();
//       setTimeout(() => {
//         calculateAnalyticsWithData(type);
//       }, 500);
//       return;
//     }
//     calculateAnalyticsWithData(type);
//   };
  
//   const calculateAnalyticsWithData = async (type) => {
//     if (nearbyLands.length === 0) {
//       setAnalyticsResult(null);
//       return;
//     }
    
//     setLoadingAnalytics(true);
    
//     try {
//       if (type === 'profit_loss') {
//         const result = await calculateProfitLossAnalytics();
//         setAnalyticsResult(result);
//         setShowResultModal(true);
//         setLoadingAnalytics(false);
//         return;
//       }
      
//       // Original analytics for other types
//       const allCropsData = [];
      
//       for (const land of nearbyLands) {
//         try {
//           const response = await farmerAPI.getLandSeasonCrops(land.land_id, selectedSeason === 'All' ? '' : selectedSeason);
//           if (response.success && response.crops) {
//             allCropsData.push(...response.crops);
//           }
//         } catch (err) {
//           console.log('Error fetching crops for land:', land.land_id);
//         }
//       }
      
//       let result = null;
      
//       if (type === 'popular_crop') {
//         const cropCounts = {};
//         allCropsData.forEach(crop => {
//           if (crop.crop_name) {
//             cropCounts[crop.crop_name] = (cropCounts[crop.crop_name] || 0) + 1;
//           }
//         });
        
//         const sortedCrops = Object.entries(cropCounts)
//           .sort((a, b) => b[1] - a[1])
//           .slice(0, 5);
        
//         result = {
//           type: 'popular_crop',
//           title: 'سب سے مقبول فصل',
//           titleEn: 'Most Popular Crop',
//           icon: 'spa',
//           color: PALETTE.green,
//           bgColor: PALETTE.greenLite,
//           topItem: sortedCrops[0] ? { name: sortedCrops[0][0], count: sortedCrops[0][1] } : null,
//           topList: sortedCrops.map(([name, count]) => ({ name, count })),
//           totalLands: nearbyLands.length,
//         };
//       } else if (type === 'popular_fertilizer') {
//         const fertilizerCounts = {};
//         allCropsData.forEach(crop => {
//           if (crop.fertilizer_used) {
//             fertilizerCounts[crop.fertilizer_used] = (fertilizerCounts[crop.fertilizer_used] || 0) + 1;
//           }
//           if (crop.activities) {
//             crop.activities.forEach(activity => {
//               if (activity.activity_type === 'Fertilizer' && activity.chemical_or_fertilizer_used) {
//                 fertilizerCounts[activity.chemical_or_fertilizer_used] = (fertilizerCounts[activity.chemical_or_fertilizer_used] || 0) + 1;
//               }
//               if (activity.activity_type === 'Fertilization' && activity.fertilizer_name) {
//                 fertilizerCounts[activity.fertilizer_name] = (fertilizerCounts[activity.fertilizer_name] || 0) + 1;
//               }
//             });
//           }
//         });
        
//         const sortedFertilizers = Object.entries(fertilizerCounts)
//           .sort((a, b) => b[1] - a[1])
//           .slice(0, 5);
        
//         result = {
//           type: 'popular_fertilizer',
//           title: 'سب سے زیادہ استعمال ہونے والی کھاد',
//           titleEn: 'Most Used Fertilizer',
//           icon: 'eco',
//           color: PALETTE.orange,
//           bgColor: PALETTE.orangeLite,
//           topItem: sortedFertilizers[0] ? { name: sortedFertilizers[0][0], count: sortedFertilizers[0][1] } : null,
//           topList: sortedFertilizers.map(([name, count]) => ({ name, count })),
//           totalLands: nearbyLands.length,
//         };
//       } else if (type === 'common_pest') {
//         const pestCounts = {};
//         allCropsData.forEach(crop => {
//           if (crop.activities) {
//             crop.activities.forEach(activity => {
//               if (activity.activity_type === 'Pesticide' || activity.activity_type === 'Pest Control' || activity.activity_type === 'Spraying') {
//                 const pestName = activity.description || activity.chemical_or_fertilizer_used || activity.pesticide_name || 'Unknown Pest';
//                 if (pestName && pestName !== 'Unknown Pest') {
//                   pestCounts[pestName] = (pestCounts[pestName] || 0) + 1;
//                 }
//               }
//             });
//           }
//         });
        
//         const sortedPests = Object.entries(pestCounts)
//           .sort((a, b) => b[1] - a[1])
//           .slice(0, 5);
        
//         result = {
//           type: 'common_pest',
//           title: 'سب سے عام کیڑے کا حملہ',
//           titleEn: 'Most Common Pest Attack',
//           icon: 'bug-report',
//           color: PALETTE.red,
//           bgColor: PALETTE.redLite,
//           topItem: sortedPests[0] ? { name: sortedPests[0][0], count: sortedPests[0][1] } : null,
//           topList: sortedPests.map(([name, count]) => ({ name, count })),
//           totalLands: nearbyLands.length,
//         };
//       }
      
//       setAnalyticsResult(result);
//       setShowResultModal(true);
//     } catch (error) {
//       console.log('Error calculating analytics:', error);
//     } finally {
//       setLoadingAnalytics(false);
//     }
//   };

//   // Handle analytics type selection
//   const handleAnalyticsSelect = async (type) => {
//     setSelectedAnalyticsType(type);
//     setShowAnalyticsDropdown(false);
    
//     if (nearbyLands.length === 0 && selectedArea) {
//       await getNearbyLands();
//       setTimeout(() => {
//         calculateAnalyticsWithData(type);
//       }, 500);
//     } else {
//       calculateAnalyticsWithData(type);
//     }
//   };

//   // Filtered areas for search
//   const filteredAreas = areasData.filter(area =>
//     !areaSearch || area.area_name.toLowerCase().includes(areaSearch.toLowerCase())
//   );

//   // ✅ Helper function to get activity icon
//   const getActivityIconForType = (activityType) => {
//     const icons = {
//       'Plowing': '🚜', 'Land Preparation': '🚜', 'Sowing': '🌱',
//       'Irrigation': '💧', 'Fertilization': '🌿', 'Spraying': '💨',
//       'Pest Control': '🐛', 'Weeding': '🌾', 'Harvesting': '🌾',
//       'Harvest': '🌾',
//     };
//     return icons[activityType] || '📝';
//   };

//   // ✅ Helper function to format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'N/A';
//       return date.toLocaleDateString('ur-PK', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric'
//       });
//     } catch (error) {
//       return 'N/A';
//     }
//   };

//   // ✅ Helper function to show full details including activities and Yield per Acre (with Profit %)
//   const showCropDetailsWithActivities = (item) => {
//     if (!item.has_yield) {
//       Alert.alert(
//         `⏳ ${item.crop_name} - ${item.farmer_name}`,
//         `یہ فصل ابھی مکمل نہیں ہوئی۔\nپیداوار درج ہونے کے بعد منافع/نقصان کا حساب لگایا جا سکے گا۔`
//       );
//       return;
//     }

//     // Calculate Yield per Acre
//     const areaSize = item.area_size || 1;
//     const totalBags = item.yield_bags;
//     const totalKg = totalBags * 40;
//     const bagsPerAcre = (totalBags / areaSize).toFixed(1);
//     const kgPerAcre = (totalKg / areaSize).toFixed(0);
//     const maundPerAcre = (kgPerAcre / 40).toFixed(1);

//     // ✅ Calculate Profit Percentage (if not already available)
//     const profitPercent = item.profitPercentage || 
//       (item.has_yield && item.revenue > 0 ? ((item.profit_or_loss / item.revenue) * 100).toFixed(1) : 'N/A');

//     // Build activities list string
//     let activitiesText = '';
//     if (item.activities && item.activities.length > 0) {
//       activitiesText = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
//       activitiesText += '📋 **سرگرمیاں (Activities):**\n';
//       activitiesText += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
//       item.activities.forEach((act, idx) => {
//         const costText = act.cost > 0 ? `Rs ${act.cost.toFixed(0)}` : 'کوئی لاگت نہیں';
//         activitiesText += `\n${idx + 1}. ${getActivityIconForType(act.type)} ${act.type}\n`;
//         activitiesText += `   📅 تاریخ: ${formatDate(act.date)}\n`;
//         activitiesText += `   💰 لاگت: ${costText}\n`;
//         if (act.chemical) {
//           activitiesText += `   🧪 استعمال: ${act.chemical}\n`;
//         }
//         if (act.description && act.description !== 'N/A' && act.description !== '') {
//           activitiesText += `   📝 تفصیل: ${act.description}\n`;
//         }
//       });
//     } else {
//       activitiesText = '\n\n⚠️ کوئی سرگرمی درج نہیں';
//     }

//     Alert.alert(
//       `📊 ${item.crop_name} - ${item.farmer_name}`,
//       `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//       `🌾 **فصل کی مکمل معلومات**\n` +
//       `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
//       `👨‍🌾 **کسان:** ${item.farmer_name}\n` +
//       `📞 **فون:** ${item.farmer_phone || 'N/A'}\n` +
//       `🌾 **فصل:** ${item.crop_name}\n` +
//       `📅 **موسم:** ${item.season}\n` +
//       `🗓️ **بوائی:** ${formatDate(item.sowing_date)}\n` +
//       `🗓️ **کٹائی:** ${formatDate(item.harvest_date)}\n` +
//       `📏 **رقبہ:** ${areaSize} ${item.area_unit || 'ایکڑ'}\n\n` +
//       `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//       `💰 **مالیاتی خلاصہ**\n` +
//       `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//       `💵 **کل لاگت:** Rs ${item.total_cost.toFixed(0)}\n` +
//       `🌾 **کل پیداوار:** ${totalBags} بوریاں (${totalKg} کلو)\n` +
//       `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//       `📏 **پیداوار فی ایکڑ:**\n` +
//       `   🧺 ${bagsPerAcre} بوریاں\n` +
//       `   ⚖️ ${kgPerAcre} کلو\n` +
//       `   📦 ${maundPerAcre} من\n` +
//       `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//       `💵 **آمدنی:** Rs ${item.revenue.toFixed(0)}\n` +
//       `📊 **${item.is_profit ? '✅ منافع' : '❌ نقصان'}:** Rs ${Math.abs(item.profit_or_loss).toFixed(0)}\n` +
//       `📈 **منافع فیصد:** ${profitPercent}% (آمدنی کا %)\n` +
//       `${activitiesText}\n` +
//       `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//       `💡 **تجزیه:** ${item.is_profit ? 
//         'اس فصل میں منافع ہوا ہے۔ اچھی کاشتکاری! 👍' : 
//         'اس فصل میں نقصان ہوا ہے۔ اگلی بار لاگت کم کرنے کی کوشش کریں۔ 💡'}\n` +
//       `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
//       `💡 **نوٹ:** 1 من = 40 کلو`,
//       [{ text: 'بند کریں', style: 'default' }]
//     );
//   };

//   // ✅ Render Profit/Loss Result Modal Content (with Profit % instead of ROI)
//   const renderProfitLossContent = () => {
//     if (!analyticsResult || analyticsResult.type !== 'profit_loss') return null;
    
//     const data = analyticsResult;
    
//     return (
//       <ScrollView style={styles.resultScrollView} showsVerticalScrollIndicator={false}>
//         {/* Summary Stats */}
//         <View style={styles.profitSummaryStats}>
//           <View style={styles.profitStatItem}>
//             <Text style={styles.profitStatValue}>{data.summary.total_crops}</Text>
//             <Text style={styles.profitStatLabel}>کل فصلیں</Text>
//           </View>
//           <View style={styles.profitStatItem}>
//             <Text style={[styles.profitStatValue, { color: '#16A34A' }]}>{data.summary.profitable_crops}</Text>
//             <Text style={styles.profitStatLabel}>منافع والی</Text>
//           </View>
//           <View style={styles.profitStatItem}>
//             <Text style={[styles.profitStatValue, { color: '#DC2626' }]}>{data.summary.loss_crops}</Text>
//             <Text style={styles.profitStatLabel}>نقصان والی</Text>
//           </View>
//           <View style={styles.profitStatItem}>
//             <Text style={[styles.profitStatValue, { color: '#F59E0B' }]}>{data.summary.pending_yield}</Text>
//             <Text style={styles.profitStatLabel}>پیداوار باقی</Text>
//           </View>
//         </View>

//         {/* Net Overall */}
//         <View style={[
//           styles.netOverallCard,
//           data.summary.net_overall >= 0 ? styles.netProfitCard : styles.netLossCard
//         ]}>
//           <Text style={styles.netOverallLabel}>مجموعی منافع/نقصان</Text>
//           <Text style={[
//             styles.netOverallValue,
//             data.summary.net_overall >= 0 ? styles.netProfitValue : styles.netLossValue
//           ]}>
//             {data.summary.net_overall >= 0 ? '+' : ''}Rs {Math.abs(data.summary.net_overall).toFixed(0)}
//           </Text>
//         </View>

//         {/* Top Profit - CLICKABLE with Profit % */}
//         {data.topProfit && (
//           <TouchableOpacity 
//             style={styles.topProfitCard}
//             onPress={() => showCropDetailsWithActivities(data.topProfit)}
//             activeOpacity={0.7}
//           >
//             <View style={styles.topProfitHeader}>
//               <Icon name="emoji-events" size={20} color="#16A34A" />
//               <Text style={styles.topProfitTitle}>🏆 سب سے زیادہ منافع</Text>
//               <Icon name="info" size={16} color="#16A34A" style={{marginLeft: 'auto'}} />
//             </View>
//             <View style={styles.profitLossRow}>
//               <Text style={styles.profitLossName}>{data.topProfit.crop_name}</Text>
//               <Text style={styles.profitLossFarmer}>- {data.topProfit.farmer_name}</Text>
//             </View>
//             <View style={styles.profitLossDetails}>
//               <View style={styles.profitDetailRow}>
//                 <Icon name="payments" size={14} color="#16A34A" />
//                 <Text style={styles.profitDetail}>منافع: Rs {data.topProfit.profit_or_loss.toFixed(0)}</Text>
//               </View>
//               <View style={styles.profitDetailRow}>
//                 <Icon name="trending-up" size={14} color="#16A34A" />
//                 <Text style={styles.profitDetail}>
//                   منافع فیصد: {data.topProfit.profitPercentage || 
//                     ((data.topProfit.profit_or_loss / data.topProfit.revenue) * 100).toFixed(1)}%
//                 </Text>
//               </View>
//               <View style={styles.profitDetailRow}>
//                 <Icon name="grass" size={14} color="#16A34A" />
//                 <Text style={styles.profitDetail}>پیداوار: {data.topProfit.yield_bags} بوریاں</Text>
//               </View>
//               <View style={styles.profitDetailRow}>
//                 <Icon name="square-foot" size={14} color="#16A34A" />
//                 <Text style={styles.profitDetail}>پیداوار فی ایکڑ: {data.topProfit.bags_per_acre} بوریاں | {data.topProfit.maund_per_acre} من</Text>
//               </View>
//               <View style={styles.profitDetailRow}>
//                 <Icon name="receipt" size={14} color="#16A34A" />
//                 <Text style={styles.profitDetail}>لاگت: Rs {data.topProfit.total_cost.toFixed(0)}</Text>
//               </View>
//             </View>
//             <Text style={styles.clickHint}>👆 مکمل تاریخ کے لیے کلک کریں</Text>
//           </TouchableOpacity>
//         )}

//         {/* Top Loss - CLICKABLE */}
//         {data.topLoss && data.topLoss.has_yield && (
//           <TouchableOpacity 
//             style={styles.topLossCard}
//             onPress={() => showCropDetailsWithActivities(data.topLoss)}
//             activeOpacity={0.7}
//           >
//             <View style={styles.topLossHeader}>
//               <Icon name="warning" size={20} color="#DC2626" />
//               <Text style={styles.topLossTitle}>⚠️ سب سے زیادہ نقصان</Text>
//               <Icon name="info" size={16} color="#DC2626" style={{marginLeft: 'auto'}} />
//             </View>
//             <View style={styles.profitLossRow}>
//               <Text style={styles.profitLossName}>{data.topLoss.crop_name}</Text>
//               <Text style={styles.profitLossFarmer}>- {data.topLoss.farmer_name}</Text>
//             </View>
//             <View style={styles.profitLossDetails}>
//               <View style={styles.lossDetailRow}>
//                 <Icon name="money-off" size={14} color="#DC2626" />
//                 <Text style={styles.lossDetail}>نقصان: Rs {Math.abs(data.topLoss.profit_or_loss).toFixed(0)}</Text>
//               </View>
//               <View style={styles.lossDetailRow}>
//                 <Icon name="trending-down" size={14} color="#DC2626" />
//                 <Text style={styles.lossDetail}>
//                   نقصان فیصد: {data.topLoss.profitPercentage ? 
//                     Math.abs(parseFloat(data.topLoss.profitPercentage)).toFixed(1) : 
//                     ((Math.abs(data.topLoss.profit_or_loss) / data.topLoss.revenue) * 100).toFixed(1)}%
//                 </Text>
//               </View>
//             </View>
//             <Text style={styles.clickHint}>👆 مکمل تاریخ کے لیے کلک کریں</Text>
//           </TouchableOpacity>
//         )}

//         {/* Most Profitable Crop Type */}
//         {data.mostProfitableCrop && (
//           <View style={styles.mostProfitableCard}>
//             <View style={styles.mostProfitableHeader}>
//               <Icon name="star" size={20} color="#F59E0B" />
//               <Text style={styles.mostProfitableTitle}>سب سے زیادہ منافع والی فصل</Text>
//             </View>
//             <Text style={styles.mostProfitableCropName}>{data.mostProfitableCrop.name}</Text>
//             <Text style={styles.mostProfitableStats}>
//               کل منافع: Rs {data.mostProfitableCrop.total_profit.toFixed(0)} • {data.mostProfitableCrop.count} کسان
//             </Text>
//           </View>
//         )}

//         {/* All Crops List - with Profit % instead of ROI */}
//         <View style={styles.allCropsList}>
//           <Text style={styles.allCropsTitle}>تمام فصلیں ({data.allData.length})</Text>
//           {data.allData.map((item, index) => {
//             const bagsPerAcre = item.bags_per_acre || (item.yield_bags / (item.area_size || 1)).toFixed(1);
//             const maundPerAcre = item.maund_per_acre || ((item.yield_bags * 40 / (item.area_size || 1)) / 40).toFixed(1);
//             const profitPercent = item.profitPercentage || 
//               (item.has_yield && item.revenue > 0 ? ((item.profit_or_loss / item.revenue) * 100).toFixed(1) : 'N/A');
            
//             return (
//               <TouchableOpacity 
//                 key={index} 
//                 style={[
//                   styles.cropProfitItem,
//                   item.has_yield ? (item.is_profit ? styles.profitItem : styles.lossItem) : styles.pendingItem
//                 ]}
//                 onPress={() => showCropDetailsWithActivities(item)}
//                 activeOpacity={0.7}
//               >
//                 <View style={styles.cropProfitHeader}>
//                   <View style={styles.cropProfitLeft}>
//                     <Text style={styles.cropProfitName}>{item.crop_name}</Text>
//                     <Text style={styles.cropProfitFarmer}>{item.farmer_name}</Text>
//                   </View>
//                   {item.has_yield ? (
//                     item.is_profit ? (
//                       <View style={styles.profitBadge}>
//                         <Icon name="trending-up" size={12} color="white" />
//                         <Text style={styles.badgeText}>منافع</Text>
//                       </View>
//                     ) : (
//                       <View style={styles.lossBadge}>
//                         <Icon name="trending-down" size={12} color="white" />
//                         <Text style={styles.badgeText}>نقصان</Text>
//                       </View>
//                     )
//                   ) : (
//                     <View style={styles.pendingBadge}>
//                       <Icon name="hourglass-empty" size={12} color="white" />
//                       <Text style={styles.badgeText}>زیر التواء</Text>
//                     </View>
//                   )}
//                 </View>
                
//                 <View style={styles.cropProfitFooter}>
//                   {item.has_yield ? (
//                     <>
//                       <Text style={[styles.cropProfitAmount, item.is_profit ? styles.profitAmount : styles.lossAmount]}>
//                         {item.is_profit ? `+Rs ${item.profit_or_loss.toFixed(0)}` : `-Rs ${Math.abs(item.profit_or_loss).toFixed(0)}`}
//                       </Text>
//                       <Text style={styles.cropProfitROI}>
//                         منافع فیصد: {profitPercent}%
//                       </Text>
//                       <Text style={styles.cropProfitYield}>🌾 {item.yield_bags} بوریاں</Text>
//                     </>
//                   ) : (
//                     <Text style={styles.pendingText}>پیداوار درج نہیں</Text>
//                   )}
//                 </View>
                
//                 {/* ✅ Yield per Acre info */}
//                 {item.has_yield && (
//                   <View style={styles.yieldPerAcreContainer}>
//                     <Icon name="square-foot" size={10} color="#4CAF50" />
//                     <Text style={styles.yieldPerAcreText}>
//                       فی ایکڑ: {bagsPerAcre} بوریاں | {maundPerAcre} من
//                     </Text>
//                   </View>
//                 )}
                
//                 <Text style={styles.clickHintSmall}>👆 مکمل تفصیلات کے لیے کلک کریں</Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         {/* Season Info */}
//         <View style={styles.seasonInfoCard}>
//           <Icon name="calendar-today" size={16} color={PALETTE.muted} />
//           <Text style={styles.seasonInfoText}>
//             موسم: {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'} • {data.totalLands} زمینوں کا تجزیہ
//           </Text>
//         </View>
//       </ScrollView>
//     );
//   };

//   // ✅ Render Regular Analytics Content
//   const renderRegularAnalyticsContent = () => {
//     if (!analyticsResult || analyticsResult.type === 'profit_loss') return null;
    
//     const data = analyticsResult;
    
//     return (
//       <ScrollView style={styles.resultScrollView} showsVerticalScrollIndicator={false}>
//         <View style={[styles.mainResultCard, { backgroundColor: data.bgColor }]}>
//           <Icon name={data.icon} size={50} color={data.color} />
//           {data.topItem ? (
//             <>
//               <Text style={styles.mainResultName}>{data.topItem.name}</Text>
//               <Text style={styles.mainResultCount}>
//                 {data.topItem.count} کسانوں نے استعمال کیا
//               </Text>
//             </>
//           ) : (
//             <Text style={styles.noDataText}>کوئی ڈیٹا دستیاب نہیں</Text>
//           )}
//         </View>

//         <View style={styles.statsRow}>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>{data.totalLands}</Text>
//             <Text style={styles.statLabel}>زمینوں کا تجزیہ</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>5 کلومیٹر</Text>
//             <Text style={styles.statLabel}>دائرہ</Text>
//           </View>
//         </View>

//         {data.topList && data.topList.length > 0 && (
//           <View style={styles.topListCard}>
//             <Text style={styles.topListTitle}>
//               {data.type === 'popular_crop' ? 'سرفہرست 5 فصلیں' :
//                data.type === 'popular_fertilizer' ? 'سرفہرست 5 کھادیں' :
//                'سرفہرست 5 کیڑے مار دوائیں'}
//             </Text>
//             {data.topList.map((item, index) => (
//               <View key={index} style={styles.topListItem}>
//                 <View style={[styles.topListRank, { backgroundColor: data.color }]}>
//                   <Text style={styles.topListRankText}>{index + 1}</Text>
//                 </View>
//                 <Text style={styles.topListName}>{item.name}</Text>
//                 <Text style={[styles.topListCount, { color: data.color }]}>{item.count}</Text>
//               </View>
//             ))}
//           </View>
//         )}

//         <View style={styles.seasonInfoCard}>
//           <Icon name="calendar-today" size={16} color={PALETTE.muted} />
//           <Text style={styles.seasonInfoText}>
//             موسم: {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'}
//           </Text>
//         </View>
//       </ScrollView>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.formCard}>
//           {/* City Dropdown */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>{t('city')}</Text>
//             <TouchableOpacity
//               style={styles.dropdownButton}
//               onPress={() => setShowCityDropdown(true)}
//             >
//               <Text style={[styles.dropdownText, !selectedCity && { color: '#999' }]}>
//                 {selectedCity ? t(selectedCity) : t('selectDistrict')}
//               </Text>
//               <Icon name="arrow-drop-down" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {/* Area Dropdown */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>{t('area')}</Text>
//             <TouchableOpacity
//               style={[styles.dropdownButton, !selectedCity && styles.disabledDropdown]}
//               onPress={() => selectedCity && setShowAreaDropdown(true)}
//               disabled={!selectedCity}
//             >
//               <Text style={[styles.dropdownText, !selectedArea && { color: '#999' }]}>
//                 {selectedArea ? t(selectedArea) : (selectedCity ? t('selectArea') : t('selectDistrictFirst'))}
//               </Text>
//               <Icon name="arrow-drop-down" size={24} color={selectedCity ? "#666" : "#ccc"} />
//             </TouchableOpacity>
//           </View>

//           {/* Season Dropdown */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>{t('season')}</Text>
//             <TouchableOpacity
//               style={styles.dropdownButton}
//               onPress={() => setShowSeasonDropdown(true)}
//             >
//               <Text style={styles.dropdownText}>
//                 {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'}
//               </Text>
//               <Icon name="arrow-drop-down" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {/* Analytics Type Dropdown */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>{t('analyticsType')}</Text>
//             <TouchableOpacity
//               style={[styles.dropdownButton, !selectedArea && styles.disabledDropdown]}
//               onPress={() => selectedArea && setShowAnalyticsDropdown(true)}
//               disabled={!selectedArea}
//             >
//               <Text style={[styles.dropdownText, !selectedAnalyticsType && { color: '#999' }]}>
//                 {selectedAnalyticsType 
//                   ? t(analyticsTypes.find(a => a.id === selectedAnalyticsType)?.label) 
//                   : t('selectAnalyticsType')}
//               </Text>
//               <Icon name="arrow-drop-down" size={24} color={selectedArea ? "#666" : "#ccc"} />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.infoCard}>
//             <Icon name="info" size={20} color={PALETTE.blue} />
//             <Text style={styles.infoText}>5 کلومیٹر کے دائرے میں قریبی کسانوں کی سرگرمیوں کا تجزیہ</Text>
//           </View>
//         </View>

//         {(loadingNearby || loadingAnalytics) && (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={PALETTE.green} />
//             <Text style={styles.loadingText}>
//               {loadingNearby ? 'قریبی زمینیں لوڈ ہو رہی ہیں...' : 'تجزیات کا حساب ہو رہا ہے...'}
//             </Text>
//           </View>
//         )}
//       </ScrollView>

//       {/* City Dropdown Modal */}
//       <Modal visible={showCityDropdown} transparent animationType="fade">
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCityDropdown(false)}>
//           <View style={styles.dropdownMenu}>
//             <Text style={styles.dropdownTitle}>{t('selectDistrictTitle')}</Text>
//             <ScrollView style={styles.dropdownScrollView} showsVerticalScrollIndicator={false}>
//               {cities.map((city, index) => (
//                 <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleCitySelect(city)}>
//                   <Text style={styles.dropdownItemText}>{t(city)}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Area Dropdown Modal */}
//       <Modal visible={showAreaDropdown} transparent animationType="fade">
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAreaDropdown(false)}>
//           <View style={[styles.dropdownMenu, { height: height * 0.6 }]}>
//             <Text style={styles.dropdownTitle}>{t('selectAreaInCity')} {t(selectedCity)}</Text>
//             <View style={styles.searchContainer}>
//               <TextInput style={styles.searchInput} placeholder={t('searchArea')} value={areaSearch} onChangeText={setAreaSearch} placeholderTextColor="#999" />
//               <Icon name="search" size={20} color="#666" />
//             </View>
//             <ScrollView style={styles.dropdownScrollView} showsVerticalScrollIndicator={false}>
//               {loadingAreas ? (
//                 <View style={styles.loadingContainer}>
//                   <ActivityIndicator size="small" color={PALETTE.green} />
//                   <Text style={styles.loadingText}>{t('loadingAreas')}</Text>
//                 </View>
//               ) : filteredAreas.length > 0 ? (
//                 filteredAreas.map((area, index) => (
//                   <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleAreaSelect(area.area_name)}>
//                     <View style={styles.areaItemContent}>
//                       <Text style={styles.dropdownItemText}>{t(area.area_name)}</Text>
//                       <Text style={styles.areaZoneText}>{area.description}</Text>
//                     </View>
//                     <Icon name="chevron-right" size={20} color="#999" />
//                   </TouchableOpacity>
//                 ))
//               ) : (
//                 <View style={styles.noDataContainer}>
//                   <Text style={styles.noDataText}>{t('noAreasFound')}</Text>
//                 </View>
//               )}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Season Dropdown Modal */}
//       <Modal visible={showSeasonDropdown} transparent animationType="fade">
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSeasonDropdown(false)}>
//           <View style={styles.dropdownMenu}>
//             <Text style={styles.dropdownTitle}>{t('selectSeasonTitle')}</Text>
//             <ScrollView style={styles.dropdownScrollView} showsVerticalScrollIndicator={false}>
//               {seasonsWithDates.map((season, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[styles.dropdownItem, selectedSeason === season.name && { backgroundColor: PALETTE.greenLite }]}
//                   onPress={() => handleSeasonSelect(season.name)}
//                 >
//                   <View>
//                     <Text style={styles.dropdownItemText}>{season.label} ({season.name})</Text>
//                     {season.from && <Text style={styles.seasonDateText}>{season.from} - {season.to}</Text>}
//                   </View>
//                   {selectedSeason === season.name && <Icon name="check" size={20} color={PALETTE.green} />}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Analytics Type Dropdown Modal */}
//       <Modal visible={showAnalyticsDropdown} transparent animationType="fade">
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAnalyticsDropdown(false)}>
//           <View style={styles.dropdownMenu}>
//             <Text style={styles.dropdownTitle}>{t('selectAnalyticsType')}</Text>
//             <ScrollView style={styles.dropdownScrollView} showsVerticalScrollIndicator={false}>
//               {analyticsTypes.map((type, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[styles.dropdownItem, selectedAnalyticsType === type.id && { backgroundColor: type.bgColor }]}
//                   onPress={() => handleAnalyticsSelect(type.id)}
//                 >
//                   <View style={styles.analyticsItemContent}>
//                     <Icon name={type.icon} size={24} color={type.color} />
//                     <Text style={styles.dropdownItemText}>{t(type.label)}</Text>
//                   </View>
//                   {selectedAnalyticsType === type.id && <Icon name="check" size={20} color={type.color} />}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Analytics Result Modal */}
//       <Modal visible={showResultModal} transparent animationType="slide">
//         <View style={styles.resultModalOverlay}>
//           <View style={styles.resultModalContent}>
//             <View style={styles.resultModalHeader}>
//               <Text style={styles.resultModalTitle}>{analyticsResult?.title || 'تجزیات'}</Text>
//               <TouchableOpacity onPress={() => setShowResultModal(false)}>
//                 <Icon name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>

//             {loadingAnalytics ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color={PALETTE.green} />
//                 <Text style={styles.loadingText}>تجزیات کا حساب ہو رہا ہے...</Text>
//               </View>
//             ) : analyticsResult ? (
//               analyticsResult.type === 'profit_loss' 
//                 ? renderProfitLossContent() 
//                 : renderRegularAnalyticsContent()
//             ) : (
//               <View style={styles.noDataContainer}>
//                 <Icon name="info" size={50} color={PALETTE.muted} />
//                 <Text style={styles.noDataText}>کوئی ڈیٹا دستیاب نہیں</Text>
//               </View>
//             )}

//             <TouchableOpacity style={styles.closeResultButton} onPress={() => setShowResultModal(false)}>
//               <Text style={styles.closeResultButtonText}>{t('close')}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: PALETTE.bg },
//   content: { padding: 16, paddingBottom: 32 },
//   formCard: { backgroundColor: PALETTE.white, borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
//   inputGroup: { marginBottom: 16 },
//   inputLabel: { fontSize: 14, fontWeight: '600', color: PALETTE.text, marginBottom: 8, textAlign: 'right' },
//   dropdownButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12 },
//   disabledDropdown: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
//   dropdownText: { fontSize: 14, color: PALETTE.text },
//   infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.blueLite, borderRadius: 8, padding: 12, marginTop: 8 },
//   infoText: { fontSize: 12, color: PALETTE.blue, marginLeft: 8, flex: 1, textAlign: 'right' },
//   loadingContainer: { alignItems: 'center', padding: 30 },
//   loadingText: { fontSize: 14, color: PALETTE.muted, marginTop: 12 },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
//   dropdownMenu: { backgroundColor: PALETTE.white, borderRadius: 12, width: width * 0.85, maxHeight: height * 0.5, padding: 16 },
//   dropdownTitle: { fontSize: 16, fontWeight: 'bold', color: PALETTE.text, textAlign: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
//   dropdownScrollView: { maxHeight: height * 0.35 },
//   dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
//   dropdownItemText: { fontSize: 14, color: PALETTE.text },
//   searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
//   searchInput: { flex: 1, paddingVertical: 10, fontSize: 14 },
//   areaItemContent: { flex: 1 },
//   areaZoneText: { fontSize: 12, color: PALETTE.muted, marginTop: 2 },
//   seasonDateText: { fontSize: 12, color: PALETTE.muted, marginTop: 2 },
//   analyticsItemContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   noDataContainer: { alignItems: 'center', padding: 30 },
//   noDataText: { fontSize: 14, color: PALETTE.muted, textAlign: 'center', marginTop: 8 },
//   resultModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//   resultModalContent: { backgroundColor: PALETTE.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: height * 0.85, padding: 20 },
//   resultModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
//   resultModalTitle: { fontSize: 18, fontWeight: 'bold', color: PALETTE.text },
//   resultScrollView: { maxHeight: height * 0.6 },
//   mainResultCard: { alignItems: 'center', padding: 24, borderRadius: 12, marginBottom: 16 },
//   mainResultName: { fontSize: 22, fontWeight: 'bold', color: PALETTE.text, marginTop: 12, textAlign: 'center' },
//   mainResultCount: { fontSize: 14, color: PALETTE.muted, marginTop: 4 },
//   statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
//   statCard: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16, alignItems: 'center', marginHorizontal: 4 },
//   statValue: { fontSize: 18, fontWeight: 'bold', color: PALETTE.green },
//   statLabel: { fontSize: 12, color: PALETTE.muted, marginTop: 4 },
//   topListCard: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, marginBottom: 16 },
//   topListTitle: { fontSize: 14, fontWeight: 'bold', color: PALETTE.text, textAlign: 'right', marginBottom: 12 },
//   topListItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
//   topListRank: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
//   topListRankText: { fontSize: 12, fontWeight: 'bold', color: PALETTE.white },
//   topListName: { flex: 1, fontSize: 14, color: PALETTE.text },
//   topListCount: { fontSize: 14, fontWeight: 'bold' },
//   seasonInfoCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 16 },
//   seasonInfoText: { fontSize: 12, color: PALETTE.muted, marginLeft: 8 },
//   closeResultButton: { backgroundColor: PALETTE.green, borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
//   closeResultButtonText: { fontSize: 16, fontWeight: 'bold', color: PALETTE.white },
  
//   // Profit/Loss Specific Styles
//   profitSummaryStats: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
//   profitStatItem: { width: '48%', backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 8 },
//   profitStatValue: { fontSize: 20, fontWeight: 'bold', color: PALETTE.text },
//   profitStatLabel: { fontSize: 11, color: PALETTE.muted, marginTop: 4 },
//   netOverallCard: { borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center' },
//   netProfitCard: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#4CAF50' },
//   netLossCard: { backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: '#EF5350' },
//   netOverallLabel: { fontSize: 12, color: PALETTE.muted, marginBottom: 4 },
//   netOverallValue: { fontSize: 24, fontWeight: 'bold' },
//   netProfitValue: { color: '#2E7D32' },
//   netLossValue: { color: '#DC2626' },
//   topProfitCard: { backgroundColor: '#E8F5E9', borderRadius: 12, padding: 16, marginBottom: 16 },
//   topProfitHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
//   topProfitTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32', flex: 1 },
//   topLossCard: { backgroundColor: '#FFEBEE', borderRadius: 12, padding: 16, marginBottom: 16 },
//   topLossHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
//   topLossTitle: { fontSize: 16, fontWeight: 'bold', color: '#DC2626', flex: 1 },
//   profitLossRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
//   profitLossName: { fontSize: 18, fontWeight: 'bold', color: PALETTE.text },
//   profitLossFarmer: { fontSize: 14, color: PALETTE.muted, marginLeft: 6 },
//   profitLossDetails: { marginTop: 8 },
//   profitDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
//   profitDetail: { fontSize: 13, color: '#2E7D32' },
//   lossDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
//   lossDetail: { fontSize: 13, color: '#DC2626' },
//   clickHint: { fontSize: 10, color: '#666', fontStyle: 'italic', marginTop: 8, textAlign: 'center' },
//   clickHintSmall: { fontSize: 9, color: '#999', fontStyle: 'italic', marginTop: 6, textAlign: 'right' },
//   mostProfitableCard: { backgroundColor: '#FEF3C7', borderRadius: 12, padding: 16, marginBottom: 16 },
//   mostProfitableHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
//   mostProfitableTitle: { fontSize: 14, fontWeight: 'bold', color: '#F59E0B' },
//   mostProfitableCropName: { fontSize: 20, fontWeight: 'bold', color: PALETTE.text, marginBottom: 4 },
//   mostProfitableStats: { fontSize: 12, color: PALETTE.muted },
//   allCropsList: { marginBottom: 16 },
//   allCropsTitle: { fontSize: 16, fontWeight: 'bold', color: PALETTE.text, marginBottom: 12, textAlign: 'right' },
//   cropProfitItem: { backgroundColor: '#F9FAFB', borderRadius: 10, padding: 12, marginBottom: 8 },
//   profitItem: { borderLeftWidth: 4, borderLeftColor: '#16A34A' },
//   lossItem: { borderLeftWidth: 4, borderLeftColor: '#DC2626' },
//   pendingItem: { borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
//   cropProfitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   cropProfitLeft: { flex: 1 },
//   cropProfitName: { fontSize: 16, fontWeight: 'bold', color: PALETTE.text },
//   cropProfitFarmer: { fontSize: 12, color: PALETTE.muted, marginTop: 2 },
//   profitBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16A34A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
//   lossBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DC2626', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
//   pendingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
//   badgeText: { fontSize: 10, fontWeight: 'bold', color: 'white' },
//   cropProfitFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
//   cropProfitAmount: { fontSize: 16, fontWeight: 'bold' },
//   profitAmount: { color: '#16A34A' },
//   lossAmount: { color: '#DC2626' },
//   cropProfitROI: { fontSize: 12, color: PALETTE.muted },
//   cropProfitYield: { fontSize: 12, color: PALETTE.green },
//   pendingText: { fontSize: 12, color: '#F59E0B', fontStyle: 'italic' },
//   yieldPerAcreContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
//   yieldPerAcreText: { fontSize: 11, color: '#4CAF50', fontWeight: '500' },
// });

// export default LocalRecommendationsScreen;





import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { farmerAPI } from './api';
import { useLanguage } from './localization';

const { width, height } = Dimensions.get('window');

const PALETTE = {
  bg: '#F5F5F5',
  white: '#FFFFFF',
  text: '#111829',
  muted: '#6B7280',
  green: '#16A34A',
  greenLite: '#E7F8EA',
  orange: '#F59E0B',
  orangeLite: '#FEF3C7',
  red: '#EF4444',
  redLite: '#FEE2E2',
  blue: '#3B82F6',
  blueLite: '#DBEAFE',
  purple: '#8B5CF6',
  purpleLite: '#EDE9FE',
};

// Seasons with dates
const seasonsWithDates = [
  { name: 'Rabi', label: 'ربیع', from: 'Oct 15', to: 'Apr 15' },
  { name: 'Kharif', label: 'خریف', from: 'Apr 15', to: 'Oct 15' },
  { name: 'All', label: 'سب', from: '', to: '' },
];

// Analytics Types
const analyticsTypes = [
  { id: 'popular_crop', label: 'mostPopularCrop', icon: 'spa', color: PALETTE.green, bgColor: PALETTE.greenLite },
  { id: 'popular_fertilizer', label: 'mostUsedFertilizer', icon: 'eco', color: PALETTE.orange, bgColor: PALETTE.orangeLite },
  { id: 'common_pest', label: 'mostCommonPestAttack', icon: 'bug-report', color: PALETTE.red, bgColor: PALETTE.redLite },
  { id: 'profit_loss', label: 'profitLossAnalysis', icon: 'trending-up', color: PALETTE.purple, bgColor: PALETTE.purpleLite },
];

// Cities list
const cities = ['Lahore', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujrat', 'Sialkot'];

function LocalRecommendationsScreen({ navigation }) {
  const { t } = useLanguage();
  
  // States
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [selectedAnalyticsType, setSelectedAnalyticsType] = useState('');
  
  // Dropdown states
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [showAnalyticsDropdown, setShowAnalyticsDropdown] = useState(false);
  
  // Data states
  const [areasData, setAreasData] = useState([]);
  const [areaSearch, setAreaSearch] = useState('');
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [nearbyLands, setNearbyLands] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [analyticsResult, setAnalyticsResult] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  // Load areas when city changes
  useEffect(() => {
    if (selectedCity) {
      loadAreas();
    }
  }, [selectedCity]);

  // Load areas for selected city
  const loadAreas = async () => {
    try {
      setLoadingAreas(true);
      const response = await farmerAPI.getAreasByCity(selectedCity);
      if (response && response.areas) {
        setAreasData(response.areas);
      }
    } catch (error) {
      console.log('Error loading areas:', error);
    } finally {
      setLoadingAreas(false);
    }
  };

  // Handle city selection
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedArea('');
    setAreasData([]);
    setNearbyLands([]);
    setAnalyticsResult(null);
    setShowCityDropdown(false);
  };

  // Handle area selection
  const handleAreaSelect = (areaName) => {
    setSelectedArea(areaName);
    setShowAreaDropdown(false);
    setNearbyLands([]);
    setAnalyticsResult(null);
  };

  // Handle season selection
  const handleSeasonSelect = (seasonName) => {
    setSelectedSeason(seasonName);
    setShowSeasonDropdown(false);
    setAnalyticsResult(null);
  };

  // Get nearby lands (5km radius)
  const getNearbyLands = async () => {
    if (!selectedArea) {
      return;
    }
    
    try {
      setLoadingNearby(true);
      const response = await farmerAPI.getNearbyLandsByArea(selectedArea, 5);
      
      if (response.success && response.nearby_lands) {
        setNearbyLands(response.nearby_lands);
      }
    } catch (error) {
      console.log('Error getting nearby lands:', error);
    } finally {
      setLoadingNearby(false);
    }
  };

  // ✅ Calculate Profit/Loss Analytics with CORRECT area_size from land_info
  const calculateProfitLossAnalytics = async () => {
    if (nearbyLands.length === 0) {
      return null;
    }
    
    const profitLossData = [];
    
    for (const land of nearbyLands) {
      try {
        const response = await farmerAPI.getLandSeasonCrops(land.land_id, selectedSeason === 'All' ? '' : selectedSeason);
        
        if (response.success && response.crops) {
          // ✅ FIX: Area size land_info se lo (crop se nahi)
          const landAreaSize = response.land_info?.area_size ? parseFloat(response.land_info.area_size) : 1;
          const landAreaUnit = response.land_info?.area_unit || 'acres';
          
          console.log(`📊 Land ID: ${land.land_id}, Area: ${landAreaSize} ${landAreaUnit}`);
          
          for (const crop of response.crops) {
            // Calculate total cost from activities
            let totalCost = 0;
            let hasYield = false;
            let yieldValue = 0;
            let yieldBags = 0;
            let activitiesList = [];
            
            if (crop.activities && crop.activities.length > 0) {
              crop.activities.forEach(activity => {
                const cost = parseFloat(activity.activity_cost) || 0;
                if (cost > 0) {
                  totalCost += cost;
                }
                activitiesList.push({
                  type: activity.activity_type,
                  date: activity.activity_date,
                  cost: cost,
                  description: activity.description,
                  chemical: activity.chemical_or_fertilizer_used,
                });
              });
            }
            
            // Yield se income calculate karo (2000 per 40kg bag)
            if (crop.yield_per_40kg && crop.yield_per_40kg > 0) {
              hasYield = true;
              yieldBags = parseFloat(crop.yield_per_40kg);
              yieldValue = yieldBags * 2000;
            }
            
            const netProfit = yieldValue - totalCost;
            const isProfit = netProfit >= 0;
            
            // ✅ PROFIT PERCENTAGE of REVENUE
            let profitPercentage = 'N/A';
            if (hasYield && yieldValue > 0) {
              const percentValue = (netProfit / yieldValue) * 100;
              profitPercentage = percentValue.toFixed(1);
            }
            
            // ✅ FIX: Yield per Acre - LAND KI ACTUAL AREA USE KARO
            const totalKg = yieldBags * 40;
            const bagsPerAcre = (yieldBags / landAreaSize).toFixed(1);
            const kgPerAcre = (totalKg / landAreaSize).toFixed(0);
            const maundPerAcre = (kgPerAcre / 40).toFixed(1);
            
            profitLossData.push({
              land_id: land.land_id,
              farmer_name: land.farmer_name,
              farmer_phone: land.farmer_phone,
              crop_name: crop.crop_name,
              season: crop.season,
              total_cost: totalCost,
              yield_bags: yieldBags,
              revenue: yieldValue,
              profit_or_loss: netProfit,
              is_profit: isProfit,
              profitPercentage: profitPercentage,
              has_yield: hasYield,
              sowing_date: crop.sowing_date,
              harvest_date: crop.harvest_date,
              area_size: landAreaSize,
              area_unit: landAreaUnit,
              bags_per_acre: bagsPerAcre,
              kg_per_acre: kgPerAcre,
              maund_per_acre: maundPerAcre,
              total_kg: totalKg,
              activities: activitiesList,
            });
          }
        }
      } catch (err) {
        console.log('Error fetching profit data for land:', land.land_id, err);
      }
    }
    
    // Sort by profit (highest first)
    const sortedByProfit = [...profitLossData]
      .filter(d => d.has_yield)
      .sort((a, b) => b.profit_or_loss - a.profit_or_loss);
    
    const sortedByLoss = [...profitLossData]
      .filter(d => d.has_yield && !d.is_profit)
      .sort((a, b) => a.profit_or_loss - b.profit_or_loss);
    
    // Calculate summary
    const profitableCrops = profitLossData.filter(d => d.is_profit && d.has_yield);
    const lossCrops = profitLossData.filter(d => !d.is_profit && d.has_yield);
    const pendingYield = profitLossData.filter(d => !d.has_yield);
    
    const totalProfit = profitableCrops.reduce((sum, d) => sum + d.profit_or_loss, 0);
    const totalLoss = Math.abs(lossCrops.reduce((sum, d) => sum + d.profit_or_loss, 0));
    
    // Find most profitable crop type
    const cropProfitMap = {};
    profitableCrops.forEach(crop => {
      if (!cropProfitMap[crop.crop_name]) {
        cropProfitMap[crop.crop_name] = { total_profit: 0, count: 0 };
      }
      cropProfitMap[crop.crop_name].total_profit += crop.profit_or_loss;
      cropProfitMap[crop.crop_name].count += 1;
    });
    
    const bestCropType = Object.entries(cropProfitMap)
      .sort((a, b) => b[1].total_profit - a[1].total_profit)[0];
    
    return {
      type: 'profit_loss',
      title: 'فصلوں کا منافع/نقصان تجزیہ',
      titleEn: 'Crop Profit/Loss Analysis',
      icon: 'trending-up',
      color: PALETTE.purple,
      bgColor: PALETTE.purpleLite,
      allData: profitLossData,
      topProfit: sortedByProfit[0] || null,
      topLoss: sortedByLoss[0] || null,
      mostProfitableCrop: bestCropType ? { name: bestCropType[0], total_profit: bestCropType[1].total_profit, count: bestCropType[1].count } : null,
      summary: {
        total_crops: profitLossData.length,
        profitable_crops: profitableCrops.length,
        loss_crops: lossCrops.length,
        pending_yield: pendingYield.length,
        total_profit: totalProfit,
        total_loss: totalLoss,
        net_overall: totalProfit - totalLoss,
      },
      totalLands: nearbyLands.length,
    };
  };

  // Calculate analytics based on nearby lands
  const calculateAnalytics = async (type) => {
    if (nearbyLands.length === 0 && selectedArea) {
      await getNearbyLands();
      setTimeout(() => {
        calculateAnalyticsWithData(type);
      }, 500);
      return;
    }
    calculateAnalyticsWithData(type);
  };
  
  // ✅ UPDATED: Calculate analytics with EXPENSE for fertilizer and pesticide
  const calculateAnalyticsWithData = async (type) => {
    if (nearbyLands.length === 0) {
      setAnalyticsResult(null);
      return;
    }
    
    setLoadingAnalytics(true);
    
    try {
      if (type === 'profit_loss') {
        const result = await calculateProfitLossAnalytics();
        setAnalyticsResult(result);
        setShowResultModal(true);
        setLoadingAnalytics(false);
        return;
      }
      
      // Collect all crops data from nearby lands
      const allCropsData = [];
      
      for (const land of nearbyLands) {
        try {
          const response = await farmerAPI.getLandSeasonCrops(land.land_id, selectedSeason === 'All' ? '' : selectedSeason);
          if (response.success && response.crops) {
            allCropsData.push(...response.crops);
          }
        } catch (err) {
          console.log('Error fetching crops for land:', land.land_id);
        }
      }
      
      let result = null;
      
      // POPULAR CROP ANALYSIS
      if (type === 'popular_crop') {
        const cropCounts = {};
        allCropsData.forEach(crop => {
          if (crop.crop_name) {
            cropCounts[crop.crop_name] = (cropCounts[crop.crop_name] || 0) + 1;
          }
        });
        
        const sortedCrops = Object.entries(cropCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        
        result = {
          type: 'popular_crop',
          title: 'سب سے مقبول فصل',
          titleEn: 'Most Popular Crop',
          icon: 'spa',
          color: PALETTE.green,
          bgColor: PALETTE.greenLite,
          topItem: sortedCrops[0] ? { name: sortedCrops[0][0], count: sortedCrops[0][1] } : null,
          topList: sortedCrops.map(([name, count]) => ({ name, count })),
          totalLands: nearbyLands.length,
        };
      } 
      
      // ✅ POPULAR FERTILIZER ANALYSIS WITH EXPENSE
      else if (type === 'popular_fertilizer') {
        const fertilizerData = {}; // Store fertilizer with expense
        
        for (const crop of allCropsData) {
          // Check fertilizer from crop history
          let fertilizerName = crop.fertilizer_used;
          
          if (fertilizerName && fertilizerName !== '') {
            if (!fertilizerData[fertilizerName]) {
              fertilizerData[fertilizerName] = {
                name: fertilizerName,
                count: 0,
                total_cost: 0,
              };
            }
            fertilizerData[fertilizerName].count += 1;
          }
          
          // Also check activities for fertilizer usage and calculate cost
          if (crop.activities && crop.activities.length > 0) {
            crop.activities.forEach(activity => {
              if (activity.activity_type === 'Fertilizer' || 
                  activity.activity_type === 'Fertilization') {
                let fertName = activity.chemical_or_fertilizer_used || activity.description;
                if (fertName && fertName !== '' && fertName !== 'N/A') {
                  if (!fertilizerData[fertName]) {
                    fertilizerData[fertName] = {
                      name: fertName,
                      count: 0,
                      total_cost: 0,
                    };
                  }
                  fertilizerData[fertName].count += 1;
                  const cost = parseFloat(activity.activity_cost) || 0;
                  if (cost > 0) {
                    fertilizerData[fertName].total_cost += cost;
                  }
                }
              }
            });
          }
        }
        
        const sortedFertilizers = Object.entries(fertilizerData)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 5)
          .map(([name, data]) => ({ 
            name, 
            count: data.count,
            total_cost: data.total_cost,
            avg_cost: data.count > 0 ? Math.round(data.total_cost / data.count) : 0
          }));
        
        const topFertilizer = sortedFertilizers[0] || null;
        const totalCostAll = sortedFertilizers.reduce((sum, f) => sum + f.total_cost, 0);
        
        result = {
          type: 'popular_fertilizer',
          title: 'سب سے زیادہ استعمال ہونے والی کھاد',
          titleEn: 'Most Used Fertilizer',
          icon: 'eco',
          color: PALETTE.orange,
          bgColor: PALETTE.orangeLite,
          topItem: topFertilizer ? {
            name: topFertilizer.name,
            count: topFertilizer.count,
            total_cost: topFertilizer.total_cost,
            avg_cost: topFertilizer.avg_cost,
          } : null,
          topList: sortedFertilizers,
          totalLands: nearbyLands.length,
          total_cost_all: totalCostAll,
        };
      } 
      
      // ✅ COMMON PEST ANALYSIS WITH EXPENSE
      else if (type === 'common_pest') {
        const pestData = {}; // Store pest with expense
        
        for (const crop of allCropsData) {
          // Check pesticide from crop history
          let pesticideName = crop.pesticide_used;
          
          if (pesticideName && pesticideName !== '') {
            if (!pestData[pesticideName]) {
              pestData[pesticideName] = {
                name: pesticideName,
                count: 0,
                total_cost: 0,
              };
            }
            pestData[pesticideName].count += 1;
          }
          
          // Check activities for pesticide usage and calculate cost
          if (crop.activities && crop.activities.length > 0) {
            crop.activities.forEach(activity => {
              if (activity.activity_type === 'Pesticide' || 
                  activity.activity_type === 'Pest Control' || 
                  activity.activity_type === 'Spraying') {
                let pestName = activity.chemical_or_fertilizer_used || activity.description;
                if (pestName && pestName !== '' && pestName !== 'N/A' && pestName !== 'Unknown Pest') {
                  if (!pestData[pestName]) {
                    pestData[pestName] = {
                      name: pestName,
                      count: 0,
                      total_cost: 0,
                    };
                  }
                  pestData[pestName].count += 1;
                  const cost = parseFloat(activity.activity_cost) || 0;
                  if (cost > 0) {
                    pestData[pestName].total_cost += cost;
                  }
                }
              }
            });
          }
        }
        
        const sortedPests = Object.entries(pestData)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 5)
          .map(([name, data]) => ({ 
            name, 
            count: data.count,
            total_cost: data.total_cost,
            avg_cost: data.count > 0 ? Math.round(data.total_cost / data.count) : 0
          }));
        
        const topPest = sortedPests[0] || null;
        const totalCostAll = sortedPests.reduce((sum, p) => sum + p.total_cost, 0);
        
        result = {
          type: 'common_pest',
          title: 'سب سے عام کیڑے کا حملہ',
          titleEn: 'Most Common Pest Attack',
          icon: 'bug-report',
          color: PALETTE.red,
          bgColor: PALETTE.redLite,
          topItem: topPest ? {
            name: topPest.name,
            count: topPest.count,
            total_cost: topPest.total_cost,
            avg_cost: topPest.avg_cost,
          } : null,
          topList: sortedPests,
          totalLands: nearbyLands.length,
          total_cost_all: totalCostAll,
        };
      }
      
      setAnalyticsResult(result);
      setShowResultModal(true);
    } catch (error) {
      console.log('Error calculating analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Handle analytics type selection
  const handleAnalyticsSelect = async (type) => {
    setSelectedAnalyticsType(type);
    setShowAnalyticsDropdown(false);
    
    if (nearbyLands.length === 0 && selectedArea) {
      await getNearbyLands();
      setTimeout(() => {
        calculateAnalyticsWithData(type);
      }, 500);
    } else {
      calculateAnalyticsWithData(type);
    }
  };

  // Filtered areas for search
  const filteredAreas = areasData.filter(area =>
    !areaSearch || area.area_name.toLowerCase().includes(areaSearch.toLowerCase())
  );

  // Helper function to get activity icon
  const getActivityIconForType = (activityType) => {
    const icons = {
      'Plowing': '🚜', 'Land Preparation': '🚜', 'Sowing': '🌱',
      'Irrigation': '💧', 'Fertilization': '🌿', 'Spraying': '💨',
      'Pest Control': '🐛', 'Weeding': '🌾', 'Harvesting': '🌾',
      'Harvest': '🌾',
    };
    return icons[activityType] || '📝';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('ur-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Helper function to show full details
  const showCropDetailsWithActivities = (item) => {
    if (!item.has_yield) {
      Alert.alert(
        `⏳ ${item.crop_name} - ${item.farmer_name}`,
        `یہ فصل ابھی مکمل نہیں ہوئی۔\nپیداوار درج ہونے کے بعد منافع/نقصان کا حساب لگایا جا سکے گا۔`
      );
      return;
    }

    const areaSize = item.area_size || 1;
    const totalBags = item.yield_bags;
    const totalKg = totalBags * 40;
    const bagsPerAcre = (totalBags / areaSize).toFixed(1);
    const kgPerAcre = (totalKg / areaSize).toFixed(0);
    const maundPerAcre = (kgPerAcre / 40).toFixed(1);
    const profitPercent = item.profitPercentage || 
      (item.has_yield && item.revenue > 0 ? ((item.profit_or_loss / item.revenue) * 100).toFixed(1) : 'N/A');

    let activitiesText = '';
    if (item.activities && item.activities.length > 0) {
      activitiesText = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      activitiesText += '📋 سرگرمیاں (Activities):\n';
      activitiesText += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      item.activities.forEach((act, idx) => {
        const costText = act.cost > 0 ? `Rs ${act.cost.toFixed(0)}` : 'کوئی لاگت نہیں';
        activitiesText += `\n${idx + 1}. ${getActivityIconForType(act.type)} ${act.type}\n`;
        activitiesText += `   📅 تاریخ: ${formatDate(act.date)}\n`;
        activitiesText += `   💰 لاگت: ${costText}\n`;
        if (act.chemical) {
          activitiesText += `   🧪 استعمال: ${act.chemical}\n`;
        }
        if (act.description && act.description !== 'N/A' && act.description !== '') {
          activitiesText += `   📝 تفصیل: ${act.description}\n`;
        }
      });
    } else {
      activitiesText = '\n\n⚠️ کوئی سرگرمی درج نہیں';
    }

    Alert.alert(
      `📊 ${item.crop_name} - ${item.farmer_name}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🌾 فصل کی مکمل معلومات\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👨‍🌾 کسان: ${item.farmer_name}\n` +
      `📞 فون: ${item.farmer_phone || 'N/A'}\n` +
      `🌾 فصل: ${item.crop_name}\n` +
      `📅 موسم: ${item.season}\n` +
      `🗓️ بوائی: ${formatDate(item.sowing_date)}\n` +
      `🗓️ کٹائی: ${formatDate(item.harvest_date)}\n` +
      `📏 رقبہ: ${areaSize} ${item.area_unit || 'ایکڑ'}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 مالیاتی خلاصہ\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 کل لاگت: Rs ${item.total_cost.toFixed(0)}\n` +
      `🌾 کل پیداوار: ${totalBags} بوریاں (${totalKg} کلو)\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📏 پیداوار فی ایکڑ:\n` +
      `   🧺 ${bagsPerAcre} بوریاں\n` +
      `   ⚖️ ${kgPerAcre} کلو\n` +
      `   📦 ${maundPerAcre} من\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 آمدنی: Rs ${item.revenue.toFixed(0)}\n` +
      `📊 ${item.is_profit ? '✅ منافع' : '❌ نقصان'}: Rs ${Math.abs(item.profit_or_loss).toFixed(0)}\n` +
      `📈 منافع فیصد: ${profitPercent}% (آمدنی کا %)\n` +
      `${activitiesText}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💡 تجزیہ: ${item.is_profit ? 
        'اس فصل میں منافع ہوا ہے۔ اچھی کاشتکاری! 👍' : 
        'اس فصل میں نقصان ہوا ہے۔ اگلی بار لاگت کم کرنے کی کوشش کریں۔ 💡'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💡 نوٹ: 1 من = 40 کلو`,
      [{ text: 'بند کریں', style: 'default' }]
    );
  };

  // ✅ Render Profit/Loss Result Modal Content
  const renderProfitLossContent = () => {
    if (!analyticsResult || analyticsResult.type !== 'profit_loss') return null;
    
    const data = analyticsResult;
    
    return (
      <ScrollView style={styles.resultScrollView} showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        <View style={styles.profitSummaryStats}>
          <View style={styles.profitStatItem}>
            <Text style={styles.profitStatValue}>{data.summary.total_crops}</Text>
            <Text style={styles.profitStatLabel}>کل فصلیں</Text>
          </View>
          <View style={styles.profitStatItem}>
            <Text style={[styles.profitStatValue, { color: '#16A34A' }]}>{data.summary.profitable_crops}</Text>
            <Text style={styles.profitStatLabel}>منافع والی</Text>
          </View>
          <View style={styles.profitStatItem}>
            <Text style={[styles.profitStatValue, { color: '#DC2626' }]}>{data.summary.loss_crops}</Text>
            <Text style={styles.profitStatLabel}>نقصان والی</Text>
          </View>
          <View style={styles.profitStatItem}>
            <Text style={[styles.profitStatValue, { color: '#F59E0B' }]}>{data.summary.pending_yield}</Text>
            <Text style={styles.profitStatLabel}>پیداوار باقی</Text>
          </View>
        </View>

        {/* Net Overall */}
        <View style={[
          styles.netOverallCard,
          data.summary.net_overall >= 0 ? styles.netProfitCard : styles.netLossCard
        ]}>
          <Text style={styles.netOverallLabel}>مجموعی منافع/نقصان</Text>
          <Text style={[
            styles.netOverallValue,
            data.summary.net_overall >= 0 ? styles.netProfitValue : styles.netLossValue
          ]}>
            {data.summary.net_overall >= 0 ? '+' : ''}Rs {Math.abs(data.summary.net_overall).toFixed(0)}
          </Text>
        </View>

        {/* Top Profit */}
        {data.topProfit && (
          <TouchableOpacity 
            style={styles.topProfitCard}
            onPress={() => showCropDetailsWithActivities(data.topProfit)}
            activeOpacity={0.7}
          >
            <View style={styles.topProfitHeader}>
              <Icon name="emoji-events" size={20} color="#16A34A" />
              <Text style={styles.topProfitTitle}>🏆 سب سے زیادہ منافع</Text>
              <Icon name="info" size={16} color="#16A34A" style={{marginLeft: 'auto'}} />
            </View>
            <View style={styles.profitLossRow}>
              <Text style={styles.profitLossName}>{data.topProfit.crop_name}</Text>
              <Text style={styles.profitLossFarmer}>- {data.topProfit.farmer_name}</Text>
            </View>
            <View style={styles.profitLossDetails}>
              <View style={styles.profitDetailRow}>
                <Icon name="payments" size={14} color="#16A34A" />
                <Text style={styles.profitDetail}>منافع: Rs {data.topProfit.profit_or_loss.toFixed(0)}</Text>
              </View>
              <View style={styles.profitDetailRow}>
                <Icon name="trending-up" size={14} color="#16A34A" />
                <Text style={styles.profitDetail}>
                  منافع فیصد: {data.topProfit.profitPercentage || 
                    ((data.topProfit.profit_or_loss / data.topProfit.revenue) * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.profitDetailRow}>
                <Icon name="grass" size={14} color="#16A34A" />
                <Text style={styles.profitDetail}>پیداوار: {data.topProfit.yield_bags} بوریاں</Text>
              </View>
              <View style={styles.profitDetailRow}>
                <Icon name="square-foot" size={14} color="#16A34A" />
                <Text style={styles.profitDetail}>پیداوار فی ایکڑ: {data.topProfit.bags_per_acre} بوریاں | {data.topProfit.maund_per_acre} من</Text>
              </View>
              <View style={styles.profitDetailRow}>
                <Icon name="receipt" size={14} color="#16A34A" />
                <Text style={styles.profitDetail}>لاگت: Rs {data.topProfit.total_cost.toFixed(0)}</Text>
              </View>
            </View>
            <Text style={styles.clickHint}>👆 مکمل تاریخ کے لیے کلک کریں</Text>
          </TouchableOpacity>
        )}

        {/* Top Loss */}
        {data.topLoss && data.topLoss.has_yield && (
          <TouchableOpacity 
            style={styles.topLossCard}
            onPress={() => showCropDetailsWithActivities(data.topLoss)}
            activeOpacity={0.7}
          >
            <View style={styles.topLossHeader}>
              <Icon name="warning" size={20} color="#DC2626" />
              <Text style={styles.topLossTitle}>⚠️ سب سے زیادہ نقصان</Text>
              <Icon name="info" size={16} color="#DC2626" style={{marginLeft: 'auto'}} />
            </View>
            <View style={styles.profitLossRow}>
              <Text style={styles.profitLossName}>{data.topLoss.crop_name}</Text>
              <Text style={styles.profitLossFarmer}>- {data.topLoss.farmer_name}</Text>
            </View>
            <View style={styles.profitLossDetails}>
              <View style={styles.lossDetailRow}>
                <Icon name="money-off" size={14} color="#DC2626" />
                <Text style={styles.lossDetail}>نقصان: Rs {Math.abs(data.topLoss.profit_or_loss).toFixed(0)}</Text>
              </View>
              <View style={styles.lossDetailRow}>
                <Icon name="trending-down" size={14} color="#DC2626" />
                <Text style={styles.lossDetail}>
                  نقصان فیصد: {data.topLoss.profitPercentage ? 
                    Math.abs(parseFloat(data.topLoss.profitPercentage)).toFixed(1) : 
                    ((Math.abs(data.topLoss.profit_or_loss) / data.topLoss.revenue) * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
            <Text style={styles.clickHint}>👆 مکمل تاریخ کے لیے کلک کریں</Text>
          </TouchableOpacity>
        )}

        {/* Most Profitable Crop Type */}
        {data.mostProfitableCrop && (
          <View style={styles.mostProfitableCard}>
            <View style={styles.mostProfitableHeader}>
              <Icon name="star" size={20} color="#F59E0B" />
              <Text style={styles.mostProfitableTitle}>سب سے زیادہ منافع والی فصل</Text>
            </View>
            <Text style={styles.mostProfitableCropName}>{data.mostProfitableCrop.name}</Text>
            <Text style={styles.mostProfitableStats}>
              کل منافع: Rs {data.mostProfitableCrop.total_profit.toFixed(0)} • {data.mostProfitableCrop.count} کسان
            </Text>
          </View>
        )}

        {/* All Crops List */}
        <View style={styles.allCropsList}>
          <Text style={styles.allCropsTitle}>تمام فصلیں ({data.allData.length})</Text>
          {data.allData.map((item, index) => {
            const bagsPerAcre = item.bags_per_acre || (item.yield_bags / (item.area_size || 1)).toFixed(1);
            const maundPerAcre = item.maund_per_acre || ((item.yield_bags * 40 / (item.area_size || 1)) / 40).toFixed(1);
            const profitPercent = item.profitPercentage || 
              (item.has_yield && item.revenue > 0 ? ((item.profit_or_loss / item.revenue) * 100).toFixed(1) : 'N/A');
            
            return (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.cropProfitItem,
                  item.has_yield ? (item.is_profit ? styles.profitItem : styles.lossItem) : styles.pendingItem
                ]}
                onPress={() => showCropDetailsWithActivities(item)}
                activeOpacity={0.7}
              >
                <View style={styles.cropProfitHeader}>
                  <View style={styles.cropProfitLeft}>
                    <Text style={styles.cropProfitName}>{item.crop_name}</Text>
                    <Text style={styles.cropProfitFarmer}>{item.farmer_name}</Text>
                  </View>
                  {item.has_yield ? (
                    item.is_profit ? (
                      <View style={styles.profitBadge}>
                        <Icon name="trending-up" size={12} color="white" />
                        <Text style={styles.badgeText}>منافع</Text>
                      </View>
                    ) : (
                      <View style={styles.lossBadge}>
                        <Icon name="trending-down" size={12} color="white" />
                        <Text style={styles.badgeText}>نقصان</Text>
                      </View>
                    )
                  ) : (
                    <View style={styles.pendingBadge}>
                      <Icon name="hourglass-empty" size={12} color="white" />
                      <Text style={styles.badgeText}>زیر التواء</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.cropProfitFooter}>
                  {item.has_yield ? (
                    <>
                      <Text style={[styles.cropProfitAmount, item.is_profit ? styles.profitAmount : styles.lossAmount]}>
                        {item.is_profit ? `+Rs ${item.profit_or_loss.toFixed(0)}` : `-Rs ${Math.abs(item.profit_or_loss).toFixed(0)}`}
                      </Text>
                      <Text style={styles.cropProfitROI}>
                        منافع فیصد: {profitPercent}%
                      </Text>
                      <Text style={styles.cropProfitYield}>🌾 {item.yield_bags} بوریاں</Text>
                    </>
                  ) : (
                    <Text style={styles.pendingText}>پیداوار درج نہیں</Text>
                  )}
                </View>
                
                {item.has_yield && (
                  <View style={styles.yieldPerAcreContainer}>
                    <Icon name="square-foot" size={10} color="#4CAF50" />
                    <Text style={styles.yieldPerAcreText}>
                      فی ایکڑ: {bagsPerAcre} بوریاں | {maundPerAcre} من
                    </Text>
                  </View>
                )}
                
                <Text style={styles.clickHintSmall}>👆 مکمل تفصیلات کے لیے کلک کریں</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.seasonInfoCard}>
          <Icon name="calendar-today" size={16} color={PALETTE.muted} />
          <Text style={styles.seasonInfoText}>
            موسم: {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'} • {data.totalLands} زمینوں کا تجزیہ
          </Text>
        </View>
      </ScrollView>
    );
  };

  // ✅ Render Fertilizer Analytics with Expense
  const renderFertilizerContent = () => {
    if (!analyticsResult || analyticsResult.type !== 'popular_fertilizer') return null;
    
    const data = analyticsResult;
    
    return (
      <ScrollView style={styles.resultScrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.mainResultCard, { backgroundColor: data.bgColor }]}>
          <Icon name={data.icon} size={50} color={data.color} />
          {data.topItem ? (
            <>
              <Text style={styles.mainResultName}>{data.topItem.name}</Text>
              <Text style={styles.mainResultCount}>
                {data.topItem.count} بار استعمال • {data.totalLands} زمینوں میں
              </Text>
              <View style={styles.expenseRow}>
                <View style={styles.expenseBox}>
                  <Text style={styles.expenseLabel}>کل خرچ</Text>
                  <Text style={styles.expenseValue}>Rs {data.topItem.total_cost.toLocaleString()}</Text>
                </View>
                <View style={styles.expenseBox}>
                  <Text style={styles.expenseLabel}>اوسط خرچ/استعمال</Text>
                  <Text style={styles.expenseValue}>Rs {data.topItem.avg_cost.toLocaleString()}</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.noDataText}>کوئی ڈیٹا دستیاب نہیں</Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data.totalLands}</Text>
            <Text style={styles.statLabel}>زمینوں کا تجزیہ</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5 کلومیٹر</Text>
            <Text style={styles.statLabel}>دائرہ</Text>
          </View>
        </View>

        {data.total_cost_all > 0 && (
          <View style={styles.totalCostCard}>
            <Text style={styles.totalCostLabel}>تمام کھادوں پر کل خرچ</Text>
            <Text style={styles.totalCostValue}>Rs {data.total_cost_all.toLocaleString()}</Text>
          </View>
        )}

        {data.topList && data.topList.length > 0 && (
          <View style={styles.topListCard}>
            <Text style={styles.topListTitle}>سرفہرست 5 کھادیں (خرچ کے ساتھ)</Text>
            {data.topList.map((item, index) => (
              <View key={index} style={styles.topListItem}>
                <View style={[styles.topListRank, { backgroundColor: data.color }]}>
                  <Text style={styles.topListRankText}>{index + 1}</Text>
                </View>
                <View style={styles.topListInfo}>
                  <Text style={styles.topListName}>{item.name}</Text>
                  <Text style={styles.topListSubtext}>{item.count} بار استعمال</Text>
                </View>
                <View style={styles.topListExpense}>
                  <Text style={styles.topListExpenseLabel}>خرچ</Text>
                  <Text style={styles.topListExpenseValue}>Rs {item.total_cost.toLocaleString()}</Text>
                  <Text style={styles.topListAvgValue}>(Rs {item.avg_cost.toLocaleString()}/بار)</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.seasonInfoCard}>
          <Icon name="calendar-today" size={16} color={PALETTE.muted} />
          <Text style={styles.seasonInfoText}>
            موسم: {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'}
          </Text>
        </View>
      </ScrollView>
    );
  };

  // ✅ Render Pesticide Analytics with Expense
  const renderPesticideContent = () => {
    if (!analyticsResult || analyticsResult.type !== 'common_pest') return null;
    
    const data = analyticsResult;
    
    return (
      <ScrollView style={styles.resultScrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.mainResultCard, { backgroundColor: data.bgColor }]}>
          <Icon name={data.icon} size={50} color={data.color} />
          {data.topItem ? (
            <>
              <Text style={styles.mainResultName}>{data.topItem.name}</Text>
              <Text style={styles.mainResultCount}>
                {data.topItem.count} بار استعمال • {data.totalLands} زمینوں میں
              </Text>
              <View style={styles.expenseRow}>
                <View style={styles.expenseBox}>
                  <Text style={styles.expenseLabel}>کل خرچ</Text>
                  <Text style={styles.expenseValue}>Rs {data.topItem.total_cost.toLocaleString()}</Text>
                </View>
                <View style={styles.expenseBox}>
                  <Text style={styles.expenseLabel}>اوسط خرچ/استعمال</Text>
                  <Text style={styles.expenseValue}>Rs {data.topItem.avg_cost.toLocaleString()}</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.noDataText}>کوئی ڈیٹا دستیاب نہیں</Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data.totalLands}</Text>
            <Text style={styles.statLabel}>زمینوں کا تجزیہ</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5 کلومیٹر</Text>
            <Text style={styles.statLabel}>دائرہ</Text>
          </View>
        </View>

        {data.total_cost_all > 0 && (
          <View style={styles.totalCostCard}>
            <Text style={styles.totalCostLabel}>تمام ادویات پر کل خرچ</Text>
            <Text style={styles.totalCostValue}>Rs {data.total_cost_all.toLocaleString()}</Text>
          </View>
        )}

        {data.topList && data.topList.length > 0 && (
          <View style={styles.topListCard}>
            <Text style={styles.topListTitle}>سرفہرست 5 ادویات (خرچ کے ساتھ)</Text>
            {data.topList.map((item, index) => (
              <View key={index} style={styles.topListItem}>
                <View style={[styles.topListRank, { backgroundColor: data.color }]}>
                  <Text style={styles.topListRankText}>{index + 1}</Text>
                </View>
                <View style={styles.topListInfo}>
                  <Text style={styles.topListName}>{item.name}</Text>
                  <Text style={styles.topListSubtext}>{item.count} بار استعمال</Text>
                </View>
                <View style={styles.topListExpense}>
                  <Text style={styles.topListExpenseLabel}>خرچ</Text>
                  <Text style={styles.topListExpenseValue}>Rs {item.total_cost.toLocaleString()}</Text>
                  <Text style={styles.topListAvgValue}>(Rs {item.avg_cost.toLocaleString()}/بار)</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.seasonInfoCard}>
          <Icon name="calendar-today" size={16} color={PALETTE.muted} />
          <Text style={styles.seasonInfoText}>
            موسم: {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'}
          </Text>
        </View>
      </ScrollView>
    );
  };

  // ✅ Render Regular Analytics Content
  const renderRegularAnalyticsContent = () => {
    if (!analyticsResult || analyticsResult.type === 'profit_loss' || 
        analyticsResult.type === 'popular_fertilizer' || analyticsResult.type === 'common_pest') return null;
    
    const data = analyticsResult;
    
    return (
      <ScrollView style={styles.resultScrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.mainResultCard, { backgroundColor: data.bgColor }]}>
          <Icon name={data.icon} size={50} color={data.color} />
          {data.topItem ? (
            <>
              <Text style={styles.mainResultName}>{data.topItem.name}</Text>
              <Text style={styles.mainResultCount}>
                {data.topItem.count} کسانوں نے استعمال کیا
              </Text>
            </>
          ) : (
            <Text style={styles.noDataText}>کوئی ڈیٹا دستیاب نہیں</Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data.totalLands}</Text>
            <Text style={styles.statLabel}>زمینوں کا تجزیہ</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5 کلومیٹر</Text>
            <Text style={styles.statLabel}>دائرہ</Text>
          </View>
        </View>

        {data.topList && data.topList.length > 0 && (
          <View style={styles.topListCard}>
            <Text style={styles.topListTitle}>
              {data.type === 'popular_crop' ? 'سرفہرست 5 فصلیں' : 'سرفہرست 5 نتائج'}
            </Text>
            {data.topList.map((item, index) => (
              <View key={index} style={styles.topListItem}>
                <View style={[styles.topListRank, { backgroundColor: data.color }]}>
                  <Text style={styles.topListRankText}>{index + 1}</Text>
                </View>
                <Text style={styles.topListName}>{item.name}</Text>
                <Text style={[styles.topListCount, { color: data.color }]}>{item.count}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.seasonInfoCard}>
          <Icon name="calendar-today" size={16} color={PALETTE.muted} />
          <Text style={styles.seasonInfoText}>
            موسم: {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'}
          </Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          {/* City Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('city')}</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowCityDropdown(true)}
            >
              <Text style={[styles.dropdownText, !selectedCity && { color: '#999' }]}>
                {selectedCity ? t(selectedCity) : t('selectDistrict')}
              </Text>
              <Icon name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Area Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('area')}</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, !selectedCity && styles.disabledDropdown]}
              onPress={() => selectedCity && setShowAreaDropdown(true)}
              disabled={!selectedCity}
            >
              <Text style={[styles.dropdownText, !selectedArea && { color: '#999' }]}>
                {selectedArea ? t(selectedArea) : (selectedCity ? t('selectArea') : t('selectDistrictFirst'))}
              </Text>
              <Icon name="arrow-drop-down" size={24} color={selectedCity ? "#666" : "#ccc"} />
            </TouchableOpacity>
          </View>

          {/* Season Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('season')}</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowSeasonDropdown(true)}
            >
              <Text style={styles.dropdownText}>
                {seasonsWithDates.find(s => s.name === selectedSeason)?.label || 'سب'}
              </Text>
              <Icon name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Analytics Type Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('analyticsType')}</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, !selectedArea && styles.disabledDropdown]}
              onPress={() => selectedArea && setShowAnalyticsDropdown(true)}
              disabled={!selectedArea}
            >
              <Text style={[styles.dropdownText, !selectedAnalyticsType && { color: '#999' }]}>
                {selectedAnalyticsType 
                  ? t(analyticsTypes.find(a => a.id === selectedAnalyticsType)?.label) 
                  : t('selectAnalyticsType')}
              </Text>
              <Icon name="arrow-drop-down" size={24} color={selectedArea ? "#666" : "#ccc"} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <Icon name="info" size={20} color={PALETTE.blue} />
            <Text style={styles.infoText}>5 کلومیٹر کے دائرے میں قریبی کسانوں کی سرگرمیوں کا تجزیہ</Text>
          </View>
        </View>

        {(loadingNearby || loadingAnalytics) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PALETTE.green} />
            <Text style={styles.loadingText}>
              {loadingNearby ? 'قریبی زمینیں لوڈ ہو رہی ہیں...' : 'تجزیات کا حساب ہو رہا ہے...'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* City Dropdown Modal */}
      <Modal visible={showCityDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCityDropdown(false)}>
          <View style={styles.dropdownMenu}>
            <Text style={styles.dropdownTitle}>{t('selectDistrictTitle')}</Text>
            <ScrollView style={styles.dropdownScrollView} showsVerticalScrollIndicator={false}>
              {cities.map((city, index) => (
                <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleCitySelect(city)}>
                  <Text style={styles.dropdownItemText}>{t(city)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Area Dropdown Modal */}
      <Modal visible={showAreaDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAreaDropdown(false)}>
          <View style={[styles.dropdownMenu, { height: height * 0.6 }]}>
            <Text style={styles.dropdownTitle}>{t('selectAreaInCity')} {t(selectedCity)}</Text>
            <View style={styles.searchContainer}>
              <TextInput style={styles.searchInput} placeholder={t('searchArea')} value={areaSearch} onChangeText={setAreaSearch} placeholderTextColor="#999" />
              <Icon name="search" size={20} color="#666" />
            </View>
            <ScrollView style={styles.dropdownScrollView} showsVerticalScrollIndicator={false}>
              {loadingAreas ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={PALETTE.green} />
                  <Text style={styles.loadingText}>{t('loadingAreas')}</Text>
                </View>
              ) : filteredAreas.length > 0 ? (
                filteredAreas.map((area, index) => (
                  <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleAreaSelect(area.area_name)}>
                    <View style={styles.areaItemContent}>
                      <Text style={styles.dropdownItemText}>{t(area.area_name)}</Text>
                      <Text style={styles.areaZoneText}>{area.description}</Text>
                    </View>
                    <Icon name="chevron-right" size={20} color="#999" />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>{t('noAreasFound')}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Season Dropdown Modal */}
      <Modal visible={showSeasonDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSeasonDropdown(false)}>
          <View style={styles.dropdownMenu}>
            <Text style={styles.dropdownTitle}>{t('selectSeasonTitle')}</Text>
            <ScrollView style={styles.dropdownScrollView} showsVerticalScrollIndicator={false}>
              {seasonsWithDates.map((season, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dropdownItem, selectedSeason === season.name && { backgroundColor: PALETTE.greenLite }]}
                  onPress={() => handleSeasonSelect(season.name)}
                >
                  <View>
                    <Text style={styles.dropdownItemText}>{season.label} ({season.name})</Text>
                    {season.from && <Text style={styles.seasonDateText}>{season.from} - {season.to}</Text>}
                  </View>
                  {selectedSeason === season.name && <Icon name="check" size={20} color={PALETTE.green} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Analytics Type Dropdown Modal */}
      <Modal visible={showAnalyticsDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAnalyticsDropdown(false)}>
          <View style={styles.dropdownMenu}>
            <Text style={styles.dropdownTitle}>{t('selectAnalyticsType')}</Text>
            <ScrollView style={styles.dropdownScrollView} showsVerticalScrollIndicator={false}>
              {analyticsTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dropdownItem, selectedAnalyticsType === type.id && { backgroundColor: type.bgColor }]}
                  onPress={() => handleAnalyticsSelect(type.id)}
                >
                  <View style={styles.analyticsItemContent}>
                    <Icon name={type.icon} size={24} color={type.color} />
                    <Text style={styles.dropdownItemText}>{t(type.label)}</Text>
                  </View>
                  {selectedAnalyticsType === type.id && <Icon name="check" size={20} color={type.color} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Analytics Result Modal */}
      <Modal visible={showResultModal} transparent animationType="slide">
        <View style={styles.resultModalOverlay}>
          <View style={styles.resultModalContent}>
            <View style={styles.resultModalHeader}>
              <Text style={styles.resultModalTitle}>{analyticsResult?.title || 'تجزیات'}</Text>
              <TouchableOpacity onPress={() => setShowResultModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {loadingAnalytics ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PALETTE.green} />
                <Text style={styles.loadingText}>تجزیات کا حساب ہو رہا ہے...</Text>
              </View>
            ) : analyticsResult ? (
              analyticsResult.type === 'profit_loss' 
                ? renderProfitLossContent()
                : analyticsResult.type === 'popular_fertilizer'
                  ? renderFertilizerContent()
                  : analyticsResult.type === 'common_pest'
                    ? renderPesticideContent()
                    : renderRegularAnalyticsContent()
            ) : (
              <View style={styles.noDataContainer}>
                <Icon name="info" size={50} color={PALETTE.muted} />
                <Text style={styles.noDataText}>کوئی ڈیٹا دستیاب نہیں</Text>
              </View>
            )}

            <TouchableOpacity style={styles.closeResultButton} onPress={() => setShowResultModal(false)}>
              <Text style={styles.closeResultButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bg },
  content: { padding: 16, paddingBottom: 32 },
  formCard: { backgroundColor: PALETTE.white, borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: PALETTE.text, marginBottom: 8, textAlign: 'right' },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12 },
  disabledDropdown: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  dropdownText: { fontSize: 14, color: PALETTE.text },
  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.blueLite, borderRadius: 8, padding: 12, marginTop: 8 },
  infoText: { fontSize: 12, color: PALETTE.blue, marginLeft: 8, flex: 1, textAlign: 'right' },
  loadingContainer: { alignItems: 'center', padding: 30 },
  loadingText: { fontSize: 14, color: PALETTE.muted, marginTop: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  dropdownMenu: { backgroundColor: PALETTE.white, borderRadius: 12, width: width * 0.85, maxHeight: height * 0.5, padding: 16 },
  dropdownTitle: { fontSize: 16, fontWeight: 'bold', color: PALETTE.text, textAlign: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  dropdownScrollView: { maxHeight: height * 0.35 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownItemText: { fontSize: 14, color: PALETTE.text },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14 },
  areaItemContent: { flex: 1 },
  areaZoneText: { fontSize: 12, color: PALETTE.muted, marginTop: 2 },
  seasonDateText: { fontSize: 12, color: PALETTE.muted, marginTop: 2 },
  analyticsItemContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  noDataContainer: { alignItems: 'center', padding: 30 },
  noDataText: { fontSize: 14, color: PALETTE.muted, textAlign: 'center', marginTop: 8 },
  resultModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  resultModalContent: { backgroundColor: PALETTE.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: height * 0.85, padding: 20 },
  resultModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  resultModalTitle: { fontSize: 18, fontWeight: 'bold', color: PALETTE.text },
  resultScrollView: { maxHeight: height * 0.6 },
  mainResultCard: { alignItems: 'center', padding: 24, borderRadius: 12, marginBottom: 16 },
  mainResultName: { fontSize: 22, fontWeight: 'bold', color: PALETTE.text, marginTop: 12, textAlign: 'center' },
  mainResultCount: { fontSize: 14, color: PALETTE.muted, marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16, alignItems: 'center', marginHorizontal: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: PALETTE.green },
  statLabel: { fontSize: 12, color: PALETTE.muted, marginTop: 4 },
  topListCard: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, marginBottom: 16 },
  topListTitle: { fontSize: 14, fontWeight: 'bold', color: PALETTE.text, textAlign: 'right', marginBottom: 12 },
  topListItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  topListRank: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  topListRankText: { fontSize: 12, fontWeight: 'bold', color: PALETTE.white },
  topListInfo: { flex: 1 },
  topListName: { fontSize: 14, fontWeight: 'bold', color: PALETTE.text },
  topListSubtext: { fontSize: 11, color: PALETTE.muted },
  topListCount: { fontSize: 14, fontWeight: 'bold' },
  topListExpense: { alignItems: 'flex-end' },
  topListExpenseLabel: { fontSize: 10, color: PALETTE.muted },
  topListExpenseValue: { fontSize: 13, fontWeight: 'bold', color: '#16A34A' },
  topListAvgValue: { fontSize: 10, color: PALETTE.muted },
  seasonInfoCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 16 },
  seasonInfoText: { fontSize: 12, color: PALETTE.muted, marginLeft: 8 },
  closeResultButton: { backgroundColor: PALETTE.green, borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  closeResultButtonText: { fontSize: 16, fontWeight: 'bold', color: PALETTE.white },
  
  // Expense Specific Styles
  expenseRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, gap: 12 },
  expenseBox: { flex: 1, backgroundColor: 'white', borderRadius: 8, padding: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  expenseLabel: { fontSize: 10, color: PALETTE.muted },
  expenseValue: { fontSize: 16, fontWeight: 'bold', color: '#16A34A', marginTop: 4 },
  totalCostCard: { backgroundColor: '#E8F5E9', borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: '#4CAF50' },
  totalCostLabel: { fontSize: 12, color: PALETTE.muted, marginBottom: 4 },
  totalCostValue: { fontSize: 20, fontWeight: 'bold', color: '#2E7D32' },
  
  // Profit/Loss Specific Styles
  profitSummaryStats: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  profitStatItem: { width: '48%', backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 8 },
  profitStatValue: { fontSize: 20, fontWeight: 'bold', color: PALETTE.text },
  profitStatLabel: { fontSize: 11, color: PALETTE.muted, marginTop: 4 },
  netOverallCard: { borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center' },
  netProfitCard: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#4CAF50' },
  netLossCard: { backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: '#EF5350' },
  netOverallLabel: { fontSize: 12, color: PALETTE.muted, marginBottom: 4 },
  netOverallValue: { fontSize: 24, fontWeight: 'bold' },
  netProfitValue: { color: '#2E7D32' },
  netLossValue: { color: '#DC2626' },
  topProfitCard: { backgroundColor: '#E8F5E9', borderRadius: 12, padding: 16, marginBottom: 16 },
  topProfitHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  topProfitTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32', flex: 1 },
  topLossCard: { backgroundColor: '#FFEBEE', borderRadius: 12, padding: 16, marginBottom: 16 },
  topLossHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  topLossTitle: { fontSize: 16, fontWeight: 'bold', color: '#DC2626', flex: 1 },
  profitLossRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  profitLossName: { fontSize: 18, fontWeight: 'bold', color: PALETTE.text },
  profitLossFarmer: { fontSize: 14, color: PALETTE.muted, marginLeft: 6 },
  profitLossDetails: { marginTop: 8 },
  profitDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  profitDetail: { fontSize: 13, color: '#2E7D32' },
  lossDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  lossDetail: { fontSize: 13, color: '#DC2626' },
  clickHint: { fontSize: 10, color: '#666', fontStyle: 'italic', marginTop: 8, textAlign: 'center' },
  clickHintSmall: { fontSize: 9, color: '#999', fontStyle: 'italic', marginTop: 6, textAlign: 'right' },
  mostProfitableCard: { backgroundColor: '#FEF3C7', borderRadius: 12, padding: 16, marginBottom: 16 },
  mostProfitableHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  mostProfitableTitle: { fontSize: 14, fontWeight: 'bold', color: '#F59E0B' },
  mostProfitableCropName: { fontSize: 20, fontWeight: 'bold', color: PALETTE.text, marginBottom: 4 },
  mostProfitableStats: { fontSize: 12, color: PALETTE.muted },
  allCropsList: { marginBottom: 16 },
  allCropsTitle: { fontSize: 16, fontWeight: 'bold', color: PALETTE.text, marginBottom: 12, textAlign: 'right' },
  cropProfitItem: { backgroundColor: '#F9FAFB', borderRadius: 10, padding: 12, marginBottom: 8 },
  profitItem: { borderLeftWidth: 4, borderLeftColor: '#16A34A' },
  lossItem: { borderLeftWidth: 4, borderLeftColor: '#DC2626' },
  pendingItem: { borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
  cropProfitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cropProfitLeft: { flex: 1 },
  cropProfitName: { fontSize: 16, fontWeight: 'bold', color: PALETTE.text },
  cropProfitFarmer: { fontSize: 12, color: PALETTE.muted, marginTop: 2 },
  profitBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16A34A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  lossBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DC2626', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  pendingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: 'white' },
  cropProfitFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  cropProfitAmount: { fontSize: 16, fontWeight: 'bold' },
  profitAmount: { color: '#16A34A' },
  lossAmount: { color: '#DC2626' },
  cropProfitROI: { fontSize: 12, color: PALETTE.muted },
  cropProfitYield: { fontSize: 12, color: PALETTE.green },
  pendingText: { fontSize: 12, color: '#F59E0B', fontStyle: 'italic' },
  yieldPerAcreContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  yieldPerAcreText: { fontSize: 11, color: '#4CAF50', fontWeight: '500' },
});

export default LocalRecommendationsScreen;