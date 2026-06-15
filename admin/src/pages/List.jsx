import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const List = ({ token }) => {
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const filteredList = list.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='w-screen px-2 sm:w-full md:px-2 lg:px-2'>

      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold text-gray-800'>All Products</h2>
        <span className='text-sm text-gray-400'>{filteredList.length} items</span>
      </div>

      {/* Search Bar */}
      <div className='relative mb-4'>
        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base'>🔍</span>
        <input
          type="text"
          placeholder='Search by name or category...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-gray-400 focus:bg-white transition-all'
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none'
          >×</button>
        )}
      </div>

      {/* Desktop Table Header */}
      <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center px-4 py-2 rounded-lg bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>
        <span>Image</span>
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>MRP</span>
        <span className='text-center'>Actions</span>
      </div>

      {/* Product List */}
      <div className='flex flex-col gap-2'>
        {filteredList.length > 0 ? (
          filteredList.map((item) => (
            <div
              key={item._id}
              className='bg-white border border-gray-100 rounded-xl px-3 py-3 shadow-sm hover:shadow-md hover:border-gray-200 transition-all'
            >
              {/* Mobile Layout */}
              <div className='flex items-center gap-3 md:hidden'>
                <img
                  className='w-14 h-14 object-cover rounded-lg border border-gray-100 shrink-0'
                  src={item.image[0]}
                  alt={item.name}
                />
                <div className='flex-1 min-w-0'>
                  <p className='font-medium text-gray-800 text-sm truncate'>{item.name}</p>
                  <span className='inline-block mt-0.5 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium'>
                    {item.category}
                  </span>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='text-sm font-semibold text-gray-800'>{currency}{item.price}</span>
                    <span className='text-xs text-gray-400 line-through'>{currency}{item.mprice}</span>
                  </div>
                </div>
                <div className='flex flex-col gap-2 shrink-0'>
                  <button
                    onClick={() => navigate(`/update/${item._id}`)}
                    className='w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-500 border border-gray-200 transition-all'
                  >
                    <img className='w-4' src={assets.update_icn} alt="edit" />
                  </button>
                  <button
                    onClick={() => removeProduct(item._id)}
                    className='w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 border border-gray-200 transition-all text-sm font-bold'
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2'>
                <img className='w-12 h-12 object-cover rounded-lg border border-gray-100' src={item.image[0]} alt={item.name} />
                <p className='text-sm font-medium text-gray-800 truncate'>{item.name}</p>
                <span className='inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium w-fit'>
                  {item.category}
                </span>
                <p className='text-sm font-semibold text-gray-800'>{currency}{item.price}</p>
                <p className='text-sm text-gray-400 line-through'>{currency}{item.mprice}</p>
                <div className='flex gap-2 justify-center'>
                  <button
                    onClick={() => navigate(`/update/${item._id}`)}
                    className='w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 transition-all'
                  >
                    <img className='w-4' src={assets.update_icn} alt="edit" />
                  </button>
                  <button
                    onClick={() => removeProduct(item._id)}
                    className='w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 border border-gray-200 transition-all text-sm font-bold'
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-center py-12 text-gray-400'>
            <p className='text-3xl mb-2'>📦</p>
            <p className='text-sm'>{searchQuery ? `No results for "${searchQuery}"` : 'No products yet'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default List