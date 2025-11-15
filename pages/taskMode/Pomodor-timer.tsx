// PomodoroModeScreen.tsx
import { ScrollView } from "@/components/ui/scroll-view";
import { useSelectMode } from "@/contexts/select-mode-context";
import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

/**
 * PomodoroModeScreenProps - same as your earlier props
 */
export type PomodoroModeScreenProps = {
  taskName?: string;
  totalMinutes?: number;
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
  taskName: propTaskName = "Focus Session",
  totalMinutes = 30,
  workMinutes = 25,
  shortBreakMinutes = 5,
  longBreakMinutes = 15,
  cyclesBeforeLongBreak = 4,
  autoStartNext = true,
}: PomodoroModeScreenProps) {
  useKeepAwake();
  const router = useRouter();
  const {
    hydrated,
    isModeTaskInProgress,
    selectedWorkMode,
    selectedModeTask,
    modeTaskStartedAt,
    stopMode,
    startMode,
    setSelectedWorkMode,
  } = useSelectMode();

  // If persisted session doesn't match this screen mode, redirect
  useEffect(() => {
    if (!hydrated) return;
    if (
      isModeTaskInProgress &&
      selectedModeTask?.mode &&
      selectedModeTask.mode !== "pomodoro"
    ) {
      // user somehow landed on pomodoro screen but another mode is running -> redirect
      router.replace(`/calendar/mode/${selectedModeTask.mode}`);
    }
  }, [hydrated, isModeTaskInProgress, selectedModeTask, router]);

  // Determine total planned minutes: prefer persisted selectedModeTask.durationMinutes if available
  const persistedMinutes = selectedModeTask?.durationMinutes ?? null;
  const effectiveTotalMinutes = persistedMinutes ?? totalMinutes;

  // timer state
  const totalPlannedSec = Math.max(1, Math.round(effectiveTotalMinutes * 60));
  const [phase, setPhase] = useState<Phase>("work");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);
  const [elapsedTotalSec, setElapsedTotalSec] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  // compute elapsed from persisted start time when hydrating
  useEffect(() => {
    if (!hydrated) return;

    // ensure context knows we're on pomodoro screen
    setSelectedWorkMode("pomodoro");

    if (isModeTaskInProgress) {
      // Resume logic: compute elapsed total sec from persisted startedAt
      const startedAt = modeTaskStartedAt ? new Date(modeTaskStartedAt) : null;
      if (startedAt) {
        const diffMs = Math.max(0, Date.now() - startedAt.getTime());
        const elapsed = Math.floor(diffMs / 1000);
        // clamp to total planned
        const clamped = Math.min(elapsed, totalPlannedSec);
        setElapsedTotalSec(clamped);

        // For interval secondsLeft: assume we were in 'work' interval when started.
        // If you need exact interval position (work/break cycles) you'd persist the phase too.
        // We'll attempt a simple heuristic: if elapsed >= workMinutes then move accordingly.
        const elapsedMinutes = Math.floor(clamped / 60);
        if (
          elapsedMinutes >= workMinutes &&
          elapsedMinutes < workMinutes + shortBreakMinutes
        ) {
          setPhase("shortBreak");
          setSecondsLeft((workMinutes + shortBreakMinutes) * 60 - clamped);
        } else {
          // default to work remainder
          setPhase("work");
          setSecondsLeft(Math.max(0, workMinutes * 60 - clamped));
        }

        // resume running state
        setIsRunning(true);
      } else {
        // no startedAt found — start fresh but keep isModeTaskInProgress true (edge case)
        setElapsedTotalSec(0);
        setSecondsLeft(workMinutes * 60);
        setIsRunning(true);
      }
    }
  }, [
    hydrated,
    isModeTaskInProgress,
    modeTaskStartedAt,
    totalPlannedSec,
    workMinutes,
    shortBreakMinutes,
    setSelectedWorkMode,
  ]);

  // timer ticking
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

  // Pause timer if app backgrounded
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        setIsRunning(false);
      }
    });
    return () => sub.remove();
  }, []);

  // When interval finishes advance
  useEffect(() => {
    if (phase === "done") return;

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

  // helpers
  const toggle = () => {
    // If toggling to start and there's no persisted "start", ensure context start is called
    if (!isRunning && !isModeTaskInProgress) {
      // start and persist via context
      startMode({
        task: {
          mode: "pomodoro",
          durationMinutes: effectiveTotalMinutes,
          taskName: propTaskName,
          startedAtClient: new Date().toISOString(),
        },
        custom: true,
        startedAt: new Date(),
      });
    }
    setIsRunning((v) => !v);
  };

  const resetAll = () => {
    setIsRunning(false);
    setPhase("work");
    setCompletedWorkSessions(0);
    setElapsedTotalSec(0);
    setSecondsLeft(workMinutes * 60);
    // NOTE: we do NOT stop persisted mode here automatically — keep persisted until user explicitly cancels
  };

  const skip = () => setSecondsLeft(0);

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
    const intervalTarget =
      phase === "work"
        ? workMinutes * 60
        : phase === "shortBreak"
        ? shortBreakMinutes * 60
        : phase === "longBreak"
        ? longBreakMinutes * 60
        : 1;
    const intervalProgress = Math.min(1, 1 - secondsLeft / intervalTarget);
    return CIRCUMFERENCE * (1 - intervalProgress);
  }, [phase, secondsLeft, workMinutes, shortBreakMinutes, longBreakMinutes]);

  // Cancel ongoing persisted mode
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
            stopMode();
            // navigate back to calendar or mode selector
            router.replace("/calendar");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const phaseLabel: Record<Phase, string> = {
    work: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
    done: "Completed",
  };

  const overallProgress = Math.min(1, elapsedTotalSec / totalPlannedSec);
  const intervalProgress = Math.min(
    1,
    1 -
      secondsLeft /
        (phase === "work"
          ? workMinutes * 60
          : phase === "shortBreak"
          ? shortBreakMinutes * 60
          : longBreakMinutes * 60)
  );

  const eta = useMemo(() => {
    const remaining = Math.max(0, totalPlannedSec - elapsedTotalSec);
    const end = new Date(Date.now() + remaining * 1000);
    return end.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [elapsedTotalSec, totalPlannedSec]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: LIGHT.bg }]}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {selectedModeTask?.taskName ?? propTaskName}
            </Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>
                {Math.round(effectiveTotalMinutes)}m planned
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

            <View style={styles.chipsRow}>
              <View
                style={[
                  styles.chip,
                  phase === "work" && {
                    backgroundColor: LIGHT.primarySoft,
                    borderColor: LIGHT.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    phase === "work" && { color: LIGHT.primary },
                  ]}
                >
                  {workMinutes}m focus
                </Text>
              </View>
              <View
                style={[
                  styles.chip,
                  phase === "shortBreak" && {
                    backgroundColor: LIGHT.primarySoft,
                    borderColor: LIGHT.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    phase === "shortBreak" && { color: LIGHT.primary },
                  ]}
                >
                  {shortBreakMinutes}m break
                </Text>
              </View>
              <View
                style={[
                  styles.chip,
                  phase === "longBreak" && {
                    backgroundColor: LIGHT.primarySoft,
                    borderColor: LIGHT.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    phase === "longBreak" && { color: LIGHT.primary },
                  ]}
                >
                  {longBreakMinutes}m long
                </Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  {completedWorkSessions} cycles
                </Text>
              </View>
            </View>

            <View style={styles.controls}>
              <Pressable
                onPress={toggle}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={styles.primaryBtnText}>
                  {isRunning ? "Pause" : "Start"}
                </Text>
              </Pressable>
              {phase !== "done" ? (
                <Pressable
                  onPress={skip}
                  style={({ pressed }) => [
                    styles.ghostBtn,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={styles.ghostBtnText}>Skip</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={resetAll}
                  style={({ pressed }) => [
                    styles.ghostBtn,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={styles.ghostBtnText}>Restart</Text>
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

          <View style={styles.progressCard}>
            <Text style={styles.subtle}>Overall progress</Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
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
  pillText: { color: LIGHT.primary, fontWeight: "600" },
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
  time: { fontSize: 42, fontWeight: "800", color: LIGHT.text },
  caption: { marginTop: 4, color: LIGHT.subtle },
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
  chipText: { color: LIGHT.subtle, fontWeight: "600", fontSize: 12 },
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
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  ghostBtn: {
    backgroundColor: LIGHT.card,
    borderWidth: 1,
    borderColor: LIGHT.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ghostBtnText: { color: LIGHT.text, fontWeight: "700" },
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
  subtle: { color: LIGHT.subtle },
  progressTrack: {
    height: 10,
    backgroundColor: LIGHT.ringTrack,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: 10, backgroundColor: LIGHT.primary },
  etaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eta: { color: LIGHT.text, fontWeight: "700" },
  footerRow: { alignItems: "center", marginTop: 4 },
  footerText: { fontSize: 12, color: LIGHT.subtle },
});
