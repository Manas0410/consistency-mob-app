/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#888",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#888",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Pallets = {
  blue: {
    shade1: "#2196F3",
    shade2: "#42A5F5",
    shade3: "#90CAF9",
    shade4: "#E3F2FD",
    buttonBg: "#BBDEFB",
    ButtonText: "#1976D2",
    errorText: "#EF4444",
    errorBg: "#FFEBEE",
  },
  green: {
    shade1: "#4CAF50",
    shade2: "#66BB6A",
    shade3: "#A5D6A7",
    shade4: "#E8F5E9",
    buttonBg: "#C8E6C9",
    ButtonText: "#388E3C",
    errorText: "#EF4444",
    errorBg: "#FFEBEE",
  },
  orange: {
    shade1: "#E5734A",
    shade2: "#FF8A65",
    shade3: "#FFAB91",
    shade4: "#FFE0B2",
    buttonBg: "#FFCCBC",
    ButtonText: "#D84315",
    errorText: "#EF4444",
    errorBg: "#FFEBEE",
  },
  purple: {
    shade1: "#7B3FF2",
    shade2: "#9575CD",
    shade3: "#B39DDB",
    shade4: "#EDE7F6",
    buttonBg: "#D1C4E9",
    ButtonText: "#5E35B1",
    errorText: "#EF4444",
    errorBg: "#FFEBEE",
  },
};

// backgroundColor: "#FFE5E5", FF9999;

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
