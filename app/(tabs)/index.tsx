import StreakChart from "@/components/chart-kit/streak-graph";
import { commitsData } from "@/dummy/dummyChart";
import { useTheme } from "@/hooks/use-theme";
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <StreakChart commitsData={commitsData} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
