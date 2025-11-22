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
    shade1: "#177AD5",
    shade2: "#0eafff",
    shade3: "#77d2ff",
    shade4: "#d8f1fc",
    buttonBg: "#c4ddfbff",
    ButtonText: "#3B82F6",
    errorText: "#EF4444",
    errorBg: "#fad3d3ff",
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
  pink: {
    shade1: "#E91E63",
    shade2: "#EC407A",
    shade3: "#F48FB1",
    shade4: "#FCE4EC",
    buttonBg: "#F8BBD0",
    ButtonText: "#C2185B",
    errorText: "#EF4444",
    errorBg: "#FFEBEE",
  },
  teal: {
    shade1: "#009688",
    shade2: "#26A69A",
    shade3: "#80CBC4",
    shade4: "#E0F2F1",
    buttonBg: "#B2DFDB",
    ButtonText: "#00695C",
    errorText: "#EF4444",
    errorBg: "#FFEBEE",
  },
  indigo: {
    shade1: "#3F51B5",
    shade2: "#5C6BC0",
    shade3: "#9FA8DA",
    shade4: "#E8EAF6",
    buttonBg: "#C5CAE9",
    ButtonText: "#283593",
    errorText: "#EF4444",
    errorBg: "#FFEBEE",
  },
  red: {
    shade1: "#F44336",
    shade2: "#EF5350",
    shade3: "#EF9A9A",
    shade4: "#FFEBEE",
    buttonBg: "#FFCDD2",
    ButtonText: "#C62828",
    errorText: "#EF4444",
    errorBg: "#FFEBEE",
  },
  amber: {
    shade1: "#FF9800",
    shade2: "#FFA726",
    shade3: "#FFCC80",
    shade4: "#FFF3E0",
    buttonBg: "#FFE0B2",
    ButtonText: "#E65100",
    errorText: "#EF4444",
    errorBg: "#FFEBEE",
  },
  cyan: {
    shade1: "#00BCD4",
    shade2: "#26C6DA",
    shade3: "#80DEEA",
    shade4: "#E0F7FA",
    buttonBg: "#B2EBF2",
    ButtonText: "#00838F",
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
