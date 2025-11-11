import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Picker } from "@/components/ui/picker";
import PriorityBadge from "@/components/ui/priority-badge";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { TaskData } from "@/constants/types";
import { useAddTeamTaskSheet } from "@/contexts/add-team-task-context";
import { useCurrentTeamData } from "@/contexts/team-data-context";
import { usePallet } from "@/hooks/use-pallet";
import { addMinutes } from "date-fns";
import {
  ChevronLeft,
  LayoutList,
  Plus,
  ScrollText,
  UserRoundPlus,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { addTeamTask } from "./API/api-calls";

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

export default function TeamTaskForm() {
  const [task, setTask] = useState<TaskData>({
    taskName: "",
    taskDescription: "",
    taskStartDateTime: addMinutes(new Date(), 15),
    duration: { hours: 0, minutes: 30 },
    priority: 0,
    frequency: [0],
    assignees: [],
  });

  const { currentTeamData } = useCurrentTeamData();
  const [assigneeValues, setAssigneeValues] = useState([]);

  const assigneesOptions = currentTeamData?.members?.map((item) => {
    return { ...item, ["label"]: item?.userName, ["value"]: item?.userId };
  });

  useEffect(() => {
    if (assigneeValues && assigneesOptions) {
      const selected = assigneesOptions
        .filter((option) => assigneeValues.includes(option.value))
        .map((option) => ({
          userId: option.value,
          userName: option.label,
        }));
      setTask((p) => ({ ...p, ["assignees"]: selected }));
    }
  }, [assigneeValues]);

  const [showError, setShowError] = useState(false);
  const [step, setStep] = useState(1);

  const taskNameError =
    showError && task.taskName.trim() === "" ? "Task name is required." : "";

  const handleChange = (field: keyof TaskData, value: any) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const onSubmit = async () => {
    if (task.taskName.trim() === "") {
      setShowError(true);
      setStep(1);
      return;
    }
    try {
      setLoading(true);
      const response = await addTeamTask(currentTeamData._id, task);
      if (response.success) {
        close();
        success("Task added successfully!");
        setTask({
          taskName: "",
          taskDescription: "",
          taskStartDateTime: addMinutes(new Date(), 15),
          duration: { hours: 0, minutes: 30 },
          priority: 0,
          frequency: [0],
        });
        setStep(1);
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

  const handleNext = () => {
    if (task.taskName.trim() === "") {
      setShowError(true);
      return;
    }
    setStep(2);
    setShowError(false);
  };

  const handleBack = () => {
    setStep(1);
  };

  const { close, isVisible } = useAddTeamTaskSheet();
  const pallet = usePallet();

  return (
    <BottomSheet
      style={{ backgroundColor: "#fff" }}
      isVisible={isVisible}
      onClose={() => {
        close();
        setStep(1);
        setShowError(false);
      }}
      snapPoints={[0.65, 0.9, 0.5]}
    >
      <View style={styles.container}>
        {step === 1 ? (
          <>
            <Text variant="subtitle" style={{ marginBottom: 12 }}>
              Add Task
            </Text>
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

            <Text variant="caption">Priority</Text>
            <PriorityBadge
              value={task.priority}
              onChange={(val) => handleChange("priority", val)}
            />
            <Button
              variant="default"
              onPress={handleNext}
              style={{ marginTop: 16 }}
            >
              Next
            </Button>
          </>
        ) : (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <TouchableOpacity onPress={handleBack} style={styles.backArrow}>
                <ChevronLeft size={26} />
                <Text variant="subtitle" style={{ marginBottom: 12 }}>
                  Task Details
                </Text>
              </TouchableOpacity>
            </View>
            <Picker
              label="Assignees"
              icon={UserRoundPlus}
              options={assigneesOptions}
              values={assigneeValues}
              onValuesChange={setAssigneeValues}
              placeholder="Select assignees"
              searchable
              searchPlaceholder="Search members"
              modalTitle="Select Assignee"
              multiple
            />
            <Text variant="caption">Duration</Text>
            <View style={styles.row}>
              <Input
                containerStyle={{ flex: 1, marginRight: 12 }}
                labelWidth={80}
                label="Hours"
                placeholder=""
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
                value={task.taskStartDateTime}
                onChange={(date) => handleChange("taskStartDateTime", date)}
                placeholder="Select date and time"
                timeFormat="12"
              />
            </View>
            {/* <Picker
              label="Select Frequency"
              multiple
              values={task.frequency}
              options={options}
              onValuesChange={(val) => handleChange("frequency", val)}
            /> */}
            <Button
              icon={Plus}
              loading={loading}
              variant="success"
              onPress={onSubmit}
            >
              Add Task
            </Button>
          </>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 12,
  },
  backArrow: {
    flexDirection: "row",
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  // ... (rest of your style object remains unchanged)
});
