import { useGetCurrentDateTime } from "@/hooks/use-get-current-date-time";
import { usePallet } from "@/hooks/use-pallet";
import DateSelector from "@/pages/task-viewer/date-selector";
import TaskList from "@/pages/task-viewer/task-list";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarScreen() {
  const { date, day, month } = useGetCurrentDateTime();
  const pallet = usePallet();
  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <View>
        <Text style={{ fontSize: 34, fontWeight: "700" }}>
          {month}
          <Text style={{ color: pallet.shade1 }}> {date}</Text>
        </Text>
        <Text style={{ fontSize: 20, color: "#666", marginBottom: 20 }}>
          {day}
        </Text>
      </View>
      <DateSelector />
      <TaskList />
    </SafeAreaView>
  );
}
