import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useFocus } from "@/contexts/focus-context";
import { usePallet } from "@/hooks/use-pallet";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface FocusControlsProps {
  onSessionComplete?: () => void;
}

const FocusControls: React.FC<FocusControlsProps> = ({ onSessionComplete }) => {
  const pallet = usePallet();
  const colors = Colors.light; // Always use light theme
  const styles = createStyles(colors, pallet);
  const {
    currentSession,
    isActive,
    isPaused,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    resetSession,
  } = useFocus();

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("25");
  const [selectedDuration, setSelectedDuration] = useState(25);

  // Animation values
  const buttonScale = useSharedValue(1);
  const startButtonOpacity = useSharedValue(currentSession ? 0 : 1);

  // Simple predefined durations
  const presetDurations = [
    { label: "25 min", value: 25, icon: "⚡", subtitle: "Pomodoro" },
    { label: "50 min", value: 50, icon: "🔥", subtitle: "Deep Work" },
    { label: "90 min", value: 90, icon: "💪", subtitle: "Ultra Focus" },
  ];

  // Handle session start
  const handleStartSession = (duration: number) => {
    startSession(duration);
    startButtonOpacity.value = withTiming(0, { duration: 300 });
  };

  // Handle pause/resume
  const handlePauseResume = () => {
    if (isPaused) {
      resumeSession();
    } else {
      pauseSession();
    }

    // Button feedback animation
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
  };

  // Handle end session
  const handleEndSession = () => {
    Alert.alert(
      "End Session",
      "Are you sure you want to end your focus session? Your progress will be saved.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "End Session",
          style: "destructive",
          onPress: () => {
            endSession();
            startButtonOpacity.value = withTiming(1, { duration: 300 });
            onSessionComplete?.();
          },
        },
      ]
    );
  };

  // Handle custom duration
  const handleCustomDuration = () => {
    const minutes = parseInt(customMinutes);
    if (isNaN(minutes) || minutes < 1 || minutes > 180) {
      Alert.alert(
        "Invalid Duration",
        "Please enter a duration between 1 and 180 minutes."
      );
      return;
    }

    handleStartSession(minutes);
    setShowCustomModal(false);
    setCustomMinutes("25");
  };

  // Animation styles
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const startButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: startButtonOpacity.value,
    transform: [
      {
        scale: startButtonOpacity.value === 0 ? 0 : 1,
      },
    ],
  }));

  const sessionControlsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: startButtonOpacity.value === 0 ? 1 : 0,
    transform: [
      {
        scale: startButtonOpacity.value === 0 ? 1 : 0,
      },
    ],
  }));

  // Modern preset duration buttons matching the design
  const renderPresetButtons = () => (
    <Animated.View style={[styles.presetContainer, startButtonAnimatedStyle]}>
      {/* Duration Preset Buttons */}
      <View style={styles.presetsRow}>
        {presetDurations.map((preset) => (
          <TouchableOpacity
            key={preset.value}
            style={[
              styles.presetButton,
              selectedDuration === preset.value && styles.selectedPresetButton,
            ]}
            onPress={() => setSelectedDuration(preset.value)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.presetLabel,
                selectedDuration === preset.value && styles.selectedPresetLabel,
              ]}
            >
              {preset.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Button */}
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => setShowCustomModal(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="sparkles" size={18} color={colors.textSecondary} />
        <Text style={styles.customButtonText}>Custom</Text>
      </TouchableOpacity>

      {/* Start Session Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => handleStartSession(selectedDuration)}
        activeOpacity={0.8}
      >
        <Text style={styles.startButtonText}>Start Session</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // Clean circular controls for active state
  const renderSessionControls = () => (
    <Animated.View
      style={[styles.sessionControls, sessionControlsAnimatedStyle]}
    >
      {isActive && (
        <View style={styles.activeControlsRow}>
          {/* Pause/Resume Button */}
          <AnimatedTouchableOpacity
            style={[
              styles.circularButton,
              styles.pauseCircleButton,
              buttonAnimatedStyle,
            ]}
            onPress={handlePauseResume}
          >
            <Ionicons
              name={isPaused ? "play" : "pause"}
              size={22}
              color={colors.text}
            />
          </AnimatedTouchableOpacity>

          {/* End Session Button */}
          <TouchableOpacity
            style={[styles.circularButton, styles.endCircleButton]}
            onPress={handleEndSession}
          >
            <Ionicons name="close" size={22} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );

  // Custom duration modal
  const renderCustomModal = () => (
    <Modal
      visible={showCustomModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowCustomModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowCustomModal(false)}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Set Custom Duration</Text>
          <Text style={styles.modalSubtitle}>Enter minutes (1-180)</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.customTextInput}
              value={customMinutes}
              onChangeText={setCustomMinutes}
              keyboardType="numeric"
              placeholder="e.g., 45"
              placeholderTextColor={colors.icon}
              maxLength={3}
              autoFocus
              selectTextOnFocus
            />
            <Text style={styles.inputSuffix}>minutes</Text>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowCustomModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleCustomDuration}
            >
              <Text style={styles.confirmButtonText}>Start Focus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {!currentSession && renderPresetButtons()}
      {currentSession && renderSessionControls()}
      {renderCustomModal()}
    </View>
  );
};

