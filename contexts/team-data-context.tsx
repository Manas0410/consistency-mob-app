import React, { createContext, ReactNode, useContext, useState } from "react";

const CurrentTeamDataContext = createContext<any>(undefined);

export const CurrentTeamDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentTeamData, setCurrentTeamData] = useState<any>({});

  return (
    <CurrentTeamDataContext.Provider
      value={{ currentTeamData, setCurrentTeamData }}
    >
      {children}
    </CurrentTeamDataContext.Provider>
  );
};

export const useCurrentTeamData = () => {
  const ctx = useContext(CurrentTeamDataContext);
  if (!ctx)
    throw new Error("useBottomSheet must be used within BottomSheetProvider");
  return ctx;
};
