import { Redirect, Tabs } from "expo-router";
import React from "react";

import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";

import { setUserId } from "@/constants/axios-config";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Brain } from "lucide-react-native";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  const pallet = usePallet();
  const theme = useTheme();


  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null; // or loading spinner
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />; // Redirect to sign-in screen
  }
  const user = useUser();
  setUserId(user.user?.id || "");
  console.log("User ID set to:", user.user?.id);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: pallet.shade1,
        tabBarInactiveTintColor: "#222",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 16,
          height: 72,
          borderRadius: 32,
          backgroundColor: "#f1ededff",
          borderWidth: 1.5,
          borderColor: "#eee",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 8,
          paddingHorizontal: 12,
          paddingBottom: 0,
          marginHorizontal: 20,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginTop: 2,
        },
        tabBarItemStyle: {
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} color={color} name="home" />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: "Team",
          tabBarIcon: ({ color }) => (
            <Ionicons size={22} color={color} name="airplane" />
          ),
          tabBarLabel: "Team",
        }}
      />
      

       <Tabs.Screen
        name="ai-chat"
        options={{
          title: "AI Chat",
          tabBarIcon: ({ color }) => (
             <Brain size={22} color={color} />
          ),
          tabBarLabel: "AI Chat",
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <Ionicons size={22} color={color} name="calendar" />
          ),
          tabBarLabel: "Tasks",
        }}
      />


      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} color={color} name="cog" />
          ),
          tabBarLabel: "Settings",
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: () => (
            <Ionicons name="add" size={68} color="#fff" style={styles.addButtonCustom} />
          ),
          tabBarLabel: "",
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  addButtonCustom: {
    position: "absolute",
    right: -6,
    bottom: 18,
    width: 85,
    height: 85,
    borderRadius: "50%",
    backgroundColor: "#0eafff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
