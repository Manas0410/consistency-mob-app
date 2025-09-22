import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useTheme } from "@/hooks/use-theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const paletteColors = ["#2196F3", "#4CAF50", "#E5734A", "#7B3FF2"];

export default function SettingsScreen() {
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;
  const pallet = usePallet();

  const [selectedTheme, setSelectedTheme] = useState("light");
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container]}>
          <View style={styles.headerRow}>
            <TouchableOpacity>
              <Ionicons name="arrow-back" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Settings
            </Text>
          </View>
          <View style={styles.profileRow}>
            {/* <Image
          source={require("@/assets/images/profile.png")}
          style={styles.profileImg}
        /> */}
            <Ionicons name="person-circle" size={64} color={colors.text} />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                Sophia Carter
              </Text>
              <Text style={[styles.profileEmail, { color: colors.icon }]}>
                sophia.carter@email.com
              </Text>
            </View>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Subscription
          </Text>
          <View
            style={[styles.subscriptionBox, { backgroundColor: pallet.shade4 }]}
          >
            <View>
              <Text style={[styles.subscriptionName, { color: colors.text }]}>
                Sylvie Basic
              </Text>
              <Text style={[styles.subscriptionType, { color: colors.icon }]}>
                Free
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.upgradeBtn, { backgroundColor: pallet.shade2 }]}
            >
              <Text style={styles.upgradeText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Theme
          </Text>
          <View style={styles.themeRow}>
            {[
              { label: "Light", icon: "sunny", value: "light" },
              { label: "Dark", icon: "moon", value: "dark" },
              {
                label: "System",
                icon: "contrast",
                value: "systemPreference",
              },
            ].map((item, idx) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.themeBtn,
                  selectedTheme === item.value && {
                    borderColor: pallet.shade1,
                  },
                ]}
                onPress={() => setSelectedTheme(item.value)}
              >
                {/* @ts-ignore */}
                <Ionicons name={item.icon} size={24} color={colors.text} />
                <Text style={[styles.themeLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Color Palette
          </Text>
          <View style={styles.paletteRow}>
            {paletteColors.map((color, idx) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.paletteCircle,
                  {
                    borderColor:
                      idx === selectedPalette ? pallet.shade1 : "#fff",
                    backgroundColor: color,
                  },
                ]}
                onPress={() => setSelectedPalette(idx)}
              />
            ))}
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Reminders
          </Text>
          <View style={styles.reminderRow}>
            <Text style={[styles.reminderLabel, { color: colors.text }]}>
              Enable Reminders
            </Text>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: "#ccc", true: pallet.shade2 }}
              thumbColor={remindersEnabled ? pallet.shade2 : "#f4f3f4"}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 16,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  profileImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    backgroundColor: "#eee",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 15,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 8,
  },
  subscriptionBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subscriptionType: {
    fontSize: 14,
    marginTop: 2,
  },
  upgradeBtn: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  upgradeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  themeBtn: {
    flex: 1,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#eee",
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 4,
    backgroundColor: "#fff",
  },
  themeLabel: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "500",
  },
  paletteRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 8,
  },
  paletteCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginHorizontal: 8,
    borderWidth: 3,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  reminderLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});
