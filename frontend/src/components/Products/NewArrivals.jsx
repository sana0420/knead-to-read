import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
const NewArrivals = () => {
    const scrollRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [canScrollRight, setCanScrollRight] = useState(true)
    const [canScrollLeft, setCanScrollLeft] = useState(false)

    const [newArrivals, setNewArrivals] = useState([])

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                );
                setNewArrivals(Array.isArray(response.data) ? response.data : []);
            }
            catch (error) {
                console.error(error);
            }
        };
        fetchNewArrivals();
    }, [])
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX); // Adjust the multiplier for speed
        scrollRef.current.scrollLeft = scrollLeft - walk;
    }
    const handleMouseUporLeave = (e) => {
        setIsDragging(false);
    }
    const scroll = (direction) => {
        const scrollAmount = direction === 'left' ? -300 : 300;
        scrollRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };
    const updateScrollButtons = () => {
        const container = scrollRef.current
        if (container) {
            const leftScroll = container.scrollLeft
            const rightScrollable =
                container.scrollWidth > leftScroll + container.clientWidth;

            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScrollable);

        }
        console.log(container.scrollLeft, container.scrollWidth, container.clientWidth, scrollRef.current.offsetLeft)
    }
    useEffect(() => {
        const container = scrollRef.current
        if (container) {
            container.addEventListener('scroll', updateScrollButtons)
        }
        updateScrollButtons()
        return () => {
            if (container) {
                container.removeEventListener('scroll', updateScrollButtons)
            }
        }
    }, [newArrivals])
    return (
        <section className=' px-4 lg:px-0'>
            <div className='container mx-auto text-center mb-10 relative '>
                <h2 className='text-3xl font-bold mb-4 text-ktr-green'>Explore Our New Arrivals</h2>
                <p className='text-gray-600 text-lg mb-8'>Discover our latest arrivals and stay ahead of the fashion curve.</p>
                <div className='absolute right-0 bottom-[-30px] flex space-x-2 m-4 '>
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded border ${canScrollLeft ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                        <FiChevronLeft className='text2xl' />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`p-2 rounded border ${canScrollRight ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                        <FiChevronRight className='text2xl' />
                    </button>
                </div>
            </div>
            <div
                ref={scrollRef}
                className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} `}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUporLeave}
                onMouseLeave={handleMouseUporLeave}
            >
                {
                    newArrivals.map((product) => (
                        <div key={product._id} className="min-w-[100%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[30%] relative overflow-hidden rounded-lg">
                            <img src={product.images[0]?.url}
                                alt={product.images[0]?.altText || product.name}
                                draggable='false'
                                className='w-full h-[500px] object-cover' />

                            {product.category === 'pairing' ? (
                                <>
                                    {/* Warm gradient overlay */}
                                    <div className='absolute inset-0 pointer-events-none'
                                        style={{ background: 'linear-gradient(to top, rgba(30,15,5,0.72) 0%, rgba(30,15,5,0.18) 50%, transparent 100%)' }}
                                    />

                                    {/* Inset bakery image — polaroid style, bottom-right */}
                                    {product.images[1]?.url && (
                                        <div className='absolute bottom-16 right-4'
                                            style={{
                                                background: '#fff',
                                                padding: '8px 8px 8px 8px',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                                width: '170px',
                                                transform: 'rotate(2deg)',
                                            }}
                                        >
                                            <img
                                                src={product.images[1].url}
                                                alt={product.images[1].altText || 'bakery pairing'}
                                                draggable='false'
                                                style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                                            />
                                            <p style={{
                                                fontFamily: "'Georgia', serif",
                                                fontStyle: 'italic',
                                                fontSize: '11px',
                                                color: '#7a4a1e',
                                                textAlign: 'center',
                                                margin: '6px 2px 2px',
                                                lineHeight: '1.3',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>
                                                {product.images[1].altText}
                                            </p>
                                        </div>
                                    )}

                                    {/* Name & price only */}
                                    <div className='absolute bottom-0 left-0 right-0 bg-ktr-pink/40 bg-opacity-50 backdrop-blur-md p-4'>
                                        <Link to={`/product/${product._id}`} className='block'>
                                            <h4 className='font-semibold text-white text-base leading-snug'>{product.name}</h4>
                                            <p className='mt-1 text-amber-200 font-medium'>${product.price}</p>
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                /* Default overlay for non-pairing products */
                                <div className='absolute bottom-0 left-0 right-0  bg-ktr-pink/40 bg-opacity-50 backdrop-blur-md text-white p-4'>
                                    <Link to={`/product/${product._id}`} className='block'>
                                        <h4 className='font-medium'>{product.name}</h4>
                                        <p className='mt-1 text-amber-200'>${product.price}</p>
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default NewArrivals