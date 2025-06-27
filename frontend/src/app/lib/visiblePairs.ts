'use client';
const set = new Set<string>();

export const addVisiblePair = (p: string) => set.add(p);
export const removeVisiblePair = (p: string) => set.delete(p);
export const getVisiblePairs = () => set; 
