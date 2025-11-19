// ConnectGoogleCalendarButton.tsx
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

/**
 * Props
 * - onPress: callback when user taps the button
 * - loading: show spinner
 * - connected: show connected state (checkmark)
 * - style / textStyle: optional overrides
 * - logo: optional custom logo (defaults to local gcal.png)
 */
export interface ConnectGCalButtonProps {
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  logo?: ImageSourcePropType;
}

export default function ConnectGoogleCalendarButton({
  style,
  textStyle,
  logo,
}: ConnectGCalButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const [connected, setConnected] = React.useState(false);
  // default logo asset - update path if your alias differs
  const logoSource = logo ?? require("@/assets/images/gcal.png");

  const handlePress = async () => {
    if (loading || connected) return;
    try {
      //   await onPress?.();
    } catch (err) {
      // swallow - parent handles errors
      console.warn("Connect GCal onPress error:", err);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && !connected && { opacity: 0.92 },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={
        connected ? "Google Calendar connected" : "Connect Google Calendar"
      }
    >
      {/* Gradient background for modern look */}
      <LinearGradient
        colors={connected ? ["#10B981", "#059669"] : ["#FFFFFF", "#FFFFFF"]}
        start={[0, 0]}
        end={[1, 1]}
        style={[styles.gradient, connected ? styles.connectedGradient : null]}
      >
        <View style={styles.content}>
          <View style={styles.left}>
            <View
              style={[styles.logoWrap, connected && styles.logoWrapConnected]}
            >
              <Image
                source={logoSource}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.textWrap}>
              <Text style={[styles.title, textStyle]}>
                {connected
                  ? "Google Calendar connected"
                  : "Connect Google Calendar"}
              </Text>
              <Text style={styles.subtitle}>
                {connected
                  ? "Sync enabled"
                  : "Sync events, reminders & schedule"}
              </Text>
            </View>
          </View>

          <View style={styles.right}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={connected ? "#fff" : "#2563EB"}
              />
            ) : connected ? (
              <View style={styles.pillConnected}>
                <Text style={styles.pillText}>✓</Text>
              </View>
            ) : (
              <View style={styles.arrowWrap}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    // subtle shadow (iOS) and elevation (Android)
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  connectedGradient: {
    // darker gradient when connected
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // gentle border
    borderWidth: 1,
    borderColor: "#EFF6FF",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  logoWrapConnected: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.18)",
  },
  logo: {
    width: 28,
    height: 28,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A", // dark text by default
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  right: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowWrap: {
    width: 40,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 18,
    color: "#2563EB",
    fontWeight: "700",
  },
  pillConnected: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    color: "#fff",
    fontWeight: "800",
  },
});
