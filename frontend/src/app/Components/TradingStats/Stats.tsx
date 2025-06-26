import React from "react";
import { useTopWidgetData } from "@/app/hooks/useProfitLoss";

interface Stat {
  id: string;
  balance: number | null;
}

const Stats: React.FC = () => {
  const widgetData = useTopWidgetData();

  const stats: Stat[] = [
    { id: "Balance", balance: widgetData?.balance || null },
    { id: "Profit & Loss", balance: widgetData?.totalProfitLoss || null },
    { id: "Equity", balance: widgetData?.totalEquity || null },
    { id: "Margin Used", balance: widgetData?.usedMargin || null },
    {
      id: "Margin Available",
      balance: widgetData?.availableMargin || null,
    },
    { id: "Margin Level", balance: widgetData?.marginLevel || null },
  ];

  return (
    <div className="grid-cols-3 xl:flex lg:px-0 lg:py-0 flex items-center justify-center rounded-20 gap-2 xl:gap-3 lg:gap-3">
      {stats.map((head, i) => (
        <div
          key={i}
          className="trading-nav-overview flex flex-col items-start justify-center px-3 py-2 bg-black-700 rounded-xl"
        >
          <h6 className="lg:text-[10px] whitespace-nowrap text-[10px] font-medium tracking-wide 3xl:text-[14px] text-white uppercase xl:pb-[5px] lg:pb-[5px] opacity-70">
            {head.id}
          </h6>
          <p
            className={`leading-none lg:text-sm text-sm xl:text-sm 3xl:text-base font-medium text-white ${
              head.balance! < 0 && "text-red-400"
            } ${
              head.id == "Profit & Loss" &&
              head.balance! > 0 &&
              "text-green-400"
            }`}
          >
            {head.id != "Margin Level" && <span className="opacity-70">$</span>}
            {head.balance ? Math.abs(head.balance).toFixed(2) : "0.00"}
            {head.id == "Margin Level" && <span className="opacity-70">%</span>}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stats;
