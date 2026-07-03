import ActivityLog from '../models/ActivityLog.js';
import Notification from '../models/Notification.js';

export const logActivity = async (action, userId, details = '', ipAddress = '') => {
  try {
    await ActivityLog.create({
      action,
      user: userId,
      details,
      ipAddress
    });
  } catch (error) {
    console.error(`Error logging activity: ${error.message}`);
  }
};

export const createNotification = async (type, title, message, link = '') => {
  try {
    await Notification.create({
      type,
      title,
      message,
      link
    });
  } catch (error) {
    console.error(`Error creating notification: ${error.message}`);
  }
};
