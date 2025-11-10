import { ScrollView } from "@/components/ui/scroll-view";
import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AppState, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

/**
 * A clean, light-mode Pomodoro screen for Expo/React Native.
 *
 * Props
 * - taskName: visible on top
 * - totalMinutes: planned total time to spend in Pomodoro mode (e.g. 10, 30, 60, 120, 480)
 * - workMinutes: length of each focus session (default 25)
 * - shortBreakMinutes: length of short break (default 5)
 * - longBreakMinutes: length of long break after `cyclesBeforeLongBreak` sessions (default 15)
 * - cyclesBeforeLongBreak: number of focus sessions before a long break (default 4)
 * - autoStartNext: automatically start next interval (default true)
 */
export type PomodoroModeScreenProps = {
  taskName: string;
  totalMinutes: number;
  workMinutes?: number;
  shortBreakMinutes?: number;
  longBreakMinutes?: number;
  cyclesBeforeLongBreak?: number;
  autoStartNext?: boolean;
};

const LIGHT = {
  bg: "#F7F8FA",
  card: "#FFFFFF",
  text: "#0F172A",
  subtle: "#64748B",
  primary: "#2563EB",
  primarySoft: "#E8F0FE",
  ringTrack: "#EEF2F7",
  success: "#16A34A",
  danger: "#DC2626",
  border: "#E5E7EB",
};

type Phase = "work" | "shortBreak" | "longBreak" | "done";

const PADDING = 24;
const RADIUS = 120;
const STROKE = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PomodoroModeScreen({
  taskName,
  totalMinutes,
  workMinutes = 25,
  shortBreakMinutes = 5,
  longBreakMinutes = 15,
  cyclesBeforeLongBreak = 4,
  autoStartNext = true,
}: PomodoroModeScreenProps) {
  useKeepAwake();

  const totalPlannedSec = Math.max(1, Math.round(totalMinutes * 60));

  const [phase, setPhase] = useState<Phase>("work");
  const [isRunning, setIsRunning] = useState(false);
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);
  const [elapsedTotalSec, setElapsedTotalSec] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const currentTargetSeconds = useMemo(() => {
    if (phase === "work") return workMinutes * 60;
    if (phase === "shortBreak") return shortBreakMinutes * 60;
    if (phase === "longBreak") return longBreakMinutes * 60;
    return 1; // done state
  }, [phase, workMinutes, shortBreakMinutes, longBreakMinutes]);

  const overallProgress = Math.min(1, elapsedTotalSec / totalPlannedSec);
  const intervalProgress = Math.min(1, 1 - secondsLeft / currentTargetSeconds);

  // Tick logic
  useEffect(() => {
    if (!isRunning || phase === "done") return;

    intervalRef.current && clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
      setElapsedTotalSec((t) => Math.min(totalPlannedSec, t + 1));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, phase, totalPlannedSec]);

  // Handle app backgrounding (pause on background)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        setIsRunning(false);
      }
    });
    return () => sub.remove();
  }, []);

  // When interval reaches 0 or total time consumed -> advance
  useEffect(() => {
    if (phase === "done") return;

    // If total time is exhausted
    if (elapsedTotalSec >= totalPlannedSec) {
      setPhase("done");
      setIsRunning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    if (secondsLeft === 0) {
      if (phase === "work") {
        const nextWorkCount = completedWorkSessions + 1;
        setCompletedWorkSessions(nextWorkCount);
        const isLong = nextWorkCount % cyclesBeforeLongBreak === 0;
        setPhase(isLong ? "longBreak" : "shortBreak");
        setSecondsLeft((isLong ? longBreakMinutes : shortBreakMinutes) * 60);
      } else {
        // Break finished -> back to work
        setPhase("work");
        setSecondsLeft(workMinutes * 60);
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (autoStartNext) setIsRunning(true);
    }
  }, [
    secondsLeft,
    elapsedTotalSec,
    totalPlannedSec,
    phase,
    completedWorkSessions,
    cyclesBeforeLongBreak,
    workMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    autoStartNext,
  ]);

  // Reset when phase changes (if someone changed lengths through props at runtime)
  useEffect(() => {
    if (phase === "work") setSecondsLeft(workMinutes * 60);
  }, [workMinutes]);

  const toggle = () => setIsRunning((v) => !v);

  const resetAll = () => {
    setIsRunning(false);
    setPhase("work");
    setCompletedWorkSessions(0);
    setElapsedTotalSec(0);
    setSecondsLeft(workMinutes * 60);
  };

  const skip = () => {
    // Skip current interval immediately
    setSecondsLeft(0);
  };

  const eta = useMemo(() => {
    const remaining = Math.max(0, totalPlannedSec - elapsedTotalSec);
    const end = new Date(Date.now() + remaining * 1000);
    return end.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [elapsedTotalSec, totalPlannedSec]);

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
    return CIRCUMFERENCE * (1 - intervalProgress);
  }, [intervalProgress]);

  const phaseLabel: Record<Phase, string> = {
    work: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
    done: "Completed",
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: LIGHT.bg }]}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {taskName}
            </Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>
                {Math.round(totalMinutes)}m planned
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.phase}>{phaseLabel[phase]}</Text>

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
                  stroke={phase === "work" ? LIGHT.primary : LIGHT.subtle}
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
                <Text style={styles.time}>
                  {phase === "done" ? "00:00" : fmt(secondsLeft)}
                </Text>
                <Text style={styles.caption}>
                  {phase === "work" ? "Stay in the zone" : "Recover & breathe"}
                </Text>
              </View>
            </View>

            {/* Chips */}
            <View style={styles.chipsRow}>
              <Chip label={`${workMinutes}m focus`} active={phase === "work"} />
              <Chip
                label={`${shortBreakMinutes}m break`}
                active={phase === "shortBreak"}
              />
              <Chip
                label={`${longBreakMinutes}m long`}
                active={phase === "longBreak"}
              />
              <Chip label={`${completedWorkSessions} cycles`} />
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <PrimaryButton
                label={isRunning ? "Pause" : "Start"}
                onPress={toggle}
              />
              {phase !== "done" ? (
                <GhostButton label="Skip" onPress={skip} />
              ) : (
                <GhostButton label="Restart" onPress={resetAll} />
              )}
            </View>
          </View>

          {/* Overall progress */}
          <View style={styles.progressCard}>
            <Text style={styles.subtle}>Overall progress</Text>
            <ProgressBar progress={overallProgress} />
            <View style={styles.etaRow}>
              <Text style={styles.subtle}>ETA</Text>
              <Text style={styles.eta}>{eta}</Text>
            </View>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              Pomodoro cycles will run until your planned time is complete.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------- UI bits ----------------

