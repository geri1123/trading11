"use client";
import React, { useState } from "react";
import Navbar from "@/Components/Navbar/Navbar";
import Menu from "@/Components/Navbar/Menu";
import Stats from "@/Components/TradingStats/Stats";
import Trades from "@/Components/TradingChartsControll/Trades";
import dynamic from "next/dynamic";
import Image from "next/image";

const TradingViewChart = dynamic(() => import("@/Components/TradingChartsControll/TradingViewChart"), { ssr: false });

const allPairs = [
  "CAD/USD", "AUD/USD", "EUR/USD", "GBP/USD", "NZD/USD", "USD/CAD", "USD/CHF", "USD/JPY",
  "AUD/CAD", "AUD/CHF", "AUD/JPY", "AUD/NZD", "EUR/NZD", "EUR/AUD", "EUR/CAD", "EUR/CHF",
  "EUR/GBP", "EUR/JPY", "GBP/AUD", "GBP/CAD", "GBP/CHF", "GBP/JPY", "GBP/NZD", "CAD/JPY",
  "CHF/JPY", "NZD/CAD", "NZD/CHF", "NZD/JPY", "CAD/CHF", "NOK/SEK", "GBP/DKK", "GBP/NOK",
  "GBP/SEK", "EUR/CZK", "USD/CZK", "EUR/DKK", "USD/DKK", "EUR/HKD", "USD/HKD", "EUR/MXN",
  "USD/MXN", "EUR/HUF", "USD/HUF", "EUR/NOK", "USD/NOK", "EUR/PLN", "USD/PLN", "EUR/SEK",
  "USD/SEK", "EUR/TRY", "USD/TRY", "EUR/ZAR", "USD/ZAR", "USD/RUB", "USD/ILS", "USD/SGD",
  "USD/CNH"
];

const categoryGroups: Record<string, string[]> = {
  majors: ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "USD/CAD", "AUD/USD", "NZD/USD"],
  exotic: ["USD/TRY", "EUR/TRY", "USD/ZAR", "EUR/ZAR", "USD/MXN", "EUR/MXN", "USD/ILS"],
  indices: ["NOK/SEK", "GBP/SEK", "GBP/NOK", "EUR/NOK", "USD/NOK", "USD/SEK", "EUR/SEK"],
  metals: ["USD/CNH", "USD/SGD", "USD/RUB"] 
};

interface LivePairData {
  a?: number;
  b?: number;
  spread?: number;
}
type LiveDataMap = Record<string, LivePairData>;

type TabSelect = "Quotes" | "Chart" | "Trades" | "Settings";

const MainPage: React.FC = () => {
  const [select, setSelect] = useState<TabSelect>("Quotes");
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<LiveDataMap>({});

  // ChartControll will update both selectedPair and liveData
  const handleSelect = (pair: string | null, data: LiveDataMap) => {
    setSelectedPair(pair);
    setLiveData(data);
  };

  return (
    <div className='h-full'>
      <div className='all h-full xl:flex xxl:flex flex-col hidden gap-3'>
        <div className="h-full flex flex-col gap-3">
          <Navbar />
          <div className='all-tradingchart h-full grid grid-cols-[2fr_1fr] gap-3'>
            <TradingViewChart />
            <div className='flex flex-col h-full gap-2'>
              <ChartControll onSelect={handleSelect} />
              <BuySell pair={selectedPair} liveData={liveData} />
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
             <ChartControll onSelect={handleSelect} />
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
            <BuySell pair={selectedPair} liveData={liveData} />
            <TradingViewChart /> 
          </div>
        )}
        <div className='fixed bottom-0 left-0 xsm:px-6 xxsm:px-2 sm:px-8 md:px-9 px-9 w-full flex items-center justify-between bg-black-300 py-3 rounded-t-lg'>
          {["Quotes", "Chart", "Trades", "Settings"].map(tab => (
            <div
              key={tab}
              onClick={() => setSelect(tab as TabSelect)}
              className='flex flex-col items-center text-gray-300 cursor-pointer'
            >
              <Image
                src={
                  select === tab
                    ? `/Images/Icons/${tab.toLowerCase()}-active.svg`
                    : `/Images/Icons/${tab.toLowerCase()}.svg`
                }
                alt={`${tab.toLowerCase()}.svg`}
                width={24}
                height={24}
              />
              <small className={`font-semibold ${select === tab ? 'text-green-500' : 'text-gray-300'}`}>{tab}</small>
            </div>
          ))}
        </div>
      </div>
      {/* End Responsive  */}
    </div>
  );
};

export default MainPage;