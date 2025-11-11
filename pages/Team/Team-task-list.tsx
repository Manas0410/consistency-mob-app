import { Icon } from "@/components/ui/icon";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentTeamData } from "@/contexts/team-data-context";
import { usePallet } from "@/hooks/use-pallet";
import { addHours, differenceInMinutes, format, parseISO } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { ClockPlus, FileText, Flag, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PeriodIcon from "../task-viewer/components/period-icon";
import { getTeamTasks } from "./API/api-calls";
import TeamStatusChangeCheckbox from "./components/team-status-change-checkbox";

const MIN_GAP_MINUTES = 120;

const getTimeStr = (date: string) => format(parseISO(date), "h:mm a");
const PRIORITY_MAPPING = {
  0: { label: "Low", color: "#10b981" },
  1: { label: "Medium", color: "#f59e0b" },
  2: { label: "High", color: "#ef4444" },
};

const getTimeDuration = (start: string, end: string) => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  const mins = differenceInMinutes(endDate, startDate);
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${hours ? `${hours}h` : ""} ${minutes ? `${minutes}m` : ""}`.trim();
};

// {
//   "taskName": "Team 1",
//   "taskDescription": "Ddfg",
//   "taskStartDateTime": "2025-10-22T20:28:28.381Z",
//   "endTime": "2025-10-22T20:58:28.381Z",
//   "duration": {
//     "hours": 0,
//     "minutes": 30
//   },
//   "priority": 0,
//   "isDone": false,
//   "isHabbit": false,
//   "frequency": [
//     0,
//     8
//   ],
//   "assignees": [
//     {
//       "userId": "user_34IAd9X7gJrqzoBOUSq8ZVOGneH",
//       "userName": "qwerty"
//     }
//   ]
// }

const TeamTaskList = ({ selectedDate }: { selectedDate: Date }) => {
  const pallet = usePallet();
  const [taskListData, setTaskListData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentTeamData } = useCurrentTeamData();
  const { teamid } = useLocalSearchParams();

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await getTeamTasks(teamid, selectedDate);
      if (res.success) setTaskListData(res?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  // Sort tasks by start time for correct timeline order
  const sortedTasks = [...taskListData].sort(
    (a, b) =>
      new Date(a.taskStartDateTime).getTime() -
      new Date(b.taskStartDateTime).getTime()
  );

  // Build timeline with gap blocks if >2hr gap
  let timeline: any[] = [];
  for (let i = 0; i <= sortedTasks.length; i++) {
    const prevEnd =
      i === 0
        ? addHours(new Date(selectedDate), 6) // 6:00 AM
        : parseISO(sortedTasks[i - 1].endTime);
    const nextStart =
      i === sortedTasks.length
        ? addHours(new Date(selectedDate), 23) // 11:00 PM
        : parseISO(sortedTasks[i]?.taskStartDateTime);

    const gapMinutes = differenceInMinutes(nextStart, prevEnd);
    if (gapMinutes >= MIN_GAP_MINUTES && i < sortedTasks.length) {
      // Add gap block with Add Task
      timeline.push({
        isGap: true,
        gapStart: prevEnd,
        gapEnd: nextStart,
        gapHours: Math.floor(gapMinutes / 60),
        gapMins: gapMinutes % 60,
      });
    }
    // Insert real task if in bounds
    if (i < sortedTasks.length) {
      timeline.push({ ...sortedTasks[i], isGap: false });
    }
  }

  if (loading) {
    return (
      <View
        style={{
          height: "70%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner variant="bars" size="default" color={pallet.shade1} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {timeline.map((item, idx) =>
          item.isGap ? (
            <View key={item._id || idx} style={styles.row}>
              <View style={styles.timelineCol}>
                <Text style={[styles.gapTime, { color: pallet.shade1 }]}>
                  {format(item.gapStart, "h:mm a")}
                </Text>
                <View
                  style={[styles.dottedLine, { borderColor: pallet.shade3 }]}
                />
                <Text style={[styles.gapTime, { color: pallet.shade1 }]}>
                  {format(item.gapEnd, "h:mm a")}
                </Text>
              </View>
              <View key={`gap-${idx}`} style={styles.gapBlock}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Icon name={ClockPlus} size={18} />
                  <Text style={styles.gapMsg}>
                    Use {item.gapHours ? `${item.gapHours}h ` : ""}
                    {item.gapMins ? `${item.gapMins}m` : ""}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.addBtn, { backgroundColor: pallet.shade3 }]}
                >
                  <Text style={[styles.addBtnText, { color: "#fff" }]}>
                    + Add Task
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View key={item._id || idx} style={styles.row}>
              {/* Timeline: pill with icon, vertical line above/below */}
              <View style={styles.timelineCol}>
                {idx !== 0 && (
                  <View
                    style={[styles.dottedLine, { borderColor: pallet.shade3 }]}
                  />
                )}
                <PeriodIcon startTime={item.taskStartDateTime} />
                {idx < timeline.length - 1 && (
                  <View
                    style={[styles.dottedLine, { borderColor: pallet.shade3 }]}
                  />
                )}
              </View>
              {/* Task details */}
              <View style={styles.detailsCol}>
                <Text style={styles.timeText}>
                  {getTimeStr(item.taskStartDateTime)} -{" "}
                  {getTimeStr(item.endTime)}{" "}
                  <Text style={styles.durationText}>
                    ({getTimeDuration(item.taskStartDateTime, item.endTime)})
                  </Text>
                </Text>
                <View
                  style={[
                    styles.taskBox,
                    item.isDone && { backgroundColor: pallet.shade4 },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Icon
                      name={Flag}
                      size={18}
                      fill={PRIORITY_MAPPING[item.priority].color}
                      stroke={PRIORITY_MAPPING[item.priority].color}
                    />
                    <Text
                      style={{ color: PRIORITY_MAPPING[item.priority].color }}
                    >
                      {PRIORITY_MAPPING[item.priority].label}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.taskTitle,
                      item.isDone && styles.strikethrough,
                    ]}
                  >
                    {item.taskName}
                  </Text>
                  {item.taskDescription && <Icon name={FileText} size={18} />}
                  {item?.assignees?.length ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Icon name={Users} size={18} />
                      <Text>{item.assignees.length} Assignees</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              {/* Status check pill */}
              <View style={styles.statusCol}>
                <TeamStatusChangeCheckbox
                  isChecked={item.isDone}
                  teamId={teamid}
                  taskId={item?._id}
                />
              </View>
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  timelineCol: {
    alignItems: "center",
    width: 48,
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
    fontSize: 28,
  },
  dottedLine: {
    width: 2,
    height: 24,
    borderStyle: "dotted",
    borderWidth: 2,
    marginVertical: 2,
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
  durationText: {
    color: "#F49F6D",
    fontWeight: "600",
  },
  taskBox: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    gap: 6,
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

  gapBlock: {
    alignItems: "flex-start",
    marginVertical: 16,
    paddingLeft: 20,
    borderRadius: 18,
    justifyContent: "center",
  },

  gapMsg: {
    color: "#FD764F",
    fontWeight: "400",
    // marginVertical: 2,
    fontSize: 14,
  },

  gapTime: {
    fontWeight: "400",
    fontSize: 12,
    marginBottom: 2,
    textAlign: "center",
  },
  addBtn: {
    marginTop: 6,
    paddingHorizontal: 40,
    paddingVertical: 6,
    borderRadius: 32,
  },
  addBtnText: {
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 0.1,
  },
});

export default TeamTaskList;
