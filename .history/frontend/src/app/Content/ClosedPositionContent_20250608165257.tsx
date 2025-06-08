// import React from 'react';
// import Image from 'next/image';
// import { formatDate } from '@/Constants/date';
// import { useTradeContext } from '@/Context/TradeContext';

// // Format numbers with a max # of decimals for clean display
// const formatNumber = (num: number | string | null | undefined, decimals = 2) => {
 
//   if (num === null || num === undefined || num === '') return '-';
//   const n = typeof num === 'string' ? parseFloat(num) : num;
 
//   return isNaN(n) ? num : n.toLocaleString(undefined, { maximumFractionDigits: decimals });
// };

// const headerConfig = [
//   { label: 'Instrument', width: 'w-40' },
//   { label: 'Side', width: 'w-20' },
//   { label: 'Size', width: 'w-20' },
//   { label: 'Type', width: 'w-32' },
//   { label: 'Entry Market', width: 'w-40' },
//   { label: 'Stop Loss', width: 'w-32' },
//   { label: 'Take Profit', width: 'w-32' },
//   { label: 'Exit Price', width: 'w-24' },
//   { label: 'Exit Time', width: 'w-42' },
//   { label: 'Margin', width: 'w-32' },
//   { label: 'Exposure', width: 'w-20' },
//   { label: 'Created At', width: 'w-42' },
//   { label: 'Fee', width: 'w-32' },
//   { label: 'Swap', width: 'w-32' },
//   { label: 'Profit Loss', width: 'w-32' },
//   { label: 'Order Id', width: 'w-32' },
//   { label: 'PositionId', width: 'w-32' },
// ];

// const ClosedPositionContent: React.FC = () => {
//   const { trades, loading, error } = useTradeContext();

//   if (loading) return <div className="text-center py-8">Loading...</div>;
//   if (error) return <div className="text-center py-8">Error: {error}</div>;
//   if (!trades || trades.length === 0) return <div className="text-center py-8">No closed positions found</div>;
//   return (
//     <div className="overflow-x-auto overflow-y-auto max-h-[140px] chart-scrollbar">
//       <div className="min-w-max hidden lg:block bg-black-700 text-gray-300">
//         {/* Header */}
//         <div className="flex items-center py-1 border-b border-gray-700 bg-black-700 sticky top-0 z-10">
//           {headerConfig.map((h) => (
//             <div
//               key={h.label}
//               className={`${h.width} px-4 flex justify-center items-center text-white text-[13px] font-normal whitespace-nowrap ${
//                 h.label === 'Instrument' ? 'sticky left-0 bg-black-700 z-10' : ''
//               }`}
//             >
//               {h.label}
//             </div>
//           ))}
//         </div>
//         {/* Data Rows */}
//         {trades.map((row: any, index: number) => (
//           <div
//             key={row.positionId || row.id || index}
//             className="flex items-center py-1 border-b border-gray-500 hover:bg-black-300"
//           >
//             {/* Instrument and Image */}
//             <div className="w-40 flex sticky left-0 bg-black-700 items-center justify-center gap-2 px-4 z-10">
//               <Image src="/Images/Icons/qube.svg" alt="qube.svg" width={16} height={16} />
//               <span className="text-white text-[12px] font-semibold">{row.instrument}</span>
//             </div>
//             {/* Side */}
//             <div className="w-20 flex items-center justify-center px-4">
//               <span className={`text-[15px] font-semibold ${row.side === "Buy" ? "text-green-500" : "text-red-500"}`}>{row.side}</span>
//             </div>
//             {/* Size */}
//             <div className="w-20 flex items-center justify-center text-white font-semibold text-[13px] px-4 whitespace-nowrap">
//               {formatNumber(row.lotSize, 2)}
//             </div>
//             {/* Type */}
//             <div className="w-32 flex items-center justify-center text-white font-semibold text-[13px] px-4 whitespace-nowrap">
//               {row.type}
//             </div>
//             {/* Entry Market */}
//             <div className="w-40 flex items-center justify-center text-[10px] font-semibold text-white px-4 whitespace-nowrap">
//               {formatNumber(row.entryPrice, 4)}
//             </div>
//             {/* Stop Loss */}
//             <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
//               {formatNumber(row.stopLoss, 4)}
//             </div>
//             {/* Take Profit */}
//             <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
//               {formatNumber(row.takeProfit, 4)}
//             </div>
//             {/* Exit Price */}
//             <div className="w-24 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
//               {formatNumber(row.closePrice, 4)}
//             </div>
//             {/* Exit Time */}
//             <div className="w-42 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
//               {formatDate(row.closedAt)}
//             </div>
//             {/* Margin */}
//             <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
//               {formatNumber(row.margin, 2)}
//             </div>
//             {/* Exposure */}
//             <div className="w-20 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
//               {formatNumber(row.exposure, 2)}
//             </div>
//             {/* Created At */}
//             <div className="w-42 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
//               {formatDate(row.openedAt)}
//             </div>
//             {/* Fee */}
//             <div className="w-32 flex items-center justify-center text-[13px] font-semibold px-4 whitespace-nowrap">
//               {formatNumber(row.fee, 2)}
//             </div>
//             {/* Swap */}
//             <div className="w-32 flex items-center justify-center text-[13px] font-semibold px-4 whitespace-nowrap">
//               {formatNumber(row.swap, 2)}
//             </div>
//             {/* Profit/Loss */}
//             <div className={`w-32 flex items-center justify-center text-[13px] font-semibold px-4 whitespace-nowrap ${
//               parseFloat(String(row.profitLoss)) < 0 ? 'text-red-500' : 'text-green-500'
//             }`}>
//               {formatNumber(row.profitLoss, 2)}
//             </div>
//             {/* Order Id */}
//             <div className="w-32 flex items-center justify-center text-[13px] font-semibold px-4 whitespace-nowrap">
//               {row.id}
//             </div>
//             {/* PositionId */}
//             <div className="w-32 flex items-center justify-center text-[13px] font-semibold px-4 whitespace-nowrap">
//               {row.positionId}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ClosedPositionContent;
import React from 'react';
import Image from 'next/image';
import { formatDate } from '@/Constants/date';
import { useTradeContext } from '@/Context/TradeContext';

