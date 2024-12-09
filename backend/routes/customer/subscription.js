// routes/customer/subscription.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../../controllers/customer/subscriptionController');
const { auth } = require('../../middlewares/auth');

// Basic routes without auth for testing
router.get('/packages', subscriptionController.getAvailablePackages);
router.post('/subscribe', subscriptionController.subscribeToPackage);
router.get('/my-subscriptions', subscriptionController.getMySubscriptions);
router.post('/cancel/:subscriptionId', subscriptionController.cancelSubscription);

module.exports = router;