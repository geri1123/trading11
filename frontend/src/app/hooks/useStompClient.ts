import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Cookies from 'js-cookie';
import { useEffect, useRef, useState } from 'react';

interface LivePairData {
  a?: number;
  b?: number;
  spread?: number;
}
type LiveDataMap = Record<string, LivePairData>;
type Callback = (data: LivePairData) => void;

let stompClient: Client | null = null;
let isConnected = false;
let onConnectCallbacks: (() => void)[] = [];

const pairListeners: Record<string, Set<Callback>> = {};
const pairRefCounts: Record<string, number> = {};
const pairSubscriptions: Record<string, () => void> = {};
const latestData: Record<string, LivePairData> = {};

const emitToListeners = (pair: string, data: LivePairData) => {
  if (pairListeners[pair]) {
    pairListeners[pair].forEach((cb) => cb(data));
  }
};

const initStomp = () => {
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

      // Re-subscribe to tracked pairs
      Object.keys(pairRefCounts).forEach((pair) => subscribePair(pair));
      console.log('✅ STOMP connected');
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame.headers['message']);
    },
  });

  stompClient.activate();
};

const awaitUntilConnected = (): Promise<void> => {
  if (isConnected) return Promise.resolve();
  return new Promise((resolve) => onConnectCallbacks.push(resolve));
};

const subscribePair = (pair: string) => {
  if (!pair || !stompClient || !isConnected || pairSubscriptions[pair]) return;

  stompClient.publish({
    destination: '/app/trade-price',
    body: JSON.stringify([pair]),
  });

  const subscription = stompClient.subscribe(
    `/user/queue/trade-price/${pair}`,
    (message: IMessage) => {
      const payload = JSON.parse(message.body);
      latestData[pair] = payload;
      emitToListeners(pair, payload);
    }
  );

  pairSubscriptions[pair] = () => {
    subscription.unsubscribe();
    delete pairSubscriptions[pair];
  };
};

const unsubscribePair = (pair: string) => {
  if (pairRefCounts[pair] <= 0) {
    pairSubscriptions[pair]?.();
    delete latestData[pair];
  }
};

const addListener = async (pair: string, callback: Callback) => {
  if (!pair) return;
  await awaitUntilConnected();

  if (!pairListeners[pair]) {
    pairListeners[pair] = new Set();
    pairRefCounts[pair] = 0;
  }

  pairListeners[pair].add(callback);
  pairRefCounts[pair] += 1;

  subscribePair(pair);

  // Emit latest cached data immediately
  if (latestData[pair]) {
    callback(latestData[pair]);
  }
};

const removeListener = (pair: string, callback: Callback) => {
  if (!pair) return;
  const listeners = pairListeners[pair];
  if (!listeners) return;

  listeners.delete(callback);
  pairRefCounts[pair] -= 1;

  if (pairRefCounts[pair] <= 0) {
    delete pairListeners[pair];
    delete pairRefCounts[pair];
    unsubscribePair(pair);
  }
};

// Auto-init stomp client
initStomp();

/**
 * Hook to subscribe to one pair.
 */
export const useSinglePairData = (pair: string) => {
  const [data, setData] = useState<LivePairData | null>(
    pair && latestData[pair] ? latestData[pair] : null
  );

  useEffect(() => {
    if (!pair) return;

    const listener = (newData: LivePairData) => setData({ ...newData });
    addListener(pair, listener);
    return () => removeListener(pair, listener);
  }, [pair]);

  return data;
};

/**
 * Hook to subscribe to multiple pairs.
 */
export const useMultiPairData = (pairs: string[]) => {
  const [dataMap, setDataMap] = useState<LiveDataMap>(() => {
    const initial: LiveDataMap = {};
    pairs.forEach((pair) => {
      if (pair && latestData[pair]) initial[pair] = latestData[pair];
    });
    return initial;
  });

  const bufferRef = useRef<LiveDataMap>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!pairs || pairs.length === 0) return;

    const listeners: Record<string, Callback> = {};

    pairs.forEach((pair) => {
      if (!pair) return;

      listeners[pair] = (newData: LivePairData) => {
        bufferRef.current[pair] = newData;

        if (!timerRef.current) {
          timerRef.current = setTimeout(() => {
            setDataMap((prev) => ({
              ...prev,
              ...bufferRef.current,
            }));
            bufferRef.current = {};
            timerRef.current = null;
          }, 100);
        }
      };
      addListener(pair, listeners[pair]);
    });

    return () => {
      pairs.forEach((pair) => {
        if (pair && listeners[pair]) {
          removeListener(pair, listeners[pair]);
        }
      });
    };
  }, [pairs.join(',')]);

  return dataMap;
};

/**
 * Fetches the latest data for a single pair once.
 * This is useful for initial data load or when you need the latest value without subscribing.
 */
export const fetchOnce = async (pair: string): Promise<LivePairData | null> => {
  return new Promise((resolve) => {
    const temp = (data: LivePairData) => {
      removeListener(pair, temp);
      resolve(data);
    };
    addListener(pair, temp);
  });
};
