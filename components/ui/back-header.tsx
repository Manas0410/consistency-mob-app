import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { ReactNode, useCallback } from "react";
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

const BackHeader: React.FC<HeaderProps> = ({
  title,
  children,
  style,
  textStyle,
}) => {
  const router = useRouter();
  const goBack = useCallback(() => {
    if(router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }, [router]);
  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity onPress={goBack} style={styles.iconButton}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>
      <Text style={[styles.title, textStyle]}>{title}</Text>
      {children ? children : <View style={styles.iconButton} />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  iconButton: { padding: 6 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },
});

export default BackHeader;
