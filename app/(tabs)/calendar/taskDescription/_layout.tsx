import { View } from "@/components/ui/view";
import { setUserId } from "@/constants/axios-config";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function TabLayout() {
  const user = useUser();
  setUserId(user.user?.id || "");

  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />; // Redirect to sign-in screen
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="mode" options={{ headerShown: false }} />
    </Stack>
  );
}
