import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext)
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  const loadOrderData = async () => {
    try {
      if (!token) return null
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  const formatDateTime = (timestamp) => {
    const d = new Date(timestamp)
    return `${d.toDateString()} · ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const statusColor = {
    'Order Placed': 'bg-yellow-100 text-yellow-700',
    'Packing': 'bg-orange-100 text-orange-700',
    'Shipped': 'bg-blue-100 text-blue-700',
    'out for delivery': 'bg-indigo-100 text-indigo-700',
    'Delivered': 'bg-green-100 text-green-700',
  }

  return (
    <div className='border-t pt-10 pb-20 sm:pb-0'>
      <div className='text-2xl mb-6'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className='flex flex-col gap-3'>
        {orders.map((order, index) => (
          <div
            key={index}
            onClick={() => navigate(`/order-detail/${order._id}`, { state: { order } })}
            className='bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-pink-300 transition-all duration-200'
          >
            {/* Top row: icon + order id + status */}
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2'>
                {/* Parcel Icon */}
                <div className='w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center shrink-0'>
                  <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 text-pink-500' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Order</p>
                  <p className='text-xs font-mono text-gray-500'>{order._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                {order.status}
              </span>
            </div>

            {/* Middle: total + items count */}
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs text-gray-400'>Total</p>
                <p className='text-base font-bold text-gray-800'>{currency}{order.amount}</p>
              </div>
              <div className='text-right'>
                <p className='text-xs text-gray-400'>Items</p>
                <p className='text-sm font-medium text-gray-700'>{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Bottom: date */}
            <div className='mt-2 pt-2 border-t border-gray-100'>
              <p className='text-xs text-gray-400'>🗓 {formatDateTime(order.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders