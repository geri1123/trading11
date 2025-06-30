"use client";
import React from "react";
import Image from "next/image";
import { usePairData } from "@/app/lib/liveStore";
import PriceCell from "./PriceCell";
import { formatDate } from "@/Constants/date";
import { useFloatingPnl } from "../hooks/useFloatingPnL";
import { useEnsurePair } from "../Context/PriceProvider";

const formatNumber = (n: any, d = 2) =>
  n == null || n === ""
    ? "-"
    : Number(n).toLocaleString(undefined, { maximumFractionDigits: d });

interface Props {
  row: any;
  onModify(row: any): void;
  onPartial(row: any): void;
  handleClose(id: number): void;
}

const PositionRow: React.FC<Props> = ({
  row,
  onModify,
  onPartial,
  handleClose,
}) => {
  const pair = row.instrument;
  useEnsurePair(pair);
  const data = usePairData(pair);
  const pnl = useFloatingPnl(row);

  return (
    <tr className="hover:bg-gray-800 transition-colors duration-150">
      <td className="sticky left-0 px-2 py-2 text-white text-xs whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Image
            src="/Images/Icons/qube.svg"
            alt=""
            width={16}
            height={16}
            className="w-4 h-4"
          />
          {pair}
        </div>
      </td>

      <td className="text-center text-xs">
        <span
          className={`inline-block px-2 rounded-full ${
            row.side === "BUY" ? "text-green-400" : "text-red-400"
          }`}
        >
          {row.side}
        </span>
      </td>

      <td className="text-center text-gray-200 text-xs">
        {formatNumber(row.lotSize, 2)}
      </td>

      <td className="text-center text-gray-200 text-xs">
        <div className="flex items-center justify-center gap-1">
          <span> {formatNumber(row.entryPrice, 5)}</span>
          <span>--</span>
          <PriceCell value={row.side === "BUY" ? data?.b : data?.a} />
        </div>
      </td>
      <td className="text-center text-gray-200 text-xs">
        {formatNumber(row.stopLoss, 5)}
      </td>
      <td className="text-center text-gray-200 text-xs">
        {formatNumber(row.takeProfit, 5)}
      </td>
      <td className="text-center text-gray-200 text-xs">
        {formatNumber(row.margin, 2)}
      </td>
      <td className="text-center text-gray-200 text-xs">
        {formatNumber(row.exposure, 2)}
      </td>
      <td className="text-center text-gray-300 text-xs">
        {formatDate(row.openedAt)}
      </td>
      <td className="text-center text-orange-400 text-xs">
        {formatNumber(row.fee, 2)}
      </td>
      <td className="text-center text-blue-400 text-xs">
        {formatNumber(row.swap, 2)}
      </td>

      <td
        className={`text-center text-xs font-bold ${
          pnl && pnl < 0 ? "text-red-400" : "text-green-400"
        }`}
      >
        {pnl != null ? Math.abs(pnl).toFixed(2) : "0.00"}
      </td>

      <td className="text-center text-gray-400 text-xs">{row.positionId}</td>
      <td className="text-center">
        <div className="flex justify-center gap-2">
          <button onClick={() => onModify(row)}>
            <Image
              src="/Images/Icons/edit.svg"
              alt="edit"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          </button>
          <button onClick={() => onPartial(row)}>
            <Image
              src="/Images/Icons/close-trade.svg"
              alt="partial"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          </button>
          <button onClick={() => handleClose(row.positionId)}>
            <Image
              src="/Images/Icons/delete-trade.svg"
              alt="del"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PositionRow;
