import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
import { Platform } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

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
      return { granted: false, token: null };
    }

    // Get the token that identifies this device
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    // On Android, you might also need to set channel for local notifications
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return { granted: true, token };
  } catch (err) {
    console.warn("registerForPushNotificationsAsync error", err);
    return { granted: false, token: null };
  }
}

async function initPushForUser(userId: string) {
  const { granted, token } = await registerForPushNotificationsAsync();
  if (!granted || !token) return;
  // send token to server
  await fetch("https://yourserver.com/api/users/add-expo-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId,
    },
    body: JSON.stringify({ token, platform: "expo" }),
  });
}

export default function RootLayout() {
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
