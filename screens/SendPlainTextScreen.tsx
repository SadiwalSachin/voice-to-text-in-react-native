import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import { BluetoothContext } from '../context/BluetoothContext';

export default function SendPlainTextScreen() {
  const {connectedDevice} = useContext(BluetoothContext);
  const [textMessage, setTextMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const flatListRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Connect to HC-05 automatically on screen load

  // Send text message
  const handleSend = async () => {
    if (!connectedDevice) {
      Alert.alert('Connect to HC-05 first');
      return;
    }
    if (!textMessage.trim()) return;

    try {
      await BluetoothSerial.write(textMessage + '\n');

      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), type: 'sent', text: textMessage },
      ]);

      setTextMessage('');
    } catch (err) {
      console.log('Send error:', err);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.msgBubble,
        item.type === 'sent' ? styles.sentBubble : styles.receivedBubble,
      ]}
    >
      <Text
        style={[
          styles.msgText,
          item.type === 'sent' ? styles.sentText : styles.receivedText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subTitle}>
        {connectedDevice ? `Connected: ${connectedDevice.name}` : 'Not Connected'}
      </Text>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
      />

      <TextInput
        value={textMessage}
        onChangeText={setTextMessage}
        placeholder="Type your message..."
        placeholderTextColor="#6E7E90"
        style={styles.textInput}
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.btnText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

// ======================================================
//                     STYLES
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FF',
    padding: 16,
  },

  subTitle: {
    textAlign: 'center',
    color: '#444',
    marginBottom: 14,
  },

  chatContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },

  msgBubble: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    maxWidth: '80%',
  },

  sentBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0A84FF',
  },

  receivedBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#C8D6EE',
  },

  sentText: {
    color: '#fff',
  },

  receivedText: {
    color: '#000',
  },

  textInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#C8D6EE',
    fontSize: 16,
    marginTop: 10,
    color:"black"
  },

  button: {
    marginTop: 10,
    backgroundColor: '#0A84FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  btnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
