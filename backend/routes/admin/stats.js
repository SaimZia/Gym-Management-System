const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const statsController = require('../../controllers/admin/statsController');

// Remove auth middleware temporarily for testing
router.get('/overview', statsController.getSystemStats);
router.get('/revenue', statsController.getRevenueStats);
router.get('/users', statsController.getUserStats);
router.get('/equipment', statsController.getEquipmentStats);

module.exports = router;