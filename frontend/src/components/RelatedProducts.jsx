import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
const RelatedProducts = ({category,subCategory}) => {
    const {products} = useContext(ShopContext)
    const [related,setRelated] = useState([]);

    useEffect(()=>{
        if(products.length>0){
            let productsCopy = products.slice();

            productsCopy = productsCopy.filter((item)=> category === item.category)
            productsCopy = productsCopy.filter((item)=> subCategory === item.subCategory)

            setRelated(productsCopy.slice(0,9));
        }
    },[products])
  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'}></Title>
      </div>
      <div className=' grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 gap-y-6'>
        { 
          related.map((item,index)=>(
            <ProductItem key={index} id={item._id} name={item.name} price={item.price} mprice={item.mprice} image={item.image} weight={item.weight} />
          ))
        }
      </div>
    </div>
  )
}

export default RelatedProducts
