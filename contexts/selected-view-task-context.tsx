import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type BottomSheetContextValue = {
  viewTask: any;
  setViewTask: Dispatch<SetStateAction<any>>;
  TaskSelectedForDate: Date;
  setTaskSelectedForDate: Dispatch<SetStateAction<any>>;
  selectedWorkMode: "pomodoro" | "focus";
  setSelectedWorkMode: Dispatch<SetStateAction<any>>;
};

const ViewTaskContext = createContext<BottomSheetContextValue | undefined>(
  undefined
);

export const ViewTaskProvider = ({ children }: { children: ReactNode }) => {
  const [viewTask, setViewTask] = useState<any>(null);
  const [TaskSelectedForDate, setTaskSelectedForDate] = useState<any>(null);
  const [selectedWorkMode, setSelectedWorkMode] = useState<
    "pomodoro" | "focus"
  >("pomodoro");

  return (
    <ViewTaskContext.Provider
      value={{
        viewTask,
        setViewTask,
        TaskSelectedForDate,
        setTaskSelectedForDate,
        selectedWorkMode,
        setSelectedWorkMode,
      }}
    >
      {children}
    </ViewTaskContext.Provider>
  );
};

export const useGetViewTask = () => {
  const ctx = useContext(ViewTaskContext);
  if (!ctx)
    throw new Error("useBottomSheet must be used within BottomSheetProvider");
  return ctx;
};
