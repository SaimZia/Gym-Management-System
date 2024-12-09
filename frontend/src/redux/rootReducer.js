// src/redux/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gymReducer from './slices/gymSlice';
import userReducer from './slices/userSlice';

// Combine the reducers
const rootReducer = combineReducers({
  auth: authReducer,
  gyms: gymReducer,
  users: userReducer,
  // Add other reducers here
});

export default rootReducer;