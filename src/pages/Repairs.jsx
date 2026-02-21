import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    MoreHorizontal,
    CheckCircle,
    Clock,
    AlertTriangle,
    Edit3,
    Trash2
} from 'lucide-react';
import Modal from '../components/Modal';

const Repairs = ({ searchQuery = '', deviceModels = [], customers = [], repairs, setRepairs }) => {
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editRepair, setEditRepair] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [toast, setToast] = useState(null);
    const dropdownRef = useRef(null);

    const [form, setForm] = useState({ customer: '', device: '', problem: '', status: 'Pending', cost: '' });

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Auto-hide toast
    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    const showToast = (message) => setToast(message);

    const filteredRepairs = repairs
        .filter(r => {
            if (filter === 'Active') return r.status !== 'Completed';
            if (filter === 'Completed') return r.status === 'Completed';
            return true;
        })
        .filter(r => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return r.customer.toLowerCase().includes(q) ||
                r.device.toLowerCase().includes(q) ||
                r.problem.toLowerCase().includes(q) ||
                r.id.toLowerCase().includes(q);
        });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle size={16} style={{ color: '#10b981' }} />;
            case 'In Progress': return <Clock size={16} style={{ color: '#facc15' }} />;
            case 'Pending': return <AlertTriangle size={16} style={{ color: '#94a3b8' }} />;
            default: return null;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'status-completed';
            case 'In Progress': return 'status-in-progress';
            case 'Pending': return 'status-pending';
            default: return '';
        }
    };

    const nextId = () => {
        const nums = repairs.map(r => parseInt(r.id.replace('#R-', '')));
        return `#R-${Math.max(...nums) + 1}`;
    };

    const openAddModal = () => {
        setEditRepair(null);
        setForm({ customer: '', device: '', problem: '', status: 'Pending', cost: '' });
        setShowModal(true);
    };

    const openEditModal = (repair) => {
        setEditRepair(repair);
        setForm({
            customer: repair.customer,
            device: repair.device,
            problem: repair.problem,
            status: repair.status,
            cost: repair.cost.replace('$', '')
        });
        setShowModal(true);
        setOpenDropdown(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.customer || !form.device || !form.problem || !form.cost) return;

        if (editRepair) {
            setRepairs(prev => prev.map(r =>
                r.id === editRepair.id
                    ? { ...r, customer: form.customer, device: form.device, problem: form.problem, status: form.status, cost: `$${form.cost}` }
                    : r
            ));
            showToast('Repair updated successfully');
        } else {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const newRepair = {
                id: nextId(),
                customer: form.customer,
                device: form.device,
                problem: form.problem,
                status: form.status,
                date: dateStr,
                cost: `$${form.cost}`
            };
            setRepairs(prev => [newRepair, ...prev]);
            showToast('New repair added successfully');
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setRepairs(prev => prev.filter(r => r.id !== id));
        setOpenDropdown(null);
        showToast('Repair deleted');
    };

    return (
        <div className="repairs-view">
            <div className="repairs-header">
                <div className="repairs-controls">
                    {['All', 'Active', 'Completed'].map(f => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <button className="btn-primary" onClick={openAddModal}>
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
                        {filteredRepairs.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                    No repairs found
                                </td>
                            </tr>
                        ) : (
                            filteredRepairs.map((repair) => (
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
                                        <div className="action-wrapper" ref={openDropdown === repair.id ? dropdownRef : null}>
                                            <MoreHorizontal
                                                size={18}
                                                className="action-icon"
                                                onClick={() => setOpenDropdown(openDropdown === repair.id ? null : repair.id)}
                                            />
                                            {openDropdown === repair.id && (
                                                <div className="action-dropdown">
                                                    <button className="action-dropdown-item" onClick={() => openEditModal(repair)}>
                                                        <Edit3 size={14} /> Edit
                                                    </button>
                                                    <button className="action-dropdown-item danger" onClick={() => handleDelete(repair.id)}>
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editRepair ? 'Edit Repair' : 'New Repair'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Customer</label>
                        {customers.length > 0 ? (
                            <select
                                className="form-select"
                                value={form.customer}
                                onChange={(e) => setForm({ ...form, customer: e.target.value })}
                                required
                            >
                                <option value="">— Select a customer —</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        ) : (
                            <input className="form-input" placeholder="e.g. John Doe" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} required />
                        )}
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Device</label>
                            {deviceModels.length > 0 ? (
                                <select
                                    className="form-select"
                                    value={form.device}
                                    onChange={(e) => setForm({ ...form, device: e.target.value })}
                                    required
                                >
                                    <option value="">— Select a device —</option>
                                    {Object.entries(
                                        deviceModels.reduce((groups, m) => {
                                            if (!groups[m.brand]) groups[m.brand] = [];
                                            groups[m.brand].push(m);
                                            return groups;
                                        }, {})
                                    ).map(([brand, items]) => (
                                        <optgroup key={brand} label={brand}>
                                            {items.map(m => (
                                                <option key={m.id} value={`${m.brand} ${m.model}`}>
                                                    {m.model} ({m.year})
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            ) : (
                                <input className="form-input" placeholder="e.g. iPhone 14 Pro" value={form.device} onChange={(e) => setForm({ ...form, device: e.target.value })} required />
                            )}
                        </div>
                        <div className="form-group">
                            <label>Cost ($)</label>
                            <input className="form-input" type="number" placeholder="e.g. 120" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Problem</label>
                        <input className="form-input" placeholder="e.g. Cracked Screen" value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary">{editRepair ? 'Save Changes' : 'Add Repair'}</button>
                    </div>
                </form>
            </Modal>

            {toast && (
                <div className="toast toast-success">
                    <CheckCircle size={18} style={{ color: '#10b981' }} />
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Repairs;
