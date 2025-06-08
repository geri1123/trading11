

import React from 'react';
import Image from 'next/image';
import { formatDate } from '../Constants/date';


const PendingContent: React.FC= () => {
 
  return (
    <div className="overflow-x-auto  overflow-y-auto h-[100%]  chart-scrollbar">
      <div className="min-w-max hidden lg:block bg-black-700 text-gray-300">
        {/* Header */}
        <div className="flex items-center py-1 border-b border-gray-700 bg-black-700 sticky top-0 z-10">
          <div className="w-40 sticky left-0 bg-black-700 px-4 text-white text-[13px] font-normal">Instrument</div>
          <div className="w-20 px-4 text-white text-[13px] font-normal">Side</div>
          <div className="w-20 px-4 text-white text-[13px] font-normal">Size</div>
          <div className="w-40 px-4 text-white text-[13px] font-normal">Entry Market</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Stop Loss</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Take Profit</div>
          <div className="w-24 px-4 text-white text-[13px] font-normal">Margin</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Exposure</div>
          <div className="w-50 px-4 text-white text-[13px] font-normal">Created At (EEA)</div>
          <div className="w-20 px-4 text-white text-[13px] font-normal">Fee</div>
          <div className="w-20 px-4 text-white text-[13px] font-normal">Swap</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Profit Loss</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal sticky bg-black-700 right-0">Action </div>
        </div>
        {/* Data Rows */}
        
          <div
            // key={index}
            className="flex items-center py-1 border-b border-gray-500 hover:bg-black-300"
          >
            {/* Instrument and Image */}
            <div className="sticky bg-black-700 left-0 w-40 flex items-center gap-2 justify-center px-4">
              <div>
                <Image src="/Images/Icons/qube.svg" alt="qube.svg" width={16} height={16} />
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
            {/* Margin */}
            <div className="w-24 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {row.margin}
            </div>
            {/* Exposure */}
            <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {/* {row.exposure} */}
            </div>
            {/* Created At */}
            <div className="w-50 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {/* {formatDate(row.createdAt)} */}
            </div>
            {/* Fee */}
            <div className="w-20 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {/* {row.fee} */}
            </div>
            {/* Swap */}
            <div className="w-20 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {/* {row.swap} */}
            </div>
            {/* Profit/Loss */}
            <div className={`w-32 flex items-center justify-center text-[13px] font-semibold px-4 ${
              parseFloat(String(row.profitLoss)) < 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              {/* {row.profitLoss} */}
            </div>
            {/* Action Buttons */}
            <div className="w-32 sticky bg-black-700 right-0 flex items-center justify-center gap-3">
              <div className="p-1 bg-black-300 rounded">
                <Image src="/Images/Icons/edit.svg" alt="edit.svg" width={16} height={16} />
              </div>
              <div className="p-1 bg-black-300 rounded">
                <Image src="/Images/Icons/delete-trade.svg" alt="delete-trade.svg" width={16} height={16} />
              </div>
            </div>
          </div>
        {/* ))} */}
      </div>
    </div>
  );
};

export default PendingContent;