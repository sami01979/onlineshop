import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(backendUrl + '/api/user/forgot-password', { email })
      if (res.data.success) {
        setSent(true)
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='flex flex-col items-center w-[90%] sm:max-w-96 mt-14 m-auto gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Forgot Password</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {sent ? (
        <div className='text-center'>
          <p className='text-green-600 font-medium'>Reset link sent!</p>
          <p className='text-sm text-gray-500 mt-2'>Check your email and click the link to reset your password.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className='w-full flex flex-col gap-4'>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            className='w-full px-3 py-2 border border-gray-800'
            required
          />
          <button
            type='submit'
            disabled={loading}
            className='bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-50'
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ForgotPassword