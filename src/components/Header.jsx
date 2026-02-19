import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = ({ title }) => {
    return (
        <header className="top-bar">
            <div className="page-title">
                <h2>{title}</h2>
            </div>

            <div className="header-actions">
                <div className="search-bar">
                    <Search size={18} className="text-slate-400" />
                    <input type="text" placeholder="Search invoices, clients..." />
                </div>

                <div className="user-profile">
                    <button style={{
                        background: 'none',
                        border: 'none',
                        padding: 8,
                        cursor: 'pointer',
                        color: 'var(--text-secondary)'
                    }}>
                        <Bell size={20} />
                    </button>

                    <div className="avatar">
                        <span>JD</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
