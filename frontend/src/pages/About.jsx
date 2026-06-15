import React from 'react' 
import Title from '../components/Title'
import {assets} from '../assets/frontend_assets/assets'
const About = () => {
  return (
    <div>
     <div className='text-2xl text-center pt-8 border-t'>
      <Title text1={'ABOUT'} text2={'US'}/>
     </div>
     <div className='flex my-10 flex-col md:flex-row gap-16'>
      <img className='w-full md:max-w-112.5' src={assets.about_img} alt="" />
      <div className='flex flex-col items-center gap-6 md:w-2/4 mt-35 text-gray-600'>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate dolorum deserunt doloribus! Quidem, dolores doloremque?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate dolorum deserunt doloribus! Quidem, dolores doloremque?</p>
        <b className='text-gray-600'>OUR MISSION</b>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit, consequuntur.</p>
      </div>
     </div>
     <div className='text-2xl py-4'>
      <Title text1={'WHY'} text2={'CHOOSE US'}/>
     </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit voluptatum aperiam numquam praesentium.</p>
         </div>
         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convinience:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit voluptatum aperiam numquam praesentium.</p>
         </div>
         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit voluptatum aperiam numquam praesentium.</p>
         </div>
      </div>
    </div>
  )
}

export default About
