import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type InitialTaskData = {
  duration?: { hours: number; minutes: number };
  taskName?: string;
  taskDescription?: string;
  TaskStartDateTime?: Date;
};

type BottomSheetContextValue = {
  isVisible: boolean;
  initialData: InitialTaskData | null;
  open: (data?: InitialTaskData) => void;
  close: () => void;
  toggle: () => void;
  setVisible: (v: boolean) => void;
};

const AddTaskContext = createContext<BottomSheetContextValue | undefined>(
  undefined
);

export const AddTaskBottomSheetProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [initialData, setInitialData] = useState<InitialTaskData | null>(null);

  const open = useCallback((data?: InitialTaskData) => {
    setInitialData(data || null);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setInitialData(null);
  }, []);

  const toggle = useCallback(() => setIsVisible((s) => !s), []);

  return (
    <AddTaskContext.Provider
      value={{
        isVisible,
        initialData,
        open,
        close,
        toggle,
        setVisible: setIsVisible,
      }}
    >
      {children}
    </AddTaskContext.Provider>
  );
};

export const useAddTaskSheet = () => {
  const ctx = useContext(AddTaskContext);
  if (!ctx)
    throw new Error("useBottomSheet must be used within BottomSheetProvider");
  return ctx;
};
