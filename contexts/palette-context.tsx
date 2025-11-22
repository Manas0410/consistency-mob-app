import { Pallets } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "@app:palette_preference";

export type PaletteName =
  | "blue"
  | "green"
  | "orange"
  | "purple"
  | "pink"
  | "teal"
  | "indigo"
  | "red"
  | "amber"
  | "cyan";

type PaletteContextType = {
  paletteName: PaletteName;
  palette: typeof Pallets.blue;
  setPalette: (name: PaletteName) => Promise<void>;
  hydrated: boolean;
};

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

export const PaletteProvider = ({ children }: { children: ReactNode }) => {
  const [paletteName, setPaletteName] = useState<PaletteName>("blue");
  const [hydrated, setHydrated] = useState(false);

  // Get the palette object based on name, fallback to blue if not found
  const palette = Pallets[paletteName] || Pallets.blue;

  // Hydrate from storage on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (
          stored === "blue" ||
          stored === "green" ||
          stored === "orange" ||
          stored === "purple" ||
          stored === "pink" ||
          stored === "teal" ||
          stored === "indigo" ||
          stored === "red" ||
          stored === "amber" ||
          stored === "cyan"
        ) {
          setPaletteName(stored);
        } else {
          // Default to blue if no preference stored
          setPaletteName("blue");
        }
      } catch (err) {
        console.warn("Failed to load palette preference", err);
        if (mounted) setPaletteName("blue");
      } finally {
        if (mounted) setHydrated(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setPalette = useCallback(async (name: PaletteName) => {
    try {
      setPaletteName(name);
      await AsyncStorage.setItem(STORAGE_KEY, name);
    } catch (error) {
      console.error("Failed to save palette preference:", error);
    }
  }, []);

  return (
    <PaletteContext.Provider
      value={{
        paletteName,
        palette,
        setPalette,
        hydrated,
      }}
    >
      {children}
    </PaletteContext.Provider>
  );
};

export function usePaletteContext() {
  const ctx = useContext(PaletteContext);
  if (!ctx) {
    throw new Error("usePaletteContext must be used within a PaletteProvider");
  }
  return ctx;
}
