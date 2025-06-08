// import axios from 'axios';
// import Cookies from 'js-cookie';

// export interface CreateOrderData {
//   instrument: string;
//   side: 'BUY' | 'SELL';
//   lotSize: number;
//   stopLoss: number;
//   takeProfit: number;
//   status: 'OPEN' | 'PENDING';
//   trailingStopEnabled: boolean;
//   riskEnabled: boolean;
//   pendingEntryPrice: number;
//   pendingOrderType: string;
//   pending: boolean;
// }
// export const createOrder = async (order: CreateOrderData): Promise<void> => {
//   const token = Cookies.get('token');
//   if (!token) throw new Error('No auth token found');

//   const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   try {
//     const response = await axios.post(`${BASE_URL}/api/orders`, order, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     console.log('✅ Order response:', response.data);
//     return response.data;
    
//   } catch (err: any) {
//     console.error('❌ Order creation failed:', err.response?.data || err.message);
//     throw err;
//   }
// };

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Order {
  // Define all order fields (instrument, status, etc.)
  instrument: string;
  status: 'OPEN' | 'CLOSED' | 'PENDING' | string;
  // ...other fields
}

interface TradeContextType {
  openOrders: Order[];
  closedOrders: Order[];
  pendingOrders: Order[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const useTradeContext = () => {
  const ctx = useContext(TradeContext);
  if (!ctx) throw new Error('useTradeContext must be used within TradeProvider');
  return ctx;
};

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    const token = Cookies.get('token');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tables/orders/history`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0 }
      });
      setOrders(res.data.content || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const openOrders = orders.filter(o => o.status === 'OPEN');
  const closedOrders = orders.filter(o => o.status === 'CLOSED');
  const pendingOrders = orders.filter(o => o.status === 'PENDING');

  return (
    <TradeContext.Provider value={{
      openOrders,
      closedOrders,
      pendingOrders,
      loading,
      error,
      refetch: fetchOrders,
    }}>
      {children}
    </TradeContext.Provider>
  );
};