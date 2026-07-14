import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { CartContext, CartActionsContext } from '../context/CartContext'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
 const { navigate, backendUrl, token, delivery_fee, products } = useContext(ShopContext)
const { cartItems, getCartAmount } = useContext(CartContext)
const { setCartItems } = useContext(CartActionsContext)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    areaName: '',
    buildingName: '',
    roadName: ''
  })

  useEffect(() => {
    const loadSavedAddress = async () => {
      if (!token) return
      try {
        const response = await axios.post(backendUrl + '/api/user/profile/get', {}, { headers: { token } })
        if (response.data.success && response.data.address?.firstName) {
          setFormData(response.data.address)
        }
      } catch (error) {
        console.log(error)
      }
    }
    loadSavedAddress()
  }, [token])

  const onChangeHandler = (event) => {
    const name = event.target.name
    let value = event.target.value

    if (name === 'mobileNumber') {
      value = value.replace(/\D/g, '').slice(0, 11)
    }

    setFormData(data => ({ ...data, [name]: value }))
  }

  const isValidMobile = (number) => /^01[0-9]{9}$/.test(number)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!isValidMobile(formData.mobileNumber)) {
      toast.error('Mobile number must start with 01 and contain 11 digits')
      return
    }

    try {
      let orderItems = []
      for (const itemId in cartItems) {
        if (cartItems[itemId] > 0) {
          const itemInfo = structuredClone(products.find(product => product._id === itemId))
          if (itemInfo) {
            itemInfo.quantity = cartItems[itemId]
            orderItems.push(itemInfo)
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch (method) {
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          if (response.data.success) {
            setCartItems({})
            if (token) {
              navigate('/orders')
            } else {
              navigate('/')
              toast.success('Order placed successfully!')
            }
          } else {
            toast.error(response.data.message)
          }
          break
        default:
          break
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t '>
      {/* left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-120 '>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First Name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last Name' />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name='mobileNumber'
          value={formData.mobileNumber}
          className='border border-gray-500 rounded py-1.5 px-3.5 w-full'
          type="tel"
          inputMode="numeric"
          maxLength={11}
          pattern="01[0-9]{9}"
          title="Mobile number must start with 01 and be 11 digits"
          placeholder='e.g. 01XXXXXXXXX'
        />
        <input required onChange={onChangeHandler} name='areaName' value={formData.areaName} className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Area Name' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='buildingName' value={formData.buildingName} className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Building Name' />
          <input required onChange={onChangeHandler} name='roadName' value={formData.roadName} className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Road Name' />
        </div>
      </div>
      {/* Right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex flex-col gap-3 lg:flex-row'>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder