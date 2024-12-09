// src/services/chatbotService.js
import { post } from './api';

// Function to send a message to the chatbot
export const sendMessage = async (message) => {
  try {
    const response = await post('/chatbot/message', { message });
    return response;
  } catch (error) {
    throw error;
  }
};