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
//   FlatList
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { farmerAPI } from './api';

// const PesticideInputPage = ({ navigation, route }) => {
//   // Single pesticide state
//   const [name, setName] = useState('');
//   const [type, setType] = useState('');
//   const [dosage, setDosage] = useState('');
//   const [applicationMethod, setApplicationMethod] = useState('');
//   const [precaution, setPrecaution] = useState('');
//   const [waitingPeriod, setWaitingPeriod] = useState('');
  
//   // Multiple pesticides list
//   const [pesticides, setPesticides] = useState([]);
  
//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [showTypeDropdown, setShowTypeDropdown] = useState(false);
//   const [showMethodDropdown, setShowMethodDropdown] = useState(false);

//   // ✅ Database se types aur methods
//   const [pesticideTypes, setPesticideTypes] = useState([]);
//   const [applicationMethods, setApplicationMethods] = useState([]);
//   const [typesLoading, setTypesLoading] = useState(false);
//   const [methodsLoading, setMethodsLoading] = useState(false);

//   // ✅ Load types and methods from database
//   useEffect(() => {
//     loadPesticideTypes();
//     loadApplicationMethods();
//   }, []);

//   const loadPesticideTypes = async () => {
//     setTypesLoading(true);
//     try {
//       const response = await farmerAPI.getPesticideTypes();
//       if (response.success) {
//         const types = response.pesticide_types.map(item => item.type);
//         setPesticideTypes(types);
//       }
//     } catch (error) {
//       console.error('❌ Error loading pesticide types:', error);
//       // Fallback to common types
//       setPesticideTypes(['Insecticide', 'Fungicide', 'Herbicide', 'Bactericide']);
//     } finally {
//       setTypesLoading(false);
//     }
//   };

//   const loadApplicationMethods = async () => {
//     setMethodsLoading(true);
//     try {
//       const response = await farmerAPI.getPesticideApplicationMethods();
//       if (response.success) {
//         const methods = response.application_methods.map(item => item.application_method);
//         setApplicationMethods(methods);
//       }
//     } catch (error) {
//       console.error('❌ Error loading application methods:', error);
//       // Fallback to common methods
//       setApplicationMethods(['Spraying', 'Dusting', 'Seed Treatment', 'Soil Application']);
//     } finally {
//       setMethodsLoading(false);
//     }
//   };

//   // ✅ Agar route.params se pesticide select kiya hai toh pre-fill karein
//   React.useEffect(() => {
//     if (route.params?.selectedPesticide) {
//       const selected = route.params.selectedPesticide;
//       setName(selected.name || '');
//       setType(selected.type || '');
//       setDosage(selected.dosage || '');
//       setApplicationMethod(selected.application_method || '');
//       setPrecaution(selected.precaution || '');
//       setWaitingPeriod(selected.waiting_period || '');
//     }
//   }, [route.params?.selectedPesticide]);

//   // ✅ UPDATED: Single pesticide add karein list mein
//   const handleAddPesticide = () => {
//     if (!name || !type || !dosage || !applicationMethod) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     const newPesticide = {
//       id: Date.now().toString(),
//       name: name.trim(),
//       type: type,
//       dosage: dosage.trim(),
//       application_method: applicationMethod,
//       precaution: precaution.trim(),
//       waiting_period: waitingPeriod.trim()
//     };

//     setPesticides([...pesticides, newPesticide]);
    
//     // Reset form
//     setName('');
//     setType('');
//     setDosage('');
//     setApplicationMethod('');
//     setPrecaution('');
//     setWaitingPeriod('');
    
//     Alert.alert('Success', 'Pesticide added to list!');
//   };

//   // ✅ UPDATED: Pesticide edit karein
//   const handleEditPesticide = (id) => {
//     const pesticideToEdit = pesticides.find(pesticide => pesticide.id === id);
//     if (pesticideToEdit) {
//       setName(pesticideToEdit.name);
//       setType(pesticideToEdit.type);
//       setDosage(pesticideToEdit.dosage);
//       setApplicationMethod(pesticideToEdit.application_method);
//       setPrecaution(pesticideToEdit.precaution);
//       setWaitingPeriod(pesticideToEdit.waiting_period);
//       handleDeletePesticide(id);
//     }
//   };

//   // ✅ UPDATED: Pesticide delete karein list se
//   const handleDeletePesticide = (id) => {
//     setPesticides(pesticides.filter(pesticide => pesticide.id !== id));
//   };

//   // ✅ FIXED: Multiple pesticides save karein backend mein - using farmerAPI
//   const handleSavePesticides = async () => {
//     if (pesticides.length === 0) {
//       Alert.alert('Error', 'Please add at least one pesticide');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       // Backend ke format mein convert karein
//       const pesticidesData = pesticides.map(pesticide => ({
//         name: pesticide.name,
//         type: pesticide.type,
//         dosage: pesticide.dosage,
//         application_method: pesticide.application_method,
//         precaution: pesticide.precaution,
//         waiting_period: pesticide.waiting_period
//       }));

//       console.log('Sending pesticides data:', pesticidesData);
      
//       // ✅ FIXED: Use farmerAPI instead of pesticideAPI
//       const response = await farmerAPI.addMultiplePesticides(pesticidesData);
      
//       Alert.alert('Success', response.message || `${pesticides.length} pesticides saved successfully!`, [
//         {
//           text: 'OK',
//           onPress: () => {
//             // Reset everything
//             setName('');
//             setType('');
//             setDosage('');
//             setApplicationMethod('');
//             setPrecaution('');
//             setWaitingPeriod('');
//             setPesticides([]);
            
//             // ✅ NEW: Callback call karein agar parent page se aaye hain
//             if (route.params?.onPesticideAdded) {
//               route.params.onPesticideAdded(pesticides[0]); // Pehla pesticide return karein
//             }
            
//             // ✅ NEW: Multiple pesticides ke liye callback
//             if (route.params?.onPesticidesSaved) {
//               route.params.onPesticidesSaved(pesticides);
//             }
            
//             // Wapas navigate karein
//             navigation.goBack();
//           }
//         }
//       ]);
      
//     } catch (error) {
//       console.error('Pesticides save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save pesticides. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ FIXED: Single pesticide save karein (CropInputPage ke liye) - using farmerAPI
//   const handleSaveSinglePesticide = async () => {
//     if (!name || !type || !dosage || !applicationMethod) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       const pesticideData = {
//         name: name.trim(),
//         type: type,
//         dosage: dosage.trim(),
//         application_method: applicationMethod,
//         precaution: precaution.trim(),
//         waiting_period: waitingPeriod.trim()
//       };

//       console.log('Saving single pesticide:', pesticideData);
      
//       // ✅ FIXED: Use farmerAPI instead of pesticideAPI
//       const response = await farmerAPI.addPesticide(pesticideData);
      
//       if (response.success) {
//         Alert.alert('Success', 'Pesticide saved successfully!', [
//           {
//             text: 'OK',
//             onPress: () => {
//               // ✅ IMPORTANT: CropInputPage ko pesticide ka data return karein
//               if (route.params?.onPesticideAdded) {
//                 route.params.onPesticideAdded({
//                   ...pesticideData,
//                   id: response.pesticide_id || Date.now().toString()
//                 });
//               }
//               navigation.goBack();
//             }
//           }
//         ]);
//       } else {
//         Alert.alert('Error', response.message || 'Failed to save pesticide');
//       }
      
//     } catch (error) {
//       console.error('Single pesticide save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save pesticide. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ Determine which mode we're in
//   const isFromCropInput = route.params?.onPesticideAdded;

//   // ✅ UPDATED: Single pesticide item render karein
//   const renderPesticideItem = ({ item }) => (
//     <View style={styles.pesticideItem}>
//       <View style={styles.pesticideInfo}>
//         <Text style={styles.pesticideName}>{item.name}</Text>
//         <Text style={styles.pesticideDetails}>Type: {item.type}</Text>
//         <Text style={styles.pesticideDetails}>Dosage: {item.dosage}</Text>
//         <Text style={styles.pesticideDetails}>Method: {item.application_method}</Text>
//         {item.precaution && (
//           <Text style={styles.pesticideDetails}>Precaution: {item.precaution}</Text>
//         )}
//         {item.waiting_period && (
//           <Text style={styles.pesticideDetails}>Waiting: {item.waiting_period}</Text>
//         )}
//       </View>
//       <View style={styles.pesticideActions}>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => handleEditPesticide(item.id)}
//         >
//           <Icon name="edit" size={18} color="#4CAF50" />
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => handleDeletePesticide(item.id)}
//         >
//           <Icon name="delete" size={18} color="#F44336" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const DropdownModal = ({ visible, items, onSelect, onClose, title }) => (
//     <Modal visible={visible} transparent animationType="fade">
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.dropdownMenu}>
//             <Text style={styles.dropdownTitle}>{title}</Text>
//             <ScrollView style={styles.dropdownScrollView}>
//               {items.map((item, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.dropdownItem}
//                   onPress={() => {
//                     onSelect(item);
//                     onClose();
//                   }}
//                 >
//                   <Text style={styles.dropdownItemText}>{item}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <SafeAreaView style={styles.safeArea}>
        

//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <Text style={styles.sectionTitle}>
//             {isFromCropInput ? 'Add New Pesticide' : 'Add Pesticide Details'}
//           </Text>
          
//           {/* Single Pesticide Form */}
//           <View style={styles.pesticideForm}>
//             {/* Name */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Pesticide Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter pesticide name"
//                 value={name}
//                 onChangeText={setName}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             {/* ✅ UPDATED: Type Dropdown - Now from Database */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Type *</Text>
//               <TouchableOpacity 
//                 style={styles.dropdownButton}
//                 onPress={() => setShowTypeDropdown(true)}
//               >
//                 <Text style={[styles.dropdownText, !type && { color: '#999' }]}>
//                   {typesLoading ? 'Loading types...' : (type || 'Select Type')}
//                 </Text>
//                 <Icon name="arrow-drop-down" size={20} color="#666" />
//               </TouchableOpacity>
//             </View>

//             {/* Dosage */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Dosage *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., 2ml per liter, 500g per acre"
//                 value={dosage}
//                 onChangeText={setDosage}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             {/* ✅ UPDATED: Application Method Dropdown - Now from Database */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Application Method *</Text>
//               <TouchableOpacity 
//                 style={styles.dropdownButton}
//                 onPress={() => setShowMethodDropdown(true)}
//               >
//                 <Text style={[styles.dropdownText, !applicationMethod && { color: '#999' }]}>
//                   {methodsLoading ? 'Loading methods...' : (applicationMethod || 'Select Application Method')}
//                 </Text>
//                 <Icon name="arrow-drop-down" size={20} color="#666" />
//               </TouchableOpacity>
//             </View>

