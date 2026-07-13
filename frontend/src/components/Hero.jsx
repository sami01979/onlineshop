import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets'

const Hero = () => {
    const navigate = useNavigate()

    return (
        <div className='flex flex-col gap-0.5 sm:flex-row'>
             {/* Hero right side */}
            <img 
              className='w-full sm:w-1/2 aspect-1376/768 cursor-pointer' 
              src={assets.first_banner} 
              alt="Anaibo grocery discount offers" 
              width="1376" 
              height="768" 
              onClick={() => navigate('/offers')}
            />
            {/* Hero left side */}
            <img 
              className='w-full sm:w-1/2 aspect-1376/768' 
              src={assets.second_banner} 
              alt="Anaibo delivery service within 1-2 hours" 
              width="1376" 
              height="768" 
            />
        </div>
    )
}

export default Hero