import React, { useState, useEffect } from 'react';
import {
    Smartphone,
    Search,
    Plus,
    Edit3,
    Trash2,
    MoreHorizontal,
    CheckCircle,
    ChevronDown
} from 'lucide-react';
import Modal from '../components/Modal';

const BRANDS = ['All', 'Apple', 'Samsung', 'Google', 'Xiaomi', 'OnePlus', 'Motorola', 'Other'];


const DIFFICULTY_CLASS = {
    'Low': 'status-completed',
    'Medium': 'status-pending',
    'High': 'status-urgent',
};

const emptyForm = { brand: 'Apple', model: '', modelNumber: '', year: new Date().getFullYear(), screen: '', repairDifficulty: 'Medium' };

const DeviceModels = ({ searchQuery = '', models, setModels }) => {
    const [localSearch, setLocalSearch] = useState('');
    const [brandFilter, setBrandFilter] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editModel, setEditModel] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [toast, setToast] = useState(null);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = () => {
            setShowFilterDropdown(false);
            setOpenDropdown(null);
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    const combinedSearch = (searchQuery || localSearch).toLowerCase();

    const filtered = models
        .filter(m => brandFilter === 'All' || m.brand === brandFilter)
        .filter(m => {
            if (!combinedSearch) return true;
            return (
                m.model.toLowerCase().includes(combinedSearch) ||
                m.brand.toLowerCase().includes(combinedSearch)
            );
        });

    const openAdd = (e) => {
        e.stopPropagation();
        setEditModel(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (m) => {
        setEditModel(m);
        setForm({ brand: m.brand, model: m.model, modelNumber: m.modelNumber || '', year: m.year, screen: m.screen, repairDifficulty: m.repairDifficulty });
        setShowModal(true);
        setOpenDropdown(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.model || !form.screen) return;

        if (editModel) {
            setModels(prev => prev.map(m => m.id === editModel.id ? { ...m, brand: form.brand, model: form.model, modelNumber: form.modelNumber, year: Number(form.year), screen: form.screen, repairDifficulty: form.repairDifficulty } : m));
            setToast('Model updated successfully');
        } else {
            const newModel = { id: Date.now(), ...form, year: Number(form.year) };
            setModels(prev => [newModel, ...prev]);
            setToast('Model added successfully');
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setModels(prev => prev.filter(m => m.id !== id));
        setOpenDropdown(null);
        setToast('Model deleted');
    };

    // Summary stats
    const totalModels = models.length;
    const brands = new Set(models.map(m => m.brand)).size;
    const highDifficulty = models.filter(m => m.repairDifficulty === 'High').length;

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
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button
                            className="btn-secondary"
                            onClick={() => setShowFilterDropdown(v => !v)}
                        >
                            <ChevronDown size={14} />
                            {brandFilter === 'All' ? 'All Brands' : brandFilter}
                        </button>
                        {showFilterDropdown && (
                            <div className="filter-dropdown">
                                {BRANDS.map(b => (
                                    <button
                                        key={b}
                                        className={`filter-dropdown-item ${brandFilter === b ? 'active' : ''}`}
                                        onClick={() => { setBrandFilter(b); setShowFilterDropdown(false); }}
                                    >
                                        {b === 'All' ? 'All Brands' : b}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="btn-primary" onClick={openAdd}>
                        <Plus size={18} />
                        <span>Add Model</span>
                    </button>
                </div>
            </div>

            {/* Summary stats */}
            <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: 'var(--accent)' }}>
                        <Smartphone size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Models</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalModels}</div>
                    </div>
                </div>
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '8px', color: '#818cf8' }}>
                        <Smartphone size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Brands</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{brands}</div>
                    </div>
                </div>
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#ef4444' }}>
                        <Smartphone size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>High Difficulty</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{highDifficulty}</div>
                    </div>
                </div>
            </div>

            <div className="repairs-table-container">
                <table className="repairs-table">
                    <thead>
                        <tr>
                            <th>Brand / Model</th>
                            <th>Model Number</th>
                            <th>Year</th>
                            <th>Screen Size</th>
                            <th>Repair Difficulty</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                    No models found
                                </td>
                            </tr>
                        ) : (
                            filtered.map(m => (
                                <tr key={m.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ padding: '0.5rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', color: 'var(--accent)' }}>
                                                <Smartphone size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{m.model}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.brand}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.modelNumber || '—'}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{m.year}</td>
                                    <td>{m.screen}</td>
                                    <td>
                                        <span className={`status-badge ${DIFFICULTY_CLASS[m.repairDifficulty]}`}>
                                            {m.repairDifficulty}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="action-wrapper" onClick={e => e.stopPropagation()}>
                                            <MoreHorizontal
                                                size={18}
                                                className="action-icon"
                                                onClick={() => setOpenDropdown(openDropdown === m.id ? null : m.id)}
                                            />
                                            {openDropdown === m.id && (
                                                <div className="action-dropdown">
                                                    <button className="action-dropdown-item" onClick={() => openEdit(m)}>
                                                        <Edit3 size={14} /> Edit
                                                    </button>
                                                    <button className="action-dropdown-item danger" onClick={() => handleDelete(m.id)}>
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

            {/* Add / Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editModel ? 'Edit Model' : 'Add Device Model'} width={560}>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Brand</label>
                            <select className="form-select" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}>
                                {BRANDS.filter(b => b !== 'All').map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Year</label>
                            <input className="form-input" type="number" min="2010" max="2030" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Model Name</label>
                        <input className="form-input" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Model Number</label>
                        <input className="form-input" value={form.modelNumber} onChange={e => setForm({ ...form, modelNumber: e.target.value })} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Screen Size</label>
                            <input className="form-input" value={form.screen} onChange={e => setForm({ ...form, screen: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Repair Difficulty</label>
                            <select className="form-select" value={form.repairDifficulty} onChange={e => setForm({ ...form, repairDifficulty: e.target.value })}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary">{editModel ? 'Save Changes' : 'Add Model'}</button>
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

export default DeviceModels;
