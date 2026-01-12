// notifications.ts (SAFE FOR APP STORE + NEW ARCH)

import { Platform } from "react-native";

/**
 * Lazy-load expo-notifications to prevent
 * iOS abort() on cold start / App Store review devices
 */
async function getNotifications() {
  const Notifications = await import("expo-notifications");
  return Notifications;
}

// -----------------------------
// SYSTEM / LOCAL NOTIFICATIONS
// -----------------------------

// Schedule a one-time reminder at a specific date/time
export async function scheduleTaskReminderNotification({
  taskName,
  taskDescription,
  notifyAt,
}: {
  taskName: string;
  taskDescription?: string;
  notifyAt: Date;
}): Promise<string | null> {
  try {
    if (!(notifyAt instanceof Date) || isNaN(notifyAt.getTime())) {
      console.log("Invalid notifyAt", notifyAt);
      return null;
    }

    if (notifyAt.getTime() <= Date.now()) {
      console.log("notifyAt is in the past, skipping");
      return null;
    }

    const Notifications = await getNotifications();

    if (Platform.OS === "ios") {
      const perms = await Notifications.getPermissionsAsync();
      if (perms.status !== "granted") {
        console.log("Notification permission not granted");
        return null;
      }
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: taskName || "Reminder",
        body: taskDescription || "You have something scheduled.",
        sound: true,
        data: { type: "TASK_REMINDER" },
      },
      trigger: notifyAt,
    });

    return id;
  } catch (e) {
    console.warn("scheduleTaskReminderNotification error", e);
    return null;
  }
}

export async function cancelTaskReminderNotification(
  localNotificationId?: string | null
) {
  if (!localNotificationId) return;

  try {
    const Notifications = await getNotifications();
    await Notifications.cancelScheduledNotificationAsync(localNotificationId);
  } catch (e) {
    console.log("Failed to cancel local notification", e);
  }
}

// -----------------------------
// IN-APP NOTIFICATION SYSTEM
// -----------------------------

let inAppNotificationManager: any = null;

export const setInAppNotificationManager = (manager: any) => {
  inAppNotificationManager = manager;
  console.log("📱 In-app notification system ready");
};

export const suppressNotifications = async (): Promise<boolean> => {
  const motivationalMessages = [
    "Deep work in progress - your future self will thank you! 💪",
    "Focused mind, extraordinary results. Stay in the zone! 🎯",
    "Building greatness, one focused minute at a time. 🚀",
    "Your peak performance mode is ON. Keep going! ⚡",
    "Distraction-free zone activated. Excellence in progress! 🌟",
  ];

  const randomMessage =
    motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ];

  if (inAppNotificationManager) {
    inAppNotificationManager.showNotification({
      title: "🧘‍♀️ Deep Focus Active",
      body: randomMessage,
      emoji: "🧘‍♀️",
      duration: 3000,
    });
  }

  console.log("🔕 Focus mode notification shown");
  return true;
};

export const restoreNotifications = async (): Promise<boolean> => {
  console.log("🔔 Notifications restored");
  return true;
};

export const requestNotificationPermissions = async (): Promise<boolean> => {
  console.log("📱 In-app notification permissions granted");
  return true;
};

export const showSessionCompleteNotification = async (
  duration: number,
  completedMinutes: number
): Promise<void> => {
  const completionRate = (completedMinutes / duration) * 100;
  let title = "🎉 Focus Session Complete!";
  let body = "";
  let emoji = "🎉";

  if (completionRate >= 100) {
    emoji = "🏆";
    title = `${emoji} Perfect Focus Session!`;
    const perfectMessages = [
      `Outstanding! You completed ${duration} minutes of pure focus. You're building unstoppable momentum! 🚀`,
      `Incredible discipline! ${duration} minutes of deep work accomplished. Your productivity is inspiring! ⭐`,
      `Flawless execution! You just proved what focused determination can achieve. Keep this energy! 💎`,
      `Masterful focus! ${duration} minutes of uninterrupted productivity. You're in your element! 🌟`,
    ];
    body = perfectMessages[Math.floor(Math.random() * perfectMessages.length)];
  } else if (completionRate >= 80) {
    emoji = "🎯";
    title = `${emoji} Excellent Focus Session!`;
    body = `Great work! ${completedMinutes}/${duration} minutes completed (${Math.round(
      completionRate
    )}%). Your consistency is building powerful habits! 💪`;
  } else if (completionRate >= 60) {
    emoji = "👏";
    title = `${emoji} Good Focus Session!`;
    body = `Nice effort! ${completedMinutes}/${duration} minutes focused (${Math.round(
      completionRate
    )}%). Every focused minute counts toward your goals! 🌱`;
  } else if (completionRate >= 30) {
    emoji = "🌟";
    title = `${emoji} Progress Made!`;
    body = `You focused for ${completedMinutes} minutes! That's ${Math.round(
      completionRate
    )}% progress. Small wins lead to big victories! 🚀`;
  } else {
    emoji = "💪";
    title = `${emoji} Every Step Counts!`;
    body = `You started and that matters! ${completedMinutes} minutes of focus is better than zero. Tomorrow will be even better! 🌅`;
  }

  if (inAppNotificationManager) {
    inAppNotificationManager.showNotification({
      title,
      body,
      emoji,
      duration: 5000,
    });
  }

  console.log(`${emoji} SESSION COMPLETE: ${title}`);
};

