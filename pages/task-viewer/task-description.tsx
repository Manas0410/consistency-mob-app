import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertCircle, ArrowLeft, Calendar, Clock } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PomodoroTimer } from "./components/pomodo-timer"; // assuming in same folder

export default function TaskDetail() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [task, setTask] = useState({
    userId: "userId123",
    taskName: "Early Wakeup",
    taskDescription: "Start your day fresh at 6 AM.",
    taskStartDateTime: "2025-09-21T06:00:00.000Z",
    endTime: "2025-09-21T07:00:00.000Z",
    isDone: false,
    isHabbit: true,
    duration: { hours: 1, minutes: 0 },
    priority: 2,
    frequency: [8],
  });

  // Pomodoro states
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [currentPhase, setCurrentPhase] = useState("work"); // 'work', 'shortBreak', 'longBreak'
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef(null);

  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handlePhaseComplete();
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handlePhaseComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsRunning(false);

    if (currentPhase === "work") {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);

      if (newCount % 4 === 0) {
        setCurrentPhase("longBreak");
        setTimeLeft(LONG_BREAK);
        Alert.alert("Work Complete!", "Time for a long break (15 minutes)");
      } else {
        setCurrentPhase("shortBreak");
        setTimeLeft(SHORT_BREAK);
        Alert.alert("Work Complete!", "Time for a short break (5 minutes)");
      }
    } else {
      setCurrentPhase("work");
      setTimeLeft(WORK_TIME);
      Alert.alert("Break Complete!", "Ready for another work session?");
    }
  };

  const startPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning(!isRunning);
  };

  const reset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRunning(false);
    if (currentPhase === "work") setTimeLeft(WORK_TIME);
    else if (currentPhase === "shortBreak") setTimeLeft(SHORT_BREAK);
    else setTimeLeft(LONG_BREAK);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return "#ef4444";
      case 2:
        return "#f59e0b";
      case 3:
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 1:
        return "High";
      case 2:
        return "Medium";
      case 3:
        return "Low";
      default:
        return "Normal";
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case "work":
        return "#ef4444";
      case "shortBreak":
        return "#10b981";
      case "longBreak":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case "work":
        return "Work Time";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
      default:
        return "Pomodoro";
    }
  };

  const progress =
    currentPhase === "work"
      ? (WORK_TIME - timeLeft) / WORK_TIME
      : currentPhase === "shortBreak"
      ? (SHORT_BREAK - timeLeft) / SHORT_BREAK
      : (LONG_BREAK - timeLeft) / LONG_BREAK;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar style="light" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "600",
            marginLeft: 16,
            flex: 1,
          }}
        >
          Task Details
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Task Info */}
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: "700",
                marginBottom: 12,
              }}
            >
              {task.taskName}
            </Text>
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: 16,
                lineHeight: 24,
                marginBottom: 20,
              }}
            >
              {task.taskDescription}
            </Text>
            {/* Task metadata */}
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Calendar size={16} color="rgba(255, 255, 255, 0.6)" />
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    marginLeft: 8,
                    fontSize: 14,
                  }}
                >
                  Start: {formatDateTime(task.taskStartDateTime)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Clock size={16} color="rgba(255, 255, 255, 0.6)" />
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    marginLeft: 8,
                    fontSize: 14,
                  }}
                >
                  Duration: {task.duration.hours}h {task.duration.minutes}m
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AlertCircle
                  size={16}
                  color={getPriorityColor(task.priority)}
                />
                <Text
                  style={{
                    color: getPriorityColor(task.priority),
                    marginLeft: 8,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {getPriorityText(task.priority)} Priority
                </Text>
              </View>
              {task.isHabbit && (
                <View
                  style={{
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      color: "#3b82f6",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Habit
                  </Text>
                </View>
              )}
            </View>
          </View>
          {/* Pomodoro Toggle */}
          <TouchableOpacity
            onPress={() => setPomodoroMode(!pomodoroMode)}
            style={{
              backgroundColor: pomodoroMode
                ? "rgba(239, 68, 68, 0.2)"
                : "rgba(255, 255, 255, 0.1)",
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              borderWidth: 2,
              borderColor: pomodoroMode ? "#ef4444" : "transparent",
            }}
          >
            <Text
              style={{
                color: pomodoroMode ? "#ef4444" : "#fff",
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {pomodoroMode
                ? "🍅 Pomodoro Mode Active"
                : "🍅 Use Pomodoro Technique"}
            </Text>
            {!pomodoroMode && (
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Work in focused 25-minute intervals
              </Text>
            )}
          </TouchableOpacity>
          {/* Pomodoro Timer */}
          {pomodoroMode && (
            <PomodoroTimer
              isRunning={isRunning}
              timeLeft={timeLeft}
              currentPhase={currentPhase}
              completedPomodoros={completedPomodoros}
              startPause={startPause}
              reset={reset}
              getPhaseColor={getPhaseColor}
              getPhaseText={getPhaseText}
              formatTime={formatTime}
              progress={progress}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
