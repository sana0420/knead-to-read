import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyOrdersPage = ({ isEmbedded = false }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                setLoading(true);
                const userToken = localStorage.getItem("userToken");

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );

                setOrders(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError(err.response?.data?.message || "Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        fetchUserOrders();
    }, []);

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    if (loading) {
        return (
            <div className={`text-center ${isEmbedded ? 'py-10' : 'max-w-7xl mx-auto p-4 sm:p-6 py-20 min-h-screen bg-booksdos'}`}>
                <div className='inline-block animate-spin rounded-full h-8 w-8 border-4 border-ktr-green border-t-transparent'></div>
                <p className='mt-2 text-ktr-blue/70 text-xs sm:text-sm font-lora italic'>Gathering your bakery &amp; book orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`text-center ${isEmbedded ? 'py-6' : 'max-w-7xl mx-auto p-4 sm:p-6 py-12 min-h-screen bg-booksdos'}`}>
                <p className='text-red-600 bg-red-50/90 border border-red-200 p-4 rounded-2xl inline-block text-xs sm:text-sm'>{error}</p>
            </div>
        );
    }

    const content = (
        <div>
            {orders.length === 0 ? (
                <div className='py-12 px-4 text-center bg-[#FDFBF0] rounded-2xl border border-dashed border-ktr-pink/40 text-ktr-blue'>
                    <div className='text-3xl mb-2'>🥐</div>
                    <p className='text-base font-bold font-lora text-ktr-blue'>No orders placed yet</p>
                    <p className='text-xs text-ktr-blue/60 italic mt-1'>Explore our artisanal pastries and library pairings to place your first order.</p>
                </div>
            ) : (
                <>
                    {/* MOBILE CARD VIEW: Clean responsive cards for screens < 640px */}
                    <div className='sm:hidden space-y-3'>
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                onClick={() => handleRowClick(order._id)}
                                className='bg-[#FDFBF0] p-4 rounded-2xl border border-ktr-pink/35 shadow-xs active:bg-ktr-skin/30 cursor-pointer transition'
                            >
                                <div className='flex items-center gap-3 mb-2.5'>
                                    {order.orderItems && order.orderItems.length > 0 ? (
                                        <img
                                            src={order.orderItems[0].image}
                                            alt={order.orderItems[0].name}
                                            className='w-12 h-12 object-cover rounded-xl border border-ktr-pink/30 flex-shrink-0'
                                        />
                                    ) : (
                                        <div className='w-12 h-12 bg-ktr-skin/40 rounded-xl border border-ktr-pink/20 flex items-center justify-center text-xs text-ktr-blue/50 flex-shrink-0'>
                                            📦
                                        </div>
                                    )}
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center justify-between'>
                                            <p className='font-bold font-mono text-xs text-ktr-blue truncate'>
                                                #{order._id.substring(order._id.length - 6).toUpperCase()}
                                            </p>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                    order.isPaid
                                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                        : 'bg-amber-100 text-amber-800 border-amber-300'
                                                }`}
                                            >
                                                {order.isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </div>
                                        <p className='text-xs text-ktr-blue/60 mt-0.5'>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center justify-between pt-2 border-t border-ktr-pink/20 text-xs text-ktr-blue/80'>
                                    <span>
                                        {order.orderItems ? order.orderItems.reduce((acc, item) => acc + item.quantity, 0) : 0} items
                                    </span>
                                    <span className='font-bold text-ktr-green text-sm'>
                                        ${order.totalPrice?.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TABLE VIEW: Structured grid for screens >= 640px */}
                    <div className='hidden sm:block relative rounded-2xl border border-ktr-pink/30 overflow-x-auto bg-[#FDFBF0] shadow-xs'>
                        <table className='min-w-full text-left text-ktr-blue text-sm'>
                            <thead className='bg-ktr-skin/60 text-xs uppercase text-ktr-green font-semibold tracking-wider border-b border-ktr-pink/30'>
                                <tr>
                                    <th className='px-4 py-3.5'>Item</th>
                                    <th className='px-4 py-3.5'>Order ID</th>
                                    <th className='px-4 py-3.5'>Placed On</th>
                                    <th className='px-4 py-3.5'>Destination</th>
                                    <th className='px-4 py-3.5 text-center'>Items</th>
                                    <th className='px-4 py-3.5'>Total</th>
                                    <th className='px-4 py-3.5 text-right'>Status</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-ktr-pink/15'>
                                {orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className='hover:bg-ktr-skin/25 cursor-pointer transition-colors'
                                        onClick={() => handleRowClick(order._id)}
                                    >
                                        <td className='py-3.5 px-4'>
                                            {order.orderItems && order.orderItems.length > 0 ? (
                                                <img
                                                    src={order.orderItems[0].image}
                                                    alt={order.orderItems[0].name}
                                                    className='w-11 h-11 object-cover rounded-xl border border-ktr-pink/30 shadow-2xs'
                                                />
                                            ) : (
                                                <div className='w-11 h-11 bg-ktr-skin/40 rounded-xl border border-ktr-pink/20 flex items-center justify-center text-xs text-ktr-blue/50'>
                                                    📦
                                                </div>
                                            )}
                                        </td>
                                        <td className='py-3.5 px-4 font-mono font-bold text-xs text-ktr-blue whitespace-nowrap'>
                                            #{order._id.substring(order._id.length - 6).toUpperCase()}
                                        </td>
                                        <td className='py-3.5 px-4 whitespace-nowrap text-xs text-ktr-blue/80'>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className='py-3.5 px-4 text-xs text-ktr-blue/80'>
                                            {order.shipping
                                                ? `${order.shipping.city || ''}, ${order.shipping.country || ''}`
                                                : 'N/A'}
                                        </td>
                                        <td className='py-3.5 px-4 text-center text-xs text-ktr-blue font-medium'>
                                            {order.orderItems
                                                ? order.orderItems.reduce((acc, item) => acc + item.quantity, 0)
                                                : 0}
                                        </td>
                                        <td className='py-3.5 px-4 font-bold text-ktr-green whitespace-nowrap'>
                                            ${order.totalPrice?.toFixed(2)}
                                        </td>
                                        <td className='py-3.5 px-4 text-right'>
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                                    order.isPaid
                                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                        : 'bg-amber-100 text-amber-800 border-amber-300'
                                                }`}
                                            >
                                                {order.isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );

    if (isEmbedded) {
        return content;
    }

    return (
        <div className='min-h-screen bg-booksdos py-12 px-4 sm:px-6 lg:px-8 text-ktr-blue'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-4xl font-cookie text-ktr-green mb-6'>My Order History</h1>
                {content}
            </div>
        </div>
    );
};

export default MyOrdersPage;
