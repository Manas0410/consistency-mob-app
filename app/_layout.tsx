import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

import { ToastProvider } from "@/components/ui/toast";
import GlobalContextProvider from "@/contexts/global-context-provider";
import { OnboardingProvider } from "@/contexts/onboarding-context";
import { PaletteProvider } from "@/contexts/palette-context";
import TaskForm from "@/pages/addTask/task-form";
import TeamTaskForm from "@/pages/Team/team-task-form";
import { ThemeProvider } from "@/theme/theme-provider";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import * as Notifications from "expo-notifications";

// 👇 expo-router setting (unchanged)
export const unstable_settings = {
  anchor: "(tabs)",
};

// 👇 1) Global notification handler – how notifications behave when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // show popup
    shouldPlaySound: true, // play sound
    shouldSetBadge: false,
  }),
});
// 👇 2) Ask for permissions + get Expo push token
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

    // Get the token that identifies this device (for PUSH notifications)
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    // On Android, register a channel (required for proper behavior)
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

// 👇 3) Optional: send Expo push token to your backend for later use
async function initPushForUser(userId: string) {
  const { granted, token } = await registerForPushNotificationsAsync();
  if (!granted || !token) return;

  // TODO: replace URL with your real backend endpoint
  try {
    await fetch("https://yourserver.com/api/users/add-expo-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify({ token, platform: "expo" }),
    });
  } catch (e) {
    console.warn("Failed to send Expo push token to server", e);
  }
}

export default function RootLayout() {
  // 4) Run once when app loads – for now just register & log token.
  // Later you can call initPushForUser(userId) when you have the logged-in user.
  useEffect(() => {
    (async () => {
      const { granted, token } = await registerForPushNotificationsAsync();
      if (granted && token) {
        console.log("Expo push token:", token);
        // 🔥 Later:
        // const userId = ... from Clerk
        // await initPushForUser(userId);
      }
    })();
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

                {/* These look like global portals/forms you want mounted */}
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
