// "use client"
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import axios from 'axios';

// export type TradeType = 'OPEN' | 'PENDING' | 'CLOSED';

// // Updated interface to match your API response
// interface Trade {
//   positionId: number;
//   instrument: string;
//   side: 'BUY' | 'SELL';
//   lotSize: number;
//   entryPrice: number;
//   stopLoss: number;
//   takeProfit: number;
//   exposure: number;
//   margin: number;
//   openedAt: string;
//   fee: number;
//   swap: number;
//   profitLoss: number;
//   orders?: Array<{
//     orderId: number;
//     entryPrice: number;
//     lotSize: number;
//     placedAt: string;
//     type: string;
//     status: string;
//   }>;
// }

// interface ApiResponse {
//   totalElements: number;
//   totalPages: number;
//   first: boolean;
//   last: boolean;
//   size: number;
//   content: Trade[];
//   number: number;
//   numberOfElements: number;
//   empty: boolean;
// }

// interface TradeContextProps {
//   trades: Trade[];
//   loading: boolean;
//   error: string | null;
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
//   fetchTrades: (type: TradeType, page?: number) => Promise<void>;
//   counts: Record<TradeType, number>;
//   pagination: {
//     currentPage: number;
//     totalPages: number;
//     totalElements: number;
//   };
// }

// const TradeContext = createContext<TradeContextProps | null>(null);

// export const useTradeContext = () => {
//   const context = useContext(TradeContext);
//   if (!context) throw new Error('useTradeContext must be used inside TradeProvider');
//   return context;
// };

// export const TradeProvider = ({ children }: { children: React.ReactNode }) => {
//   const [activeTab, setActiveTab] = useState('Position');
//   const [trades, setTrades] = useState<Trade[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [counts, setCounts] = useState<Record<TradeType, number>>({
//     OPEN: 0,
//     PENDING: 0,
//     CLOSED: 0,
//   });
//   const [pagination, setPagination] = useState({
//     currentPage: 0,
//     totalPages: 0,
//     totalElements: 0,
//   });

//   const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const fetchTrades = async (type: TradeType, page: number = 0) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       let url = '';
//       switch (type) {
//         case 'OPEN':
//           url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tables/positions/open?page=${page}`;
//           break;
//         case 'CLOSED':
//           url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tables/positions/closed?page=${page}`;
//           break;
//         // case 'PENDING':
          
//         //   url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tables/positions/pending?page=${page}`;
//         //   break;
//         default:
//           throw new Error(`Unknown trade type: ${type}`);
//       }

//       const response = await axios.get<ApiResponse>(url, {
//           withCredentials: true,
//         headers: {
//           'Content-Type': 'application/json',
//           // Add authentication headers if needed
//           // 'Authorization': `Bearer ${token}`,
//         },
//       });

//       const data = response.data;
      
//       setTrades(data.content || []);
//       setCounts(prev => ({ ...prev, [type]: data.totalElements || 0 }));
//       setPagination({
//         currentPage: data.number || 0,
//         totalPages: data.totalPages || 0,
//         totalElements: data.totalElements || 0,
//       });

//     } catch (err) {
//       console.error('Failed to fetch trades:', err);
//       setError(err instanceof Error ? err.message : 'Failed to fetch trades');
//       setTrades([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch trades when active tab changes
//   useEffect(() => {
//     const tabToTypeMap: Record<string, TradeType> = {
//       'Position': 'OPEN',
//       'Pending': 'PENDING',
//       'Closed Position': 'CLOSED',
//     };
    
//     const tradeType = tabToTypeMap[activeTab];
//     if (tradeType) {
//       fetchTrades(tradeType, 0);
//     }
//   }, [activeTab]);


// useEffect(() => {
//   const fetchAllCounts = async () => {
//     try {
//       const [openRes, closedRes] = await Promise.all([
//         axios.get<ApiResponse>(`${BASE_URL}/api/tables/positions/open?page=0`, { withCredentials: true }),
//         axios.get<ApiResponse>(`${BASE_URL}/api/tables/positions/closed?page=0`, { withCredentials: true }),
//         // Add pending if the endpoint exists
//         // axios.get<ApiResponse>(`${BASE_URL}/api/tables/positions/pending?page=0`, { withCredentials: true }),
//       ]);

