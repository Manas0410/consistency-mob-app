import { Tabs } from "expo-router";
import React from "react";

import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";

import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function TabLayout() {
  const pallet = usePallet();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: pallet.shade1,
        headerShown: false,
        tabBarStyle: {
          height: 100,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
          paddingTop: 6,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} color={color} name="home" />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} color={color} name="calendar" />
          ),
          tabBarLabel: "Tasks",
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: () => null, // icon will be rendered inside the button
          tabBarLabel: "",
          tabBarButton: (props) => (
            // @ts-ignore
            <TouchableOpacity
              {...props}
              style={styles.addButton}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={60} color={pallet.shade2} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Report",
          tabBarIcon: ({ color }) => (
            <Ionicons size={26} color={color} name="bar-chart" />
          ),
          tabBarLabel: "Report",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} color={color} name="cog" />
          ),
          tabBarLabel: "Settings",
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    bottom: 18, // adjust upward if you want more floating effect
    left: "50%",
    transform: [{ translateX: -30 }], // half of Icon size to center
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff", // or transparent if preferred
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // ensures on top
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
});
