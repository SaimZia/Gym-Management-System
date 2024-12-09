const nodemailer = require('nodemailer');
const config = require('../config/default.json');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendWelcomeEmail(user) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Welcome to Our Gym',
      html: `
        <h1>Welcome ${user.firstName}!</h1>
        <p>We're excited to have you join our gym. Here are some quick links to get started:</p>
        <ul>
          <li><a href="${process.env.FRONTEND_URL}/dashboard">Your Dashboard</a></li>
          <li><a href="${process.env.FRONTEND_URL}/packages">Our Packages</a></li>
          <li><a href="${process.env.FRONTEND_URL}/schedule">Class Schedule</a></li>
        </ul>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendSubscriptionConfirmation(user, subscription) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Subscription Confirmation',
      html: `
        <h1>Subscription Confirmed</h1>
        <p>Thank you for subscribing to our ${subscription.package.name} package.</p>
        <p>Details:</p>
        <ul>
          <li>Package: ${subscription.package.name}</li>
          <li>Duration: ${subscription.duration}</li>
          <li>Start Date: ${subscription.startDate}</li>
          <li>End Date: ${subscription.endDate}</li>
        </ul>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendPaymentConfirmation(user, payment) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Payment Confirmation',
      html: `
        <h1>Payment Received</h1>
        <p>We've received your payment. Here are the details:</p>
        <ul>
          <li>Amount: ${payment.amount}</li>
          <li>Date: ${payment.date}</li>
          <li>Transaction ID: ${payment.transactionId}</li>
        </ul>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();