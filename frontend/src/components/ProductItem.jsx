import React, { useState, useEffect, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { optimizeCloudinaryUrl } from '../utils/imageUtils'

const ProductItem = ({ id, image, name, price, mprice, weight }) => {
  const { currency, cartItems, addToCart, updateQuantity } = React.useContext(ShopContext)
  const quantity = cartItems[id] || 0
  const [expanded, setExpanded] = useState(false)
  const timerRef = useRef(null)

  // Auto collapse after 2.5 seconds of inactivity
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setExpanded(false)
    }, 2500)
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // If quantity becomes 0, collapse
  useEffect(() => {
    if (quantity === 0) {
      setExpanded(false)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [quantity])

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(id, 1)
    setExpanded(true)
    resetTimer()
  }

  const handleIncrease = (e) => {
    e.preventDefault()
    e.stopPropagation()
    updateQuantity(id, quantity + 1)
    setExpanded(true)
    resetTimer()
  }

  const handleDecrease = (e) => {
    e.preventDefault()
    e.stopPropagation()
    updateQuantity(id, quantity - 1)
    if (quantity - 1 > 0) {
      setExpanded(true)
      resetTimer()
    }
  }

  return (
    <Link
      to={`/product/${id}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='text-gray-700 cursor-pointer flex flex-col h-full'
    >
      {/* Image */}
      <div className='relative overflow-hidden rounded-lg bg-gray-50'>
        <img
  className='w-full aspect-square object-cover hover:scale-105 transition ease-in-out duration-300'
  src={optimizeCloudinaryUrl(image[0], 400)}
  alt={name}
  loading='lazy'
  width='400'
  height='400'
/>

        {/* Cart Control */}
        {quantity === 0 ? (
          // + button
          <button
            onClick={handleAdd}
            className='absolute bottom-2 right-2 w-7 h-7 bg-white border-2 border-blue-950 text-blue-950 rounded-full flex items-center justify-center text-lg font-bold shadow hover:bg-pink-500 hover:text-white transition-all'
          >
            +
          </button>
        ) : expanded ? (
          // Expanded: − qty +
          <div
            onClick={(e) => e.preventDefault()}
            className='absolute bottom-2 right-2 flex items-center gap-1 bg-blue-950 rounded-full px-2 py-0.5 shadow transition-all duration-300'
          >
            <button
              onClick={handleDecrease}
              className='text-white font-bold text-base w-5 h-5 flex items-center justify-center'
            >
              −
            </button>
            <span className='text-white text-xs font-bold min-w-4 text-center'>{quantity}</span>
            <button
              onClick={handleIncrease}
              className='text-white font-bold text-base w-5 h-5 flex items-center justify-center'
            >
              +
            </button>
          </div>
        ) : (
          /* circle button */
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setExpanded(true)
              resetTimer()
            }}
            className='absolute bottom-2 right-2 w-7 h-7 bg-blue-950 text-white rounded-full flex items-center justify-center text-xs font-bold shadow'>
            {quantity}
          </button>
        )}
      </div>

      {/* Name */}
      <p className='pt-2 text-sm leading-tight line-clamp-2 min-h-10'>{name}</p>

      {/* Price */}
      {/* Price */}
<div className='flex items-center gap-1.5 mt-1'>
  <p className='text-sm font-bold text-gray-800'>{currency}{price}</p>
  {mprice && <p className='line-through text-red-400 text-xs'>{currency}{mprice}</p>}
</div>
{weight && <p className='text-sm text-gray-500 mt-0.5'>{weight}</p>}
    </Link>
  )
}

export default ProductItem