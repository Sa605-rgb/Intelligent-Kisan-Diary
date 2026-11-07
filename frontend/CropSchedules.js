import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { adminAPI, cropAPI } from './api';

const CropSchedules = ({ navigation }) => {
  const [cropRates, setCropRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Crop form states
  const [cropFormData, setCropFormData] = useState({
    cropName: '',
    seedType: ''
  });
  
  // Market Rate Form states
  const [marketRateFormData, setMarketRateFormData] = useState({
    selectedCrop: '',
    year: new Date().getFullYear().toString(),
    season: '',
    retailRate: '',
    wholesaleRate: ''
  });
  
  // Available seasons from existing data
  const [availableSeasons, setAvailableSeasons] = useState(['Kharif', 'Rabi', 'Zaid', 'Summer', 'Winter', 'Monsoon']);
  
  // Modal state
  const [showMarketRateModal, setShowMarketRateModal] = useState(false);
  
  const [cropLoading, setCropLoading] = useState(false);
  const [rateLoading, setRateLoading] = useState(false);
  const [cropErrors, setCropErrors] = useState({});
  const [rateErrors, setRateErrors] = useState({});
  
  const seedTypeRef = useRef();
  const seasonRef = useRef();
  const retailRateRef = useRef();
  const wholesaleRateRef = useRef();

  useEffect(() => {
    loadCropMarketRates();
  }, []);

  const loadCropMarketRates = async () => {
    try {
      setLoading(true);
      console.log('Loading crop market rates...');
      
      const response = await adminAPI.getCropMarketRates();
      
      console.log('Market Rates Response:', response);
      
      if (response.success) {
        if (Array.isArray(response.crop_rates)) {
          setCropRates(response.crop_rates);
          
          // Extract unique seasons from data
          const seasons = [...new Set(response.crop_rates.map(rate => rate.season))].filter(Boolean);
          if (seasons.length > 0) {
            setAvailableSeasons(prev => [...new Set([...prev, ...seasons])]);
          }
        } else {
          console.error('crop_rates is not an array:', response.crop_rates);
          setCropRates([]);
        }
      } else {
        Alert.alert('Error', 'Failed to load crop market rates');
        setCropRates([]);
      }
    } catch (error) {
      console.error('Error loading crop market rates:', error);
      Alert.alert('Error', 'Failed to load crop market rates');
      setCropRates([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCropMarketRates();
  };

  // Get available crops from rates
  const availableCrops = [...new Set(cropRates.map(rate => rate.crop_name))].filter(Boolean);

  // Group crop rates by crop name
  const groupedRates = Array.isArray(cropRates) ? cropRates.reduce((acc, rate) => {
    if (rate && rate.crop_name) {
      const cropName = rate.crop_name;
      if (!acc[cropName]) {
        acc[cropName] = [];
      }
      acc[cropName].push(rate);
    }
    return acc;
  }, {}) : {};

  // Format price for display
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // ✅ Crop form functions
  const validateCropForm = () => {
    const newErrors = {};
    
    if (!cropFormData.cropName.trim()) newErrors.cropName = 'Please enter crop name';
    if (!cropFormData.seedType.trim()) newErrors.seedType = 'Please enter seed type';

    setCropErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCropSubmit = async () => {
    if (!validateCropForm()) return;

    setCropLoading(true);

    try {
      const cropData = {
        name: cropFormData.cropName.trim(),
        seed_type: cropFormData.seedType.trim()
      };
      
      console.log('Adding crop:', cropData);
      
      const response = await cropAPI.addCrop(cropData);
      
      console.log('Add crop response:', response);
      
      if (response.success) {
        Alert.alert('Success', 'Crop added successfully!', [
          {
            text: 'OK',
            onPress: () => {
              setCropFormData({ cropName: '', seedType: '' });
              setCropErrors({});
              loadCropMarketRates();
            }
          }
        ]);
      } else {
        Alert.alert('Error', response.detail || 'Failed to add crop');
      }
    } catch (error) {
      console.error('API Error details:', error);
      Alert.alert('Error', `Failed to add crop: ${error.message || 'Could not connect to server'}`);
    } finally {
      setCropLoading(false);
    }
  };

  // ✅ Market Rate form functions
  const validateRateForm = () => {
    const newErrors = {};
    
    if (!marketRateFormData.selectedCrop.trim()) newErrors.selectedCrop = 'Please select crop';
    if (!marketRateFormData.year.trim()) newErrors.year = 'Please enter year';
    if (!marketRateFormData.season.trim()) newErrors.season = 'Please enter season';
    if (!marketRateFormData.retailRate.trim()) newErrors.retailRate = 'Please enter retail rate';
    if (!marketRateFormData.wholesaleRate.trim()) newErrors.wholesaleRate = 'Please enter wholesale rate';

    // Validate numbers
    if (isNaN(marketRateFormData.retailRate) || parseFloat(marketRateFormData.retailRate) <= 0) {
      newErrors.retailRate = 'Please enter valid retail rate';
    }
    if (isNaN(marketRateFormData.wholesaleRate) || parseFloat(marketRateFormData.wholesaleRate) <= 0) {
      newErrors.wholesaleRate = 'Please enter valid wholesale rate';
    }

    setRateErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMarketRateSubmit = async () => {
    if (!validateRateForm()) return;

    setRateLoading(true);

    try {
      const rateData = {
        year: parseInt(marketRateFormData.year),
        season: marketRateFormData.season.trim(),
        retail_rate: parseFloat(marketRateFormData.retailRate),
        wholesale_rate: parseFloat(marketRateFormData.wholesaleRate)
      };
      
      console.log('Adding market rate:', rateData);
      
      // Note: You need to get crop ID first to call the API
      // This is a placeholder - you need to implement actual API call
      Alert.alert('Success', `Market rate added for ${marketRateFormData.selectedCrop}`, [
        {
          text: 'OK',
          onPress: () => {
            resetMarketRateForm();
            loadCropMarketRates();
          }
        }
      ]);
      
      // TODO: Implement actual API call
      // const response = await adminAPI.addCropMarketRate(cropId, rateData);
      
    } catch (error) {
      console.error('API Error details:', error);
      Alert.alert('Error', `Failed to add market rate: ${error.message || 'Could not connect to server'}`);
    } finally {
      setRateLoading(false);
    }
  };

  const resetMarketRateForm = () => {
    setMarketRateFormData({
      selectedCrop: '',
      year: new Date().getFullYear().toString(),
      season: '',
      retailRate: '',
      wholesaleRate: ''
    });
    setRateErrors({});
    setShowMarketRateModal(false);
  };

  const openMarketRateForm = (cropName = '') => {
    setMarketRateFormData(prev => ({
      ...prev,
      selectedCrop: cropName,
      year: new Date().getFullYear().toString(),
      season: '',
      retailRate: '',
      wholesaleRate: ''
    }));
    setShowMarketRateModal(true);
  };

  const updateCropFormData = useCallback((field, value) => {
    setCropFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    setCropErrors(prev => {
      if (prev[field]) {
        return { ...prev, [field]: '' };
      }
      return prev;
    });
  }, []);

  const updateRateFormData = useCallback((field, value) => {
    setMarketRateFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    setRateErrors(prev => {
      if (prev[field]) {
        return { ...prev, [field]: '' };
      }
      return prev;
    });
  }, []);

  const handleCropNameChange = useCallback((text) => {
    updateCropFormData('cropName', text);
  }, [updateCropFormData]);

  const handleSeedTypeChange = useCallback((text) => {
    updateCropFormData('seedType', text);
  }, [updateCropFormData]);

  const handleYearChange = useCallback((text) => {
    updateRateFormData('year', text);
  }, [updateRateFormData]);

  const handleSeasonChange = useCallback((text) => {
    updateRateFormData('season', text);
  }, [updateRateFormData]);

  const handleRetailRateChange = useCallback((text) => {
    updateRateFormData('retailRate', text);
  }, [updateRateFormData]);

  const handleWholesaleRateChange = useCallback((text) => {
    updateRateFormData('wholesaleRate', text);
  }, [updateRateFormData]);

  const handleNext = (nextRef) => {
    if (nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const InputField = React.memo(({ 
    label, 
    value, 
    onChangeText, 
    error, 
    placeholder, 
    iconName,
    ref,
    returnKeyType = 'next',
    onSubmitEditing,
    keyboardType = 'default',
    ...props 
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <Icon name={iconName} size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          ref={ref}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={false}
          keyboardType={keyboardType}
          autoCorrect={false}
          autoCapitalize="none"
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  ));

  if (loading && cropRates.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={styles.loadingText}>Loading crop market rates...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      enabled={Platform.OS === 'ios'}
    >
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#16A34A']}
            tintColor="#16A34A"
          />
        }
      >
        

        {/* ✅ Add Crop Form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Add New Crop</Text>
          
          <InputField
            label="Crop Name"
            value={cropFormData.cropName}
            onChangeText={handleCropNameChange}
            error={cropErrors.cropName}
            placeholder="e.g., Wheat, Rice, Cotton"
            iconName="grass"
            returnKeyType="next"
            onSubmitEditing={() => handleNext(seedTypeRef)}
          />

          <InputField
            label="Seed Type"
            value={cropFormData.seedType}
            onChangeText={handleSeedTypeChange}
            error={cropErrors.seedType}
            placeholder="e.g., Standard, Hybrid, Organic"
            iconName="eco"
            ref={seedTypeRef}
            returnKeyType="done"
            onSubmitEditing={handleCropSubmit}
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, cropLoading && styles.submitButtonDisabled]}
            onPress={handleCropSubmit}
            disabled={cropLoading}
          >
            {cropLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.buttonContent}>
                <Icon name="check-circle" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Add Crop</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ✅ Add Market Rate Button */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Add Market Rate</Text>
          
          <TouchableOpacity
            style={styles.addRateButton}
            onPress={() => openMarketRateForm()}
          >
            <View style={styles.buttonContent}>
              <Icon name="add-circle-outline" size={24} color="#16A34A" />
              <Text style={styles.addRateButtonText}>Add New Market Rate</Text>
            </View>
          </TouchableOpacity>
          
          {/* Available Crops for Quick Selection */}
          {availableCrops.length > 0 && (
            <View style={styles.quickCropsContainer}>
              <Text style={styles.quickCropsLabel}>Or select existing crop:</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.quickCropsScroll}
                contentContainerStyle={styles.quickCropsContent}
              >
                {availableCrops.map(crop => (
                  <TouchableOpacity
                    key={crop}
                    style={styles.quickCropChip}
                    onPress={() => openMarketRateForm(crop)}
                  >
                    <Text style={styles.quickCropText}>{crop}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Crop Market Rates Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Rates by Crop</Text>
          
          {Object.keys(groupedRates).length === 0 ? (
            <View style={styles.noDataContainer}>
              <Icon name="info-outline" size={48} color="#999" />
              <Text style={styles.noDataText}>No market rates available</Text>
              <Text style={styles.noDataSubtext}>Add some crops and market rates first</Text>
            </View>
          ) : (
            Object.entries(groupedRates).map(([cropName, rates]) => (
              <View key={cropName} style={styles.cropRateCard}>
                <View style={styles.cropHeader}>
                  <Icon name="agriculture" size={24} color="#16A34A" />
                  <Text style={styles.cropRateName}>{cropName}</Text>
                  <TouchableOpacity 
                    style={styles.addIconButton}
                    onPress={() => openMarketRateForm(cropName)}
                  >
                    <Icon name="add-circle" size={24} color="#16A34A" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.seasonRatesScroll}
                  contentContainerStyle={styles.seasonRatesContent}
                >
                  {rates.map((rate, index) => (
                    <View key={index} style={styles.seasonRateCard}>
                      <View style={styles.seasonHeader}>
                        <Text style={styles.seasonText}>{rate.season}</Text>
                        <Text style={styles.yearText}>{rate.year}</Text>
                      </View>
                      
                      <View style={styles.priceRow}>
                        <View style={styles.priceType}>
                          <Icon name="storefront" size={16} color="#666" />
                          <Text style={styles.priceLabel}>Retail:</Text>
                        </View>
                        <Text style={styles.retailPrice}>
                          {formatPrice(rate.avg_retail)}
                        </Text>
                      </View>
                      
                      <View style={styles.priceRow}>
                        <View style={styles.priceType}>
                          <Icon name="warehouse" size={16} color="#666" />
                          <Text style={styles.priceLabel}>Wholesale:</Text>
                        </View>
                        <Text style={styles.wholesalePrice}>
                          {formatPrice(rate.avg_wholesale)}
                        </Text>
                      </View>
                      
                      <View style={styles.entriesCount}>
                        <Icon name="assignment" size={14} color="#888" />
                        <Text style={styles.entriesText}>
                          {rate.entries_count} entries
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Market Rate Modal */}
      <Modal
        visible={showMarketRateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMarketRateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Market Rate</Text>
              <TouchableOpacity onPress={() => setShowMarketRateModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              <InputField
                label="Crop Name"
                value={marketRateFormData.selectedCrop}
                onChangeText={(text) => updateRateFormData('selectedCrop', text)}
                error={rateErrors.selectedCrop}
                placeholder="Enter crop name"
                iconName="grass"
                returnKeyType="next"
                onSubmitEditing={() => handleNext(seasonRef)}
              />

              <InputField
                label="Year"
                value={marketRateFormData.year}
                onChangeText={handleYearChange}
                error={rateErrors.year}
                placeholder="e.g., 2024"
                iconName="calendar-today"
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => handleNext(seasonRef)}
              />

              <InputField
                label="Season"
                value={marketRateFormData.season}
                onChangeText={handleSeasonChange}
                error={rateErrors.season}
                placeholder="e.g., Kharif, Rabi, Summer, etc."
                iconName="seasonal"
                ref={seasonRef}
                returnKeyType="next"
                onSubmitEditing={() => handleNext(retailRateRef)}
              />

              <Text style={styles.suggestionText}>
                Common seasons: Kharif, Rabi, Zaid, Summer, Winter, Monsoon
              </Text>

              <InputField
                label="Retail Rate (PKR)"
                value={marketRateFormData.retailRate}
                onChangeText={handleRetailRateChange}
                error={rateErrors.retailRate}
                placeholder="Enter retail price"
                iconName="attach-money"
                ref={retailRateRef}
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => handleNext(wholesaleRateRef)}
              />

              <InputField
                label="Wholesale Rate (PKR)"
                value={marketRateFormData.wholesaleRate}
                onChangeText={handleWholesaleRateChange}
                error={rateErrors.wholesaleRate}
                placeholder="Enter wholesale price"
                iconName="account-balance"
                ref={wholesaleRateRef}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleMarketRateSubmit}
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowMarketRateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.saveButton, rateLoading && styles.saveButtonDisabled]}
                onPress={handleMarketRateSubmit}
                disabled={rateLoading}
              >
                {rateLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Market Rate</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16A34A',
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16A34A',
    marginBottom: 16,
  },
  addRateButton: {
    backgroundColor: '#F0F9F0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#16A34A',
    borderStyle: 'dashed',
  },
  addRateButtonText: {
    color: '#16A34A',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  quickCropsContainer: {
    marginTop: 16,
  },
  quickCropsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quickCropsScroll: {
    flexDirection: 'row',
  },
  quickCropsContent: {
    paddingRight: 8,
  },
  quickCropChip: {
    backgroundColor: '#E7F8EA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#16A34A',
  },
  quickCropText: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  suggestionText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: -8,
    marginBottom: 16,
    paddingLeft: 4,
  },
  submitButton: {
    backgroundColor: '#16A34A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  cropRateCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cropHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cropRateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16A34A',
    marginLeft: 12,
    flex: 1,
  },
  addIconButton: {
    padding: 4,
  },
  seasonRatesScroll: {
    flexDirection: 'row',
  },
  seasonRatesContent: {
    paddingRight: 8,
  },
  seasonRateCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 180,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  seasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  seasonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
    textTransform: 'capitalize',
  },
  yearText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  retailPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  wholesalePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  entriesCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  entriesText: {
    fontSize: 10,
    color: '#888',
    marginLeft: 4,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 2,
    padding: 14,
    backgroundColor: '#16A34A',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CropSchedules;