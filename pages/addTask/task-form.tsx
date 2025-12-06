import RemindersEditor from "@/components/reminder-field";
import { Badge } from "@/components/ui/badge";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { DurationPicker } from "@/components/ui/duration-picker";
import { Input } from "@/components/ui/input";
import { Picker } from "@/components/ui/picker";
import PriorityBadge from "@/components/ui/priority-badge";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { TaskData } from "@/constants/types";
import { useAddTaskSheet } from "@/contexts/add-task-context";
import { useLocalUser } from "@/contexts/local-user-info";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { addMinutes } from "date-fns";
import {
  ChevronLeft,
  LayoutList,
  Plus,
  ScrollText,
  SquarePen,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { addTask } from "./API/addTask";
import AddPriority from "./components/add-priority";

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
  const { close, isVisible, initialData, rerender } = useAddTaskSheet();
  const pallet = usePallet();
  const textColor = useColor({}, "text");
  const textMutedColor = useColor({}, "textMuted");
  const { userData } = useLocalUser();

  const [task, setTask] = useState<TaskData>({
    taskName: "",
    taskDescription: "",
    TaskStartDateTime: addMinutes(new Date(), 15),
    duration: { hours: 0, minutes: 30 },
    priority: 0,
    frequency: [0],
    category: "",
    syncWithGoogleCalendar: false,
    reminders: [],
  });

  // Update task when initialData changes
  useEffect(() => {
    if (initialData && isVisible) {
      setTask((prev) => ({
        ...prev,
        ...(initialData.taskName && { taskName: initialData.taskName }),
        ...(initialData.taskDescription && {
          taskDescription: initialData.taskDescription,
        }),
        ...(initialData.duration && { duration: initialData.duration }),
        ...(initialData.TaskStartDateTime && {
          TaskStartDateTime: initialData.TaskStartDateTime,
        }),
      }));
    }
  }, [initialData, isVisible]);

  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const [showError, setShowError] = useState(false);
  const [step, setStep] = useState(1);
  const [openCategory, setOpenCategory] = useState(false);

  const taskNameError =
    showError && task.taskName.trim() === "" ? "Task name is required." : "";

  const handleChange = (field: keyof TaskData, value: any) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    if (task.taskName.trim() === "") {
      setShowError(true);
      setStep(1);
      return;
    }
    try {
      setLoading(true);
      const response = await addTask(task);
      if (response.success) {
        success("Task added successfully!");
        rerender();
        close();
        setTask({
          taskName: "",
          taskDescription: "",
          TaskStartDateTime: addMinutes(new Date(), 15),
          duration: { hours: 0, minutes: 30 },
          priority: 0,
          frequency: [0],
          category: "",
          syncWithGoogleCalendar: false,
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
      {openCategory ? (
        <AddPriority
          category={task.category}
          onClose={() => setOpenCategory(false)}
          onSelect={(data: string) => {
            handleChange("category", data);
          }}
        />
      ) : (
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
              {task.category ? (
                <TouchableOpacity onPress={() => setOpenCategory(true)}>
                  <Badge variant="outline">
                    <Text>
                      {" "}
                      <SquarePen size={16} /> Category : {task.category}{" "}
                    </Text>{" "}
                  </Badge>
                </TouchableOpacity>
              ) : (
                <Button
                  onPress={() => setOpenCategory(true)}
                  variant="secondary"
                  icon={Plus}
                >
                  Category
                </Button>
              )}
              <Button
                variant="default"
                onPress={handleNext}
                style={{
                  marginTop: 16,
                  marginBottom: 300,
                  backgroundColor: pallet.shade1,
                }}
                textStyle={{ color: "#fff" }}
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
              <Text variant="caption" style={{ marginBottom: 8 }}>
                Duration
              </Text>
              <DurationPicker
                hours={task.duration.hours}
                minutes={task.duration.minutes}
                onHoursChange={(hours) =>
                  handleChange("duration", { ...task.duration, hours })
                }
                onMinutesChange={(minutes) =>
                  handleChange("duration", { ...task.duration, minutes })
                }
              />
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
                values={task.frequency.map(String)}
                options={options.map((opt) => ({
                  ...opt,
                  value: String(opt.value),
                }))}
                onValuesChange={(val) =>
                  handleChange(
                    "frequency",
                    val.map((v) => parseInt(v))
                  )
                }
              />
              {/* Calendar Sync Toggle */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleLeft}>
                  <Image
                    source={require("@/assets/images/gcal.png")}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                  />

                  <Text
                    variant="caption"
                    style={[styles.toggleLabel, { color: textColor }]}
                  >
                    Sync with Calendar
                  </Text>
                </View>
                <Switch
                  value={task.syncWithGoogleCalendar || false}
                  onValueChange={(value) =>
                    handleChange("syncWithGoogleCalendar", value)
                  }
                  trackColor={{ false: "#E5E7EB", true: pallet.shade4 }}
                  thumbColor={
                    task.syncWithGoogleCalendar ? pallet.shade1 : "#F3F4F6"
                  }
                  disabled={!userData?.googleCalendarSynced}
                />
              </View>
              {!userData?.googleCalendarSynced && (
                <Text
                  variant="caption"
                  style={{ color: textMutedColor, fontSize: 12 }}
                >
                  (configure credentials in settings)
                </Text>
              )}
              <RemindersEditor
                label={task.taskName}
                initialReminders={task.reminders}
                onChange={(reminders) => {
                  handleChange("reminders", reminders);
                }}
              />
              <Button
                icon={Plus}
                loading={loading}
                variant="success"
                onPress={onSubmit}
                style={{
                  marginTop: 16,
                  marginBottom: 300,
                  backgroundColor: pallet.shade1,
                }}
                textStyle={{ color: "#fff" }}
              >
                Add Task
              </Button>
            </>
          )}
        </View>
      )}
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
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});
