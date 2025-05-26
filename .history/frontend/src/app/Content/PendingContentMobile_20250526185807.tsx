import React, { useState } from 'react';
import { useToggleShow } from '@/UseToggleState/UseToggleShow';

// Import your SVGs or use require if not using next/image
import decreaseicon from '../../Images/icons/decrease.svg';
import increaseicon from '../../Images/icons/increase.svg';
import edit from '../../Images/icons/edit.svg';
import deletetrade from '../../Images/icons/delete-trade.svg';
import arrowdown from '../../Images/icons/chevron-down.svg';
import { useTradeContext } from '@/Context/TradeContext';

export interface PendingTradeRow {
  instrument: string;
  side: string;
  size: number | string;
  entryMarketPrice: number | string;
  stopLoss: number | string;
  takeProfit: number | string;
  margin: number | string;
  exposure: number | string;
  createdAt: string;
  fee: number | string;
  swap: number | string;
  profitLoss: number | string;
}
interface PendingContentMobileProps {
  pendingData: PendingTradeRow[];
  loading:boolean;
}

const PendingContentMobile: React.FC<PendingContentMobileProps> = ({ pendingData,loading }) => {
  const [openId, setOpenId] = useState<string | number | null>(null);
  const [pending] = useState(true);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<PendingTradeRow | null>(null);
  const { isOpen, toggleDropdown, closeDropdown, dropdownref, setIsOpen, isClosing } = useToggleShow();
  const [Closing, setClosing] = useState(false);
const {  handleCloseTrade}=useTradeContext();
  const handleOpenDialog = (type: string, rowData: PendingTradeRow) => {
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
      {pendingData.map((row , index) => (
        <div key={index} className='bg-black-700 rounded-2xl px-3 py-3'>
          <div className='up flex justify-between'>
            <div className='right flex gap-2'>
              <div className="array">
                <div className='bg-black-200 rounded-lg'>
                  <img
                    onClick={() => handleOpen(index)}
                    className={`p-1 transition-transform duration-300 ${
                      openId === index && !Closing ? 'rotate-180' : ''
                    }`}
                    src="/Images/Icons/chevron-down.svg"
                    alt="arrowdown.svg"
                  />
                </div>
              </div>
              <div className='flex flex-col gap-3 align-center text-start'>
                <p className='text-[11px] text-gray-200 font-semibold'>{row.instrument}</p>
                <div className='flex items-center text-center justify-center gap-2'>
                  <div className='flex items-center justify-center gap-3'>
                    <p className={`${row.side === "Buy" ? "text-green-500 border-green-500" : "text-red-500 border-red-500"} text-[11px] px-2 text-center font-semibold border rounded-full flex items-center justify-center`}>
                      {row.side}
                    </p>
                    <p className='text-[12px] font-semibold'>{row.size}</p>
                  </div>
                  <div className='w-[1px] h-full bg-gray-200'></div>
                  <div className='flex items-center justify-center gap-1.5'>
                    <p className='text-[11px] text-gray-400 font-semibold'>Size</p>
                    {/* <p className={`text-[11px] text-center ${openId === index ? "hidden" : "flex"}`}>{row.entryMarket}</p> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="left flex items-center justify-center flex-col gap-3">
              <p className='bg-blue-800 px-2 rounded-md text-blue-400 text-xs'>Pending limit</p>
              <div className='flex gap-2 justify-end'>
                <p className='text-xs text-white font-semibold bg-red-700 bg-opacity-50 px-1 py-0 rounded-md'>SL</p>
                <p className='text-xs text-black-300 font-semibold bg-green-500 bg-opacity-50 px-1 py-0 rounded-md'>TP</p>
              </div>
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openId === index
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
                  <p className='text-sm font-semibold p-0 m-0 font-base text-gray-400'>Current price</p>
                  <p className='text-sm font-semibold text-green-400'>{row.entryMarketPrice}</p>
                  <p className='text-[10px] text-white'>{row.createdAt}</p>
                </div>
                <div className='flex flex-col items-start justify-center gap-3'>
                  <p className='text-sm font-semibold p-0 m-0 font-base text-gray-400'>Target Price</p>
                  <p className='text-sm'>{row.exposure}</p>
                </div>
              </div>
              {/* middle */}
              <div className='flex justify-between'>
                <div className='flex flex-col items-start gap-[3px]'>
                  <p className='text-sm font-semibold p-0 m-0 font-base text-gray-400'>Exposure</p>
                  {/* <p className={`${Number(row.ProfitLoss) > 0 ? "text-green-300" : "text-red-500"} flex items-center text-sm`}>
                    {Number(row.ProfitLoss) > 0 ? (
                      <img src={increaseicon} alt="increase.svg" />
                    ) : (
                      <img src="/Images/Icons/decrease.svg" alt="decrease.svg" />
                    )}
                    {row.ProfitLoss}
                  </p> */}
                  {/* <p className='text-xs text-white font-semibold'>Order ID : {row.orderId}</p> */}
                </div>
                <div className='flex items-start flex-col gap-1'>
                  <p className='text-sm font-semibold'><span className='text-gray-400'>SL</span> : {row.stopLoss}</p>
                  <p className='text-sm font-semibold'><span className='text-gray-400'>TP</span> : {row.takeProfit}</p>
                </div>
              </div>
              {/* bottom */}
              <div className='grid grid-cols-3 gap-3'>
                <button
                  onClick={() => handleOpenDialog('modify', row)}
                  className='bg-black-200 flex item-center gap-2 justify-center py-3 rounded-lg'
                >
                  <img src="/Images/Icons/edit.svg" alt="edit.svg" /> <p className='text-[10px]'>Edit</p>
                </button>
                <div></div>
                <button onClick={()=>handleCloseTrade()} className='bg-black-200 flex gap-2 item-center justify-center py-3 rounded-lg'>
                  <img src="/Images/Icons/delete-trade.svg" alt="delete-trade.svg" /> <p className='text-[10px]'>Full close</p>
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
            className={`z-50 fixed bottom-0 left-0 md:relative xsm:bottom-0 xsm:left-0 lg:relative ${
              isClosing ? "lg:animate-slideUp animate-slideUpSmall" : "lg:animate-slideDown animate-slideDownSmall"
            }`}
          >
            {/* If you have a ModifyDialog, you can use it here */}
            {/* <ModifyDialog pending={pending} data={selectedData} onClose={closeDropdown} dropdownref={dropdownref} /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingContentMobile;