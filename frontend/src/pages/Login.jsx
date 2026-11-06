import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import login from '../assets/sidepic.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice'; // 1. Imported mergeCart
import { mergeCart } from '../redux/slices/cartSlice';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user, guestId } = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cart);

    // Get redirect parameter and check if its checkout or something else
    const redirect = new URLSearchParams(location.search).get('redirect') || "/";
    const isCheckOutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            // 2. Fixed .length() syntax error to .length property
            if (cart?.products?.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckOutRedirect ? "/checkout" : redirect); // 3. Dynamically use redirect variable
                });
            } else {
                navigate(isCheckOutRedirect ? "/checkout" : redirect); // 3. Dynamically use redirect variable
            }
        }
    }, [user, guestId, dispatch, cart, isCheckOutRedirect, redirect, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className='flex  min-h-screen items-stretch overflow-hidden text-ktr-blue bg-booksdos'>
            <div className='w-full flex md:w-1/2 justify-center items-center p-8 md:p-12'>
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-4xl font-cookie text-ktr-green'>Knead to Read</h2>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-6'>Hey there!</h2>
                    <p className='text-center mb-6 text-gray-600'>Enter your email and password to login</p>

                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Email</label>
                        <input
                            type="email"
                            required // Added required validation
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-2 rounded bg-ktr-pink/25 focus:border-none focus:outline-none focus:ring-2 focus:ring-ktr-pink/50'
                            placeholder='Enter your email address'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Password</label>
                        <input
                            type="password"
                            required // Added required validation
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-2 rounded bg-ktr-pink/25 focus:border-none focus:outline-none focus:ring-2 focus:ring-ktr-pink/50'
                            placeholder='Enter your password' // 5. Fixed 'pasword' typo
                        />
                    </div>

                    <button
                        type='submit'
                        className='w-full bg-ktr-pink text-ktr-blue p-2 rounded-lg font-semibold  hover:text-ktr-skin transition'
                    >
                        Sign In
                    </button>

                    <p className='mt-6 text-center text-sm text-gray-600'>
                        Don't have an account?{' '}
                        <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </div>

            {/* 6. Fixed 'bg-gray=800' typo to 'bg-gray-800' */}
            <div className='hidden md:block w-1/2 bg-gray-800 relative'>
                <div className='h-full flex flex-col justify-center items-center '>
                    {/* 7. Fixed 'Acount' typo in alt text */}
                    <img src={login} alt="Login to Account" className='absolute inset-0 w-full h-full object-cover' />
                </div>
            </div>
        </div>
    );
};

export default Login;