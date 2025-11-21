import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "@app:theme_preference";

export type ThemePreference = "light" | "dark" | "systemPreference";
export type EffectiveTheme = "light" | "dark";

type ThemeContextType = {
  themePreference: ThemePreference;
  effectiveTheme: EffectiveTheme;
  setTheme: (preference: ThemePreference) => Promise<void>;
  hydrated: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themePreference, setThemePreference] =
    useState<ThemePreference>("light");
  const [hydrated, setHydrated] = useState(false);
  const systemTheme = useColorScheme();

  // Compute effective theme based on preference and system
  const effectiveTheme: EffectiveTheme =
    themePreference === "systemPreference"
      ? systemTheme ?? "light"
      : themePreference;

  // Hydrate from storage on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (
          stored === "light" ||
          stored === "dark" ||
          stored === "systemPreference"
        ) {
          setThemePreference(stored);
        } else {
          // Default to light if no preference stored
          setThemePreference("light");
        }
      } catch (err) {
        console.warn("Failed to load theme preference", err);
        if (mounted) setThemePreference("light");
      } finally {
        if (mounted) setHydrated(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setTheme = useCallback(async (preference: ThemePreference) => {
    try {
      setThemePreference(preference);
      await AsyncStorage.setItem(STORAGE_KEY, preference);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        themePreference,
        effectiveTheme,
        setTheme,
        hydrated,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return ctx;
}
