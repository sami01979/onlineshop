import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number, required:true},
    mprice:{type:Number,required:true},
    category:{type:String, required:true},
    subCategory:{type:String, required:false},
    image:{type:Array, required:true},
    bestseller:{type:Boolean, default:false},
    sells:{type:Number, default:0},
    Date:{type:Number,required:true}
})

const productModel =mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;