import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const RelatedProducts = ({ category, subCategory, productId, tags = [], name = '' }) => {
  const { products } = useContext(ShopContext)
  const [related, setRelated] = useState([])

  const getNameWords = (str) =>
    str.toLowerCase().split(/\s+/).filter(w => w.length > 2)

  useEffect(() => {
    if (products.length > 0) {
      const isUncategorized = category === 'none' && subCategory === 'none'

      let pool = products.filter(item => item._id !== productId)

      if (isUncategorized) {
        const currentWords = getNameWords(name)

        pool = pool
          .filter(item => item.category === 'none' && item.subCategory === 'none')
          .map(item => {
            const tagScore = (item.tags || []).filter(tag => tags.includes(tag)).length * 2
            const nameScore = getNameWords(item.name).filter(w => currentWords.includes(w)).length * 5
            return { ...item, score: tagScore + nameScore }
          })
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
      } else {
        pool = pool
          .filter(item => item.category === category && item.subCategory === subCategory)
          .map(item => ({
            ...item,
            score: (item.tags || []).filter(tag => tags.includes(tag)).length
          }))
          .sort((a, b) => b.score - a.score)
      }

      setRelated(pool.slice(0, 12))
    }
  }, [products, productId])

  return (
    <div className='mt-5 mb-5'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      {related.length > 0 ? (
        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 gap-y-6'>
          {related.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              mprice={item.mprice}
              image={item.image}
              weight={item.weight}
            />
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-400 text-sm mt-6'>No related products found.</p>
      )}
    </div>
  )
}

export default RelatedProducts