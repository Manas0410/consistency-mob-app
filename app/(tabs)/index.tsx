import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HabbitCompletionCard from "@/components/ui/HabbitCompletionCard";
import HabitCard from "@/components/ui/HabitCard";
import { Image } from "@/components/ui/image";
import { ParallaxScrollView } from "@/components/ui/parallax-scrollview";
import StreakCard from "@/components/ui/streak-card";
import TaskProgressCard from "@/components/ui/task-progress-card";
import { Text } from "@/components/ui/text";
import WeekTaskCompletionCard from "@/components/ui/WeekTaskCompletionCard";
import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";
import { SPACING } from "@/theme/globals";
import { useUser } from "@clerk/clerk-expo";
import { ScrollView, StyleSheet, View } from "react-native";
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text variant="heading" style={{ color: pallet.shade1 }}>
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
            <Text variant="caption" style={styles.subtitle}>
              Believe you can and you're halfway there! ✨
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.cardsContainer}>
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
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  subtitle: {
    marginLeft: SPACING.xs,
    opacity: 0.8,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  cardsContainer: {
    flex: 1,
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
});
