import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [confirmId, setConfirmId] = useState(null) // ✅ tracks which order is pending delete
  const navigate = useNavigate()

  const fetchAllOrders = async () => {
    if (!token) return null
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  const formatDateTime = (timestamp) => {
    const d = new Date(timestamp)
    const date = d.toDateString()
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return { date, time }
  }

  // ✅ delete after confirmation
  const handleDelete = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/order/delete', { orderId: confirmId }, { headers: { token } })
      if (response.data.success) {
        toast.success('Order deleted')
        setOrders(prev => prev.filter(o => o._id !== confirmId))
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setConfirmId(null)
    }
  }

  return (
    <div className='p-3 sm:p-6 w-full overflow-hidden'>
      <h2 className='text-lg sm:text-xl font-semibold text-gray-700 mb-4'>All Orders</h2>
      <div className='flex flex-col gap-3 max-w-2xl mx-auto w-full'>
        {orders.map((order, index) => {
          const { date, time } = formatDateTime(order.date)
          return (
            <div
              key={index}
              className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-pink-300 transition-all duration-200'
            >
              {/* Top row: index + name + delete + arrow */}
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-gray-400 w-5'>{index + 1}</span>
                  <p className='text-sm font-semibold text-gray-800'>
                    {order.address.firstName} {order.address.lastName}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  {/* ✅ delete button — stops propagation so card click still works */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmId(order._id) }}
                    className='text-xs text-red-500 border border-red-300 px-2 py-0.5 rounded hover:bg-red-50 transition'
                  >Delete</button>
                  <span
                    onClick={() => navigate(`/orders/${order._id}`, { state: { order } })}
                    className='text-gray-400 text-lg cursor-pointer'
                  >›</span>
                </div>
              </div>

              {/* Middle row: mobile + date/time */}
              <div
                onClick={() => navigate(`/orders/${order._id}`, { state: { order } })}
                className='flex flex-wrap gap-x-4 gap-y-1 ml-7 cursor-pointer'
              >
                <p className='text-xs text-gray-500'>📞 {order.address.mobileNumber}</p>
                <p className='text-xs text-gray-500'>🗓 {date} · {time}</p>
              </div>

              {/* Bottom row: status */}
              <div
                onClick={() => navigate(`/orders/${order._id}`, { state: { order } })}
                className='ml-7 mt-2 cursor-pointer'
              >
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${order.status === 'Delivered'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'out for delivery'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {order.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ✅ confirmation modal */}

      
      {confirmId && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-80 shadow-xl text-center'>
            <p className='text-2xl mb-2'>🗑️</p>
            <h3 className='text-base font-semibold text-gray-800 mb-1'>Delete this order?</h3>
            <p className='text-sm text-gray-500 mb-5'>This action cannot be undone.</p>
            <div className='flex gap-3 justify-center'>
              <button
                onClick={() => setConfirmId(null)}
                className='px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50'
              >Cancel</button>
              <button
                onClick={handleDelete}
                className='px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600'
              >Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders