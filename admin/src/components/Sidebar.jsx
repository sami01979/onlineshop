import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = ({ hidden, sidebarOpen }) => {
  if (hidden) return null

  return (
    <div className={`${sidebarOpen ? 'flex' : 'hidden md:flex'} w-[18%] min-h-screen border-r-2 flex-col`}>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-100 font-semibold' : ''}`
          }
          to='/add'
        >
          <img className='w-5 h-5' src={assets.add_icon} alt='' />
          <p className='hidden md:block'>Add Items</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-100 font-semibold' : ''}`
          }
          to='/list'
        >
          <img className='w-5 h-5' src={assets.list_icn} alt='' />
          <p className='hidden md:block'>List Items</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-100 font-semibold' : ''}`
          }
          to='/orders'
        >
          <img className='w-5 h-5' src={assets.order_icon} alt='' />
          <p className='hidden md:block'>Orders</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-100 font-semibold' : ''}`
          }
          to='/update'
        >
          <img className='w-5 h-5' src={assets.update_icn} alt='' />
          <p className='hidden md:block'>Update</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar