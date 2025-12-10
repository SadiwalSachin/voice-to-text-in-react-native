import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BluetoothContext } from "../context/BluetoothContext";

export default function HomeScreen() {
  const navigation = useNavigation();

  const {connectedDevice} = useContext(BluetoothContext);

  // if(!connectedDevice) {
  //   navigation.navigate("Settings");
  // }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Let’s become more</Text>
      <Text style={styles.highlight}>Productive</Text>

      {/* AI SECTION (FOCUSED AREA) */}
      <View style={styles.aiBox}>
        <View style={styles.aiInner}>
          <MaterialIcons name="smart-toy" size={24} color="#F9A938" />
          <Text style={styles.aiText}>AI Assistant Ready</Text>
          <Text style={styles.aiSub}>Your tasks made easier</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("AIVoiceAssistantScreen")}
          style={styles.aiButton}
        >
          <Text style={styles.aiButtonText}>Open AI Assistant</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN OPTIONS SECTION */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("PlainText")}
        >
          <MaterialIcons name="text-fields" size={28} color="#0C3444" />
          <Text style={styles.cardTitle}>Send Text</Text>
          <Text style={styles.cardSub}>Plain text messages</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("PDFData")}
        >
          <MaterialIcons name="picture-as-pdf" size={28} color="#0C3444" />
          <Text style={styles.cardTitle}>Send PDF</Text>
          <Text style={styles.cardSub}>Upload and extract</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("VoiceData")}
        >
          <MaterialIcons name="keyboard-voice" size={28} color="#0C3444" />
          <Text style={styles.cardTitle}>Voice Input</Text>
          <Text style={styles.cardSub}>Speech to braille</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("TeachersModule")}
        >
          <MaterialIcons name="school" size={28} color="#0C3444" />
          <Text style={styles.cardTitle}>Teacher Tools</Text>
          <Text style={styles.cardSub}>Assignments & notes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F9",
    paddingHorizontal: 22,
    paddingTop: 45,
  },

  title: {
    fontSize: 26,
    color: "#0C3444",
    fontWeight: "700",
  },

  highlight: {
    fontSize: 26,
    fontWeight: "900",
    color: "#F9A938",
    marginBottom: 20,
  },

  /* AI BOX */
  aiBox: {
    backgroundColor: "#0C3444",
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },

  aiInner: {
    marginBottom: 18,
  },

  aiText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },

  aiSub: {
    color: "#DDE7EC",
    fontSize: 14,
    marginTop: 4,
  },

  aiButton: {
    backgroundColor: "#F9A938",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  aiButtonText: {
    color: "#0C3444",
    fontWeight: "700",
    fontSize: 16,
  },

  /* Quick Actions */
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0C3444",
    marginBottom: 12,
  },

  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  optionCard: {
    width: "47%",
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 20,
    borderRadius: 18,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0C3444",
    marginTop: 10,
  },

  cardSub: {
    fontSize: 12,
    color: "#6A7A87",
    marginTop: 3,
  },
});
