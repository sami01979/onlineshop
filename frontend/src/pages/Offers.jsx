import React from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const PAGE_SIZE = 51

const Offers = () => {
  const { products } = React.useContext(ShopContext)
  const [offerProducts, setOfferProducts] = React.useState([])
  const [page, setPage] = React.useState(1)
  const sectionRef = React.useRef(null)
  const userInitiated = React.useRef(false)

  React.useEffect(() => {
    const offered = products
      .filter(item => item.offer)
      .sort((a, b) => (b.sells || 0) - (a.sells || 0))
    setOfferProducts(offered)
    setPage(1)
  }, [products])

  const totalPages = Math.ceil(offerProducts.length / PAGE_SIZE)
  const paginated = offerProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goToPage = (newPage) => {
    userInitiated.current = true
    setPage(newPage)
  }

  React.useEffect(() => {
    if (userInitiated.current && sectionRef.current) {
      const top = sectionRef.current.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
      userInitiated.current = false
    }
  }, [page])

  return (
    <div className='pt-0.5 border-t' ref={sectionRef}>
      <div className='text-base sm:text-2xl mb-2 mt-2'>
        <Title text1={'Special'} text2={'Offers'} />
      </div>

      {offerProducts.length === 0 && (
        <p className='text-center text-gray-400 py-10'>No offers available right now</p>
      )}

      <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
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

export default Offers