//             {/* Precaution */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Precaution</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., Use protective gear, Avoid contact with skin"
//                 value={precaution}
//                 onChangeText={setPrecaution}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             {/* Waiting Period */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Waiting Period</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., 7 days before harvest"
//                 value={waitingPeriod}
//                 onChangeText={setWaitingPeriod}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             {/* ✅ UPDATED: Add to List Button - only show if not from CropInput */}
//             {!isFromCropInput && (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={handleAddPesticide}
//                 disabled={loading}
//               >
//                 <View style={styles.buttonContent}>
//                   <Icon name="add" size={20} color="white" />
//                   <Text style={styles.addButtonText}>Add to List</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* ✅ UPDATED: Pesticides List - only show if not from CropInput */}
//           {!isFromCropInput && pesticides.length > 0 && (
//             <View style={styles.pesticidesList}>
//               <Text style={styles.listTitle}>Added Pesticides ({pesticides.length})</Text>
//               <FlatList
//                 data={pesticides}
//                 renderItem={renderPesticideItem}
//                 keyExtractor={item => item.id}
//                 scrollEnabled={false}
//               />
//             </View>
//           )}

//           {/* ✅ UPDATED: Save Buttons based on mode */}
//           {isFromCropInput ? (
//             // Single pesticide save for CropInput
//             <TouchableOpacity
//               style={[styles.saveButton, saving && styles.disabledButton]}
//               onPress={handleSaveSinglePesticide}
//               disabled={saving}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>SAVE PESTICIDE</Text>
//               )}
//             </TouchableOpacity>
//           ) : (
//             // Multiple pesticides save for standalone mode
//             <TouchableOpacity
//               style={[styles.saveButton, (saving || pesticides.length === 0) && styles.disabledButton]}
//               onPress={handleSavePesticides}
//               disabled={saving || pesticides.length === 0}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   SAVE {pesticides.length} PESTICIDE(S)
//                 </Text>
//               )}
//             </TouchableOpacity>
//           )}
//         </ScrollView>

//         {/* ✅ UPDATED: Dropdown Modals - Now using database data */}
//         <DropdownModal
//           visible={showTypeDropdown}
//           items={pesticideTypes}
//           onSelect={setType}
//           onClose={() => setShowTypeDropdown(false)}
//           title={typesLoading ? "Loading Types..." : "Select Pesticide Type"}
//         />

//         <DropdownModal
//           visible={showMethodDropdown}
//           items={applicationMethods}
//           onSelect={setApplicationMethod}
//           onClose={() => setShowMethodDropdown(false)}
//           title={methodsLoading ? "Loading Methods..." : "Select Application Method"}
//         />
//       </SafeAreaView>
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
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//   },
//   headerPlaceholder: {
//     width: 24,
//   },
//   scrollContainer: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   pesticideForm: {
//     marginBottom: 20,
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     fontSize: 16,
//     color: '#333',
//   },
//   dropdownButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   dropdownText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   addButton: {
//     backgroundColor: '#FF9800',
//     padding: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   addButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   pesticidesList: {
//     marginBottom: 20,
//   },
//   listTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#374151',
//     marginBottom: 10,
//   },
//   pesticideItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   pesticideInfo: {
//     flex: 1,
//   },
//   pesticideName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 4,
//   },
//   pesticideDetails: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 2,
//   },
//   pesticideActions: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   actionButton: {
//     padding: 4,
//   },
//   saveButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   disabledButton: {
//     backgroundColor: '#A5D6A7',
//   },
//   saveButtonText: {
//     color: 'white',
//     fontSize: 18,
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
//     maxHeight: 300,
//   },
//   dropdownTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   dropdownScrollView: {
//     maxHeight: 250,
//   },
//   dropdownItem: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   dropdownItemText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default PesticideInputPage;
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
//   FlatList
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { farmerAPI } from './api';

// const PesticideInputPage = ({ navigation, route }) => {
//   // Single pesticide state
//   const [name, setName] = useState('');
//   const [type, setType] = useState('');
//   const [dosage, setDosage] = useState('');
//   const [applicationMethod, setApplicationMethod] = useState('');
//   const [precaution, setPrecaution] = useState('');
//   const [waitingPeriod, setWaitingPeriod] = useState('');
  
//   // Multiple pesticides list
//   const [pesticides, setPesticides] = useState([]);
  
//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [showTypeDropdown, setShowTypeDropdown] = useState(false);
//   const [showMethodDropdown, setShowMethodDropdown] = useState(false);

//   // Database se types aur methods
//   const [pesticideTypes, setPesticideTypes] = useState([]);
//   const [applicationMethods, setApplicationMethods] = useState([]);
//   const [typesLoading, setTypesLoading] = useState(false);
//   const [methodsLoading, setMethodsLoading] = useState(false);

//   // Pesticide Activities States
//   const [pesticideActivities, setPesticideActivities] = useState([]);
//   const [showActivities, setShowActivities] = useState(false);
//   const [activitiesLoading, setActivitiesLoading] = useState(false);
  
//   // Navigation params se directly data lein
//   const [currentCropHistoryId, setCurrentCropHistoryId] = useState(null);
//   const [currentCropName, setCurrentCropName] = useState('');

//   // Actual Activities Management
//   const [editingActivity, setEditingActivity] = useState(null);
//   const [showActualDatePicker, setShowActualDatePicker] = useState(false);
//   const [actualActivityDate, setActualActivityDate] = useState(null);
//   const [currentCropData, setCurrentCropData] = useState(null);

//   // Load types and methods from database
//   useEffect(() => {
//     loadPesticideTypes();
//     loadApplicationMethods();
//     loadCurrentCropData();
//   }, []);

//   // Load current crop data - Sowing date ke bina bhi kaam karega
//   const loadCurrentCropData = async () => {
//     try {
//       console.log('🔍 DEBUG: Route params received:', route.params);
      
//       // Pehle navigation params check karein
//       if (route.params?.cropHistoryId) {
//         console.log('🎯 Using crop data from navigation:', {
//           cropHistoryId: route.params.cropHistoryId,
//           cropName: route.params.cropName,
//           sowingDate: route.params.sowingDate
//         });
        
//         // Sowing date nahi hai toh chhod dein - Date change ke liye zaroori nahi
//         const cropData = {
//           cropHistoryId: route.params.cropHistoryId,
//           cropName: route.params.cropName || '',
//           sowingDate: route.params.sowingDate || '' // Optional hai
//         };
        
//         setCurrentCropHistoryId(route.params.cropHistoryId);
//         setCurrentCropName(route.params.cropName || '');
//         setCurrentCropData(cropData);
        
//         console.log('✅ Crop data set (sowing date optional):', cropData);
//         return;
//       }

//       // Agar navigation params nahi hai toh AsyncStorage check karein
//       const savedCropData = await AsyncStorage.getItem('currentCropData');
//       if (savedCropData) {
//         const cropData = JSON.parse(savedCropData);
//         console.log('📱 Loaded from AsyncStorage:', cropData);
        
//         if (cropData.cropHistoryId && cropData.cropName) {
//           setCurrentCropHistoryId(cropData.cropHistoryId);
//           setCurrentCropName(cropData.cropName);
//           setCurrentCropData(cropData);
//         }
//       }
//     } catch (error) {
//       console.error('❌ Error loading current crop data:', error);
//     }
//   };

//   // Load pesticide types - Backend se hi
//   const loadPesticideTypes = async () => {
//     setTypesLoading(true);
//     try {
//       const response = await farmerAPI.getPesticideTypes();
//       if (response.success) {
//         const types = response.pesticide_types.map(item => item.type);
//         setPesticideTypes(types);
//       } else {
//         // Agar API fail hua toh empty array set karein
//         setPesticideTypes([]);
//         Alert.alert('Info', 'Pesticide types not available. Please add manually.');
//       }
//     } catch (error) {
//       console.error('❌ Error loading pesticide types:', error);
//       // No hardcoded fallback - Empty array
//       setPesticideTypes([]);
//     } finally {
//       setTypesLoading(false);
//     }
//   };

//   // Load application methods - Backend se hi
//   const loadApplicationMethods = async () => {
//     setMethodsLoading(true);
//     try {
//       const response = await farmerAPI.getPesticideApplicationMethods();
//       if (response.success) {
//         const methods = response.application_methods.map(item => item.application_method);
//         setApplicationMethods(methods);
//       } else {
//         // Agar API fail hua toh empty array set karein
//         setApplicationMethods([]);
//         Alert.alert('Info', 'Application methods not available. Please add manually.');
//       }
//     } catch (error) {
//       console.error('❌ Error loading application methods:', error);
//       // No hardcoded fallback - Empty array
//       setApplicationMethods([]);
//     } finally {
//       setMethodsLoading(false);
//     }
//   };

//   // Calculate days from sowing - Only if data available
//   const calculateDaysFromSowing = (activityDate) => {
//     try {
//       // BETTER CHECK: currentCropData aur sowingDate dono check karein
//       if (!currentCropData || !currentCropData.sowingDate) {
//         return 'N/A';
//       }
      
//       const sowing = new Date(currentCropData.sowingDate);
//       const activity = new Date(activityDate);
      
//       // Date validation
//       if (isNaN(sowing.getTime()) || isNaN(activity.getTime())) {
//         return 'N/A';
//       }
      
//       const diffTime = activity - sowing;
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
//       return diffDays >= 0 ? diffDays : 'N/A';
//     } catch (error) {
//       console.error('❌ Error in date calculation:', error);
//       return 'N/A';
//     }
//   };

//   // ADDED: Load pesticide activities function
//   const loadPesticideActivities = async () => {
//     try {
//       setActivitiesLoading(true);
      
//       if (!currentCropHistoryId) {
//         console.log('❌ No crop history ID available for activities');
//         return;
//       }

//       console.log('🔄 Loading pesticide activities for:', currentCropHistoryId);
//       const response = await farmerAPI.getCropActivities(currentCropHistoryId);
      
//       if (response.success) {
//         // Sirf pesticide-related activities filter karein
//         const pesticideRelated = response.activities.filter(activity => {
//           const activityType = activity.activity_type?.toLowerCase();
//           const description = activity.description?.toLowerCase();
//           const chemicalUsed = activity.chemical_or_fertilizer_used?.toLowerCase();
          
//           return (
//             activityType?.includes('pesticide') ||
//             activityType?.includes('spray') ||
//             activityType?.includes('insecticide') ||
//             activityType?.includes('fungicide') ||
//             activityType?.includes('herbicide') ||
//             description?.includes('pesticide') ||
//             description?.includes('spray') ||
//             description?.includes('insecticide') ||
//             description?.includes('fungicide') ||
//             description?.includes('herbicide') ||
//             (chemicalUsed && (
//               chemicalUsed.includes('pesticide') ||
//               chemicalUsed.includes('insecticide') ||
//               chemicalUsed.includes('fungicide') ||
//               chemicalUsed.includes('herbicide')
//             ))
//           );
//         });
        
//         console.log('✅ Filtered pesticide activities:', pesticideRelated.length);
//         setPesticideActivities(pesticideRelated);
//       } else {
//         console.log('❌ Failed to load activities:', response.message);
//         setPesticideActivities([]);
//       }
//     } catch (error) {
//       console.error('❌ Error loading pesticide activities:', error);
//       setPesticideActivities([]);
//     } finally {
//       setActivitiesLoading(false);
//     }
//   };

