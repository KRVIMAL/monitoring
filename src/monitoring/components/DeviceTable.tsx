// src/monitoring/components/DeviceTable.tsx
import React, { useState } from 'react';
import { FaStar, FaTimes, FaChevronLeft, FaEllipsisH, FaTruck, FaLock, FaMapMarkerAlt, FaCopy, FaChevronRight } from 'react-icons/fa';
import moment from 'moment-timezone';
interface Device {
  id: string;
  imei: string;
  label: string;
  batteryPercentage: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  lastActive: string;
  isFavorite: boolean;
  type: 'truck' | 'lock' | 'gps';
  deviceType: string;
  speed?: number;
  bearing?: number;
  originalDateTime?: string; 
}

interface DeviceTableProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onSelectDevice: (device: Device) => void;
  onHideTable: () => void;
  isLoading?: boolean;
}

const DeviceTable: React.FC<DeviceTableProps> = ({ 
  devices, 
  selectedDeviceId, 
  onSelectDevice, 
  onHideTable,
  isLoading = false
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showFieldsList, setShowFieldsList] = useState(false);
  const [showLogicsList, setShowLogicsList] = useState(false);
  const [filterField, setFilterField] = useState('Remaining battery');
  const [filterLogic, setFilterLogic] = useState('Greater than');
  const [filterValue, setFilterValue] = useState('50');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Toggle favorite status
  const toggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // In a real app, this would update a server API
    // For this demo, we'll just console log
    console.log(`Toggle favorite for device ${id}`);
  };

  // Toggle filter panel
  const toggleFilters = () => {
    setShowFilters(!showFilters);
    setShowFieldsList(false);
    setShowLogicsList(false);
  };

  // Toggle fields list
  const toggleFieldsList = () => {
    setShowFieldsList(!showFieldsList);
    setShowLogicsList(false);
  };

  // Toggle logic list
  const toggleLogicsList = () => {
    setShowLogicsList(!showLogicsList);
    setShowFieldsList(false);
  };

  // Select a field
  const selectField = (field: string) => {
    setFilterField(field);
    setShowFieldsList(false);
  };

  // Select a logic
  const selectLogic = (logic: string) => {
    setFilterLogic(logic);
    setShowLogicsList(false);
  };

  // Apply filters
  const applyFilters = () => {
    // In a real app, this would filter the devices based on the selected criteria
    // For this demo, we'll just close the filter panel
    setShowFilters(false);
  };

  // Save filter
  const saveFilter = () => {
    // In a real app, this would save the filter for future use
    alert('Filter saved!');
  };

  // Filter devices by search query
  const filteredDevices = devices.filter(device => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      device.label.toLowerCase().includes(query) ||
      device.imei.toLowerCase().includes(query) ||
      device.deviceType.toLowerCase().includes(query)
    );
  });

  // Render device icon based on type
  const renderDeviceIcon = (type: string) => {
    switch (type) {
      case 'truck':
        return <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><FaTruck className="text-blue-500" /></div>;
      case 'lock':
        return <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><FaLock className="text-gray-600" /></div>;
      case 'gps':
        return <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><FaMapMarkerAlt className="text-red-500" /></div>;
      default:
        return <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><FaTruck className="text-blue-500" /></div>;
    }
  };

  const renderLastActive = (time: string, isoString: string) => {
    // Parse time to determine color for the relative time
    let bgColor = 'bg-green-500';
    let textColor = 'text-white';
    
    if (time.includes('hour') || time.includes('day')) {
      bgColor = 'bg-red-500';
    } else if (time.includes('minutes') && parseInt(time) > 30) {
      bgColor = 'bg-orange-400';
    }
  
    // Format the actual time in IST
    const istTime = moment.utc(isoString).utcOffset('+05:30').format('hh:mm A');
  
    return (
      <div className="flex flex-col items-end">
        <span className="text-xs text-gray-500 mb-1">Last Active</span>
        <div className={`${bgColor} ${textColor} text-xs px-3 py-1 rounded-full mb-1`}>
          {time}
        </div>
        <span className="text-xs text-gray-500">{istTime}</span>
      </div>
    );
  };

  // Render battery indicator
  const renderBatteryIndicator = (percentage: number) => {
    let bgColor = 'bg-green-500';
    let textColor = 'text-green-500';
    
    if (percentage <= 20) {
      bgColor = 'bg-red-500';
      textColor = 'text-red-500';
    } else if (percentage <= 60) {
      bgColor = 'bg-orange-400';
      textColor = 'text-orange-400';
    }

    return (
      <div className="flex items-center">
        <div className="w-6 h-3 border border-gray-300 rounded-sm mr-2 relative">
          <div className={`absolute left-0 top-0 bottom-0 ${bgColor} rounded-sm`} style={{ width: `${percentage}%` }}></div>
        </div>
        <span className={`text-sm ${textColor} font-medium`}>
          {percentage}%
        </span>
      </div>
    );
  };

  // // Render last active time with appropriate color
  // const renderLastActive = (time: string) => {
  //   // Parse time to determine color
  //   let bgColor = 'bg-green-500';
  //   let textColor = 'text-white';
    
  //   if (time.includes('hour') || time.includes('day')) {
  //     bgColor = 'bg-red-500';
  //   } else if (parseInt(time) > 30) {
  //     bgColor = 'bg-orange-400';
  //   }

  //   return (
  //     <div className={`${bgColor} ${textColor} text-xs px-3 py-1 rounded-full`}>
  //       {time}
  //     </div>
  //   );
  // };

  // Copy text to clipboard
  const copyToClipboard = (text: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div className="relative">
      {/* Main Table Container */}
      <div className="w-[358px] max-h-[997px] bg-white rounded-[14px] shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="p-4 flex justify-between items-center border-b border-[#CDCDCD]">
          <div className="flex space-x-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Select account" 
                className="w-[165px] h-[38px] px-3 border border-gray-300 rounded-[10px] text-sm"
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Select group" 
                className="w-[165px] h-[38px] px-3 border border-gray-300 rounded-[10px] text-sm"
                disabled={isLoading}
              />
            </div>
          </div>
          <button 
            onClick={onHideTable}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <FaChevronLeft />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#CDCDCD]">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[38px] px-3 border border-gray-300 rounded-[10px] text-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Device List */}
        <div className="overflow-y-auto" style={{ maxHeight: "800px" }}>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No devices found
            </div>
          ) : (
            filteredDevices.map((device:any) => (
              <div 
                key={device.id}
                onClick={() => onSelectDevice(device)}
                className={`p-4 border-b border-[#CDCDCD] cursor-pointer ${
                  selectedDeviceId === device.id ? 'bg-[#EEF5FF]' : ''
                }`}
              >
                <div className="flex items-center mb-2">
                  {renderDeviceIcon(device.type)}
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        {device.label}
                        {device.type === 'lock' && (
                          <FaLock className="ml-1 text-gray-500 text-xs" />
                        )}
                        {device.type === 'gps' && (
                          <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                            GPS Device
                          </span>
                        )}
                      </h4>
                      <div className="flex ml-auto space-x-2">
                        <button 
                          onClick={(e) => toggleFavorite(device.id, e)}
                          className={`${device.isFavorite ? 'text-blue-500' : 'text-gray-300'} hover:text-blue-500`}
                        >
                          <FaStar />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <FaEllipsisH />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center text-blue-500 text-sm">
                      {device.imei}
                      <button 
                        className="ml-1 text-gray-400 hover:text-gray-600"
                        onClick={(e) => copyToClipboard(device.imei, e)}
                      >
                        <FaCopy size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
  {renderBatteryIndicator(device.batteryPercentage)}
  {renderLastActive(device.lastActive, device.originalDateTime)}
</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Collapse Button - Shown when table is visible */}
      <button 
        onClick={onHideTable}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
        disabled={isLoading}
      >
        <FaChevronLeft className="text-gray-500" />
      </button>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-0 left-0 w-[285px] bg-white rounded-[14px] shadow-lg z-50">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="font-medium">Filter by</h3>
            <button 
              onClick={toggleFilters}
              className="text-gray-500 hover:text-gray-700 rounded-full"
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Filter By */}
            <div>
              <div 
                className="w-[261px] h-[38px] px-3 py-2 border border-gray-300 rounded-[10px] text-sm flex justify-between items-center cursor-pointer"
                onClick={toggleFieldsList}
              >
                <span>Device</span>
                <FaChevronLeft className="text-gray-400 transform rotate-180" />
              </div>
            </div>

            {/* Select Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select fields
              </label>
              <div 
                className="w-[261px] h-[38px] px-3 py-2 border border-gray-300 rounded-[10px] text-sm flex justify-between items-center cursor-pointer"
                onClick={toggleFieldsList}
              >
                <span>{filterField}</span>
                <FaChevronLeft className="text-gray-400 transform rotate-180" />
              </div>
            </div>

            {/* Logic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logic
              </label>
              <div 
                className="w-[261px] h-[38px] px-3 py-2 border border-gray-300 rounded-[10px] text-sm flex justify-between items-center cursor-pointer"
                onClick={toggleLogicsList}
              >
                <span>{filterLogic}</span>
                <FaChevronLeft className="text-gray-400 transform rotate-180" />
              </div>
            </div>

            {/* Data Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Input
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">number only</span>
              </label>
              <input 
                type="text" 
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-[261px] h-[38px] px-3 py-2 border border-gray-300 rounded-[10px] text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <button 
                onClick={saveFilter}
                className="w-[124px] h-[33px] bg-green-500 text-white rounded-[10px] text-sm"
              >
                Save filter
              </button>
              <button 
                onClick={applyFilters}
                className="w-[77px] h-[33px] bg-blue-500 text-white rounded-[10px] text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

  {/* Fields List Panel */}
{showFieldsList && (
  <div className="absolute top-0 right-[-307px] w-[307px] h-[646px] bg-white rounded-[14px] shadow-lg z-50">
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-medium">List of fields</h3>
    </div>

    <div className="overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectField('Device type')}>
        <span>Device type</span>
        <FaChevronRight className="text-gray-400" />
      </div>
      <div 
        className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-100 cursor-pointer"
        onClick={() => selectField('Remaining Battery')}
      >
        <span className="text-blue-500 font-medium">Remaining Battery</span>
        <FaChevronRight className="text-blue-500" />
      </div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectField('Lat')}>
        <span>Lat</span>
        <FaChevronRight className="text-gray-400" />
      </div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectField('Long')}>
        <span>Long</span>
        <FaChevronRight className="text-gray-400" />
      </div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectField('Created at')}>
        <span>Created at</span>
        <FaChevronRight className="text-gray-400" />
      </div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectField('Updated at')}>
        <span>Updated at</span>
        <FaChevronRight className="text-gray-400" />
      </div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectField('Last position')}>
        <span>Last position</span>
        <FaChevronRight className="text-gray-400" />
      </div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectField('Last active')}>
        <span>Last active</span>
        <FaChevronRight className="text-gray-400" />
      </div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectField('Product Master')}>
        <span>Product Master</span>
        <FaChevronRight className="text-gray-400" />
      </div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectField('Customer Master')}>
        <span>Customer Master</span>
        <FaChevronRight className="text-gray-400" />
      </div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectField('Vendor Master')}>
        <span>Vendor Master</span>
        <FaChevronRight className="text-gray-400" />
      </div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectField('Monitoring Page')}>
        <span>Monitoring Page</span>
        <FaChevronRight className="text-gray-400" />
      </div>
    </div>
  </div>
)}

{/* Logic List Panel */}
{showLogicsList && (
  <div className="absolute top-0 right-[-307px] w-[307px] h-[186px] bg-white rounded-[14px] shadow-lg z-50">
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-medium">List of Logics</h3>
    </div>

    <div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectLogic('Equal to')}>
        <span>Equal to</span>
        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">varchar</span>
        <FaChevronRight className="text-gray-400" />
      </div>
      <div 
        className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-100 cursor-pointer"
        onClick={() => selectLogic('Greater than')}
      >
        <span className="text-blue-500 font-medium">Greater than</span>
        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">number only</span>
        <FaChevronRight className="text-blue-500" />
      </div>
      <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
          onClick={() => selectLogic('Less than')}>
        <span>Less than</span>
        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">number only</span>
        <FaChevronRight className="text-gray-400" />
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default DeviceTable;