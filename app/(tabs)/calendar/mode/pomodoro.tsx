import BackHeader from "@/components/ui/back-header";
import { View } from "@/components/ui/view";
import { SafeAreaView } from "react-native-safe-area-context";

const PomoDoro = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView>
        <BackHeader title="Pomodoro Mode" />
      </SafeAreaView>
    </View>
  );
};

export default PomoDoro;