//   // Toggle activities view
//   const toggleActivitiesView = () => {
//     if (!showActivities && currentCropHistoryId) {
//       loadPesticideActivities();
//     }
//     setShowActivities(!showActivities);
//   };

//   // FIXED: Better debugging for mark as completed
//   const handleMarkAsCompleted = (activity) => {
//     console.log('🎯 Mark as Completed clicked:', {
//       activityId: activity.id,
//       activityType: activity.activity_type,
//       scheduledDate: activity.activity_date,
//       isActual: activity.is_actual
//     });
    
//     // IMPROVED CHECK: Agar is_actual true hai (1, true, 'true') toh prevent karein
//     if (activity.is_actual === true || activity.is_actual === 1 || activity.is_actual === 'true') {
//       Alert.alert('Info', 'This activity is already marked as actual!');
//       return;
//     }

//     setEditingActivity(activity);
//     setActualActivityDate(new Date()); // Default aaj ki date
//     setShowActualDatePicker(true);
//   };

//   // SIMPLEST SOLUTION - Only useState
//   const handleSaveActualDate = () => {
//     console.log('🔍 DEBUG 1: editingActivity:', editingActivity?.id);
//     console.log('🔍 DEBUG 2: actualActivityDate:', actualActivityDate);
//     console.log('🔍 DEBUG 3: actualActivityDate type:', typeof actualActivityDate);
    
//     if (!editingActivity || !actualActivityDate) return;

//     const actualDateStr = actualActivityDate.toISOString().split('T')[0];
    
//     // DIRECT STATE UPDATE - No API, No Storage
//     setPesticideActivities(prev => 
//       prev.map(activity => 
//         activity.id === editingActivity.id 
//           ? { 
//               ...activity, 
//               activity_date: actualDateStr,
//               is_actual: true,
//               description: `${activity.description} - ACTUAL`,
//               remarks: `Updated locally: ${actualDateStr}`
//             }
//           : activity
//       )
//     );

//     // IMMEDIATE UI FEEDBACK
//     setShowActualDatePicker(false);
//     setEditingActivity(null);
//     setActualActivityDate(null);
//     Alert.alert('✅ Updated!', 'Date changed successfully');
//   };

//   // Agar route.params se pesticide select kiya hai toh pre-fill karein
//   React.useEffect(() => {
//     if (route.params?.selectedPesticide) {
//       const selected = route.params.selectedPesticide;
//       setName(selected.name || '');
//       setType(selected.type || '');
//       setDosage(selected.dosage || '');
//       setApplicationMethod(selected.application_method || '');
//       setPrecaution(selected.precaution || '');
//       setWaitingPeriod(selected.waiting_period || '');
//     }
//   }, [route.params?.selectedPesticide]);

//   // Single pesticide add karein list mein
//   const handleAddPesticide = () => {
//     if (!name || !type || !dosage || !applicationMethod) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     const newPesticide = {
//       id: Date.now().toString(),
//       name: name.trim(),
//       type: type,
//       dosage: dosage.trim(),
//       application_method: applicationMethod,
//       precaution: precaution.trim(),
//       waiting_period: waitingPeriod.trim()
//     };

//     setPesticides([...pesticides, newPesticide]);
    
//     // Reset form
//     setName('');
//     setType('');
//     setDosage('');
//     setApplicationMethod('');
//     setPrecaution('');
//     setWaitingPeriod('');
    
//     Alert.alert('Success', 'Pesticide added to list!');
//   };

//   // Pesticide edit karein
//   const handleEditPesticide = (id) => {
//     const pesticideToEdit = pesticides.find(pesticide => pesticide.id === id);
//     if (pesticideToEdit) {
//       setName(pesticideToEdit.name);
//       setType(pesticideToEdit.type);
//       setDosage(pesticideToEdit.dosage);
//       setApplicationMethod(pesticideToEdit.application_method);
//       setPrecaution(pesticideToEdit.precaution);
//       setWaitingPeriod(pesticideToEdit.waiting_period);
//       handleDeletePesticide(id);
//     }
//   };

//   // Pesticide delete karein list se
//   const handleDeletePesticide = (id) => {
//     setPesticides(pesticides.filter(pesticide => pesticide.id !== id));
//   };

//   // Multiple pesticides save karein backend mein
//   const handleSavePesticides = async () => {
//     if (pesticides.length === 0) {
//       Alert.alert('Error', 'Please add at least one pesticide');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       const pesticidesData = pesticides.map(pesticide => ({
//         name: pesticide.name,
//         type: pesticide.type,
//         dosage: pesticide.dosage,
//         application_method: pesticide.application_method,
//         precaution: pesticide.precaution,
//         waiting_period: pesticide.waiting_period
//       }));

//       console.log('Sending pesticides data:', pesticidesData);
      
//       const response = await farmerAPI.addMultiplePesticides(pesticidesData);
      
//       Alert.alert('Success', response.message || `${pesticides.length} pesticides saved successfully!`, [
//         {
//           text: 'OK',
//           onPress: () => {
//             setName('');
//             setType('');
//             setDosage('');
//             setApplicationMethod('');
//             setPrecaution('');
//             setWaitingPeriod('');
//             setPesticides([]);
            
//             if (route.params?.onPesticideAdded) {
//               route.params.onPesticideAdded(pesticides[0]);
//             }
            
//             if (route.params?.onPesticidesSaved) {
//               route.params.onPesticidesSaved(pesticides);
//             }
            
//             navigation.goBack();
//           }
//         }
//       ]);
      
//     } catch (error) {
//       console.error('Pesticides save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save pesticides. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // FIXED: Single pesticide save function
//   const handleSaveSinglePesticide = async () => {
//     if (!name || !type || !dosage || !applicationMethod) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       const pesticideData = {
//         name: name.trim(),
//         type: type,
//         dosage: dosage.trim(),
//         application_method: applicationMethod,
//         precaution: precaution.trim(),
//         waiting_period: waitingPeriod.trim()
//       };

//       console.log('🔄 Saving pesticide:', pesticideData);
      
//       // SIMPLIFIED: Direct farmerId use karo
//       let farmerIdToUse = null;
      
//       // Method 1: Route params se
//       if (route.params?.farmerId) {
//         farmerIdToUse = parseInt(route.params.farmerId);
//       }
      
//       // Method 2: AsyncStorage se
//       if (!farmerIdToUse) {
//         const savedFarmerId = await AsyncStorage.getItem('farmerId');
//         if (savedFarmerId) {
//           farmerIdToUse = parseInt(savedFarmerId);
//         }
//       }
      
//       console.log('👨‍🌾 Using farmerId:', farmerIdToUse);

//       if (!farmerIdToUse) {
//         throw new Error('Farmer ID not found');
//       }

//       // CORRECTED: API call with farmerId
//       const response = await farmerAPI.addPesticide(pesticideData, farmerIdToUse);
      
//       if (response.success) {
//         console.log('✅ Pesticide saved successfully');
        
//         // AUTOMATIC ACTIVITY CREATE KARO
//         if (currentCropHistoryId) {
//           await createPesticideActivity(pesticideData);
//         }
        
//         Alert.alert('Success', 'Pesticide saved successfully!', [
//           {
//             text: 'OK',
//             onPress: () => {
//               // SIRF NAVIGATE BACK - NO CALLBACK
//               navigation.goBack();
//             }
//           }
//         ]);
//       } else {
//         Alert.alert('Error', response.message || 'Failed to save pesticide');
//       }
      
//     } catch (error) {
//       console.error('❌ Pesticide save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save pesticide');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // SIMPLIFIED: Activity creation
//   const createPesticideActivity = async (pesticideData) => {
//     try {
//       const activityData = {
//         crop_history_id: currentCropHistoryId,
//         activity_date: new Date().toISOString().split('T')[0],
//         activity_type: 'Pesticide Application',
//         description: `Applied ${pesticideData.name} (${pesticideData.type}) - ${pesticideData.dosage}`,
//         chemical_or_fertilizer_used: `${pesticideData.name} - ${pesticideData.dosage}`,
//         remarks: `Method: ${pesticideData.application_method}, Waiting: ${pesticideData.waiting_period}`,
//         is_public: false
//       };

//       console.log('🎯 Creating pesticide activity:', activityData);
      
//       const response = await farmerAPI.addCropActivity(activityData);
      
//       if (response.success) {
//         console.log('✅ Pesticide activity created');
//       } else {
//         console.log('❌ Activity creation failed:', response.message);
//       }
//     } catch (error) {
//       console.error('❌ Activity error:', error);
//     }
//   };

//   // Determine which mode we're in
//   const isFromCropInput = route.params?.cropHistoryId;

//   // Single pesticide item render karein
//   const renderPesticideItem = ({ item }) => (
//     <View style={styles.pesticideItem}>
//       <View style={styles.pesticideInfo}>
//         <Text style={styles.pesticideName}>{item.name}</Text>
//         <Text style={styles.pesticideDetails}>Type: {item.type}</Text>
//         <Text style={styles.pesticideDetails}>Dosage: {item.dosage}</Text>
//         <Text style={styles.pesticideDetails}>Method: {item.application_method}</Text>
//         {item.precaution && (
//           <Text style={styles.pesticideDetails}>Precaution: {item.precaution}</Text>
//         )}
//         {item.waiting_period && (
//           <Text style={styles.pesticideDetails}>Waiting: {item.waiting_period}</Text>
//         )}
//       </View>
//       <View style={styles.pesticideActions}>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => handleEditPesticide(item.id)}
//         >
//           <Icon name="edit" size={18} color="#4CAF50" />
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => handleDeletePesticide(item.id)}
//         >
//           <Icon name="delete" size={18} color="#F44336" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   // FIXED: Render pesticide activities with CORRECT DATES
//   const renderPesticideActivity = (activity) => (
//     <View key={activity.id} style={styles.activityItem}>
//       <View style={styles.activityHeader}>
//         <View style={styles.activityTypeContainer}>
//           <Icon name="bug-report" size={16} color="#DC2626" />
//           <Text style={styles.activityType}>{activity.activity_type}</Text>
//           {activity.is_actual && (
//             <View style={styles.actualBadge}>
//               <Text style={styles.actualBadgeText}>ACTUAL</Text>
//             </View>
//           )}
//         </View>
//         <View style={styles.dateContainer}>
//           <Icon name="calendar-today" size={12} color="#666" />
//           <Text style={[
//             styles.activityDate,
//             activity.is_actual && styles.actualDate
//           ]}>
//             {new Date(activity.activity_date).toLocaleDateString('en-IN', {
//               day: 'numeric',
//               month: 'short', 
//               year: 'numeric'
//             })}
//           </Text>
//         </View>
//       </View>
      
//       <Text style={styles.activityDescription}>{activity.description}</Text>
      
//       {/* SIMPLE DATE INFO - Sowing date ke bina bhi */}
//       <View style={styles.daysInfo}>
//         <Text style={styles.daysInfoText}>
//           📅 {activity.is_actual ? 'Completed on' : 'Scheduled for'}: {new Date(activity.activity_date).toLocaleDateString('en-IN')}
//         </Text>
//       </View>
      
