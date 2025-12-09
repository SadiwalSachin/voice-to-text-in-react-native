// import React, {useEffect, useState} from 'react';
// import {Platform} from 'react-native';
// import {View, TextInput, TouchableOpacity, StyleSheet, PermissionsAndroid} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Voice from '@react-native-voice/voice';

// const App = () => {
//   const [isListening, setIsListening] = useState(false);
//   const [searchText, setSearchText] = useState('');

//   useEffect (() => {
//     Voice.onSpeechStart = onSpeechStart;
//     Voice.onSpeechEnd = onSpeechEnd;
//     Voice.onSpeechResults = onSpeechResults;
//     Voice.onSpeechError = (error) => console.log ('onSpeech Error', error);

//     const androidPermissionChecking = async () => {
//       if(Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: 'Microphone Permission',
//             message: 'This app needs access to your microphone to recognize speech',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative:'Cancel',
//             buttonPositive: 'OK',
//           }
//         );

//         if (granted === PermissionsAndroid.RESULTS.GRANTED){
//           console.log('Microphone permission granted');
//         } else {
//           console.log('Microphone permission denied');
//         }

//         const getService = await Voice.getSpeechRecognitionServices();
//         console.log('getService for audio', getService);
//       }
//     };

//     androidPermissionChecking(); 

//     return () => {
//       Voice.destroy().then (Voice.removeAllListeners);
//     }
//   }, []);

//   const onSpeechStart = () => {
//     console.log('Recording started');
//   }

//   const onSpeechEnd = () => {
//     setIsListening(false);
//     console.log('Recording ended');
//   }

//   const onSpeechResults = (event) => {
//     console.log ('OnSpeechResults', event);
//     const text = event.value[0];
//     setSearchText(text)
//   };

//   const startListening = async () => {
//     try{
//       await Voice.start('en-US');
//       setIsListening(true);
//     } catch (error) {
//       console.log('Start Listening Error', error);
//     }
//   };

//   const stopListening = async () => {
//     try{ 
//       await Voice.stop();
//       setIsListening(false);
//     } catch (error) {
//       console.log('Stop Listening Error', error); 
//     }
//   }

//   const styles = StyleSheet.create ({
//     container:{
//       flexDirection:'row',
//       backgroundColor:'#f1f1f1',
//       borderRadius:30,
//       alignItems:'center',
//       paddingHorizontal:15,
//       margin:20,
//       elevation:3,
//     },
//     input:{
//       flex:1,
//       height:45,
//       fontSize:16,
//       color:'#000',
//     },
//     iconContainer: {
//       marginLeft:10,
//     },
//     dotsContainer:{
//       flexDirection:'row',
//       justifyContent:'center',
//       alignItems:'center',
//     },
//     dot:{
//       width:6,
//       height:6,
//       borderRadius:3,
//       backgroundColor:'#333',
//       marginHorizontal:2,
//     }
//   })

//   return (
//     <View style={styles.container}>
//       <TextInput
//        placeholder='Search here...'
//        value={searchText}
//        onChangeText={setSearchText}
//        style={styles.input}
//        placeholderTextColor='#999'
//       />

//       <TouchableOpacity
//        onPress = {() => {
//         isListening ? stopListening() : startListening()
//        }}
//        style={styles.iconContainer}
//       >
//         {isListening ? (
//           <View style = {styles.dotsContainer}>
//             <View style={styles.dot}/>
//             <View style={styles.dot}/>
//             <View style={styles.dot}/>
//           </View>
//         ):(
//           <Icon name='microphone' size={24} color='#333'/>
//         )}
//       </TouchableOpacity>
      
//     </View>
//   )
// }

// export default App;

// export default App
// import { View, Text, Button } from 'react-native';
// import React from 'react';
// import { pickMultiple } from 'react-native-documents/picker';
// import { pick } from 'react-native-document-picker';

// export default function App() {

//   const selectDoc = async () => {
//     try {
//       const docs = await pickMultiple({
//         type: ['application/pdf', 'image/*'], 
//       });

//       console.log(docs);

//     } catch (err) {
//       if (err.code === 'DOCUMENT_PICKER_CANCELED') {
//         console.log("User cancelled");
//       } else {
//         console.log(err);
//       }
//     }
//   };

//   return (
//     <View>
//       <Text style={{
//         color: 'black',
//         fontSize: 28,
//         textAlign: 'center',
//         marginVertical: 40,
//       }}>
//         Document Picker
//       </Text>

//       <View style={{ marginHorizontal: 40 }}>
//         <Button title="Select Document" onPress={selectDoc} />
//       </View>
//     </View>
//   );
// }

import React from "react";
import { View, Text, Button } from "react-native";
// import axios from "axios";
// import { pick } from "@react-native-documents/picker";
import { pick } from "react-native-document-picker";

export default function App() {

  const SERVER = "http://172.16.6.251:5000";  // your local IP

  // PDF upload
  const uploadPDF = async () => {
    try {
      console.log("upload runs");
      
      const doc = await pick({
        type: ["application/pdf"],
      });

      console.log("Picked File:", doc);

      let formData = new FormData();
      formData.append("pdfFile", {
        uri: doc[0].uri,
        type: doc[0].nativeType || "application/pdf",
        name: doc[0].name || "file.pdf",
      });

      // const response = await axios.post(
      //   `${SERVER}/extract-text`,
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );

      // console.log("PDF Upload Response:", response.data);

    } catch (err) {
      console.log("UPLOAD ERROR:", err);
    }
  };

  // Simple GET call (already working)
  const testGet = async () => {
    // const res = await axios.get(`${SERVER}/test-get`);
    // console.log("GET:", res.data);
  };

  return (
    <View style={{ marginTop: 80, padding: 20 }}>
      <Text style={{ fontSize: 22, textAlign: "center", color: "black" }}>
        PDF Upload + Normal API Test
      </Text>

      <View style={{ marginVertical: 20 }}>
        <Button title="Test GET Request" onPress={testGet} />
      </View>

      <View style={{ marginVertical: 20 }}>
        <Button title="Upload PDF File new" onPress={uploadPDF} />
      </View>
    </View>
  );
}
