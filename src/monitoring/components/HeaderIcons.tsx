// src/monitoring/components/HeaderIcons.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaStar, FaFilter, FaCog } from 'react-icons/fa';
import Favorites from './Favorites';
import FilterPanel, { FilterCriteria } from './FilterPanel';
import SettingsPanel from './SettingsPanel';

interface HeaderIconsProps {
  onFilterApplied?: (filter: FilterCriteria) => void;
  onSettingsApplied?: (settings: any) => void;
}

const HeaderIcons: React.FC<HeaderIconsProps> = ({ onFilterApplied, onSettingsApplied }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle filter panel
  const toggleFilter = () => {
    setShowFilter(!showFilter);
    if (showSettings) setShowSettings(false);
  };

  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (showFilter) setShowFilter(false);
  };

  // Handle filter apply
  const handleFilterApply = (filter: FilterCriteria) => {
    if (onFilterApplied) {
      onFilterApplied(filter);
    }
    setShowFilter(false);
  };

  // Handle settings apply
  const handleSettingsApply = (settings: any) => {
    if (onSettingsApplied) {
      onSettingsApplied(settings);
    }
    setShowSettings(false);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Favorites */}
      <Favorites />

      {/* Filter */}
      <div ref={filterRef} className="relative">
        <button 
          onClick={toggleFilter}
          className={`p-2 ${showFilter ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-600 bg-white rounded-full shadow-sm`}
          aria-label="Filter"
        >
          <FaFilter size={20} />
        </button>

        {showFilter && (
          <div className="absolute top-10 right-0 z-50">
            <FilterPanel 
              onClose={() => setShowFilter(false)} 
              onApplyFilter={handleFilterApply} 
            />
          </div>
        )}
      </div>

      {/* Settings */}
      <div ref={settingsRef} className="relative">
        <button 
          onClick={toggleSettings}
          className={`p-2 ${showSettings ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-600 bg-white rounded-full shadow-sm`}
          aria-label="Settings"
        >
          <FaCog size={20} />
        </button>

        {showSettings && (
          <div className="absolute top-10 right-0 z-50">
            <SettingsPanel 
              onClose={() => setShowSettings(false)} 
              onApplySettings={handleSettingsApply} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderIcons;