import { Dimensions } from "react-native";
import { ContributionGraph } from "react-native-chart-kit";

type StreakChartProps = {
  commitsData: { date: string; count: number }[];
};
const screenWidth = Dimensions.get("window").width;
const chartConfig = {
  backgroundGradientFrom: "transparent",
  backgroundGradientTo: "transparent",
  color: (opacity = 1, value = 0) => `rgba(69,203,133,${opacity})`,
  labelColor: (opacity = 1) => `rgba(217,4,43, ${opacity})`,
  strokeWidth: 1,
  barPercentage: 0.5,
};

const defaultTooltipDataAttrs = () => {
  return {};
};

const StreakChart = ({ commitsData }: StreakChartProps) => {
  return (
    <ContributionGraph
      values={commitsData}
      endDate={new Date("2025-09-20")}
      numDays={105}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
      tooltipDataAttrs={defaultTooltipDataAttrs}
      showMonthLabels={false}
    />
  );
};

export default StreakChart;
