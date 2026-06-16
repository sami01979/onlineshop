import express from 'express'
import { loginUser, registerUser, adminLogin, getProfile, updateProfile, forgotPassword, resetPassword } from '../controllers/userControllers.js'
import authUser from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/login', loginUser)
userRouter.post('/register', registerUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/profile/get', authUser, getProfile)
userRouter.post('/profile/update', authUser, updateProfile)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)

export default userRouter