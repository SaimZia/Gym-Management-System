// src/utils/validation.js

// Function to validate email addresses
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Function to validate password strength
export const validatePassword = (password) => {
  // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(String(password));
};

// Function to check if a field is required
export const validateRequired = (value) => {
  return value.trim() !== '';
};

// Function to validate phone numbers
export const validatePhoneNumber = (phoneNumber) => {
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(String(phoneNumber));
};