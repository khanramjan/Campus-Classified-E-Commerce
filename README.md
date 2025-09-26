# Campus Classified E-Commerce Platform

A modern e-commerce platform built with React.js and Node.js, featuring a bidding system and advanced search capabilities.

## Features

### Core Features
- 🔍 Advanced Product Search
- 💰 Bidding System
- 🛒 Shopping Cart
- 👤 User Authentication
- 📱 Responsive Design
- 🔒 Secure Payment Integration
- 📦 Order Management
- 📬 Email Notifications

### User Features
- User Registration & Login
- Profile Management
- Address Management
- Order History
- Wishlist
- Product Reviews

### Seller Features
- Product Management
- Category Management
- Order Tracking
- Sales Analytics
- Bidding Management

### Admin Features
- User Management
- Product Moderation
- Category Management
- Order Management
- Analytics Dashboard

## Tech Stack

### Frontend
- React.js
- Redux for State Management
- Tailwind CSS
- React Router
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer for File Uploads
- Cloudinary for Image Storage

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/khanramjan/Campus-Classified-E-Commerce.git
cd Campus-Classified-E-Commerce
```

2. Install dependencies for both client and server
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables
Create `.env` files in both client and server directories with the following variables:

Server `.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Client `.env`:
```
VITE_API_URL=http://localhost:5000
```

4. Start the development servers
```bash
# Start server
cd server
npm run dev

# Start client (in a new terminal)
cd client
npm run dev
```

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   ├── utils/        # Utility functions
│   │   └── assets/       # Static assets
│   └── public/           # Public assets
└── server/               # Backend Node.js application
    ├── config/          # Configuration files
    ├── controllers/     # Route controllers
    ├── middleware/      # Custom middleware
    ├── models/         # Database models
    ├── routes/         # API routes
    └── utils/          # Utility functions
```

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

### Bidding
- POST /api/bids/place-bid
- GET /api/bids/product/:productId
- GET /api/bids/user-bids

### Orders
- POST /api/orders
- GET /api/orders
- GET /api/orders/:id
- PUT /api/orders/:id

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Ramjan Khan with Ovishek -  khanramjan001@gmail.com

Project Link: https://justecom.netlify.app/
