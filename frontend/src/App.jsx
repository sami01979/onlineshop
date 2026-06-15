import React, { useContext } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
/* import About from './pages/About' */
import Cart from './pages/Cart'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Product from './pages/Product'
import Collection from './pages/Collection'
import PlaceOrder from './pages/PlaceOrder'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ShopContext } from './context/ShopContext'
import UserOrderDetail from './pages/UserOrderDetail'
import Profile from './pages/Profile'

const App = () => {
  const { getCartCount } = useContext(ShopContext)
  const location = useLocation()
  const navigate = useNavigate()

  const hideBar = location.pathname === '/place-order' || location.pathname === '/login'

  return (
   <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-16 sm:pb-0'>
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
       {/*  <Route path="/about" element={<About />} /> */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order-detail/:id" element={<UserOrderDetail />} />
      </Routes>
      <Footer />

      {/* Sticky Bottom Bar - mobile only */}
      {!hideBar && (
        <div className='fixed bottom-0 left-0 right-0 z-50 sm:hidden'>
          <div className='bg-blue-950 text-white flex items-center justify-between px-6 py-3 shadow-lg'>
            {/* Cart Icon + Count */}
            <button
              onClick={() => navigate('/cart')}
              className='flex items-center gap-2'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8H19M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <span className='text-xs font-bold bg-white text-blue-950 rounded-full w-5 h-5 flex items-center justify-center'>
                {getCartCount()}
              </span>
            </button>

            {/* Place Order Button */}
            <button
  onClick={() => navigate('/cart')}
  className='text-sm font-bold tracking-wide bg-white text-blue-950 px-5 py-1.5 rounded-full'
>
  View Cart →
</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App