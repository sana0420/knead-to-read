import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaClipboardList, FaSignOutAlt, FaStore, FaUser, FaBoxOpen, FaSyncAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const AdminSidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    if (closeSidebar) closeSidebar();
    navigate("/login");
  };

  const handleLinkClick = () => {
    if (closeSidebar) closeSidebar();
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <div className='p-6 flex flex-col min-h-screen justify-between'>
      <div>
        <div className='mb-6 flex items-center justify-between'>
          <Link to='/' onClick={handleLinkClick} className="text-2xl text-ktr-skin font-medium hover:underline flex items-center gap-2">
            ← <span>Shop</span>
          </Link>
          {closeSidebar && (
            <button
              onClick={closeSidebar}
              className='md:hidden p-1 text-gray-400 hover:text-white rounded transition'
              aria-label="Close sidebar"
            >
              <IoMdClose size={22} />
            </button>
          )}
        </div>

        <Link to='/admin' onClick={handleLinkClick} className='block text-xl font-medium mb-4 text-ktr-skin text-center'>
          Admin Dashboard
        </Link>

        {/* Admin User Mini Card */}
        <div className='mb-6 p-3 bg-gray-800/80 rounded-xl flex items-center gap-3 border border-gray-700'>
          <div className='w-9 h-9 rounded-full bg-ktr-green text-ktr-skin flex items-center justify-center font-bold text-sm flex-shrink-0'>
            {userInitial}
          </div>
          <div className='overflow-hidden text-left'>
            <p className='text-xs font-bold text-white truncate'>{user?.name || 'Admin User'}</p>
            <span className='inline-block text-[10px] font-semibold text-purple-300'>
              Store Admin
            </span>
          </div>
        </div>

        <nav className='flex flex-col space-y-2'>
          <NavLink
            to="/admin/users"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-ktr-skin py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaUser />
            <span>Users</span>
          </NavLink>
          <NavLink
            to="/admin/products"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white text-ktr-skin py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaBoxOpen />
            <span>Products</span>
          </NavLink>
          <NavLink
            to="/admin/orders"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-ktr-skin py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaClipboardList />
            <span>Orders</span>
          </NavLink>
          <NavLink
            to="/admin/subscriptions"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-ktr-skin py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaSyncAlt />
            <span>Subscriptions</span>
          </NavLink>
          <NavLink
            to="/admin/shop"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-ktr-skin py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaStore />
            <span>Shop</span>
          </NavLink>
        </nav>
      </div>

      <div className='mt-6 pt-4 border-t border-gray-700/60'>
        <button
          onClick={handleLogout}
          className='w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 cursor-pointer transition'
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
