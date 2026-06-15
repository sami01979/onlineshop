import {v2 as cloudinary} from 'cloudinary' 
import productModel from '../models/productModel.js'
//function for add product

const addProduct = async (req, res) => {
    try {
        const {name, description, price, mprice, category,subCategory,sizes,bestseller} = req.body

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

        const productData= {
            name,
            description,
            price:Number(price),
            mprice,
            category,
            subCategory,
            bestseller: bestseller === 'true' ? true : false,
            image: imagesUrl,
            Date:Date.now()
        }
        console.log(productData)

        const product = new productModel(productData)
        await product.save()
        res.json({success:true, message:'Product added successfully'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//function for list product
const listProduct = async (req, res) => {
    try {
         const products = await productModel.find()
            res.json({success:true, products})
    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message})
    }
    
}

//function for removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:'Product removed successfully'})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price,mprice, category, subCategory, bestseller, sizes } = req.body

        const updateData = {}

        if (name)        updateData.name        = name
        if (description) updateData.description = description
        if (price)       updateData.price        = Number(price)
        if (mprice !== undefined && mprice !== '') {
            updateData.mprice = Number(mprice)
        }
        if (category)    updateData.category     = category
        if (subCategory) updateData.subCategory  = subCategory
        if (bestseller !== undefined)
                         updateData.bestseller    = bestseller === 'true' ? true : false

        // Handle new images if uploaded
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
            { new: true }          // returns the updated document
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

//function for single product info
const singleProduct = async (req, res) => {
    try {
        const { id } = req.body  // ← change productId to id
        const product = await productModel.findById(id)
        if (!product) {
            return res.json({ success: false, message: 'Product not found' })
        }
        res.json({ success: true, product })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {addProduct, listProduct, removeProduct, singleProduct,updateProduct}