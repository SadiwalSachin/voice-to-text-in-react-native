import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';

import BluetoothSerial from 'react-native-bluetooth-serial-next';
import { BluetoothContext } from '../context/BluetoothContext';
import NetraaLoader from '../components/Loader';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BluetoothScreen() {
  const { connectedDevice, setConnectedDevice } = useContext(BluetoothContext);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const navigation = useNavigation();

  if(connectedDevice) {
    navigation.navigate("Home");  
  }

  async function requestPermissions() {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    } catch (err) {
      console.warn(err);
    }
  }

  async function listPairedDevices() {
    try {
      const isEnabled = await BluetoothSerial.requestEnable();
      if (!isEnabled) return;

      const bonded = await BluetoothSerial.list();
      setDevices(bonded);
    } catch (err) {
      console.log("Error listing paired devices:", err);
    }
  }

  async function connectToDevice(device) {
    try {
      if (connectedDevice) {
        navigation.navigate("Home");  
        return
      };

      setLoading(true);
      const response = await BluetoothSerial.connect(device.id);

      if (response) {
        setConnectedDevice(device);
        navigation.navigate("Home");
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("Connect error:", err);
      setError(err);
    }
  }

  useEffect(() => {
    requestPermissions().then(() => {
      listPairedDevices();
    });
  }, []);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="bluetooth-off" size={64} color="#94A3B8" />
      </View>
      <Text style={styles.emptyTitle}>No Devices Found</Text>
      <Text style={styles.emptySubtitle}>
        Make sure Bluetooth is enabled and devices are paired in your phone settings
      </Text>
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={listPairedDevices}>
        <Icon name="refresh" size={20} color="#fff" />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <NetraaLoader />;

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              Bluetooth <Text style={styles.headerHighlight}>Devices</Text>
            </Text>
            <Text style={styles.headerSubtitle}>
              Connect to your Braille device
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Icon name="bluetooth" size={24} color="#F59E0B" />
          </View>
        </View>

        {/* Connected Device Banner */}
        {connectedDevice && (
          <View style={styles.connectedBanner}>
            <View style={styles.connectedContent}>
              <View style={styles.connectedIconContainer}>
                <Icon name="bluetooth-connect" size={24} color="#10B981" />
              </View>
              <View style={styles.connectedInfo}>
                <Text style={styles.connectedLabel}>Connected to</Text>
                <Text style={styles.connectedName}>{connectedDevice.name}</Text>
                <Text style={styles.connectedId}>{connectedDevice.id}</Text>
              </View>
            </View>
            <Icon name="check-circle" size={28} color="#10B981" />
          </View>
        )}

        {/* Devices Section */}
        <View style={styles.devicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Devices</Text>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={listPairedDevices}>
              <Icon name="radar" size={18} color="#F59E0B" />
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          {devices.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={devices}
              keyExtractor={(item) => item?.id}
              scrollEnabled={false}
              contentContainerStyle={styles.devicesList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => connectToDevice(item)}
                  style={[
                    styles.deviceCard,
                    connectedDevice?.id === item?.id && styles.deviceCardConnected
                  ]}
                  activeOpacity={0.7}
                  disabled={connectedDevice?.id === item?.id}>
                  
                  <View style={styles.deviceIconContainer}>
                    <Icon 
                      name={connectedDevice?.id === item?.id ? "bluetooth-connect" : "bluetooth"} 
                      size={28} 
                      color={connectedDevice?.id === item?.id ? "#10B981" : "#F59E0B"} 
                    />
                  </View>

                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{item?.name}</Text>
                    <Text style={styles.deviceId}>{item?.id}</Text>
                    {connectedDevice?.id === item?.id && (
                      <View style={styles.connectedBadge}>
                        <Text style={styles.connectedBadgeText}>Connected</Text>
                      </View>
                    )}
                  </View>

                  <Icon 
                    name={connectedDevice?.id === item?.id ? "check-circle" : "chevron-right"} 
                    size={24} 
                    color={connectedDevice?.id === item?.id ? "#10B981" : "#9CA3AF"} 
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Instructions Card */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Connection Tips</Text>
          <View style={styles.instructionItem}>
            <View style={styles.tipIcon}>
              <Icon name="information" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.instructionText}>
              Ensure Bluetooth is enabled on your device
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.tipIcon}>
              <Icon name="link-variant" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.instructionText}>
              Pair devices in phone settings first
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.tipIcon}>
              <Icon name="refresh" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.instructionText}>
              Tap scan to refresh available devices
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  headerHighlight: {
    color: '#F59E0B',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  connectedBanner: {
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  connectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  connectedIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  connectedInfo: {
    flex: 1,
  },
  connectedLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
    fontWeight: '500',
  },
  connectedName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  connectedId: {
    fontSize: 12,
    color: '#94A3B8',
  },
  devicesSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 6,
  },
  devicesList: {
    gap: 12,
  },
  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 12,
  },
  deviceCardConnected: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  deviceIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 13,
    color: '#6B7280',
  },
  connectedBadge: {
    backgroundColor: '#D1FAE5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  connectedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 6,
  },
});