import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
  data?: SelectedData | null; 
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
  const selectedData = data ?? DEFAULT_SELECTED;
  const [value, setValue] = useState<number>(0.01);
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const { isOpen, toggleDropdown, closeDropdown, dropdownref, isClosing } = useToggleShow();

  // Reset value when pair changes
  useEffect(() => {
    setValue(0.01);
  }, [data?.pair]);

  // Log when live data is received
  useEffect(() => {
    if (data) {
      console.log('BuySell received live data:', selectedData);
    }
  }, [selectedData, data]);

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

  return (
    <div className={`w-full xl:p-3 xxl:p-3.5 p-2.5 overflow-hidden bg-black-300 rounded-20`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Image src={currencyFlags.base} className='h-3.5 w-3.5 rounded-full' alt="base currency" width={16} height={16} />
          <p className="leading-none text-white text-14px xl:text-[12px] pt-[2px] font-semibold">
            {selectedData.pair}
          </p>
          <Image src={currencyFlags.quote} className='h-3.5 w-3.5 rounded-full' alt="quote currency" width={16} height={16} />
        </div>
        <button
          onClick={() => handleOpenDialog('extand')}
          className="xl:p-1 xxl:p-3 p-2 rounded-lg bg-black-700 open-advance-tab"
        >
          <Image src="/Images/Icons/chevron-down.svg" alt="arrow-icon" className="rotate-180" width={16} height={16} />
        </button>
      </div>

      <div className="w-full h-[1px] bg-white bg-opacity-40 my-1.5"></div>

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
            <span className="pl-1 xl:text-sm text-[11px] font-medium">$