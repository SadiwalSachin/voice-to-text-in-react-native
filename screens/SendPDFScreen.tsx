import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { pick } from "react-native-document-picker";

// If sending to HC-05 replace with your logic
import BluetoothSerial from "react-native-bluetooth-serial-next";
import axios from "axios";

export default function SendPDFScreen() {
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [extractedText, setExtractedText] = useState("");

  const SERVER = "http://172.16.6.251:5000";

  // PICK PDF
const choosePDF = async () => {
  try {
    const doc = await pick({ type: ["application/pdf"] });
    if (!doc || !doc[0]) return;

    setSelectedPDF(doc[0]?.name);

    let formData = new FormData();
    formData.append("pdfFile", {
      uri: doc[0].uri,
      type: doc[0].type || "application/pdf",
      name: doc[0].name || "file.pdf",
    });

    const response = await fetch(`${SERVER}/extract-text`, {
      method: "POST",
      body: formData, // send FormData directly
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = await response.json();
    console.log("Extracted Text:", data);

    if (data.success) setExtractedText(data.text);
    else Alert.alert("Error", data.error || "Failed to extract text");
  } catch (err) {
    console.log("PDF Error:", err);
    Alert.alert("Error", "Failed to upload PDF");
  }
};


  // SEND extracted text over Bluetooth
  const handleSend = async () => {
    try {
      const connected = await BluetoothSerial.isConnected();

      if (!connected) {
        Alert.alert("Not Connected", "Please connect to Bluetooth device first");
        return;
      }

      if (!extractedText.trim()) {
        Alert.alert("No Text", "Extracted text is empty");
        return;
      }

      await BluetoothSerial.write(extractedText + "\n");
      Alert.alert("Success", "Text sent successfully");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to send data");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send PDF File</Text>

      <View style={styles.card}>
        <Ionicons name="document-text-outline" size={60} color="#0A84FF" />

        <Text style={styles.infoText}>
          {selectedPDF ? selectedPDF : "No PDF Selected"}
        </Text>

        <TouchableOpacity style={styles.uploadBtn} onPress={choosePDF}>
          <MaterialIcons name="upload-file" size={22} color="#fff" />
          <Text style={styles.uploadText}>Choose PDF</Text>
        </TouchableOpacity>
      </View>

      {extractedText !== "" && (
        <ScrollView style={styles.outputBox}>
          <Text style={styles.outputLabel}>Extracted Text:</Text>
          <Text style={styles.outputText}>{extractedText}</Text>
        </ScrollView>
      )}

      <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
        <Text style={styles.sendText}>Send Extracted Text</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FF",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0A84FF",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    elevation: 4,
  },

  infoText: {
    marginTop: 15,
    fontSize: 16,
    color: "#555",
  },

  uploadBtn: {
    marginTop: 20,
    backgroundColor: "#0A84FF",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  uploadText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },

  outputBox: {
    marginTop: 25,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    height: 230,
  },

  outputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0A84FF",
    marginBottom: 8,
  },

  outputText: {
    fontSize: 15,
    color: "#333",
  },

  sendBtn: {
    marginTop: 30,
    backgroundColor: "#0A84FF",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  sendText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});