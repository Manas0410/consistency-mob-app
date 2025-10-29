import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { Activity, CheckCircle2, Flame } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

const habbitData = [
  { id: 1, name: "Morning Exercise", completed: true, streak: 5 },
  { id: 2, name: "Read 30 min", completed: true, streak: 3 },
  { id: 3, name: "Drink 8 glasses water", completed: false, streak: 2 },
  { id: 4, name: "Meditate", completed: true, streak: 7 },
  { id: 5, name: "No social media", completed: false, streak: 1 },
];

const HabbitCard = () => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
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
        <Activity size={24} color="#06B6D4" />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#1E293B",
            marginLeft: 8,
          }}
        >
          Today's Habits
        </Text>
      </View>

      {habbitData.map((habit, index) => (
        <TouchableOpacity
          key={habit.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: index === habbitData.length - 1 ? 0 : 1,
            borderBottomColor: "#F1F5F9",
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: habit.completed ? "#10B981" : "#F1F5F9",
              borderWidth: habit.completed ? 0 : 2,
              borderColor: "#D1D5DB",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            {habit.completed && <CheckCircle2 size={16} color="#fff" />}
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: habit.completed ? "#374151" : "#6B7280",
                textDecorationLine: habit.completed ? "line-through" : "none",
              }}
            >
              {habit.name}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Flame size={16} color="#F97316" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#F97316",
                marginLeft: 4,
              }}
            >
              {habit.streak}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default HabbitCard;
