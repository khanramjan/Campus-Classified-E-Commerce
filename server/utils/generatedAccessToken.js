import jwt from 'jsonwebtoken'

const generatedAccessToken = async(userId)=>{
    const secret = process.env.SECRET_KEY_ACCESS_TOKEN || 'campus-ecommerce-2024-access-jwt-secret-key-fallback-secure-long-string'
    
    if (!secret || secret.includes('your-access-token-secret-key-here')) {
        console.error('Invalid or missing SECRET_KEY_ACCESS_TOKEN')
    }
    
    const token = await jwt.sign({ id : userId},
        secret,
        { expiresIn : '5h'}
    )

    return token
}

export default generatedAccessToken