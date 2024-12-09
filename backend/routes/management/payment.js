// routes/management/payment.js
const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const paymentController = require('../../controllers/management/paymentController');

// Basic routes without auth for testing
router.post('/trainer-salary', paymentController.processTrainerPayment);
router.post('/customer-payment', paymentController.recordCustomerPayment);
router.get('/history', paymentController.getPaymentHistory);
router.get('/analytics', paymentController.getPaymentAnalytics);
router.post('/refund/:paymentId', paymentController.processRefund);

module.exports = router;