import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import login from '../assets/sidepic.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user, guestId, loading, error } = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cart);

    // Get redirect parameter
    const redirect = new URLSearchParams(location.search).get('redirect') || "/";
    const isCheckOutRedirect = redirect.includes("checkout");

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            // Admin logs in -> dashboard opens first
            if (user.role === "admin") {
                navigate("/admin", { replace: true });
                return;
            }

            // Customer logs in -> opens their profile
            let destination = "/profile";
            if (isCheckOutRedirect) {
                destination = "/checkout";
            } else if (redirect && redirect !== "/" && !redirect.includes("login")) {
                destination = redirect;
            }

            if (cart?.products?.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(destination, { replace: true });
                });
            } else {
                navigate(destination, { replace: true });
            }
        }
    }, [user, guestId, dispatch, cart, isCheckOutRedirect, redirect, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className='flex min-h-screen items-stretch overflow-hidden text-ktr-blue bg-booksdos'>
            <div className='w-full flex md:w-1/2 justify-center items-center p-8 md:p-12'>
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <div className='flex justify-center mb-6'>
                        <Link to="/" className='text-4xl font-cookie text-ktr-green hover:opacity-90 transition'>
                            Knead to Read
                        </Link>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-2'>Welcome Back!</h2>
                    <p className='text-center mb-6 text-gray-600'>Enter your email and password to access your account</p>

                    {error && (
                        <div className='mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg text-center'>
                            {error}
                        </div>
                    )}

                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-3 rounded-lg bg-white border border-gray-200 focus:border-ktr-green focus:outline-none focus:ring-2 focus:ring-ktr-green/20'
                            placeholder='your.email@example.com'
                        />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-sm font-semibold mb-2'>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-3 rounded-lg bg-white border border-gray-200 focus:border-ktr-green focus:outline-none focus:ring-2 focus:ring-ktr-green/20'
                            placeholder='••••••••'
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-ktr-green text-ktr-skin p-3 rounded-lg font-semibold hover:bg-ktr-blue transition shadow cursor-pointer disabled:opacity-50'
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <p className='mt-6 text-center text-sm text-gray-600'>
                        Don't have an account?{' '}
                        <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-ktr-blue font-semibold hover:underline">
                            Create an Account
                        </Link>
                    </p>
                </form>
            </div>

            <div className='hidden md:block w-1/2 bg-gray-800 relative'>
                <div className='h-full flex flex-col justify-center items-center'>
                    <img src={login} alt="Login to Knead to Read" className='absolute inset-0 w-full h-full object-cover' />
                </div>
            </div>
        </div>
    );
};

export default Login;
