import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Picker } from "@/components/ui/picker";
import PriorityBadge from "@/components/ui/priority-badge";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { TaskData } from "@/constants/types";
import { useAddTaskSheet } from "@/contexts/add-task-context";
import { usePallet } from "@/hooks/use-pallet";
import { addMinutes } from "date-fns";
import { LayoutList, Plus, ScrollText } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { addTask } from "./API/addTask";

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

export default function TaskForm() {
  const [task, setTask] = useState<TaskData>({
    taskName: "",
    taskDescription: "",
    TaskStartDateTime: addMinutes(new Date(), 15),
    duration: { hours: 0, minutes: 30 },
    priority: 0,
    frequency: [0],
  });
  const [showError, setShowError] = useState(false);
  const taskNameError =
    showError && task.taskName.trim() === "" ? "Task name is required." : "";

  const handleChange = (field: keyof TaskData, value: any) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const [loading, setLoading] = useState(false);
  const { success, error, warning, info } = useToast();

  const onSubmit = async () => {
    if (task.taskName.trim() === "") {
      setShowError(true);
      return;
    }
    try {
      setLoading(true);
      const response = await addTask(task);
      if (response.success) {
        success("Task added successfully!");
        setTask({
          taskName: "",
          taskDescription: "",
          TaskStartDateTime: addMinutes(new Date(), 15),
          duration: { hours: 0, minutes: 30 },
          priority: 0,
          frequency: [0],
        });
      } else {
        error("Failed to add task.");
      }
    } catch (err) {
      console.log(err);
      error("Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  const { close, isVisible } = useAddTaskSheet();

  const pallet = usePallet();

  return (
    <BottomSheet
      style={{ backgroundColor: "#fff" }}
      isVisible={isVisible}
      onClose={close}
      snapPoints={[0.55, 0.9, 0.5]}
    >
      <Text variant="subtitle" style={{ marginBottom: 12 }}>
        Add Task
      </Text>
      <View style={styles.container}>
        <Input
          label="Task"
          placeholder="Enter task name"
          icon={LayoutList}
          value={task.taskName}
          onChangeText={(text) => handleChange("taskName", text)}
          error={taskNameError}
        />
        <Input
          type="textarea"
          label="Description"
          placeholder="Enter task description"
          icon={ScrollText}
          value={task.taskDescription}
          onChangeText={(text) => handleChange("taskDescription", text)}
        />
        <Text variant="caption">Duration</Text>
        <View style={styles.row}>
          <Input
            containerStyle={{ flex: 1, marginRight: 12 }}
            labelWidth={80}
            label="Hours"
            placeholder=""
            // icon={Clock}
            keyboardType="numeric"
            value={String(task.duration.hours)}
            onChangeText={(text) =>
              handleChange("duration", {
                ...task.duration,
                hours: Number(text),
              })
            }
          />
          <Input
            containerStyle={{ flex: 1 }}
            labelWidth={80}
            label="Minutes"
            placeholder=""
            // icon={Clock}
            keyboardType="numeric"
            value={String(task.duration.minutes)}
            onChangeText={(text) =>
              handleChange("duration", {
                ...task.duration,
                minutes: Number(text),
              })
            }
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
        <Picker
          label="Select Frequency"
          multiple
          values={task.frequency}
          // @ts-ignore
          options={options}
          onValuesChange={(val) => handleChange("frequency", val)}
        />
        <Text variant="caption">Priority</Text>
        <PriorityBadge
          value={task.priority}
          onChange={(val) => handleChange("priority", val)}
        />

        <Button
          icon={Plus}
          loading={loading}
          variant="default"
          onPress={onSubmit}
        >
          Add Task
        </Button>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    // padding: 16,
    // margin: 16,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
