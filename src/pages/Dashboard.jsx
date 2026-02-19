import React from 'react';
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

const data = [
    { name: 'Mon', revenue: 4000, repairs: 24 },
    { name: 'Tue', revenue: 3000, repairs: 18 },
    { name: 'Wed', revenue: 2000, repairs: 12 },
    { name: 'Thu', revenue: 2780, repairs: 39 },
    { name: 'Fri', revenue: 1890, repairs: 48 },
    { name: 'Sat', revenue: 2390, repairs: 38 },
    { name: 'Sun', revenue: 3490, repairs: 43 },
];

const Dashboard = () => {
    return (
        <div className="dashboard-view">

            <div className="metrics-grid">
                <MetricCard
                    title="Total Revenue"
                    value="$12,450"
                    trend={{ value: '+12.5%', type: 'up' }}
                    icon={DollarSign}
                />
                <MetricCard
                    title="Active Repairs"
                    value="24"
                    trend={{ value: '-2.4%', type: 'down' }}
                    icon={Clock}
                />
                <MetricCard
                    title="New Customers"
                    value="18"
                    trend={{ value: '+8.2%', type: 'up' }}
                    icon={Users}
                />
                <MetricCard
                    title="Completed"
                    value="156"
                    trend={{ value: '+24%', type: 'up' }}
                    icon={PenTool}
                />
            </div>

            <div className="dashboard-sections">
                <div className="section-card">
                    <div className="section-header">
                        <h3>Revenue Overview</h3>
                        <select style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', outline: 'none' }}>
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
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
                    </div>
                </div>

                <RecentActivity />
            </div>
        </div>
    );
};

export default Dashboard;
