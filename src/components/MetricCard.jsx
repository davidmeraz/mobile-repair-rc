import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const MetricCard = ({ title, value, trend, icon: Icon = Activity, gradient, colorClass }) => {
    const isPositive = trend?.type === 'up';

    // Create inline styles for the colorful icon background based on custom colors or fallback
    const iconBgStyle = colorClass ? {} : {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)'
    };

    return (
        <div
            className="metric-card"
            style={{ '--card-gradient': gradient || 'linear-gradient(90deg, #38bdf8, #818cf8)' }}
        >
            <div className="metric-header">
                <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
                <div style={{
                    ...iconBgStyle,
                    padding: 10,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                }} className={colorClass}>
                    <Icon size={22} color={colorClass ? 'currentColor' : 'white'} />
                </div>
            </div>

            <div className="metric-value" style={{ fontSize: '2.5rem', marginTop: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                {value}
            </div>

            {trend && (
                <div className={`metric-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span style={{ fontWeight: 500 }}>{trend.value} <span style={{ color: 'var(--text-secondary)' }}>from last month</span></span>
                </div>
            )}
        </div>
    );
};

export default MetricCard;
