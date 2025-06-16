import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import Image from 'next/image';
import SockJS from "sockjs-client";
import Cookies from 'js-cookie';

const allPairs = [
  "CAD/USD", "AUD/USD", "EUR/USD", "GBP/USD", "NZD/USD", "USD/CAD", "USD/CHF", "USD/JPY",
  "AUD/CAD", "AUD/CHF", "AUD/JPY", "AUD/NZD", "EUR/NZD", "EUR/AUD", "EUR/CAD", "EUR/CHF",
  "EUR/GBP", "EUR/JPY", "GBP/AUD", "GBP/CAD", "GBP/CHF", "GBP/JPY", "GBP/NZD", "CAD/JPY",
  "CHF/JPY", "NZD/CAD", "NZD/CHF", "NZD/JPY", "CAD/CHF", "NOK/SEK", "GBP/DKK", "GBP/NOK",
  "GBP/SEK", "EUR/CZK", "USD/CZK", "EUR/DKK", "USD/DKK", "EUR/HKD", "USD/HKD", "EUR/MXN",
  "USD/MXN", "EUR/HUF", "USD/HUF", "EUR/NOK", "USD/NOK", "EUR/PLN", "USD/PLN", "EUR/SEK",
  "USD/SEK", "EUR/TRY", "USD/TRY", "EUR/ZAR", "USD/ZAR", "USD/RUB", "USD/ILS", "USD/SGD",
  "USD/CNH"
];

const categoryGroups: Record<string, string[]> = {
  majors: ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "USD/CAD", "AUD/USD", "NZD/USD"],
  exotic: ["USD/TRY", "EUR/TRY", "USD/ZAR", "EUR/ZAR", "USD/MXN", "EUR/MXN", "USD/ILS"],
  indices: ["NOK/SEK", "GBP/SEK", "GBP/NOK", "EUR/NOK", "USD/NOK", "USD/SEK", "EUR/SEK"],
  metals: ["USD/CNH", "USD/SGD", "USD/RUB"] 
};

interface LivePairData {
  a?: number;
  b?: number;
  spread?: number;
}
type LiveDataMap = Record<string, LivePairData>;

interface ChartControllProps {
  onSelect: (pair: string | null, liveData: LiveDataMap) => void;
}

const ChartControll: React.FC<ChartControllProps> = ({ onSelect }) => {
  const [liveData, setLiveData] = useState<LiveDataMap>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const stompRef = useRef<Client | null>(null);

  const categoryPairs: string[] =
    selectedCategory === "all"
      ? allPairs
      : categoryGroups[selectedCategory] || [];

  const filteredPairs: string[] =
    searchTerm.trim().length === 0
      ? categoryPairs
      : categoryPairs.filter(pair =>
          pair.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    const client = new Client({
      webSocketFactory: () =>
          new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ws/forex?token=${token}`),
      reconnectDelay: 5000,
      onConnect: () => {
        allPairs.forEach((pair) => {
          const topic = `/topic/forex.${pair.toLowerCase().replace("/", ".")}`;
          client.subscribe(topic, (message) => {
            const data: LivePairData = JSON.parse(message.body);
            setLiveData((prev) => ({ ...prev, [pair]: data }));
          });
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame.headers["message"]);
      },
    });

    client.activate();
    stompRef.current = client;

    return () => {
      stompRef.current?.deactivate();
    };
  }, []);

  // Only call onSelect when user clicks a row
  const handlePairSelect = (pair: string) => {
    setSelectedPair(pair);
    onSelect(pair, liveData);
  };

  // Optionally clear selection when category/search changes:
  useEffect(() => {
    setSelectedPair(null);
    onSelect(null, liveData);
    // eslint-disable-next-line
  }, [selectedCategory, searchTerm]);