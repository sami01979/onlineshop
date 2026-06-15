import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken, onMenuClick }) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <div className='flex items-center gap-3'>
        {/* Hamburger - mobile only */}
        <button
          onClick={onMenuClick}
          className='md:hidden flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100'
        >
          <span className='w-5 h-0.5 bg-gray-600 block'></span>
          <span className='w-5 h-0.5 bg-gray-600 block'></span>
          <span className='w-5 h-0.5 bg-gray-600 block'></span>
        </button>
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
      </div>
      <button
        onClick={() => setToken('')}
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar