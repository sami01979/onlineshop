import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate()

    return (
        <div className='flex flex-col gap-0.5 sm:flex-row'>
            {/* Hero right side - LCP image */}
            <img 
              className='w-full sm:w-1/2 aspect-1280/708 cursor-pointer rounded-sm' 
              src="/images/hero-banner-1.webp"
              alt="Anaibo grocery discount offers" 
              width="1280" 
              height="708" 
              fetchPriority="high"
              onClick={() => navigate('/offers')}
            />
            {/* Hero left side */}
            <img 
              className='w-full sm:w-1/2 aspect-1376/768 rounded-sm' 
              src="/images/hero-banner-2.webp"
              alt="Anaibo delivery service within 1-2 hours" 
              width="1376" 
              height="768" 
            />
        </div>
    )
}

export default Hero