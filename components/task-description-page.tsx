import {
  addMinutes,
  differenceInMinutes,
  format,
  isValid,
  parseISO,
} from "date-fns";
import { useRouter } from "expo-router";
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Flag,
  Users,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackHeader from "@/components/ui/back-header";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { DatePicker } from "./ui/date-picker"; // replace with your actual DatePicker
import { Input } from "./ui/input"; // your Input component
import { Picker } from "./ui/picker"; // replace with your actual Picker (multi-select)

// ---------------- Types ----------------------------------------------------

type PersonalTask = {
  _id: string;
  userId?: string;
  taskName: string;
  taskDescription?: string;
  taskStartDateTime: string; // ISO
  endTime: string; // ISO
  isDone: boolean;
  isHabbit?: boolean;
  category?: string;
  duration: { hours: number; minutes: number };
  priority: 0 | 1 | 2 | 3;
  frequency?: number[];
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
  taskDescription?: string;
  taskStartDateTime: string; // ISO
  endTime: string; // ISO
  isDone: boolean;
  isHabbit?: boolean;
  duration: { hours: number; minutes: number };
  priority: 0 | 1 | 2 | 3;
  frequency?: number[];
  category?: string;
  createdAt?: string;
  updatedAt?: string;
};

type TaskUnion = PersonalTask | TeamTask;

type Props = {
  task?: TaskUnion;
  loading?: boolean;
  onEdit: (updated: TaskUnion) => void;
  onCancel?: () => void;
};

// ---------------- Helpers --------------------------------------------------

const isTeamTask = (t?: TaskUnion): t is TeamTask =>
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
  3: { label: "High", color: "#EF4444" },
};

function recomputeDuration(startISO: string, endISO: string) {
  const start = safeParseDate(startISO);
  const end = safeParseDate(endISO);
  const mins = Math.max(0, differenceInMinutes(end, start));
  return { hours: Math.floor(mins / 60), minutes: mins % 60 };
}

const toNum = (v: string | number) => {
  const n = typeof v === "number" ? v : Number(String(v).trim());
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
};

// ---------------- Component ------------------------------------------------

const TaskDetails: React.FC<Props> = ({
  task,
  loading = false,
  onEdit,
  onCancel,
}) => {
  const router = useRouter();
  // early guard: if no task, show friendly fallback
  if (!task) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <BackHeader title="Task description" />
        <View style={styles.notFoundWrap}>
          <Text style={styles.notFoundTitle}>Task not found</Text>
          <Text style={styles.notFoundSubtitle}>
            The task you are looking for doesn't exist or has been removed.
          </Text>
          <Button
            variant="default"
            onPress={() => {
              if (typeof onCancel === "function") return onCancel();
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

  const team = isTeamTask(task);

  // --- local editable fields (initialised from task) ---
  const [name, setName] = useState(task.taskName ?? "");
  const [desc, setDesc] = useState(task.taskDescription ?? "");
  const [category, setCategory] = useState(task.category ?? "");
  const [startISO, setStartISO] = useState(task.taskStartDateTime);
  const [endISO, setEndISO] = useState(task.endTime);
  const [isDone, setIsDone] = useState(!!task.isDone);
  const [priority, setPriority] = useState<number>(
    [0, 1, 2, 3].includes((task as any).priority) ? (task as any).priority : 0
  );

  // local editable duration fields (so user can type hours/mins)
  const [localDurHours, setLocalDurHours] = useState<number>(
    task.duration?.hours ?? 0
  );
  const [localDurMins, setLocalDurMins] = useState<number>(
    task.duration?.minutes ?? 0
  );

  // assignee controls (for team tasks)
  const [assigneeValues, setAssigneeValues] = useState<string[]>(
    team ? ((task as TeamTask).assignees ?? []).map((a) => a.userId) : []
  );
  const [selectedAssigneesForPayload, setSelectedAssigneesForPayload] =
    useState<TeamAssignee[]>(team ? (task as TeamTask).assignees ?? [] : []);

  // --- you may provide currentTeamData from context outside this component ---
  // For demonstration, we expect a parent or context to provide team members list.
  // If you have useCurrentTeamData, you can import & use it; otherwise wire `assigneesOptions` externally.
  // Here I try to read from a context if exists:
  let assigneesOptions: { label: string; value: string }[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useCurrentTeamData } = require("@/contexts/team-data-context");
    // @ts-ignore
    const { currentTeamData } = useCurrentTeamData();
    assigneesOptions =
      currentTeamData?.members?.map((m: any) => ({
        label: m.userName,
        value: m.userId,
      })) ?? [];
  } catch {
    assigneesOptions = []; // fallback if context not available in this usage
  }

  // recompute derived duration when start/end change
  const derivedDuration = useMemo(
    () => recomputeDuration(startISO, endISO),
    [startISO, endISO]
  );

  // If user edits duration inputs, we'll update endISO relative to startISO
  const setLocalDuration = (h: number, m: number) => {
    setLocalDurHours(h);
    setLocalDurMins(m);
  };

  // Handlers

  const handleStartChange = (date: Date) => {
    const newStartISO = new Date(date).toISOString();
    setStartISO(newStartISO);

    // if user edited duration manually, respect that; else keep same duration (derivedDuration)
    const mins = toNum(localDurHours) * 60 + toNum(localDurMins);
    const newEnd = addMinutes(new Date(newStartISO), mins);
    setEndISO(newEnd.toISOString());
  };

  const handleEndChange = (date: Date) => {
    const newEndISO = new Date(date).toISOString();
    setEndISO(newEndISO);
    // update local duration inputs to reflect start->end
    const newDur = recomputeDuration(startISO, newEndISO);
    setLocalDuration(newDur.hours, newDur.minutes);
  };

  const handleDurationHoursChange = (text: string) => {
    const h = toNum(text);
    setLocalDurHours(h);
    const mins = h * 60 + toNum(localDurMins);
    const newEnd = addMinutes(new Date(startISO), mins);
    setEndISO(newEnd.toISOString());
  };

  const handleDurationMinsChange = (text: string) => {
    const m = toNum(text);
    setLocalDurMins(m);
    const mins = toNum(localDurHours) * 60 + m;
    const newEnd = addMinutes(new Date(startISO), mins);
    setEndISO(newEnd.toISOString());
  };

  const handleStartISOTextChange = (text: string) => {
    setStartISO(text);
    const dur = recomputeDuration(text, endISO);
    setLocalDuration(dur.hours, dur.minutes);
  };

  const handleEndISOTextChange = (text: string) => {
    setEndISO(text);
    const dur = recomputeDuration(startISO, text);
    setLocalDuration(dur.hours, dur.minutes);
  };

  const handleAssigneesChange = (values: string[]) => {
    setAssigneeValues(values ?? []);
    const selected =
      (assigneesOptions ?? [])
        .filter((opt) => values.includes(opt.value))
        .map((opt) => ({ userId: opt.value, userName: opt.label })) ?? [];
    setSelectedAssigneesForPayload(selected);
  };

  // initialize assignee states when task changes
  useEffect(() => {
    if (team) {
      setAssigneeValues(
        ((task as TeamTask).assignees ?? []).map((a) => a.userId)
      );
      setSelectedAssigneesForPayload((task as TeamTask).assignees ?? []);
    }
    // init local duration from task if payload changes
    setLocalDurHours(task.duration?.hours ?? 0);
    setLocalDurMins(task.duration?.minutes ?? 0);
    setStartISO(task.taskStartDateTime);
    setEndISO(task.endTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?._id]);

  // Build final payload
  const getPayload = (): TaskUnion => {
    const cleanCategory = category?.trim() || undefined;
    const finalDuration =
      localDurHours !== undefined || localDurMins !== undefined
        ? { hours: toNum(localDurHours), minutes: toNum(localDurMins) }
        : recomputeDuration(startISO, endISO);

    const base = {
      ...task,
      taskName: name.trim(),
      taskDescription: desc,
      category: cleanCategory,
      taskStartDateTime: new Date(startISO).toISOString(),
      endTime: new Date(endISO).toISOString(),
      isDone,
      priority: (priority as 0 | 1 | 2 | 3) ?? 0,
      duration: finalDuration,
    };

    if (team) {
      const teamPayload: TeamTask = {
        ...(base as TeamTask),
        assignees:
          selectedAssigneesForPayload && selectedAssigneesForPayload.length
            ? selectedAssigneesForPayload
            : (task as TeamTask).assignees ?? [],
      };
      return teamPayload;
    } else {
      const personalPayload: PersonalTask = {
        ...(base as PersonalTask),
        userId: (task as PersonalTask).userId ?? (task as any).userId,
      };
      return personalPayload;
    }
  };

  const save = () => {
    const payload = getPayload();
    if (!payload.taskName || String(payload.taskName).trim().length === 0) {
      Alert.alert("Validation", "Task name cannot be empty");
      return;
    }
    if (payload?.endTime) delete payload.endTime;
    if (payload?.isGap) delete payload.isGap;
    if (payload?.createdAt) delete payload.createdAt;
    if (payload?.updatedAt) delete payload.updatedAt;
    // Call parent handler
    onEdit(payload);
  };

  // UI
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
                  <Text style={styles.badgeText}>
                    {team ? "Team Task" : "My Task"}
                  </Text>
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
                        color={priority === p ? "#fff" : PRIORITY[p].color}
                      />
                      <Text
                        style={[
                          styles.segmentText,
                          {
                            color: priority === p ? "#fff" : PRIORITY[p].color,
                          },
                        ]}
                      >
                        {PRIORITY[p].label}
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

              {/* When & Duration */}
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
                    <Text style={{ color: "#0F172A", fontWeight: "700" }}>
                      {derivedDuration.hours
                        ? `${derivedDuration.hours}h `
                        : ""}
                      {derivedDuration.minutes
                        ? `${derivedDuration.minutes}m`
                        : "0m"}
                    </Text>
                  </Text>
                </View>

                {/* Duration inputs */}
                <View style={{ marginTop: 12, flexDirection: "row", gap: 12 }}>
                  <Input
                    containerStyle={{ flex: 1 }}
                    label="Hours"
                    labelWidth={70}
                    keyboardType="numeric"
                    value={String(localDurHours)}
                    onChangeText={handleDurationHoursChange}
                  />
                  <Input
                    containerStyle={{ flex: 1 }}
                    label="Minutes"
                    labelWidth={70}
                    keyboardType="numeric"
                    value={String(localDurMins)}
                    onChangeText={handleDurationMinsChange}
                  />
                </View>

                {/* Date pickers */}
                <View style={{ marginTop: 12, gap: 8 }}>
                  <DatePicker
                    label="Start"
                    mode="datetime"
                    value={new Date(startISO)}
                    onChange={(d: Date) => handleStartChange(d)}
                  />
                </View>
              </View>

              {/* Assignees (team only) */}
              {team && (
                <View style={styles.card}>
                  <Text style={styles.label}>Assignees</Text>
                  {(task as TeamTask).assignees?.length ? (
                    <View
                      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
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
                    onValuesChange={handleAssigneesChange}
                    placeholder="Select assignees"
                    searchable
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

                <Text style={[styles.inputLabel, { marginTop: 10 }]}>
                  Category
                </Text>
                <TextInput
                  placeholder="e.g., Work, Personal"
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

              {/* Footer */}
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
                    { backgroundColor: "#2563EB", marginBottom: 420 },
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

// ---------------- Styles ---------------------------------------------------

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
  notFoundWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#0F172A",
  },
  notFoundSubtitle: {
    color: "#64748B",
    textAlign: "center",
    marginBottom: 20,
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
