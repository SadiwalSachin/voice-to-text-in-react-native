import React, { useContext, useState } from "react";
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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { pick } from "react-native-document-picker";

import BluetoothSerial from "react-native-bluetooth-serial-next";
import { BluetoothContext } from "../context/BluetoothContext";
import { useNavigation } from "@react-navigation/native";

const SERVER = "https://netra-server-nwf6.onrender.com";

export default function SendPDFScreen() {
  const navigation = useNavigation();

  const [selectedPDF, setSelectedPDF] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { connectedDevice } = useContext(BluetoothContext);

  const choosePDF = async () => {
    try {
      setIsLoading(true);
      const doc = await pick({ type: ["application/pdf"] });
      if (!doc || !doc[0]) {
        setIsLoading(false);
        return;
      }

      setSelectedPDF(doc[0].name);

      let formData = new FormData();
      formData.append("pdfFile", {
        uri: doc[0].uri,
        type: doc[0].type,
        name: doc[0].name,
      });

      const res = await fetch(`${SERVER}/extract-text`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await res.json();
      if (data.success) {
        setExtractedText(data.text);
        Alert.alert("Success", "PDF text extracted successfully!");
      } else {
        Alert.alert("Error", data.error);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.alert("Error", "Failed to upload PDF");
    }
  };

  const handleSend = async () => {
    try {
      const connected = await BluetoothSerial.isConnected();

      if (!connected) {
        Alert.alert("Not Connected", "Please connect to Bluetooth device first");
        return;
      }

      if (!extractedText.trim()) {
        Alert.alert("No Text", "No extracted text to send");
        return;
      }

      await BluetoothSerial.write(extractedText + "\n");
      Alert.alert("Success", "Text sent to device successfully!");
    } catch (err) {
      Alert.alert("Error", "Failed to send text to device");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              PDF <Text style={styles.headerHighlight}>Reader</Text>
            </Text>
            <Text style={styles.headerSubtitle}>
              Upload and extract text from PDF documents
            </Text>

            {/* Connection Status */}
            <View style={styles.connectionStatus}>
              <Icon
                name={connectedDevice ? "bluetooth-connect" : "bluetooth-off"}
                size={16}
                color={connectedDevice ? "#10B981" : "#6B7280"}
              />
              <Text
                style={[
                  styles.connectionText,
                  connectedDevice && styles.connectionActive,
                ]}
              >
                {connectedDevice
                  ? `Connected to ${connectedDevice.name}`
                  : "Not Connected"}
              </Text>
            </View>
          </View>

          <View style={styles.headerIcon}>
            <Icon name="file-pdf-box" size={24} color="#F59E0B" />
          </View>
        </View>

        {/* Upload Card */}
        <View style={styles.uploadCard}>
          <View style={styles.uploadIconContainer}>
            <Ionicons
              name="document-text-outline"
              size={64}
              color={selectedPDF ? "#F59E0B" : "#94A3B8"}
            />
          </View>

          <Text style={styles.uploadTitle}>
            {selectedPDF ? "PDF Uploaded" : "No PDF Selected"}
          </Text>

          {selectedPDF && (
            <View style={styles.fileInfoCard}>
              <Icon name="file-document" size={20} color="#F59E0B" />
              <Text style={styles.fileName} numberOfLines={1}>
                {selectedPDF}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={choosePDF}
            disabled={isLoading}
          >
            <MaterialIcons name="upload-file" size={20} color="#fff" />
            <Text style={styles.uploadButtonText}>
              {isLoading
                ? "Processing..."
                : selectedPDF
                ? "Choose Another PDF"
                : "Select PDF File"}
            </Text>
          </TouchableOpacity>

          {isLoading && (
            <Text style={styles.loadingText}>Extracting text from PDF...</Text>
          )}
        </View>

        {/* Extracted Text Output */}
        {extractedText.length > 0 && (
          <View style={styles.outputCard}>
            <View style={styles.outputHeader}>
              <Icon name="text-box-check" size={22} color="#10B981" />
              <Text style={styles.outputTitle}>Extracted Text</Text>
            </View>

            <View style={styles.textPreviewCard}>
              <ScrollView style={styles.outputScroll} nestedScrollEnabled={true}>
                <Text style={styles.outputText}>{extractedText}</Text>
              </ScrollView>
            </View>

            <View style={styles.textStats}>
              <View style={styles.statItem}>
                <Icon name="format-letter-case" size={18} color="#6B7280" />
                <Text style={styles.statText}>{extractedText.length} characters</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="format-text" size={18} color="#6B7280" />
                <Text style={styles.statText}>
                  {extractedText.split(/\s+/).filter(w => w.length > 0).length} words
                </Text>
              </View>
            </View>

            {/* Send Button */}
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Icon name="bluetooth-transfer" size={20} color="#fff" />
              <Text style={styles.sendButtonText}>Send to Device</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Instructions Card */}
        {!extractedText && (
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>How it works</Text>
            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Select a PDF file from your device
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Text will be automatically extracted
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Send extracted text to your Braille device
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  connectionText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
    fontWeight: "500",
  },
  connectionActive: {
    color: "#10B981",
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
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
  uploadCard: {
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  uploadIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  fileInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    maxWidth: '100%',
  },
  fileName: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
  uploadButton: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  outputCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  outputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  outputTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  textPreviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
  },
  outputScroll: {
    maxHeight: 220,
  },
  outputText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  textStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
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
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 4,
  },
});