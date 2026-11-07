




import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// ✅ Language & Translations Import
import { LanguageProvider, useLanguage } from './localization';
import { navTitles, tabLabels } from './localization/T';

// ✅ Custom Header Title Component
const HeaderTitle = ({ screenName }) => {
  const { language } = useLanguage();
  const title = navTitles[screenName] 
    ? navTitles[screenName][language] 
    : screenName;
  return <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{title}</Text>;
};

import SplashScreen from './splashscreen';
import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';
import ProfileScreen from './ProfileScreen';
import HomeScreen from './HomeScreen';
import CropInputPage from './CropInputPage';
import CropListPage from './CropListPage';
import HistoryScreen from './HistoryScreen';
import AddMoreEntry from './AddMoreEntry';
import LandInputPage from './LandInputPage';
import PesticideInputPage from './PesticideInputPage';
import FertilizerInputPage from './FertilizerInputPage';
import AdminLoginScreen from './AdminLoginScreen';
import AdminSignupScreen from './AdminSignupScreen';
import PublicFeedScreen from './PublicFeedScreen';
import ActivityPrivacyScreen from './ActivityPrivacyScreen';
import FarmerActivitiesScreen from './FarmerActivitiesScreen';
import ActivityOptionsScreen from './ActivityOptionsScreen';
import CropActivitiesScreen from './CropActivitiesScreen';
import NeighboursCropsScreen from './NeighboursCropsScreen';
import LocalRecommendationsScreen from './LocalRecommendationsScreen';

// ✅ ADMIN SCREENS IMPORT
import AdminDashboard from './AdminDashboard';
import CropSchedules from './CropSchedules';
import FarmersList from './FarmersList';
import FarmerDetails from './FarmerDetails'; // ✅ TEMPORARILY COMMENTED
import FertilizerManagement from './FertilizerManagement';
import PesticideManagement from './PesticideManagement';
import SystemAnalytics from './SystemAnalytics'; // ✅ TEMPORARILY COMMENTED

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const defaultScreenOptions = {
  headerStyle: { backgroundColor: '#16A34A' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

// 🔹 Home Stack (Home + related screens) - ✅ Dynamic Language Titles
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddMoreEntry" component={AddMoreEntry} options={{ headerTitle: () => <HeaderTitle screenName="AddMoreEntry" /> }} />
      <Stack.Screen name="CropInputPage" component={CropInputPage} options={{ headerTitle: () => <HeaderTitle screenName="CropInputPage" /> }} />
      <Stack.Screen name="LandInputPage" component={LandInputPage} options={{ headerTitle: () => <HeaderTitle screenName="LandInputPage" /> }} />
      <Stack.Screen name="PesticideInputPage" component={PesticideInputPage} options={{ headerTitle: () => <HeaderTitle screenName="PesticideInputPage" /> }} />
      <Stack.Screen name="FertilizerInputPage" component={FertilizerInputPage} options={{ headerTitle: () => <HeaderTitle screenName="FertilizerInputPage" /> }} />
    
      <Stack.Screen name="PublicFeedScreen" component={PublicFeedScreen} options={{ headerTitle: () => <HeaderTitle screenName="PublicFeedScreen" /> }} />
      <Stack.Screen name="ActivityPrivacyScreen" component={ActivityPrivacyScreen} options={{ headerTitle: () => <HeaderTitle screenName="ActivityPrivacyScreen" /> }} />
      <Stack.Screen name="FarmerActivitiesScreen" component={FarmerActivitiesScreen} options={{ headerTitle: () => <HeaderTitle screenName="FarmerActivitiesScreen" /> }} />
      <Stack.Screen name="ActivityOptionsScreen" component={ActivityOptionsScreen} options={{ headerTitle: () => <HeaderTitle screenName="ActivityOptionsScreen" /> }} />
      <Stack.Screen name="CropActivitiesScreen" component={CropActivitiesScreen} options={{ headerTitle: () => <HeaderTitle screenName="CropActivitiesScreen" /> }} />
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} options={{ headerTitle: () => <HeaderTitle screenName="History" /> }} />
      <Stack.Screen name="NeighboursCropsScreen" component={NeighboursCropsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LocalRecommendationsScreen" component={LocalRecommendationsScreen} options={{ headerTitle: () => <HeaderTitle screenName="مقامی زرعی سفارشات" /> }} />
    </Stack.Navigator>
  );
}

