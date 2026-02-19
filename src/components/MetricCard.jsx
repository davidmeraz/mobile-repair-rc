import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const MetricCard = ({ title, value, trend, icon: Icon = Activity }) => {
    const isPositive = trend?.type === 'up';

    return (
        <div className="metric-card">
            <div className="metric-header">
                <span>{title}</span>
                <div style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    padding: 8,
                    borderRadius: 8,
                    color: 'var(--accent)'
                }}>
                    <Icon size={20} />
                </div>
            </div>

            <div className="metric-value">
                {value}
            </div>

            {trend && (
                <div className={`metric-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>{trend.value} from last month</span>
                </div>
            )}
        </div>
    );
};

export default MetricCard;
