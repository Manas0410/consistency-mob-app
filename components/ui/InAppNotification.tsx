import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePallet } from "@/hooks/use-pallet";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "./text";

interface InAppNotificationProps {
  visible: boolean;
  title: string;
  body: string;
  emoji?: string;
  onPress?: () => void;
  onDismiss?: () => void;
  duration?: number; // Auto-dismiss after duration (ms)
}

const InAppNotification: React.FC<InAppNotificationProps> = ({
  visible,
  title,
  body,
  emoji = "🧘‍♀️",
  onPress,
  onDismiss,
  duration = 4000,
}) => {
  const insets = useSafeAreaInsets();
  const pallet = usePallet();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Defensive fallback for pallet
  const safeIconColor = pallet?.shade1 || "#177AD5";
  const safeShadowColor = pallet?.shade1 || "#177AD5";

  const translateY = useSharedValue(-200);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    if (visible) {
      // Animate in
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });

      // Auto-dismiss after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      // Animate out
      translateY.value = withTiming(-200, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.9, { duration: 300 });
    }
  }, [visible, duration]);

  const handleDismiss = () => {
    translateY.value = withTiming(-200, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(onDismiss || (() => {}))();
    });
  };

  const handlePress = () => {
    if (onPress) {
      // Small tap animation
      scale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 10,
          backgroundColor: colors.background,
          shadowColor: colorScheme === "dark" ? "#000" : safeShadowColor,
        },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {/* Icon */}
        <View
          style={[styles.iconContainer, { backgroundColor: safeIconColor }]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={[styles.body, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {body}
          </Text>
        </View>

        {/* Dismiss Button */}
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={handleDismiss}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: Platform.OS === "ios" ? 16 : 15,
    fontWeight: "600",
    marginBottom: 2,
    lineHeight: 20,
  },
  body: {
    fontSize: Platform.OS === "ios" ? 14 : 13,
    fontWeight: "400",
    lineHeight: 18,
  },
  dismissButton: {
    padding: 4,
  },
});

export default InAppNotification;
