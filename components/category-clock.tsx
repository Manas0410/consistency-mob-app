import { Text } from "@/components/ui/text";
import { useGetCurrentDateTime } from "@/hooks/use-get-current-date-time";
import { usePallet } from "@/hooks/use-pallet";
import { getCategorywiseTasks } from "@/pages/task-viewer/API/getTasks";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  G,
  Path,
  RadialGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

// Sample data - replace with your dynamic JSON data
const sampleData = [
  {
    startTime: 21,
    endTime: 24,
    categoryName: "Meeting",
    color: "rgba(78, 205, 196, 0.7)",
  },
  {
    startTime: 0,
    endTime: 3.5,
    categoryName: "Meeting",
    color: "rgba(78, 205, 196, 0.7)",
  },
  {
    startTime: 9,
    endTime: 12,
    categoryName: "Building",
    color: "rgba(247, 220, 111, 0.7)",
  },
  {
    startTime: 15,
    endTime: 18,
    categoryName: "Working",
    color: "rgba(231, 76, 60, 0.7)",
  },
];

const categoryColors = {
  Meeting: "rgba(78, 205, 196, 0.7)",
  Working: "rgba(231, 76, 60, 0.7)",
  Building: "rgba(247, 220, 111, 0.7)",
  Focus: "rgba(155, 89, 182, 0.7)",
  Creative: "rgba(52, 152, 219, 0.7)",
};

function rangeMod24(start, end) {
  // Returns array of hours from start (inclusive) to end (exclusive), wrapping across midnight
  const result = [];
  let hour = start;
  let count = 0;
  while (hour !== end && count < 24) {
    result.push(hour);
    hour = (hour + 1) % 24;
    count++;
  }
  return result;
}

let isDark = false;

