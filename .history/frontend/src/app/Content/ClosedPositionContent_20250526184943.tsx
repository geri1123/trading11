import React from 'react';

import { formatDate } from '@/Constants/date';
export interface ClosedTradeRow {
  id: number|string;
  instrument: string;
  side: string;
  size: number | string;
  type: string;
  entryMarketPrice: number | string;
  stopLoss: number | string;
  takeProfit: number | string;
  closePrice: number | string;
  closedAt: string;
  marginUsed: number | string;
  exposure: number | string;
  createdAt: string;
  fee: number | string;
  swap: number | string;
  profitLoss: number | string;
  orderId: string | number;
  positionId: string | number;
}

export interface ClosedPositionContentProps {
  closedData: ClosedTradeRow[];
  loading: boolean;
}

const ClosedPositionContent: React.FC<ClosedPositionContentProps> = ({ closedData, loading }) => {
  if (loading) return <div>Loading...</div>;
  return (
    <div className="overflow-x-auto  overflow-y-auto max-h-[140px] chart-scrollbar">
      <div className="min-w-max  hidden lg:block  bg-black-700 text-gray-300">
        {/* Header */}
        <div className="flex items-center py-1 border-b border-gray-700 bg-black-700 sticky top-0 z-10">
          <div className="w-40 bg-black-700 sticky left-0 px-4 text-white text-[13px] font-normal">Instrument</div>
          <div className="w-20 px-4 text-white text-[13px] font-normal">Side</div>
          <div className="w-20 px-4 text-white text-[13px] font-normal">Size</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Type</div>
          <div className="w-40 px-4 text-white text-[13px] font-normal">Entry Market</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Stop Loss</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Take Profit</div>
          <div className="w-24 px-4 text-white text-[13px] font-normal">Exit Price</div>
          <div className="w-42 px-4 text-white text-[13px] font-normal">Exit Time</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Margin</div>
          <div className="w-20 px-4 text-white text-[13px] font-normal">Exposure</div>
          <div className="w-42 px-4 text-white text-[13px] font-normal">Created At</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Fee</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Swap</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Profit Loss</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Order Id</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">PositionId</div>
        </div>
        {/* Data Rows */}
        {closedData.map((row, index) => (
          <div
            // key={index}
            key={row.id}
            className="flex items-center py-1 border-b border-gray-500 hover:bg-black-300"
          >
            {/* Instrument and Image */}
            <div className="w-40 flex sticky left-0 bg-black-700 items-center gap-2 justify-center px-4">
              <div>
                <img src="Images/Icons/qube.svg" alt="qube.svg" />
              </div>
              <div className="text-white text-[12px] font-semibold">{row.instrument}</div>
            </div>
            {/* Side */}
            <div className="w-20 flex items-center justify-center px-4">
              <span className={` text-[15px] font-semibold ${row.side === "Buy" ? "text-green-500" : "text-red-500"}`}>{row.side}</span>
            </div>
            {/* Size */}
            <div className="w-20 flex items-center justify-center text-white font-semibold text-[13px] px-4">
              {row.size}
            </div>
            {/* type */}
            <div className="w-32 flex items-center justify-center text-white font-semibold text-[13px] px-4">
              {row.type}
            </div>
            {/* Entry Market */}
            <div className="w-40 flex items-center justify-center text-[10px] font-semibold text-white px-4">
              {row.entryMarketPrice}
            </div>
            {/* Stop Loss */}
            <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {row.stopLoss}
            </div>
            {/* Take Profit */}
            <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {row.takeProfit}
            </div>
            {/* Exit price */}
            <div className="w-24 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {row.closePrice}
            </div>
            {/*Exit time */}
            <div className="w-42 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {formatDate(row.closedAt)}
            </div>
            {/* Margin */}
            <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {row.marginUsed}
            </div>
            {/* Exposure */}
            <div className="w-20 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {row.exposure}
            </div>
            {/* Created */}
            <div className="w-42 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {formatDate(row.createdAt)}
            </div>
            {/* fee */}
            <div className='w-32 flex items-center justify-center text-[13px] font-semibold px-4 '>
              {row.fee}
            </div>
            {/* Swap */}
            <div className='w-32 flex items-center justify-center text-[13px] font-semibold px-4 '>
              {row.swap}
            </div>
            {/* Profit/Loss */}
            <div className={`w-32 flex items-center justify-center text-[13px] font-semibold px-4 ${
              parseFloat(String(row.profitLoss)) < 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              {row.profitLoss}
            </div>
            {/* Order id */}
            <div className='w-32 flex items-center justify-center text-[13px] font-semibold px-4 '>
              {row.id}
            </div>
            {/* PositionId */}
            <div className='w-32 flex items-center justify-center text-[13px] font-semibold px-4 '>
              {row.positionId}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClosedPositionContent;