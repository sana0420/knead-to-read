import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
    fetchAllOrders,
    updateOrderStatus,
    deleteOrder,
} from '../../redux/slices/adminOrderSlice';

const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const getCustomerName = (order) => {
    if (order.user && typeof order.user === 'object') {
        return order.user.name || order.user.email || 'Unknown';
    }
    return 'Unknown';
};

const getItemCount = (order) => {
    if (!Array.isArray(order.orderItems)) return 0;
    return order.orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
};

const OrderManagement = () => {
    const dispatch = useDispatch();
    const { orders, totalOrders, totalSales, loading, error } = useSelector(
        (state) => state.adminOrders
    );
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const handleStatusChange = async (orderId, status) => {
        setUpdatingId(orderId);
        try {
            await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
            toast.success(`Order updated to ${status}`);
        } catch (err) {
            toast.error(err?.message || 'Failed to update order status');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) {
            return;
        }

        try {
            await dispatch(deleteOrder(orderId)).unwrap();
            toast.success('Order deleted');
            if (expandedOrderId === orderId) {
                setExpandedOrderId(null);
            }
        } catch (err) {
            toast.error(err?.message || 'Failed to delete order');
        }
    };

    const toggleExpand = (orderId) => {
        setExpandedOrderId((current) => (current === orderId ? null : orderId));
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6 text-center text-gray-500">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">Order Management</h2>
                <button
                    onClick={() => dispatch(fetchAllOrders())}
                    className="text-sm font-semibold text-ktr-blue hover:underline"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-ktr-skin rounded-lg p-4 border border-ktr-pink/30">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-ktr-blue">{totalOrders}</p>
                </div>
                <div className="bg-ktr-skin rounded-lg p-4 border border-ktr-pink/30">
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-ktr-blue">${totalSales.toLocaleString()}</p>
                </div>
            </div>

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-ktr-pink text-xs uppercase text-ktr-blue">
                        <tr>
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Items</th>
                            <th className="py-3 px-4">Total</th>
                            <th className="py-3 px-4">Payment</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-ktr-skin text-ktr-blue">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <React.Fragment key={order._id}>
                                    <tr
                                        className="border-b hover:bg-white/40 cursor-pointer"
                                        onClick={() => toggleExpand(order._id)}
                                    >
                                        <td className="py-4 px-4 font-medium whitespace-nowrap">
                                            #{String(order._id).slice(-6).toUpperCase()}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="p-4">{getCustomerName(order)}</td>
                                        <td className="p-4">{getItemCount(order)}</td>
                                        <td className="p-4 font-semibold">
                                            ${order.totalPrice?.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    order.isPaid
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-amber-100 text-amber-800'
                                                }`}
                                            >
                                                {order.isPaid ? 'Paid' : order.paymentStatus || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={order.status || 'Processing'}
                                                disabled={updatingId === order._id}
                                                onChange={(e) =>
                                                    handleStatusChange(order._id, e.target.value)
                                                }
                                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => handleDeleteOrder(order._id)}
                                                className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>

                                    {expandedOrderId === order._id && (
                                        <tr className="bg-white/60">
                                            <td colSpan={8} className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                                    <div>
                                                        <h4 className="font-bold mb-2">Order Items</h4>
                                                        <ul className="space-y-2">
                                                            {(order.orderItems || []).map((item, idx) => (
                                                                <li
                                                                    key={`${item.productId}-${idx}`}
                                                                    className="flex items-center gap-3"
                                                                >
                                                                    {item.image && (
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            className="w-10 h-10 object-cover rounded"
                                                                        />
                                                                    )}
                                                                    <span>
                                                                        {item.name} × {item.quantity} — $
                                                                        {item.price?.toLocaleString()}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold mb-2">Shipping</h4>
                                                        <p>{order.shipping?.address}</p>
                                                        <p>
                                                            {order.shipping?.city}, {order.shipping?.postalCode}
                                                        </p>
                                                        <p>{order.shipping?.country}</p>
                                                        <p className="mt-3">
                                                            <span className="font-semibold">Payment method:</span>{' '}
                                                            {order.paymentMethod}
                                                        </p>
                                                        {order.paidAt && (
                                                            <p>
                                                                <span className="font-semibold">Paid on:</span>{' '}
                                                                {formatDate(order.paidAt)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;
