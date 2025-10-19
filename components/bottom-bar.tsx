import { usePallet } from "@/hooks/use-pallet";
import { useNavigation } from "@react-navigation/native";
import { usePathname, useRouter } from "expo-router";
import {
  Brain,
  Calendar,
  Home,
  Plus,
  Settings,
  Users,
} from "lucide-react-native";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // <-- Add this

const bottomBarOptions = [
  { name: "Home", icon: Home, url: "/" },
  { name: "Team", icon: Users, url: "/team" },
  { name: "AI Chat", icon: Brain, url: "/ai-chat" },
  { name: "Tasks", icon: Calendar, url: "/calendar" },
  { name: "Settings", icon: Settings, url: "/settings" },
];

const BottomBar = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); // <-- Get insets
  const router = useRouter();
  const pathname = usePathname();
  const pallet = usePallet();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        {bottomBarOptions.map((option) => (
          <TouchableOpacity
            key={option.name}
            style={styles.iconButton}
            onPress={() => router.push(option.url)}
            activeOpacity={0.7}
          >
            <option.icon
              size={24}
              color={pathname === option.url ? pallet.shade2 : undefined}
              fill={pathname === option.url ? pallet.shade2 : "none"}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          /* handle '+' action */
        }}
      >
        <Plus color="white" size={36} />
      </TouchableOpacity>
    </View>
  );
};

const BAR_HEIGHT = 70;
const INDICATOR_WIDTH = 160;
const INDICATOR_HEIGHT = 10;
const ADD_BUTTON_SIZE = 60;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
  },
  bar: {
    flexDirection: "row",
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    height: BAR_HEIGHT,
    justifyContent: "space-around",
    alignItems: "center",
    width: Dimensions.get("window").width,
    paddingHorizontal: 14,
  },
  iconButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  addButton: {
    position: "absolute",
    right: 22,
    bottom: BAR_HEIGHT + 44,
    backgroundColor: "#23A8FF",
    width: ADD_BUTTON_SIZE,
    height: ADD_BUTTON_SIZE,
    borderRadius: ADD_BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default BottomBar;
