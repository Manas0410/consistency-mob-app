import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const options = [
  "Once",
  "Everyday",
  "Every Sunday",
  "Every Monday",
  "Every Tuesday",
  "Every Wednesday",
  "Every Thursday",
  "Every Friday",
  "Every Saturday",
];

interface SingleSelectDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options?: string[];
  label?: string;
}

export default function SingleSelectDropdown({
  value,
  onChange,
  options: customOptions,
  label,
}: SingleSelectDropdownProps) {
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;
  const opts = customOptions || options;
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <TouchableOpacity
        style={[
          styles.selectBox,
          { backgroundColor: colors.background, borderColor: colors.icon },
        ]}
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.selectedText, { color: colors.text }]}>
          {value || "Once"}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.icon} />
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background, borderColor: colors.icon },
            ]}
          >
            <FlatList
              data={opts}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionRow,
                    value === item && { backgroundColor: colors.icon },
                  ]}
                  onPress={() => {
                    onChange(item);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: value === item ? colors.background : colors.text,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {value === item && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.background}
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 260,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginVertical: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
