import BackHeader from "@/components/ui/back-header";
import { ScrollView } from "@/components/ui/scroll-view";
import { View } from "@/components/ui/view";
import { useSelectMode } from "@/contexts/select-mode-context";
import ModeStarter from "@/pages/taskMode/components/mode-starter";
import { SafeAreaView } from "react-native-safe-area-context";

const PomoDoro = () => {
  const { selectedWorkMode: mode } = useSelectMode();
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
