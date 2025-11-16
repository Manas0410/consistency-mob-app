import BackHeader from "@/components/ui/back-header";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Picker } from "@/components/ui/picker";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { TaskData } from "@/constants/types";
import { defaultHabbits } from "@/dummy/defaultHabbits";
import { usePallet } from "@/hooks/use-pallet";
import { addTask } from "@/pages/addTask/API/addTask";
import { createHabbit } from "@/pages/Habbits/API/callAPI";
import { addMinutes } from "date-fns";
import {
  Coffee,
  Heart,
  Lightbulb,
  ListTodo,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView as RNScrollView,
  View as RNView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

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
  const [GenerateAIenabled, setGenerateAIEnabled] = useState<boolean>(false);
  const [AIGeneratedHabbits, setAIGeneratedHabbits] = useState<any[]>([]);
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
  });
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();
  // Category icons and colors
  const categoryConfig: Record<
    string,
    { icon: any; color: string; bgColor: string }
  > = {
    Health: {
      icon: Heart,
      color: "#F87171",
      bgColor: "#FEE2E2",
    },
    Finance: {
      icon: TrendingUp,
      color: "#34D399",
      bgColor: "#D1FAE5",
    },
    Growth: {
      icon: Target,
      color: "#A78BFA",
      bgColor: "#EDE9FE",
    },
    Productivity: {
      icon: Lightbulb,
      color: "#FB923C",
      bgColor: "#FFEDD5",
    },
    Lifestyle: {
      icon: Coffee,
      color: "#22D3EE",
      bgColor: "#CFFAFE",
    },
  };

  const handleChange = (field: keyof TaskData, value: any) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const inputRef = useRef<any>(null);
  const [targetY, setTargetY] = useState(0);
  const scrollRef = useRef<RNScrollView>(null);

  const scrollToTarget = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: targetY, animated: true });
    }
  };

  const addAccordian = (habbit: string, description: string) => {
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

  const CircularProgress = ({
    progress,
    size = 48,
    strokeWidth = 4,
  }: {
    progress: number;
    size?: number;
    strokeWidth?: number;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={pallet.shade1}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Habits" />
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <RNView style={styles.header}>
          <Text variant="title" style={styles.sectionTitle}>
            {GenerateAIenabled ? "AI Generated Habits" : "Browse Categories"}
          </Text>
          <Text variant="caption" style={styles.sectionSubtitle}>
            {GenerateAIenabled
              ? "Tell us your goal and we'll suggest habits"
              : "Choose from our curated habit collections"}
          </Text>
        </RNView>

        {/* Category Pills */}
        {!GenerateAIenabled && (
          <RNView style={styles.categorySection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {Object.keys(defaultHabbits).map((key) => {
                const config = categoryConfig[key];
                const isActive = selectedTab === key;
                const IconComponent = config?.icon || Heart;

                return (
                  <Pressable
                    key={key}
                    onPress={() => setSelectedTab(key)}
                    style={({ pressed }) => [
                      styles.categoryCard,
                      isActive && [
                        styles.categoryCardActive,
                        { borderColor: config?.color },
                      ],
                      pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                    ]}
                  >
                    <RNView
                      style={[
                        styles.categoryIconBox,
                        {
                          backgroundColor: config?.bgColor,
                        },
                      ]}
                    >
                      <IconComponent size={20} color={config?.color} />
                    </RNView>
                    <Text
                      variant="caption"
                      style={[
                        styles.categoryLabel,
                        isActive && [
                          styles.categoryLabelActive,
                          { color: config?.color },
                        ],
                      ]}
                    >
                      {key}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </RNView>
        )}

        {/* Habit Cards */}
        <RNView style={styles.cardsContainer}>
          {!GenerateAIenabled ? (
            <>
              {(defaultHabbits as any)[selectedTab]?.map(
                (
                  {
                    habitName,
                    habitDescription,
                  }: { habitName: string; habitDescription: string },
                  index: number
                ) => (
                  <Pressable
                    key={habitName + index}
                    style={styles.habitCard}
                    onPress={() => addAccordian(habitName, habitDescription)}
                  >
                    <CircularProgress progress={0} />
                    <RNView style={styles.habitContent}>
                      <Text variant="subtitle" style={styles.habitName}>
                        {habitName}
                      </Text>
                      <Text
                        variant="caption"
                        style={styles.habitDescription}
                        numberOfLines={1}
                      >
                        {habitDescription}
                      </Text>
                    </RNView>
                    <RNView style={styles.addButton}>
                      <Plus size={20} color={pallet.shade1} />
                    </RNView>
                  </Pressable>
                )
              )}
            </>
          ) : (
            <RNView style={styles.aiSection}>
              <Input
                ref={inputRef}
                type="textarea"
                variant="outline"
                placeholder="Describe your goal (e.g., 'Get healthier and more active')"
                value={HabbitPrompt}
                onChangeText={setHabbitPrompt}
                rows={3}
                containerStyle={styles.aiInput}
              />
              <Button
                icon={Sparkles}
                style={styles.generateButton}
                textStyle={styles.generateButtonText}
                loading={AIloading}
                onPress={getAIHabbits}
              >
                Generate Habits with AI
              </Button>
              {AIGeneratedHabbits.length > 0 && (
                <RNView style={styles.generatedHabits}>
                  {AIGeneratedHabbits.map(
                    (
                      {
                        habbitName,
                        habbitDescription,
                      }: { habbitName: string; habbitDescription: string },
                      index: number
                    ) => (
                      <Pressable
                        key={habbitName + index}
                        style={styles.habitCard}
                        onPress={() =>
                          addAccordian(habbitName, habbitDescription)
                        }
                      >
                        <CircularProgress progress={0} />
                        <RNView style={styles.habitContent}>
                          <Text variant="subtitle" style={styles.habitName}>
                            {habbitName}
                          </Text>
                          <Text
                            variant="caption"
                            style={styles.habitDescription}
                            numberOfLines={1}
                          >
                            {habbitDescription}
                          </Text>
                        </RNView>
                        <RNView style={styles.addButton}>
                          <Plus size={20} color={pallet.shade1} />
                        </RNView>
                      </Pressable>
                    )
                  )}
                </RNView>
              )}
            </RNView>
          )}
        </RNView>

        {/* Toggle Button */}
        <Button
          icon={GenerateAIenabled ? ListTodo : Sparkles}
          style={styles.toggleButton}
          textStyle={styles.toggleButtonText}
          onPress={() => {
            setGenerateAIEnabled((p) => !p);
          }}
        >
          {GenerateAIenabled ? "Browse Categories" : "Generate with AI"}
        </Button>

        {/* Manual Entry Section */}
        <RNView
          style={styles.manualSection}
          onLayout={(e) => setTargetY(e.nativeEvent.layout.y)}
        >
          <RNView style={styles.manualHeader}>
            <Text variant="title" style={styles.manualTitle}>
              Create Custom Habit
            </Text>
            <Text variant="caption" style={styles.manualSubtitle}>
              Build your own personalized habit
            </Text>
          </RNView>

          <RNView style={styles.formContainer}>
            <Input
              label="Habit Name"
              placeholder="e.g., Morning Walk"
              value={task.taskName}
              onChangeText={(text) => handleChange("taskName", text)}
              error={taskNameError}
              variant="filled"
            />
            <Input
              type="textarea"
              label="Description (optional)"
              placeholder="Add notes about your habit..."
              value={task.taskDescription}
              onChangeText={(text) => handleChange("taskDescription", text)}
              variant="filled"
              rows={3}
            />
            <DatePicker
              variant="filled"
              label="Preferred Time"
              mode="time"
              value={task.TaskStartDateTime}
              onChange={(date) => handleChange("TaskStartDateTime", date)}
              placeholder="Select time"
              timeFormat="12"
            />
            <Picker
              variant="filled"
              label="Repeat Schedule"
              multiple
              values={task.frequency.map(String)}
              options={options.map((opt) => ({
                ...opt,
                value: String(opt.value),
              }))}
              onValuesChange={(val) =>
                handleChange(
                  "frequency",
                  val.map((v) => parseInt(v))
                )
              }
            />
            <Button
              icon={Plus}
              loading={loading}
              variant="default"
              onPress={onSubmit}
              style={{ ...styles.submitButton, backgroundColor: pallet.shade1 }}
              textStyle={{ color: "#fff" }}
            >
              Create Habit
            </Button>
          </RNView>
        </RNView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  categorySection: {
    paddingBottom: 20,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  categoryScrollContent: {
    gap: 12,
    paddingRight: 20,
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
    minWidth: 100,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryCardActive: {
    borderColor: "transparent",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  categoryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  categoryLabelActive: {
    fontWeight: "700",
  },
  categoryPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryPillActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  habitContent: {
    flex: 1,
    gap: 4,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  habitDescription: {
    fontSize: 13,
    color: "#6B7280",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  aiSection: {
    gap: 12,
  },
  aiInput: {
    backgroundColor: "#FFFFFF",
  },
  generateButton: {
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  generateButtonText: {
    color: "#92400E",
    fontWeight: "600",
  },
  generatedHabits: {
    gap: 12,
    marginTop: 8,
  },
  toggleButton: {
    marginHorizontal: 20,
    marginVertical: 24,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  toggleButtonText: {
    color: "#3730A3",
    fontWeight: "600",
  },
  manualSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  manualHeader: {
    marginBottom: 20,
  },
  manualTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  manualSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 12,
  },
});

export default Habbit;
