import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import StripePaymentForm from './StripePaymentForm';
import { clearCart } from '../../redux/slices/cartSlice';

const getAuthToken = () =>
    localStorage.getItem('userToken') || localStorage.getItem('usertoken');

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart || { cart: { products: [], totalPrice: 0 } });
    const { user } = useSelector((state) => state.auth || {});
    const [showPayment, setShowPayment] = useState(false)
    const [clientSecret, setClientSecret] = useState(null)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [shippingAddress, setShippingAddress] = useState({
        firstname: "",
        lastname: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    })

    const checkoutItems = (cart?.products || []).map((product) => ({
        productId: product.productId || product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: product.quantity || 1,
    }));

    const totalPrice = cart?.totalPrice || checkoutItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const checkoutData = {
        checkoutItem: checkoutItems,
        shippingAddress: {
            address: `${shippingAddress.firstname} ${shippingAddress.lastname}, ${shippingAddress.address}`.trim(),
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
        },
        paymentMethod: "stripe",
        totalPrice,
    };

    const handleContinueToPayment = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please log in before checking out.");
            navigate("/login");
            return;
        }

        if (!checkoutItems.length) {
            toast.error("Your cart is empty.");
            return;
        }

        const token = getAuthToken();
        if (!token) {
            toast.error("Please log in before checking out.");
            navigate("/login");
            return;
        }

        setPaymentLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/create-payment-intent`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(checkoutData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to initialize payment');
            }

            setClientSecret(data.clientSecret);
            setShowPayment(true);
        } catch (error) {
            console.error('Payment init error:', error);
            toast.error(error.message || 'Could not start payment. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    const handlePaymentSuccess = (result) => {
        dispatch(clearCart());
        navigate('/order-confirmation', {
            state: { order: result.order, checkout: result.checkout },
        });
    };

    return (
        <div className='bg-booksdos'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
                <div className='bg-ktr-skin text-ktr-blue rounded-lg p-6'>
                    <form onSubmit={handleContinueToPayment}>
                        <h3 className='text-lg mb4'>Contact Details</h3>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                placeholder="user@example.com"
                                className='w-full p-2 border rounded'
                                readOnly
                            />
                        </div>
                        <h3 className='text-lg mb-4'>Delivery</h3>
                        <div className='mb-4 grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-gray-700'>First Name</label>
                                <input
                                    type="text"
                                    value={shippingAddress.firstname}
                                    onChange={(e) => setShippingAddress({
                                        ...shippingAddress,
                                        firstname: e.target.value
                                    })}
                                    className='w-full p-2 border rounded'
                                    required
                                    disabled={showPayment}
                                />
                            </div>
                            <div>
                                <label className='block text-gray-700'>Last Name</label>
                                <input
                                    type="text"
                                    value={shippingAddress.lastname}
                                    onChange={(e) => setShippingAddress({
                                        ...shippingAddress,
                                        lastname: e.target.value
                                    })}
                                    className='w-full p-2 border rounded'
                                    required
                                    disabled={showPayment}
                                />
                            </div>
                        </div>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Address</label>
                            <input
                                type="text"
                                value={shippingAddress.address}
                                onChange={(e) => {
                                    setShippingAddress({
                                        ...shippingAddress,
                                        address: e.target.value
                                    })
                                }}
                                className='w-full p-2 border rounded'
                                required
                                disabled={showPayment}
                            />
                        </div>
                        <div className='mb-4 grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-gray-700'>City</label>
                                <input
                                    type="text"
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({
                                        ...shippingAddress,
                                        city: e.target.value
                                    })}
                                    className='w-full p-2 border rounded'
                                    required
                                    disabled={showPayment}
                                />
                            </div>
                            <div>
                                <label className='block text-gray-700'>Postal Code</label>
                                <input
                                    type="text"
                                    value={shippingAddress.postalCode}
                                    onChange={(e) => setShippingAddress({
                                        ...shippingAddress,
                                        postalCode: e.target.value
                                    })}
                                    className='w-full p-2 border rounded'
                                    required
                                    disabled={showPayment}
                                />
                            </div>
                        </div>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Country</label>
                            <input
                                type="text"
                                value={shippingAddress.country}
                                onChange={(e) => {
                                    setShippingAddress({
                                        ...shippingAddress,
                                        country: e.target.value
                                    })
                                }}
                                className='w-full p-2 border rounded'
                                required
                                disabled={showPayment}
                            />
                        </div>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Phone</label>
                            <input
                                type="tel"
                                value={shippingAddress.phone}
                                onChange={(e) => {
                                    setShippingAddress({
                                        ...shippingAddress,
                                        phone: e.target.value
                                    })
                                }}
                                className='w-full p-2 border rounded'
                                required
                                disabled={showPayment}
                            />
                        </div>
                        <div className='mt-6'>
                            {!showPayment && (
                                <button
                                    type='submit'
                                    disabled={paymentLoading}
                                    className='w-full bg-ktr-pink text-ktr-blue py-3 rounded disabled:opacity-50'
                                >
                                    {paymentLoading ? 'Loading payment form...' : 'Continue to Payment'}
                                </button>
                            )}
                        </div>
                    </form>

                    {showPayment && (
                        <div className='mt-6'>
                            <h3 className='text-lg mb-4'>Payment</h3>
                            <StripePaymentForm
                                clientSecret={clientSecret}
                                onSuccess={handlePaymentSuccess}
                            />
                        </div>
                    )}
                </div>
                <div className='bg-gray-50 p-6 rounded-lg bg-ktr-skin text-ktr-blue'>
                    <h3 className='text-lg mb-4'>Order Summary</h3>
                    <div className='border-t py-4 mb-4'>
                        {(cart?.products || []).map((product, index) => (
                            <div
                                key={product._id || product.productId || index}
                                className='flex items-start justify-between py-2 border-b'>
                                <div className='flex items-start'>
                                    <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4' />
                                    <div>
                                        <h3 className='text-md'>{product.name}</h3>
                                        <p className='text-sm text-gray-600'>Qty: {product.quantity || 1}</p>
                                    </div>
                                </div>
                                <p className='text-xl'>${product.price?.toLocaleString()}</p>
                            </div>
                        ))}
                        <div className='flex justify-between items-center text-lg mb-4 mt-4'>
                            <p>Subtotal</p>
                            <p>${totalPrice?.toLocaleString()}</p>
                        </div>
                        <div className='flex justify-between items-center text-lg'>
                            <p>Shipping</p>
                            <p>Free</p>
                        </div>
                        <div className='flex justify-between items-center text-lg mt-4 border-t pt-4'>
                            <p>Total</p>
                            <p>${totalPrice?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
