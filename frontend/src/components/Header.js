import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import logo from '../../src/assets/logo.png';

function Header() {
  return (
    <nav className="flex justify-between items-center bg-gray-50 h-[100px] px-[10px] shadow-md sticky top-0 z-[1000]">
      <div className="flex items-center gap-4">
        <img src={logo} alt="Fit India Logo" className="h-[60px] w-[60px] rounded-full" />
        <button className="border-none text-1xl font-medium cursor-pointer flex items-center gap-1">
          Address <FaChevronDown />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <FiSearch className="text-[20px] font-bold text-blue-500 cursor-pointer" />
        <FaUser className="text-[20px] font-bold text-blue-500 cursor-pointer" />
      </div>
    </nav>
  );
}

export default Header;
