#!/bin/bash

echo "🚀 Starting Campus Classified E-Commerce Deployment..."

echo "📦 Installing dependencies..."
cd server && npm install
cd ../client && npm install
cd ..

echo "🏗️ Building client..."
cd client && npm run build
cd ..

echo "✅ Deployment preparation complete!"
echo "🌐 Ready for Vercel deployment"

# Instructions for manual deployment:
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your GitHub repo to Vercel"
echo "3. Set environment variables in Vercel dashboard"
echo "4. Deploy automatically on push"