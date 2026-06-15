import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    cartData: { type: Object, default: {} },
    address: {
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        mobileNumber: { type: String, default: '' },
        areaName: { type: String, default: '' },
        buildingName: { type: String, default: '' },
        roadName: { type: String, default: '' }
    }
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;