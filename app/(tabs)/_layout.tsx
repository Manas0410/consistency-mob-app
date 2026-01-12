import BottomBar from "@/components/bottom-bar";
import { View } from "@/components/ui/view";
import apicall, { setUserId } from "@/constants/axios-config";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Notifications from "expo-notifications";
import { Redirect, Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const user = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const { hasCompletedOnboarding } = useOnboardingContext();

  useEffect(() => {
    if (!isLoaded || !user.user?.id) return;
    setUserId(user.user.id);
  }, [isLoaded, user.user?.id]);

  async function registerForPushNotificationsAsync() {
    try {
      const perms = await Notifications.getPermissionsAsync();
      let finalStatus = perms.status;
      if (finalStatus !== "granted") {
        const req = await Notifications.requestPermissionsAsync();
        finalStatus = req.status;
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
      await apicall.post("/user/add-expo-token", { token, platform: "expo" });
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

      if (!res || res.status !== 200 || !res.data) {
        console.log("Failed to fetch reminders for day or unexpected response");
        return;
      }

      const reminders = Array.isArray(res.data.reminders)
        ? res.data.reminders
        : [];
      const now = Date.now();

      const jobs = reminders
        .map((rem) => {
          try {
            const notifyAt = new Date(rem.notifyAt);
            if (isNaN(notifyAt.getTime()) || notifyAt.getTime() <= now)
              return null;
            return Notifications.scheduleNotificationAsync({
              content: {
                title: rem.taskName || "Reminder",
                body: rem.label || rem.taskDescription || "",
                sound: true,
                data: { taskId: rem.taskId, reminderId: rem.reminderId },
              },
              trigger: notifyAt,
            });
          } catch (err) {
            console.warn("Invalid reminder entry, skipping", err, rem);
            return null;
          }
        })
        .filter(Boolean) as Promise<string>[];

      if (jobs.length > 0) {
        await Promise.allSettled(jobs);
      }
    } catch (e) {
      console.warn("scheduleTodayReminders error", e);
    }
  }

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  useEffect(() => {
    if (!isSignedIn || !isLoaded) return;
    let mounted = true;

    const timeout = setTimeout(() => {
      (async () => {
        try {
          const { granted, token } = await registerForPushNotificationsAsync();
          if (!mounted) return;

          if (granted && token) {
            await syncPushTokenWithServer(token);
          }

          await scheduleTodayReminders();
        } catch (err) {
          console.warn("startup init error", err);
        }
      })();
    }, 0); // <-- critical

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [isSignedIn, isLoaded]);

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  if (!isSignedIn) {
    return (
      <View style={{ flex: 1 }}>
        <Redirect href="/sign-in" />
      </View>
    );
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
