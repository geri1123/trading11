import React, { useState } from 'react';
import { formatDate } from '@/Constants/date';
import { toast } from 'react-toastify';
import { useToggleShow } from '@/UseToggleState/UseToggleShow';

import { useRouter } from 'next/navigation';
import ModifyDialog from '@/Dialogs/ModifyDialog';
import PartialDialog from '@/Dialogs/PartialDialog';

export interface PositionTradeRow {
  id: string | number;
  instrument: string;
  side: string;
  size: number | string;
  entryMarket: number | string;
  stopLoss: number | string;
  takeProfit: number | string;
  margin: number | string;
  exposure: number | string;
  createdAt: string;
  fee: number | string;
  swap: number | string;
  ProfitLoss: number | string;
  PositionID?: string | number;
}

interface PositionContentProps {
  positionData: PositionTradeRow[];
 
  loading: boolean;
}

const PositionContent: React.FC<PositionContentProps> = ({ positionData, loading }) => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<PositionTradeRow | null>(null);
  const { isOpen, toggleDropdown, closeDropdown, dropdownref, isClosing } = useToggleShow();
 
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  const handleCloseTrade = async (id: string | number) => {
    try {
      const response = await fetch(
        `https://elevenfundingapi-f91e4cb9118d.herokuapp.com/api/trades/${id}/close?includeFeeAndSwap=true`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success(`Trade  ${id} closed successfully!`);
      router.refresh();
    } catch (error) {
      toast.error('Failed to close trade.');
      
      console.error('Failed to close trade:', error);
      alert('Failed to close trade.');
    }
  };

  const handleOpenDialog = (type: string, rowData: PositionTradeRow) => {
    setActiveDialog(type);
    setSelectedData(rowData);
    toggleDropdown();
  };

  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="overflow-x-auto  overflow-y-auto max-h-[130px]  chart-scrollbar">
      <div className="hidden lg:block  min-w-max bg-black-700 text-gray-300">
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
        {positionData.map((row, index) => (
          <div key={index} className="flex items-center py-1 border-b border-gray-500 hover:bg-black-300">
            {/* Instrument and Image */}
            <div className="w-40 sticky left-0 bg-black-700 flex items-center gap-2 justify-center px-4">
              <div>
                <img src="/Images/Icons/qube.svg" alt="qube.svg" />
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
              {row.entryMarket}
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
              {row.exposure}
            </div>
            {/* Created At */}
            <div className="w-50 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {formatDate(row.createdAt)}
            </div>
            {/* Fee */}
            <div className="w-20 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {row.fee}
            </div>
            {/* Swap */}
            <div className="w-20 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {row.swap}
            </div>
            {/* Profit/Loss */}
            <div className={`w-32 flex items-center justify-center text-[13px] font-semibold px-4 ${
              parseFloat(String(row.ProfitLoss)) < 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              {row.ProfitLoss}
            </div>
            {/* Position ID */}
            <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4">
              {row.PositionID}
            </div>
            {/* Action Buttons */}
            <div className="w-32 flex sticky bg-black-700 right-0 items-center justify-center gap-3">
              <div className="p-1 cursor-pointer bg-black-300 rounded">
                <img onClick={() => handleOpenDialog('Modify', row)} src="/Images/Icons/edit.svg"  alt="edit.svg" />
              </div>
              <div className="p-1 cursor-pointer bg-black-300 rounded">
                <img onClick={() => handleOpenDialog('partial', row)} src="/Images/Icons/close-trade.svg" alt="close-trade.svg" />
              </div>
              <div className="p-1 bg-black-300 rounded">
                <img
                  src="/Images/Icons/delete-trade.svg"
                  alt="delete-trade.svg"
                  className="cursor-pointer"
                  onClick={() => handleCloseTrade(row.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Dialogs */}
      {isOpen && activeDialog === 'partial' && (
        <div className={`fixed top-0 left-0 w-full h-full bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
          <div ref={dropdownref} className={`${isClosing ? "animate-slideUp" : "animate-slideDown"}`}>
            <PartialDialog data={selectedData} onClose={closeDropdown} />
          </div>
        </div>
      )}
      {isOpen && activeDialog === 'Modify' && (
        <div className={`fixed top-0 left-0 w-full h-full bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
          <div ref={dropdownref} className={`${isClosing ? "animate-slideUp" : "animate-slideDown"}`}>
            <ModifyDialog data={selectedData} onClose={closeDropdown} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionContent;