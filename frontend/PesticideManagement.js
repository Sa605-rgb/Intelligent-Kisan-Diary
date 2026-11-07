import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { adminAPI } from './api';

const PesticideManagement = ({ navigation }) => {
  const [isFertilizerMode, setIsFertilizerMode] = useState(false);
  const [pesticides, setPesticides] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newItem, setNewItem] = useState({
    name: '',
    type: '',
    dosage: '',
    application_method: '',
    precaution: '',
    waiting_period: '',
    timing: ''
  });

  const [showMarketRateModal, setShowMarketRateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedYears, setExpandedYears] = useState({});
  const [submittingRate, setSubmittingRate] = useState(false);
  
  const [newMarketRate, setNewMarketRate] = useState({
    item_name: '',
    year: new Date().getFullYear().toString(),
    season: '',
    retail_rate: '',
    wholesale_rate: ''
  });

  const seasons = ['Kharif', 'Rabi'];

  useEffect(() => {
    loadData();
  }, [isFertilizerMode]);

  const processItemData = (items) => {
    return items.map(item => {
      const processedItem = { ...item };
      
      // Process market_rates_by_year
      if (!processedItem.market_rates_by_year && processedItem.market_rate) {
        const year = processedItem.market_rate.year || new Date().getFullYear();
        processedItem.market_rates_by_year = {
          [year]: [processedItem.market_rate]
        };
        processedItem.latest_rate = processedItem.market_rate;
      }
      
      // If market_rates_by_year is array, convert to object
      if (Array.isArray(processedItem.market_rates_by_year)) {
        const ratesByYear = {};
        processedItem.market_rates_by_year.forEach(rate => {
          const year = rate.year;
          if (!ratesByYear[year]) {
            ratesByYear[year] = [];
          }
          ratesByYear[year].push(rate);
        });
        processedItem.market_rates_by_year = ratesByYear;
      }
      
      // Set latest rate
      if (processedItem.market_rates_by_year && Object.keys(processedItem.market_rates_by_year).length > 0) {
        const years = Object.keys(processedItem.market_rates_by_year).sort((a, b) => parseInt(b) - parseInt(a));
        const latestYear = years[0];
        const latestRates = processedItem.market_rates_by_year[latestYear];
        if (latestRates && latestRates.length > 0) {
          processedItem.latest_rate = latestRates[0];
        }
      }
      
      return processedItem;
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (isFertilizerMode) {
        const response = await adminAPI.getFertilizerMarketRates();
        if (response && response.success) {
          const processedFertilizers = processItemData(response.fertilizers || []);
          setFertilizers(processedFertilizers);
        }
      } else {
        const response = await adminAPI.getPesticideMarketRates();
        if (response && response.success) {
          const processedPesticides = processItemData(response.pesticides || []);
          setPesticides(processedPesticides);
        }
      }
    } catch (error) {
      Alert.alert('Error', `Failed to load ${isFertilizerMode ? 'fertilizers' : 'pesticides'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.type) {
      Alert.alert('Error', 'Please fill at least name and type');
      return;
    }

    try {
      let response;
      if (isFertilizerMode) {
        response = await adminAPI.addFertilizer({
          name: newItem.name,
          type: newItem.type,
          dosage: newItem.dosage,
          application_method: newItem.application_method,
          timing: newItem.timing || ''
        });
      } else {
        response = await adminAPI.addPesticide(newItem);
      }

      if (response.success) {
        Alert.alert('Success', `${isFertilizerMode ? 'Fertilizer' : 'Pesticide'} added successfully`);
        setNewItem({
          name: '',
          type: '',
          dosage: '',
          application_method: '',
          precaution: '',
          waiting_period: '',
          timing: ''
        });
        loadData();
      }
    } catch (error) {
      Alert.alert('Error', `Failed to add ${isFertilizerMode ? 'fertilizer' : 'pesticide'}`);
    }
  };

  const handleDeleteItem = (itemId) => {
    Alert.alert(
      `Delete ${isFertilizerMode ? 'Fertilizer' : 'Pesticide'}`,
      `Are you sure you want to delete this ${isFertilizerMode ? 'fertilizer' : 'pesticide'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (isFertilizerMode) {
                setFertilizers(fertilizers.filter(f => f.id !== itemId));
              } else {
                setPesticides(pesticides.filter(p => p.id !== itemId));
              }
              Alert.alert('Success', 'Item deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          }
        }
      ]
    );
  };

  const openMarketRateModal = (item) => {
    setSelectedItem(item);
    setNewMarketRate({
      item_name: item.name,
      year: new Date().getFullYear().toString(),
      season: '',
      retail_rate: '',
      wholesale_rate: ''
    });
    setShowMarketRateModal(true);
  };

  const handleAddMarketRate = async () => {
    if (!newMarketRate.year || !newMarketRate.season || 
        !newMarketRate.retail_rate || !newMarketRate.wholesale_rate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setSubmittingRate(true);
      
      const rateData = {
        item_name: newMarketRate.item_name,
        year: parseInt(newMarketRate.year),
        season: newMarketRate.season,
        retail_rate: parseFloat(newMarketRate.retail_rate),
        wholesale_rate: parseFloat(newMarketRate.wholesale_rate)
      };

      let response;
      if (isFertilizerMode) {
        response = await adminAPI.addFertilizerMarketRate(rateData);
      } else {
        response = await adminAPI.addPesticideMarketRate(rateData);
      }

      if (response.success) {
        Alert.alert('Success', response.message);
        setShowMarketRateModal(false);
        loadData();
      } else {
        Alert.alert('Error', response.detail || 'Failed to add market rate');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add market rate');
    } finally {
      setSubmittingRate(false);
    }
  };

  const toggleYearExpansion = (itemId, year) => {
    const key = `${itemId}-${year}`;
    setExpandedYears(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return `Rs. ${parseInt(price).toLocaleString()}`;
  };

  const renderItemCard = (item) => {
    const isPesticide = !isFertilizerMode;
    const hasMarketRates = item.market_rates_by_year && 
                          Object.keys(item.market_rates_by_year).length > 0;
    
    return (
      <View key={item.id} style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <Icon 
            name={isPesticide ? "bug-report" : "eco"} 
            size={24} 
            color={isPesticide ? "#FF6B35" : "#2E7D32"} 
          />
          <View style={styles.itemInfo}>
            <Text style={[
              styles.itemName,
              { color: isPesticide ? "#FF6B35" : "#2E7D32" }
            ]}>
              {item.name}
            </Text>
            <Text style={styles.itemType}>Type: {item.type}</Text>
          </View>
          
          <View style={styles.itemActions}>
            <TouchableOpacity 
              style={styles.addRateButton}
              onPress={() => openMarketRateModal(item)}
            >
              <Icon name="add-circle" size={24} color={isPesticide ? "#FF6B35" : "#2E7D32"} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Icon name="delete" size={20} color="#d32f2f" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailsSection}>
          {item.dosage && (
            <View style={styles.detailItem}>
              <Icon name="science" size={16} color="#666" />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Dosage: </Text>
                {item.dosage}
              </Text>
            </View>
          )}
          
          {item.application_method && (
            <View style={styles.detailItem}>
              <Icon name="precision-manufacturing" size={16} color="#666" />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Method: </Text>
                {item.application_method}
              </Text>
            </View>
          )}
          
          {isPesticide && item.precaution && (
            <View style={styles.detailItem}>
              <Icon name="warning" size={16} color="#666" />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Precautions: </Text>
                {item.precaution}
              </Text>
            </View>
          )}
          
          {isPesticide && item.waiting_period && (
            <View style={styles.detailItem}>
              <Icon name="access-time" size={16} color="#666" />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Waiting Period: </Text>
                {item.waiting_period}
              </Text>
            </View>
          )}
          
          {isFertilizerMode && item.timing && (
            <View style={styles.detailItem}>
              <Icon name="access-time" size={16} color="#666" />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Timing: </Text>
                {item.timing}
              </Text>
            </View>
          )}
        </View>

        {hasMarketRates ? (
          <View style={styles.marketRatesSection}>
            <Text style={styles.marketRatesTitle}>Market Rates</Text>
            
            {item.latest_rate && (
              <View style={styles.latestRateCard}>
                <Text style={styles.latestRateLabel}>
                  Latest ({item.latest_rate.year} - {item.latest_rate.season})
                </Text>
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>Retail:</Text>
                  <Text style={styles.retailRate}>{formatPrice(item.latest_rate.retail_rate)}</Text>
                </View>
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>Wholesale:</Text>
                  <Text style={styles.wholesaleRate}>{formatPrice(item.latest_rate.wholesale_rate)}</Text>
                </View>
              </View>
            )}
            
            {Object.entries(item.market_rates_by_year)
              .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
              .map(([year, rates]) => {
                const isExpanded = expandedYears[`${item.id}-${year}`];
                
                return (
                  <View key={year} style={styles.yearCard}>
                    <TouchableOpacity 
                      style={styles.yearHeader}
                      onPress={() => toggleYearExpansion(item.id, year)}
                    >
                      <Text style={styles.yearText}>{year} ({rates.length} seasons)</Text>
                      <Icon 
                        name={isExpanded ? "expand-less" : "expand-more"} 
                        size={20} 
                        color="#666" 
                      />
                    </TouchableOpacity>
                    
                    {isExpanded && Array.isArray(rates) && rates.map((rate, idx) => (
                      <View key={idx} style={styles.seasonRateCard}>
                        <Text style={styles.seasonText}>{rate.season}</Text>
                        <View style={styles.rateDetails}>
                          <Text style={styles.rateDetail}>Retail: {formatPrice(rate.retail_rate)}</Text>
                          <Text style={styles.rateDetail}>Wholesale: {formatPrice(rate.wholesale_rate)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })}
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.addRateButtonFull, { 
              backgroundColor: isPesticide ? '#FFEDD5' : '#E8F5E8' 
            }]}
            onPress={() => openMarketRateModal(item)}
          >
            <Icon name="add-circle" size={20} color={isPesticide ? "#FF6B35" : "#2E7D32"} />
            <Text style={[styles.addRateButtonText, { 
              color: isPesticide ? "#FF6B35" : "#2E7D32" 
            }]}>
              Add Market Rate
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={isFertilizerMode ? "#2E7D32" : "#FF6B35"} />
          <Text style={styles.loadingText}>
            Loading {isFertilizerMode ? 'fertilizers' : 'pesticides'}...
          </Text>
        </View>
      );
    }

    const items = isFertilizerMode ? fertilizers : pesticides;
    const isPesticide = !isFertilizerMode;
    
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.addCard}>
          <Text style={styles.sectionTitle}>
            Add New {isFertilizerMode ? 'Fertilizer' : 'Pesticide'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder={`${isFertilizerMode ? 'Fertilizer' : 'Pesticide'} Name *`}
            value={newItem.name}
            onChangeText={(text) => setNewItem({...newItem, name: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder={`Type * (e.g., ${isFertilizerMode ? 'Nitrogen, Phosphorus' : 'Insecticide, Fungicide'})`}
            value={newItem.type}
            onChangeText={(text) => setNewItem({...newItem, type: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Recommended Dosage"
            value={newItem.dosage}
            onChangeText={(text) => setNewItem({...newItem, dosage: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Application Method"
            value={newItem.application_method}
            onChangeText={(text) => setNewItem({...newItem, application_method: text})}
          />
          
          {isPesticide ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Precautions"
                value={newItem.precaution}
                onChangeText={(text) => setNewItem({...newItem, precaution: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Waiting Period"
                value={newItem.waiting_period}
                onChangeText={(text) => setNewItem({...newItem, waiting_period: text})}
              />
            </>
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Timing (e.g., At sowing, After 25 days)"
              value={newItem.timing || ''}
              onChangeText={(text) => setNewItem({...newItem, timing: text})}
            />
          )}
          
          <TouchableOpacity 
            style={[
              styles.addButton,
              { backgroundColor: isPesticide ? "#FF6B35" : "#2E7D32" }
            ]} 
            onPress={handleAddItem}
          >
            <Icon name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>
              Add {isFertilizerMode ? 'Fertilizer' : 'Pesticide'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          Available {isFertilizerMode ? 'Fertilizers' : 'Pesticides'} ({items.length})
        </Text>
        
        {items.length === 0 ? (
          <View style={styles.noDataCard}>
            <Icon 
              name={isPesticide ? "bug-report" : "eco"} 
              size={48} 
              color="#ccc" 
            />
            <Text style={styles.noDataText}>
              No {isFertilizerMode ? 'fertilizers' : 'pesticides'} added yet
            </Text>
            <Text style={styles.noDataSubtext}>
              Add your first {isFertilizerMode ? 'fertilizer' : 'pesticide'} above
            </Text>
          </View>
        ) : (
          items.map(renderItemCard)
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon 
            name={isFertilizerMode ? "eco" : "bug-report"} 
            size={28} 
            color={isFertilizerMode ? "#2E7D32" : "#FF6B35"} 
          />
          <Text style={styles.headerTitle}>
            {isFertilizerMode ? 'Fertilizer' : 'Pesticide'} Management
          </Text>
        </View>
        
        <View style={styles.toggleContainer}>
          <Text style={[
            styles.toggleLabel,
            isFertilizerMode && styles.toggleLabelActive
          ]}>
            Fertilizer
          </Text>
          
          <Switch
            value={isFertilizerMode}
            onValueChange={setIsFertilizerMode}
            trackColor={{ false: '#FF6B35', true: '#2E7D32' }}
            thumbColor="#fff"
            ios_backgroundColor="#3e3e3e"
          />
          
          <Text style={[
            styles.toggleLabel,
            !isFertilizerMode && styles.toggleLabelActive
          ]}>
            Pesticide
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>

      <Modal
        visible={showMarketRateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMarketRateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[
                styles.modalTitle,
                { color: isFertilizerMode ? "#2E7D32" : "#FF6B35" }
              ]}>
                Add Market Rate for {selectedItem?.name}
              </Text>
              <TouchableOpacity onPress={() => setShowMarketRateModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Year</Text>
                <TextInput
                  style={styles.input}
                  value={newMarketRate.year}
                  onChangeText={(text) => setNewMarketRate({...newMarketRate, year: text})}
                  placeholder="e.g., 2024"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Season</Text>
                <View style={styles.seasonContainer}>
                  {seasons.map((season) => (
                    <TouchableOpacity
                      key={season}
                      style={[
                        styles.seasonButton,
                        newMarketRate.season === season && [
                          styles.seasonButtonSelected,
                          { backgroundColor: isFertilizerMode ? "#2E7D32" : "#FF6B35" }
                        ]
                      ]}
                      onPress={() => setNewMarketRate({...newMarketRate, season})}
                    >
                      <Text style={[
                        styles.seasonButtonText,
                        newMarketRate.season === season && styles.seasonButtonTextSelected
                      ]}>
                        {season}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={[styles.input, { marginTop: 8 }]}
                  value={newMarketRate.season}
                  onChangeText={(text) => setNewMarketRate({...newMarketRate, season: text})}
                  placeholder="Or enter custom season"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Retail Rate (PKR)</Text>
                <TextInput
                  style={styles.input}
                  value={newMarketRate.retail_rate}
                  onChangeText={(text) => setNewMarketRate({...newMarketRate, retail_rate: text})}
                  placeholder="Enter retail price"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Wholesale Rate (PKR)</Text>
                <TextInput
                  style={styles.input}
                  value={newMarketRate.wholesale_rate}
                  onChangeText={(text) => setNewMarketRate({...newMarketRate, wholesale_rate: text})}
                  placeholder="Enter wholesale price"
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowMarketRateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  submittingRate && styles.submitButtonDisabled,
                  { backgroundColor: isFertilizerMode ? "#2E7D32" : "#FF6B35" }
                ]}
                onPress={handleAddMarketRate}
                disabled={submittingRate}
              >
                {submittingRate ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Icon name="save" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>Save Market Rate</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginLeft: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 6,
  },
  toggleLabelActive: {
    color: '#555',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  addCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addRateButton: {
    padding: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  detailsSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#333',
  },
  marketRatesSection: {
    marginTop: 8,
  },
  marketRatesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  latestRateCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  latestRateLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rateLabel: {
    fontSize: 12,
    color: '#777',
  },
  retailRate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#388E3C',
  },
  wholesaleRate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  yearCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  yearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FFEDD5',
  },
  yearText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  seasonRateCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  seasonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  rateDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateDetail: {
    fontSize: 12,
    color: '#777',
  },
  addRateButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addRateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  noDataCard: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
  },
  modalForm: {
    padding: 20,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  seasonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  seasonButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  seasonButtonSelected: {
    borderColor: 'transparent',
  },
  seasonButtonText: {
    fontSize: 14,
    color: '#666',
  },
  seasonButtonTextSelected: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default PesticideManagement;