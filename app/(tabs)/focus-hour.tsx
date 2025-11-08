import FocusControls from "@/components/focus/FocusControls";
import FocusOverlay from "@/components/focus/FocusOverlay";
import FocusSummaryModal from "@/components/focus/FocusSummaryModal";
import FocusTimer from "@/components/focus/FocusTimer";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useFocus } from "@/contexts/focus-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePallet } from "@/hooks/use-pallet";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FocusHourScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const pallet = usePallet();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const styles = createStyles(colors, pallet);
  const {
    currentSession,
    isActive,
    isPaused,
    remainingTime,
    stats,
    enableSound,
    enableHaptics,
    setEnableSound,
    setEnableHaptics,
    showFocusOverlay,
    setShowFocusOverlay,
    currentQuote,
    progressMessage,
    endSession,
  } = useFocus();

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [completedSessionData, setCompletedSessionData] = useState<
    | {
        duration: number;
        completedTime: number;
        wasCompleted: boolean;
      }
    | undefined
  >(undefined);

  // Animation values
  const backgroundOpacity = useSharedValue(1);
  const headerOpacity = useSharedValue(1);

  // Monitor session completion
  useEffect(() => {
    if (currentSession?.completed && remainingTime === 0) {
      // Session completed successfully
      setCompletedSessionData({
        duration: currentSession.duration,
        completedTime: currentSession.duration,
        wasCompleted: true,
      });
      setShowSummaryModal(true);
    }
  }, [currentSession, remainingTime]);

  // Handle session end from controls
  const handleSessionComplete = () => {
    if (currentSession) {
      const completedTime = Math.floor(
        (currentSession.duration * 60 - remainingTime) / 60
      );
      setCompletedSessionData({
        duration: currentSession.duration,
        completedTime: completedTime,
        wasCompleted: false,
      });
      setShowSummaryModal(true);
    }
  };

  // Handle start another session
  const handleStartAnother = () => {
    setShowSummaryModal(false);
    setCompletedSessionData(undefined);
  };

  // Handle close summary modal
  const handleCloseSummary = () => {
    setShowSummaryModal(false);
    setCompletedSessionData(undefined);
  };

  // Animate background based on focus state
  useEffect(() => {
    if (isActive) {
      // Focus mode - keep consistent visual state whether paused or not
      backgroundOpacity.value = withTiming(0.3, { duration: 1000 });
      headerOpacity.value = withTiming(0.7, { duration: 1000 });
    } else {
      // Normal mode
      backgroundOpacity.value = withTiming(1, { duration: 1000 });
      headerOpacity.value = withTiming(1, { duration: 1000 });
    }
  }, [isActive]);

  // Animation styles
  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  // Determine status bar style based on focus state - keep consistent when paused
  const statusBarStyle = isActive ? "light-content" : "dark-content";

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor="transparent"
        translucent
      />

      {isActive ? (
        <LinearGradient
          colors={[pallet.shade1, pallet.shade2, pallet.shade3]}
          style={styles.activeGradientContainer}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.activeScrollContent,
              { paddingTop: insets.top, paddingBottom: insets.bottom + 40 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.activeScreenLayout}>
              {/* Active Timer Display */}
              <View style={styles.activeTimerContainer}>
                <FocusTimer />
              </View>

              {/* Motivational Quote */}
              <View style={styles.motivationalSection}>
                <Text style={styles.motivationalQuote}>
                  "Focus is your superpower."
                </Text>
              </View>

              {/* Active Controls */}
              <View style={styles.activeControlsBottom}>
                <FocusControls onSessionComplete={handleSessionComplete} />
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      ) : (
        <View style={styles.gradientContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: insets.top + 40,
                paddingBottom: insets.bottom + 40,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              {/* Gradient Icon */}
              <View style={styles.iconContainer}>
                <View style={styles.gradientIcon}>
                  <Ionicons name="time-outline" size={32} color="white" />
                </View>
              </View>

              {/* Title & Subtitle */}
              <Text style={styles.mainTitle}>Focus Hour</Text>
              <Text style={styles.mainSubtitle}>
                Enter your deep work mode — no{"\n"}distractions, just focus.
              </Text>
            </View>

            <View style={styles.setupSection}>
              <FocusControls onSessionComplete={handleSessionComplete} />
            </View>

            {/* Stats Section */}
            <View style={styles.bottomStatsSection}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.sessionsToday}</Text>
                  <Text style={styles.statName}>Today's Focus</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.currentStreak}</Text>
                  <Text style={styles.statName}>Day Streak</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Summary Modal */}
      <FocusSummaryModal
        visible={showSummaryModal}
        onClose={handleCloseSummary}
        onStartAnother={handleStartAnother}
        sessionData={completedSessionData}
      />

      {/* Focus Overlay for Distraction Blocking */}
      <FocusOverlay
        visible={showFocusOverlay}
        onRequestReturn={() => setShowFocusOverlay(false)}
        onEndSession={endSession}
      />
    </View>
  );
};

