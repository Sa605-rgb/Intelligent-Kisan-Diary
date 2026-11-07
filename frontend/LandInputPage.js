











// //yeah data before filter zone ky  hai ky 
// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
//   ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
//   FlatList, Modal, TouchableWithoutFeedback, Dimensions, Linking
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { farmerAPI } from './api';

// const { width, height } = Dimensions.get('window');

// const LandInputPage = ({ navigation, route }) => {
//   // ✅ Language State (Default Urdu for display)
//   const [language] = useState('ur');
  
//   // ✅ Helper function for translations
//   const getText = (en, ur) => {
//     return language === 'ur' ? ur : en;
//   };
  
//   // ✅ States
//   const [selectedCity, setSelectedCity] = useState('');
//   const [selectedArea, setSelectedArea] = useState('');
//   const [selectedZone, setSelectedZone] = useState('');
//   const [areaSize, setAreaSize] = useState('');
//   const [selectedAreaUnit, setSelectedAreaUnit] = useState('');
//   const [selectedSoilType, setSelectedSoilType] = useState('');
//   const [selectedSeason, setSelectedSeason] = useState('');
//   const [areaSearch, setAreaSearch] = useState('');
//   const [lands, setLands] = useState(route.params?.existingLands || []);
//   const [farmerId, setFarmerId] = useState(null);
  
//   // ✅ Map & Nearby States
//   const [showNearbyMap, setShowNearbyMap] = useState(false);
//   const [areaCenterInfo, setAreaCenterInfo] = useState(null);
//   const [nearbyLands, setNearbyLands] = useState([]);
//   const [loadingNearby, setLoadingNearby] = useState(false);
  
//   // ✅ Dynamic Radius State (User can enter ANY number)
//   const [searchRadius, setSearchRadius] = useState('5');
  
//   // ✅ Land Crops Modal States
//   const [selectedLandData, setSelectedLandData] = useState(null);
//   const [showLandCropsModal, setShowLandCropsModal] = useState(false);
//   const [loadingLandCrops, setLoadingLandCrops] = useState(false);
  
//   // ✅ Manual Coordinates
//   const [showCoordinatesModal, setShowCoordinatesModal] = useState(false);
//   const [manualCoordinates, setManualCoordinates] = useState({ lat: '', lng: '' });
  
//   // ✅ Area Management
//   const [areasData, setAreasData] = useState([]);
//   const [loadingAreas, setLoadingAreas] = useState(false);
//   const [availableSoilTypes, setAvailableSoilTypes] = useState([]);
  
//   // UI States
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [showCityDropdown, setShowCityDropdown] = useState(false);
//   const [showAreaDropdown, setShowAreaDropdown] = useState(false);
//   const [showAreaUnitDropdown, setShowAreaUnitDropdown] = useState(false);
//   const [showSoilTypeDropdown, setShowSoilTypeDropdown] = useState(false);
//   const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  

//   const cities = ['Rawalpindi', 'Lahore', 'Faisalabad', 'Multan', 'Gujrat', 'Sialkot'];
//   const areaUnits = ['acres', 'canal'];
  
//   // ✅ City mapping English to Urdu
//   const cityMap = {
//     'Rawalpindi': 'راولپنڈی',
//     'Lahore': 'لاہور',
//     'Faisalabad': 'فیصل آباد',
//     'Multan': 'ملتان',
//     'Gujrat': 'گجرات',
//     'Sialkot': 'سیالکوٹ'
//   };
  
//   // ✅ Zone mapping English to Urdu (Tubewell, Barani, Nehri)
//   const zoneMap = {
//     // Full names
//     'Zone A': 'نہری علاقہ',
//     'Zone B': 'ٹیوب ویل علاقہ',
//     'Zone C': 'بارانی علاقہ',
//     'Zone A - Nehri Areas': 'نہری علاقہ',
//     'Zone B - Tubewell Areas': 'ٹیوب ویل علاقہ',
//     'Zone C - Barani areas': 'بارانی علاقہ',
//     // Short names
//     'Nehri Areas': 'نہری علاقہ',
//     'Nehri': 'نہری',
//     'Tubewell Areas': 'ٹیوب ویل علاقہ',
//     'Tubewell': 'ٹیوب ویل',
//     'Barani areas': 'بارانی علاقہ',
//     'Barani': 'بارانی',
//     // Description based
//     'Nehri Areas - Canal': 'نہری علاقہ',
//     'Tubewell Areas - Tube well': 'ٹیوب ویل علاقہ',
//     'Barani areas - Rainfed': 'بارانی علاقہ'
//   };
  
//   // ✅ Soil type mapping English to Urdu
//   const soilMap = {
//     'CLAY LOAM': 'چکنی میٹھی',
//     'SILT LOAM': 'سلت میٹھی',
//     'SANDY LOAM': 'ریتی میٹھی',
//     'LOAM': 'میٹھی',
//     'CLAY': 'چکنی',
//     'SANDY CLAY': 'ریتی چکنی',
//     'SILT': 'سلت'
//   };
  
//   // ✅ Unit mapping
//   const unitMap = {
//     'acres': 'ایکڑ',
//     'canal': 'کنال'
//   };
  
//   // ✅ Season mapping
//   const seasonMap = {
//     'Rabi': 'ربیع',
//     'Kharif': 'خریف'
//   };
  
//   // ✅ Helper function to get translated zone
//   const getZoneName = (zone) => {
//     if (!zone) return getText('Select area first', 'پہلے علاقہ منتخب کریں');
//     if (zoneMap[zone]) return zoneMap[zone];
//     // Check if zone contains keywords
//     const zoneLower = zone.toLowerCase();
//     if (zoneLower.includes('nehri') || zoneLower.includes('canal')) return 'نہری علاقہ';
//     if (zoneLower.includes('tubewell') || zoneLower.includes('tube well')) return 'ٹیوب ویل علاقہ';
//     if (zoneLower.includes('barani') || zoneLower.includes('rainfed')) return 'بارانی علاقہ';
//     return zone;
//   };
  
//   // ✅ Area mapping English to Urdu (100+ areas)
//   const areaMap = {
//     // Rawalpindi Areas
//     'Gujar Khan Tehsil - Rural Belt': 'گجر خان تحصیل - دیہی پٹی',
//     'Gujar Khan Plains - Lowland Farms': 'گجر خان میدانی علاقے - نشیبی فارم',
//     'Gujar Khan Uplands - Barani Pockets': 'گجر خان اپلینڈز - بارانی علاقے',
//     'Taxila Tehsil - Rural Belt': 'ٹیکسلا تحصیل - دیہی پٹی',
//     'Taxila Plains - Peri-urban Farms': 'ٹیکسلا میدانی علاقے - شہری مضافاتی فارم',
//     'Kahuta Tehsil - Hilly Farms': 'کہوٹہ تحصیل - پہاڑی فارم',
//     'Kallar Syedan Tehsil - Rural Belt': 'کلر سیداں تحصیل - دیہی پٹی',
//     'Murree Tehsil - Hill Agriculture': 'مری تحصیل - پہاڑی زراعت',
//     'Chakri - Peri-urban Tubewell Farms': 'چکری - شہری مضافاتی ٹیوب ویل فارم',
//     'Rawalpindi East Rural Belt': 'راولپنڈی مشرقی دیہی پٹی',
//     'Rawalpindi West Agricultural Plain': 'راولپنڈی مغربی زرعی میدان',
//     'Daultala Area - Agricultural Belt': 'ڈھولتالہ علاقہ - زرعی پٹی',
//     'Sohawa Road / Gujar Khan Fringe': 'سوہاوہ روڈ / گجر خان کنارے',
//     'Potohar Plateau Fringe - Farms': 'پوٹھوہار سطح مرتفع کے کنارے - فارم',
//     'Gujar Khan Peri-urban Tubewell Pockets': 'گجر خان شہری مضافاتی ٹیوب ویل علاقے',
//     'Rural Plains near Chakwal Border': 'چکوال سرحد کے قریب دیہی میدان',
//     'Kotli Sattian / Kahuta Hills - Barani': 'کوٹلی ستیاں / کہوٹہ پہاڑیاں - بارانی',
//     // Lahore Areas
//     'Raiwind Tehsil - Canal Command': 'رائے ونڈ تحصیل - نہری نظام',
//     'Kasur Belt (Lahore periphery)': 'قصور پٹی (لاہور مضافات)',
//     'Sharaqpur / Chunian Fringe': 'شرقپور / چونیاں کنارے',
//     'Sheikhupura Periphery (Lahore side)': 'شیخوپورہ مضافات (لاہور طرف)',
//     'Lahore-Faisalabad Road Agricultural Belt': 'لاہور-فیصل آباد روڈ زرعی پٹی',
//     'Walton / Kot Abdul Malik Peri-urban Farms': 'والٹن / کوٹ عبدالملک شہری مضافاتی فارم',
//     'Kala Shah Kaku / Ferozewala Belt': 'کالا شاہ کاکو / فیروزوالہ پٹی',
//     'Raiwind South Agricultural Belt': 'رائے ونڈ جنوبی زرعی پٹی',
//     'Lahore Sadar Rural Belt': 'لاہور صدر دیہی پٹی',
//     'Lahore North Uplands (small rainfed pockets)': 'لاہور شمالی اپلینڈز (چھوٹے بارانی علاقے)',
//     'Kot Khawaja Saeed / Peri-urban Farms': 'کوٹ خواجہ سعید / شہری مضافاتی فارم',
//     'Lahore South Plains - Mixed Irrigation': 'لاہور جنوبی میدان - مخلوط آبپاشی',
//     'Kasur-Raiwind Interchange Belt': 'قصور-رائے ونڈ انٹرچینج پٹی',
//     'Faisalabad Road Eastern Belt': 'فیصل آباد روڈ مشرقی پٹی',
//     'Shahdara Rural Fringe': 'شاہدرہ دیہی کنارے',
//     'Peri-urban Vegetable Belt (Lahore outskirts)': 'شہری مضافاتی سبزی پٹی (لاہور مضافات)',
//     'Lahore West Rural Belt - Smallholders': 'لاہور مغربی دیہی پٹی - چھوٹے کسان',
//     // Faisalabad Areas
//     'Chak Jhumra Tehsil - Canal Belt': 'چک جھمرہ تحصیل - نہری پٹی',
//     'Tandlianwala Tehsil - Irrigated Farms': 'تاندلیانوالہ تحصیل - سیراب فارم',
//     'Samundri Tehsil - Agricultural Plains': 'سمندری تحصیل - زرعی میدان',
//     'Jaranwala Tehsil - Canal Command': 'جڑانوالہ تحصیل - نہری نظام',
//     'Faisalabad South Rural Belt': 'فیصل آباد جنوبی دیہی پٹی',
//     'Faisalabad North Peri-urban Farms': 'فیصل آباد شمالی شہری مضافاتی فارم',
//     'Satiana Side - Tubewell Pockets': 'ستیانہ سائیڈ - ٹیوب ویل علاقے',
//     'Sukheke / Chak No. belts - Canal': 'سکھیکے / چک نمبر پٹیاں - نہری',
//     'Ghulam Muhammadabad / Rural Fringe': 'غلام محمد آباد / دیہی کنارے',
//     'Bhaggowal / Smallholder Area - Mixed': 'بھگووال / چھوٹے کسان علاقہ - مخلوط',
//     'Faisalabad West Agricultural Belt': 'فیصل آباد مغربی زرعی پٹی',
//     'Faisalabad East Peri-urban Tubewell Farms': 'فیصل آباد مشرقی شہری مضافاتی ٹیوب ویل فارم',
//     'Samundri South Rural Belt': 'سمندری جنوبی دیہی پٹی',
//     'Chak Clusters near Jaranwala': 'جڑانوالہ کے قریب چک کلسٹر',
//     'Tandlianwala North - Mixed Pockets': 'تاندلیانوالہ شمالی - مخلوط علاقے',
//     'Central Faisalabad Command Area': 'وسطی فیصل آباد کمانڈ علاقہ',
//     'Peri-urban Vegetable Belt (near city)': 'شہری مضافاتی سبزی پٹی (شہر کے قریب)',
//     // Multan Areas
//     'Shujabad Tehsil - Canal Belt': 'شجاع آباد تحصیل - نہری پٹی',
//     'Jalalpur Pirwala Tehsil - Irrigated Plains': 'جلالپور پیروالہ تحصیل - سیراب میدان',
//     'Multan South Rural Belt': 'ملتان جنوبی دیہی پٹی',
//     'Vehari Side - Tubewell Area': 'وہاڑی سائیڈ - ٹیوب ویل علاقہ',
//     'Shah Rukn-e-Alam Periphery - Mixed': 'شاہ رکن عالم مضافات - مخلوط',
//     'Musa Pak / Jalalpur Fringe - Canal': 'موسٰی پاک / جلالپور کنارے - نہری',
//     'Multan North Rural Belt': 'ملتان شمالی دیہی پٹی',
//     'Multan East Peri-urban Tubewell Farms': 'ملتان مشرقی شہری مضافاتی ٹیوب ویل فارم',
//     'Basti Malook / Rural Fringe - Mixed': 'بستی ملوک / دیہی کنارے - مخلوط',
//     'Jahanian / Local Command Belt': 'جہانیاں / لوکل کمانڈ پٹی',
//     'Central Multan Command Area': 'وسطی ملتان کمانڈ علاقہ',
//     'Shujabad South - Tubewell Pockets': 'شجاع آباد جنوبی - ٹیوب ویل علاقے',
//     'Multan West Rural Plain': 'ملتان مغربی دیہی میدان',
//     'Dunya Pur / Rural Belt': 'دنیا پور / دیہی پٹی',
//     'Multan Peri-urban Mixed Farms': 'ملتان شہری مضافاتی مخلوط فارم',
//     'Bosan Road Agricultural Fringe': 'بوسن روڈ زرعی کنارے',
//     'Multan West Periphery - Canal Command': 'ملتان مغربی مضافات - نہری نظام',
//     // Gujrat Areas
//     'Gujrat Tehsil - Canal Plains': 'گجرات تحصیل - نہری میدان',
//     'Kharian Tehsil - Mixed Irrigation': 'کھاریاں تحصیل - مخلوط آبپاشی',
//     'Kunjah - Canal Irrigated Area': 'کنجہ - نہری سیراب علاقہ',
//     'Jalalpur Jattan - Tubewell Pockets': 'جلالپور جٹاں - ٹیوب ویل علاقے',
//     'Lalamusa - Mixed': 'لالہ موسیٰ - مخلوط',
//     'Sarai Alamgir - Canal Belt': 'سرائے عالمگیر - نہری پٹی',
//     'Dinga / Rural Belt': 'ڈنگہ / دیہی پٹی',
//     'Gujrat Peri-urban Tubewell Farms': 'گجرات شہری مضافاتی ٹیوب ویل فارم',
//     'Khari / Upper Plain - Canal': 'کھڑی / بالائی میدان - نہری',
//     'Gujrat South Agricultural Belt': 'گجرات جنوبی زرعی پٹی',
//     'Gujrat North Hills Fringe - Barani': 'گجرات شمالی پہاڑی کنارے - بارانی',
//     'Kharian Plains - Tubewell Pockets': 'کھاریاں میدان - ٹیوب ویل علاقے',
//     'Sandal Bar Fringe - Mixed': 'ساندل بار کنارے - مخلوط',
//     'Tehsil Smallholder Belt - Gujrat': 'تحصیل چھوٹے کسان پٹی - گجرات',
//     'Lalamusa Peri-urban Farming Area': 'لالہ موسیٰ شہری مضافاتی کاشتکاری علاقہ',
//     'Kunjah South - Canal Command': 'کنجہ جنوبی - نہری نظام',
//     // Sialkot Areas
//     'Daska Tehsil - Canal Plains': 'ڈسکہ تحصیل - نہری میدان',
//     'Daska South - Canal Command': 'ڈسکہ جنوبی - نہری نظام',
//     'Pasrur Tehsil - Irrigated Fields': 'پسرور تحصیل - سیراب کھیت',
//     'Pasrur East - Mixed Pockets': 'پسرور مشرقی - مخلوط علاقے',
//     'Sambrial - Mixed Irrigation': 'سمبڑیال - مخلوط آبپاشی',
//     'Sambrial North - Peri-urban Farms': 'سمبڑیال شمالی - شہری مضافاتی فارم',
//     'Sialkot Rural Belt - North': 'سیالکوٹ دیہی پٹی - شمالی',
//     'Sialkot West Rural Belt': 'سیالکوٹ مغربی دیہی پٹی',
//     'Sialkot Peri-urban Tubewell Farms': 'سیالکوٹ شہری مضافاتی ٹیوب ویل فارم',
//     'Head Marala / Riverine Fringe - Mixed': 'ہیڈ مرالہ / دریائی کنارے - مخلوط',
//     'Sialkot Central Outskirts - Mixed': 'سیالکوٹ وسطی مضافات - مخلوط',
//     'Sialkot Eastern Plains - Nehri': 'سیالکوٹ مشرقی میدان - نہری',
//     'Sialkot Agricultural Belt - South': 'سیالکوٹ زرعی پٹی - جنوبی',
//     'Nurkot / Rural Cluster - Mixed': 'نورکوٹ / دیہی کلسٹر - مخلوط',
//     'Industrial Fringe Peri-urban Farms': 'صنعتی کنارے شہری مضافاتی فارم',
//     'Smallholder Cluster - Sialkot Rural': 'چھوٹے کسان کلسٹر - سیالکوٹ دیہی'
//   };
  
//   // ✅ Seasons with dates
//   const seasonsWithDates = [
//     { name: 'Rabi', labelEn: 'Rabi (Oct 15 - Apr 15)', labelUr: 'ربیع (15 اکتوبر - 15 اپریل)', from: 'Oct 15', to: 'Apr 15' },
//     { name: 'Kharif', labelEn: 'Kharif (Apr 16 - Oct 14)', labelUr: 'خریف (16 اپریل - 14 اکتوبر)', from: 'Apr 16', to: 'Oct 14' }
//   ];
  
//   const city_soil = {
//     "RAWALPINDI": ["CLAY LOAM", "SILT LOAM"],
//     "FAISALABAD": ["SANDY LOAM", "CLAY"],
//     "LAHORE": ["LOAM", "CLAY LOAM"],
//     "MULTAN": ["SANDY CLAY", "LOAM"],
//     "GUJRAT": ["LOAM", "SILT"],
//     "SIALKOT": ["CLAY LOAM", "SANDY LOAM"]
//   };

//   useEffect(() => {
//     loadFarmerId();
//   }, []);

//   // ✅ WHEN CITY CHANGES
//   useEffect(() => {
//     if (selectedCity) {
//       loadAreasForCity(selectedCity);
//       setAvailableSoilTypes(city_soil[selectedCity.toUpperCase()] || []);
//     } else {
//       setSelectedArea('');
//       setSelectedZone('');
//       setSelectedSoilType('');
//       setSelectedSeason('');
//       setAreasData([]);
//       setAvailableSoilTypes([]);
//       setAreaCenterInfo(null);
//       setManualCoordinates({ lat: '', lng: '' });
//       setNearbyLands([]);
//     }
//   }, [selectedCity]);

//   // ✅ WHEN AREA CHANGES
//   useEffect(() => {
//     if (selectedArea) {
//       const selectedAreaData = areasData.find(area => area.area_name === selectedArea);
//       if (selectedAreaData) {
//         setSelectedZone(selectedAreaData.description);
//       }
//       loadAreaCenterPoint(selectedArea);
//     } else {
//       setSelectedZone('');
//       setAreaCenterInfo(null);
//     }
//   }, [selectedArea, areasData]);

//   // ✅ LOAD AREAS FOR CITY
//   const loadAreasForCity = async (cityName) => {
//     setLoadingAreas(true);
//     try {
//       const response = await farmerAPI.getAreasByCity(cityName);
//       if (response.areas) {
//         setAreasData(response.areas);
//       }
//     } catch (error) {
//       console.error('Error loading areas:', error);
//       Alert.alert('Error', 'Failed to load areas');
//     } finally {
//       setLoadingAreas(false);
//     }
//   };

//   // ✅ LOAD AREA CENTER POINT
//   const loadAreaCenterPoint = async (areaName) => {
//     try {
//       const response = await farmerAPI.getAreaCenter(areaName);
//       if (response.success) {
//         setAreaCenterInfo(response);
//         if (response.center_latitude && response.center_longitude && !manualCoordinates.lat) {
//           setManualCoordinates({
//             lat: response.center_latitude.toString(),
//             lng: response.center_longitude.toString()
//           });
//         }
//       } else {
//         setAreaCenterInfo(null);
//       }
//     } catch (error) {
//       console.error('Error loading area center:', error);
//       setAreaCenterInfo(null);
//     }
//   };

//   // ✅ GET NEARBY LANDS WITH DYNAMIC RADIUS (User can enter ANY number)
//   const getNearbyLands = async () => {
//     if (!selectedArea) {
//       Alert.alert('Error', 'Please select an area first');
//       return;
//     }
    
//     // ✅ Validate radius - user can enter ANY positive number
//     const radius = parseFloat(searchRadius);
//     if (isNaN(radius) || radius <= 0) {
//       Alert.alert('Error', 'Please enter a valid radius (e.g., 5, 6.5, 7, 10, 12.3)');
//       return;
//     }
    
//     setLoadingNearby(true);
//     try {
//       // Use user's custom radius - can be ANY number
//       const response = await farmerAPI.getNearbyLandsByArea(selectedArea, radius);
//       if (response.success) {
//         setNearbyLands(response.nearby_lands || []);
//         setShowNearbyMap(true);
//       } else {
//         Alert.alert('Info', response.message || 'No nearby lands found');
//       }
//     } catch (error) {
//       console.error('Error getting nearby lands:', error);
//       Alert.alert('Error', 'Failed to get nearby lands');
//     } finally {
//       setLoadingNearby(false);
//     }
//   };

//   // ✅ GET LAND CROPS WITH SEASON
//   const getLandCrops = async (land) => {
//     const landId = land.land_id;
//     const farmerName = land.farmer_name;
    
//     setShowNearbyMap(false);
//     setLoadingLandCrops(true);
    
//     try {
//       const response = await farmerAPI.getLandSeasonCrops(landId, '');
      
//       if (response.success) {
//         setSelectedLandData({
//           landInfo: response.land_info,
//           crops: response.crops,
//           seasonSummary: response.season_summary,
//           farmerName: farmerName,
//           requestedSeason: 'All Seasons',
//           totalCrops: response.total_crops
//         });
//         setShowLandCropsModal(true);
//       } else {
//         Alert.alert('Info', response.message || 'No crops found for this land');
//       }
//     } catch (error) {
//       console.error('Error loading land crops:', error);
//       Alert.alert('Error', 'Failed to load land crops data');
//     } finally {
//       setLoadingLandCrops(false);
//     }
//   };

//   // ✅ OPEN GOOGLE MAPS
//   const openGoogleMaps = () => {
//     const lat = manualCoordinates.lat || areaCenterInfo?.center_latitude;
//     const lng = manualCoordinates.lng || areaCenterInfo?.center_longitude;
    
//     if (!lat || !lng) {
//       Alert.alert('Error', 'No coordinates available');
//       return;
//     }
    
//     const url = `https://www.google.com/maps?q=${lat},${lng}`;
//     Linking.openURL(url).catch(err => {
//       Alert.alert('Error', 'Could not open Google Maps');
//     });
//   };

//   const loadFarmerId = async () => {
//     try {
//       const savedFarmerId = await AsyncStorage.getItem('farmerId');
//       if (savedFarmerId) {
//         setFarmerId(parseInt(savedFarmerId));
//       }
//     } catch (error) {
//       console.error('Error loading farmer ID:', error);
//     }
//   };

//   const handleCitySelect = (city) => {
//     setSelectedCity(city);
//     setSelectedArea('');
//     setSelectedZone('');
//     setSelectedSoilType('');
//     setSelectedSeason('');
//     setAreaSearch('');
//     setShowCityDropdown(false);
//     setAreaCenterInfo(null);
//     setManualCoordinates({ lat: '', lng: '' });
//     setNearbyLands([]);
//   };

//   const handleAreaSelect = (area) => {
//     setSelectedArea(area);
//     setShowAreaDropdown(false);
//     setAreaSearch('');
//     setNearbyLands([]);
//   };

//   const handleSeasonSelect = (season) => {
//     setSelectedSeason(season);
//     setShowSeasonDropdown(false);
//   };

//   const handleAddLand = () => {
//     if (!selectedCity || !selectedArea || !selectedZone || !areaSize || !selectedAreaUnit || !selectedSoilType) {
//       Alert.alert('Error', 'Please fill all land details');
//       return;
//     }

//     const lat = manualCoordinates.lat ? parseFloat(manualCoordinates.lat) : 
//                 (areaCenterInfo?.center_latitude || null);
//     const lng = manualCoordinates.lng ? parseFloat(manualCoordinates.lng) : 
//                 (areaCenterInfo?.center_longitude || null);

//     const newLand = {
//       id: Date.now().toString(),
//       city: selectedCity,
//       area: selectedArea,
//       zone: selectedZone,
//       areaSize: parseFloat(areaSize),
//       areaUnit: selectedAreaUnit,
//       soilType: selectedSoilType,
//       season: selectedSeason,
//       latitude: lat,
//       longitude: lng,
//     };

