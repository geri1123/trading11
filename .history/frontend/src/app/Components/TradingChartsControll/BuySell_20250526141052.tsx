import React, { useEffect, useState } from 'react';
import BuyDialog from '@/Dialogs/BuyDialog';
import { useToggleShow } from '@/UseToggleState/UseToggleShow';
import SellDialog from '@/Dialogs/SellDialog';
import Buysellextend from "@/Dialogs/Buysellextend"
interface SelectedData {
  pair: string;
  ask: number;
  bid: number;
  spread: number;
  dayHigh: number;
  dayLow: number;
}

type DialogType = 'buy' | 'sell' | 'extand' | null;

interface BuySellProps {
  data?: SelectedData | null; // Make prop optional
}

const DEFAULT_SELECTED: SelectedData = {
  pair: 'GBP/USD',
  ask: 1.10537,
  bid: 1.10532,
  spread: 0.00005,
  dayHigh: 1.11000,
  dayLow: 1.10000,
};

const BuySell: React.FC<BuySellProps> = ({ data }) => {
  // Use provided data or default to a fictional trade
  const [selectedData, setSelectedData] = useState<SelectedData>(data ?? DEFAULT_SELECTED);
  const [value, setValue] = useState<number>(0.01);
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const { isOpen, toggleDropdown, closeDropdown, dropdownref, isClosing } = useToggleShow();

  // Update selectedData if prop changes and is not null
  useEffect(() => {
    if (data) {
      setSelectedData(data);
    }
  }, [data]);

  useEffect(() => {
    setValue(0.01);
  }, [selectedData]);

  useEffect(() => {
    console.log('BuySell received data:', selectedData);
  }, [selectedData]);

  const decreaseValue = () => {
    setValue((prevValue) => Math.max(0.01, +(prevValue - 0.01).toFixed(2)));
  };

  const increaseValue = () => {
    setValue((prevValue) => +(prevValue + 0.01).toFixed(2));
  };

  const handleOpenDialog = (type: DialogType) => {
    setActiveDialog(type);
    toggleDropdown();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 0.01) {
      setValue(+inputValue.toFixed(2));
    }
  };

  const handleCloseDialog = () => {
    setActiveDialog(null);
    closeDropdown();
  };

  const getCurrencyFlags = (pair: string) => {
    if (!pair) return { base: '/Images/flags/gbp.svg', quote: '/Images/flags/usd.svg' };
    const currencies = pair.split('/');
    const base = currencies[0]?.toLowerCase();
    const quote = currencies[1]?.toLowerCase();
    const flagMap: Record<string, string> = {
      'gbp': '/Images/flags/gbp.svg',
      'usd': '/Images/flags/usd.svg',
      'eur': '/Images/flags/eur.svg',
      'jpy': '/Images/flags/jpy.svg',
      'cad': '/Images/flags/cad.svg',
      'aud': '/Images/flags/aud.svg',
      'chf': '/Images/flags/chf.svg',
      'nzd': '/Images/flags/nzd.svg',
      'nok': '/Images/flags/nok.svg',
      'sek': '/Images/flags/sek.svg',
      'dkk': '/Images/flags/dkk.svg',
      'czk': '/Images/flags/czk.svg',
      'hkd': '/Images/flags/hkd.svg',
      'mxn': '/Images/flags/mxn.svg',
      'huf': '/Images/flags/huf.svg',
      'pln': '/Images/flags/pln.svg',
      'try': '/Images/flags/try.svg',
      'zar': '/Images/flags/zar.svg',
      'rub': '/Images/flags/rub.svg',
      'ils': '/Images/flags/ils.svg',
      'sgd': '/Images/flags/sgd.svg',
      'cnh': '/Images/flags/cnh.svg',
    };
    return {
      base: flagMap[base] || '/Images/flags/gbp.svg',
      quote: flagMap[quote] || '/Images/flags/usd.svg'
    };
  };

  const currencyFlags = getCurrencyFlags(selectedData.pair);

  const getSpreadInfo = () => {
    if (!selectedData || !selectedData.ask || !selectedData.bid) return { spread: '-', percentage: '-' };
    const spread = selectedData.ask - selectedData.bid;
    const percentage = ((spread / selectedData.ask) * 100).toFixed(4);
    return {
      spread: spread.toFixed(5),
      percentage: `${percentage}%`
    };
  };

  const spreadInfo = getSpreadInfo();

  return (
    <div className={`w-full xl:p-3 xxl:p-3.5 p-2.5 overflow-hidden bg-black-300 rounded-20`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img src={currencyFlags.base} className='h-3.5 w-3.5 rounded-fulll' alt="base currency" />
          <p className="leading-none text-white text-14px xl:text-[12px] pt-[2px] font-semibold">
            {selectedData.pair}
          </p>
          <img src={currencyFlags.quote} className='h-3.5 w-3.5' alt="quote currency" />
        </div>
        <button
          onClick={() => handleOpenDialog('extand')}
          className="xl:p-1 xxl:p-3 p-2 rounded-lg bg-black-700 open-advance-tab"
        >
          <img src="/Images/Icons/chevron-down.svg" alt="arrow-icon" className="rotate-180" />
        </button>
      </div>

      <div className="w-full h-[1px] bg-white bg-opacity-40 my-1.5"></div>

      {/* <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
        <span>Spread: {spreadInfo.spread}</span>
        <span>({spreadInfo.percentage})</span>
      </div> */}

      <div className="flex items-start justify-between gap-4">
        <div className="w-3/12 flex flex-col gap-1 ">
          <p className="text-sm font-medium text-red-400">
            {selectedData.bid ? selectedData.bid.toFixed(5) : '-'}
          </p>
          <button
            onClick={() => handleOpenDialog('sell')}
            className={`w-full p-3 text-base font-normal leading-none text-white rounded-lg mt-2 open-sell-popup transition-opacity bg-red-400 hover:bg-red-500`}
          >
            Sell
          </button>
        </div>

        <div className="w-6/12 flex flex-col gap-1">
          <p className="text-sm xl:text-sm xxl:text-sm font-semibold text-white">
            Margin
            <span className="pl-1 xl:text-sm text-[11px] font-medium">$11.04920 / 0.11%</span>
          </p>
          <div className="w-full p-1 flex border rounded-lg bg-black-700 border-green-10 mt-1 flex items-center">
            <button
              className="border-none flex items-center justify-center w-1/6 outline-none"
              id="margin-decrease"
              onClick={decreaseValue}
              disabled={value <= 0.01}
            >
              <img src="/Images/Icons/minus.svg" alt="minus-icon" />
            </button>
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              className="leading-none text-center text-white bg-transparent focus:border-none focus:ring-0 border-none outline-none w-4/6 "
              id="margin-input"
            />
            <button
              className="border-none flex items-center justify-center w-1/6 outline-none"
              onClick={increaseValue}
            >
              <img src="/Images/Icons/plus.svg" alt="plus-icon" />
            </button>
          </div>
        </div>

        <div className="w-3/12 flex flex-col gap-1">
          <p className="text-sm font-medium text-green-300 text-end">
            {selectedData.ask ? selectedData.ask.toFixed(5) : '-'}
          </p>
          <button
            onClick={() => handleOpenDialog('buy')}
            className={`w-full p-3 text-base font-normal leading-none text-bodyBg rounded-lg mt-2 open-buy-popup transition-opacity bg-green-400 hover:bg-green-500`}
          >
            Buy
          </button>
        </div>
      </div>

      {isOpen && activeDialog === 'extand' && (
  <div className={`fixed h-screen top-0 left-0 w-full bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
    <div
      ref={dropdownref}
      className={`z-50 fixed bottom-0 left-0 md:relative xsm:bottom-0 xsm:left-0 lg:relative ${isClosing ? "lg:animate-slideUp animate-slideUpSmall" : "lg:animate-slideDown animate-slideDownSmall"}`}
    >
      <Buysellextend data={selectedData} onClose={closeDropdown} dropdownref={dropdownref} />
    </div>
  </div>
)}
      {isOpen && activeDialog === 'buy' && (
        <div className={`fixed h-screen top-0 left-0 w-full h-full bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
          <div
            ref={dropdownref}
            className={`z-50 fixed bottom-0 left-0 md:relative xsm:bottom-0 xsm:left-0 lg:relative ${isClosing ? "lg:animate-slideUp animate-slideUpSmall" : "lg:animate-slideDown animate-slideDownSmall"}`}
          >
            <BuyDialog value={value} onClose={closeDropdown} data={selectedData} />
          </div>
        </div>
      )}
      {isOpen && activeDialog === 'sell' && (
        <div className={`fixed h-full h-screen top-0 left-0 w-full bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
          <div
            ref={dropdownref}
            className={`z-50 fixed bottom-0 left-0 md:relative xsm:bottom-0 xsm:left-0 lg:relative ${isClosing ? "lg:animate-slideUp animate-slideUpSmall" : "lg:animate-slideDown animate-slideDownSmall"}`}
          >
            <SellDialog value={value} data={selectedData} onClose={closeDropdown} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BuySell;