import { usePomodoroLogic } from "@/hooks/use-pomodoro-logic";
import React from "react";
import SharedTimerScreen from "./shared-timer-screen";

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

export default function PomodoroModeScreen(props: PomodoroModeScreenProps) {
  const pomodoroData = usePomodoroLogic(props);

  return <SharedTimerScreen {...pomodoroData} modeType="pomodoro" />;
}
