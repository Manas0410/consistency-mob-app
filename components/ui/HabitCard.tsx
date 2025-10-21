import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "@/theme/globals";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Habit {
  name: string;
  completed: number;
  total: number;
  icon: string;
  color: string;
  done: boolean;
}

interface HabitCardProps {
  habits?: Habit[];
  onManage?: () => void;
}

const defaultHabits: Habit[] = [
  {
    name: "Morning Run",
    completed: 5,
    total: 7,
    icon: "walk",
    color: "#D6E7FF",
    done: true,
  },
  {
    name: "Meditate",
    completed: 7,
    total: 7,
    icon: "medkit",
    color: "#EDE6FF",
    done: true,
  },
  {
    name: "Read 10 pages",
    completed: 3,
    total: 7,
    icon: "book",
    color: "#FFF3E2",
    done: false,
  },
];

export default function HabitCard({
  habits = defaultHabits,
  onManage,
}: HabitCardProps) {
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Top 3 Habits</Text>
      <View style={{ marginTop: 12 }}>
        {habits.map((habit, idx) => (
          <View key={habit.name} style={styles.habitRow}>
            <View style={[styles.iconCircle, { backgroundColor: habit.color }]}>
              <Ionicons
                name={habit.icon as any}
                size={28}
                color={colors.tint}
              />
            </View>
            <View style={styles.habitInfo}>
              <Text style={[styles.habitName, { color: colors.text }]}>
                {habit.name}
              </Text>
              <Text style={[styles.habitSub, { color: colors.icon }]}>
                Completed {habit.completed}/{habit.total} days
              </Text>
            </View>
            <View style={styles.habitStatus}>
              {habit.done ? (
                <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              ) : (
                <Ionicons name="ellipse-outline" size={28} color="#B0B6C2" />
              )}
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.manageBtn} onPress={onManage}>
        <Text style={styles.manageText}>
          Manage Habits{" "}
          <Ionicons name="arrow-forward" size={18} color="#2196F3" />
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.base,
    minWidth: 320,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.xs,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.snug,
  },
  habitSub: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: SPACING.xs,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
  },
  habitStatus: {
    marginLeft: SPACING.sm,
  },
  manageBtn: {
    backgroundColor: "#E0E7FF",
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  manageText: {
    color: "#6366F1",
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
});
