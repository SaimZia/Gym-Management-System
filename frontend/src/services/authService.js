// src/services/authService.js
import { post } from './api';

// Function to handle login
export const login = async (credentials) => {
  try {
    const response = await post('/customer/account/login', credentials);
    localStorage.setItem('token', response.token);
    return response.user;
  } catch (error) {
    throw error;
  }
};

// Function to handle logout
export const logout = () => {
  localStorage.removeItem('token');
};

// Function to check if the user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};