import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const ResetPassword = () => {
  const { backendUrl, navigate } = useContext(ShopContext)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const token = new URLSearchParams(window.location.search).get('token')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(backendUrl + '/api/user/reset-password', { token, password })
      if (res.data.success) {
        toast.success('Password reset successful!')
        navigate('/login')
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
        <p className='prata-regular text-3xl'>Reset Password</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      <form onSubmit={onSubmit} className='w-full flex flex-col gap-4'>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='New password'
          className='w-full px-3 py-2 border border-gray-800'
          required
        />
        <input
          type='password'
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder='Confirm new password'
          className='w-full px-3 py-2 border border-gray-800'
          required
        />
        <button
          type='submit'
          disabled={loading}
          className='bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-50'
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}

export default ResetPassword