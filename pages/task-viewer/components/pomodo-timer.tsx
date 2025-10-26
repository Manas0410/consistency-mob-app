import { Pause, Play, RotateCcw } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export function PomodoroTimer({
  isRunning,
  timeLeft,
  currentPhase,
  completedPomodoros,
  startPause,
  reset,
  getPhaseColor,
  getPhaseText,
  formatTime,
  progress,
}) {
  return (
    <View
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
      }}
    >
      {/* Phase indicator */}
      <View
        style={{
          backgroundColor: getPhaseColor(),
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 8,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          {getPhaseText()}
        </Text>
      </View>

      {/* Progress circle */}
      <View
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
          position: "relative",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: 100,
            borderWidth: 6,
            borderColor: "transparent",
            borderTopColor: getPhaseColor(),
            transform: [{ rotate: `${progress * 360}deg` }],
          }}
        />
        <Text
          style={{
            color: "#fff",
            fontSize: 36,
            fontWeight: "700",
          }}
        >
          {formatTime(timeLeft)}
        </Text>
      </View>

      {/* Controls */}
      <View style={{ flexDirection: "row", gap: 20, marginBottom: 20 }}>
        <TouchableOpacity
          onPress={startPause}
          style={{
            backgroundColor: getPhaseColor(),
            borderRadius: 50,
            width: 60,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isRunning ? (
            <Pause size={24} color="#fff" />
          ) : (
            <Play size={24} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={reset}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: 50,
            width: 60,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RotateCcw size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <Text
        style={{
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: 16,
          textAlign: "center",
        }}
      >
        Completed Pomodoros: {completedPomodoros}
      </Text>
    </View>
  );
}
