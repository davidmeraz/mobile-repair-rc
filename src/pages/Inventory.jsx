import React, { useState } from 'react';
import {
    Package,
    Search,
    Filter,
    Truck,
    AlertCircle
} from 'lucide-react';

const mockInventory = [
    { id: 101, name: 'iPhone 13 Screen', category: 'Screens', stock: 12, minStock: 5, price: '$85.00' },
    { id: 102, name: 'Samsung S22 Battery', category: 'Batteries', stock: 8, minStock: 10, price: '$35.00' },
    { id: 103, name: 'USB-C Charging Port', category: 'Parts', stock: 25, minStock: 15, price: '$12.50' },
    { id: 104, name: 'Pixel 7 Back Glass', category: 'Housing', stock: 3, minStock: 5, price: '$45.00' },
    { id: 105, name: 'Thermal Paste (5g)', category: 'Consumables', stock: 18, minStock: 10, price: '$8.00' },
];

const Inventory = () => {
    const getStockStatus = (stock, minStock) => {
        if (stock <= minStock) return { label: 'Low Stock', color: 'status-urgent' };
        if (stock <= minStock * 1.5) return { label: 'Moderate', color: 'status-pending' };
        return { label: 'In Stock', color: 'status-completed' };
    };

    return (
        <div className="repairs-view">
            <div className="repairs-header">
                <div className="search-bar" style={{ width: '300px' }}>
                    <Search size={18} className="text-slate-400" />
                    <input type="text" placeholder="Search parts..." />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Filter size={16} /> Filter
                    </button>

                    <button className="btn-primary" style={{
                        background: 'var(--accent)',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}>
                        <Package size={18} />
                        <span>Add Item</span>
                    </button>
                </div>
            </div>

            <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: 'var(--accent)' }}>
                        <Package size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Items</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>2,450</div>
                    </div>
                </div>

                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#ef4444' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Low Stock Alerts</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>12</div>
                    </div>
                </div>

                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
                        <Truck size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Incoming Orders</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>5</div>
                    </div>
                </div>
            </div>

            <div className="repairs-table-container">
                <table className="repairs-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Stock Level</th>
                            <th>Unit Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockInventory.map((item) => {
                            const status = getStockStatus(item.stock, item.minStock);
                            return (
                                <tr key={item.id}>
                                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{item.category}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontWeight: 600, width: '30px' }}>{item.stock}</span>
                                            <span className={`status-badge ${status.color}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ fontFamily: 'monospace' }}>{item.price}</td>
                                    <td>
                                        <button style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>Order More</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
