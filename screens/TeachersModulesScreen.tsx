import React, { useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { BluetoothContext } from "../context/BluetoothContext";
import BluetoothSerial from 'react-native-bluetooth-serial-next';


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

  const {connectedDevice} = useContext(BluetoothContext)

    const handleTeach = async (textMessage:string) => {
      try {
        if (!connectedDevice) {
          Alert.alert("No device connected");
          return;
        }
        if (!textMessage.trim()) return;
  
        await BluetoothSerial.write(textMessage + '\n');
  
        console.log("Sent:", textMessage);
  
      } catch (error) {
        console.log("Sending failed:", error);
      }
    };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Teachers Module</Text>
      </View>

      {alphabets.map((item, index) => (
        <View key={index} style={styles.card}>
          {/* Letter Row */}
          <View style={styles.row}>
            <Text style={styles.letterText}>{item.letter}</Text>
            <Text style={styles.arrow}>{">>"}</Text>
          </View>

          {/* Braille */}
          <Text style={styles.brailleText}>{item.braille}</Text>

          {/* Teach Button */}
          <TouchableOpacity 
          onPress={()=>handleTeach(item.letter)}
          style={styles.teachButton}>
            <Text style={styles.teachButtonText}>Teach</Text>
          </TouchableOpacity>
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF2FF", // very light blue gradient look
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  headerRow: {
    marginBottom: 10,
  },

  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 18,
    padding: 18,
    marginBottom: 5,
    elevation: 4,
    shadowColor: "#9dbafc",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  letterText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
  },

  arrow: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  brailleText: {
    fontSize: 40,
    color: "#1d4ed8",
    fontWeight: "600",
    marginTop: 10,
  },

  teachButton: {
    backgroundColor: "#0A84FF",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },

  teachButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
