import express from 'express'
import {placeOrder, allOrders , userOrder, updateStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router();

orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

orderRouter.post('/place',placeOrder)
orderRouter.post('/userorders',authUser,userOrder)

export default orderRouter;
