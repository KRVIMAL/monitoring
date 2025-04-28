// src/monitoring/components/MapSidebar.tsx
import React, { useState } from 'react';
import { FaSyncAlt, FaBell, FaMapMarkerAlt, FaProjectDiagram, FaSignal, FaCube, FaCog, FaShareAlt, FaCopy, FaTimes, FaTruck, FaLock } from 'react-icons/fa';
import { MdWarning } from 'react-icons/md';

// Define different tab types
export type TabType = 'Status' | 'Alerts' | 'Notification';

interface Device {
  id?: string;
  imei: string;
  label: string;
  tripStartDate?: string;
  batteryPercentage: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  lastActive: string;
  isFavorite?: boolean;
  tripId?: string;
  deviceType?: string;
  type?: 'truck' | 'lock' | 'gps';
}

interface MapSidebarProps {
  onTabChange: (tab: TabType) => void;
  selectedTab: TabType;
  selectedDevice?: Device | null;
}

const MapSidebar: React.FC<MapSidebarProps> = ({ onTabChange, selectedTab, selectedDevice }) => {
  // State to track if card is visible
  const [cardVisible, setCardVisible] = useState(true);

  // Function to handle icon click
  const handleIconClick = (tab: TabType) => {
    onTabChange(tab);
    setCardVisible(true);
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could show a toast notification here
  };

  return (
    <div className="absolute top-[353px] right-5 flex">
      {/* Card Section */}
      {cardVisible && (
        <div className="w-[352px] h-[720px] bg-white rounded-[14px] shadow-md mr-2 overflow-hidden">
          {/* Close button */}
          <div className="absolute top-3 right-3 z-10">
            <button 
              onClick={() => setCardVisible(false)} 
              className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#CDCDCD]">
            <button 
              className={`flex-1 py-3 flex items-center justify-center ${
                selectedTab === 'Status' ? 'text-[#187CFF] border-b-2 border-[#187CFF]' : 'text-gray-600'
              }`}
              onClick={() => onTabChange('Status')}
            >
              <FaSyncAlt className="mr-2" />
              <span>Status</span>
            </button>
            <button 
              className={`flex-1 py-3 flex items-center justify-center ${
                selectedTab === 'Alerts' ? 'text-[#187CFF] border-b-2 border-[#187CFF]' : 'text-gray-600'
              }`}
              onClick={() => onTabChange('Alerts')}
            >
              <MdWarning className="mr-2" />
              <span>Alerts</span>
            </button>
            <button 
              className={`flex-1 py-3 flex items-center justify-center ${
                selectedTab === 'Notification' ? 'text-[#187CFF] border-b-2 border-[#187CFF]' : 'text-gray-600'
              }`}
              onClick={() => onTabChange('Notification')}
            >
              <FaBell className="mr-2" />
              <span>Notification</span>
            </button>
          </div>

          {/* Card Content based on selected tab */}
          {selectedTab === 'Status' && <StatusContent device={selectedDevice} />}
          {selectedTab === 'Alerts' && <AlertsContent />}
          {selectedTab === 'Notification' && <NotificationContent />}
        </div>
      )}

      {/* Sidebar Icons */}
      <div className="w-[50px] h-[396px] bg-white rounded-[10px] shadow-md flex flex-col">
        <button 
          className={`flex-1 flex items-center justify-center border-b border-[#DFDFDF] ${
            selectedTab === 'Status' && cardVisible ? 'bg-[#187CFF] text-white' : 'text-gray-600'
          }`}
          onClick={() => handleIconClick('Status')}
        >
          <FaSyncAlt size={20} />
        </button>
        <button 
          className={`flex-1 flex items-center justify-center border-b border-[#DFDFDF] ${
            selectedTab === 'Alerts' && cardVisible ? 'bg-[#187CFF] text-white' : 'text-gray-600'
          }`}
          onClick={() => handleIconClick('Alerts')}
        >
          <MdWarning size={20} />
        </button>
        <button 
          className={`flex-1 flex items-center justify-center border-b border-[#DFDFDF] ${
            selectedTab === 'Notification' && cardVisible ? 'bg-[#187CFF] text-white' : 'text-gray-600'
          }`}
          onClick={() => handleIconClick('Notification')}
        >
          <FaBell size={20} />
        </button>
        <button className="flex-1 flex items-center justify-center border-b border-[#DFDFDF]">
          <FaMapMarkerAlt size={20} />
        </button>
        <button className="flex-1 flex items-center justify-center border-b border-[#DFDFDF]">
          <FaProjectDiagram size={20} />
        </button>
        <button className="flex-1 flex items-center justify-center border-b border-[#DFDFDF]">
          <FaSignal size={20} />
        </button>
        <button className="flex-1 flex items-center justify-center border-b border-[#DFDFDF]">
          <FaCube size={20} />
        </button>
        <button className="flex-1 flex items-center justify-center">
          <FaShareAlt size={20} />
        </button>
      </div>
    </div>
  );
};

