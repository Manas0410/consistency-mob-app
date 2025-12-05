import * as Notifications from "expo-notifications";

// Schedule a one-time reminder at a specific date/time
export async function scheduleTaskReminderNotification({
  taskName,
  taskDescription,
  notifyAt, // JS Date
}: {
  taskName: string;
  taskDescription?: string;
  notifyAt: Date;
}): Promise<string | null> {
  if (!(notifyAt instanceof Date) || isNaN(notifyAt.getTime())) {
    console.log("Invalid notifyAt", notifyAt);
    return null;
  }
  if (notifyAt.getTime() <= Date.now()) {
    console.log("notifyAt is in the past, skipping");
    return null;
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: taskName || "Reminder",
      body: taskDescription || "You have something scheduled.",
      sound: true,
      data: { type: "TASK_REMINDER" },
    },
    trigger: notifyAt, // exact Date trigger
  });

  return id; // localNotificationId
}

export async function cancelTaskReminderNotification(
  localNotificationId?: string | null
) {
  if (!localNotificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(localNotificationId);
  } catch (e) {
    console.log("Failed to cancel local notification", e);
  }
}
