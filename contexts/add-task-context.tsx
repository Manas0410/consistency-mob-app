import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type BottomSheetContextValue = {
  isVisible: boolean;
  open: () => void;
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

  const open = useCallback(() => setIsVisible(true), []);
  const close = useCallback(() => setIsVisible(false), []);
  const toggle = useCallback(() => setIsVisible((s) => !s), []);

  return (
    <AddTaskContext.Provider
      value={{ isVisible, open, close, toggle, setVisible: setIsVisible }}
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
