import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login')
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate("/")
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 mt-14 m-auto gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {currentState !== 'Login' && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Name'
          required
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Email'
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Password'
        required
      />

      {/* Forgot password */}
      {currentState === 'Login' && (
        <div className='w-full text-right -mt-2'>
          <p
            onClick={() => navigate('/forgot-password')}
            className='text-red-500 text-sm cursor-pointer hover:underline inline-block'
          >
            Forgot your password?
          </p>
        </div>
      )}

      <button className='bg-black text-white font-light px-8 py-2 w-full mt-2'>
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>

      {/* Create Account / Login Here */}
      <div className='w-full mt-1'>
        {currentState === 'Login' ? (
          <button
            type='button'
            onClick={() => setCurrentState('Sign Up')}
            className='w-full border-2 border-black text-black font-semibold py-2 hover:bg-black hover:text-white transition-colors duration-200'
          >
            Create Account
          </button>
        ) : (
          <button
            type='button'
            onClick={() => setCurrentState('Login')}
            className='w-full border-2 border-black text-black font-semibold py-2 hover:bg-black hover:text-white transition-colors duration-200'
          >
            Login Here
          </button>
        )}
      </div>
    </form>
  )
}

export default Login