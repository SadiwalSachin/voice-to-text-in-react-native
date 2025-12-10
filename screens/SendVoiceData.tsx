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
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Voice from '@react-native-voice/voice';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import {BluetoothContext} from '../context/BluetoothContext';
import {useNavigation} from '@react-navigation/native';

const SendVoiceDataScreen = () => {
  const {connectedDevice} = useContext(BluetoothContext);
  const [isListening, setIsListening] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [textMessage, setTextMessage] = useState('');

  const navigation = useNavigation();

  const handleSend = async () => {
    try {
      if (!connectedDevice) {
        Alert.alert('No device connected');
        return;
      }

      if (!textMessage.trim()) return;

      await BluetoothSerial.write(textMessage + '\n');
      console.log('Message Sent:', textMessage);

      setTextMessage('');
      setSearchText('');
      setShowOutput(false);
    } catch (err) {
      console.log('Send error:', err);
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
            message:
              'This app needs access to your microphone to recognize speech',
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
    setTextMessage(text);
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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Connection Status Bar */}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Let's become more{' '}
            <Text style={styles.headerHighlight}>Productive</Text>
          </Text>
          <View style={styles.headerIcon}>
            <Icon name="chart-line" size={24} color="#F59E0B" />
          </View>
        </View>

                <View style={styles.connectionCard}>
          <Icon
            name={connectedDevice ? 'bluetooth-connect' : 'bluetooth-off'}
            size={20}
            color={connectedDevice ? '#10B981' : '#6B7280'}
          />
          <Text
            style={[
              styles.connectionText,
              connectedDevice && styles.connectionActive,
            ]}>
            {connectedDevice ? 'Device Connected' : 'No Device Connected'}
          </Text>
        </View>

        {/* Voice Control Card */}
        <View style={styles.voiceCard}>
          <View style={styles.voiceCardContent}>
            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>
                {isListening ? 'Listening to your voice...' : 'Ready to listen'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {isListening
                  ? 'Speak clearly into the microphone'
                  : 'Tap mic button to start'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.micButton}
              onPress={isListening ? stopListening : startListening}>
              <View
                style={[
                  styles.micButtonInner,
                  isListening && styles.micButtonActive,
                ]}>
                <Icon
                  name={isListening ? 'stop-circle' : 'microphone'}
                  size={32}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          </View>

          {isListening && (
            <View style={styles.waveContainer}>
              <View style={styles.wave} />
              <View style={[styles.wave, styles.wave2]} />
              <View style={[styles.wave, styles.wave3]} />
            </View>
          )}
        </View>

        {/* Recognized Text Output */}
        {showOutput && searchText !== '' && (
          <View style={styles.outputCard}>
            <Text style={styles.outputTitle}>Recognized Text</Text>

            <View style={styles.textBox}>
              <TextInput
                style={styles.textInput}
                value={searchText}
                onChangeText={t => {
                  setSearchText(t);
                  setTextMessage(t);
                }}
                multiline={true}
                placeholder="Your text will appear here..."
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {textMessage.trim() !== '' && (
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.sendButtonText}>Send Message</Text>
                <Icon
                  name="send"
                  size={18}
                  color="#fff"
                  style={styles.sendIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to use</Text>
          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Tap the microphone button to start recording
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Speak your message clearly
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Review and edit if needed, then send
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F3F4F6'},
  scrollView: {flex: 1},
  scrollContent: {padding: 20, paddingBottom: 40},

  // Connection Status Bar
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    lineHeight: 36,
  },
  headerHighlight: {color: '#F59E0B'},
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Rest of your styles (voiceCard, outputCard, instructionsCard...) remain unchanged
  voiceCard: {
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  voiceCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {flex: 1, marginRight: 16},
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  statusSubtitle: {fontSize: 14, color: '#94A3B8'},
  micButton: {width: 72, height: 72},
  micButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#F59E0B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  micButtonActive: {backgroundColor: '#EF4444', shadowColor: '#EF4444'},
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: 30,
  },
  wave: {
    width: 4,
    height: 20,
    backgroundColor: '#F59E0B',
    marginHorizontal: 3,
    borderRadius: 2,
    opacity: 0.6,
  },
  wave2: {height: 30, opacity: 0.8},
  wave3: {height: 15, opacity: 0.5},

  outputCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  outputTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 14,
  },
  textBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#F59E0B',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sendButtonText: {fontSize: 16, fontWeight: '700', color: '#fff'},
  sendIcon: {marginLeft: 8},

  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
  stepText: {fontSize: 14, fontWeight: '700', color: '#F59E0B'},
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 4,
  },
});

export default SendVoiceDataScreen;
