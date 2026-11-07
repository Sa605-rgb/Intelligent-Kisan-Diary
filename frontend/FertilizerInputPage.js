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

// const FertilizerInputPage = ({ navigation, route }) => {
//   // Single fertilizer state
//   const [name, setName] = useState('');
//   const [type, setType] = useState('');
//   const [dosage, setDosage] = useState('');
//   const [applicationMethod, setApplicationMethod] = useState('');
//   const [timing, setTiming] = useState('');
  
//   // Multiple fertilizers list
//   const [fertilizers, setFertilizers] = useState([]);
  
//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [showTypeDropdown, setShowTypeDropdown] = useState(false);
//   const [showMethodDropdown, setShowMethodDropdown] = useState(false);

//   // ✅ NEW: Database se types aur methods
//   const [fertilizerTypes, setFertilizerTypes] = useState([]);
//   const [applicationMethods, setApplicationMethods] = useState([]);
//   const [typesLoading, setTypesLoading] = useState(false);
//   const [methodsLoading, setMethodsLoading] = useState(false);

//   // ✅ Load types and methods from database
//   useEffect(() => {
//     loadFertilizerTypes();
//     loadApplicationMethods();
//   }, []);

//   const loadFertilizerTypes = async () => {
//   setTypesLoading(true);
//   try {
//     const response = await farmerAPI.getFertilizerTypes();
//     if (response.success) {
//       const types = response.fertilizer_types.map(item => item.type);
//       setFertilizerTypes(types);
//     }
//   } catch (error) {
//     console.error('❌ Error loading fertilizer types:', error);
//     // Fallback...
//   } finally {
//     setTypesLoading(false);
//   }
// };

// const loadApplicationMethods = async () => {
//   setMethodsLoading(true);
//   try {
//     const response = await farmerAPI.getFertilizerApplicationMethods();
//     if (response.success) {
//       const methods = response.application_methods.map(item => item.application_method);
//       setApplicationMethods(methods);
//     }
//   } catch (error) {
//     console.error('❌ Error loading application methods:', error);
//     // Fallback...
//   } finally {
//     setMethodsLoading(false);
//   }
// };

//   // ✅ Agar route.params se fertilizer select kiya hai toh pre-fill karein
//   React.useEffect(() => {
//     if (route.params?.selectedFertilizer) {
//       const selected = route.params.selectedFertilizer;
//       setName(selected.name || '');
//       setType(selected.type || '');
//       setDosage(selected.dosage || '');
//       setApplicationMethod(selected.application_method || '');
//       setTiming(selected.timing || '');
//     }
//   }, [route.params?.selectedFertilizer]);

//   // ✅ UPDATED: Single fertilizer add karein list mein
//   const handleAddFertilizer = () => {
//     if (!name || !type || !dosage || !applicationMethod || !timing) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     const newFertilizer = {
//       id: Date.now().toString(),
//       name: name.trim(),
//       type: type,
//       dosage: dosage.trim(),
//       application_method: applicationMethod,
//       timing: timing.trim()
//     };

//     setFertilizers([...fertilizers, newFertilizer]);
    
//     // Reset form
//     setName('');
//     setType('');
//     setDosage('');
//     setApplicationMethod('');
//     setTiming('');
    
//     Alert.alert('Success', 'Fertilizer added to list!');
//   };

//   // ✅ UPDATED: Fertilizer edit karein
//   const handleEditFertilizer = (id) => {
//     const fertilizerToEdit = fertilizers.find(fertilizer => fertilizer.id === id);
//     if (fertilizerToEdit) {
//       setName(fertilizerToEdit.name);
//       setType(fertilizerToEdit.type);
//       setDosage(fertilizerToEdit.dosage);
//       setApplicationMethod(fertilizerToEdit.application_method);
//       setTiming(fertilizerToEdit.timing);
//       handleDeleteFertilizer(id);
//     }
//   };

//   // ✅ UPDATED: Fertilizer delete karein list se
//   const handleDeleteFertilizer = (id) => {
//     setFertilizers(fertilizers.filter(fertilizer => fertilizer.id !== id));
//   };

//   // ✅ UPDATED: Multiple fertilizers save karein backend mein
//   const handleSaveFertilizers = async () => {
//     if (fertilizers.length === 0) {
//       Alert.alert('Error', 'Please add at least one fertilizer');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       // Backend ke format mein convert karein
//       const fertilizersData = fertilizers.map(fertilizer => ({
//         name: fertilizer.name,
//         type: fertilizer.type,
//         dosage: fertilizer.dosage,
//         application_method: fertilizer.application_method,
//         timing: fertilizer.timing
//       }));

//       console.log('Sending fertilizers data:', fertilizersData);
      
//       // API call to backend - multiple fertilizers
//       const response = await farmerAPI.addMultipleFertilizers(fertilizersData);
      
//       Alert.alert('Success', response.message || `${fertilizers.length} fertilizers saved successfully!`, [
//         {
//           text: 'OK',
//           onPress: () => {
//             // Reset everything
//             setName('');
//             setType('');
//             setDosage('');
//             setApplicationMethod('');
//             setTiming('');
//             setFertilizers([]);
            
//             // ✅ NEW: Callback call karein agar parent page se aaye hain
//             if (route.params?.onFertilizerAdded) {
//               route.params.onFertilizerAdded(fertilizers[0]); // Pehla fertilizer return karein
//             }
            
//             // ✅ NEW: Multiple fertilizers ke liye callback
//             if (route.params?.onFertilizersSaved) {
//               route.params.onFertilizersSaved(fertilizers);
//             }
            
//             // Wapas navigate karein
//             navigation.goBack();
//           }
//         }
//       ]);
      
//     } catch (error) {
//       console.error('Fertilizers save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save fertilizers. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ NEW: Single fertilizer save karein (CropInputPage ke liye)
//   const handleSaveSingleFertilizer = async () => {
//     if (!name || !type || !dosage || !applicationMethod || !timing) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       const fertilizerData = {
//         name: name.trim(),
//         type: type,
//         dosage: dosage.trim(),
//         application_method: applicationMethod,
//         timing: timing.trim()
//       };

//       console.log('Saving single fertilizer:', fertilizerData);
      
//       // API call for single fertilizer
//       const response = await farmerAPI.addFertilizer(fertilizerData);
      
//       if (response.success) {
//         Alert.alert('Success', 'Fertilizer saved successfully!', [
//           {
//             text: 'OK',
//             onPress: () => {
//               // ✅ IMPORTANT: CropInputPage ko fertilizer ka data return karein
//               if (route.params?.onFertilizerAdded) {
//                 route.params.onFertilizerAdded({
//                   ...fertilizerData,
//                   id: response.fertilizer_id || Date.now().toString()
//                 });
//               }
//               navigation.goBack();
//             }
//           }
//         ]);
//       } else {
//         Alert.alert('Error', response.message || 'Failed to save fertilizer');
//       }
      
//     } catch (error) {
//       console.error('Single fertilizer save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save fertilizer. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ NEW: Determine which mode we're in
//   const isFromCropInput = route.params?.onFertilizerAdded;

//   // ✅ UPDATED: Single fertilizer item render karein
//   const renderFertilizerItem = ({ item }) => (
//     <View style={styles.fertilizerItem}>
//       <View style={styles.fertilizerInfo}>
//         <Text style={styles.fertilizerName}>{item.name}</Text>
//         <Text style={styles.fertilizerDetails}>Type: {item.type}</Text>
//         <Text style={styles.fertilizerDetails}>Dosage: {item.dosage}</Text>
//         <Text style={styles.fertilizerDetails}>Method: {item.application_method}</Text>
//         <Text style={styles.fertilizerDetails}>Timing: {item.timing}</Text>
//       </View>
//       <View style={styles.fertilizerActions}>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => handleEditFertilizer(item.id)}
//         >
//           <Icon name="edit" size={18} color="#4CAF50" />
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => handleDeleteFertilizer(item.id)}
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
//             {isFromCropInput ? 'Add New Fertilizer' : 'Add Fertilizer Details'}
//           </Text>
          
//           {/* Single Fertilizer Form */}
//           <View style={styles.fertilizerForm}>
//             {/* Name */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Fertilizer Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter fertilizer name"
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
//                 placeholder="e.g., 50kg per acre, 2 bags per hectare"
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

//             {/* Timing */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Timing *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., Before sowing, During growth, After harvest"
//                 value={timing}
//                 onChangeText={setTiming}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             {/* ✅ UPDATED: Add to List Button - only show if not from CropInput */}
//             {!isFromCropInput && (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={handleAddFertilizer}
//                 disabled={loading}
//               >
//                 <View style={styles.buttonContent}>
//                   <Icon name="add" size={20} color="white" />
//                   <Text style={styles.addButtonText}>Add to List</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* ✅ UPDATED: Fertilizers List - only show if not from CropInput */}
//           {!isFromCropInput && fertilizers.length > 0 && (
//             <View style={styles.fertilizersList}>
//               <Text style={styles.listTitle}>Added Fertilizers ({fertilizers.length})</Text>
//               <FlatList
//                 data={fertilizers}
//                 renderItem={renderFertilizerItem}
//                 keyExtractor={item => item.id}
//                 scrollEnabled={false}
//               />
//             </View>
//           )}

//           {/* ✅ UPDATED: Save Buttons based on mode */}
//           {isFromCropInput ? (
//             // Single fertilizer save for CropInput
//             <TouchableOpacity
//               style={[styles.saveButton, saving && styles.disabledButton]}
//               onPress={handleSaveSingleFertilizer}
//               disabled={saving}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>SAVE FERTILIZER</Text>
//               )}
//             </TouchableOpacity>
//           ) : (
//             // Multiple fertilizers save for standalone mode
//             <TouchableOpacity
//               style={[styles.saveButton, (saving || fertilizers.length === 0) && styles.disabledButton]}
//               onPress={handleSaveFertilizers}
//               disabled={saving || fertilizers.length === 0}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   SAVE {fertilizers.length} FERTILIZER(S)
//                 </Text>
//               )}
//             </TouchableOpacity>
//           )}
//         </ScrollView>

//         {/* ✅ UPDATED: Dropdown Modals - Now using database data */}
//         <DropdownModal
//           visible={showTypeDropdown}
//           items={fertilizerTypes}
//           onSelect={setType}
//           onClose={() => setShowTypeDropdown(false)}
//           title={typesLoading ? "Loading Types..." : "Select Fertilizer Type"}
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
//   fertilizerForm: {
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
//   fertilizersList: {
//     marginBottom: 20,
//   },
//   listTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#374151',
//     marginBottom: 10,
//   },
//   fertilizerItem: {
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
//   fertilizerInfo: {
//     flex: 1,
//   },
//   fertilizerName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 4,
//   },
//   fertilizerDetails: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 2,
//   },
//   fertilizerActions: {
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

// export default FertilizerInputPage;
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

// const FertilizerInputPage = ({ navigation, route }) => {
//   // Single fertilizer state
//   const [name, setName] = useState('');
//   const [type, setType] = useState('');
//   const [dosage, setDosage] = useState('');
//   const [applicationMethod, setApplicationMethod] = useState('');
//   const [timing, setTiming] = useState('');
  
//   // Multiple fertilizers list
//   const [fertilizers, setFertilizers] = useState([]);
  
//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [showTypeDropdown, setShowTypeDropdown] = useState(false);
//   const [showMethodDropdown, setShowMethodDropdown] = useState(false);

//   // ✅ Database se types aur methods
//   const [fertilizerTypes, setFertilizerTypes] = useState([]);
//   const [applicationMethods, setApplicationMethods] = useState([]);
//   const [typesLoading, setTypesLoading] = useState(false);
//   const [methodsLoading, setMethodsLoading] = useState(false);

//   // ✅ NEW: Fertilizer Activities States
//   const [fertilizerActivities, setFertilizerActivities] = useState([]);
//   const [showActivities, setShowActivities] = useState(false);
//   const [activitiesLoading, setActivitiesLoading] = useState(false);
  
//   // ✅ FIXED: Navigation params se directly data lein
//   const [currentCropHistoryId, setCurrentCropHistoryId] = useState(null);
//   const [currentCropName, setCurrentCropName] = useState('');

//   // ✅ NEW: Actual Activities Management
//   const [editingActivity, setEditingActivity] = useState(null);
//   const [showActualDatePicker, setShowActualDatePicker] = useState(false);
//   const [actualActivityDate, setActualActivityDate] = useState(null);
//   const [currentCropData, setCurrentCropData] = useState(null);

//   // ✅ Load types and methods from database
//   useEffect(() => {
//     loadFertilizerTypes();
//     loadApplicationMethods();
//     loadCurrentCropData();
//   }, []);

//   // ✅ FIXED: Load current crop data - Sowing date ke bina bhi kaam karega
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
        
//         // ✅ Sowing date nahi hai toh chhod dein - Date change ke liye zaroori nahi
//         const cropData = {
//           cropHistoryId: route.params.cropHistoryId,
//           cropName: route.params.cropName || '',
//           sowingDate: route.params.sowingDate || '' // ✅ Optional hai
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

//   // ✅ Load fertilizer types - Backend se hi
//   const loadFertilizerTypes = async () => {
//     setTypesLoading(true);
//     try {
//       const response = await farmerAPI.getFertilizerTypes();
//       if (response.success) {
//         const types = response.fertilizer_types.map(item => item.type);
//         setFertilizerTypes(types);
//       } else {
//         // ✅ Agar API fail hua toh empty array set karein
//         setFertilizerTypes([]);
//         Alert.alert('Info', 'Fertilizer types not available. Please add manually.');
//       }
//     } catch (error) {
//       console.error('❌ Error loading fertilizer types:', error);
//       // ✅ No hardcoded fallback - Empty array
//       setFertilizerTypes([]);
//     } finally {
//       setTypesLoading(false);
//     }
//   };

//   // ✅ Load application methods - Backend se hi
//   const loadApplicationMethods = async () => {
//     setMethodsLoading(true);
//     try {
//       const response = await farmerAPI.getFertilizerApplicationMethods();
//       if (response.success) {
//         const methods = response.application_methods.map(item => item.application_method);
//         setApplicationMethods(methods);
//       } else {
//         // ✅ Agar API fail hua toh empty array set karein
//         setApplicationMethods([]);
//         Alert.alert('Info', 'Application methods not available. Please add manually.');
//       }
//     } catch (error) {
//       console.error('❌ Error loading application methods:', error);
//       // ✅ No hardcoded fallback - Empty array
//       setApplicationMethods([]);
//     } finally {
//       setMethodsLoading(false);
//     }
//   };

//   // ✅ Calculate days from sowing - Only if data available
//   const calculateDaysFromSowing = (activityDate) => {
//     try {
//       // ✅ BETTER CHECK: currentCropData aur sowingDate dono check karein
//       if (!currentCropData || !currentCropData.sowingDate) {
//         return 'N/A';
//       }
      
//       const sowing = new Date(currentCropData.sowingDate);
//       const activity = new Date(activityDate);
      
//       // ✅ Date validation
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

//   // ✅ ADDED: Load fertilizer activities function
//   const loadFertilizerActivities = async () => {
//     try {
//       setActivitiesLoading(true);
      
//       if (!currentCropHistoryId) {
//         console.log('❌ No crop history ID available for activities');
//         return;
//       }

//       console.log('🔄 Loading fertilizer activities for:', currentCropHistoryId);
//       const response = await farmerAPI.getCropActivities(currentCropHistoryId);
      
//       if (response.success) {
//         // Sirf fertilizer-related activities filter karein
//         const fertilizerRelated = response.activities.filter(activity => {
//           const activityType = activity.activity_type?.toLowerCase();
//           const description = activity.description?.toLowerCase();
//           const chemicalUsed = activity.chemical_or_fertilizer_used?.toLowerCase();
          
//           return (
//             activityType?.includes('fertiliz') ||
//             activityType?.includes('fertili') ||
//             description?.includes('fertiliz') ||
//             description?.includes('fertili') ||
//             description?.includes('manure') ||
//             description?.includes('compost') ||
//             description?.includes('dap') ||
//             description?.includes('urea') ||
//             description?.includes('npk') ||
//             (chemicalUsed && (
//               chemicalUsed.includes('fertiliz') ||
//               chemicalUsed.includes('urea') ||
//               chemicalUsed.includes('dap') ||
//               chemicalUsed.includes('npk') ||
//               chemicalUsed.includes('compost') ||
//               chemicalUsed.includes('manure')
//             ))
//           );
//         });
        
//         console.log('✅ Filtered fertilizer activities:', fertilizerRelated.length);
//         setFertilizerActivities(fertilizerRelated);
//       } else {
//         console.log('❌ Failed to load activities:', response.message);
//         setFertilizerActivities([]);
//       }
//     } catch (error) {
//       console.error('❌ Error loading fertilizer activities:', error);
//       setFertilizerActivities([]);
//     } finally {
//       setActivitiesLoading(false);
//     }
//   };

//   // ✅ Toggle activities view
//   const toggleActivitiesView = () => {
//     if (!showActivities && currentCropHistoryId) {
//       loadFertilizerActivities();
//     }
//     setShowActivities(!showActivities);
//   };

//   // ✅ FIXED: Better debugging for mark as completed
  
// const handleMarkAsCompleted = (activity) => {
//   console.log('🎯 Mark as Completed clicked:', {
//     activityId: activity.id,
//     activityType: activity.activity_type,
//     scheduledDate: activity.activity_date,
//     isActual: activity.is_actual
//   });
  
//   // ✅ IMPROVED CHECK: Agar is_actual true hai (1, true, 'true') toh prevent karein
//   if (activity.is_actual === true || activity.is_actual === 1 || activity.is_actual === 'true') {
//     Alert.alert('Info', 'This activity is already marked as actual!');
//     return;
//   }

//   setEditingActivity(activity);
//   setActualActivityDate(new Date()); // Default aaj ki date
//   setShowActualDatePicker(true);
// };
//   // ✅ SIMPLEST SOLUTION - Only useState
// const handleSaveActualDate = () => {
//    console.log('🔍 DEBUG 1: editingActivity:', editingActivity?.id);
//   console.log('🔍 DEBUG 2: actualActivityDate:', actualActivityDate);
//   console.log('🔍 DEBUG 3: actualActivityDate type:', typeof actualActivityDate);
  
  
//   if (!editingActivity || !actualActivityDate) return;

