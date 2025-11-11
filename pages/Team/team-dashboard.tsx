import BackHeader from "@/components/ui/back-header";
import { Button } from "@/components/ui/button";
import AnimatedProgressRing from "@/components/ui/progress-ring";
import { ScrollView } from "@/components/ui/scroll-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { useCurrentTeamData } from "@/contexts/team-data-context";
import { usePallet } from "@/hooks/use-pallet";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { Calendar, LogOut, Trash2, Users } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DeleteTeam, exitTeam } from "./API/api-calls";

function TeamDashboard() {
  // Example stats

  const handlePress = (route: string) => {
    // Implement navigation e.g., router.push(route)
    console.log("Navigate to", route);
  };
  const { teamid } = useLocalSearchParams();
  const pathName = usePathname();

  const router = useRouter();

  const { currentTeamData } = useCurrentTeamData();
  const { user } = useUser();
  const userId = user?.id;
  console.log(currentTeamData);

  const totalCount = currentTeamData.tasks?.length || 0;
  const assignedTasks =
    currentTeamData.tasks?.filter((task) =>
      task.assignees?.some((assignee) => assignee.userId === userId)
    ) || [];
  const completedCount = assignedTasks.filter((task) => task.isDone).length;
  const remainingCount = assignedTasks.filter((task) => !task.isDone).length;

  const totalCompleted = () =>
    currentTeamData?.tasks?.filter((task) => task.isDone).length;

  const stats = [
    { label: "Completed", value: completedCount, color: "#17c964" },
    { label: "Remaining", value: remainingCount, color: "#F87171" },
    { label: "Assigned", value: assignedTasks.length, color: "#4299e1" },
  ];

  const pallet = usePallet();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const del = await DeleteTeam(teamid);
      if (del.success) router.replace("/team");
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView>
        <BackHeader title={currentTeamData?.teamName ?? "Team"} />
        {/* TOP CARD with chart + stats */}
        <ScrollView>
          <View style={styles.card}>
            <Text
              variant="heading"
              style={{ textAlign: "center", color: pallet.shade1 }}
            >
              Team Stats
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}
            >
              <Text style={styles.count}>{totalCount}</Text>
              <Text variant="caption">Tasks</Text>
            </View>

            <Text style={styles.monthProgress}>
              Task Completion{" "}
              <Text style={{ color: "#17c964", fontWeight: "bold" }}>
                {totalCount === 0
                  ? "0%"
                  : Math.round(
                      (totalCompleted() / currentTeamData?.tasks?.length) * 100
                    )}
                %
              </Text>
            </Text>
            <Tabs defaultValue="account">
              <TabsList
                style={{
                  width: 140,
                  borderRadius: 10,
                  margin: "auto",
                  height: 40,
                }}
              >
                <TabsTrigger style={{ borderRadius: 200 }} value="account">
                  <Text>Team</Text>
                </TabsTrigger>
                <TabsTrigger style={{ borderRadius: 20 }} value="followers">
                  <Text>Me</Text>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account" style={{ width: "100%" }}>
                <View style={{ alignItems: "center", gap: 16 }}>
                  <AnimatedProgressRing
                    percentage={Math.round((completedCount / totalCount) * 100)}
                  />
                  {/* Bottom labels */}
                  <View style={styles.statsRow}>
                    {stats.map((s) => (
                      <View key={s.label} style={styles.statBox}>
                        <Text
                          style={[
                            styles.statValue,
                            s.color && { color: s.color },
                          ]}
                        >
                          {s.value}
                        </Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TabsContent>
              <TabsContent value="followers" style={{ width: "100%" }}>
                <View
                  style={{
                    paddingHorizontal: 16,
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <AnimatedProgressRing
                    percentage={Math.round(
                      (completedCount / assignedTasks.length) * 100
                    )}
                  />
                  {/* Bottom labels */}
                  <View style={styles.statsRow}>
                    {stats.map((s) => (
                      <View key={s.label} style={styles.statBox}>
                        <Text
                          style={[
                            styles.statValue,
                            s.color && { color: s.color },
                          ]}
                        >
                          {s.value}
                        </Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TabsContent>
            </Tabs>
          </View>

          {/* Action rows */}
          <View style={styles.actionRow}>
            <Button
              variant="default"
              style={{ borderRadius: 12, backgroundColor: pallet.buttonBg }}
              textStyle={{ color: pallet.ButtonText }}
              icon={Calendar}
              onPress={() => router.replace(`/${teamid}/teamTaskPage`)}
              disabled={deleteLoading}
            >
              View Tasks
            </Button>
            <Button
              variant="default"
              style={{
                borderRadius: 12,
                backgroundColor: pallet.buttonBg,
              }}
              textStyle={{ color: pallet.ButtonText }}
              icon={Users}
              onPress={() => router.replace(`/${teamid}/teamMembers`)}
              disabled={deleteLoading}
            >
              Manage Members
            </Button>
            <Button
              variant="destructive"
              style={{ borderRadius: 12, backgroundColor: pallet.errorBg }}
              textStyle={{ color: pallet.errorText }}
              icon={LogOut}
              onPress={() => {
                Alert.alert(
                  "Confirm Exit",
                  "Are you sure you want to exit the team?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Exit",
                      style: "destructive",
                      onPress: () => exitTeam(teamid),
                    },
                  ],
                  { cancelable: false }
                );
              }}
              disabled={deleteLoading}
            >
              Exit Team
            </Button>
            <Button
              variant="destructive"
              style={{ borderRadius: 12, backgroundColor: pallet.errorBg }}
              textStyle={{ color: pallet.errorText }}
              icon={Trash2}
              onPress={() => {
                Alert.alert(
                  "Confirm Delete",
                  "Are you sure you want to delete the team?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => handleDelete(),
                    },
                  ],
                  { cancelable: false }
                );
              }}
              loading={deleteLoading}
              disabled={deleteLoading}
            >
              Delete Team
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    gap: 2,
  },
  overviewLabel: {
    color: "#7a7a7a",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  count: {
    fontSize: 32,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  monthProgress: {
    color: "#7a7a7a",
    fontSize: 14,
    marginBottom: 18,
  },
  chartRow: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  chartBox: {
    alignSelf: "center",
    width: 120,
    height: 120,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 2,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  actionRow: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 4,
    overflow: "hidden",
    gap: 8,
    marginBottom: 350,
    padding: 20,
  },
  actionBtn: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  actionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
  },
});

export default TeamDashboard;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Pressable,
//   Animated,
// } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";
// import {
//   TrendingUp,
//   Users,
//   CheckCircle2,
//   Clock,
//   Target,
//   Award,
//   Activity,
//   Calendar,
//   Plus,
//   ArrowRight,
//   Zap,
//   Star,
//   BarChart3,
//   Bell,
//   Search,
// } from "lucide-react-native";
// import Svg, {
//   Circle as SvgCircle,
//   Defs,
//   LinearGradient as SvgLinearGradient,
//   Stop,
// } from "react-native-svg";

// const AnimatedSvgCircle = Animated.createAnimatedComponent(SvgCircle);

// const AnimatedProgressRing = ({
//   percentage,
//   size = 160,
//   strokeWidth = 12,
//   delay = 0,
// }) => {
//   const animatedValue = useRef(new Animated.Value(0)).current;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = radius * 2 * Math.PI;

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       Animated.timing(animatedValue, {
//         toValue: percentage,
//         duration: 2000,
//         useNativeDriver: false,
//       }).start();
//     }, delay);

//     return () => clearTimeout(timer);
//   }, [percentage, delay]);

//   return (
//     <View style={{ width: size, height: size }}>
//       <Svg
//         width={size}
//         height={size}
//         style={{ transform: [{ rotate: "-90deg" }] }}
//       >
//         <Defs>
//           <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//             <Stop offset="0%" stopColor="#8b5cf6" />
//             <Stop offset="50%" stopColor="#3b82f6" />
//             <Stop offset="100%" stopColor="#06b6d4" />
//           </SvgLinearGradient>
//         </Defs>
//         {/* Background circle */}
//         <SvgCircle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke="#f1f5f9"
//           strokeWidth={strokeWidth}
//           fill="transparent"
//         />
//         {/* Animated progress circle */}
//         <AnimatedSvgCircle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke="url(#gradient)"
//           strokeWidth={strokeWidth}
//           fill="transparent"
//           strokeDasharray={circumference}
//           strokeDashoffset={animatedValue.interpolate({
//             inputRange: [0, 100],
//             outputRange: [circumference, 0],
//           })}
//           strokeLinecap="round"
//         />
//       </Svg>
//       <View
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Text style={{ fontSize: 36, fontWeight: "bold", color: "#1f2937" }}>
//           {percentage}%
//         </Text>
//         <Text style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
//           Complete
//         </Text>
//       </View>
//     </View>
//   );
// };

// const StatCard = ({
//   title,
//   value,
//   subtitle,
//   icon: Icon,
//   color,
//   bgColor,
//   trend,
// }) => (
//   <View
//     style={{
//       backgroundColor: "#ffffff",
//       borderRadius: 24,
//       padding: 20,
//       flex: 1,
//       marginHorizontal: 6,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 8 },
//       shadowOpacity: 0.1,
//       shadowRadius: 20,
//       elevation: 8,
//     }}
//   >
//     <View
//       style={{
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         marginBottom: 12,
//       }}
//     >
//       <View
//         style={{
//           width: 40,
//           height: 40,
//           borderRadius: 12,
//           backgroundColor: bgColor,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Icon size={20} color={color} />
//       </View>
//       {trend && (
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <TrendingUp size={16} color="#10b981" />
//           <Text
//             style={{
//               fontSize: 12,
//               color: "#10b981",
//               fontWeight: "600",
//               marginLeft: 4,
//             }}
//           >
//             +{trend}%
//           </Text>
//         </View>
//       )}
//     </View>
//     <Text
//       style={{
//         fontSize: 28,
//         fontWeight: "bold",
//         color: "#1f2937",
//         marginBottom: 4,
//       }}
//     >
//       {value}
//     </Text>
//     <Text style={{ fontSize: 13, color: "#64748b", fontWeight: "500" }}>
//       {title}
//     </Text>
//     <Text style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
//       {subtitle}
//     </Text>
//   </View>
// );

// const QuickActionCard = ({
//   title,
//   subtitle,
//   icon: Icon,
//   color,
//   bgColor,
//   onPress,
// }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     style={{
//       backgroundColor: "#ffffff",
//       borderRadius: 20,
//       padding: 20,
//       flexDirection: "row",
//       alignItems: "center",
//       marginBottom: 12,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.08,
//       shadowRadius: 12,
//       elevation: 4,
//     }}
//   >
//     <View
//       style={{
//         width: 52,
//         height: 52,
//         borderRadius: 16,
//         backgroundColor: bgColor,
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: 16,
//       }}
//     >
//       <Icon size={24} color={color} />
//     </View>
//     <View style={{ flex: 1 }}>
//       <Text
//         style={{
//           fontSize: 16,
//           fontWeight: "600",
//           color: "#1f2937",
//           marginBottom: 2,
//         }}
//       >
//         {title}
//       </Text>
//       <Text style={{ fontSize: 13, color: "#64748b" }}>{subtitle}</Text>
//     </View>
//     <ArrowRight size={20} color="#94a3b8" />
//   </TouchableOpacity>
// );

// export default function TeamDashboard() {
//   const insets = useSafeAreaInsets();
//   const [selectedPeriod, setSelectedPeriod] = useState("Week");

//   const periods = ["Day", "Week", "Month", "Quarter"];

//   return (
//     <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
//       <StatusBar style="light" />

//       {/* Header with stunning gradient */}
//       <LinearGradient
//         colors={["#667eea", "#764ba2", "#f093fb"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={{
//           paddingTop: insets.top + 20,
//           paddingHorizontal: 24,
//           paddingBottom: 40,
//         }}
//       >
//         {/* Top Bar */}
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: 24,
//           }}
//         >
//           <View>
//             <Text
//               style={{
//                 fontSize: 16,
//                 color: "rgba(255,255,255,0.8)",
//                 fontWeight: "500",
//               }}
//             >
//               Good morning
//             </Text>
//             <Text
//               style={{
//                 fontSize: 24,
//                 color: "#ffffff",
//                 fontWeight: "bold",
//                 marginTop: 4,
//               }}
//             >
//               Sarah Johnson
//             </Text>
//           </View>
//           <View style={{ flexDirection: "row", gap: 12 }}>
//             <TouchableOpacity
//               style={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: 22,
//                 backgroundColor: "rgba(255,255,255,0.2)",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Search size={20} color="#ffffff" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: 22,
//                 backgroundColor: "rgba(255,255,255,0.2)",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Bell size={20} color="#ffffff" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Period Selector */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={{ marginBottom: 20 }}
//           contentContainerStyle={{ paddingHorizontal: 0 }}
//         >
//           {periods.map((period) => (
//             <Pressable
//               key={period}
//               onPress={() => setSelectedPeriod(period)}
//               style={{
//                 paddingHorizontal: 20,
//                 paddingVertical: 10,
//                 borderRadius: 20,
//                 backgroundColor:
//                   selectedPeriod === period
//                     ? "rgba(255,255,255,0.3)"
//                     : "rgba(255,255,255,0.1)",
//                 marginRight: 12,
//                 borderWidth: 1,
//                 borderColor:
//                   selectedPeriod === period
//                     ? "rgba(255,255,255,0.5)"
//                     : "rgba(255,255,255,0.2)",
//               }}
//             >
//               <Text
//                 style={{
//                   color: "#ffffff",
//                   fontSize: 14,
//                   fontWeight: selectedPeriod === period ? "600" : "500",
//                 }}
//               >
//                 {period}
//               </Text>
//             </Pressable>
//           ))}
//         </ScrollView>

//         {/* Main Stats */}
//         <View
//           style={{
//             backgroundColor: "rgba(255,255,255,0.15)",
//             borderRadius: 24,
//             padding: 24,
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <View>
//             <Text
//               style={{
//                 fontSize: 48,
//                 fontWeight: "bold",
//                 color: "#ffffff",
//                 lineHeight: 52,
//               }}
//             >
//               87%
//             </Text>
//             <Text
//               style={{
//                 fontSize: 16,
//                 color: "rgba(255,255,255,0.9)",
//                 marginTop: 4,
//               }}
//             >
//               Team Performance
//             </Text>
//             <Text
//               style={{
//                 fontSize: 13,
//                 color: "rgba(255,255,255,0.7)",
//                 marginTop: 2,
//               }}
//             >
//               +12% from last week
//             </Text>
//           </View>
//           <View style={{ alignItems: "center" }}>
//             <View
//               style={{
//                 width: 60,
//                 height: 60,
//                 borderRadius: 30,
//                 backgroundColor: "rgba(255,255,255,0.2)",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 marginBottom: 8,
//               }}
//             >
//               <Zap size={28} color="#ffffff" />
//             </View>
//             <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
//               Productivity
//             </Text>
//           </View>
//         </View>
//       </LinearGradient>

//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Progress Circle Section */}
//         <View
//           style={{ paddingHorizontal: 24, marginTop: -20, marginBottom: 30 }}
//         >
//           <View
//             style={{
//               backgroundColor: "#ffffff",
//               borderRadius: 28,
//               padding: 32,
//               alignItems: "center",
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 12 },
//               shadowOpacity: 0.15,
//               shadowRadius: 24,
//               elevation: 12,
//             }}
//           >
//             <AnimatedProgressRing percentage={87} size={180} strokeWidth={14} />
//             <View
//               style={{
//                 flexDirection: "row",
//                 marginTop: 24,
//                 gap: 16,
//               }}
//             >
//               <View style={{ alignItems: "center" }}>
//                 <View
//                   style={{
//                     width: 12,
//                     height: 12,
//                     borderRadius: 6,
//                     backgroundColor: "#8b5cf6",
//                     marginBottom: 6,
//                   }}
//                 />
//                 <Text
//                   style={{ fontSize: 12, color: "#64748b", fontWeight: "500" }}
//                 >
//                   Completed
//                 </Text>
//               </View>
//               <View style={{ alignItems: "center" }}>
//                 <View
//                   style={{
//                     width: 12,
//                     height: 12,
//                     borderRadius: 6,
//                     backgroundColor: "#3b82f6",
//                     marginBottom: 6,
//                   }}
//                 />
//                 <Text
//                   style={{ fontSize: 12, color: "#64748b", fontWeight: "500" }}
//                 >
//                   In Progress
//                 </Text>
//               </View>
//               <View style={{ alignItems: "center" }}>
//                 <View
//                   style={{
//                     width: 12,
//                     height: 12,
//                     borderRadius: 6,
//                     backgroundColor: "#06b6d4",
//                     marginBottom: 6,
//                   }}
//                 />
//                 <Text
//                   style={{ fontSize: 12, color: "#64748b", fontWeight: "500" }}
//                 >
//                   Planned
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Stats Cards */}
//         <View style={{ paddingHorizontal: 18, marginBottom: 32 }}>
//           <Text
//             style={{
//               fontSize: 20,
//               fontWeight: "bold",
//               color: "#1f2937",
//               marginBottom: 16,
//               marginLeft: 6,
//             }}
//           >
//             Key Metrics
//           </Text>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingHorizontal: 6 }}
//           >
//             <StatCard
//               title="Active Tasks"
//               value="142"
//               subtitle="8 due today"
//               icon={CheckCircle2}
//               color="#10b981"
//               bgColor="#dcfce7"
//               trend="15"
//             />
//             <StatCard
//               title="Team Members"
//               value="24"
//               subtitle="3 online now"
//               icon={Users}
//               color="#3b82f6"
//               bgColor="#dbeafe"
//               trend="8"
//             />
//             <StatCard
//               title="Projects"
//               value="12"
//               subtitle="4 launching soon"
//               icon={Target}
//               color="#8b5cf6"
//               bgColor="#f3e8ff"
//               trend="25"
//             />
//           </ScrollView>
//         </View>

//         {/* Quick Actions */}
//         <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
//           <Text
//             style={{
//               fontSize: 20,
//               fontWeight: "bold",
//               color: "#1f2937",
//               marginBottom: 16,
//             }}
//           >
//             Quick Actions
//           </Text>

//           <QuickActionCard
//             title="Create New Project"
//             subtitle="Set up a new project with team assignments"
//             icon={Plus}
//             color="#10b981"
//             bgColor="#dcfce7"
//           />

//           <QuickActionCard
//             title="Team Performance"
//             subtitle="View detailed analytics and reports"
//             icon={BarChart3}
//             color="#3b82f6"
//             bgColor="#dbeafe"
//           />

//           <QuickActionCard
//             title="Schedule Meeting"
//             subtitle="Organize team sync and project reviews"
//             icon={Calendar}
//             color="#f59e0b"
//             bgColor="#fef3c7"
//           />

//           <QuickActionCard
//             title="Assign Tasks"
//             subtitle="Distribute work among team members"
//             icon={Activity}
//             color="#8b5cf6"
//             bgColor="#f3e8ff"
//           />
//         </View>

//         {/* Recent Activity */}
//         <View style={{ paddingHorizontal: 24 }}>
//           <Text
//             style={{
//               fontSize: 20,
//               fontWeight: "bold",
//               color: "#1f2937",
//               marginBottom: 16,
//             }}
//           >
//             Recent Activity
//           </Text>

//           <View
//             style={{
//               backgroundColor: "#ffffff",
//               borderRadius: 20,
//               padding: 20,
//               shadowColor: "#000",
//               shadowOffset: { width: 0, height: 4 },
//               shadowOpacity: 0.08,
//               shadowRadius: 12,
//               elevation: 4,
//             }}
//           >
//             {[
//               {
//                 user: "Alex Chen",
//                 action: "completed task",
//                 project: "Mobile App Design",
//                 time: "2 min ago",
//                 color: "#10b981",
//               },
//               {
//                 user: "Maria Garcia",
//                 action: "started project",
//                 project: "Website Redesign",
//                 time: "15 min ago",
//                 color: "#3b82f6",
//               },
//               {
//                 user: "James Wilson",
//                 action: "updated status",
//                 project: "API Development",
//                 time: "1 hour ago",
//                 color: "#f59e0b",
//               },
//             ].map((activity, index) => (
//               <View
//                 key={index}
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   paddingVertical: 12,
//                   borderBottomWidth: index < 2 ? 1 : 0,
//                   borderBottomColor: "#f1f5f9",
//                 }}
//               >
//                 <View
//                   style={{
//                     width: 40,
//                     height: 40,
//                     borderRadius: 20,
//                     backgroundColor: activity.color,
//                     justifyContent: "center",
//                     alignItems: "center",
//                     marginRight: 12,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color: "#ffffff",
//                       fontSize: 14,
//                       fontWeight: "600",
//                     }}
//                   >
//                     {activity.user
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")}
//                   </Text>
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text
//                     style={{
//                       fontSize: 15,
//                       fontWeight: "600",
//                       color: "#1f2937",
//                     }}
//                   >
//                     {activity.user} {activity.action}
//                   </Text>
//                   <Text
//                     style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}
//                   >
//                     {activity.project}
//                   </Text>
//                 </View>
//                 <Text style={{ fontSize: 12, color: "#94a3b8" }}>
//                   {activity.time}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       </ScrollView>

//       {/* Floating Action Button */}
//       <TouchableOpacity
//         style={{
//           position: "absolute",
//           right: 24,
//           bottom: insets.bottom + 100,
//           width: 64,
//           height: 64,
//           borderRadius: 32,
//           shadowColor: "#667eea",
//           shadowOffset: { width: 0, height: 8 },
//           shadowOpacity: 0.3,
//           shadowRadius: 16,
//           elevation: 12,
//         }}
//       >
//         <LinearGradient
//           colors={["#667eea", "#764ba2"]}
//           style={{
//             width: 64,
//             height: 64,
//             borderRadius: 32,
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Plus size={28} color="#ffffff" strokeWidth={2.5} />
//         </LinearGradient>
//       </TouchableOpacity>
//     </View>
//   );
// }
