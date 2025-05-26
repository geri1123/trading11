// import * as React from 'react';
// import { useEffect, useState, useRef } from 'react';
// import { Client } from '@stomp/stompjs';

// // const elements = ['Pair', 'Ask', 'Bid', 'Spread', 'Day High', 'Day Low'];

// const allPairs = [
//   "CAD/USD", "AUD/USD", "EUR/USD", "GBP/USD", "NZD/USD", "USD/CAD", "USD/CHF", "USD/JPY",
//   "AUD/CAD", "AUD/CHF", "AUD/JPY", "AUD/NZD", "EUR/NZD", "EUR/AUD", "EUR/CAD", "EUR/CHF",
//   "EUR/GBP", "EUR/JPY", "GBP/AUD", "GBP/CAD", "GBP/CHF", "GBP/JPY", "GBP/NZD", "CAD/JPY",
//   "CHF/JPY", "NZD/CAD", "NZD/CHF", "NZD/JPY", "CAD/CHF", "NOK/SEK", "GBP/DKK", "GBP/NOK",
//   "GBP/SEK", "EUR/CZK", "USD/CZK", "EUR/DKK", "USD/DKK", "EUR/HKD", "USD/HKD", "EUR/MXN",
//   "USD/MXN", "EUR/HUF", "USD/HUF", "EUR/NOK", "USD/NOK", "EUR/PLN", "USD/PLN", "EUR/SEK",
//   "USD/SEK", "EUR/TRY", "USD/TRY", "EUR/ZAR", "USD/ZAR", "USD/RUB", "USD/ILS", "USD/SGD",
//   "USD/CNH"
// ];

// const categoryGroups: Record<string, string[]> = {
//   majors: ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "USD/CAD", "AUD/USD", "NZD/USD"],
//   exotic: ["USD/TRY", "EUR/TRY", "USD/ZAR", "EUR/ZAR", "USD/MXN", "EUR/MXN", "USD/ILS"],
//   indices: ["NOK/SEK", "GBP/SEK", "GBP/NOK", "EUR/NOK", "USD/NOK", "USD/SEK", "EUR/SEK"],
//   metals: ["USD/CNH", "USD/SGD", "USD/RUB"] 
// };

// interface LivePairData {
//   a?: number; // ask
//   b?: number; // bid
//   spread?: number;
// }

// interface SelectedData {
//   pair: string;
//   ask: number;
//   bid: number;
//   spread: number;
//   dayHigh: number;
//   dayLow: number;
// }

// type LiveDataMap = Record<string, LivePairData>;

// interface ChartControllProps {
//   onSelect: (element: SelectedData) => void;
// }

// const itemsPerPage = 10;

// const ChartControll: React.FC<ChartControllProps> = ({ onSelect }) => {
//   const [liveData, setLiveData] = useState<LiveDataMap>({});
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");
//   const [selectedPair, setSelectedPair] = useState<string | null>(null);
//   const [hasAutoSelected, setHasAutoSelected] = useState<boolean>(false);
//   const [searchTerm, setSearchTerm] = useState<string>(''); 
//   const stompRef = useRef<Client | null>(null);

//   // Filter by category
//   const categoryPairs: string[] =
//     selectedCategory === "all"
//       ? allPairs
//       : categoryGroups[selectedCategory] || [];

//   // Filter by search term
//   const filteredPairs: string[] =
//     searchTerm.trim().length === 0
//       ? categoryPairs
//       : categoryPairs.filter(pair =>
//           pair.toLowerCase().includes(searchTerm.trim().toLowerCase())
//         );

//   // Auto-select first available data after loading (only once)
//   useEffect(() => {
//     if (!hasAutoSelected && Object.keys(liveData).length > 0) {
//       for (const pair of filteredPairs) {
//         const data = liveData[pair];
//         if (data && typeof data.a === "number" && typeof data.b === "number" && typeof data.spread === "number") {
//           setSelectedPair(pair);
//           setHasAutoSelected(true);
//           onSelect({
//             pair,
//             ask: data.a,
//             bid: data.b,
//             spread: data.spread,
//             dayHigh: 0, 
//             dayLow: 0   
//           });
//           break;
//         }
//       }
//     }
//   }, [liveData, filteredPairs, onSelect, hasAutoSelected]);

  
//   useEffect(() => {
//     setHasAutoSelected(false);
//     setSelectedPair(null);
//   }, [selectedCategory, searchTerm]);

//   const token =
//     typeof window !== "undefined"
//       ? localStorage.getItem("token") ||
//         "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiZXFpciIsImlhdCI6MTc0NDY1MDIwNywiZXhwIjoxNzQ0NzM2NjA3fQ.uh2dujCqC7PVK6O1vGK9ihHpT8i3O2mlzCbmfr-1gXA"
//       : "";

