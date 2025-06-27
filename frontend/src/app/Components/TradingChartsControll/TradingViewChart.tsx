import React, { useEffect } from "react";

declare global {
  interface Window {
    TradingView?: {
      widget: new (options: Record<string, unknown>) => unknown;
    };
  }
}

interface SelectedData {
  pair: string;
  ask: number;
  bid: number;
  spread: number;
  dayHigh: number;
  dayLow: number;
}

interface selectedPairProps {
  selectedPair?: string;
}

const TradingViewChart: React.FC<selectedPairProps> = ({ selectedPair }) => {
  useEffect(() => {
    const symbol = selectedPair?.replace("/", "") || "USDAUD";
    const existingScript = document.getElementById("tradingview-widget-script");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.id = "tradingview-widget-script";
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        const container = document.getElementById("tradingview_chart");
        if (container) container.innerHTML = "";
        new window.TradingView.widget({
          container_id: "tradingview_chart",
          autosize: true,
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#1a1a1a",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          studies: [],
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      const container = document.getElementById("tradingview_chart");
      if (container) container.innerHTML = "";
    };
  }, [selectedPair]);

  return (
    <div
      className="
        tradingview-widget-container
        w-full
        h-[210px]          
        sm:h-[290px]       
        md:h-[390px]         
        rounded-xl
        shadow-md
        bg-gray-900
      "
    >
      <div
        id="tradingview_chart"
        className="w-full h-full rounded-xl z-50 overflow-hidden"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default TradingViewChart;
