const express = require('express');
const router = express.Router();
const gymController = require('../../controllers/admin/gymController');
const { auth } = require('../../middlewares/auth');
const { adminAuth } = require('../../middlewares/admin-auth');

// Temporarily remove auth middleware for testing
router.post('/', gymController.addGym);
router.put('/:id', gymController.updateGym);
router.delete('/:id', gymController.deleteGym);
router.get('/', gymController.listGyms);
router.get('/:id', gymController.getGymDetails);

module.exports = router;