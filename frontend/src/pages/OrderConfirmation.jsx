import React from 'react'
import { useLocation, Link } from 'react-router-dom'

const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10)
    return orderDate.toLocaleDateString()
}

const OrderConfirmation = () => {
    const location = useLocation()
    const order = location.state?.order
    if (!order) {
        return (
            <div className='max-w-4xl mx-auto p-6 bg-booksdos text-center'>
                <h3 className='text-2xl font-bold text-emerald-700 mb-4'>
                    Thank You For Your Order
                </h3>
                <p className='text-gray-600 mb-6'>Your payment was successful.</p>
                <Link to="/my-orders" className="text-emerald-700 underline">
                    View my orders
                </Link>
            </div>
        )
    }

    return (
        <div className='bg-booksdos'>
            <div className='max-w-4xl mx-auto p-6 bg-booksdos text-ktr-blue'>
                <h3 className='text-4xl font-bold text-center text-emerald-700 mb-8'>
                    Thank You For Your Order
                </h3>
                <div className='p-6 rounded-lg border'>
                    <div className='flex justify-between mb-20'>
                        <div>
                            <h2 className='text-xl font-semibold'>
                                Order ID: {order._id}
                            </h2>
                            <p className='text-gray-500'>
                                Order date: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className='text-emerald-700 text-sm'>
                                Estimated Delivery: {calculateEstimatedDelivery(order.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className='mb-20'>
                        {order.orderItems?.map((item) => (
                            <div key={item.productId} className='flex items-center mb-4'>
                                <img src={item.image} alt={item.name} className='w-16 h-16 object-cover rounded-md mr-4' />
                                <div>
                                    <h4 className='text-md font-semibold'>{item.name}</h4>
                                </div>
                                <div className='ml-auto text-right'>
                                    <p className='text-sm'>${item.price}</p>
                                    <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='grid grid-cols-2 gap-8'>
                        <div>
                            <h4 className='text-lg font-semibold mb-2'>Payment</h4>
                            <p className='text-gray-600'>Stripe</p>
                            <p className='text-gray-600'>Total: ${order.totalPrice?.toLocaleString()}</p>
                        </div>
                        <div>
                            <h4 className='text-lg font-semibold mb-2'>Delivery</h4>
                            <p className='text-gray-600'>{order.shipping?.address}</p>
                            <p className='text-gray-600'>
                                {order.shipping?.city}, {order.shipping?.postalCode}, {order.shipping?.country}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default OrderConfirmation
