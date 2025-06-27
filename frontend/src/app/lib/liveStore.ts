'use client';

import { useSyncExternalStore } from 'react';
import { stomp } from './stompClient';

// Types and local state                                             
export type LivePairData = { a?: number; b?: number; spread?: number };
export type TopWidgetData = {
  username: string;
  balance: number;
  trades: number;
  [k: string]: any;
};

type Listener = () => void;
const listeners = new Set<Listener>();

const state = {
  pairs: {} as Record<string, LivePairData>,
  widget: null as TopWidgetData | null,
};

// helpers
const subscribe = (list: Listener) => {
  listeners.add(list);
  return () => listeners.delete(list);
};
const emit = () => listeners.forEach((list) => list());

//  Update pairs in the store - This is called by the STOMP client when a new message arrives
export const updatePairs = (chunk: Record<string, LivePairData>) => {
  Object.assign(state.pairs, chunk);
  emit();
};

//  Update the top-widget data in the store - This is called by the STOMP client when a new message arrives
export const updateWidget = (payload: TopWidgetData) => {
  state.widget = payload;
  emit();
};

// Hook – re-renders only when *this* pair’s object reference changes
export const usePairData = (pair: string) =>
  useSyncExternalStore(
    subscribe,
    () => state.pairs[pair] ?? null,
    () => null,
  );

// Hook - One-shot snapshot helper
export const fetchOnce = async (
  pair: string,
): Promise<LivePairData | null> => {
  if (!pair) return null;
  if (state.pairs[pair]) return state.pairs[pair]; // cache hit

  await stomp.awaitConnected();
  const client = stomp.getClient();
  if (!client?.connected) return null;

  client.publish({
    destination: '/app/trade-price',
    body: JSON.stringify([pair]),
  });

  return new Promise((resolve) => {
    const sub = client.subscribe(
      `/user/queue/trade-price/${pair}`,
      (msg) => {
        const payload: LivePairData = JSON.parse(msg.body);
        state.pairs[pair] = payload;
        emit();
        sub.unsubscribe();
        resolve(payload);
      },
    );

    // 5-second safety timeout
    setTimeout(() => {
      sub.unsubscribe();
      resolve(null);
    }, 5000);
  });
};

// Hook – re-renders only when the top-widget data changes
export const useUserWidgetData = () =>
  useSyncExternalStore(
    subscribe,
    () => state.widget,
    () => null,
  );
