import React from 'react'
import menImg from '../../assets/mens-collection.webp'
import womenImg from '../../assets/womens-collection.webp'
import { Link } from 'react-router-dom'
function GenderCollectionSection() {
  return (
    <section className='py-16 px-4 lg:px-35 mb-16'>
        <div className='container mx-auto flex flex-col md:flex-row gap-8'>
            <div className='relative flex-1'>
                <img 
                src={womenImg} 
                alt="Women's Collection" 
                className='w-ful h-[700px] object-cover'/>
                <div className='absolute botton-8 left-8 bg-white bg-opacity-90 p-4'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-3 mb-2'>
                        Women's Collection
                    </h2>
                    <Link to="/collections/all?gender=Women"
                    className="text-gray-900 underline">
                        Shop Now
                    </Link>
                </div>
            </div>
            <div className='relative flex-1'>
                <img 
                src={menImg} 
                alt="Men's Collection" 
                className='w-ful h-[700px] object-cover'/>
                <div className='absolute botton-8 left-8 bg-white bg-opacity-90 p-4'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-3 mb-2'>
                        Men's Collection
                    </h2>
                    <Link to="/collections/all?gender=Men"
                    className="text-gray-900 underline">
                        Shop Now
                    </Link>
                </div>
            </div>
        </div>
        </section>
  )
}

export default GenderCollectionSection