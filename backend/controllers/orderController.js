import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import mongoose from "mongoose"
import productModel from "../models/productModel.js"
import { sendOrderNotification } from '../routes/notificationRoute.js';

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body
        
        const orderData = {
            userId: userId || null,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        await sendOrderNotification(newOrder);

        for (const item of items) {
            await productModel.findByIdAndUpdate(
                new mongoose.Types.ObjectId(item._id), 
                { $inc: { sells: item.quantity } }
            )
        }

        if (userId) {
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
        }

        res.json({ success: true, message: 'Order placed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const userOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// ✅ NEW — delete order
const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body
        const deleted = await orderModel.findByIdAndDelete(orderId)
        if (!deleted) {
            return res.json({ success: false, message: 'Order not found' })
        }
        res.json({ success: true, message: 'Order deleted' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { placeOrder, allOrders, userOrder, updateStatus, deleteOrder }