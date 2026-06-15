import React, { useContext, useRef, useEffect } from 'react' // CHANGED: added useRef, useEffect
import { assets } from '../assets/frontend_assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
const Navbar = () => {
  const [visible, setVisible] = React.useState(false)
  const [dropdownOpen, setDropdownOpen] = React.useState(false) // CHANGED: added dropdown state
  const dropdownRef = useRef(null) // CHANGED: added ref for outside click detection

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext)

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  // CHANGED: close dropdown when clicking outside
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
    <div className='flex items-center justify-between py-2 font-medium'>
      <Link to='/'>
        < img src={assets.flogo} className='w-40 sm:w-52' alt="Logo" />
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

        <NavLink to='/contact' className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>
      <div className='flex items-center gap-6'>
        <Link to={'/collection'}><img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="Search" /></Link>

        {/* CHANGED: replaced group-hover with click toggle, added ref */}
        <div className='relative' ref={dropdownRef}>
          <img
            src={assets.profile_icon}
            className='w-5 cursor-pointer'
            alt="Profile"
            onClick={() => token ? setDropdownOpen(!dropdownOpen) : navigate("/login")}
          />
          {/* CHANGED: show/hide based on dropdownOpen state instead of group-hover */}
          {token && dropdownOpen && (
            <div className='absolute right-0 pt-4 z-50'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-gray-200 text-gray-600 rounded shadow-lg'>
                <Link to='/profile'>
                  <p className='cursor-pointer hover:text-black'>My Profile</p>
                </Link>
                <p onClick={() => navigate("/orders")} className='cursor-pointer hover:text-black'>Orders</p>
                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          )}
        </div>

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5 cursor-pointer' alt="Cart" />
          <p className='absolute -right-1.25 -bottom-1.25 w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
        </Link>
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="Menu" />
      </div>
      {/*sidebar for Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-full bg-white z-50 transition-all overflow-hidden ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className='flex flex-col text-gray-500'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>ALL ITEMS</NavLink>
          {/*  <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink> */}
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar