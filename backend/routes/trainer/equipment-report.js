// routes/trainer/equipment-report.js
const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const equipmentReportController = require('../../controllers/trainer/equipmentReportController');

// Basic routes without auth for testing
router.post('/report', equipmentReportController.reportDamagedEquipment);
router.get('/reports', equipmentReportController.getReports);
router.put('/report/:equipmentId/:reportId', equipmentReportController.updateReport);

module.exports = router;