import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import registerImg from '../assets/register.webp';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user, guestId, loading, error } = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cart);

    const redirect = new URLSearchParams(location.search).get('redirect') || "/";
    const isCheckOutRedirect = redirect.includes("checkout");

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            let destination = "/profile";
            if (user.role === "admin") {
                destination = "/admin";
            } else if (isCheckOutRedirect) {
                destination = "/checkout";
            } else if (redirect && redirect !== "/" && !redirect.includes("register")) {
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
        dispatch(registerUser({ name, email, password }));
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
                    <h2 className='text-2xl font-bold text-center mb-2'>Create an Account</h2>
                    <p className='text-center mb-6 text-gray-600'>Join our community of book & pastry enthusiasts</p>

                    {error && (
                        <div className='mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg text-center'>
                            {error}
                        </div>
                    )}

                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full p-3 rounded-lg bg-white border border-gray-200 focus:border-ktr-green focus:outline-none focus:ring-2 focus:ring-ktr-green/20'
                            placeholder='Jane Doe'
                        />
                    </div>

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
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-3 rounded-lg bg-white border border-gray-200 focus:border-ktr-green focus:outline-none focus:ring-2 focus:ring-ktr-green/20'
                            placeholder='At least 6 characters'
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-ktr-green text-ktr-skin p-3 rounded-lg font-semibold hover:bg-ktr-blue transition shadow cursor-pointer disabled:opacity-50'
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <p className='mt-6 text-center text-sm text-gray-600'>
                        Already have an account?{' '}
                        <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-ktr-blue font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>

            <div className='hidden md:block w-1/2 bg-gray-800 relative'>
                <div className='h-full flex flex-col justify-center items-center'>
                    <img src={registerImg} alt="Create Knead to Read Account" className='absolute inset-0 w-full h-full object-cover' />
                </div>
            </div>
        </div>
    );
};

export default Register;
