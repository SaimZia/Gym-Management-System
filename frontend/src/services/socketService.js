// src/services/socketService.js
import { io } from 'socket.io-client';

let socket;

// Function to initialize the Socket.IO connection
export const initSocket = (token) => {
  socket = io('http://localhost:5000', {
    auth: {
      token: `Bearer ${token}`,
    },
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });
};

// Function to emit events
export const emitEvent = (event, data) => {
  if (socket) {
    socket.emit(event, data);
  }
};

// Function to listen to events
export const onEvent = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  }
};

// Function to disconnect the socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};