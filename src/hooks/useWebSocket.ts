// src/hooks/useWebSocket.ts
"use client";

import { useState, useEffect, useRef } from 'react';
import { WebSocketMessage } from '../types/notification';

interface UseWebSocketProps {
  url: string;
  onMessage: (data: WebSocketMessage) => void;
}

export const useWebSocket = ({ url, onMessage }: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = (token: string) => {
    try {
      // Create WebSocket connection
      const socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket Connected');
        
        // Send authentication message with token in header format
        socket.send(JSON.stringify({
          type: 'auth',
          headers: {
            Authorization: token
          }
        }));

        setIsConnected(true);
        setError(null);
      };

      socket.onclose = (event) => {
        console.log('WebSocket Disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (!isConnected && token) {
            console.log('Attempting to reconnect...');
            connect(token);
          }
        }, 3000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setError('Connection failed. Retrying...');
        setIsConnected(false);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'auth_success') {
            console.log('Authentication successful');
          } else if (data.type === 'auth_error') {
            setError('Authentication failed');
            socket.close();
          } else {
            onMessage(data);
          }
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    error,
    connect,
    disconnect
  };
};
