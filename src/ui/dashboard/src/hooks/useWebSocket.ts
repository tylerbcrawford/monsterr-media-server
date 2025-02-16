import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { WebSocketMessage } from '../types';

export function useWebSocket(url: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io(url, {
      reconnectionDelayMax: 10000,
      reconnection: true,
      reconnectionAttempts: Infinity,
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [url]);

  return socketRef.current;
}

export function useWebSocketEvent<T>(
  socket: Socket | null,
  event: string,
  callback: (data: T) => void
) {
  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, event, callback]);
}