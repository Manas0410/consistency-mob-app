import { useColor } from "@/hooks/useColor";
import { TYPOGRAPHY } from "@/theme/globals";
import React, { forwardRef } from "react";
import {
    Text as RNText,
    TextProps as RNTextProps,
    TextStyle,
} from "react-native";

type TextVariant =
  | "body"
  | "title"
  | "subtitle"
  | "caption"
  | "heading"
  | "link";

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  lightColor?: string;
  darkColor?: string;
  children: React.ReactNode;
}

export const Text = forwardRef<RNText, TextProps>(
  (
    { variant = "body", lightColor, darkColor, style, children, ...props },
    ref
  ) => {
    const textColor = useColor({ light: lightColor, dark: darkColor }, "text");
    const mutedColor = useColor({}, "textMuted");

    const getTextStyle = (): TextStyle => {
      const baseStyle: TextStyle = {
        color: textColor,
      };

      switch (variant) {
        case "heading":
          return {
            ...baseStyle,
            fontSize: TYPOGRAPHY.fontSize['4xl'],
            fontWeight: TYPOGRAPHY.fontWeight.black,
            lineHeight: TYPOGRAPHY.fontSize['4xl'] * TYPOGRAPHY.lineHeight.tight,
            letterSpacing: -0.5,
          };
        case "title":
          return {
            ...baseStyle,
            fontSize: TYPOGRAPHY.fontSize['2xl'],
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            lineHeight: TYPOGRAPHY.fontSize['2xl'] * TYPOGRAPHY.lineHeight.snug,
            letterSpacing: -0.25,
          };
        case "subtitle":
          return {
            ...baseStyle,
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.normal,
          };
        case "caption":
          return {
            ...baseStyle,
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
            color: mutedColor,
            lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
          };
        case "link":
          return {
            ...baseStyle,
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            textDecorationLine: "underline",
            lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.normal,
          };
        default: // 'body'
          return {
            ...baseStyle,
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
            lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.normal,
          };
      }
    };

    return (
      <RNText ref={ref} style={[getTextStyle(), style]} {...props}>
        {children}
      </RNText>
    );
  }
);
