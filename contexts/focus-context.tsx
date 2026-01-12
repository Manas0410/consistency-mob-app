import {
  MotivationalQuote,
  QuoteRotationManager,
} from "@/utils/motivationalQuotes";
import {
  requestNotificationPermissions,
  restoreNotifications,
  scheduleSessionProgressNotifications,
  setupNotificationListener,
  showProgressNotification,
  showSessionCompleteNotification,
  suppressNotifications,
} from "@/utils/notifications";
import { saveCurrentSession } from "@/utils/sessionStorage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * Lazy-load native modules to prevent
 * App Store / iPadOS 26 cold-start crashes
 */
const Native = {
  Audio: async () => (await import("expo-av")).Audio,
  Brightness: async () => import("expo-brightness"),
  Haptics: async () => import("expo-haptics"),
  KeepAwake: async () => import("expo-keep-awake"),
};

// ---------- TYPES ----------
export interface FocusSession {
  id: string;
  duration: number;
  startTime: number;
  endTime?: number;
  completed: boolean;
  paused: boolean;
  remainingTime: number;
}

export interface FocusStats {
  totalSessions: number;
  totalFocusTime: number;
  currentStreak: number;
  longestStreak: number;
  sessionsToday: number;
  lastSessionDate: string;
}

export interface FocusContextType {
  currentSession: FocusSession | null;
  isActive: boolean;
  isPaused: boolean;
  remainingTime: number;
  progress: number;
  stats: FocusStats;

  isDistractionModeActive: boolean;
  showFocusOverlay: boolean;
  setShowFocusOverlay: (show: boolean) => void;

  currentQuote: MotivationalQuote | null;
  progressMessage: string;

  startSession: (duration: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  resetSession: () => void;

  enableSound: boolean;
  enableHaptics: boolean;
  enableDistractionBlocking: boolean;
  enableQuoteRotation: boolean;
  quoteRotationInterval: number;
  setEnableSound: (enabled: boolean) => void;
  setEnableHaptics: (enabled: boolean) => void;
  setEnableDistractionBlocking: (enabled: boolean) => void;
  setEnableQuoteRotation: (enabled: boolean) => void;
  setQuoteRotationInterval: (interval: number) => void;
}

// ---------- STORAGE ----------
const STORAGE_KEYS = {
  CURRENT_SESSION: "@focus_current_session",
  STATS: "@focus_stats",
  SETTINGS: "@focus_settings",
};

const defaultStats: FocusStats = {
  totalSessions: 0,
  totalFocusTime: 0,
  currentStreak: 0,
  longestStreak: 0,
  sessionsToday: 0,
  lastSessionDate: "",
};

const FocusContext = createContext<FocusContextType | undefined>(undefined);

// ---------- PROVIDER ----------
export const FocusProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(
    null
  );
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [stats, setStats] = useState<FocusStats>(defaultStats);

  const [enableSound, setEnableSound] = useState(true);
  const [enableHaptics, setEnableHaptics] = useState(true);
  const [enableDistractionBlocking, setEnableDistractionBlocking] =
    useState(true);

  const [isDistractionModeActive, setIsDistractionModeActive] = useState(false);
  const [showFocusOverlay, setShowFocusOverlay] = useState(false);

  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote | null>(
    null
  );
  const [progressMessage, setProgressMessage] = useState("");
  const [enableQuoteRotation, setEnableQuoteRotation] = useState(true);
  const [quoteRotationInterval, setQuoteRotationInterval] = useState(5);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const backgroundTimeRef = useRef<number>(0);
  const quoteManagerRef = useRef<QuoteRotationManager | null>(null);
  const originalBrightnessRef = useRef<number | null>(null);
  const notificationCleanupRef = useRef<(() => void) | null>(null);
  const appStateCleanupRef = useRef<(() => void) | null>(null);
  const currentSessionRef = useRef<FocusSession | null>(null);

  // ---------- INIT ----------
  useEffect(() => {
    const id = setTimeout(() => {
      initializeFocusSystem();
    }, 0);

    return () => {
      clearTimeout(id);
      cleanupFocusSystem();
    };
  }, []);

