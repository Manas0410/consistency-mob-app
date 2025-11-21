// import { useColorScheme } from "@/hooks/use-color-scheme";
// import { useEffect, useState } from "react";

// let selectedMode: "dark" | "light" | "systemPreference" = "light";

// export const useTheme = () => {
//   const [theme, setTheme] = useState<"dark" | "light" | null>(null);

//   const systemTheme = useColorScheme();

//   useEffect(() => {
//     setTheme(
//       // @ts-ignore
//       selectedMode === "systemPreference"
//         ? systemTheme ?? "light"
//         : selectedMode
//     );
//   }, [selectedMode, systemTheme]);

//   return theme;
// };

// Always return light theme - theme switching removed, only palette remains
export const useTheme = () => {
  return "light" as const;
};
