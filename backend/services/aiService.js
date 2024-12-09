// services/aiService.js

const axios = require('axios'); // Import axios for making HTTP requests

class AIService {
  constructor() {
    this.apiKey = process.env.AI_STUDIO_API_KEY;  // Your AI Studio API Key
    this.apiUrl = 'https://api.aistudio.com/v1/chat/completions';  // The API URL
  }

  // Method to get a response from the AI (Google AI Studio)
  async getResponse(message, customerId) {
    try {
      const response = await axios.post(this.apiUrl, {
        model: 'gpt-3.5-turbo', // The model name (use the one you need)
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }, // User's message
        ],
        max_tokens: 150,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,  // Pass the API key in the Authorization header
          'Content-Type': 'application/json',  // Content-Type header for JSON request
        }
      });

      // Extract and return the response from the API result
      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error('Error communicating with AI service: ' + error.message);
    }
  }
}

// Export the instance of AIService for usage elsewhere
module.exports = new AIService();
