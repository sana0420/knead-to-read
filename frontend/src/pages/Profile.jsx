import React from 'react'
import MyOrdersPage from './MyOrdersPage'

const Profile = () => {
  return (
    <div className='min-h-screen flex flex-col'>
        <div className='flex-grow container mx-auto p-4 md:p-6'>
            <div className='flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0'>
                {/*left section */}
                <div className='w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md'>
                <h1 className='text-2xl md:text-3xl font-bold mb-4'>John Doe</h1>
                <p className='text-lg text-gray-600 mb-4'>John@exaple.c</p>
                <button className='w0full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'>
                    Logout
                </button>
                </div>
                {/*right section */}
                <div className='w-full md:h-2/3 lg:w-3/4 '>
                <MyOrdersPage/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile