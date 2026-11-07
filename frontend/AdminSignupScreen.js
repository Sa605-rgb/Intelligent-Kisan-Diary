import React, { useState } from 'react';
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
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { authAPI } from './api';

const AdminSignupScreen = ({ navigation }) => {
  // Admin details state
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [tehsil, setTehsil] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showTehsilDropdown, setShowTehsilDropdown] = useState(false);

  // Sample data for dropdowns
  const provinces = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan'];
  
  const districts = {
    'Punjab': ['Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot'],
    'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Mirpur Khas'],
    'Khyber Pakhtunkhwa': ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat'],
    'Balochistan': ['Quetta', 'Gwadar', 'Khuzdar', 'Turbat', 'Sibi'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza', 'Nagar', 'Ghizer']
  };

  const tehsils = {
    'Lahore': ['Lahore City', 'Lahore Cantt', 'Raiwind', 'Shalimar'],
    'Rawalpindi': ['Rawalpindi City', 'Rawalpindi Cantt', 'Taxila', 'Gujar Khan'],
    'Karachi': ['East', 'West', 'South', 'Central', 'Malir', 'Korangi'],
    'Peshawar': ['Peshawar City', 'Peshawar Cantt', 'Charsadda', 'Nowshera'],
    'Quetta': ['Quetta City', 'Quetta Cantt', 'Mastung', 'Kuchlak']
  };

  const getDistricts = () => {
    return districts[province] || [];
  };

  const getTehsils = () => {
    return tehsils[district] || [];
  };

  const handleAdminSignup = async () => {
    // Validation
    if (!name || !cnic || !email || !phone || !password || !confirmPassword || !province || !district || !tehsil) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // CNIC validation (13 digits)
    const cnicRegex = /^\d{13}$/;
    if (!cnicRegex.test(cnic)) {
      Alert.alert('Error', 'Please enter a valid 13-digit CNIC');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Phone validation
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'Please enter a valid 11-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const adminData = {
        name: name.trim(),
        cnic: cnic.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password,
        province: province,
        district: district,
        tehsil: tehsil
      };

      console.log('Sending admin signup data:', adminData);
      
      // API call for admin signup
      const response = await authAPI.adminSignup(adminData);
      
      Alert.alert('Success', 'Admin account created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('AdminHomeScreen')
        }
      ]);
      
    } catch (error) {
      console.error('Admin signup error:', error);
      Alert.alert('Signup Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const DropdownModal = ({ visible, items, onSelect, onClose, title }) => (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownMenu}>
            <Text style={styles.dropdownTitle}>{title}</Text>
            <ScrollView style={styles.dropdownScrollView}>
              {items.map((item, index) => (
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
              ))}
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
      <SafeAreaView style={styles.safeArea}>
       

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Create Admin Account</Text>
          <Text style={styles.subtitle}>Register as administrator</Text>
          
          <View style={styles.inputContainer}>
            {/* Name */}
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!loading}
              placeholderTextColor="#999"
            />

            {/* CNIC */}
            <TextInput
              style={styles.input}
              placeholder="CNIC (13 digits without dashes)"
              value={cnic}
              onChangeText={setCnic}
              keyboardType="numeric"
              maxLength={13}
              editable={!loading}
              placeholderTextColor="#999"
            />

            {/* Email */}
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              editable={!loading}
              placeholderTextColor="#999"
            />

            {/* Phone */}
            <TextInput
              style={styles.input}
              placeholder="Phone Number (11 digits)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={11}
              editable={!loading}
              placeholderTextColor="#999"
            />

            {/* Password */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              placeholderTextColor="#999"
            />

            {/* Confirm Password */}
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
              placeholderTextColor="#999"
            />

            {/* Province Dropdown */}
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowProvinceDropdown(true)}
            >
              <Text style={[styles.dropdownText, !province && { color: '#999' }]}>
                {province || 'Select Province'}
              </Text>
              <Icon name="arrow-drop-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* District Dropdown */}
            <TouchableOpacity 
              style={[styles.dropdownButton, !province && styles.disabledDropdown]}
              onPress={() => province && setShowDistrictDropdown(true)}
              disabled={!province}
            >
              <Text style={[styles.dropdownText, !district && { color: '#999' }]}>
                {district || 'Select District'}
              </Text>
              <Icon name="arrow-drop-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* Tehsil Dropdown */}
            <TouchableOpacity 
              style={[styles.dropdownButton, !district && styles.disabledDropdown]}
              onPress={() => district && setShowTehsilDropdown(true)}
              disabled={!district}
            >
              <Text style={[styles.dropdownText, !tehsil && { color: '#999' }]}>
                {tehsil || 'Select Tehsil'}
              </Text>
              <Icon name="arrow-drop-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[styles.signupButton, loading && styles.disabledButton]} 
            onPress={handleAdminSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signupButtonText}>SIGN UP AS ADMIN</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('AdminLogin')}
              disabled={loading}
            >
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Dropdown Modals */}
        <DropdownModal
          visible={showProvinceDropdown}
          items={provinces}
          onSelect={setProvince}
          onClose={() => {
            setShowProvinceDropdown(false);
            setDistrict('');
            setTehsil('');
          }}
          title="Select Province"
        />

        <DropdownModal
          visible={showDistrictDropdown}
          items={getDistricts()}
          onSelect={setDistrict}
          onClose={() => {
            setShowDistrictDropdown(false);
            setTehsil('');
          }}
          title="Select District"
        />

        <DropdownModal
          visible={showTehsilDropdown}
          items={getTehsils()}
          onSelect={setTehsil}
          onClose={() => setShowTehsilDropdown(false)}
          title="Select Tehsil"
        />
      </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  scrollContainer: {
    padding: 30,
    paddingBottom: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
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
    opacity: 0.5,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    height: 50,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#81C784',
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
    color: '#2E7D32',
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
  dropdownScrollView: {
    maxHeight: 350,
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
});

export default AdminSignupScreen;