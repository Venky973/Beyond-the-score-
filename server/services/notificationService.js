import Notification from '../models/Notification.js';
import { emitUserNotification } from './socketService.js';

export const sendNotification = async ({ recipient, title, message, type = 'system', link = '' }) => {
  try {
    if (!recipient) return null;

    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
      link
    });

    // Real-time socket broadcast
    emitUserNotification(recipient.toString(), notification);

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    return null;
  }
};
