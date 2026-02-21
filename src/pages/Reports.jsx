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
    TrendingUp,
    Wrench,
    CalendarDays
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

    // Calculates total unique days with at least one repair logged
    const activeDays = useMemo(() => {
        const uniqueDates = new Set();
        repairs.forEach(r => {
            if (r.date) uniqueDates.add(r.date);
        });
        return uniqueDates.size;
    }, [repairs]);

    // Calculates total parts that have been flagged as "used"
    const totalUsedParts = parts.filter(p => p.used).length;

    const handleDownloadSummary = () => {
        const content = [
            `Mobile Repair RC — Report Summary`,
            `Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
            ``,
            `--- Summary ---`,
            `Total Repairs: ${totalRepairs}`,
            `Completed Repairs: ${completedRepairs}`,
            `Total Parts Used: ${totalUsedParts}`,
            `Active Days Worked: ${activeDays}`,
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
        <div className="repairs-view" style={{ overflowY: 'auto', paddingBottom: '2rem' }}>
            <style>
                {`
                .reports-header-anim {
                    animation: fadeDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                .anim-card {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: popUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                
                .anim-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    border-color: rgba(255,255,255,0.1);
                }

                .chart-card {
                    opacity: 0;
                    transform: scale(0.98);
                    animation: scaleIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-15px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes popUp {
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes scaleIn {
                    to { opacity: 1; transform: scale(1); }
                }
                `}
            </style>

            <div className="repairs-header reports-header-anim" style={{ marginBottom: '2.5rem', background: 'transparent' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Activity size={28} style={{ color: '#38bdf8' }} />
                        Performance Analytics
                    </h2>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.95rem' }}>Financial overview, active charts and historical metrics.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={handleDownloadSummary} style={{ padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Download size={18} /> Download CSV Report
                    </button>
                </div>
            </div>

            {/* Summary metrics */}
            <div className="metrics-grid" style={{ marginBottom: '2.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div className="metric-card anim-card" style={{ animationDelay: '0.1s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.05))', borderRadius: '12px', color: '#38bdf8', boxShadow: 'inset 0 0 0 1px rgba(56, 189, 248, 0.2)' }}>
                        <DollarSign size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Gross Revenue</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>

                <div className="metric-card anim-card" style={{ animationDelay: '0.15s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))', borderRadius: '12px', color: '#10b981', boxShadow: 'inset 0 0 0 1px rgba(16, 185, 129, 0.2)' }}>
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Net Profit</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>

                <div className="metric-card anim-card" style={{ animationDelay: '0.2s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))', borderRadius: '12px', color: '#ef4444', boxShadow: 'inset 0 0 0 1px rgba(239, 68, 68, 0.2)' }}>
                        <ShoppingCart size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Parts Cost</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>${totalPartsCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>

                <div className="metric-card anim-card" style={{ animationDelay: '0.25s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.2), rgba(129, 140, 248, 0.05))', borderRadius: '12px', color: '#818cf8', boxShadow: 'inset 0 0 0 1px rgba(129, 140, 248, 0.2)' }}>
                        <PenTool size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Repairs</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{totalRepairs}</div>
                    </div>
                </div>

                <div className="metric-card anim-card" style={{ animationDelay: '0.3s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.2), rgba(244, 114, 182, 0.05))', borderRadius: '12px', color: '#f472b6', boxShadow: 'inset 0 0 0 1px rgba(244, 114, 182, 0.2)' }}>
                        <Wrench size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Parts Used</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{totalUsedParts}</div>
                    </div>
                </div>

                <div className="metric-card anim-card" style={{ animationDelay: '0.35s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.05))', borderRadius: '12px', color: '#fbbf24', boxShadow: 'inset 0 0 0 1px rgba(251, 191, 36, 0.2)' }}>
                        <CalendarDays size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Days Worked</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{activeDays}</div>
                    </div>
                </div>

                <div className="metric-card anim-card" style={{ animationDelay: '0.4s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))', borderRadius: '12px', color: '#10b981', boxShadow: 'inset 0 0 0 1px rgba(16, 185, 129, 0.2)' }}>
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Completed</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{completedRepairs}</div>
                    </div>
                </div>

                <div className="metric-card anim-card" style={{ animationDelay: '0.45s', padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.05))', borderRadius: '12px', color: '#38bdf8', boxShadow: 'inset 0 0 0 1px rgba(56, 189, 248, 0.2)' }}>
                        <Activity size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Completion Rate</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{totalRepairs > 0 ? Math.round((completedRepairs / totalRepairs) * 100) : 0}%</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-sections" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="section-card chart-card" style={{ animationDelay: '0.5s', padding: '1.5rem', background: 'linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.8) 100%)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                            <BarChart2 size={18} style={{ color: '#38bdf8' }} /> Revenue Timeline
                        </h3>
                    </div>
                    <div style={{ height: 320, width: '100%' }}>
                        {revenueData.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                                <BarChart2 size={40} style={{ opacity: 0.3 }} />
                                <span style={{ fontSize: '0.95rem' }}>No financial data generated yet.</span>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(value) => `$${value}`}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                                        contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                    />
                                    <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#0284c7" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="section-card chart-card" style={{ animationDelay: '0.6s', padding: '1.5rem', background: 'linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.8) 100%)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                            <PieChartIcon size={18} style={{ color: '#a78bfa' }} /> Brand Demographics
                        </h3>
                    </div>
                    <div style={{ height: 320, width: '100%' }}>
                        {deviceData.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                                <PieChartIcon size={40} style={{ opacity: 0.3 }} />
                                <span style={{ fontSize: '0.95rem' }}>Device breakdown requires completed repairs.</span>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={75}
                                        outerRadius={110}
                                        fill="#8884d8"
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
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
