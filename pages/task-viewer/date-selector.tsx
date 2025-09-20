import { shortDaysMapper } from "@/constants/date-constants";
import { useGetCurrentDateTime } from "@/hooks/use-get-current-date-time";
import { useGetLastThirtyDays } from "@/hooks/use-get-last-thirty-days";
import { usePallet } from "@/hooks/use-pallet";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DateSelector = () => {
  const { day, date, month, year, time } = useGetCurrentDateTime();
  const pallet = usePallet();

  const prevThirtyDays = useGetLastThirtyDays();

  console.log(prevThirtyDays, "kjbhjvghcfg");
  const [selectedDay, setSelectedDay] = useState<number | null>(date);

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {prevThirtyDays.map(({ day, dayNo }) => {
          const isSelected = selectedDay === Number(dayNo);
          const dayName = shortDaysMapper[day as keyof typeof shortDaysMapper];

          return (
            <TouchableOpacity
              key={dayNo}
              onPress={() => setSelectedDay(Number(dayNo))}
              style={[
                styles.dayBox,
                isSelected && {
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderWidth: 2,
                  borderColor: pallet.shade3,
                  backgroundColor: pallet.shade4,
                },
              ]}
            >
              <Text style={[styles.dayName, { color: pallet.shade2 }]}>
                {dayNo}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  { color: isSelected ? pallet.shade2 : pallet.shade1 },
                ]}
              >
                {dayName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default DateSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 32,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  dayBox: {
    borderRadius: 16,
    minWidth: 56,
    alignItems: "center",
  },
  dayName: {
    fontSize: 16,
    marginBottom: 2,
  },
  dayNumber: {
    fontWeight: "700",
    fontSize: 18,
  },
  iconRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 6,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: "#fff",
    fontSize: 14,
  },
});