//   useEffect(() => {
//     const client = new Client({
//       webSocketFactory: () =>
//         new WebSocket(
//           `wss://elevenfundingapi-f91e4cb9118d.herokuapp.com/ws/forex?token=${token}`
//         ),
//       reconnectDelay: 5000,
//       onConnect: () => {
//         allPairs.forEach((pair) => {
//           const topic = `/topic/forex.${pair.toLowerCase().replace("/", ".")}`;
//           client.subscribe(topic, (message) => {
//             const data: LivePairData = JSON.parse(message.body);
//             setLiveData((prev) => ({ ...prev, [pair]: data }));
//           });
//         });
//       },
//       onStompError: (frame) => {
//         console.error("❌ STOMP error:", frame.headers["message"]);
//       },
//     });

//     client.activate();
//     stompRef.current = client;

//     return () => {
//       stompRef.current?.deactivate();
//     };
//   }, [token]);

//   // Handle manual pair selection
//   const handlePairSelect = (pair: string) => {
//     const data = liveData[pair];
//     if (data && typeof data.a === "number" && typeof data.b === "number") {
//       setSelectedPair(pair);
//       const selectedData: SelectedData = {
//         pair,
//         ask: data.a,
//         bid: data.b,
//         spread: data.spread || 0,
//         dayHigh: 0,
//         dayLow: 0
//       };
//       onSelect(selectedData);
//     }
//   };

//   return (
//     <div className="w-full lg:max-h-full  p-3 overflow-hidden bg-black-300 rounded-20">
//       <h2 className='text-xl lg:hidden mb-5 border-b border-gray-200 pb-3 text-gray-200'>Quotes</h2>
//       <div className="flex items-center gap-3 justify-between h-[38px] mb-1.5">
//         <div className="bg-black-700  lg:w-[196px] h-full flex items-center gap-3 p-3 rounded-lg">
//           <img src="/Images/Icons/search.svg" alt="search-icon" />
//           <input
//             type="text"
//             className="w-full text-sm text-white bg-transparent placeholder-white focus:outline-none"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={e => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//         </div>
//         <div className="bg-black-700 w-[140px] h-full flex items-center rounded-lg">
//           <select
//             value={selectedCategory}
//             onChange={(e) => {
//               setSelectedCategory(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-full h-full rounded-lg text-white bg-black-700 border-none outline-none focus:ring-0 focus:border-transparent cursor-pointer"
//           >
//             <option value="all">All</option>
//             <option value="majors">Fx Majors</option>
//             <option value="exotic">Fx Exotics</option>
//             <option value="indices">Indices</option>
//             <option value="metals">Metals</option>
//           </select>
//         </div>
//       </div>
//       <div className="overflow-x-auto 
//         xsm:max-h-[calc(78vh-150px)]
//         sm:max-h-[calc(90vh-140px)]
//         xxsm:max-h-[calc(78vh-140px)]
//         md:max-h-[calc(100vh-300px)]
//         lg:max-h-[calc(110vh-300px)]
//         xl:max-h-none xl:h-auto chart-scrollbar rounded-lg">
//         <div className="min-w-full  ">
//           <table className="table-auto w-full">
//             <thead className="sticky left-0 bg-black-700">
//               <tr className="border-b sticky top-0 border-gray-500">
//                 <th className=" bg-black-700 z-20">
//                   <div className="flex items-center justify-between gap-1 min-w-[120px] py-2 pl-4">
//                     <p className="text-sm font-normal text-white">Pair</p>
//                     <div className="h-[1rem] w-[2px] bg-gray-300"></div>
//                   </div>
//                 </th>
//                 {["Ask", "Bid", "Spread", "Day High", "Day Low"].map((title) => (
//                   <th key={title} className="bg-black-700 sticky top-0">
//                     <div className=" flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
//                       <p className="text-sm font-normal text-white">{title}</p>
//                       <div className="h-[1rem] w-[2px] bg-gray-300"></div>
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//           </table>
//           <div className="chart-scrollbar max-h-auto xl:max-h-[130px]">
//             <table className="table-auto w-full">
//               <tbody>
//                 {filteredPairs.map((pair, i) => {
//                   const data = liveData[pair];
//                   const isSelected = selectedPair === pair;
//                   return (
//                     <tr
//                       key={i}
//                       onClick={() => handlePairSelect(pair)}
//                       className={`cursor-pointer hover:bg-black-500 text-xs font-medium text-white transition-colors ${
//                         isSelected ? 'bg-black-500 border-l-2 border-green-400' : 'bg-black-700'
//                       }`
//                     }
//                     >
//                       <td className="sticky left-0 bg-inherit min-w-[120px] pl-4 py-2">
//                         {/* <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-1.5">
//                             <img src="/Images/Icons/gbp.svg" alt="icon" className="w-3.5" />
//                             <p className="pt-1 text-xs text-white uppercase">{pair}</p>
//                             <img src="/Images/Icons/dollar.svg" alt="dollar-icon" className="w-3.5" />
//                           </div>
//                           <div className="h-[1rem] w-[2px] bg-gray-300"></div>
//                         </div> */}
//                         <div className="flex items-center gap-1.5">
//   <img
//     src={`/Images/Flags/${pair.split('/')[0].toLowerCase()}.svg`}
//     alt={`${pair.split('/')[0]} flag`}
//     className="w-3.5 h-3.5  rounded-full"
//   />
//   <p className="pt-1 text-xs text-white uppercase">{pair}</p>
//   <img
//     src={`/Images/Flags/${pair.split('/')[1].toLowerCase()}.svg`}
//     alt={`${pair.split('/')[1]} flag`}
//     className="w-3.5 h-3.5 rounded-full"
//   />
// </div>
//                       </td>
//                       <td>
//                         <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
//                           <p className="text-xs font-normal text-white">
//                             {data?.a !== undefined ? data.a.toFixed(5) : '-'}
//                           </p>
//                           <div className="h-[1rem] w-[2px] bg-gray-300"></div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
//                           <p className="text-xs font-normal text-white">
//                             {data?.b !== undefined ? data.b.toFixed(5) : '-'}
//                           </p>
//                           <div className="h-[1rem] w-[2px] bg-gray-300"></div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
//                           <p className="text-xs font-normal text-white">
//                             {data?.spread !== undefined ? data.spread.toFixed(5) : '-'}
//                           </p>
//                           <div className="h-[1rem] w-[2px] bg-gray-300"></div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
//                           <p className="text-xs font-normal text-white">-</p>
//                           <div className="h-[1rem] w-[2px] bg-gray-300"></div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
//                           <p className="text-xs font-normal text-white">-</p>
//                           <div className="h-[1rem] w-[2px]"></div>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartControll;
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import Image from 'next/image';

