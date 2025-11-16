// WorkModesCard.tsx
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useSelectMode } from "@/contexts/select-mode-context";
import { usePallet } from "@/hooks/use-pallet";
import { useRouter } from "expo-router";
import { Apple, ArrowRight, Target, Timer } from "lucide-react-native";
import React from "react";
import { Pressable, View as RNView, StyleSheet } from "react-native";

const WorkModesCard = () => {
  const pallet = usePallet();
  const router = useRouter();

  const {
    hydrated,
    isModeTaskInProgress,
    selectedWorkMode,
    selectedModeTask,
    setSelectedWorkMode,
  } = useSelectMode();

  const ongoingLabel = (() => {
    if (!isModeTaskInProgress) return "No active session";
    const modeLabel =
      selectedWorkMode === "pomodoro" ? "Pomodoro" : "Focus Mode";
    const duration =
      selectedModeTask?.durationMinutes != null
        ? `${selectedModeTask.durationMinutes}m`
        : "";
    const taskName = selectedModeTask?.taskName
      ? ` • ${selectedModeTask.taskName}`
      : "";
    return `${modeLabel}${duration ? ` • ${duration}` : ""}${taskName}`;
  })();

  const goToOngoing = () => {
    if (!isModeTaskInProgress || !selectedWorkMode) return;
    router.push(`/calendar/mode/${selectedWorkMode}`);
  };

  const handleModePress = (mode: "pomodoro" | "focus") => {
    if (!hydrated) return;

    if (isModeTaskInProgress && selectedWorkMode) {
      // Always respect the ongoing mode – user must cancel there
      router.push(`/calendar/mode`);
      setSelectedWorkMode(mode);
      return;
    }

    // No ongoing mode – send user to that mode route
    router.push(`/calendar/mode`);
    setSelectedWorkMode(mode);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: "#fff",
          borderColor: pallet.shade3 + "33",
          shadowColor: pallet.shade3,
        },
      ]}
    >
      {/* Header */}
      <RNView style={styles.headerRow}>
        <RNView>
          <Text variant="subtitle" style={[styles.title]}>
            Work Modes
          </Text>
          {/* <Text
            variant="caption"
            style={[styles.sub, { color: pallet.shade2 }]}
          >
            Switch between Pomodoro & Focus for deep work.
          </Text> */}
        </RNView>

        <RNView
          style={[styles.iconBadge, { backgroundColor: pallet.buttonBg }]}
        >
          <Icon name={Timer} size={18} color={pallet.ButtonText} />
        </RNView>
      </RNView>

      {/* Ongoing state */}
      <RNView
        style={[
          styles.statusPill,
          {
            backgroundColor: isModeTaskInProgress
              ? pallet.buttonBg
              : pallet.buttonBg + "66",
          },
        ]}
      >
        <RNView style={{ flex: 1 }}>
          <Text
            variant="caption"
            style={{
              color: pallet.shade2,
              fontSize: 11,
              textTransform: "uppercase",
            }}
          >
            {isModeTaskInProgress ? "Session running" : "No active session"}
          </Text>
          <Text
            variant="caption"
            style={{ color: pallet.shade1, marginTop: 2 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {ongoingLabel}
          </Text>
        </RNView>

        {isModeTaskInProgress && (
          <Button
            size="sm"
            variant={isModeTaskInProgress ? "outline" : "ghost"}
            onPress={() => {
              if (isModeTaskInProgress && selectedWorkMode) {
                goToOngoing();
              } else {
                router.push("/calendar/mode"); // open calendar / mode selector
              }
            }}
            style={{ paddingHorizontal: 12 }}
          >
            {"Resume"}
          </Button>
        )}
      </RNView>

      {/* Mode quick actions */}
      <RNView style={styles.modesRow}>
        {/* Pomodoro */}
        <Pressable
          onPress={() => handleModePress("pomodoro")}
          style={({ pressed }) => [
            styles.modeTile,
            {
              borderColor: pallet.shade3 + "66",
              backgroundColor: "#F9FAFB",
            },
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
        >
          <RNView style={styles.modeHeader}>
            <RNView style={styles.modeIconWrap}>
              <Icon name={Apple} size={18} color={pallet.shade1} />
            </RNView>
            <Text
              variant="caption"
              style={[styles.modeTitle, { color: pallet.shade1 }]}
            >
              Pomodoro
            </Text>
          </RNView>
          <Text
            variant="caption"
            style={[styles.modeDesc, { color: pallet.shade2 }]}
            numberOfLines={3}
          >
            25m focus, 5m break cycles
          </Text>
          <RNView style={styles.modeArrow}>
            <ArrowRight size={14} color={pallet.shade2} />
          </RNView>
        </Pressable>

        {/* Focus Mode */}
        <Pressable
          onPress={() => handleModePress("focus")}
          style={({ pressed }) => [
            styles.modeTile,
            {
              borderColor: pallet.shade3 + "66",
              backgroundColor: "#F9FAFB",
            },
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
        >
          <RNView style={styles.modeHeader}>
            <RNView style={styles.modeIconWrap}>
              <Icon name={Target} size={18} color={pallet.shade1} />
            </RNView>
            <Text
              variant="caption"
              style={[styles.modeTitle, { color: pallet.shade1 }]}
            >
              Focus Mode
            </Text>
          </RNView>
          <Text
            variant="caption"
            style={[styles.modeDesc, { color: pallet.shade2 }]}
            numberOfLines={3}
          >
            Distraction-free sessions
          </Text>
          <RNView style={styles.modeArrow}>
            <ArrowRight size={14} color={pallet.shade2} />
          </RNView>
        </Pressable>
      </RNView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 20,
  },
  sub: {
    fontSize: 12,
    marginTop: 2,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 10,
  },
  modesRow: {
    flexDirection: "row",
    gap: 10,
  },
  modeTile: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
    minHeight: 100,
    position: "relative",
  },
  modeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modeIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  modeTitle: {
    fontWeight: "600",
    fontSize: 13,
    flex: 1,
  },
  modeDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  modeArrow: {
    position: "absolute",
    bottom: 10,
    right: 10,
    opacity: 0.5,
  },
});

export default WorkModesCard;
