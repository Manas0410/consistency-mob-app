import StreakChart from "@/components/chart-kit/streak-graph";
import StreakCard from "@/components/ui/streak-card";
import { commitsData } from "@/dummy/dummyChart";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <StreakChart commitsData={commitsData} />
        <StreakCard streak={50} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
