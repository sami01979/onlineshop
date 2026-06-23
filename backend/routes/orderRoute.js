import express from 'express'
import { placeOrder, allOrders, userOrder, updateStatus, deleteOrder } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import optionalAuth from '../middleware/optionalAuth.js'

const orderRouter = express.Router();

orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)
orderRouter.post('/userorders', authUser, userOrder)
orderRouter.post('/place', optionalAuth, placeOrder)
// ✅ NEW
orderRouter.post('/delete', adminAuth, deleteOrder)

export default orderRouter;