import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HabbitCompletionCard from "@/components/ui/HabbitCompletionCard";
import HabitCard from "@/components/ui/HabitCard";
import { Image } from "@/components/ui/image";
import { ParallaxScrollView } from "@/components/ui/parallax-scrollview";
import StreakCard from "@/components/ui/streak-card";
import TaskProgressCard from "@/components/ui/task-progress-card";
import WeekTaskCompletionCard from "@/components/ui/WeekTaskCompletionCard";
import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";
import { useUser } from "@clerk/clerk-expo";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  const { user } = useUser();
  const pallet = usePallet();
  console.log(user);
  return (
    <ParallaxScrollView
      headerHeight={350}
      headerImage={
        <Image
          source={require("@/assets/images/home-banner.png")}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      }
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingTop: 10,
              position: "sticky",
              top: 0,
            }}
          >
            <Text style={[styles.Heading, { color: pallet.shade1 }]}>
              25 Hours
            </Text>
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
          <Text
            style={{
              color: colors.textSecondary,
              marginLeft: 10,
              marginBottom: 10,
            }}
          >
            Believe you can and you're halfway there!
          </Text>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1, display: "flex", gap: 12, padding: 10 }}>
              <StreakCard streak={50} />
              <TaskProgressCard
                percentage={75}
                tasks={[
                  { name: "Task 1", done: true },
                  { name: "Task 2", done: false },
                  { name: "Task 3", done: true },
                ]}
                onTaskToggle={(index) => {
                  console.log("Toggle task at index:", index);
                }}
                onSeeDetail={() => {
                  console.log("See detailed view");
                }}
              />
              <WeekTaskCompletionCard />
              <HabbitCompletionCard />
              <HabitCard onManage={() => {}} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  Heading: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 0,
    display: "flex",
    flexDirection: "column",
  },
});

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
// } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import {
//   Calendar,
//   CheckCircle2,
//   Target,
//   TrendingUp,
//   Clock,
//   Zap,
//   Plus,
//   Brain,
//   Coffee,
//   Flame,
//   Award,
//   Activity,
//   BarChart3,
//   Timer,
//   Star,
// } from "lucide-react-native";

// const { width } = Dimensions.get("window");

// export default function Dashboard() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();

//   // Sample data - replace with your actual data
//   const [dashboardData, setDashboardData] = useState({
//     currentStreak: 7,
//     longestStreak: 15,
//     todayTasks: { completed: 8, total: 12 },
//     focusTime: { today: 180, thisWeek: 1260 }, // minutes
//     weeklyData: [
//       { week: "This Week", completed: 28, total: 35, percentage: 80 },
//       { week: "Last Week", completed: 32, total: 35, percentage: 91 },
//       { week: "2 Weeks Ago", completed: 25, total: 30, percentage: 83 },
//       { week: "3 Weeks Ago", completed: 20, total: 28, percentage: 71 },
//     ],
//     habits: [
//       { id: 1, name: "Morning Exercise", completed: true, streak: 5 },
//       { id: 2, name: "Read 30 min", completed: true, streak: 3 },
//       { id: 3, name: "Drink 8 glasses water", completed: false, streak: 2 },
//       { id: 4, name: "Meditate", completed: true, streak: 7 },
//       { id: 5, name: "No social media", completed: false, streak: 1 },
//     ],
//     goals: [
//       { id: 1, title: "Complete Project Alpha", progress: 75, total: 100 },
//       { id: 2, title: "Learn React Native", progress: 60, total: 100 },
//     ],
//     recentActivities: [
//       { id: 1, text: 'Completed "Design UI mockups"', time: "10 min ago" },
//       { id: 2, text: "Started focus session", time: "45 min ago" },
//       { id: 3, text: "Achieved 5-day streak!", time: "1 hour ago" },
//     ],
//   });

//   const formatTime = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
//   };

//   const getStreakColor = (streak) => {
//     if (streak >= 10) return "#EF4444"; // Red flame for 10+ days
//     if (streak >= 5) return "#F97316"; // Orange for 5+ days
//     return "#10B981"; // Green for starting streaks
//   };

//   const getDayInitial = (dayIndex) => {
//     const days = ["S", "M", "T", "W", "T", "F", "S"];
//     return days[dayIndex];
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: "#F8FAFC",
//         paddingTop: insets.top,
//         paddingBottom: insets.bottom,
//       }}
//     >
//       <StatusBar style="dark" />

