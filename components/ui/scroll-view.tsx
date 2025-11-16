import { forwardRef } from "react";
import {
  Platform,
  ScrollView as RNScrollView,
  ScrollViewProps,
} from "react-native";

export const ScrollView = forwardRef<RNScrollView, ScrollViewProps>(
  ({ style, ...otherProps }, ref) => {
    return (
      <RNScrollView
        ref={ref}
        nestedScrollEnabled={Platform.OS === "android" ? true : undefined}
        style={[{ backgroundColor: "transparent" }, style]}
        {...otherProps}
      />
    );
  }
);
