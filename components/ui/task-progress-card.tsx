import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";
import { RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "@/theme/globals";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const pieData = [
  { value: 70, color: "#177AD5" },
  { value: 30, color: "lightgray" },
];

interface TaskProgressCardProps {
  percentage: number; // 0-100
  tasks: { name: string; done: boolean }[];
  onTaskToggle?: (index: number) => void;
  onSeeDetail?: () => void;
}

export default function TaskProgressCard({
  percentage,
  tasks,
  onTaskToggle,
  onSeeDetail,
}: TaskProgressCardProps) {
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;
  const chartData = {
    labels: ["progress"],
    data: [percentage / 100],
  };

  const pallet = usePallet();
  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <View style={[styles.leftBox, { backgroundColor: "transparent" }]}>
        <View
          style={[
            styles.chartContainer,
            { backgroundColor: "transparent", borderWidth: 0 },
          ]}
        >
          <PieChart
            donut
            radius={80}
            innerRadius={65}
            data={pieData}
            centerLabelComponent={() => {
              return <Text style={{ fontSize: 30 }}>70%</Text>;
            }}
          />
        </View>
      </View>
      <View style={styles.rightBox}>
        <View>
          <Text style={[styles.statusTitle, { color: colors.text }]}>
            Today's task :
          </Text>
          <Text>Tasks Completed : 10</Text>
          <Text>Tasks Pending : 5</Text>
        </View>
        <TouchableOpacity onPress={onSeeDetail} style={styles.detailBtn}>
          <Text style={[styles.detailText, { color: colors.tint }]}>
            See detailed view
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: "center",
    ...SHADOWS.base,
  },
  leftBox: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginRight: SPACING.lg,
  },
  chartContainer: {
    position: "relative",
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  centerTextBox: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  rightBox: {
    flex: 1,
    paddingLeft: 0,
    justifyContent: "space-between",
    flexDirection: "column",
    height: 160,
    paddingTop: SPACING.sm,
  },
  statusTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: SPACING.sm,
    lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.snug,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  taskName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    flex: 1,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.normal,
  },
  checkbox: {
    marginLeft: SPACING.md,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    padding: SPACING.xs,
  },
  detailBtn: {
    alignSelf: "flex-end",
    marginTop: SPACING.md,
  },
  detailText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textDecorationLine: "underline",
  },
});

{
  /* <Text style={[styles.statusTitle, { color: colors.text }]}>
          Today's task :
        </Text>
        {tasks.map((task, idx) => (
          <View key={idx} style={styles.taskRow}>
            <Text style={[styles.taskName, { color: colors.textSecondary }]}>
              {task.name}
            </Text>
            <TouchableOpacity
              onPress={() => onTaskToggle && onTaskToggle(idx)}
              style={[styles.checkbox, { borderColor: colors.text }]}
            >
              {task.done ? (
                <Ionicons name="checkbox" size={22} color={colors.text} />
              ) : (
                <Ionicons
                  name="square-outline"
                  size={22}
                  color={colors.background}
                  style={{ borderWidth: 1, borderColor: colors.text }}
                />
              )}
            </TouchableOpacity>
          </View>
        ))} */
}