//     setLands([...lands, newLand]);
    
//     setSelectedCity('');
//     setSelectedArea('');
//     setSelectedZone('');
//     setAreaSize('');
//     setSelectedAreaUnit('');
//     setSelectedSoilType('');
//     setSelectedSeason('');
//     setAreaCenterInfo(null);
//     setManualCoordinates({ lat: '', lng: '' });
//     setNearbyLands([]);
    
//     Alert.alert('Success', 'Land added to list!');
//   };

//   const handleEditLand = (id) => {
//     const landToEdit = lands.find(land => land.id === id);
//     if (landToEdit) {
//       setSelectedCity(landToEdit.city);
//       setSelectedArea(landToEdit.area);
//       setSelectedZone(landToEdit.zone);
//       setAreaSize(landToEdit.areaSize.toString());
//       setSelectedAreaUnit(landToEdit.areaUnit);
//       setSelectedSoilType(landToEdit.soilType);
//       setSelectedSeason(landToEdit.season || '');
      
//       if (landToEdit.latitude && landToEdit.longitude) {
//         setManualCoordinates({
//           lat: landToEdit.latitude.toString(),
//           lng: landToEdit.longitude.toString()
//         });
//       }
      
//       handleDeleteLand(id);
//     }
//   };

//   const handleDeleteLand = (id) => {
//     setLands(lands.filter(land => land.id !== id));
//   };

//   const handleSaveLands = async () => {
//     if (lands.length === 0) {
//       Alert.alert('Error', 'Please add at least one land');
//       return;
//     }

//     if (!farmerId) {
//       Alert.alert('Error', 'Farmer ID not found');
//       return;
//     }

//     setSaving(true);
//     try {
//       const landsData = {
//         farmer_id: farmerId,
//         lands: lands.map(land => ({
//           city: land.city,
//           area: land.area,
//           zone: land.zone,
//           areaSize: land.areaSize,
//           areaUnit: land.areaUnit,
//           soilType: land.soilType,
//           season: land.season,
//           latitude: land.latitude,
//           longitude: land.longitude,
//         }))
//       };

//       const response = await farmerAPI.addLandDetails(landsData);
      
//       if (response.success) {
//         if (route.params?.onLandsAdded) {
//           route.params.onLandsAdded();
//         }
        
//         Alert.alert('Success', 'Lands saved successfully!');
//         navigation.goBack();
        
//       } else {
//         Alert.alert('Error', response.message || 'Failed to save lands');
//       }
      
//     } catch (error) {
//       console.error('Error saving lands:', error);
//       Alert.alert('Error', error.message || 'Failed to save lands');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ LAND CROPS MODAL
//   const LandCropsModal = () => {
//     if (!selectedLandData) return null;
    
//     const { landInfo, crops, seasonSummary, farmerName, requestedSeason, totalCrops } = selectedLandData;
    
//     return (
//       <Modal visible={showLandCropsModal} transparent animationType="slide">
//         <View style={styles.fullModalContainer}>
//           <View style={[styles.landCropsModalContent, { height: height * 0.8 }]}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>{farmerName}{getText("'s Land", ' کی زمین')}</Text>
//               <TouchableOpacity onPress={() => {
//                 setShowLandCropsModal(false);
//                 setSelectedLandData(null);
//               }}>
//                 <Icon name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>
            
//             <ScrollView style={styles.landCropsScrollView}>
//               <View style={styles.landInfoSection}>
//                 <Text style={styles.sectionSubtitle}>{getText('Land Details', 'زمین کی تفصیلات')}</Text>
//                 <View style={styles.infoRow}>
//                   <Icon name="place" size={14} color="#666" />
//                   <Text style={styles.infoText}>
//                     {areaMap[landInfo.area] || landInfo.area}, {cityMap[landInfo.city] || landInfo.city} • {getZoneName(landInfo.zone)}
//                   </Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <Icon name="square-foot" size={14} color="#666" />
//                   <Text style={styles.infoText}>
//                     {landInfo.area_size} {unitMap[landInfo.area_unit] || landInfo.area_unit} • {soilMap[landInfo.soil_type] || landInfo.soil_type}
//                   </Text>
//                 </View>
//                 {landInfo.farmer_phone && (
//                   <View style={styles.infoRow}>
//                     <Icon name="phone" size={14} color="#666" />
//                     <Text style={styles.infoText}>{landInfo.farmer_phone}</Text>
//                   </View>
//                 )}
//               </View>
              
//               <View style={styles.seasonSummarySection}>
//                 <Text style={styles.sectionSubtitle}>{getText('Season Summary', 'موسم کا خلاصہ')}</Text>
//                 <View style={styles.seasonBadges}>
//                   {seasonSummary.map((season, index) => (
//                     <View key={index} style={styles.seasonBadge}>
//                       <Text style={styles.seasonBadgeText}>
//                         {season.season === 'Rabi' ? getText('Rabi', 'ربیع') : getText('Kharif', 'خریف')}: {season.crop_count} {getText('crops', 'فصلیں')}
//                       </Text>
//                     </View>
//                   ))}
//                 </View>
//                 <Text style={styles.selectedSeasonText}>
//                   {getText('Currently Viewing', 'فی الحال دیکھ رہے ہیں')}: <Text style={styles.seasonHighlight}>{requestedSeason === 'All Seasons' ? getText('All Seasons', 'تمام موسم') : requestedSeason}</Text>
//                 </Text>
//               </View>
              
//               <View style={styles.cropsSection}>
//                 <View style={styles.sectionHeader}>
//                   <Text style={styles.sectionSubtitle}>
//                     {getText('Crops', 'فصلیں')} ({totalCrops})
//                   </Text>
//                 </View>
                
//                 {loadingLandCrops ? (
//                   <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color="#4CAF50" />
//                     <Text style={styles.loadingText}>{getText('Loading crops...', 'فصلیں لوڈ ہو رہی ہیں...')}</Text>
//                   </View>
//                 ) : crops.length > 0 ? (
//                   crops.map((crop, index) => (
//                     <View key={index} style={styles.cropCard}>
//                       <View style={styles.cropHeader}>
//                         <Text style={styles.cropName}>{crop.crop_name}</Text>
//                         <View style={[
//                           styles.seasonTag,
//                           { backgroundColor: crop.season === 'Rabi' ? '#4CAF50' : '#FF9800' }
//                         ]}>
//                           <Text style={styles.seasonTagText}>{crop.season === 'Rabi' ? getText('Rabi', 'ربیع') : getText('Kharif', 'خریف')}</Text>
//                         </View>
//                       </View>
                      
//                       <View style={styles.cropDetails}>
//                         <View style={styles.cropDetailRow}>
//                           <Icon name="calendar-today" size={12} color="#666" />
//                           <Text style={styles.cropDetailText}>
//                             {getText('Sowing', 'بوائی')}: {crop.sowing_date} • {getText('Harvest', 'کٹائی')}: {crop.harvest_date}
//                           </Text>
//                         </View>
                        
//                         {crop.yield_per_40kg && (
//                           <View style={styles.cropDetailRow}>
//                             <Icon name="trending-up" size={12} color="#666" />
//                             <Text style={styles.cropDetailText}>
//                               {getText('Yield', 'پیداوار')}: {crop.yield_per_40kg} {getText('per 40kg', 'فی 40 کلو')}
//                             </Text>
//                           </View>
//                         )}
                        
//                         {crop.fertilizer_used && (
//                           <View style={styles.cropDetailRow}>
//                             <Icon name="grass" size={12} color="#666" />
//                             <Text style={styles.cropDetailText}>
//                               {getText('Fertilizer', 'کھاد')}: {crop.fertilizer_used}
//                             </Text>
//                           </View>
//                         )}
//                       </View>
                      
//                       {crop.activities && crop.activities.length > 0 && (
//                         <View style={styles.activitiesSection}>
//                           <Text style={styles.activitiesTitle}>
//                             {getText('Activities', 'سرگرمیاں')} ({crop.total_activities})
//                           </Text>
//                           {crop.activities.slice(0, 3).map((activity, idx) => (
//                             <View key={idx} style={styles.activityItem}>
//                               <View style={styles.activityHeader}>
//                                 <Text style={styles.activityType}>{activity.activity_type}</Text>
//                                 <Text style={styles.activityDate}>{activity.activity_date}</Text>
//                               </View>
//                               <Text style={styles.activityDesc}>{activity.description}</Text>
//                               {activity.chemical_or_fertilizer_used && (
//                                 <Text style={styles.activityChemical}>
//                                   {getText('Used', 'استعمال')}: {activity.chemical_or_fertilizer_used}
//                                 </Text>
//                               )}
//                             </View>
//                           ))}
//                           {crop.total_activities > 3 && (
//                             <Text style={styles.viewMoreText}>
//                               + {crop.total_activities - 3} {getText('more activities', 'مزید سرگرمیاں')}
//                             </Text>
//                           )}
//                         </View>
//                       )}
//                     </View>
//                   ))
//                 ) : (
//                   <View style={styles.emptyContainer}>
//                     <Icon name="grass" size={40} color="#ccc" />
//                     <Text style={styles.emptyText}>
//                       {getText('No crops found', 'کوئی فصل نہیں ملی')}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </ScrollView>
            
//             <View style={styles.modalActions}>
//               <TouchableOpacity 
//                 style={styles.closeModalButton}
//                 onPress={() => {
//                   setShowLandCropsModal(false);
//                   setSelectedLandData(null);
//                 }}
//               >
//                 <Text style={styles.closeModalButtonText}>{getText('Close', 'بند کریں')}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
//   };

//   // ✅ NEARBY MAP MODAL - WITH DYNAMIC RADIUS INPUT
//   const NearbyMapModal = () => {
//     return (
//       <Modal visible={showNearbyMap} transparent animationType="slide">
//         <View style={styles.fullModalContainer}>
//           <View style={[styles.mapModalContent, { height: height * 0.85 }]}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>{getText('Nearby Lands in', 'قریبی زمینیں')} {areaMap[selectedArea] || selectedArea}</Text>
//               <TouchableOpacity onPress={() => setShowNearbyMap(false)}>
//                 <Icon name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>
            
//             <Text style={styles.mapSubtitle}>
//               📍 {areaMap[selectedArea] || selectedArea} - {searchRadius}{getText('km', 'کلومیٹر')} {getText('Radius', 'دائرہ')} | {nearbyLands.length} {getText('Lands Found', 'زمینیں ملیں')}
//             </Text>
            
//             {/* ✅ DYNAMIC RADIUS INPUT - User can enter ANY number */}
//             <View style={styles.radiusInputContainer}>
//               <View style={styles.radiusInputRow}>
//                 <Icon name="radar" size={20} color="#4CAF50" />
//                 <Text style={styles.radiusLabel}>{getText('Search Radius', 'تلاش کا دائرہ')}:</Text>
//                 <TextInput
//                   style={styles.radiusInput}
//                   value={searchRadius}
//                   onChangeText={setSearchRadius}
//                   keyboardType="numeric"
//                   placeholder={getText('Enter any radius (km)', 'دائرہ درج کریں (کلومیٹر)')}
//                   placeholderTextColor="#999"
//                 />
//                 <Text style={styles.radiusUnit}>{getText('km', 'کلومیٹر')}</Text>
//                 <TouchableOpacity 
//                   style={styles.applyRadiusButton}
//                   onPress={getNearbyLands}
//                   disabled={loadingNearby}
//                 >
//                   <Text style={styles.applyRadiusText}>{getText('Apply', 'لگائیں')}</Text>
//                 </TouchableOpacity>
//               </View>
//               <Text style={styles.radiusHint}>
//                 💡 {getText('You can use any number - 3, 5, 6.5, 7, 10, 12.3, 15, 20 km', 'آپ کوئی بھی نمبر استعمال کر سکتے ہیں - 3, 5, 6.5, 7, 10, 12.3, 15, 20 کلومیٹر')}
//               </Text>
//             </View>
            
//             {loadingNearby ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#4CAF50" />
//                 <Text style={styles.loadingText}>{getText('Loading nearby lands...', 'قریبی زمینیں لوڈ ہو رہی ہیں...')}</Text>
//               </View>
//             ) : (
//               <View style={styles.simpleListContainer}>
//                 <FlatList
//                   data={nearbyLands}
//                   keyExtractor={(item, index) => `${item.land_id}_${index}`}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity 
//                       style={styles.landCard}
//                       onPress={() => getLandCrops(item)}
//                       activeOpacity={0.7}
//                     >
//                       <View style={styles.landCardHeader}>
//                         <Text style={styles.landCardName}>{item.farmer_name}</Text>
//                         <View style={styles.distanceBadge}>
//                           <Icon name="location-on" size={12} color="white" />
//                           <Text style={styles.distanceText}>{item.distance_km} {getText('km', 'کلومیٹر')}</Text>
//                         </View>
//                       </View>
                      
//                       <View style={styles.landDetails}>
//                         <View style={styles.detailRow}>
//                           <Icon name="place" size={14} color="#666" />
//                           <Text style={styles.detailText}>{areaMap[item.area_name] || item.area_name}, {cityMap[item.city_name] || item.city_name}</Text>
//                         </View>
                        
//                         <View style={styles.detailRow}>
//                           <Icon name="square-foot" size={14} color="#666" />
//                           <Text style={styles.detailText}>{item.area_size} {unitMap[item.area_unit] || item.area_unit}</Text>
//                         </View>
                        
//                         <View style={styles.detailRow}>
//                           <Icon name="grass" size={14} color="#666" />
//                           <Text style={styles.detailText}>{soilMap[item.soil_type] || item.soil_type}</Text>
//                         </View>
                        
//                         {item.farmer_phone && (
//                           <View style={styles.detailRow}>
//                             <Icon name="phone" size={14} color="#666" />
//                             <Text style={styles.detailText}>{item.farmer_phone}</Text>
//                           </View>
//                         )}
//                       </View>
//                     </TouchableOpacity>
//                   )}
//                   ListEmptyComponent={
//                     <View style={styles.emptyContainer}>
//                       <Icon name="landscape" size={50} color="#ccc" />
//                       <Text style={styles.emptyText}>{getText('No nearby lands found', 'کوئی قریبی زمین نہیں ملی')}</Text>
//                     </View>
//                   }
//                 />
//               </View>
//             )}
            
//             <View style={styles.mapActions}>
//               <TouchableOpacity 
//                 style={styles.viewInMapsButton}
//                 onPress={openGoogleMaps}
//               >
//                 <Icon name="map" size={18} color="white" />
//                 <Text style={styles.viewInMapsButtonText}>{getText('View in Google Maps', 'گوگل میپس میں دیکھیں')}</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={styles.closeMapButton}
//                 onPress={() => setShowNearbyMap(false)}
//               >
//                 <Text style={styles.closeMapButtonText}>{getText('Close', 'بند کریں')}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
//   };

//   // ✅ COORDINATES MODAL
//   const CoordinatesModal = () => (
//     <Modal visible={showCoordinatesModal} transparent animationType="slide">
//       <View style={styles.fullModalContainer}>
//         <View style={[styles.coordinatesModalContent, { height: height * 0.5 }]}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>{getText('Set Coordinates', 'کوآرڈینیٹس سیٹ کریں')}</Text>
//             <TouchableOpacity onPress={() => setShowCoordinatesModal(false)}>
//               <Icon name="close" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>
          
//           <ScrollView style={styles.coordinatesScrollView}>
//             <Text style={styles.coordinatesNote}>
//               {getText('Enter latitude and longitude for your land location', 'اپنی زمین کے لیے عرض البلد اور طول البلد درج کریں')}
//             </Text>
            
//             <View style={styles.coordinateInputGroup}>
//               <Text style={styles.coordinateLabel}>{getText('Latitude', 'عرض البلد')}</Text>
//               <TextInput
//                 style={styles.coordinateInput}
//                 placeholder="e.g., 33.200000"
//                 value={manualCoordinates.lat}
//                 onChangeText={(text) => setManualCoordinates(prev => ({ ...prev, lat: text }))}
//                 keyboardType="numeric"
//                 placeholderTextColor="#999"
//               />
//             </View>
            
//             <View style={styles.coordinateInputGroup}>
//               <Text style={styles.coordinateLabel}>{getText('Longitude', 'طول البلد')}</Text>
//               <TextInput
//                 style={styles.coordinateInput}
//                 placeholder="e.g., 73.140000"
//                 value={manualCoordinates.lng}
//                 onChangeText={(text) => setManualCoordinates(prev => ({ ...prev, lng: text }))}
//                 keyboardType="numeric"
//                 placeholderTextColor="#999"
//               />
//             </View>
            
//             {areaCenterInfo?.success && (
//               <TouchableOpacity 
//                 style={styles.autoFillButton}
//                 onPress={() => {
//                   if (areaCenterInfo.center_latitude && areaCenterInfo.center_longitude) {
//                     setManualCoordinates({
//                       lat: areaCenterInfo.center_latitude.toString(),
//                       lng: areaCenterInfo.center_longitude.toString()
//                     });
//                     Alert.alert('Success', 'Coordinates set from area center');
//                   }
//                 }}
//               >
//                 <Icon name="location-on" size={18} color="white" />
//                 <Text style={styles.autoFillButtonText}>{getText('Use Area Center Coordinates', 'علاقے کے مرکزی کوآرڈینیٹس استعمال کریں')}</Text>
//               </TouchableOpacity>
//             )}
            
//             <View style={styles.currentCoordinates}>
//               <Text style={styles.currentCoordinatesTitle}>{getText('Current Coordinates', 'موجودہ کوآرڈینیٹس')}:</Text>
//               <Text style={styles.currentCoordinatesValue}>
//                 {manualCoordinates.lat && manualCoordinates.lng 
//                   ? `${manualCoordinates.lat}, ${manualCoordinates.lng}`
//                   : getText('Not set', 'سیٹ نہیں')}
//               </Text>
//             </View>
//           </ScrollView>
          
//           <View style={styles.coordinatesModalActions}>
//             <TouchableOpacity 
//               style={styles.cancelCoordinatesButton}
//               onPress={() => setShowCoordinatesModal(false)}
//             >
//               <Text style={styles.cancelCoordinatesButtonText}>{getText('Cancel', 'منسوخ')}</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.saveCoordinatesButton}
//               onPress={() => {
//                 if (manualCoordinates.lat && manualCoordinates.lng) {
//                   setShowCoordinatesModal(false);
//                   Alert.alert('Success', 'Coordinates saved!');
//                 } else {
//                   Alert.alert('Error', 'Please enter both latitude and longitude');
//                 }
//               }}
//             >
//               <Icon name="check" size={18} color="white" />
//               <Text style={styles.saveCoordinatesButtonText}>{getText('Save', 'محفوظ کریں')}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );

//   // ✅ AREA DROPDOWN MODAL
//   const AreaDropdownModal = () => {
//     const filteredAreas = areasData.filter(area => 
//       !areaSearch || area.area_name.toLowerCase().includes(areaSearch.toLowerCase())
//     );
    
//     return (
//       <Modal visible={showAreaDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowAreaDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={[styles.dropdownMenu, { height: height * 0.6 }]}>
//               <Text style={styles.dropdownTitle}>{getText('Select Area in', 'علاقہ منتخب کریں')} {cityMap[selectedCity] || selectedCity}</Text>
              
//               <View style={styles.searchContainer}>
//                 <TextInput
//                   style={styles.searchInput}
//                   placeholder={getText('Search area...', 'علاقہ تلاش کریں...')}
//                   value={areaSearch}
//                   onChangeText={setAreaSearch}
//                   placeholderTextColor="#999"
//                 />
//                 <Icon name="search" size={20} color="#666" />
//               </View>
              
//               <ScrollView style={styles.dropdownScrollView}>
//                 {loadingAreas ? (
//                   <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="small" color="#4CAF50" />
//                     <Text style={styles.loadingText}>{getText('Loading areas...', 'علاقے لوڈ ہو رہے ہیں...')}</Text>
//                   </View>
//                 ) : filteredAreas.length > 0 ? (
//                   filteredAreas.map((area, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={styles.dropdownItem}
//                       onPress={() => handleAreaSelect(area.area_name)}
//                     >
//                       <View style={styles.areaItemContent}>
//                         <Text style={styles.dropdownItemText}>{areaMap[area.area_name] || area.area_name}</Text>
//                         <Text style={styles.areaZoneText}>{area.description}</Text>
//                       </View>
//                       <Icon name="chevron-right" size={20} color="#999" />
//                     </TouchableOpacity>
//                   ))
//                 ) : (
//                   <View style={styles.noDataContainer}>
//                     <Text style={styles.noDataText}>{getText('No areas found', 'کوئی علاقہ نہیں ملا')}</Text>
//                   </View>
//                 )}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     );
//   };

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
         
//           <View style={styles.landForm}>
//             {/* FORM SECTION */}
//             <View style={styles.formSection}>
//               <Text style={styles.sectionTitle}>{getText('Land Information', 'زمین کی معلومات')}</Text>
              
//               {/* City */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>{getText('City', 'شہر')}</Text>
//                 <TouchableOpacity 
//                   style={styles.dropdownButton}
//                   onPress={() => setShowCityDropdown(true)}
//                 >
//                   <Text style={[styles.dropdownText, !selectedCity && { color: '#999' }]}>
//                     {selectedCity ? (cityMap[selectedCity] || selectedCity) : getText('Select District', 'ضلع منتخب کریں')}
//                   </Text>
//                   <Icon name="arrow-drop-down" size={20} color="#666" />
//                 </TouchableOpacity>
//               </View>

//               {/* Area */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>{getText('Area', 'علاقہ')}</Text>
//                 <TouchableOpacity 
//                   style={[styles.dropdownButton, !selectedCity && styles.disabledDropdown]}
//                   onPress={() => selectedCity && setShowAreaDropdown(true)}
//                   disabled={!selectedCity}
//                 >
//                   <Text style={[styles.dropdownText, !selectedArea && { color: '#999' }]}>
//                     {selectedArea ? (areaMap[selectedArea] || selectedArea) : (selectedCity ? getText('Select Area', 'علاقہ منتخب کریں') : getText('Select District First', 'پہلے ضلع منتخب کریں'))}
//                   </Text>
//                   <Icon name="arrow-drop-down" size={20} color={selectedCity ? "#666" : "#ccc"} />
//                 </TouchableOpacity>
//               </View>

//               {/* Zone */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>{getText('Zone', 'زون')}</Text>
//                 <View style={styles.zoneDisplay}>
//                   <Text style={styles.zoneValue}>{getZoneName(selectedZone)}</Text>
//                 </View>
//               </View>

//               {/* Area Size */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>{getText('Area Size', 'رقبہ کا سائز')}</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder={getText('e.g., 10', 'مثال: 10')}
//                   value={areaSize}
//                   onChangeText={setAreaSize}
//                   keyboardType="numeric"
//                   placeholderTextColor="#999"
//                 />
//               </View>

//               {/* Area Unit */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>{getText('Area Unit', 'رقبہ کی اکائی')}</Text>
//                 <TouchableOpacity 
//                   style={styles.dropdownButton}
//                   onPress={() => setShowAreaUnitDropdown(true)}
//                 >
//                   <Text style={[styles.dropdownText, !selectedAreaUnit && { color: '#999' }]}>
//                     {selectedAreaUnit ? (unitMap[selectedAreaUnit] || selectedAreaUnit) : getText('Select Area Unit', 'یونٹ منتخب کریں')}
//                   </Text>
//                   <Icon name="arrow-drop-down" size={20} color="#666" />
//                 </TouchableOpacity>
//               </View>

//               {/* Soil Type */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>{getText('Soil Type', 'مٹی کی قسم')}</Text>
//                 <TouchableOpacity 
//                   style={[styles.dropdownButton, !selectedCity && styles.disabledDropdown]}
//                   onPress={() => selectedCity && setShowSoilTypeDropdown(true)}
//                   disabled={!selectedCity}
//                 >
//                   <Text style={[styles.dropdownText, !selectedSoilType && { color: '#999' }]}>
//                     {selectedSoilType ? (soilMap[selectedSoilType] || selectedSoilType) : (selectedCity ? getText('Select Soil Type', 'مٹی کی قسم منتخب کریں') : getText('Select District First', 'پہلے ضلع منتخب کریں'))}
//                   </Text>
//                   <Icon name="arrow-drop-down" size={20} color={selectedCity ? "#666" : "#ccc"} />
//                 </TouchableOpacity>
//               </View>

//             </View>

//             {/* LOCATION SECTION */}
//             <View style={styles.formSection}>
//               <View style={styles.locationHeader}>
//                 <Text style={styles.sectionTitle}>{getText('Location', 'مقام')}</Text>
//                 <TouchableOpacity 
//                   style={styles.googleMapsButton}
//                   onPress={openGoogleMaps}
//                   disabled={!selectedArea}
//                 >
//                   <Icon name="map" size={16} color="white" />
//                   <Text style={styles.googleMapsButtonText}>{getText('View in Map', 'نقشے میں دیکھیں')}</Text>
//                 </TouchableOpacity>
//               </View>
              
//               {/* Nearby Lands Button */}
//               <TouchableOpacity 
//                 style={styles.nearbyButton}
//                 onPress={getNearbyLands}
//                 disabled={loadingNearby}
//               >
//                 {loadingNearby ? (
//                   <ActivityIndicator size="small" color="white" />
//                 ) : (
//                   <>
//                     <Icon name="list" size={18} color="white" />
//                     <Text style={styles.nearbyButtonText}>
//                       {getText('Show Nearby Lands List', 'قریبی زمینیں دیکھیں')}
//                     </Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>

