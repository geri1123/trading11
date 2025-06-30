import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { VirtualPriceTable } from "@/app/Content/PriceTable";

const allPairs = [
  "CAD/USD",
  "AUD/USD",
  "EUR/USD",
  "GBP/USD",
  "NZD/USD",
  "USD/CAD",
  "USD/CHF",
  "USD/JPY",
  "AUD/CAD",
  "AUD/CHF",
  "AUD/JPY",
  "AUD/NZD",
  "EUR/NZD",
  "EUR/AUD",
  "EUR/CAD",
  "EUR/CHF",
  "EUR/GBP",
  "EUR/JPY",
  "GBP/AUD",
  "GBP/CAD",
  "GBP/CHF",
  "GBP/JPY",
  "GBP/NZD",
  "CAD/JPY",
  "CHF/JPY",
  "NZD/CAD",
  "NZD/CHF",
  "NZD/JPY",
  "CAD/CHF",
  "NOK/SEK",
  "GBP/DKK",
  "GBP/NOK",
  "GBP/SEK",
  "EUR/CZK",
  "USD/CZK",
  "EUR/DKK",
  "USD/DKK",
  "EUR/HKD",
  "USD/HKD",
  "EUR/MXN",
  "USD/MXN",
  "EUR/HUF",
  "USD/HUF",
  "EUR/NOK",
  "USD/NOK",
  "EUR/PLN",
  "USD/PLN",
  "EUR/SEK",
  "USD/SEK",
  "EUR/TRY",
  "USD/TRY",
  "EUR/ZAR",
  "USD/ZAR",
  "USD/RUB",
  "USD/ILS",
  "USD/SGD",
  "USD/CNH",
];

const categoryGroups: Record<string, string[]> = {
  majors: [
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "USD/CHF",
    "USD/CAD",
    "AUD/USD",
    "NZD/USD",
  ],
  exotic: [
    "USD/TRY",
    "EUR/TRY",
    "USD/ZAR",
    "EUR/ZAR",
    "USD/MXN",
    "EUR/MXN",
    "USD/ILS",
  ],
  indices: [
    "NOK/SEK",
    "GBP/SEK",
    "GBP/NOK",
    "EUR/NOK",
    "USD/NOK",
    "USD/SEK",
    "EUR/SEK",
  ],
  metals: ["USD/CNH", "USD/SGD", "USD/RUB"],
};

interface ChartControllProps {
  setSelectedData: (pair: string) => void; // Accepts a string
}

const ChartControll: React.FC<ChartControllProps> = ({ setSelectedData }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [hasAutoSelected, setHasAutoSelected] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter by category
  const categoryPairs = useMemo(() => {
    return selectedCategory === "all"
      ? allPairs
      : categoryGroups[selectedCategory] || [];
  }, [selectedCategory]);

  // Filter by search term
  const filteredPairs = useMemo(() => {
    if (searchTerm.trim().length === 0) return categoryPairs;
    const lowerTerm = searchTerm.trim().toLowerCase();
    return categoryPairs.filter((pair) =>
      pair.toLowerCase().includes(lowerTerm)
    );
  }, [categoryPairs, searchTerm]);

  // Auto-select first available data after loading (only once)
  // useEffect(() => {
  //   if (!hasAutoSelected && Object.keys(liveData).length > 0) {
  //     for (const pair of filteredPairs) {
  //       const data = liveData[pair];
  //       if (
  //         data &&
  //         typeof data.a === "number" &&
  //         typeof data.b === "number" &&
  //         typeof data.spread === "number"
  //       ) {
  //         setSelectedPair(pair);
  //         setHasAutoSelected(true);
  //         onSelect({
  //           pair,
  //           ask: data.a,
  //           bid: data.b,
  //           spread: data.spread,
  //           dayHigh: 0,
  //           dayLow: 0,
  //         });
  //         break;
  //       }
  //     }
  //   }
  // }, [liveData, filteredPairs, onSelect, hasAutoSelected]);

  // Handler for selecting a pair
  const handlePairSelect = (pair: string) => {
    setSelectedPair(pair);
    setSelectedData(pair);
  };

  return (
    <div className="w-full lg:max-h-full  p-3 overflow-hidden bg-black-300 rounded-20">
      <h2 className="text-xl lg:hidden mb-5 border-b border-gray-200 pb-3 text-gray-200">
        Quotes
      </h2>
      <div className="flex items-center gap-3 justify-between h-[38px] mb-1.5">
        <div className="bg-black-700  lg:w-[196px] h-full flex items-center gap-3 p-3 rounded-lg">
          <Image
            src="/Images/Icons/search.svg"
            alt="search-icon"
            width={16}
            height={16}
          />
          <input
            type="text"
            className="w-full text-sm text-white bg-transparent placeholder-white focus:outline-none"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <div className="bg-black-700 w-[140px] h-full flex items-center rounded-lg">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
            className="w-full h-full rounded-lg text-white bg-black-700 border-none outline-none focus:ring-0 focus:border-transparent cursor-pointer"
          >
            <option value="all">All</option>
            <option value="majors">Fx Majors</option>
            <option value="exotic">Fx Exotics</option>
            <option value="indices">Indices</option>
            <option value="metals">Metals</option>
          </select>
        </div>
      </div>

      <VirtualPriceTable
        pairs={filteredPairs}
        selectedPair={selectedPair}
        onPairSelect={handlePairSelect}
      />
    </div>
  );
};

export default ChartControll;
