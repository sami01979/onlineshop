import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {
    const { products, /* currency, delivery_fee  */ } = useContext(ShopContext)
    const [latestProducts, setLatestProducts] = React.useState([])
    React.useEffect(() => {
        setLatestProducts(products.slice(0, 12))
    }, [products])
    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1="Latest" text2="Products" />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>

                </p>
            </div>
            {/* Rendering product */}
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 gap-y-6'>
                {latestProducts.map((item, index) => (
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} mprice={item.mprice} weight={item.weight} />
                ))}
            </div>
        </div>
    )
}

export default LatestCollection