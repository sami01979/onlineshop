import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import {backendUrl} from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [mprice, setMprice] = useState("")
    const [category, setCategory] = useState("None") 
    const [subCategory, setSubCategory] = useState("")
    const [bestseller, setBestseller] = useState(false)
    const [offer, setOffer] = useState(false)
    const [tags, setTags] = useState("")
    const [weight, setWeight] = useState("")

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("mprice", mprice)
            formData.append("category", category)
            formData.append("subCategory", subCategory)
            formData.append("bestseller", bestseller)
            formData.append("offer", offer)
            formData.append("tags", tags)
            formData.append("weight", weight)

            image1 && formData.append("image1", image1)
            image2 && formData.append("image2", image2)
            image3 && formData.append("image3", image3)
            image4 && formData.append("image4", image4)

            const response = await axios.post(backendUrl + "/api/product/add", formData, {headers:{token}})
            if (response.data.success) {
                toast.success(response.data.message)
                setName('')
                setDescription('')
                setImage1(false)
                setImage2(false)
                setImage3(false)
                setImage4(false)
                setPrice('')
                setMprice('')
                setTags('')
                setWeight('')
                setBestseller(false)
                setOffer(false)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

  return (
   <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-3 w-full'>
    <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
            <label htmlFor="image1">
                <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
                <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
            </label>
            <label htmlFor="image2">
                <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
                <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
            </label>
            <label htmlFor="image3">
                <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
                <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
            </label>
            <label htmlFor="image4">
                <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
                <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
            </label>
        </div>
    </div>
    <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-125 px-3 py-2' type="text" placeholder='Type here' required />
    </div>
    <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-125 px-3 py-2' type="text" placeholder='Write content here' required />
    </div>

    {/* Weight input */}
    <div className='w-full'>
        <p className='mb-2'>Weight / Volume <span className='text-gray-400 text-sm'>(e.g. 500g, 1kg, 250ml)</span></p>
        <input
            onChange={(e) => setWeight(e.target.value)}
            value={weight}
            className='w-full max-w-125 px-3 py-2'
            type="text"
            placeholder='500g'
        />
    </div>

    {/* Tags input */}
    <div className='w-full'>
        <p className='mb-2'>Tags <span className='text-gray-400 text-sm'>(comma separated, include Bengali)</span></p>
        <input
            onChange={(e) => setTags(e.target.value)}
            value={tags}
            className='w-full max-w-125 px-3 py-2'
            type="text"
            placeholder='tomato, টমেটো, vegetable, সবজি'
        />
    </div>

    <div className='flex flex-col sm:flex-row gap-2 sm:gap-8 w-full'>
        <div>
            <p className='mb-2'>Product Category</p>
            <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
                <option value="None">None</option>  
                <option value="Cooking">Cooking</option>
                <option value="Snacks">Snacks</option>
                <option value="Spices">Spices</option>
                <option value="Toiletries">Toiletries</option>
            </select>
        </div>
        <div>
            <p className='mb-2'>Sub Category</p>
            <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
                <option value="">None</option>
                <option value="Oil/Tel">Oil/Tel</option>
                <option value="Rice/Chal">Rice/Chal</option>
                <option value="Desert">Desert</option>
                <option value="Tea">Tea</option>
            </select>
        </div>
        <div>
            <p className='mb-2'>Product Price</p>
            <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-30' type="number" placeholder='00' />
        </div>
        <div>
            <p className='mb-2'>Product MRP Price</p>
            <input onChange={(e) => setMprice(e.target.value)} value={mprice} className='w-full px-3 py-2 sm:w-30' type="number" placeholder='mrp price' />
        </div>
    </div>
    <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
        <label htmlFor="bestseller">Add to bestseller</label>
    </div>
    <div className='flex gap-2'>
        <input onChange={() => setOffer(prev => !prev)} checked={offer} type="checkbox" id='offer' />
        <label htmlFor="offer">Add to offers</label>
    </div>
    <button type='submit' className='w-28 py-3 mt-4 bg-black text-white cursor-pointer'>ADD</button>
   </form>
  )
}

export default Add