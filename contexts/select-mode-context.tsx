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

const SelectModeBottomSheetContext = createContext<
  BottomSheetContextValue | undefined
>(undefined);

export const SelectModeBottomSheetProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const open = useCallback(() => setIsVisible(true), []);
  const close = useCallback(() => setIsVisible(false), []);
  const toggle = useCallback(() => setIsVisible((s) => !s), []);

  return (
    <SelectModeBottomSheetContext.Provider
      value={{ isVisible, open, close, toggle, setVisible: setIsVisible }}
    >
      {children}
    </SelectModeBottomSheetContext.Provider>
  );
};

export const useSelectModeBottomSheet = () => {
  const ctx = useContext(SelectModeBottomSheetContext);
  if (!ctx)
    throw new Error("useBottomSheet must be used within BottomSheetProvider");
  return ctx;
};
