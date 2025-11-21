import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { Dimensions, View } from "react-native";
import { ContributionGraph } from "react-native-chart-kit";

type StreakChartProps = {
  commitsData: { date: string; count: number }[];
};
const screenWidth = Dimensions.get("window").width;

const defaultTooltipDataAttrs = () => {
  return {};
};

const StreakChart = ({ commitsData }: StreakChartProps) => {
  const colors = Colors.light; // Always use light theme
  const pallet = usePallet();
  const backgroundCardColor = useColor({}, "background");

  const chartConfig = {
    backgroundGradientFrom: backgroundCardColor,
    backgroundGradientTo: backgroundCardColor,
    color: (opacity = 1) => {
      // Use palette shade1 with opacity
      const rgb = hexToRgb(pallet.shade1);
      return `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`;
    },
    labelColor: (opacity = 1) => {
      const textColor = colors.textMuted;
      const rgb = hexToRgb(textColor);
      return `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`;
    },
    strokeWidth: 1,
    barPercentage: 0.5,
  };

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 69, g: 203, b: 133 };
  };

  return (
    <View style={{ backgroundColor: backgroundCardColor }}>
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
    </View>
  );
};

export default StreakChart;
