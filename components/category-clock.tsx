import { Text } from "@/components/ui/text";
import { useGetCurrentDateTime } from "@/hooks/use-get-current-date-time";
import { usePallet } from "@/hooks/use-pallet";
import { getCategorywiseTasks } from "@/pages/task-viewer/API/getTasks";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

// Fallback demo data (used only if API empty/fails)
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

const categoryColors: Record<string, string> = {
  Meeting: "rgba(78, 205, 196, 0.7)",
  Working: "rgba(231, 76, 60, 0.7)",
  Building: "rgba(247, 220, 111, 0.7)",
  Focus: "rgba(155, 89, 182, 0.7)",
  Creative: "rgba(52, 152, 219, 0.7)",
};

const norm24 = (h: number) => ((h % 24) + 24) % 24;

/** Whole-hour bins overlapped by [start, end) — supports fractions + midnight wrap */
const hoursCoveredByInterval = (start: number, end: number) => {
  const covered = new Set<number>();
  if (!isFinite(start) || !isFinite(end) || start === end) return covered;

  const ranges: Array<[number, number]> =
    end > start
      ? [[start, end]]
      : [
          [start, 24],
          [0, end],
        ];
  for (const [s, e] of ranges) {
    const from = Math.floor(s);
    const to = Math.ceil(e);
    for (let h = from; h < to; h++) covered.add(norm24(h));
  }
  return covered;
};

