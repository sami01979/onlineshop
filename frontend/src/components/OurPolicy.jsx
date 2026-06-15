import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const OurPolicy = () => {
  return (
    <div className='grid grid-cols-2 sm:flex sm:flex-row justify-around gap-8 sm:gap-2 text-center py-6 sm:mb-4 text-xs sm:text-sm md:text-base text-gray-700'>
      <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>Easy Exchange Policy</p>
        <p className='text-gray-400'>Not satisfied with your purchase? No problem! We have a simple and hassle-free exchange policy.</p>
      </div>
      <div>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>Quality Assurance</p>
        <p className='text-gray-400'>We stand by the quality of our products. If you're not satisfied, let us know and we'll make it right.</p>
      </div>
      <div className='col-span-2 flex flex-col items-center sm:block'>
        <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>Best Customer Support</p>
        <p className='text-gray-400'>Our dedicated support team is always ready to assist you with any questions or concerns.</p>
      </div>
    </div>
  )
}

export default OurPolicy