//       {activity.chemical_or_fertilizer_used && (
//         <View style={styles.chemicalContainer}>
//           <Icon name="science" size={14} color="#DC2626" />
//           <Text style={styles.activityChemical}>
//             {activity.chemical_or_fertilizer_used}
//           </Text>
//         </View>
//       )}
      
//       {activity.remarks && (
//         <Text style={styles.activityRemarks}>📝 {activity.remarks}</Text>
//       )}
      
//       {/* FIXED ACTION BUTTONS - Better check for is_actual */}
//       {!activity.is_actual && (
//         <View style={styles.activityActions}>
//           <TouchableOpacity 
//             style={styles.completeButton}
//             onPress={() => {
//               console.log('🎯 Mark as Completed clicked for activity:', activity.id);
//               handleMarkAsCompleted(activity);
//             }}
//           >
//             <Icon name="check-circle" size={16} color="#4CAF50" />
//             <Text style={styles.completeButtonText}>Mark as Completed</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   const DropdownModal = ({ visible, items, onSelect, onClose, title }) => (
//     <Modal visible={visible} transparent animationType="fade">
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.dropdownMenu}>
//             <Text style={styles.dropdownTitle}>{title}</Text>
//             <ScrollView style={styles.dropdownScrollView}>
//               {items.map((item, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.dropdownItem}
//                   onPress={() => {
//                     onSelect(item);
//                     onClose();
//                   }}
//                 >
//                   <Text style={styles.dropdownItemText}>{item}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );

//   // FIXED: Actual Date Picker Modal - No hardcoded values
//   const ActualDatePickerModal = () => {
//     const [internalDate, setInternalDate] = useState(actualActivityDate || new Date());

//     const handleDateChange = (event, selectedDate) => {
//       if (Platform.OS === 'android') {
//         setShowActualDatePicker(false);
//       }
//       if (selectedDate) {
//         setInternalDate(selectedDate);
//         setActualActivityDate(selectedDate);
//       }
//     };

//     const handleSave = () => {
//       setActualActivityDate(internalDate);
//       handleSaveActualDate();
//     };

//     return (
//       <Modal 
//         visible={showActualDatePicker} 
//         transparent 
//         animationType="slide"
//         onRequestClose={() => {
//           setShowActualDatePicker(false);
//           setEditingActivity(null);
//           setActualActivityDate(null);
//         }}
//       >
//         <View style={styles.datePickerOverlay}>
//           <View style={styles.datePickerContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.datePickerTitle}>Select Actual Completion Date</Text>
//               <TouchableOpacity 
//                 style={styles.closeButton}
//                 onPress={() => {
//                   setShowActualDatePicker(false);
//                   setEditingActivity(null);
//                   setActualActivityDate(null);
//                 }}
//               >
//                 <Icon name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>
            
//             <Text style={styles.datePickerSubtitle}>
//               Scheduled: {editingActivity ? new Date(editingActivity.activity_date).toLocaleDateString('en-IN') : 'N/A'}
//             </Text>
            
//             <DateTimePicker
//               value={internalDate}
//               mode="date"
//               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//               onChange={handleDateChange}
//               style={styles.datePicker}
//             />
            
//             <View style={styles.datePickerButtons}>
//               <TouchableOpacity 
//                 style={styles.cancelButton}
//                 onPress={() => {
//                   setShowActualDatePicker(false);
//                   setEditingActivity(null);
//                   setActualActivityDate(null);
//                 }}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={styles.confirmButton}
//                 onPress={handleSave}
//               >
//                 <Text style={styles.confirmButtonText}>Save Actual Date</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
//   };

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <SafeAreaView style={styles.safeArea}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity 
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Icon name="arrow-back" size={24} color="#2E7D32" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>
//             {isFromCropInput ? 'Add Pesticide' : 'Pesticide Management'}
//           </Text>
//           <View style={styles.headerPlaceholder} />
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <Text style={styles.sectionTitle}>
//             {isFromCropInput ? 'Add New Pesticide' : 'Add Pesticide Details'}
//           </Text>
          
//           {/* Single Pesticide Form */}
//           <View style={styles.pesticideForm}>
//             {/* Name */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Pesticide Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter pesticide name"
//                 value={name}
//                 onChangeText={setName}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             {/* Type Dropdown */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Type *</Text>
//               <TouchableOpacity 
//                 style={styles.dropdownButton}
//                 onPress={() => setShowTypeDropdown(true)}
//               >
//                 <Text style={[styles.dropdownText, !type && { color: '#999' }]}>
//                   {typesLoading ? 'Loading types...' : (type || 'Select Type')}
//                 </Text>
//                 <Icon name="arrow-drop-down" size={20} color="#666" />
//               </TouchableOpacity>
//             </View>

//             {/* Dosage */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Dosage *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., 2ml per liter, 500g per acre"
//                 value={dosage}
//                 onChangeText={setDosage}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             {/* Application Method Dropdown */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Application Method *</Text>
//               <TouchableOpacity 
//                 style={styles.dropdownButton}
//                 onPress={() => setShowMethodDropdown(true)}
//               >
//                 <Text style={[styles.dropdownText, !applicationMethod && { color: '#999' }]}>
//                   {methodsLoading ? 'Loading methods...' : (applicationMethod || 'Select Application Method')}
//                 </Text>
//                 <Icon name="arrow-drop-down" size={20} color="#666" />
//               </TouchableOpacity>
//             </View>

//             {/* Precaution */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Precaution</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., Use protective gear, Avoid contact with skin"
//                 value={precaution}
//                 onChangeText={setPrecaution}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             {/* Waiting Period */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Waiting Period</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., 7 days before harvest"
//                 value={waitingPeriod}
//                 onChangeText={setWaitingPeriod}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             {/* Add to List Button - only show if not from CropInput */}
//             {!isFromCropInput && (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={handleAddPesticide}
//                 disabled={loading}
//               >
//                 <View style={styles.buttonContent}>
//                   <Icon name="add" size={20} color="white" />
//                   <Text style={styles.addButtonText}>Add to List</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* FIXED: Pesticide Activities Section */}
//           {isFromCropInput && currentCropHistoryId && (
//             <View style={styles.activitiesSection}>
//               <TouchableOpacity 
//                 style={styles.activitiesHeader}
//                 onPress={toggleActivitiesView}
//               >
//                 <View style={styles.activitiesTitleRow}>
//                   <Icon 
//                     name={showActivities ? "expand-less" : "expand-more"} 
//                     size={20} 
//                     color="#DC2626" 
//                   />
//                   <View>
//                     <Text style={styles.activitiesTitle}>
//                       Pesticide Activities ({pesticideActivities.length})
//                     </Text>
//                     {/* FIXED: Current crop name display */}
//                     <Text style={styles.currentCropText}>
//                       Current Crop: {currentCropName}
//                     </Text>
//                   </View>
//                 </View>
//                 <Icon name="bug-report" size={20} color="#DC2626" />
//               </TouchableOpacity>

//               {showActivities && (
//                 <View style={styles.activitiesList}>
//                   {activitiesLoading ? (
//                     <View style={styles.loadingContainer}>
//                       <ActivityIndicator size="small" color="#DC2626" />
//                       <Text style={styles.loadingText}>Loading activities...</Text>
//                     </View>
//                   ) : pesticideActivities.length > 0 ? (
//                     pesticideActivities.map(renderPesticideActivity)
//                   ) : (
//                     <View style={styles.noActivitiesContainer}>
//                       <Icon name="bug-report" size={40} color="#D1D5DB" />
//                       <Text style={styles.noActivitiesText}>
//                         No pesticide activities yet for {currentCropName}
//                       </Text>
//                       <Text style={styles.noActivitiesSubtext}>
//                         Add pesticides to see activities here
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               )}
//             </View>
//           )}

//           {/* Pesticides List - only show if not from CropInput */}
//           {!isFromCropInput && pesticides.length > 0 && (
//             <View style={styles.pesticidesList}>
//               <Text style={styles.listTitle}>Added Pesticides ({pesticides.length})</Text>
//               <FlatList
//                 data={pesticides}
//                 renderItem={renderPesticideItem}
//                 keyExtractor={item => item.id}
//                 scrollEnabled={false}
//               />
//             </View>
//           )}

//           {/* Save Buttons based on mode */}
//           {isFromCropInput ? (
//             // Single pesticide save for CropInput
//             <TouchableOpacity
//               style={[styles.saveButton, saving && styles.disabledButton]}
//               onPress={handleSaveSinglePesticide}
//               disabled={saving}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   {currentCropHistoryId ? 'SAVE PESTICIDE & ACTIVITY' : 'SAVE PESTICIDE'}
//                 </Text>
//               )}
//             </TouchableOpacity>
//           ) : (
//             // Multiple pesticides save for standalone mode
//             <TouchableOpacity
//               style={[styles.saveButton, (saving || pesticides.length === 0) && styles.disabledButton]}
//               onPress={handleSavePesticides}
//               disabled={saving || pesticides.length === 0}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   SAVE {pesticides.length} PESTICIDE(S)
//                 </Text>
//               )}
//             </TouchableOpacity>
//           )}
//         </ScrollView>

//         {/* Dropdown Modals */}
//         <DropdownModal
//           visible={showTypeDropdown}
//           items={pesticideTypes}
//           onSelect={setType}
//           onClose={() => setShowTypeDropdown(false)}
//           title={typesLoading ? "Loading Types..." : "Select Pesticide Type"}
//         />

//         <DropdownModal
//           visible={showMethodDropdown}
//           items={applicationMethods}
//           onSelect={setApplicationMethod}
//           onClose={() => setShowMethodDropdown(false)}
//           title={methodsLoading ? "Loading Methods..." : "Select Application Method"}
//         />