//             {/* Add Land Button */}
//             <TouchableOpacity 
//               style={styles.addLandButton}
//               onPress={handleAddLand}
//               disabled={loading}
//             >
//               <Icon name="add-circle" size={24} color="white" />
//               <Text style={styles.addLandButtonText}>{getText('Add Land', 'زمین شامل کریں')}</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Lands List */}
//           {lands.length > 0 && (
//             <View style={styles.landsList}>
//               <View style={styles.landsListHeader}>
//                 <Text style={styles.sectionTitle}>{getText('Added Lands', 'شامل کردہ زمینیں')} ({lands.length})</Text>
//                 <TouchableOpacity onPress={() => setLands([])}>
//                   <Text style={styles.clearAllText}>{getText('Clear All', 'سب صاف کریں')}</Text>
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={lands}
//                 renderItem={({ item }) => (
//                   <View style={styles.landItem}>
//                     <View style={styles.landInfo}>
//                       <Text style={styles.landText}>
//                         <Text style={styles.landLabel}>📍 </Text>
//                         {areaMap[item.area] || item.area}, {cityMap[item.city] || item.city}
//                       </Text>
//                       <Text style={styles.landText}>
//                         <Text style={styles.landLabel}>📏 </Text>
//                         {item.areaSize} {unitMap[item.areaUnit] || item.areaUnit} • {getZoneName(item.zone)}
//                       </Text>
//                       <Text style={styles.landText}>
//                         <Text style={styles.landLabel}>🌱 </Text>
//                         {soilMap[item.soilType] || item.soilType}
//                       </Text>
//                       {item.season && (
//                         <Text style={styles.landText}>
//                           <Text style={styles.landLabel}>🌾 </Text>
//                           {getText('Season', 'موسم')}: {item.season === 'Rabi' ? getText('Rabi', 'ربیع') : getText('Kharif', 'خریف')}
//                         </Text>
//                       )}
//                       {item.latitude && item.longitude && (
//                         <Text style={styles.landCoordinates}>
//                           <Text style={styles.landLabel}>📍 </Text>
//                           {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
//                         </Text>
//                       )}
//                     </View>
//                     <View style={styles.landActions}>
//                       <TouchableOpacity 
//                         style={styles.editButton}
//                         onPress={() => handleEditLand(item.id)}
//                       >
//                         <Icon name="edit" size={18} color="white" />
//                       </TouchableOpacity>
//                       <TouchableOpacity 
//                         style={styles.deleteButton}
//                         onPress={() => handleDeleteLand(item.id)}
//                       >
//                         <Icon name="delete" size={18} color="white" />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 )}
//                 keyExtractor={item => item.id}
//                 scrollEnabled={false}
//               />
//             </View>
//           )}

//           {/* Save Button */}
//           {lands.length > 0 && (
//             <TouchableOpacity 
//               style={[styles.saveButton, saving && styles.disabledButton]} 
//               onPress={handleSaveLands}
//               disabled={saving}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <>
//                   <Icon name="save" size={24} color="white" />
//                   <Text style={styles.saveButtonText}>{getText('SAVE ALL LANDS', 'تمام زمینیں محفوظ کریں')} ({lands.length})</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           )}
//         </ScrollView>
//       </SafeAreaView>

//       {/* MODALS */}
//       <LandCropsModal />
//       <NearbyMapModal />
//       <CoordinatesModal />
//       <AreaDropdownModal />

