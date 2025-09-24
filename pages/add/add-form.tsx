import SingleSelectDropdown from "@/components/ui/SingleSelectDropdown";
import TimePicker from "@/components/ui/time-picker";
import { usePallet } from "@/hooks/use-pallet";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TimeValue = { hour: number; minute: number; period: "AM" | "PM" };

const durations = ["1m", "15m", "30m", "45m", "1hr", "..."];

export default function AddForm() {
  const pallet = usePallet();
  const [title, setTitle] = useState("");
  const [planned, setPlanned] = useState(true);
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState<TimeValue>({
    hour: 5,
    minute: 30,
    period: "PM",
  });
  const [endTime, setEndTime] = useState<TimeValue>({
    hour: 5,
    minute: 45,
    period: "PM",
  });
  const [duration, setDuration] = useState("15m");
  const [notes, setNotes] = useState("");
  const [frequency, setFrequency] = useState("Everyday");

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
      </View>
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

      {/* Date Row */}
      <View style={styles.row}>
        <Ionicons name="calendar" size={20} color={pallet.shade2} />
        <TextInput style={styles.dateInput} placeholder="09/21/2025" />
        <Ionicons name="calendar" size={20} color={pallet.shade2} />
      </View>

      {/* Frequency */}
      <SingleSelectDropdown value="Once" onChange={setFrequency} />

      {/* Time Row */}
      <View style={styles.row}>
        <Ionicons name="time" size={20} color={pallet.shade2} />
        <TimePicker value={startTime} onChange={setStartTime} />
        <Ionicons name="arrow-forward" size={20} color={pallet.shade2} />
        <TimePicker value={endTime} onChange={setEndTime} />
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
