import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface WeekTaskCompletionCardProps {
  percentage?: number;
  change?: number; // e.g. +10 for +10%
  days?: string[];
}

const chartData = [
  { value: 0 },
  { value: 10 },
  { value: 8 },
  { value: 58 },
  { value: 56 },
  { value: 78 },
  { value: 74 },
  { value: 98 },
];
const xLabels = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const yLabels = ["0", "20", "40", "60", "80", "100"];

export default function HabbitCompletionCard({
  percentage = 75,
  change = 10,
}: WeekTaskCompletionCardProps) {
  const theme = useTheme();
  const colors = Colors.light; // Always use light theme

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            Habbit Consistency this week
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
        <LineChart
          isAnimated
          areaChart
          curved
          data={chartData}
          height={250}
          showVerticalLines
          spacing={40}
          initialSpacing={0}
          color1="skyblue"
          color2="orange"
          textColor1="green"
          hideDataPoints
          dataPointsColor1="blue"
          startFillColor1="skyblue"
          startOpacity={0.8}
          endOpacity={0.3}
          xAxisLabelTexts={xLabels}
          yAxisLabelTexts={yLabels}
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
