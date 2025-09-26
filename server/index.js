import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan';
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'
import bidRouter from './route/bid.route.js'
import messageRouter from './route/message.route.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors({
    credentials: true,
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.CLIENT_URL || "https://campus-classified-e-commerce-cc99lq7d0-ramjan-khans-projects.vercel.app"]
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:8080']
}));
app.use(express.json())
app.use(cookieParser())
app.use(morgan('combined'));
app.use(helmet({
    crossOriginResourcePolicy: false
}))

const PORT = process.env.PORT || 8080

app.get("/", (request, response) => {
    ///server to client
    response.json({
        message: "Server is running " + PORT
    })
})

app.use('/api/user', userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address", addressRouter)
app.use('/api/order', orderRouter)
app.use('/api/bid', bidRouter)
app.use('/api/message', messageRouter)

// Serve static files from client/dist in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')))
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
    })
}

connectDB().then(() => {

    app.listen(PORT, () => {
        console.log(`Server is running on http://127.0.0.1:${PORT}`);
    });
})