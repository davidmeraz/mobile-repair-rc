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

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceModels, setDeviceModels] = useState([
    { id: 1, brand: 'Apple', model: 'iPhone 13 Pro', type: 'Smartphone' },
    { id: 2, brand: 'Samsung', model: 'Galaxy S23 Ultra', type: 'Smartphone' },
    { id: 3, brand: 'Apple', model: 'iPad Air 5', type: 'Tablet' },
    { id: 4, brand: 'Google', model: 'Pixel 8 Pro', type: 'Smartphone' },
    { id: 5, brand: 'Xiaomi', model: 'Redmi Note 12', type: 'Smartphone' }
  ]);

  const [customers, setCustomers] = useState([
    { id: 1, name: 'David Meraz', phone: '555-0198', email: 'david@example.com', totalRepairs: 2, totalSpent: '$350.00' },
    { id: 2, name: 'Ana Lopez', phone: '555-1234', email: 'ana.l@example.com', totalRepairs: 1, totalSpent: '$120.00' },
    { id: 3, name: 'Carlos Gomez', phone: '555-4321', email: 'carlos.g@example.com', totalRepairs: 3, totalSpent: '$500.00' },
    { id: 4, name: 'Laura Martinez', phone: '555-9876', email: 'laura.m@example.com', totalRepairs: 1, totalSpent: '$80.00' },
    { id: 5, name: 'Roberto Diaz', phone: '555-5678', email: 'roberto.d@example.com', totalRepairs: 1, totalSpent: '$0.00' }
  ]);

  const today = new Date();
  const d1 = new Date(today); d1.setDate(today.getDate() - 5);
  const d2 = new Date(today); d2.setDate(today.getDate() - 4);
  const d3 = new Date(today); d3.setDate(today.getDate() - 2);
  const d4 = new Date(today); d4.setDate(today.getDate() - 1);
  const d5 = new Date(today);

  const [repairs, setRepairs] = useState([
    { id: 7, customer: 'Ana Lopez', device: 'Galaxy S23 Ultra', problem: 'Actualización de Software', status: 'Completed', cost: '$40.00', partsCost: '$0.00', date: d1.toLocaleDateString() },
    { id: 6, customer: 'David Meraz', device: 'iPad Air 5', problem: 'Reemplazo de Batería', status: 'Completed', cost: '$80.00', partsCost: '$40.00', date: d2.toLocaleDateString() },
    { id: 5, customer: 'Carlos Gomez', device: 'Redmi Note 12', problem: 'Cambio de Centro de Carga', status: 'Completed', cost: '$60.00', partsCost: '$20.00', date: d2.toLocaleDateString() },
    { id: 4, customer: 'Carlos Gomez', device: 'Redmi Note 12', problem: 'Mica Cristal Templado', status: 'Completed', cost: '$15.00', partsCost: '$5.00', date: d3.toLocaleDateString() },
    { id: 3, customer: 'Laura Martinez', device: 'Pixel 8 Pro', problem: 'Diagnóstico por agua', status: 'Pending', cost: '$80.00', partsCost: '$0.00', date: d4.toLocaleDateString() },
    { id: 2, customer: 'Carlos Gomez', device: 'iPhone 13 Pro', problem: 'Cambio de Cámaras', status: 'Completed', cost: '$200.00', partsCost: '$110.00', date: d5.toLocaleDateString() },
    { id: 1, customer: 'David Meraz', device: 'iPhone 13 Pro', problem: 'Pantalla OLED Rota', status: 'In Progress', cost: '$600.00', partsCost: '$300.00', date: d5.toLocaleDateString() },
    { id: 8, customer: 'Roberto Diaz', device: 'Galaxy S23 Ultra', problem: 'Recuperar Datos Muertos', status: 'Urgent', cost: '$250.00', partsCost: '$0.00', date: d5.toLocaleDateString() }
  ].sort((a, b) => b.id - a.id)); // sort by ID descending just in case

  const [parts, setParts] = useState([
    { id: 1, name: 'Pantalla OLED iPhone 13 Pro', category: 'Screen', quantity: 5, price: '$85.00', condition: 'New', location: 'A1' },
    { id: 2, name: 'Batería iPad Air 5', category: 'Battery', quantity: 2, price: '$40.00', condition: 'New', location: 'B3' },
    { id: 3, name: 'Puerto USB-C Xiaomi', category: 'Port', quantity: 15, price: '$8.00', condition: 'New', location: 'C2' },
    { id: 4, name: 'Modulo Cámaras iPhone 13 Pro', category: 'Camera', quantity: 1, price: '$110.00', condition: 'Used', location: 'A2' }
  ]);

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard': return <Dashboard onNavigate={setActivePage} repairs={repairs} customers={customers} />;
      case 'Repairs': return <Repairs searchQuery={searchQuery} deviceModels={deviceModels} customers={customers} repairs={repairs} setRepairs={setRepairs} parts={parts} setParts={setParts} />;
      case 'Customers': return <Customers searchQuery={searchQuery} customers={customers} setCustomers={setCustomers} repairs={repairs} />;
      case 'Device Models': return <DeviceModels searchQuery={searchQuery} models={deviceModels} setModels={setDeviceModels} />;
      case 'Inventory': return <Inventory searchQuery={searchQuery} parts={parts} setParts={setParts} repairs={repairs} setRepairs={setRepairs} />;
      case 'Reports': return <Reports repairs={repairs} />;
      case 'Settings': return <Settings onNavigate={setActivePage} />;
      default: return <Dashboard onNavigate={setActivePage} repairs={repairs} customers={customers} />;
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
