import { Text } from "@/components/ui/text";
import { useFocus } from "@/contexts/focus-context";
import { usePallet } from "@/hooks/use-pallet";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface FocusSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  onStartAnother: () => void;
  sessionData?: {
    duration: number;
    completedTime: number;
    wasCompleted: boolean;
  };
}

const FocusSummaryModal: React.FC<FocusSummaryModalProps> = ({
  visible,
  onClose,
  onStartAnother,
  sessionData,
}) => {
  const { stats, resetSession } = useFocus();
  const pallet = usePallet();
  const confettiRef = useRef<ConfettiCannon>(null);

  // Animation values
  const modalScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const celebrationScale = useSharedValue(0);
  const statsOpacity = useSharedValue(0);

  // Trigger confetti and animations when modal becomes visible
  useEffect(() => {
    if (visible && sessionData?.wasCompleted) {
      // Start entrance animation
      modalScale.value = withSpring(1, { damping: 15, stiffness: 150 });
      contentOpacity.value = withTiming(1, { duration: 300 });

      // Delayed celebration animation
      setTimeout(() => {
        celebrationScale.value = withSequence(
          withSpring(1.2, { damping: 10 }),
          withSpring(1, { damping: 15 })
        );

        // Trigger confetti
        runOnJS(() => {
          confettiRef.current?.start();
        })();

        // Show stats with delay
        setTimeout(() => {
          statsOpacity.value = withTiming(1, { duration: 500 });
        }, 500);
      }, 300);
    } else if (visible) {
      // Just show modal without celebration for incomplete sessions
      modalScale.value = withSpring(1, { damping: 15, stiffness: 150 });
      contentOpacity.value = withTiming(1, { duration: 300 });
      statsOpacity.value = withTiming(1, { duration: 500 });
    }

    // Reset animations when modal is hidden
    if (!visible) {
      modalScale.value = 0;
      contentOpacity.value = 0;
      celebrationScale.value = 0;
      statsOpacity.value = 0;
    }
  }, [visible, sessionData?.wasCompleted]);

  // Animation styles
  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: contentOpacity.value,
  }));

  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
  }));

  const statsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
    transform: [
      {
        translateY: statsOpacity.value === 1 ? 0 : 20,
      },
    ],
  }));

  // Handle start another session
  const handleStartAnother = () => {
    resetSession();
    onStartAnother();
    onClose();
  };

  // Handle close
  const handleClose = () => {
    resetSession();
    onClose();
  };

  // Format time display
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate completion percentage
  const completionPercentage = sessionData
    ? Math.round((sessionData.completedTime / sessionData.duration) * 100)
    : 0;

  if (!sessionData) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Confetti */}
        {sessionData.wasCompleted && (
          <ConfettiCannon
            ref={confettiRef}
            count={200}
            origin={{ x: screenWidth / 2, y: screenHeight / 3 }}
            fadeOut
            fallSpeed={3000}
            colors={["#34C759", "#007AFF", "#FF9500", "#5856D6", "#FF3B30"]}
          />
        )}

        <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <Animated.View
              style={[styles.iconContainer, celebrationAnimatedStyle]}
            >
              {sessionData.wasCompleted ? (
                <Ionicons name="checkmark-circle" size={64} color="#34C759" />
              ) : (
                <Ionicons name="time" size={64} color="#FF9500" />
              )}
            </Animated.View>

            <Text style={styles.title}>
              {sessionData.wasCompleted
                ? "Focus Session Complete! 🎉"
                : "Session Ended"}
            </Text>

            <Text style={styles.subtitle}>
              {sessionData.wasCompleted
                ? "Great work! You stayed focused for the entire session."
                : "You made progress on your focus journey."}
            </Text>
          </View>

          {/* Session Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.mainStat}>
                <Text style={styles.mainStatNumber}>
                  {formatTime(sessionData.completedTime)}
                </Text>
                <Text style={styles.mainStatLabel}>
                  {sessionData.wasCompleted ? "Completed" : "Focus Time"}
                </Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{completionPercentage}%</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {formatTime(sessionData.duration)}
                  </Text>
                  <Text style={styles.statLabel}>Target</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Overall Stats */}
          <Animated.View style={[styles.overallStats, statsAnimatedStyle]}>
            <Text style={styles.overallStatsTitle}>Your Focus Journey</Text>

            <View style={styles.overallStatsGrid}>
              <View style={styles.overallStatItem}>
                <Text style={styles.overallStatNumber}>
                  {stats.totalSessions}
                </Text>
                <Text style={styles.overallStatLabel}>Total Sessions</Text>
              </View>

              <View style={styles.overallStatItem}>
                <Text style={styles.overallStatNumber}>
                  {Math.round((stats.totalFocusTime / 60) * 10) / 10}h
                </Text>
                <Text style={styles.overallStatLabel}>Focus Time</Text>
              </View>

              <View style={styles.overallStatItem}>
                <Text style={styles.overallStatNumber}>
                  {stats.currentStreak}
                </Text>
                <Text style={styles.overallStatLabel}>Current Streak</Text>
              </View>

              <View style={styles.overallStatItem}>
                <Text style={styles.overallStatNumber}>
                  {stats.sessionsToday}
                </Text>
                <Text style={styles.overallStatLabel}>Today</Text>
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.secondaryButton,
                { borderColor: pallet.shade2 },
              ]}
              onPress={handleClose}
            >
              <Ionicons name="home" size={20} color={pallet.shade1} />
              <Text
                style={[styles.secondaryButtonText, { color: pallet.shade1 }]}
              >
                Done
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.primaryButton,
                { backgroundColor: pallet.shade1 },
              ]}
              onPress={handleStartAnother}
            >
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.primaryButtonText}>Start Another</Text>
            </TouchableOpacity>
          </View>

          {/* Achievement Badge (if applicable) */}
          {sessionData.wasCompleted &&
            stats.currentStreak > 0 &&
            stats.currentStreak % 5 === 0 && (
              <View
                style={[
                  styles.achievementBadge,
                  { borderColor: pallet.shade2 },
                ]}
              >
                <Ionicons name="medal" size={24} color={pallet.shade2} />
                <Text
                  style={[styles.achievementText, { color: pallet.shade1 }]}
                >
                  🔥 {stats.currentStreak} Session Streak!
                </Text>
              </View>
            )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6D6D70",
    textAlign: "center",
    lineHeight: 22,
  },
  summaryContainer: {
    width: "100%",
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  mainStat: {
    alignItems: "center",
    marginBottom: 16,
  },
  mainStatNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#34C759",
  },
  mainStatLabel: {
    fontSize: 16,
    color: "#6D6D70",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  statLabel: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#C7C7CC",
    marginHorizontal: 16,
  },
  overallStats: {
    width: "100%",
    marginBottom: 24,
  },
  overallStatsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 16,
  },
  overallStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  overallStatItem: {
    width: "48%",
    backgroundColor: "rgba(23, 122, 213, 0.05)", // pallet.shade1 with low opacity
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  overallStatNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#177AD5", // pallet.shade1
  },
  overallStatLabel: {
    fontSize: 12,
    color: "#0eafff", // pallet.shade2
    marginTop: 4,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    // borderColor set dynamically
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    // color set dynamically
  },
  achievementBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(23, 122, 213, 0.05)", // pallet.shade1 with low opacity
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
    gap: 8,
    borderWidth: 2,
    // borderColor set dynamically
  },
  achievementText: {
    fontSize: 14,
    fontWeight: "600",
    // color set dynamically
  },
});

export default FocusSummaryModal;
