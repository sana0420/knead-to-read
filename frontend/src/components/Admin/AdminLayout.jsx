import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className='min-h-screen flex flex-col md:flex-row relative bg-booksdos'>
            {/* Mobile Top Bar with high-contrast text and icon */}
            <div className='flex md:hidden items-center justify-between p-4 bg-ktr-blue text-ktr-skin z-20 shadow-md'>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={toggleSidebar}
                        aria-label="Toggle admin navigation"
                        className='p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer'
                    >
                        <FaBars size={20} className='text-ktr-skin' />
                    </button>
                    <h1 className='text-lg font-bold text-ktr-skin'>Admin Dashboard</h1>
                </div>
            </div>

            {/* Backdrop Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className='fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-xs transition-opacity'
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar with slide-in on mobile, static on desktop */}
            <div className={`bg-ktr-blue w-64 min-h-screen text-white fixed md:static inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 z-40 shadow-xl md:shadow-none flex-shrink-0`}>
                <AdminSidebar closeSidebar={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main content area */}
            <div className='flex-grow min-w-0 overflow-x-hidden'>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
