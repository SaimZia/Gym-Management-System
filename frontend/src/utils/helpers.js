// src/utils/helpers.js

// Function to format dates
export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Function to validate email addresses
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Function to capitalize the first letter of a string
export const capitalize = (string) => {
  if (typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to generate a random ID
export const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

// Function to calculate the age from a birthdate
export const calculateAge = (birthdate) => {
  const birthDate = new Date(birthdate);
  const difference = Date.now() - birthDate.getTime();
  const ageDate = new Date(difference);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};