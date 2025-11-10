// import { SignOutButton } from "@/components/SignOutButton";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import HabbitCompletionCard from "@/components/ui/HabbitCompletionCard";
// import HabitCard from "@/components/ui/HabitCard";
// import { Image } from "@/components/ui/image";
// import { ParallaxScrollView } from "@/components/ui/parallax-scrollview";
// import StreakCard from "@/components/ui/streak-card";
// import TaskProgressCard from "@/components/ui/task-progress-card";
// import WeekTaskCompletionCard from "@/components/ui/WeekTaskCompletionCard";
// import { Colors } from "@/constants/theme";
// import { usePallet } from "@/hooks/use-pallet";
// import { useTheme } from "@/hooks/use-theme";
// import { useUser } from "@clerk/clerk-expo";
// import { ScrollView, StyleSheet, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function HomeScreen() {
//   const theme = useTheme();
//   const colors = theme === "dark" ? Colors.dark : Colors.light;

//   const { user } = useUser();
//   const pallet = usePallet();
//   console.log(user);
//   return (
//     <ParallaxScrollView
//       headerHeight={350}
//       headerImage={
//         <Image
//           source={require("@/assets/images/home-banner.png")}
//           style={{ width: "100%", height: "100%" }}
//           contentFit="cover"
//         />
//       }
//     >
//       <View style={{ flex: 1, backgroundColor: "#fff" }}>
//         <SafeAreaView style={{ flex: 1 }}>
//           <SignOutButton />
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//               paddingHorizontal: 16,
//               paddingTop: 10,
//               position: "sticky",
//               top: 0,
//             }}
//           >
//             <Text style={[styles.Heading, { color: pallet.shade1 }]}>
//               25 Hours
//             </Text>
//             <Avatar>
//               <AvatarImage
//                 source={{
//                   uri:
//                     user?.imageUrl ||
//                     `https://avatars.githubusercontent.com/u/99088394?v=4`,
//                 }}
//               />
//               <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
//             </Avatar>
//           </View>
//           <Text
//             style={{
//               color: colors.textSecondary,
//               marginLeft: 10,
//               marginBottom: 10,
//             }}
//           >
//             Believe you can and you're halfway there!
//           </Text>

//           <ScrollView
//             contentContainerStyle={{ paddingBottom: 100 }}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={{ flex: 1, display: "flex", gap: 12, padding: 10 }}>
//               <StreakCard streak={50} />
//               <TaskProgressCard
//                 percentage={75}
//                 tasks={[
//                   { name: "Task 1", done: true },
//                   { name: "Task 2", done: false },
//                   { name: "Task 3", done: true },
//                 ]}
//                 onTaskToggle={(index) => {
//                   console.log("Toggle task at index:", index);
//                 }}
//                 onSeeDetail={() => {
//                   console.log("See detailed view");
//                 }}
//               />
//               <WeekTaskCompletionCard />
//               <HabbitCompletionCard />
//               <HabitCard onManage={() => {}} />
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       </View>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   Heading: {
//     fontSize: 30,
//     fontWeight: "800",
//     marginBottom: 0,
//     display: "flex",
//     flexDirection: "column",
//   },
// });

import CategoryClock from "@/components/category-clock";
import Heatmap from "@/components/charts/heat-map";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnimatedProgressRing from "@/components/ui/progress-ring";
import { Text } from "@/components/ui/text";
import { useGetCurrentDayTask } from "@/contexts/todays-tasks-context";
import { usePallet } from "@/hooks/use-pallet";
import HabbitCard from "@/pages/Dashboard/components/habbit-card";
import QuickActions from "@/pages/Dashboard/components/quick-actions";
import { getTasksByDate } from "@/pages/task-viewer/API/getTasks";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Bell } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState("Week");

  const periods = ["Day", "Week", "Month", "Quarter"];
  const pallet = usePallet();
  const { user } = useUser();

  const [todayTasks, setTodayTasks] = useState([]);
  const completedCount = todayTasks.filter((task) => task?.isDone).length;
  const remainingCount = todayTasks.filter((task) => !task?.isDone).length;
  const totalCount = todayTasks.length;
  const percentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const { setCurrentDayTask } = useGetCurrentDayTask();

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

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
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
            </View>
          </View>

          {/* Main Stats */}
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 24,
              padding: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: 200 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginLeft: 2,
                }}
              >
                30 Days Streak
              </Text>
              <Heatmap />
            </View>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("@/assets/images/flame.png")}
                  style={{
                    width: 66,
                    height: 92,
                  }}
                  resizeMode="contain"
                />
                <View
                  style={{
                    width: 56,
                    height: 72,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    bottom: -9,
                    left: "50%",
                    transform: [{ translateX: -33 }],
                  }}
                >
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: "bold",
                      color: "#fff",
                      textShadowColor: "#d17b2c",
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 6,
                    }}
                  >
                    {30}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                Productivity
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Progress Circle Section */}
        <View style={{ flex: 1, gap: 24, paddingHorizontal: 24 }}>
          <View style={{ marginTop: -20, marginBottom: 30 }}>
            <View
              style={{
                backgroundColor: "#ffffff",
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
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    Tasks Completed
                  </Text>
                </View>

                <View style={{ alignItems: "center" }}>
                  <Text variant="heading" style={{ color: "#9aa2adff" }}>
                    {remainingCount}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    Remaining Tasks
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <CategoryClock />

          {/* habbit */}
          <HabbitCard />

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
