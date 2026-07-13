import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true },
    mprice:      { type: Number, required: true },
    category:    { type: String, required: true },
    subCategory: { type: String, required: false },
    image:       { type: Array, required: true },
    bestseller:  { type: Boolean, default: false },
    offer:       { type: Boolean, default: false },   // NEW
    sells:       { type: Number, default: 0 },
    views:       { type: Number, default: 0 },        // NEW
    tags:        { type: Array, default: [] },  
    weight: { type: String, default: "" } ,       // NEW
    Date:        { type: Number, required: true }
})

// Text index for faster search
productSchema.index({ name: 'text', category: 'text', tags: 'text' })

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;