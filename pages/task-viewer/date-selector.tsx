import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useGetCurrentDateTime } from "@/hooks/use-get-current-date-time";
// import { useGetLastThirtyDays } from "@/hooks/use-get-last-thirty-days";
import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const DateSelector = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date;
  setSelectedDate: (arg: Date) => void;
}) => {
  const pallet = usePallet();
  const theme = useTheme();
  const colorSet = theme ? Colors[theme] : Colors.light;

  const [weekOffset, setWeekOffset] = useState(0);

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

  const refDate = new Date(selectedDate);
  refDate.setDate(selectedDate.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(refDate);

  function toISODateOnly(date: Date) {
    // Converts Date to YYYY-MM-DD string
    return date.toISOString().split("T")[0];
  }

  const { day } = useGetCurrentDateTime();

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

            const today = new Date();
            const isToday =
              d.getDate() === today.getDate() &&
              d.getMonth() === today.getMonth() &&
              d.getFullYear() === today.getFullYear();
            return (
              <TouchableOpacity
                key={d.toISOString()}
                onPress={() => {
                  // Set selected date with only YYYY-MM-DD (reset time part)
                  const isoDateString = toISODateOnly(d);
                  setSelectedDate(new Date(isoDateString));
                  setWeekOffset(0);
                }}
                style={[styles.dayBox]}
              >
                <View
                  style={[
                    {
                      height: 30,
                      width: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 4,
                    },
                    isSelected && {
                      backgroundColor: pallet.shade2,

                      borderRadius: 15,
                    },
                  ]}
                >
                  <Text
                    variant="subtitle"
                    style={[
                      styles.dayName,
                      isSelected
                        ? { color: "#fff", textAlign: "center" }
                        : isToday
                        ? { color: pallet.shade2 }
                        : {},
                    ]}
                  >
                    {d.getDate()}
                  </Text>
                </View>
                <Text
                  variant="caption"
                  style={[
                    styles.dayNumber,
                    isToday && { color: pallet.shade2 },
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
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  arrowBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  dayBox: {
    paddingVertical: 8,
    // paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 16,
    minWidth: 34,
    alignItems: "center",
  },
  dayName: {
    fontSize: 14,
  },
  dayNumber: {
    fontWeight: "800",
    fontSize: 10,
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
