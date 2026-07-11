import React from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const PAGE_SIZE = 51

const BestSeller = () => {
  const { products } = React.useContext(ShopContext)
  const [bestSeller, setBestSeller] = React.useState([])
  const [page, setPage] = React.useState(1)
  const sectionRef = React.useRef(null)
  const isFirstRender = React.useRef(true)

React.useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false
    return
  }
  if (sectionRef.current) {
    const top = sectionRef.current.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }
}, [page])

  React.useEffect(() => {
    const bestProduct = products
      .filter(item => item.bestseller)
      .sort((a, b) => (b.sells || 0) - (a.sells || 0))
    setBestSeller(bestProduct)
    setPage(1)
  }, [products])

  const totalPages = Math.ceil(bestSeller.length / PAGE_SIZE)
  const paginated = bestSeller.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goToPage = (newPage) => {
    setPage(newPage)
  }

  React.useEffect(() => {
    if (sectionRef.current) {
      const top = sectionRef.current.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [page])

  return (
    <div className='my-2' ref={sectionRef}>
      <div className='text-center text-3xl py-2'>
        <Title text1={'Best'} text2={'Sellers'} />
        <p className='w-3/4 m-auto text-xs sm:text-3xl md:text-base text-gray-600'></p>
      </div>

      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 gap-y-6 min-h-100'>
        {paginated.map((item) => (
          <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} mprice={item.mprice} weight={item.weight} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className='flex justify-center items-center gap-2 mt-8'>
          <button
            onClick={() => goToPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className='px-4 py-2 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100'
          >Prev</button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`px-4 py-2 border rounded ${page === p ? 'bg-blue-950 text-white border-blue-950' : 'border-gray-300 hover:bg-gray-100'}`}
            >{p}</button>
          ))}

          <button
            onClick={() => goToPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className='px-4 py-2 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100'
          >Next</button>
        </div>
      )}
    </div>
  )
}

export default BestSeller