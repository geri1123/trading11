import React, { useState, TouchEvent } from 'react';

interface CloseTradesDialogProps {
  onClose: () => void;
}

const CloseTradesDialog: React.FC<CloseTradesDialogProps> = ({ onClose }) => {
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  // Minimum swipe distance to trigger close
  const minSwipeDistance = 50;

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

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className='bg-black-300 w-screen md:w-[450px] lg:w-[450px] xxl:w-[450px] xl:w-[450px] p-5 flex flex-col items-center gap-3 justify-center rounded-20'
    >
      <div className='w-[100px] h-[4px] bg-white rounded-xl'></div>
      <div className='w-full border-1 border-white bg-black-700 py-2 rounded'>
        <p className='text-white text-sm'>Close all</p>
      </div>
      <div className='flex w-[70%] flex-col items-center justify-center'>
        <img className='w-10 h-10' src="/Images/Icons/close-all.svg" alt="close-all" />
        <h3 className='text-white text-[20px] text-center'>
          Are you sure you want to close all positions?
        </h3>
      </div>
      <div className='w-full h-[1px] bg-white opacity-50'></div>
      <div className='flex w-full gap-3'>
        <button
          onClick={onClose}
          className='w-1/3 border-1 border-white py-2 rounded text-sm text-white'
        >
          Close
        </button>
        <button className='w-2/3 text-black bg-green-400 text-sm rounded'>
          Yes
        </button>
      </div>
    </div>
  );
};

export default CloseTradesDialog;