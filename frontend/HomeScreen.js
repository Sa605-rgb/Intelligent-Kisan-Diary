// first model just productions 
// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Modal
// } from 'react-native';
// import { cropAPI, farmerAPI } from './api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import T from './localization/T';

// const PALETTE = {
//   bg: '#FFFFFF',
//   text: '#111829ff',
//   muted: '#6B7280',
//   green: '#16A34A',
//   greenLite: '#E7F8EA',
//   greenSoft: '#CFf6D5',
//   ring: '#D1FAE5',
//   gray: '#F3F4F6',
//   darkOverlay: 'rgba(0, 0, 0, 0.5)'
// };

// function HomeScreen({ navigation, route }) {
  
//   const [city, setCity] = useState('');
//   const [season, setSeason] = useState('');
//   const [soilType, setSoilType] = useState('');
//   const [recommendedCrops, setRecommendedCrops] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [apiError, setApiError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
  
//   // ✅ STATES FOR HORIZONTAL CITIES
//   const [farmerLands, setFarmerLands] = useState([]);
//   const [availableCities, setAvailableCities] = useState([]);
//   const [selectedCity, setSelectedCity] = useState('');
//   const [farmerId, setFarmerId] = useState('');
  
//   // ✅ STATES FOR WEATHER
//   const [weatherData, setWeatherData] = useState(null);
//   const [weatherLoading, setWeatherLoading] = useState(false);
  
//   // ✅ STATES FOR NOTIFICATIONS
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState([]);
  
//   // ✅ STATES FOR SEASON DROPDOWN
//   const [selectedSeason, setSelectedSeason] = useState(() => {
//     const month = new Date().getMonth() + 1;
//     return (month >= 10 || month <= 3) ? 'RABI' : 'KHARIF';
//   });
//   const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);

//   // ✅ City mapping English to Urdu
//   const cityMap = {
//     'Rawalpindi': 'راولپنڈی',
//     'Faisalabad': 'فیصل آباد', 
//     'Lahore': 'لاہور',
//     'Multan': 'ملتان',
//     'Gujrat': 'گجرات',
//     'Sialkot': 'سیالکوٹ'
//   };

//   // Season mapping English to Urdu
//   const seasonMap = {
//     'RABI': 'ربیع',
//     'KHARIF': 'خریف'
//   };

//   // Soil type mapping English to Urdu
//   const soilMap = {
//     'CLAY LOAM': 'چکنی میٹھی',
//     'SILT LOAM': 'سلت میٹھی', 
//     'SANDY LOAM': 'ریتی میٹھی',
//     'CLAY': 'چکنی',
//     'LOAM': 'میٹھی',
//     'SANDY CLAY': 'ریتی چکنی',
//     'SILT': 'سلٹ'
//   };

//   // Crop mapping English to Urdu
//   const cropMap = {
//     'WHEAT': 'گندم',
//     'MAIZE': 'مکئی',
//     'RICE': 'چاول',
//     'SUGARCANE': 'گنا',
//     'COTTON': 'کپاس',
//     'BARLEY': 'جو',
//     'PEANUT': 'مونگ پھلی',
//     'CHICKPEAS': 'چنے',
//     'PADDY': 'دھان',
//     'MUSTARD': 'سرسوں',
//     'SUNFLOWER': 'سورج مکھی',
//     'BAJRA': 'باجرا',
//     'SORGHUM': 'جوار',
//     'TOBACCO': 'تمباکو',
//     'SESAMUM': 'تل'
//   };

//   const fallbackCrops = [
//     { crop: "گندم", predicted_production: 120.5 },
//     { crop: "سرسوں", predicted_production: 95.4 }
//   ];

//   // ✅ Dynamic season calculate karein
//   const getCurrentSeason = () => {
//     const currentMonth = new Date().getMonth() + 1;
//     if (currentMonth >= 10 || currentMonth <= 3) {
//       return 'RABI';
//     } else {
//       return 'KHARIF';
//     }
//   };

//   // ✅ Fetch farmer lands on component mount
//   useEffect(() => {
//     loadFarmerDataAndLands();
//   }, [route.params]);

//   // ✅ Load farmer data and lands
//   const loadFarmerDataAndLands = async () => {
//     try {
//       setInitialLoading(true);
      
//       const storedFarmerId = await AsyncStorage.getItem('farmerId');
//       if (storedFarmerId) {
//         setFarmerId(storedFarmerId);
//         await fetchFarmerLands(storedFarmerId);
//       } else {
//         setCity("فارمر آئی ڈی دستیاب نہیں");
//         setCurrentSeason();
//         setRecommendedCrops(fallbackCrops);
//       }
      
//     } catch (error) {
//       console.error('Data load error:', error);
//       setCity("ڈیٹا لوڈ نہیں ہو سکا");
//       setCurrentSeason();
//       setRecommendedCrops(fallbackCrops);
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   // ✅ Fetch all farmer lands
//   const fetchFarmerLands = async (farmerId) => {
//     try {
//       console.log('🔄 Fetching lands for farmer:', farmerId);
//       const response = await farmerAPI.getFarmerLands(farmerId);
      
//       let landsArray = [];
      
//       if (Array.isArray(response)) {
//         landsArray = response;
//       } else if (response && Array.isArray(response.lands)) {
//         landsArray = response.lands;
//       } else if (response && Array.isArray(response.data)) {
//         landsArray = response.data;
//       }
      
//       setFarmerLands(landsArray);
      
//       const cities = [...new Set(landsArray.map(land => land.city).filter(city => city))];
//       console.log('🏙️ Available cities:', cities);
//       setAvailableCities(cities);
      
//       if (cities.length > 0) {
//         handleCitySelect(cities[0]);
//       } else {
//         setCity("کوئی زمین دستیاب نہیں");
//         setCurrentSeason();
//         setRecommendedCrops(fallbackCrops);
//       }
      
//     } catch (error) {
//       console.error('❌ Lands fetch error:', error);
//       setAvailableCities([]);
//       setCity("زمینیں لوڈ نہیں ہو سکیں");
//       setCurrentSeason();
//       setRecommendedCrops(fallbackCrops);
//     }
//   };

//   // ✅ Fetch Live Weather from Backend
//   const fetchLiveWeather = async (urduCity) => {
//     setWeatherLoading(true);
//     try {
//       // ✅ Send Urdu city directly to backend (backend handles conversion)
//       const response = await cropAPI.getLiveWeather(urduCity);
      
//       if (response && response.success) {
//         setWeatherData({
//           temperature: response.current.temperature,
//           description: response.current.description_urdu || response.current.description,
//           humidity: response.current.humidity,
//           icon: response.current.icon || '🌤️',
//           city: response.city_urdu || urduCity,
//           isLive: true,
//           source: 'open-meteo'
//         });
//       } else {
//         // Fallback to estimation
//         setWeatherData(getEstimatedWeather(urduCity));
//       }
//     } catch (error) {
//       console.log('Weather fetch error:', error);
//       setWeatherData(getEstimatedWeather(urduCity));
//     } finally {
//       setWeatherLoading(false);
//     }
//   };

//   // ✅ Estimated weather if API fails
//   const getEstimatedWeather = (city) => {
//     const month = new Date().getMonth();
//     const hour = new Date().getHours();
    
//     let temp = 25;
//     if (month >= 3 && month <= 9) temp += 8;
//     if (hour >= 12 && hour <= 16) temp += 5;
    
//     const descriptions = ['صاف آسمان', 'جزوی بادل', 'معتدل'];
//     const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    
//     return {
//       temperature: temp,
//       description: randomDesc,
//       humidity: 65,
//       icon: '🌤️',
//       city: city,
//       isLive: false,
//       source: 'estimated'
//     };
//   };

//   // ✅ Handle city selection from horizontal buttons
//   const handleCitySelect = async (city) => {
//     setSelectedCity(city);
    
//     // Convert to Urdu for display
//     const urduCity = cityMap[city] || city;
//     setCity(urduCity);
    
//     // ✅ Fetch live weather
//     fetchLiveWeather(urduCity);
    
//     // Get soil type for this city from lands
//     const landForCity = farmerLands.find(land => land.city === city);
//     const soil = landForCity ? landForCity.soilType : await loadSoilType(city);
    
//     // Set current season
//     setCurrentSeason();
    
//     // Get crop recommendations
//     await getCropRecommendations(city, soil);
//   };

