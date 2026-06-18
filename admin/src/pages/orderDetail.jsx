import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { currency, backendUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const OrderDetail = ({ token }) => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const order = state?.order

  const [status, setStatus] = useState(order?.status || 'Order Placed')
  const [updating, setUpdating] = useState(false)

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
  const currentStep = statusSteps.indexOf(status)

  const statusColor = {
    'Order Placed': 'bg-yellow-100 text-yellow-700',
    'Packing': 'bg-orange-100 text-orange-700',
    'Shipped': 'bg-blue-100 text-blue-700',
    'out for delivery': 'bg-indigo-100 text-indigo-700',
    'Delivered': 'bg-green-100 text-green-700',
  }

  const handleStatusUpdate = async () => {
    setUpdating(true)
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId: order._id, status },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Status updated!')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setUpdating(false)
  }

  return (
    <div className='w-full max-w-xl mx-auto px-3 py-4 sm:px-6 sm:py-6'>

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
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[status] || 'bg-gray-100 text-gray-600'}`}>
          {statusLabels[status] || status}
        </span>
      </div>

      {/* Customer Card */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3'>
        <p className='text-xs font-bold text-gray-400 uppercase tracking-wide mb-3'>👤 Customer</p>
        <div className='flex flex-col gap-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-500'>Name</span>
            <span className='font-medium text-gray-800'>{order.address.firstName} {order.address.lastName}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-500'>Mobile</span>
            <span className='font-medium text-gray-800'>{order.address.mobileNumber}</span>
          </div>
          <div className='flex justify-between gap-4'>
            <span className='text-gray-500 shrink-0'>Address</span>
            <span className='font-medium text-gray-800 text-right'>
              {order.address.buildingName}, {order.address.roadName}, {order.address.areaName}
            </span>
          </div>
        </div>
      </div>

      {/* Order Info Card */}
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

      {/* Status Changer */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3'>
        <p className='text-xs font-bold text-gray-400 uppercase tracking-wide mb-3'>🚚 Update Status</p>

        {/* Progress Bar */}
        <div className='flex items-center justify-between mb-4 px-1'>
          {statusSteps.map((step, i) => (
            <React.Fragment key={step}>
              <div className='flex flex-col items-center gap-1'>
                <div className={`w-3 h-3 rounded-full border-2 transition-all ${i <= currentStep
                    ? 'bg-pink-500 border-pink-500'
                    : 'bg-white border-gray-300'
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

        {/* Dropdown + Button */}
        <div className='flex flex-col gap-2'>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-pink-400 bg-gray-50'
          >
            {statusSteps.map(s => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={updating}
            className='w-full bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50'
          >
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>

      {/* Items — ONLY ONE MAP HERE */}
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
                  {item.weight && <p className='text-xs text-gray-600 mb-1'>{item.weight}</p>}
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-gray-400'>৳{item.price} × {item.quantity}</span>
                    <span className='text-sm font-bold text-pink-600'>৳{subtotal}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Total */}
      <div className='bg-pink-50 border border-pink-100 rounded-xl p-4 flex justify-between items-center mb-6'>
        <p className='text-sm font-bold text-gray-700'>Total Amount</p>
        <p className='text-xl font-bold text-pink-600'>৳{order.amount}</p>
      </div>

    </div>
  )
}

export default OrderDetail