// OnboardingFlow.tsx
import { Onboarding, OnboardingStep } from "@/components/ui/onboarding";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { addTask } from "../addTask/API/addTask";

// ---- CONFIG: replace this with your real backend endpoint ----
const API_ENDPOINT = "https://your.api.server/v1/user/preferences";
// ----------------------------------------------------------------

// ----------------- Timeline preview -----------------
const TimelinePreview: React.FC = () => {
  const tasks = [
    {
      id: 1,
      time: "12:00 - 12:15 (15m)",
      title: "Buy Groceries",
      icon: "cart",
      subtasks: "5/5",
    },
    {
      id: 2,
      time: "12:15 - 12:30 (15m)",
      title: "Prepare Food",
      icon: "restaurant",
    },
    {
      id: 3,
      time: "12:30 - 13:00 (30m)",
      title: "Eat Lunch",
      icon: "fast-food",
    },
  ];

  const pallet = usePallet();
  const colors = Colors.light; // Always use light theme
  const textColor = useColor({}, "text");
  const textMutedColor = useColor({}, "textMuted");
  const iconColor = useColor({}, "icon");

  return (
    <ScrollView
      style={styles.timelineScrollView}
      contentContainerStyle={styles.timelineContainer}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      {tasks.map((task, index) => (
        <View key={task.id} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View
              style={{ ...styles.iconCircle, backgroundColor: pallet.buttonBg }}
            >
              <Ionicons
                name={task.icon as any}
                size={32}
                color={pallet.ButtonText}
              />
            </View>
            {index < tasks.length - 1 && (
              <View
                style={[
                  styles.connector,
                  { backgroundColor: iconColor + "40" },
                ]}
              />
            )}
          </View>
          <View style={styles.timelineContent}>
            <Text
              style={[styles.timeText, { color: textMutedColor || iconColor }]}
            >
              {task.time}
            </Text>
            <Text style={[styles.taskTitle, { color: textColor }]}>
              {task.title}
            </Text>
            {task.subtasks && (
              <View style={styles.subtaskBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={pallet.ButtonText}
                />
                <Text
                  style={
                    [
                      styles.subtaskText,
                      { color: textMutedColor || iconColor },
                    ] as any
                  }
                >
                  {task.subtasks}
                </Text>
              </View>
            )}
          </View>
          <View
            style={{ ...styles.checkCircle, borderColor: pallet.buttonBg }}
          />
        </View>
      ))}
    </ScrollView>
  );
};

// ----------------- Illustration -----------------
const DayPlannerIllustration: React.FC = () => {
  return (
    <View style={styles.illustrationContainer}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.illustrationImage}
        resizeMode="contain"
      />
    </View>
  );
};

// ----------------- TimePicker (wheel) -----------------
const { height: SCREEN_H } = Dimensions.get("window");
const ITEM_HEIGHT = 72;
const VISIBLE_ITEMS = 5; // must be odd to center properly

