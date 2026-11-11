import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // In dev, Socket.IO runs through the Vite proxy or on localhost:5005
    const socketInstance = io('/', {
      path: '/socket.io',
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      // Join general live scores feed
      socketInstance.emit('joinLiveFeed');

      // Join user specific notification channel if authenticated
      if (user?._id) {
        socketInstance.emit('joinUser', user._id);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // When user signs in or out, join or leave user room
  useEffect(() => {
    if (socket && user?._id) {
      socket.emit('joinUser', user._id);
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
