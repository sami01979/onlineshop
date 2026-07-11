import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import { CartContext } from '../context/CartContext'

const CartTotal = () => {
    const { currency, delivery_fee } = useContext(ShopContext)
    const { getCartAmount } = useContext(CartContext)
  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={'AMOUNT'}/>
        </div>
        <div className='felx flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Sub Total</p>
                <p>{currency} {getCartAmount()} </p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency} {delivery_fee} </p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b> {currency} {getCartAmount()===0?0 : getCartAmount()+delivery_fee} </b>
            </div>
        </div>
    </div>
  )
}

export default CartTotal
