import jwt from 'jsonwebtoken'

const optionalAuth = async (req, res, next) => {
    const { token } = req.headers
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log('decoded token:', decoded)  // ← add this
            req.body.userId = decoded.id
        } catch (error) {
            // invalid token, treat as guest
        }
    }
    next()
}

export default optionalAuth