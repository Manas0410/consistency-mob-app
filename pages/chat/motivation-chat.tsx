// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   FlatList,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import {
//   getMotivationChatHistory,
//   handleMotivationChat,
// } from "./APi/api-calls"; // Adjust import path

// export default function MotivationChatPage() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Load last 20 chats on mount
//   useEffect(() => {
//     const fetchChats = async () => {
//       setLoading(true);
//       const res = await getMotivationChatHistory({ pageNo: 1, pageSize: 20 });
//       if (res.success) {
//         setMessages(res.data.chats.reverse()); // Show oldest first
//       }
//       setLoading(false);
//     };
//     fetchChats();
//   }, []);

//   // Send user message, get AI response, save both to chat and display
//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     setLoading(true);

//     const res = await handleMotivationChat({ message: input });
//     if (res.success) {
//       // Add user message and AI message into chat
//       setMessages((prev) => [
//         ...prev,
//         { id: `user-${Date.now()}`, message: input, fromUser: true },
//         {
//           id: `ai-${Date.now()}`,
//           message: res.data.aiResponse,
//           fromUser: false,
//         },
//       ]);
//       setInput("");
//     } else {
//       // Handle error, you may show feedback here
//       alert("Failed to send message");
//     }

//     setLoading(false);
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.messageBox,
//               item.fromUser ? styles.userMessage : styles.aiMessage,
//             ]}
//           >
//             <Text style={styles.messageText}>{item.message}</Text>
//           </View>
//         )}
//         inverted // Latest messages at bottom
//       />

//       <View style={styles.inputRow}>
//         <TextInput
//           value={input}
//           onChangeText={setInput}
//           style={styles.input}
//           placeholder="Type your message"
//           editable={!loading}
//         />
//         <Button
//           title={loading ? "Sending..." : "Send"}
//           onPress={sendMessage}
//           disabled={loading}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 10 },
//   messageBox: {
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 4,
//     maxWidth: "80%",
//   },
//   userMessage: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
//   aiMessage: { backgroundColor: "#E2E2E2", alignSelf: "flex-start" },
//   messageText: { fontSize: 16 },
//   inputRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
//   input: {
//     flex: 1,
//     borderColor: "#CCC",
//     borderWidth: 1,
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     height: 40,
//     marginRight: 10,
//   },
// });

import { AvoidKeyboard } from "@/components/ui/avoid-keyboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { SendHorizonal } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import {
  getMotivationChatHistory,
  handleMotivationChat,
} from "./APi/api-calls";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function MotivationChatPage() {
  const card = useColor({}, "card");
  const blue = useColor({}, "blue");
  const pallet = usePallet();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await getMotivationChatHistory({ pageNo: 1, pageSize: 10 });
      if (res.success) {
        setMessages(res); // Show oldest first
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const sendMessage = async () => {
    if (inputText.trim()) {
      try {
        setSendingMessage(true);
        const res = await handleMotivationChat({ message: inputText.trim() });
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setSendingMessage(false);
        setInputText("");
      }
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View>
      <View
        style={{
          marginBottom: 12,
          alignItems: item.isUser ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            maxWidth: "80%",
            padding: 12,
            borderRadius: 16,
            backgroundColor: item.isUser ? blue : "#F2F2F7",
          }}
        >
          <Text
            style={{
              color: item.isUser ? "white" : "#000",
              fontSize: 16,
            }}
          >
            {item.message}
          </Text>
          <Text
            style={{
              color: item.isUser ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
              fontSize: 12,
              marginTop: 4,
            }}
          >
            {item.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      {/* Messages */}
      {loading ? (
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner variant="bars" size="default" color={pallet.shade1} />
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Input Area */}
      <View
        style={{
          flexDirection: "row",
          padding: 16,
          gap: 12,
          backgroundColor: card,
        }}
      >
        <View style={{ flex: 1 }}>
          <Input
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            variant="outline"
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
        </View>
        <Button
          onPress={sendMessage}
          variant={inputText.trim() ? "success" : "outline"}
          size="icon"
        >
          <SendHorizonal size={20} color="white" />
        </Button>
      </View>

      {/* Keyboard avoidance with extra space for better UX */}
      <AvoidKeyboard />
    </View>
  );
}
