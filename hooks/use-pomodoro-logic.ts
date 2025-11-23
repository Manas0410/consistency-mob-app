// hooks/use-pomodoro-logic.ts
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

type Phase = "work" | "shortBreak" | "longBreak" | "done";

const LIGHT = {
  primary: "#2563EB",
  subtle: "#64748B",
};

export type UsePomodoroLogicProps = {
  taskName?: string;
  totalMinutes?: number;
  workMinutes?: number;
  shortBreakMinutes?: number;
  longBreakMinutes?: number;
  cyclesBeforeLongBreak?: number;
  autoStartNext?: boolean;
};

export function usePomodoroLogic({
  taskName: propTaskName = "Focus Session",
  totalMinutes = 30,
  workMinutes = 25,
  shortBreakMinutes = 5,
  longBreakMinutes = 15,
  cyclesBeforeLongBreak = 4,
  autoStartNext = true,
}: UsePomodoroLogicProps = {}) {
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
      router.push(`/calendar/mode/${selectedModeTask.mode}`);
    }
  }, [hydrated, isModeTaskInProgress, selectedModeTask, router]);

  const persistedMinutes = selectedModeTask?.durationMinutes ?? null;
  const effectiveTotalMinutes = persistedMinutes ?? totalMinutes;

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

    setSelectedWorkMode("pomodoro");

    if (isModeTaskInProgress) {
      const startedAt = modeTaskStartedAt ? new Date(modeTaskStartedAt) : null;
      if (startedAt) {
        const diffMs = Math.max(0, Date.now() - startedAt.getTime());
        const elapsed = Math.floor(diffMs / 1000);
        const clamped = Math.min(elapsed, totalPlannedSec);
        setElapsedTotalSec(clamped);

        const elapsedMinutes = Math.floor(clamped / 60);
        if (
          elapsedMinutes >= workMinutes &&
          elapsedMinutes < workMinutes + shortBreakMinutes
        ) {
          setPhase("shortBreak");
          setSecondsLeft((workMinutes + shortBreakMinutes) * 60 - clamped);
        } else {
          setPhase("work");
          setSecondsLeft(Math.max(0, workMinutes * 60 - clamped));
        }

        setIsRunning(true);
      } else {
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

  const toggle = () => {
    if (!isRunning && !isModeTaskInProgress) {
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

  const reset = () => {
    setIsRunning(false);
    setPhase("work");
    setCompletedWorkSessions(0);
    setElapsedTotalSec(0);
    setSecondsLeft(workMinutes * 60);
  };

  const skip = () => setSecondsLeft(0);

  const cancel = () => {
    stopMode();
  };

  const phaseLabel: Record<Phase, string> = {
    work: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
    done: "Completed",
  };

  // Calculate secondsLeft for current phase to compute progress correctly
  const currentPhaseTotal =
    phase === "work"
      ? workMinutes * 60
      : phase === "shortBreak"
      ? shortBreakMinutes * 60
      : phase === "longBreak"
      ? longBreakMinutes * 60
      : 1;

  const timerState: TimerState = {
    phase,
    isRunning,
    secondsLeft,
    elapsedTotalSec,
    totalPlannedSec: currentPhaseTotal,
    phaseLabel: phaseLabel[phase],
    phaseColor: phase === "work" ? LIGHT.primary : LIGHT.subtle,
    caption: phase === "work" ? "Stay in the zone" : "Recover & breathe",
  };

  const timerActions: TimerActions = {
    toggle,
    reset,
    skip,
    cancel,
  };

  const chips: TimerChip[] = [
    {
      label: `${workMinutes}m focus`,
      isActive: phase === "work",
    },
    {
      label: `${shortBreakMinutes}m break`,
      isActive: phase === "shortBreak",
    },
    {
      label: `${longBreakMinutes}m long`,
      isActive: phase === "longBreak",
    },
    {
      label: `${completedWorkSessions} cycles`,
      isActive: false,
    },
  ];

  return {
    taskName: selectedModeTask?.taskName ?? propTaskName,
    totalMinutes: effectiveTotalMinutes,
    timerState,
    timerActions,
    chips,
    footerText: "Pomodoro cycles will run until your planned time is complete.",
  };
}
