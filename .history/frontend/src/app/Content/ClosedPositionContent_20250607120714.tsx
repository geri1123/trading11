


// import React from 'react';
// import Image from 'next/image';
// import { formatDate } from '@/Constants/date';
// import { useTradeContext } from '@/Context/TradeContext';



// const ClosedPositionContent: React.FC= () => {
//     const { trades, loading, error } = useTradeContext();

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!trades || trades.length === 0) return <div>No closed positions found</div>;
//   return (
//     <div className="overflow-x-auto  overflow-y-auto max-h-[140px] chart-scrollbar">
//       <div className="min-w-max  hidden lg:block  bg-black-700 text-gray-300">
//         {/* Header */}
//         <div className="flex items-center py-1 border-b border-gray-700 bg-black-700 sticky top-0 z-10">
//           <div className="w-40 bg-black-700 sticky left-0 px-4 text-white text-[13px] font-normal">Instrument</div>
//           <div className="w-20 px-4 text-white text-[13px] font-normal">Side</div>
//           <div className="w-20 px-4 text-white text-[13px] font-normal">Size</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Type</div>
//           <div className="w-40 px-4 text-white text-[13px] font-normal">Entry Market</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Stop Loss</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Take Profit</div>
//           <div className="w-24 px-4 text-white text-[13px] font-normal">Exit Price</div>
//           <div className="w-42 px-4 text-white text-[13px] font-normal">Exit Time</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Margin</div>
//           <div className="w-20 px-4 text-white text-[13px] font-normal">Exposure</div>
//           <div className="w-42 px-4 text-white text-[13px] font-normal">Created At</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Fee</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Swap</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Profit Loss</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">Order Id</div>
//           <div className="w-32 px-4 text-white text-[13px] font-normal">PositionId</div>
//         </div>
//         {/* Data Rows */}
//         {trades.map((row: any, index: number) => (
//           <div
//              key={row.positionId || row.id || index}
//             className="flex items-center py-1 border-b border-gray-500 hover:bg-black-300"
//           >
//             {/* Instrument and Image */}
//             <div className="w-40 flex sticky left-0 bg-black-700 items-center gap-2 justify-center px-4">
//               <div>
//                 <Image src="/Images/Icons/qube.svg" alt="qube.svg" width={16} height={16} />
//               </div>
//               <div className="text-white text-[12px] font-semibold">{row.instrument}</div>
//             </div>
//             {/* Side */}
//             <div className="w-20 flex items-center justify-center px-4">
//               <span className={` text-[15px] font-semibold ${row.side === "Buy" ? "text-green-500" : "text-red-500"}`}>{row.side}</span>
//             </div>
//             {/* Size */}
//             <div className="w-20 flex items-center justify-center text-white font-semibold text-[13px] px-4">
//               {row.lotSize}
//             </div>
//             {/* type */}
//             <div className="w-32 flex items-center justify-center text-white font-semibold text-[13px] px-4">
//               {row.type}
//             </div>
//             {/* Entry Market */}
//             <div className="w-40 flex items-center justify-center text-[10px] font-semibold text-white px-4">
//               {row.entryPrice}
//             </div>
//             {/* Stop Loss */}
//             <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4">
//               {row.stopLoss}
//             </div>
//             {/* Take Profit */}
//             <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4">
//               {row.takeProfit}
//             </div>
//             {/* Exit price */}
//             <div className="w-24 flex items-center justify-center text-[13px] font-semibold text-white px-4">
//               {row.closePrice}
//             </div>
//             {/*Exit time */}
//             <div className="w-42 flex items-center justify-center text-[13px] font-semibold text-white px-4">
//               {formatDate(row.closedAt)}
//             </div>
//             {/* Margin */}
//             <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4">
//               {row.margin}
//             </div>
//             {/* Exposure */}
//             <div className="w-20 flex items-center justify-center text-[13px] font-semibold text-white px-4">
//               {row.exposure}
//             </div>
//             {/* Created */}
//             <div className="w-42 flex items-center justify-center text-[13px] font-semibold text-white px-4">
//               {formatDate(row.openedAt)}
//             </div>
//             {/* fee */}
//             <div className='w-32 flex items-center justify-center text-[13px] font-semibold px-4 '>
//               {row.fee}
//             </div>
//             {/* Swap */}
//             <div className='w-32 flex items-center justify-center text-[13px] font-semibold px-4 '>
//               {row.swap}
//             </div>
//             {/* Profit/Loss */}
//             <div className={`w-32 flex items-center justify-center text-[13px] font-semibold px-4 ${
//               parseFloat(String(row.profitLoss)) < 0 ? 'text-red-500' : 'text-green-500'
//             }`}>
//               {row.profitLoss}
//             </div>
//             {/* Order id */}
//             <div className='w-32 flex items-center justify-center text-[13px] font-semibold px-4 '>
//               {row.id}
//             </div>
//             {/* PositionId */}
//             <div className='w-32 flex items-center justify-center text-[13px] font-semibold px-4 '>
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
  // Return fallback for missing values
  if (num === null || num === undefined || num === '') return '-';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  // If not a valid number, return as is (prevents NaN showing)
  return isNaN(n) ? num : n.toLocaleString(undefined, { maximumFractionDigits: decimals });
};fig = [
  { label: 'Instrument', width: 'w-40' },
  { label: 'Side', width: 'w-20' },
  { label: 'Size', width: 'w-20' },
  { label: 'Type', width: 'w-32' },
  { label: 'Entry Market', width: 'w-40' },
  { label: 'Stop Loss', width: 'w-32' },
  { label: 'Take Profit', width: 'w-32' },
  { label: 'Exit Price', width: 'w-24' },
  { label: 'Exit Time', width: 'w-42' },
  { label: 'Margin', width: 'w-32' },
  { label: 'Exposure', width: 'w-20' },
  { label: 'Created At', width: 'w-42' },
  { label: 'Fee', width: 'w-32' },
  { label: 'Swap', width: 'w-32' },
  { label: 'Profit Loss', width: 'w-32' },
  { label: 'Order Id', width: 'w-32' },
  { label: 'PositionId', width: 'w-32' },
];

