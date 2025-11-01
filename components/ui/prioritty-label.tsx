import { Flag } from "lucide-react-native";
import { Text } from "./text";
import { View } from "./view";

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 2:
      return "High";
    case 1:
      return "Medium";
    default:
      return "Low";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 2:
      return { text: "#EF4444", bg: "#FEF2F2" };
    case 1:
      return { text: "#F97316", bg: "#FFF7ED" };
    default:
      return { text: "#68b71fff", bg: "#e0f9e5ff" };
  }
};

const PriorityLabel = ({ priority }) => {
  const priorityColors = getPriorityColor(priority);
  return (
    <View
      style={{
        backgroundColor: priorityColors.bg,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        alignSelf: "flex-start",
        justifyContent: "center",
      }}
    >
      <Flag size={12} color={priorityColors.text} fill={priorityColors.text} />
      <Text
        style={{
          fontSize: 12,
          fontWeight: "500",
          color: priorityColors.text,
        }}
      >
        {getPriorityLabel(priority)}
      </Text>
    </View>
  );
};

export default PriorityLabel;
