// hooks/use-focus-logic.ts
import { useSelectMode } from "@/contexts/select-mode-context";
import {
  TimerActions,
  TimerChip,
  TimerState,
} from "@/pages/taskMode/shared-timer-screen";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

type Phase = "focus" | "done";

const LIGHT = {
  primary: "#2563EB",
  subtle: "#64748B",
};

export type UseFocusLogicProps = {
  taskName?: string;
  totalMinutes?: number;
};

export function useFocusLogic({
  taskName: propTaskName = "Focus Session",
  totalMinutes = 60,
}: UseFocusLogicProps = {}) {
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
      selectedModeTask.mode !== "focus"
    ) {
      router.push(`/calendar/mode/${selectedModeTask.mode}`);
    }
  }, [hydrated, isModeTaskInProgress, selectedModeTask, router]);

  const persistedMinutes = selectedModeTask?.durationMinutes ?? null;
  const effectiveTotalMinutes = persistedMinutes ?? totalMinutes;

  const totalPlannedSec = Math.max(1, Math.round(effectiveTotalMinutes * 60));
  const [phase, setPhase] = useState<Phase>("focus");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTotalSec, setElapsedTotalSec] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(totalPlannedSec);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  // compute elapsed from persisted start time when hydrating
  useEffect(() => {
    if (!hydrated) return;

    setSelectedWorkMode("focus");

    if (isModeTaskInProgress) {
      const startedAt = modeTaskStartedAt ? new Date(modeTaskStartedAt) : null;
      if (startedAt) {
        const diffMs = Math.max(0, Date.now() - startedAt.getTime());
        const elapsed = Math.floor(diffMs / 1000);
        const clamped = Math.min(elapsed, totalPlannedSec);
        setElapsedTotalSec(clamped);
        setSecondsLeft(Math.max(0, totalPlannedSec - clamped));
        setIsRunning(true);
      } else {
        setElapsedTotalSec(0);
        setSecondsLeft(totalPlannedSec);
        setIsRunning(true);
      }
    }
  }, [
    hydrated,
    isModeTaskInProgress,
    modeTaskStartedAt,
    totalPlannedSec,
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

  // When timer finishes
  useEffect(() => {
    if (phase === "done") return;

    if (elapsedTotalSec >= totalPlannedSec || secondsLeft === 0) {
      setPhase("done");
      setIsRunning(false);
      setSecondsLeft(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [secondsLeft, elapsedTotalSec, totalPlannedSec, phase]);

  const toggle = () => {
    if (!isRunning && !isModeTaskInProgress) {
      startMode({
        task: {
          mode: "focus",
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

  const reset = () => {
    setIsRunning(false);
    setPhase("focus");
    setElapsedTotalSec(0);
    setSecondsLeft(totalPlannedSec);
  };

  const skip = () => {
    setSecondsLeft(0);
    setElapsedTotalSec(totalPlannedSec);
  };

  const cancel = () => {
    stopMode();
  };

  const phaseLabel: Record<Phase, string> = {
    focus: "Focus Hour",
    done: "Completed",
  };

  const timerState: TimerState = {
    phase,
    isRunning,
    secondsLeft,
    elapsedTotalSec,
    totalPlannedSec,
    phaseLabel: phaseLabel[phase],
    phaseColor: LIGHT.primary,
    caption: phase === "focus" ? "Deep work in progress" : "Great work!",
  };

  const timerActions: TimerActions = {
    toggle,
    reset,
    skip,
    cancel,
  };

  const chips: TimerChip[] = [
    {
      label: `${Math.round(effectiveTotalMinutes)}m session`,
      isActive: phase === "focus",
    },
  ];

  return {
    taskName: selectedModeTask?.taskName ?? propTaskName,
    totalMinutes: effectiveTotalMinutes,
    timerState,
    timerActions,
    chips,
    footerText: "Focus hour provides uninterrupted deep work time.",
  };
}
