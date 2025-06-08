
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/Constants/date';
import { useToggleShow } from '@/UseToggleState/UseToggleShow';
import { closePosition } from '@/api/apiTrades'; 
import ModifyDialog from '@/Dialogs/ModifyDialog';
import PartialDialog from '@/Dialogs/PartialDialog';
import { useTradeContext } from '@/Context/TradeContext';

const PositionContent: React.FC = () => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const { isOpen, toggleDropdown, closeDropdown, dropdownref, isClosing } = useToggleShow();

  const { trades, loading, error } = useTradeContext();

  const handleOpenDialog = (type: string, rowData: any) => {
    setActiveDialog(type);
  setSelectedData(rowData); // This is the selected trade
  toggleDropdown();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-500">Error: {error}</div>;
  }

  if (!trades || trades.length === 0) {
    return <div className="flex items-center justify-center h-64 text-gray-400">No open positions found</div>;
  }

  return (
    <div className="overflow-x-auto overflow-y-auto h-[100%] chart-scrollbar">
      <div className="hidden lg:block min-w-max bg-black-700 text-gray-300">
        {/* Header */}
            <div className="flex py-1 items-center justify-center border-b border-gray-700 bg-black-700 sticky top-0 z-10">
          <div className="w-40 sticky left-0 bg-black-700 px-4 text-white text-[13px] font-normal">Instrument</div>
          <div className="w-20 px-4 text-white text-[13px] font-normal">Side</div>
          <div className="w-20 px-4 text-white text-[13px] font-normal">Size</div>
          <div className="w-40 px-4 text-white text-[13px] font-normal">Entry Market</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Stop Loss</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Take Profit</div>
          <div className="w-24 px-4 text-white text-[13px] font-normal">Margin</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Exposure</div>
          <div className="w-50 px-4 text-white text-[13px] font-normal">Created At (EE7)</div>
          <div className="w-20 px-4 text-white text-[13px] font-normal">Fee</div>
          <div className="w-20 px-4 text-white text-[13px] font-normal">Swap</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Profit Loss</div>
          <div className="w-32 px-4 text-white text-[13px] font-normal">Position ID</div>
          <div className="w-32 px-4 text-white text-[13px] sticky bg-black-700 right-0 font-normal">Action ID</div>
        </div>

        {/* Data Rows */}
        {trades.map((row, index) => (
          <div key={row.positionId || index} className="flex items-center py-1 border-b border-gray-500 hover:bg-black-300">
            {/* Instrument */}
            <div className="w-40 sticky left-0 bg-black-700 flex items-center gap-2 justify-center px-4">
              <Image src="/Images/Icons/qube.svg" alt="qube.svg" width={16} height={16} />
              <span className="text-white text-[12px] font-semibold">{row.instrument}</span>
            </div>
            
            {/* Side */}
            <div className="w-20 flex justify-center px-4">
              <span className={`text-[15px] font-semibold ${row.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                {row.side}
              </span>
            </div>

            {/* Other columns (size, entry, etc.) */}
            <div className="w-20 flex justify-center text-white text-[13px] font-semibold px-4">
              {row.lotSize?.toFixed(2)}
            </div>
            <div className="w-40 flex justify-center text-white text-[10px] font-semibold px-4">
              {row.entryPrice?.toFixed(5)}
            </div>
            <div className="w-32 flex justify-center text-white text-[13px] font-semibold px-4">
              {row.stopLoss?.toFixed(5)}
            </div>
            <div className="w-32 flex justify-center text-white text-[13px] font-semibold px-4">
              {row.takeProfit?.toFixed(5)}
            </div>
            <div className="w-24 flex justify-center text-white text-[13px] font-semibold px-4">
              {row.margin?.toFixed(2)}
            </div>
            <div className="w-32 flex justify-center text-white text-[13px] font-semibold px-4">
              {row.exposure?.toFixed(2)}
            </div>
            <div className="w-50 flex justify-center text-white text-[13px] font-semibold px-4">
              {formatDate(row.openedAt)}
            </div>
            <div className="w-20 flex justify-center text-white text-[13px] font-semibold px-4">
              {row.fee?.toFixed(2)}
            </div>
            <div className="w-20 flex justify-center text-white text-[13px] font-semibold px-4">
              {row.swap?.toFixed(2)}
            </div>
            <div className={`w-32 flex justify-center text-[13px] font-semibold px-4 ${
              (row.profitLoss || 0) < 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              {row.profitLoss?.toFixed(2)}
            </div>
            <div className="w-32 flex justify-center text-white text-[13px] font-semibold px-4">
              {row.positionId}
            </div>

            {/* Actions */}
            <div className="w-32 sticky right-0 bg-black-700 flex items-center justify-center gap-3">
              <button
                className="p-1 bg-black-300 rounded hover:bg-black-200 transition-colors"
                onClick={() => handleOpenDialog('Modify', row)}
              >
                <Image src="/Images/Icons/edit.svg" alt="edit" width={16} height={16} />
              </button>
              <button
                className="p-1 bg-black-300 rounded hover:bg-black-200 transition-colors"
                onClick={() => handleOpenDialog('partial', row)}
              >
                <Image src="/Images/Icons/close-trade.svg" alt="close" width={16} height={16} />
              </button>
              <button
                className="p-1 bg-black-300 rounded hover:bg-black-200 transition-colors"
                onClick={() => {
                  // Handle delete from context
                }}
              >
                <Image src="/Images/Icons/delete-trade.svg" alt="delete" width={16} height={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      {isOpen && activeDialog === 'partial' && selectedData && (
        <div className={`fixed inset-0 bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
          <div ref={dropdownref} className={`${isClosing ? "animate-slideUp" : "animate-slideDown"}`}>
            <PartialDialog data={selectedData} onClose={closeDropdown} />
          </div>
        </div>
      )}

      {isOpen && activeDialog === 'Modify' && selectedData && (
        <div className={`fixed inset-0 bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
          <div ref={dropdownref} className={`${isClosing ? "animate-slideUp" : "animate-slideDown"}`}>
            <ModifyDialog data={selectedData} onClose={closeDropdown} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionContent;
