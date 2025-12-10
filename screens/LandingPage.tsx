import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen() {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        
        {/* Logo */}
        <Image
          source={require("../assets/logo_netraa.png")}
          style={styles.logo}
        />

        {/* Heading */}
        <Text style={styles.heading}>
          Let’s become more <Text style={styles.highlight}>Productive</Text>
        </Text>

        {/* Start Button */}
        <TouchableOpacity style={styles.startBtn} 
        onPress={()=>(navigation.navigate("Settings"))}
        >

          <Text style={styles.startBtnText}>Start</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F9", // light grey background from screenshot
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#0C3444", // dark blue container from screenshot
    paddingVertical: 45,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    marginBottom: 25,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  highlight: {
    color: "#F8A938", // orange accent from screenshot
  },
  startBtn: {
    backgroundColor: "#F8A938", // orange button color
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 15,
    shadowColor: "#F8A938",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  startBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
