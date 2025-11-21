import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { getHabbit } from "@/pages/Habbits/API/callAPI";
import StatusChangeCheckbox from "@/pages/task-viewer/components/status-change-checkbox";
import { useRouter } from "expo-router";
import { Goal, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";

// const habbitData = [
//   { id: 1, name: "Morning Exercise", completed: true, streak: 5 },
//   { id: 2, name: "Read 30 min", completed: true, streak: 3 },
//   { id: 3, name: "Drink 8 glasses water", completed: false, streak: 2 },
//   { id: 4, name: "Meditate", completed: true, streak: 7 },
//   { id: 5, name: "No social media", completed: false, streak: 1 },
// ];

const HabbitCard = () => {
  const pallet = usePallet();
  const router = useRouter();
  const colors = Colors.light; // Always use light theme
  const textColor = useColor({}, "text");
  const textMutedColor = useColor({}, "textMuted");
  const iconColor = useColor({}, "icon");
  const cardBackgroundColor = useColor({}, "background");
  const borderColor = useColor({}, "border");
  const [habbitData, sethabbitData] = useState([]);
  const [habbitLoading, setHabbitLoading] = useState(false);

  const fetchHabbit = async () => {
    try {
      setHabbitLoading(true);
      const res = await getHabbit(new Date());
      if (res.success) {
        sethabbitData(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setHabbitLoading(false);
    }
  };

  useEffect(() => {
    fetchHabbit();
  }, []);

  return (
    <View
      style={{
        backgroundColor: cardBackgroundColor,
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
        <Goal size={24} color={pallet.shade1} />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: textColor,
            marginLeft: 8,
          }}
        >
          Today's Habits
        </Text>
        <Icon
          name={Plus}
          color={pallet.shade1}
          style={{ marginLeft: "auto" }}
          onPress={() => {
            router.replace("/habbit");
          }}
        />
      </View>

      {habbitData?.length === 0 ? (
        <Text variant="caption">you have not added any habit yet</Text>
      ) : (
        <>
          {habbitData.map((habit, index) => (
            <View
              key={habit.taskId}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: index === habbitData.length - 1 ? 0 : 1,
                borderBottomColor: borderColor || "#F1F5F9",
              }}
            >
              <StatusChangeCheckbox
                isChecked={habit.isDone}
                selectedDate={new Date()}
                taskId={habit.taskId}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    marginLeft: 10,
                    fontWeight: "600",
                    color: habit.isDone
                      ? textColor
                      : textMutedColor || iconColor,
                    // textDecorationLine: habit.isDone ? "line-through" : "none",
                  }}
                >
                  {habit.taskName}
                </Text>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

export default HabbitCard;
