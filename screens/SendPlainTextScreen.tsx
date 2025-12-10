import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import { BluetoothContext } from '../context/BluetoothContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function SendPlainTextScreen() {
  const {connectedDevice} = useContext(BluetoothContext);
  const [textMessage, setTextMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const flatListRef = useRef(null);

  const navigation = useNavigation();

  // Auto scroll
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Send text message
  const handleSend = async () => {
    if (!connectedDevice) {
      Alert.alert('No Device Connected', 'Please connect to a Bluetooth device first');
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
      Alert.alert('Error', 'Failed to send message');
    }
  };

  // if(!connectedDevice) {
  //   navigation.navigate("Settings")
  // }

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
      <Text style={[
        styles.msgTime,
        item.type === 'sent' ? styles.sentTime : styles.receivedTime
      ]}>
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="message-text-outline" size={64} color="#94A3B8" />
      </View>
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptySubtitle}>
        Start typing to send your first message to the device
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Message <Text style={styles.headerHighlight}>Center</Text>
          </Text>
          <View style={styles.connectionStatus}>
            <Icon 
              name={connectedDevice ? "bluetooth-connect" : "bluetooth-off"} 
              size={16} 
              color={connectedDevice ? "#10B981" : "#6B7280"} 
            />
            <Text style={[styles.connectionText, connectedDevice && styles.connectionActive]}>
              {connectedDevice ? `Connected to ${connectedDevice.name}` : 'Not Connected'}
            </Text>
          </View>
        </View>
        <View style={styles.headerIcon}>
          <Icon name="chat" size={24} color="#F59E0B" />
        </View>
      </View>

      {/* Messages Container */}
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={[
            styles.chatContainer,
            messages.length === 0 && styles.chatContainerEmpty
          ]}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={textMessage}
            onChangeText={setTextMessage}
            placeholder="Type your message..."
            placeholderTextColor="#9CA3AF"
            style={styles.textInput}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !textMessage.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!textMessage.trim()}>
            <Icon 
              name="send" 
              size={22} 
              color={textMessage.trim() ? "#fff" : "#9CA3AF"} 
            />
          </TouchableOpacity>
        </View>
        
        {textMessage.length > 0 && (
          <Text style={styles.charCount}>
            {textMessage.length}/500 characters
          </Text>
        )}
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#F3F4F6',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerHighlight: {
    color: '#F59E0B',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  connectionText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  connectionActive: {
    color: '#10B981',
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
  messagesContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  chatContainer: {
    padding: 16,
    flexGrow: 1,
  },
  chatContainerEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  msgBubble: {
    padding: 14,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '75%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  sentBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#F59E0B',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E3A5F',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#fff',
  },
  msgTime: {
    fontSize: 10,
    marginTop: 2,
  },
  sentTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  receivedTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'left',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#F3F4F6',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
    elevation: 0,
  },
  charCount: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
    marginLeft: 4,
  },
});