import validator from "validator"
import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import 'dotenv/config'


const createToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET)
}
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({ success: false, message:'user not found'})
        } 

        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){
            const token = createToken(user._id)
            res.json({ success: true, token})
        }
        else{
            res.json({ success: false, message:'invalid password'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
    
} 

const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body
        //checking user exist or not
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({ success: false, message:'user already exists'})
        }  
        //validating emial format and password
        if(!validator.isEmail(email)){
            return res.json({ success: false, message:'invalid email'})
        }
        if(password.length<6){ 
            return res.json({ success: false, message:'password must be at least 6 characters'})
        }
        //hashing password
        const salt= await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        //creating user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId)
        if (!user) return res.json({ success: false, message: 'User not found' })
        res.json({ success: true, address: user.address || {}, name: user.name, email: user.email })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId, address } = req.body
        await userModel.findByIdAndUpdate(userId, { address })
        res.json({ success: true, message: 'Profile updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(
                { id: email + password },
                process.env.JWT_SECRET
            )
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'Invalid email or password' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin, getProfile, updateProfile }