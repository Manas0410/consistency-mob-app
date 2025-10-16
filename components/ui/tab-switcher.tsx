import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import React from "react";
import { Pressable } from "react-native";

type Tab = {
  label: string;
  key: string;
};

type TabSelectorProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
};

export function TabSelector({
  tabs,
  activeTab,
  onTabChange,
}: TabSelectorProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#E0E0E0",
        borderRadius: 8,
        padding: 4,
        alignSelf: "flex-start",
        height: 37,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={{
              paddingVertical: 4,
              paddingHorizontal: 12,
              backgroundColor: isActive ? "#fff" : "transparent",
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: isActive ? "#1A1A1A" : "#757575",
                fontWeight: isActive ? "bold" : "400",
                fontSize: 14,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
