// @ts-nocheck
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dummyChats = [
  {
    userId: "user123",
    message: "I feel so tired today.",
    response: "I'm sorry to hear that. Remember, every day is a fresh start!",
    createdAt: new Date("2025-10-09T14:20:00Z")
  },
  {
    userId: "user123",
    message: "I'm struggling to stay motivated.",
    response: "Keep going! Small steps lead to great progress.",
    createdAt: new Date("2025-10-09T13:15:00Z")
  },
  {
    userId: "user123",
    message: "Hello, can you help me today?",
    response: "Absolutely! I'm here to support you.",
    createdAt: new Date("2025-10-09T12:00:00Z")
  }
];

const MotivationChat = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Simulate fetching chat data, latest message at index 0
    setChats(dummyChats);
  }, []);

  // Render user message bubble (right side)
  const renderUserMessage = (text) => (
    <View style={[styles.bubble, styles.userBubble]}>
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );

  // Render AI response bubble (left side)
  const renderAIResponse = (text) => (
    <View style={[styles.bubble, styles.aiBubble]}>
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );

  const renderChatItem = ({ item }) => {
    return (
      <View style={styles.chatItem}>
        {renderUserMessage(item.message)}
        {renderAIResponse(item.response)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item, index) => index.toString()}
        inverted={true} // so latest message is at top (index 0)
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    height:800
  },
  chatItem: {
    marginBottom: 20,
    paddingHorizontal: 10
  },
  bubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 20,
    marginBottom: 6
  },
  userBubble: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0
  },
  aiBubble: {
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0
  },
  messageText: {
    fontSize: 16,
    color: "#222"
  }
});

export default MotivationChat;