export default function CategoryClock() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState([]);

  const fetchCategorywise = async () => {
    try {
      const res = await getCategorywiseTasks(new Date());
      if (res.success) {
        setData(res.data);
      }
    } catch (er) {
      console.log(er);
    }
  };

  useEffect(() => {
    fetchCategorywise();
  }, []);

  const chartSize = screenWidth * 0.85;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const outerRadius = chartSize * 0.4;
  const innerRadius = chartSize * 0.25;

  // Memoize slot calculations for perf
  const { emptySlots, totalHours, totalMinutes, categorySummary } =
    useMemo(() => {
      const occupiedSlots = new Set();
      data.forEach((item) => {
        rangeMod24(item.startTime, item.endTime).forEach((h) =>
          occupiedSlots.add(h)
        );
      });

      const emptySlots = [];
      for (let hour = 0; hour < 24; hour++) {
        if (!occupiedSlots.has(hour)) {
          emptySlots.push({
            startTime: hour,
            endTime: (hour + 1) % 24,
            isEmpty: true,
          });
        }
      }

      let totalMinutes = 0;
      const categorySummary = {};

      data.forEach((item) => {
        let duration = item.endTime - item.startTime;
        if (duration < 0) duration += 24;

        // Convert fractional hours to minutes
        const minutes = Math.round(duration * 60);
        totalMinutes += minutes;

        if (!categorySummary[item.categoryName])
          categorySummary[item.categoryName] = 0;
        categorySummary[item.categoryName] += minutes;
      });

      const totalHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;

      // Convert category summary to hours+minutes format if needed
      Object.keys(categorySummary).forEach((cat) => {
        const mins = categorySummary[cat];
        categorySummary[cat] = {
          hours: Math.floor(mins / 60),
          minutes: mins % 60,
          totalMinutes: mins,
        };
      });

      return {
        emptySlots,
        totalHours,
        totalMinutes: remainingMinutes,
        categorySummary,
      };
    }, [data]);

  // Create SVG arc path for segment
  const createArcPath = (startHour, endHour, innerR, outerR) => {
    const startAngle = ((startHour / 24) * 360 - 90) * (Math.PI / 180);
    const endAngle = ((endHour / 24) * 360 - 90) * (Math.PI / 180);

    const x1 = centerX + innerR * Math.cos(startAngle);
    const y1 = centerY + innerR * Math.sin(startAngle);
    const x2 = centerX + outerR * Math.cos(startAngle);
    const y2 = centerY + outerR * Math.sin(startAngle);

    const x3 = centerX + outerR * Math.cos(endAngle);
    const y3 = centerY + outerR * Math.sin(endAngle);
    const x4 = centerX + innerR * Math.cos(endAngle);
    const y4 = centerY + innerR * Math.sin(endAngle);

    let sweep = endAngle - startAngle;
    if (sweep < 0) sweep += Math.PI * 2;
    const largeArcFlag = sweep > Math.PI ? "1" : "0";

    return [
      "M",
      x1,
      y1,
      "L",
      x2,
      y2,
      "A",
      outerR,
      outerR,
      0,
      largeArcFlag,
      1,
      x3,
      y3,
      "L",
      x4,
      y4,
      "A",
      innerR,
      innerR,
      0,
      largeArcFlag,
      0,
      x1,
      y1,
      "Z",
    ].join(" ");
  };

  // Get label position for each segment
  const getLabelPosition = (startHour, endHour) => {
    let span = endHour - startHour;
    if (span < 0) span += 24;
    const midHour = (startHour + span / 2) % 24;
    const angle = ((midHour / 24) * 360 - 90) * (Math.PI / 180);
    const labelRadius = outerRadius * 0.75;

    return {
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle),
    };
  };

  // Get current day
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  const { date, day, month } = useGetCurrentDateTime();
  const pallet = usePallet();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "transparent",
        paddingTop: 12,
        paddingBottom: 12,
        paddingHorizontal: 20,
      }}
    >
      <Text variant="heading" style={{ marginBottom: 12, textAlign: "center" }}>
        Track Productivity
      </Text>

      <View
        style={{
          // flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 40,
        }}
      >
        {/* Chart Container */}
        <View style={{ position: "relative" }}>
          <Svg width={chartSize} height={chartSize}>
            <Defs>
              <RadialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                <Stop offset="100%" stopColor="transparent" />
              </RadialGradient>
            </Defs>

            {/* Background circle for empty time slots */}
            <Circle
              cx={centerX}
              cy={centerY}
              r={(outerRadius + innerRadius) / 2}
              stroke="rgba(100, 116, 139, 0.1)"
              strokeWidth={outerRadius - innerRadius}
              fill="transparent"
            />

            {/* Empty time slots */}
            {emptySlots.map((slot, index) => {
              const arcPath = createArcPath(
                slot.startTime,
                slot.endTime,
                innerRadius,
                outerRadius
              );
              return (
                <Path
                  key={`empty-${index}`}
                  d={arcPath}
                  fill="rgba(100, 116, 139, 0.08)"
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Hour ticks */}
            {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
              const angle = ((hour / 24) * 360 - 90) * (Math.PI / 180);
              const tickStart = outerRadius + 5;
              const tickEnd = outerRadius + 12;

              const x1 = centerX + tickStart * Math.cos(angle);
              const y1 = centerY + tickStart * Math.sin(angle);
              const x2 = centerX + tickEnd * Math.cos(angle);
              const y2 = centerY + tickEnd * Math.sin(angle);

              return (
                <Path
                  key={`tick-${hour}`}
                  d={`M ${x1} ${y1} L ${x2} ${y2}`}
                  stroke={
                    isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"
                  }
                  strokeWidth="1"
                />
              );
            })}

            {/* Major hour markers */}
            {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => {
              const angle = ((hour / 24) * 360 - 90) * (Math.PI / 180);
              const tickStart = outerRadius + 8;
              const tickEnd = outerRadius + 25;

              const x1 = centerX + tickStart * Math.cos(angle);
              const y1 = centerY + tickStart * Math.sin(angle);
              const x2 = centerX + tickEnd * Math.cos(angle);
              const y2 = centerY + tickEnd * Math.sin(angle);

              const textX = centerX + (tickEnd + 15) * Math.cos(angle);
              const textY = centerY + (tickEnd + 15) * Math.sin(angle);

              return (
                <G key={hour}>
                  <Path
                    d={`M ${x1} ${y1} L ${x2} ${y2}`}
                    stroke={
                      isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.6)"
                    }
                    strokeWidth="4"
                  />
                  <SvgText
                    x={textX}
                    y={textY}
                    fill={
                      isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.6)"
                    }
                    fontSize="13"
                    fontWeight="400"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {hour.toString().padStart(2, "0")}
                  </SvgText>
                </G>
              );
            })}

            {/* Category segments */}
            {data.map((item, index) => {
              const arcPath = createArcPath(
                item.startTime,
                item.endTime,
                innerRadius,
                outerRadius
              );
              const labelPos = getLabelPosition(item.startTime, item.endTime);

              return (
                <G key={index}>
                  <Path
                    d={arcPath}
                    fill={item.color}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="1"
                  />
                  <SvgText
                    x={labelPos.x}
                    y={labelPos.y - 6}
                    fill="rgba(0, 0, 0, 0.9)"
                    fontSize="13"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    {item.categoryName}
                  </SvgText>
                  <SvgText
                    x={labelPos.x}
                    y={labelPos.y + 8}
                    fill="rgba(255, 255, 255, 0.6)"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {item.startTime.toString().padStart(2, "0")}
                  </SvgText>
                </G>
              );
            })}
          </Svg>

          {/* Overlay Center Content */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "400",
                color: pallet.shade2,
              }}
            >
              {totalHours}h {totalMinutes}m scheduled
            </Text>
            {/* Category summary */}
          </View>
        </View>
      </View>

      {/* labels section */}
      <View style={{ alignItems: "center" }}>
        {Object.entries(categorySummary).map(([category, hours]) => (
          <View
            key={category}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 3,
              gap: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
              }}
            >
              {Math.floor(hours)}h{" "}
              {String(Math.round((hours % 1) * 60)).padStart(2, "0")}m
            </Text>
            <Text
              style={{
                color: categoryColors[category]
                  ? categoryColors[category].replace("0.7", "1")
                  : "rgba(82, 80, 80, 0.9)",
                fontSize: 16,
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginRight: 8,
              }}
            >
              {category}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
