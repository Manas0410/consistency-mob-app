import { Colors } from "@/constants/theme";
import { useAddTaskSheet } from "@/contexts/add-task-context";
import { useAddTeamBottomSheet } from "@/contexts/add-team-context";
import { useAddTeamTaskSheet } from "@/contexts/add-team-task-context";
import { useJoinTeamBottomSheet } from "@/contexts/join-team-contex";
import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";
// Removed design token imports for simplified styling
import { useNavigation } from "@react-navigation/native";
import { usePathname, useRouter } from "expo-router";
import {
  Brain,
  Calendar,
  ChevronUp,
  Home,
  PackagePlus,
  Plus,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const bottomBarOptions = [
  { name: "Home", icon: Home, url: "/" },
  { name: "Tasks", icon: Calendar, url: "/calendar" },
  { name: "AI Chat", icon: Brain, url: "/ai-chat" },
  { name: "Team", icon: Users, url: "/team" },
  { name: "Settings", icon: Settings, url: "/settings" },
];

const BottomBar = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const pallet = usePallet();
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  const [isTeamsButtonExpanded, setIsTeamsButtonExpanded] =
    React.useState(true);

  // Animation values
  const buttonScale = useSharedValue(1);

  const { open: AddTeamOpen } = useAddTeamBottomSheet();
  const { open: JoinTeamOpen } = useJoinTeamBottomSheet();
  const { open: AddTaskOpen } = useAddTaskSheet();
  const { open: AddTeamTaskOpen } = useAddTeamTaskSheet();

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        {bottomBarOptions.map((option) => (
          <TouchableOpacity
            key={option.name}
            style={[
              styles.iconButton,
              pathname === option.url && [styles.activeIconButton, { backgroundColor: pallet.shade4 }]
            ]}
            onPress={() => {
              buttonScale.value = withSpring(0.95, {}, () => {
                buttonScale.value = withSpring(1);
              });
              // @ts-ignore
              router.push(option.url);
            }}
            activeOpacity={0.7}
          >
            <option.icon
              size={24}
              color={pathname === option.url ? pallet.shade1 : colors.icon}
              fill={pathname === option.url ? pallet.shade1 : "none"}
            />
          </TouchableOpacity>
        ))}
      </View>
      {!["/team", "/TeamDetails"].includes(pathname) &&
        !pathname.endsWith("/TeamDetails") && (
          <Animated.View style={[
            styles.addButton, 
            { 
              backgroundColor: pallet.shade1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }, 
            animatedButtonStyle
          ]}>
            <TouchableOpacity
              style={styles.addButtonInner}
              onPress={() => {
                buttonScale.value = withSpring(0.9, {}, () => {
                  buttonScale.value = withSpring(1);
                });
                AddTaskOpen();
              }}
            >
              <Plus color="white" size={32} />
            </TouchableOpacity>
          </Animated.View>
        )}
      {["/team"].includes(pathname) && (
        <>
          {isTeamsButtonExpanded ? (
            <View style={styles.buttonCnt}>
              <TouchableOpacity
                style={[
                  styles.BtnCntCross,
                  {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 4,
                  }
                ]}
                onPress={() => {
                  setIsTeamsButtonExpanded(false);
                }}
              >
                <X size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.BtnCntBtn, 
                  { 
                    backgroundColor: pallet.shade1,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }
                ]}
                onPress={() => {
                  AddTeamOpen();
                }}
              >
                <PackagePlus color="white" size={36} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.BtnCntBtn, 
                  { 
                    backgroundColor: pallet.shade2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }
                ]}
                onPress={() => {
                  JoinTeamOpen();
                }}
              >
                <UserPlus color="white" size={34} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={styles.addButton}
              onTouchEnd={() => setIsTeamsButtonExpanded(true)}
            >
              <ChevronUp />
            </View>
          )}
        </>
      )}
      {pathname.endsWith("/TeamDetails") && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            AddTeamTaskOpen();
          }}
        >
          <Plus color="white" size={36} />
        </TouchableOpacity>
      )}
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bar: {
    flexDirection: "row",
    height: BAR_HEIGHT,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  iconButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeIconButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: BAR_HEIGHT + 45,
    width: ADD_BUTTON_SIZE,
    height: ADD_BUTTON_SIZE,
    borderRadius: ADD_BUTTON_SIZE / 2,
  },
  addButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: ADD_BUTTON_SIZE / 2,
  },
  buttonCnt: {
    position: "absolute",
    right: 20,
    bottom: BAR_HEIGHT + 45,
    gap: 16,
    alignItems: "center",
  },
  BtnCntBtn: {
    width: ADD_BUTTON_SIZE,
    height: ADD_BUTTON_SIZE,
    borderRadius: ADD_BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  BtnCntCross: {
    backgroundColor: "#94A3B8",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BottomBar;
