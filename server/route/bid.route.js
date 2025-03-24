import { Router } from 'express';
import { enableBidding, getProductBids, getUserBids, placeBid } from '../controllers/bid.controller.js';
import auth from '../middleware/auth.js';

const bidRouter = Router();

// Place a bid on a product
bidRouter.post('/place-bid', auth, placeBid);

// Get all bids for a specific product
bidRouter.get('/product/:productId', getProductBids);

// Get all bids made by the authenticated user
bidRouter.get('/user-bids', auth, getUserBids);

// Enable bidding for a product (seller only)
bidRouter.post('/enable/:productId', auth, enableBidding);

export default bidRouter; 