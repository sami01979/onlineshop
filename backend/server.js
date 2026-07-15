import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRouter.js'
import productRouter from './routes/productRoute.js'
import { setDefaultResultOrder } from 'dns'
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoute.js'
import notificationRouter from './routes/notificationRoute.js';

setDefaultResultOrder('ipv4first')

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(cors())
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/notification', notificationRouter);

app.get('/', (req, res) => {
  res.send('api working')
})

app.get('/ping', (req, res) => {
  res.json({ success: true, message: 'pong' })
})

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})