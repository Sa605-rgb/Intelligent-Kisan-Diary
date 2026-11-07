// // api.js
// const BASE_URL = 'http://127.0.0.1:8000'; // For Android emulator

// // Generic API call function
// export const apiCall = async (endpoint, method = 'GET', data = null) => {
//   try {
//     const url = `${BASE_URL}${endpoint}`;
//     const options = {
//       method,
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//     };

//     if (data && (method === 'POST' || method === 'PUT')) {
//       options.body = JSON.stringify(data);
//     }

//     console.log('API Request:', url, options);
//     const response = await fetch(url, options);
    
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(errorText || `HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw new Error(error.message || 'Network request failed');
//   }
// };

// // Auth APIs
// export const authAPI = {
//   login: (phone, password) => 
//     apiCall('/login', 'POST', { phone, password }),

//   signup: (name, phone, location, password) => 
//     apiCall('/signup', 'POST', { name, phone, location, password }),
// };

// // Crop APIs
// export const cropAPI = {
//   addCrop: (cropData) => 
//     apiCall('/inputcrops/add', 'POST', cropData),

//   getCropHistory: (cropName) => 
//     apiCall(`/api/crop/history?crop_name=${encodeURIComponent(cropName)}`),

//   getPesticideRecommendation: (cropName) => 
//     apiCall(`/recommend/pesticide/?crop_name=${encodeURIComponent(cropName)}`),

//   getFertilizerRecommendation: (cropName) => 
//     apiCall(`/recommend/fertilizer/?crop_name=${encodeURIComponent(cropName)}`),

//   getCropRecommendations: (location) => 
//     apiCall(`/recommend/crops-by-location?location=${encodeURIComponent(location)}`),
// };

// // Farmer APIs
// export const farmerAPI = {
//   getActivities: (farmerId) => 
//     apiCall(`/farmer/activities?farmer_id=${farmerId}`),

//   addActivity: (activityData) => 
//     apiCall('/farmer/add-activity', 'POST', activityData),

//   getLandDetails: (farmerId) => 
//     apiCall(`/farmer/land-details?farmer_id=${farmerId}`),
// };





// api.js
// IMPORTANT: Apne laptop ke actual IP address se replace karein
// Example: 'http://192.168.1.5:8000'


const BASE_URL = 'http://localhost:8000';

// Generic API call function
export const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    console.log('API Request:', url, options);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API Response:', url, result); // ✅ Log response
    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.message || 'Network request failed');
  }
};

// Auth APIs
export const authAPI = {
  login: (phone, password) => 
    apiCall('/unified-login', 'POST', { phone, password }),
  
  signup: (name, phone, location, password, lands) => 
     apiCall('/signup', 'POST', { name, phone, location, password, lands }),
  
  
  

};

// Crop APIs
export const cropAPI = {
  addCrop: (cropData) => 
    apiCall('/inputcrops/add', 'POST', cropData),
  // getCropRecommendations: (city) =>
  //   apiCall(`/api/recommend_crops?city=${encodeURIComponent(city)}`, 'GET'),
 
  getCropRecommendations: (city, season, soil) =>
      apiCall('/api/recommend', 'POST', { city, season, soil }),
 
  // ✅ NEW: BEST recommendation endpoint (ML + Database + SMOTE/NearMiss)
  getBestCropRecommendations: (city, season, soil) =>
    apiCall('/api/recommend_best', 'POST', { city, season, soil }),

  getCropHistory: (cropName) => 
    apiCall(`/api/crop/history?crop_name=${encodeURIComponent(cropName)}`),

  getPesticideRecommendation: (cropName) => 
    apiCall(`/recommend/pesticide/?crop_name=${encodeURIComponent(cropName)}`),

  getFertilizerRecommendation: (cropName) => 
    apiCall(`/recommend/fertilizer/?crop_name=${encodeURIComponent(cropName)}`),

  getLiveWeather: (cityName) => 
    apiCall(`/weather/${cityName}`, 'GET'),
  
};



// Farmer APIs
export const farmerAPI = {
  // Lands get karein
  getFarmerLands: (farmerId) => 
    apiCall(`/farmer/${farmerId}/lands`),
  
  // Land ki crops get karein
  getLandCrops: (farmerId, landId) => 
    apiCall(`/farmer/${farmerId}/land/${landId}/crops`),
  
  // Land par crop add karein
  addCropToLand: (farmerId, landId, cropData) => 
    apiCall(`/farmer/${farmerId}/land/${landId}/add-crop`, 'POST', cropData),
  addLandDetails: (landData) => 
      apiCall('/landdetails/add', 'POST', landData),

  
  // Crop recommendations get karein
  getCropRecommendations: (landId) => 
    apiCall(`/land/${landId}/crop-recommendations`),
  
  // Farmer ki crop history get karein
  getFarmerCropHistory: (farmerId) => 
    apiCall(`/farmer/${farmerId}/crop-history`),
  
  // Farmer ke reminders get karein
  getFarmerReminders: (farmerId) => 
    apiCall(`/farmer/${farmerId}/reminders`),
  
  // NEW: Lands with occupancy status get karein
  getFarmerLandsWithStatus: (farmerId) => 
    apiCall(`/farmer/${farmerId}/lands-with-status`),
  getAreasByCity: (cityName) => 
    apiCall(`/cities/${cityName}/areas`, 'GET'),
  getZones: () => 
    apiCall('/zones', 'GET'),
  
  // NEW: Empty lands get karein
  getEmptyLands: (farmerId) => 
    apiCall(`/farmer/${farmerId}/empty-lands`),
  
  // NEW: Add crop to first empty land
  addCropToEmptyLand: (farmerId, cropData) => 
    apiCall(`/farmer/${farmerId}/add-crop-to-empty-land`, 'POST', cropData),
  // ✅ NEW: Crops APIs
  getCrops: () => apiCall('/crops', 'GET'),
    addCrop: (cropData) => apiCall('/crops/add', 'POST', cropData),
  getCropsByCity: (cityName) => 
    apiCall(`/crops/by-city/${cityName}`, 'GET'),
  // ✅ Fertilizer APIs
  getFertilizers: () => apiCall('/fertilizers', 'GET'),
  getFertilizerTypes: () => apiCall('/fertilizer-types-from-data', 'GET'),
  getFertilizerApplicationMethods: () => apiCall('/application-methods-from-data', 'GET'),

  // ✅ Add single fertilizer
  addFertilizer: (fertilizerData, farmerId) =>
   apiCall('/inputfertilizer/add', 'POST', { 
    fertilizers: [fertilizerData],
    farmer_id: farmerId  // ✅ Yeh line add karo
  }),
  // ✅ Add multiple fertilizers (bulk insert)
  addMultipleFertilizers: (fertilizerList) =>
    apiCall('/inputfertilizer/add', 'POST', { fertilizers: fertilizerList }),
  getSuggestedFertilizers: (cropName) => 
    apiCall(`/crops/${cropName}/suggested-fertilizers`, 'GET'),

  // ✅ Pesticide APIs
  getPesticides: () => apiCall('/pesticides', 'GET'),
  getPesticideTypes: () => apiCall('/pesticide-types-from-data', 'GET'),
  getPesticideApplicationMethods: () => apiCall('/pesticide-application-methods-from-data', 'GET'),

  // ✅ Add single pesticide (using bulk endpoint)
  addPesticide: (pesticideData, farmerId) =>
    apiCall('/inputpesticide/add', 'POST', { 
      pesticides: [pesticideData], 
      farmer_id: farmerId  // ✅ Yeh line fix karo
    }),
  // ✅ Add multiple pesticides (bulk insert)
  addMultiplePesticides: (pesticideList) =>
    apiCall('/inputpesticide/add', 'POST', { pesticides: pesticideList }),
  getSuggestedPesticides: (cropName) => 
    apiCall(`/crops/${cropName}/suggested-pesticides`, 'GET'),
  // ✅ NEW: Admin Suggested Fertilizer Route
  getAdminSuggestedFertilizer: (cropName) => 
    apiCall(`/api/crops/${cropName}/admin-suggested-fertilizer`, 'GET'),
  getAdminSuggestedPesticide: (cropName) => 
    apiCall(`/api/crops/${cropName}/admin-suggested-pesticide`, 'GET'),

  
  addFarmActivity: (activityData) => 
    apiCall('/farm-activities/add', 'POST', activityData),
  getFarmerAllActivities: (farmerId) => 
    apiCall(`/farmer/${farmerId}/all-activities`, 'GET'),
  getCropActivities: (cropHistoryId) => 
    apiCall(`/crop-history/${cropHistoryId}/activities`, 'GET'),
  addCropActivity: (farmerId, activityData) => 
    apiCall(`/farmer/${farmerId}/activity`, 'POST', activityData),
  // ✅ Mark scheduled activity as completed
  markActivityCompleted: (activityId, actualDate) =>
   apiCall(`/crop-activities/${activityId}/mark-completed?actual_date=${actualDate}`, 'PUT'),

// ✅ Add actual activity (while keeping scheduled one)
  addActualActivity: (activityId, actualActivityData) =>
   apiCall(`/crop-activities/${activityId}/add-actual`, 'POST', actualActivityData),
  addCropActivity: (activityData) =>
    apiCall('/farm-activities/add', 'POST', activityData),
  // ✅ NEW: Update existing crop
  updateCrop: (cropHistoryId, cropData) => 
    apiCall(`/crop/${cropHistoryId}`, 'PUT', cropData),
  getProposedSchedule: (cropHistoryId) => 
    apiCall(`/crop/${cropHistoryId}/proposed-schedule`, 'GET'),
  
  confirmActivities: (cropHistoryId, activities) => 
    apiCall(`/crop/${cropHistoryId}/confirm-activities`, 'POST', { activities }),
  getCombinedSchedule: (cropHistoryId) => 
    apiCall(`/crop/${cropHistoryId}/combined-schedule`),
  // ✅ NEW: Mark activity as completed (database save)
  markActivityCompleted: (cropHistoryId, activityData) => 
    apiCall(`/crop-activities/${cropHistoryId}/mark-completed`, 'POST', activityData),
   getFarmerCurrentCrops: (farmerId) => 
    apiCall(`/farmer/${farmerId}/current-crops`, 'GET'),
  
  // ... existing getCropActivities already hai ...
  getCropActivities: (cropHistoryId) => 
    apiCall(`/crop-history/${cropHistoryId}/activities`, 'GET'),
  getCropSchedules: () => axios.get('/crop-schedules'),

  updateCropYieldOnly: (cropHistoryId, yieldValue) => 
    apiCall(`/crop/${cropHistoryId}/update-yield`, 'PUT', { 
      yield_per_40kg: yieldValue 
    }),
  
  // ✅ 2. ACTIVITY COMPLETION (Harvesting complete mark karne ke liye)
  updateActivityCompletion: (data) => 
    apiCall('/api/activities/complete', 'PUT', data),

  // yh wala kam area ka hai ky agr new area add krna ap ny 
  addNewArea: (cityName, areaData) => 
    apiCall(`/cities/${cityName}/add-area`, 'POST', areaData),
  
  updateAreaZone: (areaName, zoneData) => 
    apiCall(`/areas/${areaName}/update-zone`, 'PUT', zoneData),
   // ✅ NEW: Get nearby lands by area name (NEW ROUTE)
  getNearbyLandsByArea: (areaName, radiusKm = 5, excludeLandId = null, cropFilter = null) => {
    const params = new URLSearchParams();
    params.append('radius_km', radiusKm);
    if (excludeLandId) {
      params.append('exclude_land_id', excludeLandId);
    }
    if (cropFilter && cropFilter !== 'All') {
      params.append('crop_filter', cropFilter);
    }
    return apiCall(`/areas/${areaName}/nearby?${params.toString()}`, 'GET');
  },
  
  // ✅ NEW: Get area center point (NEW ROUTE)
  getAreaCenter: (areaName) => 
    apiCall(`/areas/${areaName}/center`, 'GET'),
  getLandSeasonCrops: (landId, season = null) => 
    apiCall(`/land/${landId}/season-crops${season ? `?season=${season}` : ''}`, 'GET'),
  };
  
//Land APIs  multiple lands



// api.js - Activity APIs
export const activityAPI = {
  // Get farmer's activities (private + public)
  getFarmerActivities: (farmerId) => 
    apiCall(`/farmer/${farmerId}/activities`),
  
  // Add new activity with privacy
  addFarmerActivity: (farmerId, activityData) => 
    apiCall(`/farmer/${farmerId}/activity`, 'POST', activityData),
  
  // Update activity privacy
  updateActivityPrivacy: (activityId, isPublic) => 
    apiCall(`/activity/${activityId}/privacy`, 'PUT', { is_public: isPublic }),
  
  // Get public feed
  getPublicFeed: () => 
    apiCall('/public/feed'),
  
  // Like an activity
 
  likeActivity: (activityId) =>  
    apiCall(`/activity/${activityId}/like`, 'POST'),
  // ✅ NEW: Get all activities of a crop by activity ID
  getCropActivitiesByActivity: (activityId) => 
    apiCall(`/activity/${activityId}/crop-activities`),
};
export const adminAPI = {
  getCropSchedules: () => 
    apiCall('/admin/crop-schedules', 'GET'),
  
  updateCropSchedules: (schedules) => 
    apiCall('/admin/crop-schedules', 'PUT', { schedules }),
  
  getAllFarmers: () => 
    apiCall('/admin/farmers', 'GET'),
  
  getFarmerDetails: (farmerId) => 
    apiCall(`/admin/farmer/${farmerId}`, 'GET'),
  
  getSystemStatistics: () => 
    apiCall('/admin/statistics', 'GET'),
  getFertilizers: () => 
    apiCall('/admin/fertilizers', 'GET'),
  
  addFertilizer: (fertilizer) => 
    apiCall('/admin/fertilizers', 'POST', fertilizer),
  
  // ✅ NEW: Pesticide Management  
  getPesticides: () => 
    apiCall('/admin/pesticides', 'GET'),
  
  addPesticide: (pesticide) => 
    apiCall('/admin/pesticides', 'POST', pesticide),
   // ✅ NEW: Fertilizer Market Rates APIs
  getFertilizerMarketRates: () => 
    apiCall('/fertilizers/market-rates/all', 'GET'),
  
  addFertilizerMarketRate: (marketRateData) => 
    apiCall('/fertilizers/add-market-rate', 'POST', marketRateData),
  
  // ✅ NEW: Pesticide Market Rates APIs
  getPesticideMarketRates: () => 
    apiCall('/pesticides/market-rates', 'GET'),
  
  addPesticideMarketRate: (marketRateData) => 
    apiCall('/pesticides/add-market-rate', 'POST', marketRateData),
  
  // ✅ NEW: Crop Market Rates APIs
  getCropMarketRates: () => 
    apiCall('/market-rates/crops', 'GET'),
  
  addCropMarketRate: (marketRateData) => 
    apiCall('/crops/add-market-rate', 'POST', marketRateData),
};