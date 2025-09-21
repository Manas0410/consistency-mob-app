import { usePallet } from "@/hooks/use-pallet";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const durations = ["1m", "15m", "30m", "45m", "1hr", "..."];

export default function AddForm() {
  const pallet = usePallet();
  const [title, setTitle] = useState("");
  const [planned, setPlanned] = useState(true);
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("15m");
  const [notes, setNotes] = useState("");

  return (
    <View style={styles.container}>
      {/* Title Row */}
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: pallet.shade4 }]}>
          <Ionicons name="calendar" size={28} color={pallet.shade2} />
        </View>
        <TextInput
          style={styles.titleInput}
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity style={styles.statusDot}>
          <Ionicons name="ellipse" size={20} color={pallet.shade2} />
        </TouchableOpacity>
      </View>

      {/* Planned/Inbox Row */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.tab, planned && { backgroundColor: pallet.shade4 }]}
          onPress={() => setPlanned(true)}
        >
          <Ionicons name="calendar" size={18} color={pallet.shade2} />
          <Text style={[styles.tabText, { color: pallet.shade2 }]}>
            Planned
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, !planned && { backgroundColor: pallet.shade4 }]}
          onPress={() => setPlanned(false)}
        >
          <Ionicons name="mail" size={18} color={pallet.shade1} />
          <Text style={[styles.tabText, { color: pallet.shade1 }]}>Inbox</Text>
        </TouchableOpacity>
      </View>

      {/* Date Row */}
      <View style={styles.row}>
        <Ionicons name="calendar" size={20} color={pallet.shade2} />
        <TextInput style={styles.dateInput} placeholder="09/21/2025" />
        <Ionicons name="calendar" size={20} color={pallet.shade2} />
        <View style={styles.allDayRow}>
          <Switch value={allDay} onValueChange={setAllDay} />
          <Text style={styles.allDayText}>All-Day</Text>
        </View>
      </View>

      {/* Time Row */}
      <View style={styles.row}>
        <Ionicons name="time" size={20} color={pallet.shade2} />
        <TextInput
          style={styles.timeInput}
          placeholder="05:30 PM"
          value={startTime}
          onChangeText={setStartTime}
        />
        <Ionicons name="arrow-forward" size={20} color={pallet.shade2} />
        <TextInput
          style={styles.timeInput}
          placeholder="05:45 PM"
          value={endTime}
          onChangeText={setEndTime}
        />
        <Ionicons name="globe" size={20} color={pallet.shade2} />
      </View>

      {/* Duration Row */}
      <View style={styles.row}>
        {durations.map((d) => (
          <TouchableOpacity
            key={d}
            style={[
              styles.durationBtn,
              duration === d && { backgroundColor: pallet.shade4 },
            ]}
            onPress={() => setDuration(d)}
          >
            <Text
              style={[
                styles.durationText,
                { color: duration === d ? pallet.shade2 : pallet.shade1 },
              ]}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Repeat Row */}
      <View style={styles.row}>
        <Ionicons name="repeat" size={20} color={pallet.shade2} />
        <TextInput style={styles.repeatInput} placeholder="Once" />
      </View>

      {/* Add Subtask Row */}
      <TouchableOpacity style={styles.addSubtaskRow}>
        <Ionicons
          name="checkmark-circle-outline"
          size={20}
          color={pallet.shade2}
        />
        <Text style={[styles.addSubtaskText, { color: pallet.shade2 }]}>
          + Add Subtask
        </Text>
      </TouchableOpacity>

      {/* Notes Row */}
      <View style={styles.notesRow}>
        <Ionicons name="reorder-three" size={20} color={pallet.shade1} />
        <TextInput
          style={styles.notesInput}
          placeholder="Add notes, meeting links or phone numbers..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      {/* Create Task Button */}
      <TouchableOpacity style={styles.createBtn}>
        <Text style={styles.createBtnText}>Create Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  statusDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#eee",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  tabText: {
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "500",
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 8,
  },
  allDayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  allDayText: {
    fontSize: 15,
    marginLeft: 6,
    color: "#888",
  },
  timeInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 8,
  },
  durationBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  durationText: {
    fontSize: 15,
    fontWeight: "500",
  },
  repeatInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  addSubtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addSubtaskText: {
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "500",
  },
  notesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  notesInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
    minHeight: 60,
  },
  createBtn: {
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  createBtnText: {
    fontSize: 17,
    color: "#aaa",
    fontWeight: "bold",
  },
});