// 🔹 Crop Input Stack - ✅ Dynamic Language Title
function CropInputStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="CropInputPage" component={CropInputPage} options={{ headerTitle: () => <HeaderTitle screenName="MyCrops" /> }} />
    </Stack.Navigator>
  );
}

// 🔹 History/CropList Stack - ✅ For viewing crop schedules
function CropListStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} options={{ headerTitle: () => <HeaderTitle screenName="History" /> }} />
    </Stack.Navigator>
  );
}


// 🔹 Profile Stack - ✅ FIXED: Now uses ProfileScreen with Language Toggle
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// ✅ ADMIN STACKS FOR EACH TAB
function FarmersStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#1976D2' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Stack.Screen name="FarmersList" component={FarmersList} options={{ title: 'All Farmers' }} />
      <Stack.Screen name="FarmerDetails" component={FarmerDetails} options={{ title: 'Farmer Details' }} />
    </Stack.Navigator>
  );
}

function CropSchedulesStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#1976D2' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Stack.Screen name="CropSchedules" component={CropSchedules} options={{ title: 'Manage Crop Schedules' }} />
    </Stack.Navigator>
  );
}

function ManagementStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#1976D2' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Stack.Screen name="FertilizerManagement" component={FertilizerManagement} options={{ title: 'Fertilizer & Pesticide Management' }} />
      <Stack.Screen name="PesticideManagement" component={PesticideManagement} options={{ title: 'Pesticide Management' }} />
    </Stack.Navigator>
  );
}

function AnalyticsStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#1976D2' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Stack.Screen name="SystemAnalytics" component={SystemAnalytics} options={{ title: 'System Analytics' }} />
      {/* <Stack.Screen name="SystemAnalytics" component={AdminDashboard} options={{ title: 'System Analytics' }} /> */}
    </Stack.Navigator>
  );
}

// 👇 Bottom Tabs (FARMER KE LIYE) - ✅ Dynamic Language Labels
function AppTabs() {
  const { language } = useLanguage();
  
  // ✅ Get tab label from T.js (tabLabels)
  const getLabel = (key) => tabLabels[key] ? tabLabels[key][language] : key;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ size, color }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'CropInputTab') {
            iconName = 'add-circle';
          } else if (route.name === 'CropListTab') {
            iconName = 'history';
          } else if (route.name === 'ProfileTab') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#16A34A',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: getLabel('Home') }} />
      <Tab.Screen name="CropInputTab" component={CropInputStack} options={{ tabBarLabel: getLabel('Input') }} />
      <Tab.Screen 
        name="CropListTab" 
        component={CropListStack}
        options={{ tabBarLabel: getLabel('History') }} 
      />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ tabBarLabel: getLabel('Profile') }} />
    </Tab.Navigator>
  );
}

// ✅ CORRECTED ADMIN TABS
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ size, color }) => {
          let iconName;

          if (route.name === 'AdminDashboardTab') {
            iconName = 'dashboard';
          } else if (route.name === 'CropSchedulesTab') {
            iconName = 'event-note';
          } else if (route.name === 'FarmersTab') {
            iconName = 'people';
          } else if (route.name === 'ManagementTab') {
            iconName = 'build';
          // } else if (route.name === 'AnalyticsTab') {
          //   iconName = 'analytics';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="AdminDashboardTab" component={AdminDashboard} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="CropSchedulesTab" component={CropSchedulesStack} options={{ title: 'Schedules' }} />
      <Tab.Screen name="FarmersTab" component={FarmersStack} options={{ title: 'Farmers' }} />
      <Tab.Screen name="ManagementTab" component={ManagementStack} options={{ title: 'Management' }} />
      {/* <Tab.Screen name="AnalyticsTab" component={AnalyticsStack} options={{ title: 'Analytics' }} /> */}
    </Tab.Navigator>
  );
}

// 🔹 Main App - ✅ Wrapped with LanguageProvider for multi-language support
const App = () => {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminSignup" component={AdminSignupScreen} options={{ headerShown: false }}/>
          
          {/* ✅ FARMER TABS */}
          <Stack.Screen name="Home" component={AppTabs} options={{ headerShown: false }} />
          
          {/* ✅ ADMIN TABS - UNCOMMENTED & FIXED */}
          <Stack.Screen name="AdminHome" component={AdminTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
};

export default App;