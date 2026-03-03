import React from 'react';
import { Search, Bell, User, Minus, Square, X } from 'lucide-react';

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

                {/* Custom Window Controls */}
                <div className="window-controls">
                    <button
                        className="window-ctrl-btn minimize"
                        onClick={() => window.api?.minimizeWindow()}
                        title="Minimize"
                    >
                        <Minus size={14} strokeWidth={2.5} />
                    </button>
                    <button
                        className="window-ctrl-btn maximize"
                        onClick={() => window.api?.maximizeWindow()}
                        title="Maximize"
                    >
                        <Square size={11} strokeWidth={2.5} />
                    </button>
                    <button
                        className="window-ctrl-btn close"
                        onClick={() => window.api?.closeWindow()}
                        title="Close"
                    >
                        <X size={15} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
