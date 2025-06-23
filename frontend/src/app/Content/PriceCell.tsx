import { memo, useEffect, useRef, useState } from "react";

interface PriceCellProps {
  value: number | undefined;
  decimals?: number;
}

const PriceCell = ({ value, decimals = 5 }: PriceCellProps) => {
  const prevValueRef = useRef<number | undefined>(value);
  const [colorClass, setColorClass] = useState("text-white");

  useEffect(() => {
    const prev = prevValueRef.current;

    if (value !== undefined && prev !== undefined) {
      if (value > prev) {
        setColorClass("text-green-400");
      } else if (value < prev) {
        setColorClass("text-red-400");
      } else {
        setColorClass("text-white");
      }
    }

    prevValueRef.current = value;

    // // Uncomment the following lines if you want to reset the color after a delay
    // const timeout = setTimeout(() => setColorClass("text-white"), 400);
    // return () => clearTimeout(timeout);
  }, [value]);

  return (
    <p className={`text-xs font-normal ${colorClass}`}>
      {value !== undefined ? value.toFixed(decimals) : "-"}
    </p>
  );
};

export default memo(PriceCell);
