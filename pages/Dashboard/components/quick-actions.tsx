import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Calendar,
  Goal,
  LucideProps,
  PlaneTakeoff,
  Sparkles,
  Users,
} from "lucide-react-native";
import { ComponentType } from "react";
import { TouchableOpacity } from "react-native";

type QuickActionData = {
  title: string;
  subtitle: string;
  icon: ComponentType<LucideProps>;
  color: string;
  bgColor: string;
  onPress: () => void;
};

const quickActionsData = (
  router: ReturnType<typeof useRouter>,
  pallet: ReturnType<typeof usePallet>
): QuickActionData[] => [
  {
    title: "Track tasks",
    subtitle: "Track your daily tasks",
    icon: Calendar,
    color: pallet.shade1,
    bgColor: pallet.shade4,
    onPress: () => router.push("/calendar"),
  },
  {
    title: "Ask AI",
    subtitle: "need mativation ?",
    icon: Sparkles,
    color: pallet.shade1,
    bgColor: pallet.shade4,
    onPress: () => router.push("/ai-chat"),
  },
  {
    title: "AI Planner",
    subtitle: "Get your tasks plan via AI",
    icon: PlaneTakeoff,
    color: pallet.shade1,
    bgColor: pallet.shade4,
    onPress: () => router.push("/ai-chat"),
  },
  {
    title: "Manage your teams",
    subtitle: "Manage your team and wwork with your fellows",
    icon: Users,
    color: pallet.shade1,
    bgColor: pallet.shade4,
    onPress: () => router.push("/team"),
  },
  {
    title: "Create Habits",
    subtitle: "turn your goals into habits",
    icon: Goal,
    color: pallet.shade1,
    bgColor: pallet.shade4,
    onPress: () => router.push("/habbit"),
  },
];

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: ComponentType<LucideProps>;
  color: string;
  bgColor: string;
  onPress: () => void;
  textColor: string;
  textMutedColor?: string;
  iconColor: string;
  cardBackgroundColor: string;
}

const QuickActionCard = ({
  title,
  subtitle,
  icon: Icon,
  color,
  bgColor,
  onPress,
  textColor,
  textMutedColor,
  iconColor,
  cardBackgroundColor,
}: QuickActionCardProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: cardBackgroundColor,
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
          color: textColor,
          marginBottom: 2,
        }}
      >
        {" "}
        {title}{" "}
      </Text>
      <Text style={{ fontSize: 13, color: textMutedColor || iconColor }}>
        {subtitle}
      </Text>
    </View>
    <ArrowRight size={20} color={iconColor} />
  </TouchableOpacity>
);

const QuickActions = () => {
  const router = useRouter();
  const pallet = usePallet();
  const colors = Colors.light; // Always use light theme
  const textColor = useColor({}, "text");
  const textMutedColor = useColor({}, "textMuted");
  const iconColor = useColor({}, "icon");
  const cardBackgroundColor = useColor({}, "background");

  return (
    <View style={{ marginBottom: 32 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: textColor,
          marginBottom: 16,
        }}
      >
        Quick Actions
      </Text>

      {quickActionsData(router, pallet).map((action, index) => (
        <QuickActionCard
          key={index}
          title={action.title}
          subtitle={action.subtitle}
          icon={action.icon}
          color={action.color}
          bgColor={action.bgColor}
          onPress={action.onPress}
          textColor={textColor}
          textMutedColor={textMutedColor}
          iconColor={iconColor}
          cardBackgroundColor={cardBackgroundColor}
        />
      ))}
    </View>
  );
};

export default QuickActions;
