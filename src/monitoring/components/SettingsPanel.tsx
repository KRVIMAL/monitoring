// src/monitoring/components/SettingsPanel.tsx
import React, { useState } from 'react';
import { FaTimes, FaChevronRight, FaCheck } from 'react-icons/fa';

interface SettingsPanelProps {
  onClose: () => void;
  onApplySettings: (settings: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, onApplySettings }) => {
  const [showFieldsList, setShowFieldsList] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'Device type',
    'Remaining Battery',
    'Last active',
    'IMEI'
  ]);

  // Toggle fields selection panel
  const toggleFieldsList = () => {
    setShowFieldsList(!showFieldsList);
  };

  // Toggle a field selection
  const toggleFieldSelection = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  // Apply settings
  const handleApplySettings = () => {
    onApplySettings({
      selectedFields
    });
    onClose();
  };

  return (
    <div className="relative">
      {/* Main Settings Panel */}
      <div className="w-[285px] bg-white rounded-[14px] shadow-lg z-50">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="font-medium">Settings</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full w-6 h-6 flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visible Columns
            </label>
            <div 
              className="w-[261px] h-[38px] px-3 py-2 border border-gray-300 rounded-[10px] text-sm flex justify-between items-center cursor-pointer"
              onClick={toggleFieldsList}
            >
              <span>Select fields to display</span>
              <FaChevronRight className="text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Map Style
            </label>
            <select className="w-[261px] h-[38px] px-3 py-2 border border-gray-300 rounded-[10px] text-sm">
              <option>Standard</option>
              <option>Satellite</option>
              <option>Terrain</option>
              <option>Dark</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto Refresh
            </label>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">30 seconds</button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm">1 minute</button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm">5 minutes</button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notifications
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="notify-alerts" className="mr-2" checked />
                <label htmlFor="notify-alerts" className="text-sm">Alert Notifications</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="notify-status" className="mr-2" checked />
                <label htmlFor="notify-status" className="text-sm">Status Updates</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="notify-battery" className="mr-2" />
                <label htmlFor="notify-battery" className="text-sm">Battery Warnings</label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4">
            <button 
              onClick={handleApplySettings}
              className="w-[77px] h-[33px] bg-blue-500 text-white rounded-[10px] text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Fields Selection Panel */}
      {showFieldsList && (
        <div className="absolute top-0 right-[-358px] w-[358px] h-[711px] bg-white rounded-[14px] shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium">Select Fields</h3>
          </div>

          <div className="overflow-y-auto max-h-[650px]">
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFieldSelection('Device type')}
            >
              <span>Device type</span>
              {selectedFields.includes('Device type') && <FaCheck className="text-green-500" />}
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFieldSelection('Remaining Battery')}
            >
              <span>Remaining Battery</span>
              {selectedFields.includes('Remaining Battery') && <FaCheck className="text-green-500" />}
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFieldSelection('Lat')}
            >
              <span>Lat</span>
              {selectedFields.includes('Lat') && <FaCheck className="text-green-500" />}
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFieldSelection('Long')}
            >
              <span>Long</span>
              {selectedFields.includes('Long') && <FaCheck className="text-green-500" />}
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFieldSelection('Created at')}
            >
              <span>Created at</span>
              {selectedFields.includes('Created at') && <FaCheck className="text-green-500" />}
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFieldSelection('Updated at')}
            >
              <span>Updated at</span>
              {selectedFields.includes('Updated at') && <FaCheck className="text-green-500" />}
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFieldSelection('Last position')}
            >
              <span>Last position</span>
              {selectedFields.includes('Last position') && <FaCheck className="text-green-500" />}
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFieldSelection('Last active')}
            >
              <span>Last active</span>
              {selectedFields.includes('Last active') && <FaCheck className="text-green-500" />}
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFieldSelection('IMEI')}
            >
              <span>IMEI</span>
              {selectedFields.includes('IMEI') && <FaCheck className="text-green-500" />}
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFieldSelection('Device Status')}
            >
              <span>Device Status</span>
              {selectedFields.includes('Device Status') && <FaCheck className="text-green-500" />}
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFieldSelection('Signal Strength')}
            >
              <span>Signal Strength</span>
              {selectedFields.includes('Signal Strength') && <FaCheck className="text-green-500" />}
            </div>
            <div 
              className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFieldSelection('Model Number')}
            >
              <span>Model Number</span>
              {selectedFields.includes('Model Number') && <FaCheck className="text-green-500" />}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-end">
            <button 
              onClick={() => setShowFieldsList(false)}
              className="w-[77px] h-[33px] bg-blue-500 text-white rounded-[10px] text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;