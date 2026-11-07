// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
//   Dimensions,
//   RefreshControl
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { adminAPI } from './api';
// import { LineChart } from 'react-native-chart-kit';

// const { width } = Dimensions.get('window');

// const SystemAnalytics = ({ navigation }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [visibleItems, setVisibleItems] = useState({
//     cities: 10,
//     crops: 10,
//     soils: 10,
//     activities: 10,
//     farmers: 10
//   });

//   useEffect(() => {
//     loadAnalytics();
//   }, []);

//   const loadAnalytics = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await adminAPI.getSystemStatistics();
      
//       if (response.success) {
//         setData(response);
//       } else {
//         setError('Failed to load analytics data');
//       }
//     } catch (err) {
//       console.error('Analytics load error:', err);
//       setError('Connection error. Please try again.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadAnalytics();
//   };

//   const loadMore = (type) => {
//     setVisibleItems(prev => ({
//       ...prev,
//       [type]: prev[type] + 10
//     }));
//   };

//   const safeGet = (obj, key, defaultValue = []) => {
//     return obj && obj[key] !== undefined ? obj[key] : defaultValue;
//   };

//   // ✅ Extract data
//   const stats = safeGet(data, 'statistics', {});
//   const cropDist = safeGet(data, 'crop_distribution', []);
//   const recentActs = safeGet(data, 'recent_activities', []);

//   // Extract analytics data from the nested 'analytics' object
//   const analytics = safeGet(data, 'analytics', {});
//   const cities = safeGet(analytics, 'city_distribution', []);
//   const soils = safeGet(analytics, 'soil_distribution', []);
//   const seasons = safeGet(analytics, 'seasonal_activity', []);
//   const months = safeGet(analytics, 'monthly_growth', []);
//   const zones = safeGet(analytics, 'zone_distribution', []);
//   const farmers = safeGet(analytics, 'top_farmers', []);

//   // Helper function for month names
//   const getMonthName = (monthNum) => {
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
//                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     return months[monthNum - 1] || 'Mth';
//   };

//   // ✅ LINE GRAPHS FOR ALL DATA (Jaise aapki picture mein hai)
  
//   // 1. City Distribution Line Graph
//   const cityLineData = {
//     labels: cities.map(c => c.city), // Display actual city names
//     datasets: [{
//       data: cities.map(c => c.farmers || 0),
//       color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for line
//       strokeWidth: 3
//     }]
//   };
//   console.log('City Labels:', cities.map(c => c.city));

//   // 2. Crop Distribution Line Graph
//   const cropLineData = {
//     labels: cropDist.map(c => c.crop_name), // Display actual crop names
//     datasets: [{
//       data: cropDist.map(c => c.count || 0),
//       color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for line
//       strokeWidth: 3
//     }]
//   };
//   console.log('Crop Labels:', cropDist.map(c => c.crop_name));

//   // 3. Soil Distribution Line Graph
//   const soilLineData = {
//     labels: soils.map(s => s.type), // Display actual soil types
//     datasets: [{
//       data: soils.map(s => s.count || 0),
//       color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`, // Purple
//       strokeWidth: 3
//     }]
//   };

//   // 4. Seasonal Activity Line Graph
//   const seasonLineData = {
//     labels: seasons.map(s => s.season), // Display actual season names
//     datasets: [{
//       data: seasons.map(s => s.count || 0),
//       color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // Blue
//       strokeWidth: 3
//     }]
//   };

//   // 5. Monthly Growth Line Graph (Detailed)
//   const monthlyLineData = {
//     labels: months.map(m => m.display_month), // Display full month name and year
//     datasets: [{
//       data: months.map(m => m.activities || 0),
//       color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for line
//       strokeWidth: 4
//     }]
//   };
//   console.log('Monthly Labels:', months.map(m => m.display_month));

//   // 6. Zone Distribution Line Graph
//   const zoneLineData = {
//     labels: zones.map(z => z.zone), // Display actual zone names
//     datasets: [{
//       data: zones.map(z => z.lands || 0),
//       color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`, // Teal
//       strokeWidth: 3
//     }]
//   };

//   // 7. Top Farmers Line Graph
//   const farmersLineData = {
//     labels: farmers.map(f => f.name), // Display actual farmer names
//     datasets: [{
//       data: farmers.map(f => f.lands || 0),
//       color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`, // Deep Orange
//       strokeWidth: 3
//     }]
//   };

//   // Chart configuration (Jaise aapki picture mein simple graph)
//   const chartConfig = {
//     backgroundColor: '#ffffff',
//     backgroundGradientFrom: '#ffffff',
//     backgroundGradientTo: '#ffffff',
//     backgroundGradientFromOpacity: 0, // Remove gradient start opacity
//     backgroundGradientToOpacity: 0, // Remove gradient end opacity
//     decimalPlaces: 0,
//     color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//     labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//     labelRotation: 45, // Rotate labels to prevent overlap
//     labelFontSize: 10, // Adjust font size for better fit
//     fillShadowOpacity: 0, // Remove grey shaded area
//     style: {
//       borderRadius: 16
//     },
//     propsForDots: {
//       r: '5',
//       strokeWidth: '2',
//       stroke: 'black',
//       fill: 'black' // Solid black dots
//     }
//   };

//   // Calculate chart width
//   const calculateChartWidth = (dataCount) => {
//     const itemWidth = 75; // Increased width for better label spacing
//     return Math.max(width - 32, (dataCount * itemWidth));
//   };

//   // Render a single line graph component
//   const renderLineGraph = (title, description, data, color, count) => {
//     return (
//       <View style={styles.lineGraphSection}>
//         <Text style={styles.graphTitle}>
//           {title} ({count})
//         </Text>
//         {description && <Text style={styles.graphDescription}>{description}</Text>}
//         <View style={styles.lineGraphCard}>
//           {data.labels.length > 0 && data.datasets[0].data.some(d => d > 0) ? (
//             <ScrollView 
//               horizontal 
//               showsHorizontalScrollIndicator={true}
//               style={styles.horizontalScroll}
//             >
//               <LineChart
//                 data={data}
//                 width={calculateChartWidth(data.labels.length)}
//                 height={200}
//                 chartConfig={{
//                   ...chartConfig,
//                   color: (opacity = 1) => color(opacity),
//                 }}
//                 style={styles.lineChart}
//                 bezier
//                 withDots={true}
//                 withInnerLines={false} // Remove inner grid lines
//                 withOuterLines={false} // Remove outer grid lines
//                 withVerticalLines={false} // Remove vertical grid lines
//                 withHorizontalLines={false} // Remove horizontal grid lines
//               />
//             </ScrollView>
//           ) : (
//             <Text style={styles.noDataText}>No data available</Text>
//           )}
//         </View>
//       </View>
//     );
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#2E7D32" />
//         <Text style={styles.loadingText}>Loading Analytics Dashboard...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centerContainer}>
//         <Icon name="error-outline" size={60} color="#D32F2F" />
//         <Text style={styles.errorTitle}>Data Load Failed</Text>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={loadAnalytics}>
//           <Icon name="refresh" size={20} color="white" style={{ marginRight: 8 }} />
//           <Text style={styles.retryText}>Retry Loading</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <ScrollView 
//       style={styles.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//       showsVerticalScrollIndicator={false}
//     >
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="#2E7D32" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>📈 Line Graph Analytics</Text>
//         <TouchableOpacity onPress={loadAnalytics} style={styles.refreshButton}>
//           <Icon name="refresh" size={24} color="#2E7D32" />
//         </TouchableOpacity>
//       </View>

//       {/* STATISTICS CARDS */}
//       <Text style={styles.sectionTitle}>📊 System Overview</Text>
//       <View style={styles.statsRow}>
//         <View style={styles.statCard}>
//           <Icon name="people" size={28} color="#2E7D32" />
//           <Text style={styles.statNumber}>{stats.total_farmers || 0}</Text>
//           <Text style={styles.statLabel}>Farmers</Text>
//         </View>
        
//         <View style={styles.statCard}>
//           <Icon name="landscape" size={28} color="#1976D2" />
//           <Text style={styles.statNumber}>{stats.total_lands || 0}</Text>
//           <Text style={styles.statLabel}>Lands</Text>
//         </View>
        
//         <View style={styles.statCard}>
//           <Icon name="agriculture" size={28} color="#FF9800" />
//           <Text style={styles.statNumber}>{stats.total_crops || 0}</Text>
//           <Text style={styles.statLabel}>Crops</Text>
//         </View>
        
//         <View style={styles.statCard}>
//           <Icon name="event" size={28} color="#D32F2F" />
//           <Text style={styles.statNumber}>{stats.total_activities || 0}</Text>
//           <Text style={styles.statLabel}>Activities</Text>
//         </View>
//       </View>

