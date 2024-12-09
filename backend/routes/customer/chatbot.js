const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const ChatbotController = require('../../controllers/customer/chatbotController'); // Ensure correct path

router.post('/message', auth, ChatbotController.getChatbotResponse);
router.get('/history', auth, ChatbotController.getChatHistory);
router.delete('/history', auth, ChatbotController.clearChatHistory); // Ensure clearChatHistory is defined
router.get('/suggestions', auth, ChatbotController.getSuggestions);

module.exports = router;