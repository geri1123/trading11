'use client';
import { useContext, useEffect } from 'react';
import { PriceContext } from '@/context/PriceProvider';

export const useVisiblePair = (pair: string) => {
  const { markVisible, markHidden } = useContext(PriceContext);

  useEffect(() => {
    if (pair) markVisible(pair);
    return () => {
      if (pair) markHidden(pair);
    };
  }, [pair, markVisible, markHidden]);
};
