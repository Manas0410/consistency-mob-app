import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  getMotivationChatHistory,
  handleMotivationChat,
} from "./APi/api-calls"; // Adjust import path

export default function MotivationChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load last 20 chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const res = await getMotivationChatHistory({ pageNo: 1, pageSize: 20 });
      if (res.success) {
        setMessages(res.data.chats.reverse()); // Show oldest first
      }
      setLoading(false);
    };
    fetchChats();
  }, []);

  // Send user message, get AI response, save both to chat and display
  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);

    const res = await handleMotivationChat({ message: input });
    if (res.success) {
      // Add user message and AI message into chat
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, message: input, fromUser: true },
        {
          id: `ai-${Date.now()}`,
          message: res.data.aiResponse,
          fromUser: false,
        },
      ]);
      setInput("");
    } else {
      // Handle error, you may show feedback here
      alert("Failed to send message");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBox,
              item.fromUser ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}
        inverted // Latest messages at bottom
      />

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Type your message"
          editable={!loading}
        />
        <Button
          title={loading ? "Sending..." : "Send"}
          onPress={sendMessage}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, height: 300 },
  messageBox: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 4,
    maxWidth: "80%",
  },
  userMessage: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  aiMessage: { backgroundColor: "#E2E2E2", alignSelf: "flex-start" },
  messageText: { fontSize: 16 },
  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: {
    flex: 1,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    height: 40,
    marginRight: 10,
  },
});
