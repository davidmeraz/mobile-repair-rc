import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Repairs from './pages/Repairs'
import Customers from './pages/Customers'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import DeviceModels from './pages/DeviceModels'

import { generateMockData } from './data/mockData'

const mockData = generateMockData();

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceModels, setDeviceModels] = useState(mockData.deviceModels);
  const [customers, setCustomers] = useState(mockData.customers);
  const [repairs, setRepairs] = useState(mockData.repairs);
  // sort by ID descending just in case

  const [parts, setParts] = useState(mockData.parts || []);

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard': return <Dashboard onNavigate={setActivePage} repairs={repairs} customers={customers} parts={parts} />;
      case 'Repairs': return <Repairs searchQuery={searchQuery} deviceModels={deviceModels} setDeviceModels={setDeviceModels} customers={customers} setCustomers={setCustomers} repairs={repairs} setRepairs={setRepairs} parts={parts} setParts={setParts} />;
      case 'Customers': return <Customers searchQuery={searchQuery} customers={customers} setCustomers={setCustomers} repairs={repairs} />;
      case 'Device Models': return <DeviceModels searchQuery={searchQuery} models={deviceModels} setModels={setDeviceModels} />;
      case 'Inventory': return <Inventory searchQuery={searchQuery} parts={parts} setParts={setParts} repairs={repairs} setRepairs={setRepairs} customers={customers} />;
      case 'Reports': return <Reports repairs={repairs} parts={parts} />;
      case 'Settings': return <Settings onNavigate={setActivePage} />;
      default: return <Dashboard onNavigate={setActivePage} repairs={repairs} customers={customers} parts={parts} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} onNavigate={(page) => { setActivePage(page); setSearchQuery(''); }} />
      <main className="main-content">
        <Header title={activePage} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        {renderContent()}
      </main>
    </div>
  )
}

export default App
