import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";

import Voice from "@react-native-voice/voice";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";

import BluetoothSerial from "react-native-bluetooth-serial-next";
import { BluetoothContext } from "../context/BluetoothContext";
import { useNavigation } from "@react-navigation/native";

const AIVoiceAssistantScreen = () => {
  const { connectedDevice } = useContext(BluetoothContext);
  const navigation = useNavigation()

  const [isListening, setIsListening] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎤 Setup Voice listeners
  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = e => {
      const text = e.value[0];
      setRecordedText(text);
    };

    const askPermission = async () => {
      if (Platform.OS === "android") {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
      }
    };
    askPermission();

    return () => Voice.destroy().then(Voice.removeAllListeners);
  }, []);

  const startListening = async () => {
    try {
      await Voice.start("en-US");
      setRecordedText("");
    } catch (e) {
      console.log("Start error:", e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.log("Stop error:", e);
    }
  };

  // ⭐ Ask AI handler
  const askAI = async () => {
    if (!recordedText.trim()) {
      Alert.alert("Say something first");
      return;
    }

    try {
      setLoading(true);
      setAIResponse("");

      const res = await axios.post("https://netra-server-nwf6.onrender.com/ask-ai", {
        userQuery: recordedText,
      });

      if (res.data.success) {
        setAIResponse(res.data.response);
      } else {
        Alert.alert("AI Error", "Could not get response");
      }

    } catch (err) {
      console.log("AI Error:", err);
      Alert.alert("Error", "Something went wrong talking to AI");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Send to Braille
  const sendToBraille = async () => {
    if (!connectedDevice) {
      Alert.alert("Bluetooth", "No device connected!");
      return;
    }

    if (!aiResponse.trim()) {
      Alert.alert("Nothing to send", "Ask AI first");
      return;
    }

    try {
      await BluetoothSerial.write(aiResponse + "\n");
      Alert.alert("Sent", "Braille message sent successfully!");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to send to Braille device");
    }
  };

  if(!connectedDevice) {
    navigation.navigate("Settings")
  }

  return (
    <View style={styles.container}>

      <Text style={styles.headerTitle}>AI Voice Assistant</Text>

      {/* Record Box */}
      <View style={styles.recordCard}>
        <Text style={styles.recordStatus}>
          {isListening ? "Listening..." : "Tap the mic to record"}
        </Text>

        <TouchableOpacity
          style={[styles.micButton, isListening && styles.activeMic]}
          onPress={isListening ? stopListening : startListening}
          disabled={loading}
        >
          <Icon
            name={isListening ? "stop-circle" : "microphone"}
            size={30}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      {/* Recorded Text */}
      <View style={styles.inputCard}>
        <Text style={styles.label}>Recorded Text</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Your speech will appear here..."
          placeholderTextColor="#7A8B99"
          value={recordedText}
          onChangeText={setRecordedText}
          multiline
        />
      </View>

      {/* Ask AI */}
      <TouchableOpacity
        style={[styles.askButton, loading && styles.askButtonDisabled]}
        onPress={askAI}
        disabled={loading}
      >
        <Text style={styles.askButtonText}>
          {loading ? "Thinking..." : "Ask AI"}
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#F9A938"
          style={{ marginTop: 18 }}
        />
      )}

      {/* AI Output */}
      {aiResponse !== "" && (
        <View style={styles.outputCard}>
          <Text style={styles.outputTitle}>AI Response</Text>
          <Text style={styles.outputText}>{aiResponse}</Text>
        </View>
      )}

      {/* Send to Braille */}
      {aiResponse !== "" && (
        <TouchableOpacity style={styles.sendButton} onPress={sendToBraille}>
          <Text style={styles.sendButtonText}>Send to Braille</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AIVoiceAssistantScreen;

// ---------------- STYLES ---------------- //

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F9",
    padding: 20,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0C3444",
    textAlign: "center",
    marginBottom: 20,
  },

  recordCard: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
  },

  recordStatus: {
    fontSize: 16,
    color: "#0C3444",
    marginBottom: 12,
  },

  micButton: {
    padding: 18,
    borderRadius: 50,
    backgroundColor: "#0C3444",
  },

  activeMic: {
    backgroundColor: "#F44336",
  },

  inputCard: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    elevation: 2,
  },

  label: {
    color: "#0C3444",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "700",
  },

  textInput: {
    minHeight: 90,
    fontSize: 16,
    color: "#0C3444",
  },

  askButton: {
    marginTop: 20,
    backgroundColor: "#F9A938",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  askButtonDisabled: {
    backgroundColor: "#F5C979",
  },

  askButtonText: {
    color: "#0C3444",
    fontSize: 18,
    fontWeight: "900",
  },

  outputCard: {
    marginTop: 25,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    elevation: 2,
  },

  outputTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0C3444",
    marginBottom: 10,
  },

  outputText: {
    fontSize: 16,
    color: "#314450",
  },

  sendButton: {
    marginTop: 25,
    backgroundColor: "#0C3444",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  sendButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "900",
  },
});
