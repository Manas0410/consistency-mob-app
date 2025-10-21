import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { HEIGHT, SHADOWS, SPACING } from "@/theme/globals";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useRouter } from "expo-router";
import React, { ReactNode } from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface HeaderProps {
  title: string;
  children?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const backClick = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/");
  }
};  
const BackHeader: React.FC<HeaderProps> = ({
  title,
  children,
  style,
  textStyle,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  return (
    <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: "#ddd" }, style]}>
      <TouchableOpacity onPress={backClick} style={styles.iconButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text variant="subtitle" style={[styles.title, { color: colors.text }, textStyle]}>
        {title}
      </Text>
      {children ? children : <View style={styles.iconButton} />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: HEIGHT.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    ...SHADOWS.sm,
  },
  iconButton: { 
    padding: SPACING.sm,
    borderRadius: 999,
  },
  title: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: SPACING.md,
  },
});

export default BackHeader;
