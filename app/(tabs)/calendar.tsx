import { useGetCurrentDateTime } from "@/hooks/use-get-current-date-time";
import { usePallet } from "@/hooks/use-pallet";
import DateSelector from "@/pages/task-viewer/date-selector";
import TaskList from "@/pages/task-viewer/task-list";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarScreen() {
  const { date, day, month } = useGetCurrentDateTime();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const pallet = usePallet();
  console.log(selectedDate, "selectedDate in calendar screen");
  return (
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <View>
        <Text style={{ fontSize: 34, fontWeight: "700" }}>
          {month}
          <Text
            style={{ color: pallet.shade1, fontSize: 38, fontWeight: "800" }}
          >
            {" "}
            {date}
          </Text>
        </Text>
      </View>
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <TaskList selectedDate={selectedDate} />
    </SafeAreaView>
  );
}

// import { StatusBar } from "expo-status-bar";
// import {
//   AlertCircle,
//   Calendar,
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   Circle,
//   Clock,
//   Coffee,
//   Plus,
//   Timer,
// } from "lucide-react-native";
// import { useMemo, useState } from "react";
// import {
//   Pressable,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// // Sample data based on the API response format
// const sampleTasks = [
//   {
//     _id: "68f4f67ece1f53bd75bc54b8",
//     userId: "user_33yAvVPP8NDOdO1peRCOwEGrAF7",
//     taskName: "Jai mahadev ji ki",
//     taskDescription: "Bala ji",
//     taskStartDateTime: "2025-10-28T15:00:00.000Z",
//     endTime: "2025-10-28T15:30:00.000Z",
//     isDone: false,
//     isHabbit: false,
//     duration: { hours: 0, minutes: 30 },
//     priority: 2,
//     frequency: [0, 8],
//     category: "Personal",
//     createdAt: "2025-10-19T14:32:30.265Z",
//     updatedAt: "2025-10-19T14:32:30.265Z",
//   },
//   {
//     _id: "6900d6ea32803a7aa4b8f918",
//     userId: "user_33yAvVPP8NDOdO1peRCOwEGrAF7",
//     taskName: "T1",
//     taskDescription: "",
//     taskStartDateTime: "2025-10-28T14:44:49.548Z",
//     endTime: "2025-10-28T15:14:49.548Z",
//     isDone: false,
//     isHabbit: false,
//     duration: { hours: 0, minutes: 30 },
//     priority: 0,
//     frequency: [0],
//     category: "Work",
//     createdAt: "2025-10-28T14:44:58.688Z",
//     updatedAt: "2025-10-28T14:44:58.688Z",
//   },
//   {
//     _id: "6900d72f32803a7aa4b8f91d",
//     userId: "user_33yAvVPP8NDOdO1peRCOwEGrAF7",
//     taskName: "T2 absh",
//     taskDescription: "",
//     taskStartDateTime: "2025-10-28T15:46:00.000Z",
//     endTime: "2025-10-28T16:16:00.000Z",
//     isDone: false,
//     isHabbit: false,
//     duration: { hours: 0, minutes: 30 },
//     priority: 0,
//     frequency: [0],
//     category: "Personal",
//     createdAt: "2025-10-28T14:46:07.264Z",
//     updatedAt: "2025-10-28T14:46:07.264Z",
//   },
//   {
//     _id: "6900d72f32803a7aa4b8f91e",
//     userId: "user_33yAvVPP8NDOdO1peRCOwEGrAF7",
//     taskName: "Team Meeting",
//     taskDescription: "Weekly standup meeting",
//     taskStartDateTime: "2025-10-29T10:00:00.000Z",
//     endTime: "2025-10-29T11:00:00.000Z",
//     isDone: false,
//     isHabbit: false,
//     duration: { hours: 1, minutes: 0 },
//     priority: 1,
//     frequency: [1],
//     category: "Work",
//     createdAt: "2025-10-28T14:46:07.264Z",
//     updatedAt: "2025-10-28T14:46:07.264Z",
//   },
//   {
//     _id: "6900d72f32803a7aa4b8f91f",
//     userId: "user_33yAvVPP8NDOdO1peRCOwEGrAF7",
//     taskName: "Grocery Shopping",
//     taskDescription: "Buy weekly groceries",
//     taskStartDateTime: "2025-10-30T16:00:00.000Z",
//     endTime: "2025-10-30T17:30:00.000Z",
//     isDone: true,
//     isHabbit: false,
//     duration: { hours: 1, minutes: 30 },
//     priority: 0,
//     frequency: [2],
//     category: "Personal",
//     createdAt: "2025-10-28T14:46:07.264Z",
//     updatedAt: "2025-10-28T14:46:07.264Z",
//   },
// ];

// export default function TaskTracker() {
//   const insets = useSafeAreaInsets();

//   const [currentWeekStart, setCurrentWeekStart] = useState(() => {
//     const today = new Date();
//     const dayOfWeek = today.getDay();
//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - dayOfWeek);
//     startOfWeek.setHours(0, 0, 0, 0);
//     return startOfWeek;
//   });

//   const [selectedDate, setSelectedDate] = useState(() => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return today;
//   });

//   // Generate week days
//   const weekDays = useMemo(() => {
//     const days = [];
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(currentWeekStart);
//       date.setDate(currentWeekStart.getDate() + i);
//       days.push(date);
//     }
//     return days;
//   }, [currentWeekStart]);

//   // Filter tasks for selected date
//   const tasksForSelectedDate = useMemo(() => {
//     return sampleTasks.filter((task) => {
//       const taskDate = new Date(task.taskStartDateTime);
//       taskDate.setHours(0, 0, 0, 0);
//       return taskDate.getTime() === selectedDate.getTime();
//     });
//   }, [selectedDate]);

//   const navigateWeek = (direction) => {
//     const newWeekStart = new Date(currentWeekStart);
//     newWeekStart.setDate(currentWeekStart.getDate() + direction * 7);
//     setCurrentWeekStart(newWeekStart);
//   };

//   // Generate timeline items (tasks + gaps)
//   const timelineItems = useMemo(() => {
//     if (tasksForSelectedDate.length === 0) return [];

//     // Sort tasks by start time
//     const sortedTasks = [...tasksForSelectedDate].sort(
//       (a, b) => new Date(a.taskStartDateTime) - new Date(b.taskStartDateTime)
//     );

//     const items = [];
//     const dayStart = new Date(selectedDate);
//     dayStart.setHours(6, 0, 0, 0); // Start timeline at 6 AM

//     let currentTime = dayStart;

//     sortedTasks.forEach((task, index) => {
//       const taskStart = new Date(task.taskStartDateTime);
//       const taskEnd = new Date(task.endTime);

//       // Check for gap before this task
//       const gapDuration = (taskStart - currentTime) / (1000 * 60 * 60); // hours

//       if (gapDuration >= 2) {
//         items.push({
//           type: "gap",
//           id: `gap-${index}`,
//           startTime: currentTime,
//           endTime: taskStart,
//           duration: gapDuration,
//         });
//       }

//       // Add the task
//       items.push({
//         type: "task",
//         ...task,
//         startTime: taskStart,
//         endTime: taskEnd,
//       });

//       currentTime = taskEnd;
//     });

//     // Check for gap after last task until 10 PM
//     const dayEnd = new Date(selectedDate);
//     dayEnd.setHours(22, 0, 0, 0);

//     const finalGapDuration = (dayEnd - currentTime) / (1000 * 60 * 60);
//     if (finalGapDuration >= 2) {
//       items.push({
//         type: "gap",
//         id: "gap-final",
//         startTime: currentTime,
//         endTime: dayEnd,
//         duration: finalGapDuration,
//       });
//     }

//     return items;
//   }, [tasksForSelectedDate, selectedDate]);

//   const formatTimeShort = (date) => {
//     return date.toLocaleTimeString("en-US", {
//       hour: "numeric",
//       hour12: true,
//     });
//   };

//   const formatTimeRange = (start, end) => {
//     return `${formatTimeShort(start)} - ${formatTimeShort(end)}`;
//   };

//   const getTimelinePosition = (time) => {
//     const dayStart = new Date(selectedDate);
//     dayStart.setHours(6, 0, 0, 0);
//     const hoursSinceStart = (time - dayStart) / (1000 * 60 * 60);
//     return hoursSinceStart * 60; // 60px per hour
//   };

//   const formatTime = (dateString) => {
//     return new Date(dateString).toLocaleTimeString("en-US", {
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 2:
//         return { text: "#EF4444", bg: "#FEF2F2" };
//       case 1:
//         return { text: "#F97316", bg: "#FFF7ED" };
//       default:
//         return { text: "#3B82F6", bg: "#EFF6FF" };
//     }
//   };

//   const getPriorityLabel = (priority) => {
//     switch (priority) {
//       case 2:
//         return "High";
//       case 1:
//         return "Medium";
//       default:
//         return "Low";
//     }
//   };

//   const isToday = (date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return date.getTime() === today.getTime();
//   };

//   const toggleTaskCompletion = (taskId) => {
//     console.log("Toggle task completion:", taskId);
//   };

//   return (
//     <View
//       style={{ flex: 1, backgroundColor: "#F9FAFB", paddingTop: insets.top }}
//     >
//       <StatusBar style="dark" />

//       {/* Header */}
//       <View
//         style={{
//           backgroundColor: "#FFFFFF",
//           borderBottomWidth: 1,
//           borderBottomColor: "#E5E7EB",
//           paddingHorizontal: 20,
//           paddingVertical: 16,
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
//           <Calendar size={32} color="#2563EB" />
//           <Text style={{ fontSize: 24, fontWeight: "600", color: "#1F2937" }}>
//             Task Tracker
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={{
//             backgroundColor: "#2563EB",
//             paddingHorizontal: 16,
//             paddingVertical: 8,
//             borderRadius: 8,
//             flexDirection: "row",
//             alignItems: "center",
//             gap: 6,
//           }}
//         >
//           <Plus size={16} color="#FFFFFF" />
//           <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "500" }}>
//             New Task
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{
//           paddingHorizontal: 20,
//           paddingBottom: insets.bottom + 20,
//         }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Week Navigation */}
//         <View style={{ marginTop: 20, marginBottom: 24 }}>
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "space-between",
//               marginBottom: 16,
//             }}
//           >
//             <Text style={{ fontSize: 18, fontWeight: "600", color: "#1F2937" }}>
//               {currentWeekStart.toLocaleDateString("en-US", {
//                 month: "long",
//                 year: "numeric",
//               })}
//             </Text>

//             <View
//               style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
//             >
//               <TouchableOpacity
//                 onPress={() => navigateWeek(-1)}
//                 style={{
//                   padding: 8,
//                   borderRadius: 8,
//                   backgroundColor: "#F3F4F6",
//                 }}
//               >
//                 <ChevronLeft size={20} color="#4B5563" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => navigateWeek(1)}
//                 style={{
//                   padding: 8,
//                   borderRadius: 8,
//                   backgroundColor: "#F3F4F6",
//                 }}
//               >
//                 <ChevronRight size={20} color="#4B5563" />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Week Days */}
//           <View style={{ flexDirection: "row", gap: 8 }}>
//             {weekDays.map((day, index) => {
//               const isSelected = selectedDate.getTime() === day.getTime();
//               const isTodayDate = isToday(day);

//               return (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => setSelectedDate(day)}
//                   style={{
//                     flex: 1,
//                     padding: 12,
//                     borderRadius: 12,
//                     alignItems: "center",
//                     backgroundColor: isSelected
//                       ? "#2563EB"
//                       : isTodayDate
//                       ? "#EFF6FF"
//                       : "#FFFFFF",
//                     borderWidth: 2,
//                     borderColor: isSelected
//                       ? "#2563EB"
//                       : isTodayDate
//                       ? "#DBEAFE"
//                       : "#E5E7EB",
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 12,
//                       fontWeight: "500",
//                       color: isSelected
//                         ? "#FFFFFF"
//                         : isTodayDate
//                         ? "#2563EB"
//                         : "#6B7280",
//                       marginBottom: 4,
//                     }}
//                   >
//                     {day.toLocaleDateString("en-US", { weekday: "short" })}
//                   </Text>

//                   <Text
//                     style={{
//                       fontSize: 18,
//                       fontWeight: "600",
//                       color: isSelected
//                         ? "#FFFFFF"
//                         : isTodayDate
//                         ? "#2563EB"
//                         : "#1F2937",
//                     }}
//                   >
//                     {day.getDate()}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>

//         {/* Selected Date Header */}
//         <View style={{ marginBottom: 20 }}>
//           <Text
//             style={{
//               fontSize: 20,
//               fontWeight: "600",
//               color: "#1F2937",
//               marginBottom: 8,
//             }}
//           >
//             {selectedDate.toLocaleDateString("en-US", {
//               weekday: "long",
//               month: "long",
//               day: "numeric",
//             })}
//           </Text>
//           <Text style={{ fontSize: 16, color: "#6B7280" }}>
//             {tasksForSelectedDate.length} task
//             {tasksForSelectedDate.length !== 1 ? "s" : ""} scheduled
//           </Text>
//         </View>

//         {/* Timeline View */}
//         {tasksForSelectedDate.length === 0 ? (
//           <View
//             style={{
//               backgroundColor: "#FFFFFF",
//               borderRadius: 12,
//               padding: 40,
//               alignItems: "center",
//               borderWidth: 1,
//               borderColor: "#E5E7EB",
//             }}
//           >
//             <Calendar size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
//             <Text
//               style={{
//                 fontSize: 18,
//                 fontWeight: "500",
//                 color: "#6B7280",
//                 marginBottom: 8,
//               }}
//             >
//               No tasks scheduled
//             </Text>
//             <Text
//               style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center" }}
//             >
//               Add a new task to get started
//             </Text>
//           </View>
//         ) : (
//           <View style={{ flexDirection: "row" }}>
//             {/* Timeline */}
//             <View style={{ width: 60, marginRight: 16 }}>
//               {Array.from({ length: 17 }, (_, i) => i + 6).map((hour) => (
//                 <View
//                   key={hour}
//                   style={{ height: 60, justifyContent: "center" }}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 12,
//                       color: "#6B7280",
//                       textAlign: "center",
//                       fontWeight: "500",
//                     }}
//                   >
//                     {hour === 12
//                       ? "12 PM"
//                       : hour > 12
//                       ? `${hour - 12} PM`
//                       : `${hour} AM`}
//                   </Text>
//                 </View>
//               ))}
//             </View>

//             {/* Timeline Content */}
//             <View style={{ flex: 1 }}>
//               {timelineItems.map((item) => {
//                 if (item.type === "gap") {
//                   return (
//                     <TouchableOpacity
//                       key={item.id}
//                       style={{
//                         backgroundColor: "#F0F9FF",
//                         borderRadius: 8,
//                         padding: 16,
//                         marginBottom: 8,
//                         borderWidth: 2,
//                         borderColor: "#0EA5E9",
//                         borderStyle: "dashed",
//                       }}
//                     >
//                       <View
//                         style={{
//                           flexDirection: "row",
//                           alignItems: "center",
//                           gap: 8,
//                           marginBottom: 8,
//                         }}
//                       >
//                         <Coffee size={18} color="#0EA5E9" />
//                         <Text
//                           style={{
//                             fontSize: 14,
//                             fontWeight: "600",
//                             color: "#0369A1",
//                           }}
//                         >
//                           Free Time - {Math.floor(item.duration)}h{" "}
//                           {Math.round((item.duration % 1) * 60)}m
//                         </Text>
//                       </View>

//                       <Text
//                         style={{
//                           fontSize: 12,
//                           color: "#0369A1",
//                           marginBottom: 8,
//                         }}
//                       >
//                         {formatTimeRange(item.startTime, item.endTime)}
//                       </Text>

//                       <View
//                         style={{
//                           flexDirection: "row",
//                           alignItems: "center",
//                           gap: 6,
//                         }}
//                       >
//                         <Plus size={14} color="#0EA5E9" />
//                         <Text
//                           style={{
//                             fontSize: 12,
//                             fontWeight: "500",
//                             color: "#0EA5E9",
//                           }}
//                         >
//                           Schedule a task to boost productivity
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   );
//                 }

//                 // Task item
//                 const priorityColors = getPriorityColor(item.priority);

//                 return (
//                   <View
//                     key={item._id}
//                     style={{
//                       backgroundColor: "#FFFFFF",
//                       borderRadius: 12,
//                       padding: 16,
//                       marginBottom: 8,
//                       borderWidth: 1,
//                       borderColor: "#E5E7EB",
//                     }}
//                   >
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "flex-start",
//                         gap: 12,
//                       }}
//                     >
//                       <Pressable
//                         onPress={() => toggleTaskCompletion(item._id)}
//                         style={{ marginTop: 2 }}
//                       >
//                         {item.isDone ? (
//                           <CheckCircle2 size={20} color="#10B981" />
//                         ) : (
//                           <Circle size={20} color="#9CA3AF" />
//                         )}
//                       </Pressable>

//                       <View style={{ flex: 1 }}>
//                         <Text
//                           style={{
//                             fontSize: 16,
//                             fontWeight: "600",
//                             color: item.isDone ? "#9CA3AF" : "#1F2937",
//                             marginBottom: 8,
//                             textDecorationLine: item.isDone
//                               ? "line-through"
//                               : "none",
//                           }}
//                         >
//                           {item.taskName}
//                         </Text>

//                         {item.taskDescription && (
//                           <Text
//                             style={{
//                               fontSize: 14,
//                               color: "#6B7280",
//                               marginBottom: 12,
//                               lineHeight: 20,
//                             }}
//                           >
//                             {item.taskDescription}
//                           </Text>
//                         )}

//                         <View style={{ gap: 8 }}>
//                           <View
//                             style={{
//                               flexDirection: "row",
//                               alignItems: "center",
//                               gap: 6,
//                             }}
//                           >
//                             <Clock size={16} color="#6B7280" />
//                             <Text style={{ fontSize: 14, color: "#6B7280" }}>
//                               {formatTime(item.taskStartDateTime)} -{" "}
//                               {formatTime(item.endTime)}
//                             </Text>
//                           </View>

//                           <View
//                             style={{
//                               flexDirection: "row",
//                               alignItems: "center",
//                               gap: 16,
//                             }}
//                           >
//                             <View
//                               style={{
//                                 flexDirection: "row",
//                                 alignItems: "center",
//                                 gap: 6,
//                               }}
//                             >
//                               <Timer size={16} color="#6B7280" />
//                               <Text style={{ fontSize: 14, color: "#6B7280" }}>
//                                 {item.duration.hours > 0
//                                   ? `${item.duration.hours}h `
//                                   : ""}
//                                 {item.duration.minutes}m
//                               </Text>
//                             </View>

//                             {item.category && (
//                               <View
//                                 style={{
//                                   backgroundColor: "#F3F4F6",
//                                   paddingHorizontal: 8,
//                                   paddingVertical: 4,
//                                   borderRadius: 6,
//                                 }}
//                               >
//                                 <Text
//                                   style={{
//                                     fontSize: 12,
//                                     fontWeight: "500",
//                                     color: "#374151",
//                                   }}
//                                 >
//                                   {item.category}
//                                 </Text>
//                               </View>
//                             )}
//                           </View>
//                         </View>
//                       </View>

//                       <View style={{ alignItems: "flex-end", gap: 4 }}>
//                         <View
//                           style={{
//                             backgroundColor: priorityColors.bg,
//                             paddingHorizontal: 8,
//                             paddingVertical: 4,
//                             borderRadius: 6,
//                             flexDirection: "row",
//                             alignItems: "center",
//                             gap: 4,
//                           }}
//                         >
//                           <Text
//                             style={{
//                               fontSize: 12,
//                               fontWeight: "500",
//                               color: priorityColors.text,
//                             }}
//                           >
//                             {getPriorityLabel(item.priority)}
//                           </Text>

//                           {item.priority === 2 && (
//                             <AlertCircle
//                               size={14}
//                               color={priorityColors.text}
//                             />
//                           )}
//                         </View>
//                       </View>
//                     </View>
//                   </View>
//                 );
//               })}
//             </View>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }
