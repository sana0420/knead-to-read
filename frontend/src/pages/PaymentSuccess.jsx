import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';

const getAuthToken = () =>
    localStorage.getItem('userToken') || localStorage.getItem('usertoken');

const verifyOnBackend = async (endpoint, body) => {
    const token = getAuthToken();
    const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${endpoint}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to verify payment');
    }

    return data;
};

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('verifying');
    const [error, setError] = useState(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        const paymentIntentId =
            searchParams.get('payment_intent') ||
            searchParams.get('payment_intent_client_secret')?.split('_secret')[0];

        if (!sessionId && !paymentIntentId) {
            setStatus('error');
            setError('Missing payment reference.');
            return;
        }

        const verifyPayment = async () => {
            const token = getAuthToken();

            if (!token) {
                setStatus('error');
                setError('Please log in to view your order.');
                return;
            }

            try {
                const data = sessionId
                    ? await verifyOnBackend('verify-session', { sessionId })
                    : await verifyOnBackend('verify-payment', { paymentIntentId });

                dispatch(clearCart());
                navigate('/order-confirmation', {
                    replace: true,
                    state: { order: data.order, checkout: data.checkout },
                });
            } catch (err) {
                console.error('Payment verification failed:', err);
                setStatus('error');
                setError(err.message || 'Could not verify your payment.');
            }
        };

        verifyPayment();
    }, [searchParams, navigate, dispatch]);

    if (status === 'error') {
        return (
            <div className="max-w-xl mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Verification Failed</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link to="/checkout" className="text-emerald-700 underline">
                    Return to checkout
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-8 text-center">
            <h2 className="text-2xl font-bold text-emerald-700 mb-4">Processing your payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your order.</p>
        </div>
    );
};

export default PaymentSuccess;
