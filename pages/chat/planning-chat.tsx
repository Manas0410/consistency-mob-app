// // @ts-nocheck

import { AvoidKeyboard } from "@/components/ui/avoid-keyboard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { View } from "@/components/ui/view";
import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { Lightbulb, Plus, SendHorizonal, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { addTask } from "../addTask/API/addTask";
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
  const [selectedTaskIds, setSelectedTaskIds] = useState({});
  const [selectedTasks, setSelectedTasks] = useState<any[]>([]);
  const [taskAddLoading, setTaskAddLoading] = useState(false);

  const { success, error } = useToast();

  const pallet = usePallet();
  const colors = Colors.light; // Always use light theme
  const textColor = useColor({}, "text");
  const textMutedColor = useColor({}, "textMuted");
  const iconColor = useColor({}, "icon");
  const backgroundColor = useColor({}, "background");
  const borderColor = useColor({}, "border");
  const cardBackgroundColor = "#F2F2F7";
  const insets = useSafeAreaInsets();

  const hadleCheckBoxChange = (isChecked: boolean, item: any) => {
    if (isChecked) {
      setSelectedTasks((p) => [...p, item]);
      setSelectedTaskIds((p) => ({ ...p, [item.id]: true }));
    } else {
      setSelectedTasks((p) => {
        let temp = [...p];
        return temp.filter((task) => task?.id === item?.id);
      });
      setSelectedTaskIds((p) => ({ ...p, [item.id]: false }));
    }
  };

  const handleAddTask = async () => {
    try {
      setTaskAddLoading(true);
      const res = await addTask(selectedTasks);
      if (res.success) {
        success("Tasks added to calendar");
      } else {
        error("Error in adding tasks");
      }
    } catch {
      error("Error in adding tasks");
    } finally {
      setTaskAddLoading(false);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim()) {
      try {
        setInputText("");
        setMessage(inputText.trim());
        setFetchingResponse(true);
        const res = await createTaskPlan({ taskDescription: inputText.trim() });
        if (res.success) {
          setSummary(res.data.summary ?? "");
          setPlan(
            (res.data.planTasks ?? []).map((item, i) => ({
              ...item,
              ["id"]: i + 1,
            }))
          );
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setFetchingResponse(false);
      }
      setInputText("");
    }
  };

  const RenderMessage = ({ text, isMessage }: any) => {
    const userMessageBg = "#F2F2F7";
    const aiMessageBg = pallet.shade1;

    return (
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
              backgroundColor: isMessage ? userMessageBg : aiMessageBg,
            }}
          >
            <Text
              style={{
                color: isMessage ? textColor : "white",
                fontSize: 16,
              }}
            >
              {text}
            </Text>
            {/* <Text
          style={{
            color: isMessage ? (textMutedColor || iconColor) : "rgba(255,255,255,0.7)",
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
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
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
            <Spinner variant="pulse" color={pallet.shade1} />
            <Text style={{ color: pallet.shade1 }}>Generating plan ...</Text>
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
                    checked={selectedTaskIds[task?.id]}
                    onCheckedChange={(check) => {
                      hadleCheckBoxChange(check, task);
                    }}
                    styles={{}}
                  />
                </View>
                <PlanTaskCard task={task} open={index === 0} />
              </View>
            ))}
          </>
        )}
        {plan.length > 0 && (
          <Button
            icon={Plus}
            loading={taskAddLoading}
            variant="secondary"
            style={{ marginBottom: 26 }}
            onPress={handleAddTask}
            disabled={plan.length < 1}
          >
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
                borderBottomColor: borderColor || "#eee",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Icon name={Lightbulb} size={16} color={pallet.shade1} />
              <Text style={{ color: textColor, fontSize: 13 }}>{prompt}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Input Area */}

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          gap: 12,
          backgroundColor: cardBackgroundColor,
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