//   // ✅ Handle crop card press - Navigate to HistoryScreen
//   const handleCropCardPress = (cropName) => {
//     // Get land info for selected city
//     const landForCity = farmerLands.find(land => land.city === selectedCity);
    
//     // Zone directly from database - "zone" field contains بارانی/نہری/چاہی
//     const zone = landForCity?.zone || '';
    
//     console.log('🌾 Navigating to HistoryScreen:', {
//       cropName,
//       city: selectedCity,
//       zone: zone,
//       landData: landForCity
//     });
    
//     // Navigate to HistoryScreen with params
//     navigation.navigate('HistoryScreen', {
//       cropName: cropName,
//       city: selectedCity,
//       zone: zone
//     });
//   };

//   // ✅ Modified soil type loader
//   const loadSoilType = async (city = '') => {
//     try {
//       if (city && farmerLands.length > 0) {
//         const landForCity = farmerLands.find(land => land.city === city);
//         if (landForCity && landForCity.soilType) {
//           return landForCity.soilType;
//         }
//       }
      
//       const defaultSoils = {
//         'Rawalpindi': 'CLAY LOAM',
//         'Faisalabad': 'SANDY LOAM', 
//         'Lahore': 'LOAM',
//         'Multan': 'SANDY CLAY',
//         'Gujrat': 'LOAM',
//         'Sialkot': 'CLAY LOAM'
//       };
//       return defaultSoils[city] || 'CLAY LOAM';
      
//     } catch (error) {
//       return 'CLAY LOAM';
//     }
//   };

//   // Current season automatically set karein (UI ke liye)
//   const setCurrentSeason = () => {
//     const urduSeason = seasonMap[selectedSeason] || selectedSeason;
//     setSeason(urduSeason);
//   };

//   // ✅ Handle season dropdown change
//   const handleSeasonChange = async (newSeason) => {
//     setSelectedSeason(newSeason);
//     setShowSeasonDropdown(false);
//     const urduSeason = seasonMap[newSeason] || newSeason;
//     setSeason(urduSeason);
    
//     // Re-fetch recommendations with new season
//     if (selectedCity) {
//       const landForCity = farmerLands.find(land => land.city === selectedCity);
//       const soil = landForCity?.soilType || await loadSoilType(selectedCity);
//       await getCropRecommendationsWithSeason(selectedCity, soil, newSeason);
//     }
//   };

//   // ✅ Get crop recommendations based on selected city
//   const getCropRecommendations = async (location, soil = null) => {
//     await getCropRecommendationsWithSeason(location, soil, selectedSeason);
//   };

//   // ✅ Get crop recommendations with specific season
//   const getCropRecommendationsWithSeason = async (location, soil = null, seasonToUse) => {
//     const englishCity = location;
//     const englishSoil = soil || await loadSoilType(location);
    
//     console.log('🌾 API Call Parameters:');
//     console.log('City:', englishCity);
//     console.log('Season:', seasonToUse);
//     console.log('Soil:', englishSoil);
    
//     if (!englishCity || englishCity === "Location not set") {
//       setRecommendedCrops(fallbackCrops);
//       return;
//     }

//     setLoading(true);
//     setApiError(false);
//     setErrorMessage('');
    
//     try {
//       const data = await cropAPI.getCropRecommendations(
//         englishCity,
//         seasonToUse,
//         englishSoil
//       );
      
//       if (data.error) {
//         setApiError(true);
//         setErrorMessage(data.error);
//         setRecommendedCrops(fallbackCrops);
//         return;
//       }
      
//       console.log('✅ API Response:', data);
      
//       if (data.season) {
//         const urduSeason = seasonMap[data.season] || data.season;
//         setSeason(urduSeason);
//       }
      
//       if (data.recommendations && Array.isArray(data.recommendations)) {
//         const urduCrops = data.recommendations.map(item => ({
//           crop: cropMap[item.crop] || item.crop,
//           predicted_production: item.predicted_production
//         }));
        
//         setRecommendedCrops(urduCrops);
//       } else {
//         setRecommendedCrops(fallbackCrops);
//       }
      
//     } catch (error) {
//       console.error('❌ Crop recommendation error:', error);
//       setApiError(true);
//       setErrorMessage(error.message);
//       setRecommendedCrops(fallbackCrops);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ DYNAMIC NOTIFICATIONS
//   const generateDynamicNotifications = () => {
//     if (availableCities.length === 0 || recommendedCrops.length === 0) {
//       return [];
//     }

//     let cityNotifications = [];

//     availableCities.forEach(city => {
//       const availableCrops = recommendedCrops.map(crop => crop.crop);
      
//       if (availableCrops.length > 0) {
//         const urduCity = cityMap[city] || city;
//         const urduSeason = seasonMap[getCurrentSeason()] || getCurrentSeason();
        
//         cityNotifications.push({
//           id: city,
//           type: 'city_crops',
//           city: urduCity,
//           crops: availableCrops,
//           message: `${urduCity} میں ${urduSeason} کے موسم میں آپ یہ فصلیں لگا سکتے ہیں: ${availableCrops.join('، ')}`,
//           timestamp: new Date().toLocaleDateString('ur-PK')
//         });
//       }
//     });

//     return cityNotifications;
//   };

//   // ✅ Jab bhi cities ya crops update hon, notifications generate karein
//   useEffect(() => {
//     const newNotifications = generateDynamicNotifications();
//     setNotifications(newNotifications);
//   }, [availableCities, recommendedCrops, season]);

//   // ✅ Weather Display Component - Right aligned with icon
//   const WeatherDisplay = () => {
//     if (weatherLoading) {
//       return (
//         <View style={homeStyles.weatherRow}>
//           <Text style={homeStyles.weatherText}>موسم کی معلومات لوڈ ہو رہی ہیں...</Text>
//           <ActivityIndicator size="small" color={PALETTE.green} style={{ marginLeft: 8 }} />
//         </View>
//       );
//     }

//     if (!weatherData) {
//       return (
//         <View style={homeStyles.weatherRow}>
//           <Text style={homeStyles.weatherText}>موسم کی معلومات دستیاب نہیں</Text>
//           <Text style={homeStyles.weatherIcon}>🌤️</Text>
//         </View>
//       );
//     }

//     return (
//       <View style={homeStyles.weatherRow}>
//         <View style={homeStyles.weatherInfo}>
//           <Text style={homeStyles.weatherTemp}>
//             {weatherData.city} - {weatherData.description} - {weatherData.temperature}°C {weatherData.icon}
//           </Text>
//           <Text style={homeStyles.weatherDesc}>
//             نمی: {weatherData.humidity}%
//             {!weatherData.isLive && ' (اندازہ)'}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   // ✅ Notification Bell Component
//   const NotificationBell = () => (
//     <Pressable 
//       style={homeStyles.notificationBell}
//       onPress={() => setShowNotifications(true)}
//     >
//       <Text style={homeStyles.bellIcon}>🔔</Text>
//       {notifications.length > 0 && (
//         <View style={homeStyles.notificationBadge}>
//           <Text style={homeStyles.badgeText}>{notifications.length}</Text>
//         </View>
//       )}
//     </Pressable>
//   );

//   // ✅ Instagram Style Modal
//   const NotificationModal = () => (
//     <Modal
//       visible={showNotifications}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowNotifications(false)}
//     >
//       <View style={homeStyles.modalOverlay}>
//         <Pressable 
//           style={homeStyles.overlayBackground}
//           onPress={() => setShowNotifications(false)}
//         />
        
//         <View style={homeStyles.modalContent}>
//           {/* Header */}
//           <View style={homeStyles.modalHeader}>
//             <Text style={homeStyles.modalTitle}>فصلوں کی تجاویز</Text>
//             <Pressable 
//               onPress={() => setShowNotifications(false)}
//               style={homeStyles.closeButton}
//             >
//               <Text style={homeStyles.closeIcon}>✕</Text>
//             </Pressable>
//           </View>

