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

  const [parts, setParts] = useState([
    { id: 1, name: 'Pantalla OLED iPhone 13 Pro', category: 'Screen', quantity: 5, price: '$85.00', condition: 'New', location: 'A1' },
    { id: 2, name: 'Batería iPad Air 5', category: 'Battery', quantity: 2, price: '$40.00', condition: 'New', location: 'B3' },
    { id: 3, name: 'Puerto USB-C Xiaomi', category: 'Port', quantity: 15, price: '$8.00', condition: 'New', location: 'C2' },
    { id: 4, name: 'Modulo Cámaras iPhone 13 Pro', category: 'Camera', quantity: 1, price: '$110.00', condition: 'Used', location: 'A2' }
  ]);

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard': return <Dashboard onNavigate={setActivePage} repairs={repairs} customers={customers} parts={parts} />;
      case 'Repairs': return <Repairs searchQuery={searchQuery} deviceModels={deviceModels} setDeviceModels={setDeviceModels} customers={customers} setCustomers={setCustomers} repairs={repairs} setRepairs={setRepairs} parts={parts} setParts={setParts} />;
      case 'Customers': return <Customers searchQuery={searchQuery} customers={customers} setCustomers={setCustomers} repairs={repairs} />;
      case 'Device Models': return <DeviceModels searchQuery={searchQuery} models={deviceModels} setModels={setDeviceModels} />;
      case 'Inventory': return <Inventory searchQuery={searchQuery} parts={parts} setParts={setParts} repairs={repairs} setRepairs={setRepairs} />;
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
