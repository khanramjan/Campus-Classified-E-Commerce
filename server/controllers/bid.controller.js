import BidModel from '../models/bid.model.js';
import ProductModel from '../models/product.model.js';

// Place a new bid
export async function placeBid(request, response) {
    try {
        const { productId, amount } = request.body;
        const userId = request.userId; // from auth middleware

        // Validate product exists and is biddable
        const product = await ProductModel.findById(productId);
        if (!product) {
            return response.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        if (!product.isBiddable) {
            return response.status(400).json({
                message: "This product is not available for bidding",
                error: true,
                success: false
            });
        }

        if (product.bidStatus !== 'active') {
            return response.status(400).json({
                message: "Bidding is not active for this product",
                error: true,
                success: false
            });
        }

        // Check if bid amount is higher than current bid
        if (product.currentBid && amount <= product.currentBid) {
            return response.status(400).json({
                message: "Bid amount must be higher than current bid",
                error: true,
                success: false
            });
        }

        if (!product.currentBid && amount < product.startingBid) {
            return response.status(400).json({
                message: "Bid amount must be at least the starting bid",
                error: true,
                success: false
            });
        }

        // Create new bid
        const newBid = new BidModel({
            product: productId,
            user: userId,
            amount
        });

        // Save bid and update product
        const savedBid = await newBid.save();
        await ProductModel.findByIdAndUpdate(productId, {
            currentBid: amount
        });

        return response.json({
            message: "Bid placed successfully",
            error: false,
            success: true,
            data: savedBid
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Get all bids for a product
export async function getProductBids(request, response) {
    try {
        const { productId } = request.params;

        const bids = await BidModel.find({ product: productId })
            .populate('user', 'name email')
            .sort({ amount: -1 });

        return response.json({
            message: "Bids retrieved successfully",
            error: false,
            success: true,
            data: bids
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Get user's bids
export async function getUserBids(request, response) {
    try {
        const userId = request.userId; // from auth middleware

        const bids = await BidModel.find({ user: userId })
            .populate('product', 'name image currentBid bidEndTime')
            .sort({ createdAt: -1 });

        return response.json({
            message: "User bids retrieved successfully",
            error: false,
            success: true,
            data: bids
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Enable bidding for a product
export async function enableBidding(request, response) {
    try {
        const { productId } = request.params;
        const { startingBid, bidEndTime } = request.body;
        const userId = request.userId; // from auth middleware

        const product = await ProductModel.findById(productId);
        
        if (!product) {
            return response.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        if (product.userId.toString() !== userId) {
            return response.status(403).json({
                message: "Not authorized to enable bidding for this product",
                error: true,
                success: false
            });
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, {
            isBiddable: true,
            startingBid,
            bidEndTime,
            bidStatus: 'active',
            currentBid: null,
            winningBid: null
        }, { new: true });

        return response.json({
            message: "Bidding enabled successfully",
            error: false,
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
} 