//   const actualDateStr = actualActivityDate.toISOString().split('T')[0];
  
//   // ✅ DIRECT STATE UPDATE - No API, No Storage
//   setFertilizerActivities(prev => 
//     prev.map(activity => 
//       activity.id === editingActivity.id 
//         ? { 
//             ...activity, 
//             activity_date: actualDateStr,
//             is_actual: true,
//             description: `${activity.description} - ACTUAL`,
//             remarks: `Updated locally: ${actualDateStr}`
//           }
//         : activity
//     )
//   );

//   // ✅ IMMEDIATE UI FEEDBACK
//   setShowActualDatePicker(false);
//   setEditingActivity(null);
//   setActualActivityDate(null);
//   Alert.alert('✅ Updated!', 'Date changed successfully');
// };
//   // ✅ Agar route.params se fertilizer select kiya hai toh pre-fill karein
//   React.useEffect(() => {
//     if (route.params?.selectedFertilizer) {
//       const selected = route.params.selectedFertilizer;
//       setName(selected.name || '');
//       setType(selected.type || '');
//       setDosage(selected.dosage || '');
//       setApplicationMethod(selected.application_method || '');
//       setTiming(selected.timing || '');
//     }
//   }, [route.params?.selectedFertilizer]);

//   // ✅ Single fertilizer add karein list mein
//   const handleAddFertilizer = () => {
//     if (!name || !type || !dosage || !applicationMethod || !timing) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     const newFertilizer = {
//       id: Date.now().toString(),
//       name: name.trim(),
//       type: type,
//       dosage: dosage.trim(),
//       application_method: applicationMethod,
//       timing: timing.trim()
//     };

//     setFertilizers([...fertilizers, newFertilizer]);
    
//     // Reset form
//     setName('');
//     setType('');
//     setDosage('');
//     setApplicationMethod('');
//     setTiming('');
    
//     Alert.alert('Success', 'Fertilizer added to list!');
//   };

//   // ✅ Fertilizer edit karein
//   const handleEditFertilizer = (id) => {
//     const fertilizerToEdit = fertilizers.find(fertilizer => fertilizer.id === id);
//     if (fertilizerToEdit) {
//       setName(fertilizerToEdit.name);
//       setType(fertilizerToEdit.type);
//       setDosage(fertilizerToEdit.dosage);
//       setApplicationMethod(fertilizerToEdit.application_method);
//       setTiming(fertilizerToEdit.timing);
//       handleDeleteFertilizer(id);
//     }
//   };

//   // ✅ Fertilizer delete karein list se
//   const handleDeleteFertilizer = (id) => {
//     setFertilizers(fertilizers.filter(fertilizer => fertilizer.id !== id));
//   };

//   // ✅ Multiple fertilizers save karein backend mein
//   const handleSaveFertilizers = async () => {
//     if (fertilizers.length === 0) {
//       Alert.alert('Error', 'Please add at least one fertilizer');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       const fertilizersData = fertilizers.map(fertilizer => ({
//         name: fertilizer.name,
//         type: fertilizer.type,
//         dosage: fertilizer.dosage,
//         application_method: fertilizer.application_method,
//         timing: fertilizer.timing
//       }));

//       console.log('Sending fertilizers data:', fertilizersData);
      
//       const response = await farmerAPI.addMultipleFertilizers(fertilizersData);
      
//       Alert.alert('Success', response.message || `${fertilizers.length} fertilizers saved successfully!`, [
//         {
//           text: 'OK',
//           onPress: () => {
//             setName('');
//             setType('');
//             setDosage('');
//             setApplicationMethod('');
//             setTiming('');
//             setFertilizers([]);
            
//             if (route.params?.onFertilizerAdded) {
//               route.params.onFertilizerAdded(fertilizers[0]);
//             }
            
//             if (route.params?.onFertilizersSaved) {
//               route.params.onFertilizersSaved(fertilizers);
//             }
            
//             navigation.goBack();
//           }
//         }
//       ]);
      
//     } catch (error) {
//       console.error('Fertilizers save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save fertilizers. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ FIXED: Single fertilizer save karein (CropInputPage ke liye) with ACTIVITY
//   // ✅ ADD THESE DEBUG LINES AT THE START
// const handleSaveSingleFertilizer = async () => {
//   if (!name || !type || !dosage || !applicationMethod || !timing) {
//     Alert.alert('Error', 'Please fill all required fields');
//     return;
//   }

//   setSaving(true);
  
//   try {
//     // ✅ ADD COMPLETE DEBUGGING
//     console.log('🔍 COMPLETE DEBUG route.params:', JSON.stringify(route.params, null, 2));
//     console.log('🔍 COMPLETE DEBUG route.params.farmerId:', route.params?.farmerId);
//     console.log('🔍 COMPLETE DEBUG typeof farmerId:', typeof route.params?.farmerId);
    
//     if (route.params?.farmerId) {
//       console.log('🔍 farmerId value:', route.params.farmerId);
//       console.log('🔍 farmerId keys:', Object.keys(route.params.farmerId));
//       console.log('🔍 farmerId stringified:', JSON.stringify(route.params.farmerId));
//     }

//     const fertilizerData = {
//       name: name.trim(),
//       type: type,
//       dosage: dosage.trim(),
//       application_method: applicationMethod,
//       timing: timing.trim()
//     };

//     console.log('Saving single fertilizer:', fertilizerData);
    
//     // ✅ SIMPLIFIED FARMER ID EXTRACTION
//     let farmerIdToUse = null;
    
//     // Method 1: Direct extraction with better debugging
//     if (route.params?.farmerId) {
//       const farmerIdParam = route.params.farmerId;
//       console.log('🔍 farmerIdParam:', farmerIdParam);
//       console.log('🔍 typeof farmerIdParam:', typeof farmerIdParam);
      
//       // Agar object hai
//       if (typeof farmerIdParam === 'object' && farmerIdParam !== null) {
//         farmerIdToUse = farmerIdParam.id || farmerIdParam.farmer_id || farmerIdParam.farmerId;
//         console.log('🔍 Extracted from object:', farmerIdToUse);
//       }
//       // Agar number hai
//       else if (typeof farmerIdParam === 'number') {
//         farmerIdToUse = farmerIdParam;
//       }
//       // Agar string hai
//       else if (typeof farmerIdParam === 'string') {
//         farmerIdToUse = parseInt(farmerIdParam);
//       }
//     }
    
//     // Method 2: AsyncStorage
//     if (!farmerIdToUse) {
//       const savedFarmerId = await AsyncStorage.getItem('farmerId');
//       console.log('🔍 savedFarmerId from storage:', savedFarmerId);
//       if (savedFarmerId) {
//         farmerIdToUse = parseInt(savedFarmerId);
//       }
//     }
    
//     console.log('👨‍🌾 Final farmerIdToUse:', farmerIdToUse);
//     console.log('👨‍🌾 Type of farmerIdToUse:', typeof farmerIdToUse);
    
//     // ✅ FINAL VALIDATION
//     if (!farmerIdToUse || isNaN(farmerIdToUse)) {
//       console.log('❌ Invalid farmerId:', farmerIdToUse);
//       throw new Error('Valid Farmer ID not found. Please login again.');
//     }

//     // ✅ ENSURE IT'S A NUMBER
//     farmerIdToUse = Number(farmerIdToUse);
//     console.log('✅ Final numeric farmerId:', farmerIdToUse);

//     // ✅ CORRECTED: Farmer ID ko properly pass karein
//     console.log('🔄 Calling API with farmerId:', farmerIdToUse);
//     const response = await farmerAPI.addFertilizer(fertilizerData, farmerIdToUse);
    
//     if (response.success) {
//       // ✅ AUTOMATIC ACTIVITY CREATE KAREIN
//       if (currentCropHistoryId) {
//         await createFertilizerActivity(fertilizerData);
//       }
      
//       Alert.alert('Success', 'Fertilizer saved successfully!' + (currentCropHistoryId ? ' Activity created.' : ''), [
//         {
//           text: 'OK',
//           onPress: () => {
//             if (route.params?.onFertilizerAdded) {
//               route.params.onFertilizerAdded({
//                 ...fertilizerData,
//                 id: response.fertilizer_id || Date.now().toString()
//               });
//             }
//             navigation.goBack();
//           }
//         }
//       ]);
//     } else {
//       Alert.alert('Error', response.message || 'Failed to save fertilizer');
//     }
    
//   } catch (error) {
//     console.error('Single fertilizer save error:', error);
//     Alert.alert('Error', error.message || 'Failed to save fertilizer. Please try again.');
//   } finally {
//     setSaving(false);
//   }
// };
//   // ✅ FIXED: Create automatic fertilizer activity
//   const createFertilizerActivity = async (fertilizerData) => {
//     try {
//       const activityData = {
//         crop_history_id: currentCropHistoryId,
//         activity_date: new Date().toISOString().split('T')[0],
//         activity_type: 'Fertilization',
//         description: `Applied ${fertilizerData.name} (${fertilizerData.type}) - ${fertilizerData.dosage}`,
//         chemical_or_fertilizer_used: `${fertilizerData.name} - ${fertilizerData.dosage}`,
//         remarks: `Application Method: ${fertilizerData.application_method}, Timing: ${fertilizerData.timing}`,
//         is_public: false
//       };

//       const activityResponse = await farmerAPI.addCropActivity(activityData);
//       if (activityResponse.success) {
//         console.log('✅ Fertilizer activity created successfully');
//         loadFertilizerActivities();
//       } else {
//         console.log('❌ Failed to create activity:', activityResponse.message);
//       }
//     } catch (error) {
//       console.error('Error creating fertilizer activity:', error);
//     }
//   };

//   // ✅ Determine which mode we're in
//   const isFromCropInput = route.params?.onFertilizerAdded;

//   // ✅ Single fertilizer item render karein
//   const renderFertilizerItem = ({ item }) => (
//     <View style={styles.fertilizerItem}>
//       <View style={styles.fertilizerInfo}>
//         <Text style={styles.fertilizerName}>{item.name}</Text>
//         <Text style={styles.fertilizerDetails}>Type: {item.type}</Text>
//         <Text style={styles.fertilizerDetails}>Dosage: {item.dosage}</Text>
//         <Text style={styles.fertilizerDetails}>Method: {item.application_method}</Text>
//         <Text style={styles.fertilizerDetails}>Timing: {item.timing}</Text>
//       </View>
//       <View style={styles.fertilizerActions}>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => handleEditFertilizer(item.id)}
//         >
//           <Icon name="edit" size={18} color="#4CAF50" />
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => handleDeleteFertilizer(item.id)}
//         >
//           <Icon name="delete" size={18} color="#F44336" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   // ✅ FIXED: Render fertilizer activities with CORRECT DATES
//  // ✅ FIXED: Render function mein button visibility check
// const renderFertilizerActivity = (activity) => (
//   <View key={activity.id} style={styles.activityItem}>
//     <View style={styles.activityHeader}>
//       <View style={styles.activityTypeContainer}>
//         <Icon name="eco" size={16} color="#EA580C" />
//         <Text style={styles.activityType}>{activity.activity_type}</Text>
//         {activity.is_actual && (
//           <View style={styles.actualBadge}>
//             <Text style={styles.actualBadgeText}>ACTUAL</Text>
//           </View>
//         )}
//       </View>
//       <View style={styles.dateContainer}>
//         <Icon name="calendar-today" size={12} color="#666" />
//         <Text style={[
//           styles.activityDate,
//           activity.is_actual && styles.actualDate
//         ]}>
//           {new Date(activity.activity_date).toLocaleDateString('en-IN', {
//             day: 'numeric',
//             month: 'short', 
//             year: 'numeric'
//           })}
//         </Text>
//       </View>
//     </View>
    
//     <Text style={styles.activityDescription}>{activity.description}</Text>
    
//     {/* ✅ SIMPLE DATE INFO - Sowing date ke bina bhi */}
//     <View style={styles.daysInfo}>
//       <Text style={styles.daysInfoText}>
//         📅 {activity.is_actual ? 'Completed on' : 'Scheduled for'}: {new Date(activity.activity_date).toLocaleDateString('en-IN')}
//       </Text>
//     </View>
    
//     {activity.chemical_or_fertilizer_used && (
//       <View style={styles.chemicalContainer}>
//         <Icon name="science" size={14} color="#DC2626" />
//         <Text style={styles.activityChemical}>
//           {activity.chemical_or_fertilizer_used}
//         </Text>
//       </View>
//     )}
    
//     {activity.remarks && (
//       <Text style={styles.activityRemarks}>📝 {activity.remarks}</Text>
//     )}
    
//     {/* ✅ FIXED ACTION BUTTONS - Better check for is_actual */}
//     {/* ✅ IMPROVED: Check for false, null, undefined, 0, or empty string */}
//     {!activity.is_actual && (
//       <View style={styles.activityActions}>
//         <TouchableOpacity 
//           style={styles.completeButton}
//           onPress={() => {
//             console.log('🎯 Mark as Completed clicked for activity:', activity.id);
//             handleMarkAsCompleted(activity);
//           }}
//         >
//           <Icon name="check-circle" size={16} color="#4CAF50" />
//           <Text style={styles.completeButtonText}>Mark as Completed</Text>
//         </TouchableOpacity>
//       </View>
//     )}
//   </View>
// );


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

//   // ✅ FIXED: Actual Date Picker Modal - No hardcoded values
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
//             {isFromCropInput ? 'Add Fertilizer' : 'Fertilizer Management'}
//           </Text>
//           <View style={styles.headerPlaceholder} />
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <Text style={styles.sectionTitle}>
//             {isFromCropInput ? 'Add New Fertilizer' : 'Add Fertilizer Details'}
//           </Text>
          
//           {/* Single Fertilizer Form */}
//           <View style={styles.fertilizerForm}>
//             {/* Name */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Fertilizer Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter fertilizer name"
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
//                 placeholder="e.g., 50kg per acre, 2 bags per hectare"
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

//             {/* Timing */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Timing *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., Before sowing, During growth, After harvest"
//                 value={timing}
//                 onChangeText={setTiming}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             {/* Add to List Button - only show if not from CropInput */}
//             {!isFromCropInput && (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={handleAddFertilizer}
//                 disabled={loading}
//               >
//                 <View style={styles.buttonContent}>
//                   <Icon name="add" size={20} color="white" />
//                   <Text style={styles.addButtonText}>Add to List</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* ✅ FIXED: Fertilizer Activities Section */}
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
//                     color="#EA580C" 
//                   />
//                   <View>
//                     <Text style={styles.activitiesTitle}>
//                       Fertilizer Activities ({fertilizerActivities.length})
//                     </Text>
//                     {/* ✅ FIXED: Current crop name display */}
//                     <Text style={styles.currentCropText}>
//                       Current Crop: {currentCropName}
//                     </Text>
//                   </View>
//                 </View>
//                 <Icon name="eco" size={20} color="#EA580C" />
//               </TouchableOpacity>

//               {showActivities && (
//                 <View style={styles.activitiesList}>
//                   {activitiesLoading ? (
//                     <View style={styles.loadingContainer}>
//                       <ActivityIndicator size="small" color="#EA580C" />
//                       <Text style={styles.loadingText}>Loading activities...</Text>
//                     </View>
//                   ) : fertilizerActivities.length > 0 ? (
//                     fertilizerActivities.map(renderFertilizerActivity)
//                   ) : (
//                     <View style={styles.noActivitiesContainer}>
//                       <Icon name="eco" size={40} color="#D1D5DB" />
//                       <Text style={styles.noActivitiesText}>
//                         No fertilizer activities yet for {currentCropName}
//                       </Text>
//                       <Text style={styles.noActivitiesSubtext}>
//                         Add fertilizers to see activities here
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               )}
//             </View>
//           )}

//           {/* Fertilizers List - only show if not from CropInput */}
//           {!isFromCropInput && fertilizers.length > 0 && (
//             <View style={styles.fertilizersList}>
//               <Text style={styles.listTitle}>Added Fertilizers ({fertilizers.length})</Text>
//               <FlatList
//                 data={fertilizers}
//                 renderItem={renderFertilizerItem}
//                 keyExtractor={item => item.id}
//                 scrollEnabled={false}
//               />
//             </View>
//           )}

//           {/* Save Buttons based on mode */}
//           {isFromCropInput ? (
//             // Single fertilizer save for CropInput
//             <TouchableOpacity
//               style={[styles.saveButton, saving && styles.disabledButton]}
//               onPress={handleSaveSingleFertilizer}
//               disabled={saving}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   {currentCropHistoryId ? 'SAVE FERTILIZER & ACTIVITY' : 'SAVE FERTILIZER'}
//                 </Text>
//               )}
//             </TouchableOpacity>
//           ) : (
//             // Multiple fertilizers save for standalone mode
//             <TouchableOpacity
//               style={[styles.saveButton, (saving || fertilizers.length === 0) && styles.disabledButton]}
//               onPress={handleSaveFertilizers}
//               disabled={saving || fertilizers.length === 0}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   SAVE {fertilizers.length} FERTILIZER(S)
//                 </Text>
//               )}
//             </TouchableOpacity>
//           )}
//         </ScrollView>

//         {/* Dropdown Modals */}
//         <DropdownModal
//           visible={showTypeDropdown}
//           items={fertilizerTypes}
//           onSelect={setType}
//           onClose={() => setShowTypeDropdown(false)}
//           title={typesLoading ? "Loading Types..." : "Select Fertilizer Type"}
//         />

//         <DropdownModal
//           visible={showMethodDropdown}
//           items={applicationMethods}
//           onSelect={setApplicationMethod}
//           onClose={() => setShowMethodDropdown(false)}
//           title={methodsLoading ? "Loading Methods..." : "Select Application Method"}
//         />

