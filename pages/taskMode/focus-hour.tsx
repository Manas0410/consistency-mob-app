// FocusHourScreen.tsx
import { useFocusLogic } from "@/hooks/use-focus-logic";
import React from "react";
import SharedTimerScreen from "./shared-timer-screen";

export type FocusHourScreenProps = {
  taskName?: string;
  totalMinutes?: number;
};

const FocusHourScreen: React.FC<FocusHourScreenProps> = (props) => {
  const focusData = useFocusLogic(props);

  return <SharedTimerScreen {...focusData} modeType="focus" />;
};

export default FocusHourScreen;
