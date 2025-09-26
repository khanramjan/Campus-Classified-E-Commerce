import UserModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'

const genertedRefreshToken = async(userId)=>{
    const secret = process.env.SECRET_KEY_REFRESH_TOKEN || 'campus-ecommerce-2024-refresh-jwt-secret-key-fallback-secure-different-long'
    
    if (!secret || secret.includes('your-refresh-token-secret-key-here')) {
        console.error('Invalid or missing SECRET_KEY_REFRESH_TOKEN')
    }
    
    const token = await jwt.sign({ id : userId},
        secret,
        { expiresIn : '7d'}
    )

    const updateRefreshTokenUser = await UserModel.updateOne(
        { _id : userId},
        {
            refresh_token : token
        }
    )

    return token
}

export default genertedRefreshToken