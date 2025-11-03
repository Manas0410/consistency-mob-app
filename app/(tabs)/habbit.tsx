import BackHeader from "@/components/ui/back-header";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Picker } from "@/components/ui/picker";
import { Separator } from "@/components/ui/separator";
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
  ArrowBigRight,
  Brain,
  Goal,
  Plus,
  ScrollText,
} from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const options = [
  //   { label: "Once", value: 0 },
  { label: "Every Sunday", value: 1 },
  { label: "Every Monday", value: 2 },
  { label: "Every Tuesday", value: 3 },
  { label: "Every Wednesday", value: 4 },
  { label: "Every Thursday", value: 5 },
  { label: "Every Friday", value: 6 },
  { label: "Every Saturday", value: 7 },
  { label: "Everyday", value: 8 },
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
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <BackHeader title="Add Habbits" />
      <ScrollView ref={scrollRef}>
        <Text variant="subtitle" style={{ marginVertical: 20 }}>
          Slect from pre defined categories
        </Text>

        {!GenerateAIenabled ? (
          <Tabs
            defaultValue={selectedTab}
            style={{ borderRadius: 10 }}
            onValueChange={(value) => setSelectedTab(value)}
          >
            <TabsList>
              {Object.keys(defaultHabbits).map((key) => (
                <TabsTrigger key={key} value={key} style={{ borderRadius: 30 }}>
                  {key}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(defaultHabbits).map(([key, habits]) => (
              <TabsContent key={key} value={key}>
                <View style={{ padding: 16 }}>
                  {habits.map(({ habitName, habitDescription }) => (
                    <HabbitAccordian
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
              icon={ArrowBigRight}
              style={{
                backgroundColor: pallet.shade1,
                borderRadius: 10,
                marginVertical: 10,
              }}
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
        <Separator style={{ marginVertical: 16 }} />
        <Button
          icon={Brain}
          style={{
            backgroundColor: pallet.shade1,
            borderRadius: 10,
          }}
          onPress={() => {
            setGenerateAIEnabled((p) => !p);
          }}
        >
          {GenerateAIenabled ? "SELECT FROM LIST" : "GENERATE HABBITS WITH AI"}
        </Button>
        <Separator style={{ marginVertical: 16 }} />
        <Text variant="subtitle" style={{ marginVertical: 20 }}>
          Enter Habbits manually
        </Text>
        <View
          style={{ gap: 6, marginBottom: 350 }}
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
          />
          <Input
            type="textarea"
            label="Description"
            placeholder="Enter Habbit description"
            icon={ScrollText}
            value={task.taskDescription}
            onChangeText={(text) => handleChange("taskDescription", text)}
            variant="outline"
          />
          <DatePicker
            variant="outline"
            label="12-Hour Time"
            mode="time"
            value={task.TaskStartDateTime}
            onChange={(date) => handleChange("TaskStartDateTime", date)}
            placeholder="Select time"
            timeFormat="12"
          />
          <Picker
            variant="outline"
            label="Select Frequency"
            multiple
            values={task.frequency}
            options={options}
            onValuesChange={(val) => handleChange("frequency", val)}
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
