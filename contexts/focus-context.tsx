import {
  getPhaseAppropriateQuote,
  getProgressMessage,
  MotivationalQuote,
  QuoteRotationManager,
} from "@/utils/motivationalQuotes";
import {
  cancelScheduledNotifications,
  requestNotificationPermissions,
  restoreNotifications,
  scheduleSessionProgressNotifications,
  setupNotificationListener,
  showMilestoneNotification,
  showProgressNotification,
  showSessionCompleteNotification,
  suppressNotifications,
} from "@/utils/notifications";
import {
  clearCurrentSession,
  getSessionStats as getStoredSessionStats,
  saveCurrentSession,
  saveSessionLog,
} from "@/utils/sessionStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as Brightness from "expo-brightness";
import * as Haptics from "expo-haptics";
import * as KeepAwake from "expo-keep-awake";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";

// Types
export interface FocusSession {
  id: string;
  duration: number; // in minutes
  startTime: number; // timestamp
  endTime?: number; // timestamp
  completed: boolean;
  paused: boolean;
  remainingTime: number; // in seconds
}

export interface FocusStats {
  totalSessions: number;
  totalFocusTime: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  sessionsToday: number;
  lastSessionDate: string;
}

export interface FocusContextType {
  // Session state
  currentSession: FocusSession | null;
  isActive: boolean;
  isPaused: boolean;
  remainingTime: number;
  progress: number; // 0 to 1

  // Stats
  stats: FocusStats;

  // Distraction blocking
  isDistractionModeActive: boolean;
  showFocusOverlay: boolean;
  setShowFocusOverlay: (show: boolean) => void;

  // Motivational quotes
  currentQuote: MotivationalQuote | null;
  progressMessage: string;

  // Actions
  startSession: (duration: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  resetSession: () => void;

  // Settings
  enableSound: boolean;
  enableHaptics: boolean;
  enableDistractionBlocking: boolean;
  enableQuoteRotation: boolean;
  quoteRotationInterval: number; // in minutes
  setEnableSound: (enabled: boolean) => void;
  setEnableHaptics: (enabled: boolean) => void;
  setEnableDistractionBlocking: (enabled: boolean) => void;
  setEnableQuoteRotation: (enabled: boolean) => void;
  setQuoteRotationInterval: (interval: number) => void;
}

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

// Create context
const FocusContext = createContext<FocusContextType | undefined>(undefined);

// Provider component
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

  // Distraction blocking state
  const [isDistractionModeActive, setIsDistractionModeActive] = useState(false);
  const [showFocusOverlay, setShowFocusOverlay] = useState(false);
  const [enableDistractionBlocking, setEnableDistractionBlocking] =
    useState(true);

  // Motivational quotes state
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote | null>(
    null
  );
  const [progressMessage, setProgressMessage] = useState("");
  const [enableQuoteRotation, setEnableQuoteRotation] = useState(true);
  const [quoteRotationInterval, setQuoteRotationInterval] = useState(5); // 5 minutes

  // Refs
  const timerRef = useRef<number | null>(null);
  const backgroundTimeRef = useRef<number>(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const quoteManagerRef = useRef<QuoteRotationManager | null>(null);
  const originalBrightnessRef = useRef<number | null>(null);
  const notificationListenerRef = useRef<(() => void) | null>(null);
  const currentSessionRef = useRef<FocusSession | null>(null);

  // Load persisted data on mount
  useEffect(() => {
    initializeFocusSystem();
    return () => {
      cleanupFocusSystem();
    };
  }, []);

  // Initialize the focus system
  const initializeFocusSystem = async () => {
    try {
      // Request notification permissions
      await requestNotificationPermissions();

      // Set up notification listener with milestone handling
      const handleMilestoneNotification = (milestone: string) => {
        console.log(`🏆 Milestone achieved: ${milestone}`);
        // Could trigger in-app celebration or modal here
      };

      notificationListenerRef.current = setupNotificationListener(
        () => setShowFocusOverlay(false), // Return to focus screen
        () => {}, // Handle session complete
        handleMilestoneNotification // Handle milestone notifications
      );

      // Load persisted data
      await loadPersistedData();

      // Set up app state listener
      setupAppStateListener();

      // Initialize quote manager
      quoteManagerRef.current = new QuoteRotationManager(
        quoteRotationInterval * 60 * 1000
      );
    } catch (error) {
      console.error("Failed to initialize focus system:", error);
    }
  };

  // Cleanup focus system
  const cleanupFocusSystem = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Stop quote rotation
    if (quoteManagerRef.current) {
      quoteManagerRef.current.stop();
    }

    // Remove notification listener
    if (notificationListenerRef.current) {
      notificationListenerRef.current();
    }

    // Restore normal state if in distraction mode
    if (isDistractionModeActive) {
      restoreNormalMode();
    }
  };

