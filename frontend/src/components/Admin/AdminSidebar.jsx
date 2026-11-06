import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FaClipboardList, FaSignOutAlt, FaStore, FaUser, FaBoxOpen, FaSyncAlt } from 'react-icons/fa'

const AdminSidebar = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    navigate("/")
  }
  return (
    <div className='p-6'>
      <div className=' mb-6'>
        <Link to='/' className="text-2xl text-ktr-skin font-medium">Shop</Link>
      </div>
      <Link to='/admin' className='text-xl font-medium mb-6 text-ktr-skin text-center'>Admin Dashboard</Link>
      <nav className='flex flex-col space-y-2'>
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? "bg-gray-700 text-ktr-skin py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
          <FaUser />
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => isActive ? "bg-gray-700 text-white text-ktr-skin py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
          <FaBoxOpen />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "bg-gray-700 text-ktr-skin py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
          <FaClipboardList />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/admin/subscriptions" className={({ isActive }) => isActive ? "bg-gray-700 text-ktr-skin py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
          <FaSyncAlt />
          <span>Subscriptions</span>
        </NavLink>
        <NavLink to="/admin/shop" className={({ isActive }) => isActive ? "bg-gray-700 text-ktr-skin py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
          <FaStore />
          <span>Shop</span>
        </NavLink>
      </nav>
      <div className='mt-6'>
        <button onClick={handleLogout} className='w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 cursor-pointer'>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
