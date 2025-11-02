// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   Platform,
// } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import {
//   useFonts,
//   Montserrat_400Regular,
//   Montserrat_500Medium,
//   Montserrat_600SemiBold,
// } from "@expo-google-fonts/montserrat";
// import {
//   X,
//   ChevronRight,
//   Brain,
//   Heart,
//   Dumbbell,
//   BookOpen,
//   Leaf,
//   Plus,
// } from "lucide-react-native";
// import { router } from "expo-router";
// import { useAppTheme } from "@/utils/theme";
// import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

// const PREDEFINED_HABITS = [
//   { name: "Meditation", category: "Wellness", icon: Brain },
//   { name: "Drink Water", category: "Health", icon: Heart },
//   { name: "Exercise", category: "Fitness", icon: Dumbbell },
//   { name: "Read", category: "Learning", icon: BookOpen },
//   { name: "Walk", category: "Activity", icon: Leaf },
// ];

// const FREQUENCIES = [
//   { label: "Daily", value: "daily" },
//   { label: "Weekly", value: "weekly" },
//   { label: "Monthly", value: "monthly" },
// ];

// export default function AddHabitScreen() {
//   const insets = useSafeAreaInsets();
//   const { colors, isDark } = useAppTheme();

//   const [habitName, setHabitName] = useState("");
//   const [habitDescription, setHabitDescription] = useState("");
//   const [selectedFrequency, setSelectedFrequency] = useState("daily");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [aiGoal, setAiGoal] = useState("");
//   const [aiSuggestions, setAiSuggestions] = useState([]);
//   const [showAISuggestions, setShowAISuggestions] = useState(false);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [saving, setSaving] = useState(false);

//   const [fontsLoaded] = useFonts({
//     Montserrat_400Regular,
//     Montserrat_500Medium,
//     Montserrat_600SemiBold,
//   });

//   if (!fontsLoaded) {
//     return null;
//   }

//   const handleAIRequest = async () => {
//     if (!aiGoal.trim()) {
//       setError("Please enter your goal");
//       return;
//     }

//     try {
//       setAiLoading(true);
//       setError("");
//       const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           messages: [
//             {
//               role: "user",
//               content: `Generate 5 specific, actionable daily habits to help me achieve this goal: "${aiGoal}". Return only a JSON array with objects containing "name" (habit name), "description" (short description), and "category" (one of: Wellness, Health, Fitness, Learning, Activity).`,
//             },
//           ],
//           json_schema: {
//             name: "habit_suggestions",
//             schema: {
//               type: "object",
//               properties: {
//                 habits: {
//                   type: "array",
//                   items: {
//                     type: "object",
//                     properties: {
//                       name: { type: "string" },
//                       description: { type: "string" },
//                       category: { type: "string" },
//                     },
//                     required: ["name", "description", "category"],
//                     additionalProperties: false,
//                   },
//                 },
//               },
//               required: ["habits"],
//               additionalProperties: false,
//             },
//           },
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to get AI suggestions");
//       }

