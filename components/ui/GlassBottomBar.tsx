import { usePallet } from "@/hooks/use-pallet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const tabs = [
  { name: "home", icon: "home" },
  { name: "tasks", icon: "calendar" },
  { name: "settings", icon: "cog" },
];

export default function GlassBottomBar() {
  const router = useRouter();
  const pallet = usePallet();

  return (
    <View style={styles.container}>
      <BlurView intensity={50} tint="default" style={styles.glassBg}>
        <View style={styles.tabRow}>
          {tabs.map((tab, idx) => (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabBtn}
              activeOpacity={0.7}
              onPress={() => router.replace("/")}
            >
              {/* @ts-ignore */}
              <Ionicons name={tab.icon} size={28} color={pallet.shade2} />
              <Text style={[styles.tabLabel, { color: pallet.shade2 }]}>
                {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.addCircleWrap}>
          <TouchableOpacity
            style={[
              styles.addCircle,
              {
                borderColor: pallet.shade2,
                backgroundColor: "rgba(80,40,40,0.7)",
              },
            ]}
            activeOpacity={0.8}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="add" size={38} color={pallet.shade2} />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
    padding: 50,
    backgroundColor: "black",
  },
  glassBg: {
    width: 320,
    height: 70,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 3,
  },
  tabRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 32,
  },
  tabBtn: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
    fontFamily: "monospace",
  },
  addCircleWrap: {
    position: "absolute",
    right: -32,
    top: -32,
    zIndex: 101,
  },
  addCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
});
