import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    HiOutlineUser,
    HiOutlineShoppingBag,
    HiBars3BottomRight
} from 'react-icons/hi2';
import SearchBar from './SearchBar.jsx';
import CartDrawer from '../Layout/CartDrawer.jsx';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const { cart } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const cartItemCount = cart?.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    const toggleNavDrawer = () => {
        setNavDrawerOpen(!navDrawerOpen);
    };

    const toggleDrawer = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <>
            <nav className='max-w-[2xl] flex items-center justify-between item py-4 px-6 bg-ktr-pink font-cookie'>
                <div>
                    <Link to="/" className='md:text-4xl text-2xl font-medium text-ktr-green'>Knead to Read</Link>
                </div>
                <div className='hidden md:flex space-x-6'>
                    <Link to="/pairing" className='text-gray-700 hover:text-ktr-green text-3xl font-medium'>
                        Pairings
                    </Link>
                    <Link to="/pairing/oven" className='text-gray-700 hover:text-ktr-green text-3xl font-medium'>
                        Oven
                    </Link>
                    <Link to="/pairing/library" className='text-gray-700 hover:text-ktr-green text-3xl font-medium'>
                        Library
                    </Link>
                    <Link to="/pairing/plans" className='text-gray-700 hover:text-ktr-green text-3xl font-medium'>
                        Subscriptions
                    </Link>
                </div>
                <div className='flex items-center space-x-4'>
                    {/* User profile icon: links to /admin if admin, /profile if customer, or /login if guest */}
                    <Link
                        to={user?.role === 'admin' ? '/admin' : '/profile'}
                        className='hover:text-ktr-green text-sm font-medium uppercase relative p-1'
                        title={user ? (user.role === 'admin' ? `Admin Dashboard (${user.name})` : `Profile (${user.name})`) : "Login / Profile"}
                    >
                        <HiOutlineUser className='h-6 w-6 text-gray-700 hover:text-ktr-green transition' />
                        {user && (
                            <span className="absolute bottom-0 right-0 w-2 h-2 bg-ktr-green rounded-full"></span>
                        )}
                    </Link>

                    <button onClick={toggleDrawer} className="relative hover:text-black">
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-ktr-skin text-ktr-blue text-xs rounded-full px-1.5 font-sans font-bold">
                                {cartItemCount}
                            </span>
                        )}
                        <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
                    </button>

                    <div className='overflow-hidden'>
                        <SearchBar />
                    </div>

                    <button onClick={toggleNavDrawer} className='md:hidden'>
                        <HiBars3BottomRight className='h-6 w-6 text-gray-700' />
                    </button>
                </div>
            </nav>

            <CartDrawer drawerOpen={isCartOpen} toggleCartDrawer={toggleDrawer} />

            {/* Mobile Navigation Drawer */}
            <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-booksdos shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className='flex justify-end p-4'>
                    <button onClick={toggleNavDrawer}>
                        <IoMdClose className='h-6 w-6 text-gray-600' />
                    </button>
                </div>
                <div className='p-6'>
                    <h2 className='text-2xl font-cookie text-ktr-green mb-4'>Menu</h2>
                    <nav className='space-y-4 text-lg'>
                        <Link
                            to={user?.role === 'admin' ? '/admin' : '/profile'}
                            onClick={toggleNavDrawer}
                            className='block text-ktr-blue font-semibold hover:text-ktr-green'>
                            {user ? (user.role === 'admin' ? `Admin Dashboard (${user.name})` : `My Account (${user.name})`) : "Login / Sign Up"}
                        </Link>
                        <Link
                            to='/pairing'
                            onClick={toggleNavDrawer}
                            className='block text-gray-700 hover:text-black'>
                            Pairings
                        </Link>
                        <Link
                            to='/pairing/oven'
                            onClick={toggleNavDrawer}
                            className='block text-gray-700 hover:text-black'>
                            Oven
                        </Link>
                        <Link
                            to='/pairing/library'
                            onClick={toggleNavDrawer}
                            className='block text-gray-700 hover:text-black'>
                            Library
                        </Link>
                        <Link
                            to='/pairing/plans'
                            onClick={toggleNavDrawer}
                            className='block text-gray-700 hover:text-black'>
                            Subscription Plans
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Navbar;
