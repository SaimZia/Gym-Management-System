// routes/management/customer.js
const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const customerController = require('../../controllers/management/customerController');

// Test routes without authentication first
router.get('/', customerController.listCustomers);
router.get('/:id', customerController.getCustomerDetails);
router.put('/:id', customerController.updateCustomer);
router.get('/:id/attendance', customerController.getCustomerAttendance);

module.exports = router;