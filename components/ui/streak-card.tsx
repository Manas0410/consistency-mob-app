import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface StreakCardProps {
  streak: number;
}

export default function StreakCard({ streak }: StreakCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Day Streak!</Text>
        <Text style={styles.subtitle}>
          You're on fire! Keep the momentum going.
        </Text>
      </View>
      <View style={styles.streakIconContainer}>
        <Image
          source={require("@/assets/images/flame.png")}
          style={styles.streakImage}
          resizeMode="contain"
        />
        <View style={styles.streakNumberOverlay}>
          <Text style={styles.streakNumber}>{streak}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#a18aff",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    margin: 8,
    // Gradient border effect
    borderStyle: "solid",
  },
  streakIconContainer: {
    marginRight: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  streakImage: {
    width: 66,
    height: 92,
  },
  streakNumberOverlay: {
    width: 56,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -9,
    left: "50%",
    transform: [{ translateX: -28 }],
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#d17b2c",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
  },
});
