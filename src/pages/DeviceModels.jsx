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
                        <Smartphone size={28} style={{ color: '#ec4899' }} />
                        Device Library
                    </h2>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="search-bar" style={{ width: '280px', margin: 0 }}>
                        <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder="Search by brand or model..."
                        />
                    </div>

                    <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button
                            className="btn-secondary"
                            onClick={() => setShowFilterDropdown(v => !v)}
                            style={{ padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            {brandFilter === 'All' ? 'All Brands' : brandFilter}
                            <ChevronDown size={14} />
                        </button>
                        {showFilterDropdown && (
                            <div className="filter-dropdown" style={{ zIndex: 50 }}>
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

                    <button className="btn-primary" onClick={openAdd} style={{ padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '12px' }}>
                        <Plus size={18} />
                        <span style={{ fontWeight: 600 }}>Add Model</span>
                    </button>
                </div>
            </div>

            {/* Summary stats */}
            <div className="metrics-grid" style={{ marginBottom: '2.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div className="metric-card anim-card" style={{ animationDelay: '0.1s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.05))', borderRadius: '12px', color: '#38bdf8', boxShadow: 'inset 0 0 0 1px rgba(56, 189, 248, 0.2)' }}>
                        <Smartphone size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Models</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{totalModels}</div>
                    </div>
                </div>

                <div className="metric-card anim-card" style={{ animationDelay: '0.15s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))', borderRadius: '12px', color: '#10b981', boxShadow: 'inset 0 0 0 1px rgba(16, 185, 129, 0.2)' }}>
                        <Smartphone size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Brands</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{brands}</div>
                    </div>
                </div>

                <div className="metric-card anim-card" style={{ animationDelay: '0.2s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))', borderRadius: '12px', color: '#ef4444', boxShadow: 'inset 0 0 0 1px rgba(239, 68, 68, 0.2)' }}>
                        <Smartphone size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>High Difficulty</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{highDifficulty}</div>
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
                                <td colSpan={6} style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <Smartphone size={32} style={{ opacity: 0.5 }} />
                                        <p style={{ marginTop: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>
                                            No device models found
                                        </p>
                                        <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                            Add new device models here to speed up repair logging.
                                        </p>
                                    </div>
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
