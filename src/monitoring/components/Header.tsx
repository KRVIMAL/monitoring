// components/Header.tsx
import React, { JSX } from 'react';
import { FaTrash, FaTruck, FaLock, FaMapMarkerAlt } from 'react-icons/fa';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

interface TabData {
  name: string;
  icon: JSX.Element;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabData[] = [
    { name: 'All Devices', icon: <FaTrash className="text-xl" /> },
    { name: 'Vehicle', icon: <FaTruck className="text-xl" /> },
    { name: 'Lock', icon: <FaLock className="text-xl" /> },
    { name: 'GPS', icon: <FaMapMarkerAlt className="text-xl" /> },
  ];

  return (
    <div className="flex space-x-4 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          className={`flex flex-col items-center justify-center w-[135px] h-[79px] rounded-[14px] shadow-sm transition-colors ${
            activeTab === tab.name ? 'bg-[#187CFF] text-white' : 'bg-white text-gray-600'
          }`}
          onClick={() => onTabChange(tab.name)}
        >
          <div className="mb-1">{tab.icon}</div>
          <div className="text-sm font-medium">{tab.name}</div>
        </button>
      ))}
    </div>
  );
};

export default Header;