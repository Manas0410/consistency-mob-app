import BottomBar from "@/components/bottom-bar";
import apicall, { setUserId } from "@/constants/axios-config";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Notifications from "expo-notifications";
import { Redirect, Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const user = useUser();
  setUserId(user.user?.id || "");

  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const { hasCompletedOnboarding } = useOnboardingContext();

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
      const res = await apicall.post(`/task/getReminders?date=${todayStr}`);

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

  useEffect(() => {
    if (!isSignedIn || !isLoaded) return;

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
  }, [isSignedIn, isLoaded]);

  if (!isLoaded) {
    return null; // or loading spinner
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />; // Redirect to sign-in screen
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="ai-chat" options={{ headerShown: false }} />
        <Stack.Screen name="team" options={{ headerShown: false }} />
        <Stack.Screen name="calendar" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="habbit" options={{ headerShown: false }} />
        <Stack.Screen name="focus-hour" options={{ headerShown: false }} />
        <Stack.Screen
          name="[teamid]/TeamDetails"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="[teamid]/teamTaskPage"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="[teamid]/teamMembers"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="[teamid]/taskDescriptionTeam"
          options={{ headerShown: false }}
        />
      </Stack>
      {!["/sign-in", "/sign-up", "/ai-chat"].includes(pathname) &&
        hasCompletedOnboarding && <BottomBar />}
    </>
  );
}