// Status Tab Content
interface StatusContentProps {
  device?: Device | null;
}

const StatusContent: React.FC<StatusContentProps> = ({ device }) => {
  const deviceData = device || {
    label: 'DLIZD2788',
    imei: '21456784256',
    batteryPercentage: 100,
    lastActive: '12 min',
    type: 'truck'
  };

  return (
    <div className="p-4">
      {/* Device Info Section */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Headsup devices</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-500">{deviceData.imei}</span>
          <button 
            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
            onClick={() => navigator.clipboard.writeText(deviceData.imei)}
          >
            <FaCopy className="text-gray-500 text-xs" />
          </button>
        </div>
      </div>
      
      {/* Status Circles */}
      <div className="flex mb-6 justify-between">
        <div className="text-center">
          <div className="p-3 bg-red-100 rounded-full mb-2 mx-auto">
            <div className="w-6 h-6 flex items-center justify-center text-white bg-red-500 rounded-full">
              <span className="text-xs">6m</span>
            </div>
          </div>
          <span className="text-sm">Parked</span>
        </div>
        <div className="text-center">
          <div className="p-3 bg-green-100 rounded-full mb-2 mx-auto">
            <div className="w-6 h-6 flex items-center justify-center text-white bg-green-500 rounded-full">
              <span className="text-xs">6m</span>
            </div>
          </div>
          <span className="text-sm">Motion</span>
        </div>
        <div className="text-center">
          <div className="p-3 bg-orange-100 rounded-full mb-2 mx-auto">
            <div className="w-6 h-6 flex items-center justify-center text-white bg-orange-500 rounded-full">
              <span className="text-xs">6m</span>
            </div>
          </div>
          <span className="text-sm">Ideal</span>
        </div>
        <div className="text-center">
          <div className="p-3 bg-gray-100 rounded-full mb-2 mx-auto">
            <div className="w-6 h-6 flex items-center justify-center text-white bg-gray-500 rounded-full">
              <span className="text-xs">6m</span>
            </div>
          </div>
          <span className="text-sm">Ideal</span>
        </div>
      </div>
      
      {/* Address Section */}
      <div className="border-t border-[#CDCDCD] pt-4 mb-4">
        <h3 className="font-medium mb-1">Address</h3>
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">House No. 526, Gali No. 02, Near RK Public School</p>
          <button className="p-1 bg-gray-100 rounded hover:bg-gray-200">
            <FaCopy className="text-gray-500 text-xs" />
          </button>
        </div>
      </div>
      
      {/* Coordinates Section */}
      <div className="border-t border-[#CDCDCD] pt-4 mb-4">
        <h3 className="font-medium mb-1">Coordinates</h3>
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">
            {device?.coordinates ? `${device.coordinates.lat}, ${device.coordinates.lng}` : '27.12456, 78.67842'}
          </p>
          <button className="p-1 bg-gray-100 rounded hover:bg-gray-200">
            <FaCopy className="text-gray-500 text-xs" />
          </button>
        </div>
      </div>
      
      {/* Device Section */}
      <div className="border-t border-[#CDCDCD] pt-4 mb-4">
        <h3 className="font-medium mb-1">Device</h3>
        <div className="grid grid-cols-2 gap-y-2">
          <span className="text-sm text-gray-600">GNSS</span>
          <span className="text-sm text-right">GPS</span>
          <span className="text-sm text-gray-600">Visible Satellites</span>
          <span className="text-sm text-right">10</span>
          <span className="text-sm text-gray-600">Cellular signal strength</span>
          <span className="text-sm text-right flex items-center justify-end">Strong
            <div className="ml-1 w-4 h-4 flex items-center">
              <div className="w-1 h-1 bg-green-500 rounded-full mr-[2px]"></div>
              <div className="w-1 h-2 bg-green-500 rounded-full mr-[2px]"></div>
              <div className="w-1 h-3 bg-green-500 rounded-full mr-[2px]"></div>
              <div className="w-1 h-4 bg-green-500 rounded-full"></div>
            </div>
          </span>
          <span className="text-sm text-gray-600">Last active</span>
          <span className="text-sm text-right">{deviceData.lastActive || '08-Apr-2025 | 10:12 AM'}</span>
          <span className="text-sm text-gray-600">Battery</span>
          <span className="text-sm text-right">{deviceData.batteryPercentage || 100}%</span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaMapMarkerAlt className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Live</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaProjectDiagram className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Track and Play</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaCube className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Device</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaCog className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Command</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaCog className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Configure</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaShareAlt className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Share</span>
        </button>
      </div>
    </div>
  );
};

// Alerts Tab Content
const AlertsContent: React.FC = () => {
  return (
    <div className="p-4">
      {/* Alert Items */}
      <div className="mb-4 pb-4 border-b border-[#CDCDCD]">
        <div className="flex items-center mb-2">
          <div className="bg-green-100 rounded-full p-1 mr-2">
            <MdWarning className="text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Stoppage Alert</h3>
          </div>
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">
            12 min
          </div>
          <button className="ml-2 text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
        <div className="flex items-center ml-7">
          <div className="bg-green-500 text-white text-xs py-1 px-3 rounded-full mr-2">
            Normal
          </div>
          <button className="text-gray-400 hover:text-gray-600 mx-2">
            <FaMapMarkerAlt />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <FaCopy />
          </button>
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-[#CDCDCD]">
        <div className="flex items-center mb-2">
          <div className="bg-red-100 rounded-full p-1 mr-2">
            <MdWarning className="text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Tampered Alert</h3>
          </div>
          <div className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs">
            45 min
          </div>
          <button className="ml-2 text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
        <div className="flex items-center ml-7">
          <div className="bg-red-500 text-white text-xs py-1 px-3 rounded-full mr-2">
            Critical
          </div>
          <button className="text-gray-400 hover:text-gray-600 mx-2">
            <FaMapMarkerAlt />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <FaCopy />
          </button>
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-[#CDCDCD]">
        <div className="flex items-center mb-2">
          <div className="bg-orange-100 rounded-full p-1 mr-2">
            <MdWarning className="text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Over Speeding Alert</h3>
          </div>
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">
            60 min
          </div>
          <button className="ml-2 text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
        <div className="flex items-center ml-7">
          <div className="bg-orange-400 text-white text-xs py-1 px-3 rounded-full mr-2">
            Moderate
          </div>
          <button className="text-gray-400 hover:text-gray-600 mx-2">
            <FaMapMarkerAlt />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <FaCopy />
          </button>
        </div>
      </div>

      {/* Clear All Button */}
      <div className="text-right">
        <button className="font-medium text-gray-800">
          Clear All
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaMapMarkerAlt className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Live</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaProjectDiagram className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Track and Play</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaCube className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Device</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaCog className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Command</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaCog className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Configure</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaShareAlt className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Share</span>
        </button>
      </div>
    </div>
  );
};

// Notification Tab Content
const NotificationContent: React.FC = () => {
  return (
    <div className="p-4">
      {/* Notification Items */}
      <div className="mb-4 pb-4 border-b border-[#CDCDCD]">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 rounded-full p-1 mr-2">
            <FaBell className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Headsup Corporation...</h3>
          </div>
          <div className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs">
            12 min
          </div>
          <button className="ml-2 text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
        <div className="flex items-center ml-7">
          <div className="bg-green-500 text-white text-xs py-1 px-3 rounded-full mr-2">
            In
          </div>
          <button className="text-gray-400 hover:text-gray-600 mx-2">
            <FaMapMarkerAlt />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <FaCopy />
          </button>
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-[#CDCDCD]">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 rounded-full p-1 mr-2">
            <FaBell className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Headsup Corporation...</h3>
          </div>
          <div className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs">
            45 min
          </div>
          <button className="ml-2 text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
        <div className="flex items-center ml-7">
          <div className="bg-red-500 text-white text-xs py-1 px-3 rounded-full mr-2">
            Out
          </div>
          <button className="text-gray-400 hover:text-gray-600 mx-2">
            <FaMapMarkerAlt />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <FaCopy />
          </button>
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-[#CDCDCD]">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 rounded-full p-1 mr-2">
            <FaBell className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Dwarka</h3>
          </div>
          <div className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs">
            60 min
          </div>
          <button className="ml-2 text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
        <div className="flex items-center ml-7">
          <div className="bg-green-500 text-white text-xs py-1 px-3 rounded-full mr-2">
            In
          </div>
          <button className="text-gray-400 hover:text-gray-600 mx-2">
            <FaMapMarkerAlt />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <FaCopy />
          </button>
        </div>
      </div>

      {/* Clear All Button */}
      <div className="text-right">
        <button className="font-medium text-gray-800">
          Clear All
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaMapMarkerAlt className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Live</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaProjectDiagram className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Track and Play</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaCube className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Device</span>
        </button>
      </div>
      
      {/* Phase Indicator */}
      <div className="text-center mt-4">
        <span className="text-gray-600">Phase 2</span>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mt-4">
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaCog className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Command</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaCog className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Configure</span>
        </button>
        <button className="w-[100px] h-[63px] bg-[#DAEAFF] rounded-[14px] flex flex-col items-center justify-center">
          <FaShareAlt className="text-[#187CFF] mb-1" />
          <span className="text-xs text-[#187CFF]">Share</span>
        </button>
      </div>
    </div>
  );
};

export default MapSidebar;