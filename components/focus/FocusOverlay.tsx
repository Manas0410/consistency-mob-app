import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useFocus } from "@/contexts/focus-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePallet } from "@/hooks/use-pallet";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  BackHandler,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FocusOverlayProps {
  visible: boolean;
  onRequestReturn: () => void;
  onEndSession: () => void;
}

const FocusOverlay: React.FC<FocusOverlayProps> = ({
  visible,
  onRequestReturn,
  onEndSession,
}) => {
  const insets = useSafeAreaInsets();
  const pallet = usePallet();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { remainingTime, currentSession } = useFocus();

  // Animation values
  const pulseAnimation = useSharedValue(1);
  const fadeAnimation = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    // Animate overlay visibility
    fadeAnimation.value = withTiming(visible ? 1 : 0, { duration: 300 });

    if (visible) {
      // Start pulse animation
      pulseAnimation.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    // Handle back button press on Android
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Prevent going back during focus session
        return true;
      }
    );

    return () => backHandler.remove();
  }, [visible]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: fadeAnimation.value,
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
      <LinearGradient
        colors={["rgba(0,0,0,0.95)", "rgba(0,0,0,0.98)"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Lock Icon */}
        <Animated.View style={[styles.lockContainer, animatedPulseStyle]}>
          <View
            style={[
              styles.lockIconBackground,
              { backgroundColor: pallet.shade1 },
            ]}
          >
            <Ionicons name="lock-closed" size={40} color="white" />
          </View>
        </Animated.View>

        {/* Focus Mode Title */}
        <Text style={styles.title}>Focus Mode Active</Text>

        {/* Session Info */}
        <View style={styles.sessionInfo}>
          <Text style={styles.timeRemaining}>
            {formatTime(remainingTime)} remaining
          </Text>
          <Text style={styles.sessionDuration}>
            {currentSession?.duration}-minute focus session
          </Text>
        </View>

        {/* Motivational Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            🧘‍♀️ Stay focused. You're in the zone.
          </Text>
          <Text style={styles.submessage}>
            Minimize distractions and maximize your productivity
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.returnButton]}
            onPress={onRequestReturn}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
            <Text style={styles.returnButtonText}>Return to Timer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.endButton]}
            onPress={onEndSession}
            activeOpacity={0.8}
          >
            <Ionicons name="stop" size={20} color="white" />
            <Text style={styles.endButtonText}>End Session</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Tip */}
        <View style={styles.tipContainer}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Use the notification panel to return to your focus session
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    width: "100%",
  },
  lockContainer: {
    marginBottom: 32,
  },
  lockIconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: Platform.OS === "ios" ? 28 : 26,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  sessionInfo: {
    alignItems: "center",
    marginBottom: 40,
  },
  timeRemaining: {
    fontSize: Platform.OS === "ios" ? 48 : 44,
    fontWeight: Platform.OS === "ios" ? "300" : "200",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    fontVariant: ["tabular-nums"],
  },
  sessionDuration: {
    fontSize: Platform.OS === "ios" ? 16 : 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  message: {
    fontSize: Platform.OS === "ios" ? 20 : 19,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 28,
  },
  submessage: {
    fontSize: Platform.OS === "ios" ? 16 : 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 22,
  },
  actionButtons: {
    width: "100%",
    gap: 16,
    marginBottom: 32,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  returnButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  endButton: {
    backgroundColor: "#E53E3E",
  },
  returnButtonText: {
    fontSize: Platform.OS === "ios" ? 18 : 17,
    fontWeight: "600",
    color: "white",
  },
  endButtonText: {
    fontSize: Platform.OS === "ios" ? 18 : 17,
    fontWeight: "600",
    color: "white",
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  tipText: {
    fontSize: Platform.OS === "ios" ? 14 : 13,
    fontWeight: "500",
    color: "#FFD700",
    textAlign: "center",
    flex: 1,
  },
});

export default FocusOverlay;