//       {/* City Dropdown */}
//       <Modal visible={showCityDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowCityDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.dropdownMenu}>
//               <Text style={styles.dropdownTitle}>{getText('Select District', 'ضلع منتخب کریں')}</Text>
//               <ScrollView style={styles.dropdownScrollView}>
//                 {cities.map((city, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.dropdownItem}
//                     onPress={() => handleCitySelect(city)}
//                   >
//                     <Text style={styles.dropdownItemText}>{cityMap[city] || city}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Area Unit Dropdown */}
//       <Modal visible={showAreaUnitDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowAreaUnitDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.dropdownMenu}>
//               <Text style={styles.dropdownTitle}>{getText('Select Area Unit', 'یونٹ منتخب کریں')}</Text>
//               <ScrollView style={styles.dropdownScrollView}>
//                 {areaUnits.map((unit, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.dropdownItem}
//                     onPress={() => {
//                       setSelectedAreaUnit(unit);
//                       setShowAreaUnitDropdown(false);
//                     }}
//                   >
//                     <Text style={styles.dropdownItemText}>{unitMap[unit] || unit}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Soil Type Dropdown */}
//       <Modal visible={showSoilTypeDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowSoilTypeDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.dropdownMenu}>
//               <Text style={styles.dropdownTitle}>{getText('Select Soil Type', 'مٹی کی قسم منتخب کریں')}</Text>
//               <ScrollView style={styles.dropdownScrollView}>
//                 {availableSoilTypes.map((soil, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.dropdownItem}
//                     onPress={() => {
//                       setSelectedSoilType(soil);
//                       setShowSoilTypeDropdown(false);
//                     }}
//                   >
//                     <Text style={styles.dropdownItemText}>{soilMap[soil] || soil}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Season Dropdown */}
//       <Modal visible={showSeasonDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowSeasonDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.dropdownMenu}>
//               <Text style={styles.dropdownTitle}>{getText('Select Season', 'موسم منتخب کریں')}</Text>
//               <ScrollView style={styles.dropdownScrollView}>
//                 {seasonsWithDates.map((season, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.dropdownItem,
//                       selectedSeason === season.name && { backgroundColor: '#E8F5E9' }
//                     ]}
//                     onPress={() => handleSeasonSelect(season.name)}
//                   >
//                     <View>
//                       <Text style={styles.dropdownItemText}>{season.name === 'Rabi' ? getText('Rabi', 'ربیع') : getText('Kharif', 'خریف')}</Text>
//                       <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
//                         {season.from} - {season.to}
//                       </Text>
//                     </View>
//                     {selectedSeason === season.name && (
//                       <Icon name="check" size={20} color="#4CAF50" />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   safeArea: {
//     flex: 1,
//   },
//   scrollContainer: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   formSection: {
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 15,
//     textAlign: 'right',
//   },
//   inputGroup: {
//     marginBottom: 15,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#444',
//     marginBottom: 8,
//     textAlign: 'right',
//   },
//   landForm: {
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: '#f8f9fa',
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'right',
//   },
//   dropdownButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   disabledDropdown: {
//     backgroundColor: '#f5f5f5',
//     borderColor: '#e0e0e0',
//   },
//   dropdownText: {
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'right',
//     flex: 1,
//   },
//   zoneDisplay: {
//     backgroundColor: '#e8f5e8',
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#c8e6c9',
//   },
//   zoneValue: {
//     fontSize: 16,
//     color: '#1b5e20',
//     fontWeight: '600',
//     textAlign: 'right',
//   },
//   locationHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   googleMapsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4285F4',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 6,
//   },
//   googleMapsButtonText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   nearbyButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FF9800',
//     padding: 15,
//     borderRadius: 10,
//     gap: 10,
//   },
//   nearbyButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   // Radius Input Styles
//   radiusInputContainer: {
//     backgroundColor: '#f0f8ff',
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#bbdefb',
//   },
//   radiusInputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   radiusLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   radiusInput: {
//     flex: 1,
//     backgroundColor: 'white',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   radiusUnit: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '600',
//   },
//   applyRadiusButton: {
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   applyRadiusText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   radiusHint: {
//     fontSize: 11,
//     color: '#666',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   // Map Modal Styles
//   mapModalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   mapSubtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   simpleListContainer: {
//     flex: 1,
//     paddingHorizontal: 5,
//   },
//   landCard: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   landCardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   landCardName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     flex: 1,
//   },
//   distanceBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   distanceText: {
//     fontSize: 12,
//     color: 'white',
//     fontWeight: '600',
//   },
//   landDetails: {
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   detailText: {
//     fontSize: 14,
//     color: '#555',
//     marginLeft: 8,
//     textAlign: 'right',
//     flex: 1,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#999',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   mapActions: {
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 15,
//   },
//   viewInMapsButton: {
//     flex: 2,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4285F4',
//     padding: 12,
//     borderRadius: 8,
//     gap: 8,
//   },
//   viewInMapsButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   closeMapButton: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeMapButtonText: {
//     color: '#666',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   // Coordinates Modal Styles
//   coordinatesModalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   coordinatesScrollView: {
//     flex: 1,
//   },
//   coordinatesNote: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   coordinateInputGroup: {
//     marginBottom: 15,
//   },
//   coordinateLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//     textAlign: 'right',
//   },
//   coordinateInput: {
//     backgroundColor: '#f8f9fa',
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'right',
//   },
//   autoFillButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4CAF50',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 10,
//     gap: 8,
//   },
//   autoFillButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   currentCoordinates: {
//     backgroundColor: '#f0f7ff',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 15,
//     borderWidth: 1,
//     borderColor: '#bbdefb',
//   },
//   currentCoordinatesTitle: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//     textAlign: 'right',
//   },
//   currentCoordinatesValue: {
//     fontSize: 14,
//     color: '#2E7D32',
//     fontWeight: '600',
//     fontFamily: 'monospace',
//     textAlign: 'right',
//   },
//   coordinatesModalActions: {
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 15,
//   },
//   cancelCoordinatesButton: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   cancelCoordinatesButtonText: {
//     color: '#666',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   saveCoordinatesButton: {
//     flex: 2,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 10,
//     gap: 8,
//   },
//   saveCoordinatesButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   // Dropdown Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dropdownMenu: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 10,
//     width: '80%',
//     maxHeight: 400,
//   },
//   dropdownTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   searchInput: {
//     flex: 1,
//     padding: 10,
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'right',
//   },
//   dropdownScrollView: {
//     maxHeight: 300,
//   },
//   dropdownItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   areaItemContent: {
//     flex: 1,
//   },
//   dropdownItemText: {
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'right',
//   },
//   areaZoneText: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//     textAlign: 'right',
//   },
//   // Loading Styles
//   loadingContainer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 8,
//     color: '#666',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   noDataContainer: {
//     padding: 30,
//     alignItems: 'center',
//   },
//   noDataText: {
//     color: '#999',
//     fontSize: 14,
//     fontStyle: 'italic',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   // Lands List Styles
//   landsList: {
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   landsListHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   clearAllText: {
//     color: '#F44336',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   landItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   landInfo: {
//     flex: 1,
//   },
//   landText: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 4,
//     textAlign: 'right',
//   },
//   landLabel: {
//     color: '#666',
//     fontWeight: '600',
//   },
//   landCoordinates: {
//     fontSize: 12,
//     color: '#666',
//     fontStyle: 'italic',
//     marginTop: 4,
//     textAlign: 'right',
//   },
//   landActions: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   editButton: {
//     backgroundColor: '#4CAF50',
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   deleteButton: {
//     backgroundColor: '#F44336',
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   // Buttons
//   addLandButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FF9800',
//     padding: 18,
//     borderRadius: 12,
//     marginTop: 10,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   addLandButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 12,
//   },
//   saveButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#2e7d32de',
//     paddingVertical: 18,
//     borderRadius: 12,
//     marginBottom: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   disabledButton: {
//     backgroundColor: '#A5D6A7',
//   },
//   saveButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 12,
//   },
//   fullModalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   // Land Crops Modal Styles
//   landCropsModalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     flex: 1,
//     textAlign: 'center',
//   },
//   landCropsScrollView: {
//     flex: 1,
//   },
//   landInfoSection: {
//     backgroundColor: '#f0f7ff',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#bbdefb',
//   },
//   sectionSubtitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 10,
//     textAlign: 'right',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//     justifyContent: 'flex-end',
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#555',
//     marginLeft: 8,
//     textAlign: 'right',
//     flex: 1,
//   },
//   seasonSummarySection: {
//     backgroundColor: '#fff8e1',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ffe082',
//   },
//   seasonBadges: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 10,
//     justifyContent: 'flex-end',
//   },
//   seasonBadge: {
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//   },
//   seasonBadgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   selectedSeasonText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'right',
//   },
//   seasonHighlight: {
//     color: '#2E7D32',
//     fontWeight: 'bold',
//   },
//   cropsSection: {
//     marginBottom: 20,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cropCard: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   cropHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cropName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     flex: 1,
//     textAlign: 'right',
//   },
//   seasonTag: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   seasonTagText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   cropDetails: {
//     marginBottom: 10,
//   },
//   cropDetailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//     justifyContent: 'flex-end',
//   },
//   cropDetailText: {
//     fontSize: 13,
//     color: '#555',
//     marginLeft: 6,
//     textAlign: 'right',
//   },
//   activitiesSection: {
//     backgroundColor: '#f9f9f9',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   activitiesTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 8,
//     textAlign: 'right',
//   },
//   activityItem: {
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 6,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   activityHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   activityType: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#444',
//   },
//   activityDate: {
//     fontSize: 12,
//     color: '#666',
//   },
//   activityDesc: {
//     fontSize: 12,
//     color: '#555',
//     marginBottom: 4,
//     textAlign: 'right',
//   },
//   activityChemical: {
//     fontSize: 11,
//     color: '#777',
//     fontStyle: 'italic',
//     textAlign: 'right',
//   },
//   viewMoreText: {
//     fontSize: 12,
//     color: '#4CAF50',
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 15,
//   },
//   closeModalButton: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeModalButtonText: {
//     color: '#666',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });

// export default LandInputPage;



















// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
//   ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
//   FlatList, Modal, TouchableWithoutFeedback, Dimensions, Linking
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { farmerAPI } from './api';

// const { width, height } = Dimensions.get('window');

// const LandInputPage = ({ navigation, route }) => {
//   // ✅ Language State (Default Urdu for display)
//   const [language] = useState('ur');
  
//   // ✅ Helper function for translations
//   const getText = (en, ur) => {
//     return language === 'ur' ? ur : en;
//   };
  
//   // ✅ States
//   const [selectedCity, setSelectedCity] = useState('');
//   const [selectedArea, setSelectedArea] = useState('');
//   const [selectedZone, setSelectedZone] = useState('');
//   const [areaSize, setAreaSize] = useState('');
//   const [selectedAreaUnit, setSelectedAreaUnit] = useState('');
//   const [selectedSoilType, setSelectedSoilType] = useState('');
//   const [selectedSeason, setSelectedSeason] = useState('');
//   const [areaSearch, setAreaSearch] = useState('');
//   const [lands, setLands] = useState(route.params?.existingLands || []);
//   const [farmerId, setFarmerId] = useState(null);
  
//   // ✅ Map & Nearby States
//   const [showNearbyMap, setShowNearbyMap] = useState(false);
//   const [areaCenterInfo, setAreaCenterInfo] = useState(null);
//   const [nearbyLands, setNearbyLands] = useState([]);
//   const [loadingNearby, setLoadingNearby] = useState(false);
  
//   // ✅ Dynamic Radius State (User can enter ANY number)
//   const [searchRadius, setSearchRadius] = useState('5');
  
//   // ✅ Land Crops Modal States
//   const [selectedLandData, setSelectedLandData] = useState(null);
//   const [showLandCropsModal, setShowLandCropsModal] = useState(false);
//   const [loadingLandCrops, setLoadingLandCrops] = useState(false);
  
//   // ✅ Manual Coordinates
//   const [showCoordinatesModal, setShowCoordinatesModal] = useState(false);
//   const [manualCoordinates, setManualCoordinates] = useState({ lat: '', lng: '' });
  
//   // ✅ Area Management
//   const [areasData, setAreasData] = useState([]);
//   const [loadingAreas, setLoadingAreas] = useState(false);
//   const [availableSoilTypes, setAvailableSoilTypes] = useState([]);
  
//   // UI States
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [showCityDropdown, setShowCityDropdown] = useState(false);
//   const [showAreaDropdown, setShowAreaDropdown] = useState(false);
//   const [showAreaUnitDropdown, setShowAreaUnitDropdown] = useState(false);
//   const [showSoilTypeDropdown, setShowSoilTypeDropdown] = useState(false);
//   const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  
//   // ✅ Zone Filter States
//   const [selectedZoneFilter, setSelectedZoneFilter] = useState('All');
//   const [showZoneFilterDropdown, setShowZoneFilterDropdown] = useState(false);
  
//   // ✅ Crop Filter States (for nearby lands)
//   const [selectedCropFilter, setSelectedCropFilter] = useState('All');
//   const [showCropFilterDropdown, setShowCropFilterDropdown] = useState(false);
  
//   // ✅ Land Crops Season Filter State
//   const [selectedCropSeasonFilter, setSelectedCropSeasonFilter] = useState('All');
//   const [showCropSeasonDropdown, setShowCropSeasonDropdown] = useState(false);

//   const cities = ['Rawalpindi', 'Lahore', 'Faisalabad', 'Multan', 'Gujrat', 'Sialkot'];
//   const areaUnits = ['acres', 'canal'];
  
//   // ✅ Zone Filter Options
//   const zoneFilterOptions = [
//     { id: 'All', labelEn: 'All Zones', labelUr: 'تمام زونز' },
//     { id: 'Zone A', labelEn: 'Zone A - Nehri', labelUr: 'زون اے - نہری' },
//     { id: 'Zone B', labelEn: 'Zone B - Tubewell', labelUr: 'زون بی - ٹیوب ویل' },
//     { id: 'Zone C', labelEn: 'Zone C - Barani', labelUr: 'زون سی - بارانی' }
//   ];
  
//   // ✅ Land Crops Season Filter Options
//   const cropSeasonFilterOptions = [
//     { id: 'All', labelEn: 'All Seasons', labelUr: 'تمام موسم' },
//     { id: 'Rabi', labelEn: 'Rabi Season', labelUr: 'ربیع موسم' },
//     { id: 'Kharif', labelEn: 'Kharif Season', labelUr: 'خریف موسم' }
//   ];
  
//   // ✅ Crop Filter Options (for nearby lands) - MATCH BACKEND CROP NAMES
//   const cropFilterOptions = [
//     { id: 'All', labelEn: 'All Crops', labelUr: 'تمام فصلیں' },
//     { id: 'WHEAT', labelEn: 'Wheat', labelUr: 'گندم' },
//     { id: 'MAIZE', labelEn: 'Maize', labelUr: 'مکئی' },
//     { id: 'RICE', labelEn: 'Rice', labelUr: 'چاول' },
//     { id: 'SUGARCANE', labelEn: 'Sugarcane', labelUr: 'گنا' },
//     { id: 'COTTON', labelEn: 'Cotton', labelUr: 'کپاس' },
//     { id: 'BARLEY', labelEn: 'Barley', labelUr: 'جو' },
//     { id: 'PEANUT', labelEn: 'Peanut', labelUr: 'مونگ پھلی' },
//     { id: 'CHICKPEAS', labelEn: 'Chickpeas', labelUr: 'چنے' },
//     { id: 'PADDY', labelEn: 'Paddy', labelUr: 'دھان' },
//     { id: 'MUSTARD', labelEn: 'Mustard', labelUr: 'سرسوں' },
//     { id: 'SUNFLOWER', labelEn: 'Sunflower', labelUr: 'سورج مکھی' },
//     { id: 'BAJRA', labelEn: 'Bajra', labelUr: 'باجرا' },
//     { id: 'SORGHUM', labelEn: 'Sorghum', labelUr: 'جوار' },
//     { id: 'TOBACCO', labelEn: 'Tobacco', labelUr: 'تمباکو' },
//     { id: 'SESAMUM', labelEn: 'Sesamum', labelUr: 'تل' }
//   ];
  
//   // ✅ City mapping English to Urdu
//   const cityMap = {
//     'Rawalpindi': 'راولپنڈی',
//     'Lahore': 'لاہور',
//     'Faisalabad': 'فیصل آباد',
//     'Multan': 'ملتان',
//     'Gujrat': 'گجرات',
//     'Sialkot': 'سیالکوٹ'
//   };
  
//   // ✅ Zone mapping English to Urdu
//   const zoneMap = {
//     'Zone A': 'نہری علاقہ',
//     'Zone B': 'ٹیوب ویل علاقہ',
//     'Zone C': 'بارانی علاقہ',
//     'Nehri Areas': 'نہری علاقہ',
//     'Tubewell Areas': 'ٹیوب ویل علاقہ',
//     'Barani areas': 'بارانی علاقہ'
//   };
  
//   // ✅ Soil type mapping English to Urdu
//   const soilMap = {
//     'CLAY LOAM': 'چکنی میٹھی',
//     'SILT LOAM': 'سلت میٹھی',
//     'SANDY LOAM': 'ریتی میٹھی',
//     'LOAM': 'میٹھی',
//     'CLAY': 'چکنی',
//     'SANDY CLAY': 'ریتی چکنی',
//     'SILT': 'سلت'
//   };
  
//   // ✅ Unit mapping
//   const unitMap = {
//     'acres': 'ایکڑ',
//     'canal': 'کنال'
//   };
  
//   // ✅ Season mapping
//   const seasonMap = {
//     'Rabi': 'ربیع',
//     'Kharif': 'خریف'
//   };
  
//   // ✅ Area mapping English to Urdu (100+ areas)
//   const areaMap = {
//     // Rawalpindi Areas
//     'Gujar Khan Tehsil - Rural Belt': 'گجر خان تحصیل - دیہی پٹی',
//     'Gujar Khan Plains - Lowland Farms': 'گجر خان میدانی علاقے - نشیبی فارم',
//     'Gujar Khan Uplands - Barani Pockets': 'گجر خان اپلینڈز - بارانی علاقے',
//     'Taxila Tehsil - Rural Belt': 'ٹیکسلا تحصیل - دیہی پٹی',
//     'Taxila Plains - Peri-urban Farms': 'ٹیکسلا میدانی علاقے - شہری مضافاتی فارم',
//     'Kahuta Tehsil - Hilly Farms': 'کہوٹہ تحصیل - پہاڑی فارم',
//     'Kallar Syedan Tehsil - Rural Belt': 'کلر سیداں تحصیل - دیہی پٹی',
//     'Murree Tehsil - Hill Agriculture': 'مری تحصیل - پہاڑی زراعت',
//     'Chakri - Peri-urban Tubewell Farms': 'چکری - شہری مضافاتی ٹیوب ویل فارم',
//     'Rawalpindi East Rural Belt': 'راولپنڈی مشرقی دیہی پٹی',
//     'Rawalpindi West Agricultural Plain': 'راولپنڈی مغربی زرعی میدان',
//     'Daultala Area - Agricultural Belt': 'ڈھولتالہ علاقہ - زرعی پٹی',
//     'Sohawa Road / Gujar Khan Fringe': 'سوہاوہ روڈ / گجر خان کنارے',
//     'Potohar Plateau Fringe - Farms': 'پوٹھوہار سطح مرتفع کے کنارے - فارم',
//     'Gujar Khan Peri-urban Tubewell Pockets': 'گجر خان شہری مضافاتی ٹیوب ویل علاقے',
//     'Rural Plains near Chakwal Border': 'چکوال سرحد کے قریب دیہی میدان',
//     'Kotli Sattian / Kahuta Hills - Barani': 'کوٹلی ستیاں / کہوٹہ پہاڑیاں - بارانی',
//     // Lahore Areas
//     'Raiwind Tehsil - Canal Command': 'رائے ونڈ تحصیل - نہری نظام',
//     'Kasur Belt (Lahore periphery)': 'قصور پٹی (لاہور مضافات)',
//     'Sharaqpur / Chunian Fringe': 'شرقپور / چونیاں کنارے',
//     'Sheikhupura Periphery (Lahore side)': 'شیخوپورہ مضافات (لاہور طرف)',
//     'Lahore-Faisalabad Road Agricultural Belt': 'لاہور-فیصل آباد روڈ زرعی پٹی',
//     'Walton / Kot Abdul Malik Peri-urban Farms': 'والٹن / کوٹ عبدالملک شہری مضافاتی فارم',
//     'Kala Shah Kaku / Ferozewala Belt': 'کالا شاہ کاکو / فیروزوالہ پٹی',
//     'Raiwind South Agricultural Belt': 'رائے ونڈ جنوبی زرعی پٹی',
//     'Lahore Sadar Rural Belt': 'لاہور صدر دیہی پٹی',
//     'Lahore North Uplands (small rainfed pockets)': 'لاہور شمالی اپلینڈز (چھوٹے بارانی علاقے)',
//     'Kot Khawaja Saeed / Peri-urban Farms': 'کوٹ خواجہ سعید / شہری مضافاتی فارم',
//     'Lahore South Plains - Mixed Irrigation': 'لاہور جنوبی میدان - مخلوط آبپاشی',
//     'Kasur-Raiwind Interchange Belt': 'قصور-رائے ونڈ انٹرچینج پٹی',
//     'Faisalabad Road Eastern Belt': 'فیصل آباد روڈ مشرقی پٹی',
//     'Shahdara Rural Fringe': 'شاہدرہ دیہی کنارے',
//     'Peri-urban Vegetable Belt (Lahore outskirts)': 'شہری مضافاتی سبزی پٹی (لاہور مضافات)',
//     'Lahore West Rural Belt - Smallholders': 'لاہور مغربی دیہی پٹی - چھوٹے کسان',
//     // Faisalabad Areas
//     'Chak Jhumra Tehsil - Canal Belt': 'چک جھمرہ تحصیل - نہری پٹی',
//     'Tandlianwala Tehsil - Irrigated Farms': 'تاندلیانوالہ تحصیل - سیراب فارم',
//     'Samundri Tehsil - Agricultural Plains': 'سمندری تحصیل - زرعی میدان',
//     'Jaranwala Tehsil - Canal Command': 'جڑانوالہ تحصیل - نہری نظام',
//     'Faisalabad South Rural Belt': 'فیصل آباد جنوبی دیہی پٹی',
//     'Faisalabad North Peri-urban Farms': 'فیصل آباد شمالی شہری مضافاتی فارم',
//     'Satiana Side - Tubewell Pockets': 'ستیانہ سائیڈ - ٹیوب ویل علاقے',
//     'Sukheke / Chak No. belts - Canal': 'سکھیکے / چک نمبر پٹیاں - نہری',
//     'Ghulam Muhammadabad / Rural Fringe': 'غلام محمد آباد / دیہی کنارے',
//     'Bhaggowal / Smallholder Area - Mixed': 'بھگووال / چھوٹے کسان علاقہ - مخلوط',
//     'Faisalabad West Agricultural Belt': 'فیصل آباد مغربی زرعی پٹی',
//     'Faisalabad East Peri-urban Tubewell Farms': 'فیصل آباد مشرقی شہری مضافاتی ٹیوب ویل فارم',
//     'Samundri South Rural Belt': 'سمندری جنوبی دیہی پٹی',
//     'Chak Clusters near Jaranwala': 'جڑانوالہ کے قریب چک کلسٹر',
//     'Tandlianwala North - Mixed Pockets': 'تاندلیانوالہ شمالی - مخلوط علاقے',
//     'Central Faisalabad Command Area': 'وسطی فیصل آباد کمانڈ علاقہ',
//     'Peri-urban Vegetable Belt (near city)': 'شہری مضافاتی سبزی پٹی (شہر کے قریب)',
//     // Multan Areas
//     'Shujabad Tehsil - Canal Belt': 'شجاع آباد تحصیل - نہری پٹی',
//     'Jalalpur Pirwala Tehsil - Irrigated Plains': 'جلالپور پیروالہ تحصیل - سیراب میدان',
//     'Multan South Rural Belt': 'ملتان جنوبی دیہی پٹی',
//     'Vehari Side - Tubewell Area': 'وہاڑی سائیڈ - ٹیوب ویل علاقہ',
//     'Shah Rukn-e-Alam Periphery - Mixed': 'شاہ رکن عالم مضافات - مخلوط',
//     'Musa Pak / Jalalpur Fringe - Canal': 'موسٰی پاک / جلالپور کنارے - نہری',
//     'Multan North Rural Belt': 'ملتان شمالی دیہی پٹی',
//     'Multan East Peri-urban Tubewell Farms': 'ملتان مشرقی شہری مضافاتی ٹیوب ویل فارم',
//     'Basti Malook / Rural Fringe - Mixed': 'بستی ملوک / دیہی کنارے - مخلوط',
//     'Jahanian / Local Command Belt': 'جہانیاں / لوکل کمانڈ پٹی',
//     'Central Multan Command Area': 'وسطی ملتان کمانڈ علاقہ',
//     'Shujabad South - Tubewell Pockets': 'شجاع آباد جنوبی - ٹیوب ویل علاقے',
//     'Multan West Rural Plain': 'ملتان مغربی دیہی میدان',
//     'Dunya Pur / Rural Belt': 'دنیا پور / دیہی پٹی',
//     'Multan Peri-urban Mixed Farms': 'ملتان شہری مضافاتی مخلوط فارم',
//     'Bosan Road Agricultural Fringe': 'بوسن روڈ زرعی کنارے',
//     'Multan West Periphery - Canal Command': 'ملتان مغربی مضافات - نہری نظام',
//     // Gujrat Areas
//     'Gujrat Tehsil - Canal Plains': 'گجرات تحصیل - نہری میدان',
//     'Kharian Tehsil - Mixed Irrigation': 'کھاریاں تحصیل - مخلوط آبپاشی',
//     'Kunjah - Canal Irrigated Area': 'کنجہ - نہری سیراب علاقہ',
//     'Jalalpur Jattan - Tubewell Pockets': 'جلالپور جٹاں - ٹیوب ویل علاقے',
//     'Lalamusa - Mixed': 'لالہ موسیٰ - مخلوط',
//     'Sarai Alamgir - Canal Belt': 'سرائے عالمگیر - نہری پٹی',
//     'Dinga / Rural Belt': 'ڈنگہ / دیہی پٹی',
//     'Gujrat Peri-urban Tubewell Farms': 'گجرات شہری مضافاتی ٹیوب ویل فارم',
//     'Khari / Upper Plain - Canal': 'کھڑی / بالائی میدان - نہری',
//     'Gujrat South Agricultural Belt': 'گجرات جنوبی زرعی پٹی',
//     'Gujrat North Hills Fringe - Barani': 'گجرات شمالی پہاڑی کنارے - بارانی',
//     'Kharian Plains - Tubewell Pockets': 'کھاریاں میدان - ٹیوب ویل علاقے',
//     'Sandal Bar Fringe - Mixed': 'ساندل بار کنارے - مخلوط',
//     'Tehsil Smallholder Belt - Gujrat': 'تحصیل چھوٹے کسان پٹی - گجرات',
//     'Lalamusa Peri-urban Farming Area': 'لالہ موسیٰ شہری مضافاتی کاشتکاری علاقہ',
//     'Kunjah South - Canal Command': 'کنجہ جنوبی - نہری نظام',
//     // Sialkot Areas
//     'Daska Tehsil - Canal Plains': 'ڈسکہ تحصیل - نہری میدان',
//     'Daska South - Canal Command': 'ڈسکہ جنوبی - نہری نظام',
//     'Pasrur Tehsil - Irrigated Fields': 'پسرور تحصیل - سیراب کھیت',
//     'Pasrur East - Mixed Pockets': 'پسرور مشرقی - مخلوط علاقے',
//     'Sambrial - Mixed Irrigation': 'سمبڑیال - مخلوط آبپاشی',
//     'Sambrial North - Peri-urban Farms': 'سمبڑیال شمالی - شہری مضافاتی فارم',
//     'Sialkot Rural Belt - North': 'سیالکوٹ دیہی پٹی - شمالی',
//     'Sialkot West Rural Belt': 'سیالکوٹ مغربی دیہی پٹی',
//     'Sialkot Peri-urban Tubewell Farms': 'سیالکوٹ شہری مضافاتی ٹیوب ویل فارم',
//     'Head Marala / Riverine Fringe - Mixed': 'ہیڈ مرالہ / دریائی کنارے - مخلوط',
//     'Sialkot Central Outskirts - Mixed': 'سیالکوٹ وسطی مضافات - مخلوط',
//     'Sialkot Eastern Plains - Nehri': 'سیالکوٹ مشرقی میدان - نہری',
//     'Sialkot Agricultural Belt - South': 'سیالکوٹ زرعی پٹی - جنوبی',
//     'Nurkot / Rural Cluster - Mixed': 'نورکوٹ / دیہی کلسٹر - مخلوط',
//     'Industrial Fringe Peri-urban Farms': 'صنعتی کنارے شہری مضافاتی فارم',
//     'Smallholder Cluster - Sialkot Rural': 'چھوٹے کسان کلسٹر - سیالکوٹ دیہی'
//   };
  
//   // ✅ Helper function to get translated zone
//   const getZoneName = (zone) => {
//     if (!zone) return getText('Select area first', 'پہلے علاقہ منتخب کریں');
//     if (zoneMap[zone]) return zoneMap[zone];
//     const zoneLower = zone.toLowerCase();
//     if (zoneLower.includes('nehri') || zoneLower.includes('canal')) return 'نہری علاقہ';
//     if (zoneLower.includes('tubewell') || zoneLower.includes('tube well')) return 'ٹیوب ویل علاقہ';
//     if (zoneLower.includes('barani') || zoneLower.includes('rainfed')) return 'بارانی علاقہ';
//     return zone;
//   };
  
//   // ✅ Seasons with dates
//   const seasonsWithDates = [
//     { name: 'Rabi', labelEn: 'Rabi (Oct 15 - Apr 15)', labelUr: 'ربیع (15 اکتوبر - 15 اپریل)', from: 'Oct 15', to: 'Apr 15' },
//     { name: 'Kharif', labelEn: 'Kharif (Apr 16 - Oct 14)', labelUr: 'خریف (16 اپریل - 14 اکتوبر)', from: 'Apr 16', to: 'Oct 14' }
//   ];
  
//   const city_soil = {
//     "RAWALPINDI": ["CLAY LOAM", "SILT LOAM"],
//     "FAISALABAD": ["SANDY LOAM", "CLAY"],
//     "LAHORE": ["LOAM", "CLAY LOAM"],
//     "MULTAN": ["SANDY CLAY", "LOAM"],
//     "GUJRAT": ["LOAM", "SILT"],
//     "SIALKOT": ["CLAY LOAM", "SANDY LOAM"]
//   };

//   useEffect(() => {
//     loadFarmerId();
//   }, []);

//   useEffect(() => {
//     if (selectedCity) {
//       loadAreasForCity(selectedCity);
//       setAvailableSoilTypes(city_soil[selectedCity.toUpperCase()] || []);
//     } else {
//       setSelectedArea('');
//       setSelectedZone('');
//       setSelectedSoilType('');
//       setSelectedSeason('');
//       setAreasData([]);
//       setAvailableSoilTypes([]);
//       setAreaCenterInfo(null);
//       setManualCoordinates({ lat: '', lng: '' });
//       setNearbyLands([]);
//     }
//   }, [selectedCity]);

//   useEffect(() => {
//     if (selectedArea) {
//       const selectedAreaData = areasData.find(area => area.area_name === selectedArea);
//       if (selectedAreaData) {
//         setSelectedZone(selectedAreaData.description);
//       }
//       loadAreaCenterPoint(selectedArea);
//     } else {
//       setSelectedZone('');
//       setAreaCenterInfo(null);
//     }
//   }, [selectedArea, areasData]);

//   const loadAreasForCity = async (cityName) => {
//     setLoadingAreas(true);
//     try {
//       const response = await farmerAPI.getAreasByCity(cityName);
//       if (response.areas) {
//         setAreasData(response.areas);
//       }
//     } catch (error) {
//       console.error('Error loading areas:', error);
//       Alert.alert('Error', 'Failed to load areas');
//     } finally {
//       setLoadingAreas(false);
//     }
//   };

//   const loadAreaCenterPoint = async (areaName) => {
//     try {
//       const response = await farmerAPI.getAreaCenter(areaName);
//       if (response.success) {
//         setAreaCenterInfo(response);
//         if (response.center_latitude && response.center_longitude && !manualCoordinates.lat) {
//           setManualCoordinates({
//             lat: response.center_latitude.toString(),
//             lng: response.center_longitude.toString()
//           });
//         }
//       } else {
//         setAreaCenterInfo(null);
//       }
//     } catch (error) {
//       console.error('Error loading area center:', error);
//       setAreaCenterInfo(null);
//     }
//   };

//   // ✅ UPDATED: GET NEARBY LANDS WITH CROP FILTER
//   const getNearbyLands = async () => {
//     if (!selectedArea) {
//       Alert.alert('Error', 'Please select an area first');
//       return;
//     }
    
//     const radius = parseFloat(searchRadius);
//     if (isNaN(radius) || radius <= 0) {
//       Alert.alert('Error', 'Please enter a valid radius (e.g., 5, 6.5, 7, 10, 12.3)');
//       return;
//     }
    
//     setLoadingNearby(true);
//     try {
//       // ✅ PASS CROP FILTER TO BACKEND - 'All' means no filter
//       const cropFilterValue = selectedCropFilter === 'All' ? null : selectedCropFilter;
      
//       const response = await farmerAPI.getNearbyLandsByArea(
//         selectedArea, 
//         radius,
//         null,  // excludeLandId
//         cropFilterValue  // crop filter
//       );
      
//       if (response.success) {
//         setNearbyLands(response.nearby_lands || []);
//         setShowNearbyMap(true);
//       } else {
//         Alert.alert('Info', response.message || 'No nearby lands found');
//       }
//     } catch (error) {
//       console.error('Error getting nearby lands:', error);
//       Alert.alert('Error', 'Failed to get nearby lands');
//     } finally {
//       setLoadingNearby(false);
//     }
//   };

//   // ✅ GET FILTERED NEARBY LANDS BY ZONE (frontend filtering)
//   // ✅ REPLACE getFilteredNearbyLands function with this COMPLETE VERSION:

// const getFilteredNearbyLands = () => {
//   let filtered = [...nearbyLands];
  
//   console.log('📊 FILTERING - Total lands:', filtered.length);
//   console.log('📊 Selected Crop:', selectedCropFilter);
//   console.log('📊 Selected Zone:', selectedZoneFilter);
  
//   // 1️⃣ ZONE FILTER
//   if (selectedZoneFilter !== 'All') {
//     filtered = filtered.filter(land => {
//       const landZoneType = land.zone_type || '';
      
//       if (selectedZoneFilter === 'Zone A') {
//         return landZoneType.includes('Zone A') || 
//                landZoneType.includes('Nehri') || 
//                landZoneType.includes('Canal');
//       } else if (selectedZoneFilter === 'Zone B') {
//         return landZoneType.includes('Zone B') || 
//                landZoneType.includes('Tubewell') || 
//                landZoneType.includes('Tube');
//       } else if (selectedZoneFilter === 'Zone C') {
//         return landZoneType.includes('Zone C') || 
//                landZoneType.includes('Barani') || 
//                landZoneType.includes('Rainfed');
//       }
//       return true;
//     });
//     console.log('📊 After Zone filter:', filtered.length);
//   }
  
//   // 2️⃣ CROP FILTER - FIXED
//   if (selectedCropFilter !== 'All') {
//     const cropNameLower = selectedCropFilter.toLowerCase();
    
//     filtered = filtered.filter(land => {
//       // Check latest_crop (single crop)
//       const latestCrop = (land.latest_crop || '').toLowerCase();
      
//       // Check all_crops (comma-separated string from GROUP_CONCAT)
//       const allCrops = (land.all_crops || '').toLowerCase();
      
//       // Split comma-separated crops and check if any matches
//       const cropsArray = allCrops.split(',').map(c => c.trim()).filter(c => c);
//       const hasCropInAll = cropsArray.includes(cropNameLower);
      
//       const matches = latestCrop === cropNameLower || hasCropInAll;
      
//       if (matches) {
//         console.log('✅ Land matches crop:', land.farmer_name, '- Latest:', land.latest_crop, '- All:', land.all_crops);
//       } else {
//         console.log('❌ Land does NOT match crop:', land.farmer_name, '- Latest:', land.latest_crop, '- All:', land.all_crops);
//       }
      
//       return matches;
//     });
//     console.log('📊 After Crop filter:', filtered.length);
//   }
  
//   return filtered;
// };

//   const getLandCrops = async (land) => {
//     const landId = land.land_id;
//     const farmerName = land.farmer_name;
    
//     setShowNearbyMap(false);
//     setLoadingLandCrops(true);
    
//     try {
//       const response = await farmerAPI.getLandSeasonCrops(landId, '');
      
//       if (response.success) {
//         // Filter crops if a crop filter is selected
//         let filteredCrops = response.crops;
//         if (selectedCropFilter !== 'All') {
//           const cropNameLower = selectedCropFilter.toLowerCase();
//           filteredCrops = response.crops.filter(crop => 
//             (crop.crop_name || '').toLowerCase() === cropNameLower
//           );
//           console.log(' Filtered crops for', selectedCropFilter, ':', filteredCrops.length, 'out of', response.crops.length);
//         }
        
//         setSelectedLandData({
//           landInfo: response.land_info,
//           crops: filteredCrops,
//           seasonSummary: response.season_summary,
//           farmerName: farmerName,
//           requestedSeason: 'All Seasons',
//           totalCrops: filteredCrops.length,
//           selectedCropFilter: selectedCropFilter  // Store selected crop filter
//         });
//         setShowLandCropsModal(true);
//       } else {
//         Alert.alert('Info', response.message || 'No crops found for this land');
//       }
//     } catch (error) {
//       console.error('Error loading land crops:', error);
//       Alert.alert('Error', 'Failed to load land crops data');
//     } finally {
//       setLoadingLandCrops(false);
//     }
//   };

//   const openGoogleMaps = () => {
//     const lat = manualCoordinates.lat || areaCenterInfo?.center_latitude;
//     const lng = manualCoordinates.lng || areaCenterInfo?.center_longitude;
    
//     if (!lat || !lng) {
//       Alert.alert('Error', 'No coordinates available');
//       return;
//     }
    
//     const url = `https://www.google.com/maps?q=${lat},${lng}`;
//     Linking.openURL(url).catch(err => {
//       Alert.alert('Error', 'Could not open Google Maps');
//     });
//   };

//   const loadFarmerId = async () => {
//     try {
//       const savedFarmerId = await AsyncStorage.getItem('farmerId');
//       if (savedFarmerId) {
//         setFarmerId(parseInt(savedFarmerId));
//       }
//     } catch (error) {
//       console.error('Error loading farmer ID:', error);
//     }
//   };

//   const handleCitySelect = (city) => {
//     setSelectedCity(city);
//     setSelectedArea('');
//     setSelectedZone('');
//     setSelectedSoilType('');
//     setSelectedSeason('');
//     setAreaSearch('');
//     setShowCityDropdown(false);
//     setAreaCenterInfo(null);
//     setManualCoordinates({ lat: '', lng: '' });
//     setNearbyLands([]);
//   };

//   const handleAreaSelect = (area) => {
//     setSelectedArea(area);
//     setShowAreaDropdown(false);
//     setAreaSearch('');
//     setNearbyLands([]);
//   };

//   const handleSeasonSelect = (season) => {
//     setSelectedSeason(season);
//     setShowSeasonDropdown(false);
//   };

//   const handleAddLand = () => {
//     if (!selectedCity || !selectedArea || !selectedZone || !areaSize || !selectedAreaUnit || !selectedSoilType) {
//       Alert.alert('Error', 'Please fill all land details');
//       return;
//     }

//     const lat = manualCoordinates.lat ? parseFloat(manualCoordinates.lat) : 
//                 (areaCenterInfo?.center_latitude || null);
//     const lng = manualCoordinates.lng ? parseFloat(manualCoordinates.lng) : 
//                 (areaCenterInfo?.center_longitude || null);

//     const newLand = {
//       id: Date.now().toString(),
//       city: selectedCity,
//       area: selectedArea,
//       zone: selectedZone,
//       areaSize: parseFloat(areaSize),
//       areaUnit: selectedAreaUnit,
//       soilType: selectedSoilType,
//       season: selectedSeason,
//       latitude: lat,
//       longitude: lng,
//     };

//     setLands([...lands, newLand]);
    
//     setSelectedCity('');
//     setSelectedArea('');
//     setSelectedZone('');
//     setAreaSize('');
//     setSelectedAreaUnit('');
//     setSelectedSoilType('');
//     setSelectedSeason('');
//     setAreaCenterInfo(null);
//     setManualCoordinates({ lat: '', lng: '' });
//     setNearbyLands([]);
    
//     Alert.alert('Success', 'Land added to list!');
//   };

//   const handleEditLand = (id) => {
//     const landToEdit = lands.find(land => land.id === id);
//     if (landToEdit) {
//       setSelectedCity(landToEdit.city);
//       setSelectedArea(landToEdit.area);
//       setSelectedZone(landToEdit.zone);
//       setAreaSize(landToEdit.areaSize.toString());
//       setSelectedAreaUnit(landToEdit.areaUnit);
//       setSelectedSoilType(landToEdit.soilType);
//       setSelectedSeason(landToEdit.season || '');
      
//       if (landToEdit.latitude && landToEdit.longitude) {
//         setManualCoordinates({
//           lat: landToEdit.latitude.toString(),
//           lng: landToEdit.longitude.toString()
//         });
//       }
      
//       handleDeleteLand(id);
//     }
//   };

//   const handleDeleteLand = (id) => {
//     setLands(lands.filter(land => land.id !== id));
//   };

//   const handleSaveLands = async () => {
//     if (lands.length === 0) {
//       Alert.alert('Error', 'Please add at least one land');
//       return;
//     }

//     if (!farmerId) {
//       Alert.alert('Error', 'Farmer ID not found');
//       return;
//     }

//     setSaving(true);
//     try {
//       const landsData = {
//         farmer_id: farmerId,
//         lands: lands.map(land => ({
//           city: land.city,
//           area: land.area,
//           zone: land.zone,
//           areaSize: land.areaSize,
//           areaUnit: land.areaUnit,
//           soilType: land.soilType,
//           season: land.season,
//           latitude: land.latitude,
//           longitude: land.longitude,
//         }))
//       };

//       const response = await farmerAPI.addLandDetails(landsData);
      
//       if (response.success) {
//         if (route.params?.onLandsAdded) {
//           route.params.onLandsAdded();
//         }
        
//         Alert.alert('Success', 'Lands saved successfully!');
//         navigation.goBack();
        
//       } else {
//         Alert.alert('Error', response.message || 'Failed to save lands');
//       }
      
//     } catch (error) {
//       console.error('Error saving lands:', error);
//       Alert.alert('Error', error.message || 'Failed to save lands');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ LAND CROPS MODAL
//   const LandCropsModal = () => {
//     if (!selectedLandData) return null;
    
//     const { landInfo, crops, seasonSummary, farmerName, requestedSeason, totalCrops, selectedCropFilter } = selectedLandData;
    
//     return (
//       <Modal visible={showLandCropsModal} transparent animationType="slide">
//         <View style={styles.fullModalContainer}>
//           <View style={[styles.landCropsModalContent, { height: height * 0.8 }]}>
//             <View style={styles.modalHeader}>
//               <View>
//                 <Text style={styles.modalTitle}>{farmerName}{getText("'s Land", ' کی زمین')}</Text>
//                 {selectedCropFilter && selectedCropFilter !== 'All' && (
//                   <Text style={styles.cropFilterBadge}>
//                     🌾 {cropFilterOptions.find(opt => opt.id === selectedCropFilter)?.labelUr || selectedCropFilter}
//                   </Text>
//                 )}
//               </View>
//               <TouchableOpacity onPress={() => {
//                 setShowLandCropsModal(false);
//                 setSelectedLandData(null);
//                 setSelectedCropSeasonFilter('All');
//               }}>
//                 <Icon name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>
            
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>{getText('Season Filter', 'موسم فلٹر')}</Text>
//               <TouchableOpacity 
//                 style={styles.dropdownButton}
//                 onPress={() => setShowCropSeasonDropdown(true)}
//               >
//                 <Text style={styles.dropdownText}>
//                   {cropSeasonFilterOptions.find(opt => opt.id === selectedCropSeasonFilter)?.labelUr || 'تمام موسم'}
//                 </Text>
//                 <Icon name="arrow-drop-down" size={20} color="#666" />
//               </TouchableOpacity>
//             </View>
            
//             <ScrollView style={styles.landCropsScrollView}>
//               <View style={styles.landInfoSection}>
//                 <Text style={styles.sectionSubtitle}>{getText('Land Details', 'زمین کی تفصیلات')}</Text>
//                 <View style={styles.infoRow}>
//                   <Icon name="place" size={14} color="#666" />
//                   <Text style={styles.infoText}>
//                     {areaMap[landInfo.area] || landInfo.area}, {cityMap[landInfo.city] || landInfo.city} • {getZoneName(landInfo.zone)}
//                   </Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <Icon name="square-foot" size={14} color="#666" />
//                   <Text style={styles.infoText}>
//                     {landInfo.area_size} {unitMap[landInfo.area_unit] || landInfo.area_unit} • {soilMap[landInfo.soil_type] || landInfo.soil_type}
//                   </Text>
//                 </View>
//                 {landInfo.farmer_phone && (
//                   <View style={styles.infoRow}>
//                     <Icon name="phone" size={14} color="#666" />
//                     <Text style={styles.infoText}>{landInfo.farmer_phone}</Text>
//                   </View>
//                 )}
//               </View>
              
//               <View style={styles.seasonSummarySection}>
//                 <Text style={styles.sectionSubtitle}>{getText('Season Summary', 'موسم کا خلاصہ')}</Text>
//                 <View style={styles.seasonBadges}>
//                   {seasonSummary.map((season, index) => (
//                     <View key={index} style={styles.seasonBadge}>
//                       <Text style={styles.seasonBadgeText}>
//                         {season.season === 'Rabi' ? getText('Rabi', 'ربیع') : getText('Kharif', 'خریف')}: {season.crop_count} {getText('crops', 'فصلیں')}
//                       </Text>
//                     </View>
//                   ))}
//                 </View>
//                 <Text style={styles.selectedSeasonText}>
//                   {getText('Currently Viewing', 'فی الحال دیکھ رہے ہیں')}: <Text style={styles.seasonHighlight}>{requestedSeason === 'All Seasons' ? getText('All Seasons', 'تمام موسم') : requestedSeason}</Text>
//                 </Text>
//               </View>
              
//               <View style={styles.cropsSection}>
//                 <View style={styles.sectionHeader}>
//                   <Text style={styles.sectionSubtitle}>
//                     {getText('Crops', 'فصلیں')} ({selectedCropSeasonFilter === 'All' ? totalCrops : crops.filter(c => c.season === selectedCropSeasonFilter).length})
//                   </Text>
//                 </View>
                
//                 {loadingLandCrops ? (
//                   <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color="#4CAF50" />
//                     <Text style={styles.loadingText}>{getText('Loading crops...', 'فصلیں لوڈ ہو رہی ہیں...')}</Text>
//                   </View>
//                 ) : crops.length > 0 ? (
//                   crops
//                     .filter(crop => selectedCropSeasonFilter === 'All' || crop.season === selectedCropSeasonFilter)
//                     .map((crop, index) => (
//                     <View key={index} style={styles.cropCard}>
//                       <View style={styles.cropHeader}>
//                         <Text style={styles.cropName}>{crop.crop_name}</Text>
//                         <View style={[
//                           styles.seasonTag,
//                           { backgroundColor: crop.season === 'Rabi' ? '#4CAF50' : '#FF9800' }
//                         ]}>
//                           <Text style={styles.seasonTagText}>{crop.season === 'Rabi' ? getText('Rabi', 'ربیع') : getText('Kharif', 'خریف')}</Text>
//                         </View>
//                       </View>
                      
//                       <View style={styles.cropDetails}>
//                         <View style={styles.cropDetailRow}>
//                           <Icon name="calendar-today" size={12} color="#666" />
//                           <Text style={styles.cropDetailText}>
//                             {getText('Sowing', 'بوائی')}: {crop.sowing_date} • {getText('Harvest', 'کٹائی')}: {crop.harvest_date}
//                           </Text>
//                         </View>
                        
//                         {crop.yield_per_40kg && (
//                           <View style={styles.cropDetailRow}>
//                             <Icon name="trending-up" size={12} color="#666" />
//                             <Text style={styles.cropDetailText}>
//                               {getText('Yield', 'پیداوار')}: {crop.yield_per_40kg} {getText('per 40kg', 'فی 40 کلو')}
//                             </Text>
//                           </View>
//                         )}
                        
//                         {crop.fertilizer_used && (
//                           <View style={styles.cropDetailRow}>
//                             <Icon name="grass" size={12} color="#666" />
//                             <Text style={styles.cropDetailText}>
//                               {getText('Fertilizer', 'کھاد')}: {crop.fertilizer_used}
//                             </Text>
//                           </View>
//                         )}
//                       </View>
                      
//                       {crop.activities && crop.activities.length > 0 && (
//                         <View style={styles.activitiesSection}>
//                           <Text style={styles.activitiesTitle}>
//                             {getText('Activities', 'سرگرمیاں')} ({crop.total_activities})
//                           </Text>
//                           {crop.activities.slice(0, 3).map((activity, idx) => (
//                             <View key={idx} style={styles.activityItem}>
//                               <View style={styles.activityHeader}>
//                                 <Text style={styles.activityType}>{activity.activity_type}</Text>
//                                 <Text style={styles.activityDate}>{activity.activity_date}</Text>
//                               </View>
//                               <Text style={styles.activityDesc}>{activity.description}</Text>
//                               {activity.chemical_or_fertilizer_used && (
//                                 <Text style={styles.activityChemical}>
//                                   {getText('Used', 'استعمال')}: {activity.chemical_or_fertilizer_used}
//                                 </Text>
//                               )}
//                             </View>
//                           ))}
//                           {crop.total_activities > 3 && (
//                             <Text style={styles.viewMoreText}>
//                               + {crop.total_activities - 3} {getText('more activities', 'مزید سرگرمیاں')}
//                             </Text>
//                           )}
//                         </View>
//                       )}
//                     </View>
//                   ))
//                 ) : (
//                   <View style={styles.emptyContainer}>
//                     <Icon name="grass" size={40} color="#ccc" />
//                     <Text style={styles.emptyText}>
//                       {getText('No crops found', 'کوئی فصل نہیں ملی')}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </ScrollView>
            
//             <View style={styles.modalActions}>
//               <TouchableOpacity 
//                 style={styles.closeModalButton}
//                 onPress={() => {
//                   setShowLandCropsModal(false);
//                   setSelectedLandData(null);
//                 }}
//               >
//                 <Text style={styles.closeModalButtonText}>{getText('Close', 'بند کریں')}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
//   };

//   // ✅ NEARBY MAP MODAL - WITH CROP FILTER DROPDOWN
//   const NearbyMapModal = () => {
//     const filteredLands = getFilteredNearbyLands();
//     const selectedCropLabel = cropFilterOptions.find(opt => opt.id === selectedCropFilter)?.labelUr || 'تمام فصلیں';
    
//     return (
//       <Modal visible={showNearbyMap} transparent animationType="slide">
//         <View style={styles.fullModalContainer}>
//           <View style={[styles.mapModalContent, { height: height * 0.85 }]}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>{getText('Nearby Lands in', 'قریبی زمینیں')} {areaMap[selectedArea] || selectedArea}</Text>
//               <TouchableOpacity onPress={() => {
//                 setShowNearbyMap(false);
//                 setSelectedZoneFilter('All');
//                 setSelectedCropFilter('All');
//               }}>
//                 <Icon name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>
            
//             <Text style={styles.mapSubtitle}>
//               📍 {areaMap[selectedArea] || selectedArea} - {searchRadius}{getText('km', 'کلومیٹر')} {getText('Radius', 'دائرہ')} | {filteredLands.length} {getText('Lands Found', 'زمینیں ملیں')}
//               {selectedCropFilter !== 'All' && ` | ${getText('Filter', 'فلٹر')}: ${selectedCropLabel}`}
//             </Text>
            
//             {/* ✅ DYNAMIC RADIUS INPUT */}
//             <View style={styles.radiusInputContainer}>
//               <View style={styles.radiusInputRow}>
//                 <Icon name="radar" size={20} color="#4CAF50" />
//                 <Text style={styles.radiusLabel}>{getText('Search Radius', 'تلاش کا دائرہ')}:</Text>
//                 <TextInput
//                   style={styles.radiusInput}
//                   value={searchRadius}
//                   onChangeText={setSearchRadius}
//                   keyboardType="numeric"
//                   placeholder={getText('Enter any radius (km)', 'دائرہ درج کریں (کلومیٹر)')}
//                   placeholderTextColor="#999"
//                 />
//                 <Text style={styles.radiusUnit}>{getText('km', 'کلومیٹر')}</Text>
//                 <TouchableOpacity 
//                   style={styles.applyRadiusButton}
//                   onPress={getNearbyLands}
//                   disabled={loadingNearby}
//                 >
//                   <Text style={styles.applyRadiusText}>{getText('Apply', 'لگائیں')}</Text>
//                 </TouchableOpacity>
//               </View>
//               <Text style={styles.radiusHint}>
//                 💡 {getText('You can use any number - 3, 5, 6.5, 7, 10, 12.3, 15, 20 km', 'آپ کوئی بھی نمبر استعمال کر سکتے ہیں - 3, 5, 6.5, 7, 10, 12.3, 15, 20 کلومیٹر')}
//               </Text>
//             </View>
            
//             {/* ✅ ZONE FILTER DROPDOWN */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>{getText('Zone Filter', 'زون فلٹر')}</Text>
//               <TouchableOpacity 
//                 style={styles.dropdownButton}
//                 onPress={() => setShowZoneFilterDropdown(true)}
//               >
//                 <Text style={styles.dropdownText}>
//                   {zoneFilterOptions.find(opt => opt.id === selectedZoneFilter)?.labelUr || 'تمام زونز'}
//                 </Text>
//                 <Icon name="arrow-drop-down" size={20} color="#666" />
//               </TouchableOpacity>
//             </View>
            
//             {/* ✅ CROP FILTER DROPDOWN - MAIN NEW FEATURE */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>{getText('Crop Filter', 'فصل فلٹر')}</Text>
//               <TouchableOpacity 
//                 style={styles.dropdownButton}
//                 onPress={() => setShowCropFilterDropdown(true)}
//               >
//                 <Text style={styles.dropdownText}>
//                   {selectedCropLabel}
//                 </Text>
//                 <Icon name="arrow-drop-down" size={20} color="#666" />
//               </TouchableOpacity>
//             </View>
            
//             {loadingNearby ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#4CAF50" />
//                 <Text style={styles.loadingText}>{getText('Loading nearby lands...', 'قریبی زمینیں لوڈ ہو رہی ہیں...')}</Text>
//               </View>
//             ) : (
//               <View style={styles.simpleListContainer}>
//                 <FlatList
//                   data={filteredLands}
//                   keyExtractor={(item, index) => `${item.land_id}_${index}`}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity 
//                       style={styles.landCard}
//                       onPress={() => getLandCrops(item)}
//                       activeOpacity={0.7}
//                     >
//                       <View style={styles.landCardHeader}>
//                         <Text style={styles.landCardName}>{item.farmer_name}</Text>
//                         <TouchableOpacity 
//                           style={styles.distanceBadge}
//                           onPress={(e) => {
//                             e.stopPropagation();
//                             Alert.alert('Farmer Activities', 'Farmer activities feature coming soon!');
//                           }}
//                         >
//                           <Icon name="location-on" size={12} color="white" />
//                           <Text style={styles.distanceText}>{item.distance_km} {getText('km', 'کلومیٹر')}</Text>
//                         </TouchableOpacity>
//                       </View>
                      
//                       <View className={styles.landDetails}>
//                         <View style={styles.detailRow}>
//                           <Icon name="place" size={14} color="#666" />
//                           <Text style={styles.detailText}>{areaMap[item.area_name] || item.area_name}, {cityMap[item.city_name] || item.city_name}</Text>
//                         </View>
                        
//                         <View style={styles.detailRow}>
//                           <Icon name="square-foot" size={14} color="#666" />
//                           <Text style={styles.detailText}>{item.area_size} {unitMap[item.area_unit] || item.area_unit}</Text>
//                         </View>
                        
//                         <View style={styles.detailRow}>
//                           <Icon name="grass" size={14} color="#666" />
//                           <Text style={styles.detailText}>{soilMap[item.soil_type] || item.soil_type}</Text>
//                         </View>
                        
//                         {item.latest_crop && (
//                           <View style={styles.detailRow}>
//                             <Icon name="agriculture" size={14} color="#4CAF50" />
//                             <Text style={[styles.detailText, { color: '#4CAF50', fontWeight: 'bold' }]}>
//                               🌾 {item.latest_crop}
//                             </Text>
//                           </View>
//                         )}
                        
//                         {item.farmer_phone && (
//                           <View style={styles.detailRow}>
//                             <Icon name="phone" size={14} color="#666" />
//                             <Text style={styles.detailText}>{item.farmer_phone}</Text>
//                           </View>
//                         )}
//                       </View>
//                     </TouchableOpacity>
//                   )}
//                   ListEmptyComponent={
//                     <View style={styles.emptyContainer}>
//                       <Icon name="landscape" size={50} color="#ccc" />
//                       <Text style={styles.emptyText}>
//                         {selectedCropFilter !== 'All' 
//                           ? `${getText('No lands found with', 'کوئی زمین نہیں ملی جس میں')} ${selectedCropLabel} ${getText('crop', 'فصل لگی ہو')}`
//                           : getText('No nearby lands found', 'کوئی قریبی زمین نہیں ملی')}
//                       </Text>
//                     </View>
//                   }
//                 />
//               </View>
//             )}
            
//             <View style={styles.mapActions}>
//               <TouchableOpacity 
//                 style={styles.viewInMapsButton}
//                 onPress={openGoogleMaps}
//               >
//                 <Icon name="map" size={18} color="white" />
//                 <Text style={styles.viewInMapsButtonText}>{getText('View in Google Maps', 'گوگل میپس میں دیکھیں')}</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={styles.closeMapButton}
//                 onPress={() => setShowNearbyMap(false)}
//               >
//                 <Text style={styles.closeMapButtonText}>{getText('Close', 'بند کریں')}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
//   };

//   // Coordinates Modal
//   const CoordinatesModal = () => (
//     <Modal visible={showCoordinatesModal} transparent animationType="slide">
//       <View style={styles.fullModalContainer}>
//         <View style={[styles.coordinatesModalContent, { height: height * 0.5 }]}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>{getText('Set Coordinates', 'کوآرڈینیٹس سیٹ کریں')}</Text>
//             <TouchableOpacity onPress={() => setShowCoordinatesModal(false)}>
//               <Icon name="close" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>
          
//           <ScrollView style={styles.coordinatesScrollView}>
//             <Text style={styles.coordinatesNote}>
//               {getText('Enter latitude and longitude for your land location', 'اپنی زمین کے لیے عرض البلد اور طول البلد درج کریں')}
//             </Text>
            
//             <View style={styles.coordinateInputGroup}>
//               <Text style={styles.coordinateLabel}>{getText('Latitude', 'عرض البلد')}</Text>
//               <TextInput
//                 style={styles.coordinateInput}
//                 placeholder="e.g., 33.200000"
//                 value={manualCoordinates.lat}
//                 onChangeText={(text) => setManualCoordinates(prev => ({ ...prev, lat: text }))}
//                 keyboardType="numeric"
//                 placeholderTextColor="#999"
//               />
//             </View>
            
//             <View style={styles.coordinateInputGroup}>
//               <Text style={styles.coordinateLabel}>{getText('Longitude', 'طول البلد')}</Text>
//               <TextInput
//                 style={styles.coordinateInput}
//                 placeholder="e.g., 73.140000"
//                 value={manualCoordinates.lng}
//                 onChangeText={(text) => setManualCoordinates(prev => ({ ...prev, lng: text }))}
//                 keyboardType="numeric"
//                 placeholderTextColor="#999"
//               />
//             </View>
            
//             {areaCenterInfo?.success && (
//               <TouchableOpacity 
//                 style={styles.autoFillButton}
//                 onPress={() => {
//                   if (areaCenterInfo.center_latitude && areaCenterInfo.center_longitude) {
//                     setManualCoordinates({
//                       lat: areaCenterInfo.center_latitude.toString(),
//                       lng: areaCenterInfo.center_longitude.toString()
//                     });
//                     Alert.alert('Success', 'Coordinates set from area center');
//                   }
//                 }}
//               >
//                 <Icon name="location-on" size={18} color="white" />
//                 <Text style={styles.autoFillButtonText}>{getText('Use Area Center Coordinates', 'علاقے کے مرکزی کوآرڈینیٹس استعمال کریں')}</Text>
//               </TouchableOpacity>
//             )}
            
//             <View style={styles.currentCoordinates}>
//               <Text style={styles.currentCoordinatesTitle}>{getText('Current Coordinates', 'موجودہ کوآرڈینیٹس')}:</Text>
//               <Text style={styles.currentCoordinatesValue}>
//                 {manualCoordinates.lat && manualCoordinates.lng 
//                   ? `${manualCoordinates.lat}, ${manualCoordinates.lng}`
//                   : getText('Not set', 'سیٹ نہیں')}
//               </Text>
//             </View>
//           </ScrollView>
          
//           <View style={styles.coordinatesModalActions}>
//             <TouchableOpacity 
//               style={styles.cancelCoordinatesButton}
//               onPress={() => setShowCoordinatesModal(false)}
//             >
//               <Text style={styles.cancelCoordinatesButtonText}>{getText('Cancel', 'منسوخ')}</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.saveCoordinatesButton}
//               onPress={() => {
//                 if (manualCoordinates.lat && manualCoordinates.lng) {
//                   setShowCoordinatesModal(false);
//                   Alert.alert('Success', 'Coordinates saved!');
//                 } else {
//                   Alert.alert('Error', 'Please enter both latitude and longitude');
//                 }
//               }}
//             >
//               <Icon name="check" size={18} color="white" />
//               <Text style={styles.saveCoordinatesButtonText}>{getText('Save', 'محفوظ کریں')}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );

//   // Area Dropdown Modal
//   const AreaDropdownModal = () => {
//     const filteredAreas = areasData.filter(area => 
//       !areaSearch || area.area_name.toLowerCase().includes(areaSearch.toLowerCase())
//     );
    
//     return (
//       <Modal visible={showAreaDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowAreaDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={[styles.dropdownMenu, { height: height * 0.6 }]}>
//               <Text style={styles.dropdownTitle}>{getText('Select Area in', 'علاقہ منتخب کریں')} {cityMap[selectedCity] || selectedCity}</Text>
              
//               <View style={styles.searchContainer}>
//                 <TextInput
//                   style={styles.searchInput}
//                   placeholder={getText('Search area...', 'علاقہ تلاش کریں...')}
//                   value={areaSearch}
//                   onChangeText={setAreaSearch}
//                   placeholderTextColor="#999"
//                 />
//                 <Icon name="search" size={20} color="#666" />
//               </View>
              
//               <ScrollView style={styles.dropdownScrollView}>
//                 {loadingAreas ? (
//                   <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="small" color="#4CAF50" />
//                     <Text style={styles.loadingText}>{getText('Loading areas...', 'علاقے لوڈ ہو رہے ہیں...')}</Text>
//                   </View>
//                 ) : filteredAreas.length > 0 ? (
//                   filteredAreas.map((area, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={styles.dropdownItem}
//                       onPress={() => handleAreaSelect(area.area_name)}
//                     >
//                       <View style={styles.areaItemContent}>
//                         <Text style={styles.dropdownItemText}>{areaMap[area.area_name] || area.area_name}</Text>
//                         <Text style={styles.areaZoneText}>{area.description}</Text>
//                       </View>
//                       <Icon name="chevron-right" size={20} color="#999" />
//                     </TouchableOpacity>
//                   ))
//                 ) : (
//                   <View style={styles.noDataContainer}>
//                     <Text style={styles.noDataText}>{getText('No areas found', 'کوئی علاقہ نہیں ملا')}</Text>
//                   </View>
//                 )}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     );
//   };

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
         
//           <View style={styles.landForm}>
//             {/* FORM SECTION */}
//             <View style={styles.formSection}>
//               <Text style={styles.sectionTitle}>{getText('Land Information', 'زمین کی معلومات')}</Text>
              
//               {/* City */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>{getText('City', 'شہر')}</Text>
//                 <TouchableOpacity 
//                   style={styles.dropdownButton}
//                   onPress={() => setShowCityDropdown(true)}
//                 >
//                   <Text style={[styles.dropdownText, !selectedCity && { color: '#999' }]}>
//                     {selectedCity ? (cityMap[selectedCity] || selectedCity) : getText('Select District', 'ضلع منتخب کریں')}
//                   </Text>
//                   <Icon name="arrow-drop-down" size={20} color="#666" />
//                 </TouchableOpacity>
//               </View>

//               {/* Area */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>{getText('Area', 'علاقہ')}</Text>
//                 <TouchableOpacity 
//                   style={[styles.dropdownButton, !selectedCity && styles.disabledDropdown]}
//                   onPress={() => selectedCity && setShowAreaDropdown(true)}
//                   disabled={!selectedCity}
//                 >
//                   <Text style={[styles.dropdownText, !selectedArea && { color: '#999' }]}>
//                     {selectedArea ? (areaMap[selectedArea] || selectedArea) : (selectedCity ? getText('Select Area', 'علاقہ منتخب کریں') : getText('Select District First', 'پہلے ضلع منتخب کریں'))}
//                   </Text>
//                   <Icon name="arrow-drop-down" size={20} color={selectedCity ? "#666" : "#ccc"} />
//                 </TouchableOpacity>
//               </View>

//               {/* Zone */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>{getText('Zone', 'زون')}</Text>
//                 <View style={styles.zoneDisplay}>
//                   <Text style={styles.zoneValue}>{getZoneName(selectedZone)}</Text>
//                 </View>
//               </View>

//               {/* Area Size */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>{getText('Area Size', 'رقبہ کا سائز')}</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder={getText('e.g., 10', 'مثال: 10')}
//                   value={areaSize}
//                   onChangeText={setAreaSize}
//                   keyboardType="numeric"
//                   placeholderTextColor="#999"
//                 />
//               </View>

//               {/* Area Unit */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>{getText('Area Unit', 'رقبہ کی اکائی')}</Text>
//                 <TouchableOpacity 
//                   style={styles.dropdownButton}
//                   onPress={() => setShowAreaUnitDropdown(true)}
//                 >
//                   <Text style={[styles.dropdownText, !selectedAreaUnit && { color: '#999' }]}>
//                     {selectedAreaUnit ? (unitMap[selectedAreaUnit] || selectedAreaUnit) : getText('Select Area Unit', 'یونٹ منتخب کریں')}
//                   </Text>
//                   <Icon name="arrow-drop-down" size={20} color="#666" />
//                 </TouchableOpacity>
//               </View>

//               {/* Soil Type */}
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>{getText('Soil Type', 'مٹی کی قسم')}</Text>
//                 <TouchableOpacity 
//                   style={[styles.dropdownButton, !selectedCity && styles.disabledDropdown]}
//                   onPress={() => selectedCity && setShowSoilTypeDropdown(true)}
//                   disabled={!selectedCity}
//                 >
//                   <Text style={[styles.dropdownText, !selectedSoilType && { color: '#999' }]}>
//                     {selectedSoilType ? (soilMap[selectedSoilType] || selectedSoilType) : (selectedCity ? getText('Select Soil Type', 'مٹی کی قسم منتخب کریں') : getText('Select District First', 'پہلے ضلع منتخب کریں'))}
//                   </Text>
//                   <Icon name="arrow-drop-down" size={20} color={selectedCity ? "#666" : "#ccc"} />
//                 </TouchableOpacity>
//               </View>

//             </View>

//             {/* LOCATION SECTION */}
//             <View style={styles.formSection}>
//               <View style={styles.locationHeader}>
//                 <Text style={styles.sectionTitle}>{getText('Location', 'مقام')}</Text>
//                 <TouchableOpacity 
//                   style={styles.googleMapsButton}
//                   onPress={openGoogleMaps}
//                   disabled={!selectedArea}
//                 >
//                   <Icon name="map" size={16} color="white" />
//                   <Text style={styles.googleMapsButtonText}>{getText('View in Map', 'نقشے میں دیکھیں')}</Text>
//                 </TouchableOpacity>
//               </View>
              
//               {/* Nearby Lands Button */}
//               <TouchableOpacity 
//                 style={styles.nearbyButton}
//                 onPress={getNearbyLands}
//                 disabled={loadingNearby}
//               >
//                 {loadingNearby ? (
//                   <ActivityIndicator size="small" color="white" />
//                 ) : (
//                   <>
//                     <Icon name="list" size={18} color="white" />
//                     <Text style={styles.nearbyButtonText}>
//                       {getText('Show Nearby Lands List', 'قریبی زمینیں دیکھیں')}
//                     </Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>

//             {/* Add Land Button */}
//             <TouchableOpacity 
//               style={styles.addLandButton}
//               onPress={handleAddLand}
//               disabled={loading}
//             >
//               <Icon name="add-circle" size={24} color="white" />
//               <Text style={styles.addLandButtonText}>{getText('Add Land', 'زمین شامل کریں')}</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Lands List */}
//           {lands.length > 0 && (
//             <View style={styles.landsList}>
//               <View style={styles.landsListHeader}>
//                 <Text style={styles.sectionTitle}>{getText('Added Lands', 'شامل کردہ زمینیں')} ({lands.length})</Text>
//                 <TouchableOpacity onPress={() => setLands([])}>
//                   <Text style={styles.clearAllText}>{getText('Clear All', 'سب صاف کریں')}</Text>
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={lands}
//                 renderItem={({ item }) => (
//                   <View style={styles.landItem}>
//                     <View style={styles.landInfo}>
//                       <Text style={styles.landText}>
//                         <Text style={styles.landLabel}>📍 </Text>
//                         {areaMap[item.area] || item.area}, {cityMap[item.city] || item.city}
//                       </Text>
//                       <Text style={styles.landText}>
//                         <Text style={styles.landLabel}>📏 </Text>
//                         {item.areaSize} {unitMap[item.areaUnit] || item.areaUnit} • {getZoneName(item.zone)}
//                       </Text>
//                       <Text style={styles.landText}>
//                         <Text style={styles.landLabel}>🌱 </Text>
//                         {soilMap[item.soilType] || item.soilType}
//                       </Text>
//                       {item.season && (
//                         <Text style={styles.landText}>
//                           <Text style={styles.landLabel}>🌾 </Text>
//                           {getText('Season', 'موسم')}: {item.season === 'Rabi' ? getText('Rabi', 'ربیع') : getText('Kharif', 'خریف')}
//                         </Text>
//                       )}
//                       {item.latitude && item.longitude && (
//                         <Text style={styles.landCoordinates}>
//                           <Text style={styles.landLabel}>📍 </Text>
//                           {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
//                         </Text>
//                       )}
//                     </View>
//                     <View style={styles.landActions}>
//                       <TouchableOpacity 
//                         style={styles.editButton}
//                         onPress={() => handleEditLand(item.id)}
//                       >
//                         <Icon name="edit" size={18} color="white" />
//                       </TouchableOpacity>
//                       <TouchableOpacity 
//                         style={styles.deleteButton}
//                         onPress={() => handleDeleteLand(item.id)}
//                       >
//                         <Icon name="delete" size={18} color="white" />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 )}
//                 keyExtractor={item => item.id}
//                 scrollEnabled={false}
//               />
//             </View>
//           )}

//           {/* Save Button */}
//           {lands.length > 0 && (
//             <TouchableOpacity 
//               style={[styles.saveButton, saving && styles.disabledButton]} 
//               onPress={handleSaveLands}
//               disabled={saving}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <>
//                   <Icon name="save" size={24} color="white" />
//                   <Text style={styles.saveButtonText}>{getText('SAVE ALL LANDS', 'تمام زمینیں محفوظ کریں')} ({lands.length})</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           )}
//         </ScrollView>
//       </SafeAreaView>

//       {/* MODALS */}
//       <LandCropsModal />
//       <NearbyMapModal />
//       <CoordinatesModal />
//       <AreaDropdownModal />

//       {/* City Dropdown */}
//       <Modal visible={showCityDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowCityDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.dropdownMenu}>
//               <Text style={styles.dropdownTitle}>{getText('Select District', 'ضلع منتخب کریں')}</Text>
//               <ScrollView style={styles.dropdownScrollView}>
//                 {cities.map((city, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.dropdownItem}
//                     onPress={() => handleCitySelect(city)}
//                   >
//                     <Text style={styles.dropdownItemText}>{cityMap[city] || city}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Area Unit Dropdown */}
//       <Modal visible={showAreaUnitDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowAreaUnitDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.dropdownMenu}>
//               <Text style={styles.dropdownTitle}>{getText('Select Area Unit', 'یونٹ منتخب کریں')}</Text>
//               <ScrollView style={styles.dropdownScrollView}>
//                 {areaUnits.map((unit, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.dropdownItem}
//                     onPress={() => {
//                       setSelectedAreaUnit(unit);
//                       setShowAreaUnitDropdown(false);
//                     }}
//                   >
//                     <Text style={styles.dropdownItemText}>{unitMap[unit] || unit}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Soil Type Dropdown */}
//       <Modal visible={showSoilTypeDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowSoilTypeDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.dropdownMenu}>
//               <Text style={styles.dropdownTitle}>{getText('Select Soil Type', 'مٹی کی قسم منتخب کریں')}</Text>
//               <ScrollView style={styles.dropdownScrollView}>
//                 {availableSoilTypes.map((soil, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.dropdownItem}
//                     onPress={() => {
//                       setSelectedSoilType(soil);
//                       setShowSoilTypeDropdown(false);
//                     }}
//                   >
//                     <Text style={styles.dropdownItemText}>{soilMap[soil] || soil}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Season Dropdown */}
//       <Modal visible={showSeasonDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowSeasonDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.dropdownMenu}>
//               <Text style={styles.dropdownTitle}>{getText('Select Season', 'موسم منتخب کریں')}</Text>
//               <ScrollView style={styles.dropdownScrollView}>
//                 {seasonsWithDates.map((season, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.dropdownItem,
//                       selectedSeason === season.name && { backgroundColor: '#E8F5E9' }
//                     ]}
//                     onPress={() => handleSeasonSelect(season.name)}
//                   >
//                     <View>
//                       <Text style={styles.dropdownItemText}>{season.name === 'Rabi' ? getText('Rabi', 'ربیع') : getText('Kharif', 'خریف')}</Text>
//                       <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
//                         {season.from} - {season.to}
//                       </Text>
//                     </View>
//                     {selectedSeason === season.name && (
//                       <Icon name="check" size={20} color="#4CAF50" />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Zone Filter Dropdown */}
//       <Modal visible={showZoneFilterDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowZoneFilterDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.dropdownMenu}>
//               <Text style={styles.dropdownTitle}>{getText('Select Zone Filter', 'زون فلٹر منتخب کریں')}</Text>
//               <ScrollView style={styles.dropdownScrollView}>
//                 {zoneFilterOptions.map((option, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.dropdownItem,
//                       selectedZoneFilter === option.id && { backgroundColor: '#E8F5E9' }
//                     ]}
//                     onPress={() => {
//                       setSelectedZoneFilter(option.id);
//                       setShowZoneFilterDropdown(false);
//                     }}
//                   >
//                     <Text style={styles.dropdownItemText}>{option.labelUr}</Text>
//                     {selectedZoneFilter === option.id && (
//                       <Icon name="check" size={20} color="#4CAF50" />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Crop Season Filter Dropdown */}
//       <Modal visible={showCropSeasonDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowCropSeasonDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.dropdownMenu}>
//               <Text style={styles.dropdownTitle}>{getText('Select Season Filter', 'موسم فلٹر منتخب کریں')}</Text>
//               <ScrollView style={styles.dropdownScrollView}>
//                 {cropSeasonFilterOptions.map((option, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.dropdownItem,
//                       selectedCropSeasonFilter === option.id && { backgroundColor: '#E8F5E9' }
//                     ]}
//                     onPress={() => {
//                       setSelectedCropSeasonFilter(option.id);
//                       setShowCropSeasonDropdown(false);
//                     }}
//                   >
//                     <Text style={styles.dropdownItemText}>{option.labelUr}</Text>
//                     {selectedCropSeasonFilter === option.id && (
//                       <Icon name="check" size={20} color="#4CAF50" />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* ✅ CROP FILTER DROPDOWN */}
//       <Modal visible={showCropFilterDropdown} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setShowCropFilterDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.dropdownMenu}>
//               <Text style={styles.dropdownTitle}>{getText('Select Crop Filter', 'فصل فلٹر منتخب کریں')}</Text>
//               <ScrollView style={styles.dropdownScrollView}>
//                 {cropFilterOptions.map((option, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.dropdownItem,
//                       selectedCropFilter === option.id && { backgroundColor: '#E8F5E9' }
//                     ]}
//                     onPress={() => {
//                       setSelectedCropFilter(option.id);
//                       setShowCropFilterDropdown(false);
//                     }}
//                   >
//                     <Text style={styles.dropdownItemText}>{option.labelUr}</Text>
//                     {selectedCropFilter === option.id && (
//                       <Icon name="check" size={20} color="#4CAF50" />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   safeArea: {
//     flex: 1,
//   },
//   scrollContainer: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   formSection: {
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 15,
//     textAlign: 'right',
//   },
//   inputGroup: {
//     marginBottom: 15,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#444',
//     marginBottom: 8,
//     textAlign: 'right',
//   },
//   landForm: {
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: '#f8f9fa',
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'right',
//   },
//   dropdownButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   disabledDropdown: {
//     backgroundColor: '#f5f5f5',
//     borderColor: '#e0e0e0',
//   },
//   dropdownText: {
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'right',
//     flex: 1,
//   },
//   zoneDisplay: {
//     backgroundColor: '#e8f5e8',
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#c8e6c9',
//   },
//   zoneValue: {
//     fontSize: 16,
//     color: '#1b5e20',
//     fontWeight: '600',
//     textAlign: 'right',
//   },
//   locationHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   googleMapsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4285F4',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 6,
//   },
//   googleMapsButtonText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   nearbyButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FF9800',
//     padding: 15,
//     borderRadius: 10,
//     gap: 10,
//   },
//   nearbyButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   radiusInputContainer: {
//     backgroundColor: '#f0f8ff',
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#bbdefb',
//   },
//   radiusInputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   radiusLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   radiusInput: {
//     flex: 1,
//     backgroundColor: 'white',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   radiusUnit: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '600',
//   },
//   applyRadiusButton: {
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   applyRadiusText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   radiusHint: {
//     fontSize: 11,
//     color: '#666',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   mapModalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   mapSubtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   simpleListContainer: {
//     flex: 1,
//     paddingHorizontal: 5,
//   },
//   landCard: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   landCardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   landCardName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     flex: 1,
//   },
//   distanceBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   distanceText: {
//     fontSize: 12,
//     color: 'white',
//     fontWeight: '600',
//   },
//   landDetails: {
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   detailText: {
//     fontSize: 14,
//     color: '#555',
//     marginLeft: 8,
//     textAlign: 'right',
//     flex: 1,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#999',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   mapActions: {
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 15,
//   },
//   viewInMapsButton: {
//     flex: 2,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4285F4',
//     padding: 12,
//     borderRadius: 8,
//     gap: 8,
//   },
//   viewInMapsButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   closeMapButton: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeMapButtonText: {
//     color: '#666',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   coordinatesModalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   coordinatesScrollView: {
//     flex: 1,
//   },
//   coordinatesNote: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   coordinateInputGroup: {
//     marginBottom: 15,
//   },
//   coordinateLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//     textAlign: 'right',
//   },
//   coordinateInput: {
//     backgroundColor: '#f8f9fa',
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'right',
//   },
//   autoFillButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4CAF50',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 10,
//     gap: 8,
//   },
//   autoFillButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   currentCoordinates: {
//     backgroundColor: '#f0f7ff',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 15,
//     borderWidth: 1,
//     borderColor: '#bbdefb',
//   },
//   currentCoordinatesTitle: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//     textAlign: 'right',
//   },
//   currentCoordinatesValue: {
//     fontSize: 14,
//     color: '#2E7D32',
//     fontWeight: '600',
//     fontFamily: 'monospace',
//     textAlign: 'right',
//   },
//   coordinatesModalActions: {
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 15,
//   },
//   cancelCoordinatesButton: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   cancelCoordinatesButtonText: {
//     color: '#666',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   saveCoordinatesButton: {
//     flex: 2,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 10,
//     gap: 8,
//   },
//   saveCoordinatesButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dropdownMenu: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 10,
//     width: '80%',
//     maxHeight: 400,
//   },
//   dropdownTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   searchInput: {
//     flex: 1,
//     padding: 10,
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'right',
//   },
//   dropdownScrollView: {
//     maxHeight: 300,
//   },
//   dropdownItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   areaItemContent: {
//     flex: 1,
//   },
//   dropdownItemText: {
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'right',
//   },
//   areaZoneText: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//     textAlign: 'right',
//   },
//   loadingContainer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 8,
//     color: '#666',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   noDataContainer: {
//     padding: 30,
//     alignItems: 'center',
//   },
//   noDataText: {
//     color: '#999',
//     fontSize: 14,
//     fontStyle: 'italic',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   landsList: {
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   landsListHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   clearAllText: {
//     color: '#F44336',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   landItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   landInfo: {
//     flex: 1,
//   },
//   landText: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 4,
//     textAlign: 'right',
//   },
//   landLabel: {
//     color: '#666',
//     fontWeight: '600',
//   },
//   landCoordinates: {
//     fontSize: 12,
//     color: '#666',
//     fontStyle: 'italic',
//     marginTop: 4,
//     textAlign: 'right',
//   },
//   landActions: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   editButton: {
//     backgroundColor: '#4CAF50',
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   deleteButton: {
//     backgroundColor: '#F44336',
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   addLandButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FF9800',
//     padding: 18,
//     borderRadius: 12,
//     marginTop: 10,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   addLandButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 12,
//   },
//   saveButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#2e7d32de',
//     paddingVertical: 18,
//     borderRadius: 12,
//     marginBottom: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   disabledButton: {
//     backgroundColor: '#A5D6A7',
//   },
//   saveButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 12,
//   },
//   fullModalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   landCropsModalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     flex: 1,
//     textAlign: 'center',
//   },
//   cropFilterBadge: {
//     fontSize: 12,
//     color: '#4CAF50',
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   landCropsScrollView: {
//     flex: 1,
//   },
//   landInfoSection: {
//     backgroundColor: '#f0f7ff',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#bbdefb',
//   },
//   sectionSubtitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 10,
//     textAlign: 'right',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//     justifyContent: 'flex-end',
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#555',
//     marginLeft: 8,
//     textAlign: 'right',
//     flex: 1,
//   },
//   seasonSummarySection: {
//     backgroundColor: '#fff8e1',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ffe082',
//   },
//   seasonBadges: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 10,
//     justifyContent: 'flex-end',
//   },
//   seasonBadge: {
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//   },
//   seasonBadgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   selectedSeasonText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'right',
//   },
//   seasonHighlight: {
//     color: '#2E7D32',
//     fontWeight: 'bold',
//   },
//   cropsSection: {
//     marginBottom: 20,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cropCard: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   cropHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cropName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     flex: 1,
//     textAlign: 'right',
//   },
//   seasonTag: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   seasonTagText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   cropDetails: {
//     marginBottom: 10,
//   },
//   cropDetailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//     justifyContent: 'flex-end',
//   },
//   cropDetailText: {
//     fontSize: 13,
//     color: '#555',
//     marginLeft: 6,
//     textAlign: 'right',
//   },
//   activitiesSection: {
//     backgroundColor: '#f9f9f9',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   activitiesTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 8,
//     textAlign: 'right',
//   },
//   activityItem: {
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 6,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   activityHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   activityType: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#444',
//   },
//   activityDate: {
//     fontSize: 12,
//     color: '#666',
//   },
//   activityDesc: {
//     fontSize: 12,
//     color: '#555',
//     marginBottom: 4,
//     textAlign: 'right',
//   },
//   activityChemical: {
//     fontSize: 11,
//     color: '#777',
//     fontStyle: 'italic',
//     textAlign: 'right',
//   },
//   viewMoreText: {
//     fontSize: 12,
//     color: '#4CAF50',
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 15,
//   },
//   closeModalButton: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeModalButtonText: {
//     color: '#666',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });

// export default LandInputPage;






import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
  FlatList, Modal, TouchableWithoutFeedback, Dimensions, Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { farmerAPI } from './api';

const { width, height } = Dimensions.get('window');

const LandInputPage = ({ navigation, route }) => {
  // ✅ Language State (Default Urdu for display)
  const [language] = useState('ur');
  
  // ✅ Helper function for translations
  const getText = (en, ur) => {
    return language === 'ur' ? ur : en;
  };
  
  // ✅ States
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [selectedAreaUnit, setSelectedAreaUnit] = useState('');
  const [selectedSoilType, setSelectedSoilType] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  const [lands, setLands] = useState(route.params?.existingLands || []);
  const [farmerId, setFarmerId] = useState(null);
  
  // ✅ Map & Nearby States
  const [showNearbyMap, setShowNearbyMap] = useState(false);
  const [areaCenterInfo, setAreaCenterInfo] = useState(null);
  const [nearbyLands, setNearbyLands] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  
  // ✅ Dynamic Radius State
  const [searchRadius, setSearchRadius] = useState('5');
  
  // ✅ Land Crops Modal States
  const [selectedLandData, setSelectedLandData] = useState(null);
  const [showLandCropsModal, setShowLandCropsModal] = useState(false);
  const [loadingLandCrops, setLoadingLandCrops] = useState(false);
  
  // ✅ Manual Coordinates
  const [showCoordinatesModal, setShowCoordinatesModal] = useState(false);
  const [manualCoordinates, setManualCoordinates] = useState({ lat: '', lng: '' });
  
  // ✅ Area Management
  const [areasData, setAreasData] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [availableSoilTypes, setAvailableSoilTypes] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showAreaUnitDropdown, setShowAreaUnitDropdown] = useState(false);
  const [showSoilTypeDropdown, setShowSoilTypeDropdown] = useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  
  // ✅ Zone Filter States
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('All');
  const [showZoneFilterDropdown, setShowZoneFilterDropdown] = useState(false);
  
  // ✅ Crop Filter States
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [showCropFilterDropdown, setShowCropFilterDropdown] = useState(false);
  
  // ✅ Land Crops Season Filter State
  const [selectedCropSeasonFilter, setSelectedCropSeasonFilter] = useState('All');
  const [showCropSeasonDropdown, setShowCropSeasonDropdown] = useState(false);

  const cities = ['Rawalpindi', 'Lahore', 'Faisalabad', 'Multan', 'Gujrat', 'Sialkot'];
  const areaUnits = ['acres', 'canal'];
  
  // ✅ Zone Filter Options
  const zoneFilterOptions = [
    { id: 'All', labelEn: 'All Zones', labelUr: 'تمام زونز' },
    { id: 'Zone A', labelEn: 'Zone A - Nehri', labelUr: 'زون اے - نہری' },
    { id: 'Zone B', labelEn: 'Zone B - Tubewell', labelUr: 'زون بی - ٹیوب ویل' },
    { id: 'Zone C', labelEn: 'Zone C - Barani', labelUr: 'زون سی - بارانی' }
  ];
  
  // ✅ Land Crops Season Filter Options
  const cropSeasonFilterOptions = [
    { id: 'All', labelEn: 'All Seasons', labelUr: 'تمام موسم' },
    { id: 'Rabi', labelEn: 'Rabi Season', labelUr: 'ربیع موسم' },
    { id: 'Kharif', labelEn: 'Kharif Season', labelUr: 'خریف موسم' }
  ];
  
  // ✅ CROP SYNONYMS FOR MATCHING (SwiftUI style)
  const cropSynonyms = {
    'WHEAT': ['WHEAT', 'گندم', 'GANDUM'],
    'MAIZE': ['MAIZE', 'CORN', 'مکئی', 'MAKAI'],
    'RICE': ['RICE', 'چاول', 'CHAWAAL', 'PADDY', 'DHAN', 'دھان'],
    'SUGARCANE': ['SUGARCANE', 'گنا', 'GANNA'],
    'COTTON': ['COTTON', 'کپاس', 'KAPAS'],
    'BARLEY': ['BARLEY', 'جو', 'JAO'],
    'PEANUT': ['PEANUT', 'GROUNDNUT', 'مونگ پھلی', 'MOONG PHALI'],
    'CHICKPEAS': ['CHICKPEA', 'CHICKPEAS', 'GRAM', 'CHANA', 'چنے'],
    'PADDY': ['PADDY', 'DHAN', 'دھان', 'RICE'],
    'MUSTARD': ['MUSTARD', 'سرسوں', 'SARSON'],
    'SUNFLOWER': ['SUNFLOWER', 'سورج مکھی', 'SURAJ MUKHI'],
    'BAJRA': ['BAJRA', 'PEARL', 'MILLET', 'باجرا', 'BAJRA'],
    'SORGHUM': ['SORGHUM', 'JOWAR', 'جوار'],
    'TOBACCO': ['TOBACCO', 'تمباکو', 'TAMBAKU'],
    'SESAMUM': ['SESAMUM', 'SESAME', 'TIL', 'تل']
  };
  
  // ✅ Crop Filter Options for Dropdown
  const cropFilterOptions = [
    { id: 'All', labelEn: 'All Crops', labelUr: 'تمام فصلیں' },
    { id: 'WHEAT', labelEn: 'Wheat', labelUr: 'گندم' },
    { id: 'MAIZE', labelEn: 'Maize', labelUr: 'مکئی' },
    { id: 'RICE', labelEn: 'Rice', labelUr: 'چاول' },
    { id: 'SUGARCANE', labelEn: 'Sugarcane', labelUr: 'گنا' },
    { id: 'COTTON', labelEn: 'Cotton', labelUr: 'کپاس' },
    { id: 'BARLEY', labelEn: 'Barley', labelUr: 'جو' },
    { id: 'PEANUT', labelEn: 'Peanut', labelUr: 'مونگ پھلی' },
    { id: 'CHICKPEAS', labelEn: 'Chickpeas', labelUr: 'چنے' },
    { id: 'PADDY', labelEn: 'Paddy', labelUr: 'دھان' },
    { id: 'MUSTARD', labelEn: 'Mustard', labelUr: 'سرسوں' },
    { id: 'SUNFLOWER', labelEn: 'Sunflower', labelUr: 'سورج مکھی' },
    { id: 'BAJRA', labelEn: 'Bajra', labelUr: 'باجرا' },
    { id: 'SORGHUM', labelEn: 'Sorghum', labelUr: 'جوار' },
    { id: 'TOBACCO', labelEn: 'Tobacco', labelUr: 'تمباکو' },
    { id: 'SESAMUM', labelEn: 'Sesamum', labelUr: 'تل' }
  ];
  
  // ✅ City mapping English to Urdu
  const cityMap = {
    'Rawalpindi': 'راولپنڈی',
    'Lahore': 'لاہور',
    'Faisalabad': 'فیصل آباد',
    'Multan': 'ملتان',
    'Gujrat': 'گجرات',
    'Sialkot': 'سیالکوٹ'
  };
  
  // ✅ Zone mapping English to Urdu
  const zoneMap = {
    'Zone A': 'نہری علاقہ',
    'Zone B': 'ٹیوب ویل علاقہ',
    'Zone C': 'بارانی علاقہ',
    'Nehri Areas': 'نہری علاقہ',
    'Tubewell Areas': 'ٹیوب ویل علاقہ',
    'Barani areas': 'بارانی علاقہ'
  };
  
  // ✅ Soil type mapping
  const soilMap = {
    'CLAY LOAM': 'چکنی میٹھی',
    'SILT LOAM': 'سلت میٹھی',
    'SANDY LOAM': 'ریتی میٹھی',
    'LOAM': 'میٹھی',
    'CLAY': 'چکنی',
    'SANDY CLAY': 'ریتی چکنی',
    'SILT': 'سلت'
  };
  
  // ✅ Unit mapping
  const unitMap = {
    'acres': 'ایکڑ',
    'canal': 'کنال'
  };
  
  // ✅ Season mapping
  const seasonMap = {
    'Rabi': 'ربیع',
    'Kharif': 'خریف'
  };
  
  // ✅ Area mapping (100+ areas)
  const areaMap = {
    'Gujar Khan Tehsil - Rural Belt': 'گجر خان تحصیل - دیہی پٹی',
    'Gujar Khan Plains - Lowland Farms': 'گجر خان میدانی علاقے - نشیبی فارم',
    'Gujar Khan Uplands - Barani Pockets': 'گجر خان اپلینڈز - بارانی علاقے',
    'Taxila Tehsil - Rural Belt': 'ٹیکسلا تحصیل - دیہی پٹی',
    'Taxila Plains - Peri-urban Farms': 'ٹیکسلا میدانی علاقے - شہری مضافاتی فارم',
    'Kahuta Tehsil - Hilly Farms': 'کہوٹہ تحصیل - پہاڑی فارم',
    'Kallar Syedan Tehsil - Rural Belt': 'کلر سیداں تحصیل - دیہی پٹی',
    'Murree Tehsil - Hill Agriculture': 'مری تحصیل - پہاڑی زراعت',
    'Chakri - Peri-urban Tubewell Farms': 'چکری - شہری مضافاتی ٹیوب ویل فارم',
    'Rawalpindi East Rural Belt': 'راولپنڈی مشرقی دیہی پٹی',
    'Rawalpindi West Agricultural Plain': 'راولپنڈی مغربی زرعی میدان',
    'Daultala Area - Agricultural Belt': 'ڈھولتالہ علاقہ - زرعی پٹی',
    'Sohawa Road / Gujar Khan Fringe': 'سوہاوہ روڈ / گجر خان کنارے',
    'Potohar Plateau Fringe - Farms': 'پوٹھوہار سطح مرتفع کے کنارے - فارم',
    'Gujar Khan Peri-urban Tubewell Pockets': 'گجر خان شہری مضافاتی ٹیوب ویل علاقے',
    'Rural Plains near Chakwal Border': 'چکوال سرحد کے قریب دیہی میدان',
    'Kotli Sattian / Kahuta Hills - Barani': 'کوٹلی ستیاں / کہوٹہ پہاڑیاں - بارانی',
    'Raiwind Tehsil - Canal Command': 'رائے ونڈ تحصیل - نہری نظام',
    'Kasur Belt (Lahore periphery)': 'قصور پٹی (لاہور مضافات)',
    'Sharaqpur / Chunian Fringe': 'شرقپور / چونیاں کنارے',
    'Sheikhupura Periphery (Lahore side)': 'شیخوپورہ مضافات (لاہور طرف)',
    'Lahore-Faisalabad Road Agricultural Belt': 'لاہور-فیصل آباد روڈ زرعی پٹی',
    'Walton / Kot Abdul Malik Peri-urban Farms': 'والٹن / کوٹ عبدالملک شہری مضافاتی فارم',
    'Kala Shah Kaku / Ferozewala Belt': 'کالا شاہ کاکو / فیروزوالہ پٹی',
    'Raiwind South Agricultural Belt': 'رائے ونڈ جنوبی زرعی پٹی',
    'Lahore Sadar Rural Belt': 'لاہور صدر دیہی پٹی',
    'Lahore North Uplands (small rainfed pockets)': 'لاہور شمالی اپلینڈز (چھوٹے بارانی علاقے)',
    'Kot Khawaja Saeed / Peri-urban Farms': 'کوٹ خواجہ سعید / شہری مضافاتی فارم',
    'Lahore South Plains - Mixed Irrigation': 'لاہور جنوبی میدان - مخلوط آبپاشی',
    'Kasur-Raiwind Interchange Belt': 'قصور-رائے ونڈ انٹرچینج پٹی',
    'Faisalabad Road Eastern Belt': 'فیصل آباد روڈ مشرقی پٹی',
    'Shahdara Rural Fringe': 'شاہدرہ دیہی کنارے',
    'Peri-urban Vegetable Belt (Lahore outskirts)': 'شہری مضافاتی سبزی پٹی (لاہور مضافات)',
    'Lahore West Rural Belt - Smallholders': 'لاہور مغربی دیہی پٹی - چھوٹے کسان',
    'Chak Jhumra Tehsil - Canal Belt': 'چک جھمرہ تحصیل - نہری پٹی',
    'Tandlianwala Tehsil - Irrigated Farms': 'تاندلیانوالہ تحصیل - سیراب فارم',
    'Samundri Tehsil - Agricultural Plains': 'سمندری تحصیل - زرعی میدان',
    'Jaranwala Tehsil - Canal Command': 'جڑانوالہ تحصیل - نہری نظام',
    'Faisalabad South Rural Belt': 'فیصل آباد جنوبی دیہی پٹی',
    'Faisalabad North Peri-urban Farms': 'فیصل آباد شمالی شہری مضافاتی فارم',
    'Satiana Side - Tubewell Pockets': 'ستیانہ سائیڈ - ٹیوب ویل علاقے',
    'Sukheke / Chak No. belts - Canal': 'سکھیکے / چک نمبر پٹیاں - نہری',
    'Ghulam Muhammadabad / Rural Fringe': 'غلام محمد آباد / دیہی کنارے',
    'Bhaggowal / Smallholder Area - Mixed': 'بھگووال / چھوٹے کسان علاقہ - مخلوط',
    'Faisalabad West Agricultural Belt': 'فیصل آباد مغربی زرعی پٹی',
    'Faisalabad East Peri-urban Tubewell Farms': 'فیصل آباد مشرقی شہری مضافاتی ٹیوب ویل فارم',
    'Samundri South Rural Belt': 'سمندری جنوبی دیہی پٹی',
    'Chak Clusters near Jaranwala': 'جڑانوالہ کے قریب چک کلسٹر',
    'Tandlianwala North - Mixed Pockets': 'تاندلیانوالہ شمالی - مخلوط علاقے',
    'Central Faisalabad Command Area': 'وسطی فیصل آباد کمانڈ علاقہ',
    'Peri-urban Vegetable Belt (near city)': 'شہری مضافاتی سبزی پٹی (شہر کے قریب)',
    'Shujabad Tehsil - Canal Belt': 'شجاع آباد تحصیل - نہری پٹی',
    'Jalalpur Pirwala Tehsil - Irrigated Plains': 'جلالپور پیروالہ تحصیل - سیراب میدان',
    'Multan South Rural Belt': 'ملتان جنوبی دیہی پٹی',
    'Vehari Side - Tubewell Area': 'وہاڑی سائیڈ - ٹیوب ویل علاقہ',
    'Shah Rukn-e-Alam Periphery - Mixed': 'شاہ رکن عالم مضافات - مخلوط',
    'Musa Pak / Jalalpur Fringe - Canal': 'موسٰی پاک / جلالپور کنارے - نہری',
    'Multan North Rural Belt': 'ملتان شمالی دیہی پٹی',
    'Multan East Peri-urban Tubewell Farms': 'ملتان مشرقی شہری مضافاتی ٹیوب ویل فارم',
    'Basti Malook / Rural Fringe - Mixed': 'بستی ملوک / دیہی کنارے - مخلوط',
    'Jahanian / Local Command Belt': 'جہانیاں / لوکل کمانڈ پٹی',
    'Central Multan Command Area': 'وسطی ملتان کمانڈ علاقہ',
    'Shujabad South - Tubewell Pockets': 'شجاع آباد جنوبی - ٹیوب ویل علاقے',
    'Multan West Rural Plain': 'ملتان مغربی دیہی میدان',
    'Dunya Pur / Rural Belt': 'دنیا پور / دیہی پٹی',
    'Multan Peri-urban Mixed Farms': 'ملتان شہری مضافاتی مخلوط فارم',
    'Bosan Road Agricultural Fringe': 'بوسن روڈ زرعی کنارے',
    'Multan West Periphery - Canal Command': 'ملتان مغربی مضافات - نہری نظام',
    'Gujrat Tehsil - Canal Plains': 'گجرات تحصیل - نہری میدان',
    'Kharian Tehsil - Mixed Irrigation': 'کھاریاں تحصیل - مخلوط آبپاشی',
    'Kunjah - Canal Irrigated Area': 'کنجہ - نہری سیراب علاقہ',
    'Jalalpur Jattan - Tubewell Pockets': 'جلالپور جٹاں - ٹیوب ویل علاقے',
    'Lalamusa - Mixed': 'لالہ موسیٰ - مخلوط',
    'Sarai Alamgir - Canal Belt': 'سرائے عالمگیر - نہری پٹی',
    'Dinga / Rural Belt': 'ڈنگہ / دیہی پٹی',
    'Gujrat Peri-urban Tubewell Farms': 'گجرات شہری مضافاتی ٹیوب ویل فارم',
    'Khari / Upper Plain - Canal': 'کھڑی / بالائی میدان - نہری',
    'Gujrat South Agricultural Belt': 'گجرات جنوبی زرعی پٹی',
    'Gujrat North Hills Fringe - Barani': 'گجرات شمالی پہاڑی کنارے - بارانی',
    'Kharian Plains - Tubewell Pockets': 'کھاریاں میدان - ٹیوب ویل علاقے',
    'Sandal Bar Fringe - Mixed': 'ساندل بار کنارے - مخلوط',
    'Tehsil Smallholder Belt - Gujrat': 'تحصیل چھوٹے کسان پٹی - گجرات',
    'Lalamusa Peri-urban Farming Area': 'لالہ موسیٰ شہری مضافاتی کاشتکاری علاقہ',
    'Kunjah South - Canal Command': 'کنجہ جنوبی - نہری نظام',
    'Daska Tehsil - Canal Plains': 'ڈسکہ تحصیل - نہری میدان',
    'Daska South - Canal Command': 'ڈسکہ جنوبی - نہری نظام',
    'Pasrur Tehsil - Irrigated Fields': 'پسرور تحصیل - سیراب کھیت',
    'Pasrur East - Mixed Pockets': 'پسرور مشرقی - مخلوط علاقے',
    'Sambrial - Mixed Irrigation': 'سمبڑیال - مخلوط آبپاشی',
    'Sambrial North - Peri-urban Farms': 'سمبڑیال شمالی - شہری مضافاتی فارم',
    'Sialkot Rural Belt - North': 'سیالکوٹ دیہی پٹی - شمالی',
    'Sialkot West Rural Belt': 'سیالکوٹ مغربی دیہی پٹی',
    'Sialkot Peri-urban Tubewell Farms': 'سیالکوٹ شہری مضافاتی ٹیوب ویل فارم',
    'Head Marala / Riverine Fringe - Mixed': 'ہیڈ مرالہ / دریائی کنارے - مخلوط',
    'Sialkot Central Outskirts - Mixed': 'سیالکوٹ وسطی مضافات - مخلوط',
    'Sialkot Eastern Plains - Nehri': 'سیالکوٹ مشرقی میدان - نہری',
    'Sialkot Agricultural Belt - South': 'سیالکوٹ زرعی پٹی - جنوبی',
    'Nurkot / Rural Cluster - Mixed': 'نورکوٹ / دیہی کلسٹر - مخلوط',
    'Industrial Fringe Peri-urban Farms': 'صنعتی کنارے شہری مضافاتی فارم',
    'Smallholder Cluster - Sialkot Rural': 'چھوٹے کسان کلسٹر - سیالکوٹ دیہی'
  };
  
  // ✅ Helper function to get translated zone
  const getZoneName = (zone) => {
    if (!zone) return getText('Select area first', 'پہلے علاقہ منتخب کریں');
    if (zoneMap[zone]) return zoneMap[zone];
    const zoneLower = zone.toLowerCase();
    if (zoneLower.includes('nehri') || zoneLower.includes('canal')) return 'نہری علاقہ';
    if (zoneLower.includes('tubewell') || zoneLower.includes('tube well')) return 'ٹیوب ویل علاقہ';
    if (zoneLower.includes('barani') || zoneLower.includes('rainfed')) return 'بارانی علاقہ';
    return zone;
  };
  
  // ✅ Seasons with dates
  const seasonsWithDates = [
    { name: 'Rabi', labelEn: 'Rabi (Oct 15 - Apr 15)', labelUr: 'ربیع (15 اکتوبر - 15 اپریل)', from: 'Oct 15', to: 'Apr 15' },
    { name: 'Kharif', labelEn: 'Kharif (Apr 16 - Oct 14)', labelUr: 'خریف (16 اپریل - 14 اکتوبر)', from: 'Apr 16', to: 'Oct 14' }
  ];
  
  const city_soil = {
    "RAWALPINDI": ["CLAY LOAM", "SILT LOAM"],
    "FAISALABAD": ["SANDY LOAM", "CLAY"],
    "LAHORE": ["LOAM", "CLAY LOAM"],
    "MULTAN": ["SANDY CLAY", "LOAM"],
    "GUJRAT": ["LOAM", "SILT"],
    "SIALKOT": ["CLAY LOAM", "SANDY LOAM"]
  };

  useEffect(() => {
    loadFarmerId();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      loadAreasForCity(selectedCity);
      setAvailableSoilTypes(city_soil[selectedCity.toUpperCase()] || []);
    } else {
      setSelectedArea('');
      setSelectedZone('');
      setSelectedSoilType('');
      setSelectedSeason('');
      setAreasData([]);
      setAvailableSoilTypes([]);
      setAreaCenterInfo(null);
      setManualCoordinates({ lat: '', lng: '' });
      setNearbyLands([]);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedArea) {
      const selectedAreaData = areasData.find(area => area.area_name === selectedArea);
      if (selectedAreaData) {
        setSelectedZone(selectedAreaData.description);
      }
      loadAreaCenterPoint(selectedArea);
    } else {
      setSelectedZone('');
      setAreaCenterInfo(null);
    }
  }, [selectedArea, areasData]);

  const loadAreasForCity = async (cityName) => {
    setLoadingAreas(true);
    try {
      const response = await farmerAPI.getAreasByCity(cityName);
      if (response.areas) {
        setAreasData(response.areas);
      }
    } catch (error) {
      console.error('Error loading areas:', error);
      Alert.alert('Error', 'Failed to load areas');
    } finally {
      setLoadingAreas(false);
    }
  };

  const loadAreaCenterPoint = async (areaName) => {
    try {
      const response = await farmerAPI.getAreaCenter(areaName);
      if (response.success) {
        setAreaCenterInfo(response);
        if (response.center_latitude && response.center_longitude && !manualCoordinates.lat) {
          setManualCoordinates({
            lat: response.center_latitude.toString(),
            lng: response.center_longitude.toString()
          });
        }
      } else {
        setAreaCenterInfo(null);
      }
    } catch (error) {
      console.error('Error loading area center:', error);
      setAreaCenterInfo(null);
    }
  };

  // ✅ FIXED: GET NEARBY LANDS - NO CROP FILTER (get all data like SwiftUI)
  const getNearbyLands = async () => {
    if (!selectedArea) {
      Alert.alert('Error', 'Please select an area first');
      return;
    }
    
    const radius = parseFloat(searchRadius);
    if (isNaN(radius) || radius <= 0) {
      Alert.alert('Error', 'Please enter a valid radius');
      return;
    }
    
    setLoadingNearby(true);
    try {
      // ✅ IMPORTANT: Don't send crop filter - get ALL data (like SwiftUI)
      const response = await farmerAPI.getNearbyLandsByArea(
        selectedArea, 
        radius,
        null,  // excludeLandId
        null   // ✅ NO crop filter - get all lands
      );
      
      if (response.success) {
        setNearbyLands(response.nearby_lands || []);
        setShowNearbyMap(true);
      } else {
        Alert.alert('Info', response.message || 'No nearby lands found');
      }
    } catch (error) {
      console.error('Error getting nearby lands:', error);
      Alert.alert('Error', 'Failed to get nearby lands');
    } finally {
      setLoadingNearby(false);
    }
  };

  // ✅ FIXED: CLIENT-SIDE CROP FILTER (exactly like SwiftUI)
  const getFilteredNearbyLands = () => {
    let filtered = [...nearbyLands];
    
    // 1️⃣ ZONE FILTER
    if (selectedZoneFilter !== 'All') {
      filtered = filtered.filter(land => {
        const zoneType = (land.zone_type || '').toLowerCase();
        if (selectedZoneFilter === 'Zone A') {
          return zoneType.includes('zone a') || zoneType.includes('nehri') || zoneType.includes('canal');
        } else if (selectedZoneFilter === 'Zone B') {
          return zoneType.includes('zone b') || zoneType.includes('tubewell') || zoneType.includes('tube');
        } else if (selectedZoneFilter === 'Zone C') {
          return zoneType.includes('zone c') || zoneType.includes('barani') || zoneType.includes('rainfed');
        }
        return true;
      });
    }
    
    // 2️⃣ CROP FILTER - CLIENT SIDE (like SwiftUI's nearbyLandMatchesCropFilter)
    if (selectedCropFilter !== 'All') {
      const filterCode = selectedCropFilter.toUpperCase();
      const synonyms = cropSynonyms[filterCode] || [filterCode];
      
      filtered = filtered.filter(land => {
        const latestCrop = (land.latest_crop || '').toLowerCase();
        const allCrops = (land.all_crops || '').toLowerCase();
        
        // Check if any synonym matches
        return synonyms.some(syn => {
          const synLower = syn.toLowerCase();
          return latestCrop.includes(synLower) || allCrops.includes(synLower);
        });
      });
    }
    
    return filtered;
  };

  const getLandCrops = async (land) => {
  const landId = land.land_id;
  const farmerName = land.farmer_name;
  
  setShowNearbyMap(false);
  setLoadingLandCrops(true);
  
  try {
    const response = await farmerAPI.getLandSeasonCrops(landId, '');
    
    if (response.success) {
      let filteredCrops = response.crops;
      
      // ✅ ONLY show crops matching the selected filter
      if (selectedCropFilter !== 'All') {
        const filterCode = selectedCropFilter.toUpperCase();
        const synonyms = cropSynonyms[filterCode] || [filterCode];
        
        filteredCrops = response.crops.filter(crop => {
          const cropName = (crop.crop_name || '').toLowerCase();
          // Check if crop name matches any synonym
          return synonyms.some(syn => {
            const synLower = syn.toLowerCase();
            return cropName === synLower || cropName.includes(synLower);
          });
        });
        
        console.log(`🔍 Filtering crops: ${selectedCropFilter} -> Found ${filteredCrops.length} out of ${response.crops.length}`);
      }
      
      // ✅ If no crops match the filter, show empty state
      if (filteredCrops.length === 0 && selectedCropFilter !== 'All') {
        Alert.alert('Info', `${cropFilterOptions.find(opt => opt.id === selectedCropFilter)?.labelUr || selectedCropFilter} فصل اس زمین پر نہیں ملی`);
      }
      
      setSelectedLandData({
        landInfo: response.land_info,
        crops: filteredCrops,
        seasonSummary: response.season_summary,
        farmerName: farmerName,
        requestedSeason: 'All Seasons',
        totalCrops: filteredCrops.length,
        selectedCropFilter: selectedCropFilter
      });
      setShowLandCropsModal(true);
    } else {
      Alert.alert('Info', response.message || 'No crops found for this land');
    }
  } catch (error) {
    console.error('Error loading land crops:', error);
    Alert.alert('Error', 'Failed to load land crops data');
  } finally {
    setLoadingLandCrops(false);
  }
};

  const openGoogleMaps = () => {
    const lat = manualCoordinates.lat || areaCenterInfo?.center_latitude;
    const lng = manualCoordinates.lng || areaCenterInfo?.center_longitude;
    
    if (!lat || !lng) {
      Alert.alert('Error', 'No coordinates available');
      return;
    }
    
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Could not open Google Maps');
    });
  };

  const loadFarmerId = async () => {
    try {
      const savedFarmerId = await AsyncStorage.getItem('farmerId');
      if (savedFarmerId) {
        setFarmerId(parseInt(savedFarmerId));
      }
    } catch (error) {
      console.error('Error loading farmer ID:', error);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedArea('');
    setSelectedZone('');
    setSelectedSoilType('');
    setSelectedSeason('');
    setAreaSearch('');
    setShowCityDropdown(false);
    setAreaCenterInfo(null);
    setManualCoordinates({ lat: '', lng: '' });
    setNearbyLands([]);
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setShowAreaDropdown(false);
    setAreaSearch('');
    setNearbyLands([]);
  };

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    setShowSeasonDropdown(false);
  };

  const handleAddLand = () => {
    if (!selectedCity || !selectedArea || !selectedZone || !areaSize || !selectedAreaUnit || !selectedSoilType) {
      Alert.alert('Error', 'Please fill all land details');
      return;
    }

    const lat = manualCoordinates.lat ? parseFloat(manualCoordinates.lat) : 
                (areaCenterInfo?.center_latitude || null);
    const lng = manualCoordinates.lng ? parseFloat(manualCoordinates.lng) : 
                (areaCenterInfo?.center_longitude || null);

    const newLand = {
      id: Date.now().toString(),
      city: selectedCity,
      area: selectedArea,
      zone: selectedZone,
      areaSize: parseFloat(areaSize),
      areaUnit: selectedAreaUnit,
      soilType: selectedSoilType,
      season: selectedSeason,
      latitude: lat,
      longitude: lng,
    };

    setLands([...lands, newLand]);
    
    setSelectedCity('');
    setSelectedArea('');
    setSelectedZone('');
    setAreaSize('');
    setSelectedAreaUnit('');
    setSelectedSoilType('');
    setSelectedSeason('');
    setAreaCenterInfo(null);
    setManualCoordinates({ lat: '', lng: '' });
    setNearbyLands([]);
    
    Alert.alert('Success', 'Land added to list!');
  };

  const handleEditLand = (id) => {
    const landToEdit = lands.find(land => land.id === id);
    if (landToEdit) {
      setSelectedCity(landToEdit.city);
      setSelectedArea(landToEdit.area);
      setSelectedZone(landToEdit.zone);
      setAreaSize(landToEdit.areaSize.toString());
      setSelectedAreaUnit(landToEdit.areaUnit);
      setSelectedSoilType(landToEdit.soilType);
      setSelectedSeason(landToEdit.season || '');
      
      if (landToEdit.latitude && landToEdit.longitude) {
        setManualCoordinates({
          lat: landToEdit.latitude.toString(),
          lng: landToEdit.longitude.toString()
        });
      }
      
      handleDeleteLand(id);
    }
  };

  const handleDeleteLand = (id) => {
    setLands(lands.filter(land => land.id !== id));
  };

  const handleSaveLands = async () => {
    if (lands.length === 0) {
      Alert.alert('Error', 'Please add at least one land');
      return;
    }

    if (!farmerId) {
      Alert.alert('Error', 'Farmer ID not found');
      return;
    }

    setSaving(true);
    try {
      const landsData = {
        farmer_id: farmerId,
        lands: lands.map(land => ({
          city: land.city,
          area: land.area,
          zone: land.zone,
          areaSize: land.areaSize,
          areaUnit: land.areaUnit,
          soilType: land.soilType,
          season: land.season,
          latitude: land.latitude,
          longitude: land.longitude,
        }))
      };

      const response = await farmerAPI.addLandDetails(landsData);
      
      if (response.success) {
        if (route.params?.onLandsAdded) {
          route.params.onLandsAdded();
        }
        
        Alert.alert('Success', 'Lands saved successfully!');
        navigation.goBack();
        
      } else {
        Alert.alert('Error', response.message || 'Failed to save lands');
      }
      
    } catch (error) {
      console.error('Error saving lands:', error);
      Alert.alert('Error', error.message || 'Failed to save lands');
    } finally {
      setSaving(false);
    }
  };

  // Land Crops Modal
  // Land Crops Modal - FIXED
const LandCropsModal = () => {
  if (!selectedLandData) return null;
  
  const { landInfo, crops, seasonSummary, farmerName, requestedSeason, totalCrops, selectedCropFilter } = selectedLandData;
  
  // Filter crops by season (client-side)
  const getSeasonFilteredCrops = () => {
    if (selectedCropSeasonFilter === 'All') return crops;
    return crops.filter(crop => crop.season === selectedCropSeasonFilter);
  };
  
  const seasonFilteredCrops = getSeasonFilteredCrops();
  const selectedCropLabel = cropFilterOptions.find(opt => opt.id === selectedCropFilter)?.labelUr || 'تمام فصلیں';
  
  return (
    <Modal visible={showLandCropsModal} transparent animationType="slide">
      <View style={styles.fullModalContainer}>
        <View style={[styles.landCropsModalContent, { height: height * 0.8 }]}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{farmerName}{getText("'s Land", ' کی زمین')}</Text>
              {selectedCropFilter && selectedCropFilter !== 'All' && (
                <Text style={styles.cropFilterBadge}>
                  🌾 فلٹر: {selectedCropLabel} ({totalCrops} {getText('crops', 'فصلیں')})
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => {
              setShowLandCropsModal(false);
              setSelectedLandData(null);
              setSelectedCropSeasonFilter('All');
            }}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {/* Season Filter Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{getText('Season Filter', 'موسم فلٹر')}</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowCropSeasonDropdown(true)}
            >
              <Text style={styles.dropdownText}>
                {cropSeasonFilterOptions.find(opt => opt.id === selectedCropSeasonFilter)?.labelUr || 'تمام موسم'}
              </Text>
              <Icon name="arrow-drop-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.landCropsScrollView}>
            {/* Land Info Section */}
            <View style={styles.landInfoSection}>
              <Text style={styles.sectionSubtitle}>{getText('Land Details', 'زمین کی تفصیلات')}</Text>
              <View style={styles.infoRow}>
                <Icon name="place" size={14} color="#666" />
                <Text style={styles.infoText}>
                  {areaMap[landInfo.area] || landInfo.area}, {cityMap[landInfo.city] || landInfo.city} • {getZoneName(landInfo.zone)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="square-foot" size={14} color="#666" />
                <Text style={styles.infoText}>
                  {landInfo.area_size} {unitMap[landInfo.area_unit] || landInfo.area_unit} • {soilMap[landInfo.soil_type] || landInfo.soil_type}
                </Text>
              </View>
              {landInfo.farmer_phone && (
                <View style={styles.infoRow}>
                  <Icon name="phone" size={14} color="#666" />
                  <Text style={styles.infoText}>{landInfo.farmer_phone}</Text>
                </View>
              )}
            </View>
            
            {/* Season Summary */}
            <View style={styles.seasonSummarySection}>
              <Text style={styles.sectionSubtitle}>{getText('Season Summary', 'موسم کا خلاصہ')}</Text>
              <View style={styles.seasonBadges}>
                {seasonSummary.map((season, index) => (
                  <View key={index} style={styles.seasonBadge}>
                    <Text style={styles.seasonBadgeText}>
                      {season.season === 'Rabi' ? getText('Rabi', 'ربیع') : getText('Kharif', 'خریف')}: {season.crop_count} {getText('crops', 'فصلیں')}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={styles.selectedSeasonText}>
                {getText('Currently Viewing', 'فی الحال دیکھ رہے ہیں')}: <Text style={styles.seasonHighlight}>{requestedSeason === 'All Seasons' ? getText('All Seasons', 'تمام موسم') : requestedSeason}</Text>
              </Text>
            </View>
            
            {/* Crops List - Only filtered crops */}
            <View style={styles.cropsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionSubtitle}>
                  {getText('Crops', 'فصلیں')} ({seasonFilteredCrops.length})
                </Text>
              </View>
              
              {loadingLandCrops ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4CAF50" />
                  <Text style={styles.loadingText}>{getText('Loading crops...', 'فصلیں لوڈ ہو رہی ہیں...')}</Text>
                </View>
              ) : seasonFilteredCrops.length > 0 ? (
                seasonFilteredCrops.map((crop, index) => (
                  <View key={index} style={styles.cropCard}>
                    <View style={styles.cropHeader}>
                      <Text style={styles.cropName}>{crop.crop_name}</Text>
                      <View style={[
                        styles.seasonTag,
                        { backgroundColor: crop.season === 'Rabi' ? '#4CAF50' : '#FF9800' }
                      ]}>
                        <Text style={styles.seasonTagText}>{crop.season === 'Rabi' ? getText('Rabi', 'ربیع') : getText('Kharif', 'خریف')}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.cropDetails}>
                      <View style={styles.cropDetailRow}>
                        <Icon name="calendar-today" size={12} color="#666" />
                        <Text style={styles.cropDetailText}>
                          {getText('Sowing', 'بوائی')}: {crop.sowing_date} • {getText('Harvest', 'کٹائی')}: {crop.harvest_date}
                        </Text>
                      </View>
                      
                      {crop.yield_per_40kg && (
                        <View style={styles.cropDetailRow}>
                          <Icon name="trending-up" size={12} color="#666" />
                          <Text style={styles.cropDetailText}>
                            {getText('Yield', 'پیداوار')}: {crop.yield_per_40kg} {getText('per 40kg', 'فی 40 کلو')}
                          </Text>
                        </View>
                      )}
                      
                      {crop.fertilizer_used && (
                        <View style={styles.cropDetailRow}>
                          <Icon name="grass" size={12} color="#666" />
                          <Text style={styles.cropDetailText}>
                            {getText('Fertilizer', 'کھاد')}: {crop.fertilizer_used}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    {crop.activities && crop.activities.length > 0 && (
                      <View style={styles.activitiesSection}>
                        <Text style={styles.activitiesTitle}>
                          {getText('Activities', 'سرگرمیاں')} ({crop.total_activities})
                        </Text>
                        {crop.activities.slice(0, 3).map((activity, idx) => (
                          <View key={idx} style={styles.activityItem}>
                            <View style={styles.activityHeader}>
                              <Text style={styles.activityType}>{activity.activity_type}</Text>
                              <Text style={styles.activityDate}>{activity.activity_date}</Text>
                            </View>
                            <Text style={styles.activityDesc}>{activity.description}</Text>
                            {activity.chemical_or_fertilizer_used && (
                              <Text style={styles.activityChemical}>
                                {getText('Used', 'استعمال')}: {activity.chemical_or_fertilizer_used}
                              </Text>
                            )}
                          </View>
                        ))}
                        {crop.total_activities > 3 && (
                          <Text style={styles.viewMoreText}>
                            + {crop.total_activities - 3} {getText('more activities', 'مزید سرگرمیاں')}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Icon name="grass" size={40} color="#ccc" />
                  <Text style={styles.emptyText}>
                    {selectedCropFilter !== 'All' 
                      ? `${selectedCropLabel} ${getText('crop not found on this land', 'فصل اس زمین پر نہیں ملی')}`
                      : getText('No crops found', 'کوئی فصل نہیں ملی')}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => {
                setShowLandCropsModal(false);
                setSelectedLandData(null);
              }}
            >
              <Text style={styles.closeModalButtonText}>{getText('Close', 'بند کریں')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

  // ✅ NEARBY MAP MODAL - WITH CLIENT-SIDE FILTERING
  const NearbyMapModal = () => {
    const filteredLands = getFilteredNearbyLands();
    const selectedCropLabel = cropFilterOptions.find(opt => opt.id === selectedCropFilter)?.labelUr || 'تمام فصلیں';
    
    return (
      <Modal visible={showNearbyMap} transparent animationType="slide">
        <View style={styles.fullModalContainer}>
          <View style={[styles.mapModalContent, { height: height * 0.85 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getText('Nearby Lands in', 'قریبی زمینیں')} {areaMap[selectedArea] || selectedArea}</Text>
              <TouchableOpacity onPress={() => {
                setShowNearbyMap(false);
                setSelectedZoneFilter('All');
                setSelectedCropFilter('All');
              }}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.mapSubtitle}>
              📍 {areaMap[selectedArea] || selectedArea} - {searchRadius}{getText('km', 'کلومیٹر')} {getText('Radius', 'دائرہ')} | {filteredLands.length} / {nearbyLands.length} {getText('Lands Found', 'زمینیں ملیں')}
              {selectedCropFilter !== 'All' && ` | ${getText('Filter', 'فلٹر')}: ${selectedCropLabel}`}
            </Text>
            
            {/* DYNAMIC RADIUS INPUT */}
            <View style={styles.radiusInputContainer}>
              <View style={styles.radiusInputRow}>
                <Icon name="radar" size={20} color="#4CAF50" />
                <Text style={styles.radiusLabel}>{getText('Search Radius', 'تلاش کا دائرہ')}:</Text>
                <TextInput
                  style={styles.radiusInput}
                  value={searchRadius}
                  onChangeText={setSearchRadius}
                  keyboardType="numeric"
                  placeholder={getText('Enter any radius (km)', 'دائرہ درج کریں (کلومیٹر)')}
                  placeholderTextColor="#999"
                />
                <Text style={styles.radiusUnit}>{getText('km', 'کلومیٹر')}</Text>
                <TouchableOpacity 
                  style={styles.applyRadiusButton}
                  onPress={getNearbyLands}
                  disabled={loadingNearby}
                >
                  <Text style={styles.applyRadiusText}>{getText('Apply', 'لگائیں')}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.radiusHint}>
                💡 {getText('You can use any number - 3, 5, 6.5, 7, 10, 12.3, 15, 20 km', 'آپ کوئی بھی نمبر استعمال کر سکتے ہیں - 3, 5, 6.5, 7, 10, 12.3, 15, 20 کلومیٹر')}
              </Text>
            </View>
            
            {/* ZONE FILTER DROPDOWN */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{getText('Zone Filter', 'زون فلٹر')}</Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setShowZoneFilterDropdown(true)}
              >
                <Text style={styles.dropdownText}>
                  {zoneFilterOptions.find(opt => opt.id === selectedZoneFilter)?.labelUr || 'تمام زونز'}
                </Text>
                <Icon name="arrow-drop-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* CROP FILTER DROPDOWN - CLIENT SIDE */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{getText('Crop Filter', 'فصل فلٹر')}</Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setShowCropFilterDropdown(true)}
              >
                <Text style={styles.dropdownText}>
                  {selectedCropLabel}
                </Text>
                <Icon name="arrow-drop-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            {loadingNearby ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>{getText('Loading nearby lands...', 'قریبی زمینیں لوڈ ہو رہی ہیں...')}</Text>
              </View>
            ) : (
              <View style={styles.simpleListContainer}>
                <FlatList
                  data={filteredLands}
                  keyExtractor={(item, index) => `${item.land_id}_${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.landCard}
                      onPress={() => getLandCrops(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.landCardHeader}>
                        <Text style={styles.landCardName}>{item.farmer_name}</Text>
                        <View style={styles.distanceBadge}>
                          <Icon name="location-on" size={12} color="white" />
                          <Text style={styles.distanceText}>{item.distance_km} {getText('km', 'کلومیٹر')}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.landDetails}>
                        <View style={styles.detailRow}>
                          <Icon name="place" size={14} color="#666" />
                          <Text style={styles.detailText}>{areaMap[item.area_name] || item.area_name}, {cityMap[item.city_name] || item.city_name}</Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                          <Icon name="square-foot" size={14} color="#666" />
                          <Text style={styles.detailText}>{item.area_size} {unitMap[item.area_unit] || item.area_unit}</Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                          <Icon name="grass" size={14} color="#666" />
                          <Text style={styles.detailText}>{soilMap[item.soil_type] || item.soil_type}</Text>
                        </View>
                        
                        {item.latest_crop && (
                          <View style={styles.detailRow}>
                            <Icon name="agriculture" size={14} color="#4CAF50" />
                            <Text style={[styles.detailText, { color: '#4CAF50', fontWeight: 'bold' }]}>
                              🌾 {item.latest_crop}
                            </Text>
                          </View>
                        )}
                        
                        {item.farmer_phone && (
                          <View style={styles.detailRow}>
                            <Icon name="phone" size={14} color="#666" />
                            <Text style={styles.detailText}>{item.farmer_phone}</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Icon name="landscape" size={50} color="#ccc" />
                      <Text style={styles.emptyText}>
                        {selectedCropFilter !== 'All' 
                          ? `${getText('No lands found with', 'کوئی زمین نہیں ملی جس میں')} ${selectedCropLabel} ${getText('crop', 'فصل لگی ہو')}`
                          : getText('No nearby lands found', 'کوئی قریبی زمین نہیں ملی')}
                      </Text>
                    </View>
                  }
                />
              </View>
            )}
            
            <View style={styles.mapActions}>
              <TouchableOpacity 
                style={styles.viewInMapsButton}
                onPress={openGoogleMaps}
              >
                <Icon name="map" size={18} color="white" />
                <Text style={styles.viewInMapsButtonText}>{getText('View in Google Maps', 'گوگل میپس میں دیکھیں')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.closeMapButton}
                onPress={() => setShowNearbyMap(false)}
              >
                <Text style={styles.closeMapButtonText}>{getText('Close', 'بند کریں')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Coordinates Modal
  const CoordinatesModal = () => (
    <Modal visible={showCoordinatesModal} transparent animationType="slide">
      <View style={styles.fullModalContainer}>
        <View style={[styles.coordinatesModalContent, { height: height * 0.5 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{getText('Set Coordinates', 'کوآرڈینیٹس سیٹ کریں')}</Text>
            <TouchableOpacity onPress={() => setShowCoordinatesModal(false)}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.coordinatesScrollView}>
            <Text style={styles.coordinatesNote}>
              {getText('Enter latitude and longitude for your land location', 'اپنی زمین کے لیے عرض البلد اور طول البلد درج کریں')}
            </Text>
            
            <View style={styles.coordinateInputGroup}>
              <Text style={styles.coordinateLabel}>{getText('Latitude', 'عرض البلد')}</Text>
              <TextInput
                style={styles.coordinateInput}
                placeholder="e.g., 33.200000"
                value={manualCoordinates.lat}
                onChangeText={(text) => setManualCoordinates(prev => ({ ...prev, lat: text }))}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.coordinateInputGroup}>
              <Text style={styles.coordinateLabel}>{getText('Longitude', 'طول البلد')}</Text>
              <TextInput
                style={styles.coordinateInput}
                placeholder="e.g., 73.140000"
                value={manualCoordinates.lng}
                onChangeText={(text) => setManualCoordinates(prev => ({ ...prev, lng: text }))}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
            
            {areaCenterInfo?.success && (
              <TouchableOpacity 
                style={styles.autoFillButton}
                onPress={() => {
                  if (areaCenterInfo.center_latitude && areaCenterInfo.center_longitude) {
                    setManualCoordinates({
                      lat: areaCenterInfo.center_latitude.toString(),
                      lng: areaCenterInfo.center_longitude.toString()
                    });
                    Alert.alert('Success', 'Coordinates set from area center');
                  }
                }}
              >
                <Icon name="location-on" size={18} color="white" />
                <Text style={styles.autoFillButtonText}>{getText('Use Area Center Coordinates', 'علاقے کے مرکزی کوآرڈینیٹس استعمال کریں')}</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.currentCoordinates}>
              <Text style={styles.currentCoordinatesTitle}>{getText('Current Coordinates', 'موجودہ کوآرڈینیٹس')}:</Text>
              <Text style={styles.currentCoordinatesValue}>
                {manualCoordinates.lat && manualCoordinates.lng 
                  ? `${manualCoordinates.lat}, ${manualCoordinates.lng}`
                  : getText('Not set', 'سیٹ نہیں')}
              </Text>
            </View>
          </ScrollView>
          
          <View style={styles.coordinatesModalActions}>
            <TouchableOpacity 
              style={styles.cancelCoordinatesButton}
              onPress={() => setShowCoordinatesModal(false)}
            >
              <Text style={styles.cancelCoordinatesButtonText}>{getText('Cancel', 'منسوخ')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveCoordinatesButton}
              onPress={() => {
                if (manualCoordinates.lat && manualCoordinates.lng) {
                  setShowCoordinatesModal(false);
                  Alert.alert('Success', 'Coordinates saved!');
                } else {
                  Alert.alert('Error', 'Please enter both latitude and longitude');
                }
              }}
            >
              <Icon name="check" size={18} color="white" />
              <Text style={styles.saveCoordinatesButtonText}>{getText('Save', 'محفوظ کریں')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Area Dropdown Modal
  const AreaDropdownModal = () => {
    const filteredAreas = areasData.filter(area => 
      !areaSearch || area.area_name.toLowerCase().includes(areaSearch.toLowerCase())
    );
    
    return (
      <Modal visible={showAreaDropdown} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowAreaDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.dropdownMenu, { height: height * 0.6 }]}>
              <Text style={styles.dropdownTitle}>{getText('Select Area in', 'علاقہ منتخب کریں')} {cityMap[selectedCity] || selectedCity}</Text>
              
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder={getText('Search area...', 'علاقہ تلاش کریں...')}
                  value={areaSearch}
                  onChangeText={setAreaSearch}
                  placeholderTextColor="#999"
                />
                <Icon name="search" size={20} color="#666" />
              </View>
              
              <ScrollView style={styles.dropdownScrollView}>
                {loadingAreas ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#4CAF50" />
                    <Text style={styles.loadingText}>{getText('Loading areas...', 'علاقے لوڈ ہو رہے ہیں...')}</Text>
                  </View>
                ) : filteredAreas.length > 0 ? (
                  filteredAreas.map((area, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => handleAreaSelect(area.area_name)}
                    >
                      <View style={styles.areaItemContent}>
                        <Text style={styles.dropdownItemText}>{areaMap[area.area_name] || area.area_name}</Text>
                        <Text style={styles.areaZoneText}>{area.description}</Text>
                      </View>
                      <Icon name="chevron-right" size={20} color="#999" />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>{getText('No areas found', 'کوئی علاقہ نہیں ملا')}</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
         
          <View style={styles.landForm}>
            {/* FORM SECTION */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>{getText('Land Information', 'زمین کی معلومات')}</Text>
              
              {/* City */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{getText('City', 'شہر')}</Text>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => setShowCityDropdown(true)}
                >
                  <Text style={[styles.dropdownText, !selectedCity && { color: '#999' }]}>
                    {selectedCity ? (cityMap[selectedCity] || selectedCity) : getText('Select District', 'ضلع منتخب کریں')}
                  </Text>
                  <Icon name="arrow-drop-down" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Area */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{getText('Area', 'علاقہ')}</Text>
                <TouchableOpacity 
                  style={[styles.dropdownButton, !selectedCity && styles.disabledDropdown]}
                  onPress={() => selectedCity && setShowAreaDropdown(true)}
                  disabled={!selectedCity}
                >
                  <Text style={[styles.dropdownText, !selectedArea && { color: '#999' }]}>
                    {selectedArea ? (areaMap[selectedArea] || selectedArea) : (selectedCity ? getText('Select Area', 'علاقہ منتخب کریں') : getText('Select District First', 'پہلے ضلع منتخب کریں'))}
                  </Text>
                  <Icon name="arrow-drop-down" size={20} color={selectedCity ? "#666" : "#ccc"} />
                </TouchableOpacity>
              </View>

              {/* Zone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{getText('Zone', 'زون')}</Text>
                <View style={styles.zoneDisplay}>
                  <Text style={styles.zoneValue}>{getZoneName(selectedZone)}</Text>
                </View>
              </View>

              {/* Area Size */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{getText('Area Size', 'رقبہ کا سائز')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={getText('e.g., 10', 'مثال: 10')}
                  value={areaSize}
                  onChangeText={setAreaSize}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Area Unit */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{getText('Area Unit', 'رقبہ کی اکائی')}</Text>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => setShowAreaUnitDropdown(true)}
                >
                  <Text style={[styles.dropdownText, !selectedAreaUnit && { color: '#999' }]}>
                    {selectedAreaUnit ? (unitMap[selectedAreaUnit] || selectedAreaUnit) : getText('Select Area Unit', 'یونٹ منتخب کریں')}
                  </Text>
                  <Icon name="arrow-drop-down" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Soil Type */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{getText('Soil Type', 'مٹی کی قسم')}</Text>
                <TouchableOpacity 
                  style={[styles.dropdownButton, !selectedCity && styles.disabledDropdown]}
                  onPress={() => selectedCity && setShowSoilTypeDropdown(true)}
                  disabled={!selectedCity}
                >
                  <Text style={[styles.dropdownText, !selectedSoilType && { color: '#999' }]}>
                    {selectedSoilType ? (soilMap[selectedSoilType] || selectedSoilType) : (selectedCity ? getText('Select Soil Type', 'مٹی کی قسم منتخب کریں') : getText('Select District First', 'پہلے ضلع منتخب کریں'))}
                  </Text>
                  <Icon name="arrow-drop-down" size={20} color={selectedCity ? "#666" : "#ccc"} />
                </TouchableOpacity>
              </View>

            </View>

            {/* LOCATION SECTION */}
            <View style={styles.formSection}>
              <View style={styles.locationHeader}>
                <Text style={styles.sectionTitle}>{getText('Location', 'مقام')}</Text>
                <TouchableOpacity 
                  style={styles.googleMapsButton}
                  onPress={openGoogleMaps}
                  disabled={!selectedArea}
                >
                  <Icon name="map" size={16} color="white" />
                  <Text style={styles.googleMapsButtonText}>{getText('View in Map', 'نقشے میں دیکھیں')}</Text>
                </TouchableOpacity>
              </View>
              
              {/* Nearby Lands Button */}
              <TouchableOpacity 
                style={styles.nearbyButton}
                onPress={getNearbyLands}
                disabled={loadingNearby}
              >
                {loadingNearby ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon name="list" size={18} color="white" />
                    <Text style={styles.nearbyButtonText}>
                      {getText('Show Nearby Lands List', 'قریبی زمینیں دیکھیں')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Add Land Button */}
            <TouchableOpacity 
              style={styles.addLandButton}
              onPress={handleAddLand}
              disabled={loading}
            >
              <Icon name="add-circle" size={24} color="white" />
              <Text style={styles.addLandButtonText}>{getText('Add Land', 'زمین شامل کریں')}</Text>
            </TouchableOpacity>
          </View>

          {/* Lands List */}
          {lands.length > 0 && (
            <View style={styles.landsList}>
              <View style={styles.landsListHeader}>
                <Text style={styles.sectionTitle}>{getText('Added Lands', 'شامل کردہ زمینیں')} ({lands.length})</Text>
                <TouchableOpacity onPress={() => setLands([])}>
                  <Text style={styles.clearAllText}>{getText('Clear All', 'سب صاف کریں')}</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={lands}
                renderItem={({ item }) => (
                  <View style={styles.landItem}>
                    <View style={styles.landInfo}>
                      <Text style={styles.landText}>
                        <Text style={styles.landLabel}>📍 </Text>
                        {areaMap[item.area] || item.area}, {cityMap[item.city] || item.city}
                      </Text>
                      <Text style={styles.landText}>
                        <Text style={styles.landLabel}>📏 </Text>
                        {item.areaSize} {unitMap[item.areaUnit] || item.areaUnit} • {getZoneName(item.zone)}
                      </Text>
                      <Text style={styles.landText}>
                        <Text style={styles.landLabel}>🌱 </Text>
                        {soilMap[item.soilType] || item.soilType}
                      </Text>
                      {item.season && (
                        <Text style={styles.landText}>
                          <Text style={styles.landLabel}>🌾 </Text>
                          {getText('Season', 'موسم')}: {item.season === 'Rabi' ? getText('Rabi', 'ربیع') : getText('Kharif', 'خریف')}
                        </Text>
                      )}
                      {item.latitude && item.longitude && (
                        <Text style={styles.landCoordinates}>
                          <Text style={styles.landLabel}>📍 </Text>
                          {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                        </Text>
                      )}
                    </View>
                    <View style={styles.landActions}>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => handleEditLand(item.id)}
                      >
                        <Icon name="edit" size={18} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteLand(item.id)}
                      >
                        <Icon name="delete" size={18} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Save Button */}
          {lands.length > 0 && (
            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.disabledButton]} 
              onPress={handleSaveLands}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Icon name="save" size={24} color="white" />
                  <Text style={styles.saveButtonText}>{getText('SAVE ALL LANDS', 'تمام زمینیں محفوظ کریں')} ({lands.length})</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* MODALS */}
      <LandCropsModal />
      <NearbyMapModal />
      <CoordinatesModal />
      <AreaDropdownModal />

      {/* City Dropdown */}
      <Modal visible={showCityDropdown} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowCityDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              <Text style={styles.dropdownTitle}>{getText('Select District', 'ضلع منتخب کریں')}</Text>
              <ScrollView style={styles.dropdownScrollView}>
                {cities.map((city, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => handleCitySelect(city)}
                  >
                    <Text style={styles.dropdownItemText}>{cityMap[city] || city}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Area Unit Dropdown */}
      <Modal visible={showAreaUnitDropdown} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowAreaUnitDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              <Text style={styles.dropdownTitle}>{getText('Select Area Unit', 'یونٹ منتخب کریں')}</Text>
              <ScrollView style={styles.dropdownScrollView}>
                {areaUnits.map((unit, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedAreaUnit(unit);
                      setShowAreaUnitDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{unitMap[unit] || unit}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Soil Type Dropdown */}
      <Modal visible={showSoilTypeDropdown} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowSoilTypeDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              <Text style={styles.dropdownTitle}>{getText('Select Soil Type', 'مٹی کی قسم منتخب کریں')}</Text>
              <ScrollView style={styles.dropdownScrollView}>
                {availableSoilTypes.map((soil, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedSoilType(soil);
                      setShowSoilTypeDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{soilMap[soil] || soil}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Season Dropdown */}
      <Modal visible={showSeasonDropdown} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowSeasonDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              <Text style={styles.dropdownTitle}>{getText('Select Season', 'موسم منتخب کریں')}</Text>
              <ScrollView style={styles.dropdownScrollView}>
                {seasonsWithDates.map((season, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownItem,
                      selectedSeason === season.name && { backgroundColor: '#E8F5E9' }
                    ]}
                    onPress={() => handleSeasonSelect(season.name)}
                  >
                    <View>
                      <Text style={styles.dropdownItemText}>{season.name === 'Rabi' ? getText('Rabi', 'ربیع') : getText('Kharif', 'خریف')}</Text>
                      <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                        {season.from} - {season.to}
                      </Text>
                    </View>
                    {selectedSeason === season.name && (
                      <Icon name="check" size={20} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Zone Filter Dropdown */}
      <Modal visible={showZoneFilterDropdown} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowZoneFilterDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              <Text style={styles.dropdownTitle}>{getText('Select Zone Filter', 'زون فلٹر منتخب کریں')}</Text>
              <ScrollView style={styles.dropdownScrollView}>
                {zoneFilterOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownItem,
                      selectedZoneFilter === option.id && { backgroundColor: '#E8F5E9' }
                    ]}
                    onPress={() => {
                      setSelectedZoneFilter(option.id);
                      setShowZoneFilterDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{option.labelUr}</Text>
                    {selectedZoneFilter === option.id && (
                      <Icon name="check" size={20} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Crop Season Filter Dropdown */}
      <Modal visible={showCropSeasonDropdown} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowCropSeasonDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              <Text style={styles.dropdownTitle}>{getText('Select Season Filter', 'موسم فلٹر منتخب کریں')}</Text>
              <ScrollView style={styles.dropdownScrollView}>
                {cropSeasonFilterOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownItem,
                      selectedCropSeasonFilter === option.id && { backgroundColor: '#E8F5E9' }
                    ]}
                    onPress={() => {
                      setSelectedCropSeasonFilter(option.id);
                      setShowCropSeasonDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{option.labelUr}</Text>
                    {selectedCropSeasonFilter === option.id && (
                      <Icon name="check" size={20} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ✅ CROP FILTER DROPDOWN - CLIENT SIDE */}
      <Modal visible={showCropFilterDropdown} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowCropFilterDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              <Text style={styles.dropdownTitle}>{getText('Select Crop Filter', 'فصل فلٹر منتخب کریں')}</Text>
              <ScrollView style={styles.dropdownScrollView}>
                {cropFilterOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownItem,
                      selectedCropFilter === option.id && { backgroundColor: '#E8F5E9' }
                    ]}
                    onPress={() => {
                      setSelectedCropFilter(option.id);
                      setShowCropFilterDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{option.labelUr}</Text>
                    {selectedCropFilter === option.id && (
                      <Icon name="check" size={20} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
    textAlign: 'right',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    textAlign: 'right',
  },
  landForm: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  disabledDropdown: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  zoneDisplay: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  zoneValue: {
    fontSize: 16,
    color: '#1b5e20',
    fontWeight: '600',
    textAlign: 'right',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  googleMapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  googleMapsButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  nearbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  nearbyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  radiusInputContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  radiusInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radiusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  radiusInput: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    textAlign: 'center',
  },
  radiusUnit: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  applyRadiusButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyRadiusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  radiusHint: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  mapModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  simpleListContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  landCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  landCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  landCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    flex: 1,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  landDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    textAlign: 'right',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  mapActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  viewInMapsButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  viewInMapsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeMapButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeMapButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  coordinatesModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  coordinatesScrollView: {
    flex: 1,
  },
  coordinatesNote: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  coordinateInputGroup: {
    marginBottom: 15,
  },
  coordinateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  coordinateInput: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  autoFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    gap: 8,
  },
  autoFillButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  currentCoordinates: {
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  currentCoordinatesTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'right',
  },
  currentCoordinatesValue: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    fontFamily: 'monospace',
    textAlign: 'right',
  },
  coordinatesModalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  cancelCoordinatesButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelCoordinatesButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveCoordinatesButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  saveCoordinatesButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    maxHeight: 400,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  dropdownScrollView: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  areaItemContent: {
    flex: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  areaZoneText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'right',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  noDataContainer: {
    padding: 30,
    alignItems: 'center',
  },
  noDataText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  landsList: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  landsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  clearAllText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
  },
  landItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  landInfo: {
    flex: 1,
  },
  landText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    textAlign: 'right',
  },
  landLabel: {
    color: '#666',
    fontWeight: '600',
  },
  landCoordinates: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'right',
  },
  landActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addLandButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e7d32de',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  fullModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  landCropsModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  cropFilterBadge: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    textAlign: 'center',
  },
  landCropsScrollView: {
    flex: 1,
  },
  landInfoSection: {
    backgroundColor: '#f0f7ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'right',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'flex-end',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    textAlign: 'right',
    flex: 1,
  },
  seasonSummarySection: {
    backgroundColor: '#fff8e1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffe082',
  },
  seasonBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
    justifyContent: 'flex-end',
  },
  seasonBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  seasonBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedSeasonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  seasonHighlight: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  cropsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cropCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cropName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    flex: 1,
    textAlign: 'right',
  },
  seasonTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  seasonTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cropDetails: {
    marginBottom: 10,
  },
  cropDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'flex-end',
  },
  cropDetailText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 6,
    textAlign: 'right',
  },
  activitiesSection: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  activitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'right',
  },
  activityItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
  },
  activityDesc: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
    textAlign: 'right',
  },
  activityChemical: {
    fontSize: 11,
    color: '#777',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  viewMoreText: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 5,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  closeModalButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LandInputPage;