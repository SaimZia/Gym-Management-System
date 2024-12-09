const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const reportController = require('../../controllers/admin/reportController');

// Remove auth middleware temporarily for testing
router.get('/city/:city', reportController.generateCityReport);
router.get('/monthly/:month/:year', reportController.getMonthlyReport);
router.get('/custom', reportController.getCustomReport);

module.exports = router;