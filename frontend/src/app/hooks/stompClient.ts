// lib/stompClient.ts
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Cookies from 'js-cookie';

type Listener = () => void;
const reconnectListeners = new Set<Listener>();

let stompClient: Client | null = null;
let isConnected = false;
let onConnectCallbacks: Listener[] = [];

export const getStompClient = () => stompClient;

export const awaitUntilConnected = (): Promise<void> => {
  if (isConnected) return Promise.resolve();
  return new Promise((resolve) => onConnectCallbacks.push(resolve));
};

export const onStompReconnect = (callback: Listener) => {
  reconnectListeners.add(callback);
  return () => reconnectListeners.delete(callback); // cleanup
};

export const initStompClient = () => {
  if (stompClient || isConnected) return;

  const token = Cookies.get('token');
  if (!token) return;

  const socketUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ws/forex?token=${token}`;
  stompClient = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    reconnectDelay: 5000,
    onConnect: () => {
      isConnected = true;
      onConnectCallbacks.forEach((cb) => cb());
      onConnectCallbacks = [];

      reconnectListeners.forEach((cb) => cb()); // 🔥 notify listeners on reconnect
      console.log('✅ STOMP connected');
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame.headers['message']);
    },
  });

  stompClient.activate();
};

// Auto-init on import
initStompClient();
