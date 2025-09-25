# Campus Classified E-Commerce Deployment Script
Write-Host "🚀 Starting Campus Classified E-Commerce Deployment..." -ForegroundColor Green

Write-Host "📦 Installing server dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Server dependency installation failed" -ForegroundColor Red
    exit 1 
}

Write-Host "📦 Installing client dependencies..." -ForegroundColor Yellow
Set-Location ../client
npm install
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Client dependency installation failed" -ForegroundColor Red
    exit 1 
}

Write-Host "🏗️ Building client application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Client build failed" -ForegroundColor Red
    exit 1 
}

Set-Location ..

Write-Host "✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host "🌐 Ready for Vercel deployment" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Push your code to GitHub" -ForegroundColor White
Write-Host "2. Go to vercel.com and import your GitHub repository" -ForegroundColor White
Write-Host "3. Set environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "4. Deploy automatically!" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Environment variables needed in Vercel:" -ForegroundColor Cyan
Write-Host "- MONGODB_URI" -ForegroundColor White
Write-Host "- SECRET_KEY_ACCESS_TOKEN" -ForegroundColor White
Write-Host "- SECRET_KEY_REFRESH_TOKEN" -ForegroundColor White
Write-Host "- RESEND_API" -ForegroundColor White
Write-Host "- CLODINARY_CLOUD_NAME" -ForegroundColor White
Write-Host "- CLODINARY_API_KEY" -ForegroundColor White
Write-Host "- CLODINARY_API_SECRET_KEY" -ForegroundColor White
Write-Host "- STRIPE_SECRET_KEY" -ForegroundColor White