//       {/* ALL LINE GRAPHS (Jaise aapki picture) */}
      
//       {/* 1. City Distribution Line Graph */}
//       {renderLineGraph(
//         "🏙️ City Distribution",
//         "Shows the number of farmers and lands in each city.", // Description added
//         cityLineData,
//         (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for line
//         cities.length
//       )}

//       {/* 2. Crop Distribution Line Graph */}
//       {renderLineGraph(
//         "🌾 Crop Distribution",
//         "Illustrates the count of each crop grown across the system.", // Description added
//         cropLineData,
//         (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for line
//         cropDist.length
//       )}

//       {/* 3. Soil Types Line Graph */}
//       {renderLineGraph(
//         "🌱 Soil Types",
//         "Displays the distribution and count of different soil types.", // Description added
//         soilLineData,
//         (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for line
//         soils.length
//       )}

//       {/* 4. Seasonal Activity Line Graph */}
//       {renderLineGraph(
//         "📅 Seasonal Activity",
//         "Shows the activity count per farming season.", // Description added
//         seasonLineData,
//         (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for line
//         seasons.length
//       )}

//       {/* 5. Monthly Activity Trend Line Graph */}
//       {renderLineGraph(
//         "📈 Monthly Trend",
//         "Visualizes the number of activities over different months.", // Description added
//         monthlyLineData,
//         (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for line
//         months.length
//       )}

//       {/* 6. Zone Distribution Line Graph */}
//       {renderLineGraph(
//         "🗺️ Zone Distribution",
//         "Illustrates the distribution of lands across different zones.", // Description added
//         zoneLineData,
//         (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for line
//         zones.length
//       )}

//       {/* 7. Top Farmers Line Graph */}
//       {renderLineGraph(
//         "👨‍🌾 Top Farmers",
//         "Shows farmers with the most registered lands.", // Description added
//         farmersLineData,
//         (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for line
//         farmers.length
//       )}

//       {/* DATA TABLES (Optional - for reference) */}
//       <Text style={styles.sectionTitle}>📋 Data Reference</Text>
      
//       {cities.length > 0 && (
//         <View style={styles.tableCard}>
//           <View style={styles.tableHeader}>
//             <Text style={styles.tableTitle}>City Data Points</Text>
//             <Text style={styles.tableCount}>{cities.length} cities</Text>
//           </View>
//           <ScrollView style={styles.tableScroll}>
//             {cities.map((city, index) => (
//               <View key={index} style={styles.tableRow}>
//                 <Text style={styles.tableText}>C{index + 1}: {city.city}</Text>
//                 <Text style={styles.tableValue}>{city.farmers || 0}</Text>
//               </View>
//             ))}
//           </ScrollView>
//         </View>
//       )}

//       {/* FOOTER */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>
//           📊 All Line Graphs Dashboard • {new Date().toLocaleDateString()}
//         </Text>
//         <Text style={styles.footerSubtext}>
//           Showing trends for {cities.length + cropDist.length + soils.length + seasons.length + zones.length + farmers.length} data points
//         </Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   errorTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#D32F2F',
//     marginTop: 16,
//     textAlign: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 8,
//     textAlign: 'center',
//     paddingHorizontal: 20,
//   },
//   retryButton: {
//     marginTop: 20,
//     backgroundColor: '#2E7D32',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     flex: 1,
//     textAlign: 'center',
//   },
//   refreshButton: {
//     padding: 8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginLeft: 16,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   lineGraphSection: {
//     marginBottom: 20,
//   },
//   graphTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginLeft: 16,
//     marginBottom: 4,
//   },
//   graphDescription: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 16,
//     marginBottom: 8,
//     fontStyle: 'italic',
//   },
//   lineGraphCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 12,
//     marginHorizontal: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   lineChart: {
//     borderRadius: 8,
//     marginVertical: 4,
//   },
//   horizontalScroll: {
//     borderRadius: 8,
//   },
//   statsRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     marginBottom: 20,
//   },
//   statCard: {
//     backgroundColor: 'white',
//     width: (width - 48) / 2,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 8,
//     color: '#333',
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   tableCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginHorizontal: 16,
//     marginBottom: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     maxHeight: 200,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   tableTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     flex: 1,
//   },
//   tableCount: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '600',
//   },
//   tableScroll: {
//     maxHeight: 150,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   tableText: {
//     fontSize: 13,
//     color: '#555',
//   },
//   tableValue: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#333',
//   },
//   noDataText: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//     padding: 40,
//   },
//   footer: {
//     padding: 20,
//     alignItems: 'center',
//     backgroundColor: 'white',
//     marginTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   footerSubtext: {
//     fontSize: 12,
//     color: '#999',
//     textAlign: 'center',
//   },
// });

