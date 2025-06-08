
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/Constants/date';
import { useTradeContext } from '@/Context/TradeContext';
import { useToggleShow } from '@/UseToggleState/UseToggleShow';
import ModifyDialog from '@/Dialogs/ModifyDialog';
import PartialDialog from '@/Dialogs/PartialDialog';
import { closePosition } from '@/api/apiTrades';
import { toast } from 'react-toastify';

const formatNumber = (num: number | string | null | undefined, decimals = 2) => {
  if (num === null || num === undefined || num === '') return '-';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  return isNaN(n) ? num : n.toLocaleString(undefined, { maximumFractionDigits: decimals });
};

const PositionContent: React.FC = () => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const { isOpen, toggleDropdown, closeDropdown, dropdownref, isClosing } = useToggleShow();
  const { trades, loading, error, fetchTrades } = useTradeContext();

  const handleOpenDialog = (type: string, rowData: any) => {
    setActiveDialog(type);
    setSelectedData(rowData);
    toggleDropdown();
  };
  const handleClose = async (positionId: number) => {
  try {
    await closePosition(positionId); 
    toast.success('Trade closed successfully!');
    fetchTrades('OPEN'); 
  } catch (error) {
    console.error('Failed to close trade:', error);
    toast.error('Failed to close trade.');
  }
};
  const handleAfterClose = () => {
    if (fetchTrades) fetchTrades('OPEN');
  };

  if (loading) return <div className="text-center py-8 text-gray-300">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-400">Error: {error}</div>;
  if (!trades || trades.length === 0) return <div className="text-center py-8 text-gray-300">No open positions found</div>;

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden max-h-96">
      {/* Table View */}
      <div className="overflow-x-auto overflow-y-auto max-h-[150px] chart-scrollbar hidden lg:block">
        <table className="w-full min-w-max">
          {/* Header */}
          <thead className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
            <tr>
              <th className="sticky left-0 bg-gray-800 z-20 px-2 py-2 text-left text-xs text-gray-200">Instrument</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">Side</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">Size</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">Entry</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">Stop Loss</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">Take Profit</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">Margin</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">Exposure</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">Created At</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">Fee</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">Swap</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">P&L</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">Position ID</th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">Actions</th>
            </tr>
          </thead>

          {/* Rows */}
          <tbody className="divide-y divide-gray-700">
            {trades.map((row, index) => (
              <tr key={row.positionId || index} className="hover:bg-gray-800 transition-colors duration-150">
                <td className="sticky left-0 bg-gray-900 px-2 py-2 text-white text-xs font-medium whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Image src="/Images/Icons/qube.svg" alt="icon" width={16} height={16} />
                    {row.instrument}
                  </div>
                </td>
                <td className="text-center px-2 py-2">
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                    row.side === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {row.side}
                  </span>
                </td>
                <td className="text-center text-gray-200 text-xs">{formatNumber(row.lotSize, 2)}</td>
                <td className="text-center text-gray-200 text-xs font-mono">{formatNumber(row.entryPrice, 5)}</td>
                <td className="text-center text-gray-200 text-xs font-mono">{formatNumber(row.stopLoss, 5)}</td>
                <td className="text-center text-gray-200 text-xs font-mono">{formatNumber(row.takeProfit, 5)}</td>
                <td className="text-center text-gray-200 text-xs font-mono">{formatNumber(row.margin, 2)}</td>
                <td className="text-center text-gray-200 text-xs font-mono">{formatNumber(row.exposure, 2)}</td>
                <td className="text-center text-gray-300 text-xs">{formatDate(row.openedAt)}</td>
                <td className="text-center text-orange-400 text-xs font-mono">{formatNumber(row.fee, 2)}</td>
                <td className="text-center text-blue-400 text-xs font-mono">{formatNumber(row.swap, 2)}</td>
                <td className={`text-center text-xs font-bold ${
                  row.profitLoss < 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {row.profitLoss > 0 ? '+' : ''}
                  {formatNumber(row.profitLoss, 2)}
                </td>
                <td className="text-center text-gray-400 text-xs font-mono">{row.positionId}</td>
                <td className="text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleOpenDialog('Modify', row)}>
                      <Image src="/Images/Icons/edit.svg" alt="edit" width={16} height={16} />
                    </button>
                    <button onClick={() => handleOpenDialog('partial', row)}>
                      <Image src="/Images/Icons/close-trade.svg" alt="partial" width={16} height={16} />
                    </button>
                      <button
                
                onClick={handleClose}
              >
                <Image src="/Images/Icons/delete-trade.svg" alt="delete" width={16} height={16} />
              </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
      
       {/* Dialogs */}
         {isOpen && activeDialog === 'partial' && selectedData && (
        <div className={`fixed inset-0 bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
          <div ref={dropdownref} className={`${isClosing ? "animate-slideUp" : "animate-slideDown"}`}>
            <PartialDialog
              data={selectedData}
              onClose={closeDropdown}
              onAfterClose={handleAfterClose}
            />
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
