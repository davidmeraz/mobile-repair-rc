import React from 'react';

const RecentActivity = ({ onNavigate, repairs = [] }) => {
    // Show the 5 most recent repairs
    const recentRepairs = repairs.slice(0, 5);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed': return 'status-completed';
            case 'In Progress': return 'status-in-progress';
            case 'Pending': return 'status-pending';
            default: return '';
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
                                <h4>{repair.problem}</h4>
                                <p>{repair.customer} • {repair.device}</p>
                            </div>
                            <div className="activity-meta">
                                <span className={`status-badge ${getStatusBadge(repair.status)}`}>
                                    {repair.status}
                                </span>
                            </div>
                            <div className="activity-cost" style={{ fontWeight: 600, marginLeft: 'auto' }}>
                                {repair.cost}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
