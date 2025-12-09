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

const AIVoiceAssistantScreen = () => {
  const { connectedDevice } = useContext(BluetoothContext);

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

  return (
    <View style={styles.container}>

      <Text style={styles.title}>AI Voice Assistant</Text>

      {/* Voice Recording Card */}
      <View style={styles.card}>
        <Text style={styles.statusText}>
          {isListening ? "Listening..." : "Tap the mic to record"}
        </Text>

        <TouchableOpacity
          style={[styles.micBtn, isListening && styles.activeMic]}
          onPress={isListening ? stopListening : startListening}
          disabled={loading}
        >
          <Icon
            name={isListening ? "stop-circle" : "microphone"}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Text Box */}
      <TextInput
        style={styles.textBox}
        placeholder="Your recorded text will appear here..."
        value={recordedText}
        placeholderTextColor="gray"
        multiline
        aria-disabled={loading}
        onChangeText={(t) => setRecordedText(t)}
      />

      {/* Ask AI Button */}
      <TouchableOpacity
        style={[styles.askBtn, loading && styles.askBtnDisabled]}
        onPress={askAI}
        disabled={loading}
      >
        <Text style={styles.askText}>
          {loading ? "Asking..." : "Ask AI"}
        </Text>
      </TouchableOpacity>

      {/* Loader */}
      {loading && (
        <ActivityIndicator size="large" color="#0A84FF" style={{ marginTop: 20 }} />
      )}

      {/* AI Output */}
      {aiResponse !== "" && (
        <View style={styles.outputBox}>
          <Text style={styles.outputTitle}>AI Response:</Text>
          <Text style={styles.outputText}>{aiResponse}</Text>
        </View>
      )}

      {/* Send to Braille Button */}
      {aiResponse !== "" && (
        <TouchableOpacity style={styles.sendBtn} onPress={sendToBraille}>
          <Text style={styles.sendBtnText}>Send to Braille</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AIVoiceAssistantScreen;

// ------------------ STYLES -------------------- //

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FF",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0A84FF",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 12,
  },
  micBtn: {
    padding: 16,
    borderRadius: 50,
    backgroundColor: "#0A84FF",
  },
  activeMic: {
    backgroundColor: "#FF3B30",
  },
  textBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    color:"gray",
    padding: 18,
    borderRadius: 12,
    minHeight: 90,
    fontSize: 16,
  },
  askBtn: {
    marginTop: 20,
    backgroundColor: "#0A84FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  askBtnDisabled: {
    backgroundColor: "#8BB8FF", // faded blue when loading
  },
  askText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  outputBox: {
    marginTop: 25,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
  },
  outputTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0A84FF",
  },
  outputText: {
    fontSize: 16,
    color: "#333",
  },
  sendBtn: {
    marginTop: 25,
    backgroundColor: "green",
    padding: 14,
    alignItems: "center",
    borderRadius: 12,
  },
  sendBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
