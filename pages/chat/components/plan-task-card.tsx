import { Icon } from "@/components/ui/icon"; // adjust your Icon import
import { addHours, addMinutes, format, parseISO } from "date-fns";
import { ChevronDown, ChevronUp, Flag } from "lucide-react-native"; // or your icon source
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PRIORITY_MAPPING = {
  0: { label: "Low", color: "#10b981" },
  1: { label: "Medium", color: "#f59e0b" },
  2: { label: "High", color: "#ef4444" },
};

type Task = {
  TaskStartDateTime: string;
  duration: { hours: number; minutes: number };
  taskName: string;
  taskDescription?: string;
  priority: 0 | 1 | 2;
};

type CardProps = {
  task: Task;
  open?: boolean;
};

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 2:
      return "High";
    case 1:
      return "Medium";
    default:
      return "Low";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 2:
      return { text: "#EF4444", bg: "#FEF2F2" };
    case 1:
      return { text: "#F97316", bg: "#FFF7ED" };
    default:
      return { text: "#3B82F6", bg: "#EFF6FF" };
  }
};

export const PlanTaskCard: React.FC<CardProps> = ({ task, open = false }) => {
  const [expanded, setExpanded] = useState(open);

  const startDate = parseISO(task.TaskStartDateTime);
  const endDate = addHours(
    addMinutes(startDate, task.duration.minutes),
    task.duration.hours
  );

  const timeRange = `${format(startDate, "hh:mm a")} - ${format(
    endDate,
    "hh:mm a"
  )}`;

  const priority = PRIORITY_MAPPING[task.priority] || PRIORITY_MAPPING[0];
  const priorityColors = getPriorityColor(task.priority);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.8}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>{task.taskName}</Text>
          <View style={{ alignItems: "flex-end", gap: 4 }}>
            <View
              style={{
                backgroundColor: priorityColors.bg,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: priorityColors.text,
                }}
              >
                {getPriorityLabel(task.priority)}
              </Text>

              {task.priority === 2 && (
                <Flag size={14} color={priorityColors.text} />
              )}
            </View>
          </View>
        </View>
        <Text style={styles.arrow}>
          <Icon
            name={expanded ? ChevronUp : ChevronDown}
            width={24}
            height={24}
            stroke="#363d4e"
          />
        </Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.details}>
          <Text style={styles.timeText}>
            {format(task.TaskStartDateTime, "dd-MM-yyyy")}
          </Text>
          <Text style={styles.timeText}>{timeRange}</Text>

          {task.taskDescription && (
            <Text style={styles.desc}>{task.taskDescription}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
    width: 300,
    // maxWidth: "95%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#26304a",
    flexShrink: 1,
  },
  flagIcon: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 16,
    color: "#363d4e",
    marginLeft: 8,
  },
  details: {
    marginTop: 8,
  },
  timeText: {
    fontSize: 15,
    color: "#656d79",
    marginBottom: 6,
  },
  priorityLabel: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 14,
  },
  desc: {
    color: "#656d79",
    fontSize: 15,
  },
});
