import io from 'socket.io-client';

// const SOCKET_URL = 'http://';
const SOCKET_URL ='http://192.168.1.62:6004'

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    socket.on('connect_error', error => {
      console.error('Socket.IO connection error:', error);
    });

    socket.on('disconnect', reason => {
      console.log('Socket.IO disconnected:', reason);
    });
  }
  return socket;
};

// Direct access to the singleton socket instance
export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
