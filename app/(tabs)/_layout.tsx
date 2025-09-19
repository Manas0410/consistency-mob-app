import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";

export default function TabLayout() {
  const pallet = usePallet();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: pallet.shade1,
        headerShown: false,
        tabBarStyle: {
          height: 90,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarButton: (props) => {
          if (
            props.accessibilityLabel &&
            props.accessibilityLabel.toLowerCase().includes("add")
          ) {
            return (
              <HapticTab
                {...props}
                style={{
                  top: -25,
                  backgroundColor: "#FFD25F",
                  borderRadius: 40,
                  width: 56,
                  height: 56,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <IconSymbol name="plus" size={32} color="#fff" />
              </HapticTab>
            );
          }
          return <HapticTab {...props} />;
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
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="calendar" color={color} />
          ),
          tabBarLabel: "Calendar",
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: () => null,
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Report",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart" color={color} />
          ),
          tabBarLabel: "Report",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gear" color={color} />
          ),
          tabBarLabel: "Settings",
        }}
      />
    </Tabs>
  );
}
