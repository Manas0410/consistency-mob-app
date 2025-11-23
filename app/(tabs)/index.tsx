import CategoryClock from "@/components/category-clock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnimatedProgressRing from "@/components/ui/progress-ring";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useGetCurrentDayTask } from "@/contexts/todays-tasks-context";
import { usePallet } from "@/hooks/use-pallet";
import HabitCard from "@/pages/Dashboard/components/habbit-card";
import WorkModesCard from "@/pages/Dashboard/components/mode-card";
import QuickActions from "@/pages/Dashboard/components/quick-actions";
import StreakCard from "@/pages/Dashboard/components/streak-card";
import { OnboardingFlow } from "@/pages/Onboarding/onboarding-page";
import { getTasksByDate } from "@/pages/task-viewer/API/getTasks";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Bell } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState("Week");

  const periods = ["Day", "Week", "Month", "Quarter"];
  const pallet = usePallet();
  const colors = Colors.light; // Always use light theme
  const { user } = useUser();

  const [todayTasks, setTodayTasks] = useState([]);
  const completedCount = todayTasks.filter((task) => task?.isDone).length;
  const remainingCount = todayTasks.filter((task) => !task?.isDone).length;
  const totalCount = todayTasks.length;
  const percentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const { setCurrentDayTask } = useGetCurrentDayTask();
  const router = useRouter();

  useEffect(() => {
    const fetchTodayTasks = async () => {
      const res = await getTasksByDate(new Date());
      if (res.success) {
        setTodayTasks(res?.data);
        setCurrentDayTask(res?.data);
      }
    };
    fetchTodayTasks();
  }, []);
  const { resetOnboarding } = useOnboardingContext();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="dark" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with stunning gradient */}
        <LinearGradient
          // colors={["#667eea", "#764ba2", "#f093fb"]}
          colors={[pallet.shade3, pallet.shade1, pallet.shade1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 4,
            paddingHorizontal: 16,
            paddingBottom: 40,
          }}
        >
          {/* Top Bar */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: "500",
                }}
              >
                Good morning
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  color: "#ffffff",
                  fontWeight: "bold",
                  // marginTop: 4,
                }}
              >
                {user?.username?.toUpperCase()}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
            >
              <TouchableOpacity
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Bell size={20} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/settings")}>
                <Avatar>
                  <AvatarImage
                    source={{
                      uri:
                        user?.imageUrl ||
                        `https://avatars.githubusercontent.com/u/99088394?v=4`,
                    }}
                  />
                  <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                </Avatar>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Stats */}
          <StreakCard />
        </LinearGradient>

        {/* Progress Circle Section */}
        <View style={{ flex: 1, gap: 24, paddingHorizontal: 24 }}>
          <View style={{ marginTop: -20, marginBottom: 30 }}>
            <View
              style={{
                backgroundColor: colors.background,
                borderRadius: 28,
                padding: 32,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
                elevation: 12,
              }}
            >
              <AnimatedProgressRing
                percentage={percentage}
                size={180}
                strokeWidth={14}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 24,
                  gap: 16,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text variant="heading" style={{ color: pallet.shade1 }}>
                    {completedCount}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.icon || colors.textMuted || "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    Tasks Completed
                  </Text>
                </View>

                <View style={{ alignItems: "center" }}>
                  <Text
                    variant="heading"
                    style={{ color: colors.icon || "#9aa2adff" }}
                  >
                    {remainingCount}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.icon || colors.textMuted || "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    Remaining Tasks
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <WorkModesCard />

          <CategoryClock />

          {/* habbit */}
          <HabitCard />

          {/* {focus hours} */}
          {/* <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Timer size={24} color={pallet.shade1} />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#1E293B",
                  marginLeft: 8,
                }}
              >
                Focus Time
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: pallet.shade1,
                  }}
                >
                  15
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#64748B",
                    marginTop: 4,
                  }}
                >
                  Today
                </Text>
              </View>

              <View
                style={{
                  width: 1,
                  backgroundColor: "#E2E8F0",
                  marginHorizontal: 20,
                }}
              />

              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: pallet.shade1,
                  }}
                >
                  13
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#64748B",
                    marginTop: 4,
                  }}
                >
                  This Week
                </Text>
              </View>
            </View>
          </View> */}

          {/* goals */}
          {/* <GoalCard /> */}

          {/* Quick Actions */}
          <QuickActions />
        </View>
      </ScrollView>
    </View>
  );
}

export default function OnboardingHook() {
  const { hasCompletedOnboarding, hydrated } = useOnboardingContext();
  // optional: show a loading state until hydration finishes
  if (!hydrated) {
    return null; // or a spinner while AsyncStorage value loads
  }

  return hasCompletedOnboarding ? <HomeScreen /> : <OnboardingFlow />;
}
