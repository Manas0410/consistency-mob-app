import React from "react";
import { Image, StyleSheet } from "react-native";

// Adjust paths as needed
import afternoonIcon from "../../../assets/images/afternoon.png";
import eveningIcon from "../../../assets/images/evening.png";
import morningIcon from "../../../assets/images/morning.png";
import nightIcon from "../../../assets/images/night.png";

export const PeriodIcon = ({ startTime }: { startTime: Date | string }) => {
  // Ensure we're working with a Date object
  const dateObj = new Date(startTime);
  const hour = dateObj.getHours();

  let icon = morningIcon;

  if (hour >= 5 && hour < 12) {
    icon = morningIcon;
  } else if (hour >= 12 && hour < 17) {
    icon = afternoonIcon;
  } else if (hour >= 17 && hour < 19) {
    icon = eveningIcon;
  } else {
    icon = nightIcon;
  }

  return <Image source={icon} style={styles.icon} resizeMode="contain" />;
};

const styles = StyleSheet.create({
  icon: {
    width: 38,
    height: 38,
  },
});

export default PeriodIcon;
