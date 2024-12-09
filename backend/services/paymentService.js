// services/paymentService.js
const Payment = require('../models/Payment');
const User = require('../models/User');
const EmailService = require('../utils/emailService');
const APIError = require('../utils/apiError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  async processPayment(paymentData) {
    try {
      const { amount, currency, type, paymentMethod, userId, description } = paymentData;

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency,
        payment_method: paymentMethod,
        confirmation_method: 'manual',
        confirm: true
      });

      // Create payment record
      const payment = new Payment({
        amount,
        currency,
        type,
        paymentMethod,
        status: 'completed',
        payer: userId,
        transactionId: paymentIntent.id,
        description
      });

      await payment.save();

      // Send confirmation email
      const user = await User.findById(userId);
      await EmailService.sendPaymentConfirmation(user, payment);

      return payment;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentHistory(userId, filters = {}) {
    try {
      const query = { payer: userId };

      if (filters.startDate) {
        query.createdAt = { $gte: new Date(filters.startDate) };
      }
      if (filters.endDate) {
        query.createdAt = { ...query.createdAt, $lte: new Date(filters.endDate) };
      }
      if (filters.type) {
        query.type = filters.type;
      }
      if (filters.status) {
        query.status = filters.status;
      }

      const payments = await Payment.find(query)
        .sort({ createdAt: -1 })
        .populate('payer', 'firstName lastName email');

      return payments;
    } catch (error) {
      throw error;
    }
  }

  async processRefund(paymentId) {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new APIError('Payment not found', 404);
      }

      // Process refund through Stripe
      const refund = await stripe.refunds.create({
        payment_intent: payment.transactionId
      });

      // Update payment status
      payment.status = 'refunded';
      payment.refundId = refund.id;
      await payment.save();

      // Send refund confirmation email
      const user = await User.findById(payment.payer);
      await EmailService.sendRefundConfirmation(user, payment);

      return payment;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentAnalytics(filters = {}) {
    try {
      const matchStage = {};

      if (filters.startDate) {
        matchStage.createdAt = { $gte: new Date(filters.startDate) };
      }
      if (filters.endDate) {
        matchStage.createdAt = { 
          ...matchStage.createdAt, 
          $lte: new Date(filters.endDate) 
        };
      }

      const analytics = await Payment.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$type',
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
            avgAmount: { $avg: '$amount' }
          }
        }
      ]);

      return analytics;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PaymentService();