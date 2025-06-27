'use client';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Cookies from 'js-cookie';

type Listener = () => void;

class StompSingleton {
  private client: Client | null = null;
  private resolvers: (() => void)[] = [];
  private reconnectListeners = new Set<Listener>();
  isConnected = false;

  private createClient() {
    const token = Cookies.get('token');
    if (!token) return null;
    const url =
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/ws/forex?token=` + token;

    return new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      debug: () => { },
      onConnect: () => {
        this.isConnected = true;
        this.resolvers.forEach(r => r());
        this.resolvers = [];
        this.reconnectListeners.forEach(cb => cb());
      },
      onWebSocketClose: () => (this.isConnected = false),
      onStompError: f =>
        console.error('[STOMP]', f.headers['message']),
    });
  }

  private activate() {
    if (this.client) return;
    const c = this.createClient();
    if (!c) return;
    this.client = c;
    c.activate();
  }

  constructor() {
    if (typeof window !== 'undefined') this.activate();
  }

  awaitConnected() {
    if (this.isConnected) return Promise.resolve();
    return new Promise<void>(res => this.resolvers.push(res));
  }

  onReconnect(cb: Listener) {
    this.reconnectListeners.add(cb);
    return () => this.reconnectListeners.delete(cb);
  }

  getClient() {
    return this.client;
  }
}

export const stomp = new StompSingleton();
