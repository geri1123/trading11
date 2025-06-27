import { useMemo } from 'react';
import { usePairData } from '@/app/lib/liveStore';
import { useEnsurePair } from '../Context/PriceProvider';

export const STANDARD_CONTRACT = 100000;

export type Side = 'BUY' | 'SELL';

export interface Position {
    instrument: string;
    side: Side;
    entryBid: number;
    entryPrice: number;
    lotSize: number;
}

export interface LiveQuote {
    bid: number;
    ask: number;
    baseUsd?: number;
    [key: string]: any;
}

// pip size
export const getPipSize = (pair: string) =>
    pair.endsWith('JPY') ? 0.01 : 0.0001;

// pip movement (signed)
export const calcPipMovement = (
    pos: Position,
    quote: LiveQuote
): number => {
    const pip = getPipSize(pos.instrument);

    return pos.side === 'BUY'
        ? (quote.bid - pos.entryPrice) / pip          // BUY: bid-ask
        : (pos.entryPrice - quote.ask) / pip;         // SELL: bid-ask
};

// pip value in USD
export const calcPipValueUsd = (
    pos: Position,
    quote: LiveQuote
): number => {
    const { instrument, lotSize, entryPrice } = pos;
    const [base, quoteCur] = instrument.split('/');

    // helper
    const baseFormula = (pipSize: number, price: number, multiplier = 1) =>
        (pipSize / price) * lotSize * STANDARD_CONTRACT * multiplier;

    // CASE A: xxx/USD   (USD is quote)
    if (quoteCur === 'USD') {
        return getPipSize(instrument) * lotSize * STANDARD_CONTRACT;
    }

    // CASE B & C: USD/xxx   (USD is base)
    if (base === 'USD') {
        return baseFormula(getPipSize(instrument), entryPrice);
    }

    // CASE D & E: JPY cross (XXX/JPY Or XXX/XXX where XXX ≠ USD)
    if (!quote.baseUsd) throw new Error('Missing Base→USD rate');
    return baseFormula(getPipSize(instrument), entryPrice, quote.baseUsd);
};

// Hook to get the base currency's USD rate
export const useBaseUsdRate = (base: string | null) => {
    if (!base || base === 'USD') return 1;

    const pair = `${base}/USD`;
    useEnsurePair(pair);
    // e.g. EUR → look up EUR/USD
    const quote = usePairData(pair);

    return useMemo(() => {
        if (!pair) return 1;
        return quote?.a ?? null;
    }, [pair, quote]);
};

// Calculate raw PnL for a position based on current quote
export const calcRawPnl = (pos: Position, quote: LiveQuote): number => {
    const pips = calcPipMovement(pos, quote);
    const pipValue = calcPipValueUsd(pos, quote);
    return pips * pipValue;
};

// Hook to calculate floating PnL for a position
export const useFloatingPnl = (pos: Position | null) => {
    useEnsurePair(pos?.instrument ?? null);
    const quoteObj = usePairData(pos?.instrument ?? '');

    const base = pos ? pos.instrument.split('/')[0] : null;
    const quoteC = pos ? pos.instrument.split('/')[1] : null;
    const needBaseUsd = base && quoteC && base !== 'USD' && quoteC !== 'USD';

    const baseUsdRate = useBaseUsdRate(needBaseUsd ? base : null);

    const liveQuote: any | null = useMemo(() => {
        if (!pos || !quoteObj) return null;
        return {
            bid: quoteObj.b,
            ask: quoteObj.a,
            baseUsd: baseUsdRate ?? undefined,
        };
    }, [pos, quoteObj, baseUsdRate]);

    return useMemo(() => {
        if (!pos || !liveQuote) return null;
        return calcRawPnl(pos, liveQuote);
    }, [pos, liveQuote]);
};