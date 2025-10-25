// @ts-nocheck

import { AvoidKeyboard } from "@/components/ui/avoid-keyboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";
import { useColor } from "@/hooks/useColor";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme/globals";
import { format, parseISO } from "date-fns";
import { SendHorizonal } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

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
    <View style={{ marginBottom: SPACING.md }}>
      <View
        style={{
          alignItems: item.isUser ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            maxWidth: "80%",
            padding: SPACING.md,
            borderRadius: RADIUS.xl,
            backgroundColor: item.isUser ? "#F2F2F7" : pallet.shade1,
            borderTopRightRadius: item.isUser ? RADIUS.sm : RADIUS.xl,
            borderTopLeftRadius: item.isUser ? RADIUS.xl : RADIUS.sm,
          }}
        >
          <Text
            variant="body"
            style={{
              color: item.isUser ? colors.text : "white",
              lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.relaxed,
            }}
          >
            {item.message}
          </Text>
          <Text
            variant="caption"
            style={{
              color: item.isUser ? colors.textMuted : "rgba(255,255,255,0.8)",
              marginTop: SPACING.xs,
              opacity: 0.8,
            }}
          >
            {format(parseISO(item.createdAt), "d MMMM hh:mmaaa")}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
            backgroundColor: pallet.shade1,
            width: 70,
            paddingVertical: SPACING.lg,
            borderRadius: RADIUS.full,
            marginLeft: SPACING.lg,
            marginBottom: SPACING.sm,
            alignItems: "center",
          }}
        >
          <Spinner variant="dots" size="default" color={"#fff"} />
        </View>
      )}

      {/* Input Area */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          gap: 12,
          backgroundColor: colors.card,
          paddingBottom: insets.bottom,
          paddingTop: 16,
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
          variant="ghost"
          size="icon"
          style={{
            backgroundColor: inputText.trim() ? pallet.shade1 : '#F1F5F9',
            borderRadius: 25,
            width: 44,
            height: 44,
            borderWidth: 0,
            shadowOpacity: 0,
            elevation: 0,
            shadowColor: 'transparent',
          }}
        >
          <SendHorizonal 
            size={20} 
            color={inputText.trim() ? "white" : colors.icon} 
          />
        </Button>
      </View>

      {/* Keyboard avoidance with extra space for better UX */}
      <AvoidKeyboard />
    </View>
  );
}
