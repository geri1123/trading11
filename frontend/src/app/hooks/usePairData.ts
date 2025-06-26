import { useCallback, useEffect, useRef, useState } from 'react';
import { IMessage } from '@stomp/stompjs';
import { awaitUntilConnected, getStompClient } from './stompClient';

interface LivePairData {
    a?: number;
    b?: number;
    spread?: number;
}
type LiveDataMap = Record<string, LivePairData>;
type Callback = (data: LivePairData) => void;

const pairListeners: Record<string, Set<Callback>> = {};
const pairRefCounts: Record<string, number> = {};
const pairSubscriptions: Record<string, () => void> = {};
const latestData: Record<string, LivePairData> = {};

const emitToListeners = (pair: string, data: LivePairData) => {
    pairListeners[pair]?.forEach((cb) => cb(data));
};

const subscribePair = (pair: string) => {
    const client = getStompClient();
    if (!pair || !client?.connected || pairSubscriptions[pair]) return;

    client.publish({ destination: '/app/trade-price', body: JSON.stringify([pair]) });

    const subscription = client.subscribe(`/user/queue/trade-price/${pair}`, (message: IMessage) => {
        const payload = JSON.parse(message.body);
        latestData[pair] = payload;
        emitToListeners(pair, payload);
    });

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

export const useSinglePairData = (pair: string) => {
    const [data, setData] = useState<LivePairData | null>(
        pair && latestData[pair] ? latestData[pair] : null
    );

    // ✅ This ensures listener is stable across renders
    const listenerRef = useRef<Callback | null>(null);

    useEffect(() => {
        if (!pair) return;

        const listener: Callback = (newData: LivePairData) => {
            setData({ ...newData }); // safe shallow copy
        };

        listenerRef.current = listener;

        addListener(pair, listener);

        return () => {
            if (listenerRef.current) {
                removeListener(pair, listenerRef.current);
            }
        };
    }, [pair]);

    return data;
};


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
  const pairsRef = useRef<string[]>([]);

  useEffect(() => {
    const pairsChanged =
      pairs.length !== pairsRef.current.length ||
      pairs.some((p, i) => p !== pairsRef.current[i]);

    if (!pairsChanged) return;

    pairsRef.current = pairs;

    if (!pairs || pairs.length === 0) return;

    let isMounted = true;
    const listeners: Record<string, Callback> = {};

    pairs.forEach((pair) => {
      if (!pair) return;

      listeners[pair] = (newData: LivePairData) => {
        if (!isMounted) return;
        bufferRef.current[pair] = newData;

        if (!timerRef.current) {
          timerRef.current = setTimeout(() => {
            if (!isMounted) return;
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
      isMounted = false;
      pairs.forEach((pair) => {
        if (pair && listeners[pair]) {
          removeListener(pair, listeners[pair]);
        }
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pairs]); // now this is stable

  return dataMap;
};

export const fetchOnce = async (pair: string): Promise<LivePairData | null> => {
    return new Promise((resolve) => {
        const temp = (data: LivePairData) => {
            removeListener(pair, temp);
            resolve(data);
        };
        addListener(pair, temp);
    });
};

export const clearAllPairListeners = () => {
    Object.keys(pairListeners).forEach((pair) => {
        pairListeners[pair]?.clear();
        pairRefCounts[pair] = 0;
        pairSubscriptions[pair]?.();
        delete pairSubscriptions[pair];
    });
    Object.keys(latestData).forEach((key) => delete latestData[key]);
};