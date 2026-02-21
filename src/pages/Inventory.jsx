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

const Inventory = ({ searchQuery = '', parts, setParts, repairs = [] }) => {
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
        supplier: '',
        cost: '',
        datePurchased: new Date().toISOString().slice(0, 10),
        notes: ''
    });

    const emptyForm = {
        name: '',
        supplier: '',
        cost: '',
        datePurchased: new Date().toISOString().slice(0, 10),
        notes: ''
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
            (p.supplier || '').toLowerCase().includes(combinedSearch) ||
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
            supplier: part.supplier || '',
            cost: part.cost,
            datePurchased: part.datePurchased || '',
            notes: part.notes || ''
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
                    ? { ...p, name: form.name, supplier: form.supplier, cost: form.cost, datePurchased: form.datePurchased, notes: form.notes }
                    : p
            ));
            setToast('Part updated successfully');
        } else {
            const newPart = {
                id: Date.now(),
                name: form.name,
                supplier: form.supplier,
                cost: form.cost,
                datePurchased: form.datePurchased,
                notes: form.notes,
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
        <div className="repairs-view">
            <div className="repairs-header">
                <div className="search-bar" style={{ width: '300px' }}>
                    <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search parts..."
                        value={localSearch}
                        onChange={e => setLocalSearch(e.target.value)}
                    />
                </div>
                <button className="btn-primary" onClick={openAdd}>
                    <Plus size={18} />
                    <span>Add Part</span>
                </button>
            </div>

            {/* Summary cards */}
            <div className="metrics-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="metric-card" style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Available Parts</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{availableParts.length}</div>
                </div>
                <div className="metric-card" style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Parts Used</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{totalUsed}</div>
                </div>
                <div className="metric-card" style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Spent</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${totalSpent.toLocaleString()}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="filter-tabs" style={{ marginBottom: '1rem' }}>
                <button className={`filter-tab ${activeTab === 'available' ? 'active' : ''}`} onClick={() => setActiveTab('available')}>
                    <ShoppingCart size={15} /> Available ({availableParts.length})
                </button>
                <button className={`filter-tab ${activeTab === 'used' ? 'active' : ''}`} onClick={() => setActiveTab('used')}>
                    <Archive size={15} /> Used History ({usedParts.length})
                </button>
            </div>

            {/* Table */}
            <div className="repairs-table-container">
                <table className="repairs-table">
                    <thead>
                        <tr>
                            <th>Part Name</th>
                            <th>Supplier</th>
                            <th>Cost</th>
                            <th>{activeTab === 'available' ? 'Date Purchased' : 'Date Used'}</th>
                            {activeTab === 'used' && <th>Used For</th>}
                            <th>Notes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredParts.length === 0 ? (
                            <tr>
                                <td colSpan={activeTab === 'used' ? 7 : 6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                    {activeTab === 'available' ? 'No available parts — add a part to get started' : 'No used parts yet'}
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
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{part.supplier || '—'}</td>
                                    <td style={{ fontWeight: 600 }}>${parseFloat(part.cost).toLocaleString()}</td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        {activeTab === 'available' ? formatDate(part.datePurchased) : part.usedDate || '—'}
                                    </td>
                                    {activeTab === 'used' && (
                                        <td>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                <div style={{ fontWeight: 500 }}>{part.usedForCustomer || '—'}</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{part.usedForDevice || ''}</div>
                                            </div>
                                        </td>
                                    )}
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
                        <input className="form-input" placeholder="e.g. iPhone 15 Screen, Galaxy S24 Battery" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Supplier</label>
                            <input className="form-input" placeholder="e.g. Amazon, AliExpress" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Cost ($)</label>
                            <input className="form-input" type="number" step="0.01" min="0" placeholder="0.00" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Date Purchased</label>
                        <input className="form-input" type="date" value={form.datePurchased} onChange={e => setForm({ ...form, datePurchased: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Notes (optional)</label>
                        <input className="form-input" placeholder="e.g. OLED original, compatible model, etc." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
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