type TimePickerProps = {
  value: string;
  onChange: (time: string) => void;
  pillColor?: string;
};

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  pillColor,
}) => {
  const pallet = usePallet?.() ?? null;
  const themePill = pillColor ?? (pallet ? pallet.shade1 : "#3B82F6");

  const [selectedTime, setSelectedTime] = useState<string>(value || "08:00");

  const times = useMemo(() => {
    const out: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        out.push(
          `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    return out;
  }, []);

  const flatRef = useRef<FlatList<string> | null>(null);

  // Sync when parent value changes — scroll once to center on value
  useEffect(() => {
    if (!value) return;
    if (value !== selectedTime) {
      setSelectedTime(value);
      const idx = times.indexOf(value);
      if (idx >= 0) {
        flatRef.current?.scrollToIndex({ index: idx, animated: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // On mount, position the list at the initial value
  useEffect(() => {
    const idx = Math.max(0, times.indexOf(selectedTime));
    if (idx >= 0) {
      setTimeout(() => {
        flatRef.current?.scrollToIndex({ index: idx, animated: false });
      }, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When user taps an item: update value but DO NOT auto-scroll (user requested)
  const handleSelect = (time: string) => {
    setSelectedTime(time);
    onChange(time);
    // no programmatic scroll to avoid little jump on tap
  };

  // When user scrolls and snapping ends, pick centered item
  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const centerIndex = Math.round(offsetY / ITEM_HEIGHT);
    const bounded = Math.max(0, Math.min(times.length - 1, centerIndex));
    const time = times[bounded];
    if (time && time !== selectedTime) {
      setSelectedTime(time);
      onChange(time);
    }
  };

  const getItemLayout = (_: string[] | null, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const sideSpacerHeight = ((VISIBLE_ITEMS - 1) / 2) * ITEM_HEIGHT;

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const selIndex = Math.max(0, times.indexOf(selectedTime));
    const distance = Math.abs(index - selIndex);
    const isCenter = distance === 0;
    const opacity = distance === 0 ? 1 : distance === 1 ? 0.7 : 0.35;
    const scale = distance === 0 ? 1.06 : distance === 1 ? 0.98 : 0.92;

    return (
      <Pressable
        onPress={() => handleSelect(item)}
        style={[styles.row, isCenter && styles.rowCenter]}
        android_ripple={{ color: "#00000005" }}
      >
        <Text
          style={[
            styles.timeText,
            isCenter ? styles.timeTextCenter : null,
            { opacity, transform: [{ scale }] },
          ]}
        >
          {item}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.timePickerContainer}>
      <View pointerEvents="none" style={styles.centerPillWrap}>
        <View style={[styles.centerPill, { backgroundColor: themePill }]}>
          <Text style={styles.centerPillText as any}>{selectedTime}</Text>
        </View>
      </View>

      <FlatList
        ref={flatRef}
        data={times}
        keyExtractor={(t) => t}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumEnd}
        contentContainerStyle={{
          paddingTop: sideSpacerHeight,
          paddingBottom: sideSpacerHeight,
          alignItems: "center",
        }}
        style={styles.list}
        initialNumToRender={VISIBLE_ITEMS * 3}
        windowSize={VISIBLE_ITEMS * 3}
      />
    </View>
  );
};

// ----------------- Main OnboardingFlow -----------------
export function OnboardingFlow() {
  const { completeOnboarding, skipOnboarding } = useOnboardingContext();
  const [wakeUpTime, setWakeUpTime] = useState("08:00");
  const [sleepTime, setSleepTime] = useState("22:00");
  const colors = Colors.light; // Always use light theme
  const textColor = useColor({}, "text");
  const textMutedColor = useColor({}, "textMuted");
  const backgroundCardColor = useColor({}, "background");

  // loading & error state for final API call
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const textMuted = useColor({}, "textMuted") || useColor({}, "icon");

  const WakeUpTimeScreen = () => (
    <View style={styles.timeScreenContainer}>
      <TimePicker value={wakeUpTime} onChange={setWakeUpTime} />
      <Text style={[styles.timeScreenFooter, { color: textMuted }] as any}>
        You can always update this later
      </Text>
    </View>
  );

  const SleepTimeScreen = () => (
    <View style={styles.timeScreenContainer}>
      <TimePicker value={sleepTime} onChange={setSleepTime} />
      <Text style={[styles.timeScreenFooter, { color: textMuted }] as any}>
        You can always update this later
      </Text>
    </View>
  );

  // Small summary component to show final selections before submitting
  const FinalSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={[styles.summaryTitle, { color: textColor }] as any}>
        Almost there — confirm your times
      </Text>
      <View style={styles.timeSummaryRow}>
        <View
          style={[
            styles.timeSummaryCard,
            { backgroundColor: backgroundCardColor },
          ]}
        >
          <Text style={[styles.summaryLabel, { color: textMutedColor }] as any}>
            Wake up
          </Text>
          <Text style={[styles.summaryValue, { color: textColor }] as any}>
            {wakeUpTime}
          </Text>
        </View>
        <View
          style={[
            styles.timeSummaryCard,
            { backgroundColor: backgroundCardColor },
          ]}
        >
          <Text style={[styles.summaryLabel, { color: textMutedColor }] as any}>
            Sleep
          </Text>
          <Text style={[styles.summaryValue, { color: textColor }] as any}>
            {sleepTime}
          </Text>
        </View>
      </View>

      {submitError ? (
        <Text
          style={{
            color: colors.red || "#C0392B",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          {submitError}
        </Text>
      ) : null}

      {submitting ? (
        <View style={{ marginTop: 14 }}>
          <ActivityIndicator size="small" />
        </View>
      ) : null}
    </View>
  );

  function buildISODateForLocalTime(time: string) {
    // time = "08:00"
    const [hour, minute] = time.split(":").map(Number);

    // Use today’s date, or fixed date — doesn’t matter for recurring tasks
    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    return date.toISOString(); // Converts IST → UTC with correct offset
  }
  // function to call backend API — replace endpoint above
  const submitPreferences = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const taskFormat = {
        taskName: "",
        taskDescription: "",
        TaskStartDateTime: new Date().toISOString(),
        duration: {
          hours: 0,
          minutes: 30,
        },
        priority: 0,
        frequency: [8],
        category: "",
      };

      // wakeUpTime, sleepTime;
      const tasks = [
        {
          ...taskFormat,
          taskName: "Wake Up",
          TaskStartDateTime: buildISODateForLocalTime(wakeUpTime),
        },
        {
          ...taskFormat,
          taskName: "Sleep",
          TaskStartDateTime: buildISODateForLocalTime(sleepTime),
        },
      ];

      // need to mange here
      const res = await addTask(tasks);

      if (!res.success) {
        console.log("Failed to add tasks");
      }

      return true;
    } catch (err: any) {
      console.warn("Failed to save preferences", err);
      setSubmitError(
        err?.message ?? "Failed to save preferences. You can retry or skip."
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // handler passed to Onboarding's onComplete — does API call then completes onboarding
  const handleComplete = async () => {
    const ok = await submitPreferences();

    if (!ok) {
      return new Promise<void>((resolve) => {
        Alert.alert(
          "Couldn't save preferences",
          "We couldn't save wake/sleep times to the server. You can retry, skip saving, or complete onboarding without saving.",
          [
            {
              text: "Retry",
              onPress: async () => {
                const retryOk = await submitPreferences();
                if (retryOk) {
                  await completeOnboarding();
                  resolve();
                } else {
                  resolve();
                }
              },
            },
            {
              text: "Skip saving",
              onPress: async () => {
                await completeOnboarding();
                resolve();
              },
              style: "destructive",
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => resolve(),
            },
          ],
          { cancelable: true }
        );
      });
    }

    await completeOnboarding();
  };

  const pallet = usePallet();

  const steps: OnboardingStep[] = [
    {
      id: "1",
      title: (
        <>
          A{" "}
          <Text style={[styles.highlightText, { color: pallet.shade1 }] as any}>
            Timeline
          </Text>
          {"\n"}Of Your Day
        </>
      ) as any,
      description: "All your tasks in a visual timeline",
      component: <TimelinePreview />,
    },
    {
      id: "2",
      title: (
        <>
          25Hours{"\n"}is a{" "}
          <Text style={[styles.highlightText, { color: pallet.shade1 }] as any}>
            AI Day Planner
          </Text>
        </>
      ) as any,
      description: "Bring more productivity into your everyday life",
      component: <DayPlannerIllustration />,
    },
    {
      id: "3",
      title: (
        <>
          When Do You{"\n"}Usually{" "}
          <Text style={[styles.highlightText, { color: pallet.shade1 }] as any}>
            Wake Up
          </Text>
          ?
        </>
      ) as any,
      description: "Scroll to adjust the time",
      component: <WakeUpTimeScreen />,
    },
    {
      id: "4",
      title: (
        <>
          When Do You{"\n"}Usually{" "}
          <Text style={[styles.highlightText, { color: pallet.shade1 }] as any}>
            Sleep
          </Text>
          ?
        </>
      ) as any,
      description: "Scroll to adjust the time",
      component: <SleepTimeScreen />,
    },
    {
      id: "5",
      title: "Confirm",
      description: "We will save these preferences to your account",
      component: <FinalSummary />,
    },
  ];

  return (
    <Onboarding
      steps={steps}
      onComplete={handleComplete}
      onSkip={async () => {
        await skipOnboarding();
      }}
      primaryButtonText="Get Started"
      nextButtonText="Continue"
      skipButtonText="Skip"
      showSkip={false}
    />
  );
}

// ----------------- Styles -----------------
const styles = StyleSheet.create({
  // Timeline styles
  timelineScrollView: {
    maxHeight: 400,
    width: "100%",
  },
  timelineContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
    position: "relative",
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 20,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFE5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  connector: {
    width: 2,
    flex: 1,
    marginTop: 10,
    minHeight: 40,
  },
  timelineContent: {
    flex: 1,
    justifyContent: "center",
  },
  timeText: {
    fontSize: 14,
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtaskBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  subtaskText: {
    fontSize: 14,
  },
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    marginLeft: 10,
  },

  // Illustration styles
  illustrationContainer: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  illustrationImage: {
    width: 250,
    height: 250,
  },

  // Time picker styles
  timeScreenContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },
  timePickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: "100%",
    alignItems: "center",
    overflow: "hidden",
  },
  list: {
    width: "100%",
  },
  // selected time badge
  centerPillWrap: {
    position: "absolute",
    top: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2 - ITEM_HEIGHT / 2,
    left: "50%",
    transform: [{ translateX: -90 }],
    zIndex: 20,
    width: 180,
    alignItems: "center",
  },
  centerPill: {
    width: 140,
    height: 40,
    borderRadius: ITEM_HEIGHT * 0.45,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  centerPillText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  timePickerScroll: {
    paddingVertical: 100,
    alignItems: "center",
  },
  timeItem: {
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginVertical: 2,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 140,
  },
  selectedTimeItem: {
    backgroundColor: "#FF9999",
    shadowColor: "#FF9999",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  timeItemText: {
    fontSize: 22,
    color: "#999",
    fontWeight: "500",
  },
  selectedTimeItemText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 26,
  },
  timeScreenFooter: {
    fontSize: 14,
    marginTop: 30,
    textAlign: "center",
  },

  // Final summary styles
  summaryContainer: {
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  timeSummaryRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  timeSummaryCard: {
    borderRadius: 12,
    padding: 14,
    minWidth: 120,
    alignItems: "center",
    borderWidth: 1,
    elevation: 1,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "800",
  },

  // Highlight text
  highlightText: {
    // Color will be set dynamically using palette
  },

  // tiny helpers
  row: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  rowCenter: {},
});
