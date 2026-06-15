import userModel from "../models/userModel.js"

const addToCart = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body
        
        console.log('addToCart body:', req.body) 
        const userData = await userModel.findById(userId)
        let cartData = userData.cartData || {}
        cartData[itemId] = (cartData[itemId] || 0) + quantity
        await userModel.findByIdAndUpdate(userId, { $set: { cartData } })
        res.json({ success: true, message: 'Added to Cart' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


/* update user cart */
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body
        const userData = await userModel.findById(userId)
        let cartData = userData.cartData || {}
        if (quantity === 0) {
            delete cartData[itemId]
        } else {
            cartData[itemId] = quantity
        }
        await userModel.findByIdAndUpdate(userId, { $set: { cartData } })
        res.json({ success: true, message: 'Cart Updated' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
/* get user cart data */
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData
        res.json({ success: true, cartData })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

export { addToCart, updateCart, getUserCart }

