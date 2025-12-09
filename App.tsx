
// import React from "react";
// import { View, Text, Button } from "react-native";
// import { pick } from "react-native-document-picker";

// export default function App() {

//   const SERVER = "http://172.16.6.251:5000";  // your local IP

//   // PDF upload
//   const uploadPDF = async () => {
//     try {
//       console.log("upload runs");

//       const doc = await pick({
//         type: ["application/pdf"],
//       });

//       console.log("Picked File:", doc);

//       let formData = new FormData();
//       formData.append("pdfFile", {
//         uri: doc[0].uri,
//         type: doc[0].nativeType || "application/pdf",
//         name: doc[0].name || "file.pdf",
//       });

//       // const response = await axios.post(
//       //   `${SERVER}/extract-text`,
//       //   formData,
//       //   {
//       //     headers: {
//       //       "Content-Type": "multipart/form-data",
//       //     },
//       //   }
//       // );

//       // console.log("PDF Upload Response:", response.data);

//     } catch (err) {
//       console.log("UPLOAD ERROR:", err);
//     }
//   };

//   // Simple GET call (already working)
//   const testGet = async () => {
//     // const res = await axios.get(`${SERVER}/test-get`);
//     // console.log("GET:", res.data);
//   };

//   return (
//     <View style={{ marginTop: 80, padding: 20 }}>
//       <Text style={{ fontSize: 22, textAlign: "center", color: "black" }}>
//         PDF Upload + Normal API Test
//       </Text>

//       <View style={{ marginVertical: 20 }}>
//         <Button title="Test GET Request" onPress={testGet} />
//       </View>

//       <View style={{ marginVertical: 20 }}>
//         <Button title="Upload PDF File new" onPress={uploadPDF} />
//       </View>
//     </View>
//   );
// }

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BluetoothScreen from './screens/BluetoothScreen';
import SendPlainTextScreen from './screens/SendPlainTextScreen';
import {BluetoothProvider} from './context/BluetoothContext';
import SendVoiceDataScreen from './screens/SendVoiceData';
import TeachersModuleScreen from './screens/TeachersModulesScreen';
import SendPDFScreen from './screens/SendPDFScreen';
import AIVoiceAssistantScreen from './screens/AiVoiceAssistantScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <BluetoothProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={({navigation}) => ({
            headerStyle: {backgroundColor: '#0A84FF'},
            headerTintColor: '#fff',
            headerTitleStyle: {fontWeight: 'bold'},
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  console.log('on press runss');
                  navigation.navigate('Settings');
                }}
                style={{marginRight: 10}}>
                <Icon name="settings-outline" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          })}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'NETRAA'}}
          />
          <Stack.Screen
            name="Settings"
            component={BluetoothScreen}
            options={{title: 'Settings'}}
          />
          <Stack.Screen
            name="PlainText"
            component={SendPlainTextScreen}
            options={{title: 'Send Plain Text'}}
          />
          <Stack.Screen
          name="VoiceData"
          component={SendVoiceDataScreen}
          options={{ title: "Send Voice Data" }}
        />

        <Stack.Screen
          name="PDFData"
          component={SendPDFScreen}
          options={{ title: "Send PDF Data" }}
        />

        <Stack.Screen
          name="TeachersModule"
          component={TeachersModuleScreen}
          options={{ title: "Teacher's Module" }}
        />

        <Stack.Screen
          name="AIVoiceAssistantScreen"
          component={AIVoiceAssistantScreen}
          options={{ title: "AI Assistant" }}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </BluetoothProvider>
  );
};

export default App;
