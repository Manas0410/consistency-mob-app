import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface StreakCardProps {
  streak: number;
}

export default function StreakCard({ streak }: StreakCardProps) {
  const pallet = usePallet();
  const colors = Colors.light; // Always use light theme
  const textColor = useColor({}, "text");
  const textMutedColor = useColor({}, "textMuted");
  const iconColor = useColor({}, "icon");
  const backgroundCardColor = useColor({}, "background");

  return (
    <View>
      <View
        style={[
          styles.card,
          {
            backgroundColor: backgroundCardColor,
            borderColor: pallet.shade3,
            shadowColor: pallet.shade1,
          },
        ]}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor }]}>Day Streak!</Text>
          <Text
            style={[styles.subtitle, { color: textMutedColor || iconColor }]}
          >
            you've maintained a {streak}-days of{" "}
            <Text style={{ fontWeight: "bold" }}>task completion</Text> streak!
          </Text>
        </View>
        <View style={styles.streakIconContainer}>
          <Image
            source={require("@/assets/images/flame.png")}
            style={styles.streakImage}
            resizeMode="contain"
          />
          <View style={styles.streakNumberOverlay}>
            <Text
              style={[styles.streakNumber, { textShadowColor: pallet.shade1 }]}
            >
              {streak}
            </Text>
          </View>
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
    borderRadius: 24,
    padding: 18,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
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
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
  },
});
