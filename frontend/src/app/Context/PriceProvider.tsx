"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useContext,
} from "react";
import { stomp } from "@/lib/stompClient";
import {
  LivePairData,
  TopWidgetData,
  updatePairs,
  updateWidget,
} from "@/app/lib/liveStore";

interface PriceCtx {
  setAllPairs(pairs: string[]): void; // master filter list
  setVisiblePairs(pairs: string[]): void; // rows currently on‑screen
  ensurePair(pair: string | null): void; // explicit single‑pair guarantee
}

export const PriceContext = createContext<PriceCtx>({
  setAllPairs: () => {},
  setVisiblePairs: () => {},
  ensurePair: () => {},
});

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const subs = useRef<Record<string, () => void>>({}); // pair → unsubscribe
  const latest = useRef<Record<string, LivePairData>>({}); // last tick for each pair
  const visible = useRef<Set<string>>(new Set()); // pairs currently on screen
  const allPairs = useRef<Set<string>>(new Set()); // filter list
  const sticky = useRef<Set<string>>(new Set()); // sticky pairs position table

  const buffer = useRef<Record<string, LivePairData>>({});
  const rafId = useRef<number | null>(null);
  const flush = () => {
    const chunk = buffer.current;
    buffer.current = {};
    rafId.current = null;
    if (Object.keys(chunk).length) updatePairs(chunk);
  };
  const push = (pair: string, tick: LivePairData) => {
    if (!visible.current.has(pair) && !sticky.current.has(pair)) return; // ignore off‑screen
    buffer.current[pair] = tick;
    if (rafId.current === null) rafId.current = requestAnimationFrame(flush);
  };

  // subscribe helper
  const subscribePair = useCallback(async (pair: string) => {
    if (subs.current[pair]) return; // already live

    await stomp.awaitConnected();
    const cli = stomp.getClient();
    if (!cli?.connected) return;

    cli.publish({
      destination: "/app/trade-price",
      body: JSON.stringify([pair]),
    });
    const sub = cli.subscribe(`/user/queue/trade-price/${pair}`, (msg) => {
      const tick: LivePairData = JSON.parse(msg.body);
      latest.current[pair] = tick;
      push(pair, tick);
    });
    subs.current[pair] = () => sub.unsubscribe();
  }, []);

  // public setters
  const setAllPairs = useCallback(
    (list: string[]) => {
      const next = new Set(list);

      // subscribe new ones
      list.forEach((pair) => {
        if (!allPairs.current.has(pair)) subscribePair(pair);
      });

      // unsubscribe removed ones
      allPairs.current.forEach((pair) => {
        if (!next.has(pair)) {
          subs.current[pair]?.();
          delete subs.current[pair];
        }
      });

      allPairs.current = next;
    },
    [subscribePair]
  );

  // set visible pairs, update only those that are already live
  const setVisiblePairs = useCallback((list: string[]) => {
    visible.current = new Set(list);
    const chunk: Record<string, LivePairData> = {};
    list.forEach((p) => {
      if (latest.current[p]) chunk[p] = latest.current[p];
    });
    if (Object.keys(chunk).length) updatePairs(chunk);
  }, []);

  // Ensure a single pair stays streamed even if it's not in the table
  const ensurePair = useCallback(
    (pair: string | null) => {
      if (!pair) return;
      sticky.current.add(pair); // keep streaming even when off-screen
      subscribePair(pair);
      if (latest.current[pair]) updatePairs({ [pair]: latest.current[pair] });
    },
    [subscribePair]
  );

  // top‑widget live stream
  useEffect(() => {
    let unSub: (() => void) | undefined;

    const subscribeWidget = async () => {
      await stomp.awaitConnected();
      const cli = stomp.getClient();
      if (!cli?.connected) return;

      cli.publish({ destination: "/app/user-live-top-widget", body: "{}" });
      const s = cli.subscribe("/user/queue/user-live-top-widget", (m) =>
        updateWidget(JSON.parse(m.body) as TopWidgetData)
      );
      unSub = () => s.unsubscribe();
    };

    // Initial call
    subscribeWidget();

    // Reconnect handling
    const off = stomp.onReconnect(() => {
      unSub?.(); // cleanup old one
      subscribeWidget();
    });

    return () => {
      unSub?.();
      off();
    };
  }, []);

  // reconnect resilience for pair
  useEffect((): any => {
    const off = stomp.onReconnect(() => {
      // resubscribe all active pairs
      Object.values(subs.current).forEach((u) => u());
      subs.current = {};
      allPairs.current.forEach(subscribePair);
    });
    return () => off();
  }, [subscribePair]);

  // expose ctx value
  const ctx = useMemo<PriceCtx>(
    () => ({ setAllPairs, setVisiblePairs, ensurePair }),
    [setAllPairs, setVisiblePairs, ensurePair]
  );

  return <PriceContext.Provider value={ctx}>{children}</PriceContext.Provider>;
};

// Convenience hook so other components can call `useEnsurePair("EUR/USD")`.
export const useEnsurePair = (pair: string | null) => {
  const { ensurePair } = useContext(PriceContext);
  useEffect(() => {
    ensurePair(pair);
  }, [pair, ensurePair]);
};
