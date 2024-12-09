const AIChatbot = require('../../services/aiService'); // Import AIChatbot
require('dotenv').config();

class ChatbotController {
    // Get chatbot response
    static async getChatbotResponse(req, res) {
      try {
        const { message } = req.body;
        const customerId = req.user._id;
        console.log("AI API Key: ", process.env.AI_STUDIO_API_KEY); // Check if key is being loaded correctly

        // Get AI response
        const response = await AIChatbot.generateResponse(message, [{ role: "user", content: message }]);

        res.json({ response });
      } catch (error) {
        res.status(500).json({
          message: 'Error getting chatbot response',
          error: error.message
        });
      }
    }

    // Get chat history
    static async getChatHistory(req, res) {
        try {
          const customerId = req.user._id;
          const { limit = 50 } = req.query;
    
          const history = await ChatHistory.find({ customerId }).limit(limit);
          res.json({ history });
        } catch (error) {
          res.status(500).json({
            message: 'Error getting chat history',
            error: error.message
          });
        }
    }

    // Clear chat history
    static async clearChatHistory(req, res) {
        try {
          const customerId = req.user._id;
    
          await ChatHistory.deleteMany({ customerId });
          res.json({ message: 'Chat history cleared' });
        } catch (error) {
          res.status(500).json({
            message: 'Error clearing chat history',
            error: error.message
          });
        }
    }

    // Get suggestions
    static async getSuggestions(req, res) {
        try {
          const userProfile = req.user.profile;
    
          const suggestions = await AIChatbot.getSuggestions(userProfile);
          res.json({ suggestions });
        } catch (error) {
          res.status(500).json({
            message: 'Error getting suggestions',
            error: error.message
          });
        }
    }
}

module.exports = ChatbotController;