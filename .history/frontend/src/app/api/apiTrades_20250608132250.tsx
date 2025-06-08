
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

// import axios from "axios";

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
  const token = Cookies.get("token");
  if (!token) throw new Error("Authentication token missing!");

  try {
    const res = await axios.post(`${BASE_URL}/api/orders`, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    // Print error details in the console for debugging
    if (err.response) {
      console.error("API Error:", err.response.data);
      throw new Error(err.response.data?.message || "Order creation failed.");
    }
    throw err;
  }
}