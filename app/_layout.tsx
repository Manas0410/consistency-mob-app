import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
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

export const unstable_settings = {
  anchor: "(tabs)",
};

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
