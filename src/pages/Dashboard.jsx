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

const Dashboard = ({ onNavigate, repairs = [], customers = [], parts = [] }) => {
    const [chartMode, setChartMode] = useState('Revenue'); // 'Revenue' | 'Repairs' | 'Profit'

    const availableMonths = useMemo(() => {
        const months = new Set();
        repairs.forEach(r => {
            if (r.status === 'Completed' && r.date) {
                try {
                    const d = new Date(r.date);
                    if (!isNaN(d.getTime())) {
                        months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
                    }
                } catch (e) { }
            }
        });
        const sorted = Array.from(months).sort().reverse();
        if (sorted.length === 0) {
            const d = new Date();
            sorted.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        }
        return sorted;
    }, [repairs]);

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });

    const formatMonthLabel = (yyyymm) => {
        const [y, m] = yyyymm.split('-');
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, 1);
        return dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const totalRevenue = useMemo(() => {
        return repairs.filter(r => r.status === 'Completed').reduce((sum, r) => sum + parseFloat((r.cost || '$0').replace('$', '')), 0);
    }, [repairs]);

    const totalProfit = useMemo(() => {
        return repairs.filter(r => r.status === 'Completed').reduce((sum, r) => {
            const revenue = parseFloat(String(r.cost || '$0').replace('$', ''));

            // Calculate parts cost from linked inventory
            let partsCostNum = 0;
            if (r.usedPartsIds && r.usedPartsIds.length > 0) {
                const linkedParts = parts.filter(p => r.usedPartsIds.includes(p.id));
                partsCostNum = linkedParts.reduce((pSum, p) => pSum + parseFloat(p.cost || 0), 0);
            } else if (r.partsCost) {
                // Fallback for mock data or manual override
                partsCostNum = parseFloat(String(r.partsCost).replace('$', ''));
            }

            return sum + (revenue - partsCostNum);
        }, 0);
    }, [repairs, parts]);

    const activeRepairs = useMemo(() => {
        return repairs.filter(r => r.status !== 'Completed').length;
    }, [repairs]);

    const completedRepairs = useMemo(() => {
        return repairs.filter(r => r.status === 'Completed').length;
    }, [repairs]);

    // Build chart data from real completed repairs grouped by date
    const chartData = useMemo(() => {
        const completed = repairs.filter(r => {
            if (r.status !== 'Completed') return false;
            if (!r.date) return false;
            try {
                const dateObj = new Date(r.date);
                const monthStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
                return monthStr === selectedMonth;
            } catch { return false; }
        });

        if (completed.length === 0) return [];
        const byDate = {};
        completed.forEach(r => {
            const key = r.date || 'Unknown';
            if (!byDate[key]) byDate[key] = {
                name: key,
                shortDate: key !== 'Unknown' ? key.split('/').slice(0, 2).join('/') : key, // e.g. "20/2"
                revenue: 0,
                profit: 0,
                repairs: 0,
                rawDate: new Date(key)
            };
            const rev = parseFloat(String(r.cost || '$0').replace('$', ''));

            // Calculate parts cost from linked inventory
            let partsCostNum = 0;
            if (r.usedPartsIds && r.usedPartsIds.length > 0) {
                const linkedParts = parts.filter(p => r.usedPartsIds.includes(p.id));
                partsCostNum = linkedParts.reduce((pSum, p) => pSum + parseFloat(p.cost || 0), 0);
            } else if (r.partsCost) {
                partsCostNum = parseFloat(String(r.partsCost).replace('$', ''));
            }

            byDate[key].revenue += rev;
            byDate[key].profit += (rev - partsCostNum);
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
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <select
                                        className="form-select"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', height: 'auto', minWidth: '130px', margin: 0 }}
                                    >
                                        {availableMonths.map(m => (
                                            <option key={m} value={m}>{formatMonthLabel(m)}</option>
                                        ))}
                                    </select>
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
