import { DatePicker } from "@/components/ui/date-picker";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useGetCurrentDateTime } from "@/hooks/use-get-current-date-time";
import { usePallet } from "@/hooks/use-pallet";
import { ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DateSelector from "../../../pages/task-viewer/date-selector";
import TeamTaskList from "../../../pages/Team/Team-task-list";

const TeamTaskPage = () => {
  const { date, day, month } = useGetCurrentDateTime();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const pallet = usePallet();
  return (
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <DatePicker
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        triggerchildren={
          <View>
            <Text style={{ fontSize: 34, fontWeight: "700" }}>
              {month}
              <Text
                style={{
                  color: pallet.shade1,
                  fontSize: 38,
                  fontWeight: "800",
                }}
              >
                {" "}
                {date}
              </Text>
              <Icon
                name={ChevronRight}
                color={pallet.shade1}
                strokeWidth={5}
                height={30}
              />
            </Text>
          </View>
        }
      />
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <TeamTaskList selectedDate={selectedDate} />
    </SafeAreaView>
  );
};

export default TeamTaskPage;
