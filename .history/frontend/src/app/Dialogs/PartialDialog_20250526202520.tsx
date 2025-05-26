
import React, { useState, TouchEvent } from 'react';
import Image from 'next/image';
import type { PositionTradeRow } from '@/Content/PositionContent';

export interface PartialDialogProps {
  data: PositionTradeRow | null;
  onClose: () => void;
}

const PartialDialog: React.FC<PartialDialogProps> = ({ data, onClose }) => {
  const [value, setValue] = useState<number>(0.00);

  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const minSwipeDistance = 50;

  // GUARD CLAUSE for null data
  if (!data) return null;

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart && touchEnd && touchEnd - touchStart > minSwipeDistance) {
      onClose();
    }
  };

  const decreaseValue = () => {
    setValue((prevValue) => {
      const newValue = parseFloat((prevValue - 0.01).toFixed(2));
      return newValue < 0 ? 0 : newValue;
    });
  };

  const increaseValue = () => {
    setValue((prevValue) => parseFloat((prevValue + 0.01).toFixed(2)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (/^\d*\.?\d*$/.test(inputValue)) {
      const parsedValue = parseFloat(inputValue);
      setValue(isNaN(parsedValue) ? 0 : parsedValue);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className='bg-black-300 w-screen md:w-[450px] lg:w-[450px] xxl:w-[450px] xl:w-[450px] p-5 flex flex-col items-center gap-3 justify-center rounded-20'
    >
      <div className='w-[100px] h-[4px] bg-white rounded-xl'></div>
      <div className='w-full border-1 border-white bg-black-700 py-2 rounded'>
        <p className='text-white text-sm'>Partial</p>
      </div>
      <div className={`w-full px-3 flex justify-between border-1 ${data.side === "Buy" ? "border-green-400" : "border-red-400"} bg-black-700 py-2 rounded`}>
        <p className='text-white text-sm'>Current Position</p>
        <p>{data.instrument}</p>
        <p>{data.size}</p>
      </div>
      <div className={`w-full p-1 border-1 rounded-lg bg-black-700 flex items-center justify-between ${data.side === "Buy" ? "border-green-400" : "border-red-400"}`}>
        <button className="border-none px-2 outline-none" id="margin-decrease" onClick={decreaseValue}>
          <Image src="/Images/Icons/minus.svg" alt="minus-icon" width={20} height={20} />
        </button>

        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          className="leading-none w-full text-center text-white bg-transparent focus:border-none focus:ring-0 border-none outline-none w-14 pt-[2px]"
          id="margin-input"
        />

        <button className="border-none px-2 outline-none" onClick={increaseValue}>
          <Image src="/Images/Icons/plus.svg" alt="plus-icon" width={20} height={20} />
        </button>
      </div>
      <div className='w-full h-[1px] bg-white opacity-50'></div>
      <div className='flex w-full gap-3'>
        <button onClick={onClose} className='w-1/3 border-1 border-white py-2 rounded text-sm text-white'>Cancel</button>
        <button className='w-2/3 text-black bg-blue-400 text-sm rounded'>Submit</button>
      </div>
    </div>
  );
};

export default PartialDialog;