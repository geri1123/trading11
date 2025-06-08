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

import axios from 'axios';
import Cookies from 'js-cookie';
export const closePosition = async (id: number, includeFeeAndSwap = false) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = Cookies.get("token");
  const url = `${BASE_URL}/api/positions/${id}/close?includeFeeAndSwap=${includeFeeAndSwap}`;

  const response = await axios.patch(url, {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateStopLossTakeProfit = async ({
  positionId,
  stopLoss,
  takeProfit
}: {
  positionId: number;
  stopLoss?: number;
  takeProfit?: number;
}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = Cookies.get("token");
  const url = `${BASE_URL}/api/positions/${positionId}/sltp`;
  const body: any = {};
  if (stopLoss !== undefined) body.stopLoss = stopLoss;
  if (takeProfit !== undefined) body.takeProfit = takeProfit;

  const response = await axios.patch(url, body, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.data;
};

import axios from "axios";

export interface CreateOrderData {
  instrument: string;
  side: "BUY" | "SELL";
  lotSize: number;
  stopLoss: number;
  takeProfit: number;
  status: string;
  trailingStopEnabled: boolean;
  riskEnabled: boolean;
  pendingEntryPrice: number;
  pendingOrderType: string;
  pending: boolean;
}

export async function createOrder(data: CreateOrderData) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const res = await axios.post(`${BASE_URL}/api/orders`, data, {
    headers: {
      "Content-Type": "application/json"
    },
    withCredentials: true
  });
  return res.data;
}