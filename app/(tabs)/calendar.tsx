import DateSelector from "@/pages/task-viewer/date-selector";
import TaskList from "@/pages/task-viewer/task-list";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DateSelector />
      <TaskList />
    </SafeAreaView>
  );
}
