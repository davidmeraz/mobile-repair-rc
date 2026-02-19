import React, { useState } from 'react';
import {
    Users,
    Search,
    Mail,
    Phone,
    Monitor
} from 'lucide-react';

const mockCustomers = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '(555) 123-4567', devices: 3, lastVisit: 'Oct 24, 2024' },
    { id: 2, name: 'Alice Smith', email: 'alice.s@example.com', phone: '(555) 987-6543', devices: 1, lastVisit: 'Oct 23, 2024' },
    { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com', phone: '(555) 456-7890', devices: 2, lastVisit: 'Oct 22, 2024' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', phone: '(555) 789-0123', devices: 1, lastVisit: 'Oct 21, 2024' },
    { id: 5, name: 'Michael Wilson', email: 'michael.w@example.com', phone: '(555) 321-6547', devices: 5, lastVisit: 'Oct 20, 2024' },
];

const Customers = () => {
    return (
        <div className="repairs-view">
            <div className="repairs-header">
                <div className="search-bar" style={{ width: '300px' }}>
                    <Search size={18} className="text-slate-400" />
                    <input type="text" placeholder="Search customers..." />
                </div>

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
                    <Users size={18} />
                    <span>Add Customer</span>
                </button>
            </div>

            <div className="repairs-table-container">
                <table className="repairs-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact Info</th>
                            <th>Devices</th>
                            <th>Last Visit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockCustomers.map((customer) => (
                            <tr key={customer.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.8rem', background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                                            {customer.name.charAt(0)}
                                        </div>
                                        <span style={{ fontWeight: 500 }}>{customer.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                            <Mail size={14} /> {customer.email}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                            <Phone size={14} /> {customer.phone}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Monitor size={16} className="text-slate-400" />
                                        {customer.devices}
                                    </div>
                                </td>
                                <td>{customer.lastVisit}</td>
                                <td>
                                    <button style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>View History</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;
