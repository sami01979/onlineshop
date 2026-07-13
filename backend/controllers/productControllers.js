import {v2 as cloudinary} from 'cloudinary' 
import productModel from '../models/productModel.js'

// function for add product
const addProduct = async (req, res) => {
    try {
        const {name, description, price, mprice, category, subCategory, bestseller, offer, tags, weight} = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0] 
        const image3 = req.files.image3 && req.files.image3[0] 
        const image4 = req.files.image4 && req.files.image4[0] 

        const images = [image1, image2, image3, image4].filter(image => image !== undefined)
        let imagesUrl = await Promise.all(
            images.map(async (image) => {
                let result = await cloudinary.uploader.upload(image.path, {resourse_type: 'image'})
                return result.secure_url
            })
        )

        const parsedTags = tags
            ? tags.split(',').map(t => t.trim()).filter(Boolean)
            : []

        const productData = {
            name,
            description,
            price: Number(price),
            mprice,
            category,
            subCategory,
            bestseller: bestseller === 'true' ? true : false,
            offer: offer === 'true' ? true : false,
            image: imagesUrl,
            tags: parsedTags,
            weight: weight || "",
            Date: Date.now()
        }

        const product = new productModel(productData)
        await product.save()
        res.json({success: true, message: 'Product added successfully'})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// function for list product — scored + sorted
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find().lean()

        const now = Date.now()
        const sevenDays = 7 * 24 * 60 * 60 * 1000

        const scored = products.map(p => {
            try {
                const age = now - p.Date
                const recencyBoost = age < sevenDays ? 15 : 0
                const bestsellerBoost = p.bestseller ? 10 : 0
                const seed = p._id.toString().charCodeAt(0) + new Date().getDate()
                const randomBoost = seed % 5
                p.score = (p.sells * 3) + (p.views * 1) + recencyBoost + bestsellerBoost + randomBoost
                return p
            } catch(err) {                 
                return p
            }
        })

        scored.sort((a, b) => b.score - a.score)
        res.json({success: true, products: scored})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// ✅ NEW — backend search controller
const searchProduct = async (req, res) => {
    try {
        const { query } = req.query

        if (!query || query.trim() === '') {
            return res.json({ success: true, products: [] })
        }

        const q = query.trim()
        const regex = new RegExp(q, 'i') // case-insensitive

        const products = await productModel.find({
            $or: [
                { name: regex },
                { category: regex },
                { subCategory: regex },
                { tags: regex }
            ]
        }).limit(30).lean()

        // sort — name/tag starts with query comes first
        products.sort((a, b) => {
            const aStarts = a.name.toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1
            const bStarts = b.name.toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1
            return aStarts - bStarts
        })

        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: 'Product removed successfully'})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// function for updating product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, mprice, category, subCategory, bestseller, offer, tags, weight } = req.body

        const updateData = {}

        if (name)        updateData.name        = name
        if (description) updateData.description = description
        if (price)       updateData.price        = Number(price)
        if (mprice !== undefined && mprice !== '') {
            updateData.mprice = Number(mprice)
        }
        if (category)    updateData.category    = category
        if (subCategory) updateData.subCategory = subCategory
        if (bestseller !== undefined)
                         updateData.bestseller  = bestseller === 'true' ? true : false

        if (offer !== undefined)
                         updateData.offer       = offer === 'true' ? true : false

        if (weight !== undefined) updateData.weight = weight

        if (tags !== undefined && tags !== '') {
            updateData.tags = tags.split(',').map(t => t.trim()).filter(Boolean)
        }

        let imagesUrl = []
        if (req.files) {
            const imageFields = ['image1', 'image2', 'image3', 'image4']
            for (const field of imageFields) {
                if (req.files[field]) {
                    const result = await cloudinary.uploader.upload(
                        req.files[field][0].path,
                        { resource_type: 'image' }
                    )
                    imagesUrl.push(result.secure_url)
                }
            }
            if (imagesUrl.length > 0) updateData.image = imagesUrl
        }

        const updated = await productModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        )

        if (!updated) {
            return res.json({ success: false, message: 'Product not found' })
        }

        res.json({ success: true, message: 'Product updated successfully', product: updated })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { id } = req.body
        const product = await productModel.findById(id).lean()
        if (!product) {
            return res.json({ success: false, message: 'Product not found' })
        }
        res.json({ success: true, product })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message})
    }
}

// track product page views
const trackView = async (req, res) => {
    try {
        const { id } = req.body
        await productModel.findByIdAndUpdate(id, { $inc: { views: 1 } })
        res.json({ success: true })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addProduct, listProduct, removeProduct, singleProduct, updateProduct, trackView, searchProduct }