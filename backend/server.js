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

// app config
setDefaultResultOrder('ipv4first')

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middleware
app.use(cors())
app.use(express.json())

// api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)


app.get('/', (req, res) => {
  res.send('api working')
})

/* ping to kepp server awake */
const pingServer = () => {
  const url = process.env.BACKEND_URL || 'http://localhost:4000'
  setInterval(async () => {
    try {
      await fetch(url + '/ping')
      console.log('Server pinged successfully')
    } catch (error) {
      console.log('Ping failed:', error.message)
    }
  }, 10 * 60 * 1000) 
}

pingServer()

app.get('/ping', (req, res) => {
  res.json({ success: true, message: 'pong' })
})
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})