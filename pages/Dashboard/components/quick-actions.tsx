import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Calendar,
  Plus,
} from "lucide-react-native";
import { TouchableOpacity } from "react-native";

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
      <Icon size={24} color={color} />
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#1f2937",
          marginBottom: 2,
        }}
      >
        {title}
      </Text>
      <Text style={{ fontSize: 13, color: "#64748b" }}>{subtitle}</Text>
    </View>
    <ArrowRight size={20} color="#94a3b8" />
  </TouchableOpacity>
);

const QuickActions = () => {
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

      <QuickActionCard
        title="Create New Project"
        subtitle="Set up a new project with team assignments"
        icon={Plus}
        color="#10b981"
        bgColor="#dcfce7"
      />

      <QuickActionCard
        title="Team Performance"
        subtitle="View detailed analytics and reports"
        icon={BarChart3}
        color="#3b82f6"
        bgColor="#dbeafe"
      />

      <QuickActionCard
        title="Schedule Meeting"
        subtitle="Organize team sync and project reviews"
        icon={Calendar}
        color="#f59e0b"
        bgColor="#fef3c7"
      />

      <QuickActionCard
        title="Assign Tasks"
        subtitle="Distribute work among team members"
        icon={Activity}
        color="#8b5cf6"
        bgColor="#f3e8ff"
      />
    </View>
  );
};

export default QuickActions;
