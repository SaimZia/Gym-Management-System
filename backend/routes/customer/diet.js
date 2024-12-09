// routes/customer/diet.js
const express = require('express');
const router = express.Router();
const dietController = require('../../controllers/customer/dietController');
const { auth } = require('../../middlewares/auth');

// Basic routes without auth for testing
router.get('/current', dietController.getCurrentDiet);
router.get('/history', dietController.getDietHistory);
router.post('/:dietId/progress', dietController.updateDietProgress);
router.get('/analytics', dietController.getDietAnalytics);

module.exports = router;