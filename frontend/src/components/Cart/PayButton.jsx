import React, { useState } from 'react';
import { toast } from 'sonner';

const getAuthToken = () =>
    localStorage.getItem("userToken") || localStorage.getItem("usertoken");

const PayButton = ({ checkoutData, disabled = false }) => {
    const [loading, setLoading] = useState(false);

    const makePayment = async () => {
        const token = getAuthToken();

        if (!token) {
            toast.error("Please log in to complete your purchase.");
            return;
        }

        if (!checkoutData?.checkoutItem?.length) {
            toast.error("Your cart is empty.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/create-checkout-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(checkoutData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create checkout session");
            }

            if (data.url) {
                window.location.href = data.url;
                return;
            }

            throw new Error("Stripe checkout URL was not returned");
        } catch (error) {
            console.error("Payment Error:", error);
            toast.error(error.message || "Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={makePayment}
            disabled={disabled || loading}
            className="pay-btn w-full bg-ktr-pink text-ktr-blue py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? "Redirecting to Stripe..." : "Pay with Stripe"}
        </button>
    );
};

export default PayButton;
