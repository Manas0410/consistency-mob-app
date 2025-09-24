import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type TimePickerProps = {
  value: { hour: number; minute: number; period: "AM" | "PM" };
  onChange: (val: {
    hour: number;
    minute: number;
    period: "AM" | "PM";
  }) => void;
};

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const periods = ["AM", "PM"] as const;

export default function TimePicker({ value, onChange }: TimePickerProps) {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={value.hour}
        style={styles.picker}
        onValueChange={(hour: number) => onChange({ ...value, hour })}
      >
        {hours.map((h) => (
          <Picker.Item key={h} label={h.toString()} value={h} />
        ))}
      </Picker>
      <Text style={styles.separator}>:</Text>
      <Picker
        selectedValue={value.minute}
        style={styles.picker}
        onValueChange={(minute: number) => onChange({ ...value, minute })}
      >
        {minutes.map((m) => (
          <Picker.Item
            key={m}
            label={m.toString().padStart(2, "0")}
            value={m}
          />
        ))}
      </Picker>
      <Picker
        selectedValue={value.period}
        style={styles.picker}
        onValueChange={(period: "AM" | "PM") => onChange({ ...value, period })}
      >
        {periods.map((p) => (
          <Picker.Item key={p} label={p} value={p} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  picker: {
    width: 70,
    height: 44,
  },
  separator: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 2,
  },
});
