import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    DollarSign,
    Clock,
    Users,
    PenTool
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import RecentActivity from '../components/RecentActivity';

const Dashboard = ({ onNavigate, repairs = [], customers = [] }) => {
    // Compute metrics from real data
    const totalRevenue = useMemo(() => {
        return repairs.reduce((sum, r) => sum + parseFloat((r.cost || '$0').replace('$', '')), 0);
    }, [repairs]);

    const activeRepairs = useMemo(() => {
        return repairs.filter(r => r.status !== 'Completed').length;
    }, [repairs]);

    const completedRepairs = useMemo(() => {
        return repairs.filter(r => r.status === 'Completed').length;
    }, [repairs]);

    const totalCustomers = customers.length;

    // Build chart data from real repairs grouped by date
    const chartData = useMemo(() => {
        if (repairs.length === 0) return [];
        const byDate = {};
        repairs.forEach(r => {
            const key = r.date || 'Unknown';
            if (!byDate[key]) byDate[key] = { name: key, revenue: 0, repairs: 0 };
            byDate[key].revenue += parseFloat((r.cost || '$0').replace('$', ''));
            byDate[key].repairs += 1;
        });
        return Object.values(byDate).reverse();
    }, [repairs]);

    return (
        <div className="dashboard-view">

            <div className="metrics-grid">
                <div onClick={() => onNavigate?.('Reports')} style={{ cursor: 'pointer' }}>
                    <MetricCard
                        title="Total Revenue"
                        value={`$${totalRevenue.toLocaleString()}`}
                        icon={DollarSign}
                    />
                </div>
                <div onClick={() => onNavigate?.('Repairs')} style={{ cursor: 'pointer' }}>
                    <MetricCard
                        title="Active Repairs"
                        value={String(activeRepairs)}
                        icon={Clock}
                    />
                </div>
                <div onClick={() => onNavigate?.('Customers')} style={{ cursor: 'pointer' }}>
                    <MetricCard
                        title="Total Customers"
                        value={String(totalCustomers)}
                        icon={Users}
                    />
                </div>
                <div onClick={() => onNavigate?.('Repairs')} style={{ cursor: 'pointer' }}>
                    <MetricCard
                        title="Completed"
                        value={String(completedRepairs)}
                        icon={PenTool}
                    />
                </div>
            </div>

            <div className="dashboard-sections">
                <div className="section-card">
                    <div className="section-header">
                        <h3>Revenue Overview</h3>
                    </div>
                    <div style={{ height: 300, width: '100%' }}>
                        {chartData.length === 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                                No repair data yet — add repairs to see the chart
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#38bdf8"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <RecentActivity onNavigate={onNavigate} repairs={repairs} />
            </div>
        </div>
    );
};

export default Dashboard;
