import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Update from './pages/Update'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify'

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '৳'

const AppContent = ({ token, setToken }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isOrderDetail = location.pathname.startsWith('/orders/') && location.pathname.length > '/orders/'.length

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ''
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} onMenuClick={() => setSidebarOpen(prev => !prev)} />
          <hr />
          <div className='flex w-full'>
            <Sidebar hidden={isOrderDetail} sidebarOpen={sidebarOpen} />
            <div className={`${isOrderDetail ? 'w-full px-0' : 'w-[70%]'} mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base`}>
              <Routes>
                <Route path='/' element={<Navigate to='/list' />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/orders/:id' element={<OrderDetail token={token} />} />
                <Route path='/update' element={<Update token={token} />} />
                <Route path='/update/:id' element={<Update token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')

  useEffect(() => {
    localStorage.setItem('adminToken', token)
  }, [token])

  return <AppContent token={token} setToken={setToken} />
}

export default App