//           {/* Notifications List */}
//           <ScrollView 
//             style={homeStyles.notificationsList}
//             showsVerticalScrollIndicator={false}
//           >
//             {notifications.length === 0 ? (
//               <View style={homeStyles.emptyState}>
//                 <Text style={homeStyles.emptyIcon}>🌱</Text>
//                 <Text style={homeStyles.emptyText}>فی الحال کوئی تجاویز نہیں</Text>
//               </View>
//             ) : (
//               notifications.map(notification => (
//                 <View key={notification.id} style={homeStyles.notificationCard}>
//                   <View style={homeStyles.notificationHeader}>
//                     <Text style={homeStyles.cityName}>{notification.city}</Text>
//                     <Text style={homeStyles.notificationTime}>{notification.timestamp}</Text>
//                   </View>
//                   <Text style={homeStyles.notificationMessage}>
//                     {notification.message}
//                   </Text>
//                   <View style={homeStyles.cropsContainer}>
//                     {notification.crops.map((crop, index) => (
//                       <View key={index} style={homeStyles.cropTag}>
//                         <Text style={homeStyles.cropText}>{crop}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 </View>
//               ))
//             )}
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );

//   // ✅ HORIZONTAL CITIES COMPONENT
//   const HorizontalCities = () => (
//     <View style={{ marginBottom: 20 }}>
//       <Text style={homeStyles.label}>اپنے شہر کا انتخاب کریں</Text>
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false}
//         style={homeStyles.horizontalScroll}
//       >
//         <View style={homeStyles.citiesContainer}>
//           {availableCities.map((city, index) => (
//             <Pressable
//               key={index}
//               style={[
//                 homeStyles.cityButton,
//                 selectedCity === city && homeStyles.cityButtonSelected
//               ]}
//               onPress={() => handleCitySelect(city)}
//             >
//               <Text style={[
//                 homeStyles.cityButtonText,
//                 selectedCity === city && homeStyles.cityButtonTextSelected
//               ]}>
//                 {cityMap[city] || city}
//               </Text>
//             </Pressable>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );

//   // Handle navigation to AddMoreEntry screen
//   const handleAddMoreEntry = () => {
//     navigation.navigate('AddMoreEntry');
//   };

//   // Refresh recommendations
//   const handleRefresh = () => {
//     if (selectedCity) {
//       getCropRecommendations(selectedCity, soilType);
//     }
//   };

//   if (initialLoading) {
//     return (
//       <SafeAreaView style={styles.root}>
//         <View style={homeStyles.loadingContainer}>
//           <ActivityIndicator size="large" color={PALETTE.green} />
//           <T style={homeStyles.loadingText}>Loading...</T>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.root}>
//       <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
//         {/* Top bar with notification bell */}
//         <View style={homeStyles.topRow}>
//           <T style={homeStyles.topTitle}>HOME</T>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <NotificationBell />
//           </View>
//         </View>

//         {/* ✅ Weather Display - Updated with Live Data */}
//         <WeatherDisplay />

//         {/* ✅ HORIZONTAL CITIES */}
//         <HorizontalCities />

//         {/* ✅ Season Dropdown */}
//         <View style={{ marginBottom: 20 }}>
//           <T style={homeStyles.label}>Select Season</T>
//           <Pressable
//             style={homeStyles.dropdown}
//             onPress={() => setShowSeasonDropdown(!showSeasonDropdown)}
//           >
//             <Text style={homeStyles.dropdownText}>
//               {selectedSeason === 'RABI' ? '🌾 ربیع (Rabi)' : '🌽 خریف (Kharif)'}
//             </Text>
//             <Text style={homeStyles.dropdownArrow}>
//               {showSeasonDropdown ? '▲' : '▼'}
//             </Text>
//           </Pressable>
          
//           {/* Dropdown Options */}
//           {showSeasonDropdown && (
//             <View style={homeStyles.dropdownOptions}>
//               <Pressable
//                 style={[
//                   homeStyles.dropdownOption,
//                   selectedSeason === 'RABI' && homeStyles.dropdownOptionSelected
//                 ]}
//                 onPress={() => handleSeasonChange('RABI')}
//               >
//                 <Text style={[
//                   homeStyles.dropdownOptionText,
//                   selectedSeason === 'RABI' && homeStyles.dropdownOptionTextSelected
//                 ]}>
//                   🌾 ربیع (Rabi)
//                 </Text>
//                 {selectedSeason === 'RABI' && <Text style={homeStyles.checkmark}>✓</Text>}
//               </Pressable>
              
//               <Pressable
//                 style={[
//                   homeStyles.dropdownOption,
//                   selectedSeason === 'KHARIF' && homeStyles.dropdownOptionSelected
//                 ]}
//                 onPress={() => handleSeasonChange('KHARIF')}
//               >
//                 <Text style={[
//                   homeStyles.dropdownOptionText,
//                   selectedSeason === 'KHARIF' && homeStyles.dropdownOptionTextSelected
//                 ]}>
//                   🌽 خریف (Kharif)
//                 </Text>
//                 {selectedSeason === 'KHARIF' && <Text style={homeStyles.checkmark}>✓</Text>}
//               </Pressable>
//             </View>
//           )}
//         </View>

//         {/* Suggested Crops */}
//         <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>
//           <T style={homeStyles.sectionTitle}>Recommended Crops for Your Area</T>
//         </View>

//         {apiError ? (
//           <View style={homeStyles.errorContainer}>
//             <Text style={homeStyles.errorText}>❌ Failed to load data</Text>
//             <Text style={homeStyles.errorSubText}>{errorMessage}</Text>
//             <Pressable onPress={handleRefresh} style={homeStyles.retryButton}>
//               <T style={homeStyles.retryButtonText}>Try Again</T>
//             </Pressable>
//           </View>
//         ) : loading ? (
//           <View style={homeStyles.loadingContainer}>
//             <ActivityIndicator size="small" color={PALETTE.green} />
//             <T style={homeStyles.loadingText}>Loading recommended crops...</T>
//           </View>
//         ) : (
//           <View style={homeStyles.cardRow}>
//             {recommendedCrops.map((crop, index) => (
//               <CropCard 
//                 key={index}
//                 title={crop.crop} 
//                 subtitle={`Best for ${city}`}
//                 production={crop.predicted_production}
//                 onPress={() => handleCropCardPress(crop.crop)}
//               />
//             ))}
//           </View>
//         )}

//         {/* Add More Entry button */}
//         <Pressable 
//           style={({ pressed }) => [
//             homeStyles.addBtn,
//             pressed && { opacity: 0.7 }
//           ]}
//           onPress={handleAddMoreEntry}
//         >
//           <Text style={homeStyles.addBtnPlus}>+</Text>
//           <T style={homeStyles.addBtnText}>Add More Entry</T>
//         </Pressable>

//         {/* Seasonal Tips */}
//         <T style={[homeStyles.sectionTitle, { marginTop: 20 }]}>Seasonal Tips</T>
//         <InsightItem text="Monitor water shortage" icon="💧" />
//         <InsightItem text="Apply fertilizer on time" icon="⏰" />
//         <InsightItem text="Sow crops according to season" icon="🌾" />
//         <InsightItem text="Proper use of pesticides" icon="🐛" />

//         {/* ✅ Notification Modal */}
//         <NotificationModal />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* ------------ Helpers for Home ------------ */
// function CropCard({ title, subtitle, production, onPress }) {
//   const getCropIcon = (cropName) => {
//     const iconMap = {
//       'گندم': '🌾',
//       'سرسوں': '🌼',
//       'مکئی': '🌽',
//       'چاول': '🍚',
//       'گنا': '🎋',
//       'کپاس': '☁️',
//       'جو': '📏',
//       'مونگ پھلی': '🥜',
//       'چنے': '🟤',
//       'دھان': '💧',
//       'سورج مکھی': '🌻',
//       'باجرا': '🌱',
//       'جوار': '🌿',
//       'تمباکو': '🚬',
//       'تل': '⚫',
//     };
    
//     return iconMap[cropName] || '🌱';
//   };

//   const cropIcon = getCropIcon(title);

//   return (
//     <Pressable 
//       style={({ pressed }) => [
//         homeStyles.card,
//         pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }
//       ]}
//       onPress={onPress}
//     >
//       <Text style={{ fontSize: 26, marginBottom: 6 }}>{cropIcon}</Text>
//       <Text style={homeStyles.cardTitle}>{title}</Text>
//       <Text style={homeStyles.cardSub} numberOfLines={2}>
//         {subtitle}
//       </Text>
//       {production && (
//         <Text style={homeStyles.productionText}>
//           متوقع پیداوار: {production} کلوگرام
//         </Text>
//       )}
//     </Pressable>
//   );
// }

// function InsightItem({ text, icon }) {
//   return (
//     <View style={homeStyles.insight}>
//       <T style={homeStyles.insightText}>{text}</T>
//       <Text style={{ fontSize: 16 }}>{icon}</Text>
//     </View>
//   );
// }

