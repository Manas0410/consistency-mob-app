import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useFocus } from "@/contexts/focus-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePallet } from "@/hooks/use-pallet";
import React, { useEffect } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Circle } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface FocusTimerProps {
  size?: number;
  strokeWidth?: number;
}

const FocusTimer: React.FC<FocusTimerProps> = ({
  size = screenWidth * 0.75,
  strokeWidth = Platform.OS === "ios" ? 16 : 14,
}) => {
  const {
    remainingTime,
    progress,
    isActive,
    isPaused,
    currentSession,
    currentQuote,
    progressMessage,
  } = useFocus();
  const pallet = usePallet();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const styles = createStyles(themeColors, pallet);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animated values
  const animatedProgress = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);
  const glowAnimation = useSharedValue(0);
  const breathingAnimation = useSharedValue(1);

  // Update progress animation
  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: Platform.OS === "ios" ? 800 : 1000,
    });
  }, [progress]);

  // Enhanced pulse and glow animations when active (keep same when paused)
  useEffect(() => {
    if (isActive) {
      // Continuous breathing animation - same whether paused or not
      breathingAnimation.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000 }),
          withTiming(0.98, { duration: 2000 })
        ),
        -1,
        true
      );

      // Glow effect - same whether paused or not
      glowAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0.3, { duration: 1500 })
        ),
        -1,
        true
      );
    } else {
      breathingAnimation.value = withSpring(1);
      glowAnimation.value = withTiming(0, { duration: 500 });
    }
  }, [isActive]);

  // Animated props for the progress circle
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      animatedProgress.value,
      [0, 1],
      [circumference, 0],
      Extrapolate.CLAMP
    );

    return {
      strokeDashoffset: strokeDashoffset,
      opacity: interpolate(animatedProgress.value, [0, 1], [0.3, 1]),
    };
  });

  // Animated container styles for breathing and glow effects
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathingAnimation.value }],
    shadowOpacity: Platform.OS === "ios" ? glowAnimation.value * 0.4 : 0,
    elevation: Platform.OS === "android" ? glowAnimation.value * 8 : 0,
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowAnimation.value,
    transform: [{ scale: 1 + glowAnimation.value * 0.1 }],
  }));

  // Format time display
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Get session duration for display
  const sessionDuration = currentSession ? currentSession.duration : 0;
  const totalSeconds = sessionDuration * 60;
  const completedSeconds = totalSeconds - remainingTime;

  // Colors optimized for the beautiful design
  const getTimerColors = () => {
    if (isActive) {
      return {
        background: "rgba(255, 255, 255, 0.2)",
        progress: "rgba(255, 255, 255, 0.9)",
        gradient1: "rgba(255, 255, 255, 0.9)",
        gradient2: "rgba(255, 255, 255, 0.7)",
      };
    } else if (!currentSession) {
      return {
        background: themeColors.background,
        progress: pallet.shade1,
        gradient1: pallet.shade1,
        gradient2: pallet.shade2,
      };
    } else {
      return {
        background: themeColors.background,
        progress: pallet.shade1,
        gradient1: pallet.shade1,
        gradient2: pallet.shade2,
      };
    }
  };

  const colors = getTimerColors();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.timerContainer,
          animatedContainerStyle,
          isActive && styles.activeTimerContainer,
        ]}
      >
        {/* Clean Timer Display */}
        <View style={styles.timerContent}>
          {isActive ? (
            <View style={styles.activeTimerDisplay}>
              {/* Large Time Display */}
              <Text style={styles.activeTimeText}>
                {formatTime(remainingTime)}
              </Text>

              {/* Remaining Time Text */}
              <Text style={styles.remainingTimeText}>
                {Math.ceil(remainingTime / 60)} minutes remaining
              </Text>
            </View>
          ) : (
            <View style={styles.readyTimerDisplay}>
              <Text style={[styles.readyText, { color: pallet.shade2 }]}>
                Ready to focus? 🚀
              </Text>
              <Text style={[styles.readySubtext, { color: pallet.shade3 }]}>
                Choose a duration to begin
              </Text>
            </View>
          )}

          {!currentSession && (
            <View style={styles.readyContainer}>
              <Text style={[styles.readyText, { color: pallet.shade2 }]}>
                Ready to focus? 🚀
              </Text>
              <Text style={[styles.readySubtext, { color: pallet.shade3 }]}>
                Choose a duration to begin
              </Text>
            </View>
          )}

          {isActive && (
            <View style={[styles.statusBadge, styles.activeBadge]}>
              <Text style={[styles.statusText, styles.activeStatusText]}>
                FOCUSING
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Motivational text */}
      {isActive && (
        <View style={styles.motivationContainer}>
          {currentQuote ? (
            <Text style={styles.motivationText}>
              {currentQuote.emoji} "{currentQuote.text}"
              {currentQuote.author && (
                <Text style={styles.quoteAuthor}> — {currentQuote.author}</Text>
              )}
            </Text>
          ) : (
            <Text style={styles.motivationText}>
              Stay focused, you're doing great! 🎯
            </Text>
          )}

          {progressMessage && (
            <Text style={styles.progressText}>{progressMessage}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: any, pallet: any) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    glowBackground: {
      position: "absolute",
      width: screenWidth * 0.9,
      height: screenWidth * 0.9,
      borderRadius: screenWidth * 0.45,
      backgroundColor: "rgba(52, 199, 89, 0.08)",
      shadowColor: "#34C759",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 8,
    },
    timerContainer: {
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        Platform.OS === "ios" ? "rgba(255,255,255,0.1)" : "transparent",
      borderRadius: screenWidth * 0.4,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    activeTimerContainer: {
      backgroundColor: "transparent",
      ...Platform.select({
        ios: {
          shadowColor: "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
        },
        android: {
          elevation: 0,
        },
      }),
    },
    svg: {
      position: "absolute",
    },
    timerContent: {
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      width: "100%",
    },
    activeTimerDisplay: {
      alignItems: "center",
      justifyContent: "center",
    },
    activeTimeText: {
      fontSize: Platform.OS === "ios" ? 64 : 60,
      fontWeight: Platform.OS === "ios" ? "300" : "200",
      color: "#FFFFFF",
      textAlign: "center",
      letterSpacing: -1,
      marginBottom: 8,
    },
    remainingTimeText: {
      fontSize: Platform.OS === "ios" ? 16 : 15,
      fontWeight: "400",
      color: "rgba(255, 255, 255, 0.7)",
      textAlign: "center",
    },
    readyTimerDisplay: {
      alignItems: "center",
      justifyContent: "center",
    },
    timeDisplayContainer: {
      alignItems: "center",
      marginBottom: 16,
    },
    activeTimeContainer: {
      backgroundColor: "#34C759",
      borderRadius: 16,
      paddingVertical: 20,
      paddingHorizontal: 32,
      marginBottom: 24,
      ...Platform.select({
        ios: {
          shadowColor: "#34C759",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    timeDisplay: {
      fontSize: Platform.OS === "ios" ? 56 : 52,
      fontWeight: Platform.OS === "ios" ? "200" : "100",
      fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-thin",
      letterSpacing: Platform.OS === "ios" ? -3 : -2,
      textAlign: "center",
      color: "#333333",
    },
    activeTimeDisplay: {
      color: "#FFFFFF",
      fontSize: Platform.OS === "ios" ? 60 : 56,
      fontWeight: Platform.OS === "ios" ? "300" : "200",
      textShadowColor: "rgba(0, 0, 0, 0.2)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    sessionInfoContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    activeSessionInfo: {
      backgroundColor: "#F8F9FA",
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sessionInfo: {
      fontSize: Platform.OS === "ios" ? 17 : 16,
      fontWeight: "500",
      textAlign: "center",
      color: "#666666",
    },
    activeSessionText: {
      color: "#333333",
      fontSize: Platform.OS === "ios" ? 18 : 17,
      fontWeight: "600",
    },
    motivationText: {
      fontSize: Platform.OS === "ios" ? 16 : 15,
      fontWeight: "500",
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "center",
      marginTop: 8,
      lineHeight: 22,
    },
    quoteAuthor: {
      fontSize: Platform.OS === "ios" ? 14 : 13,
      fontWeight: "400",
      color: "rgba(255, 255, 255, 0.7)",
      fontStyle: "italic",
    },
    progressText: {
      fontSize: Platform.OS === "ios" ? 14 : 13,
      fontWeight: "500",
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "center",
      marginTop: 8,
    },
    progressInfo: {
      alignItems: "center",
      marginTop: 16,
      gap: 12,
      width: "100%",
    },
    activeProgressInfo: {
      backgroundColor: "#F8F9FA",
      borderRadius: 16,
      padding: 20,
      width: "100%",
    },
    progressStats: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: "#E0E0E0",
      marginHorizontal: 20,
    },
    statNumber: {
      fontSize: Platform.OS === "ios" ? 24 : 22,
      fontWeight: "bold",
      color: "#666666",
    },
    activeStatNumber: {
      fontSize: Platform.OS === "ios" ? 28 : 26,
      color: "#34C759",
    },
    statLabel: {
      fontSize: Platform.OS === "ios" ? 14 : 13,
      fontWeight: "500",
      color: "#999999",
      marginTop: 4,
      textAlign: "center",
    },
    activeStatLabel: {
      color: "#666666",
      fontSize: Platform.OS === "ios" ? 15 : 14,
    },
    percentageContainer: {
      alignItems: "center",
      gap: 6,
      width: "100%",
    },
    percentageText: {
      fontSize: Platform.OS === "ios" ? 22 : 20,
      fontWeight: Platform.OS === "ios" ? "600" : "bold",
      textAlign: "center",
    },
    percentageBar: {
      width: 120,
      height: 4,
      borderRadius: 2,
      overflow: "hidden",
    },
    percentageFill: {
      height: "100%",
      borderRadius: 2,
    },
    enhancedProgressBar: {
      width: "100%",
      height: 8,
      backgroundColor: "#E9ECEF",
      borderRadius: 4,
      overflow: "hidden",
      marginTop: 8,
    },
    activeProgressBar: {
      height: 10,
      backgroundColor: "rgba(52, 199, 89, 0.2)",
      ...Platform.select({
        ios: {
          shadowColor: "#34C759",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    enhancedProgressFill: {
      height: "100%",
      borderRadius: 4,
      ...Platform.select({
        ios: {
          shadowColor: "#34C759",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.4,
          shadowRadius: 2,
        },
        android: {
          elevation: 1,
        },
      }),
    },
    readyContainer: {
      alignItems: "center",
      marginTop: 12,
      gap: 4,
    },
    readyText: {
      fontSize: Platform.OS === "ios" ? 19 : 18,
      fontWeight: "600",
      textAlign: "center",
    },
    readySubtext: {
      fontSize: Platform.OS === "ios" ? 15 : 14,
      fontWeight: "500",
      textAlign: "center",
    },
    statusBadge: {
      backgroundColor: "#FF9500",
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      marginTop: 16,
    },
    activeBadge: {
      backgroundColor: "#34C759",
    },
    statusText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
      letterSpacing: 1,
    },
    activeStatusText: {
      color: "white",
    },
    motivationContainer: {
      marginTop: 32,
      paddingHorizontal: 32,
      alignItems: "center",
    },
    pausedText: {
      fontSize: 16,
      color: "#FF9500",
      textAlign: "center",
      fontWeight: "500",
      lineHeight: 24,
    },
  });

export default FocusTimer;
