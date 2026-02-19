import React from 'react';

const RecentActivity = () => {
    const activities = [
        { id: 1, title: 'Screen Replacement', client: 'J. Doe', model: 'iPhone 14', cost: '$120', status: 'completed' },
        { id: 2, title: 'Battery Change', client: 'A. Smith', model: 'Samsung S22', cost: '$80', status: 'pending' },
        { id: 3, title: 'Water Damage', client: 'R. Roe', model: 'Pixel 7', cost: 'Quote', status: 'urgent' },
        { id: 4, title: 'Charging Port', client: 'K. West', model: 'iPad Air 5', cost: '$65', status: 'completed' }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed': return 'status-completed';
            case 'pending': return 'status-pending';
            case 'urgent': return 'status-urgent';
            default: return '';
        }
    };

    return (
        <div className="section-card">
            <div className="section-header">
                <h3>Recent Repairs</h3>
                <span className="section-action">View All</span>
            </div>
            <div className="activity-list">
                {activities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                        <div className="activity-info">
                            <h4>{activity.title}</h4>
                            <p>{activity.client} • {activity.model}</p>
                        </div>
                        <div className="activity-meta">
                            <span className={`status-badge ${getStatusBadge(activity.status)}`}>
                                {activity.status}
                            </span>
                        </div>
                        <div className="activity-cost" style={{ fontWeight: 600, marginLeft: 'auto' }}>
                            {activity.cost}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