//         {/* ✅ Actual Date Picker Modal */}
//         <ActualDatePickerModal />
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// // Styles same as before...
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
//   fertilizerForm: {
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
//   fertilizersList: {
//     marginBottom: 20,
//   },
//   listTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#374151',
//     marginBottom: 10,
//   },
//   fertilizerItem: {
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
//   fertilizerInfo: {
//     flex: 1,
//   },
//   fertilizerName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 4,
//   },
//   fertilizerDetails: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 2,
//   },
//   fertilizerActions: {
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
//   activitiesSection: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#FFE4CC',
//     overflow: 'hidden',
//   },
//   activitiesHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#FFF7ED',
//   },
//   activitiesTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   activitiesTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#EA580C',
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
//     backgroundColor: '#FFFBEB',
//   },
//   activityItem: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//     borderLeftWidth: 4,
//     borderLeftColor: '#EA580C',
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
//     color: '#EA580C',
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

// export default FertilizerInputPage;
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

// const FertilizerInputPage = ({ navigation, route }) => {
//   // Single fertilizer state
//   const [name, setName] = useState('');
//   const [type, setType] = useState('');
//   const [dosage, setDosage] = useState('');
//   const [applicationMethod, setApplicationMethod] = useState('');
//   const [timing, setTiming] = useState('');
  
//   // Multiple fertilizers list
//   const [fertilizers, setFertilizers] = useState([]);
  
//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [showTypeDropdown, setShowTypeDropdown] = useState(false);
//   const [showMethodDropdown, setShowMethodDropdown] = useState(false);

//   // ✅ Database se types aur methods
//   const [fertilizerTypes, setFertilizerTypes] = useState([]);
//   const [applicationMethods, setApplicationMethods] = useState([]);
//   const [typesLoading, setTypesLoading] = useState(false);
//   const [methodsLoading, setMethodsLoading] = useState(false);

//   // ✅ Fertilizer Activities States
//   const [fertilizerActivities, setFertilizerActivities] = useState([]);
//   const [showActivities, setShowActivities] = useState(false);
//   const [activitiesLoading, setActivitiesLoading] = useState(false);
  
//   // ✅ Crop data states
//   const [currentCropHistoryId, setCurrentCropHistoryId] = useState(null);
//   const [currentCropName, setCurrentCropName] = useState('');
//   const [currentCropData, setCurrentCropData] = useState(null);

//   // ✅ Actual Activities Management
//   const [editingActivity, setEditingActivity] = useState(null);
//   const [showActualDatePicker, setShowActualDatePicker] = useState(false);
//   const [actualActivityDate, setActualActivityDate] = useState(null);

//   // ✅ Load types and methods from database
//   useEffect(() => {
//     loadFertilizerTypes();
//     loadApplicationMethods();
//     loadCurrentCropData();
//   }, []);

//   // ✅ Load fertilizer activities when crop data is available
//   useEffect(() => {
//     if (currentCropHistoryId) {
//       console.log('🎯 Loading fertilizer activities for crop:', currentCropHistoryId);
//       loadFertilizerActivities();
//     }
//   }, [currentCropHistoryId]);

//   // ✅ FIXED: Load current crop data for activities
//   const loadCurrentCropData = async () => {
//     try {
//       console.log('🔍 DEBUG: Route params received:', route.params);
      
//       // Pehle navigation params check karein
//       if (route.params?.cropHistoryId) {
//         console.log('🎯 Using crop data from navigation:', {
//           cropHistoryId: route.params.cropHistoryId,
//           cropName: route.params.cropName,
//           isTemporary: route.params.isTemporary
//         });
        
//         // ✅ DIRECT SET karein without any hardcoded values
//         setCurrentCropHistoryId(route.params.cropHistoryId);
//         setCurrentCropName(route.params.cropName || '');
        
//         const cropData = {
//           cropHistoryId: route.params.cropHistoryId,
//           cropName: route.params.cropName || '',
//           isTemporary: route.params.isTemporary || false
//         };
        
//         setCurrentCropData(cropData);
//         console.log('✅ Crop data set:', cropData);
        
//         // ✅ ACTIVITIES IMMEDIATELY LOAD KARO
//         if (route.params.cropHistoryId) {
//           loadFertilizerActivities();
//         }
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
          
//           // ✅ ACTIVITIES IMMEDIATELY LOAD KARO
//           loadFertilizerActivities();
//         }
//       }
//     } catch (error) {
//       console.error('❌ Error loading current crop data:', error);
//     }
//   };

//   // ✅ Load fertilizer types - Backend se hi
//   const loadFertilizerTypes = async () => {
//     setTypesLoading(true);
//     try {
//       const response = await farmerAPI.getFertilizerTypes();
//       if (response.success) {
//         const types = response.fertilizer_types.map(item => item.type);
//         setFertilizerTypes(types);
//       } else {
//         setFertilizerTypes([]);
//         Alert.alert('Info', 'Fertilizer types not available. Please add manually.');
//       }
//     } catch (error) {
//       console.error('❌ Error loading fertilizer types:', error);
//       setFertilizerTypes([]);
//     } finally {
//       setTypesLoading(false);
//     }
//   };

//   // ✅ Load application methods - Backend se hi
//   const loadApplicationMethods = async () => {
//     setMethodsLoading(true);
//     try {
//       const response = await farmerAPI.getFertilizerApplicationMethods();
//       if (response.success) {
//         const methods = response.application_methods.map(item => item.application_method);
//         setApplicationMethods(methods);
//       } else {
//         setApplicationMethods([]);
//         Alert.alert('Info', 'Application methods not available. Please add manually.');
//       }
//     } catch (error) {
//       console.error('❌ Error loading application methods:', error);
//       setApplicationMethods([]);
//     } finally {
//       setMethodsLoading(false);
//     }
//   };

//   // ✅ LOAD FERTILIZER ACTIVITIES FUNCTION - SIRF EK BAAR
//   const loadFertilizerActivities = async () => {
//     try {
//       setActivitiesLoading(true);
      
//       if (!currentCropHistoryId) {
//         console.log('❌ No crop history ID available for activities');
//         return;
//       }

//       console.log('🔄 Loading fertilizer activities for cropHistoryId:', currentCropHistoryId);
//       const response = await farmerAPI.getCropActivities(currentCropHistoryId);
      
//       console.log('📥 Activities API Response:', response);
      
//       if (response.success) {
//         console.log('📊 All activities received:', response.activities.length);
        
//         // Sirf fertilizer-related activities filter karein
//         const fertilizerRelated = response.activities.filter(activity => {
//           const activityType = activity.activity_type?.toLowerCase() || '';
//           const description = activity.description?.toLowerCase() || '';
//           const chemicalUsed = activity.chemical_or_fertilizer_used?.toLowerCase() || '';
          
//           const isFertilizerActivity = (
//             activityType.includes('fertiliz') ||
//             activityType.includes('fertili') ||
//             description.includes('fertiliz') ||
//             description.includes('fertili') ||
//             description.includes('manure') ||
//             description.includes('compost') ||
//             description.includes('dap') ||
//             description.includes('urea') ||
//             description.includes('npk') ||
//             (chemicalUsed && (
//               chemicalUsed.includes('fertiliz') ||
//               chemicalUsed.includes('urea') ||
//               chemicalUsed.includes('dap') ||
//               chemicalUsed.includes('npk') ||
//               chemicalUsed.includes('compost') ||
//               chemicalUsed.includes('manure')
//             ))
//           );
          
//           return isFertilizerActivity;
//         });
        
//         console.log('✅ Filtered fertilizer activities:', fertilizerRelated.length);
//         setFertilizerActivities(fertilizerRelated);
//       } else {
//         console.log('❌ Failed to load activities:', response.message);
//         setFertilizerActivities([]);
//       }
//     } catch (error) {
//       console.error('❌ Error loading fertilizer activities:', error);
//       setFertilizerActivities([]);
//     } finally {
//       setActivitiesLoading(false);
//     }
//   };

//   // ✅ Calculate days from sowing - Only if data available
//   const calculateDaysFromSowing = (activityDate) => {
//     try {
//       // Pehle activity se hi sowing date lein
//       const activity = fertilizerActivities.find(a => a.activity_date === activityDate);
//       if (!activity || !activity.sowing_date) {
//         return 'N/A';
//       }
      
//       const sowing = new Date(activity.sowing_date);
//       const activityDateObj = new Date(activityDate);
      
//       const diffTime = activityDateObj - sowing;
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
//       return diffDays >= 0 ? `${diffDays} days` : 'N/A';
//     } catch (error) {
//       return 'N/A';
//     }
//   };

//   // ✅ Toggle activities view
//   const toggleActivitiesView = () => {
//     if (!showActivities && currentCropHistoryId) {
//       loadFertilizerActivities();
//     }
//     setShowActivities(!showActivities);
//   };

//   // ✅ FIXED: ACTUAL ACTIVITY MANAGEMENT FUNCTIONS
//   const handleMarkAsCompleted = (activity) => {
//     setEditingActivity(activity);
//     setActualActivityDate(new Date());
//     setShowActualDatePicker(true);
//   };

//   // ✅ OPTIMISTIC UPDATE: Ye code date change immediately show karega
//   const handleSaveActualDate = async () => {
//     if (!editingActivity || !actualActivityDate) {
//       Alert.alert('Error', 'Please select actual date');
//       return;
//     }

//     const actualDateStr = actualActivityDate.toISOString().split('T')[0];
//     const activityId = editingActivity.id;

//     // ✅ 1. PEHLE UI UPDATE KAREIN (Optimistic) - User ko turant change dikhega
//     setFertilizerActivities(prevActivities => 
//       prevActivities.map(activity => 
//         activity.id === activityId 
//           ? { 
//               ...activity, 
//               activity_date: actualDateStr,
//               is_actual: true,
//               description: activity.description + ' - ACTUAL',
//               remarks: `Originally scheduled: ${activity.activity_date} | Actual: ${actualDateStr}`
//             }
//           : activity
//       )
//     );

//     // ✅ 2. MODAL IMMEDIATELY CLOSE KAREIN
//     setShowActualDatePicker(false);
//     setEditingActivity(null);
//     setActualActivityDate(null);

//     // ✅ 3. BACKGROUND MEIN API CALL KAREIN (User wait nahi karega)
//     try {
//       console.log('🔄 Background API call for activity:', activityId);
      
//       const response = await farmerAPI.markActivityCompleted(activityId, actualDateStr);
      
//       if (response.success) {
//         console.log('✅ Activity successfully updated in backend');
//       } else {
//         // ✅ Agar API fail hua toh revert karein
//         console.log('⚠️ API failed, reverting UI...');
//         loadFertilizerActivities(); // Original data load karein
//       }
//     } catch (error) {
//       console.error('❌ Background API error:', error);
//       loadFertilizerActivities(); // Original data load karein
//     }
//   };

//   // ✅ DEBUG: Check if crop history exists
//   const debugCheckCropHistory = async () => {
//     try {
//       console.log('🔍 DEBUG: Checking crop history...');
//       console.log('📦 currentCropHistoryId:', currentCropHistoryId);
//       console.log('📦 currentCropName:', currentCropName);
      
//       if (!currentCropHistoryId) {
//         console.log('❌ No crop history ID');
//         return;
//       }
      
//       // Try to get activities - agar mil gayi toh crop history exists karti hai
//       const response = await farmerAPI.getCropActivities(currentCropHistoryId);
//       console.log('📥 Crop activities response:', response);
      
//       if (response.success) {
//         console.log('✅ Crop history exists, activities count:', response.count);
//       } else {
//         console.log('❌ Crop history may not exist');
//       }
//     } catch (error) {
//       console.error('💥 Debug check error:', error);
//     }
//   };

//   // UseEffect mein call karo
//   useEffect(() => {
//     if (currentCropHistoryId) {
//       debugCheckCropHistory();
//     }
//   }, [currentCropHistoryId]);

//   // ✅ Agar route.params se fertilizer select kiya hai toh pre-fill karein
//   React.useEffect(() => {
//     if (route.params?.selectedFertilizer) {
//       const selected = route.params.selectedFertilizer;
//       setName(selected.name || '');
//       setType(selected.type || '');
//       setDosage(selected.dosage || '');
//       setApplicationMethod(selected.application_method || '');
//       setTiming(selected.timing || '');
//     }
//   }, [route.params?.selectedFertilizer]);

//   // ✅ Single fertilizer add karein list mein
//   const handleAddFertilizer = () => {
//     if (!name || !type || !dosage || !applicationMethod || !timing) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     const newFertilizer = {
//       id: Date.now().toString(),
//       name: name.trim(),
//       type: type,
//       dosage: dosage.trim(),
//       application_method: applicationMethod,
//       timing: timing.trim()
//     };

//     setFertilizers([...fertilizers, newFertilizer]);
    
//     // Reset form
//     setName('');
//     setType('');
//     setDosage('');
//     setApplicationMethod('');
//     setTiming('');
    
//     Alert.alert('Success', 'Fertilizer added to list!');
//   };

//   // ✅ Fertilizer edit karein
//   const handleEditFertilizer = (id) => {
//     const fertilizerToEdit = fertilizers.find(fertilizer => fertilizer.id === id);
//     if (fertilizerToEdit) {
//       setName(fertilizerToEdit.name);
//       setType(fertilizerToEdit.type);
//       setDosage(fertilizerToEdit.dosage);
//       setApplicationMethod(fertilizerToEdit.application_method);
//       setTiming(fertilizerToEdit.timing);
//       handleDeleteFertilizer(id);
//     }
//   };

//   // ✅ Fertilizer delete karein list se
//   const handleDeleteFertilizer = (id) => {
//     setFertilizers(fertilizers.filter(fertilizer => fertilizer.id !== id));
//   };

//   // ✅ Multiple fertilizers save karein backend mein
//   const handleSaveFertilizers = async () => {
//     if (fertilizers.length === 0) {
//       Alert.alert('Error', 'Please add at least one fertilizer');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       const fertilizersData = fertilizers.map(fertilizer => ({
//         name: fertilizer.name,
//         type: fertilizer.type,
//         dosage: fertilizer.dosage,
//         application_method: fertilizer.application_method,
//         timing: fertilizer.timing
//       }));

//       console.log('Sending fertilizers data:', fertilizersData);
      
//       const response = await farmerAPI.addMultipleFertilizers(fertilizersData);
      
//       Alert.alert('Success', response.message || `${fertilizers.length} fertilizers saved successfully!`, [
//         {
//           text: 'OK',
//           onPress: () => {
//             setName('');
//             setType('');
//             setDosage('');
//             setApplicationMethod('');
//             setTiming('');
//             setFertilizers([]);
            
//             if (route.params?.onFertilizerAdded) {
//               route.params.onFertilizerAdded(fertilizers[0]);
//             }
            
//             if (route.params?.onFertilizersSaved) {
//               route.params.onFertilizersSaved(fertilizers);
//             }
            
//             navigation.goBack();
//           }
//         }
//       ]);
      
//     } catch (error) {
//       console.error('Fertilizers save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save fertilizers. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ FIXED: Single fertilizer save karein (CropInputPage ke liye) with ACTIVITIES REFRESH
//   // ✅ FIXED: Single fertilizer save karein - NO CALLBACK TO CROP PAGE
// const handleSaveSingleFertilizer = async () => {
//   if (!name || !type || !dosage || !applicationMethod || !timing) {
//     Alert.alert('Error', 'Please fill all required fields');
//     return;
//   }

//   setSaving(true);
  
//   try {
//     const fertilizerData = {
//       name: name.trim(),
//       type: type,
//       dosage: dosage.trim(),
//       application_method: applicationMethod,
//       timing: timing.trim()
//     };

//     console.log('Saving single fertilizer:', fertilizerData);
    
//     const savedFarmerId = await AsyncStorage.getItem('farmerId');
//     if (!savedFarmerId) {
//       throw new Error('Farmer ID not found. Please login again.');
//     }

//     const farmerIdToUse = parseInt(savedFarmerId);
//     console.log('👨‍🌾 Using farmerId:', farmerIdToUse);

//     const response = await farmerAPI.addFertilizer(fertilizerData, farmerIdToUse);
    
//     if (response.success) {
//       // ✅ FERTILIZER ACTIVITY CREATE KARO
//       if (currentCropHistoryId) {
//         await createFertilizerActivity(fertilizerData);
//       }
      
//       Alert.alert('Success', 'Fertilizer saved successfully!', [
//         {
//           text: 'OK',
//           onPress: async () => {
//             // ✅ ACTIVITIES KO REFRESH KARO
//             if (currentCropHistoryId) {
//               await loadFertilizerActivities();
//               console.log('✅ Fertilizer activities refreshed after save');
//             }
            
//             // ✅ USER KO OPTION DO KE BACK JAYE YA RAHE
//             Alert.alert(
//               'Fertilizer Saved',
//               'Fertilizer has been saved successfully. New activity has been created.',
//               [
//                 {
//                   text: 'Add Another Fertilizer',
//                   style: 'cancel',
//                   onPress: () => {
//                     // Reset form for next fertilizer
//                     setName('');
//                     setType('');
//                     setDosage('');
//                     setApplicationMethod('');
//                     setTiming('');
                    
//                     // ✅ ACTIVITIES SECTION AUTO EXPAND KARO
//                     setShowActivities(true);
//                   }
//                 },
//                 {
//                   text: 'Go Back to Crop',
//                   onPress: () => {
//                     // ✅ SIRF NAVIGATION, KOI CALLBACK NAHI
//                     navigation.goBack();
//                   }
//                 }
//               ]
//             );
//           }
//         }
//       ]);
//     } else {
//       Alert.alert('Error', response.message || 'Failed to save fertilizer');
//     }
    
//   } catch (error) {
//     console.error('❌ Single fertilizer save error:', error);
//     Alert.alert('Error', error.message || 'Failed to save fertilizer. Please try again.');
//   } finally {
//     setSaving(false);
//   }
// };
//   // ✅ FIXED: Create automatic fertilizer activity (Yeh function ensure karo ke properly work kare)
//   const createFertilizerActivity = async (fertilizerData) => {
//     try {
//       const activityData = {
//         crop_history_id: currentCropHistoryId,
//         activity_date: new Date().toISOString().split('T')[0], // Current date
//         activity_type: 'Fertilization',
//         description: `Applied ${fertilizerData.name} (${fertilizerData.type}) - ${fertilizerData.dosage}`,
//         chemical_or_fertilizer_used: `${fertilizerData.name} - ${fertilizerData.dosage}`,
//         remarks: `Application Method: ${fertilizerData.application_method}, Timing: ${fertilizerData.timing}`,
//         is_actual: true, // ✅ ACTUAL ACTIVITY BANAYEIN
//         is_public: false
//       };

