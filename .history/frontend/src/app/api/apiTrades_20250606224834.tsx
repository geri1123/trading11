import axios from 'axios';
import Cookies from 'js-cookie';

export interface CreateOrderData {
  instrument: string;
  side: 'BUY' | 'SELL';
  lotSize: number;
  stopLoss: number;
  takeProfit: number;
  status: 'OPEN' | 'PENDING';
  trailingStopEnabled: boolean;
  riskEnabled: boolean;
  pendingEntryPrice: number;
  pendingOrderType: string;
  pending: boolean;
}
export const createOrder = async (order: CreateOrderData): Promise<void> => {
  const token = Cookies.get('token');
  if (!token) throw new Error('No auth token found');

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    // const response = await axios.post(`${BASE_URL}/api/orders`, order, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   },
    // });

    // console.log('✅ Order response:', response.data);
    // return response.data;
    await axios.post(`${BASE_URL}/api/orders`, {
  instrument: "JZE/PEC",
  side: "BUY",
  lotSize: 0.1,
  stopLoss: 0.1,
  takeProfit: 0.1,
  status: "OPEN",
  trailingStopEnabled: true,
  riskEnabled: true,
  pendingEntryPrice: 0.1,
  pendingOrderType: "LIMIT",
  pending: false
}, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});
  } catch (err: any) {
    console.error('❌ Order creation failed:', err.response?.data || err.message);
    throw err;
  }
};
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
// export const updateStopLossTakeProfit = async ({
//   positionId,
//   stopLoss,
//   takeProfit,
// }: {
//   positionId: number | string;
//   stopLoss?: number;
//   takeProfit?: number;
// }) => {
//   const response = await axios.put(`${API_BASE_URL}/api/trades/${positionId}/sltp`, {
//     stopLoss,
//     takeProfit,
//   });
//   return response.data;
// };
// // --- Fetch Trades ---
// export const fetchTrades = async (params: TradeFilterParams): Promise<TradeResponse> => {
//   const response = await axios.post<TradeResponse>(
//     `${API_BASE_URL}/api/trades/filter`,
//     params,
//     {
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }
//   );

//   return response.data;
// };
// // --- Create Trade ---
// export const createTrade = async (tradeData: CreateTradeData): Promise<Trade> => {
//   try {
//     const response = await axios.post<Trade>(
//       `${API_BASE_URL}/api/trades`,
//       tradeData,
//       {
//         withCredentials: true, 
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     return response.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       console.error('API error:', error.response.status, error.response.data);
//     } else if (error instanceof Error) {
//       console.error('Axios error:', error.message);
//     } else {
//       console.error('An unknown error occurred:', error);
//     }
//     throw error;
//   }
// };