import { tasklist } from "@/dummy/tasklist";
import { usePallet } from "@/hooks/use-pallet";

let selectedDay = "21september2025";

import { StyleSheet, Text, View } from "react-native";

const TaskList = () => {
  const pallet = usePallet();
  const taskListData = tasklist[selectedDay as keyof typeof tasklist] || [];

  return (
    <View style={styles.container}>
      {taskListData.map((task, idx) => {
        const isLast = idx === taskListData.length - 1;
        const isFirst = idx === 0;
        const isDone = task.done;
        return (
          <View key={task.id || idx} style={styles.row}>
            {/* Timeline and icon */}
            <View style={styles.timelineCol}>
              {/* Top dotted line */}
              {!isFirst && (
                <View
                  style={[styles.dottedLine, { borderColor: pallet.shade3 }]}
                />
              )}
              {/* Icon circle */}
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: isDone ? pallet.shade3 : pallet.shade1 },
                ]}
              >
                {/* Replace with your icon logic */}
                {/* <Text style={styles.iconText}>{task.icon || "?"}</Text> */}
                <Text style={styles.iconText}>{"🫥"}</Text>
              </View>
              {/* Bottom dotted line */}
              {!isLast && (
                <View
                  style={[styles.dottedLine, { borderColor: pallet.shade3 }]}
                />
              )}
            </View>
            {/* Task details */}
            <View style={styles.detailsCol}>
              <Text style={styles.timeText}>{task.startTime}</Text>
              <View
                style={[
                  styles.taskBox,
                  isDone && { backgroundColor: pallet.shade4 },
                ]}
              >
                <Text
                  style={[styles.taskTitle, isDone && styles.strikethrough]}
                >
                  {task.title}
                </Text>
                {task.subtitle && (
                  <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
                )}
              </View>
            </View>
            {/* Status check */}
            <View style={styles.statusCol}>
              <View
                style={[
                  styles.statusCircle,
                  {
                    borderColor: isDone ? pallet.shade3 : pallet.shade1,
                    backgroundColor: isDone ? pallet.shade3 : "transparent",
                  },
                ]}
              >
                {isDone && <Text style={styles.checkText}>✓</Text>}
              </View>
            </View>
          </View>
          /* Interval message */
          //   {task.intervalMsg && (
          //     <Text style={styles.intervalMsg}>{task.intervalMsg}</Text>
          //   )}
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  timelineCol: {
    alignItems: "center",
    width: 48,
  },
  dottedLine: {
    width: 2,
    height: 24,
    borderStyle: "dotted",
    borderWidth: 2,
    marginVertical: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  iconText: {
    color: "#fff",
    fontSize: 28,
  },
  detailsCol: {
    flex: 1,
    marginLeft: 12,
  },
  timeText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 2,
  },
  taskBox: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  taskSubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  statusCol: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  statusCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  intervalMsg: {
    color: "#aaa",
    fontSize: 15,
    marginLeft: 60,
    marginBottom: 8,
  },
});

export default TaskList;
