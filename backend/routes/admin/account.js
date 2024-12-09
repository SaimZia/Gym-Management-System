const express = require('express');
const router = express.Router();
const accountController = require('../../controllers/admin/accountController');
const { auth } = require('../../middlewares/auth');
const { adminAuth } = require('../../middlewares/admin-auth');

// First, verify that your controller is imported correctly
console.log('Controller methods:', Object.keys(accountController));

// Then define your routes
router.route('/management')
    .get(auth, adminAuth, accountController.listManagementAccounts)
    .post(auth, adminAuth, accountController.createManagementAccount);

router.route('/management/:id')
    .put(auth, adminAuth, accountController.updateManagementAccount)
    .delete(auth, adminAuth, accountController.deleteManagementAccount);

router.get('/details', auth, adminAuth, accountController.viewAccountsDetails);

module.exports = router;