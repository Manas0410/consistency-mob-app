import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

import { ToastProvider } from "@/components/ui/toast";
import apicall from "@/constants/axios-config";
import GlobalContextProvider from "@/contexts/global-context-provider";
import { OnboardingProvider } from "@/contexts/onboarding-context";
import { PaletteProvider } from "@/contexts/palette-context";
import TaskForm from "@/pages/addTask/task-form";
import TeamTaskForm from "@/pages/Team/team-task-form";
import { ThemeProvider } from "@/theme/theme-provider";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import * as Notifications from "expo-notifications";

export const unstable_settings = {
  anchor: "(tabs)",
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permission not granted");
      return { granted: false as const, token: null as string | null };
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return { granted: true as const, token };
  } catch (err) {
    console.warn("registerForPushNotificationsAsync error", err);
    return { granted: false as const, token: null as string | null };
  }
}

async function syncPushTokenWithServer(token: string) {
  try {
    await apicall.post("/user/add-expo-token", {
      token,
      platform: "expo",
    });
  } catch (e) {
    console.warn("Failed to send Expo push token to server", e);
  }
}

async function scheduleTodayReminders() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn("Failed to cancel scheduled notifications", e);
  }

  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const res = await apicall.get(`/task/getReminders?date=${todayStr}`);

    if (!res.data || res.status !== 200) {
      console.log("Failed to fetch reminders for day");
      return;
    }

    const data = res.data;
    const reminders = Array.isArray(data.reminders) ? data.reminders : [];
    const now = new Date();

    for (const rem of reminders) {
      const notifyAt = new Date(rem.notifyAt);
      if (isNaN(notifyAt.getTime()) || notifyAt <= now) continue;

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: rem.taskName || "Reminder",
            body: rem.label || rem.taskDescription || "",
            sound: true,
            data: {
              taskId: rem.taskId,
              reminderId: rem.reminderId,
            },
          },
          trigger: notifyAt,
        });
      } catch (e) {
        console.warn("Failed to schedule notification", e);
      }
    }
  } catch (e) {
    console.warn("scheduleTodayReminders error", e);
  }
}

export default function RootLayout() {
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { granted, token } = await registerForPushNotificationsAsync();
      if (!isMounted) return;

      if (granted && token) {
        console.log("Expo push token:", token);
        await syncPushTokenWithServer(token);
      }

      await scheduleTodayReminders();
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <PaletteProvider>
        <ThemeProvider>
          <OnboardingProvider>
            <ToastProvider>
              <GlobalContextProvider>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal", title: "Modal" }}
                  />
                </Stack>

                <TaskForm />
                <TeamTaskForm />
                <StatusBar style="light" />
              </GlobalContextProvider>
            </ToastProvider>
          </OnboardingProvider>
        </ThemeProvider>
      </PaletteProvider>
    </ClerkProvider>
  );
}
