import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ITEMS_PER_PAGE = 100

const ConfirmModal = ({ product, onConfirm, onCancel }) => {
  if (!product) return null
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={onCancel} />
      <div className='relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-auto'>
        <div className='flex flex-col items-center text-center gap-3'>
          <div className='w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-2xl'>🗑️</div>
          <div>
            <h3 className='font-semibold text-gray-800 text-base'>Remove Product?</h3>
            <p className='text-sm text-gray-500 mt-1'>
              <span className='font-medium text-gray-700'>"{product.name}"</span> will be permanently deleted. This cannot be undone.
            </p>
          </div>
          <div className='flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 w-full'>
            <img src={product.image[0]} alt={product.name} className='w-10 h-10 object-cover rounded-lg border border-gray-100 shrink-0' />
            <div className='text-left min-w-0'>
              <p className='text-sm font-medium text-gray-800 truncate'>{product.name}</p>
              <p className='text-xs text-gray-400'>{product.category} · {currency}{product.price}</p>
            </div>
          </div>
          <div className='flex gap-3 w-full mt-1'>
            <button onClick={onCancel} className='flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'>
              Cancel
            </button>
            <button onClick={onConfirm} className='flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all'>
              Yes, Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const List = ({ token }) => {
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmProduct, setConfirmProduct] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

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
    } finally {
      setConfirmProduct(null)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  // Reset to page 1 whenever search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const filteredList = list.filter(item => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    const nameMatch = item.name.toLowerCase().includes(q)
    const categoryMatch = item.category.toLowerCase().includes(q)
    const tagMatch = Array.isArray(item.tags) && item.tags.some(tag => tag.toLowerCase().includes(q))
    return nameMatch || categoryMatch || tagMatch
  })

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE)
  const paginatedList = filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Build smart page range: always show first, last, current ±1, with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1].filter(p => p >= 1 && p <= totalPages))
    const sorted = [...pages].sort((a, b) => a - b)
    const result = []
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
      result.push(sorted[i])
    }
    return result
  }

  return (
    <div className='w-full px-2'>

      <ConfirmModal
        product={confirmProduct}
        onConfirm={() => removeProduct(confirmProduct._id)}
        onCancel={() => setConfirmProduct(null)}
      />

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
          placeholder='Search by name, category or tag...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-gray-400 focus:bg-white transition-all'
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none'>×</button>
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
        {paginatedList.length > 0 ? (
          paginatedList.map((item) => (
            <div key={item._id} className='bg-white border border-gray-100 rounded-xl px-3 py-3 shadow-sm hover:shadow-md hover:border-gray-200 transition-all'>

              {/* Mobile Layout */}
              <div className='flex items-center gap-3 md:hidden'>
                <img className='w-14 h-14 object-cover rounded-lg border border-gray-100 shrink-0' src={item.image[0]} alt={item.name} />
                <div className='flex-1 min-w-0'>
                  <p className='font-medium text-gray-800 text-sm truncate'>{item.name}</p>
                  <span className='inline-block mt-0.5 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium'>{item.category}</span>
                  {Array.isArray(item.tags) && item.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1 mt-1'>
                      {item.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className='px-1.5 py-0.5 bg-orange-50 text-orange-500 text-[10px] rounded-md font-medium'>#{tag}</span>
                      ))}
                      {item.tags.length > 3 && <span className='text-[10px] text-gray-400'>+{item.tags.length - 3}</span>}
                    </div>
                  )}
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='text-sm font-semibold text-gray-800'>{currency}{item.price}</span>
                    <span className='text-xs text-gray-400 line-through'>{currency}{item.mprice}</span>
                  </div>
                </div>
                <div className='flex gap-2 shrink-0'>
                  <button onClick={() => navigate(`/update/${item._id}`)} className='w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all' title='Edit'>
                    <img className='w-4' src={assets.update_icn} alt="edit" />
                  </button>
                  <button onClick={() => setConfirmProduct(item)} className='w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 border border-red-100 transition-all text-base font-bold' title='Remove'>
                    ✕
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2'>
                <img className='w-12 h-12 object-cover rounded-lg border border-gray-100' src={item.image[0]} alt={item.name} />
                <div className='min-w-0'>
                  <p className='text-sm font-medium text-gray-800 truncate'>{item.name}</p>
                  {Array.isArray(item.tags) && item.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1 mt-1'>
                      {item.tags.slice(0, 4).map((tag, i) => (
                        <span key={i} className='px-1.5 py-0.5 bg-orange-50 text-orange-500 text-[10px] rounded-md font-medium'>#{tag}</span>
                      ))}
                      {item.tags.length > 4 && <span className='text-[10px] text-gray-400'>+{item.tags.length - 4}</span>}
                    </div>
                  )}
                </div>
                <span className='inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium w-fit'>{item.category}</span>
                <p className='text-sm font-semibold text-gray-800'>{currency}{item.price}</p>
                <p className='text-sm text-gray-400 line-through'>{currency}{item.mprice}</p>
                <div className='flex gap-3 justify-center'>
                  <button onClick={() => navigate(`/update/${item._id}`)} className='w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all' title='Edit'>
                    <img className='w-4' src={assets.update_icn} alt="edit" />
                  </button>
                  <button onClick={() => setConfirmProduct(item)} className='w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 border border-red-100 transition-all text-base font-bold' title='Remove'>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-1.5 mt-6 flex-wrap'>
          {/* Prev */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all'
          >
            ← Prev
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, i) =>
            page === '...'
              ? <span key={`ellipsis-${i}`} className='px-2 text-gray-400 text-sm'>…</span>
              : <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all border ${
                    currentPage === page
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
          )}

          {/* Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all'
          >
            Next →
          </button>
        </div>
      )}

      {/* Page info */}
      {totalPages > 1 && (
        <p className='text-center text-xs text-gray-400 mt-2'>
          Page {currentPage} of {totalPages} · showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredList.length)} of {filteredList.length}
        </p>
      )}

    </div>
  )
}

export default List