export default function CategoryClock() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<any[]>([]);
  const pallet = usePallet();
  const isDark =
    (pallet && ("mode" in pallet ? (pallet as any).mode === "dark" : false)) ||
    (pallet as any)?.isDark === true;

  const ACCENT = (pallet as any)?.primary ?? "#2E86FF";
  const MUTED_TEXT = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";
  const RING_BG = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(100, 116, 139, 0.08)";

  const fetchCategorywise = async () => {
    try {
      const res = await getCategorywiseTasks(new Date());
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setData(res.data);
      } else {
        setData(sampleData);
      }
    } catch {
      setData(sampleData);
    }
  };

  useEffect(() => {
    fetchCategorywise();
  }, []);

  const chartSize = screenWidth * 0.85;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const outerRadius = chartSize * 0.42; // slightly larger for breathing room
  const innerRadius = chartSize * 0.27;

  // ---- geometry helpers (with small gaps between arcs) ----
  const GAP_DEG = 2; // visual gap between segments (degrees)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const createArcPath = (
    startHour: number,
    endHour: number,
    innerR: number,
    outerR: number
  ) => {
    const startDeg = (norm24(startHour) / 24) * 360 - 90 + GAP_DEG / 2;
    const endDeg = (norm24(endHour) / 24) * 360 - 90 - GAP_DEG / 2;

    // If the arc is tiny (gap would invert), just draw without gap
    const startAngle = toRad(startDeg);
    const endAngle = toRad(endDeg);
    const a1 = startAngle;
    const a2 = endAngle < a1 ? endAngle + Math.PI * 2 : endAngle;

    const x1 = centerX + innerR * Math.cos(a1);
    const y1 = centerY + innerR * Math.sin(a1);
    const x2 = centerX + outerR * Math.cos(a1);
    const y2 = centerY + outerR * Math.sin(a1);

    const x3 = centerX + outerR * Math.cos(a2);
    const y3 = centerY + outerR * Math.sin(a2);
    const x4 = centerX + innerR * Math.cos(a2);
    const y4 = centerY + innerR * Math.sin(a2);

    const sweep = a2 - a1;
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

  const getLabelPosition = (startHour: number, endHour: number) => {
    let span = endHour - startHour;
    if (span < 0) span += 24;
    const midHour = norm24(startHour + span / 2);
    const angle = ((midHour / 24) * 360 - 90) * (Math.PI / 180);
    const labelRadius = outerRadius * 0.78;
    return {
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle),
    };
  };

  // ---- memo: compute empty slots, totals, per-category ----
  const {
    emptySlots,
    totalHours,
    remainingMinutes,
    categorySummary,
    normalizedData,
  } = useMemo(() => {
    const normalizedData =
      (data ?? []).map((item) => {
        const s = Number((item as any).startTime);
        const e = Number((item as any).endTime);
        const name = (item as any).categoryName ?? "Other";
        const color =
          (item as any).color ??
          categoryColors[name] ??
          "rgba(82, 80, 80, 0.7)";
        return { startTime: s, endTime: e, categoryName: name, color };
      }) ?? [];

    const occupied = new Set<number>();
    normalizedData.forEach((it) => {
      hoursCoveredByInterval(it.startTime, it.endTime).forEach((h) =>
        occupied.add(h)
      );
    });

    const emptySlots: Array<{
      startTime: number;
      endTime: number;
      isEmpty: boolean;
    }> = [];
    for (let hour = 0; hour < 24; hour++) {
      if (!occupied.has(hour)) {
        emptySlots.push({
          startTime: hour,
          endTime: (hour + 1) % 24,
          isEmpty: true,
        });
      }
    }

    let totalMinutesAll = 0;
    const categorySummary: Record<
      string,
      { hours: number; minutes: number; totalMinutes: number }
    > = {};

    normalizedData.forEach((it) => {
      const s = it.startTime;
      const e = it.endTime;
      if (!isFinite(s) || !isFinite(e) || s === e) return;
      let duration = e - s;
      if (duration < 0) duration += 24;
      const mins = Math.max(0, Math.round(duration * 60));
      totalMinutesAll += mins;

      if (!categorySummary[it.categoryName]) {
        categorySummary[it.categoryName] = {
          hours: 0,
          minutes: 0,
          totalMinutes: 0,
        };
      }
      categorySummary[it.categoryName].totalMinutes += mins;
    });

    Object.keys(categorySummary).forEach((cat) => {
      const mins = categorySummary[cat].totalMinutes;
      categorySummary[cat].hours = Math.floor(mins / 60);
      categorySummary[cat].minutes = mins % 60;
    });

    const totalHours = Math.floor(totalMinutesAll / 60);
    const remainingMinutes = totalMinutesAll % 60;

    return {
      emptySlots,
      totalHours,
      remainingMinutes,
      categorySummary,
      normalizedData,
    };
  }, [data]);

  // ---- now indicator ----
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60; // 0–24
  const nowAngle = ((currentHour / 24) * 360 - 90) * (Math.PI / 180);
  const handStartR = innerRadius - 6;
  const handEndR = outerRadius + 30;
  const nowX1 = centerX + handStartR * Math.cos(nowAngle);
  const nowY1 = centerY + handStartR * Math.sin(nowAngle);
  const nowX2 = centerX + handEndR * Math.cos(nowAngle);
  const nowY2 = centerY + handEndR * Math.sin(nowAngle);

  const { date, day, month } = useGetCurrentDateTime();

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
      <Text
        variant="heading"
        style={{
          marginBottom: 6,
          textAlign: "center",
          letterSpacing: 0.3,
        }}
      >
        Track Productivity
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 12,
          color: MUTED_TEXT,
        }}
      >
        {day} {date} {month}
      </Text>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 32,
        }}
      >
        {/* Chart Container */}
        <View style={{ position: "relative" }}>
          <Svg width={chartSize} height={chartSize}>
            <Defs>
              {/* Softer ring gradient */}
              {/* <RadialGradient id="ringSoft" cx="50%" cy="50%" r="60%">
                <Stop
                  offset="0%"
                  // stopColor={
                  //   isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)"
                  // }
                />
                <Stop offset="100%" stopColor="transparent" />
              </RadialGradient> */}
              {/* Hand gradient for a nice fade */}
              <LinearGradient id="handGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={ACCENT} />
                <Stop offset="100%" stopColor={ACCENT} stopOpacity="0.2" />
              </LinearGradient>
            </Defs>

            {/* Base ring */}
            {/* <Circle
              cx={centerX}
              cy={centerY}
              r={(outerRadius + innerRadius) / 2}
              // stroke={
              //   isDark ? "rgba(255,255,255,0.08)" : "rgba(15, 23, 42, 0.06)"
              // }
              strokeWidth={outerRadius - innerRadius}
              // fill="url(#ringSoft)"
            /> */}

            {/* Empty hour slots (thin, subtle) */}
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
                  fill={RING_BG}
                  stroke={
                    isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
                  }
                  strokeWidth="1"
                />
              );
            })}

            {/* Minor hour ticks */}
            {Array.from({ length: 24 }, (_, hour) => {
              const angle = ((hour / 24) * 360 - 90) * (Math.PI / 180);
              const tickStart = outerRadius + 4;
              const tickEnd = outerRadius + 10;
              const x1 = centerX + tickStart * Math.cos(angle);
              const y1 = centerY + tickStart * Math.sin(angle);
              const x2 = centerX + tickEnd * Math.cos(angle);
              const y2 = centerY + tickEnd * Math.sin(angle);

              return (
                <Path
                  key={`tick-${hour}`}
                  d={`M ${x1} ${y1} L ${x2} ${y2}`}
                  stroke={
                    isDark ? "rgba(255, 255, 255, 0.18)" : "rgba(0, 0, 0, 0.14)"
                  }
                  strokeWidth="1"
                />
              );
            })}

            {/* Major hour markers */}
            {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => {
              const angle = ((hour / 24) * 360 - 90) * (Math.PI / 180);
              const tickStart = outerRadius + 8;
              const tickEnd = outerRadius + 26;

              const x1 = centerX + tickStart * Math.cos(angle);
              const y1 = centerY + tickStart * Math.sin(angle);
              const x2 = centerX + tickEnd * Math.cos(angle);
              const y2 = centerY + tickEnd * Math.sin(angle);

              const textX = centerX + (tickEnd + 16) * Math.cos(angle);
              const textY = centerY + (tickEnd + 16) * Math.sin(angle);

              return (
                <G key={`major-${hour}`}>
                  <Path
                    d={`M ${x1} ${y1} L ${x2} ${y2}`}
                    stroke={
                      isDark
                        ? "rgba(255, 255, 255, 0.35)"
                        : "rgba(0, 0, 0, 0.45)"
                    }
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <SvgText
                    x={textX}
                    y={textY}
                    fill={
                      isDark
                        ? "rgba(255, 255, 255, 0.5)"
                        : "rgba(0, 0, 0, 0.55)"
                    }
                    fontSize="12"
                    fontWeight="500"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {hour.toString().padStart(2, "0")}
                  </SvgText>
                </G>
              );
            })}

            {/* Category segments (with tiny shadow using expanded path) */}
            {normalizedData.map((item, index) => {
              const s = Number(item.startTime);
              const e = Number(item.endTime);
              if (!isFinite(s) || !isFinite(e) || s === e) return null;

              const shadowPath = createArcPath(
                s,
                e,
                innerRadius - 1.5,
                outerRadius + 1.5
              );
              const arcPath = createArcPath(s, e, innerRadius, outerRadius);
              const labelPos = getLabelPosition(s, e);

              return (
                <G key={`seg-${index}`}>
                  {/* subtle drop “shadow” */}
                  <Path
                    d={shadowPath}
                    fill={isDark ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.10)"}
                  />
                  <Path d={arcPath} fill={item.color} />
                  <SvgText
                    x={labelPos.x}
                    y={labelPos.y - 4}
                    fill={
                      isDark
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(15, 23, 42, 0.9)"
                    }
                    fontSize="13"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {item.categoryName}
                  </SvgText>
                  {/* start time (small) */}
                  <SvgText
                    x={labelPos.x}
                    y={labelPos.y + 10}
                    fill={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)"}
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {String(s).padStart(2, "0")}
                  </SvgText>
                </G>
              );
            })}

            {/* NOW hand */}
            <Path
              d={`M ${nowX1} ${nowY1} L ${nowX2} ${nowY2}`}
              stroke="url(#handGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* NOW tip dot */}
            <Circle cx={nowX2} cy={nowY2} r={4.5} fill={ACCENT} />
          </Svg>

          {/* Center summary card */}
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
                fontWeight: "500",
                color: MUTED_TEXT,
                marginBottom: 2,
              }}
            >
              Scheduled
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: ACCENT,
                letterSpacing: 0.3,
              }}
            >
              {totalHours}h {remainingMinutes}m
            </Text>
          </View>
        </View>
      </View>

      {/* Legend chips */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
          paddingHorizontal: 6,
        }}
      >
        {Object.entries(categorySummary).map(([category, val]) => {
          const v = val as {
            hours: number;
            minutes: number;
            totalMinutes: number;
          };
          const colorBase = categoryColors[category] ?? "rgba(82, 80, 80, 0.7)";
          const solidColor = colorBase.replace("0.7", "1");
          return (
            <View
              key={category}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 999,
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(15,23,42,0.04)",
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: solidColor,
                  marginRight: 8,
                }}
              />
              <Text style={{ fontSize: 14, fontWeight: "600", marginRight: 6 }}>
                {v.hours}h {String(v.minutes).padStart(2, "0")}m
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  letterSpacing: 0.6,
                  color: MUTED_TEXT,
                }}
              >
                {category.toUpperCase()}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
