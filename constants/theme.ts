/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

// Modern theme colors aligned with the main color system
const tintColorLight = "#6366F1";
const tintColorDark = "#818CF8";

export const Colors = {
  light: {
    text: "#0F172A",
    textSecondary: "#64748B",
    background: "#FAFAFA",
    tint: tintColorLight,
    icon: "#64748B",
    tabIconDefault: "#94A3B8",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    background: "#0F0F10",
    tint: tintColorDark,
    icon: "#94A3B8",
    tabIconDefault: "#64748B",
    tabIconSelected: tintColorDark,
  },
};

// Enhanced color palettes for different app features
export const Pallets = {
  blue: {
    shade1: "#3B82F6",
    shade2: "#60A5FA", 
    shade3: "#93C5FD",
    shade4: "#DBEAFE",
  },
  indigo: {
    shade1: "#6366F1",
    shade2: "#818CF8",
    shade3: "#A5B4FC", 
    shade4: "#E0E7FF",
  },
  purple: {
    shade1: "#8B5CF6",
    shade2: "#A78BFA",
    shade3: "#C4B5FD",
    shade4: "#EDE9FE",
  },
  teal: {
    shade1: "#14B8A6",
    shade2: "#2DD4BF",
    shade3: "#5EEAD4",
    shade4: "#CCFBF1",
  },
  green: {
    shade1: "#10B981",
    shade2: "#34D399",
    shade3: "#6EE7B7",
    shade4: "#D1FAE5",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
