import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'sonner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const getAuthToken = () =>
    localStorage.getItem('userToken') || localStorage.getItem('usertoken');

const PaymentForm = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const verifyPayment = async (paymentIntentId) => {
        const token = getAuthToken();
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/checkout/verify-payment`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ paymentIntentId }),
            }
        );

        const data = await response.json();

        if (response.status === 401) {
            throw new Error('Your session expired. Please log in again.');
        }

        if (!response.ok) {
            throw new Error(data.message || 'Failed to verify payment');
        }

        return data;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            toast.error('Payment form is still loading. Please wait.');
            return;
        }

        setLoading(true);

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                toast.error(submitError.message || 'Please check your payment details.');
                return;
            }

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`,
                },
            });

            if (error) {
                toast.error(error.message || 'Payment failed');
                return;
            }

            if (paymentIntent?.status === 'succeeded') {
                const result = await verifyPayment(paymentIntent.id);
                onSuccess(result);
                return;
            }

            if (paymentIntent?.status === 'processing') {
                toast.info('Payment is processing. Please wait a moment.');
                return;
            }

            toast.error('Payment could not be completed. Please try again.');
        } catch (err) {
            console.error('Payment error:', err);
            toast.error(err.message || 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement
                options={{
                    layout: 'tabs',
                }}
            />
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-ktr-pink text-ktr-blue py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processing payment...' : 'Pay now'}
            </button>
        </form>
    );
};

const StripePaymentForm = ({ clientSecret, onSuccess }) => {
    if (!clientSecret) {
        return null;
    }

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#1e3a5f',
            },
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <PaymentForm onSuccess={onSuccess} />
        </Elements>
    );
};

export default StripePaymentForm;
