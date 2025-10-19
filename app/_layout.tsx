import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import BottomBar from "@/components/bottom-bar";
import { ToastProvider } from "@/components/ui/toast";
import { useTheme } from "@/hooks/use-theme";
import TaskForm from "@/pages/addTask/task-form";
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
          <StatusBar style="auto" />
        </ToastProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
