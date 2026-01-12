// services/localNotification.js
import { Platform } from "react-native";

/**
 * Lazy-load expo-notifications to avoid native crashes
 * during App Store review / iPad cold start.
 */
async function getNotifications() {
  const Notifications = await import("expo-notifications");
  return Notifications;
}

export async function scheduleLocalNotification({ notifyAt, title, body }) {
  try {
    if (!notifyAt) return null;

    const trigger = new Date(notifyAt);
    if (isNaN(trigger.getTime()) || trigger.getTime() <= Date.now()) {
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
        title,
        body,
        data: {},
        sound: true,
      },
      trigger,
    });

    return id;
  } catch (err) {
    console.warn("scheduleLocalNotification error", err);
    return null;
  }
}

export async function cancelLocalNotification(notificationId) {
  if (!notificationId) return;

  try {
    const Notifications = await getNotifications();
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (err) {
    console.warn("cancelLocalNotification error", err);
  }
}
