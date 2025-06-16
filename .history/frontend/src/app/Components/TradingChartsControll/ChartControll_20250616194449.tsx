
// ChartControll component
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import Image from 'next/image';
import SockJS from "sockjs-client";
import Cookies from 'js-cookie';

interface LivePairData {
  a?: number;
  b?: number;
  spread?: number;
}
type LiveDataMap = Record<string, LivePairData>;

interface ChartControllProps {
  onSelect: (pair: string | null, liveData: LiveDataMap) => void;
}

export const ChartControll: React.FC<ChartControllProps> = ({ onSelect }) => {
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
  React.useEffect(() => {
    setSelectedPair(null);
    onSelect(null, liveData);
    // eslint-disable-next-line
  }, [selectedCategory, searchTerm]);

  return (
    <div className="w-full lg:max-h-full  p-3 overflow-hidden bg-black-300 rounded-20">
      <div className="flex items-center gap-3 justify-between h-[38px] mb-1.5">
        <div className="bg-black-700  lg:w-[196px] h-full flex items-center gap-3 p-3 rounded-lg">
          <Image src="/Images/Icons/search.svg" alt="search-icon" width={16} height={16} />
          <input
            type="text"
            className="w-full text-sm text-white bg-transparent placeholder-white focus:outline-none"
            placeholder="Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-black-700 w-[140px] h-full flex items-center rounded-lg">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-full rounded-lg text-white bg-black-700 border-none outline-none focus:ring-0 focus:border-transparent cursor-pointer"
          >
            <option value="all">All</option>
            <option value="majors">Fx Majors</option>
            <option value="exotic">Fx Exotics</option>
            <option value="indices">Indices</option>
            <option value="metals">Metals</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto chart-scrollbar rounded-lg">
        <div className="min-w-full">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Pair</th>
                <th>Ask</th>
                <th>Bid</th>
                <th>Spread</th>
                <th>Day High</th>
                <th>Day Low</th>
              </tr>
            </thead>
            <tbody>
              {filteredPairs.map((pair, i) => {
                const data = liveData[pair];
                const isSelected = selectedPair === pair;
                return (
                  <tr
                    key={i}
                    onClick={() => handlePairSelect(pair)}
                    className={`cursor-pointer hover:bg-black-500 text-xs font-medium text-white transition-colors ${
                      isSelected ? 'bg-black-500 border-l-2 border-green-400' : 'bg-black-700'
                    }`}
                  >
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Image
                          src={`/Images/flags/${pair.split('/')[0].toLowerCase()}.svg`}
                          alt={`${pair.split('/')[0]} flag`}
                          className="w-3.5 h-3.5 rounded-full"
                          width={16}
                          height={16}
                        />
                        <p className="pt-1 text-xs text-white uppercase">{pair}</p>
                        <Image
                          src={`/Images/flags/${pair.split('/')[1].toLowerCase()}.svg`}
                          alt={`${pair.split('/')[1]} flag`}
                          className="w-3.5 h-3.5 rounded-full"
                          width={16}
                          height={16}
                        />
                      </div>
                    </td>
                    <td>{data?.a !== undefined ? data.a.toFixed(5) : '-'}</td>
                    <td>{data?.b !== undefined ? data.b.toFixed(5) : '-'}</td>
                    <td>{data?.spread !== undefined ? data.spread.toFixed(5) : '-'}</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
