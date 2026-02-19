import React, { useState } from 'react';
import {
    User,
    Bell,
    Moon,
    Shield,
    Monitor,
    LogOut,
    ChevronRight,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';

const Settings = () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    const sections = [
        {
            title: 'Account Settings',
            items: [
                { icon: User, label: 'Profile Information', sub: 'Update your photo and details' },
                { icon: Shield, label: 'Security', sub: 'Password, 2FA' },
            ]
        },
        {
            title: 'App Preferences',
            items: [
                { icon: Bell, label: 'Notifications', sub: 'Manage alerts and emails', toggle: true, state: notifications, setState: setNotifications },
                { icon: Moon, label: 'Dark Mode', sub: 'Toggle theme', toggle: true, state: darkMode, setState: setDarkMode },
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
                        JD
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>John Doe</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Administrator</p>
                    </div>
                    <button className="btn-secondary" style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}>Edit Profile</button>
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
                                    onClick={() => item.toggle && item.setState(!item.state)}
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
                                        <ChevronRight size={18} className="text-slate-500" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '1rem'
                }}>
                    <LogOut size={18} />
                    Sign Out
                </button>

            </div>
        </div>
    );
};

export default Settings;
