"use client";

import { useEffect, useRef, useContext } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { VirtualPriceRow } from "./PriceRow";
import { PriceContext } from "@/context/PriceProvider";

interface TableProps {
  pairs: string[];
  selectedPair: string | null;
  onPairSelect(pair: string): void;
}

export const VirtualPriceTable = ({
  pairs,
  selectedPair,
  onPairSelect,
}: TableProps) => {
  const { setVisiblePairs, setAllPairs } = useContext(PriceContext);
  const scrollRef = useRef<HTMLDivElement>(null);

  // provide full list on mount & filter change
  useEffect(() => {
    setAllPairs(pairs);
  }, [pairs, setAllPairs]);

  // virtualizer
  const rowVirtualizer = useVirtualizer({
    count: pairs.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 38,
    overscan: 5,
  });

  // tell provider which rows are actually visible
  useEffect(() => {
    const list = rowVirtualizer.getVirtualItems().map((v) => pairs[v.index]);
    setVisiblePairs(list);
  });

  return (
    <div className="overflow-x-auto chart-scrollbar rounded-lg">
      <div
        ref={scrollRef}
        className="overflow-y-auto chart-scrollbar max-h-[calc(78vh-150px)] sm:max-h-[calc(90vh-140px)] md:max-h-[calc(100vh-300px)] lg:max-h-[calc(110vh-300px)] xl:max-h-[170px]"
      >
        <table className="table-auto w-full border-collapse">
          <thead className="sticky top-0 bg-black-700 z-20">
            <tr className="">
              <th className="sticky left-0 bg-black-700 z-20">
                <div className="min-w-[120px] py-2 pl-4 text-sm text-white text-start">
                  Instrument
                </div>
              </th>
              {["Ask", "Bid", "Spread", "Day High", "Day Low"].map((title) => (
                <th key={title} className="bg-black-700">
                  <div className="min-w-[88px] py-2 pl-4 text-sm text-white text-start">
                    {title}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody
            style={{
              height: rowVirtualizer.getTotalSize(),
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((v) => {
              const pair = pairs[v.index];
              const isSelected = pair === selectedPair;
              return (
                <tr
                  key={pair}
                  onClick={() => onPairSelect(pair)}
                  style={{
                    position: "absolute",
                    transform: `translateY(${v.start}px)`,
                    width: "100%",
                  }}
                  className={`cursor-pointer hover:bg-black-700 text-xs font-medium text-white ${
                    isSelected ? "bg-black-700 border-l-2 border-green-400" : ""
                  }`}
                >
                  <VirtualPriceRow pair={pair} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