//       console.log('🎯 Creating fertilizer activity:', activityData);

//       const activityResponse = await farmerAPI.addCropActivity(activityData);
//       if (activityResponse.success) {
//         console.log('✅ Fertilizer activity created successfully with ID:', activityResponse.activity_id);
//         return true;
//       } else {
//         console.log('❌ Failed to create activity:', activityResponse.message);
//         return false;
//       }
//     } catch (error) {
//       console.error('💥 Error creating fertilizer activity:', error);
//       return false;
//     }
//   };

//   // ✅ Determine which mode we're in
//   const isFromCropInput = route.params?.cropHistoryId;
//   // ✅ Single fertilizer item render karein
//   const renderFertilizerItem = ({ item }) => (
//     <View style={styles.fertilizerItem}>
//       <View style={styles.fertilizerInfo}>
//         <Text style={styles.fertilizerName}>{item.name}</Text>
//         <Text style={styles.fertilizerDetails}>Type: {item.type}</Text>
//         <Text style={styles.fertilizerDetails}>Dosage: {item.dosage}</Text>
//         <Text style={styles.fertilizerDetails}>Method: {item.application_method}</Text>
//         <Text style={styles.fertilizerDetails}>Timing: {item.timing}</Text>
//       </View>
//       <View style={styles.fertilizerActions}>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => handleEditFertilizer(item.id)}
//         >
//           <Icon name="edit" size={18} color="#4CAF50" />
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => handleDeleteFertilizer(item.id)}
//         >
//           <Icon name="delete" size={18} color="#F44336" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   // ✅ FIXED: Render fertilizer activities with CORRECT DATES
//   const renderFertilizerActivity = (activity) => (
//     <View key={activity.id} style={styles.activityItem}>
//       <View style={styles.activityHeader}>
//         <View style={styles.activityTypeContainer}>
//           <Icon name="eco" size={16} color="#EA580C" />
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
      
//       {/* ✅ Days calculation - Only if sowing date available from backend */}
//       {currentCropData?.sowingDate && (
//         <View style={styles.daysInfo}>
//           <Text style={styles.daysInfoText}>
//             📅 Sowing ({currentCropData.sowingDate}) se {calculateDaysFromSowing(activity.activity_date)} din baad
//             {activity.is_actual && " (Actual)"}
//           </Text>
//         </View>
//       )}
      
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
      
//       {/* ✅ ACTION BUTTONS - Only for scheduled activities */}
//       {!activity.is_actual && (
//         <View style={styles.activityActions}>
//           <TouchableOpacity 
//             style={styles.completeButton}
//             onPress={() => handleMarkAsCompleted(activity)}
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

//   // ✅ FIXED: Actual Date Picker Modal - No hardcoded values
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
//             {isFromCropInput ? 'Add Fertilizer' : 'Fertilizer Management'}
//           </Text>
//           <View style={styles.headerPlaceholder} />
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <Text style={styles.sectionTitle}>
//             {isFromCropInput ? 'Add New Fertilizer' : 'Add Fertilizer Details'}
//           </Text>
          
//           {/* Single Fertilizer Form */}
//           <View style={styles.fertilizerForm}>
//             {/* Name */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Fertilizer Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter fertilizer name"
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
//                 placeholder="e.g., 50kg per acre, 2 bags per hectare"
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

//             {/* Timing */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Timing *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., Before sowing, During growth, After harvest"
//                 value={timing}
//                 onChangeText={setTiming}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             {/* Add to List Button - only show if not from CropInput */}
//             {!isFromCropInput && (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={handleAddFertilizer}
//                 disabled={loading}
//               >
//                 <View style={styles.buttonContent}>
//                   <Icon name="add" size={20} color="white" />
//                   <Text style={styles.addButtonText}>Add to List</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* ✅ FERTILIZER ACTIVITIES SECTION */}
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
//                     color="#EA580C" 
//                   />
//                   <View>
//                     <Text style={styles.activitiesTitle}>
//                       Fertilizer Activities ({fertilizerActivities.length})
//                     </Text>
//                     <Text style={styles.currentCropText}>
//                       Current Crop: {currentCropName}
//                       {currentCropData?.isTemporary && " (Temporary)"}
//                     </Text>
//                   </View>
//                 </View>
//                 <Icon name="eco" size={20} color="#EA580C" />
//               </TouchableOpacity>

//               {/* ✅ AUTO EXPAND KARO AGAR ACTIVITIES HAIN */}
//               {(showActivities || fertilizerActivities.length > 0) && (
//                 <View style={styles.activitiesList}>
//                   {activitiesLoading ? (
//                     <View style={styles.loadingContainer}>
//                       <ActivityIndicator size="small" color="#EA580C" />
//                       <Text style={styles.loadingText}>Loading activities...</Text>
//                     </View>
//                   ) : fertilizerActivities.length > 0 ? (
//                     fertilizerActivities.map(renderFertilizerActivity)
//                   ) : (
//                     <View style={styles.noActivitiesContainer}>
//                       <Icon name="eco" size={40} color="#D1D5DB" />
//                       <Text style={styles.noActivitiesText}>
//                         No fertilizer activities yet for {currentCropName}
//                       </Text>
//                       <Text style={styles.noActivitiesSubtext}>
//                         Add fertilizers to see activities here
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               )}
//             </View>
//           )}

//           {/* Fertilizers List - only show if not from CropInput */}
//           {!isFromCropInput && fertilizers.length > 0 && (
//             <View style={styles.fertilizersList}>
//               <Text style={styles.listTitle}>Added Fertilizers ({fertilizers.length})</Text>
//               <FlatList
//                 data={fertilizers}
//                 renderItem={renderFertilizerItem}
//                 keyExtractor={item => item.id}
//                 scrollEnabled={false}
//               />
//             </View>
//           )}

//           {/* Save Buttons based on mode */}
//           {isFromCropInput ? (
//             // Single fertilizer save for CropInput
//             <TouchableOpacity
//               style={[styles.saveButton, saving && styles.disabledButton]}
//               onPress={handleSaveSingleFertilizer}
//               disabled={saving}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   {currentCropHistoryId ? 'SAVE FERTILIZER & ACTIVITY' : 'SAVE FERTILIZER'}
//                 </Text>
//               )}
//             </TouchableOpacity>
//           ) : (
//             // Multiple fertilizers save for standalone mode
//             <TouchableOpacity
//               style={[styles.saveButton, (saving || fertilizers.length === 0) && styles.disabledButton]}
//               onPress={handleSaveFertilizers}
//               disabled={saving || fertilizers.length === 0}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   SAVE {fertilizers.length} FERTILIZER(S)
//                 </Text>
//               )}
//             </TouchableOpacity>
//           )}
//         </ScrollView>

//         {/* Dropdown Modals */}
//         <DropdownModal
//           visible={showTypeDropdown}
//           items={fertilizerTypes}
//           onSelect={setType}
//           onClose={() => setShowTypeDropdown(false)}
//           title={typesLoading ? "Loading Types..." : "Select Fertilizer Type"}
//         />

//         <DropdownModal
//           visible={showMethodDropdown}
//           items={applicationMethods}
//           onSelect={setApplicationMethod}
//           onClose={() => setShowMethodDropdown(false)}
//           title={methodsLoading ? "Loading Methods..." : "Select Application Method"}
//         />

//         {/* ✅ Actual Date Picker Modal */}
//         <ActualDatePickerModal />
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// // Styles (same as before)
// const styles = StyleSheet.create({
//   // ... all your existing styles remain the same
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
//   fertilizerForm: {
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
//   fertilizersList: {
//     marginBottom: 20,
//   },
//   listTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#374151',
//     marginBottom: 10,
//   },
//   fertilizerItem: {
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
//   fertilizerInfo: {
//     flex: 1,
//   },
//   fertilizerName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 4,
//   },
//   fertilizerDetails: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 2,
//   },
//   fertilizerActions: {
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
 
//   // ✅ FERTILIZER ACTIVITIES SECTION STYLES
//   activitiesSection: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#FFE4CC',
//     overflow: 'hidden',
//   },
//   activitiesHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#FFF7ED',
//   },
//   activitiesTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   activitiesTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#EA580C',
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
//     backgroundColor: '#FFFBEB',
//   },
//   activityItem: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//     borderLeftWidth: 4,
//     borderLeftColor: '#EA580C',
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
//     color: '#EA580C',
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

// export default FertilizerInputPage;


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

// const FertilizerInputPage = ({ navigation, route }) => {
//   // Single fertilizer state
//   const [name, setName] = useState('');
//   const [type, setType] = useState('');
//   const [dosage, setDosage] = useState('');
//   const [applicationMethod, setApplicationMethod] = useState('');
//   const [timing, setTiming] = useState('');
  
//   // Multiple fertilizers list
//   const [fertilizers, setFertilizers] = useState([]);
  
//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [showTypeDropdown, setShowTypeDropdown] = useState(false);
//   const [showMethodDropdown, setShowMethodDropdown] = useState(false);

//   // ✅ Database se types aur methods
//   const [fertilizerTypes, setFertilizerTypes] = useState([]);
//   const [applicationMethods, setApplicationMethods] = useState([]);
//   const [typesLoading, setTypesLoading] = useState(false);
//   const [methodsLoading, setMethodsLoading] = useState(false);

//   // ✅ Fertilizer Activities States
//   const [fertilizerActivities, setFertilizerActivities] = useState([]);
//   const [showActivities, setShowActivities] = useState(false);
//   const [activitiesLoading, setActivitiesLoading] = useState(false);
  
//   // ✅ Crop data states
//   const [currentCropHistoryId, setCurrentCropHistoryId] = useState(null);
//   const [currentCropName, setCurrentCropName] = useState('');
//   const [currentCropData, setCurrentCropData] = useState(null);

//   // ✅ Actual Activities Management
//   const [editingActivity, setEditingActivity] = useState(null);
//   const [showActualDatePicker, setShowActualDatePicker] = useState(false);
//   const [actualActivityDate, setActualActivityDate] = useState(null);

//   // ✅ Load types and methods from database
//   useEffect(() => {
//     loadFertilizerTypes();
//     loadApplicationMethods();
//     loadCurrentCropData();
//   }, []);

//   // ✅ Load fertilizer activities when crop data is available
//   useEffect(() => {
//     if (currentCropHistoryId) {
//       console.log('🎯 Loading fertilizer activities for crop:', currentCropHistoryId);
//       loadFertilizerActivities();
//     }
//   }, [currentCropHistoryId]);

//   // ✅ FIXED: Load current crop data for activities
//   const loadCurrentCropData = async () => {
//     try {
//       console.log('🔍 DEBUG: Route params received:', route.params);
      
//       // Pehle navigation params check karein
//       if (route.params?.cropHistoryId) {
//         console.log('🎯 Using crop data from navigation:', {
//           cropHistoryId: route.params.cropHistoryId,
//           cropName: route.params.cropName,
//           isTemporary: route.params.isTemporary
//         });
        
//         // ✅ DIRECT SET karein without any hardcoded values
//         setCurrentCropHistoryId(route.params.cropHistoryId);
//         setCurrentCropName(route.params.cropName || '');
        
//         const cropData = {
//           cropHistoryId: route.params.cropHistoryId,
//           cropName: route.params.cropName || '',
//           isTemporary: route.params.isTemporary || false
//         };
        
//         setCurrentCropData(cropData);
//         console.log('✅ Crop data set:', cropData);
        
//         // ✅ ACTIVITIES IMMEDIATELY LOAD KARO
//         if (route.params.cropHistoryId) {
//           loadFertilizerActivities();
//         }
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
          
//           // ✅ ACTIVITIES IMMEDIATELY LOAD KARO
//           loadFertilizerActivities();
//         }
//       }
//     } catch (error) {
//       console.error('❌ Error loading current crop data:', error);
//     }
//   };

//   // ✅ Load fertilizer types - Backend se hi
//   const loadFertilizerTypes = async () => {
//     setTypesLoading(true);
//     try {
//       const response = await farmerAPI.getFertilizerTypes();
//       if (response.success) {
//         const types = response.fertilizer_types.map(item => item.type);
//         setFertilizerTypes(types);
//       } else {
//         setFertilizerTypes([]);
//         Alert.alert('Info', 'Fertilizer types not available. Please add manually.');
//       }
//     } catch (error) {
//       console.error('❌ Error loading fertilizer types:', error);
//       setFertilizerTypes([]);
//     } finally {
//       setTypesLoading(false);
//     }
//   };

//   // ✅ Load application methods - Backend se hi
//   const loadApplicationMethods = async () => {
//     setMethodsLoading(true);
//     try {
//       const response = await farmerAPI.getFertilizerApplicationMethods();
//       if (response.success) {
//         const methods = response.application_methods.map(item => item.application_method);
//         setApplicationMethods(methods);
//       } else {
//         setApplicationMethods([]);
//         Alert.alert('Info', 'Application methods not available. Please add manually.');
//       }
//     } catch (error) {
//       console.error('❌ Error loading application methods:', error);
//       setApplicationMethods([]);
//     } finally {
//       setMethodsLoading(false);
//     }
//   };

//   // // ✅ LOAD FERTILIZER ACTIVITIES FUNCTION - SIRF EK BAAR
//   // const loadFertilizerActivities = async () => {
//   //   try {
//   //     setActivitiesLoading(true);
      
//   //     if (!currentCropHistoryId) {
//   //       console.log('❌ No crop history ID available for activities');
//   //       return;
//   //     }

//   //     console.log('🔄 Loading fertilizer activities for cropHistoryId:', currentCropHistoryId);
//   //     const response = await farmerAPI.getCropActivities(currentCropHistoryId);
      
//   //     console.log('📥 Activities API Response:', response);
      
//   //     if (response.success) {
//   //       console.log('📊 All activities received:', response.activities.length);
        
//   //       // ✅ SOWING DATE ACTIVITIES SE HI LE LO
//   //       if (response.activities.length > 0) {
//   //         const firstActivity = response.activities[0];
//   //         if (firstActivity.sowing_date) {
//   //           setCurrentCropData(prev => ({
//   //             ...prev,
//   //             sowing_date: firstActivity.sowing_date
//   //           }));
//   //           console.log('✅ Sowing date set from activities:', firstActivity.sowing_date);
//   //         }
//   //       }
        
//   //       // Sirf fertilizer-related activities filter karein
//   //       const fertilizerRelated = response.activities.filter(activity => {
//   //         const activityType = activity.activity_type?.toLowerCase() || '';
//   //         const description = activity.description?.toLowerCase() || '';
//   //         const chemicalUsed = activity.chemical_or_fertilizer_used?.toLowerCase() || '';
          
//   //         const isFertilizerActivity = (
//   //           activityType.includes('fertiliz') ||
//   //           activityType.includes('fertili') ||
//   //           description.includes('fertiliz') ||
//   //           description.includes('fertili') ||
//   //           description.includes('manure') ||
//   //           description.includes('compost') ||
//   //           description.includes('dap') ||
//   //           description.includes('urea') ||
//   //           description.includes('npk') ||
//   //           (chemicalUsed && (
//   //             chemicalUsed.includes('fertiliz') ||
//   //             chemicalUsed.includes('urea') ||
//   //             chemicalUsed.includes('dap') ||
//   //             chemicalUsed.includes('npk') ||
//   //             chemicalUsed.includes('compost') ||
//   //             chemicalUsed.includes('manure')
//   //           ))
//   //         );
          
//   //         return isFertilizerActivity;
//   //       });
        
//   //       console.log('✅ Filtered fertilizer activities:', fertilizerRelated.length);
//   //       setFertilizerActivities(fertilizerRelated);
//   //     } else {
//   //       console.log('❌ Failed to load activities:', response.message);
//   //       setFertilizerActivities([]);
//   //     }
//   //   } catch (error) {
//   //     console.error('❌ Error loading fertilizer activities:', error);
//   //     setFertilizerActivities([]);
//   //   } finally {
//   //     setActivitiesLoading(false);
//   //   }
//   // };
// // ✅ CORRECTED: Load fertilizer activities with proper sowing date
// const loadFertilizerActivities = async () => {
//   try {
//     setActivitiesLoading(true);
    
//     if (!currentCropHistoryId) {
//       console.log('❌ No crop history ID available for activities');
//       return;
//     }

//     console.log('🔄 Loading activities for cropHistoryId:', currentCropHistoryId);
//     const response = await farmerAPI.getCropActivities(currentCropHistoryId);
    
//     console.log('📥 Activities API Response:', response);
    
//     if (response.success) {
//       console.log('📊 All activities received:', response.activities.length);
      
//       // ✅ IMPORTANT: Pehle sowing date activity find karein
//       const sowingActivity = response.activities.find(activity => 
//         activity.activity_type && activity.activity_type.includes('Sowing')
//       );
      
//       if (sowingActivity) {
//         console.log('🌱 Sowing activity found:', sowingActivity);
//         setCurrentCropData(prev => ({
//           ...prev,
//           sowing_date: sowingActivity.activity_date // ✅ Yahan se sowing date lein
//         }));
//         console.log('✅ Sowing date set from sowing activity:', sowingActivity.activity_date);
//       } else {
//         console.log('❌ No sowing activity found in activities');
//       }
      
//       // ✅ Sirf Fertilization activities filter karein
//       const fertilizerActivities = response.activities.filter(activity => 
//         activity.activity_type && activity.activity_type.includes('Fertilization')
//       );
      
//       console.log('✅ Fertilization activities found:', fertilizerActivities.length);
//       setFertilizerActivities(fertilizerActivities);
      
//     } else {
//       console.log('❌ Failed to load activities');
//       setFertilizerActivities([]);
//     }
//   } catch (error) {
//     console.error('❌ Error loading activities:', error);
//     setFertilizerActivities([]);
//   } finally {
//     setActivitiesLoading(false);
//   }
// };
//   // // ✅ Calculate days from sowing - Only if data available
//   // const calculateDaysFromSowing = (activityDate) => {
//   //   try {
//   //     // ✅ Multiple sources se sowing date get karo
//   //     const sowingDateStr = currentCropData?.sowing_date;
      
