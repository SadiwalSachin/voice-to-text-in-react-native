import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';

import BluetoothSerial from 'react-native-bluetooth-serial-next';
import { BluetoothContext } from '../context/BluetoothContext';
import NetraaLoader from '../components/Loader';

export default function BluetoothScreen() {
  const { connectedDevice, setConnectedDevice } = useContext(BluetoothContext);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // Request Android Bluetooth permissions
  async function requestPermissions() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      console.log("Permissions:", granted);
    } catch (err) {
      console.warn(err);
    }
  }

  // Load paired devices
  async function listPairedDevices() {
    try {
      const isEnabled = await BluetoothSerial.requestEnable();
      if (!isEnabled) {
        console.log("Bluetooth not enabled");
        return;
      }

      const bonded = await BluetoothSerial.list();
      console.log("Paired devices:", bonded);

      setDevices(bonded);
      return bonded;

    } catch (err) {
      console.log("Error listing paired devices:", err);
    }
  }

  // Connect to a Bluetooth Classic device (HC-05)
  async function connectToDevice(device) {
    try {
      if (connectedDevice) return;

      setLoading(true);
      console.log("Connecting to:", device);

      const response = await BluetoothSerial.connect(device.id);

      if (response) {
        setConnectedDevice(device);
        console.log("Connected to:", device.name);
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

  if (loading) return <NetraaLoader />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connected Bluetooth Devices</Text>

      <FlatList
        data={devices}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => connectToDevice(item)}
            style={{
              padding: 15,
              borderWidth: 1,
              marginVertical: 5,
              borderRadius: 10,
            }}
          >
            <Text style={{color:"black"}}>{item?.name}</Text>
            <Text style={{ color: "gray" }}>{item?.id}</Text>
          </TouchableOpacity>
        )}
      />

      {connectedDevice && (
        <Text style={{ marginTop: 20, fontSize: 16, color: "green" }}>
          Connected to: {connectedDevice.name}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FF',
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A84FF',
    marginBottom: 20,
    textAlign: 'center',
  },
});
