import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BuyDialog from '@/Dialogs/BuyDialog';
import { useToggleShow } from '@/UseToggleState/UseToggleShow';
import SellDialog from '@/Dialogs/SellDialog';
import Buysellextend from '@/Dialogs/Buysellextend';

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
  data?: SelectedData | null;
}

const BuySell: React.FC<BuySellProps> = ({ data }) => {
  const [value, setValue] = useState<number>(0.01);
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const { isOpen, toggleDropdown, closeDropdown, dropdownref, isClosing } = useToggleShow();

  useEffect(() => {
    setValue(0.01);
  }, [data?.pair]);

  const decreaseValue = () => {
    setValue((prev) => Math.max(0.01, +(prev - 0.01).toFixed(2)));
  };

  const increaseValue = () => {
    setValue((prev) => +(prev + 0.01).toFixed(2));
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

  if (!data) {
    return <div className="text-white p-4">Please select a currency pair.</div>;
  }

  const getCurrencyFlags = (pair: string) => {
    const [base = '', quote = ''] = pair.toLowerCase().split('/');
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
      quote: flagMap[quote] || '/Images/flags/usd.svg',
    };
  };

  const currencyFlags = getCurrencyFlags(data.pair);

  return (
    <div className="w-full xl:p-3 xxl:p-3.5 p-2.5 overflow-hidden bg-black-300 rounded-20">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Image src={currencyFlags.base} className="h-3.5 w-3.5 rounded-full" alt="base" width={16} height={16} />
          <p className="text-white text-[14px] xl:text-[12px] pt-[2px] font-semibold">{data.pair}</p>
          <Image src={currencyFlags.quote} className="h-3.5 w-3.5 rounded-full" alt="quote" width={16} height={16} />
        </div>
        <button onClick={() => handleOpenDialog('extand')} className="xl:p-1 xxl:p-3 p-2 rounded-lg bg-black-700">
          <Image src="/Images/Icons/chevron-down.svg" alt="expand" className="rotate-180" width={16} height={16} />
        </button>
      </div>

      <div className="w-full h-[1px] bg-white bg-opacity-40 my-1.5"></div>

      <div className="flex items-start justify-between gap-4">
        {/* Sell Section */}
        <div className="w-3/12 flex flex-col gap-1">
          <p className="text-sm font-medium text-red-400">{data.bid?.toFixed(5) ?? '-'}</p>
          <button
            onClick={() => handleOpenDialog('sell')}
            className="w-full p-3 text-base font-normal text-white rounded-lg mt-2 bg-red-400 hover:bg-red-500"
          >
            Sell
          </button>
        </div>

        {/* Margin Input */}
        <div className="w-6/12 flex flex-col gap-1">
          <p className="text-sm font-semibold text-white">
            Margin
            <span className="pl-1 text-[11px] font-medium">$11.04920 / 0.11%</span>
          </p>
          <div className="flex p-1 mt-1 bg-black-700 border border-green-10 rounded-lg items-center">
            <button className="w-1/6" onClick={decreaseValue} disabled={value <= 0.01}>
              <Image src="/Images/Icons/minus.svg" alt="minus" width={16} height={16} />
            </button>
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              className="w-4/6 text-center text-white bg-transparent outline-none"
            />
            <button className="w-1/6" onClick={increaseValue}>
              <Image src="/Images/Icons/plus.svg" alt="plus" width={16} height={16} />
            </button>
          </div>
        </div>

        {/* Buy Section */}
        <div className="w-3/12 flex flex-col gap-1">
          <p className="text-sm font-medium text-green-300 text-end">{data.ask?.toFixed(5) ?? '-'}</p>
          <button
            onClick={() => handleOpenDialog('buy')}
            className="w-full p-3 text-base font-normal text-bodyBg rounded-lg mt-2 bg-green-400 hover:bg-green-500"
          >
            Buy
          </button>
        </div>
      </div>

      {/* Dialogs */}
      {isOpen && activeDialog === 'extand' && (
        <div
          className={`fixed inset-0 bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${
            isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
          }`}
        >
          <div
            ref={dropdownref}
            className={`z-50 fixed bottom-0 left-0 md:relative ${
              isClosing ? 'lg:animate-slideUp animate-slideUpSmall' : 'lg:animate-slideDown animate-slideDownSmall'
            }`}
          >
            <Buysellextend data={data} onClose={closeDropdown} dropdownref={dropdownref} />
          </div>
        </div>
      )}

      {isOpen && activeDialog === 'buy' && (
        <div
          className={`fixed inset-0 bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${
            isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
          }`}
        >
          <div
            ref={dropdownref}
            className={`z-50 fixed bottom-0 left-0 md:relative ${
              isClosing ? 'lg:animate-slideUp animate-slideUpSmall' : 'lg:animate-slideDown animate-slideDownSmall'
            }`}
          >
            <BuyDialog value={value} onClose={closeDropdown} data={data} />
          </div>
        </div>
      )}

      {isOpen && activeDialog === 'sell' && (
        <div
          className={`fixed inset-0 bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${
            isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
          }`}
        >
          <div
            ref={dropdownref}
            className={`z-50 fixed bottom-0 left-0 md:relative ${
              isClosing ? 'lg:animate-slideUp animate-slideUpSmall' : 'lg:animate-slideDown animate-slideDownSmall'
            }`}
          >
            <SellDialog value={value} onClose={closeDropdown} data={data} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BuySell;