const createStyles = (colors: any, pallet: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: Platform.OS === "ios" ? 24 : 22,
      fontWeight: Platform.OS === "ios" ? "700" : "bold",
      textAlign: "center",
      marginBottom: 8,
      letterSpacing: -0.3,
    },
    sectionSubtitle: {
      fontSize: Platform.OS === "ios" ? 16 : 15,
      fontWeight: "500",
      textAlign: "center",
      opacity: 0.8,
    },
    presetContainer: {
      alignItems: "center",
      width: "100%",
    },
    presetsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 24,
      gap: 12,
    },
    presetButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: colors.textSecondary + "40",
      minHeight: 60,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
        android: {
          elevation: 1,
        },
      }),
    },
    presetLabel: {
      fontSize: Platform.OS === "ios" ? 17 : 16,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
    },
    selectedPresetButton: {
      backgroundColor: pallet.shade1,
      borderColor: pallet.shade1,
    },
    selectedPresetLabel: {
      color: pallet.ButtonText,
    },
    customButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
      borderRadius: 20,
      paddingVertical: 16,
      paddingHorizontal: 24,
      gap: 8,
      borderWidth: 1.5,
      borderColor: colors.textSecondary + "40",
      marginBottom: 32,
      width: "100%",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
        android: {
          elevation: 1,
        },
      }),
    },
    customButtonText: {
      fontSize: Platform.OS === "ios" ? 17 : 16,
      fontWeight: "600",
      color: colors.text,
    },
    startButton: {
      backgroundColor: pallet.shade1,
      borderRadius: 25,
      paddingVertical: 18,
      paddingHorizontal: 32,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      ...Platform.select({
        ios: {
          shadowColor: pallet.shade1,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    startButtonText: {
      fontSize: Platform.OS === "ios" ? 19 : 18,
      fontWeight: "600",
      color: pallet.ButtonText,
      letterSpacing: 0.3,
    },
    sessionControls: {
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    activeControlsRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 80,
    },
    circularButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({
        ios: {
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    pauseCircleButton: {
      backgroundColor: colors.background,
      shadowColor: "rgba(0,0,0,0.2)",
    },
    endCircleButton: {
      backgroundColor: colors.red || "#FF6B47",
      shadowColor: colors.red || "#FF6B47",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 24,
      width: "80%",
      maxWidth: 320,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
      color: colors.text,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: colors.textSecondary + "20",
    },
    confirmButton: {
      backgroundColor: pallet.shade1,
    },
    cancelButtonText: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: "600",
    },
    confirmButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    modalCloseButton: {
      position: "absolute",
      top: 16,
      right: 16,
      padding: 8,
      zIndex: 1,
    },
    modalSubtitle: {
      fontSize: Platform.OS === "ios" ? 15 : 14,
      color: colors.textSecondary,
      marginBottom: 24,
      textAlign: "center",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.textSecondary + "20",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 32,
      width: "100%",
      minHeight: 50,
    },
    customTextInput: {
      flex: 1,
      fontSize: Platform.OS === "ios" ? 18 : 17,
      color: colors.text,
      textAlign: "center",
      fontWeight: "600",
    },
    inputSuffix: {
      fontSize: Platform.OS === "ios" ? 16 : 15,
      color: colors.textSecondary,
      marginLeft: 8,
      fontWeight: "500",
    },
    modalButtons: {
      flexDirection: "row",
      width: "100%",
      gap: 12,
    },
  });

export default FocusControls;
