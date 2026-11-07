// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const CropListPage = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>میری فصلیں</Text>
//       <Text style={styles.text}>یہاں آپ کی فصلیں ظاہر ہوں گی</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   text: {
//     fontSize: 16,
//   },
// });

// export default CropListPage;
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from './localization';

const CropListPage = ({ navigation }) => {
  // ✅ Multi-language support
  const { isUrdu } = useLanguage();
  const [searchText, setSearchText] = useState('');
  
  // Dummy Crop List
  const allCrops = [
    "گندم", "چاول", "مکئی", "کپاس", "گنا", "تل", "مونگ پھلی", "چنے", "تل"
  ];

  // Filter crops according to search
  const filteredCrops = allCrops.filter(crop => 
    crop.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCropSelect = (crop) => {
    Alert.alert(
      'منتخب فصل',
      `${crop} منتخب کیا گیا`,
      [{ text: 'ٹھیک ہے' }]
    );
  };

  const renderCropItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cropButton}
      onPress={() => handleCropSelect(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.cropButtonText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar
      <View style={styles.appBar}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>فصلیں تلاش کریں</Text>
        <View style={{ width: 24 }} />
      </View> */}

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="فصل تلاش کریں"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Crop List */}
        <FlatList
          data={filteredCrops}
          renderItem={renderCropItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="search-off" size={48} color="#CCC" />
              <Text style={styles.emptyText}>کوئی فصل نہیں ملی</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const buttonSize = (width - 48) / 2; // 2 columns with padding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  appBar: {
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  listContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cropButton: {
    width: buttonSize,
    height: buttonSize,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cropButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default CropListPage;