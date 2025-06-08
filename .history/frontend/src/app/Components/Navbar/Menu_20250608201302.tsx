
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { AuthContext } from '@/Context/AuthContext';
const Menu: React.FC = () => {
const router=useRouter();
const { logout } = useContext(AuthContext)!;
const handleLogout = async () => {
    await logout();
   
    router.push('/login'); 
  };
  return (
    <div className="flex flex-col gap-4">
      <button className="flex items-center justify-between w-full p-2 bg-black-300 rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className="grid p-3 bg-violet-10 rounded-xl place-content-center">
            <Image src='/Images/Icons/theme-icon.svg' alt="theme-icon" width={20} height={20} />
          </div>
          <p className="text-xs leading-none text-white">Default Theme</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-contentBg rounded-xl">
          <div className="w-full flex bg-violet-10 items-center gap-1.5 p-2 bg-themeViolet rounded-lg text-white text-xs">
            Dark
            <Image src='/Images/Icons/moon.svg' alt="moon-icon" width={16} height={16} />
          </div>
          <div className="w-full flex items-center gap-1.5 p-2 bg-transparent rounded-lg text-white text-xs">
            Light
            <Image src='/Images/Icons/sun.svg' alt="sun-icon" width={16} height={16} />
          </div>
        </div>
      </button>

      <button className="flex items-center bg-black-300 justify-between w-full p-2 bg-contentBg rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className="grid p-3 bg-violet-10 rounded-xl place-content-center">
            <Image src='/Images/Icons/support-icon.svg' alt="support-icon.svg-icon" width={20} height={20} />
          </div>
          <p className="text-xs leading-none text-white">Support</p>
        </div>
        <div>
          <Image src='/Images/Icons/chevron-right.svg' alt="right_icon" width={14} height={14} />
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

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center bg-black-300 justify-between w-full p-2 bg-contentBg rounded-xl"
      >
        <div className="flex items-center gap-2.5">
          <div className="grid bg-violet-10 p-3 bg-themeViolet rounded-xl place-content-center">
            <Image src="/Images/Icons/logout.svg" alt="logout.svg-icon" width={20} height={20} />
          </div>
          <p className="text-xs leading-none text-white">Logout</p>
        </div>
      </button>
    </div>
  );
};

export default Menu;