"use client"
import React, { createContext, useContext, useState, useCallback } from "react";
import { fetchTrades } from "@/api/apiTrades";

export type TradeStatus = 'OPEN' | 'PENDING' | 'CLOSED';

interface TradeCounts {
  OPEN: number;
  PENDING: number;
  CLOSED: number;
}

export interface Trade {
  id: string | number;
  instrument?: string;
  symbol?: string;
  side?: string;
  size?: number | string;
  status: TradeStatus;
  profitLoss?: number | string;
  createdAt?: string;
  entryMarket?: number | string;
  entryMarketPrice?: number | string;
  stopLoss?: number | string;
  takeProfit?: number | string;
  margin?: number | string;
  exposure?: number | string;
  fee?: number | string;
  swap?: number | string;
  ProfitLoss?: number | string;
  PositionID?: string | number;
  type?: string;
  closePrice?: number | string;
  exitPrice?: number | string;
  closedAt?: string;
  exitTime?: string;
  marginUsed?: number | string;
  orderId?: string | number;
  positionId?: string | number;
  [key: string]: any;
}

interface TradeContextType {
  counts: TradeCounts;
  trades: Trade[];
  activeTab: 'Position' | 'Pending' | 'Closed Position';
  setActiveTab: React.Dispatch<React.SetStateAction<'Position' | 'Pending' | 'Closed Position'>>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [counts, setCounts] = useState<TradeCounts>({ OPEN: 0, PENDING: 0, CLOSED: 0 });
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'Position' | 'Pending' | 'Closed Position'>('Position');

  const getStatusForTab = (tab: typeof activeTab): TradeStatus => {
    if (tab === 'Position') return 'OPEN';
    if (tab === 'Pending') return 'PENDING';
    return 'CLOSED';
  };

  const fetchCounts = useCallback(async () => {
    try {
      const [openRes, pendingRes, closedRes] = await Promise.all([
        fetchTrades({ status: 'OPEN', page: 0, size: 1 }),
        fetchTrades({ status: 'PENDING', page: 0, size: 1 }),
        fetchTrades({ status: 'CLOSED', page: 0, size: 1 }),
      ]);
      setCounts({
        OPEN: openRes.totalElements || 0,
        PENDING: pendingRes.totalElements || 0,
        CLOSED: closedRes.totalElements || 0,
      });
    } catch (error) {
      console.error("Failed to fetch trade counts", error);
    }
  }, []);

  const fetchActiveTabTrades = useCallback(async () => {
    setLoading(true);
    const data = await fetchTrades({
      status: getStatusForTab(activeTab),
      page: 0,
      size: 50,
      sort: ["createdAt,DESC"],
    });
    setTrades(data.content || []);
    setLoading(false);
  }, [activeTab]);

  const refreshData = useCallback(async () => {
    await fetchCounts();
    await fetchActiveTabTrades();
  }, [fetchCounts, fetchActiveTabTrades]);

const handleCloseTrade = useCallback(async (id: string | number) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trades/${id}/close?includeFeeAndSwap=true`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    toast.success(`Trade ${id} closed successfully!`);
    await refreshData();
  } catch (error) {
    toast.error('Failed to close trade.');
    console.error('Failed to close trade:', error);
  }
}, [refreshData]);
  React.useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  React.useEffect(() => {
    fetchActiveTabTrades();
  }, [fetchActiveTabTrades]);

  return (
    <TradeContext.Provider value={{
      counts,
      trades,
      activeTab,
      setActiveTab,
      loading,
      refreshData,
    }}>
      {children}
    </TradeContext.Provider>
  );
};

export function useTradeContext() {
  const ctx = useContext(TradeContext);
  if (!ctx) throw new Error("useTradeContext must be used within a TradeProvider");
  return ctx;
}