const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getProfile, 
    updateProfile 
} = require('../../controllers/customer/accountController');
const { auth } = require('../../middlewares/auth');

// Define the routes correctly
// fully tested
// Public routes
router.post('/register', register); // Use the `register` function from accountController
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Test route for debugging
router.get('/test', (req, res) => {
    res.json({ message: 'Test route works' });
});

module.exports = router;
