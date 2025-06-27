"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { VirtualPriceRow } from "./PriceRow";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: pairs.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 44,
    overscan: 10,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  return (
    <div
      className="
        overflow-x-auto
        xsm:max-h-[calc(78vh-150px)]
        sm:max-h-[calc(90vh-140px)]
        xxsm:max-h-[calc(78vh-140px)]
        md:max-h-[calc(100vh-300px)]
        lg:max-h-[calc(110vh-300px)]
        xl:max-h-none xl:h-auto
        chart-scrollbar rounded-lg
      "
    >
      <div
        ref={scrollRef}
        className="
          overflow-y-auto
          chart-scrollbar
          max-h-auto
          xl:max-h-[170px]
        "
      >
        <table className="table-auto w-full border-collapse">
          {/* header  */}
          <thead className="sticky top-0 bg-black-700 z-20">
            <tr className="border-b border-gray-500">
              <th className="sticky left-0 bg-black-700 z-20">
                <div className="flex items-center gap-1 min-w-[120px] py-2 pl-4">
                  <p className="text-sm font-normal text-white">Pair</p>
                  {/* <div className="ml-auto h-[1rem] w-[2px] bg-gray-300" /> */}
                </div>
              </th>
              {["Ask", "Bid", "Spread", "Day High", "Day Low"].map((title) => (
                <th key={title} className="bg-black-700">
                  <div className="flex items-center gap-1 min-w-[88px] py-2 pl-4">
                    <p className="text-sm font-normal text-white">{title}</p>
                    {/* <div className="ml-auto h-[1rem] w-[2px] bg-gray-300" /> */}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* body  */}
          <tbody
            style={{
              height: rowVirtualizer.getTotalSize(),
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((vRow: any) => {
              const pair = pairs[vRow.index];
              const isSelected = pair === selectedPair;

              return (
                <tr
                  key={pair}
                  onClick={() => onPairSelect(pair)}
                  ref={(el) => {
                    if (el && typeof vRow.measureElement === "function") {
                      vRow.measureElement(el);
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: `translateY(${vRow.start}px)`,
                    width: "100%",
                  }}
                  className={`cursor-pointer hover:bg-black-500 text-xs font-medium text-white transition-colors ${
                    isSelected
                      ? "bg-black-500 border-l-2 border-green-400"
                      : "bg-black-700"
                  }`}
                >
                  <VirtualPriceRow
                    pair={pair}
                    isSelected={isSelected}
                    onSelect={onPairSelect}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
