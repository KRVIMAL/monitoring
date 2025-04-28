// src/monitoring/components/FilterPanel.tsx
import React, { useState } from 'react';
import { FaChevronRight, FaTimes } from 'react-icons/fa';

interface FilterPanelProps {
  onClose: () => void;
  onApplyFilter: (filter: FilterCriteria) => void;
}

export interface FilterCriteria {
  filterBy: string;
  field: string;
  logic: string;
  value: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onClose, onApplyFilter }) => {
  const [showFieldsList, setShowFieldsList] = useState(false);
  const [showLogicsList, setShowLogicsList] = useState(false);
  const [filterBy, setFilterBy] = useState('Device');
  const [selectedField, setSelectedField] = useState('Remaining battery');
  const [selectedLogic, setSelectedLogic] = useState('Greater than');
  const [filterValue, setFilterValue] = useState('50');

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
  const handleSelectField = (field: string) => {
    setSelectedField(field);
    setShowFieldsList(false);
  };

  // Select a logic
  const handleSelectLogic = (logic: string) => {
    setSelectedLogic(logic);
    setShowLogicsList(false);
  };

  // Save filter
  const handleSaveFilter = () => {
    // In a real app, would save this filter configuration
    // For demo, just show an alert
    alert('Filter saved for future use!');
  };

  // Apply filter
  const handleApplyFilter = () => {
    onApplyFilter({
      filterBy,
      field: selectedField,
      logic: selectedLogic,
      value: filterValue
    });
    onClose();
  };

  return (
    <div className="relative">
      {/* Main Filter Panel */}
      <div className="w-[285px] bg-white rounded-[14px] shadow-lg z-50">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="font-medium">Filter by</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full w-6 h-6 flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Filter By */}
          <div>
            <div 
              className="w-[261px] h-[38px] px-3 py-2 border border-gray-300 rounded-[10px] text-sm flex justify-between items-center cursor-pointer"
            >
              <span>{filterBy}</span>
              <FaChevronRight className="text-gray-400" />
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
              <span>{selectedField}</span>
              <FaChevronRight className="text-gray-400" />
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
              <span>{selectedLogic}</span>
              <FaChevronRight className="text-gray-400" />
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
              onClick={handleSaveFilter}
              className="h-[33px] px-4 bg-green-500 text-white rounded-[10px] text-sm"
            >
              Save filter
            </button>
            <button 
              onClick={handleApplyFilter}
              className="w-[77px] h-[33px] bg-blue-500 text-white rounded-[10px] text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Fields List Panel */}
      {showFieldsList && (
        <div className="absolute top-0 right-[-307px] w-[307px] h-[646px] bg-white rounded-[14px] shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium">List of fields</h3>
          </div>

          <div className="overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                 onClick={() => handleSelectField('Device type')}>
              <span>Device type</span>
              <FaChevronRight className="text-gray-400" />
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-100 cursor-pointer"
              onClick={() => handleSelectField('Remaining Battery')}
            >
              <span className="text-blue-500 font-medium">Remaining Battery</span>
              <FaChevronRight className="text-blue-500" />
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                 onClick={() => handleSelectField('Lat')}>
              <span>Lat</span>
              <FaChevronRight className="text-gray-400" />
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                 onClick={() => handleSelectField('Long')}>
              <span>Long</span>
              <FaChevronRight className="text-gray-400" />
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                 onClick={() => handleSelectField('Created at')}>
              <span>Created at</span>
              <FaChevronRight className="text-gray-400" />
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                 onClick={() => handleSelectField('Updated at')}>
              <span>Updated at</span>
              <FaChevronRight className="text-gray-400" />
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                 onClick={() => handleSelectField('Last position')}>
              <span>Last position</span>
              <FaChevronRight className="text-gray-400" />
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                 onClick={() => handleSelectField('Last active')}>
              <span>Last active</span>
              <FaChevronRight className="text-gray-400" />
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                 onClick={() => handleSelectField('Product Master')}>
              <span>Product Master</span>
              <FaChevronRight className="text-gray-400" />
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                 onClick={() => handleSelectField('Customer Master')}>
              <span>Customer Master</span>
              <FaChevronRight className="text-gray-400" />
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                 onClick={() => handleSelectField('Vendor Master')}>
              <span>Vendor Master</span>
              <FaChevronRight className="text-gray-400" />
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                 onClick={() => handleSelectField('Monitoring Page')}>
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
                 onClick={() => handleSelectLogic('Equal to')}>
              <span>Equal to</span>
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">varchar</span>
              <FaChevronRight className="text-gray-400" />
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-100 cursor-pointer"
              onClick={() => handleSelectLogic('Greater than')}
            >
              <span className="text-blue-500 font-medium">Greater than</span>
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">number only</span>
              <FaChevronRight className="text-blue-500" />
            </div>
            <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                 onClick={() => handleSelectLogic('Less than')}>
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

export default FilterPanel;