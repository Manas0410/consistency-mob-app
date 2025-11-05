import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Calendar,
  Goal,
  PlaneTakeoff,
  Sparkles,
  Users,
} from "lucide-react-native";
import { TouchableOpacity } from "react-native";

const quickActionsData = (router) => [
  {
    title: "Track tasks",
    subtitle: "Track your daily tasks",
    icon: Calendar,
    color: "#3b82f6",
    bgColor: "#dbeafe",
    onPress: () => router.push("/create-project"),
  },
  {
    title: "Ask AI",
    subtitle: "need mativation ?",
    icon: Sparkles,
    color: "#3b82f6",
    bgColor: "#dbeafe",
    onPress: () => router.push("/ai-chat"),
  },
  {
    title: "AI Planner",
    subtitle: "Get your tasks plan via AI",
    icon: PlaneTakeoff,
    color: "#3b82f6",
    bgColor: "#dbeafe",
    onPress: () => router.push("/ai-chat"),
  },
  {
    title: "Manage your teams",
    subtitle: "Manage your team and wwork with your fellows",
    icon: Users,
    color: "#3b82f6",
    bgColor: "#dbeafe",
    onPress: () => router.push("/team"),
  },
  {
    title: "Create Habits",
    subtitle: "turn your goals into habits",
    icon: Goal,
    color: "#3b82f6",
    bgColor: "#dbeafe",
    onPress: () => router.push("/habbit"),
  },
];

const QuickActionCard = ({
  title,
  subtitle,
  icon: Icon,
  color,
  bgColor,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: "#ffffff",
      borderRadius: 20,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    }}
  >
    {" "}
    <View
      style={{
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
      }}
    >
      {" "}
      <Icon size={24} color={color} />{" "}
    </View>{" "}
    <View style={{ flex: 1 }}>
      {" "}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#1f2937",
          marginBottom: 2,
        }}
      >
        {" "}
        {title}{" "}
      </Text>{" "}
      <Text style={{ fontSize: 13, color: "#64748b" }}>{subtitle}</Text>{" "}
    </View>{" "}
    <ArrowRight size={20} color="#94a3b8" />{" "}
  </TouchableOpacity>
);

const QuickActions = () => {
  const router = useRouter();

  return (
    <View style={{ marginBottom: 32 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: 16,
        }}
      >
        Quick Actions
      </Text>

      {quickActionsData(router).map((action, index) => (
        <QuickActionCard
          key={index}
          title={action.title}
          subtitle={action.subtitle}
          icon={action.icon}
          color={action.color}
          bgColor={action.bgColor}
          onPress={action.onPress}
        />
      ))}
    </View>
  );
};

export default QuickActions;
