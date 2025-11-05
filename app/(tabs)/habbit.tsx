import BackHeader from "@/components/ui/back-header";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Picker } from "@/components/ui/picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { View } from "@/components/ui/view";
import { TaskData } from "@/constants/types";
import { defaultHabbits } from "@/dummy/defaultHabbits";
import { usePallet } from "@/hooks/use-pallet";
import { addTask } from "@/pages/addTask/API/addTask";
import { createHabbit } from "@/pages/Habbits/API/callAPI";
import HabbitAccordian from "@/pages/Habbits/components/Habbit-accordian";
import { addMinutes } from "date-fns";
import {
  Goal,
  ListTodo,
  Plus,
  ScrollText,
  Sparkles,
} from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const options = [
  //   { label: "Once", value: 0 },
  { label: "Everyday", value: 8 },
  { label: "Every Sunday", value: 1 },
  { label: "Every Monday", value: 2 },
  { label: "Every Tuesday", value: 3 },
  { label: "Every Wednesday", value: 4 },
  { label: "Every Thursday", value: 5 },
  { label: "Every Friday", value: 6 },
  { label: "Every Saturday", value: 7 },
];

const Habbit = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Health");
  const pallet = usePallet();
  const [GenerateAIenabled, setGenerateAIEnabled] = useState();
  const [AIGeneratedHabbits, setAIGeneratedHabbits] = useState([]);
  const [AIloading, setAILoading] = useState(false);
  const [HabbitPrompt, setHabbitPrompt] = useState("");
  const [task, setTask] = useState<TaskData>({
    taskName: "",
    taskDescription: "",
    TaskStartDateTime: addMinutes(new Date(), 15),
    duration: { hours: 0, minutes: 30 },
    priority: 0,
    frequency: [8],
    category: "Habbit",
    isHabbit: true,
  });
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleChange = (field: keyof TaskData, value: any) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const inputRef = useRef(null);
  const [targetY, setTargetY] = useState(0);
  const scrollRef = useRef(null);

  const scrollToTarget = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: targetY, animated: true });
    }
  };

  const addAccordian = (habbit, description) => {
    try {
      handleChange("taskName", habbit);
      handleChange("taskDescription", description);
      scrollToTarget();
    } catch (err) {
      console.log(err);
    }
  };

  const getAIHabbits = async () => {
    try {
      if (inputRef.current) {
        inputRef.current?.blur();
      }
      setAILoading(true);
      const res = await createHabbit(HabbitPrompt);
      if (res.success) {
        setAIGeneratedHabbits(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setAILoading(false);
    }
  };

  const onSubmit = async () => {
    if (task.taskName.trim() === "") {
      setShowError(true);
    }
    try {
      setLoading(true);
      const response = await addTask(task);
      if (response.success) {
        success(
          "Habbit added successfully!",
          "you can track them from tasks page!"
        );
        setTask({
          taskName: "",
          taskDescription: "",
          TaskStartDateTime: addMinutes(new Date(), 15),
          duration: { hours: 0, minutes: 30 },
          priority: 0,
          frequency: [0],
          category: "",
        });
      } else {
        error("Failed to add Habbit.");
      }
    } catch (err) {
      console.log(err);
      error("Failed to add Habbit.");
    } finally {
      setLoading(false);
    }
  };

  const taskNameError =
    showError && task.taskName.trim() === "" ? "Task name is required." : "";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <BackHeader title="Add Habbits" />
      <ScrollView
        ref={scrollRef}
        style={{ padding: 10, backgroundColor: "#f5f3f3ff" }}
      >
        <Text variant="title" style={{ marginVertical: 20 }}>
          {GenerateAIenabled
            ? "Tell your goal and generate habbits with AI"
            : "Slect from pre-defined categories"}
        </Text>

        {!GenerateAIenabled ? (
          <Tabs
            defaultValue={selectedTab}
            style={{ borderRadius: 10 }}
            onValueChange={(value) => setSelectedTab(value)}
          >
            <TabsList style={{ backgroundColor: "transparent" }}>
              {Object.keys(defaultHabbits).map((key) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  style={{
                    borderRadius: 30,
                    backgroundColor: "#dcdbdbff",
                    marginHorizontal: 2,
                  }}
                  activeStyle={{ backgroundColor: "#000" }}
                  activeTextStyle={{ color: "#fff" }}
                >
                  {key}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(defaultHabbits).map(([key, habits]) => (
              <TabsContent key={key} value={key}>
                <View style={{}}>
                  {habits.map(({ habitName, habitDescription }) => (
                    <HabbitAccordian
                      key={habitName}
                      addAccordian={addAccordian}
                      habitName={habitName}
                      habitDescription={habitDescription}
                    />
                  ))}
                </View>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <View>
            <Input
              ref={inputRef}
              type="textarea"
              variant="outline"
              placeholder="enter your goal"
              value={HabbitPrompt}
              onChangeText={setHabbitPrompt}
            />
            <Button
              icon={Sparkles}
              style={{
                borderRadius: 30,
                marginVertical: 10,
                backgroundColor: "#fbd8adff",
              }}
              textStyle={{ color: "#F97316" }}
              loading={AIloading}
              onPress={getAIHabbits}
            >
              GENERATE HABBITS
            </Button>
            {AIGeneratedHabbits.length && (
              <View>
                {AIGeneratedHabbits.map(({ habbitName, habbitDescription }) => (
                  <HabbitAccordian
                    addAccordian={addAccordian}
                    habitName={habbitName}
                    habitDescription={habbitDescription}
                  />
                ))}
              </View>
            )}
          </View>
        )}
        <Button
          icon={GenerateAIenabled ? ListTodo : Sparkles}
          style={{
            marginVertical: 16,
            borderRadius: 10,
            backgroundColor: "#d8e7fbff",
          }}
          textStyle={{ color: "#3B82F6" }}
          onPress={() => {
            setGenerateAIEnabled((p) => !p);
          }}
        >
          {GenerateAIenabled ? "SELECT FROM LIST" : "GENERATE HABBITS WITH AI"}
        </Button>
        <Text variant="title" style={{ marginVertical: 20 }}>
          Enter Habbits manually
        </Text>
        <View
          style={{ gap: 10, marginBottom: 350 }}
          onLayout={(e) => setTargetY(e.nativeEvent.layout.y)}
        >
          <Input
            label="Habbit"
            placeholder="Enter Habbit"
            icon={Goal}
            value={task.taskName}
            onChangeText={(text) => handleChange("taskName", text)}
            error={taskNameError}
            variant="outline"
            containerStyle={{ backgroundColor: "#fff", borderRadius: 12 }}
          />
          <Input
            type="textarea"
            label="Description"
            placeholder="Enter Habbit description"
            icon={ScrollText}
            value={task.taskDescription}
            onChangeText={(text) => handleChange("taskDescription", text)}
            variant="outline"
            containerStyle={{ backgroundColor: "#fff", borderRadius: 12 }}
          />
          <DatePicker
            variant="outline"
            label="12-Hour Time"
            mode="time"
            value={task.TaskStartDateTime}
            onChange={(date) => handleChange("TaskStartDateTime", date)}
            placeholder="Select time"
            timeFormat="12"
            style={{ backgroundColor: "#fff", borderRadius: 12 }}
          />
          <Picker
            variant="outline"
            label="Select Frequency"
            multiple
            values={task.frequency}
            options={options}
            onValuesChange={(val) => handleChange("frequency", val)}
            style={{ backgroundColor: "#fff", borderRadius: 12 }}
          />
          <Button
            icon={Plus}
            loading={loading}
            variant="success"
            onPress={onSubmit}
          >
            Add Task
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Habbit;
