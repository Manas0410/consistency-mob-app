import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
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
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;
  return (
    <View style={styles.pickerRow}>
      <View style={[styles.pickerBox, { backgroundColor: colors.background }]}>
        <Picker
          selectedValue={value.hour}
          style={styles.picker}
          dropdownIconColor={colors.icon}
          onValueChange={(hour: number) => onChange({ ...value, hour })}
        >
          {hours.map((h) => (
            <Picker.Item
              key={h}
              label={h.toString()}
              value={h}
              color={colors.text}
            />
          ))}
        </Picker>
      </View>
      <Text style={[styles.separator, { color: colors.text }]}>:</Text>
      <View style={[styles.pickerBox, { backgroundColor: colors.background }]}>
        <Picker
          selectedValue={value.minute}
          style={styles.picker}
          dropdownIconColor={colors.icon}
          onValueChange={(minute: number) => onChange({ ...value, minute })}
        >
          {minutes.map((m) => (
            <Picker.Item
              key={m}
              label={m.toString().padStart(2, "0")}
              value={m}
              color={colors.text}
            />
          ))}
        </Picker>
      </View>
      <View style={[styles.pickerBox, { backgroundColor: colors.background }]}>
        <Picker
          selectedValue={value.period}
          style={styles.picker}
          dropdownIconColor={colors.icon}
          onValueChange={(period: "AM" | "PM") =>
            onChange({ ...value, period })
          }
        >
          {periods.map((p) => (
            <Picker.Item key={p} label={p} value={p} color={colors.text} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 8,
    borderRadius: 16,
  },
  pickerBox: {
    borderRadius: 14,
    overflow: "hidden",
    marginHorizontal: 2,
    paddingHorizontal: 2,
    // Use shadow/surface if card background is too close to overall BG
    // shadowColor, shadowOffset, etc., if you want more elevation
  },
  picker: {
    width: 66,
    height: 44,
    fontSize: 18,
  },
  separator: {
    fontSize: 28,
    marginHorizontal: 2,
    fontWeight: "500",
    opacity: 0.66,
  },
});
