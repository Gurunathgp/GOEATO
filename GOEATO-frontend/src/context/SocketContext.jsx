import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';
import { STORAGE_KEYS, SOCKET_CONFIG } from '../config/constants.js';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const socket = io(apiUrl, {
      auth: { token },
      transports: SOCKET_CONFIG.TRANSPORTS,
      reconnectionAttempts: SOCKET_CONFIG.RECONNECTION_ATTEMPTS,
      reconnectionDelay: SOCKET_CONFIG.RECONNECTION_DELAY,
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setIsConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  return useContext(SocketContext);
};

export const useSocketListener = (event, handler) => {
  const { socket } = useSocket();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket || !event) return;
    const listener = (...args) => {
      if (handlerRef.current) handlerRef.current(...args);
    };
    socket.on(event, listener);
    return () => {
      socket.off(event, listener);
    };
  }, [socket, event]);
};
