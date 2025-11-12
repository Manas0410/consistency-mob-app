import { Button } from "@/components/ui/button"; // or RN Pressable
import { Icon } from "@/components/ui/icon"; // or swap with your icon impl
import { Spinner } from "@/components/ui/spinner";
import { useCurrentTeamData } from "@/contexts/team-data-context";
import { differenceInMinutes, format, isValid, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Flag,
  Users,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackHeader from "./ui/back-header";
import { DatePicker } from "./ui/date-picker";
import { Input } from "./ui/input";
import { Picker } from "./ui/picker";

// ----- Types ---------------------------------------------------------------

type PersonalTask = {
  _id: string;
  userId: string;
  taskName: string;
  taskDescription: string;
  taskStartDateTime: string; // ISO
  endTime: string; // ISO
  isDone: boolean;
  isHabbit: boolean;
  category?: string;
  duration: { hours: number; minutes: number };
  priority: 0 | 1 | 2 | 3;
  frequency: number[];
  reminders?: any[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

type TeamAssignee = { userId: string; userName: string; _id?: string };

type TeamTask = {
  _id: string;
  assignees: TeamAssignee[];
  taskName: string;
  taskDescription: string;
  taskStartDateTime: string; // ISO
  endTime: string; // ISO
  isDone: boolean;
  isHabbit: boolean;
  duration: { hours: number; minutes: number };
  priority: 0 | 1 | 2 | 3;
  frequency: number[];
  category?: string; // ← optional category for team task as well
  createdAt?: string;
  updatedAt?: string;
};

type TaskUnion = PersonalTask | TeamTask;

type Props = {
  task: TaskUnion;
  loading?: boolean;
  onEdit: (updated: TaskUnion) => void; // returns the same shape back
  onCancel?: () => void;
};

// ----- Helpers -------------------------------------------------------------

const isTeamTask = (t: TaskUnion): t is TeamTask =>
  Array.isArray((t as any)?.assignees);

const safeParseDate = (iso: string) => {
  try {
    const d = parseISO(iso);
    return isValid(d) ? d : new Date(iso);
  } catch {
    const d = new Date(iso);
    return isValid(d) ? d : new Date();
  }
};

const fmtDate = (iso: string) => format(safeParseDate(iso), "EEE, d MMM yyyy");
const fmtTime = (iso: string) => format(safeParseDate(iso), "h:mm a");

const PRIORITY = {
  0: { label: "Low", color: "#10B981" },
  1: { label: "Medium", color: "#F59E0B" },
  2: { label: "High", color: "#EF4444" },
  3: { label: "High", color: "#EF4444" }, // support 3 as high too
};

function recomputeDuration(startISO: string, endISO: string) {
  const start = safeParseDate(startISO);
  const end = safeParseDate(endISO);
  const mins = Math.max(0, differenceInMinutes(end, start));
  return { hours: Math.floor(mins / 60), minutes: mins % 60 };
}

// ----- Component -----------------------------------------------------------

const TaskDetails: React.FC<Props> = ({ task, loading, onEdit, onCancel }) => {
  const team = isTeamTask(task);
  const router = useRouter();

  // local editable fields
  const [name, setName] = useState(task.taskName ?? "");
  const [desc, setDesc] = useState(task.taskDescription ?? "");
  const [category, setCategory] = useState(task.category ?? ""); // ← NEW
  const [startISO, setStartISO] = useState(task.taskStartDateTime);
  const [endISO, setEndISO] = useState(task.endTime);
  const [isDone, setIsDone] = useState(!!task.isDone);
  const [priority, setPriority] = useState<number>(
    [0, 1, 2, 3].includes(task.priority) ? task.priority : 0
  );

  const duration = useMemo(
    () => recomputeDuration(startISO, endISO),
    [startISO, endISO]
  );

  const headerBadge = team ? "Team Task" : "My Task";

  const save = () => {
    // return the SAME SHAPE we got (plus category if it wasn't present)
    const base = {
      ...task,
      taskName: name.trim(),
      taskDescription: desc,
      category: category.trim() || undefined, // keep undefined if empty
      taskStartDateTime: new Date(startISO).toISOString(),
      endTime: new Date(endISO).toISOString(),
      isDone,
      priority: (priority as 0 | 1 | 2 | 3) ?? 0,
      duration,
    };

    if (team) {
      const updated: TeamTask = {
        ...(base as TeamTask),
        assignees: (task as TeamTask).assignees ?? [],
      };
      onEdit(updated);
    } else {
      const updated: PersonalTask = {
        ...(base as PersonalTask),
      };
      onEdit(updated);
    }
  };

  const { currentTeamData } = useCurrentTeamData();
  const [assigneeValues, setAssigneeValues] = useState(
    (task as TeamTask).assignees.map((item) => item?.userId)
  );

  const assigneesOptions = currentTeamData?.members?.map((item) => {
    return { ...item, ["label"]: item?.userName, ["value"]: item?.userId };
  });

  console.log(assigneesOptions, assigneeValues, (task as TeamTask).assignees);
  // useEffect(() => {
  //   if (assigneeValues && assigneesOptions) {
  //     const selected = assigneesOptions
  //       .filter((option) => assigneeValues.includes(option.value))
  //       .map((option) => ({
  //         userId: option.value,
  //         userName: option.label,
  //       }));
  //     setTask((p) => ({ ...p, ["assignees"]: selected }));
  //   }
  // }, [assigneeValues]);

  if (!task) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <BackHeader title="Task description" />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 8,
              color: "#0F172A",
            }}
          >
            Task not found
          </Text>
          <Text
            style={{ color: "#64748B", textAlign: "center", marginBottom: 20 }}
          >
            The task you are looking for doesn't exist or has been removed.
          </Text>

          <Button
            variant="default"
            onPress={() => {
              // prefer parent-provided onCancel if available (keeps parent flow)
              if (typeof onCancel === "function") return onCancel();
              // fallback to navigation
              router.back();
            }}
            style={{ paddingHorizontal: 24, borderRadius: 12 }}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView>
        <BackHeader title="Task description" />
        <View style={{ backgroundColor: "#F7F8FA" }}>
          {loading ? (
            <View style={styles.centerFill}>
              <Spinner variant="bars" size="default" />
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title} numberOfLines={2}>
                  {name || "Untitled Task"}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{headerBadge}</Text>
                </View>
              </View>

              {/* Priority */}
              <View style={styles.card}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.segment}>
                  {[0, 1, 2].map((p) => (
                    <Pressable
                      key={p}
                      onPress={() => setPriority(p)}
                      style={[
                        styles.segmentItem,
                        priority === p && styles.segmentActive,
                      ]}
                    >
                      <Icon
                        name={Flag}
                        size={16}
                        color={
                          priority === p
                            ? "#fff"
                            : PRIORITY[p as 0 | 1 | 2].color
                        }
                      />
                      <Text
                        style={[
                          styles.segmentText,
                          {
                            color:
                              priority === p
                                ? "#fff"
                                : PRIORITY[p as 0 | 1 | 2].color,
                          },
                        ]}
                      >
                        {PRIORITY[p as 0 | 1 | 2].label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Status */}
              <View style={styles.cardRow}>
                <Text style={styles.label}>Status</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Icon
                    name={CheckCircle}
                    size={18}
                    color={isDone ? "#16A34A" : "#94A3B8"}
                  />
                  <Text style={{ color: "#0F172A", fontWeight: "600" }}>
                    {isDone ? "Completed" : "Pending"}
                  </Text>
                  <Switch value={isDone} onValueChange={setIsDone} />
                </View>
              </View>

              {/* Time & Duration */}
              <View style={styles.card}>
                <Text style={styles.label}>When</Text>
                <View style={styles.row}>
                  <Icon name={Calendar} size={18} color="#64748B" />
                  <Text style={styles.subtle}>
                    {fmtDate(startISO)} • {fmtTime(startISO)} –{" "}
                    {fmtTime(endISO)}
                  </Text>
                </View>

                <View style={[styles.row, { marginTop: 6 }]}>
                  <Icon name={Clock} size={18} color="#64748B" />
                  <Text style={styles.subtle}>
                    Duration:{" "}
                    {/* <Text style={{ color: "#0F172A", fontWeight: "700" }}>
                      {duration.hours ? `${duration.hours}h ` : ""}
                      {duration.minutes ? `${duration.minutes}m` : "0m"}
                    </Text> */}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Input
                    containerStyle={{ flex: 1, marginRight: 12 }}
                    labelWidth={80}
                    label="Hours"
                    placeholder=""
                    keyboardType="numeric"
                    value={String(task.duration.hours)}
                    onChangeText={
                      (text) => {}
                      // handleChange("duration", {
                      //   ...task.duration,
                      //   hours: Number(text),
                      // })
                    }
                    // style={styles.input}
                  />
                  <Input
                    containerStyle={{ flex: 1 }}
                    labelWidth={80}
                    label="Minutes"
                    placeholder=""
                    keyboardType="numeric"
                    value={String(task.duration.minutes)}
                    onChangeText={
                      (text) => {}
                      // handleChange("duration", {
                      //   ...task.duration,
                      //   minutes: Number(text),
                      // })
                    }
                  />
                </View>

                {/* ISO editors (swap with DateTime pickers if you like) */}
                <View style={{ marginTop: 12, gap: 8 }}>
                  <Text style={styles.inputLabel}>Start </Text>
                  <DatePicker
                    label="Date & Time"
                    mode="datetime"
                    value={new Date(task.taskStartDateTime)}
                    // onChange={(date) => handleChange("taskStartDateTime", date)}
                    placeholder="Select date and time"
                    timeFormat="12"
                    style={styles.input}
                  />
                  {/* <TextInput
                    placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
                    value={startISO}
                    onChangeText={setStartISO}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                  /> */}
                </View>
              </View>

              {/* Assignees (team only) */}
              {team && (
                <View style={styles.card}>
                  <Text style={styles.label}>Assignees</Text>
                  {(task as TeamTask).assignees?.length ? (
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {(task as TeamTask).assignees.map((a) => (
                        <View key={a.userId} style={styles.pill}>
                          <Icon name={Users} size={14} color="#2563EB" />
                          <Text style={[styles.pillText, { color: "#2563EB" }]}>
                            {a.userName}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.subtle}>No assignees</Text>
                  )}

                  <Picker
                    label="Edit"
                    icon={Edit}
                    options={assigneesOptions}
                    values={assigneeValues}
                    // onValuesChange={setAssigneeValues}
                    placeholder="Select assignees"
                    searchable
                    searchPlaceholder="Search members"
                    modalTitle="Select Assignee"
                    multiple
                    style={styles.input}
                  />
                </View>
              )}

              {/* Basic fields */}
              <View style={styles.card}>
                <Text style={styles.inputLabel}>Task name</Text>
                <TextInput
                  placeholder="Enter task name"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />

                {/* Category (both personal & team) */}
                <Text style={[styles.inputLabel, { marginTop: 10 }]}>
                  Category
                </Text>
                <TextInput
                  placeholder="e.g., Work, Personal, Sales"
                  value={category}
                  onChangeText={setCategory}
                  style={styles.input}
                />

                <Text style={[styles.inputLabel, { marginTop: 10 }]}>
                  Description
                </Text>
                <TextInput
                  placeholder="Add a short description"
                  value={desc}
                  onChangeText={setDesc}
                  style={[styles.input, { height: 90 }]}
                  multiline
                />
              </View>

              {/* Footer buttons */}
              <View style={styles.footer}>
                {onCancel ? (
                  <Button
                    variant="default"
                    style={[styles.btn, { backgroundColor: "#E5E7EB" }]}
                    textStyle={{ color: "#111827", fontWeight: "700" }}
                    onPress={onCancel}
                  >
                    Cancel
                  </Button>
                ) : null}
                <Button
                  variant="default"
                  style={[
                    styles.btn,
                    { backgroundColor: "#2563EB", marginBottom: 350 },
                  ]}
                  textStyle={{ color: "#fff", fontWeight: "700" }}
                  onPress={save}
                >
                  Save Changes
                </Button>
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TaskDetails;

// ----- Styles --------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  centerFill: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subtle: {
    color: "#475569",
  },
  segment: {
    flexDirection: "row",
    gap: 8,
  },
  segmentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  segmentActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  segmentText: {
    fontWeight: "700",
    fontSize: 12,
  },
  pill: {
    backgroundColor: "#EFF6FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pillText: {
    fontWeight: "700",
    fontSize: 12,
  },
  inputLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#0F172A",
  },
  footer: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
  },
});
