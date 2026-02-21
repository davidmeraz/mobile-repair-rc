import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Mail,
    Phone,
    Monitor,
    CheckCircle,
    MoreHorizontal,
    Edit3,
    Trash2
} from 'lucide-react';
import Modal from '../components/Modal';

const Customers = ({ searchQuery = '', customers, setCustomers, repairs = [] }) => {
    const [localSearch, setLocalSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editCustomer, setEditCustomer] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [toast, setToast] = useState(null);

    const [form, setForm] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = () => setOpenDropdown(null);
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    const combinedSearch = (searchQuery || localSearch).toLowerCase();

    const filteredCustomers = customers.filter(c => {
        if (!combinedSearch) return true;
        return c.name.toLowerCase().includes(combinedSearch) ||
            c.email.toLowerCase().includes(combinedSearch) ||
            c.phone.includes(combinedSearch);
    });

    const getCustomerRepairs = (customerName) => {
        return repairs.filter(r => r.customer === customerName);
    };

    const getDeviceCount = (customerName) => {
        const devices = new Set(repairs.filter(r => r.customer === customerName).map(r => r.device));
        return devices.size;
    };

    const getLastVisit = (customerName) => {
        const customerRepairs = repairs.filter(r => r.customer === customerName);
        if (customerRepairs.length === 0) return 'No visits';
        return customerRepairs[0].date;
    };

    const openAdd = () => {
        setEditCustomer(null);
        setForm({ name: '', email: '', phone: '' });
        setShowAddModal(true);
    };

    const openEdit = (customer) => {
        setEditCustomer(customer);
        setForm({ name: customer.name, email: customer.email, phone: customer.phone });
        setShowAddModal(true);
        setOpenDropdown(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.phone) return;

        if (editCustomer) {
            setCustomers(prev => prev.map(c =>
                c.id === editCustomer.id
                    ? { ...c, name: form.name, email: form.email, phone: form.phone }
                    : c
            ));
            setToast('Customer updated successfully');
        } else {
            const newCustomer = {
                id: Math.max(...customers.map(c => c.id), 0) + 1,
                name: form.name,
                email: form.email,
                phone: form.phone,
            };
            setCustomers(prev => [newCustomer, ...prev]);
            setToast('Customer added successfully');
        }
        setShowAddModal(false);
    };

    const handleDelete = (id) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
        setOpenDropdown(null);
        setToast('Customer deleted');
    };

    const openHistory = (customer) => {
        setSelectedCustomer(customer);
        setShowHistoryModal(true);
    };

    const getStatusIcon = (status) => {
        let colorClass = '';
        const lower = status?.toLowerCase() || '';
        if (lower === 'completed') colorClass = 'pulse-completed';
        else if (lower === 'in progress') colorClass = 'pulse-in-progress';
        else if (lower === 'stopped') colorClass = 'pulse-stopped';
        else colorClass = 'pulse-stopped';
        return <div className={`pulse-dot ${colorClass}`}></div>;
    };

    return (
        <div className="repairs-view">
            <div className="repairs-header">
                <div className="search-bar" style={{ width: '300px' }}>
                    <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                    />
                </div>

                <button className="btn-primary" onClick={openAdd}>
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
                            <th>Repairs</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                    No customers found
                                </td>
                            </tr>
                        ) : (
                            filteredCustomers.map((customer) => {
                                const repairCount = getCustomerRepairs(customer.name).length;
                                return (
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
                                                <Monitor size={16} style={{ color: 'var(--text-secondary)' }} />
                                                {getDeviceCount(customer.name)}
                                            </div>
                                        </td>
                                        <td>{getLastVisit(customer.name)}</td>
                                        <td>
                                            <span style={{
                                                background: repairCount > 0 ? 'rgba(56, 189, 248, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                                                color: repairCount > 0 ? 'var(--accent)' : 'var(--text-secondary)',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '999px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600
                                            }}>
                                                {repairCount} repair{repairCount !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <button className="btn-ghost" onClick={() => openHistory(customer)}>History</button>
                                                <div className="action-wrapper" onClick={e => e.stopPropagation()}>
                                                    <MoreHorizontal
                                                        size={18}
                                                        className="action-icon"
                                                        onClick={() => setOpenDropdown(openDropdown === customer.id ? null : customer.id)}
                                                    />
                                                    {openDropdown === customer.id && (
                                                        <div className="action-dropdown">
                                                            <button className="action-dropdown-item" onClick={() => openEdit(customer)}>
                                                                <Edit3 size={14} /> Edit
                                                            </button>
                                                            <button className="action-dropdown-item danger" onClick={() => handleDelete(customer.id)}>
                                                                <Trash2 size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add / Edit Customer Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={editCustomer ? 'Edit Customer' : 'Add Customer'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary">{editCustomer ? 'Save Changes' : 'Add Customer'}</button>
                    </div>
                </form>
            </Modal>

            {/* View History Modal */}
            <Modal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} title={`Repair History — ${selectedCustomer?.name || ''}`} width={600}>
                {selectedCustomer && (() => {
                    const history = getCustomerRepairs(selectedCustomer.name);
                    return history.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No repair history found for this customer</p>
                    ) : (
                        <div>
                            {history.map((item, i) => (
                                <div key={i} className="history-item">
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{item.problem}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {item.device} • {item.date}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {getStatusIcon(item.status)}
                                            {item.status}
                                        </div>
                                        <span style={{ fontWeight: 600 }}>{item.cost}</span>
                                    </div>
                                </div>
                            ))}
                            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Total: <strong style={{ color: 'var(--text-primary)' }}>{history.length} repair{history.length !== 1 ? 's' : ''}</strong> •
                                Revenue: <strong style={{ color: 'var(--accent)' }}>${history.reduce((sum, r) => sum + parseFloat(r.cost.replace('$', '')), 0).toFixed(0)}</strong>
                            </div>
                        </div>
                    );
                })()}
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

export default Customers;
