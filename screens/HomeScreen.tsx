import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen() {
  const navigation = useNavigation();
  console.log("on home screen");
  

  return (
    <View style={styles.container}>
      {/* Main Title */}
      <Text style={styles.mainTitle}>NETRAA</Text>

      {/* Mission Text */}
      <View style={styles.missionBox}>
        <MaterialIcons name="visibility" size={22} color="#0A84FF" />
        <Text style={styles.missionText}>
          Empowering blind & deaf individuals with accessible learning tools.
        </Text>
      </View>

      <Text style={styles.subtitle}>Choose an option to continue</Text>

      {/* Buttons */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PlainText')}
        style={styles.button}
      >
        <MaterialIcons name="text-fields" size={22} color="#fff" />
        <Text style={styles.btnText}>Send Plain Text</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('PDFData')}
        style={styles.button}
      >
        <MaterialIcons name="picture-as-pdf" size={22} color="#fff" />
        <Text style={styles.btnText}>Send PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('VoiceData')}
        style={styles.button}
      >
        <MaterialIcons name="keyboard-voice" size={22} color="#fff" />
        <Text style={styles.btnText}>Send Voice Data</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('TeachersModule')}
        style={styles.button}
      >
        <MaterialIcons name="school" size={22} color="#fff" />
        <Text style={styles.btnText}>Teacher’s Module</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('AIVoiceAssistantScreen')}
        style={styles.button}
      >
        <MaterialIcons name="school" size={22} color="#fff" />
        <Text style={styles.btnText}>AI Assistant</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FF',
    alignItems: 'center',
    paddingTop: 40,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0A84FF',
    marginBottom: 10,
  },

  missionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    padding: 10,
    backgroundColor: '#EAF3FF',
    borderRadius: 10,
    marginBottom: 20,
  },

  missionText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
    flex: 1,
  },

  subtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 30,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    paddingVertical: 14,
    backgroundColor: '#0A84FF',
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 4,
  },

  btnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
  },
});
