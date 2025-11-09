import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type BottomSheetContextValue = {
  currentDayTask: any[];
  setCurrentDayTask: Dispatch<SetStateAction<any[]>>;
};

const AddTaskContext = createContext<BottomSheetContextValue | undefined>(
  undefined
);

export const CurrentDayTaskProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentDayTask, setCurrentDayTask] = useState<any[]>([]);

  return (
    <AddTaskContext.Provider value={{ currentDayTask, setCurrentDayTask }}>
      {children}
    </AddTaskContext.Provider>
  );
};

export const useGetCurrentDayTask = () => {
  const ctx = useContext(AddTaskContext);
  if (!ctx)
    throw new Error("useBottomSheet must be used within BottomSheetProvider");
  return ctx;
};
