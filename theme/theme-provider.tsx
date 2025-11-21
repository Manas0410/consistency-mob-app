import {
  DefaultTheme,
  ThemeProvider as RNThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";

import { Colors } from "@/theme/colors";

type Props = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  // Always use light theme
  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.primary,
      background: Colors.light.background,
      card: Colors.light.card,
      text: Colors.light.text,
      border: Colors.light.border,
      notification: Colors.light.red,
    },
  };

  return <RNThemeProvider value={customLightTheme}>{children}</RNThemeProvider>;
};