//         {/* Actual Date Picker Modal */}
//         <ActualDatePickerModal />
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// // Styles same as fertilizer with some color changes
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   safeArea: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//   },
//   headerPlaceholder: {
//     width: 24,
//   },
//   scrollContainer: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   pesticideForm: {
//     marginBottom: 20,
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     fontSize: 16,
//     color: '#333',
//   },
//   dropdownButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   dropdownText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   addButton: {
//     backgroundColor: '#FF9800',
//     padding: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   addButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   pesticidesList: {
//     marginBottom: 20,
//   },
//   listTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#374151',
//     marginBottom: 10,
//   },
//   pesticideItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   pesticideInfo: {
//     flex: 1,
//   },
//   pesticideName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 4,
//   },
//   pesticideDetails: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 2,
//   },
//   pesticideActions: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   actionButton: {
//     padding: 4,
//   },
//   saveButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   disabledButton: {
//     backgroundColor: '#A5D6A7',
//   },
//   saveButtonText: {
//     color: 'white',
//     fontSize: 18,
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
//     maxHeight: 300,
//   },
//   dropdownTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   dropdownScrollView: {
//     maxHeight: 250,
//   },
//   dropdownItem: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   dropdownItemText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   // Activities Section Styles
//   activitiesSection: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#FFE4E6',
//     overflow: 'hidden',
//   },
//   activitiesHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#FFF5F5',
//   },
//   activitiesTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   activitiesTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#DC2626',
//     marginLeft: 8,
//   },
//   currentCropText: {
//     fontSize: 12,
//     color: '#8B5CF6',
//     fontWeight: '600',
//     marginTop: 2,
//     marginLeft: 8,
//   },
//   activitiesList: {
//     padding: 15,
//     backgroundColor: '#FEF2F2',
//   },
//   activityItem: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//     borderLeftWidth: 4,
//     borderLeftColor: '#DC2626',
//   },
//   activityHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   activityTypeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   activityType: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#DC2626',
//     marginLeft: 6,
//   },
//   actualBadge: {
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginLeft: 6,
//   },
//   actualBadgeText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   dateContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   activityDate: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 4,
//   },
//   actualDate: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//   },
//   activityDescription: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 6,
//     lineHeight: 18,
//   },
//   daysInfo: {
//     backgroundColor: '#F3F4F6',
//     padding: 6,
//     borderRadius: 4,
//     marginBottom: 6,
//   },
//   daysInfoText: {
//     fontSize: 12,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   chemicalContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FEF2F2',
//     padding: 8,
//     borderRadius: 6,
//     marginBottom: 6,
//   },
//   activityChemical: {
//     fontSize: 12,
//     color: '#DC2626',
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   activityRemarks: {
//     fontSize: 12,
//     color: '#666',
//     fontStyle: 'italic',
//     lineHeight: 16,
//   },
//   activityActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   completeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E8F5E8',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 6,
//   },
//   completeButtonText: {
//     color: '#4CAF50',
//     fontSize: 12,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginLeft: 8,
//     color: '#666',
//     fontSize: 14,
//   },
//   noActivitiesContainer: {
//     alignItems: 'center',
//     padding: 30,
//   },
//   noActivitiesText: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   noActivitiesSubtext: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   datePickerOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   datePickerContainer: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 20,
//     width: '90%',
//     maxWidth: 400,
//   },
//   datePickerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   datePickerSubtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   datePicker: {
//     marginVertical: 10,
//   },
//   datePickerButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//   },
//   cancelButton: {
//     backgroundColor: '#F3F4F6',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//     flex: 1,
//     marginRight: 8,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: '#374151',
//     fontWeight: '600',
//   },
//   confirmButton: {
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//     flex: 1,
//     marginLeft: 8,
//     alignItems: 'center',
//   },
//   confirmButtonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   closeButton: {
//     padding: 5,
//   },
// });

// export default PesticideInputPage;



// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   TouchableWithoutFeedback,
//   FlatList
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { farmerAPI } from './api';

// const PesticideInputPage = ({ navigation, route }) => {
//   // ✅ PESTICIDE SELECTION STATES
//   const [suggestedPesticides, setSuggestedPesticides] = useState([]);
//   const [showPesticideList, setShowPesticideList] = useState(false);
//   const [selectedPesticide, setSelectedPesticide] = useState(null);
//   const [loadingPesticides, setLoadingPesticides] = useState(false);

//   // ✅ CROP DATA STATES
//   const [currentCropHistoryId, setCurrentCropHistoryId] = useState(null);
//   const [currentCropName, setCurrentCropName] = useState('');
//   const [saving, setSaving] = useState(false);

//   // ✅ Load data on component mount
//   useEffect(() => {
//     loadCurrentCropData();
//   }, []);

//   // ✅ Load suggested pesticides when crop data is available
//   useEffect(() => {
//     if (currentCropName) {
//       loadSuggestedPesticides();
//     }
//   }, [currentCropName]);

//   // ✅ LOAD CURRENT CROP DATA
//   const loadCurrentCropData = async () => {
//     try {
//       console.log('🔍 Route params:', route.params);
      
//       if (route.params?.cropId) {
//         console.log('🎯 Using crop data from navigation');
//         setCurrentCropHistoryId(route.params.cropId);
//         setCurrentCropName(route.params.cropName || 'Unknown Crop');
//         return;
//       }

//       // Fallback to AsyncStorage
//       const savedCropData = await AsyncStorage.getItem('currentCropData');
//       if (savedCropData) {
//         const cropData = JSON.parse(savedCropData);
//         console.log('📱 Loaded from storage:', cropData);
        
//         if (cropData.cropHistoryId) {
//           setCurrentCropHistoryId(cropData.cropHistoryId);
//           setCurrentCropName(cropData.cropName || 'Unknown Crop');
//         }
//       }
//     } catch (error) {
//       console.error('❌ Error loading crop data:', error);
//     }
//   };

//   // ✅ LOAD SUGGESTED PESTICIDES
//   const loadSuggestedPesticides = async () => {
//     if (!currentCropName) {
//       console.log('❌ No crop name available');
//       return;
//     }

//     setLoadingPesticides(true);
//     try {
//       console.log('🐛 Loading suggested pesticides for:', currentCropName);
//       const response = await farmerAPI.getSuggestedPesticides(currentCropName);
      
//       if (response.success && response.suggested_pesticides) {
//         setSuggestedPesticides(response.suggested_pesticides);
//         console.log('✅ Suggested pesticides loaded:', response.suggested_pesticides.length);
//       } else {
//         console.log('❌ No suggested pesticides found');
//         setSuggestedPesticides([]);
//       }
//     } catch (error) {
//       console.error('❌ Error loading suggested pesticides:', error);
//       setSuggestedPesticides([]);
//     } finally {
//       setLoadingPesticides(false);
//     }
//   };

//   // ✅ SELECT PESTICIDE FROM LIST
//   const handleSelectPesticide = (pesticide) => {
//     console.log('🎯 Pesticide selected:', pesticide);
//     setSelectedPesticide(pesticide);
//     setShowPesticideList(false);
//   };

//   // ✅ SAVE PESTICIDE
//   const handleSavePesticide = async () => {
//     if (!selectedPesticide) {
//       Alert.alert('Error', 'Please select a pesticide first');
//       return;
//     }

//     if (!currentCropHistoryId) {
//       Alert.alert('Error', 'No crop selected. Please go back and select a crop first.');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       console.log('💾 Saving selected pesticide:', selectedPesticide);
      
//       const savedFarmerId = await AsyncStorage.getItem('farmerId');
//       if (!savedFarmerId) {
//         throw new Error('Farmer ID not found. Please login again.');
//       }

//       // ✅ CREATE PESTICIDE ACTIVITY
//       await createPesticideActivity(selectedPesticide);
      
//       Alert.alert('Success', 'Pesticide applied successfully!', [
//         {
//           text: 'OK',
//           onPress: () => {
//             navigation.goBack();
//           }
//         }
//       ]);
      
//     } catch (error) {
//       console.error('❌ Pesticide save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save pesticide. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ CREATE PESTICIDE ACTIVITY
//   const createPesticideActivity = async (pesticide) => {
//     try {
//       const activityData = {
//         crop_history_id: currentCropHistoryId,
//         activity_date: new Date().toISOString().split('T')[0], // Current date
//         activity_type: 'Pesticide Application',
//         description: `Applied ${pesticide.name} (${pesticide.type}) - ${pesticide.dosage}`,
//         chemical_or_fertilizer_used: `${pesticide.name} - ${pesticide.dosage}`,
//         remarks: `Application Method: ${pesticide.application_method}, Waiting Period: ${pesticide.waiting_period || 'N/A'}`,
//         is_public: false
//       };

//       console.log('🎯 Creating pesticide activity:', activityData);

//       const activityResponse = await farmerAPI.addCropActivity(activityData);
//       if (activityResponse.success) {
//         console.log('✅ Pesticide activity created with ID:', activityResponse.activity_id);
//         return true;
//       } else {
//         console.log('❌ Failed to create activity:', activityResponse.message);
//         return false;
//       }
//     } catch (error) {
//       console.error('💥 Error creating pesticide activity:', error);
//       return false;
//     }
//   };

//   // ✅ RENDER PESTICIDE ITEM FOR LIST
//   const renderPesticideItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.pesticideListItem}
//       onPress={() => handleSelectPesticide(item)}
//     >
//       <View style={styles.pestListInfo}>
//         <Text style={styles.pestListName}>{item.name}</Text>
//         <Text style={styles.pestListType}>Type: {item.type}</Text>
//         {item.dosage && <Text style={styles.pestListDetail}>Dosage: {item.dosage}</Text>}
//         {item.target_pests && <Text style={styles.pestListDetail}>Target: {item.target_pests}</Text>}
//       </View>
//       <Icon name="chevron-right" size={20} color="#666" />
//     </TouchableOpacity>
//   );

//   // ✅ PESTICIDE LIST MODAL
//   const PesticideListModal = () => (
//     <Modal visible={showPesticideList} transparent animationType="slide">
//       <View style={styles.modalOverlay}>
//         <View style={styles.pestListModal}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>
//               Select Pesticide for {currentCropName}
//             </Text>
//             <TouchableOpacity 
//               style={styles.closeButton}
//               onPress={() => setShowPesticideList(false)}
//             >
//               <Icon name="close" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {loadingPesticides ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="small" color="#DC2626" />
//               <Text style={styles.loadingText}>Loading pesticides...</Text>
//             </View>
//           ) : suggestedPesticides.length > 0 ? (
//             <FlatList
//               data={suggestedPesticides}
//               renderItem={renderPesticideItem}
//               keyExtractor={(item, index) => index.toString()}
//               style={styles.pestList}
//             />
//           ) : (
//             <View style={styles.noPesticidesContainer}>
//               <Icon name="bug-report" size={50} color="#ccc" />
//               <Text style={styles.noPesticidesText}>
//                 No suggested pesticides found for {currentCropName}
//               </Text>
//               <Text style={styles.noPesticidesSubtext}>
//                 Please contact admin to add pesticides
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>
//     </Modal>
//   );

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <SafeAreaView style={styles.safeArea}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity 
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Icon name="arrow-back" size={24} color="#DC2626" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Add Pesticide</Text>
//           <View style={styles.headerPlaceholder} />
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContainer}>
          
//           {/* ✅ CROP INFO SECTION */}
//           {currentCropName && (
//             <View style={styles.cropInfoBox}>
//               <Text style={styles.cropInfoTitle}>🌱 Current Crop</Text>
//               <Text style={styles.cropInfoText}>{currentCropName}</Text>
//               {route.params?.pestType && (
//                 <Text style={styles.cropInfoSubtext}>
//                   Scheduled: {route.params.pestType}
//                 </Text>
//               )}
//               {route.params?.scheduledDate && (
//                 <Text style={styles.cropInfoSubtext}>
//                   Date: {new Date(route.params.scheduledDate).toLocaleDateString('en-IN')}
//                 </Text>
//               )}
//             </View>
//           )}

//           {/* ✅ PESTICIDE SELECTION SECTION */}
//           <View style={styles.selectionSection}>
//             <Text style={styles.sectionTitle}>1. Select Pesticide</Text>
            
//             {!selectedPesticide ? (
//               <View style={styles.selectionContainer}>
//                 <Text style={styles.selectionHelpText}>
//                   Choose from recommended pesticides for {currentCropName}
//                 </Text>
                
