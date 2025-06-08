import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export type TradeType = 'OPEN' | 'PENDING' | 'CLOSED';

interface Trade {
  positionId: number;
  instrument: string;
  side: 'BUY' | 'SELL';
  entryPrice: number;
  // Add other fields...
}

interface TradeContextProps {
  trades: Trade[];
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  fetchTrades: (type: TradeType) => void;
  counts: Record<TradeType, number>;
}

const TradeContext = createContext<TradeContextProps | null>(null);

export const useTradeContext = () => {
  const context = useContext(TradeContext);
  if (!context) throw new Error('useTradeContext must be used inside TradeProvider');
  return context;
};

export const TradeProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState('Position');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({
    OPEN: 0,
    PENDING: 0,
    CLOSED: 0,
  });

  const fetchTrades = async (type: TradeType) => {
    try {
      setLoading(true);
      let url = '';
      switch (type) {
        case 'OPEN':
          url = '/api/tables/positions/open?page=0';
          break;
        case 'CLOSED':
          url = '/api/tables/positions/closed?page=0';
          break;
        case 'PENDING':
          url = '/api/tables/positions/pending?page=0'; // Update as per your actual API
          break;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${YOUR_TOKEN_HERE}`,
        },
      });

      setTrades(res.data.content || []);
      setCounts(prev => ({ ...prev, [type]: res.data.totalElements || 0 }));
    } catch (err) {
      console.error('Failed to fetch trades:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tabToTypeMap = {
      Position: 'OPEN',
      Pending: 'PENDING',
      'Closed Position': 'CLOSED',
    } as const;
    fetchTrades(tabToTypeMap[activeTab]);
  }, [activeTab]);

  return (
    <TradeContext.Provider value={{ trades, loading, activeTab, setActiveTab, fetchTrades, counts }}>
      {children}
    </TradeContext.Provider>
  );
};
