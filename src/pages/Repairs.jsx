import React, { useState } from 'react';
import {
    Plus,
    Filter,
    Search,
    MoreHorizontal,
    CheckCircle,
    Clock,
    AlertTriangle
} from 'lucide-react';

const mockRepairs = [
    { id: '#R-1024', customer: 'John Doe', device: 'iPhone 14 Pro', problem: 'Cracked Screen', status: 'In Progress', date: 'Oct 24, 2024', cost: '$320' },
    { id: '#R-1023', customer: 'Alice Smith', device: 'Samsung S23', problem: 'Battery Drain', status: 'Pending', date: 'Oct 23, 2024', cost: '$85' },
    { id: '#R-1022', customer: 'Robert Johnson', device: 'MacBook Air M1', problem: 'Water Damage', status: 'Completed', date: 'Oct 22, 2024', cost: '$150' },
    { id: '#R-1021', customer: 'Emily Davis', device: 'iPad Pro 11"', problem: 'Charging Port', status: 'In Progress', date: 'Oct 21, 2024', cost: '$120' },
    { id: '#R-1020', customer: 'Michael Wilson', device: 'Pixel 7', problem: 'Software Issue', status: 'Completed', date: 'Oct 20, 2024', cost: '$45' },
];

const Repairs = () => {
    const [filter, setFilter] = useState('All');

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle size={16} className="text-emerald-500" />;
            case 'In Progress': return <Clock size={16} className="text-amber-500" />;
            case 'Pending': return <AlertTriangle size={16} className="text-slate-400" />;
            default: return null;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'status-completed';
            case 'In Progress': return 'status-pending'; // Reusing pending style for in-progress distinct color if needed
            case 'Pending': return 'status-urgent'; // Using urgent for pending as placeholder
            default: return '';
        }
    };

    return (
        <div className="repairs-view">
            <div className="repairs-header">
                <div className="repairs-controls">
                    <button className={`filter-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
                    <button className={`filter-btn ${filter === 'Active' ? 'active' : ''}`} onClick={() => setFilter('Active')}>Active</button>
                    <button className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`} onClick={() => setFilter('Completed')}>Completed</button>
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
                    <Plus size={18} />
                    <span>New Repair</span>
                </button>
            </div>

            <div className="repairs-table-container">
                <table className="repairs-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Device</th>
                            <th>Problem</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockRepairs.map((repair) => (
                            <tr key={repair.id}>
                                <td style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{repair.id}</td>
                                <td>{repair.customer}</td>
                                <td>{repair.device}</td>
                                <td>{repair.problem}</td>
                                <td>
                                    <div className={`status-badge ${getStatusClass(repair.status)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}>
                                        {getStatusIcon(repair.status)}
                                        {repair.status}
                                    </div>
                                </td>
                                <td>{repair.date}</td>
                                <td style={{ fontWeight: 600 }}>{repair.cost}</td>
                                <td>
                                    <MoreHorizontal size={18} className="action-icon" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Repairs;
