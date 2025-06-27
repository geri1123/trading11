"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  startTransition,
  useContext,
} from "react";

import { stomp } from "@/lib/stompClient";
import {
  LivePairData,
  TopWidgetData,
  updatePairs,
  updateWidget,
} from "@/app/lib/liveStore";
import {
  addVisiblePair,
  removeVisiblePair,
  getVisiblePairs,
} from "@/lib/visiblePairs";

//  Context used by useVisiblePair / useEnsurePair
interface Ctx {
  markVisible(pair: string): void;
  markHidden(pair: string): void;
  ensurePair(pair: string | null): void;
}
export const PriceContext = createContext<Ctx>({
  markVisible: () => {},
  markHidden: () => {},
  ensurePair: () => {},
});

//  Provider – handles pairs + widget
export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // mutable refs
  const subs = useRef<Record<string, () => void>>({});
  const buffer = useRef<Record<string, LivePairData>>({});
  const latestRef = useRef<Record<string, LivePairData>>({});
  const rafId = useRef<number | null>(null);

  // batching via Raf
  const flush = () => {
    const chunk = buffer.current;
    buffer.current = {};
    rafId.current = null;
    if (!Object.keys(chunk).length) return;
    startTransition(() => updatePairs(chunk));
  };
  const scheduleFlush = () => {
    if (rafId.current === null) rafId.current = requestAnimationFrame(flush);
  };

  // pair-level subscription
  const subscribePair = async (pair: string) => {
    if (subs.current[pair]) return;

    await stomp.awaitConnected();
    const client = stomp.getClient();
    if (!client?.connected) return;

    client.publish({
      destination: "/app/trade-price",
      body: JSON.stringify([pair]),
    });

    const sub = client.subscribe(`/user/queue/trade-price/${pair}`, (msg) => {
      const payload: LivePairData = JSON.parse(msg.body);
      latestRef.current[pair] = payload; // cache

      if (getVisiblePairs().has(pair)) {
        buffer.current[pair] = payload;
        scheduleFlush();
      }
    });

    subs.current[pair] = () => sub.unsubscribe();
  };

  // public helpers for rows
  const markVisible = useCallback((pair: string) => {
    addVisiblePair(pair);
    subscribePair(pair);

    const cached = latestRef.current[pair];
    if (cached) startTransition(() => updatePairs({ [pair]: cached }));
  }, []);

  const markHidden = useCallback((pair: string) => {
    removeVisiblePair(pair);

    /* We keep subscriptions alive for a hot cache. Uncomment next two lines to free bandwidth. */
    // subs.current[pair]?.();
    // delete subs.current[pair];
  }, []);

  const ensurePair = useCallback((pair: string | null) => {
    if (!pair) return;
    subscribePair(pair);
  }, []);

  // User data widget subscription
  useEffect(() => {
    let unSub: undefined | (() => void);

    const subWidget = async () => {
      await stomp.awaitConnected();
      const client = stomp.getClient();
      if (!client?.connected) return;

      // backend trigger (remove if not needed)
      client.publish({
        destination: "/app/user-live-top-widget",
        body: "{}",
      });

      const widgetSub = client.subscribe(
        "/user/queue/user-live-top-widget",
        (msg) => {
          const payload: TopWidgetData = JSON.parse(msg.body);
          updateWidget(payload); // store + emit
        }
      );

      return () => widgetSub.unsubscribe();
    };

    subWidget().then((u) => (unSub = u));

    const off = stomp.onReconnect(() => {
      unSub?.();
      subWidget().then((u) => (unSub = u));
    });

    return () => {
      unSub?.();
      off();
    };
  }, []);

  // reconnect handling for pairs
  useEffect(() => {
    const off = stomp.onReconnect(() => {
      Object.values(subs.current).forEach((u) => u());
      subs.current = {};
      Object.keys(latestRef.current).forEach((p) => subscribePair(p));
    });

    return () => {
      off();
      Object.values(subs.current).forEach((u) => u());
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <PriceContext.Provider value={{ markVisible, markHidden, ensurePair }}>
      {children}
    </PriceContext.Provider>
  );
};

/** Hook: guarantee a pair is live-streamed (no visibility semantics) */
export const useEnsurePair = (pair: string | null) => {
  const { ensurePair } = useContext(PriceContext);
  useEffect(() => {
    ensurePair(pair);
  }, [pair, ensurePair]);
};
