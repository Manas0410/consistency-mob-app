// @ts-nocheck

import { AvoidKeyboard } from "@/components/ui/avoid-keyboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { format, parseISO } from "date-fns";
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
        setMessages(res.data); // Show oldest first
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
        setInputText("");
        setMessages((prevMessages) => [
          {
            _id: Math.random().toString(36).substring(7), // Temporary ID
            message: inputText.trim(),
            isUser: true,
            createdAt: new Date().toISOString(),
          },
          ...prevMessages,
        ]);
        setSendingMessage(true);
        const res = await handleMotivationChat({ message: inputText.trim() });
        if (res.success) {
          setSendingMessage(false);
          setMessages((prevMessages) => [
            {
              _id: Math.random().toString(36).substring(7), // Temporary ID
              message: res.data,
              isUser: false,
              createdAt: new Date().toISOString(),
            },
            ...prevMessages,
          ]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setSendingMessage(false);
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
            backgroundColor: item.isUser ? "#F2F2F7" : blue,
          }}
        >
          <Text
            style={{
              color: item.isUser ? "#000" : "white",
              fontSize: 16,
            }}
          >
            {item.message}
          </Text>
          <Text
            style={{
              color: item.isUser ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
              fontSize: 12,
              marginTop: 4,
            }}
          >
            {format(parseISO(item.createdAt), "d MMMM hh:mmaaa")}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
          inverted
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {sendingMessage && (
        <View
          style={{
            backgroundColor: blue,
            width: 70,
            paddingVertical: 20,
            borderRadius: 35,
            marginLeft: 20,
            marginBottom: 10,
          }}
        >
          <Spinner variant="dots" size="default" color={"#fff"} />
        </View>
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
