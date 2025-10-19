import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HabbitCompletionCard from "@/components/ui/HabbitCompletionCard";
import HabitCard from "@/components/ui/HabitCard";
import { Image } from "@/components/ui/image";
import { ParallaxScrollView } from "@/components/ui/parallax-scrollview";
import StreakCard from "@/components/ui/streak-card";
import TaskProgressCard from "@/components/ui/task-progress-card";
import WeekTaskCompletionCard from "@/components/ui/WeekTaskCompletionCard";
import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";
import { useUser } from "@clerk/clerk-expo";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  const { user } = useUser();
  const pallet = usePallet();
  console.log(user);
  return (
    <ParallaxScrollView
      headerHeight={350}
      headerImage={
        <Image
          source={require("@/assets/images/home-banner.png")}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      }
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingTop: 10,
              position: "sticky",
              top: 0,
            }}
          >
            <Text style={[styles.Heading, { color: pallet.shade1 }]}>
              25 Hours
            </Text>
            <Avatar>
              <AvatarImage
                source={{
                  uri:
                    user?.imageUrl ||
                    `https://avatars.githubusercontent.com/u/99088394?v=4`,
                }}
              />
              <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
            </Avatar>
          </View>
          <Text
            style={{
              color: colors.textSecondary,
              marginLeft: 10,
              marginBottom: 10,
            }}
          >
            Believe you can and you're halfway there!
          </Text>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1, display: "flex", gap: 12, padding: 10 }}>
              <StreakCard streak={50} />
              <TaskProgressCard
                percentage={75}
                tasks={[
                  { name: "Task 1", done: true },
                  { name: "Task 2", done: false },
                  { name: "Task 3", done: true },
                ]}
                onTaskToggle={(index) => {
                  console.log("Toggle task at index:", index);
                }}
                onSeeDetail={() => {
                  console.log("See detailed view");
                }}
              />
              <WeekTaskCompletionCard />
              <HabbitCompletionCard />
              <HabitCard onManage={() => {}} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  Heading: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 0,
    display: "flex",
    flexDirection: "column",
  },
});
