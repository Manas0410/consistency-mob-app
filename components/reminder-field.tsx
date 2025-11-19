// RemindersEditor.tsx
import { Trash2 } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Icon } from "./ui/icon";

export type ReminderPayload = {
  id: string; // local id for UI
  offset: number; // minutes before start (number)
  label?: string;
};

type Props = {
  initialReminders?: ReminderPayload[]; // optional initial data
  onChange?: (reminders: Omit<ReminderPayload, "id">[]) => void;
  maxReminders?: number; // default 5
  collapsedByDefault?: boolean; // default true
};

export default function RemindersEditor({
  initialReminders = [],
  onChange,
  maxReminders = 5,
  collapsedByDefault = true,
}: Props) {
  const [open, setOpen] = useState(!collapsedByDefault);
  const [reminders, setReminders] = useState<ReminderPayload[]>(
    () =>
      (initialReminders || []).map((r) => ({
        id: generateId(),
        offset: typeof (r as any).offset === "number" ? r.offset : 10,
        label: r.label ?? "",
      })) || []
  );
  const presetOptions = useMemo(() => [5, 10, 15, 30, 60], []);

  useEffect(() => {
    // Emit changes (strip local id before sending)
    onChange?.(
      reminders.map((r) => ({
        offset: r.offset,
        label: r.label,
      }))
    );
  }, [reminders, onChange]);

  function generateId() {
    return `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
  }

  const addEmptyReminder = (offsetValue?: number) => {
    if (reminders.length >= maxReminders) {
      // optional: show toast / alert
      Alert.alert(
        "Limit reached",
        `You can add up to ${maxReminders} reminders only.`
      );
      return;
    }
    const newR: ReminderPayload = {
      id: generateId(),
      offset: typeof offsetValue === "number" ? offsetValue : 10,
      label: "",
    };
    setReminders((p) => [...p, newR]);
  };

  const removeReminder = (id: string) => {
    setReminders((p) => p.filter((r) => r.id !== id));
  };

  const updateReminder = (id: string, patch: Partial<ReminderPayload>) => {
    setReminders((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const renderReminder = ({ item }: { item: ReminderPayload }) => {
    const offsetError =
      typeof item.offset !== "number" ||
      item.offset < 0 ||
      !Number.isFinite(item.offset);

    return (
      <View style={styles.reminderRow}>
        <View style={styles.leftCol}>
          <Text style={styles.smallLabel}>Remind before</Text>
          <View style={styles.offsetWrap}>
            <TextInput
              keyboardType="numeric"
              value={String(item.offset)}
              onChangeText={(t) => {
                // allow only digits
                const parsed = parseInt(t.replace(/[^\d]/g, ""), 10);
                updateReminder(item.id, {
                  offset: Number.isNaN(parsed) ? 0 : parsed,
                });
              }}
              style={[styles.offsetInput, offsetError && styles.inputError]}
              placeholder="minutes"
              maxLength={5}
            />
            <Text style={styles.offsetUnit}>min</Text>
          </View>
        </View>

        {/* <View style={styles.rightCol}>
          <Text style={styles.smallLabel}>Label (optional)</Text>
          <TextInput
            style={styles.labelInput}
            placeholder="e.g. 'Wake reminder'"
            value={item.label}
            onChangeText={(t) => updateReminder(item.id, { label: t })}
            maxLength={60}
            returnKeyType="done"
          />
        </View> */}

        <Pressable
          onPress={() => removeReminder(item.id)}
          style={({ pressed }) => [
            styles.deleteBtn,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Icon name={Trash2} size={20} color="#EF4444" />
        </Pressable>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ width: "100%" }}
    >
      <View style={styles.container}>
        <Pressable
          onPress={() => setOpen((s) => !s)}
          style={({ pressed }) => [styles.header, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.headerTitle}>
            {reminders.length > 0
              ? `Reminders (${reminders.length})`
              : "Add reminders"}
          </Text>
          <Text style={styles.headerAction}>{open ? "Hide" : "Add"}</Text>
        </Pressable>

        {open && (
          <View style={styles.body}>
            <Text style={styles.hint}>
              You can add up to {maxReminders} reminders. We will notify minutes
              before the task starts.
            </Text>

            {/* Preset chips */}
            <View style={styles.presetRow}>
              {presetOptions.map((p) => {
                const disabled = reminders.length >= maxReminders;
                return (
                  <Pressable
                    key={p}
                    onPress={() => !disabled && addEmptyReminder(p)}
                    style={({ pressed }) => [
                      styles.chip,
                      disabled && styles.chipDisabled,
                      pressed && !disabled && { opacity: 0.85 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        disabled && styles.chipTextDisabled,
                      ]}
                    >{`${p}m`}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Add button */}
            <View style={styles.addRow}>
              <Pressable
                onPress={() => addEmptyReminder(10)}
                disabled={reminders.length >= maxReminders}
                style={({ pressed }) => [
                  styles.addBtn,
                  reminders.length >= maxReminders && styles.addBtnDisabled,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={styles.addBtnText}>
                  {reminders.length >= maxReminders
                    ? "Max reached"
                    : "Add custom reminder"}
                </Text>
              </Pressable>

              {/* {reminders.length > 0 && (
                <Pressable
                  onPress={() =>
                    setReminders((prev) =>
                      prev.map((r) => ({ ...r, offset: Math.max(0, r.offset) }))
                    )
                  }
                  style={({ pressed }) => [
                    styles.clearBtn,
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text style={styles.clearBtnText}>Normalize offsets</Text>
                </Pressable>
              )} */}
            </View>

            {/* List of reminders */}
            <View style={{ marginTop: 12 }}>
              <FlatList
                data={reminders}
                keyExtractor={(i) => i.id}
                renderItem={renderReminder}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>
                    No reminders yet — add one above.
                  </Text>
                )}
                scrollEnabled={false}
              />
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 12,
  },
  header: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // subtle shadow
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerAction: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "700",
  },
  body: {
    marginTop: 10,
    backgroundColor: "#FBFBFD",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  hint: {
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 12,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EEF2FF",
    marginRight: 4,
    marginBottom: 8,
  },
  chipDisabled: {
    backgroundColor: "#F8FAFC",
    borderColor: "#F1F5F9",
  },
  chipText: {
    color: "#0F172A",
    fontWeight: "700",
  },
  chipTextDisabled: {
    color: "#94A3B8",
  },
  addRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    alignItems: "center",
  },
  addBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 160,
    alignItems: "center",
  },
  addBtnDisabled: {
    backgroundColor: "#E6EEF9",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  clearBtn: {
    marginLeft: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  clearBtnText: {
    color: "#2563EB",
    fontWeight: "700",
  },
  reminderRow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  leftCol: {
    width: 120,
    marginRight: 10,
  },
  rightCol: {
    flex: 1,
  },
  smallLabel: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  offsetWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  offsetInput: {
    backgroundColor: "#FBFBFD",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    // minWidth: 78,
    width: 150,
    textAlign: "center",
    fontWeight: "700",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  offsetUnit: {
    marginLeft: 8,
    color: "#64748B",
    fontWeight: "700",
  },
  labelInput: {
    backgroundColor: "#FBFBFD",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  deleteBtn: {
    marginLeft: "auto",
    paddingHorizontal: 8,
    marginTop: 28,
  },
  deleteTxt: {
    color: "#EF4444",
    fontWeight: "700",
  },
  emptyText: {
    color: "#94A3B8",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 18,
  },
  inputError: {
    borderColor: "#FCA5A5",
  },
});
