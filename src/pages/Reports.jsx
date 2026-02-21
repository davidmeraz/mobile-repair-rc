import React, { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {
    Calendar,
    FileText,
    Download,
    DollarSign,
    PenTool,
    CheckCircle,
    Activity,
    BarChart2,
    PieChart as PieChartIcon,
    ShoppingCart,
    TrendingUp
} from 'lucide-react';

const COLORS = ['#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#f87171'];

const Reports = ({ repairs = [], parts = [] }) => {
    // Revenue by date (bar chart)
    const revenueData = useMemo(() => {
        const completed = repairs.filter(r => r.status === 'Completed');
        if (completed.length === 0) return [];
        const byDate = {};
        completed.forEach(r => {
            const key = r.date || 'Unknown';
            if (!byDate[key]) byDate[key] = { date: key, revenue: 0 };
            byDate[key].revenue += parseFloat((r.cost || '$0').replace('$', ''));
        });
        return Object.values(byDate).reverse();
    }, [repairs]);

    // Repairs by device brand (pie chart)
    const deviceData = useMemo(() => {
        if (repairs.length === 0) return [];
        const byBrand = {};
        repairs.forEach(r => {
            // Extract brand from device name (first word)
            const brand = (r.device || 'Other').split(' ')[0];
            byBrand[brand] = (byBrand[brand] || 0) + 1;
        });
        return Object.entries(byBrand).map(([name, value]) => ({ name, value }));
    }, [repairs]);

    // Summary stats
    const totalRevenue = repairs.filter(r => r.status === 'Completed').reduce((sum, r) => sum + parseFloat((r.cost || '$0').replace('$', '')), 0);

    const totalPartsCost = useMemo(() => {
        return repairs.filter(r => r.status === 'Completed').reduce((sum, r) => {
            let pCost = 0;
            if (r.usedPartsIds && r.usedPartsIds.length > 0) {
                const linked = parts.filter(p => r.usedPartsIds.includes(p.id));
                pCost = linked.reduce((pSum, p) => pSum + parseFloat(p.cost || 0), 0);
            } else if (r.partsCost) {
                pCost = parseFloat(String(r.partsCost).replace('$', ''));
            }
            return sum + pCost;
        }, 0);
    }, [repairs, parts]);

    const netProfit = totalRevenue - totalPartsCost;

    const totalRepairs = repairs.length;
    const completedRepairs = repairs.filter(r => r.status === 'Completed').length;

    const handleDownloadSummary = () => {
        const content = [
            `Mobile Repair RC — Report Summary`,
            `Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
            ``,
            `--- Summary ---`,
            `Total Repairs: ${totalRepairs}`,
            `Completed Repairs: ${completedRepairs}`,
            `Total Revenue: $${totalRevenue.toFixed(2)}`,
            `Parts Cost: $${totalPartsCost.toFixed(2)}`,
            `Net Profit: $${netProfit.toFixed(2)}`,
            ``,
            `--- Repair Details ---`,
            ...repairs.map(r => `${r.id} | ${r.customer} | ${r.device} | ${r.problem} | ${r.status} | ${r.cost} | ${r.date}`),
        ].join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `repair_report_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="repairs-view">
            <div className="repairs-header">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Performance Analytics</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={handleDownloadSummary}>
                        <Download size={16} /> Download Report
                    </button>
                </div>
            </div>

            {/* Summary metrics */}
            <div className="metrics-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: 'var(--accent)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gross Revenue</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#ef4444' }}>
                        <ShoppingCart size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Parts Cost</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${totalPartsCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Net Profit</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '8px', color: '#818cf8' }}>
                        <PenTool size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Repairs</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalRepairs}</div>
                    </div>
                </div>
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Completed</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{completedRepairs}</div>
                    </div>
                </div>
                <div className="metric-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(244, 114, 182, 0.1)', borderRadius: '8px', color: '#f472b6' }}>
                        <Activity size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Completion Rate</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalRepairs > 0 ? Math.round((completedRepairs / totalRepairs) * 100) : 0}%</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-sections" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="section-card">
                    <div className="section-header">
                        <h3>Revenue by Date</h3>
                    </div>
                    <div style={{ height: 300, width: '100%' }}>
                        {revenueData.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', gap: '0.5rem' }}>
                                <BarChart2 size={32} style={{ opacity: 0.5 }} />
                                <span style={{ fontSize: '0.9rem' }}>No data yet — add completed repairs to see revenue</span>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                        contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Bar dataKey="revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="section-card">
                    <div className="section-header">
                        <h3>Repairs by Device Brand</h3>
                    </div>
                    <div style={{ height: 300, width: '100%' }}>
                        {deviceData.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', gap: '0.5rem' }}>
                                <PieChartIcon size={32} style={{ opacity: 0.5 }} />
                                <span style={{ fontSize: '0.9rem' }}>No data yet — add completed repairs for device breakdown</span>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