//       const data = await response.json();
//       const parsed = JSON.parse(data.choices[0].message.content);
//       setAiSuggestions(parsed.habits || []);
//       setShowAISuggestions(true);
//     } catch (err) {
//       console.error("AI Request Error:", err);
//       setError("Failed to get AI suggestions. Please try again.");
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const handleAddPredefined = (habit) => {
//     setHabitName(habit.name);
//     setHabitDescription("");
//     setSelectedCategory(habit.category);
//     setShowAISuggestions(false);
//   };

//   const handleAddAISuggestion = (suggestion) => {
//     setHabitName(suggestion.name);
//     setHabitDescription(suggestion.description);
//     setSelectedCategory(suggestion.category);
//     setShowAISuggestions(false);
//   };

//   const handleSaveHabit = async () => {
//     if (!habitName.trim()) {
//       setError("Please enter a habit name");
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");
//       const response = await fetch("/api/habits", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: habitName,
//           description: habitDescription,
//           frequency: selectedFrequency,
//           category: selectedCategory,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to save habit");
//       }

//       setHabitName("");
//       setHabitDescription("");
//       setSelectedFrequency("daily");
//       setSelectedCategory("");
//       router.back();
//     } catch (err) {
//       console.error("Save Error:", err);
//       setError("Failed to save habit. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <>
//       <StatusBar style={isDark ? "light" : "dark"} />
//       <KeyboardAvoidingAnimatedView
//         style={{ flex: 1, backgroundColor: colors.background }}
//       >
//         <View style={{ flex: 1, backgroundColor: colors.background }}>
//           <View
//             style={{
//               backgroundColor: colors.background,
//               paddingHorizontal: 20,
//               paddingTop: insets.top + 10,
//               paddingBottom: 20,
//               borderBottomWidth: 1,
//               borderBottomColor: colors.border,
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 24,
//                   fontFamily: "Montserrat_600SemiBold",
//                   color: colors.primary,
//                 }}
//               >
//                 Add Habit
//               </Text>
//               <TouchableOpacity onPress={() => router.back()}>
//                 <X size={24} color={colors.primary} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <ScrollView
//             contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
//             showsVerticalScrollIndicator={false}
//           >
//             {/* AI Section */}
//             <View style={{ marginBottom: 24 }}>
//               <Text
//                 style={{
//                   fontSize: 16,
//                   fontFamily: "Montserrat_600SemiBold",
//                   color: colors.primary,
//                   marginBottom: 12,
//                 }}
//               >
//                 Get AI Suggestions
//               </Text>
//               <TextInput
//                 placeholder="What's your goal? (e.g., get healthier, improve sleep)"
//                 value={aiGoal}
//                 onChangeText={setAiGoal}
//                 style={{
//                   backgroundColor: colors.surface,
//                   borderWidth: 1,
//                   borderColor: colors.borderLight,
//                   borderRadius: 12,
//                   paddingHorizontal: 16,
//                   paddingVertical: 12,
//                   fontFamily: "Montserrat_400Regular",
//                   color: colors.primary,
//                   marginBottom: 12,
//                 }}
//                 placeholderTextColor={colors.placeholder}
//               />
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: colors.orange,
//                   borderRadius: 12,
//                   paddingVertical: 12,
//                   alignItems: "center",
//                 }}
//                 onPress={handleAIRequest}
//                 disabled={aiLoading}
//               >
//                 <Text
//                   style={{
//                     fontFamily: "Montserrat_600SemiBold",
//                     fontSize: 14,
//                     color: isDark ? "#000000" : "#FFFFFF",
//                   }}
//                 >
//                   {aiLoading ? "Generating..." : "Get Suggestions"}
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* Predefined Habits */}
//             <View style={{ marginBottom: 24 }}>
//               <Text
//                 style={{
//                   fontSize: 16,
//                   fontFamily: "Montserrat_600SemiBold",
//                   color: colors.primary,
//                   marginBottom: 12,
//                 }}
//               >
//                 Predefined Habits
//               </Text>
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={{ gap: 12, paddingRight: 20 }}
//                 style={{ flexGrow: 0 }}
//               >
//                 {PREDEFINED_HABITS.map((habit, idx) => {
//                   const IconComponent = habit.icon;
//                   return (
//                     <TouchableOpacity
//                       key={idx}
//                       style={{
//                         backgroundColor: colors.surface,
//                         borderWidth: 1,
//                         borderColor: colors.borderLight,
//                         borderRadius: 16,
//                         padding: 16,
//                         alignItems: "center",
//                         width: 120,
//                       }}
//                       onPress={() => handleAddPredefined(habit)}
//                     >
//                       <View
//                         style={{
//                           width: 48,
//                           height: 48,
//                           borderRadius: 24,
//                           backgroundColor: colors.blueLight,
//                           justifyContent: "center",
//                           alignItems: "center",
//                           marginBottom: 8,
//                         }}
//                       >
//                         <IconComponent size={24} color={colors.blue} />
//                       </View>
//                       <Text
//                         style={{
//                           fontFamily: "Montserrat_600SemiBold",
//                           fontSize: 12,
//                           color: colors.primary,
//                           textAlign: "center",
//                         }}
//                       >
//                         {habit.name}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>

