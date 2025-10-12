import { ComboboxMultiple } from "@/components/ui/combobox-multiple";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import PriorityBadge from "@/components/ui/priority-badge";
import { Text } from "@/components/ui/text";
import { TaskData } from "@/constants/types";
import { Clock, LayoutList, ScrollText } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

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
  const [task, setTask] = useState<TaskData>({
    taskName: "",
    taskDescription: "",
    TaskStartDateTime: new Date(),
    duration: { hours: 0, minutes: 0 },
    priority: 0,
    frequency: [],
  });

  const handleChange = (field: keyof TaskData, value: any) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Input
        label="Task"
        placeholder="Enter task name"
        icon={LayoutList}
        value={task.taskName}
        onChangeText={(text) => handleChange("taskName", text)}
      />
      <Input
        label="Sub Title"
        placeholder="Sub title"
        icon={ScrollText}
        value={task.taskDescription}
        onChangeText={(text) => handleChange("taskDescription", text)}
      />
      <Text variant="caption">Duration</Text>
      <View style={styles.row}>
        <Input
          label="Hours"
          placeholder=""
          icon={Clock}
          keyboardType="numeric"
          value={String(task.duration.hours)}
          onChangeText={(text) => handleChange("duration", { ...task.duration, hours: Number(text) })}
        />
        <Input
          label="Minutes"
          placeholder=""
          icon={Clock}
          keyboardType="numeric"
          value={String(task.duration.minutes)}
          onChangeText={(text) => handleChange("duration", { ...task.duration, minutes: Number(text) })}
        />
      </View>
      <View style={styles.row}>
        <DatePicker
          label="Date & Time"
          mode="datetime"
          value={task.TaskStartDateTime}
          onChange={(date) => handleChange("TaskStartDateTime", date)}
          placeholder="Select date and time"
          timeFormat="12"
        />
      </View>
      <ComboboxMultiple
        value={task.frequency}
        // @ts-ignore
        options={options}
        onChange={(val) => handleChange("frequency", val)}
      />
      <Text variant="caption">Priority</Text>
      <PriorityBadge
        value={task.priority}
        onChange={(val) => handleChange("priority", val)}
      />
      <View style={styles.createBtn}>
        <Text
          style={styles.createBtnText}
          onPress={() => console.log(task)}
        >
          Submit
        </Text>
      </View>
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
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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
