

"use client"
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { createOrder ,CreateOrderData} from '@/api/apiTrades';


interface SelectedData {
  pair: string;
  ask: number;
  bid: number;
  spread: number;
  dayHigh: number;
  dayLow: number;
}

interface BuyDialogProps {
  onClose: () => void;
  value: number;
  data: SelectedData | null;
  
}

const BuyDialog: React.FC<BuyDialogProps> = ({ onClose, value, data  }) => {
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
//  const {refreshData}=useTradeContext();


  const minSwipeDistance: number = 50;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = (): void => {
    if (touchStart && touchEnd && touchEnd - touchStart > minSwipeDistance) {
      onClose();
    }
  };
const handleBuy = async (): Promise<void> => {
  if (!data) {
    toast.error("No trading data available");
    return;
  }
  setLoading(true);

 const tradeData: CreateOrderData = {
  instrument: "UHT/EBJ",
  side: "BUY",
  lotSize: 0.1,
  stopLoss: 0.1,
  takeProfit: 0.1,
  status: "OPEN",
  trailingStopEnabled: true,
  riskEnabled: true,
  pendingEntryPrice: 0.1,
  pendingOrderType: "LIMIT",   // <-- FIXED!
  pending: true
};

  try {
    await createOrder(tradeData);
    toast.success("Trade created successfully!");
    onClose();
  } catch (err) {
    console.error('Error creating trade:', err);
    toast.error("Failed to create trade. Please check input or try again later.");
  } finally {
    setLoading(false);
  }
};
  if (!data) {
    return (
      <div className='bg-black-300 w-screen md:w-[450px] lg:w-[450px] xxl:w-[450px] xl:w-[450px] p-5 flex flex-col items-center gap-3 justify-center rounded-20'>
        <div className='w-[100px] h-[4px] bg-white rounded-xl'></div>
        <div className='w-full border-1 border-white bg-black-700 py-2 rounded'>
          <p className='text-white text-sm'>No trading data available</p>
        </div>
        <div className='flex w-full gap-3'>
          <button 
            onClick={onClose} 
            className='w-full border-1 border-white py-2 rounded text-sm text-white hover:bg-white hover:text-black transition-colors'
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className='bg-black-300 w-screen md:w-[450px] lg:w-[450px] xxl:w-[450px] xl:w-[450px] p-5 flex flex-col items-center gap-3 justify-center rounded-20'
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe indicator */}
      <div className='w-[100px] h-[4px] bg-white rounded-xl'></div>
      
      {/* Header */}
      <div className='w-full border-1 border-white bg-black-700 py-2 rounded'>
        <p className='text-white text-sm'>Buy details</p>
      </div>
      
      {/* Symbol display */}
      <div className='w-full border-1 border-green-600 py-2 flex justify-between px-3 rounded'>
        <p className='text-white text-sm'>Symbol</p>
        <p className='text-white text-sm'>{data.pair}</p>
      </div>
      
      {/* Market price section */}
      <div className='w-full flex flex-col gap-3 items-start'>
        <p className='text-white text-xs'>Market buy price</p>
        <div className='w-full bg-black-700 border-1 border-white border-opacity-50 py-2 px-3 rounded'>
          <p className='text-white text-sm'>{data.ask.toFixed(5)}</p>
        </div>
      </div>
      
      {/* Divider */}
      <div className='w-full h-[1px] bg-white opacity-50'></div>
      
      {/* Lot size info */}
      <p className='text-green-400 text-xs'>
        You are going to buy {value} lot{value !== 1 ? 's' : ''}.
      </p>
      
      {/* Action buttons */}
      <div className='flex w-full gap-3'>
        <button
          onClick={onClose}
          className='w-1/3 border-1 border-white py-2 rounded text-sm text-white hover:bg-white hover:text-black transition-colors'
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleBuy}
          disabled={loading}
          className='w-2/3 text-black bg-green-400 text-sm rounded py-2 hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Processing...' : 'Buy'}
        </button>
      </div>
    </div>
  );
};

export default BuyDialog;

