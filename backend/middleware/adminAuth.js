import jwt from 'jsonwebtoken'

const adminAuth = (req, res, next) => {
    try {
        const {token} = req.headers
        if(!token){
            return res.json({success:false, message:'Unauthorized'})
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        const decoded_id = token_decode?.id || token_decode;
        
        if(decoded_id !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({success:false, message:'Unauthorized'})
        }
        next()
    } catch (error) {
        console.log(error)
        return res.json({success:false, message:'Unauthorized'})
    }
}

export default adminAuth