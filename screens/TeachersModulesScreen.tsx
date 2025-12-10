import React, { useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { BluetoothContext } from "../context/BluetoothContext";
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";

const alphabets = [
  { letter: "A", braille: "⠁" },
  { letter: "B", braille: "⠃" },
  { letter: "C", braille: "⠉" },
  { letter: "D", braille: "⠙" },
  { letter: "E", braille: "⠑" },
  { letter: "F", braille: "⠋" },
  { letter: "G", braille: "⠛" },
  { letter: "H", braille: "⠓" },
  { letter: "I", braille: "⠊" },
  { letter: "J", braille: "⠚" },
  { letter: "K", braille: "⠅" },
  { letter: "L", braille: "⠇" },
  { letter: "M", braille: "⠍" },
  { letter: "N", braille: "⠝" },
  { letter: "O", braille: "⠕" },
  { letter: "P", braille: "⠏" },
  { letter: "Q", braille: "⠟" },
  { letter: "R", braille: "⠗" },
  { letter: "S", braille: "⠎" },
  { letter: "T", braille: "⠞" },
  { letter: "U", braille: "⠥" },
  { letter: "V", braille: "⠧" },
  { letter: "W", braille: "⠺" },
  { letter: "X", braille: "⠭" },
  { letter: "Y", braille: "⠽" },
  { letter: "Z", braille: "⠵" },
];

export default function TeachersModuleScreen() {
  const {connectedDevice} = useContext(BluetoothContext);

  const navigation = useNavigation();

  const handleTeach = async (textMessage: string) => {
    try {
      if (!connectedDevice) {
        Alert.alert("No device connected");
        return;
      }
      if (!textMessage.trim()) return;

      await BluetoothSerial.write(textMessage + '\n');

      console.log("Sent:", textMessage);

      // Show success feedback
      Alert.alert("Success", `Teaching letter "${textMessage}" sent to device`);

    } catch (error) {
      console.log("Sending failed:", error);
      Alert.alert("Error", "Failed to send to device");
    }
  };

  // if(!connectedDevice) {
  //   navigation.navigate("Settings");
  // }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Teaching <Text style={styles.headerHighlight}>Braille</Text>
          </Text>
          <Text style={styles.headerSubtitle}>
            Select a letter to teach via Braille device
          </Text>
        </View>
        <View style={styles.headerIcon}>
          <Icon name="school" size={24} color="#F59E0B" />
        </View>
      </View>

      {/* Connection Status */}
      <View style={styles.connectionCard}>
        <Icon 
          name={connectedDevice ? "bluetooth-connect" : "bluetooth-off"} 
          size={20} 
          color={connectedDevice ? "#10B981" : "#6B7280"} 
        />
        <Text style={[styles.connectionText, connectedDevice && styles.connectionActive]}>
          {connectedDevice ? 'Device Connected & Ready' : 'No Device Connected'}
        </Text>
      </View>

      {/* Alphabet List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.gridContainer}>
          {alphabets.map((item, index) => (
            <View key={index} style={styles.card}>
              {/* Letter Badge */}
              <View style={styles.letterBadge}>
                <Text style={styles.letterText}>{item.letter}</Text>
              </View>

              {/* Braille Display */}
              <View style={styles.brailleContainer}>
                <Text style={styles.brailleText}>{item.braille}</Text>
                <Text style={styles.brailleLabel}>Braille Pattern</Text>
              </View>

              {/* Teach Button */}
              <TouchableOpacity 
                onPress={() => handleTeach(item.letter)}
                style={styles.teachButton}
                activeOpacity={0.8}>
                <Icon name="send" size={18} color="#fff" />
                <Text style={styles.teachButtonText}>Teach</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#F3F4F6",
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
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  connectionText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 10,
    fontWeight: '500',
  },
  connectionActive: {
    color: '#10B981',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'center',
  },
  letterBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E3A5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  letterText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  brailleContainer: {
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 80,
    justifyContent: 'center',
  },
  brailleText: {
    fontSize: 48,
    color: '#F59E0B',
    fontWeight: '600',
    marginBottom: 6,
  },
  brailleLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  teachButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    elevation: 3,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  teachButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
});