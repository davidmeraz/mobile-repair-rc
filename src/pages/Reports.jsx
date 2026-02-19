import React, { useState } from 'react';
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
    Download,
    Calendar,
    FileText
} from 'lucide-react';

const COLORS = ['#38bdf8', '#818cf8', '#a78bfa', '#f472b6'];

const deviceData = [
    { name: 'iPhone', value: 400 },
    { name: 'Samsung', value: 300 },
    { name: 'iPad', value: 200 },
    { name: 'Other', value: 100 },
];

const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 7000 },
];

const Reports = () => {
    return (
        <div className="repairs-view">
            <div className="repairs-header">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Performance Analytics</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Calendar size={16} /> Last 6 Months
                    </button>

                    <button className="btn-primary" style={{
                        background: 'var(--accent)',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}>
                        <Download size={18} />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>

            <div className="dashboard-sections" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="section-card">
                    <div className="section-header">
                        <h3>Revenue by Month</h3>
                    </div>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
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
                    </div>
                </div>

                <div className="section-card">
                    <div className="section-header">
                        <h3>Repairs by Manufacturer</h3>
                    </div>
                    <div style={{ height: 300, width: '100%' }}>
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
                    </div>
                </div>
            </div>

            <div className="section-card" style={{ marginTop: '1.5rem' }}>
                <div className="section-header">
                    <h3>Generated Reports</h3>
                </div>
                <div className="activity-list">
                    <div className="activity-item" style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: 'var(--accent)' }}>
                                <FileText size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 500 }}>Q3 Financial Summary</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Generated on Oct 1, 2024</div>
                            </div>
                        </div>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>Download</button>
                    </div>

                    <div className="activity-item" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: 'var(--accent)' }}>
                                <FileText size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 500 }}>September Inventory Audit</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Generated on Sep 30, 2024</div>
                            </div>
                        </div>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>Download</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
