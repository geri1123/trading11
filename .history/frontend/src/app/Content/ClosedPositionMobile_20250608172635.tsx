
import React, { useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/Constants/date';
import { useTradeContext } from '@/Context/TradeContext';


const ClosedPositionMobile: React.FC = () => {
  const [openId, setOpenId] = useState<string | number | null>(null);
  const [Closing, setClosing] = useState(false);
const { trades, loading, error } = useTradeContext();
  const handleOpen = (id: string | number) => {
    if (openId === id) {
      setClosing(true);
      setTimeout(() => {
        setOpenId(null);
        setClosing(false);
      }, 300);
    } else {
      setOpenId(id);
      setClosing(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-2 chart-scrollbar
        xsm:max-h-[calc(69vh-148px)]
        sm:max-h-[calc(80vh-140px)]
        xxsm:max-h-[calc(70vh-140px)]
        md:max-h-[calc(100vh-300px)]
        lg:max-h-[calc(100vh-350px)]
        overflow-y-auto"
    >
      {/* Summary header for mobile */}
      <div className="flex justify-around gap-6 w-full">
        <div className="flex items-start flex-col">
          <p className="text-xs font-medium text-white text-opacity-50">Summary</p>
          <div className="bg-black-700 w-[120px] h-[34px] p-1 rounded-lg flex items-center justify-center mt-1">
            <select className="w-full text-xs text-white focus:ring-0 border-none outline-none cursor-pointer bg-black-700 font-medium">
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="this-year">This Year</option>
              <option value="last-day">Last 24 hours</option>
              <option value="last-week">Last 7 days</option>
              <option value="last-month">Last 30 days</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-white text-opacity-50">Profit/Loss</p>
          <div className="flex items-center gap-1.5 mt-3">
            <Image src="/Images/Icons/decrease.svg" alt="decrease-icon" width={12} height={12} />
            <p className="text-[10px] text-red-400 leading-none">-157.02</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-white text-opacity-50">Size</p>
          <div>
            <p className="text-[10px] font-medium text-white leading-none mt-3">0.01</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-white font-medium text-opacity-50">Withdrawal</p>
          <div>
            <p className="text-[10px] text-white font-medium leading-none text-end mt-3">-USD$15</p>
          </div>
        </div>
      </div>
     {trades.map((row: any, index: number)=> (
        <div
           key={row.positionId ||  index}
          className="bg-black-700 rounded-2xl px-3 py-3"
        >
          <div className="up flex justify-between">
            <div className="right flex gap-2">
              <div className="array ">
                <div className="bg-black-200 rounded-lg">
                  <Image
                    onClick={() => handleOpen(row.id)}
                    className={`p-1 transition-transform duration-300 ${openId === row.positionId && !Closing ? 'rotate-180' : ''}`}
                    src="/Images/Icons/chevron-down.svg"
                    alt="arrowdown.svg"
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 align-center justify-between text-start">
                <p className="text-[11px] text-gray-200 font-semibold">{row.instrument}</p>
                <div className="flex items-center text-center justify-center gap-2">
                  <div className="flex items-center justify-center gap-3">
                    <p
                      className={`${
                        row.side === 'Buy'
                          ? 'text-green-500 border-green-500'
                          : 'text-red-500 border-red-500'
                      } text-[11px] px-2 text-center font-semibold border rounded-full flex items-center justify-center`}
                    >
                      {row.side}
                    </p>
                    <p className="text-[12px] font-semibold">{row.size}</p>
                  </div>
                  <div className="w-[1px] h-full bg-gray-200"></div>
                  <div className="flex items-center justify-center gap-1.5">
                    <p className="text-[11px]  text-gray-400 font-semibold">Type</p>
                    <span className="ml-1 text-white">{row.type}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="left flex items-center justify-center flex-col gap-2">
              <p className={'bg-green-800 flex py-1 bg-opacity-50 px-2 rounded-md text-green-200 text-xs'}>
                <Image src="/Images/Icons/increase.svg" alt="" width={12} height={12} /> {row.marginUsed}
              </p>
              <div className="flex">
                <p>Market</p>
              </div>
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openId === row.positionId
                ? Closing
                  ? 'max-h-0 opacity-0'
                  : 'max-h-[500px] opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bottom py-2 border-t mt-4 gap-3 flex flex-col border-gray-400">
              <div className="flex justify-between">
                <div className="text-start flex flex-col gap-[3px]">
                  <p className="text-sm font-semibold p-0 m-0 font-base text-gray-400">Entry Price</p>
                  <p className="text-sm font-semibold text-white">{row.entryMarketPrice}</p>
                  <p className="text-[10px] text-white">{formatDate(row.createdAt)} </p>
                </div>
                <div className="flex flex-col items-start justify-between ">
                  <p className="text-sm font-semibold p-0 m-0 font-base text-gray-400">Exit Price</p>
                  <p className="text-sm font-semibold text-white">{row.closePrice}</p>
                  <p className="text-[10px] text-white">{formatDate(row.closedAt)?? ''} </p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-gray-500"></div>
              <div className="flex justify-between">
                <div className="flex flex-col items-start gap-[3px]">
                  <p className="text-sm font-semibold p-0 m-0 font-base text-gray-400">Order ID</p>
                  <p className="flex items-center font-semibold text-sm">{row.orderId}</p>
                  <p className="text-[10px] text-white font-semibold">
                    Position ID: {row.positionId} | Swap/Fee : USD${row.swap}/{row.fee}
                  </p>
                </div>
                <div className="flex items-start flex-col justify-between">
                  <p className="text-sm font-semibold">
                    <span className="text-gray-400">SL</span> : {row.stopLoss}
                  </p>
                  <p className="text-sm font-semibold">
                    <span className="text-gray-400">TP</span> : {row.takeProfit}
                  </p>
                  <p className="text-sm font-semibold">
                    <span className="text-gray-400">P/L</span> : <span className={parseFloat(String(row.profitLoss)) < 0 ? 'text-red-500' : 'text-green-500'}>{row.profitLoss}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClosedPositionMobile;

// import React, { useState } from 'react';
// import Image from 'next/image';
// import { formatDate } from '@/Constants/date';

// export interface ClosedTradeRow {
//   id: string | number;
//   instrument: string;
//   side: string;
//   size: number | string;
//   type: string;
//   entryMarketPrice: number | string;
//   stopLoss: number | string;
//   takeProfit: number | string;
//   closePrice: number | string;
//   closedAt: string;
//   marginUsed: number | string;
//   exposure: number | string;
//   createdAt: string;
//   fee: number | string;
//   swap: number | string;
//   profitLoss: number | string;
//   orderId: string | number;
//   positionId: string | number;
// }

// // Props for the mobile table
// interface ClosedPositionMobileProps {
//   ClosedData: ClosedTradeRow[];
// }

// const ClosedPositionMobile: React.FC<ClosedPositionMobileProps> = ({ ClosedData }) => {
//   const [openId, setOpenId] = useState<string | number | null>(null);
//   const [Closing, setClosing] = useState(false);

//   const handleOpen = (id: string | number) => {
//     if (openId === id) {
//       setClosing(true);
//       setTimeout(() => {
//         setOpenId(null);
//         setClosing(false);
//       }, 300);
//     } else {
//       setOpenId(id);
//       setClosing(false);
//     }
//   };

//   return (
//     <div
//       className="flex flex-col gap-2 chart-scrollbar
//         xsm:max-h-[calc(69vh-148px)]
//         sm:max-h-[calc(80vh-140px)]
//         xxsm:max-h-[calc(70vh-140px)]
//         md:max-h-[calc(100vh-300px)]
//         lg:max-h-[calc(100vh-350px)]
//         overflow-y-auto"
//     >
//       {/* Summary header for mobile */}
//       <div className="flex justify-around gap-6 w-full">
//         <div className="flex items-start flex-col">
//           <p className="text-xs font-medium text-white text-opacity-50">Summary</p>
//           <div className="bg-black-700 w-[120px] h-[34px] p-1 rounded-lg flex items-center justify-center mt-1">
//             <select className="w-full text-xs text-white focus:ring-0 border-none outline-none cursor-pointer bg-black-700 font-medium">
//               <option value="today">Today</option>
//               <option value="this-week">This Week</option>
//               <option value="this-month">This Month</option>
//               <option value="this-year">This Year</option>
//               <option value="last-day">Last 24 hours</option>
//               <option value="last-week">Last 7 days</option>
//               <option value="last-month">Last 30 days</option>
//               <option value="all">All</option>
//             </select>
//           </div>
//         </div>
//         <div>
//           <p className="text-xs font-medium text-white text-opacity-50">Profit/Loss</p>
//           <div className="flex items-center gap-1.5 mt-3">
//             <Image src="/Images/Icons/decrease.svg" alt="decrease-icon" width={12} height={12} />
//             <p className="text-[10px] text-red-400 leading-none">-157.02</p>
//           </div>
//         </div>
//         <div>
//           <p className="text-xs font-medium text-white text-opacity-50">Size</p>
//           <div>
//             <p className="text-[10px] font-medium text-white leading-none mt-3">0.01</p>
//           </div>
//         </div>
//         <div>
//           <p className="text-xs text-white font-medium text-opacity-50">Withdrawal</p>
//           <div>
//             <p className="text-[10px] text-white font-medium leading-none text-end mt-3">-USD$15</p>
//           </div>
//         </div>
//       </div>
//       {ClosedData.map((row) => (
//         <div
//           key={row.id}
//           className="bg-black-700 rounded-2xl px-3 py-3"
//         >
//           <div className="up flex justify-between">
//             <div className="right flex gap-2">
//               <div className="array ">
//                 <div className="bg-black-200 rounded-lg">
//                   <Image
//                     onClick={() => handleOpen(row.id)}
//                     className={`p-1 transition-transform duration-300 ${openId === row.id && !Closing ? 'rotate-180' : ''}`}
//                     src="/Images/Icons/chevron-down.svg"
//                     alt="arrowdown.svg"
//                     width={16}
//                     height={16}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-col gap-3 align-center justify-between text-start">
//                 <p className="text-[11px] text-gray-200 font-semibold">{row.instrument}</p>
//                 <div className="flex items-center text-center justify-center gap-2">
//                   <div className="flex items-center justify-center gap-3">
//                     <p
//                       className={`${
//                         row.side === 'Buy'
//                           ? 'text-green-500 border-green-500'
//                           : 'text-red-500 border-red-500'
//                       } text-[11px] px-2 text-center font-semibold border rounded-full flex items-center justify-center`}
//                     >
//                       {row.side}
//                     </p>
//                     <p className="text-[12px] font-semibold">{row.size}</p>
//                   </div>
//                   <div className="w-[1px] h-full bg-gray-200"></div>
//                   <div className="flex items-center justify-center gap-1.5">
//                     <p className="text-[11px]  text-gray-400 font-semibold">Type</p>
//                     <span className="ml-1 text-white">{row.type}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="left flex items-center justify-center flex-col gap-2">
//               <p className={'bg-green-800 flex py-1 bg-opacity-50 px-2 rounded-md text-green-200 text-xs'}>
//                 <Image src="/Images/Icons/increase.svg" alt="" width={12} height={12} /> {row.marginUsed}
//               </p>
//               <div className="flex">
//                 <p>Market</p>
//               </div>
//             </div>
//           </div>
//           <div
//             className={`overflow-hidden transition-all duration-300 ${
//               openId === row.id
//                 ? Closing
//                   ? 'max-h-0 opacity-0'
//                   : 'max-h-[500px] opacity-100'
//                 : 'max-h-0 opacity-0'
//             }`}
//           >
//             <div className="bottom py-2 border-t mt-4 gap-3 flex flex-col border-gray-400">
//               <div className="flex justify-between">
//                 <div className="text-start flex flex-col gap-[3px]">
//                   <p className="text-sm font-semibold p-0 m-0 font-base text-gray-400">Entry Price</p>
//                   <p className="text-sm font-semibold text-white">{row.entryMarketPrice}</p>
//                   <p className="text-[10px] text-white">{formatDate(row.createdAt)} </p>
//                 </div>
//                 <div className="flex flex-col items-start justify-between ">
//                   <p className="text-sm font-semibold p-0 m-0 font-base text-gray-400">Exit Price</p>
//                   <p className="text-sm font-semibold text-white">{row.closePrice}</p>
//                   <p className="text-[10px] text-white">{formatDate(row.closedAt)?? ''} </p>
//                 </div>
//               </div>
//               <div className="w-full h-[1px] bg-gray-500"></div>
//               <div className="flex justify-between">
//                 <div className="flex flex-col items-start gap-[3px]">
//                   <p className="text-sm font-semibold p-0 m-0 font-base text-gray-400">Order ID</p>
//                   <p className="flex items-center font-semibold text-sm">{row.orderId}</p>
//                   <p className="text-[10px] text-white font-semibold">
//                     Position ID: {row.positionId} | Swap/Fee : USD${row.swap}/{row.fee}
//                   </p>
//                 </div>
//                 <div className="flex items-start flex-col justify-between">
//                   <p className="text-sm font-semibold">
//                     <span className="text-gray-400">SL</span> : {row.stopLoss}
//                   </p>
//                   <p className="text-sm font-semibold">
//                     <span className="text-gray-400">TP</span> : {row.takeProfit}
//                   </p>
//                   <p className="text-sm font-semibold">
//                     <span className="text-gray-400">P/L</span> : <span className={parseFloat(String(row.profitLoss)) < 0 ? 'text-red-500' : 'text-green-500'}>{row.profitLoss}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ClosedPositionMobile;