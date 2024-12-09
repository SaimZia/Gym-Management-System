// services/notificationService.js
const EmailService = require('../utils/emailService');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Equipment = require('../models/Equipment');
const admin = require('firebase-admin');

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

class NotificationService {
  constructor() {}


  async sendPushNotification(userId, notification) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.fcmToken) return;

      const message = {
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data || {},
        token: user.fcmToken
      };

      await admin.messaging().send(message);
    } catch (error) {
      throw error;
    }
  }

  async sendBulkPushNotifications(userIds, notification) {
    try {
      const users = await User.find({ _id: { $in: userIds }, fcmToken: { $exists: true } });
      const tokens = users.map(user => user.fcmToken);

      if (tokens.length === 0) return;

      const message = {
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data || {},
        tokens
      };

      await admin.messaging().sendMulticast(message);
    } catch (error) {
      throw error;
    }
  }

  async checkAndSendSubscriptionReminders() {
    try {
      const expiringSubscriptions = await Subscription.find({
        endDate: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        },
        reminderSent: false
      }).populate('customer');

      for (const subscription of expiringSubscriptions) {
        await Promise.all([
          EmailService.sendSubscriptionExpiryReminder(subscription.customer, subscription),
          this.sendPushNotification(subscription.customer._id, {
            title: 'Subscription Expiring Soon',
            body: 'Your gym subscription is expiring soon. Renew now to continue enjoying our services.'
          })
        ]);

        subscription.reminderSent = true;
        await subscription.save();
      }
    } catch (error) {
      throw error;
    }
  }

  async sendMaintenanceNotifications() {
    try {
      const equipmentNeedingMaintenance = await Equipment.find({
        nextMaintenanceDue: {
          $lte: new Date()
        },
        maintenanceReminderSent: false
    }).populate('gym');

    for (const equipment of equipmentNeedingMaintenance) {
      // Get management users of the gym
      const managers = await User.find({
        role: 'management',
        assignedGym: equipment.gym._id
      });

      // Send notifications to all managers
      for (const manager of managers) {
        await Promise.all([
          EmailService.sendMaintenanceReminder(manager, equipment),
          this.sendPushNotification(manager._id, {
            title: 'Equipment Maintenance Due',
            body: `Maintenance is due for ${equipment.name}`,
            data: {
              equipmentId: equipment._id.toString(),
              type: 'maintenance_reminder'
            }
          })
        ]);
      }

      equipment.maintenanceReminderSent = true;
      await equipment.save();
    }
  } catch (error) {
    throw error;
  }
}

async sendAttendanceReminders() {
  try {
    // Find users who haven't visited in 7 days
    const inactiveUsers = await User.aggregate([
      {
        $match: {
          role: 'customer',
          isActive: true,
          lastAttendance: {
            $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }
    ]);

    for (const user of inactiveUsers) {
      await Promise.all([
        EmailService.sendAttendanceReminder(user),
        this.sendPushNotification(user._id, {
          title: 'Missing You at the Gym!',
          body: "It's been a while since your last workout. Come back and stay on track!",
          data: {
            type: 'attendance_reminder'
          }
        })
      ]);
    }
  } catch (error) {
    throw error;
  }
}

async sendPaymentReminders() {
  try {
    const dueSubscriptions = await Subscription.find({
      nextPaymentDate: {
        $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      },
      paymentReminderSent: false
    }).populate('customer');

    for (const subscription of dueSubscriptions) {
      await Promise.all([
        EmailService.sendPaymentReminder(subscription.customer, subscription),
        this.sendPushNotification(subscription.customer._id, {
          title: 'Payment Reminder',
          body: 'Your subscription payment is due soon.',
          data: {
            subscriptionId: subscription._id.toString(),
            type: 'payment_reminder'
          }
        })
      ]);

      subscription.paymentReminderSent = true;
      await subscription.save();
    }
  } catch (error) {
    throw error;
  }
}

async sendNewClassNotification(classData) {
  try {
    const eligibleUsers = await User.find({
      role: 'customer',
      isActive: true,
      preferences: { $in: [classData.type] }
    });

    const notification = {
      title: 'New Class Available!',
      body: `New ${classData.name} class starting on ${classData.startDate}`,
      data: {
        classId: classData._id.toString(),
        type: 'new_class'
      }
    };

    await this.sendBulkPushNotifications(
      eligibleUsers.map(user => user._id),
      notification
    );

    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 50;
    for (let i = 0; i < eligibleUsers.length; i += batchSize) {
      const batch = eligibleUsers.slice(i, i + batchSize);
      await Promise.all(
        batch.map(user => EmailService.sendNewClassNotification(user, classData))
      );
    }
  } catch (error) {
    throw error;
  }
}

async sendScheduledNotifications() {
  try {
    await Promise.all([
      this.checkAndSendSubscriptionReminders(),
      this.sendMaintenanceNotifications(),
      this.sendAttendanceReminders(),
      this.sendPaymentReminders()
    ]);
  } catch (error) {
    throw error;
  }
}

async updateNotificationPreferences(userId, preferences) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...preferences
    };

    await user.save();
    return user.notificationPreferences;
  } catch (error) {
    throw error;
  }
}

async getNotificationHistory(userId, page = 1, limit = 10) {
  try {
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments({ user: userId });

    return {
      notifications,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (error) {
    throw error;
  }
}
}

module.exports = new NotificationService();