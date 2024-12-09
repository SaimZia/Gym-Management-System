const axios = require('axios');

class AIChatbot {
  constructor() {
    this.apiKey = process.env.AI_STUDIO_API_KEY;
    this.apiUrl = 'https://api.aistudio.com/v1/chat/completions';
  }

  async generateResponse(message, context = []) {
    try {
      const response = await axios.post(this.apiUrl, {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful gym assistant who can provide information about workouts, nutrition, and general fitness advice."
          },
          ...context,
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate response');
    }
  }

  async getSuggestions(userProfile) {
    try {
      const userContext = `
        User Profile:
        - Fitness Level: ${userProfile.fitnessLevel}
        - Goals: ${userProfile.goals.join(', ')}
        - Restrictions: ${userProfile.restrictions.join(', ')}
        - Current Program: ${userProfile.currentProgram}
      `;

      const response = await axios.post(this.apiUrl, {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Generate personalized fitness suggestions based on user profile."
          },
          {
            role: "user",
            content: userContext
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      throw new Error('Failed to generate suggestions');
    }
  }

  async analyzeDietPlan(dietPlan) {
    try {
      const response = await axios.post(this.apiUrl, {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Analyze diet plan and provide recommendations."
          },
          {
            role: "user",
            content: JSON.stringify(dietPlan)
          }
        ],
        max_tokens: 250,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing diet plan:', error);
      throw new Error('Failed to analyze diet plan');
    }
  }

  async getWorkoutRecommendations(userMetrics) {
    try {
      const response = await axios.post(this.apiUrl, {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Provide workout recommendations based on user metrics."
          },
          {
            role: "user",
            content: JSON.stringify(userMetrics)
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error getting workout recommendations:', error);
      throw new Error('Failed to get workout recommendations');
    }
  }
}

module.exports = new AIChatbot();