//       setCounts({
//         OPEN: openRes.data.totalElements || 0,
//         CLOSED: closedRes.data.totalElements || 0,
//         PENDING: 0, // Update this when you have the pending endpoint
//       });
//     } catch (err) {
//       console.error('Failed to fetch counts:', err);
//     }
//   };

//   fetchAllCounts();
// }, []);

//   const contextValue: TradeContextProps = {
//     trades,
//     loading,
//     error,
//     activeTab,
//     setActiveTab,
//     fetchTrades,
//     counts,
//     pagination,
//   };

//   return (
//     <TradeContext.Provider value={contextValue}>
//       {children}
//     </TradeContext.Provider>
//   );
// };
"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // New import

export type TradeType = 'OPEN' | 'PENDING' | 'CLOSED';


interface Trade {
  positionId: number;
  instrument: string;
  side: 'BUY' | 'SELL';
  lotSize: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  exposure: number;
  margin: number;
  openedAt: string;
  fee: number;
  swap: number;
  profitLoss: number;
  orders?: Array<{
    orderId: number;
    entryPrice: number;
    lotSize: number;
    placedAt: string;
    type: string;
    status: string;
  }>;
}

interface ApiResponse {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: Trade[];
  number: number;
  numberOfElements: number;
  empty: boolean;
}

interface TradeContextProps {
  trades: Trade[];
  loading: boolean;
  error: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  fetchTrades: (type: TradeType, page?: number) => Promise<void>;
  counts: Record<TradeType, number>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
  };
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
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<TradeType, number>>({
    OPEN: 0,
    PENDING: 0,
    CLOSED: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Function to get token from cookies
  const getAuthToken = () => Cookies.get('token');

  const fetchTrades = async (type: TradeType, page: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      let url = '';
      switch (type) {
        case 'OPEN':
          url = `${BASE_URL}/api/tables/positions/open?page=${page}`;
          break;
        case 'CLOSED':
          url = `${BASE_URL}/api/tables/positions/closed?page=${page}`;
          break;
        // case 'PENDING':
        //   url = `${BASE_URL}/api/tables/positions/pending?page=${page}`;
        //   break;
        default:
          throw new Error(`Unknown trade type: ${type}`);
      }

      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found.');

      const response = await axios.get<ApiResponse>(url, {
        //  withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;

      setTrades(data.content || []);
      setCounts(prev => ({ ...prev, [type]: data.totalElements || 0 }));
      setPagination({
        currentPage: data.number || 0,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
      });

    } catch (err) {
      console.error('Failed to fetch trades:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch trades');
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trades when active tab changes
  useEffect(() => {
    const tabToTypeMap: Record<string, TradeType> = {
      'Position': 'OPEN',
      'Pending': 'PENDING',
      'Closed Position': 'CLOSED',
    };

    const tradeType = tabToTypeMap[activeTab];
    if (tradeType) {
      fetchTrades(tradeType, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    const fetchAllCounts = async () => {
      try {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token found.');

        const [openRes, closedRes] = await Promise.all([
          axios.get<ApiResponse>(`${BASE_URL}/api/tables/positions/open?page=0`, {
            //  withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${token}`,
            },
          }),
          axios.get<ApiResponse>(`${BASE_URL}/api/tables/positions/closed?page=0`, {
             withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${token}`,
            },
          }),
          // Add pending if the endpoint exists
          // axios.get<ApiResponse>(`${BASE_URL}/api/tables/positions/pending?page=0`, { headers: { ... } }),
        ]);

        setCounts({
          OPEN: openRes.data.totalElements || 0,
          CLOSED: closedRes.data.totalElements || 0,
          PENDING: 0, // Update this when you have the pending endpoint
        });
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    };

    fetchAllCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: TradeContextProps = {
    trades,
    loading,
    error,
    activeTab,
    setActiveTab,
    fetchTrades,
    counts,
    pagination,
  };

  return (
    <TradeContext.Provider value={contextValue}>
      {children}
    </TradeContext.Provider>
  );
};