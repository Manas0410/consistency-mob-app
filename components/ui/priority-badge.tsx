import { useState } from "react";
import { View } from "react-native";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";

const PriorityBadge = ({ value, onChange }: { value: 0 | 1 | 2; onChange?: (val: 0 | 1 | 2) => void }) => {
  const [priority, setPriority] = useState<0 | 1 | 2>(value); // 0=Low,1=Medium,2=High

  const handleChange = (val: 0 | 1 | 2) => {
    setPriority(val);
    if (onChange) onChange(val);
  };

  return (
    <View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Badge
          style={{
            backgroundColor: "#10b981",
            flexDirection: "row",
            alignItems: "center",
          }}
          textStyle={{ color: "white", fontWeight: "600", marginRight: 6 }}
        >
          Low
          <Checkbox
            checked={priority === 0}
            onCheckedChange={() => handleChange(0)}
          />
        </Badge>

        <Badge
          style={{
            backgroundColor: "#f59e0b",
            flexDirection: "row",
            alignItems: "center",
          }}
          textStyle={{ color: "white", fontWeight: "600", marginRight: 6 }}
        >
          Medium
          <Checkbox
            checked={priority === 1}
            onCheckedChange={() => handleChange(1)}
          />
        </Badge>

        <Badge
          style={{
            backgroundColor: "#ef4444",
            flexDirection: "row",
            alignItems: "center",
          }}
          textStyle={{ color: "white", fontWeight: "600", marginRight: 6 }}
        >
          High
          <Checkbox
            checked={priority === 2}
            onCheckedChange={() => handleChange(2)}
          />
        </Badge>
      </View>
    </View>
  );
};

export default PriorityBadge;
