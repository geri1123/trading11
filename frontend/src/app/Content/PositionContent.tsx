"use client";
import React, { useState } from "react";
import Image from "next/image";
import { formatDate } from "@/Constants/date";
import { useToggleShow } from "@/UseToggleState/UseToggleShow";
// import ModifyDialog from '@/Dialogs/ModifyDialog';
import PartialDialog from "@/Dialogs/PartialDialog";
import { closePosition } from "@/api/apiTrades";
import { toast } from "react-toastify";
import { useTradeContext } from "../Context/TradeContext";
import PositionRow from "./PositionRow";

const formatNumber = (
  num: number | string | null | undefined,
  decimals = 2
) => {
  if (num === null || num === undefined || num === "") return "-";
  const n = typeof num === "string" ? parseFloat(num) : num;
  return isNaN(n)
    ? num
    : n.toLocaleString(undefined, { maximumFractionDigits: decimals });
};

const PositionContent: React.FC = () => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const { isOpen, toggleDropdown, closeDropdown, dropdownref, isClosing } =
    useToggleShow();
  const { trades, loading, error, fetchTrades } = useTradeContext();

  const handleOpenDialog = (type: string, rowData: any) => {
    setActiveDialog(type);
    setSelectedData(rowData);
    toggleDropdown();
  };

  const handleClose = async (positionId: number) => {
    try {
      await closePosition(positionId);
      toast.success("Trade closed successfully!");
      fetchTrades("OPEN");
    } catch (error) {
      console.error("Failed to close trade:", error);
      toast.error("Failed to close trade.");
    }
  };

  const handleAfterClose = () => {
    if (fetchTrades) fetchTrades("CLOSED");
  };

  if (loading)
    return <div className="text-center py-8 text-gray-300">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-400">Error: {error}</div>;
  if (!trades || trades.length === 0)
    return (
      <div className="text-center py-8 text-gray-300">
        No open positions found
      </div>
    );

  return (
    <div className=" rounded-lg shadow-xl overflow-hidden max-h-96">
      {/* Table View */}
      <div className="overflow-x-auto overflow-y-auto max-h-[150px] chart-scrollbar hidden lg:block">
        <table className="w-full min-w-max">
          {/* Header */}
          <thead className="border-gray-700 bg-gray-700 border-b sticky top-0 z-10">
            <tr>
              <th className="sticky left-0 z-20 px-2 py-2 text-left text-xs text-gray-200">
                Instrument
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                Side
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                Size
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                Entry -- Market
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                Stop Loss
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                Take Profit
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                Margin
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                Exposure
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                Created At
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                Fee
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                Swap
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                P&L
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                Position ID
              </th>
              <th className="px-2 py-2 text-center text-xs text-gray-200">
                Actions
              </th>
            </tr>
          </thead>

          {/* Rows */}
          <tbody className="divide-y divide-gray-700">
            {trades.map((row) => (
              <PositionRow
                key={row.positionId}
                row={row}
                onModify={(r) => handleOpenDialog("Modify", r)}
                onPartial={(r) => handleOpenDialog("partial", r)}
                handleClose={(id) => handleClose(id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      {isOpen && activeDialog === "partial" && selectedData && (
        <div
          className={`fixed inset-0 bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${
            isClosing ? "animate-fadeOut" : "animate-fadeIn"
          }`}
        >
          <div
            ref={dropdownref}
            className={`${isClosing ? "animate-slideUp" : "animate-slideDown"}`}
          >
            <PartialDialog
              data={selectedData}
              onClose={closeDropdown}
              onAfterClose={handleAfterClose}
            />
          </div>
        </div>
      )}

      {isOpen && activeDialog === "Modify" && selectedData && (
        <div
          className={`fixed inset-0 bg-black-700 bg-opacity-70 flex items-center justify-center z-50 ${
            isClosing ? "animate-fadeOut" : "animate-fadeIn"
          }`}
        >
          <div
            ref={dropdownref}
            className={`${isClosing ? "animate-slideUp" : "animate-slideDown"}`}
          >
            {/* <ModifyDialog data={selectedData} onClose={closeDropdown} /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionContent;
