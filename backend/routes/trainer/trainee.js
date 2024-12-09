// routes/trainer/trainee.js
const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { getTrainees, getTraineeDetails, assignWorkout } = require('../../controllers/trainer/traineeController');

// Basic routes without auth for testing
router.get('/', getTrainees);
router.get('/:id', getTraineeDetails);
router.post('/:id/workout', assignWorkout);

module.exports = router;