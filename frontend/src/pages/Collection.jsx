import React from 'react' 
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const PAGE_SIZE = 160

const Collection = () => {

   const { products, search, showSearch } = React.useContext(ShopContext)
   const [showFilter, setShowFilter] = React.useState(false)
   const [filterProducts, setFilterProducts] = React.useState([])
   const [category, setCategory] = React.useState([])
   const [subCategory, setSubCategory] = React.useState([])
   const [sortType, setSortType] = React.useState('relavent')
   const [page, setPage] = React.useState(1)

   const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
   }

   const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
    }
   }

   const applyFilter = () => {
    let productsCopy = products.slice()

    if (showSearch && search) {
        const q = search.toLowerCase()
        productsCopy = productsCopy.filter(item => {
            const inName = item.name.toLowerCase().includes(q)
            const inCategory = item.category?.toLowerCase().includes(q)
            const inTags = Array.isArray(item.tags) && 
                item.tags.some(tag => tag.toLowerCase().includes(q))
            return inName || inCategory || inTags
        })
        productsCopy.sort((a, b) => {
            const aName = a.name.toLowerCase()
            const bName = b.name.toLowerCase()
            const aStarts = aName.startsWith(q) ? 0 : 1
            const bStarts = bName.startsWith(q) ? 0 : 1
            const aTagStarts = Array.isArray(a.tags) && a.tags.some(t => t.toLowerCase().startsWith(q)) ? 0 : 1
            const bTagStarts = Array.isArray(b.tags) && b.tags.some(t => t.toLowerCase().startsWith(q)) ? 0 : 1
            const aScore = Math.min(aStarts, aTagStarts)
            const bScore = Math.min(bStarts, bTagStarts)
            return aScore - bScore
        })
    }

    if (category.length > 0) {
        productsCopy = productsCopy.filter(item => category.includes(item.category))
    }

    if (subCategory.length > 0) {
        productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy)
    setPage(1)
   }

   const sortProduct = () => {
    let fpCopy = filterProducts.slice()
    switch (sortType) {
        case 'low-high':
            setFilterProducts(fpCopy.sort((a, b) => a.price - b.price))
            break
        case 'high-low':
            setFilterProducts(fpCopy.sort((a, b) => b.price - a.price))
            break
        default:
            applyFilter()
            break
    }
    setPage(1)
   }

   React.useEffect(() => {
    applyFilter()
   }, [category, subCategory, search, showSearch, products])

   React.useEffect(() => {
    sortProduct()
   }, [sortType])

   const totalPages = Math.ceil(filterProducts.length / PAGE_SIZE)
   const paginated = filterProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-0.5 border-t'>
      {/* filter option */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-1 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        {/* category filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-1 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='text-sm font-medium mb-3'>Category</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-600'>
            <p className='flex gap-2'><input className='w-3' type="checkbox" value={'Cooking'} onChange={toggleCategory} />Cooking</p>
            <p className='flex gap-2'><input className='w-3' type="checkbox" value={'Snacks'} onChange={toggleCategory} />Snacks</p>
            <p className='flex gap-2'><input className='w-3' type="checkbox" value={'Spieces'} onChange={toggleCategory} />Spices</p>
            <p className='flex gap-2'><input className='w-3' type="checkbox" value={'Toiletries'} onChange={toggleCategory} />Toiletries</p>
          </div>
        </div>
        {/* subCategory filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-1 my-1 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='text-sm font-medium mb-3'>Sub-Category</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-600'>
            <p className='flex gap-2'><input className='w-3' type="checkbox" value={'Oil/Tel'} onChange={toggleSubCategory} />Oil/Tel</p>
            <p className='flex gap-2'><input className='w-3' type="checkbox" value={'Rice/Chal'} onChange={toggleSubCategory} />Rice/Chal</p>
            <p className='flex gap-2'><input className='w-3' type="checkbox" value={'Desert'} onChange={toggleSubCategory} />Desert</p>
            <p className='flex gap-2'><input className='w-3' type="checkbox" value={'Tea'} onChange={toggleSubCategory} />Tea</p>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className="flex-1">
        <div className='flex justify-between text-base sm:text-2xl mb-2'>
          <Title text1={"All"} text2={"Items"} />
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* products grid */}
        <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {paginated.map((item, index) => (
            <ProductItem key={index} name={item.name} id={item._id} price={item.price} mprice={item.mprice} image={item.image} weight={item.weight} />
          ))}
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-2 mt-8'>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className='px-4 py-2 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100'
            >Prev</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 border rounded ${page === p ? 'bg-blue-950 text-white border-blue-950' : 'border-gray-300 hover:bg-gray-100'}`}
              >{p}</button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='px-4 py-2 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100'
            >Next</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Collection