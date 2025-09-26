import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from '../../server/config/connectDB.js'
import userRouter from '../../server/route/user.route.js'
import categoryRouter from '../../server/route/category.route.js'
import uploadRouter from '../../server/route/upload.router.js'
import subCategoryRouter from '../../server/route/subCategory.route.js'
import productRouter from '../../server/route/product.route.js'
import cartRouter from '../../server/route/cart.route.js'
import addressRouter from '../../server/route/address.route.js'
import orderRouter from '../../server/route/order.route.js'
import bidRouter from '../../server/route/bid.route.js'
import messageRouter from '../../server/route/message.route.js'
import serverless from 'serverless-http'

dotenv.config()

const app = express()

app.use(cors({
    credentials: true,
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.URL || "https://your-netlify-site.netlify.app"]
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:8080']
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('combined'))
app.use(helmet({
    crossOriginResourcePolicy: false
}))

// Connect to database
connectDB()

// API routes
app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/file', uploadRouter)
app.use('/api/subcategory', subCategoryRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)
app.use('/api/bid', bidRouter)
app.use('/api/message', messageRouter)

app.get('/api', (req, res) => {
    res.json({ message: 'API is working!' })
})

export const handler = serverless(app)