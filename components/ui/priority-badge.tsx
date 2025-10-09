import { useState } from "react";
import { View } from "react-native";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";

const PriorityBadge = () => {
  const [priority, setPriority] = useState<0 | 1 | 2>(2); // 0=Low,1=Medium,2=High

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
            onCheckedChange={() => setPriority(0)}
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
            onCheckedChange={() => setPriority(1)}
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
            onCheckedChange={() => setPriority(2)}
          />
        </Badge>
      </View>
    </View>
  );
};

export default PriorityBadge;