export const showMotivationalNotification = async (
  message: string,
  remainingMinutes: number,
  sessionProgress: number = 0
): Promise<void> => {
  let title = "💪 Stay Focused";
  let enhancedMessage = message;

  if (sessionProgress >= 75) {
    title = "🔥 Final Sprint!";
    enhancedMessage = `You're in the home stretch! ${remainingMinutes} minutes to victory! 🏁`;
  } else if (sessionProgress >= 50) {
    title = "⚡ Momentum Building";
    enhancedMessage = `Halfway there and crushing it! ${remainingMinutes} minutes of focused power ahead! 💎`;
  } else if (sessionProgress >= 25) {
    title = "🎯 Finding Your Flow";
    enhancedMessage = `Great start! You're finding your rhythm. ${remainingMinutes} minutes to go! 🌊`;
  } else {
    title = "🚀 Deep Work Mode";
    enhancedMessage = `Fresh start, clear mind! ${remainingMinutes} minutes of pure potential ahead! ✨`;
  }

  if (inAppNotificationManager) {
    inAppNotificationManager.showNotification({
      title,
      body: enhancedMessage,
      emoji: title.split(" ")[0],
      duration: 3000,
    });
  }

  console.log(`${title.split(" ")[0]} Motivational: ${enhancedMessage}`);
};

export const showMilestoneNotification = async (
  milestone: string,
  achievement: string
): Promise<void> => {
  const milestoneMessages = {
    first_session: {
      title: "🌟 First Focus Session!",
      body: `Congratulations on your first focused session! You've taken the first step toward mastering deep work. ${achievement} 🎯`,
    },
    streak_milestone: {
      title: "🔥 Focus Streak Milestone!",
      body: `Amazing! ${achievement} Your consistency is building unstoppable momentum! 🚀`,
    },
    total_time: {
      title: "⏰ Time Mastery Achievement!",
      body: `Incredible! ${achievement} You're proving that focused time creates extraordinary results! 💎`,
    },
    perfect_week: {
      title: "👑 Perfect Focus Week!",
      body: `Outstanding discipline! ${achievement} You're developing the habits of highly successful people! ⭐`,
    },
  };

  const notification = milestoneMessages[
    milestone as keyof typeof milestoneMessages
  ] || {
    title: "🎉 Achievement Unlocked!",
    body: achievement,
  };

  if (inAppNotificationManager) {
    inAppNotificationManager.showNotification({
      title: notification.title,
      body: notification.body,
      emoji: notification.title.split(" ")[0],
      duration: 6000,
    });
  }

  console.log(`🏆 MILESTONE: ${notification.title} - ${achievement}`);
};

export const showSmartReminder = async (
  reminderType: "daily_goal" | "comeback" | "streak_risk",
  customMessage?: string
): Promise<void> => {
  let title = "";
  let body = "";
  let emoji = "💡";

  switch (reminderType) {
    case "daily_goal":
      title = "🎯 Daily Goal Reminder";
      emoji = "🎯";
      body =
        customMessage ||
        "You haven't reached your daily focus goal yet. A 25-minute session could make all the difference! 💪";
      break;
    case "comeback":
      title = "🌅 Welcome Back!";
      emoji = "🌅";
      body =
        customMessage ||
        "Ready to get back into your focus flow? Your mind is fresh and ready for deep work! ✨";
      break;
    case "streak_risk":
      title = "🔥 Protect Your Streak!";
      emoji = "🔥";
      body =
        customMessage ||
        "Don't break the chain! One focused session today keeps your momentum strong! 🚀";
      break;
  }

  if (inAppNotificationManager) {
    inAppNotificationManager.showNotification({
      title,
      body,
      emoji,
      duration: 4000,
    });
  }

  console.log(`💡 Smart reminder: ${reminderType}`);
};

export const handleNotificationResponse = () => {
  console.log("📱 In-app notification tapped");
};

export const setupNotificationListener = () => {
  console.log("📱 In-app notification listener ready");
  return () => console.log("📱 Notification listener cleanup");
};

export const scheduleSessionProgressNotifications = async (
  sessionDurationMinutes: number
): Promise<void> => {
  const progressTimes = [
    Math.floor(sessionDurationMinutes * 0.25),
    Math.floor(sessionDurationMinutes * 0.5),
    Math.floor(sessionDurationMinutes * 0.75),
  ];

  (globalThis as any).focusProgressNotifications = [
    {
      time: progressTimes[0],
      title: "🎯 Quarter Way There!",
      body: "Great start! You're finding your focus rhythm. Keep building that momentum! 🌊",
    },
    {
      time: progressTimes[1],
      title: "⚡ Halfway Champion!",
      body: "Outstanding! You're in the flow zone. This is where the magic happens! 💎",
    },
    {
      time: progressTimes[2],
      title: "🔥 Final Sprint Time!",
      body: "Almost there! Push through this final stretch. Victory is within reach! 🏁",
    },
  ];
};

export const showProgressNotification = async (
  elapsedMinutes: number
): Promise<void> => {
  const progressNotifications =
    (globalThis as any).focusProgressNotifications || [];

  for (const notification of progressNotifications) {
    if (
      Math.abs(elapsedMinutes - notification.time) < 0.5 &&
      !notification.shown
    ) {
      notification.shown = true;

      if (inAppNotificationManager) {
        inAppNotificationManager.showNotification({
          title: notification.title,
          body: notification.body,
          emoji: notification.title.split(" ")[0],
          duration: 4000,
        });
      }
      break;
    }
  }
};

export const cancelScheduledNotifications = async (): Promise<void> => {
  (globalThis as any).focusProgressNotifications = [];
  console.log("🚫 Progress notifications cleared");
};
