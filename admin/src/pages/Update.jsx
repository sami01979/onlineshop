import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

const Update = ({ token }) => {

    const { id } = useParams()

    const [productId, setProductId] = useState("")
    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [mprice, setMprice] = useState("")
    const [category, setCategory] = useState("none")
    const [subCategory, setSubCategory] = useState("none")
    const [bestseller, setBestseller] = useState(false)
    const [existingImages, setExistingImages] = useState([])
    const [tags, setTags] = useState("")

    const fetchProduct = async (resolvedId) => {
        if (!resolvedId) return
        try {
            const response = await axios.post(backendUrl + "/api/product/single",
                { id: resolvedId },
                { headers: { token } }
            )
            if (response.data.success) {
                const p = response.data.product
                if (!p) {
                    toast.error("Product not found")
                    return
                }
                setProductId(p._id)
                setName(p.name)
                setDescription(p.description)
                setPrice(p.price)
                setMprice(p.mprice || "")
                setCategory(p.category)
                setSubCategory(p.subCategory)
                setBestseller(p.bestseller)
                setExistingImages(p.image || [])
                setTags(Array.isArray(p.tags) ? p.tags.join(', ') : "")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (id && token) {
            setProductId(id)
            fetchProduct(id)
        }
    }, [id, token])

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()

            formData.append("id", productId)
            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("mprice", mprice)
            formData.append("category", category)
            formData.append("subCategory", subCategory)
            formData.append("bestseller", bestseller)
            formData.append("tags", tags)

            image1 && formData.append("image1", image1)
            image2 && formData.append("image2", image2)
            image3 && formData.append("image3", image3)
            image4 && formData.append("image4", image4)

            const response = await axios.post(backendUrl + "/api/product/update", formData, { headers: { token } })
            if (response.data.success) {
    toast.success(response.data.message)
    // clear everything
    setName('')
    setDescription('')
    setPrice('')
    setMprice('')
    setCategory('none')
    setSubCategory('none')
    setBestseller(false)
    setTags('')
    setExistingImages([])
    setImage1(false)
    setImage2(false)
    setImage3(false)
    setImage4(false)
} else {
    toast.error(response.data.message)
}
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <div className='flex flex-col gap-4 w-full overflow-hidden'>

            <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-3 w-full'>

                {/* Existing Images Preview */}
                {existingImages.length > 0 && (
                    <div>
                        <p className='mb-2'>Current Images</p>
                        <div className='flex gap-2'>
                            {existingImages.map((url, i) => (
                                <img key={i} src={url} className='w-20 h-20 object-cover border' alt="" />
                            ))}
                        </div>
                    </div>
                )}

                {/* New Images Upload */}
                <div>
                    <p className='mb-2'>Replace Images (optional)</p>
                    <div className='flex gap-2'>
                        {[{ state: image1, set: setImage1, id: "image1" },
                        { state: image2, set: setImage2, id: "image2" },
                        { state: image3, set: setImage3, id: "image3" },
                        { state: image4, set: setImage4, id: "image4" }
                        ].map(({ state, set, id }) => (
                            <label htmlFor={id} key={id}>
                                <img className='w-20'
                                    src={!state ? assets.upload_area : URL.createObjectURL(state)}
                                    alt="" />
                                <input onChange={(e) => set(e.target.files[0])} type="file" id={id} hidden />
                            </label>
                        ))}
                    </div>
                </div>

                <div className='w-full'>
                    <p className='mb-2'>Product Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-125 px-3 py-2' type="text" placeholder='Type here' required />
                </div>

                <div className='w-full'>
                    <p className='mb-2'>Product Description</p>
                    <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-125 px-3 py-2' placeholder='Write content here' required />
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
                        <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
                            <option value="None">None</option>
                            <option value="Cooking">Cooking</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Spices">Spices</option>
                            <option value="Toiletries">Toiletries</option>
                        </select>
                    </div>
                    <div>
                        <p className='mb-2'>Sub Category</p>
                        <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2'>
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
                        <input onChange={(e) => setMprice(e.target.value)} value={mprice} className='w-full px-3 py-2 sm:w-30' type="number" placeholder='MRP price' />
                    </div>
                </div>

                <div className='flex gap-2 mt-2'>
                    <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
                    <label htmlFor="bestseller">Add to bestseller</label>
                </div>

                <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>UPDATE</button>
            </form>
        </div>
    )
}

export default Update