const ClosedPositionContent: React.FC = () => {
  const { trades, loading, error } = useTradeContext();

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8">Error: {error}</div>;
  if (!trades || trades.length === 0) return <div className="text-center py-8">No closed positions found</div>;
  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[140px] chart-scrollbar">
      <div className="min-w-max hidden lg:block bg-black-700 text-gray-300">
        {/* Header */}
        <div className="flex items-center py-1 border-b border-gray-700 bg-black-700 sticky top-0 z-10">
          {headerConfig.map((h) => (
            <div
              key={h.label}
              className={`${h.width} px-4 flex justify-center items-center text-white text-[13px] font-normal whitespace-nowrap ${
                h.label === 'Instrument' ? 'sticky left-0 bg-black-700 z-10' : ''
              }`}
            >
              {h.label}
            </div>
          ))}
        </div>
        {/* Data Rows */}
        {trades.map((row: any, index: number) => (
          <div
            key={row.positionId || row.id || index}
            className="flex items-center py-1 border-b border-gray-500 hover:bg-black-300"
          >
            {/* Instrument and Image */}
            <div className="w-40 flex sticky left-0 bg-black-700 items-center justify-center gap-2 px-4 z-10">
              <Image src="/Images/Icons/qube.svg" alt="qube.svg" width={16} height={16} />
              <span className="text-white text-[12px] font-semibold">{row.instrument}</span>
            </div>
            {/* Side */}
            <div className="w-20 flex items-center justify-center px-4">
              <span className={`text-[15px] font-semibold ${row.side === "Buy" ? "text-green-500" : "text-red-500"}`}>{row.side}</span>
            </div>
            {/* Size */}
            <div className="w-20 flex items-center justify-center text-white font-semibold text-[13px] px-4 whitespace-nowrap">
              {formatNumber(row.lotSize, 2)}
            </div>
            {/* Type */}
            <div className="w-32 flex items-center justify-center text-white font-semibold text-[13px] px-4 whitespace-nowrap">
              {row.type}
            </div>
            {/* Entry Market */}
            <div className="w-40 flex items-center justify-center text-[10px] font-semibold text-white px-4 whitespace-nowrap">
              {formatNumber(row.entryPrice, 4)}
            </div>
            {/* Stop Loss */}
            <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
              {formatNumber(row.stopLoss, 4)}
            </div>
            {/* Take Profit */}
            <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
              {formatNumber(row.takeProfit, 4)}
            </div>
            {/* Exit Price */}
            <div className="w-24 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
              {formatNumber(row.closePrice, 4)}
            </div>
            {/* Exit Time */}
            <div className="w-42 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
              {formatDate(row.closedAt)}
            </div>
            {/* Margin */}
            <div className="w-32 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
              {formatNumber(row.margin, 2)}
            </div>
            {/* Exposure */}
            <div className="w-20 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
              {formatNumber(row.exposure, 2)}
            </div>
            {/* Created At */}
            <div className="w-42 flex items-center justify-center text-[13px] font-semibold text-white px-4 whitespace-nowrap">
              {formatDate(row.openedAt)}
            </div>
            {/* Fee */}
            <div className="w-32 flex items-center justify-center text-[13px] font-semibold px-4 whitespace-nowrap">
              {formatNumber(row.fee, 2)}
            </div>
            {/* Swap */}
            <div className="w-32 flex items-center justify-center text-[13px] font-semibold px-4 whitespace-nowrap">
              {formatNumber(row.swap, 2)}
            </div>
            {/* Profit/Loss */}
            <div className={`w-32 flex items-center justify-center text-[13px] font-semibold px-4 whitespace-nowrap ${
              parseFloat(String(row.profitLoss)) < 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              {formatNumber(row.profitLoss, 2)}
            </div>
            {/* Order Id */}
            <div className="w-32 flex items-center justify-center text-[13px] font-semibold px-4 whitespace-nowrap">
              {row.id}
            </div>
            {/* PositionId */}
            <div className="w-32 flex items-center justify-center text-[13px] font-semibold px-4 whitespace-nowrap">
              {row.positionId}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClosedPositionContent;