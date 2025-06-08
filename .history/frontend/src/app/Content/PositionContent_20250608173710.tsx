
// "use client";

// import React, { useState } from 'react';
// import Image from 'next/image';
// import { formatDate } from '@/Constants/date';
// import { useToggleShow } from '@/UseToggleState/UseToggleShow';
// import { closePosition } from '@/api/apiTrades'; 
// import ModifyDialog from '@/Dialogs/ModifyDialog';
// import PartialDialog from '@/Dialogs/PartialDialog';
// import { useTradeContext } from '@/Context/TradeContext';

// const PositionContent: React.FC = () => {
//   const [activeDialog, setActiveDialog] = useState<string | null>(null);
//   const [selectedData, setSelectedData] = useState<any>(null);
//   const { isOpen, toggleDropdown, closeDropdown, dropdownref, isClosing } = useToggleShow();
//   const { trades, loading, error, fetchTrades } = useTradeContext();
  

//   const handleOpenDialog = (type: string, rowData: any) => {
//     setActiveDialog(type);
//   setSelectedData(rowData); 
//   toggleDropdown();
//   };
//  const handleAfterClose = () => {
    
//     if (fetchTrades) fetchTrades('OPEN');
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center h-64 text-white">Loading...</div>;
//   }

//   if (error) {
//     return <div className="flex items-center justify-center h-64 text-red-500">Error: {error}</div>;
//   }

//   if (!trades || trades.length === 0) {
//     return <div className="flex items-center justify-center h-64 text-gray-400">No open positions found</div>;
//   }

//   return (
//     <div className="overflow-x-auto overflow-y-auto h-[100%] chart-scrollbar">
//       <div className="hidden lg:block min-w-max bg-black-700 text-gray-300">
//         {/* Header */}
//             <div className="flex py-0 items-center justify-center border-b border-gray-700 bg-black-700 sticky top-0 z-10">
//           <div className="w-40 sticky left-0 bg-black-700 px-4 text-white text-[13px] font-normal">Instrument</div>
//           <div className="w-20 px-4 text-white text-[13px] font-normal">Side</div>
//           <div className="w-20 px-4 text-white text-[13px] font-normal">Size</div>
//           <div className="w-40 px-4 text-white text-[13px] font-normal">Entry Market</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Stop Loss</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Take Profit</div>
//           <div className="w-24 px-4 text-white text-[13px] font-normal">Margin</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Exposure</div>
//           <div className="w-50 px-4 text-white text-[13px] font-normal">Created At (EE7)</div>
//           <div className="w-20 px-4 text-white text-[13px] font-normal">Fee</div>
//           <div className="w-20 px-4 text-white text-[13px] font-normal">Swap</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Profit Loss</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Position ID</div>
//           <div className="w-32 px-4 text-white text-[13px] sticky bg-black-700 right-0 font-normal">Action ID</div>
//         </div>

//         {/* Data Rows */}
//         {trades.map((row, index) => (
//           <div key={row.positionId || index} className="flex items-center py-0 border-b border-gray-500 hover:bg-black-300">
//             {/* Instrument */}
//             <div className="w-40 sticky left-0 bg-black-700 flex items-center gap-2 justify-center px-4">
//               <Image src="/Images/Icons/qube.svg" alt="qube.svg" width={12} height={12} />
//               <span className="text-white text-[11px] font-semibold">{row.instrument}</span>
//             </div>
            
//             {/* Side */}
//             <div className="w-20 flex justify-center px-4">
//               <span className={`text-[11px] font-semibold ${row.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
//                 {row.side}
//               </span>
//             </div>

//             {/* Other columns (size, entry, etc.) */}
//             <div className="w-20 flex justify-center text-white text-[11px] font-semibold px-4">
//               {row.lotSize?.toFixed(2)}
//             </div>
//             <div className="w-40 flex justify-center text-white text-[10px] font-semibold px-4">
//               {row.entryPrice?.toFixed(5)}
//             </div>
//             <div className="w-32 flex justify-center text-white text-[11px] font-semibold px-4">
//               {row.stopLoss?.toFixed(5)}
//             </div>
//             <div className="w-32 flex justify-center text-white text-[11px] font-semibold px-4">
//               {row.takeProfit?.toFixed(5)}
//             </div>
//             <div className="w-24 flex justify-center text-white text-[11px] font-semibold px-4">
//               {row.margin?.toFixed(2)}
//             </div>
//             <div className="w-32 flex justify-center text-white text-[11px] font-semibold px-4">
//               {row.exposure?.toFixed(2)}
//             </div>
//             <div className="w-50 flex justify-center text-white text-[11px] font-semibold px-4">
//               {formatDate(row.openedAt)}
//             </div>
//             <div className="w-20 flex justify-center text-white text-[11px] font-semibold px-4">
//               {row.fee?.toFixed(2)}
//             </div>
//             <div className="w-20 flex justify-center text-white text-[11px] font-semibold px-4">
//               {row.swap?.toFixed(2)}
//             </div>
//             <div className={`w-32 flex justify-center text-[13px] font-semibold px-4 ${
//               (row.profitLoss || 0) < 0 ? 'text-red-500' : 'text-green-500'
//             }`}>
//               {row.profitLoss?.toFixed(2)}
//             </div>
//             <div className="w-32 flex justify-center text-white text-[13px] font-semibold px-4">
//               {row.positionId}
//             </div>

//             {/* Actions */}
//             <div className="w-32 sticky right-0 bg-black-700 flex items-center justify-center gap-3">
//               <button
//                 className="p-1 bg-black-300 rounded hover:bg-black-200 transition-colors"
//                 onClick={() => handleOpenDialog('Modify', row)}
//               >
//                 <Image src="/Images/Icons/edit.svg" alt="edit" width={16} height={16} />
//               </button>
//               <button
//                 className="p-1 bg-black-300 rounded hover:bg-black-200 transition-colors"
//                 onClick={() => handleOpenDialog('partial', row)}
//               >
//                 <Image src="/Images/Icons/close-trade.svg" alt="close" width={16} height={16} />
//               </button>
//               <button
//                 className="p-1 bg-black-300 rounded hover:bg-black-200 transition-colors"
//                 onClick={() => {
//                   // Handle delete from context
//                 }}
//               >
//                 <Image src="/Images/Icons/delete-trade.svg" alt="delete" width={16} height={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Dialogs */}
//         {isOpen && activeDialog === 'partial' && selectedData && (
//         <div className={`fixed inset-0 bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
//           <div ref={dropdownref} className={`${isClosing ? "animate-slideUp" : "animate-slideDown"}`}>
//             <PartialDialog
//               data={selectedData}
//               onClose={closeDropdown}
//               onAfterClose={handleAfterClose}
//             />
//           </div>
//         </div>
//       )}

//       {isOpen && activeDialog === 'Modify' && selectedData && (
//         <div className={`fixed inset-0 bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
//           <div ref={dropdownref} className={`${isClosing ? "animate-slideUp" : "animate-slideDown"}`}>
//             <ModifyDialog data={selectedData} onClose={closeDropdown} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PositionContent;
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/Constants/date';
import { useTradeContext } from '@/Context/TradeContext';
import { useToggleShow } from '@/UseToggleState/UseToggleShow';
import ModifyDialog from '@/Dialogs/ModifyDialog';
import PartialDialog from '@/Dialogs/PartialDialog';

// Utility formatter
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
                
                onClick={() => {
                  
                }}
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

     
      
//       {/* Dialogs */}
//         {isOpen && activeDialog === 'partial' && selectedData && (
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