//             {/* Habit Details */}
//             <View style={{ marginBottom: 24 }}>
//               <Text
//                 style={{
//                   fontSize: 16,
//                   fontFamily: "Montserrat_600SemiBold",
//                   color: colors.primary,
//                   marginBottom: 12,
//                 }}
//               >
//                 Habit Details
//               </Text>

//               <Text
//                 style={{
//                   fontSize: 12,
//                   fontFamily: "Montserrat_500Medium",
//                   color: colors.secondary,
//                   marginBottom: 8,
//                 }}
//               >
//                 Habit Name
//               </Text>
//               <TextInput
//                 placeholder="e.g., Morning Run"
//                 value={habitName}
//                 onChangeText={setHabitName}
//                 style={{
//                   backgroundColor: colors.surface,
//                   borderWidth: 1,
//                   borderColor: colors.borderLight,
//                   borderRadius: 12,
//                   paddingHorizontal: 16,
//                   paddingVertical: 12,
//                   fontFamily: "Montserrat_400Regular",
//                   color: colors.primary,
//                   marginBottom: 16,
//                 }}
//                 placeholderTextColor={colors.placeholder}
//               />

//               <Text
//                 style={{
//                   fontSize: 12,
//                   fontFamily: "Montserrat_500Medium",
//                   color: colors.secondary,
//                   marginBottom: 8,
//                 }}
//               >
//                 Description (Optional)
//               </Text>
//               <TextInput
//                 placeholder="Why is this important to you?"
//                 value={habitDescription}
//                 onChangeText={setHabitDescription}
//                 style={{
//                   backgroundColor: colors.surface,
//                   borderWidth: 1,
//                   borderColor: colors.borderLight,
//                   borderRadius: 12,
//                   paddingHorizontal: 16,
//                   paddingVertical: 12,
//                   fontFamily: "Montserrat_400Regular",
//                   color: colors.primary,
//                   marginBottom: 16,
//                   minHeight: 80,
//                   textAlignVertical: "top",
//                 }}
//                 placeholderTextColor={colors.placeholder}
//                 multiline
//               />

//               <Text
//                 style={{
//                   fontSize: 12,
//                   fontFamily: "Montserrat_500Medium",
//                   color: colors.secondary,
//                   marginBottom: 8,
//                 }}
//               >
//                 Frequency
//               </Text>
//               <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
//                 {FREQUENCIES.map((freq) => (
//                   <TouchableOpacity
//                     key={freq.value}
//                     style={{
//                       flex: 1,
//                       backgroundColor:
//                         selectedFrequency === freq.value
//                           ? colors.primary
//                           : colors.surface,
//                       borderWidth: 1,
//                       borderColor:
//                         selectedFrequency === freq.value
//                           ? colors.primary
//                           : colors.borderLight,
//                       borderRadius: 12,
//                       paddingVertical: 12,
//                       alignItems: "center",
//                     }}
//                     onPress={() => setSelectedFrequency(freq.value)}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: "Montserrat_600SemiBold",
//                         fontSize: 12,
//                         color:
//                           selectedFrequency === freq.value
//                             ? isDark
//                               ? "#000000"
//                               : "#FFFFFF"
//                             : colors.primary,
//                       }}
//                     >
//                       {freq.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <Text
//                 style={{
//                   fontSize: 12,
//                   fontFamily: "Montserrat_500Medium",
//                   color: colors.secondary,
//                   marginBottom: 8,
//                 }}
//               >
//                 Category
//               </Text>
//               <View style={{ flexDirection: "row", gap: 8 }}>
//                 {PREDEFINED_HABITS.map((habit) => (
//                   <TouchableOpacity
//                     key={habit.category}
//                     style={{
//                       flex: 1,
//                       backgroundColor:
//                         selectedCategory === habit.category
//                           ? colors.blue
//                           : colors.surface,
//                       borderWidth: 1,
//                       borderColor:
//                         selectedCategory === habit.category
//                           ? colors.blue
//                           : colors.borderLight,
//                       borderRadius: 12,
//                       paddingVertical: 10,
//                       alignItems: "center",
//                     }}
//                     onPress={() => setSelectedCategory(habit.category)}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: "Montserrat_500Medium",
//                         fontSize: 11,
//                         color:
//                           selectedCategory === habit.category
//                             ? isDark
//                               ? "#000000"
//                               : "#FFFFFF"
//                             : colors.primary,
//                       }}
//                     >
//                       {habit.category}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             <View style={{ height: 100 }} />
//           </ScrollView>

//           {/* Save Button */}
//           <View
//             style={{
//               paddingHorizontal: 20,
//               paddingBottom: insets.bottom + 20,
//               gap: 12,
//             }}
//           >
//             {error ? (
//               <Text
//                 style={{
//                   fontFamily: "Montserrat_500Medium",
//                   fontSize: 12,
//                   color: "#FF6B6B",
//                   textAlign: "center",
//                 }}
//               >
//                 {error}
//               </Text>
//             ) : null}
//             <TouchableOpacity
//               style={{
//                 backgroundColor: colors.green,
//                 borderRadius: 16,
//                 paddingVertical: 16,
//                 alignItems: "center",
//               }}
//               onPress={handleSaveHabit}
//               disabled={saving}
//             >
//               <Text
//                 style={{
//                   fontFamily: "Montserrat_600SemiBold",
//                   fontSize: 16,
//                   color: isDark ? "#000000" : "#FFFFFF",
//                 }}
//               >
//                 {saving ? "Saving..." : "Save Habit"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingAnimatedView>

//       <Modal
//         visible={showAISuggestions}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowAISuggestions(false)}
//       >
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: colors.background,
//             paddingTop: insets.top,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "space-between",
//               paddingHorizontal: 20,
//               paddingVertical: 16,
//               borderBottomWidth: 1,
//               borderBottomColor: colors.border,
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 20,
//                 fontFamily: "Montserrat_600SemiBold",
//                 color: colors.primary,
//               }}
//             >
//               AI Suggestions
//             </Text>
//             <TouchableOpacity onPress={() => setShowAISuggestions(false)}>
//               <X size={24} color={colors.primary} />
//             </TouchableOpacity>
//           </View>

//           <ScrollView
//             contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16 }}
//             showsVerticalScrollIndicator={false}
//           >
//             {aiSuggestions.map((suggestion, idx) => (
//               <TouchableOpacity
//                 key={idx}
//                 style={{
//                   backgroundColor: colors.surface,
//                   borderWidth: 1,
//                   borderColor: colors.borderLight,
//                   borderRadius: 16,
//                   padding: 16,
//                   marginBottom: 12,
//                 }}
//                 onPress={() => handleAddAISuggestion(suggestion)}
//               >
//                 <Text
//                   style={{
//                     fontFamily: "Montserrat_600SemiBold",
//                     fontSize: 14,
//                     color: colors.primary,
//                     marginBottom: 6,
//                   }}
//                 >
//                   {suggestion.name}
//                 </Text>
//                 <Text
//                   style={{
//                     fontFamily: "Montserrat_400Regular",
//                     fontSize: 12,
//                     color: colors.secondary,
//                     marginBottom: 10,
//                   }}
//                 >
//                   {suggestion.description}
//                 </Text>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                 >
//                   <View
//                     style={{
//                       backgroundColor: colors.blueLight,
//                       paddingHorizontal: 10,
//                       paddingVertical: 6,
//                       borderRadius: 12,
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: "Montserrat_500Medium",
//                         fontSize: 11,
//                         color: colors.blue,
//                       }}
//                     >
//                       {suggestion.category}
//                     </Text>
//                   </View>
//                   <ChevronRight size={20} color={colors.secondary} />
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </Modal>
//     </>
//   );
// }
