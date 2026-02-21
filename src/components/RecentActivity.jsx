import React from 'react';
import { Settings, User, Smartphone } from 'lucide-react';

const RecentActivity = ({ onNavigate, repairs = [] }) => {
    // Show more items to trigger scroll
    const recentRepairs = repairs.slice(0, 20);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'pulse-completed';
            case 'In Progress': return 'pulse-in-progress';
            case 'Stopped': return 'pulse-stopped';
            default: return 'pulse-stopped';
        }
    };

    return (
        <div className="section-card">
            <div className="section-header">
                <h3>Recent Repairs</h3>
                <span
                    className="section-action"
                    onClick={() => onNavigate?.('Repairs')}
                    style={{ cursor: 'pointer' }}
                >
                    View All
                </span>
            </div>
            <div className="activity-list">
                {recentRepairs.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No repairs yet — create your first repair to see activity here
                    </div>
                ) : (
                    recentRepairs.map((repair) => (
                        <div key={repair.id} className="activity-item">
                            <div className="activity-info">
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                                    {repair.customer}
                                </h4>
                                <div className="activity-details" style={{ marginTop: '0.35rem' }}>
                                    <span className="activity-detail-item">
                                        <Smartphone size={13} color="var(--text-secondary)" /> {repair.device}
                                    </span>
                                </div>
                            </div>

                            <div className="activity-status-cost">
                                <div className="activity-cost">
                                    {repair.cost}
                                </div>
                                <div className="activity-meta" title={repair.status}>
                                    <div className="status-indicator">
                                        <div className={`pulse-dot ${getStatusColor(repair.status)}`}></div>
                                        <span>{repair.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
