import { usePallet } from "@/hooks/use-pallet";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import Svg, {
  Defs,
  Stop,
  Circle as SvgCircle,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import { Text } from "./text";
import { View } from "./view";

const AnimatedSvgCircle = Animated.createAnimatedComponent(SvgCircle);

const AnimatedProgressRing = ({
  percentage,
  size = 160,
  strokeWidth = 12,
  delay = 0,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(animatedValue, {
        toValue: percentage,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [percentage, delay]);

  const pallet = usePallet();

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        <Defs>
          <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={pallet.shade2} />
            <Stop offset="50%" stopColor={pallet.shade3} />
            <Stop offset="100%" stopColor={pallet.shade1} />
          </SvgLinearGradient>
        </Defs>
        {/* Background circle */}
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated progress circle */}
        <AnimatedSvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: [circumference, 0],
          })}
          strokeLinecap="round"
        />
      </Svg>
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
        <Text style={{ fontSize: 36, fontWeight: "bold", color: "#1f2937" }}>
          {percentage}%
        </Text>
        <Text style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
          Completed
        </Text>
      </View>
    </View>
  );
};

export default AnimatedProgressRing;
