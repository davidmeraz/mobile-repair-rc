import React, { useState } from 'react';
import {
    LayoutDashboard,
    PenTool,
    Users,
    Package,
    Settings,
    Smartphone,
    PieChart
} from 'lucide-react';

const Sidebar = ({ activePage, onNavigate }) => {
    //   const [activeItem, setActiveItem] = useState('Dashboard');

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Repairs', icon: PenTool },
        { name: 'Customers', icon: Users },
        { name: 'Device Models', icon: Smartphone },
        { name: 'Inventory', icon: Package },
        { name: 'Reports', icon: PieChart },
        { name: 'Settings', icon: Settings }
    ];

    return (
        <aside className="sidebar">
            <div className="logo-container">
                <div className="logo-icon">
                    <Smartphone size={20} />
                </div>
                <span className="app-title">Mobile Repair RC</span>
            </div>

            <nav className="nav-menu">
                {menuItems.map((item) => (
                    <div
                        key={item.name}
                        className={`nav-item ${activePage === item.name ? 'active' : ''}`}
                        onClick={() => onNavigate(item.name)}
                    >
                        <item.icon />
                        <span>{item.name}</span>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