  // App state listener for background/foreground handling
  const setupAppStateListener = () => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "background" && isActive && !isPaused) {
        backgroundTimeRef.current = Date.now();
      } else if (
        nextAppState === "active" &&
        isActive &&
        !isPaused &&
        backgroundTimeRef.current > 0
      ) {
        const timeInBackground = Math.floor(
          (Date.now() - backgroundTimeRef.current) / 1000
        );
        setRemainingTime((prev) => Math.max(0, prev - timeInBackground));
        backgroundTimeRef.current = 0;
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription?.remove();
  };

  // Load persisted session and stats
  const loadPersistedData = async () => {
    try {
      // Load current session
      const sessionData = await AsyncStorage.getItem(
        STORAGE_KEYS.CURRENT_SESSION
      );
      if (sessionData) {
        const session: FocusSession = JSON.parse(sessionData);
        const now = Date.now();
        const elapsedTime = Math.floor((now - session.startTime) / 1000);
        const remaining = Math.max(0, session.remainingTime - elapsedTime);

        if (remaining > 0 && !session.completed) {
          setCurrentSession(session);
          setRemainingTime(remaining);
          setIsActive(true); // Always stay active to keep the same screen
          setIsPaused(session.paused);

          if (!session.paused) {
            startTimer();
          }
        } else {
          // Session expired, clear it
          await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
        }
      }

      // Load stats
      const statsData = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
      if (statsData) {
        setStats(JSON.parse(statsData));
      }

      // Load settings
      const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        setEnableSound(settings.enableSound ?? true);
        setEnableHaptics(settings.enableHaptics ?? true);
        setEnableDistractionBlocking(
          settings.enableDistractionBlocking ?? true
        );
        setEnableQuoteRotation(settings.enableQuoteRotation ?? true);
        setQuoteRotationInterval(settings.quoteRotationInterval ?? 5);
      }

      // Load enhanced stats from new storage system
      try {
        const enhancedStats = await getStoredSessionStats();
        if (enhancedStats.totalSessions > 0) {
          setStats({
            totalSessions: enhancedStats.totalSessions,
            totalFocusTime: enhancedStats.totalFocusTime,
            currentStreak: enhancedStats.currentStreak,
            longestStreak: enhancedStats.longestStreak,
            sessionsToday: enhancedStats.sessionsToday,
            lastSessionDate: enhancedStats.lastSessionDate,
          });
        }
      } catch (error) {
        console.warn("Failed to load enhanced stats:", error);
      }
    } catch (error) {
      console.error("Failed to load persisted focus data:", error);
    }
  };

  // Save current session to storage
  const saveSession = async (session: FocusSession | null) => {
    try {
      if (session) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.CURRENT_SESSION,
          JSON.stringify(session)
        );
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
      }
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  // Save stats to storage
  const saveStats = async (newStats: FocusStats) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
    } catch (error) {
      console.error("Failed to save stats:", error);
    }
  };

  // Save settings to storage
  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify({
          enableSound,
          enableHaptics,
          enableDistractionBlocking,
          enableQuoteRotation,
          quoteRotationInterval,
        })
      );
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  // Timer logic
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;

        if (newTime <= 0) {
          // Session completed
          completeSession();
          return 0;
        }

        // Check for progress notifications
        if (currentSessionRef.current) {
          const totalSeconds = currentSessionRef.current.duration * 60;
          const elapsedSeconds = totalSeconds - newTime;
          const elapsedMinutes = elapsedSeconds / 60;

          // Show progress notification at the right times
          showProgressNotification(elapsedMinutes);
        }

        return newTime;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Distraction blocking functions
  const enableDistractionMode = async () => {
    if (!enableDistractionBlocking) return;

    try {
      setIsDistractionModeActive(true);
      console.log("🚫 Distraction blocking mode activated");

      // Suppress notifications
      await suppressNotifications();

      // Keep screen awake during focus session
      await KeepAwake.activateKeepAwakeAsync();
      console.log("📱 Screen keep-awake activated");

      // Dim screen brightness slightly for better concentration
      try {
        const currentBrightness = await Brightness.getBrightnessAsync();
        originalBrightnessRef.current = currentBrightness;
        await Brightness.setBrightnessAsync(
          Math.max(0.3, currentBrightness * 0.8)
        );
        console.log(
          `💡 Screen brightness adjusted: ${currentBrightness} → ${Math.max(
            0.3,
            currentBrightness * 0.8
          )}`
        );
      } catch (error) {
        console.warn("Failed to adjust brightness:", error);
      }
    } catch (error) {
      console.error("Failed to enable distraction mode:", error);
    }
  };

  const restoreNormalMode = async () => {
    try {
      setIsDistractionModeActive(false);
      setShowFocusOverlay(false);
      console.log("✅ Restoring normal mode");

      // Restore notifications
      await restoreNotifications();

      // Allow screen to sleep normally
      KeepAwake.deactivateKeepAwake();

      // Restore original brightness
      if (originalBrightnessRef.current !== null) {
        try {
          await Brightness.setBrightnessAsync(originalBrightnessRef.current);
          console.log(
            `💡 Screen brightness restored to: ${originalBrightnessRef.current}`
          );
          originalBrightnessRef.current = null;
        } catch (error) {
          console.warn("Failed to restore brightness:", error);
        }
      }

      // Stop quote rotation
      if (quoteManagerRef.current) {
        quoteManagerRef.current.stop();
      }

      console.log("✅ Normal mode restored successfully");
    } catch (error) {
      console.error("Failed to restore normal mode:", error);
    }
  };

  // Progress message updater
  const updateProgressMessage = () => {
    if (!currentSession) return;

    const elapsedMinutes = Math.floor(
      (currentSession.duration * 60 - remainingTime) / 60
    );
    const totalMinutes = currentSession.duration;
    const remainingMinutes = Math.ceil(remainingTime / 60);

    const message = getProgressMessage(
      elapsedMinutes,
      totalMinutes,
      remainingMinutes
    );
    setProgressMessage(message);
  };

  // Quote rotation handler
  const handleQuoteRotation = (quote: MotivationalQuote) => {
    setCurrentQuote(quote);
  };

  // Session actions
  const startSession = async (duration: number) => {
    const session: FocusSession = {
      id: Date.now().toString(),
      duration,
      startTime: Date.now(),
      completed: false,
      paused: false,
      remainingTime: duration * 60, // convert to seconds
    };

    setCurrentSession(session);
    setRemainingTime(duration * 60);
    setIsActive(true);
    setIsPaused(false);

    // Save session to both old and new storage systems
    saveSession(session);
    await saveCurrentSession(session);

    // Enable distraction blocking mode
    await enableDistractionMode();

    // Schedule progress notifications for this session
    await scheduleSessionProgressNotifications(duration);

    // Start quote rotation if enabled
    if (enableQuoteRotation && quoteManagerRef.current) {
      // Set initial quote
      const initialQuote = getPhaseAppropriateQuote("start", duration);
      setCurrentQuote(initialQuote);

      // Start rotation
      quoteManagerRef.current.start(handleQuoteRotation);
    }

    // Set initial progress message
    updateProgressMessage();

    // Check for first session milestone
    const currentStats = await getStoredSessionStats();
    if (currentStats.totalSessions === 0) {
      setTimeout(() => {
        showMilestoneNotification(
          "first_session",
          `Welcome to your focus journey!`
        );
      }, 5000); // Show after 5 seconds
    }

    startTimer();

    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const pauseSession = () => {
    if (!currentSession || !isActive) return;

    const updatedSession = {
      ...currentSession,
      paused: true,
      remainingTime: remainingTime,
    };

    setCurrentSession(updatedSession);
    setIsPaused(true);
    // Keep isActive true so we stay on the same screen
    // Only stop the timer, don't change the UI

    saveSession(updatedSession);
    stopTimer();

    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const resumeSession = () => {
    if (!currentSession || !isPaused) return;

    const updatedSession = {
      ...currentSession,
      paused: false,
      startTime:
        Date.now() - (currentSession.duration * 60 - remainingTime) * 1000,
    };

    setCurrentSession(updatedSession);
    setIsPaused(false);
    // isActive stays true - we're already on the same screen

    saveSession(updatedSession);
    startTimer();

    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const endSession = async () => {
    if (currentSession) {
      const completedMinutes = Math.floor(
        (currentSession.duration * 60 - remainingTime) / 60
      );
      const totalMinutes = currentSession.duration;

      // Log session to new storage system
      try {
        await saveSessionLog({
          startTime: currentSession.startTime,
          endTime: Date.now(),
          duration: totalMinutes,
          completedTime: completedMinutes,
          completed: false, // ended early
          interrupted: true,
          date: new Date().toISOString().split("T")[0],
          motivationalQuotes: currentQuote ? [currentQuote.text] : [],
        });
      } catch (error) {
        console.error("Failed to save session log:", error);
      }

      // Update old stats system
      updateStats(completedMinutes, false);
    }

    stopTimer();
    setCurrentSession(null);
    setIsActive(false);
    setIsPaused(false);
    setRemainingTime(0);
    setCurrentQuote(null);
    setProgressMessage("");

    // Cancel any scheduled progress notifications
    await cancelScheduledNotifications();

    // Restore normal mode
    await restoreNormalMode();

    // Clear current session from storage
    await clearCurrentSession();
    saveSession(null);

    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const resetSession = async () => {
    stopTimer();
    setCurrentSession(null);
    setIsActive(false);
    setIsPaused(false);
    setRemainingTime(0);
    setCurrentQuote(null);
    setProgressMessage("");

    // Cancel any scheduled progress notifications
    await cancelScheduledNotifications();

    // Restore normal mode if active
    if (isDistractionModeActive) {
      await restoreNormalMode();
    }

    // Clear current session from storage
    await clearCurrentSession();
    saveSession(null);
  };

  const completeSession = async () => {
    if (!currentSession) return;

    const completedSession = {
      ...currentSession,
      completed: true,
      endTime: Date.now(),
    };

    // Log completed session to new storage system
    try {
      await saveSessionLog({
        startTime: currentSession.startTime,
        endTime: Date.now(),
        duration: currentSession.duration,
        completedTime: currentSession.duration, // fully completed
        completed: true,
        interrupted: false,
        date: new Date().toISOString().split("T")[0],
        motivationalQuotes: currentQuote ? [currentQuote.text] : [],
      });

      // Show completion notification
      await showSessionCompleteNotification(
        currentSession.duration,
        currentSession.duration
      );
    } catch (error) {
      console.error("Failed to save completed session:", error);
    }

    // Update old stats system
    updateStats(currentSession.duration, true);

    // Check for milestone achievements
    try {
      const updatedStats = await getStoredSessionStats();

      // Check for streak milestones
      if (updatedStats.currentStreak === 7) {
        await showMilestoneNotification(
          "streak_milestone",
          "7-day focus streak achieved!"
        );
      } else if (updatedStats.currentStreak === 30) {
        await showMilestoneNotification(
          "streak_milestone",
          "30-day focus mastery unlocked!"
        );
      } else if (updatedStats.currentStreak === 100) {
        await showMilestoneNotification(
          "streak_milestone",
          "100-day focus legend status!"
        );
      }

      // Check for total time milestones (in hours)
      const totalHours = Math.floor(updatedStats.totalFocusTime / 60);
      if (totalHours === 10) {
        await showMilestoneNotification(
          "total_time",
          "10 hours of deep focus achieved!"
        );
      } else if (totalHours === 50) {
        await showMilestoneNotification(
          "total_time",
          "50 hours of focus mastery!"
        );
      } else if (totalHours === 100) {
        await showMilestoneNotification(
          "total_time",
          "100 hours - you're a focus champion!"
        );
      }
    } catch (error) {
      console.warn("Failed to check milestones:", error);
    }

    // Play completion sound
    if (enableSound) {
      try {
        // For now, we'll just log completion sound
        // In production, add a real MP3 file to assets/sounds/
        console.log("🔊 Session completed! (Sound would play here)");

        // Uncomment when you add a real sound file:
        // const { sound } = await Audio.Sound.createAsync(
        //   require('@/assets/sounds/session-complete.mp3'),
        //   { shouldPlay: true }
        // );
        // soundRef.current = sound;
      } catch (error) {
        console.log("Could not play sound:", error);
      }
    }

    // Haptic feedback
    if (enableHaptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    stopTimer();
    setCurrentSession(completedSession);
    setIsActive(false);
    setIsPaused(false);
    setCurrentQuote(null);
    setProgressMessage("");

    // Cancel any scheduled progress notifications
    await cancelScheduledNotifications();

    // Restore normal mode
    await restoreNormalMode();

    // Clear current session from storage
    await clearCurrentSession();
    saveSession(null); // Clear the active session
  };

  const updateStats = (minutes: number, completed: boolean) => {
    const today = new Date().toDateString();
    const newStats: FocusStats = {
      ...stats,
      totalSessions: stats.totalSessions + (completed ? 1 : 0),
      totalFocusTime: stats.totalFocusTime + minutes,
      sessionsToday:
        stats.lastSessionDate === today
          ? stats.sessionsToday + (completed ? 1 : 0)
          : completed
          ? 1
          : 0,
      lastSessionDate: today,
    };

    // Update streak
    if (completed) {
      if (stats.lastSessionDate === today) {
        newStats.currentStreak = stats.currentStreak + 1;
      } else {
        newStats.currentStreak = 1;
      }
      newStats.longestStreak = Math.max(
        newStats.longestStreak,
        newStats.currentStreak
      );
    }

    setStats(newStats);
    saveStats(newStats);
  };

  // Progress calculation
  const progress = currentSession
    ? 1 - remainingTime / (currentSession.duration * 60)
    : 0;

  // Update progress message when timer changes
  useEffect(() => {
    if (isActive) {
      updateProgressMessage();
    }
  }, [remainingTime, isActive, currentSession]);

  // Save settings when they change
  useEffect(() => {
    saveSettings();
  }, [
    enableSound,
    enableHaptics,
    enableDistractionBlocking,
    enableQuoteRotation,
    quoteRotationInterval,
  ]);

  // Update quote rotation interval when setting changes
  useEffect(() => {
    if (quoteManagerRef.current) {
      quoteManagerRef.current.updateInterval(quoteRotationInterval * 60 * 1000);
    }
  }, [quoteRotationInterval]);

  // Keep currentSessionRef in sync with currentSession
  useEffect(() => {
    currentSessionRef.current = currentSession;
  }, [currentSession]);

  const value: FocusContextType = {
    // Session state
    currentSession,
    isActive,
    isPaused,
    remainingTime,
    progress,
    stats,

    // Distraction blocking
    isDistractionModeActive,
    showFocusOverlay,
    setShowFocusOverlay,

    // Motivational quotes
    currentQuote,
    progressMessage,

    // Actions
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    resetSession,

    // Settings
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
  };

  return (
    <FocusContext.Provider value={value}>{children}</FocusContext.Provider>
  );
};

// Hook to use focus context
export const useFocus = (): FocusContextType => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error("useFocus must be used within a FocusProvider");
  }
  return context;
};

export default FocusContext;
