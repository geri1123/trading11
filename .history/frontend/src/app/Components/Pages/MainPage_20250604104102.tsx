"use client";
import React, { useEffect, useState } from "react";

import Navbar from "@/Components/Navbar/Navbar";
import Menu from "@/Components/Navbar/Menu";
import Stats from "@/Components/TradingStats/Stats";
import Trades from "@/Components/TradingChartsControll/Trades";
import dynamic from "next/dynamic";
import ChartControll from "@/Components/TradingChartsControll/ChartControll";
import BuySell from "@/Components/TradingChartsControll/BuySell";
import Image from "next/image"; 

const TradingViewChart = dynamic(() => import("@/Components/TradingChartsControll/TradingViewChart"), { ssr: false });


type TabSelect = "Quotes" | "Chart" | "Trades" | "Settings";
interface SelectedData {
  pair: string;
  ask: number;
  bid: number;
  spread: number;
  dayHigh: number;
  dayLow: number;
}
const MainPage: React.FC = () => {
  
 
  const [select, setSelect] = useState<TabSelect>("Quotes");
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);
 
  return (
    <div className='h-full'>
      <div className='all h-full xl:flex xxl:flex flex-col hidden gap-3'>
        <div className="h-full flex flex-col gap-3">
          <Navbar />
        
          <div className='all-tradingchart h-full grid grid-cols-[2fr_1fr] gap-3'>
            <TradingViewChart />
            <div className='flex flex-col h-full gap-2'>
              <ChartControll onSelect={setSelectedData} />
              <BuySell data={selectedData} />
            </div>
          </div>
        </div>
        <div className='h-full overflow-y-auto'>
          <Trades/>
        </div>
      </div>
      {/* Responsive */}
      <div className='xl:hidden flex flex-col '>
        {select === "Quotes" && (
          <div className='flex flex-col gap-4 w-full'>
             <ChartControll onSelect={setSelectedData} />
          </div>
        )}
        {select === "Settings" && (
          <div className='flex flex-col gap-3'>
            <Navbar />
            <Menu />
          </div>
        )}
        {select === "Trades" && (
          <div className='flex flex-col gap-3 overflow-hidden'>
            <Stats/>
            <Trades/>
          </div>
        )}
        {select === "Chart" && (
          <div className='flex flex-col'>
            <BuySell data={selectedData} />
            <TradingViewChart /> 
          </div>
        )}
        <div className='fixed bottom-0 left-0 xsm:px-6 xxsm:px-2 sm:px-8 md:px-9 px-9 w-full flex items-center justify-between bg-black-300 py-3 rounded-t-lg'>
          <div
            onClick={() => setSelect('Quotes')}
            className='cursor-pointer flex flex-col items-center text-gray-300'
          >
            <Image
              src={select === "Quotes" ? '/Images/Icons/quotes-active.svg' : '/Images/Icons/quotes.svg'}
              alt="quotes-active.svg"
              width={24}
              height={24}
            />
            <small className={`font-semibold ${select === 'Quotes' ? 'text-green-500' : 'text-gray-300'}`}>Quotes</small>
          </div>
          <div
            onClick={() => setSelect("Chart")}
            className='flex flex-col items-center text-gray-300 cursor-pointer'
          >
            <Image
              src={select === "Chart" ? "/Images/Icons/chart-active.svg" : "/Images/Icons/chart.svg"}
              alt="chart.svg"
              width={24}
              height={24}
            />
            <small className={`font-semibold ${select === 'Chart' ? 'text-green-500' : 'text-gray-300'}`}>Charts</small>
          </div>
          <div
            onClick={() => setSelect("Trades")}
            className='flex flex-col items-center text-gray-300 cursor-pointer'
          >
            <Image
              src={select === "Trades" ? "/Images/Icons/trades-active.svg" : "/Images/Icons/trades.svg"}
              alt="trades.svg"
              width={24}
              height={24}
            />
            <small className={`font-semibold ${select === 'Trades' ? 'text-green-500' : 'text-gray-300'}`}>Trades</small>
          </div>
          <div
            onClick={() => setSelect("Settings")}
            className='flex flex-col items-center text-gray-300 cursor-pointer'
          >
            <Image
              src={select === "Settings" ? "/Images/Icons/settings-active.svg" : "/Images/Icons/setting.svg"}
              alt="setting.svg"
              width={24}
              height={24}
            />
            <small className={`font-semibold ${select === 'Settings' ? 'text-green-500' : 'text-gray-300'}`}>Settings</small>
          </div>
        </div>
      </div>
      {/* End Responsive  */}
    </div>
  );
};

export default MainPage;