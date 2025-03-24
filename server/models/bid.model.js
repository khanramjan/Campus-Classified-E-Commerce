import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'won', 'lost', 'cancelled'],
        default: 'active'
    },
    bidTime: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create index for faster queries
bidSchema.index({ product: 1, amount: -1 });

const BidModel = mongoose.model('Bid', bidSchema);
export default BidModel; 