import HabbitCompletionCard from "@/components/ui/HabbitCompletionCard";
import HabitCard from "@/components/ui/HabitCard";
import StreakCard from "@/components/ui/streak-card";
import TaskProgressCard from "@/components/ui/task-progress-card";
import WeekTaskCompletionCard from "@/components/ui/WeekTaskCompletionCard";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.Headingcnt}>
        <Ionicons
          name="logo-octocat"
          size={30}
          color={theme === "dark" ? "white" : "black"}
          style={{ marginBottom: -22 }}
        />
        <Text
          style={[
            styles.Heading,
            { color: theme === "dark" ? "white" : "black" },
          ]}
        >
          Assista AI
        </Text>
      </View>
      <Text style={{ color: colors.textSecondary, marginLeft: 10 }}>
        Believe you can and you're halfway there.
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
  );
}

const styles = StyleSheet.create({
  Heading: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 0,
    marginTop: 24,
    display: "flex",
  },
  Headingcnt: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
    marginLeft: 10,
  },
});
