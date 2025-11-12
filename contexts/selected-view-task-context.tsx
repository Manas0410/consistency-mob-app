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
};

const ViewTaskContext = createContext<BottomSheetContextValue | undefined>(
  undefined
);

export const ViewTaskProvider = ({ children }: { children: ReactNode }) => {
  const [viewTask, setViewTask] = useState<any>(null);

  return (
    <ViewTaskContext.Provider value={{ viewTask, setViewTask }}>
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
