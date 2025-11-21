import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
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
  const colors = Colors.light; // Always use light theme
  const pallet = usePallet();
  const textColor = useColor({}, "text");
  const textMutedColor = useColor({}, "textMuted");
  const iconColor = useColor({}, "icon");
  const backgroundCardColor = useColor({}, "background");
  const tabBackgroundColor = "#E0E0E0";
  const activeTabBackgroundColor = backgroundCardColor;

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: tabBackgroundColor,
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
              backgroundColor: isActive
                ? activeTabBackgroundColor
                : "transparent",
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: isActive
                  ? pallet.shade1 || textColor
                  : textMutedColor || iconColor,
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
