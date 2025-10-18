// // @ts-nocheck

import { AvoidKeyboard } from "@/components/ui/avoid-keyboard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColor } from "@/hooks/useColor";
import { Lightbulb, Plus, SendHorizonal, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { createTaskPlan } from "./APi/api-calls";
import { PlanTaskCard } from "./components/plan-task-card";

const sampplePrompts = [
  "Plan a weekly workout routine for a beginner.",
  "I want to travel to New York City Next Week for 5 days. Create an itinerary.",
  " I have a assignment of creating an landing page with 5 sections in 3 days and i can only spend 2 hours daily. Create a plan for me.",
];

const PlanningChat = () => {
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [plan, setPlan] = useState([]);
  const [inputText, setInputText] = useState("");
  const [fetchingResponse, setFetchingResponse] = useState(false);
  const [showSamplePrompts, setShowSamplePrompts] = useState(true);

  const card = useColor({}, "card");
  const blue = useColor({}, "blue");

  const sendMessage = async () => {
    if (inputText.trim()) {
      try {
        setInputText("");
        setMessage(inputText.trim());
        setFetchingResponse(true);
        const res = await createTaskPlan({ taskDescription: inputText.trim() });
        if (res.success) {
          setSummary(res.data.summary ?? "");
          setPlan(res.data.planTasks ?? []);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setFetchingResponse(false);
      }
      setInputText("");
    }
  };

  const RenderMessage = ({ text, isMessage }: any) => (
    <View>
      <View
        style={{
          marginBottom: 12,
          alignItems: isMessage ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            maxWidth: "80%",
            padding: 12,
            borderRadius: 16,
            backgroundColor: isMessage ? "#F2F2F7" : blue,
          }}
        >
          <Text
            style={{
              color: isMessage ? "#000" : "white",
              fontSize: 16,
            }}
          >
            {text}
          </Text>
          {/* <Text
          style={{
            color: isMessage ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
            fontSize: 12,
            marginTop: 4,
          }}
        >
          {format(parseISO(item.createdAt), "d MMMM hh:mmaaa")}
        </Text> */}
        </View>
      </View>
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Message List */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {message && <RenderMessage text={message} isMessage={true} />}
        {fetchingResponse ? (
          <View
            style={{
              alignItems: "center",
              marginTop: 20,
              flexDirection: "row",
              gap: 8,
              justifyContent: "center",
            }}
          >
            <Spinner variant="pulse" color={blue} />
            <Text style={{ color: blue }}>Generating plan ...</Text>
          </View>
        ) : (
          <>
            {summary && <RenderMessage text={summary} isMessage={false} />}
            {plan.map((task, index) => (
              <View
                key={`${task.taskName}-${index}`}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <View style={{ marginTop: 10 }}>
                  <Checkbox
                    isRectangle
                    checked={false}
                    onCheckedChange={() => {}}
                    styles={{}}
                  />
                </View>
                <PlanTaskCard task={task} open={index === 0} />
              </View>
            ))}
          </>
        )}
        {plan.length > 0 && (
          <Button icon={Plus} variant="secondary">
            Add tasks to calendar
          </Button>
        )}
      </ScrollView>

      {/* Sample Prompts */}
      {showSamplePrompts && !message && (
        <View
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
        >
          <Icon
            onPress={() => {
              setShowSamplePrompts(false);
            }}
            name={X}
            size={25}
            style={{ marginLeft: "auto" }}
          />
          {sampplePrompts.map((prompt, index) => (
            <Pressable
              // variant="ghost"
              key={index}
              onPress={() => setInputText(prompt)}
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Icon name={Lightbulb} size={16} color="#000" />
              <Text style={{ color: "#000", fontSize: 13 }}>{prompt}</Text>
            </Pressable>
          ))}
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
            disabled={fetchingResponse}
          />
        </View>
        <Button
          onPress={sendMessage || fetchingResponse}
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
};

export default PlanningChat;
