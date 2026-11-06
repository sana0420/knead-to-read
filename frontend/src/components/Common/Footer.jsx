import React from 'react'
import { Link } from 'react-router-dom'
import { TbBrandFacebook } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXFill } from 'react-icons/ri'
import { FiPhoneCall } from 'react-icons/fi'
const Footer = () => {
    return (
        <footer className='border-t-1 border-ktr-pink bg-booksdos text-ktr-blue p-4'>
            <div className='max-w-[2xl] mx-auto grid grid-cols-2 grid-cols-2 md:grid-cols-4  gap-8 px-4  lg:px-10'>
                <div className='max-md:hidden '>
                    <h3 className='text-lg text-ktr-green mb-4'>Newsletter</h3>
                    <p className='text-gray-500 mb-4'>
                        Be the first to hear about new products, exclusive events, and online offers.
                    </p>
                    <p className='font-medium text-sm  mb6'>Sign up and get 10% off your first order.</p>
                    <form className='flex my-4'>
                        <input type="email"
                            placeholder="enter your email"
                            className=' p-3 bg-ktr-pink/25 text-sm rounded-l-md focus:border-none focus:outline-none focus:ring-2 focus:ring-ktr-pink transition'
                            required />
                        <button type='submit' className='bg-ktr-pink text-ktr-blue p-3 text-sm rounded-r-md hover:text-ktr-skin transition'>Subscribe</button>
                    </form>
                </div>
                <div>
                    <h3 className='text-lg text-ktr-green mb-4'>Shop</h3>
                    <ul className='space-y-2 text-gray-600'>
                        <li>
                            <Link to='#' className='hover:text-gray-500 transition-colors'>
                                Pairings
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='hover:text-gray-500 transition-colors'>
                                Oven
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='hover:text-gray-500 transition-colors'>
                                Library
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='hover:text-gray-500 transition-colors'>
                                Our Story
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className='text-lg text-ktr-green mb-4'>Support</h3>
                    <ul className='space-y-2 text-gray-600'>
                        <li>
                            <Link to='#' className='hover:text-gray-500 transition-colors'>
                                Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='hover:text-gray-500 transition-colors'>
                                FAQS
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='hover:text-gray-500 transition-colors'>
                                Features
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className='max-md:hidden'>
                    <h3 className='text-lg text-ktr-green mb-4'>Follow Us</h3>
                    <div className='flex items-center space-x-4 mb-6'>
                        <a
                            href="https://facebook.com"
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-gray-500'>
                            <TbBrandFacebook className='h-5 w-5' />
                        </a>
                        <a
                            href="https://instagram.com"
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-gray-500'>
                            <IoLogoInstagram className='h-5 w-5' />
                        </a>
                        <a
                            href="https://facebook.com"
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-gray-500'>
                            <RiTwitterXFill className='h-4 w-4' />
                        </a>
                    </div>
                    <p className='max-md:hidden text-ktr-green'>Call US</p>
                    <p>
                        <FiPhoneCall className='inline-block mr-2' />
                        +91 9876543210
                    </p>
                </div>
                <div className='min-md:hidden col-span-2'>
                    <h3 className='text-lg text-ktr-green mb-4'>Newsletter</h3>
                    <p className='font-medium text-sm  mb6'>Sign up and get 10% off your first order.</p>
                    <form className='flex my-4'>
                        <input type="email"
                            placeholder="enter your email"
                            className='p-3 bg-ktr-pink/25 text-sm  rounded-l-md focus:border-none focus:outline-none focus:ring-2 focus:ring-ktr-pink/50 transition'
                            required />
                        <button type='submit' className='bg-ktr-pink text-ktr-blue p-3 text-sm rounded-r-md hover:text-ktr-skin transition'>Subscribe</button>
                    </form>
                </div>
            </div>
            <div className='max-w-[2xl] p-2 sm:text-sm text-ktr-green'>
                <p className='text-center text-sm tracking-tighter'>© {new Date().getFullYear()}, All rights reserved. </p>
            </div>
        </footer>
    )
}

export default Footer
