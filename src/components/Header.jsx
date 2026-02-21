import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = ({ title, searchQuery, onSearchChange }) => {
    return (
        <header className="top-bar">
            <div className="page-title">
                <h2>{title}</h2>
            </div>

            <div className="header-actions">
                <div className="search-bar">
                    <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        value={searchQuery || ''}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                </div>

                <div className="user-profile">
                    <button className="modal-close-btn">
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