//                 <TouchableOpacity 
//                   style={styles.selectButton}
//                   onPress={() => setShowPesticideList(true)}
//                   disabled={loadingPesticides}
//                 >
//                   {loadingPesticides ? (
//                     <ActivityIndicator size="small" color="white" />
//                   ) : (
//                     <>
//                       <Icon name="list" size={20} color="white" />
//                       <Text style={styles.selectButtonText}>
//                         Choose from List ({suggestedPesticides.length})
//                       </Text>
//                     </>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View style={styles.selectedPesticideBox}>
//                 <View style={styles.selectedHeader}>
//                   <Text style={styles.selectedTitle}>✅ Selected Pesticide</Text>
//                   <TouchableOpacity 
//                     style={styles.changeButton}
//                     onPress={() => setSelectedPesticide(null)}
//                   >
//                     <Text style={styles.changeButtonText}>Change</Text>
//                   </TouchableOpacity>
//                 </View>
                
//                 {/* ✅ PESTICIDE DETAILS - READ ONLY */}
//                 <View style={styles.pestDetailsContainer}>
//                   <View style={styles.detailRow}>
//                     <Text style={styles.detailLabel}>Name:</Text>
//                     <Text style={styles.detailValue}>{selectedPesticide.name}</Text>
//                   </View>
                  
//                   <View style={styles.detailRow}>
//                     <Text style={styles.detailLabel}>Type:</Text>
//                     <Text style={styles.detailValue}>{selectedPesticide.type}</Text>
//                   </View>
                  
//                   {selectedPesticide.dosage && (
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Dosage:</Text>
//                       <Text style={styles.detailValue}>{selectedPesticide.dosage}</Text>
//                     </View>
//                   )}
                  
//                   {selectedPesticide.application_method && (
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Application Method:</Text>
//                       <Text style={styles.detailValue}>{selectedPesticide.application_method}</Text>
//                     </View>
//                   )}
                  
//                   {selectedPesticide.target_pests && (
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Target Pests:</Text>
//                       <Text style={styles.detailValue}>{selectedPesticide.target_pests}</Text>
//                     </View>
//                   )}
                  
//                   {selectedPesticide.waiting_period && (
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Waiting Period:</Text>
//                       <Text style={styles.detailValue}>{selectedPesticide.waiting_period}</Text>
//                     </View>
//                   )}
                  
//                   {selectedPesticide.precaution && (
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Precautions:</Text>
//                       <Text style={styles.detailValue}>{selectedPesticide.precaution}</Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* ✅ SAVE BUTTON */}
//           {selectedPesticide && (
//             <TouchableOpacity
//               style={[styles.saveButton, saving && styles.disabledButton]}
//               onPress={handleSavePesticide}
//               disabled={saving}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   CONFIRM & APPLY PESTICIDE
//                 </Text>
//               )}
//             </TouchableOpacity>
//           )}

//         </ScrollView>

//         {/* ✅ PESTICIDE LIST MODAL */}
//         <PesticideListModal />

//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// // ✅ STYLES - Pesticide ke liye thoda color scheme change kiya hai
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fa' },
//   safeArea: { flex: 1 },
//   header: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd',
//   },
//   backButton: { padding: 4 },
//   headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#DC2626' },
//   headerPlaceholder: { width: 24 },
//   scrollContainer: { padding: 20, paddingBottom: 40 },

//   // Crop Info
//   cropInfoBox: {
//     backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, marginBottom: 20,
//     borderLeftWidth: 4, borderLeftColor: '#DC2626',
//   },
//   cropInfoTitle: { fontSize: 16, fontWeight: 'bold', color: '#DC2626', marginBottom: 8 },
//   cropInfoText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
//   cropInfoSubtext: { fontSize: 14, color: '#666', marginTop: 4 },

//   // Selection Section
//   selectionSection: { marginBottom: 20 },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#DC2626', marginBottom: 15 },
//   selectionContainer: { alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 12 },
//   selectionHelpText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 15 },
//   selectButton: {
//     backgroundColor: '#DC2626', flexDirection: 'row', alignItems: 'center',
//     paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8,
//   },
//   selectButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },

//   // Selected Pesticide
//   selectedPesticideBox: {
//     backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#DC2626',
//   },
//   selectedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   selectedTitle: { fontSize: 16, fontWeight: 'bold', color: '#DC2626' },
//   changeButton: { backgroundColor: '#FF9800', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
//   changeButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

//   // Pesticide Details (Read Only)
//   pestDetailsContainer: { backgroundColor: 'white', padding: 12, borderRadius: 8 },
//   detailRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'flex-start',
//     marginBottom: 8,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0'
//   },
//   detailLabel: { fontSize: 14, fontWeight: '600', color: '#333', flex: 1 },
//   detailValue: { fontSize: 14, color: '#666', flex: 2, textAlign: 'right' },

//   // Save Button
//   saveButton: {
//     backgroundColor: '#DC2626', paddingVertical: 16, borderRadius: 10, alignItems: 'center', marginBottom: 20,
//   },
//   disabledButton: { backgroundColor: '#FCA5A5' },
//   saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
//   },
//   pestListModal: {
//     backgroundColor: 'white', borderRadius: 12, width: '90%', maxHeight: '80%',
//   },
//   modalHeader: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee',
//   },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#DC2626', flex: 1 },
//   closeButton: { padding: 4 },
//   pestList: { maxHeight: 400 },
//   pesticideListItem: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
//   },
//   pestListInfo: { flex: 1 },
//   pestListName: { fontSize: 16, fontWeight: 'bold', color: '#DC2626', marginBottom: 4 },
//   pestListType: { fontSize: 14, color: '#666', marginBottom: 2 },
//   pestListDetail: { fontSize: 12, color: '#888', marginBottom: 1 },

//   // Loading & Empty States
//   loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20 },
//   loadingText: { marginLeft: 8, color: '#666', fontSize: 14 },
//   noPesticidesContainer: { alignItems: 'center', padding: 40 },
//   noPesticidesText: { fontSize: 16, color: '#666', marginTop: 12, textAlign: 'center' },
//   noPesticidesSubtext: { fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' },
// });

// export default PesticideInputPage;



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { farmerAPI } from './api';

