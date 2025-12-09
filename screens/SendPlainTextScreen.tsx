import React, {useContext, useEffect, useState} from 'react';
import {
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Voice from '@react-native-voice/voice';
import BluetoothSerial from "react-native-bluetooth-serial-next"; // <-- make sure installed
import { BluetoothContext } from '../context/BluetoothContext';

const SendVoiceDataScreen = () => {
  const {connectedDevice} = useContext(BluetoothContext);
  const [isListening, setIsListening] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  // For sending messages
  const [textMessage, setTextMessage] = useState('');

  // ⭐ Your SEND function integrated
  const handleSend = async () => {
    try {
      if (!connectedDevice) {
        Alert.alert('No device connected');
        return;
      }

      if (!textMessage.trim()) return;

      await BluetoothSerial.write(textMessage + '\n');

      console.log("Message Sent:", textMessage);

      setTextMessage('');
    } catch (err) {
      console.log("Send error:", err);
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = e => console.log('Speech error:', e);

    const androidPermissionChecking = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to recognize speech',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission granted');
        } else {
          console.log('Microphone permission denied');
        }

        const getService = await Voice.getSpeechRecognitionServices();
        console.log('Audio Services:', getService);
      }
    };

    androidPermissionChecking();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    console.log('Recording started');
    setIsListening(true);
    setShowOutput(false);
  };

  const onSpeechEnd = () => {
    console.log('Recording ended');
    setIsListening(false);
  };

  const onSpeechResults = event => {
    const text = event.value[0];
    console.log('Speech Results:', text);
    setSearchText(text);
    setTextMessage(text);       // ⭐ Set this for sending
    setShowOutput(true);
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      console.log('Start Error:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.log('Stop Error:', error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Voice Search</Text>

      {/* Recording Card */}
      <View style={styles.recordCard}>
        <Text style={styles.statusText}>
          {isListening ? 'Listening...' : 'Tap to start'}
        </Text>

        <TouchableOpacity
          style={[styles.micBtn, isListening && styles.micBtnActive]}
          onPress={isListening ? stopListening : startListening}>
          <Icon
            name={isListening ? 'stop-circle' : 'microphone'}
            size={28}
            color="#fff"
          />
          <Text style={styles.micBtnText}>
            {isListening ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Output Text Box */}
      {showOutput && searchText !== '' && (
        <View style={styles.outputBox}>
          <Text style={styles.outputLabel}>Recognized Text:</Text>

          <TextInput
            style={styles.outputInput}
            value={searchText}
            onChangeText={(t) => {
              setSearchText(t);
              setTextMessage(t);
            }}
            multiline={true}
          />
        </View>
      )}

      {/* SEND BUTTON */}
      {textMessage.trim() !== '' && (
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F4F8FF',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0A84FF',
    textAlign: 'center',
    marginBottom: 22,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
  },
  statusText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
  micBtn: {
    backgroundColor: '#0A84FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  micBtnActive: {
    backgroundColor: '#FF3B30',
  },
  micBtnText: {
    color: '#fff',
    marginLeft: 12,
    fontWeight: '600',
    fontSize: 16,
  },
  outputBox: {
    marginTop: 28,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    elevation: 3,
  },
  outputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A84FF',
    marginBottom: 8,
  },
  outputInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 60,
  },
  sendBtn: {
    marginTop: 30,
    backgroundColor: '#0A84FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SendVoiceDataScreen;
