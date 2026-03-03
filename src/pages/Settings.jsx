import React, { useState, useEffect } from 'react';
import {
    User,
    Store,
    DollarSign,
    Database,
    LogOut,
    CheckCircle,
    Save,
    Trash2,
    Download,
    Upload,
    Cpu,
    ShieldAlert,
    AlertTriangle
} from 'lucide-react';
import Modal from '../components/Modal';

const Settings = ({ onNavigate, deviceModels, setDeviceModels, customers, setCustomers, repairs, setRepairs, parts, setParts }) => {
    const [activeMenu, setActiveMenu] = useState('account');
    const [toast, setToast] = useState(null);
    const [toastType, setToastType] = useState('info'); // 'info' | 'success' | 'error'
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    const [showImportConfirm, setShowImportConfirm] = useState(false);
    const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [renderedMenu, setRenderedMenu] = useState('account');
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    // Mocks
    const [shopConfig, setShopConfig] = useState({
        name: 'Mobile Repair RC',
        address: '123 Tech Ave, Suite 4B',
        phone: '(555) 019-2834',
        email: 'hello@repairrc.com'
    });

    const [finConfig, setFinConfig] = useState({
        currency: '$',
        taxRate: '8.5'
    });

    const [userConfig, setUserConfig] = useState({
        name: 'David Meraz',
        role: 'Administrator',
        pin: '1234'
    });

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    const showMessage = (msg, type = 'info') => {
        setToast(msg);
        setToastType(type);
    };

    const handleSignOut = () => {
        setShowSignOutConfirm(false);
        showMessage('System locked successfully');
        setTimeout(() => {
            onNavigate?.('Dashboard');
        }, 1000);
    };

    const handleTabChange = (newMenu) => {
        if (newMenu === activeMenu) return;
        setIsAnimating(true);
        setActiveMenu(newMenu);
        setTimeout(() => {
            setRenderedMenu(newMenu);
            setIsAnimating(false);
        }, 300); // match exit transition time
    };

    const handleExport = async () => {
        if (!window.api || !window.api.exportData) {
            showMessage('Export not available in browser mode.', 'error');
            return;
        }
        setIsExporting(true);
        try {
            const result = await window.api.exportData();
            if (result.canceled) {
                // User canceled, do nothing
            } else if (result.success) {
                showMessage('Database exported successfully!', 'success');
            } else {
                showMessage(`Export failed: ${result.error}`, 'error');
            }
        } catch (err) {
            showMessage(`Export error: ${err.message}`, 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async () => {
        setShowImportConfirm(false);
        if (!window.api || !window.api.importData) {
            showMessage('Import not available in browser mode.', 'error');
            return;
        }
        setIsImporting(true);
        try {
            const result = await window.api.importData();
            if (result.canceled) {
                // User canceled, do nothing
            } else if (result.success) {
                // Update live React state
                setDeviceModels(result.data.deviceModels || []);
                setCustomers(result.data.customers || []);
                setRepairs(result.data.repairs || []);
                setParts(result.data.parts || []);
                showMessage('Database imported successfully! All data has been restored.', 'success');
            } else {
                showMessage(`Import failed: ${result.error}`, 'error');
            }
        } catch (err) {
            showMessage(`Import error: ${err.message}`, 'error');
        } finally {
            setIsImporting(false);
        }
    };

    const handlePurge = async () => {
        setShowPurgeConfirm(false);
        setDeviceModels([]);
        setCustomers([]);
        setRepairs([]);
        setParts([]);
        showMessage('All data has been purged. System reset to factory defaults.', 'success');
    };

    const menus = [
        { id: 'account', label: 'Profile Info', icon: User, gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
        { id: 'shop', label: 'Storefront', icon: Store, gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' },
        { id: 'finance', label: 'Financials', icon: DollarSign, gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
        { id: 'data', label: 'Core Data', icon: Database, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }
    ];

    return (
        <div className="repairs-view" style={{ padding: '2rem 3rem', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexShrink: 0 }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Cpu size={28} style={{ color: 'var(--accent)' }} />
                        System Config
                    </h2>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.95rem' }}>Advanced settings and operational parameters.</p>
                </div>
                <button
                    onClick={() => setShowSignOutConfirm(true)}
                    className="lock-btn"
                >
                    <LogOut size={18} />
                    <span>Lock Interface</span>
                </button>
            </div>

            {/* Glowing Tab Navigation */}
            <div className="settings-tabs-container" style={{ flexShrink: 0, marginBottom: '2.5rem' }}>
                {menus.map(m => {
                    const isActive = activeMenu === m.id;
                    return (
                        <button
                            key={m.id}
                            onClick={() => handleTabChange(m.id)}
                            className={`settings-tab ${isActive ? 'active' : ''}`}
                            style={{
                                '--tab-gradient': m.gradient
                            }}
                        >
                            <div className="tab-icon-wrapper">
                                <m.icon size={18} />
                            </div>
                            <span style={{ fontWeight: isActive ? 600 : 500 }}>{m.label}</span>
                            {isActive && <div className="tab-indicator" />}
                        </button>
                    )
                })}
            </div>

            {/* Content Area with Morphing Animation */}
            <div className="settings-content-wrapper" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <div className={`settings-card-content ${isAnimating ? 'fade-out' : 'fade-in-up'}`}>

                    {renderedMenu === 'shop' && (
                        <div className="animated-form-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                            <div className="form-column">
                                <div className="floating-form-group" style={{ animationDelay: '0.1s' }}>
                                    <input className="floating-input" value={shopConfig.name} onChange={e => setShopConfig({ ...shopConfig, name: e.target.value })} placeholder=" " />
                                    <label className="floating-label">Registered Store Name</label>
                                    <div className="focus-border"></div>
                                </div>
                                <div className="floating-form-group" style={{ animationDelay: '0.15s' }}>
                                    <input className="floating-input" type="email" value={shopConfig.email} onChange={e => setShopConfig({ ...shopConfig, email: e.target.value })} placeholder=" " />
                                    <label className="floating-label">Primary Business Email</label>
                                    <div className="focus-border"></div>
                                </div>
                            </div>
                            <div className="form-column">
                                <div className="floating-form-group" style={{ animationDelay: '0.2s' }}>
                                    <input className="floating-input" value={shopConfig.phone} onChange={e => setShopConfig({ ...shopConfig, phone: e.target.value })} placeholder=" " />
                                    <label className="floating-label">Official Contact Number</label>
                                    <div className="focus-border"></div>
                                </div>
                                <div className="floating-form-group" style={{ animationDelay: '0.25s' }}>
                                    <input className="floating-input" value={shopConfig.address} onChange={e => setShopConfig({ ...shopConfig, address: e.target.value })} placeholder=" " />
                                    <label className="floating-label">Full Local Address</label>
                                    <div className="focus-border"></div>
                                </div>
                            </div>

                            <div className="form-column" style={{ marginTop: '1rem' }}>
                                <div className="floating-form-group" style={{ animationDelay: '0.3s' }}>
                                    {/* Placeholder or future fields like Tax ID */}
                                    <input className="floating-input" defaultValue="" placeholder=" " />
                                    <label className="floating-label">Business Tax ID / EIN (Optional)</label>
                                    <div className="focus-border"></div>
                                </div>
                                <div className="form-column" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <div className="form-actions-row" style={{ animationDelay: '0.35s', width: '100%', marginTop: 0 }}>
                                        <button className="btn-glow-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => showMessage('Storefront details updated successfully!')}>
                                            <Save size={18} /> Commit Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {renderedMenu === 'finance' && (
                        <div className="animated-form-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                            <div className="form-column">
                                <div className="floating-form-group" style={{ animationDelay: '0.1s' }}>
                                    <select className="floating-input" value={finConfig.currency} onChange={e => setFinConfig({ ...finConfig, currency: e.target.value })}>
                                        <option value="$">US Dollar ($)</option>
                                        <option value="€">Euro (€)</option>
                                        <option value="£">British Pound (£)</option>
                                        <option value="Mex$">Mexican Peso (Mex$)</option>
                                    </select>
                                    <label className="floating-label" style={{ background: 'var(--bg-card)' }}>Operational Currency</label>
                                    <div className="focus-border"></div>
                                </div>
                                <div className="floating-form-group" style={{ animationDelay: '0.2s' }}>
                                    <input className="floating-input" type="number" step="0.1" value={finConfig.taxRate} onChange={e => setFinConfig({ ...finConfig, taxRate: e.target.value })} placeholder=" " />
                                    <label className="floating-label">Baseline Tax Rate (%)</label>
                                    <div className="focus-border"></div>
                                </div>
                            </div>
                            <div className="form-column">
                                <div className="floating-form-group" style={{ animationDelay: '0.15s' }}>
                                    <select className="floating-input" defaultValue="none">
                                        <option value="none">None</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="stripe">Stripe</option>
                                    </select>
                                    <label className="floating-label" style={{ background: 'var(--bg-card)' }}>Payment Gateway Setup</label>
                                    <div className="focus-border"></div>
                                </div>
                                <div className="floating-form-group" style={{ animationDelay: '0.25s' }}>
                                    <input className="floating-input" type="text" defaultValue="Net 15" placeholder=" " />
                                    <label className="floating-label">Default Invoice Terms</label>
                                    <div className="focus-border"></div>
                                </div>
                            </div>

                            <div className="form-actions-row" style={{ animationDelay: '0.3s', justifyContent: 'center', marginTop: '3rem' }}>
                                <button className="btn-glow-success" style={{ width: '40%', justifyContent: 'center' }} onClick={() => showMessage('Financial baselines recalibrated!')}>
                                    <Save size={18} /> Apply Financials
                                </button>
                            </div>
                        </div>
                    )}

                    {renderedMenu === 'data' && (
                        <div className="animated-list" style={{ maxWidth: '1050px', margin: '-1.5rem auto 0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {/* Modernized Stats Row */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem',
                                opacity: 0, animation: 'slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards', animationDelay: '0.05s'
                            }}>
                                {[
                                    { label: 'Device Models', count: deviceModels?.length || 0, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.05)' },
                                    { label: 'Customers', count: customers?.length || 0, color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.05)' },
                                    { label: 'Repairs', count: repairs?.length || 0, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.05)' },
                                    { label: 'Parts', count: parts?.length || 0, color: '#10b981', bg: 'rgba(16, 185, 129, 0.05)' },
                                ].map((stat, i) => (
                                    <div key={i} style={{
                                        padding: '1.5rem',
                                        background: stat.bg,
                                        border: `1px solid ${stat.color}30`,
                                        borderRadius: '16px',
                                        display: 'flex', alignItems: 'center', gap: '1.25rem',
                                        boxShadow: `inset 0 0 20px ${stat.bg}, 0 4px 15px rgba(0,0,0,0.1)`,
                                        transition: 'transform 0.3s ease',
                                        cursor: 'default'
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: stat.color, boxShadow: `0 0 12px ${stat.color}` }} />
                                        <div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stat.count}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.4rem', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Cards Row */}
                            <div className="form-column" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                {/* Export Card */}
                                <div className="data-action-card" style={{ animationDelay: '0.1s', flexDirection: 'column', textAlign: 'center', padding: '2rem 1.5rem', alignItems: 'center', justifyContent: 'space-between', height: '100%', minHeight: '300px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div className="data-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', width: 56, height: 56, marginBottom: '1.25rem', borderRadius: '16px' }}>
                                            <Download size={28} />
                                        </div>
                                        <div className="data-info" style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#e2e8f0' }}>Export Backup</h4>
                                            <p style={{ marginTop: '0.5rem', lineHeight: 1.4, fontSize: '0.85rem', color: '#94a3b8' }}>Save a comprehensive, encrypted snapshot of your workspace strictly to a scalable JSON file localized on your computer.</p>
                                        </div>
                                    </div>
                                    <button
                                        className="btn-glow-primary"
                                        style={{ width: '100%', justifyContent: 'center', opacity: isExporting ? 0.6 : 1, padding: '0.75rem', fontSize: '0.95rem' }}
                                        onClick={handleExport}
                                        disabled={isExporting}
                                    >
                                        {isExporting ? (
                                            <><span className="btn-spinner" /> Exporting...</>
                                        ) : (
                                            <><Download size={18} /> Export Local Data</>
                                        )}
                                    </button>
                                </div>

                                {/* Import Card */}
                                <div className="data-action-card" style={{ animationDelay: '0.15s', flexDirection: 'column', textAlign: 'center', padding: '2rem 1.5rem', alignItems: 'center', justifyContent: 'space-between', height: '100%', minHeight: '300px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div className="data-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', width: 56, height: 56, marginBottom: '1.25rem', borderRadius: '16px' }}>
                                            <Upload size={28} />
                                        </div>
                                        <div className="data-info" style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#e2e8f0' }}>Import Backup</h4>
                                            <p style={{ marginTop: '0.5rem', lineHeight: 1.4, fontSize: '0.85rem', color: '#94a3b8' }}>Inject and restore your previously exported JSON database. This bypasses the current state with the validated backup file.</p>
                                        </div>
                                    </div>
                                    <button
                                        className="btn-glow-success"
                                        style={{ width: '100%', justifyContent: 'center', opacity: isImporting ? 0.6 : 1, padding: '0.75rem', fontSize: '0.95rem' }}
                                        onClick={() => setShowImportConfirm(true)}
                                        disabled={isImporting}
                                    >
                                        {isImporting ? (
                                            <><span className="btn-spinner" /> Importing...</>
                                        ) : (
                                            <><Upload size={18} /> Restore Backup</>
                                        )}
                                    </button>
                                </div>

                                {/* Purge Card */}
                                <div className="data-action-card danger" style={{ animationDelay: '0.2s', flexDirection: 'column', textAlign: 'center', padding: '2rem 1.5rem', alignItems: 'center', justifyContent: 'space-between', height: '100%', minHeight: '300px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div className="data-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', width: 56, height: 56, marginBottom: '1.25rem', borderRadius: '16px' }}>
                                            <Trash2 size={28} />
                                        </div>
                                        <div className="data-info" style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{ color: '#ef4444', fontSize: '1.15rem', fontWeight: 700 }}>Factory Reset</h4>
                                            <p style={{ marginTop: '0.5rem', lineHeight: 1.4, fontSize: '0.85rem', color: '#94a3b8' }}>Irreversibly wipe all datasets including devices, customers, repairs and inventory. A radical systemic state clean up.</p>
                                        </div>
                                    </div>
                                    <button className="btn-danger" style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', transition: 'all 0.3s', borderRadius: '12px' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
                                        onClick={() => setShowPurgeConfirm(true)}>
                                        <Trash2 size={18} /> Purge System
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {renderedMenu === 'account' && (
                        <div className="animated-form-grid account-grid" style={{ maxWidth: '1000px', margin: '0 auto', alignItems: 'flex-start' }}>
                            <div className="account-avatar-wrapper" style={{ animationDelay: '0.1s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                                <div className="account-avatar-glow" style={{ width: 160, height: 160, fontSize: '4rem' }}>
                                    {userConfig.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 600 }}>{userConfig.name}</h3>
                                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.85rem', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>{userConfig.role}</span>
                                </div>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
                                <div className="form-column">
                                    <div className="floating-form-group" style={{ animationDelay: '0.15s' }}>
                                        <input className="floating-input" defaultValue="admin.david" placeholder=" " />
                                        <label className="floating-label">Username</label>
                                        <div className="focus-border"></div>
                                    </div>
                                    <div className="floating-form-group" style={{ animationDelay: '0.2s' }}>
                                        <input className="floating-input" value={userConfig.name} onChange={e => setUserConfig({ ...userConfig, name: e.target.value })} placeholder=" " />
                                        <label className="floating-label">Full Name</label>
                                        <div className="focus-border"></div>
                                    </div>
                                </div>

                                <div className="form-column">
                                    <div className="floating-form-group" style={{ animationDelay: '0.25s' }}>
                                        <input className="floating-input" type="email" defaultValue="admin@system.io" placeholder=" " />
                                        <label className="floating-label">Email Address</label>
                                        <div className="focus-border"></div>
                                    </div>
                                    <div className="floating-form-group" style={{ animationDelay: '0.3s' }}>
                                        <input className="floating-input" type="tel" defaultValue="(555) 123-4567" placeholder=" " />
                                        <label className="floating-label">Phone Number</label>
                                        <div className="focus-border"></div>
                                    </div>
                                </div>

                                <div className="form-column">
                                    <div className="floating-form-group" style={{ animationDelay: '0.35s' }}>
                                        <input className="floating-input" type="text" defaultValue="Mon-Fri, 9AM-6PM" placeholder=" " />
                                        <label className="floating-label">Working Hours</label>
                                        <div className="focus-border"></div>
                                    </div>
                                    <div className="form-actions-row" style={{ animationDelay: '0.4s', width: '100%', marginTop: '0', display: 'flex', alignItems: 'flex-end' }}>
                                        <button className="btn-glow-primary" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #f43f5e, #fb7185)', boxShadow: '0 4px 15px rgba(244, 63, 94, 0.3)' }} onClick={() => showMessage('Profile info updated successfully!')}>
                                            <Save size={18} /> Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lock Confirmation */}
            <Modal isOpen={showSignOutConfirm} onClose={() => setShowSignOutConfirm(false)} title="Security Lock" width={400}>
                <div className="confirm-content">
                    <LogOut size={48} style={{ color: '#ef4444', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.4))' }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Authorize system lockdown?</p>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '2rem' }}>This will immediately terminate the active session and return to the main dashboard.</p>
                    <div className="confirm-actions">
                        <button className="btn-secondary" onClick={() => setShowSignOutConfirm(false)}>Abort</button>
                        <button className="btn-danger" style={{ marginTop: 0, padding: '0.6rem 2rem', fontSize: '1rem' }} onClick={handleSignOut}>Execute Lock</button>
                    </div>
                </div>
            </Modal>

            {/* Import Confirmation */}
            <Modal isOpen={showImportConfirm} onClose={() => setShowImportConfirm(false)} title="Import Database" width={440}>
                <div className="confirm-content">
                    <AlertTriangle size={48} style={{ color: '#f59e0b', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))' }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Overwrite current database?</p>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                        Importing a backup will <strong style={{ color: '#f59e0b' }}>replace all existing data</strong> (device models, customers, repairs, and parts) with the data from the selected file.
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>
                        It is recommended to export a backup first before importing.
                    </p>
                    <div className="confirm-actions">
                        <button className="btn-secondary" onClick={() => setShowImportConfirm(false)}>Cancel</button>
                        <button className="btn-glow-success" style={{ padding: '0.6rem 2rem', fontSize: '1rem' }} onClick={handleImport}>
                            <Upload size={18} /> Proceed with Import
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Purge Confirmation */}
            <Modal isOpen={showPurgeConfirm} onClose={() => setShowPurgeConfirm(false)} title="Factory Reset" width={440}>
                <div className="confirm-content">
                    <ShieldAlert size={48} style={{ color: '#ef4444', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.4))' }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Confirm factory reset?</p>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                        This will <strong style={{ color: '#ef4444' }}>permanently delete all data</strong> including device models, customers, repairs, and parts inventory.
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>
                        This action cannot be undone. Please export a backup first if you want to keep your data.
                    </p>
                    <div className="confirm-actions">
                        <button className="btn-secondary" onClick={() => setShowPurgeConfirm(false)}>Cancel</button>
                        <button className="btn-danger" style={{ marginTop: 0, padding: '0.6rem 2rem', fontSize: '1rem' }} onClick={handlePurge}>
                            <Trash2 size={18} /> Purge Everything
                        </button>
                    </div>
                </div>
            </Modal>

            {toast && (
                <div className={`toast ${toastType === 'error' ? 'toast-error' : toastType === 'success' ? 'toast-success' : 'toast-info'}`} style={{ zIndex: 9999, animation: 'toastSlide 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
                    {toastType === 'error' ? (
                        <AlertTriangle size={18} style={{ color: '#ef4444' }} />
                    ) : (
                        <CheckCircle size={18} style={{ color: toastType === 'success' ? '#10b981' : 'var(--accent)' }} />
                    )}
                    {toast}
                </div>
            )}

            <style>{`
                /* Tab Navigation Styles */
                .settings-tabs-container {
                    display: flex;
                    gap: 1rem;
                    background: var(--bg-card);
                    padding: 0.5rem;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    align-self: flex-start;
                }

                .settings-tab {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    border: none;
                    background: transparent;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    font-size: 0.95rem;
                }

                .settings-tab:hover:not(.active) {
                    background: rgba(255, 255, 255, 0.03);
                    color: #e2e8f0;
                }

                .settings-tab.active {
                    color: #fff;
                    background: rgba(255,255,255,0.05); /* Slight highlight backing */
                }

                .tab-icon-wrapper {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    transition: all 0.3s;
                }

                .settings-tab.active .tab-icon-wrapper {
                    color: #fff;
                    filter: drop-shadow(0 0 8px rgba(255,255,255,0.4));
                }

                .tab-indicator {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 12px;
                    background: radial-gradient(circle at center, var(--tab-gradient) 0%, transparent 100%);
                    opacity: 0.1;
                    z-index: 1;
                    animation: pulseGlow 2s infinite alternate;
                }

                @keyframes pulseGlow {
                    0% { opacity: 0.05; transform: scale(0.95); }
                    100% { opacity: 0.15; transform: scale(1.05); }
                }

                /* Lock Button */
                .lock-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1.5rem;
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px dashed rgba(239, 68, 68, 0.4);
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .lock-btn:hover {
                    background: #ef4444;
                    color: white;
                    border: 1px solid #ef4444;
                    box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
                    transform: translateY(-2px);
                }

                /* Content Area Transitions */
                .settings-content-wrapper {
                    background: var(--bg-card);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    padding: 3rem;
                    position: relative;
                }

                .settings-card-content {
                    width: 100%;
                    height: 100%;
                }

                .fade-in-up {
                    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .fade-out {
                    animation: fadeOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(20px) scale(0.98); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }

                @keyframes fadeOut {
                    0% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(0.98); }
                }

                /* Animated Forms */
                .animated-form-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    width: 100%;
                }

                .form-column {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }

                .floating-form-group {
                    position: relative;
                    opacity: 0;
                    animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes slideRight {
                    0% { opacity: 0; transform: translateX(-15px); }
                    100% { opacity: 1; transform: translateX(0); }
                }

                .floating-input {
                    display: block;
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: var(--text-primary);
                    font-size: 1rem;
                    transition: all 0.3s;
                    box-sizing: border-box;
                }

                .floating-input:focus {
                    outline: none;
                    background: rgba(15, 23, 42, 0.9);
                    border-color: transparent;
                }

                .floating-label {
                    position: absolute;
                    top: 0.75rem;
                    left: 1rem;
                    color: #94a3b8;
                    font-size: 1rem;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: none;
                    background: transparent;
                    padding: 0 4px;
                }

                .floating-input:focus ~ .floating-label,
                .floating-input:not(:placeholder-shown) ~ .floating-label {
                    top: -1.5rem;
                    left: 0.1rem;
                    font-size: 0.8rem;
                    color: var(--accent);
                    background: var(--bg-card); /* mask behind line */
                    font-weight: 500;
                    border-radius: 4px;
                }

                .focus-border {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 12px;
                    pointer-events: none;
                    box-shadow: 0 0 0 2px var(--accent);
                    opacity: 0;
                    transform: scale(0.98);
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .floating-input:focus ~ .focus-border {
                    opacity: 1;
                    transform: scale(1);
                    box-shadow: 0 0 15px rgba(56, 189, 248, 0.2), inset 0 0 0 1px var(--accent);
                }

                /* Glowing Buttons */
                .form-actions-row {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 2rem;
                    opacity: 0;
                    animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .btn-glow-primary, .btn-glow-success {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.85rem 2rem;
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    font-size: 1.05rem;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s;
                    z-index: 1;
                }

                .btn-glow-primary {
                    background: linear-gradient(135deg, #0ea5e9, #38bdf8);
                    box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
                }
                
                .btn-glow-success {
                    background: linear-gradient(135deg, #10b981, #34d399);
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }

                .btn-glow-primary::before, .btn-glow-success::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(135deg, rgba(255,255,255,0.3), transparent);
                    z-index: -1;
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .btn-glow-primary:hover, .btn-glow-success:hover {
                    transform: translateY(-2px);
                }
                
                .btn-glow-primary:hover { box-shadow: 0 8px 25px rgba(56, 189, 248, 0.5); }
                .btn-glow-success:hover { box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5); }

                .btn-glow-primary:hover::before, .btn-glow-success:hover::before {
                    opacity: 1;
                }

                /* Data Cards */
                .animated-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .data-action-card {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 1.5rem;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 16px;
                    transition: all 0.3s;
                    opacity: 0;
                    animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .data-action-card:hover {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(56, 189, 248, 0.3);
                    transform: translateX(5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }

                .data-action-card.danger:hover {
                    border-color: rgba(239, 68, 68, 0.4);
                }

                .data-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .data-info {
                    flex: 1;
                }

                .data-info h4 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1.1rem;
                }
                .data-info p {
                    margin: 0;
                    color: #94a3b8;
                    font-size: 0.9rem;
                }

                /* Account Grid */
                .account-grid {
                    flex-direction: row;
                    align-items: flex-start;
                    gap: 3rem;
                }
                
                .account-avatar-wrapper {
                    opacity: 0;
                    animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }

                @keyframes scaleIn {
                    0% { opacity: 0; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }

                .account-avatar-glow {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #f43f5e, #fb7185);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: 700;
                    color: white;
                    box-shadow: 0 0 30px rgba(244, 63, 94, 0.4), inset 0 0 20px rgba(255,255,255,0.2);
                    border: 4px solid rgba(255,255,255,0.1);
                    position: relative;
                }
                
                .account-avatar-glow::after {
                    content: '';
                    position: absolute;
                    top: -10px; left: -10px; right: -10px; bottom: -10px;
                    border-radius: 50%;
                    border: 2px solid rgba(244, 63, 94, 0.5);
                    animation: ripple 2s infinite cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes ripple {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(1.3); opacity: 0; }
                }

                @keyframes toastSlide {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                /* Button Spinner */
                .btn-spinner {
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.6s linear infinite;
                }

                @keyframes spin {
                    100% { transform: rotate(360deg); }
                }

                /* Toast Variants */
                .toast-success {
                    border-left: 3px solid #10b981 !important;
                }

                .toast-error {
                    border-left: 3px solid #ef4444 !important;
                }

                .toast-info {
                    border-left: 3px solid var(--accent) !important;
                }

                /* btn-danger fixes for flex layout */
                .btn-danger {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

            `}</style>
        </div>
    );
};

export default Settings;
