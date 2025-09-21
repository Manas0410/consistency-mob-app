import { Colors } from "@/constants/theme";
// import { useGetLastThirtyDays } from "@/hooks/use-get-last-thirty-days";
import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const initialSelectedDateStr = "2025-09-21";

const DateSelector = () => {
  const pallet = usePallet();
  const theme = useTheme();
  const colorSet = theme ? Colors[theme] : Colors.light;

  // Use YYYY-MM-DD format string, directly construct Date
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(initialSelectedDateStr)
  );
  const [weekOffset, setWeekOffset] = useState(0);

  // Helper to get week dates
  function getWeekDates(refDate: Date) {
    const week: { date: Date; dayName: string }[] = [];
    const dayOfWeek = refDate.getDay(); // 0 (Sun) - 6 (Sat)
    const startOfWeek = new Date(refDate);
    startOfWeek.setDate(refDate.getDate() - dayOfWeek);
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      week.push({
        date: d,
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }
    return week;
  }

  // Calculate week dates for offset
  const refDate = new Date(selectedDate);
  refDate.setDate(selectedDate.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(refDate);

  return (
    <View style={styles.weekRow}>
      <TouchableOpacity
        onPress={() => setWeekOffset(weekOffset - 1)}
        style={styles.arrowBtn}
      >
        <Ionicons
          size={28}
          color={pallet.shade1}
          name={"chevron-back-circle"}
        />
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          {weekDates.map(({ date: d, dayName }) => {
            const isSelected =
              d.getDate() === selectedDate.getDate() &&
              d.getMonth() === selectedDate.getMonth() &&
              d.getFullYear() === selectedDate.getFullYear();
            return (
              <TouchableOpacity
                key={d.toISOString()}
                onPress={() => setSelectedDate(new Date(d))}
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
                <Text style={[styles.dayName, { color: colorSet.text }]}>
                  {d.getDate()}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    { color: isSelected ? colorSet.tint : colorSet.icon },
                  ]}
                >
                  {dayName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => setWeekOffset(weekOffset + 1)}
        style={styles.arrowBtn}
      >
        <Ionicons
          size={28}
          color={pallet.shade1}
          name={"chevron-forward-circle"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default DateSelector;

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    gap: 32,
    alignItems: "center",
  },
  arrowBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