//   //     if (!sowingDateStr) {
//   //       return 'N/A';
//   //     }
      
//   //     const sowing = new Date(sowingDateStr);
//   //     const activityDateObj = new Date(activityDate);
      
//   //     // ✅ Date validation
//   //     if (isNaN(sowing.getTime()) || isNaN(activityDateObj.getTime())) {
//   //       return 'N/A';
//   //     }
      
//   //     const diffTime = activityDateObj - sowing;
//   //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
//   //     return diffDays >= 0 ? `${diffDays} days` : 'N/A';
//   //   } catch (error) {
//   //     console.error('Days calculation error:', error);
//   //     return 'N/A';
//   //   }
//   // };
// // ✅ TEST: Calculate days function check karein
// // ✅ IMPROVED: Calculate days from sowing with better error handling
// const calculateDaysFromSowing = (activityDate) => {
//   try {
//     const sowingDateStr = currentCropData?.sowing_date;
    
//     console.log('📅 DEBUG - Sowing Date Check:', {
//       sowingDate: sowingDateStr,
//       activityDate: activityDate,
//       hasSowingDate: !!sowingDateStr,
//       hasActivityDate: !!activityDate
//     });
    
//     if (!sowingDateStr) {
//       console.log('❌ No sowing date available in currentCropData');
//       return 'Sowing date not available';
//     }
    
//     if (!activityDate) {
//       console.log('❌ No activity date provided');
//       return 'Activity date not available';
//     }
    
//     const sowing = new Date(sowingDateStr);
//     const activityDateObj = new Date(activityDate);
    
//     if (isNaN(sowing.getTime())) {
//       console.log('❌ Invalid sowing date:', sowingDateStr);
//       return 'Invalid sowing date';
//     }
    
//     if (isNaN(activityDateObj.getTime())) {
//       console.log('❌ Invalid activity date:', activityDate);
//       return 'Invalid activity date';
//     }
    
//     const diffTime = activityDateObj - sowing;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     console.log('📆 Days Calculation Result:', {
//       sowing: sowing.toDateString(),
//       activity: activityDateObj.toDateString(),
//       diffDays: diffDays
//     });
    
//     return diffDays >= 0 ? `${diffDays} days after sowing` : 'Before sowing';
//   } catch (error) {
//     console.error('❌ Days calculation error:', error);
//     return 'Calculation error';
//   }
// };
//   // ✅ Toggle activities view
//   const toggleActivitiesView = () => {
//     if (!showActivities && currentCropHistoryId) {
//       loadFertilizerActivities();
//     }
//     setShowActivities(!showActivities);
//   };

//   // ✅ FIXED: ACTUAL ACTIVITY MANAGEMENT FUNCTIONS
//   const handleMarkAsCompleted = (activity) => {
//     setEditingActivity(activity);
//     setActualActivityDate(new Date());
//     setShowActualDatePicker(true);
//   };

//   // ✅ OPTIMISTIC UPDATE: Ye code date change immediately show karega
//   const handleSaveActualDate = async () => {
//     if (!editingActivity || !actualActivityDate) {
//       Alert.alert('Error', 'Please select actual date');
//       return;
//     }

//     const actualDateStr = actualActivityDate.toISOString().split('T')[0];
//     const activityId = editingActivity.id;

//     // ✅ 1. PEHLE UI UPDATE KAREIN (Optimistic) - User ko turant change dikhega
//     setFertilizerActivities(prevActivities => 
//       prevActivities.map(activity => 
//         activity.id === activityId 
//           ? { 
//               ...activity, 
//               activity_date: actualDateStr,
//               is_actual: true,
//               description: activity.description + ' - ACTUAL',
//               remarks: `Originally scheduled: ${activity.activity_date} | Actual: ${actualDateStr}`
//             }
//           : activity
//       )
//     );

//     // ✅ 2. MODAL IMMEDIATELY CLOSE KAREIN
//     setShowActualDatePicker(false);
//     setEditingActivity(null);
//     setActualActivityDate(null);

//     // ✅ 3. BACKGROUND MEIN API CALL KAREIN (User wait nahi karega)
//     try {
//       console.log('🔄 Background API call for activity:', activityId);
      
//       const response = await farmerAPI.markActivityCompleted(activityId, actualDateStr);
      
//       if (response.success) {
//         console.log('✅ Activity successfully updated in backend');
//       } else {
//         // ✅ Agar API fail hua toh revert karein
//         console.log('⚠️ API failed, reverting UI...');
//         loadFertilizerActivities(); // Original data load karein
//       }
//     } catch (error) {
//       console.error('❌ Background API error:', error);
//       loadFertilizerActivities(); // Original data load karein
//     }
//   };

//   // ✅ DEBUG: Check if crop history exists
//   const debugCheckCropHistory = async () => {
//     try {
//       console.log('🔍 DEBUG: Checking crop history...');
//       console.log('📦 currentCropHistoryId:', currentCropHistoryId);
//       console.log('📦 currentCropName:', currentCropName);
      
//       if (!currentCropHistoryId) {
//         console.log('❌ No crop history ID');
//         return;
//       }
      
//       // Try to get activities - agar mil gayi toh crop history exists karti hai
//       const response = await farmerAPI.getCropActivities(currentCropHistoryId);
//       console.log('📥 Crop activities response:', response);
      
//       if (response.success) {
//         console.log('✅ Crop history exists, activities count:', response.count);
//       } else {
//         console.log('❌ Crop history may not exist');
//       }
//     } catch (error) {
//       console.error('💥 Debug check error:', error);
//     }
//   };

//   // UseEffect mein call karo
//   useEffect(() => {
//     if (currentCropHistoryId) {
//       debugCheckCropHistory();
//     }
//   }, [currentCropHistoryId]);

//   // ✅ Agar route.params se fertilizer select kiya hai toh pre-fill karein
//   React.useEffect(() => {
//     if (route.params?.selectedFertilizer) {
//       const selected = route.params.selectedFertilizer;
//       setName(selected.name || '');
//       setType(selected.type || '');
//       setDosage(selected.dosage || '');
//       setApplicationMethod(selected.application_method || '');
//       setTiming(selected.timing || '');
//     }
//   }, [route.params?.selectedFertilizer]);

//   // ✅ Single fertilizer add karein list mein
//   const handleAddFertilizer = () => {
//     if (!name || !type || !dosage || !applicationMethod || !timing) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     const newFertilizer = {
//       id: Date.now().toString(),
//       name: name.trim(),
//       type: type,
//       dosage: dosage.trim(),
//       application_method: applicationMethod,
//       timing: timing.trim()
//     };

//     setFertilizers([...fertilizers, newFertilizer]);
    
//     // Reset form
//     setName('');
//     setType('');
//     setDosage('');
//     setApplicationMethod('');
//     setTiming('');
    
//     Alert.alert('Success', 'Fertilizer added to list!');
//   };

//   // ✅ Fertilizer edit karein
//   const handleEditFertilizer = (id) => {
//     const fertilizerToEdit = fertilizers.find(fertilizer => fertilizer.id === id);
//     if (fertilizerToEdit) {
//       setName(fertilizerToEdit.name);
//       setType(fertilizerToEdit.type);
//       setDosage(fertilizerToEdit.dosage);
//       setApplicationMethod(fertilizerToEdit.application_method);
//       setTiming(fertilizerToEdit.timing);
//       handleDeleteFertilizer(id);
//     }
//   };

//   // ✅ Fertilizer delete karein list se
//   const handleDeleteFertilizer = (id) => {
//     setFertilizers(fertilizers.filter(fertilizer => fertilizer.id !== id));
//   };

//   // ✅ Multiple fertilizers save karein backend mein
//   const handleSaveFertilizers = async () => {
//     if (fertilizers.length === 0) {
//       Alert.alert('Error', 'Please add at least one fertilizer');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       const fertilizersData = fertilizers.map(fertilizer => ({
//         name: fertilizer.name,
//         type: fertilizer.type,
//         dosage: fertilizer.dosage,
//         application_method: fertilizer.application_method,
//         timing: fertilizer.timing
//       }));

//       console.log('Sending fertilizers data:', fertilizersData);
      
//       const response = await farmerAPI.addMultipleFertilizers(fertilizersData);
      
//       Alert.alert('Success', response.message || `${fertilizers.length} fertilizers saved successfully!`, [
//         {
//           text: 'OK',
//           onPress: () => {
//             setName('');
//             setType('');
//             setDosage('');
//             setApplicationMethod('');
//             setTiming('');
//             setFertilizers([]);
            
//             if (route.params?.onFertilizerAdded) {
//               route.params.onFertilizerAdded(fertilizers[0]);
//             }
            
//             if (route.params?.onFertilizersSaved) {
//               route.params.onFertilizersSaved(fertilizers);
//             }
            
//             navigation.goBack();
//           }
//         }
//       ]);
      
//     } catch (error) {
//       console.error('Fertilizers save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save fertilizers. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ FIXED: Single fertilizer save karein (CropInputPage ke liye) with ACTIVITIES REFRESH
//   const handleSaveSingleFertilizer = async () => {
//     if (!name || !type || !dosage || !applicationMethod || !timing) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       const fertilizerData = {
//         name: name.trim(),
//         type: type,
//         dosage: dosage.trim(),
//         application_method: applicationMethod,
//         timing: timing.trim()
//       };

//       console.log('Saving single fertilizer:', fertilizerData);
      
//       const savedFarmerId = await AsyncStorage.getItem('farmerId');
//       if (!savedFarmerId) {
//         throw new Error('Farmer ID not found. Please login again.');
//       }

//       const farmerIdToUse = parseInt(savedFarmerId);
//       console.log('👨‍🌾 Using farmerId:', farmerIdToUse);

//       const response = await farmerAPI.addFertilizer(fertilizerData, farmerIdToUse);
      
//       if (response.success) {
//         // ✅ FERTILIZER ACTIVITY CREATE KARO
//         if (currentCropHistoryId) {
//           await createFertilizerActivity(fertilizerData);
//         }
        
//         Alert.alert('Success', 'Fertilizer saved successfully!', [
//           {
//             text: 'OK',
//             onPress: async () => {
//               // ✅ ACTIVITIES KO REFRESH KARO
//               if (currentCropHistoryId) {
//                 await loadFertilizerActivities();
//                 console.log('✅ Fertilizer activities refreshed after save');
//               }
              
//               // ✅ USER KO OPTION DO KE BACK JAYE YA RAHE
//               Alert.alert(
//                 'Fertilizer Saved',
//                 'Fertilizer has been saved successfully. New activity has been created.',
//                 [
//                   {
//                     text: 'Add Another Fertilizer',
//                     style: 'cancel',
//                     onPress: () => {
//                       // Reset form for next fertilizer
//                       setName('');
//                       setType('');
//                       setDosage('');
//                       setApplicationMethod('');
//                       setTiming('');
                      
//                       // ✅ ACTIVITIES SECTION AUTO EXPAND KARO
//                       setShowActivities(true);
//                     }
//                   },
//                   {
//                     text: 'Go Back to Crop',
//                     onPress: () => {
//                       // ✅ SIRF NAVIGATION, KOI CALLBACK NAHI
//                       navigation.goBack();
//                     }
//                   }
//                 ]
//               );
//             }
//           }
//         ]);
//       } else {
//         Alert.alert('Error', response.message || 'Failed to save fertilizer');
//       }
      
//     } catch (error) {
//       console.error('❌ Single fertilizer save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save fertilizer. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ FIXED: Create automatic fertilizer activity (Yeh function ensure karo ke properly work kare)
//   const createFertilizerActivity = async (fertilizerData) => {
//     try {
//       const activityData = {
//         crop_history_id: currentCropHistoryId,
//         activity_date: new Date().toISOString().split('T')[0], // Current date
//         activity_type: 'Fertilization',
//         description: `Applied ${fertilizerData.name} (${fertilizerData.type}) - ${fertilizerData.dosage}`,
//         chemical_or_fertilizer_used: `${fertilizerData.name} - ${fertilizerData.dosage}`,
//         remarks: `Application Method: ${fertilizerData.application_method}, Timing: ${fertilizerData.timing}`,
//         is_actual: true, // ✅ ACTUAL ACTIVITY BANAYEIN
//         is_public: false
//       };

//       console.log('🎯 Creating fertilizer activity:', activityData);

//       const activityResponse = await farmerAPI.addCropActivity(activityData);
//       if (activityResponse.success) {
//         console.log('✅ Fertilizer activity created successfully with ID:', activityResponse.activity_id);
//         return true;
//       } else {
//         console.log('❌ Failed to create activity:', activityResponse.message);
//         return false;
//       }
//     } catch (error) {
//       console.error('💥 Error creating fertilizer activity:', error);
//       return false;
//     }
//   };

//   // ✅ Determine which mode we're in
//   const isFromCropInput = route.params?.cropHistoryId;
  
//   // ✅ Single fertilizer item render karein
//   const renderFertilizerItem = ({ item }) => (
//     <View style={styles.fertilizerItem}>
//       <View style={styles.fertilizerInfo}>
//         <Text style={styles.fertilizerName}>{item.name}</Text>
//         <Text style={styles.fertilizerDetails}>Type: {item.type}</Text>
//         <Text style={styles.fertilizerDetails}>Dosage: {item.dosage}</Text>
//         <Text style={styles.fertilizerDetails}>Method: {item.application_method}</Text>
//         <Text style={styles.fertilizerDetails}>Timing: {item.timing}</Text>
//       </View>
//       <View style={styles.fertilizerActions}>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => handleEditFertilizer(item.id)}
//         >
//           <Icon name="edit" size={18} color="#4CAF50" />
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => handleDeleteFertilizer(item.id)}
//         >
//           <Icon name="delete" size={18} color="#F44336" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   // ✅ FIXED: Render fertilizer activities with CORRECT DATES
//   const renderFertilizerActivity = (activity) => (
//     <View key={activity.id} style={styles.activityItem}>
//       <View style={styles.activityHeader}>
//         <View style={styles.activityTypeContainer}>
//           <Icon name="eco" size={16} color="#EA580C" />
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
//             {/* ✅ SIMPLE DATE DISPLAY */}
//             {new Date(activity.activity_date).toLocaleDateString('en-IN')}
//           </Text>
//         </View>
//       </View>
      
//       <Text style={styles.activityDescription}>{activity.description}</Text>
      
//       {/* ✅ SIMPLE DAYS CALCULATION */}
//       {currentCropData?.sowing_date && (
//         <View style={styles.daysInfo}>
//           <Text style={styles.daysInfoText}>
//             📅 Sowing se {calculateDaysFromSowing(activity.activity_date)} baad
//             {activity.is_actual && " (Actual)"}
//           </Text>
//         </View>
//       )}
      
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
      
//       {/* ✅ ACTION BUTTONS - Only for scheduled activities */}
//       {!activity.is_actual && (
//         <View style={styles.activityActions}>
//           <TouchableOpacity 
//             style={styles.completeButton}
//             onPress={() => handleMarkAsCompleted(activity)}
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

//   // ✅ FIXED: Actual Date Picker Modal - No hardcoded values
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
//             {isFromCropInput ? 'Add Fertilizer' : 'Fertilizer Management'}
//           </Text>
//           <View style={styles.headerPlaceholder} />
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <Text style={styles.sectionTitle}>
//             {isFromCropInput ? 'Add New Fertilizer' : 'Add Fertilizer Details'}
//           </Text>
          
//           {/* Single Fertilizer Form */}
//           <View style={styles.fertilizerForm}>
//             {/* Name */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Fertilizer Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter fertilizer name"
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
//                 placeholder="e.g., 50kg per acre, 2 bags per hectare"
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

//             {/* Timing */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Timing *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., Before sowing, During growth, After harvest"
//                 value={timing}
//                 onChangeText={setTiming}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             {/* Add to List Button - only show if not from CropInput */}
//             {!isFromCropInput && (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={handleAddFertilizer}
//                 disabled={loading}
//               >
//                 <View style={styles.buttonContent}>
//                   <Icon name="add" size={20} color="white" />
//                   <Text style={styles.addButtonText}>Add to List</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* ✅ FERTILIZER ACTIVITIES SECTION */}
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
//                     color="#EA580C" 
//                   />
//                   <View>
//                     <Text style={styles.activitiesTitle}>
//                       Fertilizer Activities ({fertilizerActivities.length})
//                     </Text>
//                     <Text style={styles.currentCropText}>
//                       Current Crop: {currentCropName}
//                       {currentCropData?.isTemporary && " (Temporary)"}
//                     </Text>
//                   </View>
//                 </View>
//                 <Icon name="eco" size={20} color="#EA580C" />
//               </TouchableOpacity>

//               {/* ✅ AUTO EXPAND KARO AGAR ACTIVITIES HAIN */}
//               {(showActivities || fertilizerActivities.length > 0) && (
//                 <View style={styles.activitiesList}>
//                   {activitiesLoading ? (
//                     <View style={styles.loadingContainer}>
//                       <ActivityIndicator size="small" color="#EA580C" />
//                       <Text style={styles.loadingText}>Loading activities...</Text>
//                     </View>
//                   ) : fertilizerActivities.length > 0 ? (
//                     fertilizerActivities.map(renderFertilizerActivity)
//                   ) : (
//                     <View style={styles.noActivitiesContainer}>
//                       <Icon name="eco" size={40} color="#D1D5DB" />
//                       <Text style={styles.noActivitiesText}>
//                         No fertilizer activities yet for {currentCropName}
//                       </Text>
//                       <Text style={styles.noActivitiesSubtext}>
//                         Add fertilizers to see activities here
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               )}
//             </View>
//           )}

