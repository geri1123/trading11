"use client";

import Image from "next/image";
import { useCallback, useMemo } from "react";
import { usePairData } from "@/app/lib/liveStore";
import { useVisiblePair } from "@/hooks/useVisiblePair";
import PriceCell from "./PriceCell";

interface RowProps {
  pair: string;
  isSelected: boolean;
  onSelect(pair: string): void;
}

export const VirtualPriceRow: React.FC<RowProps> = ({
  pair,
  isSelected,
  onSelect,
}) => {
  // Note: useVisiblePair is a custom hook that manages the visibility state of pairs
  useVisiblePair(pair);
  // Fetch pair data using the custom hook
  const data = usePairData(pair);

  // helpers
  const { base, quote, flagBase, flagQuote } = useMemo(() => {
    const [base, quote] = pair.split("/");
    return {
      base,
      quote,
      flagBase: `/Images/flags/${base.toLowerCase()}.svg`,
      flagQuote: `/Images/flags/${quote.toLowerCase()}.svg`,
    };
  }, [pair]);

  return (
    <>
      <td className="sticky left-0 bg-inherit min-w-[120px] pl-4 py-2">
        <div className="flex items-center gap-1.5">
          <Image
            src={flagBase}
            alt={`${base} flag`}
            width={16}
            height={16}
            className="w-3.5 h-3.5 rounded-full"
            loading="lazy"
            priority={false}
          />
          <p className="pt-1 text-xs text-white uppercase">{pair}</p>
          <Image
            src={flagQuote}
            alt={`${quote} flag`}
            width={16}
            height={16}
            className="w-3.5 h-3.5 rounded-full"
            loading="lazy"
            priority={false}
          />
        </div>
      </td>

      {/* Ask  */}
      <td>
        <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
          <PriceCell value={data?.a} />
          <div className="h-[1rem] w-[2px] bg-gray-300" />
        </div>
      </td>

      {/* Bid  */}
      <td>
        <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
          <PriceCell value={data?.b} />
          <div className="h-[1rem] w-[2px] bg-gray-300" />
        </div>
      </td>

      {/* Spread */}
      <td>
        <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
          <p className="text-xs font-normal text-white">
            {data?.spread !== undefined ? data.spread.toFixed(5) : "-"}
          </p>
          <div className="h-[1rem] w-[2px] bg-gray-300" />
        </div>
      </td>

      {/* Day-High / Day-Low (place-holders kept) */}
      <td>
        <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
          <p className="text-xs font-normal text-white">-</p>
          <div className="h-[1rem] w-[2px] bg-gray-300" />
        </div>
      </td>

      <td>
        <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
          <p className="text-xs font-normal text-white">-</p>
          <div className="h-[1rem] w-[2px]" />
        </div>
      </td>
    </>
  );
};
