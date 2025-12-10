import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";

export default function NetraaLoader() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Infinite rotation animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loaderRing,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  );
}

// Colors from your UI
const DARK = "#0C3444";
const ORANGE = "#F8A938";
const BG = "#F6F7F9";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: "center",
    alignItems: "center",
  },

  loaderRing: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: DARK,
    borderTopColor: ORANGE,       // orange highlight like your button
  },
});
