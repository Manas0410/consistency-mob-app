import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { Target } from "lucide-react-native";

const goals = [
  { id: 1, title: "Complete Project Alpha", progress: 75, total: 100 },
  { id: 2, title: "Learn React Native", progress: 60, total: 100 },
];

const GoalCard = () => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Target size={24} color="#EF4444" />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#1E293B",
            marginLeft: 8,
          }}
        >
          Goal Progress
        </Text>
      </View>

      {goals.map((goal, index) => (
        <View
          key={goal.id}
          style={{
            marginBottom: index === goals.length - 1 ? 0 : 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#374151",
                flex: 1,
              }}
            >
              {goal.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#64748B",
              }}
            >
              {goal.progress}%
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#F1F5F9",
              height: 8,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                backgroundColor: "#EF4444",
                height: "100%",
                width: `${goal.progress}%`,
                borderRadius: 4,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default GoalCard;
