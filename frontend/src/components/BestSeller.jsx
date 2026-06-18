import React from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {
  const { products } = React.useContext(ShopContext)
  const [bestSeller, setBestSeller] = React.useState([])

  React.useEffect(() => {
    const bestProduct = products
      .filter(item => item.bestseller)
      .sort((a, b) => (b.sells || 0) - (a.sells || 0))
    setBestSeller(bestProduct)
  }, [products])
  return (
    <div className='my-2'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'Best'} text2={'Sellers'} />
        <p className='w-3/4 m-auto text-xs sm:text-3xl md:text-base text-gray-600'>
        </p>
      </div>
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 gap-y-6'>
        {bestSeller.map((item, index) => (
          <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} mprice={item.mprice} weight={item.weight} />
        ))}
      </div>
    </div>
  )
}

export default BestSeller