// Format numbers with a max # of decimals for clean display
const formatNumber = (num: number | string | null | undefined, decimals = 2) => {
  if (num === null || num === undefined || num === '') return '-';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  return isNaN(n) ? num : n.toLocaleString(undefined, { maximumFractionDigits: decimals });
};

const ClosedPositionContent: React.FC = () => {
  const { trades, loading, error } = useTradeContext();

  if (loading) return <div className="text-center py-8 text-gray-300">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-400">Error: {error}</div>;
  if (!trades || trades.length === 0) return <div className="text-center py-8 text-gray-300">No closed positions found</div>;

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden max-h-96">
      <div className="overflow-x-auto overflow-y-auto max-h-[140px]">
        <table className="w-full min-w-max">
          {/* Header */}
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="sticky left-0 bg-gray-800 z-20 px-2 py-2 text-left">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Instrument
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Side
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Size
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Type
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Entry Price
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Stop Loss
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Take Profit
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Exit Price
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Exit Time
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Margin
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Exposure
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Created At
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Fee
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Swap
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  P&L
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Order ID
                </div>
              </th>
              <th className="px-2 py-2 text-center">
                <div className="text-gray-200 text-xs font-semibold whitespace-nowrap">
                  Position ID
                </div>
              </th>
            </tr>
          </thead>

          {/* Data Rows */}
          <tbody className="divide-y divide-gray-700">
            {trades.map((row: any, index: number) => (
              <tr
                key={row.positionId || row.id || index}
                className="hover:bg-gray-800 transition-colors duration-150"
              >
                {/* Instrument */}
                <td className="sticky left-0 bg-gray-900 hover:bg-gray-800 z-10 px-2 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <Image 
                        src="/Images/Icons/qube.svg" 
                        alt="instrument" 
                        width={16} 
                        height={16}
                        className="opacity-80"
                      />
                    </div>
                    <span className="text-white text-xs font-medium whitespace-nowrap">
                      {row.instrument}
                    </span>
                  </div>
                </td>

                {/* Side */}
                <td className="px-2 py-2 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    row.side === "Buy" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {row.side}
                  </span>
                </td>

                {/* Size */}
                <td className="px-2 py-2 text-center">
                  <span className="text-gray-200 text-xs font-medium">
                    {formatNumber(row.lotSize, 2)}
                  </span>
                </td>

                {/* Type */}
                <td className="px-2 py-2 text-center">
                  <span className="text-gray-200 text-xs">
                    {row.type}
                  </span>
                </td>

                {/* Entry Price */}
                <td className="px-2 py-2 text-center">
                  <span className="text-gray-200 text-xs font-mono">
                    {formatNumber(row.entryPrice, 4)}
                  </span>
                </td>

                {/* Stop Loss */}
                <td className="px-2 py-2 text-center">
                  <span className="text-gray-200 text-xs font-mono">
                    {formatNumber(row.stopLoss, 4)}
                  </span>
                </td>

                {/* Take Profit */}
                <td className="px-2 py-2 text-center">
                  <span className="text-gray-200 text-xs font-mono">
                    {formatNumber(row.takeProfit, 4)}
                  </span>
                </td>

                {/* Exit Price */}
                <td className="px-2 py-2 text-center">
                  <span className="text-gray-200 text-xs font-mono">
                    {formatNumber(row.closePrice, 4)}
                  </span>
                </td>

                {/* Exit Time */}
                <td className="px-2 py-2 text-center">
                  <span className="text-gray-300 text-xs">
                    {formatDate(row.closedAt)}
                  </span>
                </td>

                {/* Margin */}
                <td className="px-2 py-2 text-center">
                  <span className="text-gray-200 text-xs font-mono">
                    {formatNumber(row.margin, 2)}
                  </span>
                </td>

                {/* Exposure */}
                <td className="px-2 py-2 text-center">
                  <span className="text-gray-200 text-xs font-mono">
                    {formatNumber(row.exposure, 2)}
                  </span>
                </td>

                {/* Created At */}
                <td className="px-2 py-2 text-center">
                  <span className="text-gray-300 text-xs">
                    {formatDate(row.openedAt)}
                  </span>
                </td>

                {/* Fee */}
                <td className="px-2 py-2 text-center">
                  <span className={`text-xs font-mono ${
                    parseFloat(String(row.fee)) !== 0 ? 'text-orange-400' : 'text-gray-400'
                  }`}>
                    {formatNumber(row.fee, 2)}
                  </span>
                </td>

                {/* Swap */}
                <td className="px-2 py-2 text-center">
                  <span className={`text-xs font-mono ${
                    parseFloat(String(row.swap)) !== 0 ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {formatNumber(row.swap, 2)}
                  </span>
                </td>

                {/* Profit/Loss */}
                <td className="px-2 py-2 text-center">
                  <span className={`text-xs font-bold ${
                    parseFloat(String(row.profitLoss)) < 0 
                      ? 'text-red-400' 
                      : parseFloat(String(row.profitLoss)) > 0 
                        ? 'text-green-400' 
                        : 'text-gray-400'
                  }`}>
                    {parseFloat(String(row.profitLoss)) > 0 ? '+' : ''}
                    {formatNumber(row.profitLoss, 2)}
                  </span>
                </td>

                {/* Order ID */}
                <td className="px-2 py-2 text-center">
                  <span className="text-gray-400 text-xs font-mono">
                    {row.id}
                  </span>
                </td>

                {/* Position ID */}
                <td className="px-2 py-2 text-center">
                  <span className="text-gray-400 text-xs font-mono">
                    {row.positionId}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="space-y-4 p-4">
          {trades.map((row: any, index: number) => (
            <div
              key={row.positionId || row.id || index}
              className="bg-gray-800 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image 
                    src="/Images/Icons/qube.svg" 
                    alt="instrument" 
                    width={16} 
                    height={16}
                  />
                  <span className="text-white font-semibold">{row.instrument}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  row.side === "Buy" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {row.side}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white ml-2">{formatNumber(row.lotSize, 2)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white ml-2">{row.type}</span>
                </div>
                <div>
                  <span className="text-gray-400">Entry:</span>
                  <span className="text-white ml-2 font-mono">{formatNumber(row.entryPrice, 4)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Exit:</span>
                  <span className="text-white ml-2 font-mono">{formatNumber(row.closePrice, 4)}</span>
                </div>
                <div>
                  <span className="text-gray-400">P&L:</span>
                  <span className={`ml-2 font-bold ${
                    parseFloat(String(row.profitLoss)) < 0 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {parseFloat(String(row.profitLoss)) > 0 ? '+' : ''}
                    {formatNumber(row.profitLoss, 2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Margin:</span>
                  <span className="text-white ml-2 font-mono">{formatNumber(row.margin, 2)}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
                Closed: {formatDate(row.closedAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClosedPositionContent;