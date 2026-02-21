import React, { useState, useEffect } from 'react';
import {
    User,
    Bell,
    Moon,
    Sun,
    Shield,
    Monitor,
    LogOut,
    ChevronRight,
    ToggleLeft,
    ToggleRight,
    CheckCircle,
    Lock,
    AlertTriangle
} from 'lucide-react';
import Modal from '../components/Modal';

const Settings = ({ onNavigate }) => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(!document.documentElement.classList.contains('light-mode'));
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    const [toast, setToast] = useState(null);

    const [profile, setProfile] = useState({ name: 'John Doe', email: 'john.doe@repairrc.com', role: 'Administrator' });
    const [editProfile, setEditProfile] = useState({ ...profile });

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    const handleDarkModeToggle = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.remove('light-mode');
        } else {
            document.documentElement.classList.add('light-mode');
        }
        setToast(newMode ? 'Dark mode enabled' : 'Light mode enabled');
    };

    const handleNotificationsToggle = () => {
        const newState = !notifications;
        setNotifications(newState);
        setToast(newState ? 'Notifications enabled' : 'Notifications disabled');
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setProfile({ ...editProfile });
        setShowProfileModal(false);
        setToast('Profile updated successfully');
    };

    const handleSignOut = () => {
        setShowSignOutConfirm(false);
        setToast('Signed out successfully');
        setTimeout(() => {
            onNavigate?.('Dashboard');
        }, 1000);
    };

    const sections = [
        {
            title: 'Account Settings',
            items: [
                { icon: User, label: 'Profile Information', sub: 'Update your photo and details', action: () => { setEditProfile({ ...profile }); setShowProfileModal(true); } },
                { icon: Shield, label: 'Security', sub: 'Password, 2FA', action: () => setShowSecurityModal(true) },
            ]
        },
        {
            title: 'App Preferences',
            items: [
                { icon: Bell, label: 'Notifications', sub: 'Manage alerts and emails', toggle: true, state: notifications, onToggle: handleNotificationsToggle },
                { icon: darkMode ? Moon : Sun, label: 'Dark Mode', sub: darkMode ? 'Currently using dark theme' : 'Currently using light theme', toggle: true, state: darkMode, onToggle: handleDarkModeToggle },
                { icon: Monitor, label: 'System', sub: 'Display and resolution settings' },
            ]
        }
    ];

    return (
        <div className="repairs-view" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="repairs-header">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Settings</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Profile Card */}
                <div className="section-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="avatar" style={{ width: 80, height: 80, fontSize: '1.5rem' }}>
                        {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{profile.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{profile.role}</p>
                        <p style={{ color: 'var(--text-secondary)', margin: '0.15rem 0 0', fontSize: '0.85rem' }}>{profile.email}</p>
                    </div>
                    <button className="btn-secondary" onClick={() => { setEditProfile({ ...profile }); setShowProfileModal(true); }}>
                        Edit Profile
                    </button>
                </div>

                {sections.map((section, idx) => (
                    <div key={idx}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
                            {section.title}
                        </h3>
                        <div className="section-card" style={{ padding: 0, overflow: 'hidden' }}>
                            {section.items.map((item, itemIdx) => (
                                <div
                                    key={itemIdx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '1.25rem 1.5rem',
                                        borderBottom: itemIdx < section.items.length - 1 ? '1px solid var(--border)' : 'none',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => {
                                        if (item.toggle) item.onToggle?.();
                                        else if (item.action) item.action();
                                    }}
                                >
                                    <div style={{
                                        padding: '0.6rem',
                                        background: 'rgba(56, 189, 248, 0.1)',
                                        borderRadius: '8px',
                                        color: 'var(--accent)',
                                        marginRight: '1rem'
                                    }}>
                                        <item.icon size={20} />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>{item.label}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.sub}</div>
                                    </div>

                                    {item.toggle ? (
                                        <div style={{ color: item.state ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                            {item.state ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                        </div>
                                    ) : (
                                        <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <button className="btn-danger" onClick={() => setShowSignOutConfirm(true)}>
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} title="Edit Profile">
                <form onSubmit={handleSaveProfile}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input className="form-input" value={editProfile.name} onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input className="form-input" type="email" value={editProfile.email} onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select className="form-select" value={editProfile.role} onChange={(e) => setEditProfile({ ...editProfile, role: e.target.value })}>
                            <option>Administrator</option>
                            <option>Technician</option>
                            <option>Manager</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setShowProfileModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary">Save Changes</button>
                    </div>
                </form>
            </Modal>

            {/* Security Info Modal */}
            <Modal isOpen={showSecurityModal} onClose={() => setShowSecurityModal(false)} title="Security Settings">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: '10px' }}>
                        <Lock size={20} style={{ color: 'var(--accent)' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500 }}>Password</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Last changed 30 days ago</div>
                        </div>
                        <button className="btn-ghost">Change</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: '10px' }}>
                        <Shield size={20} style={{ color: '#10b981' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500 }}>Two-Factor Authentication</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Enabled via authenticator app</div>
                        </div>
                        <span className="status-badge status-completed">Active</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: '10px' }}>
                        <AlertTriangle size={20} style={{ color: '#facc15' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500 }}>Active Sessions</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>1 device currently logged in</div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Sign Out Confirmation */}
            <Modal isOpen={showSignOutConfirm} onClose={() => setShowSignOutConfirm(false)} title="Sign Out" width={400}>
                <div className="confirm-content">
                    <LogOut size={40} style={{ color: '#ef4444', marginBottom: '0.5rem' }} />
                    <p>Are you sure you want to sign out?</p>
                    <div className="confirm-actions">
                        <button className="btn-secondary" onClick={() => setShowSignOutConfirm(false)}>Cancel</button>
                        <button className="btn-danger" style={{ marginTop: 0, padding: '0.5rem 1.5rem' }} onClick={handleSignOut}>Sign Out</button>
                    </div>
                </div>
            </Modal>

            {toast && (
                <div className="toast toast-info">
                    <CheckCircle size={18} style={{ color: 'var(--accent)' }} />
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Settings;
