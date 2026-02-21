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

const Inventory = ({ searchQuery = '', parts, setParts, repairs = [], setRepairs }) => {
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
        <div className="repairs-view">
            <div className="repairs-header">
                <div className="search-bar" style={{ width: '300px' }}>
                    <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
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
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: 'var(--accent)' }}>
                        <ShoppingCart size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Available Parts</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{availableParts.length}</div>
                    </div>
                </div>
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Parts Used</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalUsed}</div>
                    </div>
                </div>
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#ef4444' }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Spent</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="filter-tabs" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', padding: '0.25rem', background: 'var(--bg-card)', borderRadius: '12px', width: 'fit-content' }}>
                <button
                    className={`filter-tab ${activeTab === 'available' ? 'active' : ''}`}
                    onClick={() => setActiveTab('available')}
                    style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'available' ? 'rgba(56, 189, 248, 0.1)' : 'transparent', color: activeTab === 'available' ? 'var(--accent)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: activeTab === 'available' ? 600 : 500 }}
                >
                    <ShoppingCart size={16} /> Available ({availableParts.length})
                </button>
                <button
                    className={`filter-tab ${activeTab === 'used' ? 'active' : ''}`}
                    onClick={() => setActiveTab('used')}
                    style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'used' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === 'used' ? '#10b981' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: activeTab === 'used' ? 600 : 500 }}
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
                                <td colSpan={activeTab === 'used' ? 7 : 6} style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
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
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: part.supplier ? 'var(--accent)' : 'transparent' }} />
                                            {part.supplier || 'Unknown Supplier'}
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
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        {activeTab === 'available' ? formatDate(part.datePurchased) : part.usedDate || '—'}
                                    </td>
                                    {activeTab === 'used' && (
                                        <td>
                                            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                {part.usedForCustomer ? (
                                                    <span style={{ fontWeight: 500, color: 'var(--accent)', background: 'rgba(56, 189, 248, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px', display: 'inline-block', width: 'fit-content' }}>
                                                        {part.usedForCustomer}
                                                    </span>
                                                ) : <span style={{ color: 'var(--text-secondary)' }}>—</span>}
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', paddingLeft: '0.2rem' }}>{part.usedForDevice || ''}</div>
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
                        <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Supplier</label>
                            <input className="form-input" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Cost ($)</label>
                            <input className="form-input" type="number" step="0.01" min="0" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Date Purchased</label>
                        <input className="form-input" type="date" value={form.datePurchased} onChange={e => setForm({ ...form, datePurchased: e.target.value })} />
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
