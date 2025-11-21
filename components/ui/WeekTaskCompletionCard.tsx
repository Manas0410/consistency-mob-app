import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

interface WeekTaskCompletionCardProps {
  percentage?: number;
  change?: number; // e.g. +10 for +10%
  days?: string[];
}

const defaultDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const barData = [
  { value: 25, label: "Mon", frontColor: "#177AD5" },
  { value: 50, label: "Tue", frontColor: "#177AD5" },
  { value: 75, label: "Wed", frontColor: "#177AD5" },
  { value: 30, label: "Thu", frontColor: "#177AD5" },
  { value: 60, label: "Fri", frontColor: "#177AD5" },
  { value: 25, label: "Sat", frontColor: "#177AD5" },
  { value: 30, label: "Sun", frontColor: "#177AD5" },
];

export default function WeekTaskCompletionCard({
  percentage = 75,
  change = 10,
  days = defaultDays,
}: WeekTaskCompletionCardProps) {
  const theme = useTheme();
  const colors = Colors.light; // Always use light theme

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            Tasks Completed this week
          </Text>
          <Text style={[styles.percent, { color: colors.text }]}>
            {percentage}%
          </Text>
          <View style={styles.subRow}>
            <Text style={[styles.subText, { color: colors.icon }]}>
              This Week
            </Text>
            <Text style={styles.changeText}>+{change}%</Text>
          </View>
        </View>
        <BarChart
          isAnimated
          barWidth={16}
          noOfSections={4}
          barBorderRadius={4}
          yAxisLabelTexts={["0", "25", "50", "75", "100"]}
          frontColor="lightgray"
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 18,
    minWidth: 320,
    minHeight: 180,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  percent: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  subText: {
    fontSize: 16,
    marginRight: 8,
  },
  changeText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
