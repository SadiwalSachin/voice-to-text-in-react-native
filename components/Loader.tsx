import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";

export default function NetraaLoader() {
  const scaleAnim = useRef(new Animated.Value(0)).current;       // Eye opening
  const opacityAnim = useRef(new Animated.Value(0.5)).current;   // Breathing light

  useEffect(() => {
    // Eye opening animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    // Smooth breathing glow loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.eyeContainer,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        {/* Outer Eye */}
        <View style={styles.eyeOuter}>
          {/* Inner Eye / Iris */}
          <View style={styles.eyeInner} />
        </View>
      </Animated.View>
    </View>
  );
}

const BLUE = "#0A84FF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9FF",
    justifyContent: "center",
    alignItems: "center",
  },

  eyeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  eyeOuter: {
    width: 140,
    height: 140,
    borderRadius: 100,
    backgroundColor: "white",
    borderWidth: 6,
    borderColor: BLUE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: BLUE,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
  },

  eyeInner: {
    width: 55,
    height: 55,
    backgroundColor: BLUE,
    borderRadius: 50,
  },
});