const PesticideInputPage = ({ navigation, route }) => {
  // ✅ PESTICIDE SELECTION STATES
  const [suggestedPesticides, setSuggestedPesticides] = useState([]);
  const [showPesticideList, setShowPesticideList] = useState(false);
  const [selectedPesticide, setSelectedPesticide] = useState(null);
  const [loadingPesticides, setLoadingPesticides] = useState(false);
  const [adminSuggestedPesticide, setAdminSuggestedPesticide] = useState(null);
  const [loadingAdminPesticide, setLoadingAdminPesticide] = useState(false);

  // ✅ CROP DATA STATES
  const [currentCropHistoryId, setCurrentCropHistoryId] = useState(null);
  const [currentCropName, setCurrentCropName] = useState('');
  const [saving, setSaving] = useState(false);
  
  // ✅ NEW: Schedule data from CropInputPage
  const [scheduledDate, setScheduledDate] = useState(null);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [activityDescription, setActivityDescription] = useState('');
  const [pesticideNumber, setPesticideNumber] = useState(1);
  
  // ✅ NEW: Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedApplicationDate, setSelectedApplicationDate] = useState(null);
  
  // ✅ NEW: Recommended pesticide from CropInputPage
  const [recommendedPesticide, setRecommendedPesticide] = useState(null);
  const [pesticideIndex, setPesticideIndex] = useState(0);
  const [returnScreen, setReturnScreen] = useState(null);

  // ✅ Load data on component mount
  useEffect(() => {
    loadCurrentCropData();
  }, []);

  // ✅ Load pesticides when crop data is available
  useEffect(() => {
    if (currentCropName) {
      loadAllPesticideData();
    }
  }, [currentCropName]);

  // ✅ LOAD CURRENT CROP DATA - UPDATED to use correct param names
  // ✅ PesticideInputPage.js mein loadCurrentCropData function UPDATE KARO:
const loadCurrentCropData = async () => {
  try {
    console.log('🔍 Route params:', route.params);
    
    if (route.params?.cropHistoryId) {
      console.log('🎯 Using crop data from CropInputPage');
      setCurrentCropHistoryId(route.params.cropHistoryId);
      setCurrentCropName(route.params.cropName || 'Unknown Crop');
      
      // ✅ Load schedule data
      if (route.params.scheduledDate) setScheduledDate(new Date(route.params.scheduledDate));
      if (route.params.rangeStart) setRangeStart(new Date(route.params.rangeStart));
      if (route.params.rangeEnd) setRangeEnd(new Date(route.params.rangeEnd));
      if (route.params.description) setActivityDescription(route.params.description);
      if (route.params.pesticideNumber) setPesticideNumber(route.params.pesticideNumber);
      if (route.params.pesticideIndex !== undefined) setPesticideIndex(route.params.pesticideIndex);
      if (route.params.returnScreen) setReturnScreen(route.params.returnScreen);
      
      // ✅ IMPORTANT FIX: Load recommended pesticide properly
      if (route.params.recommendedPesticide) {
        const pestName = route.params.recommendedPesticide;
        console.log('🌾 Recommended pesticide received:', pestName);
        setRecommendedPesticide(pestName);
        
        // ✅ TEMPORARY: Create minimal object
        setSelectedPesticide({ 
          name: pestName,
          isTemporary: true
        });
      
    }
        if (route.params.pesticideIndex !== undefined) {
          setPesticideIndex(route.params.pesticideIndex);
        }
        if (route.params.returnScreen) {
          setReturnScreen(route.params.returnScreen);
        }
        
        console.log('📅 Schedule data loaded:', {
          scheduledDate: route.params.scheduledDate,
          rangeStart: route.params.rangeStart,
          rangeEnd: route.params.rangeEnd,
          description: route.params.description,
          pesticideNumber: route.params.pesticideNumber,
          recommendedPesticide: route.params.recommendedPesticide,
          pesticideIndex: route.params.pesticideIndex
        });
        return;
      }
      
      // ✅ Check for cropId (legacy param name)
      if (route.params?.cropId) {
        console.log('🎯 Using legacy cropId param');
        setCurrentCropHistoryId(route.params.cropId);
        setCurrentCropName(route.params.cropName || 'Unknown Crop');
        return;
      }

      // Fallback to AsyncStorage
      const savedCropData = await AsyncStorage.getItem('currentCropData');
      if (savedCropData) {
        const cropData = JSON.parse(savedCropData);
        console.log('📱 Loaded from storage:', cropData);
        
        if (cropData.cropHistoryId) {
          setCurrentCropHistoryId(cropData.cropHistoryId);
          setCurrentCropName(cropData.cropName || 'Unknown Crop');
        }
      }
    } catch (error) {
      console.error('❌ Error loading crop data:', error);
    }
  };

  // ✅ LOAD ALL PESTICIDE DATA
  const loadAllPesticideData = async () => {
    setLoadingAdminPesticide(true);
    setLoadingPesticides(true);

    try {
      // Parallel calls for better performance
      const [adminResponse, suggestedResponse] = await Promise.all([
        farmerAPI.getAdminSuggestedPesticide(currentCropName),
        farmerAPI.getSuggestedPesticides(currentCropName)
      ]);

      // ✅ Process Admin Suggested Pesticide
      if (adminResponse.success && adminResponse.admin_suggested_pesticide) {
        setAdminSuggestedPesticide(adminResponse.admin_suggested_pesticide);
        // Automatically set as selected pesticide
        setSelectedPesticide(adminResponse.admin_suggested_pesticide);
        console.log('✅ Admin suggested pesticide loaded:', adminResponse.admin_suggested_pesticide);
      } else {
        console.log('ℹ️ No admin suggested pesticide found');
        setAdminSuggestedPesticide(null);
      }

      // ✅ Process Suggested Pesticides
      if (suggestedResponse.success && suggestedResponse.suggested_pesticides) {
        setSuggestedPesticides(suggestedResponse.suggested_pesticides);
        console.log('✅ Suggested pesticides loaded:', suggestedResponse.suggested_pesticides.length);
      } else {
        console.log('❌ No suggested pesticides found');
        setSuggestedPesticides([]);
      }

    } catch (error) {
      console.error('❌ Error loading pesticide data:', error);
      setAdminSuggestedPesticide(null);
      setSuggestedPesticides([]);
    } finally {
      setLoadingAdminPesticide(false);
      setLoadingPesticides(false);
    }
  };

  // ✅ SELECT PESTICIDE FROM LIST
  const handleSelectPesticide = (pesticide) => {
    console.log('🎯 Pesticide selected:', pesticide);
    setSelectedPesticide(pesticide);
    setShowPesticideList(false);
  };

  // ✅ SAVE PESTICIDE
  const handleSavePesticide = async () => {
    if (!selectedPesticide) {
      Alert.alert('Error', 'Please select a pesticide first');
      return;
    }

    if (!currentCropHistoryId) {
      Alert.alert('Error', 'No crop selected. Please go back and select a crop first.');
      return;
    }

    setSaving(true);
    
    try {
      console.log('💾 Saving selected pesticide:', selectedPesticide);
      
      const savedFarmerId = await AsyncStorage.getItem('farmerId');
      if (!savedFarmerId) {
        throw new Error('Farmer ID not found. Please login again.');
      }

      // ✅ CREATE PESTICIDE ACTIVITY
      const success = await createPesticideActivity(selectedPesticide);
      
      if (success) {
        Alert.alert('Success', 'Pesticide applied successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            }
          }
        ]);
      } else {
        throw new Error('Failed to save pesticide activity');
      }
      
    } catch (error) {
      console.error('❌ Pesticide save error:', error);
      Alert.alert('Error', error.message || 'Failed to save pesticide. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ✅ CREATE PESTICIDE ACTIVITY
  const createPesticideActivity = async (pesticide) => {
    try {
      const activityData = {
        crop_history_id: currentCropHistoryId,
        activity_date: new Date().toISOString().split('T')[0],
        activity_type: 'Pesticide Application',
        description: pesticide.description || `Applied ${pesticide.name} (${pesticide.type}) - ${pesticide.dosage}`,
        chemical_or_fertilizer_used: `${pesticide.name} - ${pesticide.dosage}`,
        remarks: `Application Method: ${pesticide.application_method}, Waiting Period: ${pesticide.waiting_period || 'N/A'}, Target: ${pesticide.target_pests || 'General Pests'}`,
        is_public: false
      };

      console.log('🎯 Creating pesticide activity:', activityData);

      const activityResponse = await farmerAPI.addCropActivity(activityData);
      if (activityResponse.success) {
        console.log('✅ Pesticide activity created with ID:', activityResponse.activity_id);
        return true;
      } else {
        console.log('❌ Failed to create activity:', activityResponse.message);
        return false;
      }
    } catch (error) {
      console.error('💥 Error creating pesticide activity:', error);
      return false;
    }
  };

  // ✅ CHECK IF PESTICIDE IS ADMIN SUGGESTED
  const isAdminSuggested = (pesticide) => {
    if (!adminSuggestedPesticide || !pesticide) return false;
    
    // Compare by name and type for matching
    return pesticide.name === adminSuggestedPesticide.name && 
           pesticide.type === adminSuggestedPesticide.type;
  };

  // ✅ RENDER PESTICIDE ITEM FOR LIST
  const renderPesticideItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.pesticideListItem,
        isAdminSuggested(item) && styles.adminSuggestedItem
      ]}
      onPress={() => handleSelectPesticide(item)}
    >
      <View style={styles.pestListInfo}>
        <View style={styles.pestHeader}>
          <Text style={styles.pestListName}>{item.name}</Text>
          {isAdminSuggested(item) && (
            <View style={styles.adminBadge}>
              <Icon name="verified" size={12} color="white" />
              <Text style={styles.adminBadgeText}>Suggested</Text>
            </View>
          )}
        </View>
        <Text style={styles.pestListType}>Type: {item.type}</Text>
        {item.dosage && <Text style={styles.pestListDetail}>Dosage: {item.dosage}</Text>}
        {item.target_pests && <Text style={styles.pestListDetail}>Target: {item.target_pests}</Text>}
        {item.waiting_period && <Text style={styles.pestListDetail}>Waiting: {item.waiting_period}</Text>}
      </View>
      <Icon name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );

  // ✅ PESTICIDE LIST MODAL
  const PesticideListModal = () => (
    <Modal visible={showPesticideList} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.pestListModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Select Pesticide for {currentCropName}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowPesticideList(false)}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {loadingPesticides ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#DC2626" />
              <Text style={styles.loadingText}>Loading pesticides...</Text>
            </View>
          ) : suggestedPesticides.length > 0 ? (
            <FlatList
              data={suggestedPesticides}
              renderItem={renderPesticideItem}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              style={styles.pestList}
              ListHeaderComponent={
                adminSuggestedPesticide ? (
                  <View style={styles.adminNote}>
                    <Icon name="lightbulb" size={16} color="#DC2626" />
                    <Text style={styles.adminNoteText}>
                      Smart suggestion available based on crop usage patterns
                    </Text>
                  </View>
                ) : null
              }
            />
          ) : (
            <View style={styles.noPesticidesContainer}>
              <Icon name="bug-report" size={50} color="#ccc" />
              <Text style={styles.noPesticidesText}>
                No pesticides found for {currentCropName}
              </Text>
              <Text style={styles.noPesticidesSubtext}>
                Please contact admin to add pesticides for this crop
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  // ✅ GET CONFIDENCE LEVEL TEXT
  const getConfidenceText = () => {
    if (!adminSuggestedPesticide?.confidence) return '';
    
    const confidenceMap = {
      'high': 'Highly Recommended',
      'medium': 'Recommended', 
      'low': 'Suggested'
    };
    
    return confidenceMap[adminSuggestedPesticide.confidence] || 'Suggested';
  };

  // ✅ GET SOURCE TEXT
  const getSourceText = () => {
    if (!adminSuggestedPesticide?.source) return '';
    
    const sourceMap = {
      'most_used_in_history': `Based on most frequent usage (${adminSuggestedPesticide.usage_count} times)`,
      'recent_usage': 'Based on recent usage patterns',
      'crop_schedule': 'Based on standard crop schedule'
    };
    
    return sourceMap[adminSuggestedPesticide.source] || 'Based on crop data';
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          {/* ✅ CROP INFO SECTION - WITH CLICKABLE RANGE */}
          {currentCropName && (
            <View style={styles.cropInfoBox}>
              <Text style={styles.cropInfoTitle}>🌱 Current Crop: {currentCropName}</Text>
              
              {/* ✅ Pesticide Number */}
              {pesticideNumber && (
                <View style={styles.pesticideNumberBadge}>
                  <Text style={styles.pesticideNumberText}>
                    {pesticideNumber === 1 ? '1st' : pesticideNumber === 2 ? '2nd' : `${pesticideNumber}rd`} Pesticide Application
                  </Text>
                </View>
              )}
              
              {/* ✅ CLICKABLE Date Range from CropInputPage */}
              {rangeStart && rangeEnd && (
                <TouchableOpacity 
                  style={styles.dateRangeClickable}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateRangeLabel}>📅 Recommended Date Range (Tap to select):</Text>
                  <Text style={styles.dateRangeValue}>
                    {rangeStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – {rangeEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </Text>
                  <Text style={styles.tapToSelectText}>👆 Tap to select date from this range</Text>
                </TouchableOpacity>
              )}
              
              {/* ✅ Selected Application Date */}
              {selectedApplicationDate && (
                <TouchableOpacity 
                  style={styles.selectedDateBox}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.selectedDateLabel}>✅ Selected Application Date:</Text>
                  <Text style={styles.selectedDateValue}>
                    {selectedApplicationDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                  <Text style={styles.tapToChangeText}>👆 Tap to change</Text>
                </TouchableOpacity>
              )}
              
              {/* ✅ Activity Description */}
              {activityDescription && (
                <Text style={styles.activityDescText}>📋 {activityDescription}</Text>
              )}
            </View>
          )}
          
          
          {/* ✅ DATE PICKER */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedApplicationDate || scheduledDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={rangeStart || undefined}
              maximumDate={rangeEnd || undefined}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedApplicationDate(date);
                  console.log('📅 Selected application date:', date);
                }
              }}
            />
          )}

          {/* ✅ LOADING STATE */}
          {(loadingAdminPesticide || loadingPesticides) && (
            <View style={styles.loadingSection}>
              <ActivityIndicator size="large" color="#DC2626" />
              <Text style={styles.loadingSectionText}>Loading pesticide recommendations...</Text>
            </View>
          )}

          {/* ✅ ADMIN SUGGESTED PESTICIDE INFO - Only show if no recommendedPesticide from CropInputPage */}
          {adminSuggestedPesticide && !loadingAdminPesticide && !recommendedPesticide && (
            <View style={styles.adminSuggestedBox}>
              <View style={styles.adminHeader}>
                <Icon name="auto-awesome" size={20} color="#DC2626" />
                <Text style={styles.adminTitle}>Smart Suggestion</Text>
                <View style={[styles.confidenceBadge, 
                  adminSuggestedPesticide.confidence === 'high' && styles.confidenceHigh,
                  adminSuggestedPesticide.confidence === 'medium' && styles.confidenceMedium,
                  adminSuggestedPesticide.confidence === 'low' && styles.confidenceLow
                ]}>
                  <Text style={styles.confidenceText}>
                    {getConfidenceText()}
                  </Text>
                </View>
              </View>
              <Text style={styles.adminHelpText}>
                {getSourceText()}
              </Text>
            </View>
          )}

          {/* ✅ PESTICIDE SELECTION SECTION */}
          <View style={styles.selectionSection}>
            <Text style={styles.sectionTitle}>1. Select Pesticide</Text>
            
            {!selectedPesticide && !recommendedPesticide ? (
              <View style={styles.selectionContainer}>
                <Text style={styles.selectionHelpText}>
                  {adminSuggestedPesticide 
                    ? "We have a smart suggestion for you. You can use it or choose another from the list."
                    : `Choose from available pesticides for ${currentCropName}`
                  }
                </Text>
                
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => setShowPesticideList(true)}
                  disabled={loadingPesticides}
                >
                  {loadingPesticides ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Icon name="list" size={20} color="white" />
                      <Text style={styles.selectButtonText}>
                        {adminSuggestedPesticide ? "View All Options" : "Choose from List"} 
                        {suggestedPesticides.length > 0 && ` (${suggestedPesticides.length})`}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.selectedPesticideBox}>
                <View style={styles.selectedHeader}>
                  <View style={styles.selectedTitleContainer}>
                    <Text style={styles.selectedTitle}>
                      {recommendedPesticide && !selectedPesticide?.name
                        ? "🐛 Recommended Pesticide (From Schedule)"
                        : isAdminSuggested(selectedPesticide) 
                          ? "✅ Smart Suggested Pesticide" 
                          : "✅ Selected Pesticide"
                      }
                    </Text>
                    {isAdminSuggested(selectedPesticide) && !recommendedPesticide && (
                      <Text style={styles.smartSuggestionNote}>
                        {getConfidenceText()} • {getSourceText()}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={styles.changeButton}
                    onPress={() => setShowPesticideList(true)}
                  >
                    <Text style={styles.changeButtonText}>Change</Text>
                  </TouchableOpacity>
                </View>
                
                {/* ✅ PESTICIDE DETAILS - READ ONLY */}
                <View style={styles.pestDetailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{selectedPesticide?.name || recommendedPesticide}</Text>
                  </View>
                  
                  {selectedPesticide?.type && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Type:</Text>
                      <Text style={styles.detailValue}>{selectedPesticide.type}</Text>
                    </View>
                  )}
                  
                  {selectedPesticide?.dosage && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Dosage:</Text>
                      <Text style={styles.detailValue}>{selectedPesticide.dosage}</Text>
                    </View>
                  )}
                  
                  {selectedPesticide?.application_method && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Application Method:</Text>
                      <Text style={styles.detailValue}>{selectedPesticide.application_method}</Text>
                    </View>
                  )}
                  
                  {selectedPesticide?.target_pests && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Target Pests:</Text>
                      <Text style={styles.detailValue}>{selectedPesticide.target_pests}</Text>
                    </View>
                  )}
                  
                  {selectedPesticide?.waiting_period && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Waiting Period:</Text>
                      <Text style={styles.detailValue}>{selectedPesticide.waiting_period}</Text>
                    </View>
                  )}
                  
                  {selectedPesticide?.precaution && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Precautions:</Text>
                      <Text style={styles.detailValue}>{selectedPesticide.precaution}</Text>
                    </View>
                  )}
                  
                  {/* Show hint if only name is available (from recommendedPesticide) */}
                  {recommendedPesticide && !selectedPesticide?.type && (
                    <Text style={styles.selectMoreDetailsHint}>
                      👆 Tap "Change" to see full details and select from list
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* ✅ CONFIRM & GO BACK BUTTON - If came from CropInputPage */}
          {returnScreen && (selectedPesticide || recommendedPesticide) && (
            <TouchableOpacity 
              style={styles.confirmGoBackButton}
              onPress={async () => {
                const pestName = selectedPesticide?.name || recommendedPesticide;
                console.log('✅ Confirming pesticide:', pestName, 'for index:', pesticideIndex);
                
                // ✅ Store in AsyncStorage so CropInputPage can read it
                await AsyncStorage.setItem('confirmedPesticide', JSON.stringify({
                  selectedPesticide: pestName,
                  pesticideIndex: pesticideIndex
                }));
                
                // ✅ Just go back - don't navigate to new instance
                navigation.goBack();
              }}
            >
              <Icon name="check-circle" size={20} color="white" />
              <Text style={styles.confirmGoBackButtonText}>
                Confirm & Go Back
              </Text>
            </TouchableOpacity>
          )}

          {/* ✅ SAFETY WARNING */}
          {selectedPesticide && (
            <View style={styles.safetyWarning}>
              <Icon name="warning" size={16} color="#DC2626" />
              <Text style={styles.safetyWarningText}>
                Always follow safety precautions and waiting period before harvest
              </Text>
            </View>
          )}

          {/* ✅ SAVE BUTTON - Apply pesticide activity */}
          {selectedPesticide && !returnScreen && (
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.disabledButton]}
              onPress={handleSavePesticide}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>
                  CONFIRM & APPLY PESTICIDE
                </Text>
              )}
            </TouchableOpacity>
          )}

        </ScrollView>

        {/* ✅ PESTICIDE LIST MODAL */}
        <PesticideListModal />

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