// const elements = ['Pair', 'Ask', 'Bid', 'Spread', 'Day High', 'Day Low'];

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
  a?: number; // ask
  b?: number; // bid
  spread?: number;
}

interface SelectedData {
  pair: string;
  ask: number;
  bid: number;
  spread: number;
  dayHigh: number;
  dayLow: number;
}

type LiveDataMap = Record<string, LivePairData>;

interface ChartControllProps {
  onSelect: (element: SelectedData) => void;
}

const ChartControll: React.FC<ChartControllProps> = ({ onSelect }) => {
  const [liveData, setLiveData] = useState<LiveDataMap>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [hasAutoSelected, setHasAutoSelected] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const stompRef = useRef<Client | null>(null);

  // Filter by category
  const categoryPairs: string[] =
    selectedCategory === "all"
      ? allPairs
      : categoryGroups[selectedCategory] || [];

  // Filter by search term
  const filteredPairs: string[] =
    searchTerm.trim().length === 0
      ? categoryPairs
      : categoryPairs.filter(pair =>
          pair.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );

  // Auto-select first available data after loading (only once)
  useEffect(() => {
    if (!hasAutoSelected && Object.keys(liveData).length > 0) {
      for (const pair of filteredPairs) {
        const data = liveData[pair];
        if (data && typeof data.a === "number" && typeof data.b === "number" && typeof data.spread === "number") {
          setSelectedPair(pair);
          setHasAutoSelected(true);
          onSelect({
            pair,
            ask: data.a,
            bid: data.b,
            spread: data.spread,
            dayHigh: 0, 
            dayLow: 0   
          });
          break;
        }
      }
    }
  }, [liveData, filteredPairs, onSelect, hasAutoSelected]);

  
  useEffect(() => {
    setHasAutoSelected(false);
    setSelectedPair(null);
  }, [selectedCategory, searchTerm]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") ||
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiZXFpciIsImlhdCI6MTc0NDY1MDIwNywiZXhwIjoxNzQ0NzM2NjA3fQ.uh2dujCqC7PVK6O1vGK9ihHpT8i3O2mlzCbmfr-1gXA"
      : "";

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new WebSocket(
          `wss://elevenfundingapi-f91e4cb9118d.herokuapp.com/ws/forex?token=${token}`
        ),
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
  }, [token]);

  // Handle manual pair selection
  const handlePairSelect = (pair: string) => {
    const data = liveData[pair];
    if (data && typeof data.a === "number" && typeof data.b === "number") {
      setSelectedPair(pair);
      const selectedData: SelectedData = {
        pair,
        ask: data.a,
        bid: data.b,
        spread: data.spread || 0,
        dayHigh: 0,
        dayLow: 0
      };
      onSelect(selectedData);
    }
  };

  return (
    <div className="w-full lg:max-h-full  p-3 overflow-hidden bg-black-300 rounded-20">
      <h2 className='text-xl lg:hidden mb-5 border-b border-gray-200 pb-3 text-gray-200'>Quotes</h2>
      <div className="flex items-center gap-3 justify-between h-[38px] mb-1.5">
        <div className="bg-black-700  lg:w-[196px] h-full flex items-center gap-3 p-3 rounded-lg">
          <Image src="/Images/Icons/search.svg" alt="search-icon" width={16} height={16} />
          <input
            type="text"
            className="w-full text-sm text-white bg-transparent placeholder-white focus:outline-none"
            placeholder="Search"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <div className="bg-black-700 w-[140px] h-full flex items-center rounded-lg">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
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
      <div className="overflow-x-auto 
        xsm:max-h-[calc(78vh-150px)]
        sm:max-h-[calc(90vh-140px)]
        xxsm:max-h-[calc(78vh-140px)]
        md:max-h-[calc(100vh-300px)]
        lg:max-h-[calc(110vh-300px)]
        xl:max-h-none xl:h-auto chart-scrollbar rounded-lg">
        <div className="min-w-full  ">
          <table className="table-auto w-full">
            <thead className="sticky left-0 bg-black-700">
              <tr className="border-b sticky top-0 border-gray-500">
                <th className=" bg-black-700 z-20">
                  <div className="flex items-center justify-between gap-1 min-w-[120px] py-2 pl-4">
                    <p className="text-sm font-normal text-white">Pair</p>
                    <div className="h-[1rem] w-[2px] bg-gray-300"></div>
                  </div>
                </th>
                {["Ask", "Bid", "Spread", "Day High", "Day Low"].map((title) => (
                  <th key={title} className="bg-black-700 sticky top-0">
                    <div className=" flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
                      <p className="text-sm font-normal text-white">{title}</p>
                      <div className="h-[1rem] w-[2px] bg-gray-300"></div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          </table>
          <div className="chart-scrollbar max-h-auto xl:max-h-[130px]">
            <table className="table-auto w-full">
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
                      }`
                    }
                    >
                      <td className="sticky left-0 bg-inherit min-w-[120px] pl-4 py-2">
                        <div className="flex items-center gap-1.5">
                          {/* <Image
                            src={`/Images/Flags/${pair.split('/')[0].toLowerCase()}.svg`}
                            alt={`${pair.split('/')[0]} flag`}
                            className="w-3.5 h-3.5  rounded-full"
                            width={16}
                            height={16}
                          /> */}
                          <Image
  src={`/Images/Flags/${pair.split('/')[0].toLowerCase()}.svg`}
  alt="flag"
  width={16}
  height={16}
  onError={(e) => {
    e.currentTarget.src = '/Images/Flags/default.svg'; // fallback image
  }}
/>
                          <p className="pt-1 text-xs text-white uppercase">{pair}</p>
                          {/* <Image
                            src={`/Images/Flags/${pair.split('/')[1].toLowerCase()}.svg`}
                            alt={`${pair.split('/')[1]} flag`}
                            className="w-3.5 h-3.5 rounded-full"
                            width={16}
                            height={16}
                          /> */}
                          <Image
  src={`/Images/Flags/${pair.split('/')[1].toLowerCase()}.svg`}
  alt="flag"
  width={16}
  height={16}
  onError={(e) => {
    e.currentTarget.src = '/Images/Flags/default.svg'; // fallback image
  }}
/>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
                          <p className="text-xs font-normal text-white">
                            {data?.a !== undefined ? data.a.toFixed(5) : '-'}
                          </p>
                          <div className="h-[1rem] w-[2px] bg-gray-300"></div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
                          <p className="text-xs font-normal text-white">
                            {data?.b !== undefined ? data.b.toFixed(5) : '-'}
                          </p>
                          <div className="h-[1rem] w-[2px] bg-gray-300"></div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
                          <p className="text-xs font-normal text-white">
                            {data?.spread !== undefined ? data.spread.toFixed(5) : '-'}
                          </p>
                          <div className="h-[1rem] w-[2px] bg-gray-300"></div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
                          <p className="text-xs font-normal text-white">-</p>
                          <div className="h-[1rem] w-[2px] bg-gray-300"></div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-between gap-1 min-w-[88px] py-2 pl-4">
                          <p className="text-xs font-normal text-white">-</p>
                          <div className="h-[1rem] w-[2px]"></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartControll;