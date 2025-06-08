import React, { useContext } from 'react';
import { AuthContext } from '@/Context/AuthContext';
interface Stat {
  id: string;
  balance: string;
}

const stats: Stat[] = [
  { id: 'Balance', balance: {user?.balance} },
  { id: 'Profit & Loss', balance: ' -$40.89' },
  { id: 'Equity', balance: '$9951.37' },
  { id: 'Margin Used', balance: ' $44.59280' },
  { id: 'Margin Available', balance: '$9906.78' },
  { id: 'Margin Level', balance: '22316.09%' },
];

const Stats: React.FC = () => {
  const {user}=useContext(AuthContext)!;
  return (
    <div className="grid grid-cols-3 xl:flex items-center lg:px-0 lg:py-0 flex items-center justify-center rounded-20 gap-2 xl:gap-3 lg:gap-3">
      {stats.map((e, i) => (
        <div
          key={i}
          className="trading-nav-overview flex flex-col items-start justify-center px-3 py-2 transition-all duration-300 ease-in-out transform hover:scale-[0.97] cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] hover:rotate-[0deg] hover:skew-x-[0deg] hover:skew-y-[0deg] bg-black-700 border-[1px] border-green-10 rounded-xl"
        >
          <h6 className="lg:text-[10px] whitespace-nowrap text-[10px] font-medium tracking-wide 3xl:text-[14px] text-white uppercase xl:pb-[5px] lg:pb-[5px]">
            {e.id}
          </h6>
          <p
            className={`leading-none lg:text-sm text-sm xl:text-sm 3xl:text-base font-medium text-red-400 ${
              e.id === 'Profit & Loss' ? 'text-red-400' : 'text-white'
            }`}
          >
            {e.balance}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stats;