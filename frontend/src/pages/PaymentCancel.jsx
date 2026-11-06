import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancel = () => {
    return (
        <div className="max-w-xl mx-auto p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Cancelled</h2>
            <p className="text-gray-600 mb-6">
                Your payment was not completed. No charges were made.
            </p>
            <Link
                to="/checkout"
                className="inline-block bg-ktr-pink text-ktr-blue px-6 py-3 rounded"
            >
                Return to Checkout
            </Link>
        </div>
    );
};

export default PaymentCancel;
