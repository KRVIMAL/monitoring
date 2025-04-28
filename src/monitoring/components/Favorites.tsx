// src/monitoring/components/Favorites.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaStar, FaTruck, FaLock, FaMapMarkerAlt, FaTimes, FaCopy } from 'react-icons/fa';

// Device interface for favorites
interface Device {
  id: string;
  label: string;
  imei: string;
  batteryPercentage: number;
  lastActive: string;
  type: 'truck' | 'lock' | 'gps';
  isFavorite: boolean;
}

// Mock data for favorites
const mockFavorites: Device[] = [
  {
    id: '1',
    label: 'DLIZD2788',
    imei: '21456784256',
    batteryPercentage: 100,
    lastActive: '12 min',
    type: 'truck',
    isFavorite: true
  },
  {
    id: '2',
    label: 'Smart Lock',
    imei: '21456784256',
    batteryPercentage: 60,
    lastActive: '45 min',
    type: 'lock',
    isFavorite: true
  },
  {
    id: '3',
    label: 'DLIZD2788',
    imei: '214567',
    batteryPercentage: 40,
    lastActive: '60 min',
    type: 'gps',
    isFavorite: true
  }
];

interface FavoritesProps {
  onSelectDevice?: (device: Device) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onSelectDevice }) => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Device[]>(mockFavorites);
  const [selectedFavorite, setSelectedFavorite] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowFavorites(false);
      }
    };

    if (showFavorites) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFavorites]);

  // Toggle favorites panel
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  // Handle selecting a favorite
  const handleSelectFavorite = (device: Device) => {
    setSelectedFavorite(device.id === selectedFavorite ? null : device.id);
    if (onSelectDevice) {
      onSelectDevice(device);
    }
  };

  // Toggle favorite status (for individual devices)
  const toggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites(favorites.map(device => 
      device.id === id ? { ...device, isFavorite: !device.isFavorite } : device
    ));
  };

  // Copy IMEI to clipboard
  const copyToClipboard = (text: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  // Render device icon based on type
  const renderDeviceIcon = (type: 'truck' | 'lock' | 'gps') => {
    switch (type) {
      case 'truck':
        return <FaTruck className="text-blue-500" />;
      case 'lock':
        return <FaLock className="text-gray-600" />;
      case 'gps':
        return <FaMapMarkerAlt className="text-red-500" />;
      default:
        return <FaTruck className="text-blue-500" />;
    }
  };

  // Render battery indicator with proper color
  const renderBatteryIndicator = (percentage: number) => {
    let fillColor = 'bg-green-500';
    let textColor = 'text-green-500';
    
    if (percentage <= 20) {
      fillColor = 'bg-red-500';
      textColor = 'text-red-500';
    } else if (percentage <= 60) {
      fillColor = 'bg-orange-400';
      textColor = 'text-orange-400';
    }

    return (
      <div className="flex items-center">
        <div className="w-6 h-3 border border-gray-300 rounded-sm mr-2 relative">
          <div className={`absolute left-0 top-0 bottom-0 ${fillColor} rounded-sm`} style={{ width: `${percentage}%` }}></div>
        </div>
        <span className={`text-sm ${textColor} font-medium`}>
          {percentage}%
        </span>
      </div>
    );
  };

  // Render last active time with appropriate color
  const renderLastActive = (time: string) => {
    // Parse time to determine color
    let bgColor = 'bg-green-500';
    let textColor = 'text-white';
    
    if (time.includes('60')) {
      bgColor = 'bg-red-500';
    } else if (time.includes('45')) {
      bgColor = 'bg-orange-400';
    }

    return (
      <div className={`${bgColor} ${textColor} text-xs px-3 py-1 rounded-full`}>
        {time}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Star Icon in Header */}
      <button 
        onClick={toggleFavorites}
        className={`p-2 ${showFavorites ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-600 bg-white rounded-full shadow-sm`}
        aria-label="Show favorites"
      >
        <FaStar size={20} />
      </button>

      {/* Favorites Panel */}
      {showFavorites && (
        <div 
          ref={panelRef}
          className="absolute top-12 right-0 w-[358px] bg-white rounded-[14px] shadow-lg z-50 overflow-hidden"
        >
          <div className="flex justify-between items-center p-3 border-b border-gray-200">
            <h3 className="font-medium">Favorites</h3>
            <button 
              onClick={toggleFavorites} 
              className="text-gray-500 hover:text-gray-700 rounded-full w-6 h-6 flex items-center justify-center"
              aria-label="Close favorites"
            >
              <FaTimes />
            </button>
          </div>

          <div className="max-h-[401px] overflow-y-auto">
            {favorites.map((device) => (
              <div 
                key={device.id}
                onClick={() => handleSelectFavorite(device)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-[#F8FAFF] ${
                  selectedFavorite === device.id ? 'bg-[#EEF5FF]' : 'bg-white'
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    {renderDeviceIcon(device.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        {device.label}
                        {device.type === 'lock' && (
                          <FaLock className="ml-1 text-gray-500 text-xs" />
                        )}
                      </h4>
                      <button 
                        onClick={(e) => toggleFavorite(device.id, e)}
                        className="ml-auto text-blue-500"
                        aria-label={device.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <FaStar />
                      </button>
                    </div>
                    <div className="flex items-center text-blue-500 text-sm">
                      {device.imei}
                      <button 
                        onClick={(e) => copyToClipboard(device.imei, e)}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                        aria-label="Copy IMEI"
                      >
                        <FaCopy size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  {renderBatteryIndicator(device.batteryPercentage)}
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 mb-1">Last Active</span>
                    {renderLastActive(device.lastActive)}
                  </div>
                </div>
              </div>
            ))}

            {/* Placeholder for infinite scroll */}
            {favorites.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No favorites found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;