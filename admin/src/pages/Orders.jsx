import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
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

  return (
    <div className='p-3 sm:p-6 w-screen sm:w-full overflow-hidden'>
      <h2 className='text-lg sm:text-xl font-semibold text-gray-700 mb-4'>All Orders</h2>

      <div className='flex flex-col gap-3'>
        {orders.map((order, index) => {
          const { date, time } = formatDateTime(order.date)
          return (
            <div
              key={index}
              onClick={() => navigate(`/orders/${order._id}`, { state: { order } })}
              className='bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md hover:border-pink-300 transition-all duration-200'
            >
              {/* Top row: index + name + arrow */}
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-gray-400 w-5'>{index + 1}</span>
                  <p className='text-sm font-semibold text-gray-800'>
                    {order.address.firstName} {order.address.lastName}
                  </p>
                </div>
                <span className='text-gray-400 text-lg'>›</span>
              </div>

              {/* Middle row: mobile + date/time */}
              <div className='flex flex-wrap gap-x-4 gap-y-1 ml-7'>
                <p className='text-xs text-gray-500'>📞 {order.address.mobileNumber}</p>
                <p className='text-xs text-gray-500'>🗓 {date} · {time}</p>
              </div>

              {/* Bottom row: status */}
              <div className='ml-7 mt-2'>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  order.status === 'Delivered'
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
    </div>
  )
}

export default Orders