import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import BottomBar from "@/components/bottom-bar";
import { ToastProvider } from "@/components/ui/toast";
import GlobalContextProvider from "@/contexts/global-context-provider";
import { useTheme } from "@/hooks/use-theme";
import TaskForm from "@/pages/addTask/task-form";
import TeamTaskForm from "@/pages/Team/team-task-form";
import { ThemeProvider } from "@/theme/theme-provider";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const theme = useTheme();
  const pathname = usePathname();

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ThemeProvider>
        <ToastProvider>
          <GlobalContextProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
            {!["/sign-in", "/sign-up", "/ai-chat"].includes(pathname) && (
              <BottomBar />
            )}
            <TaskForm />
            <TeamTaskForm />
            <StatusBar style="auto" />
          </GlobalContextProvider>
        </ToastProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
