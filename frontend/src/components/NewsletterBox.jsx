import React from 'react'

const NewsletterBox = () => {
    const onSubmithandler =(event)=>{
        event.preventDefault()
    }
  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-700'>Subscribe to our newsletter</p>
        <p className='text-gray-400 mt-3'>Get the latest updates and offers</p>
      <form onSubmit={onSubmithandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 ' >
        <input type="email" placeholder='Enter your email' className='w-full sm:flex-1 py-2 focus:outline-none' />
        <button className='bg-gray-700 text-white px-4 py-2'>Subscribe</button>
      </form>
    </div>
  )
}

export default NewsletterBox
