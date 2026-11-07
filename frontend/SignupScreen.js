
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
  FlatList,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, farmerAPI } from './api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import T from './localization/T';  // ✅ Smart Translation Component

const SignupScreen = ({ navigation }) => {
  // User basic info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  
  // Land details
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [selectedAreaUnit, setSelectedAreaUnit] = useState('');
  const [selectedSoilType, setSelectedSoilType] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  
  // ✅ NEW STATES FOR DYNAMIC DATA
  const [areasData, setAreasData] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [availableZones, setAvailableZones] = useState([]);
  const [availableSoilTypes, setAvailableSoilTypes] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [showAreaUnitDropdown, setShowAreaUnitDropdown] = useState(false);
  const [showSoilTypeDropdown, setShowSoilTypeDropdown] = useState(false);
  const [lands, setLands] = useState([]);

  // Sample data
  const cities = ['Rawalpindi', 'Lahore', 'Faisalabad', 'Multan', 'Gujrat', 'Sialkot'];
  const areaUnits = ['acres', 'canal'];
  
  // ✅ CITY-SPECIFIC SOIL TYPES
  const city_soil = {
    "RAWALPINDI": ["CLAY LOAM", "SILT LOAM"],
    "FAISALABAD": ["SANDY LOAM", "CLAY"],
    "LAHORE": ["LOAM", "CLAY LOAM"],
    "MULTAN": ["SANDY CLAY", "LOAM"],
    "GUJRAT": ["LOAM", "SILT"],
    "SIALKOT": ["CLAY LOAM", "SANDY LOAM"]
  };

  // ✅ WHEN CITY CHANGES, LOAD ITS AREAS AND ZONES FROM API
  useEffect(() => {
    if (selectedCity) {
      loadAreasForCity(selectedCity);
      // Set soil types for selected city
      setAvailableSoilTypes(city_soil[selectedCity.toUpperCase()] || []);
    } else {
      setSelectedArea('');
      setSelectedZone('');
      setSelectedSoilType('');
      setAreasData([]);
      setAvailableZones([]);
      setAvailableSoilTypes([]);
      setFilteredAreas([]);
    }
  }, [selectedCity]);

  // ✅ WHEN AREA CHANGES, SET ITS ZONE
  useEffect(() => {
    if (selectedArea && areasData.length > 0) {
      const selectedAreaData = areasData.find(area => area.area_name === selectedArea);
      if (selectedAreaData) {
        setSelectedZone(selectedAreaData.zone_name || selectedAreaData.description);
      }
    }
  }, [selectedArea, areasData]);

  // ✅ LOAD AREAS AND ZONES FOR SELECTED CITY FROM API
  const loadAreasForCity = async (cityName) => {
    setLoadingAreas(true);
    try {
      const response = await farmerAPI.getAreasByCity(cityName);
      
      // Store areas data with zones
      setAreasData(response.areas);
      
      // ✅ EXTRACT ZONE: Try different possible field names
      const zones = [...new Set(response.areas.map(area => 
        area.zone_name || area.description || area.zone || 'Unknown Zone'
      ))];
      setAvailableZones(zones);
      
      // Auto-filter areas for current selection
      setFilteredAreas(response.areas.map(area => area.area_name));
      
      console.log(`✅ Loaded ${response.areas.length} areas for ${cityName}`);
      
    } catch (error) {
      console.error('Error loading areas:', error);
      Alert.alert('Error', 'Failed to load areas for this city');
      setAreasData([]);
      setAvailableZones([]);
      setFilteredAreas([]);
    } finally {
      setLoadingAreas(false);
    }
  };

  // ✅ FILTER AREAS BASED ON SEARCH (NOW USING API DATA)
  const getFilteredAreasList = () => {
    if (!selectedCity || areasData.length === 0) return [];
    
    const areaNames = areasData.map(area => area.area_name);
    
    if (areaSearch) {
      return areaNames.filter(area => 
        area.toLowerCase().includes(areaSearch.toLowerCase())
      );
    }
    
    return areaNames;
  };

  // ✅ HANDLE CITY SELECTION
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedArea('');
    setSelectedZone('');
    setSelectedSoilType('');
    setAreaSearch('');
    setShowCityDropdown(false);
  };

  // ✅ HANDLE AREA SELECTION
  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    
    // Auto-set zone based on selected area
    const selectedAreaData = areasData.find(a => a.area_name === area);
    if (selectedAreaData) {
      setSelectedZone(selectedAreaData.zone_name || selectedAreaData.description);
    }
    
    setShowAreaDropdown(false);
    setAreaSearch('');
  };

  const handleAddLand = () => {
    if (!selectedCity || !selectedArea || !selectedZone || !areaSize || !selectedAreaUnit || !selectedSoilType) {
      Alert.alert('Error', 'Please fill all land details');
      return;
    }

    const newLand = {
      id: Date.now().toString(),
      city: selectedCity,
      area: selectedArea,
      zone: selectedZone,
      areaSize: parseFloat(areaSize),
      areaUnit: selectedAreaUnit,
      soilType: selectedSoilType,
    };

    setLands([...lands, newLand]);
    
    // Reset form
    setSelectedCity('');
    setSelectedArea('');
    setSelectedZone('');
    setAreaSize('');
    setSelectedAreaUnit('');
    setSelectedSoilType('');
    setAreaSearch('');
    setAreasData([]);
    setAvailableZones([]);
    setAvailableSoilTypes([]);
    
    // ✅ Removed success popup - land shows in list automatically
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
      handleDeleteLand(id);
    }
  };

  const handleDeleteLand = (id) => {
    setLands(lands.filter(land => land.id !== id));
  };

  // ✅ FIXED: Signup function with AsyncStorage error handling
  const handleSignup = async () => {
    if (!name || !phone || !location || !password || lands.length === 0) {
      Alert.alert('Error', 'Please fill all fields and add at least one land');
      return;
    }

    setLoading(true);
    try {
      // Lands array ko backend ke required format mein convert karein
      const landsData = lands.map(land => ({
        city: land.city,
        area: land.area,
        zone: land.zone,
        areaSize: land.areaSize,
        areaUnit: land.areaUnit,
        soilType: land.soilType,
      }));

      console.log('📤 Sending signup data...');

      // Backend ko data bhejein
      const response = await authAPI.signup(
        name, 
        phone, 
        location, 
        password, 
        landsData
      );

      console.log('📥 Signup Response:', response);

      // ✅ Check for success and farmer_id
      if (response && response.farmer_id) {
        
        try {
          // ✅ Save farmer data to AsyncStorage
          console.log('💾 Saving to AsyncStorage...');
          
          await AsyncStorage.setItem('farmerId', response.farmer_id.toString());
          await AsyncStorage.setItem('accessToken', response.access_token || 'farmer-token');
          await AsyncStorage.setItem('farmerLocation', response.location);
          await AsyncStorage.setItem('farmerName', response.farmer_name);

          console.log('✅ Farmer data saved successfully');
          
          // ✅ Direct navigate without popup - Clear form & navigate
          setName('');
          setPhone('');
          setLocation('');
          setPassword('');
          setLands([]);
          
          navigation.navigate('Home', { 
            farmerLocation: response.location,
            farmerName: response.farmer_name
          });
          
        } catch (storageError) {
          console.error('❌ AsyncStorage Error:', storageError);
          // ✅ Direct navigate without popup
          setName('');
          setPhone('');
          setLocation('');
          setPassword('');
          setLands([]);
          navigation.navigate('Home', { 
            farmerLocation: response.location,
            farmerName: response.farmer_name
          });
        }
        
      } else {
        Alert.alert('Signup Failed', response?.message || 'Please try again');
      }
      
    } catch (error) {
      console.error('❌ Signup Error:', error);
      Alert.alert('Signup Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const renderLandItem = ({ item }) => (
    <View style={styles.landItem}>
      <View style={styles.landInfo}>
        <Text style={styles.landText}>City: {item.city}</Text>
        <Text style={styles.landText}>Area: {item.area}</Text>
        <Text style={styles.landText}>Zone: {item.zone}</Text>
        <Text style={styles.landText}>Size: {item.areaSize} {item.areaUnit}</Text>
        <Text style={styles.landText}>Soil: {item.soilType}</Text>
      </View>
      <View style={styles.landActions}>
        <TouchableOpacity onPress={() => handleEditLand(item.id)}>
          <Icon name="edit" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteLand(item.id)}>
          <Icon name="delete" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const DropdownModal = ({ 
    visible, 
    items, 
    onSelect, 
    onClose, 
    title, 
    searchable = false, 
    searchValue, 
    onSearchChange,
    loading = false 
  }) => (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownMenu}>
            <Text style={styles.dropdownTitle}>{title}</Text>
            
            {searchable && (
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchValue}
                onChangeText={onSearchChange}
                autoFocus={true}
                placeholderTextColor="#999"
              />
            )}
            
            <ScrollView style={styles.dropdownScrollView}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#4CAF50" />
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              ) : items.length > 0 ? (
                items.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No data available</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.content}>
          <T style={styles.title}>Create Account</T>
          
          {/* Basic Information */}
          <T style={styles.sectionTitle}>Basic Information</T>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!loading}
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              editable={!loading}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Location (City)"
              value={location}
              onChangeText={setLocation}
              editable={!loading}
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              editable={!loading}
              placeholderTextColor="#999"
            />
          </View>

          {/* Land Details */}
          <T style={styles.sectionTitle}>Land Details</T>
          <View style={styles.landForm}>
            
            {/* City Dropdown */}
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowCityDropdown(true)}
              disabled={loading}
            >
              <Text style={[styles.dropdownText, !selectedCity && { color: '#999' }]}>
                {selectedCity || 'Select District'}
              </Text>
              <Icon name="arrow-drop-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* Area Dropdown */}
            <TouchableOpacity 
              style={[
                styles.dropdownButton, 
                !selectedCity && styles.disabledDropdown
              ]}
              onPress={() => selectedCity && setShowAreaDropdown(true)}
              disabled={!selectedCity || loading}
            >
              <Text style={[styles.dropdownText, !selectedArea && { color: '#999' }]}>
                {selectedArea || (selectedCity ? 'Select Area' : 'Select District First')}
              </Text>
              <Icon name="arrow-drop-down" size={20} color={selectedCity ? "#666" : "#ccc"} />
            </TouchableOpacity>

            {/* Zone Display (Auto-filled from area selection) */}
            <View style={styles.zoneDisplay}>
              <T style={styles.zoneLabel}>Zone (Auto-selected):</T>
              <Text style={styles.zoneValue}>
                {selectedZone || 'Select area to see zone'}
              </Text>
            </View>

            {/* Area Size Input */}
            <TextInput
              style={styles.input}
              placeholder="Area Size"
              value={areaSize}
              onChangeText={setAreaSize}
              keyboardType="numeric"
              editable={!loading}
              placeholderTextColor="#999"
            />

            {/* Area Unit Dropdown */}
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowAreaUnitDropdown(true)}
              disabled={loading}
            >
              <Text style={[styles.dropdownText, !selectedAreaUnit && { color: '#999' }]}>
                {selectedAreaUnit || 'Select Area Unit'}
              </Text>
              <Icon name="arrow-drop-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* Soil Type Dropdown */}
            <TouchableOpacity 
              style={[
                styles.dropdownButton,
                !selectedCity && styles.disabledDropdown
              ]}
              onPress={() => selectedCity && setShowSoilTypeDropdown(true)}
              disabled={!selectedCity || loading}
            >
              <Text style={[styles.dropdownText, !selectedSoilType && { color: '#999' }]}>
                {selectedSoilType || (selectedCity ? 'Select Soil Type' : 'Select District First')}
              </Text>
              <Icon name="arrow-drop-down" size={20} color={selectedCity ? "#666" : "#ccc"} />
            </TouchableOpacity>

            {/* Add Land Button */}
            <TouchableOpacity 
              style={[styles.addButton, loading && styles.disabledButton]}
              onPress={handleAddLand}
              disabled={loading}
            >
              <Icon name="add" size={20} color="white" />
              <T style={styles.addButtonText}>Add Land</T>
            </TouchableOpacity>
          </View>

          {/* Lands List */}
          {lands.length > 0 && (
            <View style={styles.landsList}>
              <Text style={styles.sectionTitle}>Added Lands ({lands.length})</Text>
              <FlatList
                data={lands}
                renderItem={renderLandItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Register Button */}
          <TouchableOpacity 
            style={[styles.signupButton, (loading || lands.length === 0) && styles.disabledButton]} 
            onPress={handleSignup}
            disabled={loading || lands.length === 0}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <T style={styles.signupButtonText}>
                {lands.length === 0 ? 'ADD LAND FIRST' : 'REGISTER'}
              </T>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <T style={styles.loginText}>Already have an account? </T>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')} 
              disabled={loading}
            >
              <T style={styles.loginLink}>Login</T>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Dropdown Modals */}
      <DropdownModal
        visible={showCityDropdown}
        items={cities}
        onSelect={handleCitySelect}
        onClose={() => setShowCityDropdown(false)}
        title="Select City"
      />

      <DropdownModal
        visible={showAreaDropdown}
        items={getFilteredAreasList()}
        onSelect={handleAreaSelect}
        onClose={() => {
          setShowAreaDropdown(false);
          setAreaSearch('');
        }}
        title="Select Area"
        searchable={true}
        searchValue={areaSearch}
        onSearchChange={setAreaSearch}
        loading={loadingAreas}
      />

      <DropdownModal
        visible={showAreaUnitDropdown}
        items={areaUnits}
        onSelect={setSelectedAreaUnit}
        onClose={() => setShowAreaUnitDropdown(false)}
        title="Select Area Unit"
      />

      <DropdownModal
        visible={showSoilTypeDropdown}
        items={availableSoilTypes}
        onSelect={setSelectedSoilType}
        onClose={() => setShowSoilTypeDropdown(false)}
        title="Select Soil Type"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
    alignSelf: 'stretch',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  landForm: {
    width: '100%',
    marginBottom: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
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
  },
  zoneDisplay: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  zoneLabel: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  zoneValue: {
    fontSize: 16,
    color: '#1b5e20',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  landsList: {
    width: '100%',
    marginBottom: 20,
  },
  landItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
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
    marginBottom: 2,
  },
  landActions: {
    flexDirection: 'row',
    gap: 15,
  },
  signupButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    height: 50,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#555',
  },
  loginLink: {
    fontSize: 16,
    color: '#4CAF50',
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
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  dropdownScrollView: {
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default SignupScreen;