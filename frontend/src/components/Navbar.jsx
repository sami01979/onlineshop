import React, { useContext, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { assets } from '../assets/frontend_assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { CartContext, CartActionsContext } from '../context/CartContext'
import { ShopContext } from '../context/ShopContext'

const Navbar = ({ scrolled }) => {
  const [visible, setVisible] = React.useState(false)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const dropdownRef = useRef(null)

  const { setShowSearch, navigate, token, setToken } = useContext(ShopContext)
  const { getCartCount } = useContext(CartContext)
  const { setCartItems } = useContext(CartActionsContext)

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`flex items-center justify-between font-medium transition-all duration-300 ${scrolled ? 'py-1 sm:py-0' : 'py-3 sm:py-0'}`}>
      <Link to='/'>
        <img
          src={assets.flogo}
          className={`h-auto rounded-md transition-all duration-300 ${scrolled ? 'w-28 sm:w-52' : 'w-40 sm:w-52'}`}
          alt="Logo"
          width="208"
          height="52"
        />
      </Link>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className="flex flex-col items-center gap-1">
          <p>ALL ITEMS</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink to='/offers' className="flex flex-col items-center gap-1">
          <p>OFFERS</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink to='/contact' className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>
      <div className='flex items-center gap-6'>
        <button
  type="button"
  onClick={() => {
    setShowSearch(true)
    navigate('/collection')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      document.getElementById('anaibo-search-input')?.focus()
    }, 100)
  }}
  className='relative z-10 p-1 -m-1'
>
  <img
    src={assets.search_icon}
    className='w-5 h-5 cursor-pointer pointer-events-none'
    alt="Search"
    width="20"
    height="20"
  />
</button>

        <div className='relative' ref={dropdownRef}>
          <img
            src={assets.profile_icon}
            className='w-5 h-5 cursor-pointer'
            alt="Profile"
            width="20"
            height="20"
            onClick={() => token ? setDropdownOpen(!dropdownOpen) : navigate("/login")}
          />
          {token && dropdownOpen && (
  <div className='absolute right-0 pt-4 z-50'>
    <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-gray-200 text-gray-600 rounded shadow-lg'>
      <Link to='/profile' onClick={() => setDropdownOpen(false)}>
        <p className='cursor-pointer hover:text-black'>My Profile</p>
      </Link>
      <p
        onClick={() => {
          navigate("/orders")
          setDropdownOpen(false)
        }}
        className='cursor-pointer hover:text-black'
      >
        Orders
      </p>
      <p
        onClick={() => {
          logout()
          setDropdownOpen(false)
        }}
        className='cursor-pointer hover:text-black'
      >
        Logout
      </p>
    </div>
  </div>
)}
        </div>

        <Link to='/cart' className='relative'>
          <img
            src={assets.cart_icon}
            className='w-5 h-5 min-w-5 cursor-pointer'
            alt="Cart"
            width="20"
            height="20"
          />
          <p className='absolute -right-1.25 -bottom-1.25 w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 h-5 cursor-pointer sm:hidden'
          alt="Menu"
          width="20"
          height="20"
        />
      </div>

      {/* sidebar for Mobile Menu — rendered via portal to escape backdrop-blur containing block */}
      {createPortal(
        <div className={`fixed top-0 left-0 w-full h-full bg-white z-999 transition-all overflow-hidden ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className='flex flex-col text-gray-500'>
            <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
              <img className='h-4 w-4 rotate-180' src={assets.dropdown_icon} alt="" width="16" height="16" />
              <p>Back</p>
            </div>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>ALL ITEMS</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/offers'>OFFERS</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default Navbar