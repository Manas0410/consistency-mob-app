// ModeStarter.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { RadioGroup } from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useSelectMode } from "@/contexts/select-mode-context"; // path to your provider hook
import { useGetCurrentDayTask } from "@/contexts/todays-tasks-context";
import { usePallet } from "@/hooks/use-pallet";
import { useRouter } from "expo-router";
import { Apple, Plus, Target } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Animated,
  View as RNView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const modes = {
  pomodoro: {
    modeName: "Pomodoro Mode",
    about:
      "The Pomodoro technique uses cycles of focused work followed by short breaks. Typically 25 minutes of deep work, then a 5-minute break. This helps maintain high focus while preventing mental fatigue.",
    defaultMinutes: 25,
  },
  focus: {
    modeName: "Focus Mode",
    about:
      "A continuous, distraction-free work session with no scheduled breaks. You pick the duration and stay locked in until the timer ends. Ideal for tasks requiring deep concentration or creative flow.",
    defaultMinutes: 45,
  },
};

const PRESETS = [15, 25, 30, 45, 60];

type ModeStarterProps = { mode: "pomodoro" | "focus" };

const ModeStarter = ({ mode }: ModeStarterProps) => {
  const pallet = usePallet();
  const { currentDayTask } = useGetCurrentDayTask();
  const router = useRouter();

  // context
  const { hydrated, isModeTaskInProgress, selectedWorkMode, startMode } =
    useSelectMode();

  // Only show incomplete tasks
  const incompleteTasks = useMemo(
    () => (currentDayTask || []).filter((t: any) => !t?.isDone),
    [currentDayTask]
  );

  const radioTasksOptions = useMemo(
    () =>
      incompleteTasks.map((t: any) => ({
        label: t.taskName ?? "Untitled",
        value: String(t._id),
      })),
    [incompleteTasks]
  );

  const customTaskMap = useMemo(
    () =>
      Object.fromEntries(
        incompleteTasks.map((t: any) => [String(t._id), t])
      ) as Record<string, any>,
    [incompleteTasks]
  );

  // UI state
  const [showTaskImport, setShowTaskImport] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // Duration state in minutes
  const [selectedMinutes, setSelectedMinutes] = useState<number>(
    modes[mode].defaultMinutes
  );
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(modes[mode].defaultMinutes);

  const chipScale = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    const task = customTaskMap?.[selectedTaskId];
    setSelectedTask(task ?? null);
    if (task && task.duration) {
      const mins =
        (task.duration.hours ?? 0) * 60 + (task.duration.minutes ?? 0);
      setSelectedMinutes(mins);
      setHours(Math.floor(mins / 60));
      setMinutes(mins % 60);
    } else {
      setSelectedMinutes(modes[mode].defaultMinutes);
      setHours(Math.floor(modes[mode].defaultMinutes / 60));
      setMinutes(modes[mode].defaultMinutes % 60);
    }
  }, [selectedTaskId, customTaskMap, mode]);

  useEffect(() => {
    const total = (hours || 0) * 60 + (minutes || 0);
    setSelectedMinutes(total);
  }, [hours, minutes]);

  // If there is an ongoing mode, immediately redirect user to that mode screen
  useEffect(() => {
    if (!hydrated) return; // wait for persisted state load
    if (isModeTaskInProgress) {
      // Redirect to the ongoing mode route
      const dest = selectedWorkMode ?? "pomodoro";
      router.replace(`/calendar/mode/${dest}`);
    }
  }, [hydrated, isModeTaskInProgress, selectedWorkMode, router]);

  const pickPreset = (m: number) => {
    setSelectedMinutes(m);
    setHours(Math.floor(m / 60));
    setMinutes(m % 60);
  };

  const incHours = () => setHours((h) => Math.min(12, (h || 0) + 1));
  const decHours = () => setHours((h) => Math.max(0, (h || 0) - 1));
  const incMinutes = () =>
    setMinutes((m) => {
      const next = (m || 0) + 5;
      return next >= 60 ? 55 : next;
    });
  const decMinutes = () => setMinutes((m) => Math.max(0, (m || 0) - 5));

  const animateChip = () => {
    Animated.sequence([
      Animated.timing(chipScale, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(chipScale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Starts the mode via context, persist, and navigate
  const handleStart = () => {
    // If another mode is ongoing, block starting new one
    if (isModeTaskInProgress) {
      if (selectedWorkMode === mode) {
        // same mode ongoing — navigate to it
        router.replace(`/calendar/mode/${mode}`);
        return;
      }
      // different mode ongoing — ask user
      Alert.alert(
        "Mode already running",
        `A ${selectedWorkMode} session is currently running. You must cancel it before starting a new one.`,
        [
          {
            text: "Go to running mode",
            onPress: () => router.replace(`/calendar/mode/${selectedWorkMode}`),
          },
          { text: "Cancel", style: "cancel" },
        ],
        { cancelable: true }
      );
      return;
    }

    // assemble payload — include duration so it persists with selectedModeTask
    const durationPayload = {
      durationMinutes: selectedMinutes,
      hours,
      minutes,
    };

    // If user imported an existing task, include its id and meta
    const taskPayload = selectedTask
      ? {
          _id: selectedTask._id,
          taskName: selectedTask.taskName,
          originalTaskDuration: selectedTask.duration || null,
          // include chosen duration as the working session duration
          durationMinutes: selectedMinutes,
        }
      : {
          // no task selected; store a small synthetic object carrying duration
          durationMinutes: selectedMinutes,
        };

    // Call context startMode — persist state and mark in-progress
    startMode({
      task: {
        mode,
        ...taskPayload,
        // helpful debugging metadata
        startedAtClient: new Date().toISOString(),
      },
      custom: !selectedTask, // custom if no task imported
      startedAt: new Date(),
    });

    console.log("▶️ ModeStarter start:", {
      mode,
      durationMinutes: selectedMinutes,
      selectedTaskId: selectedTask?._id ?? null,
      selectedTaskName: selectedTask?.taskName ?? null,
    });

    // navigate to the mode screen
    router.replace(`/calendar/mode/${mode}`);
  };

  return (
    <View style={{ padding: 18 }}>
      <View
        style={[
          styles.badge,
          { backgroundColor: pallet.buttonBg, shadowColor: pallet.shade3 },
        ]}
      >
        <Icon
          name={mode === "pomodoro" ? Apple : Target}
          color={pallet.ButtonText}
        />
      </View>

      <Text variant="title" style={[styles.title, { color: pallet.shade1 }]}>
        {modes[mode].modeName}
      </Text>
      <Text
        variant="caption"
        style={[styles.subtitle, { color: pallet.shade2 }]}
      >
        Select a duration to begin a focused session
      </Text>

      <View style={styles.rowBetween}>
        <Button
          onPress={() => {
            setShowTaskImport((s) => !s);
            setSelectedTaskId("");
          }}
          variant="ghost"
          style={{ paddingVertical: 8, backgroundColor: pallet.buttonBg }}
        >
          <Plus color={pallet.ButtonText} />
          <Text style={{ color: pallet.ButtonText, marginLeft: 8 }}>
            {showTaskImport ? "Cancel import" : "Import task duration"}
          </Text>
        </Button>
      </View>

      {showTaskImport ? (
        <View style={{ marginTop: 12 }}>
          {!incompleteTasks.length ? (
            <Text
              variant="caption"
              style={{
                textAlign: "center",
                marginVertical: 12,
                color: pallet.shade2,
              }}
            >
              No incomplete tasks for today
            </Text>
          ) : (
            <View style={{ marginVertical: 8 }}>
              <RadioGroup
                options={radioTasksOptions}
                value={selectedTaskId}
                onValueChange={setSelectedTaskId}
              />
              {selectedTask ? (
                <View style={styles.taskPreview}>
                  <Text variant="subtitle" style={{ fontWeight: "600" }}>
                    {selectedTask.taskName}
                  </Text>
                  <Text variant="caption" style={{ color: pallet.shade2 }}>
                    Duration: {selectedTask.duration?.hours ?? 0}h{" "}
                    {selectedTask.duration?.minutes ?? 0}m
                  </Text>
                </View>
              ) : null}
            </View>
          )}
        </View>
      ) : (
        <View style={{ marginTop: 12 }}>
          <Text
            variant="caption"
            style={{ textAlign: "center", color: pallet.shade2 }}
          >
            OR
          </Text>
          <Text
            variant="subtitle"
            style={{ textAlign: "center", marginTop: 6 }}
          >
            Start with a custom duration
          </Text>

          <RNView style={styles.chipsWrap}>
            {PRESETS.map((p) => {
              const active = p === selectedMinutes;
              return (
                <Animated.View
                  key={p}
                  style={{ transform: [{ scale: chipScale }] }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      animateChip();
                      pickPreset(p);
                    }}
                    activeOpacity={0.8}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active
                          ? pallet.shade1
                          : pallet.buttonBg,
                        borderColor: active ? pallet.shade1 : pallet.shade3,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: active ? "#fff" : pallet.shade1,
                        fontWeight: "600",
                      }}
                    >{`${p} min`}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </RNView>

          <RNView style={styles.customRow}>
            <RNView style={styles.counter}>
              <Text variant="caption" style={{ color: pallet.shade2 }}>
                Hours
              </Text>
              <RNView style={styles.counterInner}>
                <TouchableOpacity style={styles.counterBtn} onPress={decHours}>
                  <Text style={{ fontSize: 18 }}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.counterValue, { color: pallet.shade1 }]}>
                  {hours}
                </Text>
                <TouchableOpacity style={styles.counterBtn} onPress={incHours}>
                  <Text style={{ fontSize: 18 }}>+</Text>
                </TouchableOpacity>
              </RNView>
            </RNView>

            <RNView style={styles.counter}>
              <Text variant="caption" style={{ color: pallet.shade2 }}>
                Minutes
              </Text>
              <RNView style={styles.counterInner}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={decMinutes}
                >
                  <Text style={{ fontSize: 18 }}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.counterValue, { color: pallet.shade1 }]}>
                  {minutes.toString().padStart(2, "0")}
                </Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={incMinutes}
                >
                  <Text style={{ fontSize: 18 }}>+</Text>
                </TouchableOpacity>
              </RNView>
            </RNView>
          </RNView>

          <View style={styles.summary}>
            <Text variant="subtitle" style={{ fontWeight: "600" }}>
              Selected
            </Text>
            <Text variant="caption" style={{ color: pallet.shade2 }}>
              {Math.floor(selectedMinutes / 60)}h {selectedMinutes % 60}m (
              {selectedMinutes} minutes)
            </Text>
            {selectedTask ? (
              <Text
                variant="caption"
                style={{ color: pallet.shade2, marginTop: 6 }}
              >
                For task:{" "}
                <Text style={{ fontWeight: "600" }}>
                  {selectedTask.taskName}
                </Text>
              </Text>
            ) : null}
          </View>
        </View>
      )}

      <View style={{ marginTop: 18 }}>
        <Button
          onPress={handleStart}
          variant="default"
          style={{
            width: "100%",
            borderRadius: 12,
            backgroundColor: pallet.shade1,
          }}
        >
          <Text style={{ color: "#fff", marginLeft: 8 }}>
            Start {modes[mode].modeName.split(" ")[0]} • {selectedMinutes}m
          </Text>
        </Button>
      </View>

      <View style={{ marginTop: 14, marginBottom: 350 }}>
        <Accordion
          key={mode}
          type="single"
          style={{ backgroundColor: "#fff", padding: 10, borderRadius: 8 }}
          collapsible
        >
          <AccordionItem value={"mode"}>
            <AccordionTrigger>
              <Text>
                About{" "}
                <Text style={{ color: pallet.shade1 }}>
                  {modes[mode].modeName}
                </Text>
              </Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text
                variant="caption"
                style={{ marginHorizontal: 6, fontSize: 12 }}
              >
                {modes[mode].about}
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  chipsWrap: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    marginHorizontal: 6,
    marginVertical: 6,
    minWidth: 72,
    alignItems: "center",
  },
  customRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  counter: {
    flex: 1,
    alignItems: "center",
  },
  counterInner: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  counterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  counterValue: {
    minWidth: 36,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  summary: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  taskPreview: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    backgroundColor: "#fff",
  },
});

export default ModeStarter;
