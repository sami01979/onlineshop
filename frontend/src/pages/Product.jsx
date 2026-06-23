import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';
import axios from 'axios';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, cartItems, updateQuantity, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const quantity = cartItems[productData?._id] || 0

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  // NEW — track view when product page opens
  useEffect(() => {
    if (productId) {
      axios.post(`${backendUrl}/api/product/view`, { id: productId })
        .catch(err => console.log('View tracking failed:', err))
    }
  }, [productId])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img onClick={() => setImage(item)} src={item} key={index}
                className='w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer' alt="" />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} className='w-full h-auto' alt="" />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>

          <div className='flex gap-3 items-center'>
            <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
            <p className='mt-5 line-through text-red-500 text-2xl font-medium'>{currency}{productData.mprice}</p>
          </div>
          {productData.weight && (
            <p className='text-base text-gray-600 mt-1'>{productData.weight}</p>
          )}
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          {/* Quantity Selector */}
          <div className='flex flex-col gap-4 my-8'>
            <p>Quantity</p>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => updateQuantity(productData._id, Math.max(0, quantity - 1))}
                className='border-2 border-blue-950 rounded-full w-8 h-8 text-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200'
              ><span className='text-blue-950'>-</span></button>
              <span className='w-8 text-center text-lg'>{quantity}</span>
              <button
                onClick={() => updateQuantity(productData._id, quantity + 1)}
                className='border-2 border-blue-950 rounded-full w-8 h-8 text-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200'
              ><span className='text-blue-950'>+</span></button>
            </div>
          </div>

          <button
            onClick={() => {
  if (quantity === 0) {
    toast.error('Please select a quantity!', { autoClose: 1000 });
    return;
  }
  toast.success('Item added to cart!', { autoClose: 1000 });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}}
            className='bg-blue-950 text-white px-8 py-3 text-sm active:bg-gray-700'
          >ADDED TO CART</button>

          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original Product</p>
            <p>Cash On Delivery</p>
            <p>Easy Return And Exchange Policy Within 2 days</p>
          </div>
        </div>
      </div>

      <RelatedProducts
  category={productData.category}
  subCategory={productData.subCategory}
  productId={productData._id}
  tags={productData.tags}
  name={productData.name}
/>
    </div>
  ) : <div className='opacity-0'></div>;
};

export default Product;