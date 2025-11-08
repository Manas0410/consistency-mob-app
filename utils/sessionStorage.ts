import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SessionLog {
  id: string;
  startTime: number;
  endTime: number;
  duration: number; // in minutes
  completedTime: number; // in minutes
  completed: boolean;
  interrupted: boolean;
  date: string; // YYYY-MM-DD format
  motivationalQuotes?: string[];
}

export interface SessionStats {
  totalSessions: number;
  totalFocusTime: number; // in minutes
  currentStreak: number; // days
  longestStreak: number; // days
  averageSessionTime: number; // in minutes
  completionRate: number; // percentage
  lastSessionDate: string;
  sessionsToday: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
}

export interface DailyStats {
  date: string;
  totalSessions: number;
  totalFocusTime: number;
  completedSessions: number;
  averageSessionTime: number;
}

const STORAGE_KEYS = {
  SESSION_LOGS: "@focus_session_logs",
  SESSION_STATS: "@focus_session_stats",
  DAILY_STATS: "@focus_daily_stats",
  CURRENT_SESSION: "@focus_current_session",
} as const;

/**
 * Save a completed session to storage
 */
export const saveSessionLog = async (
  session: Omit<SessionLog, "id">
): Promise<string> => {
  try {
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const sessionLog: SessionLog = {
      ...session,
      id: sessionId,
    };

    // Get existing logs
    const existingLogs = await getSessionLogs();
    const updatedLogs = [...existingLogs, sessionLog];

    // Keep only last 1000 sessions to prevent storage bloat
    const trimmedLogs = updatedLogs.slice(-1000);

    await AsyncStorage.setItem(
      STORAGE_KEYS.SESSION_LOGS,
      JSON.stringify(trimmedLogs)
    );

    // Update stats after saving session
    await updateSessionStats(sessionLog);

    return sessionId;
  } catch (error) {
    console.error("Failed to save session log:", error);
    throw error;
  }
};

/**
 * Get all session logs from storage
 */
export const getSessionLogs = async (): Promise<SessionLog[]> => {
  try {
    const logs = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_LOGS);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error("Failed to get session logs:", error);
    return [];
  }
};

/**
 * Get session logs for a specific date range
 */
export const getSessionLogsByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<SessionLog[]> => {
  try {
    const allLogs = await getSessionLogs();
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    return allLogs.filter((log) => log.date >= start && log.date <= end);
  } catch (error) {
    console.error("Failed to get session logs by date range:", error);
    return [];
  }
};

/**
 * Get today's session logs
 */
export const getTodaySessionLogs = async (): Promise<SessionLog[]> => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const allLogs = await getSessionLogs();
    return allLogs.filter((log) => log.date === today);
  } catch (error) {
    console.error("Failed to get today session logs:", error);
    return [];
  }
};

/**
 * Update session statistics
 */
const updateSessionStats = async (newSession: SessionLog): Promise<void> => {
  try {
    const currentStats = await getSessionStats();
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Calculate new stats
    const totalSessions = currentStats.totalSessions + 1;
    const totalFocusTime =
      currentStats.totalFocusTime + newSession.completedTime;
    const averageSessionTime = totalFocusTime / totalSessions;

    // Calculate completion rate
    const allLogs = await getSessionLogs();
    const completedSessions = allLogs.filter((log) => log.completed).length;
    const completionRate = (completedSessions / allLogs.length) * 100;

    // Calculate streak
    let currentStreak = currentStats.currentStreak;
    if (newSession.date === today) {
      if (
        currentStats.lastSessionDate === yesterday ||
        currentStats.lastSessionDate === today
      ) {
        currentStreak =
          currentStats.lastSessionDate === today
            ? currentStreak
            : currentStreak + 1;
      } else if (currentStats.lastSessionDate !== today) {
        currentStreak = 1; // Reset streak if there was a gap
      }
    }

    // Calculate sessions today
    const todayLogs = await getTodaySessionLogs();
    const sessionsToday = todayLogs.length;

    // Calculate sessions this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekLogs = await getSessionLogsByDateRange(weekStart, new Date());
    const sessionsThisWeek = weekLogs.length;

    // Calculate sessions this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthLogs = await getSessionLogsByDateRange(monthStart, new Date());
    const sessionsThisMonth = monthLogs.length;

    const updatedStats: SessionStats = {
      totalSessions,
      totalFocusTime,
      currentStreak,
      longestStreak: Math.max(currentStats.longestStreak, currentStreak),
      averageSessionTime,
      completionRate,
      lastSessionDate: newSession.date,
      sessionsToday,
      sessionsThisWeek,
      sessionsThisMonth,
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.SESSION_STATS,
      JSON.stringify(updatedStats)
    );

    // Update daily stats
    await updateDailyStats(newSession);
  } catch (error) {
    console.error("Failed to update session stats:", error);
  }
};

