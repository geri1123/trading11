
import React, { useState } from 'react';
import PositionContent from '@/Content/PositionContent';
import PendingContent from '@/Content/PendingContent';
import ClosedPositionContent from '@/Content/ClosedPositionContent';
import { useToggleShow } from '@/UseToggleState/UseToggleShow';
import ClosedPositionMobile from '@/app/Content/ClosedPositionMobile';
import PositionContentMobile from '@/app/Content/PositionContentMobile';
import PendingContentMobile from '@/app/Content/PendingContentMobile';
import CloseTradesDialog from '@/app/Dialogs/CloseTradesDialog';
import { useTradeContext } from '@/Context/TradeContext';
import Image from 'next/image';


export type TradeStatus = 'OPEN' | 'PENDING' | 'CLOSED';



const Trades: React.FC = () => {
  const { isOpen, toggleDropdown, closeDropdown, dropdownref, isClosing } = useToggleShow();
  const [summaryFilter, setSummaryFilter] = useState<string>('today');
  const {
    counts,
    trades,
    activeTab,
    setActiveTab,
    loading,
  } = useTradeContext();

  const getStatusForTab = (tab: typeof activeTab): TradeStatus => {
    if (tab === 'Position') return 'OPEN';
    if (tab === 'Pending') return 'PENDING';
    return 'CLOSED';
  };

  const handleOpenDialog = () => toggleDropdown();
  const handleCloseDialog = () => closeDropdown();

  return (
    <div className="w-full p-2 lg:p-2 xl:p-2 2xl:p-3 flex flex-col bg-black-300 rounded-20">
      {/* Top Section */}
      <div className="top lg:flex xxl:flex xl:flex items-center grid grid-cols-1 w-full border-b border-gray-500 lg:pb-3 xxl:pb-3 xl:pb-2 xxl:justify-between xl:justify-between lg:justify-between">
        {/* Tabs */}
        <div className="bg-black-700 p-2 flex justify-between lg:gap-4 xl:gap-4 xxl:gap-4 rounded-xl">
          {(['Position', 'Pending', 'Closed Position'] as const).map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'bg-black-300' : 'bg-black-700'} rounded-lg w-full px-2 py-2 lg:px-4 lg:py-2 xxl:px-4 xxl:py-2 2xl:px-4 2xl:py-2 xl:px-4 xl:py-1 flex items-center gap-2 justify-center`}
              onClick={() => setActiveTab(tab)}
            >
              <p className="whitespace-nowrap text-white md:text-[13px] sm:text-[13px] xsm:text-[8px] text-[13px] lg:text-base xl:text-sm xxl:text-base 2xl:text-base leading-none">{tab}</p>
              <div className="flex items-center justify-center w-5 h-5 rounded-md bg-black-200">
                <p className="text-white lg:text-[12px] xl:text-[12px] 2xl:text-[12px] text-[10px] leading-none">{counts[getStatusForTab(tab)]}</p>
              </div>
            </button>
          ))}
          <div className='w-full text-center flex items-center justify-end lg-hidden xl:hidden xxl:hidden'>
            <Image src="/Images/Icons/close-all-small.svg" onClick={handleOpenDialog} className='bg-black-200 p-2 rounded-lg lg:hidden xl:hidden xxl:hidden' alt="close-all-small.svg" width={20} height={20} />
          </div>
        </div>
        {/* Close All Trades Button + Summary */}
        <div className="flex items-center gap-6 ">
          {activeTab === 'Closed Position' && (
            <div className='lg:flex xl:flex xxl:flex 2xl:flex hidden gap-6'>
              <div className="flex items-start flex-col">
                <p className="text-xs font-medium text-white text-opacity-50">Summary</p>
                <select
                  className="h-full text-[9px] h-6 p-0 mt-1 px-3 text-white focus:ring-0 border-none outline-none cursor-pointer bg-black-700 font-medium"
                  value={summaryFilter}
                  onChange={e => setSummaryFilter(e.target.value)}
                >
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
              <div className='flex gap-6'>
                <div className='w-[1px] h-full bg-gray-500'></div>
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
                <div className='w-[1px] h-full bg-gray-500'></div>
              </div>
            </div>
          )}
          <button onClick={handleOpenDialog} className="lg:bg-transparent lg:border xl:border xl: border-white lg:border-white py-[5px] px-[3px] rounded-lg xl:px-5 xxl:px-5  lg:px-5 lg:rounded-lg xl:rounded-lg xxl:rounded-lg flex items-center gap-2 text-base text-white">
            <p className='hidden xl:text-sm lg:flex xl:flex xxl:flex'>Close all trades</p>
          </button>
        </div>
      </div>
      {/* Content Below */}
      <div className="mt-2 text-white">
        {activeTab === 'Position' && (
  <>
    <div className="hidden xl:block">
      <PositionContent />
    </div>
    <div className="block xl:hidden">
      <PositionContentMobile />
    </div>
  </>
)}

{activeTab === 'Pending' && (
  <>
    <div className="hidden xl:block">
      <PendingContent />
    </div>
    <div className="block xl:hidden">
      {/* <PendingContentMobile /> */}
    </div>
  </>
)}

{activeTab === 'Closed Position' && (
  <>
    <div className="hidden xl:block">
      <ClosedPositionContent />
    </div>
    <div className="block xl:hidden">
      <ClosedPositionMobile />
    </div>
  </>
)}
       
      </div>
      {/* Dialog */}
      {isOpen && (
        <div className={`fixed h-full h-screen top-0 left-0 w-full bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
          <div ref={dropdownref} className={`z-50 fixed bottom-0 left-0 md:relative xsm:bottom-0 xsm:left-0 lg:relative ${isClosing ? "lg:animate-slideUp animate-slideUpSmall" : "lg:animate-slideDown animate-slideDownSmall"}`}>
            <CloseTradesDialog onClose={handleCloseDialog} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Trades;