const createStyles = (colors: any, pallet: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gradientContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    activeGradientContainer: {
      flex: 1,
    },
    activeScrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100%",
    },
    activeScreenLayout: {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 20,
    },
    activeTimerContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 60,
      marginBottom: 40,
    },
    motivationalSection: {
      alignItems: "center",
      marginBottom: 60,
    },
    motivationalQuote: {
      fontSize: Platform.OS === "ios" ? 18 : 17,
      fontWeight: "400",
      color: "rgba(255, 255, 255, 0.7)",
      textAlign: "center",
      fontStyle: "italic",
      letterSpacing: 0.3,
    },
    activeControlsBottom: {
      width: "100%",
      marginBottom: 20,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    headerSection: {
      alignItems: "center",
      paddingHorizontal: 24,
      marginBottom: 60,
    },
    iconContainer: {
      marginBottom: 24,
    },
    gradientIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: pallet.shade1,
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({
        ios: {
          shadowColor: pallet.shade1,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    mainTitle: {
      fontSize: Platform.OS === "ios" ? 36 : 32,
      fontWeight: Platform.OS === "ios" ? "700" : "bold",
      color: pallet.shade1,
      marginBottom: 12,
      textAlign: "center",
      letterSpacing: -0.5,
    },
    mainSubtitle: {
      fontSize: Platform.OS === "ios" ? 17 : 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      fontWeight: "400",
    },
    setupSection: {
      paddingHorizontal: 24,
      marginBottom: 60,
    },
    activeTimerSection: {
      paddingHorizontal: 24,
      marginBottom: 40,
    },
    activeControlsSection: {
      paddingHorizontal: 24,
    },
    bottomStatsSection: {
      paddingHorizontal: 48,
      marginTop: 40,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statItem: {
      alignItems: "center",
      flex: 1,
      backgroundColor: "#FFFFFF",
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderRadius: 16,
      marginHorizontal: 8,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    statValue: {
      fontSize: Platform.OS === "ios" ? 32 : 28,
      fontWeight: Platform.OS === "ios" ? "700" : "bold",
      color: pallet.shade1,
      marginBottom: 4,
    },
    statName: {
      fontSize: Platform.OS === "ios" ? 15 : 14,
      color: colors.textSecondary,
      fontWeight: "500",
      textAlign: "center",
    },
    statsSection: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#1C1C1E",
      marginBottom: 16,
      textAlign: "center",
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: "#F2F2F7",
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#007AFF",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
    },
    timerSection: {
      alignItems: "center",
      marginBottom: 32,
    },
    controlsSection: {
      marginBottom: 32,
    },
    settingsSection: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    settingsGrid: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 12,
    },
    settingCard: {
      flex: 1,
      backgroundColor: "#F2F2F7",
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: "#1C1C1E",
      marginBottom: 4,
    },
    settingStatus: {
      fontSize: 14,
      color: "#007AFF",
      fontWeight: "500",
    },
    settingsNote: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
    },
    tipsSection: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    tipsList: {
      gap: 16,
    },
    tipItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: "#F2F2F7",
      borderRadius: 12,
      padding: 16,
      gap: 12,
    },
    tipIcon: {
      fontSize: 20,
      marginTop: 2,
    },
    tipText: {
      flex: 1,
      fontSize: 14,
      color: "#1C1C1E",
      lineHeight: 20,
    },
    focusModeOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      backgroundColor: "rgba(28, 28, 30, 0.97)",
      paddingVertical: 20,
      paddingHorizontal: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    focusModeContent: {
      alignItems: "center",
      position: "relative",
    },
    focusModePulse: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: "#34C759",
      marginBottom: 12,
      shadowColor: "#34C759",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 4,
    },
    focusModeText: {
      color: "white",
      fontSize: Platform.OS === "ios" ? 17 : 16,
      fontWeight: "700",
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    focusModeSubtext: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: Platform.OS === "ios" ? 15 : 14,
      textAlign: "center",
      letterSpacing: 0.2,
    },
  });

export default FocusHourScreen;
