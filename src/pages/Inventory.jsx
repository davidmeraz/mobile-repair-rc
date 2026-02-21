import React, { useState, useEffect } from 'react';
import {
    Package,
    Search,
    Plus,
    CheckCircle,
    MoreHorizontal,
    Edit3,
    Trash2,
    Archive,
    ShoppingCart,
    DollarSign
} from 'lucide-react';
import Modal from '../components/Modal';

const Inventory = ({ searchQuery = '', parts, setParts, repairs = [], setRepairs, customers = [] }) => {
    const [localSearch, setLocalSearch] = useState('');
    const [activeTab, setActiveTab] = useState('available');
    const [showModal, setShowModal] = useState(false);
    const [editPart, setEditPart] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showUseModal, setShowUseModal] = useState(false);
    const [partToUse, setPartToUse] = useState(null);
    const [useRepairId, setUseRepairId] = useState('');
    const [toast, setToast] = useState(null);

    const [form, setForm] = useState({
        name: '',
        cost: '',
        datePurchased: new Date().toISOString().slice(0, 10),
        notes: '',
        assignedCustomer: '',
        paymentStatus: 'Shop Paid'
    });

    const emptyForm = {
        name: '',
        cost: '',
        datePurchased: new Date().toISOString().slice(0, 10),
        notes: '',
        assignedCustomer: '',
        paymentStatus: 'Shop Paid'
    };

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    useEffect(() => {
        const handler = () => setOpenDropdown(null);
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    const combinedSearch = (searchQuery || localSearch).toLowerCase();

    const availableParts = parts.filter(p => !p.used);
    const usedParts = parts.filter(p => p.used);

    const filteredParts = (activeTab === 'available' ? availableParts : usedParts).filter(p => {
        if (!combinedSearch) return true;
        return p.name.toLowerCase().includes(combinedSearch) ||
            (p.assignedCustomer || '').toLowerCase().includes(combinedSearch) ||
            (p.usedForCustomer || '').toLowerCase().includes(combinedSearch);
    });

    const totalSpent = parts.reduce((sum, p) => sum + parseFloat(p.cost || 0), 0);
    const totalUsed = usedParts.length;

    const openAdd = () => {
        setEditPart(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (part) => {
        setEditPart(part);
        setForm({
            name: part.name,
            cost: part.cost,
            datePurchased: part.datePurchased || '',
            notes: part.notes || '',
            assignedCustomer: part.assignedCustomer || '',
            paymentStatus: part.paymentStatus || 'Shop Paid'
        });
        setShowModal(true);
        setOpenDropdown(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.cost) return;

        if (editPart) {
            setParts(prev => prev.map(p =>
                p.id === editPart.id
                    ? { ...p, name: form.name, cost: form.cost, datePurchased: form.datePurchased, notes: form.notes, assignedCustomer: form.assignedCustomer, paymentStatus: form.paymentStatus }
                    : p
            ));
            setToast('Part updated successfully');
        } else {
            const newPart = {
                id: Date.now(),
                name: form.name,
                cost: form.cost,
                datePurchased: form.datePurchased,
                notes: form.notes,
                assignedCustomer: form.assignedCustomer,
                paymentStatus: form.paymentStatus,
                used: false,
                usedDate: null,
                usedForRepairId: null,
                usedForCustomer: null,
                usedForDevice: null
            };
            setParts(prev => [newPart, ...prev]);
            setToast('Part added successfully');
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setParts(prev => prev.filter(p => p.id !== id));
        setOpenDropdown(null);
        setToast('Part deleted');
    };

    const openUseDialog = (part) => {
        setPartToUse(part);
        setUseRepairId('');
        setShowUseModal(true);
        setOpenDropdown(null);
    };

    const handleMarkUsed = (e) => {
        e.preventDefault();
        if (!partToUse) return;

        const repair = repairs.find(r => String(r.id) === String(useRepairId));
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        if (repair) {
            setRepairs(prev => prev.map(r =>
                r.id === repair.id
                    ? { ...r, usedPartsIds: [...(r.usedPartsIds || []), partToUse.id] }
                    : r
            ));
        }

        setParts(prev => prev.map(p =>
            p.id === partToUse.id
                ? {
                    ...p,
                    used: true,
                    usedDate: dateStr,
                    usedForRepairId: repair ? repair.id : null,
                    usedForCustomer: repair ? repair.customer : 'Manual',
                    usedForDevice: repair ? repair.device : ''
                }
                : p
        ));
        setShowUseModal(false);
        setToast('Part marked as used');
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try {
            const d = new Date(dateStr + 'T00:00:00');
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="repairs-view" style={{ overflowY: 'auto', paddingBottom: '2rem' }}>
            <style>
                {`
                .anim-header {
                    animation: fadeDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                .anim-card {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: popUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                
                .anim-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    border-color: rgba(255,255,255,0.1);
                }

                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-15px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes popUp {
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>

            <div className="repairs-header anim-header" style={{ marginBottom: '2.5rem', background: 'transparent' }}>
                <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Package size={28} style={{ color: '#8b5cf6' }} />
                        Stock Management
                    </h2>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="search-bar" style={{ width: '280px', margin: 0 }}>
                        <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            value={localSearch}
                            onChange={e => setLocalSearch(e.target.value)}
                            placeholder="Search parts by name or supplier..."
                        />
                    </div>
                    <button className="btn-primary" onClick={openAdd} style={{ padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '12px' }}>
                        <Plus size={18} />
                        <span style={{ fontWeight: 600 }}>Add Part</span>
                    </button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="metrics-grid" style={{ marginBottom: '2.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div className="metric-card anim-card" style={{ animationDelay: '0.1s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.05))', borderRadius: '12px', color: '#38bdf8', boxShadow: 'inset 0 0 0 1px rgba(56, 189, 248, 0.2)' }}>
                        <ShoppingCart size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Available Parts</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{availableParts.length}</div>
                    </div>
                </div>

                <div className="metric-card anim-card" style={{ animationDelay: '0.15s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))', borderRadius: '12px', color: '#10b981', boxShadow: 'inset 0 0 0 1px rgba(16, 185, 129, 0.2)' }}>
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Parts Used</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{totalUsed}</div>
                    </div>
                </div>

                <div className="metric-card anim-card" style={{ animationDelay: '0.2s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))', borderRadius: '12px', color: '#ef4444', boxShadow: 'inset 0 0 0 1px rgba(239, 68, 68, 0.2)' }}>
                        <DollarSign size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Spent</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="filter-tabs" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', padding: '0.25rem', background: 'var(--bg-card)', borderRadius: '12px', width: 'fit-content' }}>
                <button
                    className={`filter-tab ${activeTab === 'available' ? 'active' : ''}`}
                    onClick={() => setActiveTab('available')}
                    style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'available' ? 'rgba(56, 189, 248, 0.1)' : 'transparent', color: activeTab === 'available' ? 'var(--accent)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: activeTab === 'available' ? 600 : 500, whiteSpace: 'nowrap' }}
                >
                    <ShoppingCart size={16} /> Available ({availableParts.length})
                </button>
                <button
                    className={`filter-tab ${activeTab === 'used' ? 'active' : ''}`}
                    onClick={() => setActiveTab('used')}
                    style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'used' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === 'used' ? '#10b981' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: activeTab === 'used' ? 600 : 500, whiteSpace: 'nowrap' }}
                >
                    <Archive size={16} /> Used History ({usedParts.length})
                </button>
            </div>

            {/* Table */}
            <div className="repairs-table-container">
                <table className="repairs-table">
                    <thead>
                        <tr>
                            <th>Part Name</th>
                            <th>Cost</th>
                            <th>{activeTab === 'available' ? 'Date Purchased' : 'Date Used'}</th>
                            <th>{activeTab === 'available' ? 'Assigned To' : 'Used For'}</th>
                            <th>Notes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredParts.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        {activeTab === 'available' ? <Package size={32} style={{ opacity: 0.5 }} /> : <Archive size={32} style={{ opacity: 0.5 }} />}
                                        <p style={{ marginTop: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>
                                            {activeTab === 'available' ? 'No available parts found' : 'No used parts history'}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                            {activeTab === 'available' ? 'Add new parts to your inventory to start tracking.' : 'When you mark a part as used in a repair, it will appear here.'}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredParts.map(part => (
                                <tr key={part.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ padding: '0.5rem', background: part.used ? 'rgba(16, 185, 129, 0.08)' : 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', color: part.used ? '#10b981' : 'var(--accent)' }}>
                                                <Package size={16} />
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{part.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            background: activeTab === 'available' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: activeTab === 'available' ? 'var(--accent)' : '#10b981',
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            fontFamily: 'monospace'
                                        }}>
                                            ${parseFloat(part.cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        <div style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: part.paymentStatus === 'Customer Deposit' ? '#10b981' : 'var(--text-secondary)', fontWeight: part.paymentStatus === 'Customer Deposit' ? 600 : 400 }}>
                                            {part.paymentStatus === 'Customer Deposit' ? 'Paid by Customer' : 'Shop Paid'}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        {activeTab === 'available' ? formatDate(part.datePurchased) : part.usedDate || '—'}
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            {(activeTab === 'used' ? part.usedForCustomer : part.assignedCustomer) ? (
                                                <span style={{ fontWeight: 500, color: 'var(--accent)', background: 'rgba(56, 189, 248, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px', display: 'inline-block', width: 'fit-content' }}>
                                                    {activeTab === 'used' ? part.usedForCustomer : part.assignedCustomer}
                                                </span>
                                            ) : <span style={{ color: 'var(--text-secondary)' }}>—</span>}
                                            {activeTab === 'used' && part.usedForDevice && <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', paddingLeft: '0.2rem' }}>{part.usedForDevice}</div>}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '160px' }}>{part.notes || '—'}</td>
                                    <td>
                                        <div className="action-wrapper" onClick={e => e.stopPropagation()}>
                                            <MoreHorizontal
                                                size={18}
                                                className="action-icon"
                                                onClick={() => setOpenDropdown(openDropdown === part.id ? null : part.id)}
                                            />
                                            {openDropdown === part.id && (
                                                <div className="action-dropdown">
                                                    {!part.used && (
                                                        <button className="action-dropdown-item" onClick={() => openUseDialog(part)}>
                                                            <CheckCircle size={14} /> Mark as Used
                                                        </button>
                                                    )}
                                                    <button className="action-dropdown-item" onClick={() => openEdit(part)}>
                                                        <Edit3 size={14} /> Edit
                                                    </button>
                                                    <button className="action-dropdown-item danger" onClick={() => handleDelete(part.id)}>
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

            {/* Add / Edit Part Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editPart ? 'Edit Part' : 'Add Part'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Part Name</label>
                        <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Cost ($)</label>
                        <input className="form-input" type="number" step="0.01" min="0" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Date Purchased</label>
                        <input className="form-input" type="date" value={form.datePurchased} onChange={e => setForm({ ...form, datePurchased: e.target.value })} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Assign to Customer (optional)</label>
                            <select className="form-select" value={form.assignedCustomer} onChange={e => setForm({ ...form, assignedCustomer: e.target.value })}>
                                <option value="">— Unassigned —</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Payment Source</label>
                            <select className="form-select" value={form.paymentStatus} onChange={e => setForm({ ...form, paymentStatus: e.target.value })}>
                                <option value="Shop Paid">Paid by Shop</option>
                                <option value="Customer Deposit">Customer Paid / Deposit (Anticipo)</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Notes (optional)</label>
                        <input className="form-input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary">{editPart ? 'Save Changes' : 'Add Part'}</button>
                    </div>
                </form>
            </Modal>

            {/* Mark as Used Modal */}
            <Modal isOpen={showUseModal} onClose={() => setShowUseModal(false)} title="Mark Part as Used">
                <form onSubmit={handleMarkUsed}>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        Mark <strong style={{ color: 'var(--text-primary)' }}>{partToUse?.name}</strong> as used.
                        Optionally link it to an existing repair:
                    </p>
                    <div className="form-group">
                        <label>Link to Repair (optional)</label>
                        {repairs.length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No repairs available to link</p>
                        ) : (
                            <select className="form-select" value={useRepairId} onChange={e => setUseRepairId(e.target.value)}>
                                <option value="">— No repair linked —</option>
                                {repairs.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.customer} — {r.device} ({r.problem})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setShowUseModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary">Mark as Used</button>
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

export default Inventory;
