import { ChartColumnStacked } from "lucide-react-native";
import { Text } from "./text";
import { View } from "./view";

const CategoryyLabel = ({ category = "" }) => {
  return (
    <View
      style={{
        backgroundColor: "#EFF6FF",
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
      <ChartColumnStacked size={12} color="#3B82F6" fill="#3B82F6" />
      <Text
        style={{
          fontSize: 12,
          fontWeight: "500",
          color: "#3B82F6",
        }}
      >
        {category}
      </Text>
    </View>
  );
};

export default CategoryyLabel;
