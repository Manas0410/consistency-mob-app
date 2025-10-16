import BackHeader from "@/components/ui/back-header";
import { View } from "@/components/ui/view";
import ChatPage from "@/pages/chat/chat-page";
import { SafeAreaView } from "react-native-safe-area-context";

const AIChat = () => {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <BackHeader title={"AI - Chat"} />
        <ChatPage />
      </SafeAreaView>
    </View>
  );
};

export default AIChat;
