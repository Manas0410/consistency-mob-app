// contexts/OnboardingContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "@app:hasCompletedOnboarding_v1";

type OnboardingContextType = {
  hasCompletedOnboarding: boolean;
  currentOnboardingStep: number;
  setCurrentOnboardingStep: (n: number) => void;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
  hydrated: boolean; // true when AsyncStorage load finished
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from storage on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (raw === "true") {
          setHasCompletedOnboarding(true);
        } else {
          setHasCompletedOnboarding(false);
        }
      } catch (err) {
        console.warn("Failed to load onboarding state", err);
      } finally {
        if (mounted) setHydrated(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      setHasCompletedOnboarding(true);
      await AsyncStorage.setItem(STORAGE_KEY, "true");
      console.log("Onboarding completed and saved");
    } catch (error) {
      console.error("Failed to save onboarding completion:", error);
    }
  }, []);

  const resetOnboarding = useCallback(async () => {
    try {
      setHasCompletedOnboarding(false);
      setCurrentOnboardingStep(0);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Failed to reset onboarding", err);
    }
  }, []);

  const skipOnboarding = useCallback(async () => {
    await completeOnboarding();
  }, [completeOnboarding]);

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedOnboarding,
        currentOnboardingStep,
        setCurrentOnboardingStep,
        completeOnboarding,
        resetOnboarding,
        skipOnboarding,
        hydrated,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export function useOnboardingContext() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error(
      "useOnboardingContext must be used within an OnboardingProvider"
    );
  }
  return ctx;
}
