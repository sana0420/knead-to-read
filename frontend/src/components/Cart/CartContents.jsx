import React from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { updateCartItemQuantity, removeFromCart } from '../../redux/slices/cartSlice';

const CartContents = ({ cart, userId, guestId }) => {
    const dispatch = useDispatch();

    // Handle adding or subtracting quantity in the cart
    const handleAddToCart = (item, delta) => {
        // Extract product ID safely regardless of schema naming convention
        const productId = item.productId || item._id || item.product;
        const currentQty = Number(item.quantity) || 1;
        const newQuantity = currentQty + delta;

        if (newQuantity >= 1 && productId) {
            dispatch(updateCartItemQuantity({
                productId,
                quantity: newQuantity,
                userId,
                guestId
            }));
        }
    };

    // Handle complete removal of an item
    const handleRemoveFromCart = (item) => {
        const productId = item.productId || item._id || item.product;

        if (productId) {
            dispatch(removeFromCart({
                productId,
                userId,
                guestId
            }));
        }
    };

    return (
        <div>
            {!cart?.products || cart.products.length === 0 ? (
                <div className='text-center py-8'>
                    <p className='text-gray-500'>Your cart is empty</p>
                </div>
            ) : (
                cart.products.map((item, index) => (
                    <div key={item._id || item.productId || index} className='flex items-start justify-between py-4 border-b'>
                        <div className='flex items-center'>
                            <img src={item.image} alt={item.name} className='w-20 h-20 object-cover mr-4 rounded-lg' />
                            <div>
                                <h3 className='text-sm font-medium text-gray-800'>{item.name}</h3>
                            </div>
                        </div>
                        <div className='flex items-center mt-2'>
                            <button
                                className='border rounded px-2 py-1 text-xl font-medium hover:bg-gray-100'
                                onClick={() => handleAddToCart(item, -1)}
                                aria-label='Decrease quantity'
                            >
                                -
                            </button>
                            <span className='mx-4 font-medium'>{item.quantity}</span>
                            <button
                                className='border rounded px-2 py-1 text-xl font-medium hover:bg-gray-100'
                                onClick={() => handleAddToCart(item, 1)}
                                aria-label='Increase quantity'
                            >
                                +
                            </button>
                        </div>
                        <div className='text-right'>
                            <p className='font-medium'>$ {item.price?.toLocaleString() || '0'}</p>
                            <button
                                onClick={() => handleRemoveFromCart(item)}
                                aria-label='Remove from cart'
                                className='hover:bg-red-50 p-1 rounded mt-2'
                            >
                                <RiDeleteBinLine className='h-6 w-6 text-red-500' />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CartContents;