//       {/* Header */}
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-between",
//           paddingHorizontal: 20,
//           paddingVertical: 16,
//           backgroundColor: "#fff",
//         }}
//       >
//         <View>
//           <Text
//             style={{
//               fontSize: 24,
//               fontWeight: "800",
//               color: "#1E293B",
//             }}
//           >
//             Good Morning! 👋
//           </Text>
//           <Text
//             style={{
//               fontSize: 16,
//               color: "#64748B",
//               marginTop: 2,
//             }}
//           >
//             Let's make today productive
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={{
//             backgroundColor: "#3B82F6",
//             borderRadius: 12,
//             padding: 12,
//             shadowColor: "#3B82F6",
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.3,
//             shadowRadius: 4,
//             elevation: 3,
//           }}
//         >
//           <Plus size={20} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Quick Stats Row */}
//         <View
//           style={{
//             flexDirection: "row",
//             gap: 12,
//             marginBottom: 20,
//           }}
//         >
//           {/* Streak Card */}
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: "#fff",
//               borderRadius: 16,
//               padding: 16,
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 1 },
//               shadowOpacity: 0.1,
//               shadowRadius: 3,
//               elevation: 2,
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 marginBottom: 8,
//               }}
//             >
//               <Flame
//                 size={20}
//                 color={getStreakColor(dashboardData.currentStreak)}
//               />
//               <Text
//                 style={{
//                   fontSize: 14,
//                   fontWeight: "600",
//                   color: "#64748B",
//                   marginLeft: 6,
//                 }}
//               >
//                 Current Streak
//               </Text>
//             </View>
//             <Text
//               style={{
//                 fontSize: 28,
//                 fontWeight: "800",
//                 color: "#1E293B",
//                 marginBottom: 4,
//               }}
//             >
//               {dashboardData.currentStreak}
//             </Text>
//             <Text
//               style={{
//                 fontSize: 12,
//                 color: "#64748B",
//               }}
//             >
//               Best: {dashboardData.longestStreak} days
//             </Text>
//           </View>

//           {/* Today's Progress */}
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: "#fff",
//               borderRadius: 16,
//               padding: 16,
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 1 },
//               shadowOpacity: 0.1,
//               shadowRadius: 3,
//               elevation: 2,
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 marginBottom: 8,
//               }}
//             >
//               <CheckCircle2 size={20} color="#10B981" />
//               <Text
//                 style={{
//                   fontSize: 14,
//                   fontWeight: "600",
//                   color: "#64748B",
//                   marginLeft: 6,
//                 }}
//               >
//                 Today's Tasks
//               </Text>
//             </View>
//             <Text
//               style={{
//                 fontSize: 28,
//                 fontWeight: "800",
//                 color: "#1E293B",
//                 marginBottom: 4,
//               }}
//             >
//               {dashboardData.todayTasks.completed}/
//               {dashboardData.todayTasks.total}
//             </Text>
//             <View
//               style={{
//                 backgroundColor: "#F1F5F9",
//                 height: 6,
//                 borderRadius: 3,
//                 overflow: "hidden",
//               }}
//             >
//               <View
//                 style={{
//                   backgroundColor: "#10B981",
//                   height: "100%",
//                   width: `${
//                     (dashboardData.todayTasks.completed /
//                       dashboardData.todayTasks.total) *
//                     100
//                   }%`,
//                   borderRadius: 3,
//                 }}
//               />
//             </View>
//           </View>
//         </View>

//         {/* Focus Time Card */}
//         <View
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: 16,
//             padding: 20,
//             marginBottom: 20,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.1,
//             shadowRadius: 3,
//             elevation: 2,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginBottom: 16,
//             }}
//           >
//             <Timer size={24} color="#8B5CF6" />
//             <Text
//               style={{
//                 fontSize: 18,
//                 fontWeight: "700",
//                 color: "#1E293B",
//                 marginLeft: 8,
//               }}
//             >
//               Focus Time
//             </Text>
//           </View>

//           <View
//             style={{ flexDirection: "row", justifyContent: "space-around" }}
//           >
//             <View style={{ alignItems: "center" }}>
//               <Text
//                 style={{
//                   fontSize: 24,
//                   fontWeight: "800",
//                   color: "#8B5CF6",
//                 }}
//               >
//                 {formatTime(dashboardData.focusTime.today)}
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: "#64748B",
//                   marginTop: 4,
//                 }}
//               >
//                 Today
//               </Text>
//             </View>

