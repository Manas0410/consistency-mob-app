import BackHeader from "@/components/ui/back-header";
import { ScrollView } from "@/components/ui/scroll-view";
import { View } from "@/components/ui/view";
import ModeStarter from "@/pages/taskMode/components/mode-starter";
import { SafeAreaView } from "react-native-safe-area-context";

const mode = "pomodoro";

const PomoDoro = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView>
        <BackHeader title={mode} />
        <ScrollView
          style={{ padding: 20, backgroundColor: "#f5f3f3ff", height: "100%" }}
        >
          <ModeStarter mode={mode} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PomoDoro;
