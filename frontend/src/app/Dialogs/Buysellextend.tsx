
import React, { useState, useEffect, RefObject } from 'react';
import Image from 'next/image';

// Define the SelectedData interface for type safety
interface SelectedData {
  pair: string;
  ask: number;
  bid: number;
  spread: number;
  dayHigh: number;
  dayLow: number;
}

// Define the BuysellextendProps interface
interface BuysellextendProps {
  onClose: () => void;
  dropdownref: RefObject<HTMLDivElement | null>;
  data: SelectedData;
}

const Buysellextend: React.FC<BuysellextendProps> = ({ onClose, dropdownref, data }) => {
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [MarkPend, setMarkPend] = useState<'market' | 'pending'>('market');
  const [buysell, setBuysell] = useState<'buy' | 'sell'>('buy');
  const [value, setValue] = useState<number>(0.01);
  const [value1, setValue1] = useState<number>(0.01);

  // Minimum swipe distance to trigger close
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.touches[0].clientY);
  };

  useEffect(() => {
    setValue(0.01);
  }, [buysell]);

  const handleTouchEnd = () => {
    if (touchStart && touchEnd && touchEnd - touchStart > minSwipeDistance) {
      onClose();
    }
  };

  const handleValueChange = (
    type: 'value' | 'value1',
    operation: 'increase' | 'decrease'
  ) => {
    if (type === 'value') {
      setValue((prev) => {
        const newValue = operation === 'increase' ? prev + 0.01 : prev - 0.01;
        return newValue >= 0.01 ? parseFloat(newValue.toFixed(2)) : prev;
      });
    } else if (type === 'value1') {
      setValue1((prev) => {
        const newValue = operation === 'increase' ? prev + 0.01 : prev - 0.01;
        return newValue >= 0.01 ? parseFloat(newValue.toFixed(2)) : prev;
      });
    }
  };

  return (
    <div
      ref={dropdownref}
      className="bg-black-300 w-screen md:w-[450px] gap-2 lg:w-[450px] xxl:w-[500px] xl:w-[500px] p-5 flex flex-col items-center  justify-center rounded-20"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drag handle bar */}
      <div className="w-[100px] h-[4px] bg-white rounded-xl"></div>
      <div className='w-full grid grid-cols-2  gap-2 items-center p-1.5 bg-black-700 rounded-lg'>
        <button
          onClick={() => setMarkPend('market')}
          className={`p-1 text-center rounded-lg ${MarkPend === 'market' ? 'border border-gray-300' : ''}`}
        >
          <p className='text-sm text-white '>Market</p>
        </button>
        <button
          onClick={() => setMarkPend('pending')}
          className={`p-1 text-center rounded-lg ${MarkPend === 'pending' ? 'border border-gray-300' : ''}`}
        >
          <p className='text-sm text-white  '>Pending</p>
        </button>
      </div>
      {MarkPend === 'pending' && (
        <div className="w-full flex border rounded-lg bg-black-700 border-green-10 flex items-center border-green-400">
          <button
            className="border-none flex items-center justify-center w-1/6 outline-none"
            id="margin-decrease"
            onClick={() => handleValueChange('value1', 'decrease')}
          >
            <Image src="/Images/Icons/minus.svg" alt="minus-icon" width={20} height={20} />
          </button>
          <input
            type="text"
            value={value1}
            className="leading-none text-center text-white bg-transparent focus:border-none focus:ring-0 border-none outline-none w-4/6 "
            id="margin-input"
            readOnly
          />
          <button
            className="border-none flex items-center justify-center  w-1/6 outline-none"
            onClick={() => handleValueChange('value1', 'increase')}
          >
            <Image src="/Images/Icons/plus.svg" alt="plus-icon" width={20} height={20} />
          </button>
        </div>
      )}
      <div className='w-full grid grid-cols-2  gap-2 items-center p-1.5 bg-black-700 rounded-lg'>
        <button
          onClick={() => setBuysell('sell')}
          className={`p-1 text-center rounded-lg ${buysell === 'sell' ? 'border bg-red-300/20 border-red-400' : ''}`}
        >
          <p className="text-sm text-white">Sell</p>
        </button>
        <button
          onClick={() => setBuysell('buy')}
          className={`${buysell === 'buy' ? 'border bg-green-300/20 border-green-400' : ''} p-1  text-center  rounded-lg`}
        >
          <p className='text-sm text-white '>Buy</p>
        </button>
      </div>
      <p className='text-[12px]  text-white text-end w-full mr-6 text-red-600'>
        Stop Loss value must be Greater than 1.10373
      </p>

      <div className="flex w-full gap-4">
        <div className="w-[60px]"></div>
        <label className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 border rounded-lg cursor-pointer border-gray-500 hover:bg-gray-800 group">
          <input type="checkbox" className="w-4 h-4  peer" />
          <span className="text-white text-sm">Stop Loss</span>
        </label>
        <label className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 border rounded-lg cursor-pointer border-gray-500 hover:bg-gray-800 group">
          <input type="checkbox" className="w-4 h-4  peer" />
          <span className="text-white text-sm">Take Profit</span>
        </label>
      </div>
      <div className="flex w-full gap-4">
        <div className="w-[60px] flex items-center justify-center">
          <p className='text-[12px] w-full text-white'>Price</p>
        </div>
        <label className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 border rounded-lg cursor-pointer border-gray-500 hover:bg-gray-800 group">
          <input
            type="number"
            className="w-full bg-transparent text-white border-none h-4 peer focus:outline-none focus:ring-0"
          />
        </label>
        <label className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 border rounded-lg cursor-pointer border-gray-500 hover:bg-gray-800 group">
          <input
            type="number"
            className="w-full bg-transparent text-white border-none h-4 peer focus:outline-none focus:ring-0"
          />
        </label>
      </div>
      <div className="flex w-full gap-4">
        <div className="w-[60px] flex items-center justify-center">
          <p className='text-[12px] w-full text-white'>Tick</p>
        </div>
        <label className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 border rounded-lg cursor-pointer border-gray-500 group">
          <p className="w-full bg-transparent text-[12px] text-white border-none h-4 peer focus:outline-none focus:ring-0">
            -5
          </p>
        </label>
        <label className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 border rounded-lg cursor-pointer border-gray-500  group">
          <p className="w-full text-[12px] bg-transparent text-white border-none h-4 ">
            2
          </p>
        </label>
      </div>
      <div className="flex w-full gap-4">
        <div className="w-[60px] flex items-center justify-center">
          <p className='text-[12px] w-full text-white'>P&amp;L</p>
        </div>
        <label className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 border rounded-lg cursor-pointer border-gray-500 group">
          <p className="w-full bg-transparent text-[12px] text-white border-none h-4 peer focus:outline-none focus:ring-0">
            $0.2
          </p>
        </label>
        <label className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 border rounded-lg cursor-pointer border-gray-500  group">
          <p className="w-full text-[12px] bg-transparent text-white border-none h-4 ">
            $0.04
          </p>
        </label>
      </div>
      <div className="flex w-full gap-4">
        <div className="w-[60px] flex items-center justify-center">
          <p className='text-[12px] w-full text-white'>Balance</p>
        </div>
        <label className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 border rounded-lg cursor-pointer border-gray-500 group">
          <p className="w-full bg-transparent text-[12px] text-white border-none h-4 peer focus:outline-none focus:ring-0">
            -0.0001%
          </p>
        </label>
        <label className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 border rounded-lg cursor-pointer border-gray-500  group">
          <p className="w-full text-[12px] bg-transparent text-white border-none h-4 ">
            -0.000%
          </p>
        </label>
      </div>
      <div className='w-full h-[1px] bg-gray-400'></div>
      <div className='w-full flex flex-col gap-2'>
        <div className="flex w-full items-center justify-between ">
          <p className="text-[12px] text-white">Size</p>
          <p className="text-[13px] text-white">Margin $11.04920 / 0.11%</p>
        </div>
        <div className={`w-full flex border rounded-lg bg-black-700 border-green-10 flex items-center ${buysell === 'sell' ? 'border border-red-400' : 'border border-green-400'}`}>
          <button
            className="border-none flex items-center justify-center w-1/6 outline-none"
            id="margin-decrease"
            onClick={() => handleValueChange('value', 'decrease')}
          >
            <Image src="/Images/Icons/minus.svg" alt="minus-icon" width={20} height={20} />
          </button>
          <input
            type="text"
            value={value}
            className="leading-none text-center text-white bg-transparent focus:border-none focus:ring-0 border-none outline-none w-4/6 "
            id="margin-input"
            readOnly
          />
          <button
            className="border-none flex items-center justify-center  w-1/6 outline-none"
            onClick={() => handleValueChange('value', 'increase')}
          >
            <Image src="/Images/Icons/plus.svg" alt="plus-icon" width={20} height={20} />
          </button>
        </div>
      </div>
      <div className='flex w-full gap-3 mt-4'>
        <button
          onClick={onClose}
          className='w-1/3 border-1 border-white py-2 rounded text-sm text-white'
        >
          Cancel
        </button>
        <button
          className={`${buysell === 'sell' ? 'border border-red-500 bg-red-500/50' : 'border border-green-500 bg-green-500/50'} w-2/3 text-white text-[13px] font-bold text-sm rounded`}
        >
          {buysell === 'sell'
            ? `Execute sell ${value} @ ${data?.bid ?? '-'}`
            : `Execute buy ${value} @ ${data?.ask ?? '-'}`}
        </button>
      </div>
    </div>
  );
};

export default Buysellextend;