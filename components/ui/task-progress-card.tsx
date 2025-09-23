import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const pieData = [
  { value: 70, color: "#59AC77" },
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
    borderRadius: 18,
    padding: 18,
    margin: 12,
    borderWidth: 2,
    alignItems: "center",
    borderColor: "#e0e0e0",
  },
  leftBox: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    padding: 8,
    marginRight: 18,
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
    fontSize: 22,
    fontWeight: "bold",
  },
  rightBox: {
    flex: 1,
    paddingLeft: 0,
    justifyContent: "space-between",
    flexDirection: "column",
    height: 160,
    paddingTop: 10,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  taskName: {
    fontSize: 16,
    flex: 1,
  },
  checkbox: {
    marginLeft: 12,
    borderWidth: 1,
    borderRadius: 4,
    padding: 2,
  },
  detailBtn: {
    alignSelf: "flex-end",
    marginTop: 12,
  },
  detailText: {
    fontSize: 15,
    fontWeight: "500",
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
