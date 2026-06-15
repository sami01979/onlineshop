import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const Hero = () => {
    return (
        <div className='flex flex-col sm:flex-row border border-gray-400'>
             {/* Hero right side */}
            <img className='w-full p-1 sm:w-1/2 ' src={assets.first_banner} alt="" />
            {/* Hero left side */}
            
            <img className='w-full p-1 sm:w-1/2 ' src={assets.second_banner} alt="" />
           
        </div>
    )
}

export default Hero
