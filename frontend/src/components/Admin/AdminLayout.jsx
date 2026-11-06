import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import AdminSidebar from './AdminSidebar'
import { Outlet } from 'react-router-dom'
const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }
    return (
        <div className='min-h-screen flex flex-col md:flex-row relative bg-booksdos'>
            <div className='flex md:hidden p-4 bg-ktr-blue text-white z-20'>
                <button onClick={toggleSidebar}>
                    <FaBars size={24} className='text-ktr-blue' />
                </button>
                <h1 className='ml-4 text-xl text-ktr-blue font-medium'>Admin Dashboard</h1>
            </div>
            {/*overlay for mobile sidebar*/}
            {isSidebarOpen && (
                <div className='fixed inset-0 z-1 bg-opacity-50 md:hidden'
                    onClick={toggleSidebar}></div>
            )}
            {/*sidebar */}
            <div className={`bg-ktr-blue w-64 min-h-screen text-white absolute md:relative transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}>
                {/*sidebar */}
                <AdminSidebar />
            </div>
            {/* Main content */}
            <div className='flex-grow p-6 overflow-auto'>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout