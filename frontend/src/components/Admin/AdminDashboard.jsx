import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../../redux/slices/adminAnalyticsSlice'; // Adjust path as needed

const AdminDashboard = () => {
    const dispatch = useDispatch();

    // Local UI states
    const [activeTab, setActiveTab] = useState('Overview');
    const [dateRange, setDateRange] = useState('This Week');

    // Extract slice state from Redux store
    const analytics = useSelector((state) => state.adminAnalytics) || {};
    const subscriptions = Array.isArray(analytics.subscriptions) ? analytics.subscriptions : [];
    const todaysOrders = Array.isArray(analytics.todaysOrders) ? analytics.todaysOrders : [];
    const products = Array.isArray(analytics.products) ? analytics.products : [];
    const { loading, error } = analytics;

    // Fetch dashboard data on component mount
    useEffect(() => {
        dispatch(fetchDashboardData());
    }, [dispatch]);

    // Derive KPI metrics dynamically from Redux store data
    const activeSubsCount = subscriptions.filter((s) => s.status === 'active').length;
    const metrics = [
        { label: 'Estimated MRR', value: `$${activeSubsCount * 30}`, change: '+12.4%', isPositive: true, note: 'vs last month' },
        { label: 'Total Subscriptions', value: subscriptions.length.toString(), change: '+3.1%', isPositive: true, note: 'active plans' },
        { label: "Today's Orders", value: todaysOrders.length.toString(), change: '+8.7%', isPositive: true, note: 'fulfillment queue' },
        { label: 'Total Catalog Products', value: products.length.toString(), change: '0.0%', isPositive: true, note: 'active SKUs' },
    ];

    // Map today's API orders to the Bake List operational queue
    const bakeList = todaysOrders.flatMap((order, idx) => {
        if (Array.isArray(order.orderItems) && order.orderItems.length > 0) {
            return order.orderItems.map((item, itemIdx) => ({
                id: `${order._id || idx}-${itemIdx}`,
                item: item.name || 'Custom Order',
                source: order.paymentMethod || 'Subscription & Standalone',
                target: item.quantity || 1,
                status: order.status || 'Pending',
            }));
        }

        return [{
            id: order._id || idx,
            item: order.productName || order.item || 'Custom Order',
            source: order.orderType || 'Subscription & Standalone',
            target: order.quantity || 1,
            status: order.status || 'Pending',
        }];
    });

    // Filter low-stock products threshold dynamically
    const stockAlerts = products.filter((p) => p.stock < (p.threshold || 10));

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading dashboard analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
                    <p className="font-bold">Failed to load analytics</p>
                    <p className="text-xs mt-1">{error}</p>
                    <button
                        onClick={() => dispatch(fetchDashboardData())}
                        className="mt-3 bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

                {/* GLOBAL TOP HEADER & CONTROLS */}
                <header className="bg-ktr-skin border-b border-slate-200 px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{activeTab} Dashboard</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Real-time breakdown of performance metrics and operational queues.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>Today</option>
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>Quarter to Date</option>
                        </select>

                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-sm">
                            + Add Product
                        </button>
                    </div>
                </header>

                <main className="p-8 space-y-8">

                    {/* KPI METRIC CARDS STRIP */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {metrics.map((m, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                                <div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</p>
                                    <p className="text-2xl font-extrabold text-slate-900 mt-2">{m.value}</p>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className={`text-xs font-bold ${m.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {m.change}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{m.note}</span>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* PRIMARY ANALYTICS & OPERATIONS GRID */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Daily Task List */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">🥐 Today’s Bakery Bake Queue</h3>
                                    <p className="text-xs text-slate-500">Scheduled batch targets for subscription and retail orders.</p>
                                </div>
                                <button className="text-xs text-blue-600 font-semibold hover:underline">
                                    Print Bake Sheet
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider">
                                        <tr>
                                            <th className="py-3 px-4 rounded-l-lg">Item Name</th>
                                            <th className="py-3 px-4">Order Source</th>
                                            <th className="py-3 px-4">Batch Target</th>
                                            <th className="py-3 px-4 text-right rounded-r-lg">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {bakeList.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="py-6 text-center text-slate-400">
                                                    No orders queued for today.
                                                </td>
                                            </tr>
                                        ) : (
                                            bakeList.map((row) => (
                                                <tr key={row.id} className="hover:bg-slate-50 transition">
                                                    <td className="py-3.5 px-4 font-semibold text-slate-900">{row.item}</td>
                                                    <td className="py-3.5 px-4 text-slate-500">{row.source}</td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                            {row.target} units
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${row.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                            row.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                                                                'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Actionable Low Stock Sidebar Widget */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base">⚠️ Low Stock Alerts</h3>
                                        <p className="text-xs text-slate-500">Items below minimum stock threshold.</p>
                                    </div>
                                    <span className="bg-red-100 text-red-700 font-bold text-xs px-2 py-0.5 rounded-full">
                                        {stockAlerts.length} Items
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {stockAlerts.length === 0 ? (
                                        <p className="text-xs text-slate-400 text-center py-4">All items adequately stocked.</p>
                                    ) : (
                                        stockAlerts.map((item) => (
                                            <div key={item._id || item.id} className="p-3.5 bg-red-50/60 rounded-xl border border-red-100 flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                                                    <p className="text-[11px] text-slate-500">Category: {item.category || 'General'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                                                        {item.stock} left
                                                    </span>
                                                    <p className="text-[10px] text-slate-400 mt-1">Min: {item.threshold || 10}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <button className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg transition shadow-sm">
                                Create Purchase Order
                            </button>
                        </div>

                    </section>

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;