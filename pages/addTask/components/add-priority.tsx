import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { usePallet } from "@/hooks/use-pallet";
import { ChevronLeft, Plus } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const categories = ["asdfg", "asdfgh", "tyui", "wertyui", "qwertyui"];

const AddPriority = ({ category, onClose }) => {
  const [value, setValue] = useState(category);
  const pallet = usePallet();
  return (
    <View>
      <TouchableOpacity
        onPress={onClose}
        style={{
          gap: 8,
          marginBottom: 14,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <ChevronLeft />
        <Text variant="title">Select Category </Text>
      </TouchableOpacity>
      <View style={styles.actionButtonsContainer}>
        <Input
          variant="outline"
          containerStyle={{
            flex: 1,
            borderRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
          value={value}
          //   onChangeText={setSearchQuery}
          placeholder="Add category"
        />

        <Button style={styles.secondaryButton}>
          <Plus size={20} color="#6B7280" />
        </Button>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 14,
        }}
      >
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              setValue(item);
            }}
          >
            <Badge variant="outline" style={{ alignSelf: "flex-start" }}>
              <Text>{item}</Text>
            </Badge>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  secondaryButton: {
    width: 50,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F1F5F9",
  },
});

export default AddPriority;
