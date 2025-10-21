import { TabSelector } from "@/components/ui/tab-switcher";
import { View } from "@/components/ui/view";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { MotivationChatPage } from "./motivation-chat";
import PlannningChat from "./planning-chat";

const tabOptions = [
  { label: "Motivation", key: "motivation" },
  { label: "Planning", key: "planning" },
];

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState(tabOptions[0].key);

  return (
    <View style={styles.container}>
      <View
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 8,
          marginBottom: 8,
        }}
      >
        <TabSelector
          tabs={tabOptions}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>
      {activeTab === "motivation" && <MotivationChatPage />}
      {activeTab === "planning" && <PlannningChat />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatPage;
