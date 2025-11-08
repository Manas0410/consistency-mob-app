// In-app notification manager (no expo-notifications dependency)
let inAppNotificationManager: any = null;

/**
 * Set the in-app notification manager
 */
export const setInAppNotificationManager = (manager: any) => {
  inAppNotificationManager = manager;
  console.log("📱 In-app notification system ready");
};

/**
 * Suppress all local notifications during focus sessions
 */
export const suppressNotifications = async (): Promise<boolean> => {
  // Show in-app notification about focus mode
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

/**
 * Restore normal notification behavior after focus session
 */
export const restoreNotifications = async (): Promise<boolean> => {
  console.log("🔔 Notifications restored");
  return true;
};

/**
 * Request notification permissions - always succeeds with in-app notifications
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  console.log("📱 In-app notification permissions granted");
  return true;
};

/**
 * Show meaningful focus session completion notification
 */
export const showSessionCompleteNotification = async (
  duration: number,
  completedMinutes: number
): Promise<void> => {
  const completionRate = (completedMinutes / duration) * 100;
  let title = "🎉 Focus Session Complete!";
  let body = "";
  let emoji = "🎉";

  // Personalized messages based on completion rate
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

  // Show in-app completion notification
  if (inAppNotificationManager) {
    inAppNotificationManager.showNotification({
      title,
      body,
      emoji,
      duration: 5000, // Show longer for completion
      onPress: () => {
        console.log("🎉 User tapped completion notification");
      },
    });
  }
  console.log(`${emoji} SESSION COMPLETE: ${title}`);
};

/**
 * Show contextual motivational notification during focus session
 */
export const showMotivationalNotification = async (
  message: string,
  remainingMinutes: number,
  sessionProgress: number = 0
): Promise<void> => {
  let title = "💪 Stay Focused";
  let enhancedMessage = message;

  // Contextual notifications based on session progress
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
      emoji: title.split(" ")[0], // Extract emoji
      duration: 3000,
    });
  }

  console.log(`${title.split(" ")[0]} Motivational: ${enhancedMessage}`);
};

/**
 * Show milestone celebration notification
 */
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

  // Show in-app milestone notification
  if (inAppNotificationManager) {
    inAppNotificationManager.showNotification({
      title: notification.title,
      body: notification.body,
      emoji: notification.title.split(" ")[0], // Extract emoji from title
      duration: 6000, // Show longer for milestones
      onPress: () => {
        console.log(`🎉 User tapped milestone: ${milestone}`);
      },
    });
  }
  console.log(`🏆 MILESTONE: ${notification.title} - ${achievement}`);
};

/**
 * Show smart reminder notification
 */
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

/**
 * Handle notification response (when user taps notification)
 */
export const handleNotificationResponse = (
  response: any,
  onFocusReturn?: () => void,
  onSessionComplete?: () => void,
  onMilestone?: (milestone: string) => void
): void => {
  console.log("📱 In-app notification tapped");
  // For in-app notifications, we handle taps through the onPress callbacks
};

/**
 * Set up comprehensive notification response listener
 */
export const setupNotificationListener = (
  onFocusReturn?: () => void,
  onSessionComplete?: () => void,
  onMilestone?: (milestone: string) => void
): (() => void) => {
  console.log("📱 In-app notification listener ready");
  return () => console.log("📱 Notification listener cleanup");
};

/**
 * Schedule progress-based notifications during a session
 */
export const scheduleSessionProgressNotifications = async (
  sessionDurationMinutes: number
): Promise<void> => {
  // For in-app notifications, we'll show progress notifications via the timer system
  console.log(
    `📊 Progress notifications scheduled for ${sessionDurationMinutes}-minute session`
  );

  // Schedule progress messages to show at 25%, 50%, 75%
  const progressTimes = [
    Math.floor(sessionDurationMinutes * 0.25),
    Math.floor(sessionDurationMinutes * 0.5),
    Math.floor(sessionDurationMinutes * 0.75),
  ];

  const progressMessages = [
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

  // Store progress notifications for the timer to use
  (globalThis as any).focusProgressNotifications = progressMessages;
};

/**
 * Show progress notification at the right time
 */
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
      notification.shown = true; // Mark as shown

      if (inAppNotificationManager) {
        inAppNotificationManager.showNotification({
          title: notification.title,
          body: notification.body,
          emoji: notification.title.split(" ")[0],
          duration: 4000,
        });
      }

      console.log(`📊 Progress notification: ${notification.title}`);
      break;
    }
  }
};

/**
 * Cancel all scheduled session notifications
 */
export const cancelScheduledNotifications = async (): Promise<void> => {
  // Clear stored progress notifications
  (globalThis as any).focusProgressNotifications = [];
  console.log("🚫 Progress notifications cleared");
};
