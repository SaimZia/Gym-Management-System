// utils/scheduler.js
const cron = require('node-cron');
const NotificationService = require('../services/notificationService');

const startScheduledJobs = () => {
  // Run notification checks every hour
  cron.schedule('0 * * * *', async () => {
    try {
      await NotificationService.sendScheduledNotifications();
    } catch (error) {
      console.error('Error in scheduled notifications:', error);
    }
  });
};

module.exports = { startScheduledJobs };