//           {/* ✅ TEMPORARY DEBUG - Check karne ke liye */}
//           {isFromCropInput && (
//             <View style={styles.debugSection}>
//               <Text style={styles.debugText}>
//                 🔍 CropHistoryId: {currentCropHistoryId}
//               </Text>
//               <Text style={styles.debugText}>
//                 🔍 Activities: {fertilizerActivities.length}
//               </Text>
//               {fertilizerActivities.length > 0 && (
//                 <Text style={styles.debugText}>
//                   🔍 First Activity Date: {fertilizerActivities[0].activity_date}
//                 </Text>
//               )}
//             </View>
//           )}

//           {/* Fertilizers List - only show if not from CropInput */}
//           {!isFromCropInput && fertilizers.length > 0 && (
//             <View style={styles.fertilizersList}>
//               <Text style={styles.listTitle}>Added Fertilizers ({fertilizers.length})</Text>
//               <FlatList
//                 data={fertilizers}
//                 renderItem={renderFertilizerItem}
//                 keyExtractor={item => item.id}
//                 scrollEnabled={false}
//               />
//             </View>
//           )}

//           {/* Save Buttons based on mode */}
//           {isFromCropInput ? (
//             // Single fertilizer save for CropInput
//             <TouchableOpacity
//               style={[styles.saveButton, saving && styles.disabledButton]}
//               onPress={handleSaveSingleFertilizer}
//               disabled={saving}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   {currentCropHistoryId ? 'SAVE FERTILIZER & ACTIVITY' : 'SAVE FERTILIZER'}
//                 </Text>
//               )}
//             </TouchableOpacity>
//           ) : (
//             // Multiple fertilizers save for standalone mode
//             <TouchableOpacity
//               style={[styles.saveButton, (saving || fertilizers.length === 0) && styles.disabledButton]}
//               onPress={handleSaveFertilizers}
//               disabled={saving || fertilizers.length === 0}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   SAVE {fertilizers.length} FERTILIZER(S)
//                 </Text>
//               )}
//             </TouchableOpacity>
//           )}
//         </ScrollView>

//         {/* Dropdown Modals */}
//         <DropdownModal
//           visible={showTypeDropdown}
//           items={fertilizerTypes}
//           onSelect={setType}
//           onClose={() => setShowTypeDropdown(false)}
//           title={typesLoading ? "Loading Types..." : "Select Fertilizer Type"}
//         />

//         <DropdownModal
//           visible={showMethodDropdown}
//           items={applicationMethods}
//           onSelect={setApplicationMethod}
//           onClose={() => setShowMethodDropdown(false)}
//           title={methodsLoading ? "Loading Methods..." : "Select Application Method"}
//         />

//         {/* ✅ Actual Date Picker Modal */}
//         <ActualDatePickerModal />
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// // Styles
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
//   fertilizerForm: {
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
//   fertilizersList: {
//     marginBottom: 20,
//   },
//   listTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#374151',
//     marginBottom: 10,
//   },
//   fertilizerItem: {
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
//   fertilizerInfo: {
//     flex: 1,
//   },
//   fertilizerName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     marginBottom: 4,
//   },
//   fertilizerDetails: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 2,
//   },
//   fertilizerActions: {
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
 
//   // ✅ FERTILIZER ACTIVITIES SECTION STYLES
//   activitiesSection: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#FFE4CC',
//     overflow: 'hidden',
//   },
//   activitiesHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#FFF7ED',
//   },
//   activitiesTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   activitiesTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#EA580C',
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
//     backgroundColor: '#FFFBEB',
//   },
//   activityItem: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//     borderLeftWidth: 4,
//     borderLeftColor: '#EA580C',
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
//     color: '#EA580C',
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
//   // ✅ DEBUG STYLES
//   debugSection: {
//     backgroundColor: '#FFF3CD',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//     borderLeftWidth: 4,
//     borderLeftColor: '#FFC107',
//   },
//   debugText: {
//     fontSize: 12,
//     color: '#856404',
//     fontFamily: 'monospace',
//   },
// });

// export default FertilizerInputPage;
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

// const FertilizerInputPage = ({ navigation, route }) => {
//   // ✅ FERTILIZER SELECTION STATES
//   const [suggestedFertilizers, setSuggestedFertilizers] = useState([]);
//   const [showFertilizerList, setShowFertilizerList] = useState(false);
//   const [selectedFertilizer, setSelectedFertilizer] = useState(null);
//   const [loadingFertilizers, setLoadingFertilizers] = useState(false);

//   // ✅ CROP DATA STATES
//   const [currentCropHistoryId, setCurrentCropHistoryId] = useState(null);
//   const [currentCropName, setCurrentCropName] = useState('');
//   const [saving, setSaving] = useState(false);

//   // ✅ Load data on component mount
//   useEffect(() => {
//     loadCurrentCropData();
//   }, []);

//   // ✅ Load suggested fertilizers when crop data is available
//   useEffect(() => {
//     if (currentCropName) {
//       loadSuggestedFertilizers();
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

//   // ✅ LOAD SUGGESTED FERTILIZERS
//   const loadSuggestedFertilizers = async () => {
//     if (!currentCropName) {
//       console.log('❌ No crop name available');
//       return;
//     }

//     setLoadingFertilizers(true);
//     try {
//       console.log('🌱 Loading suggested fertilizers for:', currentCropName);
//       const response = await farmerAPI.getSuggestedFertilizers(currentCropName);
      
//       if (response.success && response.suggested_fertilizers) {
//         setSuggestedFertilizers(response.suggested_fertilizers);
//         console.log('✅ Suggested fertilizers loaded:', response.suggested_fertilizers.length);
//       } else {
//         console.log('❌ No suggested fertilizers found');
//         setSuggestedFertilizers([]);
//       }
//     } catch (error) {
//       console.error('❌ Error loading suggested fertilizers:', error);
//       setSuggestedFertilizers([]);
//     } finally {
//       setLoadingFertilizers(false);
//     }
//   };

//   // ✅ SELECT FERTILIZER FROM LIST
//   const handleSelectFertilizer = (fertilizer) => {
//     console.log('🎯 Fertilizer selected:', fertilizer);
//     setSelectedFertilizer(fertilizer);
//     setShowFertilizerList(false);
//   };

//   // ✅ SAVE FERTILIZER
//   const handleSaveFertilizer = async () => {
//     if (!selectedFertilizer) {
//       Alert.alert('Error', 'Please select a fertilizer first');
//       return;
//     }

//     if (!currentCropHistoryId) {
//       Alert.alert('Error', 'No crop selected. Please go back and select a crop first.');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       console.log('💾 Saving selected fertilizer:', selectedFertilizer);
      
//       const savedFarmerId = await AsyncStorage.getItem('farmerId');
//       if (!savedFarmerId) {
//         throw new Error('Farmer ID not found. Please login again.');
//       }

//       // ✅ CREATE FERTILIZER ACTIVITY
//       await createFertilizerActivity(selectedFertilizer);
      
//       Alert.alert('Success', 'Fertilizer applied successfully!', [
//         {
//           text: 'OK',
//           onPress: () => {
//             navigation.goBack();
//           }
//         }
//       ]);
      
//     } catch (error) {
//       console.error('❌ Fertilizer save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save fertilizer. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ CREATE FERTILIZER ACTIVITY
//   const createFertilizerActivity = async (fertilizer) => {
//     try {
//       const activityData = {
//         crop_history_id: currentCropHistoryId,
//         activity_date: new Date().toISOString().split('T')[0], // Current date
//         activity_type: 'Fertilization',
//         description: `Applied ${fertilizer.name} (${fertilizer.type}) - ${fertilizer.dosage}`,
//         chemical_or_fertilizer_used: `${fertilizer.name} - ${fertilizer.dosage}`,
//         remarks: `Application Method: ${fertilizer.application_method}, Timing: ${fertilizer.timing}`,
//         is_public: false
//       };

//       console.log('🎯 Creating fertilizer activity:', activityData);

//       const activityResponse = await farmerAPI.addCropActivity(activityData);
//       if (activityResponse.success) {
//         console.log('✅ Fertilizer activity created with ID:', activityResponse.activity_id);
//         return true;
//       } else {
//         console.log('❌ Failed to create activity:', activityResponse.message);
//         return false;
//       }
//     } catch (error) {
//       console.error('💥 Error creating fertilizer activity:', error);
//       return false;
//     }
//   };

//   // ✅ RENDER FERTILIZER ITEM FOR LIST
//   const renderFertilizerItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.fertilizerListItem}
//       onPress={() => handleSelectFertilizer(item)}
//     >
//       <View style={styles.fertListInfo}>
//         <Text style={styles.fertListName}>{item.name}</Text>
//         <Text style={styles.fertListType}>Type: {item.type}</Text>
//         {item.dosage && <Text style={styles.fertListDetail}>Dosage: {item.dosage}</Text>}
//       </View>
//       <Icon name="chevron-right" size={20} color="#666" />
//     </TouchableOpacity>
//   );

//   // ✅ FERTILIZER LIST MODAL
//   const FertilizerListModal = () => (
//     <Modal visible={showFertilizerList} transparent animationType="slide">
//       <View style={styles.modalOverlay}>
//         <View style={styles.fertListModal}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>
//               Select Fertilizer for {currentCropName}
//             </Text>
//             <TouchableOpacity 
//               style={styles.closeButton}
//               onPress={() => setShowFertilizerList(false)}
//             >
//               <Icon name="close" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {loadingFertilizers ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="small" color="#2E7D32" />
//               <Text style={styles.loadingText}>Loading fertilizers...</Text>
//             </View>
//           ) : suggestedFertilizers.length > 0 ? (
//             <FlatList
//               data={suggestedFertilizers}
//               renderItem={renderFertilizerItem}
//               keyExtractor={(item, index) => index.toString()}
//               style={styles.fertList}
//             />
//           ) : (
//             <View style={styles.noFertilizersContainer}>
//               <Icon name="eco" size={50} color="#ccc" />
//               <Text style={styles.noFertilizersText}>
//                 No suggested fertilizers found for {currentCropName}
//               </Text>
//               <Text style={styles.noFertilizersSubtext}>
//                 Please contact admin to add fertilizers
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
//             <Icon name="arrow-back" size={24} color="#2E7D32" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Add Fertilizer</Text>
//           <View style={styles.headerPlaceholder} />
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContainer}>
          
//           {/* ✅ CROP INFO SECTION */}
//           {currentCropName && (
//             <View style={styles.cropInfoBox}>
//               <Text style={styles.cropInfoTitle}>🌱 Current Crop</Text>
//               <Text style={styles.cropInfoText}>{currentCropName}</Text>
//               {route.params?.fertilizerType && (
//                 <Text style={styles.cropInfoSubtext}>
//                   Scheduled: {route.params.fertilizerType}
//                 </Text>
//               )}
//               {route.params?.scheduledDate && (
//                 <Text style={styles.cropInfoSubtext}>
//                   Date: {new Date(route.params.scheduledDate).toLocaleDateString('en-IN')}
//                 </Text>
//               )}
//             </View>
//           )}

//           {/* ✅ FERTILIZER SELECTION SECTION */}
//           <View style={styles.selectionSection}>
//             <Text style={styles.sectionTitle}>1. Select Fertilizer</Text>
            
//             {!selectedFertilizer ? (
//               <View style={styles.selectionContainer}>
//                 <Text style={styles.selectionHelpText}>
//                   Choose from recommended fertilizers for {currentCropName}
//                 </Text>
                
//                 <TouchableOpacity 
//                   style={styles.selectButton}
//                   onPress={() => setShowFertilizerList(true)}
//                   disabled={loadingFertilizers}
//                 >
//                   {loadingFertilizers ? (
//                     <ActivityIndicator size="small" color="white" />
//                   ) : (
//                     <>
//                       <Icon name="list" size={20} color="white" />
//                       <Text style={styles.selectButtonText}>
//                         Choose from List ({suggestedFertilizers.length})
//                       </Text>
//                     </>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View style={styles.selectedFertilizerBox}>
//                 <View style={styles.selectedHeader}>
//                   <Text style={styles.selectedTitle}>✅ Selected Fertilizer</Text>
//                   <TouchableOpacity 
//                     style={styles.changeButton}
//                     onPress={() => setSelectedFertilizer(null)}
//                   >
//                     <Text style={styles.changeButtonText}>Change</Text>
//                   </TouchableOpacity>
//                 </View>
                
//                 {/* ✅ FERTILIZER DETAILS - READ ONLY */}
//                 <View style={styles.fertDetailsContainer}>
//                   <View style={styles.detailRow}>
//                     <Text style={styles.detailLabel}>Name:</Text>
//                     <Text style={styles.detailValue}>{selectedFertilizer.name}</Text>
//                   </View>
                  
//                   <View style={styles.detailRow}>
//                     <Text style={styles.detailLabel}>Type:</Text>
//                     <Text style={styles.detailValue}>{selectedFertilizer.type}</Text>
//                   </View>
                  
//                   {selectedFertilizer.dosage && (
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Dosage:</Text>
//                       <Text style={styles.detailValue}>{selectedFertilizer.dosage}</Text>
//                     </View>
//                   )}
                  
//                   {selectedFertilizer.application_method && (
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Application Method:</Text>
//                       <Text style={styles.detailValue}>{selectedFertilizer.application_method}</Text>
//                     </View>
//                   )}
                  
//                   {selectedFertilizer.timing && (
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Timing:</Text>
//                       <Text style={styles.detailValue}>{selectedFertilizer.timing}</Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* ✅ SAVE BUTTON */}
//           {selectedFertilizer && (
//             <TouchableOpacity
//               style={[styles.saveButton, saving && styles.disabledButton]}
//               onPress={handleSaveFertilizer}
//               disabled={saving}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   CONFIRM & APPLY FERTILIZER
//                 </Text>
//               )}
//             </TouchableOpacity>
//           )}

//         </ScrollView>

//         {/* ✅ FERTILIZER LIST MODAL */}
//         <FertilizerListModal />

//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// // ✅ STYLES
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fa' },
//   safeArea: { flex: 1 },
//   header: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd',
//   },
//   backButton: { padding: 4 },
//   headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
//   headerPlaceholder: { width: 24 },
//   scrollContainer: { padding: 20, paddingBottom: 40 },

//   // Crop Info
//   cropInfoBox: {
//     backgroundColor: '#E8F5E8', padding: 16, borderRadius: 12, marginBottom: 20,
//     borderLeftWidth: 4, borderLeftColor: '#2E7D32',
//   },
//   cropInfoTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 },
//   cropInfoText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
//   cropInfoSubtext: { fontSize: 14, color: '#666', marginTop: 4 },

//   // Selection Section
//   selectionSection: { marginBottom: 20 },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32', marginBottom: 15 },
//   selectionContainer: { alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 12 },
//   selectionHelpText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 15 },
//   selectButton: {
//     backgroundColor: '#2E7D32', flexDirection: 'row', alignItems: 'center',
//     paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8,
//   },
//   selectButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },

//   // Selected Fertilizer
//   selectedFertilizerBox: {
//     backgroundColor: '#F1F8E9', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#2E7D32',
//   },
//   selectedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   selectedTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
//   changeButton: { backgroundColor: '#FF9800', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
//   changeButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

//   // Fertilizer Details (Read Only)
//   fertDetailsContainer: { backgroundColor: 'white', padding: 12, borderRadius: 8 },
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
//     backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 10, alignItems: 'center', marginBottom: 20,
//   },
//   disabledButton: { backgroundColor: '#A5D6A7' },
//   saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
//   },
//   fertListModal: {
//     backgroundColor: 'white', borderRadius: 12, width: '90%', maxHeight: '80%',
//   },
//   modalHeader: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee',
//   },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32', flex: 1 },
//   closeButton: { padding: 4 },
//   fertList: { maxHeight: 400 },
//   fertilizerListItem: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
//   },
//   fertListInfo: { flex: 1 },
//   fertListName: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32', marginBottom: 4 },
//   fertListType: { fontSize: 14, color: '#666', marginBottom: 2 },
//   fertListDetail: { fontSize: 12, color: '#888', marginBottom: 1 },

//   // Loading & Empty States
//   loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20 },
//   loadingText: { marginLeft: 8, color: '#666', fontSize: 14 },
//   noFertilizersContainer: { alignItems: 'center', padding: 40 },
//   noFertilizersText: { fontSize: 16, color: '#666', marginTop: 12, textAlign: 'center' },
//   noFertilizersSubtext: { fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' },
// });

// export default FertilizerInputPage;



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

// const FertilizerInputPage = ({ navigation, route }) => {
//   // ✅ FERTILIZER SELECTION STATES
//   const [suggestedFertilizers, setSuggestedFertilizers] = useState([]);
//   const [showFertilizerList, setShowFertilizerList] = useState(false);
//   const [selectedFertilizer, setSelectedFertilizer] = useState(null);
//   const [loadingFertilizers, setLoadingFertilizers] = useState(false);
//   const [adminSelectedFertilizer, setAdminSelectedFertilizer] = useState(null);

//   // ✅ CROP DATA STATES
//   const [currentCropHistoryId, setCurrentCropHistoryId] = useState(null);
//   const [currentCropName, setCurrentCropName] = useState('');
//   const [saving, setSaving] = useState(false);

//   // ✅ Load data on component mount
//   useEffect(() => {
//     loadCurrentCropData();
//   }, []);

//   // ✅ Load suggested fertilizers when crop data is available
//   useEffect(() => {
//     if (currentCropName) {
//       loadSuggestedFertilizers();
//       loadAdminSelectedFertilizer();
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

//   // ✅ LOAD ADMIN SELECTED FERTILIZER
//   const loadAdminSelectedFertilizer = async () => {
//     if (!currentCropName) return;

//     try {
//       console.log('👨‍🌾 Loading admin selected fertilizer for:', currentCropName);
//       const response = await farmerAPI.getAdminSelectedFertilizer(currentCropName);
      
//       if (response.success && response.admin_fertilizer) {
//         setAdminSelectedFertilizer(response.admin_fertilizer);
//         // Automatically set as selected fertilizer
//         setSelectedFertilizer(response.admin_fertilizer);
//         console.log('✅ Admin selected fertilizer loaded:', response.admin_fertilizer);
//       } else {
//         console.log('ℹ️ No admin selected fertilizer found');
//         setAdminSelectedFertilizer(null);
//       }
//     } catch (error) {
//       console.error('❌ Error loading admin selected fertilizer:', error);
//       setAdminSelectedFertilizer(null);
//     }
//   };

