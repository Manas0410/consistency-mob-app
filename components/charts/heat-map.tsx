import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

const dummyHeatmapData = [
  { 1: true },
  { 2: false },
  { 3: true },
  { 4: true },
  { 5: false },
  { 6: true },
  { 7: true },
  { 8: false },
  { 9: true },
  { 10: true },
  { 11: false },
  { 12: true },
  { 13: true },
  { 14: true },
  { 15: false },
  { 16: true },
  { 17: true },
  { 18: false },
  { 19: true },
  { 20: true },
  { 21: false },
  { 22: true },
  { 23: true },
  { 24: true },
  { 25: false },
  { 26: true },
  { 27: true },
  { 28: true },
  { 29: true },
  { 30: false },
];

const Heatmap = ({ data = dummyHeatmapData }) => {
  // data example: [{1: true}, {2: false}, {3: true}, ...]

  const today = new Date().getDate();

  // Map data to array for easier indexing and rendering
  // e.g. index 0 is day 1, index 29 is day 30
  const mappedData = Array(30).fill(false);

  data.forEach((item) => {
    const day = Number(Object.keys(item)[0]);
    if (day >= 1 && day <= 30) {
      mappedData[day - 1] = item[day];
    }
  });

  const renderItem = ({ item, index }) => {
    // Determine style based on true/false & highlight today's block
    const isToday = index + 1 === today;
    const isCompleted = item === true;

    const backgroundColor = isCompleted ? "#1dda66ff" : "#ced2dbff"; // dark green or light gray
    const borderColor = isToday ? "#3B82F6" : "transparent"; // blue border if today

    const blockStyle = [
      styles.block,
      { backgroundColor, borderColor },
      isToday && styles.todayBlock,
    ];

    return <View style={blockStyle} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mappedData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        numColumns={10}
        scrollEnabled={false}
        contentContainerStyle={styles.listContainer}
      />
      {/* <Text style={styles.legendTitle}>Legend</Text> */}
      {/* <View style={styles.legendContainer}>
        <View style={[styles.legendBlock, { backgroundColor: "#166534" }]} />
        <Text style={styles.legendText}>Completed</Text>
        <View style={[styles.legendBlock, { backgroundColor: "#D1D5DB" }]} />
        <Text style={styles.legendText}>Not Completed</Text>
        <View
          style={[
            styles.legendBlock,
            {
              backgroundColor: "#3B82F6",
              borderWidth: 2,
              borderColor: "#2563EB",
            },
          ]}
        />
        <Text style={styles.legendText}>Today</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  listContainer: {
    justifyContent: "center",
  },
  block: {
    width: 15,
    height: 15,
    margin: 2,
    borderRadius: 2,
  },
  todayBlock: {
    // Slightly larger with shadow
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  legendTitle: {
    marginTop: 16,
    color: "#9CA3AF",
    fontWeight: "600",
    fontSize: 14,
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },
  legendBlock: {
    width: 20,
    height: 20,
    borderRadius: 5,
  },
  legendText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginRight: 16,
  },
});

export default Heatmap;
