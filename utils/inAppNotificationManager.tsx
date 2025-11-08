import InAppNotification from "@/components/ui/InAppNotification";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface NotificationData {
  id: string;
  title: string;
  body: string;
  emoji?: string;
  onPress?: () => void;
  duration?: number;
}

interface InAppNotificationContextType {
  showNotification: (notification: Omit<NotificationData, "id">) => void;
  hideNotification: () => void;
}

const InAppNotificationContext = createContext<
  InAppNotificationContextType | undefined
>(undefined);

export const InAppNotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentNotification, setCurrentNotification] =
    useState<NotificationData | null>(null);

  const showNotification = (notification: Omit<NotificationData, "id">) => {
    const id = `notification_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setCurrentNotification({
      ...notification,
      id,
    });
  };

  const hideNotification = () => {
    setCurrentNotification(null);
  };

  return (
    <InAppNotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}

      {/* In-App Notification Overlay */}
      <InAppNotification
        visible={currentNotification !== null}
        title={currentNotification?.title || ""}
        body={currentNotification?.body || ""}
        emoji={currentNotification?.emoji}
        onPress={currentNotification?.onPress}
        onDismiss={hideNotification}
        duration={currentNotification?.duration}
      />
    </InAppNotificationContext.Provider>
  );
};

export const useInAppNotification = (): InAppNotificationContextType => {
  const context = useContext(InAppNotificationContext);
  if (!context) {
    throw new Error(
      "useInAppNotification must be used within InAppNotificationProvider"
    );
  }
  return context;
};