// export default SystemAnalytics;




import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Modal,
  Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { adminAPI } from './api';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const SystemAnalytics = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('growth');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showPointModal, setShowPointModal] = useState(false);
  const [showAllMonths, setShowAllMonths] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAPI.getSystemStatistics();
      
      if (response.success) {
        setData(response);
      } else {
        setError('Failed to load analytics data');
      }
    } catch (err) {
      console.error('Analytics load error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  // ✅ Extract data
  const stats = data?.statistics || {};
  const graphData = data?.analytics_for_graph || {};
  const analytics = data?.analytics || {};
  
  // Monthly growth data
  const monthlyGrowth = graphData.monthly_growth || [];
  const monthlyLabels = graphData.monthly_labels || [];
  const farmersData = graphData.farmers_data || [];
  const cropsData = graphData.crops_data || [];
  const landsData = graphData.lands_data || [];
  
  // Percentages arrays
  const farmersPercentages = graphData.farmers_percentages || [];
  const cropsPercentages = graphData.crops_percentages || [];
  const landsPercentages = graphData.lands_percentages || [];
  
  const growthSummary = graphData.growth_summary || {};
  
  // Other analytics
  const cities = analytics.city_distribution || [];
  const cropsDist = analytics.crop_distribution || [];
  const seasons = analytics.seasonal_activity || [];

  // ✅ Handle point selection - SIMPLIFIED
  const handlePointPress = (datasetIndex, index) => {
    console.log('Point pressed:', { datasetIndex, index });
    
    if (datasetIndex === undefined || index === undefined) return;
    
    // Use the last 12 months for display
    const displayIndex = Math.max(0, monthlyLabels.length - 12) + index;
    const label = monthlyLabels[displayIndex] || `Month ${displayIndex + 1}`;
    
    let pointData = {
      month: label,
      index: displayIndex,
      datasetIndex: datasetIndex
    };
    
    if (datasetIndex === 0) { // Farmers
      pointData = {
        ...pointData,
        value: farmersData[displayIndex] || 0,
        percentage: farmersPercentages[displayIndex] || 0,
        label: 'Farmers',
        color: '#2E7D32'
      };
    } else if (datasetIndex === 1) { // Crops
      pointData = {
        ...pointData,
        value: cropsData[displayIndex] || 0,
        percentage: cropsPercentages[displayIndex] || 0,
        label: 'Crops',
        color: '#1976D2'
      };
    } else if (datasetIndex === 2) { // Lands
      pointData = {
        ...pointData,
        value: landsData[displayIndex] || 0,
        percentage: landsPercentages[displayIndex] || 0,
        label: 'Lands',
        color: '#FF9800'
      };
    }
    
    console.log('Point data:', pointData);
    setSelectedPoint(pointData);
    setShowPointModal(true);
  };

  // ✅ Get display labels (last 12 months)
  const getDisplayLabels = () => {
    const last12Months = monthlyLabels.slice(-12);
    return last12Months;
  };

  // ✅ Get display data (last 12 months)
  const getDisplayData = (dataArray) => {
    return dataArray.slice(-12);
  };

  // ✅ SIR KE LIYE MAIN GROWTH GRAPH
  const mainGrowthGraphData = {
    labels: getDisplayLabels(),
    datasets: [
      {
        data: getDisplayData(farmersData),
        color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
        strokeWidth: 3,
        label: 'Farmers'
      },
      {
        data: getDisplayData(cropsData),
        color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
        strokeWidth: 3,
        label: 'Crops'
      },
      {
        data: getDisplayData(landsData),
        color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
        strokeWidth: 3,
        label: 'Lands'
      }
    ]
  };

  // ✅ City Distribution Graph
  const cityGraphData = {
    labels: cities.slice(0, 8).map(c => c.city || 'Unknown'),
    datasets: [{
      data: cities.slice(0, 8).map(c => c.farmers || 0),
      color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
      strokeWidth: 3
    }]
  };

  // ✅ Crop Distribution Graph
  const cropGraphData = {
    labels: cropsDist.slice(0, 8).map(c => c.crop || 'Unknown'),
    datasets: [{
      data: cropsDist.slice(0, 8).map(c => c.count || 0),
      color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
      strokeWidth: 3
    }]
  };

  // ✅ Seasonal Graph
  const seasonGraphData = {
    labels: seasons.map(s => s.season || 'Unknown'),
    datasets: [{
      data: seasons.map(s => s.count || 0),
      color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
      strokeWidth: 3
    }]
  };

  // ✅ Chart configuration with BETTER CLICK AREAS
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelRotation: -45,
    labelFontSize: 10,
    formatYLabel: (value) => {
      if (value >= 1000) return `${(value/1000).toFixed(0)}k`;
      return `${value}`;
    },
    fillShadowOpacity: 0,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '8',  // Larger dots for better clicking
      strokeWidth: '2',
      stroke: '#fff'
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: '#e0e0e0'
    }
  };

  const calculateChartWidth = (dataCount) => {
    return Math.max(width - 32, dataCount * 100); // Wider for better clicking
  };

  // ✅ SIMPLE POINT DETAILS MODAL
  const PointDetailsModal = () => (
    <Modal
      visible={showPointModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPointModal(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable 
          style={styles.overlayBackground}
          onPress={() => setShowPointModal(false)}
        />
        
        <View style={styles.modalContent}>
          {selectedPoint && (
            <>
              <View style={styles.modalHeader}>
                <View style={[styles.modalColorBadge, { backgroundColor: selectedPoint.color }]} />
                <Text style={styles.modalTitle}>{selectedPoint.label} Details</Text>
                <Pressable 
                  onPress={() => setShowPointModal(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#666" />
                </Pressable>
              </View>
              
              <View style={styles.modalBody}>
                <View style={styles.pointHeader}>
                  <Icon name="calendar-today" size={24} color="#2E7D32" />
                  <Text style={styles.pointMonth}>{selectedPoint.month}</Text>
                </View>
                
                <View style={styles.pointStats}>
                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Value</Text>
                    <Text style={[styles.statValue, { color: selectedPoint.color }]}>
                      {selectedPoint.value}
                    </Text>
                  </View>
                  
                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Percentage</Text>
                    <Text style={[styles.statValue, { color: selectedPoint.color }]}>
                      {selectedPoint.percentage}%
                    </Text>
                  </View>
                </View>
                
                <View style={styles.percentageVisual}>
                  <Text style={styles.visualLabel}>Contribution in this month:</Text>
                  <View style={styles.percentageBar}>
                    <View 
                      style={[
                        styles.percentageFill,
                        { 
                          width: `${Math.min(selectedPoint.percentage, 100)}%`,
                          backgroundColor: selectedPoint.color
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.percentageText}>
                    {selectedPoint.percentage}% of total activity
                  </Text>
                </View>
                
                <View style={styles.comparison}>
                  <Text style={styles.comparisonTitle}>📊 Monthly Insight</Text>
                  <Text style={styles.comparisonText}>
                    This {selectedPoint.label.toLowerCase()} count is 
                    {selectedPoint.value > 50 ? ' above ' : ' below '}
                    the monthly average.
                  </Text>
                </View>
              </View>
              
              <View style={styles.modalFooter}>
                <Pressable 
                  style={styles.modalCloseBtn}
                  onPress={() => setShowPointModal(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // ✅ RENDER MAIN GROWTH GRAPH WITH WORKING CLICKS
  const renderMainGrowthGraph = () => {
    if (monthlyGrowth.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Icon name="data-usage" size={60} color="#ccc" />
          <Text style={styles.noDataText}>No historical data available</Text>
          <Text style={styles.noDataSubtext}>
            Start adding crops and activities to see growth trends
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.mainGraphSection}>
        <View style={styles.graphHeader}>
          <Text style={styles.mainGraphTitle}>📈 System Growth Trend</Text>
          <View style={styles.growthBadge}>
            <Icon name="trending-up" size={16} color="#2E7D32" />
            <Text style={styles.growthText}>
              {growthSummary.impressive_growth > 0 ? 
                `${growthSummary.impressive_growth}% Growth` : 
                `${stats.total_farmers} Active Users`}
            </Text>
          </View>
        </View>
        
        <View style={styles.graphSubtitleRow}>
          <Text style={styles.graphSubtitle}>
            Last 12 months • {stats.total_farmers} total farmers
          </Text>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => setShowAllMonths(!showAllMonths)}
          >
            <Text style={styles.toggleButtonText}>
              {showAllMonths ? 'Show 12' : 'Show All'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* ✅ MONTH SELECTION BUTTONS (For easy clicking) */}
        <View style={styles.monthButtons}>
          <Text style={styles.monthButtonsTitle}>Click dots or select month:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getDisplayLabels().slice(-6).map((month, index) => {
              const globalIndex = Math.max(0, monthlyLabels.length - 12) + (getDisplayLabels().length - 6 + index);
              return (
                <TouchableOpacity
                  key={month}
                  style={styles.monthButton}
                  onPress={() => handlePointPress(0, index)} // Show farmers data
                >
                  <Text style={styles.monthButtonText}>{month.split(' ')[0]}</Text>
                  <Text style={styles.monthButtonYear}>{month.split(' ')[1]}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        
        <View style={styles.graphWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.chartScrollContent}
          >
            <LineChart
              data={mainGrowthGraphData}
              width={calculateChartWidth(mainGrowthGraphData.labels.length)}
              height={260}
              chartConfig={chartConfig}
              style={styles.lineChart}
              bezier
              withDots={true}
              withInnerLines={true}
              withVerticalLines={false}
              withHorizontalLines={true}
              segments={5}
              fromZero={true}
              onDataPointClick={(data) => {
                console.log('Chart clicked:', data);
                handlePointPress(data.datasetIndex, data.index);
              }}
            />
          </ScrollView>
        </View>
        
        {/* ✅ SIMPLE LEGEND WITH CLICKS */}
        <View style={styles.legendContainer}>
          <TouchableOpacity 
            style={styles.legendItem}
            onPress={() => {
              setSelectedPoint({
                label: 'Farmers Summary',
                value: stats.total_farmers,
                percentage: farmersPercentages[farmersPercentages.length - 1] || 0,
                color: '#2E7D32',
                month: 'Overall'
              });
              setShowPointModal(true);
            }}
          >
            <View style={[styles.legendDot, { backgroundColor: '#2E7D32' }]} />
            <Text style={styles.legendText}>Farmers</Text>
            <Icon name="info" size={14} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.legendItem}
            onPress={() => {
              setSelectedPoint({
                label: 'Crops Summary',
                value: stats.total_crops,
                percentage: cropsPercentages[cropsPercentages.length - 1] || 0,
                color: '#1976D2',
                month: 'Overall'
              });
              setShowPointModal(true);
            }}
          >
            <View style={[styles.legendDot, { backgroundColor: '#1976D2' }]} />
            <Text style={styles.legendText}>Crops</Text>
            <Icon name="info" size={14} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.legendItem}
            onPress={() => {
              setSelectedPoint({
                label: 'Lands Summary',
                value: stats.total_lands,
                percentage: landsPercentages[landsPercentages.length - 1] || 0,
                color: '#FF9800',
                month: 'Overall'
              });
              setShowPointModal(true);
            }}
          >
            <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>Lands</Text>
            <Icon name="info" size={14} color="#666" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.clickHint}>
          💡 Click on graph dots or month buttons to see detailed percentages
        </Text>
        
        <PointDetailsModal />
      </View>
    );
  };

  // ✅ RENDER OTHER GRAPH
  const renderOtherGraph = (title, data, color, description, count) => {
    if (data.labels.length === 0) {
      return (
        <View style={styles.otherGraphSection}>
          <Text style={styles.otherGraphTitle}>{title}</Text>
          <View style={styles.noDataCard}>
            <Icon name="info-outline" size={30} color="#999" />
            <Text style={styles.noDataText}>No data available</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.otherGraphSection}>
        <Text style={styles.otherGraphTitle}>{title} ({count} items)</Text>
        {description && <Text style={styles.graphDescription}>{description}</Text>}
        
        <View style={styles.graphWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <LineChart
              data={data}
              width={calculateChartWidth(data.labels.length)}
              height={200}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => color(opacity),
              }}
              style={styles.lineChart}
              bezier
              withDots={true}
              withInnerLines={true}
              withVerticalLines={false}
              withHorizontalLines={true}
              segments={4}
              fromZero={true}
              onDataPointClick={(data) => {
                console.log('Other graph clicked:', data);
                // Simple alert for other graphs
                alert(`${title}\nValue: ${data.value}`);
              }}
            />
          </ScrollView>
        </View>
      </View>
    );
  };

  // ✅ TABS COMPONENT
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'growth' && styles.activeTab]}
          onPress={() => setActiveTab('growth')}
        >
          <Icon name="trending-up" size={18} color={activeTab === 'growth' ? '#2E7D32' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'growth' && styles.activeTabText]}>
            Growth
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cities' && styles.activeTab]}
          onPress={() => setActiveTab('cities')}
        >
          <Icon name="location-city" size={18} color={activeTab === 'cities' ? '#2E7D32' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'cities' && styles.activeTabText]}>
            Cities ({cities.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'crops' && styles.activeTab]}
          onPress={() => setActiveTab('crops')}
        >
          <Icon name="grass" size={18} color={activeTab === 'crops' ? '#2E7D32' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'crops' && styles.activeTabText]}>
            Crops ({cropsDist.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'seasons' && styles.activeTab]}
          onPress={() => setActiveTab('seasons')}
        >
          <Icon name="calendar-today" size={18} color={activeTab === 'seasons' ? '#2E7D32' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'seasons' && styles.activeTabText]}>
            Seasons ({seasons.length})
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  // ✅ RENDER ACTIVE TAB CONTENT
  const renderTabContent = () => {
    switch(activeTab) {
      case 'growth':
        return renderMainGrowthGraph();
      case 'cities':
        return renderOtherGraph(
          "🏙️ City Distribution",
          cityGraphData,
          (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
          "Number of farmers per city",
          cities.length
        );
      case 'crops':
        return renderOtherGraph(
          "🌾 Crop Distribution",
          cropGraphData,
          (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          "Most planted crops",
          cropsDist.length
        );
      case 'seasons':
        return renderOtherGraph(
          "📅 Seasonal Activity",
          seasonGraphData,
          (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
          "Activities by season",
          seasons.length
        );
      default:
        return renderMainGrowthGraph();
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading Analytics Dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="error-outline" size={60} color="#D32F2F" />
        <Text style={styles.errorTitle}>Data Load Failed</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAnalytics}>
          <Icon name="refresh" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.retryText}>Retry Loading</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📊 System Analytics</Text>
        <TouchableOpacity onPress={loadAnalytics} style={styles.refreshButton}>
          <Icon name="refresh" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* QUICK STATS */}
      <View style={styles.quickStats}>
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatNumber}>{stats.total_farmers || 0}</Text>
          <Text style={styles.quickStatLabel}>Farmers</Text>
        </View>
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatNumber}>{stats.total_lands || 0}</Text>
          <Text style={styles.quickStatLabel}>Lands</Text>
        </View>
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatNumber}>{stats.total_crops || 0}</Text>
          <Text style={styles.quickStatLabel}>Crops</Text>
        </View>
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatNumber}>{stats.total_activities || 0}</Text>
          <Text style={styles.quickStatLabel}>Activities</Text>
        </View>
      </View>

      {/* TABS */}
      {renderTabs()}

      {/* ACTIVE TAB CONTENT */}
      {renderTabContent()}

      {/* DATA INFO */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📋 Data Summary</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{monthlyGrowth.length}</Text>
            <Text style={styles.infoLabel}>Months</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{cities.length}</Text>
            <Text style={styles.infoLabel}>Cities</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{cropsDist.length}</Text>
            <Text style={styles.infoLabel}>Crops</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{seasons.length}</Text>
            <Text style={styles.infoLabel}>Seasons</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    padding: 8,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  mainGraphSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mainGraphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  growthText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 4,
  },
  graphSubtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  graphSubtitle: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  toggleButtonText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  monthButtons: {
    marginBottom: 12,
  },
  monthButtonsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  monthButton: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 70,
  },
  monthButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  monthButtonYear: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  graphWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartScrollContent: {
    paddingRight: 20,
  },
  lineChart: {
    borderRadius: 8,
    marginVertical: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  clickHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  otherGraphSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  otherGraphTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  graphDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  noDataCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: 500,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalColorBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pointMonth: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 8,
  },
  pointStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  percentageVisual: {
    marginBottom: 20,
  },
  visualLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  percentageBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  percentageFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  comparison: {
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 4,
  },
  comparisonText: {
    fontSize: 13,
    color: '#5D4037',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalCloseBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SystemAnalytics;