function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]}
    >
      <Text style={styles.primaryBtnText}>{label}</Text>
    </Pressable>
  );
}

function GhostButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.7 }]}
    >
      <Text style={styles.ghostBtnText}>{label}</Text>
    </Pressable>
  );
}

function Chip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <View
      style={[
        styles.chip,
        active && {
          backgroundColor: LIGHT.primarySoft,
          borderColor: LIGHT.primary,
        },
      ]}
    >
      <Text style={[styles.chipText, active && { color: LIGHT.primary }]}>
        {label}
      </Text>
    </View>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          { width: `${Math.max(0, Math.min(100, progress * 100))}%` },
        ]}
      />
    </View>
  );
}

// ---------------- Styles ----------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: PADDING,
    gap: 16,
    marginBottom: 350,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: LIGHT.text,
    flex: 1,
    marginRight: 12,
  },
  pill: {
    backgroundColor: LIGHT.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    color: LIGHT.primary,
    fontWeight: "600",
  },
  card: {
    backgroundColor: LIGHT.card,
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
    color: LIGHT.subtle,
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
  time: {
    fontSize: 42,
    fontWeight: "800",
    color: LIGHT.text,
  },
  caption: {
    marginTop: 4,
    color: LIGHT.subtle,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: LIGHT.border,
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: {
    color: LIGHT.subtle,
    fontWeight: "600",
    fontSize: 12,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  primaryBtn: {
    backgroundColor: LIGHT.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  ghostBtn: {
    backgroundColor: LIGHT.card,
    borderWidth: 1,
    borderColor: LIGHT.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ghostBtnText: {
    color: LIGHT.text,
    fontWeight: "700",
  },
  progressCard: {
    backgroundColor: LIGHT.card,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  subtle: {
    color: LIGHT.subtle,
  },
  progressTrack: {
    height: 10,
    backgroundColor: LIGHT.ringTrack,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    backgroundColor: LIGHT.primary,
  },
  etaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eta: {
    color: LIGHT.text,
    fontWeight: "700",
  },
  footerRow: {
    alignItems: "center",
    marginTop: 4,
  },
  footerText: {
    fontSize: 12,
    color: LIGHT.subtle,
  },
});
