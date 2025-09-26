const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const serverless = require('serverless-http')

// Import your routes (you'll need to convert them to CommonJS or use dynamic imports)
const app = express()

app.use(cors({
    credentials: true,
    origin: process.env.NODE_ENV === 'production' 
        ? ["https://campus-classified-e-commerce-3.onrender.com", process.env.URL]
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:8080']
}))

app.use(express.json())
app.use(cookieParser())

// Simple test route
app.get('/api', (req, res) => {
    res.json({ 
        message: 'API is working!',
        timestamp: new Date().toISOString()
    })
})

app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Test endpoint working!',
        env: process.env.NODE_ENV
    })
})

module.exports.handler = serverless(app)