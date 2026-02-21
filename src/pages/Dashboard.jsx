import React, { useMemo, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
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
    const [chartMode, setChartMode] = useState('Revenue'); // 'Revenue' | 'Repairs' | 'Profit'

    const totalRevenue = useMemo(() => {
        return repairs.reduce((sum, r) => sum + parseFloat((r.cost || '$0').replace('$', '')), 0);
    }, [repairs]);

    const totalProfit = useMemo(() => {
        return repairs.reduce((sum, r) => {
            const revenue = parseFloat((r.cost || '$0').replace('$', ''));
            const parts = parseFloat((r.partsCost || '$0').replace('$', ''));
            return sum + (revenue - parts);
        }, 0);
    }, [repairs]);

    const activeRepairs = useMemo(() => {
        return repairs.filter(r => r.status !== 'Completed').length;
    }, [repairs]);

    const completedRepairs = useMemo(() => {
        return repairs.filter(r => r.status === 'Completed').length;
    }, [repairs]);

    // Build chart data from real repairs grouped by date
    const chartData = useMemo(() => {
        if (repairs.length === 0) return [];
        const byDate = {};
        repairs.forEach(r => {
            const key = r.date || 'Unknown';
            if (!byDate[key]) byDate[key] = {
                name: key,
                shortDate: key !== 'Unknown' ? key.split('/').slice(0, 2).join('/') : key, // e.g. "20/2"
                revenue: 0,
                profit: 0,
                repairs: 0,
                rawDate: new Date(key)
            };
            const rev = parseFloat((r.cost || '$0').replace('$', ''));
            const part = parseFloat((r.partsCost || '$0').replace('$', ''));

            byDate[key].revenue += rev;
            byDate[key].profit += (rev - part);
            byDate[key].repairs += 1;
        });

        const sortedData = Object.values(byDate).sort((a, b) => {
            if (a.name === 'Unknown') return -1;
            if (b.name === 'Unknown') return 1;
            return a.rawDate - b.rawDate;
        });

        let accumulatedRevenue = 0;
        let accumulatedProfit = 0;
        let accumulatedRepairs = 0;

        return sortedData.map((data) => {
            accumulatedRevenue += data.revenue;
            accumulatedProfit += data.profit;
            accumulatedRepairs += data.repairs;

            return {
                ...data, // Keep raw parts if needed, but override with accumulated
                revenue: accumulatedRevenue,
                profit: accumulatedProfit,
                repairs: accumulatedRepairs
            };
        }).map(({ rawDate, ...rest }) => rest);
    }, [repairs]);

    return (
        <div className="dashboard-view">
            <div className="dashboard-content">
                <div className="metrics-grid">
                    <div className="animate-fade-in-up delay-100" onClick={() => onNavigate?.('Reports')} style={{ cursor: 'pointer' }}>
                        <MetricCard
                            title="Total Revenue"
                            value={`$${totalRevenue.toLocaleString()}`}
                            icon={DollarSign}
                            gradient="linear-gradient(to right, #10b981, #34d399)"
                        />
                    </div>
                    <div className="animate-fade-in-up delay-200" onClick={() => onNavigate?.('Repairs')} style={{ cursor: 'pointer' }}>
                        <MetricCard
                            title="Active Repairs"
                            value={String(activeRepairs)}
                            icon={Clock}
                            gradient="linear-gradient(to right, #38bdf8, #818cf8)"
                        />
                    </div>
                    <div className="animate-fade-in-up delay-300">
                        <MetricCard
                            title="Net Profit"
                            value={`$${totalProfit.toLocaleString()}`}
                            icon={DollarSign}
                            gradient="linear-gradient(to right, #a855f7, #c084fc)"
                        />
                    </div>
                    <div className="animate-fade-in-up delay-400" onClick={() => onNavigate?.('Repairs')} style={{ cursor: 'pointer' }}>
                        <MetricCard
                            title="Completed"
                            value={String(completedRepairs)}
                            icon={PenTool}
                            gradient="linear-gradient(to right, #ec4899, #f472b6)"
                        />
                    </div>
                </div>

                <div className="dashboard-sections">
                    <div className="animate-fade-in-up delay-300" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
                        <div className="section-card">
                            <div className="section-header">
                                <h3>{chartMode === 'Revenue' ? 'Revenue' : chartMode === 'Repairs' ? 'Repairs' : 'Net Profit'} Overview</h3>
                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        if (chartMode === 'Revenue') setChartMode('Repairs');
                                        else if (chartMode === 'Repairs') setChartMode('Profit');
                                        else setChartMode('Revenue');
                                    }}
                                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                                >
                                    Switch to {chartMode === 'Revenue' ? 'Repairs' : chartMode === 'Repairs' ? 'Net Profit' : 'Revenue'}
                                </button>
                            </div>
                            <div style={{ flex: 1, width: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {chartData.length === 0 ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                                        No repair data yet — add repairs to see the chart
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
                                        <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }} style={{ outline: 'none' }}>
                                            <defs>
                                                <linearGradient id="colorRevenueBar" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorProfitBar" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorRepairsBar" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f472b6" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(51, 65, 85, 0.4)" />
                                            <XAxis
                                                dataKey="shortDate"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                dy={15}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                tickFormatter={chartMode === 'Repairs' ? undefined : (value) => `$${value}`}
                                                width={60}
                                            />
                                            <Tooltip
                                                cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2, fill: 'transparent' }}
                                                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                                itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                                            />
                                            {chartMode === 'Revenue' && (
                                                <Area
                                                    type="monotone"
                                                    name="Revenue"
                                                    dataKey="revenue"
                                                    stroke="#38bdf8"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorRevenueBar)"
                                                    animationDuration={1500}
                                                    activeDot={{ r: 6, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 2 }}
                                                />
                                            )}
                                            {chartMode === 'Profit' && (
                                                <Area
                                                    type="monotone"
                                                    name="Net Profit"
                                                    dataKey="profit"
                                                    stroke="#10b981"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorProfitBar)"
                                                    animationDuration={1500}
                                                    activeDot={{ r: 6, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }}
                                                />
                                            )}
                                            {chartMode === 'Repairs' && (
                                                <Area
                                                    type="monotone"
                                                    name="Repairs"
                                                    dataKey="repairs"
                                                    stroke="#f472b6"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorRepairsBar)"
                                                    animationDuration={1500}
                                                    activeDot={{ r: 6, fill: '#f472b6', stroke: '#0f172a', strokeWidth: 2 }}
                                                />
                                            )}
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="animate-fade-in-up delay-400" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
                        <RecentActivity onNavigate={onNavigate} repairs={repairs} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