/**
 * Get session statistics
 */
export const getSessionStats = async (): Promise<SessionStats> => {
  try {
    const stats = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_STATS);
    if (stats) {
      return JSON.parse(stats);
    }

    // Return default stats if none exist
    const defaultStats: SessionStats = {
      totalSessions: 0,
      totalFocusTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      averageSessionTime: 0,
      completionRate: 0,
      lastSessionDate: "",
      sessionsToday: 0,
      sessionsThisWeek: 0,
      sessionsThisMonth: 0,
    };

    return defaultStats;
  } catch (error) {
    console.error("Failed to get session stats:", error);
    return {
      totalSessions: 0,
      totalFocusTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      averageSessionTime: 0,
      completionRate: 0,
      lastSessionDate: "",
      sessionsToday: 0,
      sessionsThisWeek: 0,
      sessionsThisMonth: 0,
    };
  }
};

/**
 * Update daily statistics
 */
const updateDailyStats = async (newSession: SessionLog): Promise<void> => {
  try {
    const existingDailyStats = await getDailyStats();
    const sessionDate = newSession.date;

    const existingDayStats = existingDailyStats.find(
      (stat) => stat.date === sessionDate
    );

    if (existingDayStats) {
      // Update existing day stats
      existingDayStats.totalSessions += 1;
      existingDayStats.totalFocusTime += newSession.completedTime;
      if (newSession.completed) {
        existingDayStats.completedSessions += 1;
      }
      existingDayStats.averageSessionTime =
        existingDayStats.totalFocusTime / existingDayStats.totalSessions;

      // Update the array
      const updatedStats = existingDailyStats.map((stat) =>
        stat.date === sessionDate ? existingDayStats : stat
      );

      await AsyncStorage.setItem(
        STORAGE_KEYS.DAILY_STATS,
        JSON.stringify(updatedStats)
      );
    } else {
      // Create new day stats
      const newDayStats: DailyStats = {
        date: sessionDate,
        totalSessions: 1,
        totalFocusTime: newSession.completedTime,
        completedSessions: newSession.completed ? 1 : 0,
        averageSessionTime: newSession.completedTime,
      };

      const updatedStats = [...existingDailyStats, newDayStats];

      // Keep only last 90 days of daily stats
      const trimmedStats = updatedStats.slice(-90);

      await AsyncStorage.setItem(
        STORAGE_KEYS.DAILY_STATS,
        JSON.stringify(trimmedStats)
      );
    }
  } catch (error) {
    console.error("Failed to update daily stats:", error);
  }
};

/**
 * Get daily statistics
 */
export const getDailyStats = async (): Promise<DailyStats[]> => {
  try {
    const stats = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_STATS);
    return stats ? JSON.parse(stats) : [];
  } catch (error) {
    console.error("Failed to get daily stats:", error);
    return [];
  }
};

/**
 * Save current session state (for persistence across app restarts)
 */
export const saveCurrentSession = async (sessionData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CURRENT_SESSION,
      JSON.stringify(sessionData)
    );
  } catch (error) {
    console.error("Failed to save current session:", error);
  }
};

/**
 * Get current session state
 */
export const getCurrentSession = async (): Promise<any | null> => {
  try {
    const session = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error("Failed to get current session:", error);
    return null;
  }
};

/**
 * Clear current session state
 */
export const clearCurrentSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  } catch (error) {
    console.error("Failed to clear current session:", error);
  }
};

/**
 * Clear all session data (for debugging or reset)
 */
export const clearAllSessionData = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.SESSION_LOGS),
      AsyncStorage.removeItem(STORAGE_KEYS.SESSION_STATS),
      AsyncStorage.removeItem(STORAGE_KEYS.DAILY_STATS),
      AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION),
    ]);
  } catch (error) {
    console.error("Failed to clear all session data:", error);
  }
};

/**
 * Export session data (for backup or sharing)
 */
export const exportSessionData = async (): Promise<string> => {
  try {
    const [logs, stats, dailyStats] = await Promise.all([
      getSessionLogs(),
      getSessionStats(),
      getDailyStats(),
    ]);

    const exportData = {
      logs,
      stats,
      dailyStats,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error("Failed to export session data:", error);
    throw error;
  }
};
