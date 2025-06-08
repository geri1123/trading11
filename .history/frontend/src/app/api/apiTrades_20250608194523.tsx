
import axios from 'axios';
import Cookies from 'js-cookie';
export const closePosition = async (id: number) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = Cookies.get("token");
  const url = `${BASE_URL}/api/positions/${id}/close`;

  const response = await axios.patch(url, {}, {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
    },
     withCredentials: true,
  });
  return response.data;
};


 



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
  // pending: boolean;
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
  }catch (err: any) {
  if (err.response) {
    console.error("API Error:", err.response.data, "Status:", err.response.status, "Full response:", err.response);
    throw new Error(err.response.data?.message || "Order creation failed.");
  }
  console.error("Unknown Error:", err);
  throw err;
}
}