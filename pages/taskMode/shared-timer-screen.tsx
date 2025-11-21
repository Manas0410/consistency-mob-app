// shared-timer-screen.tsx
import { ScrollView } from "@/components/ui/scroll-view";
import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { useKeepAwake } from "expo-keep-awake";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const PADDING = 24;
const RADIUS = 120;
const STROKE = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export type TimerState = {
  phase: string;
  isRunning: boolean;
  secondsLeft: number;
  elapsedTotalSec: number;
  totalPlannedSec: number;
  phaseLabel: string;
  phaseColor: string;
  caption: string;
};

export type TimerActions = {
  toggle: () => void;
  reset: () => void;
  skip: () => void;
  cancel: () => void;
};

export type TimerChip = {
  label: string;
  isActive: boolean;
};

export type SharedTimerScreenProps = {
  taskName: string;
  totalMinutes: number;
  timerState: TimerState;
  timerActions: TimerActions;
  chips?: TimerChip[];
  footerText: string;
  modeType: "pomodoro" | "focus";
};

export default function SharedTimerScreen({
  taskName,
  totalMinutes,
  timerState,
  timerActions,
  chips = [],
  footerText,
  modeType,
}: SharedTimerScreenProps) {
  useKeepAwake();
  const router = useRouter();
  const pallet = usePallet();
  const colors = Colors.light;
  const backgroundColor = useColor({}, "background");
  const cardBackgroundColor = useColor({}, "card");
  const textColor = useColor({}, "text");
  const textMutedColor = useColor({}, "textMuted");
  const borderColor = useColor({}, "border");

  // Create dynamic color object using palette
  const LIGHT = {
    bg: backgroundColor,
    card: cardBackgroundColor,
    text: textColor,
    subtle: textMutedColor,
    primary: pallet.shade1,
    primarySoft: pallet.shade4,
    ringTrack: borderColor + "40",
    success: colors.green || "#16A34A",
    danger: colors.red || "#DC2626",
    border: borderColor,
  };

  const fmt = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const strokeDashoffset = useMemo(() => {
    const intervalProgress = Math.min(
      1,
      1 - timerState.secondsLeft / Math.max(1, timerState.totalPlannedSec)
    );
    return CIRCUMFERENCE * (1 - intervalProgress);
  }, [timerState.secondsLeft, timerState.totalPlannedSec]);

  const confirmCancel = () => {
    Alert.alert(
      "Cancel session",
      "Are you sure you want to cancel this ongoing session? This will stop the session and allow starting a new one.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, cancel",
          style: "destructive",
          onPress: () => {
            timerActions.cancel();
            router.replace("/calendar");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const overallProgress = Math.min(
    1,
    timerState.elapsedTotalSec / timerState.totalPlannedSec
  );

  const eta = useMemo(() => {
    const remaining = Math.max(
      0,
      timerState.totalPlannedSec - timerState.elapsedTotalSec
    );
    const end = new Date(Date.now() + remaining * 1000);
    return end.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [timerState.elapsedTotalSec, timerState.totalPlannedSec]);

  const isDone = timerState.phase === "done";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: LIGHT.bg }]}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.title, { color: LIGHT.text }]}
              numberOfLines={1}
            >
              {taskName}
            </Text>
            <View style={[styles.pill, { backgroundColor: LIGHT.primarySoft }]}>
              <Text style={[styles.pillText, { color: LIGHT.primary }]}>
                {Math.round(totalMinutes)}m planned
              </Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: LIGHT.card }]}>
            <Text style={[styles.phase, { color: LIGHT.subtle }]}>
              {timerState.phaseLabel}
            </Text>

            <View style={styles.ringWrap}>
              <Svg width={(RADIUS + STROKE) * 2} height={(RADIUS + STROKE) * 2}>
                <Circle
                  cx={RADIUS + STROKE}
                  cy={RADIUS + STROKE}
                  r={RADIUS}
                  stroke={LIGHT.ringTrack}
                  strokeWidth={STROKE}
                  fill="none"
                />
                <Circle
                  cx={RADIUS + STROKE}
                  cy={RADIUS + STROKE}
                  r={RADIUS}
                  stroke={timerState.phaseColor}
                  strokeWidth={STROKE}
                  strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  rotation={-90}
                  originX={RADIUS + STROKE}
                  originY={RADIUS + STROKE}
                />
              </Svg>
              <View style={styles.ringCenter}>
                <Text style={[styles.time, { color: LIGHT.text }]}>
                  {isDone ? "00:00" : fmt(timerState.secondsLeft)}
                </Text>
                <Text style={[styles.caption, { color: LIGHT.subtle }]}>
                  {timerState.caption}
                </Text>
              </View>
            </View>

            {chips.length > 0 && (
              <View style={styles.chipsRow}>
                {chips.map((chip, index) => (
                  <View
                    key={index}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: LIGHT.card,
                        borderColor: LIGHT.border,
                      },
                      chip.isActive && {
                        backgroundColor: LIGHT.primarySoft,
                        borderColor: LIGHT.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: LIGHT.subtle },
                        chip.isActive && { color: LIGHT.primary },
                      ]}
                    >
                      {chip.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.controls}>
              <Pressable
                onPress={timerActions.toggle}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  { backgroundColor: LIGHT.primary },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text
                  style={[styles.primaryBtnText, { color: pallet.ButtonText }]}
                >
                  {timerState.isRunning ? "Pause" : "Start"}
                </Text>
              </Pressable>
              {!isDone ? (
                <Pressable
                  onPress={timerActions.skip}
                  style={({ pressed }) => [
                    styles.ghostBtn,
                    { backgroundColor: LIGHT.card, borderColor: LIGHT.border },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={[styles.ghostBtnText, { color: LIGHT.text }]}>
                    Skip
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={timerActions.reset}
                  style={({ pressed }) => [
                    styles.ghostBtn,
                    { backgroundColor: LIGHT.card, borderColor: LIGHT.border },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={[styles.ghostBtnText, { color: LIGHT.text }]}>
                    Restart
                  </Text>
                </Pressable>
              )}
            </View>

            <View style={{ marginTop: 12 }}>
              <Pressable
                onPress={confirmCancel}
                style={({ pressed }) => [
                  { alignItems: "center", paddingVertical: 8 },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={{ color: LIGHT.danger, fontWeight: "600" }}>
                  Cancel session
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.progressCard, { backgroundColor: LIGHT.card }]}>
            <Text style={[styles.subtle, { color: LIGHT.subtle }]}>
              Overall progress
            </Text>
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: LIGHT.ringTrack },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: LIGHT.primary },
                  {
                    width: `${Math.max(
                      0,
                      Math.min(100, overallProgress * 100)
                    )}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.etaRow}>
              <Text style={[styles.subtle, { color: LIGHT.subtle }]}>ETA</Text>
              <Text style={[styles.eta, { color: LIGHT.text }]}>{eta}</Text>
            </View>
          </View>

          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: LIGHT.subtle }]}>
              {footerText}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: PADDING, gap: 16, marginBottom: 350 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    marginRight: 12,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: { fontWeight: "600" },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  phase: {
    alignSelf: "center",
    fontWeight: "600",
    marginBottom: 8,
  },
  ringWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  time: { fontSize: 42, fontWeight: "800" },
  caption: { marginTop: 4 },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: { fontWeight: "600", fontSize: 12 },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  primaryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryBtnText: { fontWeight: "700" },
  ghostBtn: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ghostBtnText: { fontWeight: "700" },
  progressCard: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  subtle: {},
  progressTrack: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: 10 },
  etaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eta: { fontWeight: "700" },
  footerRow: { alignItems: "center", marginTop: 4 },
  footerText: { fontSize: 12 },
});
