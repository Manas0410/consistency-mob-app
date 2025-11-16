import { Text } from "@/components/ui/text";
import { usePallet } from "@/hooks/use-pallet";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface DurationPickerProps {
  hours: number;
  minutes: number;
  onHoursChange: (hours: number) => void;
  onMinutesChange: (minutes: number) => void;
  maxHours?: number;
  maxMinutes?: number;
  minuteStep?: number;
  showLabels?: boolean;
}

export const DurationPicker: React.FC<DurationPickerProps> = ({
  hours,
  minutes,
  onHoursChange,
  onMinutesChange,
  maxHours = 24,
  maxMinutes = 55,
  minuteStep = 5,
  showLabels = true,
}) => {
  const pallet = usePallet();

  const incrementHours = () => {
    onHoursChange(Math.min(maxHours, hours + 1));
  };

  const decrementHours = () => {
    onHoursChange(Math.max(0, hours - 1));
  };

  const incrementMinutes = () => {
    const newMinutes = Math.min(
      maxMinutes,
      Math.floor((minutes + minuteStep) / minuteStep) * minuteStep
    );
    onMinutesChange(newMinutes);
  };

  const decrementMinutes = () => {
    onMinutesChange(Math.max(0, minutes - minuteStep));
  };

  return (
    <View style={styles.container}>
      {/* Hours Counter */}
      <View style={styles.counter}>
        {showLabels && (
          <Text variant="caption" style={styles.label}>
            Hours
          </Text>
        )}
        <View style={styles.counterInner}>
          <TouchableOpacity style={styles.counterBtn} onPress={decrementHours}>
            <Text style={[styles.btnText, { color: pallet.shade1 }]}>−</Text>
          </TouchableOpacity>
          <Text style={[styles.counterValue, { color: pallet.shade1 }]}>
            {hours}
          </Text>
          <TouchableOpacity style={styles.counterBtn} onPress={incrementHours}>
            <Text style={[styles.btnText, { color: pallet.shade1 }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Minutes Counter */}
      <View style={styles.counter}>
        {showLabels && (
          <Text variant="caption" style={styles.label}>
            Minutes
          </Text>
        )}
        <View style={styles.counterInner}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={decrementMinutes}
          >
            <Text style={[styles.btnText, { color: pallet.shade1 }]}>−</Text>
          </TouchableOpacity>
          <Text style={[styles.counterValue, { color: pallet.shade1 }]}>
            {minutes.toString().padStart(2, "0")}
          </Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={incrementMinutes}
          >
            <Text style={[styles.btnText, { color: pallet.shade1 }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
  },
  counter: {
    flex: 1,
  },
  label: {
    color: "#6B7280",
    marginBottom: 8,
  },
  counterInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  counterBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  btnText: {
    fontSize: 18,
  },
  counterValue: {
    fontSize: 20,
    fontWeight: "700",
  },
});
