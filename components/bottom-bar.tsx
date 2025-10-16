import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
// Lucide or Lucid icons you provide
import {
  Calendar,
  Home,
  MessageCircle,
  Plus,
  Settings,
  Users,
} from "lucide-react-native";

const bottomBarOptions = [
  { name: "Home", icon: Home, url: "HomeScreen" },
  { name: "Team", icon: Users, url: "TeamScreen" },
  { name: "AI Chat", icon: MessageCircle, url: "AIChatScreen" },
  { name: "Tasks", icon: Calendar, url: "TasksScreen" },
  { name: "Settings", icon: Settings, url: "SettingsScreen" },
];

const BottomBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {bottomBarOptions.map((option) => (
          <TouchableOpacity
            key={option.name}
            style={styles.iconButton}
            // onPress={() => navigation.navigate(option.url)}
            activeOpacity={0.7}
          >
            <option.icon color="white" size={32} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.indicator} />
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
const ADD_BUTTON_SIZE = 70;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    zIndex: 10,
  },
  bar: {
    flexDirection: "row",
    backgroundColor: "#151517",
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
  indicator: {
    position: "absolute",
    bottom: BAR_HEIGHT - INDICATOR_HEIGHT,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: INDICATOR_HEIGHT / 2,
    height: INDICATOR_HEIGHT,
    width: INDICATOR_WIDTH,
  },
  addButton: {
    position: "absolute",
    right: 22,
    bottom: BAR_HEIGHT + 14,
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
