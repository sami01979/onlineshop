import validator from "validator"
import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from 'crypto'
import sendEmail from '../utils/sendEmail.js'
import 'dotenv/config'

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'user not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'invalid password' })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: 'user already exists' })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'invalid email' })
        }
        if (password.length < 6) {
            return res.json({ success: false, message: 'password must be at least 6 characters' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
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
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userModel.findOne({ email })
        if (!user) return res.json({ success: false, message: 'No account found with this email' })

        const token = crypto.randomBytes(32).toString('hex')
        const expiry = Date.now() + 1000 * 60 * 30 // 30 minutes

        user.resetToken = token
        user.resetTokenExpiry = expiry
        await user.save()

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

        await sendEmail(
            email,
            'Reset Your Password — QuickBasket',
            `<p>Hi ${user.name},</p>
             <p>Click the link below to reset your password. This link expires in 30 minutes.</p>
             <a href="${resetLink}" style="background:#000;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px;display:inline-block;margin-top:10px">Reset Password</a>
             <p style="margin-top:16px;color:#999;font-size:12px">If you didn't request this, ignore this email.</p>`
        )

        res.json({ success: true, message: 'Reset link sent to your email' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body
        const user = await userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        })
        if (!user) return res.json({ success: false, message: 'Invalid or expired reset link' })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        user.resetToken = null
        user.resetTokenExpiry = null
        await user.save()

        res.json({ success: true, message: 'Password reset successful' })
        console.log("password reset successfully")
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin, getProfile, updateProfile, forgotPassword, resetPassword }