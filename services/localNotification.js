// services/localNotification.js
import * as Notifications from "expo-notifications";

export async function scheduleLocalNotification({ notifyAt, title, body }) {
  // notifyAt: Date or ISO string
  const trigger = new Date(notifyAt);
  const id = await Notifications.scheduleNotificationAsync({
    content: { title, body, data: {} },
    trigger,
  });
  return id; // save this id in reminder.localNotificationId
}

export async function cancelLocalNotification(notificationId) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (err) {
    console.warn("cancelLocalNotification error", err);
  }
}
