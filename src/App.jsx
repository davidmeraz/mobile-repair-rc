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

function App() {
  const [activePage, setActivePage] = useState('Dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard': return <Dashboard />;
      case 'Repairs': return <Repairs />;
      case 'Customers': return <Customers />;
      case 'Inventory': return <Inventory />;
      case 'Reports': return <Reports />;
      case 'Settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        <Header title={activePage} />
        {renderContent()}
      </main>
    </div>
  )
}

export default App
