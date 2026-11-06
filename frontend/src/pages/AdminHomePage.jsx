import React, { useState } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [dateRange, setDateRange] = useState('This Week');

  // KPI Metrics Data
  const metrics = [
    { label: 'Estimated MRR', value: '$1,425.00', change: '+12.4%', isPositive: true, note: 'vs last month' },
    { label: 'Weekly Subs', value: '42', change: '+3.1%', isPositive: true, note: 'active plans' },
    { label: 'Bi-Weekly Subs', value: '18', change: '-1.2%', isPositive: false, note: 'active plans' },
    { label: 'Monthly Subs', value: '85', change: '+8.7%', isPositive: true, note: 'active plans' },
    { label: 'Quarterly Subs', value: '12', change: '0.0%', isPositive: true, note: 'active plans' },
  ];

  // Daily Operational Tasks
  const bakeList = [
    { id: 1, item: 'Pain au Chocolat', source: 'Subscription & Standalone', target: 34, status: 'In Progress' },
    { id: 2, item: 'Butter Croissant', source: 'Subscription Fulfillment', target: 15, status: 'Pending' },
    { id: 3, item: 'Cinnamon Roll', source: 'Standalone Order', target: 12, status: 'Completed' },
  ];

  // Inventory Alerts
  const stockAlerts = [
    { id: 1, name: 'Pride and Prejudice', category: 'Library', stock: 8, threshold: 15 },
    { id: 2, name: 'Pain au Chocolat', category: 'Oven', stock: 5, threshold: 20 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">

      {/* 1. PERSISTENT SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
              MC
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Mission Control</h2>
              <p className="text-[11px] text-slate-400">Inventory & Operations</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {['Overview', 'Inventory', 'Orders', 'Subscriptions', 'Analytics', 'Settings'].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${activeTab === item
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
              >
                <span>{item}</span>
                {item === 'Inventory' && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">2</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Admin User</p>
              <p className="text-[10px] text-slate-400">admin@bakery.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* 2. GLOBAL TOP HEADER & CONTROLS */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{activeTab} Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time breakdown of performance metrics and operational queues.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Date Range Selector */}
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

            {/* Quick Action Button */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-sm">
              + Add Product
            </button>
          </div>
        </header>

        <main className="p-8 space-y-8">

          {/* 3. KPI METRIC CARDS STRIP */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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

          {/* 4. PRIMARY ANALYTICS & OPERATIONS GRID */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Daily Task List (2/3 Width) */}
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
                    {bakeList.map((row) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actionable Low Stock Sidebar Widget (1/3 Width) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">⚠️ Low Stock Alerts</h3>
                    <p className="text-xs text-slate-500">Items below minimum stock threshold.</p>
                  </div>
                  <span className="bg-red-100 text-red-700 font-bold text-xs px-2 py-0.5 rounded-full">
                    2 Items
                  </span>
                </div>

                <div className="space-y-3">
                  {stockAlerts.map((item) => (
                    <div key={item.id} className="p-3.5 bg-red-50/60 rounded-xl border border-red-100 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                        <p className="text-[11px] text-slate-500">Category: {item.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                          {item.stock} left
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">Min: {item.threshold}</p>
                      </div>
                    </div>
                  ))}
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