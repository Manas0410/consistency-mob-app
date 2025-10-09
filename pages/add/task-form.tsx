import { ComboboxMultiple } from "@/components/ui/combobox-multiple";
import { DatePicker } from "@/components/ui/date-picker";
import DurationInput from "@/components/ui/duration-input";
import { Input } from "@/components/ui/input";
import PriorityBadge from "@/components/ui/priority-badge";
import { usePallet } from "@/hooks/use-pallet";
import { LayoutList, ScrollText } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

type TimeValue = { hour: number; minute: number; period: "AM" | "PM" };

type TaskData = {
  taskName: string;
  taskDescription: string;
  taskDate: Date;
  startTime: TimeValue;
  duration: number;
  priority: "Low" | "Medium" | "High";
  frequency: number[];
};

const durations = ["15m", "30m", "45m", "1hr", "..."];

const options = [
  { label: "Once", value: 0 },
  { label: "Every Sunday", value: 1 },
  { label: "Every Monday", value: 2 },
  { label: "Every Tuesday", value: 3 },
  { label: "Every Wednesday", value: 4 },
  { label: "Every Thursday", value: 5 },
  { label: "Every Friday", value: 6 },
  { label: "Every Saturday", value: 7 },
  { label: "Everyday", value: 8 },
];

export default function TaForm() {
  const pallet = usePallet();
  const [title, setTitle] = useState("");
  const [planned, setPlanned] = useState(true);
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState<TimeValue>({
    hour: 5,
    minute: 30,
    period: "PM",
  });
  const [endTime, setEndTime] = useState<TimeValue>({
    hour: 5,
    minute: 45,
    period: "PM",
  });
  const [duration, setDuration] = useState("15m");
  const [notes, setNotes] = useState("");
  const [frequency, setFrequency] = useState("Everyday");
  const [dateTime, setDateTime] = useState<Date | undefined>();

  console.log(dateTime, "selectedDate");

  return (
    <View style={styles.container}>
      {/* Title Row */}
      <Input label="Task" placeholder="Enter task name" icon={LayoutList} />
      <Input label="Sub Title" placeholder="Sub title" icon={ScrollText} />
      <DurationInput />
      {/* Date Row */}
      <View style={styles.row}>
        <DatePicker
          label="Date & Time"
          mode="datetime"
          value={dateTime}
          onChange={setDateTime}
          placeholder="Select date and time"
          timeFormat="12"
        />
      </View>

      {/* Frequency */}
      {/* @ts-ignore */}
      <ComboboxMultiple options={options} />
      <PriorityBadge />

      {/* Time Row */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  statusDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#eee",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  tabText: {
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "500",
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 8,
  },
  allDayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  allDayText: {
    fontSize: 15,
    marginLeft: 6,
    color: "#888",
  },
  timeInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 8,
  },
  durationBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  durationText: {
    fontSize: 15,
    fontWeight: "500",
  },
  repeatInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  addSubtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addSubtaskText: {
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "500",
  },
  notesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  notesInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
    minHeight: 60,
  },
  createBtn: {
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  createBtnText: {
    fontSize: 17,
    color: "#aaa",
    fontWeight: "bold",
  },
});
