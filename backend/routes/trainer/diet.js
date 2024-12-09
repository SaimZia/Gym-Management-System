// routes/trainer/diet.js
const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const dietController = require('../../controllers/trainer/dietController');

// Basic routes without auth for testing
router.post('/:customerId', dietController.addDietPlan);
router.put('/:dietId', dietController.updateDietPlan);
router.delete('/:dietId', dietController.deleteDietPlan);
router.get('/customer/:customerId', dietController.getCustomerDietPlans);
router.post('/:dietId/progress', dietController.updateDietProgress);

module.exports = router;