//             <View
//               style={{
//                 width: 1,
//                 backgroundColor: "#E2E8F0",
//                 marginHorizontal: 20,
//               }}
//             />

//             <View style={{ alignItems: "center" }}>
//               <Text
//                 style={{
//                   fontSize: 24,
//                   fontWeight: "800",
//                   color: "#8B5CF6",
//                 }}
//               >
//                 {formatTime(dashboardData.focusTime.thisWeek)}
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: "#64748B",
//                   marginTop: 4,
//                 }}
//               >
//                 This Week
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Weekly Reports */}
//         <View
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: 16,
//             padding: 20,
//             marginBottom: 20,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.1,
//             shadowRadius: 3,
//             elevation: 2,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginBottom: 16,
//             }}
//           >
//             <BarChart3 size={24} color="#F59E0B" />
//             <Text
//               style={{
//                 fontSize: 18,
//                 fontWeight: "700",
//                 color: "#1E293B",
//                 marginLeft: 8,
//               }}
//             >
//               Weekly Progress
//             </Text>
//           </View>

//           {dashboardData.weeklyData.map((week, index) => (
//             <View
//               key={index}
//               style={{
//                 marginBottom:
//                   index === dashboardData.weeklyData.length - 1 ? 0 : 16,
//               }}
//             >
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: 8,
//                 }}
//               >
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontWeight: "600",
//                     color: "#374151",
//                   }}
//                 >
//                   {week.week}
//                 </Text>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontWeight: "600",
//                     color: "#64748B",
//                   }}
//                 >
//                   {week.completed}/{week.total} ({week.percentage}%)
//                 </Text>
//               </View>

//               <View
//                 style={{
//                   backgroundColor: "#F1F5F9",
//                   height: 8,
//                   borderRadius: 4,
//                   overflow: "hidden",
//                 }}
//               >
//                 <View
//                   style={{
//                     backgroundColor: index === 0 ? "#10B981" : "#94A3B8",
//                     height: "100%",
//                     width: `${week.percentage}%`,
//                     borderRadius: 4,
//                   }}
//                 />
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Habit Tracker */}
//         <View
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: 16,
//             padding: 20,
//             marginBottom: 20,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.1,
//             shadowRadius: 3,
//             elevation: 2,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginBottom: 16,
//             }}
//           >
//             <Activity size={24} color="#06B6D4" />
//             <Text
//               style={{
//                 fontSize: 18,
//                 fontWeight: "700",
//                 color: "#1E293B",
//                 marginLeft: 8,
//               }}
//             >
//               Today's Habits
//             </Text>
//           </View>

//           {dashboardData.habits.map((habit, index) => (
//             <TouchableOpacity
//               key={habit.id}
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 paddingVertical: 12,
//                 borderBottomWidth:
//                   index === dashboardData.habits.length - 1 ? 0 : 1,
//                 borderBottomColor: "#F1F5F9",
//               }}
//             >
//               <View
//                 style={{
//                   width: 24,
//                   height: 24,
//                   borderRadius: 12,
//                   backgroundColor: habit.completed ? "#10B981" : "#F1F5F9",
//                   borderWidth: habit.completed ? 0 : 2,
//                   borderColor: "#D1D5DB",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   marginRight: 12,
//                 }}
//               >
//                 {habit.completed && <CheckCircle2 size={16} color="#fff" />}
//               </View>

//               <View style={{ flex: 1 }}>
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     fontWeight: "600",
//                     color: habit.completed ? "#374151" : "#6B7280",
//                     textDecorationLine: habit.completed
//                       ? "line-through"
//                       : "none",
//                   }}
//                 >
//                   {habit.name}
//                 </Text>
//               </View>

//               <View style={{ flexDirection: "row", alignItems: "center" }}>
//                 <Flame size={16} color="#F97316" />
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontWeight: "600",
//                     color: "#F97316",
//                     marginLeft: 4,
//                   }}
//                 >
//                   {habit.streak}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Goals Progress */}
//         <View
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: 16,
//             padding: 20,
//             marginBottom: 20,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.1,
//             shadowRadius: 3,
//             elevation: 2,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginBottom: 16,
//             }}
//           >
//             <Target size={24} color="#EF4444" />
//             <Text
//               style={{
//                 fontSize: 18,
//                 fontWeight: "700",
//                 color: "#1E293B",
//                 marginLeft: 8,
//               }}
//             >
//               Goal Progress
//             </Text>
//           </View>

