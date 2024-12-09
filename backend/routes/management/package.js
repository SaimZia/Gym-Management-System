// routes/management/package.js
const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const packageController = require('../../controllers/management/packageController');

// Basic routes without auth for testing
router.get('/', packageController.listPackages);
router.post('/', packageController.createPackage);
router.get('/:id', packageController.getPackageDetails);
router.put('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

module.exports = router;