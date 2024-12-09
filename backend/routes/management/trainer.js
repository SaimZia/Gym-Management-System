// routes/management/trainer.js
const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const trainerController = require('../../controllers/management/trainerController');

// Basic routes without auth for testing
router.get('/', trainerController.listTrainers);
router.post('/', trainerController.addTrainer);
router.put('/:id', trainerController.updateTrainer);
router.get('/:id/schedule', trainerController.getTrainerSchedule);

module.exports = router;