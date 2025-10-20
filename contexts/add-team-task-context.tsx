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

const AddTeamTaskContext = createContext<BottomSheetContextValue | undefined>(
  undefined
);

export const AddTeamTaskBottomSheetProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const open = useCallback(() => setIsVisible(true), []);
  const close = useCallback(() => setIsVisible(false), []);
  const toggle = useCallback(() => setIsVisible((s) => !s), []);

  return (
    <AddTeamTaskContext.Provider
      value={{ isVisible, open, close, toggle, setVisible: setIsVisible }}
    >
      {children}
    </AddTeamTaskContext.Provider>
  );
};

export const useAddTeamTaskSheet = () => {
  const ctx = useContext(AddTeamTaskContext);
  if (!ctx)
    throw new Error("useBottomSheet must be used within BottomSheetProvider");
  return ctx;
};
