import React from 'react'
import { Link } from 'react-router-dom'

const ProductGrid = ({ products, loading, error }) => {
    if (loading) return <p className='text-center text-gray-500 my-8'>Loading products...</p>;
    if (error) return <p className='text-center text-red-500 my-8'>Error: {error}</p>;
    if (!products || products.length === 0) return <p className='text-center text-gray-500 my-8'>No products found.</p>;

    return (
        /* The Responsive Grid Container */
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center p-4'>
            {products.map((product, index) => {
                // Safely grab the first image and second image
                const mainImg = product.images?.[0]?.url || '';
                const secondaryImg = product.images?.[1]?.url || mainImg;
                const imgAlt = product.images?.[0]?.altText || product.name;

                // Determine if this is a pairing item (handling potential lowercase discrepancies)
                const isPairing = product.category?.toLowerCase() === 'pairing';

                return (
                    <Link
                        key={product._id || index}
                        to={`/product/${product._id}`}
                        className='block w-full max-w-[290px] sm:max-w-none group'
                    >
                        {isPairing ? (
                            /* OPTION A: Polaroid Overlay Card Wrapper (Only for pairings) */
                            <div className='w-full bg-[#FFFDEB] rounded-2xl p-4 shadow-sm border border-amber-100/50 flex flex-col gap-3 transition-shadow hover:shadow-md h-full'>

                                {/* Image Container with Stacked Overlays */}
                                <div className='relative h-56 md:h-60 w-full bg-stone-100 rounded-xl overflow-hidden'>
                                    {/* Base Image: The Book */}
                                    <img
                                        src={mainImg}
                                        alt={imgAlt}
                                        className='w-full h-full object-cover filter brightness-95'
                                    />

                                    {/* Overlay Image: The Pastry (Polaroid Style) */}
                                    <div className='absolute bottom-2 right-2 w-28 h-28 md:w-40 md:h-36 bg-ktr-skin p-1.5 shadow-md rounded-sm transform rotate-3 transition-transform group-hover:rotate-0 z-10'>
                                        <img
                                            src={secondaryImg}
                                            alt="Pastry pairing cutout"
                                            className='w-full h-20 md:h-24 object-cover rounded-sm'
                                        />
                                        <span className='block text-center font-cookie text-[10px] md:text-xs lg:text-md text-amber-800 mt-1 whitespace-nowrap overflow-hidden text-ellipsis'>
                                            {product.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className='flex flex-col gap-1 text-center sm:text-left flex-grow justify-between'>
                                    <div>
                                        <span className='text-[10px] md:text-xs font-semibold tracking-wider text-rose-700/80 uppercase block mb-0.5'>
                                            {product.category}
                                        </span>
                                        <h3 className='font-cookie text-2xl md:text-3xl text-ktr-blue leading-tight line-clamp-1'>
                                            {product.name}
                                        </h3>
                                        {product.description && (
                                            <p className='text-[11px] md:text-xs text-ktr-blue line-clamp-2 mt-1 px-1 sm:px-0'>
                                                {product.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price and CTA Layout Bar */}
                                    <div className='flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-3 pt-2 border-t border-amber-100/30'>
                                        <span className='font-semibold text-sm md:text-base text-ktr-blue'>
                                            ${product.price}
                                        </span>
                                        <span className='w-full sm:w-auto bg-rose-200/60 group-hover:bg-rose-200 text-rose-800 font-medium text-xs px-4 py-2 sm:py-1.5 rounded-full text-center transition-colors'>
                                            View Box
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* OPTION B: Simple Image Layout (For Oven and all other categories) */
                            <div className='w-full bg-[#FFFDEB] rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-col gap-3 transition-shadow hover:shadow-md h-full'>

                                {/* Simple Product Visual Window */}
                                <div className='h-56 md:h-60 w-full bg-stone-100 rounded-xl overflow-hidden'>
                                    <img
                                        src={mainImg}
                                        alt={imgAlt}
                                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                    />
                                </div>

                                {/* Content Details */}
                                <div className='flex flex-col gap-1 text-center sm:text-left flex-grow justify-between'>
                                    <div>
                                        <span className='text-[10px] md:text-xs font-semibold tracking-wider text-ktr-blue uppercase block mb-0.5'>
                                            {product.category || 'Product'}
                                        </span>
                                        <h3 className='text-lg font-medium text-ktr-blue leading-tight line-clamp-1'>
                                            {product.name}
                                        </h3>
                                        {product.description && (
                                            <p className='text-[11px] md:text-xs text-ktr-blue line-clamp-2 mt-1 px-1 sm:px-0'>
                                                {product.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price and CTA Layout Bar */}
                                    <div className='flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-3 pt-2 border-t border-stone-100'>
                                        <span className='font-semibold text-sm md:text-base text-ktr-blue'>
                                            ${product.price}
                                        </span>
                                        <span className='w-full sm:w-auto bg-rose-200/60 group-hover:bg-rose-200 text-rose-800 font-medium text-xs px-4 py-2 sm:py-1.5 rounded-full text-center transition-colors'>
                                            View Item
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
};

export default ProductGrid;