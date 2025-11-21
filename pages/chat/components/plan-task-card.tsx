import { Icon } from "@/components/ui/icon"; // adjust your Icon import
import PriorityLabel from "@/components/ui/prioritty-label";
import { Colors } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { addHours, addMinutes, format, parseISO } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react-native"; // or your icon source
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

export const PlanTaskCard: React.FC<CardProps> = ({ task, open = false }) => {
  const [expanded, setExpanded] = useState(open);
  const colors = Colors.light; // Always use light theme
  const textColor = useColor({}, "text");
  const textMutedColor = useColor({}, "textMuted");
  const iconColor = useColor({}, "icon");
  const cardBackgroundColor = useColor({}, "background");

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

  return (
    <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.8}
      >
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: textColor }]}>
            {task.taskName}
          </Text>
          <View style={{ alignItems: "flex-end", gap: 4 }}>
            <PriorityLabel priority={task.priority} />
          </View>
        </View>
        <Text style={styles.arrow}>
          <Icon
            name={expanded ? ChevronUp : ChevronDown}
            width={24}
            height={24}
            stroke={iconColor}
          />
        </Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.details}>
          <Text
            style={[styles.timeText, { color: textMutedColor || iconColor }]}
          >
            {format(task.TaskStartDateTime, "dd-MM-yyyy")}
          </Text>
          <Text
            style={[styles.timeText, { color: textMutedColor || iconColor }]}
          >
            {timeRange}
          </Text>

          {task.taskDescription && (
            <Text style={[styles.desc, { color: textMutedColor || iconColor }]}>
              {task.taskDescription}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
    flexShrink: 1,
  },
  flagIcon: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 16,
    marginLeft: 8,
  },
  details: {
    marginTop: 8,
  },
  timeText: {
    fontSize: 15,
    marginBottom: 6,
  },
  priorityLabel: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 14,
  },
  desc: {
    fontSize: 15,
  },
});