//   // ✅ LOAD SUGGESTED FERTILIZERS
//   const loadSuggestedFertilizers = async () => {
//     if (!currentCropName) {
//       console.log('❌ No crop name available');
//       return;
//     }

//     setLoadingFertilizers(true);
//     try {
//       console.log('🌱 Loading suggested fertilizers for:', currentCropName);
//       const response = await farmerAPI.getSuggestedFertilizers(currentCropName);
      
//       if (response.success && response.suggested_fertilizers) {
//         setSuggestedFertilizers(response.suggested_fertilizers);
//         console.log('✅ Suggested fertilizers loaded:', response.suggested_fertilizers.length);
//       } else {
//         console.log('❌ No suggested fertilizers found');
//         setSuggestedFertilizers([]);
//       }
//     } catch (error) {
//       console.error('❌ Error loading suggested fertilizers:', error);
//       setSuggestedFertilizers([]);
//     } finally {
//       setLoadingFertilizers(false);
//     }
//   };

//   // ✅ SELECT FERTILIZER FROM LIST
//   const handleSelectFertilizer = (fertilizer) => {
//     console.log('🎯 Fertilizer selected:', fertilizer);
//     setSelectedFertilizer(fertilizer);
//     setShowFertilizerList(false);
//   };

//   // ✅ SAVE FERTILIZER
//   const handleSaveFertilizer = async () => {
//     if (!selectedFertilizer) {
//       Alert.alert('Error', 'Please select a fertilizer first');
//       return;
//     }

//     if (!currentCropHistoryId) {
//       Alert.alert('Error', 'No crop selected. Please go back and select a crop first.');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       console.log('💾 Saving selected fertilizer:', selectedFertilizer);
      
//       const savedFarmerId = await AsyncStorage.getItem('farmerId');
//       if (!savedFarmerId) {
//         throw new Error('Farmer ID not found. Please login again.');
//       }

//       // ✅ CREATE FERTILIZER ACTIVITY
//       await createFertilizerActivity(selectedFertilizer);
      
//       Alert.alert('Success', 'Fertilizer applied successfully!', [
//         {
//           text: 'OK',
//           onPress: () => {
//             navigation.goBack();
//           }
//         }
//       ]);
      
//     } catch (error) {
//       console.error('❌ Fertilizer save error:', error);
//       Alert.alert('Error', error.message || 'Failed to save fertilizer. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ CREATE FERTILIZER ACTIVITY
//   const createFertilizerActivity = async (fertilizer) => {
//     try {
//       const activityData = {
//         crop_history_id: currentCropHistoryId,
//         activity_date: new Date().toISOString().split('T')[0], // Current date
//         activity_type: 'Fertilization',
//         description: `Applied ${fertilizer.name} (${fertilizer.type}) - ${fertilizer.dosage}`,
//         chemical_or_fertilizer_used: `${fertilizer.name} - ${fertilizer.dosage}`,
//         remarks: `Application Method: ${fertilizer.application_method}, Timing: ${fertilizer.timing}`,
//         is_public: false
//       };

//       console.log('🎯 Creating fertilizer activity:', activityData);

//       const activityResponse = await farmerAPI.addCropActivity(activityData);
//       if (activityResponse.success) {
//         console.log('✅ Fertilizer activity created with ID:', activityResponse.activity_id);
//         return true;
//       } else {
//         console.log('❌ Failed to create activity:', activityResponse.message);
//         return false;
//       }
//     } catch (error) {
//       console.error('💥 Error creating fertilizer activity:', error);
//       return false;
//     }
//   };

//   // ✅ RENDER FERTILIZER ITEM FOR LIST
//   const renderFertilizerItem = ({ item }) => (
//     <TouchableOpacity 
//       style={[
//         styles.fertilizerListItem,
//         adminSelectedFertilizer && adminSelectedFertilizer.id === item.id && styles.adminSelectedItem
//       ]}
//       onPress={() => handleSelectFertilizer(item)}
//     >
//       <View style={styles.fertListInfo}>
//         <View style={styles.fertHeader}>
//           <Text style={styles.fertListName}>{item.name}</Text>
//           {adminSelectedFertilizer && adminSelectedFertilizer.id === item.id && (
//             <View style={styles.adminBadge}>
//               <Text style={styles.adminBadgeText}>Admin Selected</Text>
//             </View>
//           )}
//         </View>
//         <Text style={styles.fertListType}>Type: {item.type}</Text>
//         {item.dosage && <Text style={styles.fertListDetail}>Dosage: {item.dosage}</Text>}
//         {item.application_method && <Text style={styles.fertListDetail}>Method: {item.application_method}</Text>}
//       </View>
//       <Icon name="chevron-right" size={20} color="#666" />
//     </TouchableOpacity>
//   );

//   // ✅ FERTILIZER LIST MODAL
//   const FertilizerListModal = () => (
//     <Modal visible={showFertilizerList} transparent animationType="slide">
//       <View style={styles.modalOverlay}>
//         <View style={styles.fertListModal}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>
//               Select Fertilizer for {currentCropName}
//             </Text>
//             <TouchableOpacity 
//               style={styles.closeButton}
//               onPress={() => setShowFertilizerList(false)}
//             >
//               <Icon name="close" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {loadingFertilizers ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="small" color="#2E7D32" />
//               <Text style={styles.loadingText}>Loading fertilizers...</Text>
//             </View>
//           ) : suggestedFertilizers.length > 0 ? (
//             <FlatList
//               data={suggestedFertilizers}
//               renderItem={renderFertilizerItem}
//               keyExtractor={(item, index) => index.toString()}
//               style={styles.fertList}
//               ListHeaderComponent={
//                 adminSelectedFertilizer ? (
//                   <View style={styles.adminNote}>
//                     <Icon name="verified" size={16} color="#1976D2" />
//                     <Text style={styles.adminNoteText}>
//                       Admin has recommended a fertilizer for this crop
//                     </Text>
//                   </View>
//                 ) : null
//               }
//             />
//           ) : (
//             <View style={styles.noFertilizersContainer}>
//               <Icon name="eco" size={50} color="#ccc" />
//               <Text style={styles.noFertilizersText}>
//                 No suggested fertilizers found for {currentCropName}
//               </Text>
//               <Text style={styles.noFertilizersSubtext}>
//                 Please contact admin to add fertilizers
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
//             <Icon name="arrow-back" size={24} color="#2E7D32" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Add Fertilizer</Text>
//           <View style={styles.headerPlaceholder} />
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContainer}>
          
//           {/* ✅ CROP INFO SECTION */}
//           {currentCropName && (
//             <View style={styles.cropInfoBox}>
//               <Text style={styles.cropInfoTitle}>🌱 Current Crop</Text>
//               <Text style={styles.cropInfoText}>{currentCropName}</Text>
//               {route.params?.fertilizerType && (
//                 <Text style={styles.cropInfoSubtext}>
//                   Scheduled: {route.params.fertilizerType}
//                 </Text>
//               )}
//               {route.params?.scheduledDate && (
//                 <Text style={styles.cropInfoSubtext}>
//                   Date: {new Date(route.params.scheduledDate).toLocaleDateString('en-IN')}
//                 </Text>
//               )}
//             </View>
//           )}

//           {/* ✅ ADMIN SELECTED FERTILIZER INFO */}
//           {adminSelectedFertilizer && (
//             <View style={styles.adminSelectedBox}>
//               <View style={styles.adminHeader}>
//                 <Icon name="verified" size={20} color="#1976D2" />
//                 <Text style={styles.adminTitle}>Admin Recommended Fertilizer</Text>
//               </View>
//               <Text style={styles.adminHelpText}>
//                 Admin has pre-selected this fertilizer for {currentCropName}. You can use this or choose another from the list.
//               </Text>
//             </View>
//           )}

//           {/* ✅ FERTILIZER SELECTION SECTION */}
//           <View style={styles.selectionSection}>
//             <Text style={styles.sectionTitle}>1. Select Fertilizer</Text>
            
//             {!selectedFertilizer ? (
//               <View style={styles.selectionContainer}>
//                 <Text style={styles.selectionHelpText}>
//                   {adminSelectedFertilizer 
//                     ? "Admin has recommended a fertilizer. You can use it or choose another."
//                     : `Choose from recommended fertilizers for ${currentCropName}`
//                   }
//                 </Text>
                
//                 <TouchableOpacity 
//                   style={styles.selectButton}
//                   onPress={() => setShowFertilizerList(true)}
//                   disabled={loadingFertilizers}
//                 >
//                   {loadingFertilizers ? (
//                     <ActivityIndicator size="small" color="white" />
//                   ) : (
//                     <>
//                       <Icon name="list" size={20} color="white" />
//                       <Text style={styles.selectButtonText}>
//                         {adminSelectedFertilizer ? "View All Options" : "Choose from List"} 
//                         ({suggestedFertilizers.length})
//                       </Text>
//                     </>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View style={styles.selectedFertilizerBox}>
//                 <View style={styles.selectedHeader}>
//                   <View>
//                     <Text style={styles.selectedTitle}>
//                       {adminSelectedFertilizer && adminSelectedFertilizer.id === selectedFertilizer.id 
//                         ? "✅ Admin Recommended Fertilizer" 
//                         : "✅ Selected Fertilizer"
//                       }
//                     </Text>
//                     {adminSelectedFertilizer && adminSelectedFertilizer.id === selectedFertilizer.id && (
//                       <Text style={styles.adminSelectedNote}>This is the admin recommended choice</Text>
//                     )}
//                   </View>
//                   <TouchableOpacity 
//                     style={styles.changeButton}
//                     onPress={() => setShowFertilizerList(true)}
//                   >
//                     <Text style={styles.changeButtonText}>Change</Text>
//                   </TouchableOpacity>
//                 </View>
                
//                 {/* ✅ FERTILIZER DETAILS - READ ONLY */}
//                 <View style={styles.fertDetailsContainer}>
//                   <View style={styles.detailRow}>
//                     <Text style={styles.detailLabel}>Name:</Text>
//                     <Text style={styles.detailValue}>{selectedFertilizer.name}</Text>
//                   </View>
                  
//                   <View style={styles.detailRow}>
//                     <Text style={styles.detailLabel}>Type:</Text>
//                     <Text style={styles.detailValue}>{selectedFertilizer.type}</Text>
//                   </View>
                  
//                   {selectedFertilizer.dosage && (
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Dosage:</Text>
//                       <Text style={styles.detailValue}>{selectedFertilizer.dosage}</Text>
//                     </View>
//                   )}
                  
//                   {selectedFertilizer.application_method && (
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Application Method:</Text>
//                       <Text style={styles.detailValue}>{selectedFertilizer.application_method}</Text>
//                     </View>
//                   )}
                  
//                   {selectedFertilizer.timing && (
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Timing:</Text>
//                       <Text style={styles.detailValue}>{selectedFertilizer.timing}</Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* ✅ SAVE BUTTON */}
//           {selectedFertilizer && (
//             <TouchableOpacity
//               style={[styles.saveButton, saving && styles.disabledButton]}
//               onPress={handleSaveFertilizer}
//               disabled={saving}
//             >
//               {saving ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.saveButtonText}>
//                   CONFIRM & APPLY FERTILIZER
//                 </Text>
//               )}
//             </TouchableOpacity>
//           )}

//         </ScrollView>

//         {/* ✅ FERTILIZER LIST MODAL */}
//         <FertilizerListModal />

//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// // ✅ STYLES
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fa' },
//   safeArea: { flex: 1 },
//   header: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd',
//   },
//   backButton: { padding: 4 },
//   headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
//   headerPlaceholder: { width: 24 },
//   scrollContainer: { padding: 20, paddingBottom: 40 },

//   // Crop Info
//   cropInfoBox: {
//     backgroundColor: '#E8F5E8', padding: 16, borderRadius: 12, marginBottom: 20,
//     borderLeftWidth: 4, borderLeftColor: '#2E7D32',
//   },
//   cropInfoTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 },
//   cropInfoText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
//   cropInfoSubtext: { fontSize: 14, color: '#666', marginTop: 4 },

//   // Admin Selected Box
//   adminSelectedBox: {
//     backgroundColor: '#E3F2FD', padding: 16, borderRadius: 12, marginBottom: 20,
//     borderLeftWidth: 4, borderLeftColor: '#1976D2',
//   },
//   adminHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//   adminTitle: { fontSize: 16, fontWeight: 'bold', color: '#1976D2', marginLeft: 8 },
//   adminHelpText: { fontSize: 14, color: '#1976D2', lineHeight: 20 },

//   // Selection Section
//   selectionSection: { marginBottom: 20 },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32', marginBottom: 15 },
//   selectionContainer: { alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 12 },
//   selectionHelpText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 15, lineHeight: 22 },
//   selectButton: {
//     backgroundColor: '#2E7D32', flexDirection: 'row', alignItems: 'center',
//     paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8,
//   },
//   selectButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },

//   // Selected Fertilizer
//   selectedFertilizerBox: {
//     backgroundColor: '#F1F8E9', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#2E7D32',
//   },
//   selectedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
//   selectedTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
//   adminSelectedNote: { fontSize: 12, color: '#1976D2', marginTop: 4, fontStyle: 'italic' },
//   changeButton: { backgroundColor: '#FF9800', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
//   changeButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

//   // Fertilizer Details (Read Only)
//   fertDetailsContainer: { backgroundColor: 'white', padding: 12, borderRadius: 8 },
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
//     backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 10, alignItems: 'center', marginBottom: 20,
//   },
//   disabledButton: { backgroundColor: '#A5D6A7' },
//   saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
//   },
//   fertListModal: {
//     backgroundColor: 'white', borderRadius: 12, width: '90%', maxHeight: '80%',
//   },
//   modalHeader: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee',
//   },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32', flex: 1 },
//   closeButton: { padding: 4 },
//   fertList: { maxHeight: 400 },
  
//   // Fertilizer List Items
//   fertilizerListItem: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
//   },
//   adminSelectedItem: {
//     backgroundColor: '#E3F2FD',
//     borderLeftWidth: 4,
//     borderLeftColor: '#1976D2',
//   },
//   fertListInfo: { flex: 1 },
//   fertHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
//   fertListName: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32', flex: 1 },
//   adminBadge: { backgroundColor: '#1976D2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
//   adminBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
//   fertListType: { fontSize: 14, color: '#666', marginBottom: 2 },
//   fertListDetail: { fontSize: 12, color: '#888', marginBottom: 1 },
  
//   // Admin Note in Modal
//   adminNote: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD',
//     padding: 12, margin: 16, borderRadius: 8, marginBottom: 8,
//   },
//   adminNoteText: { fontSize: 14, color: '#1976D2', marginLeft: 8, fontWeight: '500' },

//   // Loading & Empty States
//   loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20 },
//   loadingText: { marginLeft: 8, color: '#666', fontSize: 14 },
//   noFertilizersContainer: { alignItems: 'center', padding: 40 },
//   noFertilizersText: { fontSize: 16, color: '#666', marginTop: 12, textAlign: 'center' },
//   noFertilizersSubtext: { fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' },
// });

// export default FertilizerInputPage;



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

