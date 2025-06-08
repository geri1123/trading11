import React, { useState, useEffect, TouchEvent } from 'react';
import type { PositionTradeRow } from '@/Content/PositionContent';
import { updateStopLossTakeProfit } from '@/api/apiTrades';
export interface ModifyDialogProps {
  data: PositionTradeRow | null;
  onClose: () => void;
  pending?: boolean;
}

const ModifyDialog: React.FC<ModifyDialogProps> = ({ data, onClose, pending }) => {
  const [firstInputValue, setFirstInputValue] = useState('');
  const [secondInputValue, setSecondInputValue] = useState('');
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  // Minimum swipe distance to trigger close
  const minSwipeDistance = 50;

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart && touchEnd && touchEnd - touchStart > minSwipeDistance) {
      onClose();
    }
  };

  useEffect(() => {
    if (data) {
      // If you want to support editing stopLoss/takeProfit, use those as default values
      setFirstInputValue(typeof data.stopLoss === 'string' || typeof data.stopLoss === 'number' ? String(data.stopLoss) : '');
      setSecondInputValue(typeof data.takeProfit === 'string' || typeof data.takeProfit === 'number' ? String(data.takeProfit) : '');
    }
  }, [data]);

  if (!data) return null;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="bg-black-300 w-screen md:w-[450px] lg:w-[450px] xxl:w-[450px] xl:w-[450px] p-5 flex flex-col items-center gap-3 justify-center rounded-20"
    >
      <div className="w-[100px] h-[4px] bg-white rounded-xl"></div>
      <div className="w-full border-1 border-white bg-black-700 py-2 rounded">
        <p className="text-white text-sm">Modify</p>
      </div>
      <div className="w-full flex gap-2">
        <div className="flex border-white border-opacity-50 justify-between px-3 w-1/2 border-1 bg-black-700 py-2 rounded">
          <p className="text-white text-sm">Order</p>
          <p className="text-white text-sm">#{data.PositionID}</p>
        </div>
        <div className="flex border-white border-opacity-50 justify-between px-3 w-1/2 border-1 bg-black-700 py-2 rounded">
          <p className="text-white text-sm">Type</p>
          <p className={`text-sm ${data.side === 'Buy' ? 'text-green-200' : 'text-red-200'}`}>{data.side}</p>
        </div>
      </div>
      <div className="w-full flex gap-2">
        {pending ? (
          <div className="w-1/2"></div>
        ) : (
          <div className="flex border-white border-opacity-50 justify-between px-3 w-1/2 border-1 bg-black-700 py-2 rounded">
            <p className="text-white text-sm">Profit Loss</p>
            <p className="text-white text-sm">{data.ProfitLoss}</p>
          </div>
        )}
        <div className="flex border-white border-opacity-50 justify-between px-3 w-1/2 border-1 bg-black-700 py-2 rounded">
          <p className="text-white text-sm">Volume</p>
          <p className="text-white text-sm">{data.size} lots</p>
        </div>
      </div>
      <div className={`w-full flex justify-between ${data.side === "Buy" ? 'border-green-400' : 'border-red-400'} px-3 border-1 bg-black-700 py-2 rounded`}>
        <p className="text-white text-sm">{data.instrument}</p>
        <p className="text-white text-sm">{data.entryMarket}</p>
      </div>
      <div className="w-full flex flex-col gap-3">
        <div className="flex w-full gap-3">
          <div className="flex border-white border-opacity-50 justify-center gap-3 items-center px-3 w-1/2 border-1 bg-black-700 py-2 rounded">
            <input type="checkbox" id="stoploss" />
            <label className="text-sm" htmlFor="stoploss">Stop Loss</label>
          </div>
          <div className="flex border-white border-opacity-50 justify-center gap-3 items-center px-3 w-1/2 border-1 bg-black-700 py-2 rounded">
            <input type="checkbox" id="profit" />
            <label className="text-sm" htmlFor="profit">Take profit</label>
          </div>
        </div>
        <div className="flex w-full gap-3">
          <div className="flex border-white justify-center gap-3 items-center px-3 bg-black-700 rounded">
            <input
              className="bg-transparent w-full focus:ring-0 border-none"
              type="text"
              value={firstInputValue}
              placeholder="Stop Loss"
              onChange={(e) => setFirstInputValue(e.target.value)}
            />
          </div>
          <div className="flex border-white justify-center gap-3 items-center px-3 bg-black-700 rounded">
            <input
              className="bg-transparent w-full focus:ring-0 border-none"
              type="text"
              value={secondInputValue}
              placeholder="Take Profit"
              onChange={(e) => setSecondInputValue(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-white opacity-50"></div>
      <div className="flex w-full gap-3">
        <button onClick={onClose} className="w-1/3 border-1 border-white py-2 rounded text-sm text-white">
          Cancel
        </button>
        {data.side === 'Buy' && (
          <button className="w-2/3 text-black bg-green-400 text-sm rounded">{data.side}</button>
        )}
        {data.side === 'Sell' && (
          <button className="w-2/3 text-black bg-red-400 text-sm rounded">{data.side}</button>
        )}
      </div>
    </div>
  );
};

export default ModifyDialog;