import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

type TaskDrawerProps = {
  visible: boolean;
  onClose: () => void;
  onDone: () => void;
};

// Removed invalid/duplicate function declaration
export default function TaskDrawer(props: TaskDrawerProps) {
  const { visible, onClose, onDone } = props;
  const pallet = usePallet();
  const theme = useTheme();
  const colorSet = theme ? Colors[theme] : Colors.light;
  const [date, setDate] = useState(new Date());

  console.log(date, "selected date");
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );
  const selectedMonth = date.getMonth();
  const selectedYear = date.getFullYear();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.drawer, { backgroundColor: pallet.shade3 }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.headerBtn} onPress={onClose}>
              <Text style={styles.headerBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color={pallet.shade1}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={onDone}>
              <Text style={styles.headerBtnText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Task Info */}
          <View style={styles.taskInfoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="moon" size={36} color={pallet.shade2} />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.taskTime}>10:00 PM</Text>
              <Text style={styles.taskTitle}>Wind Down</Text>
            </View>
            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons
                name="ellipse-outline"
                size={32}
                color={pallet.shade1}
              />
            </TouchableOpacity>
          </View>

          {/* Date Picker Row */}
          <View style={styles.datePickerRow}>
            <TouchableOpacity
              style={styles.monthBtn}
              onPress={() => setShowMonthYearPicker(true)}
            >
              <Text style={[styles.monthText, { color: pallet.shade2 }]}>
                {months[selectedMonth]}{" "}
                <Text style={{ color: pallet.shade4 }}>{selectedYear}</Text>
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={pallet.shade2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.todayBtn}
              onPress={() => setDate(new Date())}
            >
              <Text style={styles.todayText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons
                name="ellipsis-horizontal"
                size={22}
                color={pallet.shade1}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={pallet.shade1} />
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <View style={styles.calendarContainer}>
            {/* Month/Year Picker Modal */}
            {showMonthYearPicker ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.18)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    padding: 24,
                    minWidth: 260,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      marginBottom: 12,
                      color: colorSet.text,
                    }}
                  >
                    Select Month & Year
                  </Text>
                  <FlatList
                    data={months}
                    horizontal
                    keyExtractor={(item) => item}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        style={{
                          padding: 8,
                          margin: 4,
                          borderRadius: 8,
                          backgroundColor:
                            index === selectedMonth ? pallet.shade4 : "#f7f7f7",
                        }}
                        onPress={() => {
                          setDate(new Date(selectedYear, index, 1));
                        }}
                      >
                        <Text
                          style={{
                            color:
                              index === selectedMonth
                                ? pallet.shade2
                                : colorSet.text,
                            fontWeight: "500",
                          }}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={{ marginBottom: 16 }}
                  />
                  <FlatList
                    data={years}
                    horizontal
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{
                          padding: 8,
                          margin: 4,
                          borderRadius: 8,
                          backgroundColor:
                            item === selectedYear ? pallet.shade4 : "#f7f7f7",
                        }}
                        onPress={() => {
                          setDate(new Date(item, selectedMonth, 1));
                        }}
                      >
                        <Text
                          style={{
                            color:
                              item === selectedYear
                                ? pallet.shade2
                                : colorSet.text,
                            fontWeight: "500",
                          }}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity
                    style={{
                      marginTop: 18,
                      alignSelf: "center",
                      padding: 10,
                      borderRadius: 8,
                      backgroundColor: pallet.shade2,
                    }}
                    onPress={() => setShowMonthYearPicker(false)}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Calendar
                current={`${selectedYear}-${(selectedMonth + 1)
                  .toString()
                  .padStart(2, "0")}-01`}
                onDayPress={(day) => setDate(new Date(day.dateString))}
                theme={{
                  backgroundColor: "#fff",
                  calendarBackground: "#fff",
                  textSectionTitleColor: colorSet.icon,
                  dayTextColor: colorSet.text,
                  todayTextColor: colorSet.tint,
                  selectedDayBackgroundColor: pallet.shade4,
                  selectedDayTextColor: pallet.shade2,
                  monthTextColor: colorSet.text,
                  arrowColor: colorSet.tint,
                  textDisabledColor: "#d9e1e8",
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
                markedDates={{
                  [date.toISOString().split("T")[0]]: {
                    selected: true,
                    selectedColor: pallet.shade4,
                    selectedTextColor: pallet.shade2,
                  },
                }}
                style={{ width: "100%" }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "flex-end",
  },
  drawer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    minHeight: 520,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  headerBtnText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  taskInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  taskTime: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 2,
  },
  taskTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  datePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  monthBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  todayBtn: {
    backgroundColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginRight: 8,
  },
  todayText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginTop: 8,
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarText: {
    color: "#222",
    fontSize: 16,
    marginTop: 12,
  },
});
