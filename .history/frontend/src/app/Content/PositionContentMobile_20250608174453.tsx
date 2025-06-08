
import React, { useState } from 'react';
import Image from 'next/image';
import { useToggleShow } from '@/UseToggleState/UseToggleShow';
import { formatDate } from '@/Constants/date';
import ModifyDialog from '@/Dialogs/ModifyDialog';
import { useTradeContext  } from '@/Context/TradeContext';


const PositionContentMobile: React.FC = () => {
  const [openId, setOpenId] = useState<string | number | null>(null);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
 const [selectedData, setSelectedData] = useState<any>(null);
  const { trades, loading, error } = useTradeContext();
  const { isOpen, toggleDropdown, closeDropdown, dropdownref, isClosing } = useToggleShow();
  const [Closing, setClosing] = useState(false);

  const handleOpenDialog = (type: string, rowData: any) => {
    setActiveDialog(type);
    setSelectedData(rowData);
    toggleDropdown();
  };

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
    <div className="flex gap-2 h-full flex-col overflow-y-auto chart-scrollbar 
      xsm:max-h-[calc(69vh-148px)]
      sm:max-h-[calc(80vh-140px)]
      xxsm:max-h-[calc(70vh-140px)]
      md:max-h-[calc(100vh-300px)]
      lg:max-h-[calc(100vh-350px)]
    ">
      {trades.map((row , index) => (
        <div key={row.positionId || index} className='bg-black-700 rounded-2xl px-3 py-3'>
          <div className='up flex justify-between'>
            <div className='right flex gap-2'>
              <div className="array ">
                <div className='bg-black-200 rounded-lg p-1'>
                  <Image
                    onClick={() => handleOpen(row.positionId)}
                    className={`transition-transform duration-300 ${
                      openId === row.positionId && !Closing ? 'rotate-180' : ''
                    }`}
                    src="/Images/Icons/chevron-down.svg"
                    alt="arrowdown.svg"
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              <div className='flex flex-col gap-3 align-center text-start'>
                <p className='text-[11px] text-gray-200 font-semibold'>{row.instrument}</p>
                <div className='flex items-center text-center justify-center gap-2'>
                  <div className='flex gap-2'>
                    <p className={`${row.side === "BUY" ? "text-green-500 border-green-500" : "text-red-500 border-red-500"} text-[11px] px-2 text-center font-semibold border rounded-full flex items-center justify-center`}>
                      {row.side}
                    </p>
                    <p className='text-[11px] font-semibold'>{row.lotSize}</p>
                  </div>
                  <div className='w-[1px] h-full bg-gray-200'></div>
                  <div className='flex items-center justify-start gap-1'>
                    <p className='text-[11px] text-gray-400 font-semibold'>Size</p>
                    <p className={`text-[10px] ${openId === row.positionId ? "hidden" : "flex"}`}>{row.entryPrice}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="left flex items-center justify-center flex-col gap-3">
              <p className={`${Number(row.margin) > 0 ? 'bg-green-900 text-green-500' : 'bg-red-900 text-red-500'} text-xs rounded-md px-2`}>US${row.margin}</p>
              <div className='flex gap-2 justify-end'>
                <p className='text-xs text-white font-semibold bg-red-600 px-1 py-0 rounded-md'>SL</p>
                <p className='text-xs text-black-300 font-semibold bg-green-600 px-1 py-0 rounded-md'>TP</p>
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
            <div className="bottom py-2 border-t mt-4 gap-4 flex flex-col border-gray-400">
              {/* up */}
              <div className='flex justify-between'>
                <div className='text-start flex flex-col gap-[3px]'>
                  <p className='text-sm font-semibold p-0 m-0 font-base text-gray-400'>Entry market</p>
                  <p className='text-sm font-semibold text-white'>{row.entryMarket}</p>
                  <p className='text-[10px] text-wrap text-white'>
                    {formatDate(row.createdAt)} | PositionID : {row.PositionID} | Swap : {row.swap}
                  </p>
                </div>
                <div className='flex flex-col items-start justify-center gap-3'>
                  <p className='text-[11px] font-semibold'><span className='text-gray-400'>SL</span> : {row.stopLoss}</p>
                  <p className='text-[11px] font-semibold'><span className='text-gray-400'>TP</span> : {row.takeProfit}</p>
                </div>
              </div>
              {/* middle */}
              <div className='flex justify-between'>
                <div className='flex flex-col items-start gap-[3px]'>
                  <p className='text-sm font-semibold p-0 m-0 font-base text-gray-400'>Profit/Loss</p>
                  <p className={`${Number(row.ProfitLoss) > 0 ? "text-green-300" : "text-red-500"} flex items-center text-sm`}>
                    {Number(row.ProfitLoss) > 0 ? (
                      <Image src="/Images/Icons/increase.svg" alt="increase.svg" width={16} height={16} />
                    ) : (
                      <Image src="/Images/Icons/decrease.svg" alt="decrease.svg" width={16} height={16} />
                    )}
                    {row.ProfitLoss}
                  </p>
                  <p className='text-xs text-white font-semibold'>Fee : USD${row.fee}</p>
                </div>
                <div className='flex items-start flex-col gap-1'>
                  <p className='text-sm font-semibold p-0 m-0 font-base text-gray-400'>Exposure</p>
                  <p className='text-sm'>{row.exposure}</p>
                </div>
              </div>
              {/* bottom */}
              <div className='grid grid-cols-3 gap-3'>
                <button onClick={() => handleOpenDialog('modify', row)} className='bg-black-200 flex item-center gap-2 justify-center py-3 rounded-lg'>
                  <Image src="/Images/Icons/edit.svg" alt="edit.svg" width={16} height={16} /> <p className='text-[10px]'>Edit</p>
                </button>
                <button onClick={() => handleOpenDialog('partial', row)} className='bg-black-200 flex gap-2 item-center justify-center py-3 rounded-lg'>
                  <Image src="/Images/Icons/close-trade.svg" alt="partial-close.svg" width={16} height={16} /> <p className='text-[10px]'>Partial close</p>
                </button>
                <button onClick={()=>handleCloseTrade(row.positionId)} className='bg-black-200 flex gap-2 item-center justify-center py-3 rounded-lg'>
                  <Image src="/Images/Icons/delete-trade.svg" alt="delete-trade.svg" width={16} height={16} /> <p className='text-[10px]'>Full close</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {isOpen && activeDialog === 'modify' && (
        <div className={`fixed h-screen top-0 left-0 w-full h-full bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
          <div
            ref={dropdownref}
            className={`z-50 fixed bottom-0 left-0 md:relative xsm:bottom-0 xsm:left-0 lg:relative ${isClosing ? "lg:animate-slideUp animate-slideUpSmall" : "lg:animate-slideDown animate-slideDownSmall"}`}
          >
            <ModifyDialog data={selectedData} onClose={closeDropdown} />
          </div>
        </div>
      )}
      {isOpen && activeDialog === 'partial' && (
        <div className={`fixed h-screen top-0 left-0 w-full h-full bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
          <div ref={dropdownref} className={`z-50 fixed bottom-0 left-0 md:relative xsm:bottom-0 xsm:left-0 lg:relative ${isClosing ? "lg:animate-slideUp animate-slideUpSmall" : "lg:animate-slideDown animate-slideDownSmall"}`}>
            {/* <PartialDialog data={selectedData} onClose={closeDropdown} dropdownref={dropdownref} /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionContentMobile;