import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const Footer = () => {
 return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr] gap-14 my-4 mt-2 text-sm'>
        <div className='mb#'> 
          <img src={assets.flogo} className='w-36 sm:w-40 mb-2' alt="" />
          <p className='w-full md:w-2/3 text-gray-600'>Anaibo — your everyday online grocery store. Fresh products, great prices, delivered to your door.</p>
        </div>
        <div>
          <p className='text-xl mt-1.5 font-medium sm:mt-26'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>01890421948</li>
            <li>anaibo.bd@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='text-center text-gray-400 text-sm py-5'>Copyright © 2026 Anaibo. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer
