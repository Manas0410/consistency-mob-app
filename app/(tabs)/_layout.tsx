import BottomBar from "@/components/bottom-bar";
import { setUserId } from "@/constants/axios-config";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect, Stack, usePathname } from "expo-router";

export default function TabLayout() {
  const user = useUser();
  setUserId(user.user?.id || "");

  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const { hasCompletedOnboarding } = useOnboardingContext();

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
