import { useState, useEffect } from 'react'
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

  const [isLoaded, setIsLoaded] = useState(false);
  const [deviceModels, setDeviceModels] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [parts, setParts] = useState([]);

  useEffect(() => {
    const loadDB = async () => {
      try {
        if (window.api && window.api.readData) {
          const data = await window.api.readData();
          setDeviceModels(data.deviceModels || []);
          setCustomers(data.customers || []);
          setRepairs(data.repairs || []);
          setParts(data.parts || []);
        } else {
          console.warn("Electron API no está disponible. Usando datos vacíos (navegador puro).");
        }
      } catch (err) {
        console.error("Error al cargar la BD:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadDB();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const saveDB = async () => {
      try {
        if (window.api && window.api.writeData) {
          await window.api.writeData({
            deviceModels,
            customers,
            repairs,
            parts
          });
        }
      } catch (e) {
        console.error("Error al guardar la BD:", e);
      }
    };
    saveDB();
  }, [deviceModels, customers, repairs, parts, isLoaded]);

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard': return <Dashboard onNavigate={setActivePage} repairs={repairs} customers={customers} parts={parts} />;
      case 'Repairs': return <Repairs searchQuery={searchQuery} deviceModels={deviceModels} setDeviceModels={setDeviceModels} customers={customers} setCustomers={setCustomers} repairs={repairs} setRepairs={setRepairs} parts={parts} setParts={setParts} />;
      case 'Customers': return <Customers searchQuery={searchQuery} customers={customers} setCustomers={setCustomers} repairs={repairs} />;
      case 'Device Models': return <DeviceModels searchQuery={searchQuery} models={deviceModels} setModels={setDeviceModels} />;
      case 'Inventory': return <Inventory searchQuery={searchQuery} parts={parts} setParts={setParts} repairs={repairs} setRepairs={setRepairs} customers={customers} />;
      case 'Reports': return <Reports repairs={repairs} parts={parts} />;
      case 'Settings': return <Settings onNavigate={setActivePage} deviceModels={deviceModels} setDeviceModels={setDeviceModels} customers={customers} setCustomers={setCustomers} repairs={repairs} setRepairs={setRepairs} parts={parts} setParts={setParts} />;
      default: return <Dashboard onNavigate={setActivePage} repairs={repairs} customers={customers} parts={parts} />;
    }
  };

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-main)', color: 'white', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Cargando base de datos...</p>
        <style>
          {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

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
