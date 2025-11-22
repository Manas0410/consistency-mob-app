import React, { createContext, ReactNode, useContext, useState } from "react";

type BottomSheetContextValue = {
  userData: any;
};

const localUserContext = createContext<BottomSheetContextValue | undefined>(
  undefined
);

export const LocalUserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState(false);

  return (
    <localUserContext.Provider value={{ userData }}>
      {children}
    </localUserContext.Provider>
  );
};

export const useLocalUser = () => {
  const ctx = useContext(localUserContext);
  if (!ctx)
    throw new Error("useLocalUser must be used within LocalUserProvider");
  return ctx;
};
