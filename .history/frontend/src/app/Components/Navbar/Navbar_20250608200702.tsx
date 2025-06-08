
import React, { useEffect, useRef, useState, MouseEvent, KeyboardEvent } from 'react';

import Transition from '@/Context/Transition';
import Image from 'next/image';
import Stats from '@/Components/TradingStats/Stats';

const Navbar: React.FC = () => {

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const dropdown = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clickHandler = (event: MouseEvent | globalThis.MouseEvent) => {
      const target = event.target as Node;
      if (
        !dropdown.current ||
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        (trigger.current && trigger.current.contains(target))
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler as EventListener);
    return () => document.removeEventListener('click', clickHandler as EventListener);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (!dropdownOpen || event.key !== 'Escape') return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler as EventListener);
    return () => document.removeEventListener('keydown', keyHandler as EventListener);
  }, [dropdownOpen]);

  return (
    <nav
      className="relative xl:grid flex justify-between xl:grid-cols-[200px_2fr_1fr] rounded-20 items-center w-full xl:px-6 lg:px-6 md:px-6 px-3 py-2 bg-black-300"
    >
      <div className="flex items-center lg:justify-between xl:justify-between gap-2 w-full lg:gap-4 xxl:gap-4 xl:gap-4">
        <div className="rounded w-[100px] lg:w-36 p-[3px]">
          <a href="#">
            <Image src='/logo.png' alt="site_logo" className="w-full" width={100} height={32} />
          </a>
        </div>
      </div>
      <div className="w-full hidden xl:block">
        <Stats />
      </div>
      <div className="flex items-center w-full justify-end gap-5">
        <div className="flex flex-row xsm:px-2 xxsm:px-1 py-4 px-3 gap-3 items-center lg:items-start xl:items-start lg:flex-col transition-all duration-300 ease-in-out transform hover:scale-[0.97] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:rotate-[0deg] hover:skew-x-[0deg] hover:skew-y-[0deg] lg:py-2 xl:py-2 lg:px-4 xl:px-4 lg:px-4 bg-black-700 border-[1px] border-green-10 lg:gap-0 xl:gap-0 rounded-xl">
          <h6 className="lg:text-[10px] whitespace-nowrap text-[10px] font-medium tracking-wide 3xl:text-[14px] text-white uppercase xl:pb-[5px] lg:pb-[5px]">
            Account Number
          </h6>
          <p className="leading-none lg:text-sm text-sm xl:text-sm 3xl:text-base font-medium text-red-400">
            #1234
          </p>
        </div>
        <div className="xl:flex xxl:flex hidden items-center gap-3 relative">
          <button
            className="flex items-center justify-center p-4 border-none outline-none cursor-pointer w-max rounded-2xl bg-black-700 h-[50px]"
          >
            <Image src="/Images/Icons/wifi.svg" alt="wifi-icon" width={24} height={24} />
          </button>
          <button
            className="flex h-[50px] items-center justify-center p-4 border-none outline-none cursor-pointer rounded-2xl bg-black-700"
            id="nav-dropdown-trigger-btn"
            ref={trigger}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <Image
              src="/Images/Icons/setting.svg"
              alt="settings-icon"
              className="w-10/12"
              width={24}
              height={24}
            />
          </button>
          <a
            href="login"
            className="flex h-[50px] items-center justify-center p-4 border-none outline-none cursor-pointer rounded-2xl bg-black-700"
          >
            <Image src="/Images/Icons/logout.svg" alt="logout-icon" width={24} height={24} />
          </a>
        </div>
      </div>
      <Transition
        className={`origin-top-right p-4 h-fit absolute top-full w-[450px] bg-black-700 dark:bg-gray-800 border border-black-300 rounded-xl z-10 shadow-lg overflow-hidden mt-1 right-20`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          className="space-y-4"
          ref={dropdown}
          tabIndex={-1}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <button className="flex items-center justify-between w-full p-2 bg-black-300 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="grid p-3 bg-violet-10 rounded-xl place-content-center">
                <Image src="/Images/Icons/theme-icon.svg" alt="theme-icon" width={20} height={20} />
              </div>
              <p className="text-xs leading-none text-white">Default Theme</p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-contentBg rounded-xl">
              <div className="w-full flex bg-violet-10 items-center gap-1.5 p-2 bg-themeViolet rounded-lg text-white text-xs">
                Dark
                <Image src="/Images/Icons/moon.svg" alt="moon-icon" width={16} height={16} />
              </div>
              <div className="w-full flex items-center gap-1.5 p-2 bg-transparent rounded-lg text-white text-xs">
                Light
                <Image src="/Images/Icons/sun.svg" alt="sun-icon" width={16} height={16} />
              </div>
            </div>
          </button>
          <button className="flex items-center bg-black-300 justify-between w-full p-2 bg-contentBg rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="grid p-3 bg-violet-10 rounded-xl place-content-center">
                <Image src="/Images/Icons/support-icon.svg" alt="support-icon.svg-icon" width={20} height={20} />
              </div>
              <p className="text-xs leading-none text-white">Support</p>
            </div>
            <div>
              <Image src="/Images/Icons/chevron-right.svg" alt="right_icon" width={14} height={14} />
            </div>
          </button>
          <button className="flex items-center bg-black-300 justify-between w-full p-2 bg-contentBg rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="grid bg-violet-10 p-3 bg-themeViolet rounded-xl place-content-center">
                <Image src='/Images/Icons/profile-icon.svg' alt="profile-icon.svg-icon" width={20} height={20} />
              </div>
              <p className="text-xs leading-none text-white">Profile</p>
            </div>
            <div>
              <Image src='/Images/Icons/chevron-right.svg' alt="right_icon" width={14} height={14} />
            </div>
          </button>
          <a
            href="login"
            className="flex items-center bg-black-300 justify-between w-full p-2 bg-contentBg rounded-xl"
          >
            <button flex items-center bg-black-300 justify-between w-full p-2 bg-contentBg rounded-xl>
            <div className="flex items-center gap-2.5">
              <div className="grid bg-violet-10 p-3 bg-themeViolet rounded-xl place-content-center">
                <Image src='/Images/Icons/logout.svg' alt="logout.svg-icon" width={20} height={20} />
              </div>
              <p className="text-xs leading-none text-white">Logout</p>
            </div>
            </button>
          </a>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;