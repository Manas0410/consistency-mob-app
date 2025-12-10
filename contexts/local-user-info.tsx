import apicall from "@/constants/axios-config";
import { useUser } from "@clerk/clerk-expo";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type BottomSheetContextValue = {
  userData: any;
};

const localUserContext = createContext<BottomSheetContextValue | undefined>(
  undefined
);

export const LocalUserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState(false);

  const { user } = useUser();

  const getUser = async () => {
    try {
      const response = await apicall.get("/user/info");

      if (response.status !== 200) {
        throw new Error(`Failed to add task: ${response.statusText}`);
      }

      setUserData(response.data?.data);

      return {
        success: true,
        data: response.data?.data,
      };
    } catch (error) {
      console.error("Error adding task:", error);
      return {
        success: false,
        data: { message: "error" },
      };
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    getUser();
  }, [user?.id]);

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

// "data": {
//     "_id": "6918974cd2b453928d92b34a",
//     "userId": "user_35WICbdX5HW6ugzQZux88iT2Ju5",
//     "userName": "mana",
//     "mail": "manasshrivastava0410@gmail.com",
//     "googleCalendarSynced": true,
//     "timeZone": "UTC",
//     "notificationPreferences": {
//       "quietHours": {
//         "start": "",
//         "end": ""
//       },
//       "enabled": true
//     },
//     "personalCategories": [],
//     "expoPushTokens": [],
//     "createdAt": "2025-11-15T15:07:56.112Z",
//     "updatedAt": "2025-11-20T19:19:18.773Z",
//     "__v": 0,
//   }
