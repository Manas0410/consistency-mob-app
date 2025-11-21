import { Pallets } from "@/constants/theme";
import { usePaletteContext } from "@/contexts/palette-context";

export const usePallet = () => {
  try {
    const { palette } = usePaletteContext();
    return palette;
  } catch {
    // Fallback to blue if context not available (during initial render)
    return Pallets.blue;
  }
};