const FertilizerInputPage = ({ navigation, route }) => {
  // ✅ FERTILIZER SELECTION STATES
  const [suggestedFertilizers, setSuggestedFertilizers] = useState([]);
  const [showFertilizerList, setShowFertilizerList] = useState(false);
  const [selectedFertilizer, setSelectedFertilizer] = useState(null);
  const [loadingFertilizers, setLoadingFertilizers] = useState(false);
  const [adminSuggestedFertilizer, setAdminSuggestedFertilizer] = useState(null);
  const [loadingAdminFertilizer, setLoadingAdminFertilizer] = useState(false);

  // ✅ CROP DATA STATES
  const [currentCropHistoryId, setCurrentCropHistoryId] = useState(null);
  const [currentCropName, setCurrentCropName] = useState('');
  const [saving, setSaving] = useState(false);
  
  // ✅ NEW: Schedule data from CropInputPage
  const [scheduledDate, setScheduledDate] = useState(null);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [activityDescription, setActivityDescription] = useState('');
  const [fertilizerNumber, setFertilizerNumber] = useState(1);
  
  // ✅ NEW: Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedApplicationDate, setSelectedApplicationDate] = useState(null);
  
  // ✅ NEW: Recommended fertilizer from CropInputPage
  const [recommendedFertilizer, setRecommendedFertilizer] = useState(null);
  const [fertilizerIndex, setFertilizerIndex] = useState(0);
  const [returnScreen, setReturnScreen] = useState(null);

  // ✅ Load data on component mount
  useEffect(() => {
    loadCurrentCropData();
  }, []);

  // ✅ Load fertilizers when crop data is available
  useEffect(() => {
    if (currentCropName) {
      loadAllFertilizerData();
    }
  }, [currentCropName]);

  // ✅ LOAD CURRENT CROP DATA - UPDATED to use correct param names
  const loadCurrentCropData = async () => {
    try {
      console.log('🔍 Route params:', route.params);
      
      // ✅ Check for cropHistoryId (from CropInputPage)
      if (route.params?.cropHistoryId) {
        console.log('🎯 Using crop data from CropInputPage navigation');
        setCurrentCropHistoryId(route.params.cropHistoryId);
        setCurrentCropName(route.params.cropName || 'Unknown Crop');
        
        // ✅ Load schedule data
        if (route.params.scheduledDate) {
          setScheduledDate(new Date(route.params.scheduledDate));
        }
        if (route.params.rangeStart) {
          setRangeStart(new Date(route.params.rangeStart));
        }
        if (route.params.rangeEnd) {
          setRangeEnd(new Date(route.params.rangeEnd));
        }
        if (route.params.description) {
          setActivityDescription(route.params.description);
        }
        if (route.params.fertilizerNumber) {
          setFertilizerNumber(route.params.fertilizerNumber);
        }
        
        // ✅ NEW: Load recommended fertilizer and return info
        if (route.params.recommendedFertilizer) {
          setRecommendedFertilizer(route.params.recommendedFertilizer);
          // Pre-select the recommended fertilizer
          setSelectedFertilizer({ name: route.params.recommendedFertilizer });
        }
        if (route.params.fertilizerIndex !== undefined) {
          setFertilizerIndex(route.params.fertilizerIndex);
        }
        if (route.params.returnScreen) {
          setReturnScreen(route.params.returnScreen);
        }
        
        console.log('📅 Schedule data loaded:', {
          scheduledDate: route.params.scheduledDate,
          rangeStart: route.params.rangeStart,
          rangeEnd: route.params.rangeEnd,
          description: route.params.description,
          fertilizerNumber: route.params.fertilizerNumber,
          recommendedFertilizer: route.params.recommendedFertilizer,
          fertilizerIndex: route.params.fertilizerIndex
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

  // ✅ LOAD ALL FERTILIZER DATA
  const loadAllFertilizerData = async () => {
    setLoadingAdminFertilizer(true);
    setLoadingFertilizers(true);

    try {
      // Parallel calls for better performance
      const [adminResponse, suggestedResponse] = await Promise.all([
        farmerAPI.getAdminSuggestedFertilizer(currentCropName),
        farmerAPI.getSuggestedFertilizers(currentCropName)
      ]);

      // ✅ Process Admin Suggested Fertilizer
      if (adminResponse.success && adminResponse.admin_suggested_fertilizer) {
        setAdminSuggestedFertilizer(adminResponse.admin_suggested_fertilizer);
        // Automatically set as selected fertilizer
        setSelectedFertilizer(adminResponse.admin_suggested_fertilizer);
        console.log('✅ Admin suggested fertilizer loaded:', adminResponse.admin_suggested_fertilizer);
      } else {
        console.log('ℹ️ No admin suggested fertilizer found');
        setAdminSuggestedFertilizer(null);
      }

      // ✅ Process Suggested Fertilizers
      if (suggestedResponse.success && suggestedResponse.suggested_fertilizers) {
        setSuggestedFertilizers(suggestedResponse.suggested_fertilizers);
        console.log('✅ Suggested fertilizers loaded:', suggestedResponse.suggested_fertilizers.length);
      } else {
        console.log('❌ No suggested fertilizers found');
        setSuggestedFertilizers([]);
      }

    } catch (error) {
      console.error('❌ Error loading fertilizer data:', error);
      setAdminSuggestedFertilizer(null);
      setSuggestedFertilizers([]);
    } finally {
      setLoadingAdminFertilizer(false);
      setLoadingFertilizers(false);
    }
  };

  // ✅ SELECT FERTILIZER FROM LIST
  const handleSelectFertilizer = (fertilizer) => {
    console.log('🎯 Fertilizer selected:', fertilizer);
    setSelectedFertilizer(fertilizer);
    setShowFertilizerList(false);
  };

  // ✅ SAVE FERTILIZER
  const handleSaveFertilizer = async () => {
    if (!selectedFertilizer) {
      Alert.alert('Error', 'Please select a fertilizer first');
      return;
    }

    if (!currentCropHistoryId) {
      Alert.alert('Error', 'No crop selected. Please go back and select a crop first.');
      return;
    }

    setSaving(true);
    
    try {
      console.log('💾 Saving selected fertilizer:', selectedFertilizer);
      
      const savedFarmerId = await AsyncStorage.getItem('farmerId');
      if (!savedFarmerId) {
        throw new Error('Farmer ID not found. Please login again.');
      }

      // ✅ CREATE FERTILIZER ACTIVITY
      const success = await createFertilizerActivity(selectedFertilizer);
      
      if (success) {
        Alert.alert('Success', 'Fertilizer applied successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            }
          }
        ]);
      } else {
        throw new Error('Failed to save fertilizer activity');
      }
      
    } catch (error) {
      console.error('❌ Fertilizer save error:', error);
      Alert.alert('Error', error.message || 'Failed to save fertilizer. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ✅ CREATE FERTILIZER ACTIVITY
  const createFertilizerActivity = async (fertilizer) => {
    try {
      const activityData = {
        crop_history_id: currentCropHistoryId,
        activity_date: new Date().toISOString().split('T')[0],
        activity_type: 'Fertilization',
        description: fertilizer.description || `Applied ${fertilizer.name} (${fertilizer.type}) - ${fertilizer.dosage}`,
        chemical_or_fertilizer_used: `${fertilizer.name} - ${fertilizer.dosage}`,
        remarks: `Application Method: ${fertilizer.application_method}, Timing: ${fertilizer.timing}`,
        is_public: false
      };

      console.log('🎯 Creating fertilizer activity:', activityData);

      const activityResponse = await farmerAPI.addCropActivity(activityData);
      if (activityResponse.success) {
        console.log('✅ Fertilizer activity created with ID:', activityResponse.activity_id);
        return true;
      } else {
        console.log('❌ Failed to create activity:', activityResponse.message);
        return false;
      }
    } catch (error) {
      console.error('💥 Error creating fertilizer activity:', error);
      return false;
    }
  };

  // ✅ CHECK IF FERTILIZER IS ADMIN SUGGESTED
  const isAdminSuggested = (fertilizer) => {
    if (!adminSuggestedFertilizer || !fertilizer) return false;
    
    // Compare by name and type for matching
    return fertilizer.name === adminSuggestedFertilizer.name && 
           fertilizer.type === adminSuggestedFertilizer.type;
  };

  // ✅ RENDER FERTILIZER ITEM FOR LIST
  const renderFertilizerItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.fertilizerListItem,
        isAdminSuggested(item) && styles.adminSuggestedItem
      ]}
      onPress={() => handleSelectFertilizer(item)}
    >
      <View style={styles.fertListInfo}>
        <View style={styles.fertHeader}>
          <Text style={styles.fertListName}>{item.name}</Text>
          {isAdminSuggested(item) && (
            <View style={styles.adminBadge}>
              <Icon name="thumb-up" size={12} color="white" />
              <Text style={styles.adminBadgeText}>Suggested</Text>
            </View>
          )}
        </View>
        <Text style={styles.fertListType}>Type: {item.type}</Text>
        {item.dosage && <Text style={styles.fertListDetail}>Dosage: {item.dosage}</Text>}
        {item.application_method && <Text style={styles.fertListDetail}>Method: {item.application_method}</Text>}
        {item.timing && <Text style={styles.fertListDetail}>Timing: {item.timing}</Text>}
      </View>
      <Icon name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );

  // ✅ FERTILIZER LIST MODAL
  const FertilizerListModal = () => (
    <Modal visible={showFertilizerList} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.fertListModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Select Fertilizer for {currentCropName}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowFertilizerList(false)}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {loadingFertilizers ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2E7D32" />
              <Text style={styles.loadingText}>Loading fertilizers...</Text>
            </View>
          ) : suggestedFertilizers.length > 0 ? (
            <FlatList
              data={suggestedFertilizers}
              renderItem={renderFertilizerItem}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              style={styles.fertList}
              ListHeaderComponent={
                adminSuggestedFertilizer ? (
                  <View style={styles.adminNote}>
                    <Icon name="lightbulb" size={16} color="#FF9800" />
                    <Text style={styles.adminNoteText}>
                      Smart suggestion available based on crop usage patterns
                    </Text>
                  </View>
                ) : null
              }
            />
          ) : (
            <View style={styles.noFertilizersContainer}>
              <Icon name="eco" size={50} color="#ccc" />
              <Text style={styles.noFertilizersText}>
                No fertilizers found for {currentCropName}
              </Text>
              <Text style={styles.noFertilizersSubtext}>
                Please contact admin to add fertilizers for this crop
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  // ✅ GET CONFIDENCE LEVEL TEXT
  const getConfidenceText = () => {
    if (!adminSuggestedFertilizer?.confidence) return '';
    
    const confidenceMap = {
      'high': 'Highly Recommended',
      'medium': 'Recommended', 
      'low': 'Suggested'
    };
    
    return confidenceMap[adminSuggestedFertilizer.confidence] || 'Suggested';
  };

  // ✅ GET SOURCE TEXT
  const getSourceText = () => {
    if (!adminSuggestedFertilizer?.source) return '';
    
    const sourceMap = {
      'most_used_in_history': `Based on most frequent usage (${adminSuggestedFertilizer.usage_count} times)`,
      'recent_usage': 'Based on recent usage patterns',
      'crop_schedule': 'Based on standard crop schedule'
    };
    
    return sourceMap[adminSuggestedFertilizer.source] || 'Based on crop data';
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
              
              {/* ✅ Fertilizer Number */}
              {fertilizerNumber && (
                <View style={styles.fertilizerNumberBadge}>
                  <Text style={styles.fertilizerNumberText}>
                    {fertilizerNumber === 1 ? '1st' : fertilizerNumber === 2 ? '2nd' : `${fertilizerNumber}rd`} Fertilizer Application
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
          {(loadingAdminFertilizer || loadingFertilizers) && (
            <View style={styles.loadingSection}>
              <ActivityIndicator size="large" color="#2E7D32" />
              <Text style={styles.loadingSectionText}>Loading fertilizer recommendations...</Text>
            </View>
          )}

          {/* ✅ ADMIN SUGGESTED FERTILIZER INFO - Only show if no recommendedFertilizer from CropInputPage */}
          {adminSuggestedFertilizer && !loadingAdminFertilizer && !recommendedFertilizer && (
            <View style={styles.adminSuggestedBox}>
              <View style={styles.adminHeader}>
                <Icon name="auto-awesome" size={20} color="#FF9800" />
                <Text style={styles.adminTitle}>Smart Suggestion</Text>
                <View style={[styles.confidenceBadge, 
                  adminSuggestedFertilizer.confidence === 'high' && styles.confidenceHigh,
                  adminSuggestedFertilizer.confidence === 'medium' && styles.confidenceMedium,
                  adminSuggestedFertilizer.confidence === 'low' && styles.confidenceLow
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

          {/* ✅ FERTILIZER SELECTION SECTION */}
          <View style={styles.selectionSection}>
            <Text style={styles.sectionTitle}>1. Select Fertilizer</Text>
            
            {!selectedFertilizer && !recommendedFertilizer ? (
              <View style={styles.selectionContainer}>
                <Text style={styles.selectionHelpText}>
                  {adminSuggestedFertilizer 
                    ? "We have a smart suggestion for you. You can use it or choose another from the list."
                    : `Choose from available fertilizers for ${currentCropName}`
                  }
                </Text>
                
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => setShowFertilizerList(true)}
                  disabled={loadingFertilizers}
                >
                  {loadingFertilizers ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Icon name="list" size={20} color="white" />
                      <Text style={styles.selectButtonText}>
                        {adminSuggestedFertilizer ? "View All Options" : "Choose from List"} 
                        {suggestedFertilizers.length > 0 && ` (${suggestedFertilizers.length})`}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.selectedFertilizerBox}>
                <View style={styles.selectedHeader}>
                  <View style={styles.selectedTitleContainer}>
                    <Text style={styles.selectedTitle}>
                      {recommendedFertilizer && !selectedFertilizer?.name 
                        ? "🌾 Recommended Fertilizer (From Schedule)" 
                        : isAdminSuggested(selectedFertilizer) 
                          ? "✅ Smart Suggested Fertilizer" 
                          : "✅ Selected Fertilizer"
                      }
                    </Text>
                    {isAdminSuggested(selectedFertilizer) && !recommendedFertilizer && (
                      <Text style={styles.smartSuggestionNote}>
                        {getConfidenceText()} • {getSourceText()}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={styles.changeButton}
                    onPress={() => setShowFertilizerList(true)}
                  >
                    <Text style={styles.changeButtonText}>Change</Text>
                  </TouchableOpacity>
                </View>
                
                {/* ✅ FERTILIZER DETAILS - READ ONLY */}
                <View style={styles.fertDetailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{selectedFertilizer?.name || recommendedFertilizer}</Text>
                  </View>
                  
                  {selectedFertilizer?.type && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Type:</Text>
                      <Text style={styles.detailValue}>{selectedFertilizer.type}</Text>
                    </View>
                  )}
                  
                  {selectedFertilizer?.dosage && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Dosage:</Text>
                      <Text style={styles.detailValue}>{selectedFertilizer.dosage}</Text>
                    </View>
                  )}
                  
                  {selectedFertilizer?.application_method && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Application Method:</Text>
                      <Text style={styles.detailValue}>{selectedFertilizer.application_method}</Text>
                    </View>
                  )}
                  
                  {selectedFertilizer?.timing && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Timing:</Text>
                      <Text style={styles.detailValue}>{selectedFertilizer.timing}</Text>
                    </View>
                  )}
                  
                  {/* Show hint if only name is available (from recommendedFertilizer) */}
                  {recommendedFertilizer && !selectedFertilizer?.type && (
                    <Text style={styles.selectMoreDetailsHint}>
                      👆 Tap "Change" to see full details and select from list
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* ✅ CONFIRM & GO BACK BUTTON - If came from CropInputPage */}
          {returnScreen && (selectedFertilizer || recommendedFertilizer) && (
            <TouchableOpacity 
              style={styles.confirmGoBackButton}
              onPress={async () => {
                const fertName = selectedFertilizer?.name || recommendedFertilizer;
                console.log('✅ Confirming fertilizer:', fertName, 'for index:', fertilizerIndex);
                
                // ✅ Store in AsyncStorage so CropInputPage can read it
                await AsyncStorage.setItem('confirmedFertilizer', JSON.stringify({
                  selectedFertilizer: fertName,
                  fertilizerIndex: fertilizerIndex
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

          {/* ✅ SAVE BUTTON - Apply fertilizer activity */}
          {selectedFertilizer && !returnScreen && (
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.disabledButton]}
              onPress={handleSaveFertilizer}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>
                  CONFIRM & APPLY FERTILIZER
                </Text>
              )}
            </TouchableOpacity>
          )}

        </ScrollView>

        {/* ✅ FERTILIZER LIST MODAL */}
        <FertilizerListModal />

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

// ✅ STYLES
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
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

  // Crop Info
  cropInfoBox: {
    backgroundColor: '#E8F5E8', padding: 16, borderRadius: 12, marginBottom: 20,
    borderLeftWidth: 4, borderLeftColor: '#2E7D32',
  },
  cropInfoTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 },
  cropInfoText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  
  // ✅ NEW: Date range info styles
  fertilizerNumberBadge: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  fertilizerNumberText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  dateRangeInfoBox: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  dateRangeClickable: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  tapToSelectText: {
    fontSize: 11,
    color: '#E65100',
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
  
  // ✅ Fertilizer Selection Box (Integrated)
  fertilizerSelectionBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFCC80',
  },
  fertSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF3E0',
    paddingBottom: 8,
  },
  fertSelectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
  },
  changeButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  changeButtonSmallText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
    marginLeft: 4,
  },
  fertDetailsContainer: {
    paddingTop: 4,
  },
  fertName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  fertNamePlaceholder: {
    fontSize: 18,
    color: '#999',
    fontStyle: 'italic',
  },
  fertDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    paddingLeft: 4,
  },
  fertDetailHint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dateRangeLabel: {
    fontSize: 12,
    color: '#E65100',
    fontWeight: '600',
  },
  dateRangeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginTop: 4,
  },
  scheduledDateBox: {
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  scheduledDateLabel: {
    fontSize: 12,
    color: '#1565C0',
    fontWeight: '500',
  },
  scheduledDateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  activityDescText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 6,
  },
  cropInfoSubtext: { fontSize: 14, color: '#666', marginTop: 4 },

  // Admin Suggested Box
  adminSuggestedBox: {
    backgroundColor: '#FFF3E0', padding: 16, borderRadius: 12, marginBottom: 20,
    borderLeftWidth: 4, borderLeftColor: '#FF9800',
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
    color: '#FF9800', 
    marginLeft: 8,
    marginRight: 8
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  confidenceHigh: { backgroundColor: '#4CAF50' },
  confidenceMedium: { backgroundColor: '#FF9800' },
  confidenceLow: { backgroundColor: '#9E9E9E' },
  confidenceText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  adminHelpText: { 
    fontSize: 14, 
    color: '#E65100', 
    lineHeight: 20 
  },

  // Selection Section
  selectionSection: { marginBottom: 20 },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#2E7D32', 
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
    backgroundColor: '#2E7D32', 
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

  // Selected Fertilizer
  selectedFertilizerBox: {
    backgroundColor: '#F1F8E9', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#2E7D32',
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
    color: '#2E7D32' 
  },
  smartSuggestionNote: { 
    fontSize: 12, 
    color: '#FF9800', 
    marginTop: 4, 
    fontStyle: 'italic' 
  },
  changeButton: { 
    backgroundColor: '#FF9800', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 6 
  },
  changeButtonText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },

  // Fertilizer Details (Read Only)
  fertDetailsContainer: { 
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

  // Save Button
  saveButton: {
    backgroundColor: '#4CAF50', 
    paddingVertical: 16, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 20,
  },
  disabledButton: { backgroundColor: '#A5D6A7' },
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
  fertListModal: {
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
    color: '#2E7D32', 
    flex: 1 
  },
  closeButton: { padding: 4 },
  fertList: { maxHeight: 400 },
  
  // Fertilizer List Items
  fertilizerListItem: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
  },
  adminSuggestedItem: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  fertListInfo: { flex: 1 },
  fertHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 4 
  },
  fertListName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#2E7D32', 
    flex: 1 
  },
  adminBadge: { 
    backgroundColor: '#FF9800', 
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
  fertListType: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 2 
  },
  fertListDetail: { 
    fontSize: 12, 
    color: '#888', 
    marginBottom: 1 
  },
  
  // Admin Note in Modal
  adminNote: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF3E0',
    padding: 12, 
    margin: 16, 
    borderRadius: 8, 
    marginBottom: 8,
  },
  adminNoteText: { 
    fontSize: 14, 
    color: '#E65100', 
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
  noFertilizersContainer: { 
    alignItems: 'center', 
    padding: 40 
  },
  noFertilizersText: { 
    fontSize: 16, 
    color: '#666', 
    marginTop: 12, 
    textAlign: 'center' 
  },
  noFertilizersSubtext: { 
    fontSize: 14, 
    color: '#999', 
    marginTop: 8, 
    textAlign: 'center' 
  },
});

export default FertilizerInputPage;