// ✅ STYLES - Pesticide ke liye optimized color scheme
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#DC2626' },
  headerPlaceholder: { width: 24 },
  scrollContainer: { padding: 20, paddingBottom: 40 },

  // Loading Section
  loadingSection: { 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: 'white', 
    borderRadius: 12, 
    marginBottom: 20 
  },
  loadingSectionText: { 
    marginTop: 12, 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center' 
  },

  // ✅ NEW: Date range info styles
  pesticideNumberBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  pesticideNumberText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  dateRangeInfoBox: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  dateRangeClickable: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
    borderWidth: 1,
    borderColor: '#EF9A9A',
  },
  tapToSelectText: {
    fontSize: 11,
    color: '#B71C1C',
    marginTop: 6,
    fontWeight: '500',
  },
  selectedDateBox: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
    borderWidth: 1,
    borderColor: '#81C784',
  },
  selectedDateLabel: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  selectedDateValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 4,
  },
  tapToChangeText: {
    fontSize: 11,
    color: '#388E3C',
    marginTop: 6,
    fontWeight: '500',
  },
  
  // ✅ Recommended/Selected Pesticide Section
  recommendedSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  currentPesticideBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF9A9A',
  },
  currentPesticideInfo: {
    flex: 1,
  },
  currentPesticideLabel: {
    fontSize: 12,
    color: '#666',
  },
  currentPesticideName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B71C1C',
    marginTop: 2,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DC2626',
    marginLeft: 10,
  },
  changeButtonText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '600',
    marginLeft: 4,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dateRangeLabel: {
    fontSize: 12,
    color: '#B71C1C',
    fontWeight: '600',
  },
  dateRangeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B71C1C',
    marginTop: 4,
  },
  scheduledDateBox: {
    backgroundColor: '#FCE4EC',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  scheduledDateLabel: {
    fontSize: 12,
    color: '#C2185B',
    fontWeight: '500',
  },
  scheduledDateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#880E4F',
  },
  activityDescText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 6,
  },
  
  // Crop Info
  cropInfoBox: {
    backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, marginBottom: 20,
    borderLeftWidth: 4, borderLeftColor: '#DC2626',
  },
  cropInfoTitle: { fontSize: 16, fontWeight: 'bold', color: '#DC2626', marginBottom: 8 },
  cropInfoText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cropInfoSubtext: { fontSize: 14, color: '#666', marginTop: 4 },

  // Admin Suggested Box
  adminSuggestedBox: {
    backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, marginBottom: 20,
    borderLeftWidth: 4, borderLeftColor: '#DC2626',
  },
  adminHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8,
    flexWrap: 'wrap'
  },
  adminTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#DC2626', 
    marginLeft: 8,
    marginRight: 8
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  confidenceHigh: { backgroundColor: '#DC2626' },
  confidenceMedium: { backgroundColor: '#EA580C' },
  confidenceLow: { backgroundColor: '#9E9E9E' },
  confidenceText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  adminHelpText: { 
    fontSize: 14, 
    color: '#DC2626', 
    lineHeight: 20 
  },

  // Selection Section
  selectionSection: { marginBottom: 20 },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#DC2626', 
    marginBottom: 15 
  },
  selectionContainer: { 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 12 
  },
  selectionHelpText: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 15, 
    lineHeight: 22 
  },
  selectButton: {
    backgroundColor: '#DC2626', 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 8,
  },
  selectButtonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginLeft: 8 
  },

  // Selected Pesticide
  selectedPesticideBox: {
    backgroundColor: '#FEF2F2', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#DC2626',
  },
  selectedHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 12 
  },
  selectedTitleContainer: { flex: 1 },
  selectedTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#DC2626' 
  },
  smartSuggestionNote: { 
    fontSize: 12, 
    color: '#DC2626', 
    marginTop: 4, 
    fontStyle: 'italic' 
  },
  changeButton: { 
    backgroundColor: '#EA580C', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 6 
  },
  changeButtonText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },

  // Pesticide Details (Read Only)
  pestDetailsContainer: { 
    backgroundColor: 'white', 
    padding: 12, 
    borderRadius: 8 
  },
  detailRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  detailLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#333', 
    flex: 1 
  },
  detailValue: { 
    fontSize: 14, 
    color: '#666', 
    flex: 2, 
    textAlign: 'right' 
  },

  // Safety Warning
  safetyWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626'
  },
  safetyWarningText: {
    fontSize: 12,
    color: '#DC2626',
    marginLeft: 8,
    fontWeight: '500',
    flex: 1
  },

  // Save Button
  saveButton: {
    backgroundColor: '#DC2626', 
    paddingVertical: 16, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 20,
  },
  disabledButton: { backgroundColor: '#FCA5A5' },
  saveButtonText: { 
    color: 'white', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Confirm & Go Back Button
  confirmGoBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 16,
  },
  confirmGoBackButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // Hint for selecting more details
  selectMoreDetailsHint: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center', 
    fontWeight: 'bold' 
  },

  // Modal Styles
  modalOverlay: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  pestListModal: {
    backgroundColor: 'white', 
    borderRadius: 12, 
    width: '90%', 
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#DC2626', 
    flex: 1 
  },
  closeButton: { padding: 4 },
  pestList: { maxHeight: 400 },
  
  // Pesticide List Items
  pesticideListItem: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
  },
  adminSuggestedItem: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  pestListInfo: { flex: 1 },
  pestHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 4 
  },
  pestListName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#DC2626', 
    flex: 1 
  },
  adminBadge: { 
    backgroundColor: '#DC2626', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 4 
  },
  adminBadgeText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold',
    marginLeft: 2
  },
  pestListType: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 2 
  },
  pestListDetail: { 
    fontSize: 12, 
    color: '#888', 
    marginBottom: 1 
  },
  
  // Admin Note in Modal
  adminNote: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FEF2F2',
    padding: 12, 
    margin: 16, 
    borderRadius: 8, 
    marginBottom: 8,
  },
  adminNoteText: { 
    fontSize: 14, 
    color: '#DC2626', 
    marginLeft: 8, 
    fontWeight: '500' 
  },

  // Loading & Empty States
  loadingContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20 
  },
  loadingText: { 
    marginLeft: 8, 
    color: '#666', 
    fontSize: 14 
  },
  noPesticidesContainer: { 
    alignItems: 'center', 
    padding: 40 
  },
  noPesticidesText: { 
    fontSize: 16, 
    color: '#666', 
    marginTop: 12, 
    textAlign: 'center' 
  },
  noPesticidesSubtext: { 
    fontSize: 14, 
    color: '#999', 
    marginTop: 8, 
    textAlign: 'center' 
  },
});

export default PesticideInputPage;