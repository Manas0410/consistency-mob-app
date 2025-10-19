import { useState } from "react";
import { View } from "react-native";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { Text } from "./text";

const PriorityBadge = ({
  value,
  onChange,
}: {
  value: 0 | 1 | 2;
  onChange?: (val: 0 | 1 | 2) => void;
}) => {
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
            padding: 6,
            gap: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", marginRight: 6 }}>
            Low
          </Text>
          <Checkbox
            styles={{ height: 24, width: 24 }}
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
        >
          <Text style={{ color: "white", fontWeight: "600", marginRight: 6 }}>
            Medium
          </Text>
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
        >
          <Text style={{ color: "white", fontWeight: "600", marginRight: 6 }}>
            High
          </Text>
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
