// routes/management/equipment.js
const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const equipmentController = require('../../controllers/management/equipmentController');

// Basic routes without auth for testing
router.get('/', equipmentController.listEquipment);
router.post('/', equipmentController.addEquipment);
router.put('/:id', equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);
router.post('/:equipmentId/maintenance', equipmentController.logMaintenance);
router.get('/:equipmentId/maintenance', equipmentController.getMaintenanceHistory);

module.exports = router;