import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const UserOrderDetail = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { currency } = useContext(ShopContext)
  const order = state?.order

  if (!order) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center text-gray-500'>
        <p className='text-lg mb-3'>Order not found.</p>
        <button onClick={() => navigate('/orders')} className='text-pink-500 underline text-sm'>
          ← Back to Orders
        </button>
      </div>
    )
  }

  const formatDateTime = (timestamp) => {
    const d = new Date(timestamp)
    return `${d.toDateString()} · ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const statusSteps = ['Order Placed', 'Packing', 'Shipped', 'out for delivery', 'Delivered']
  const statusLabels = {
    'Order Placed': 'Order Placed',
    'Packing': 'Packing',
    'Shipped': 'Shipped',
    'out for delivery': 'Out for Delivery',
    'Delivered': 'Delivered'
  }
  const currentStep = statusSteps.indexOf(order.status)

  const statusColor = {
    'Order Placed': 'bg-yellow-100 text-yellow-700',
    'Packing': 'bg-orange-100 text-orange-700',
    'Shipped': 'bg-blue-100 text-blue-700',
    'out for delivery': 'bg-indigo-100 text-indigo-700',
    'Delivered': 'bg-green-100 text-green-700',
  }

  return (
    <div className='w-full max-w-xl mx-auto px-3 py-4 pb-24 sm:pb-6'>

      {/* Back */}
      <button
        onClick={() => navigate('/orders')}
        className='flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600 mb-4'
      >
        ← Back to Orders
      </button>

      {/* Header */}
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-base sm:text-lg font-bold text-gray-800'>Order Details</h2>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
          {statusLabels[order.status] || order.status}
        </span>
      </div>

      {/* Order Info */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3'>
        <p className='text-xs font-bold text-gray-400 uppercase tracking-wide mb-3'>📋 Order Info</p>
        <div className='flex flex-col gap-2 text-sm'>
          <div className='flex justify-between gap-2'>
            <span className='text-gray-500 shrink-0'>Order ID</span>
            <span className='font-mono text-xs text-gray-500 text-right break-all'>{order._id}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-500'>Date</span>
            <span className='font-medium text-gray-800 text-right'>{formatDateTime(order.date)}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-500'>Payment</span>
            <span className='font-medium text-gray-800'>{order.paymentMethod}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-500'>Payment Status</span>
            <span className={`font-semibold text-xs px-2 py-0.5 rounded-full ${order.payment ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
              {order.payment ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Status Progress */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3'>
        <p className='text-xs font-bold text-gray-400 uppercase tracking-wide mb-4'>🚚 Order Status</p>
        <div className='flex items-center justify-between px-1'>
          {statusSteps.map((step, i) => (
            <React.Fragment key={step}>
              <div className='flex flex-col items-center gap-1'>
                <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                  i <= currentStep ? 'bg-pink-500 border-pink-500' : 'bg-white border-gray-300'
                }`} />
                <span className='text-[9px] text-center text-gray-400 w-10 leading-tight hidden sm:block'>
                  {statusLabels[step]}
                </span>
              </div>
              {i < statusSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 rounded ${i < currentStep ? 'bg-pink-400' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className='text-center text-xs text-pink-500 font-semibold mt-3'>{statusLabels[order.status] || order.status}</p>
      </div>

      {/* Items */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3'>
        <p className='text-xs font-bold text-gray-400 uppercase tracking-wide mb-3'>🛒 Items Ordered</p>
        <div className='flex flex-col divide-y divide-gray-100'>
          {order.items.map((item, index) => {
            const subtotal = item.price * item.quantity
            return (
              <div key={index} className='flex gap-3 py-3 first:pt-0 last:pb-0'>
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className='w-14 h-14 object-cover rounded-lg border border-gray-100 shrink-0'
                />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-gray-800 mb-1'>{item.name}</p>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-gray-400'>{currency}{item.price} × {item.quantity}</span>
                    <span className='text-sm font-bold text-pink-600'>{currency}{subtotal}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Total */}
      <div className='bg-pink-50 border border-pink-100 rounded-xl p-4 flex justify-between items-center'>
        <p className='text-sm font-bold text-gray-700'>Total Amount</p>
        <p className='text-xl font-bold text-pink-600'>{currency}{order.amount}</p>
      </div>

    </div>
  )
}

export default UserOrderDetail