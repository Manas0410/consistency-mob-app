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

const BottomSheetContext = createContext<BottomSheetContextValue | undefined>(
  undefined
);

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  const open = useCallback(() => setIsVisible(true), []);
  const close = useCallback(() => setIsVisible(false), []);
  const toggle = useCallback(() => setIsVisible((s) => !s), []);

  return (
    <BottomSheetContext.Provider
      value={{ isVisible, open, close, toggle, setVisible: setIsVisible }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx)
    throw new Error("useBottomSheet must be used within BottomSheetProvider");
  return ctx;
};
