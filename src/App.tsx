// App.tsx
import React, { useState } from 'react';
import Header from './monitoring/components/Header';
import MapComponent from './monitoring/components/MapComponent';
import HeaderIcons from './monitoring/components/HeaderIcons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Devices');

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Helper function to determine active device types based on tab
  const getActiveDeviceTypes = (activeTab: string): string[] => {
    switch (activeTab) {
      case 'All Devices':
        return ['lock', 'vehicle', 'gps', 'device'];
      case 'Vehicle':
        return ['vehicle'];
      case 'Lock':
        return ['lock'];
      case 'GPS':
        return ['gps'];
      default:
        return ['lock', 'vehicle', 'gps', 'device'];
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <Header activeTab={activeTab} onTabChange={handleTabChange} />
        <HeaderIcons />
      </div>
      <MapComponent activeDeviceTypes={getActiveDeviceTypes(activeTab)} />
    </div>
  );
};

export default App;