// import axios from 'axios';


// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elevenfundingapi-f91e4cb9118d.herokuapp.com';


// export type TradeStatus = 'OPEN' | 'PENDING' | 'CLOSED';

// export interface Trade {
//   id: number;
//   instrument: string;
//   side: 'BUY' | 'SELL';
//   lotSize: number;
//   status: TradeStatus;
//   profitLoss: number;
//   createdAt: string;
//   stopLoss: number;
//   takeProfit: number;
  
// }

// export interface TradeResponse {
//   content: Trade[];
//   totalElements: number;
//   totalPages: number;
// }

// export interface TradeFilterParams {
//   status?: TradeStatus;
//   page?: number;
//   size?: number;
//   sort?: string[];
// }

// export interface CreateTradeData {
//   instrument: string;
//   side: 'BUY' | 'SELL';
//   lotSize: number;
//   stopLoss: number;
//   takeProfit: number;
// }

// // --- Fetch Trades ---
// export const fetchTrades = async (params: TradeFilterParams): Promise<TradeResponse> => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('No token found!');

//   const response = await axios.post<TradeResponse>(
//     `${API_BASE_URL}/api/trades/filter`,
//     params,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   );

//   return response.data;
// };

// // --- Create Trade ---
// export const createTrade = async (tradeData: CreateTradeData): Promise<Trade> => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('No token found!');

//   try {
//     const response = await axios.post<Trade>(
//       `${API_BASE_URL}/api/trades`,
//       tradeData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     return response.data;
//   } catch (error: any) {
//     if (axios.isAxiosError(error) && error.response) {
//       console.error('API error:', error.response.status, error.response.data);
//     } else {
//       console.error('Axios error:', error.message);
//     }
//     throw error;
//   }
// };
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elevenfundingapi-f91e4cb9118d.herokuapp.com';

export type TradeStatus = 'OPEN' | 'PENDING' | 'CLOSED';

export interface Trade {
  id: number;
  instrument: string;
  side: 'BUY' | 'SELL';
  lotSize: number;
  status: TradeStatus;
  profitLoss: number;
  createdAt: string;
  stopLoss: number;
  takeProfit: number;
}

export interface TradeResponse {
  content: Trade[];
  totalElements: number;
  totalPages: number;
}

export interface TradeFilterParams {
  status?: TradeStatus;
  page?: number;
  size?: number;
  sort?: string[];
}

export interface CreateTradeData {
  instrument: string;
  side: 'BUY' | 'SELL';
  lotSize: number;
  stopLoss: number;
  takeProfit: number;
}

// --- Fetch Trades ---
export const fetchTrades = async (params: TradeFilterParams): Promise<TradeResponse> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found!');

  const response = await axios.post<TradeResponse>(
    `${API_BASE_URL}/api/trades/filter`,
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

// --- Create Trade ---
export const createTrade = async (tradeData: CreateTradeData): Promise<Trade> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found!');

  try {
    const response = await axios.post<Trade>(
      `${API_BASE_URL}/api/trades`,
      tradeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('API error:', error.response.status, error.response.data);
    } else if (error instanceof Error) {
      console.error('Axios error:', error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};