  const initializeFocusSystem = async () => {
    try {
      await requestNotificationPermissions();

      notificationCleanupRef.current = setupNotificationListener();

      appStateCleanupRef.current = setupAppStateListener();

      await loadPersistedData();

      quoteManagerRef.current = new QuoteRotationManager(
        quoteRotationInterval * 60 * 1000
      );
    } catch (e) {
      console.error("Focus init failed", e);
    }
  };

  const cleanupFocusSystem = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    quoteManagerRef.current?.stop();
    notificationCleanupRef.current?.();
    appStateCleanupRef.current?.();

    if (isDistractionModeActive) {
      restoreNormalMode();
    }
  };

  const setupAppStateListener = () => {
    const sub = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "background" && isActive && !isPaused) {
        backgroundTimeRef.current = Date.now();
      }
      if (
        state === "active" &&
        backgroundTimeRef.current &&
        isActive &&
        !isPaused
      ) {
        const diff = (Date.now() - backgroundTimeRef.current) / 1000;
        setRemainingTime((t) => Math.max(0, t - diff));
        backgroundTimeRef.current = 0;
      }
    });
    return () => sub.remove();
  };

  // ---------- DISTRACTION MODE ----------
  const enableDistractionMode = async () => {
    if (!enableDistractionBlocking) return;
    setIsDistractionModeActive(true);

    await suppressNotifications();

    const KeepAwake = await Native.KeepAwake();
    await KeepAwake.activateKeepAwakeAsync();

    try {
      const Brightness = await Native.Brightness();
      const current = await Brightness.getBrightnessAsync();
      originalBrightnessRef.current = current;
      await Brightness.setBrightnessAsync(Math.max(0.3, current * 0.8));
    } catch {}
  };

  const restoreNormalMode = async () => {
    setIsDistractionModeActive(false);
    setShowFocusOverlay(false);
    await restoreNotifications();

    const KeepAwake = await Native.KeepAwake();
    KeepAwake.deactivateKeepAwake();

    if (originalBrightnessRef.current !== null) {
      try {
        const Brightness = await Native.Brightness();
        await Brightness.setBrightnessAsync(originalBrightnessRef.current);
      } catch {}
      originalBrightnessRef.current = null;
    }

    quoteManagerRef.current?.stop();
  };

  // ---------- TIMER ----------
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemainingTime((t) => {
        if (t <= 1) {
          completeSession();
          return 0;
        }
        showProgressNotification(
          (currentSessionRef.current!.duration * 60 - t) / 60
        );
        return t - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // ---------- SESSION ACTIONS ----------
  const startSession = async (duration: number) => {
    const session: FocusSession = {
      id: Date.now().toString(),
      duration,
      startTime: Date.now(),
      completed: false,
      paused: false,
      remainingTime: duration * 60,
    };

    setCurrentSession(session);
    setRemainingTime(session.remainingTime);
    setIsActive(true);
    setIsPaused(false);
    currentSessionRef.current = session;

    await saveCurrentSession(session);
    await enableDistractionMode();
    await scheduleSessionProgressNotifications(duration);
    startTimer();
  };

  const completeSession = async () => {
    if (!currentSessionRef.current) return;
    await showSessionCompleteNotification(
      currentSessionRef.current.duration,
      currentSessionRef.current.duration
    );
    await restoreNormalMode();
    stopTimer();
    setCurrentSession(null);
    setIsActive(false);
  };

  const progress = currentSession
    ? 1 - remainingTime / (currentSession.duration * 60)
    : 0;

  return (
    <FocusContext.Provider
      value={{
        currentSession,
        isActive,
        isPaused,
        remainingTime,
        progress,
        stats,
        isDistractionModeActive,
        showFocusOverlay,
        setShowFocusOverlay,
        currentQuote,
        progressMessage,
        startSession,
        pauseSession: () => {},
        resumeSession: () => {},
        endSession: () => {},
        resetSession: () => {},
        enableSound,
        enableHaptics,
        enableDistractionBlocking,
        enableQuoteRotation,
        quoteRotationInterval,
        setEnableSound,
        setEnableHaptics,
        setEnableDistractionBlocking,
        setEnableQuoteRotation,
        setQuoteRotationInterval,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
};

// ---------- HOOK ----------
export const useFocus = () => {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error("useFocus must be used within FocusProvider");
  return ctx;
};

export default FocusContext;
