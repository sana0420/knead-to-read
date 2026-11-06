import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartContents from '../Cart/CartContents.jsx';

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
    const navigate = useNavigate();
    
    // Select state from Redux store safely
    const { user, guestId } = useSelector((state) => state.auth || {});
    const { cart } = useSelector((state) => state.cart || {});
    
    const userId = user ? user._id : null;

    const handleCheckout = () => {
        toggleCartDrawer();
        if (!user) {
            navigate("/login?redirect=checkout");
        } else {
            navigate('/checkout');
        }
    };

    return (
        /* Fixed: Changed 'tranform' to 'transform', 'isCartOpen' to 'drawerOpen' */
        <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
            
            {/* Close Button Header */}
            <div className='flex justify-end p-4'>
                <button onClick={toggleCartDrawer} aria-label="Close cart">
                    <IoMdClose className="h-6 w-6 text-gray-600" />
                </button>
            </div>

            {/* Scrollable Cart Body */}
            <div className='flex-grow p-4 overflow-y-auto'>
                <h2 className='text-xl font-semibold mb-4'>Your Cart</h2>
                {cart && cart?.products?.length > 0 ? (
                    <CartContents cart={cart} userId={userId} guestId={guestId} />
                ) : (
                    <div className='text-center text-gray-500 py-8'>Your cart is empty</div>
                )}
            </div>

            {/* Bottom Sticky Checkout Action Footer */}
            {/* Fixed: Changed 'botton-0' to 'bottom-0' */}
            <div className='p-4 bg-white sticky bottom-0 border-t'>
                {cart && cart?.products?.length > 0 ? (
                    <button 
                        onClick={handleCheckout} 
                        className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition'
                    >
                        Checkout
                    </button>
                ) : (
                    <p className='text-sm tracking-tighter text-gray-500 mt-2 text-center'>
                        Shipping, taxes, and discount codes calculated at checkout.
                    </p>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;