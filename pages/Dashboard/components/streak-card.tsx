import Heatmap from "@/components/charts/heat-map";
import { View } from "@/components/ui/view";
import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { getStreakData } from "../APi/get-streak";

const StreakCard = () => {
  const [streakData, setStreakData] = useState({});
  const colors = Colors.light; // Always use light theme
  const pallet = usePallet();
  const textColor = useColor({}, "text");

  const getStreak = async () => {
    try {
      const res = await getStreakData();
      if (res.success) {
        setStreakData(res.data);
      }
    } catch (err) {
      console.log("Error fetching streak data", err);
    }
  };

  useEffect(() => {
    getStreak();
  }, []);

  return (
    <View
      style={{
        backgroundColor: pallet.shade4,
        borderRadius: 24,
        padding: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ width: 200 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: pallet.shade1,
            marginLeft: 2,
          }}
        >
          {streakData?.currentStreak ?? 0} Days Streak
        </Text>
        <Heatmap data={streakData?.streakData ?? []} />
      </View>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/images/flame.png")}
            style={{
              width: 66,
              height: 92,
            }}
            resizeMode="contain"
          />
          <View
            style={{
              width: 56,
              height: 72,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: -9,
              left: "50%",
              transform: [{ translateX: -33 }],
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#fff",
                textShadowColor: pallet.shade1,
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 6,
              }}
            >
              {streakData?.currentStreak ?? 0}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 12, color: pallet.shade2 }}>Productivity</Text>
      </View>
    </View>
  );
};

export default StreakCard;
