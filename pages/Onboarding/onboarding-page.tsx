import { Onboarding, OnboardingStep } from "@/components/ui/onboarding";
import { Text } from "@/components/ui/text";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { usePallet } from "@/hooks/use-pallet";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Timeline Preview Component
const TimelinePreview = () => {
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
            {index < tasks.length - 1 && <View style={styles.connector} />}
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.timeText}>{task.time}</Text>
            <Text style={styles.taskTitle}>{task.title}</Text>
            {task.subtasks && (
              <View style={styles.subtaskBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={pallet.ButtonText}
                />
                <Text style={styles.subtaskText}>{task.subtasks}</Text>
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

// Day Planner Illustration Component
const DayPlannerIllustration = () => {
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

// Time Picker Component
const TimePicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (time: string) => void;
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [selectedTime, setSelectedTime] = React.useState(value);

  const generateTimes = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const times = generateTimes();
  const currentIndex = times.indexOf(selectedTime);

  // Sync internal state with prop value
  React.useEffect(() => {
    setSelectedTime(value);
  }, [value]);

  // Scroll to selected time on mount and when selectedTime changes
  React.useEffect(() => {
    if (currentIndex >= 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: currentIndex * 52 - 100,
          animated: false,
        });
      }, 100);
    }
  }, [currentIndex]);

  const handleTimeSelect = (time: string) => {
    console.log("Time selected:", time);
    setSelectedTime(time);
    onChange(time);
    const newIndex = times.indexOf(time);
    scrollViewRef.current?.scrollTo({
      y: newIndex * 52 - 100,
      animated: true,
    });
  };

  return (
    <View style={styles.timePickerContainer}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.timePickerScroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEnabled={true}
      >
        {times.map((time, index) => {
          const distance = Math.abs(index - currentIndex);
          const opacity = distance === 0 ? 1 : distance === 1 ? 0.6 : 0.3;
          const isSelected = time === selectedTime;

          return (
            <TouchableOpacity
              key={time}
              style={[styles.timeItem, isSelected && styles.selectedTimeItem]}
              onPress={() => handleTimeSelect(time)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.timeItemText,
                  isSelected && styles.selectedTimeItemText,
                  { opacity },
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export function OnboardingFlow() {
  const { completeOnboarding, skipOnboarding } = useOnboardingContext();
  const [wakeUpTime, setWakeUpTime] = useState("08:00");
  const [sleepTime, setSleepTime] = useState("22:00");

  const WakeUpTimeScreen = () => (
    <View style={styles.timeScreenContainer}>
      <TimePicker value={wakeUpTime} onChange={setWakeUpTime} />
      <Text style={styles.timeScreenFooter}>
        You can always update this later
      </Text>
    </View>
  );

  const SleepTimeScreen = () => (
    <View style={styles.timeScreenContainer}>
      <TimePicker value={sleepTime} onChange={setSleepTime} />
      <Text style={styles.timeScreenFooter}>
        You can always update this later
      </Text>
    </View>
  );

  const steps: OnboardingStep[] = [
    {
      id: "1",
      title: (
        <>
          A <Text style={styles.highlightText}>Timeline</Text>
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
          <Text style={styles.highlightText}>AI Day Planner</Text>
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
          <Text style={styles.highlightText}>Wake Up</Text>?
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
          <Text style={styles.highlightText}>Sleep</Text>?
        </>
      ) as any,
      description: "Scroll to adjust the time",
      component: <SleepTimeScreen />,
    },
  ];

  return (
    <Onboarding
      steps={steps}
      onComplete={completeOnboarding}
      onSkip={skipOnboarding}
      primaryButtonText="Get Started"
      nextButtonText="Continue"
      skipButtonText="Skip"
      showSkip={false}
    />
  );
}

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
    backgroundColor: "#E0E0E0",
    marginTop: 10,
    minHeight: 40,
  },
  timelineContent: {
    flex: 1,
    justifyContent: "center",
  },
  timeText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  subtaskBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  subtaskText: {
    fontSize: 14,
    color: "#666",
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
    height: 250,
    width: "100%",
    alignItems: "center",
    overflow: "hidden",
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
    color: "#999",
    marginTop: 30,
    textAlign: "center",
  },

  // Highlight text
  highlightText: {
    color: "#3B82F6",
  },
});