// /* ------------ Styles ------------ */
// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: PALETTE.bg },
// });

// const homeStyles = StyleSheet.create({
//   topRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 6,
//     marginBottom: 8,
//   },
//   topTitle: { fontSize: 16, fontWeight: '800', color: PALETTE.text },
//   iconBadge: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: PALETTE.greenLite,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 8,
//   },
//   weatherRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: PALETTE.greenLite,
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//   },
//   weatherIcon: { 
//     fontSize: 28, 
//     marginRight: 12 
//   },
//   weatherInfo: {
//     flex: 1,
//   },
//   weatherTemp: { 
//     fontSize: 20, 
//     fontWeight: '700', 
//     color: PALETTE.green,
//     textAlign: 'right',
//   },
//   weatherDesc: { 
//     fontSize: 12, 
//     color: PALETTE.muted,
//     textAlign: 'right',
//     marginTop: 2,
//   },
//   weatherText: {
//     fontSize: 14,
//     color: PALETTE.muted,
//     textAlign: 'right',
//     flex: 1,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: PALETTE.text,
//     textAlign: 'right',
//     marginBottom: 6,
//   },
//   infoBox: {
//     backgroundColor: PALETTE.gray,
//     padding: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: PALETTE.greenLite,
//     height: 44,
//     justifyContent: 'center',
//   },
//   infoText: {
//     fontSize: 14,
//     color: PALETTE.text,
//     textAlign: 'right',
//     fontWeight: '500',
//   },
//   // ✅ Dropdown Styles
//   dropdown: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: PALETTE.gray,
//     padding: 14,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: PALETTE.greenLite,
//   },
//   dropdownText: {
//     fontSize: 14,
//     color: PALETTE.text,
//     fontWeight: '600',
//   },
//   dropdownArrow: {
//     fontSize: 12,
//     color: PALETTE.green,
//   },
//   dropdownOptions: {
//     marginTop: 4,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: PALETTE.greenLite,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: 'hidden',
//   },
//   dropdownOption: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: PALETTE.gray,
//   },
//   dropdownOptionSelected: {
//     backgroundColor: PALETTE.greenLite,
//   },
//   dropdownOptionText: {
//     fontSize: 14,
//     color: PALETTE.text,
//     fontWeight: '500',
//   },
//   dropdownOptionTextSelected: {
//     color: PALETTE.green,
//     fontWeight: '700',
//   },
//   checkmark: {
//     fontSize: 16,
//     color: PALETTE.green,
//     fontWeight: '700',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: PALETTE.text,
//     textAlign: 'right',
//     marginBottom: 8,
//   },
//   cardRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     marginBottom: 16 
//   },
//   card: {
//     flex: 1,
//     backgroundColor: PALETTE.greenSoft,
//     borderRadius: 12,
//     padding: 12,
//     marginRight: 8,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     textAlign: 'right',
//     color: PALETTE.text,
//   },
//   cardSub: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     textAlign: 'right',
//     marginTop: 4,
//   },
//   productionText: {
//     fontSize: 12,
//     color: PALETTE.green,
//     textAlign: 'right',
//     marginTop: 4,
//     fontWeight: '600',
//   },
//   addBtn: {
//     marginTop: 12,
//     height: 44,
//     backgroundColor: PALETTE.green,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
//   addBtnPlus: { 
//     color: '#FFF', 
//     fontSize: 18, 
//     marginRight: 8 
//   },
//   addBtnText: { 
//     color: '#FFF', 
//     fontWeight: '700' 
//   },
//   insight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: PALETTE.gray,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     marginTop: 8,
//   },
//   insightText: {
//     flex: 1,
//     color: PALETTE.muted,
//     textAlign: 'right',
//     marginRight: 10,
//   },
//   loadingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     textAlign: 'center',
//     color: PALETTE.muted,
//     marginVertical: 10,
//     fontSize: 14,
//   },
//   errorContainer: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFE6E6',
//     borderRadius: 10,
//     marginVertical: 10,
//   },
//   errorText: {
//     color: '#D32F2F',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   errorSubText: {
//     color: '#D32F2F',
//     fontSize: 14,
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   retryButton: {
//     marginTop: 10,
//     backgroundColor: PALETTE.green,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
//   // ✅ HORIZONTAL CITIES STYLES
//   horizontalScroll: {
//     marginHorizontal: -16,
//   },
//   citiesContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   cityButton: {
//     backgroundColor: PALETTE.gray,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 20,
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: PALETTE.greenLite,
//   },
//   cityButtonSelected: {
//     backgroundColor: PALETTE.greenSoft,
//     borderColor: PALETTE.green,
//   },
//   cityButtonText: {
//     fontSize: 14,
//     color: PALETTE.text,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   cityButtonTextSelected: {
//     color: PALETTE.green,
//     fontWeight: '600',
//   },
//   // ✅ NOTIFICATION BELL STYLES
//   notificationBell: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: PALETTE.greenLite,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 8,
//     position: 'relative',
//     borderWidth: 2,
//     borderColor: PALETTE.greenSoft,
//   },
//   bellIcon: {
//     fontSize: 20,
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: -2,
//     right: -2,
//     backgroundColor: '#FF3B30',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//     borderColor: 'white',
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   // ✅ MODAL STYLES
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: PALETTE.darkOverlay,
//     justifyContent: 'flex-end',
//   },
//   overlayBackground: {
//     flex: 1,
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '80%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: PALETTE.gray,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: PALETTE.text,
//     textAlign: 'right',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   closeIcon: {
//     fontSize: 20,
//     color: PALETTE.muted,
//     fontWeight: 'bold',
//   },
//   notificationsList: {
//     maxHeight: 400,
//     padding: 16,
//   },
//   notificationCard: {
//     backgroundColor: PALETTE.gray,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: PALETTE.green,
//   },
//   notificationHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   cityName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: PALETTE.text,
//     textAlign: 'right',
//   },
//   notificationTime: {
//     fontSize: 12,
//     color: PALETTE.muted,
//     textAlign: 'right',
//   },
//   notificationMessage: {
//     fontSize: 14,
//     color: PALETTE.text,
//     textAlign: 'right',
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   cropsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'flex-end',
//   },
//   cropTag: {
//     backgroundColor: PALETTE.greenSoft,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     marginLeft: 8,
//     marginBottom: 4,
//   },
//   cropText: {
//     fontSize: 12,
//     color: PALETTE.green,
//     fontWeight: '600',
//     textAlign: 'right',
//   },
//   emptyState: {
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyIcon: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: PALETTE.muted,
//     textAlign: 'center',
//   },
// });

// export default HomeScreen;
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { cropAPI, farmerAPI } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import T from './localization/T';

const PALETTE = {
  bg: '#FFFFFF',
  text: '#111829ff',
  muted: '#6B7280',
  green: '#16A34A',
  greenLite: '#E7F8EA',
  greenSoft: '#CFf6D5',
  ring: '#D1FAE5',
  gray: '#F3F4F6',
  darkOverlay: 'rgba(0, 0, 0, 0.5)'
};

function HomeScreen({ navigation, route }) {
  
  const [city, setCity] = useState('');
  const [season, setSeason] = useState('');
  const [soilType, setSoilType] = useState('');
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // ✅ STATES FOR HORIZONTAL CITIES
  const [farmerLands, setFarmerLands] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [farmerId, setFarmerId] = useState('');
  
  // ✅ STATES FOR WEATHER
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  // ✅ STATES FOR NOTIFICATIONS
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // ✅ STATES FOR SEASON DROPDOWN
  const [selectedSeason, setSelectedSeason] = useState(() => {
    const month = new Date().getMonth() + 1;
    return (month >= 10 || month <= 3) ? 'RABI' : 'KHARIF';
  });
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);

  // ✅ City mapping English to Urdu
  const cityMap = {
    'Rawalpindi': 'راولپنڈی',
    'Faisalabad': 'فیصل آباد', 
    'Lahore': 'لاہور',
    'Multan': 'ملتان',
    'Gujrat': 'گجرات',
    'Sialkot': 'سیالکوٹ'
  };

  // Season mapping English to Urdu
  const seasonMap = {
    'RABI': 'ربیع',
    'KHARIF': 'خریف'
  };

  // Soil type mapping English to Urdu
  const soilMap = {
    'CLAY LOAM': 'چکنی میٹھی',
    'SILT LOAM': 'سلت میٹھی', 
    'SANDY LOAM': 'ریتی میٹھی',
    'CLAY': 'چکنی',
    'LOAM': 'میٹھی',
    'SANDY CLAY': 'ریتی چکنی',
    'SILT': 'سلٹ'
  };

  // Crop mapping English to Urdu
  const cropMap = {
    'WHEAT': 'گندم',
    'MAIZE': 'مکئی',
    'RICE': 'چاول',
    'SUGARCANE': 'گنا',
    'COTTON': 'کپاس',
    'BARLEY': 'جو',
    'PEANUT': 'مونگ پھلی',
    'CHICKPEAS': 'چنے',
    'PADDY': 'دھان',
    'MUSTARD': 'سرسوں',
    'SUNFLOWER': 'سورج مکھی',
    'BAJRA': 'باجرا',
    'SORGHUM': 'جوار',
    'TOBACCO': 'تمباکو',
    'SESAMUM': 'تل'
  };

  const fallbackCrops = [
    { crop: "گندم", predicted_production: 120.5, rank: 1 },
    { crop: "سرسوں", predicted_production: 95.4, rank: 2 }
  ];

  // ✅ Dynamic season calculate karein
  const getCurrentSeason = () => {
    const currentMonth = new Date().getMonth() + 1;
    if (currentMonth >= 10 || currentMonth <= 3) {
      return 'RABI';
    } else {
      return 'KHARIF';
    }
  };

  // ✅ Fetch farmer lands on component mount
  useEffect(() => {
    loadFarmerDataAndLands();
  }, [route.params]);

  // ✅ Load farmer data and lands
  const loadFarmerDataAndLands = async () => {
    try {
      setInitialLoading(true);
      
      const storedFarmerId = await AsyncStorage.getItem('farmerId');
      if (storedFarmerId) {
        setFarmerId(storedFarmerId);
        await fetchFarmerLands(storedFarmerId);
      } else {
        setCity("فارمر آئی ڈی دستیاب نہیں");
        setCurrentSeason();
        setRecommendedCrops(fallbackCrops);
      }
      
    } catch (error) {
      console.error('Data load error:', error);
      setCity("ڈیٹا لوڈ نہیں ہو سکا");
      setCurrentSeason();
      setRecommendedCrops(fallbackCrops);
    } finally {
      setInitialLoading(false);
    }
  };

  // ✅ Fetch all farmer lands
  const fetchFarmerLands = async (farmerId) => {
    try {
      console.log('🔄 Fetching lands for farmer:', farmerId);
      const response = await farmerAPI.getFarmerLands(farmerId);
      
      let landsArray = [];
      
      if (Array.isArray(response)) {
        landsArray = response;
      } else if (response && Array.isArray(response.lands)) {
        landsArray = response.lands;
      } else if (response && Array.isArray(response.data)) {
        landsArray = response.data;
      }
      
      setFarmerLands(landsArray);
      
      const cities = [...new Set(landsArray.map(land => land.city).filter(city => city))];
      console.log('🏙️ Available cities:', cities);
      setAvailableCities(cities);
      
      if (cities.length > 0) {
        handleCitySelect(cities[0]);
      } else {
        setCity("کوئی زمین دستیاب نہیں");
        setCurrentSeason();
        setRecommendedCrops(fallbackCrops);
      }
      
    } catch (error) {
      console.error('❌ Lands fetch error:', error);
      setAvailableCities([]);
      setCity("زمینیں لوڈ نہیں ہو سکیں");
      setCurrentSeason();
      setRecommendedCrops(fallbackCrops);
    }
  };

  // ✅ Fetch Live Weather from Backend
  const fetchLiveWeather = async (urduCity) => {
    setWeatherLoading(true);
    try {
      const response = await cropAPI.getLiveWeather(urduCity);
      
      if (response && response.success) {
        setWeatherData({
          temperature: response.current.temperature,
          description: response.current.description_urdu || response.current.description,
          humidity: response.current.humidity,
          icon: response.current.icon || '🌤️',
          city: response.city_urdu || urduCity,
          isLive: true,
          source: 'open-meteo'
        });
      } else {
        setWeatherData(getEstimatedWeather(urduCity));
      }
    } catch (error) {
      console.log('Weather fetch error:', error);
      setWeatherData(getEstimatedWeather(urduCity));
    } finally {
      setWeatherLoading(false);
    }
  };

  // ✅ Estimated weather if API fails
  const getEstimatedWeather = (city) => {
    const month = new Date().getMonth();
    const hour = new Date().getHours();
    
    let temp = 25;
    if (month >= 3 && month <= 9) temp += 8;
    if (hour >= 12 && hour <= 16) temp += 5;
    
    const descriptions = ['صاف آسمان', 'جزوی بادل', 'معتدل'];
    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    return {
      temperature: temp,
      description: randomDesc,
      humidity: 65,
      icon: '🌤️',
      city: city,
      isLive: false,
      source: 'estimated'
    };
  };

  // ✅ Handle city selection from horizontal buttons
  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    
    // Convert to Urdu for display
    const urduCity = cityMap[city] || city;
    setCity(urduCity);
    
    // ✅ Fetch live weather
    fetchLiveWeather(urduCity);
    
    // Get soil type for this city from lands
    const landForCity = farmerLands.find(land => land.city === city);
    const soil = landForCity ? landForCity.soilType : await loadSoilType(city);
    
    // Set current season
    setCurrentSeason();
    
    // Get crop recommendations using NEW BEST endpoint
    await getBestCropRecommendations(city, soil);
  };

  // ✅ Handle crop card press - Navigate to HistoryScreen
  const handleCropCardPress = (cropName, production) => {
    const landForCity = farmerLands.find(land => land.city === selectedCity);
    const zone = landForCity?.zone || '';
    
    console.log('🌾 Navigating to HistoryScreen:', {
      cropName,
      city: selectedCity,
      zone: zone,
      production: production
    });
    
    navigation.navigate('HistoryScreen', {
      cropName: cropName,
      city: selectedCity,
      zone: zone,
      predictedProduction: production
    });
  };

  // ✅ Modified soil type loader
  const loadSoilType = async (city = '') => {
    try {
      if (city && farmerLands.length > 0) {
        const landForCity = farmerLands.find(land => land.city === city);
        if (landForCity && landForCity.soilType) {
          return landForCity.soilType;
        }
      }
      
      const defaultSoils = {
        'Rawalpindi': 'CLAY LOAM',
        'Faisalabad': 'SANDY LOAM', 
        'Lahore': 'LOAM',
        'Multan': 'SANDY CLAY',
        'Gujrat': 'LOAM',
        'Sialkot': 'CLAY LOAM'
      };
      return defaultSoils[city] || 'CLAY LOAM';
      
    } catch (error) {
      return 'CLAY LOAM';
    }
  };

  // Current season automatically set karein (UI ke liye)
  const setCurrentSeason = () => {
    const urduSeason = seasonMap[selectedSeason] || selectedSeason;
    setSeason(urduSeason);
  };

  // ✅ Handle season dropdown change
  const handleSeasonChange = async (newSeason) => {
    setSelectedSeason(newSeason);
    setShowSeasonDropdown(false);
    const urduSeason = seasonMap[newSeason] || newSeason;
    setSeason(urduSeason);
    
    // Re-fetch recommendations with new season using NEW BEST endpoint
    if (selectedCity) {
      const landForCity = farmerLands.find(land => land.city === selectedCity);
      const soil = landForCity?.soilType || await loadSoilType(selectedCity);
      await getBestCropRecommendationsWithSeason(selectedCity, soil, newSeason);
    }
  };

  // ✅ NEW: Get BEST crop recommendations using the new endpoint
  const getBestCropRecommendations = async (location, soil = null) => {
    await getBestCropRecommendationsWithSeason(location, soil, selectedSeason);
  };

  // ✅ NEW: Get BEST crop recommendations with specific season
  const getBestCropRecommendationsWithSeason = async (location, soil = null, seasonToUse) => {
    const englishCity = location;
    const englishSoil = soil || await loadSoilType(location);
    
    console.log('🚀 BEST Recommendation API Call Parameters:');
    console.log('City:', englishCity);
    console.log('Season:', seasonToUse);
    console.log('Soil:', englishSoil);
    console.log('API Endpoint: /api/recommend_best');
    
    if (!englishCity || englishCity === "Location not set") {
      setRecommendedCrops(fallbackCrops);
      return;
    }

    setLoading(true);
    setApiError(false);
    setErrorMessage('');
    
    try {
      // ✅ NEW: Using BEST recommendation endpoint
      const data = await cropAPI.getBestCropRecommendations(
        englishCity,
        seasonToUse,
        englishSoil
      );
      
      console.log('✅ BEST API Response:', data);
      
      // ✅ Handle response from /api/recommend_best
      let recommendedCropsList = [];
      
      if (data && data.recommended_crops) {
        // ✅ NEW: Get combined scores for ranking
        const combinedScores = data.analysis?.combined_scores || {};
        
        // Convert English crop names to Urdu WITH scores and production
        recommendedCropsList = data.recommended_crops.map(crop => {
          const score = combinedScores[crop] || 0;
          
          // ✅ Calculate production based on crop type and score
          const estimatedProduction = calculateProductionByCrop(crop, score);
          
          return {
            crop: cropMap[crop] || crop,
            predicted_production: estimatedProduction,
            score: score,
            rank: data.recommended_crops.indexOf(crop) + 1
          };
        });
        
        console.log('🎯 BEST Recommendations Received:', recommendedCropsList);
        
      } else if (data && data.error) {
        // If API returned error
        setApiError(true);
        setErrorMessage(data.error);
        recommendedCropsList = fallbackCrops;
      } else {
        // If response format is unexpected
        console.log('⚠️ Unexpected response format, using fallback');
        recommendedCropsList = fallbackCrops;
      }
      
      setRecommendedCrops(recommendedCropsList);
      
    } catch (error) {
      console.error('❌ BEST Crop recommendation error:', error);
      setApiError(true);
      setErrorMessage(error.message);
      setRecommendedCrops(fallbackCrops);
      
      // Fall back to old endpoint
      console.log('🔄 Falling back to basic recommendations...');
      try {
        const fallbackData = await cropAPI.getCropRecommendations(
          englishCity,
          seasonToUse,
          englishSoil
        );
        
        if (fallbackData && fallbackData.recommendations) {
          const fallbackCropsList = fallbackData.recommendations.map(item => ({
            crop: cropMap[item.crop] || item.crop,
            predicted_production: item.predicted_production,
            rank: fallbackData.recommendations.indexOf(item) + 1
          }));
          setRecommendedCrops(fallbackCropsList);
          console.log('✅ Fallback successful');
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Production calculation based on crop type and score
  const calculateProductionByCrop = (cropName, score) => {
    // Base production for different crops (in kg per 40kg)
    const baseProduction = {
      'WHEAT': 300, 'MUSTARD': 220, 'BARLEY': 180, 'CHANA': 160,
      'RICE': 400, 'COTTON': 280, 'MAIZE': 350, 'PEANUT': 200,
      'SESAMUM': 150, 'SUNFLOWER': 230, 'BAJRA': 190, 'JOWAR': 170,
      'SUGARCANE': 500
    };
    
    const base = baseProduction[cropName] || 200;
    const multiplier = 0.5 + (score / 200); // Score 0-200 to multiplier 0.5-1.5
    
    return Math.round(base * multiplier);
  };

  // ✅ DYNAMIC NOTIFICATIONS
  const generateDynamicNotifications = () => {
    if (availableCities.length === 0 || recommendedCrops.length === 0) {
      return [];
    }

    let cityNotifications = [];

    availableCities.forEach(city => {
      const availableCrops = recommendedCrops.map(crop => crop.crop);
      
      if (availableCrops.length > 0) {
        const urduCity = cityMap[city] || city;
        const urduSeason = seasonMap[getCurrentSeason()] || getCurrentSeason();
        
        cityNotifications.push({
          id: city,
          type: 'city_crops',
          city: urduCity,
          crops: availableCrops,
          message: `${urduCity} میں ${urduSeason} کے موسم میں آپ یہ فصلیں لگا سکتے ہیں: ${availableCrops.join('، ')}`,
          timestamp: new Date().toLocaleDateString('ur-PK')
        });
      }
    });

    return cityNotifications;
  };

  // ✅ Jab bhi cities ya crops update hon, notifications generate karein
  useEffect(() => {
    const newNotifications = generateDynamicNotifications();
    setNotifications(newNotifications);
  }, [availableCities, recommendedCrops, season]);

  // ✅ DYNAMIC SEASONAL TIPS - Model Based Recommendations
  const getSeasonalTips = () => {
    const currentMonth = new Date().getMonth() + 1;
    const isRabi = selectedSeason === 'RABI';
    const isKharif = selectedSeason === 'KHARIF';
    
    // Get top recommended crop name
    const topCrop = recommendedCrops.length > 0 ? recommendedCrops[0].crop : 'گندم';
    
    // Base tips that change based on season and crop
    let tips = [];
    
    // ✅ WATER MANAGEMENT TIP
    if (isRabi) {
      tips.push({
        icon: '💧',
        title: 'پانی کا انتظام',
        description: `سردی میں ہفتے میں 1-2 بار پانی کافی ہے۔ زیادہ پانی سے بچیں`
      });
    } else {
      tips.push({
        icon: '💧',
        title: 'پانی کا انتظام',
        description: `گرمی میں ${topCrop} کو روزانہ پانی دیں۔ صبح یا شام کا وقت بہتر ہے`
      });
    }
    
    // ✅ FERTILIZER TIP - Based on crop
    const fertilizerTips = {
      'گندم': 'گندم میں دوسری خوراک Urea کی دیں۔ پہلی آبپاشی کے بعد',
      'سرسوں': 'سرسوں میں DAP اور Urea کا استعمال کریں۔ بوائی کے 25 دن بعد',
      'مکئی': 'مکئی میں نائٹروجن کھاد ضروری ہے۔ 3 قسطوں میں دیں',
      'چاول': 'چاول میں Zinc اور Urea کا چھڑکاؤ کریں',
      'کپاس': 'کپاس میں پوٹاش اور فاسفورس کا استعمال کریں',
      'گنا': 'گنے میں نائٹروجن کھاد 3 مرتبہ دیں',
      'چنے': 'چنے میں فاسفورس کھاد بوائی کے وقت دیں'
    };
    
    tips.push({
      icon: '🌿',
      title: 'کھاد کا استعمال',
      description: fertilizerTips[topCrop] || `${topCrop} میں متوازن کھاد کا استعمال کریں`
    });
    
    // ✅ PEST CONTROL TIP - Based on crop and season
    const pestTips = {
      'گندم': 'گندم میں Aphids اور Rust کا خطرہ۔ Imidacloprid سپرے کریں',
      'سرسوں': 'سرسوں میں تیلے کا حملہ۔ Malathion سپرے کریں',
      'مکئی': 'مکئی میں تنے کی سنڈی کا خطرہ۔ Chlorpyrifos استعمال کریں',
      'چاول': 'چاول میں تنے کی سنڈی اور بلاسٹ۔ Carbendazim سپرے',
      'کپاس': 'کپاس میں سفید مکھی کا حملہ۔ Acetamiprid سپرے کریں',
      'گنا': 'گنے میں پائریلا کا خطرہ۔ Monocrotophos استعمال کریں',
      'چنے': 'چنے میں سنڈی کا حملہ۔ Quinalphos سپرے کریں'
    };
    
    tips.push({
      icon: '🐛',
      title: 'کیڑوں سے حفاظت',
      description: pestTips[topCrop] || `${topCrop} میں کیڑوں کی نگرانی کریں`
    });
    
    // ✅ WEATHER BASED TIP
    if (weatherData) {
      if (weatherData.temperature < 10) {
        tips.push({
          icon: '❄️',
          title: 'سردی سے بچاؤ',
          description: `درجہ حرارت ${weatherData.temperature}°C ہے۔ ${topCrop} کو پالے سے بچائیں`
        });
      } else if (weatherData.temperature > 35) {
        tips.push({
          icon: '☀️',
          title: 'گرمی سے بچاؤ',
          description: `درجہ حرارت ${weatherData.temperature}°C ہے۔ شام کو پانی دیں`
        });
      }
    }
    
    // ✅ SOWING/HARVESTING TIP based on month
    if (isRabi && currentMonth >= 10 && currentMonth <= 11) {
      tips.push({
        icon: '🌱',
        title: 'بوائی کا وقت',
        description: `${topCrop} کی بوائی کا بہترین وقت ہے۔ جلد بوائی کریں`
      });
    } else if (isRabi && currentMonth >= 3 && currentMonth <= 4) {
      tips.push({
        icon: '🌾',
        title: 'کٹائی کا وقت',
        description: `${topCrop} کی کٹائی کا وقت قریب ہے۔ تیاری کریں`
      });
    } else if (isKharif && currentMonth >= 6 && currentMonth <= 7) {
      tips.push({
        icon: '🌱',
        title: 'بوائی کا وقت',
        description: `${topCrop} کی بوائی کا موسم ہے۔ مانسون سے پہلے بوائی کریں`
      });
    }
    
    return tips;
  };

  // ✅ Weather Display Component
  const WeatherDisplay = () => {
    if (weatherLoading) {
      return (
        <View style={homeStyles.weatherRow}>
          <Text style={homeStyles.weatherText}>موسم کی معلومات لوڈ ہو رہی ہیں...</Text>
          <ActivityIndicator size="small" color={PALETTE.green} style={{ marginLeft: 8 }} />
        </View>
      );
    }

    if (!weatherData) {
      return (
        <View style={homeStyles.weatherRow}>
          <Text style={homeStyles.weatherText}>موسم کی معلومات دستیاب نہیں</Text>
          <Text style={homeStyles.weatherIcon}>🌤️</Text>
        </View>
      );
    }

    return (
      <View style={homeStyles.weatherRow}>
        <View style={homeStyles.weatherInfo}>
          <Text style={homeStyles.weatherTemp}>
            {weatherData.city} - {weatherData.description} - {weatherData.temperature}°C {weatherData.icon}
          </Text>
          <Text style={homeStyles.weatherDesc}>
            نمی: {weatherData.humidity}%
            {!weatherData.isLive && ' (اندازہ)'}
          </Text>
        </View>
      </View>
    );
  };

  // ✅ Notification Bell Component
  const NotificationBell = () => (
    <Pressable 
      style={homeStyles.notificationBell}
      onPress={() => setShowNotifications(true)}
    >
      <Text style={homeStyles.bellIcon}>🔔</Text>
      {notifications.length > 0 && (
        <View style={homeStyles.notificationBadge}>
          <Text style={homeStyles.badgeText}>{notifications.length}</Text>
        </View>
      )}
    </Pressable>
  );

  // ✅ Instagram Style Modal
  const NotificationModal = () => (
    <Modal
      visible={showNotifications}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowNotifications(false)}
    >
      <View style={homeStyles.modalOverlay}>
        <Pressable 
          style={homeStyles.overlayBackground}
          onPress={() => setShowNotifications(false)}
        />
        
        <View style={homeStyles.modalContent}>
          <View style={homeStyles.modalHeader}>
            <Text style={homeStyles.modalTitle}>فصلوں کی تجاویز</Text>
            <Pressable 
              onPress={() => setShowNotifications(false)}
              style={homeStyles.closeButton}
            >
              <Text style={homeStyles.closeIcon}>✕</Text>
            </Pressable>
          </View>

          <ScrollView 
            style={homeStyles.notificationsList}
            showsVerticalScrollIndicator={false}
          >
            {notifications.length === 0 ? (
              <View style={homeStyles.emptyState}>
                <Text style={homeStyles.emptyIcon}>🌱</Text>
                <Text style={homeStyles.emptyText}>فی الحال کوئی تجاویز نہیں</Text>
              </View>
            ) : (
              notifications.map(notification => (
                <View key={notification.id} style={homeStyles.notificationCard}>
                  <View style={homeStyles.notificationHeader}>
                    <Text style={homeStyles.cityName}>{notification.city}</Text>
                    <Text style={homeStyles.notificationTime}>{notification.timestamp}</Text>
                  </View>
                  <Text style={homeStyles.notificationMessage}>
                    {notification.message}
                  </Text>
                  <View style={homeStyles.cropsContainer}>
                    {notification.crops.map((crop, index) => (
                      <View key={index} style={homeStyles.cropTag}>
                        <Text style={homeStyles.cropText}>{crop}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // ✅ HORIZONTAL CITIES COMPONENT
  const HorizontalCities = () => (
    <View style={{ marginBottom: 20 }}>
      <Text style={homeStyles.label}>اپنے شہر کا انتخاب کریں</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={homeStyles.horizontalScroll}
      >
        <View style={homeStyles.citiesContainer}>
          {availableCities.map((city, index) => (
            <Pressable
              key={index}
              style={[
                homeStyles.cityButton,
                selectedCity === city && homeStyles.cityButtonSelected
              ]}
              onPress={() => handleCitySelect(city)}
            >
              <Text style={[
                homeStyles.cityButtonText,
                selectedCity === city && homeStyles.cityButtonTextSelected
              ]}>
                {cityMap[city] || city}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  // Handle navigation to AddMoreEntry screen
  const handleAddMoreEntry = () => {
    navigation.navigate('AddMoreEntry');
  };

  // Refresh recommendations
  const handleRefresh = () => {
    if (selectedCity) {
      getBestCropRecommendations(selectedCity, soilType);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={homeStyles.loadingContainer}>
          <ActivityIndicator size="large" color={PALETTE.green} />
          <T style={homeStyles.loadingText}>Loading...</T>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Top bar with notification bell */}
        <View style={homeStyles.topRow}>
          <T style={homeStyles.topTitle}>HOME</T>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <NotificationBell />
          </View>
        </View>

        {/* ✅ Weather Display */}
        <WeatherDisplay />

        {/* ✅ HORIZONTAL CITIES */}
        <HorizontalCities />

        {/* ✅ Season Dropdown */}
        <View style={{ marginBottom: 20 }}>
          <T style={homeStyles.label}>Select Season</T>
          <Pressable
            style={homeStyles.dropdown}
            onPress={() => setShowSeasonDropdown(!showSeasonDropdown)}
          >
            <Text style={homeStyles.dropdownText}>
              {selectedSeason === 'RABI' ? '🌾 ربیع (Rabi)' : '🌽 خریف (Kharif)'}
            </Text>
            <Text style={homeStyles.dropdownArrow}>
              {showSeasonDropdown ? '▲' : '▼'}
            </Text>
          </Pressable>
          
          {showSeasonDropdown && (
            <View style={homeStyles.dropdownOptions}>
              <Pressable
                style={[
                  homeStyles.dropdownOption,
                  selectedSeason === 'RABI' && homeStyles.dropdownOptionSelected
                ]}
                onPress={() => handleSeasonChange('RABI')}
              >
                <Text style={[
                  homeStyles.dropdownOptionText,
                  selectedSeason === 'RABI' && homeStyles.dropdownOptionTextSelected
                ]}>
                  🌾 ربیع (Rabi)
                </Text>
                {selectedSeason === 'RABI' && <Text style={homeStyles.checkmark}>✓</Text>}
              </Pressable>
              
              <Pressable
                style={[
                  homeStyles.dropdownOption,
                  selectedSeason === 'KHARIF' && homeStyles.dropdownOptionSelected
                ]}
                onPress={() => handleSeasonChange('KHARIF')}
              >
                <Text style={[
                  homeStyles.dropdownOptionText,
                  selectedSeason === 'KHARIF' && homeStyles.dropdownOptionTextSelected
                ]}>
                  🌽 خریف (Kharif)
                </Text>
                {selectedSeason === 'KHARIF' && <Text style={homeStyles.checkmark}>✓</Text>}
              </Pressable>
            </View>
          )}
        </View>

        {/* Suggested Crops */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>
          <T style={homeStyles.sectionTitle}>Recommended Crops for Your Area</T>
        </View>

        {apiError ? (
          <View style={homeStyles.errorContainer}>
            <Text style={homeStyles.errorText}>❌ Failed to load recommendations</Text>
            <Text style={homeStyles.errorSubText}>{errorMessage}</Text>
            <Pressable onPress={handleRefresh} style={homeStyles.retryButton}>
              <T style={homeStyles.retryButtonText}>Try Again</T>
            </Pressable>
          </View>
        ) : loading ? (
          <View style={homeStyles.loadingContainer}>
            <ActivityIndicator size="small" color={PALETTE.green} />
            <T style={homeStyles.loadingText}>Loading recommended crops...</T>
          </View>
        ) : (
          <View style={homeStyles.cardRow}>
            {recommendedCrops.map((crop, index) => (
              <CropCard 
                key={index}
                title={crop.crop} 
                subtitle={`Best for ${city}`}
                production={crop.predicted_production}
                score={crop.score}
                rank={crop.rank}
                onPress={() => handleCropCardPress(crop.crop, crop.predicted_production)}
              />
            ))}
          </View>
        )}

        {/* Add More Entry button */}
        <Pressable 
          style={({ pressed }) => [
            homeStyles.addBtn,
            pressed && { opacity: 0.7 }
          ]}
          onPress={handleAddMoreEntry}
        >
          <Text style={homeStyles.addBtnPlus}>+</Text>
          <T style={homeStyles.addBtnText}>Add More Entry</T>
        </Pressable>

        {/* ✅ DYNAMIC SEASONAL TIPS - Model Based */}
        <View style={homeStyles.seasonalTipsSection}>
          <View style={homeStyles.seasonalTipsHeader}>
            <Text style={homeStyles.seasonalTipsIcon}>💡</Text>
            <Text style={homeStyles.seasonalTipsTitle}>موسمی تجاویز</Text>
          </View>
          
          {/* Dynamic tips based on recommended crops and season */}
          {getSeasonalTips().map((tip, index) => (
            <View key={index} style={homeStyles.tipCard}>
              <View style={homeStyles.tipIconContainer}>
                <Text style={homeStyles.tipIcon}>{tip.icon}</Text>
              </View>
              <View style={homeStyles.tipContent}>
                <Text style={homeStyles.tipTitle}>{tip.title}</Text>
                <Text style={homeStyles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ✅ Notification Modal */}
        <NotificationModal />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------ Helpers for Home ------------ */
function CropCard({ title, subtitle, production, score, rank, onPress }) {
  const getCropIcon = (cropName) => {
    const iconMap = {
      'گندم': '🌾',
      'سرسوں': '🌼',
      'مکئی': '🌽',
      'چاول': '🍚',
      'گنا': '🎋',
      'کپاس': '☁️',
      'جو': '📏',
      'مونگ پھلی': '🥜',
      'چنے': '🟤',
      'دھان': '💧',
      'سورج مکھی': '🌻',
      'باجرا': '🌱',
      'جوار': '🌿',
      'تمباکو': '🚬',
      'تل': '⚫',
    };
    
    return iconMap[cropName] || '🌱';
  };

  const cropIcon = getCropIcon(title);

  return (
    <Pressable 
      style={({ pressed }) => [
        homeStyles.card,
        pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }
      ]}
      onPress={onPress}
    >
      {/* Rank Badge */}
      {rank && (
        <View style={homeStyles.rankBadge}>
          <Text style={homeStyles.rankText}>#{rank}</Text>
        </View>
      )}
      
      <Text style={{ fontSize: 26, marginBottom: 6 }}>{cropIcon}</Text>
      
      <Text style={homeStyles.cardTitle}>{title}</Text>
      <Text style={homeStyles.cardSub} numberOfLines={2}>
        {subtitle}
      </Text>
      
      {/* Production Display */}
      {production && (
        <Text style={homeStyles.productionText}>
          متوقع پیداوار: {production} کلوگرام
        </Text>
      )}
      
      {/* Score Indicator (optional) */}
      {score && (
        <View style={homeStyles.scoreContainer}>
          <View style={homeStyles.scoreBar}>
            <View 
              style={[
                homeStyles.scoreFill,
                { width: `${Math.min(score, 200) / 2}%` }
              ]} 
            />
          </View>
          <Text style={homeStyles.scoreText}>
            Recommendation Score: {score}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function InsightItem({ text, icon }) {
  return (
    <View style={homeStyles.insight}>
      <T style={homeStyles.insightText}>{text}</T>
      <Text style={{ fontSize: 16 }}>{icon}</Text>
    </View>
  );
}

/* ------------ Styles ------------ */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PALETTE.bg },
});

const homeStyles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 8,
  },
  topTitle: { fontSize: 16, fontWeight: '800', color: PALETTE.text },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.greenLite,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  weatherIcon: { 
    fontSize: 28, 
    marginRight: 12 
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTemp: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: PALETTE.green,
    textAlign: 'right',
  },
  weatherDesc: { 
    fontSize: 12, 
    color: PALETTE.muted,
    textAlign: 'right',
    marginTop: 2,
  },
  weatherText: {
    fontSize: 14,
    color: PALETTE.muted,
    textAlign: 'right',
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: PALETTE.text,
    textAlign: 'right',
    marginBottom: 6,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PALETTE.gray,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PALETTE.greenLite,
  },
  dropdownText: {
    fontSize: 14,
    color: PALETTE.text,
    fontWeight: '600',
  },
  dropdownArrow: {
    fontSize: 12,
    color: PALETTE.green,
  },
  dropdownOptions: {
    marginTop: 4,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PALETTE.greenLite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.gray,
  },
  dropdownOptionSelected: {
    backgroundColor: PALETTE.greenLite,
  },
  dropdownOptionText: {
    fontSize: 14,
    color: PALETTE.text,
    fontWeight: '500',
  },
  dropdownOptionTextSelected: {
    color: PALETTE.green,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 16,
    color: PALETTE.green,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.text,
    textAlign: 'right',
    marginBottom: 8,
  },
  cardRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  card: {
    flex: 1,
    backgroundColor: PALETTE.greenSoft,
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: PALETTE.green,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
    color: PALETTE.text,
    marginTop: 4,
  },
  cardSub: {
    fontSize: 12,
    color: PALETTE.muted,
    textAlign: 'right',
    marginTop: 4,
  },
  productionText: {
    fontSize: 12,
    color: PALETTE.green,
    textAlign: 'right',
    marginTop: 8,
    fontWeight: '600',
  },
  scoreContainer: {
    marginTop: 8,
  },
  scoreBar: {
    height: 6,
    backgroundColor: PALETTE.gray,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  scoreFill: {
    height: '100%',
    backgroundColor: PALETTE.green,
    borderRadius: 3,
  },
  scoreText: {
    fontSize: 10,
    color: PALETTE.muted,
    textAlign: 'right',
  },
  addBtn: {
    marginTop: 12,
    height: 44,
    backgroundColor: PALETTE.green,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  addBtnPlus: { 
    color: '#FFF', 
    fontSize: 18, 
    marginRight: 8 
  },
  addBtnText: { 
    color: '#FFF', 
    fontWeight: '700' 
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PALETTE.gray,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  insightText: {
    flex: 1,
    color: PALETTE.muted,
    textAlign: 'right',
    marginRight: 10,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: PALETTE.muted,
    marginVertical: 10,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFE6E6',
    borderRadius: 10,
    marginVertical: 10,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorSubText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: PALETTE.green,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  horizontalScroll: {
    marginHorizontal: -16,
  },
  citiesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cityButton: {
    backgroundColor: PALETTE.gray,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: PALETTE.greenLite,
  },
  cityButtonSelected: {
    backgroundColor: PALETTE.greenSoft,
    borderColor: PALETTE.green,
  },
  cityButtonText: {
    fontSize: 14,
    color: PALETTE.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  cityButtonTextSelected: {
    color: PALETTE.green,
    fontWeight: '600',
  },
  notificationBell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PALETTE.greenLite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    position: 'relative',
    borderWidth: 2,
    borderColor: PALETTE.greenSoft,
  },
  bellIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: PALETTE.darkOverlay,
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.gray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PALETTE.text,
    textAlign: 'right',
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 20,
    color: PALETTE.muted,
    fontWeight: 'bold',
  },
  notificationsList: {
    maxHeight: 400,
    padding: 16,
  },
  notificationCard: {
    backgroundColor: PALETTE.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: PALETTE.green,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.text,
    textAlign: 'right',
  },
  notificationTime: {
    fontSize: 12,
    color: PALETTE.muted,
    textAlign: 'right',
  },
  notificationMessage: {
    fontSize: 14,
    color: PALETTE.text,
    textAlign: 'right',
    lineHeight: 20,
    marginBottom: 12,
  },
  cropsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  cropTag: {
    backgroundColor: PALETTE.greenSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    marginBottom: 4,
  },
  cropText: {
    fontSize: 12,
    color: PALETTE.green,
    fontWeight: '600',
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: PALETTE.muted,
    textAlign: 'center',
  },
  // ✅ SEASONAL TIPS STYLES - Notification Style
  seasonalTipsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  seasonalTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  seasonalTipsIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  seasonalTipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PALETTE.text,
    textAlign: 'right',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  tipIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PALETTE.greenLite,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  tipIcon: {
    fontSize: 22,
  },
  tipContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: PALETTE.text,
    textAlign: 'right',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: PALETTE.muted,
    textAlign: 'right',
    lineHeight: 20,
  },
});

export default HomeScreen;


