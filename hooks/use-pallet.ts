import { Pallets } from "@/constants/theme";
import { usePaletteContext } from "@/contexts/palette-context";

export const usePallet = () => {
  try {
    const { palette } = usePaletteContext();
    // Ensure palette exists, fallback to blue if undefined
    return palette || Pallets.blue;
  } catch {
    // Fallback to blue if context not available (during initial render)
    return Pallets.blue;
  }
};