//           {dashboardData.goals.map((goal, index) => (
//             <View
//               key={goal.id}
//               style={{
//                 marginBottom: index === dashboardData.goals.length - 1 ? 0 : 16,
//               }}
//             >
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: 8,
//                 }}
//               >
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     fontWeight: "600",
//                     color: "#374151",
//                     flex: 1,
//                   }}
//                 >
//                   {goal.title}
//                 </Text>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontWeight: "600",
//                     color: "#64748B",
//                   }}
//                 >
//                   {goal.progress}%
//                 </Text>
//               </View>

//               <View
//                 style={{
//                   backgroundColor: "#F1F5F9",
//                   height: 8,
//                   borderRadius: 4,
//                   overflow: "hidden",
//                 }}
//               >
//                 <View
//                   style={{
//                     backgroundColor: "#EF4444",
//                     height: "100%",
//                     width: `${goal.progress}%`,
//                     borderRadius: 4,
//                   }}
//                 />
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Recent Activity */}
//         <View
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: 16,
//             padding: 20,
//             marginBottom: 20,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.1,
//             shadowRadius: 3,
//             elevation: 2,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginBottom: 16,
//             }}
//           >
//             <Clock size={24} color="#64748B" />
//             <Text
//               style={{
//                 fontSize: 18,
//                 fontWeight: "700",
//                 color: "#1E293B",
//                 marginLeft: 8,
//               }}
//             >
//               Recent Activity
//             </Text>
//           </View>

//           {dashboardData.recentActivities.map((activity, index) => (
//             <View
//               key={activity.id}
//               style={{
//                 flexDirection: "row",
//                 alignItems: "flex-start",
//                 paddingVertical: 8,
//                 borderBottomWidth:
//                   index === dashboardData.recentActivities.length - 1 ? 0 : 1,
//                 borderBottomColor: "#F1F5F9",
//               }}
//             >
//               <View
//                 style={{
//                   width: 8,
//                   height: 8,
//                   borderRadius: 4,
//                   backgroundColor: "#3B82F6",
//                   marginTop: 6,
//                   marginRight: 12,
//                 }}
//               />

//               <View style={{ flex: 1 }}>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontWeight: "500",
//                     color: "#374151",
//                     marginBottom: 2,
//                   }}
//                 >
//                   {activity.text}
//                 </Text>
//                 <Text
//                   style={{
//                     fontSize: 12,
//                     color: "#64748B",
//                   }}
//                 >
//                   {activity.time}
//                 </Text>
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Quick Actions */}
//         <View
//           style={{
//             flexDirection: "row",
//             gap: 12,
//             marginBottom: 20,
//           }}
//         >
//           <TouchableOpacity
//             style={{
//               flex: 1,
//               backgroundColor: "#fff",
//               borderRadius: 12,
//               padding: 16,
//               alignItems: "center",
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 1 },
//               shadowOpacity: 0.1,
//               shadowRadius: 3,
//               elevation: 2,
//             }}
//           >
//             <Brain size={24} color="#8B5CF6" />
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontWeight: "600",
//                 color: "#374151",
//                 marginTop: 8,
//               }}
//             >
//               AI Insights
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => router.push("/task/new")}
//             style={{
//               flex: 1,
//               backgroundColor: "#fff",
//               borderRadius: 12,
//               padding: 16,
//               alignItems: "center",
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 1 },
//               shadowOpacity: 0.1,
//               shadowRadius: 3,
//               elevation: 2,
//             }}
//           >
//             <Plus size={24} color="#10B981" />
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontWeight: "600",
//                 color: "#374151",
//                 marginTop: 8,
//               }}
//             >
//               Add Task
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={{
//               flex: 1,
//               backgroundColor: "#fff",
//               borderRadius: 12,
//               padding: 16,
//               alignItems: "center",
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 1 },
//               shadowOpacity: 0.1,
//               shadowRadius: 3,
//               elevation: 2,
//             }}
//           >
//             <Timer size={24} color="#F59E0B" />
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontWeight: "600",
//                 color: "#374151",
//                 marginTop: 8,
//               }}
//             >
//               Focus Mode
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }
