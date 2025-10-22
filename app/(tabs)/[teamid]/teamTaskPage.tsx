import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useGetCurrentDateTime } from "@/hooks/use-get-current-date-time";
import { usePallet } from "@/hooks/use-pallet";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DateSelector from "../../../pages/task-viewer/date-selector";
import TeamTaskList from "../../../pages/Team/Team-task-list";

const TeamTaskPage = () => {
  const { date, day, month } = useGetCurrentDateTime();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const pallet = usePallet();
  console.log(selectedDate, "selectedDate in calendar screen");
  return (
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <View>
        <Text style={{ fontSize: 34, fontWeight: "700" }}>
          {month}
          <Text style={{ color: pallet.shade1 }}> {date}</Text>
        </Text>
        <Text style={{ fontSize: 20, color: "#666", marginBottom: 20 }}>
          {day}
        </Text>
      </View>
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <TeamTaskList selectedDate={selectedDate} />
    </SafeAreaView>
  );
};

export default TeamTaskPage;
