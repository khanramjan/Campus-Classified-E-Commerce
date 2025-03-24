import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
    },
    image: {
        type: Array,
        default: []
    },
    category: [{
        type: mongoose.Schema.ObjectId,
        ref: 'category'
    }],
    subCategory: [{
        type: mongoose.Schema.ObjectId,
        ref: 'subCategory'
    }],
    unit: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        defualt: null
    },
    discount: {
        type: Number,
        default: null
    },
    description: {
        type: String,
        default: ""
    },
    more_details: {
        type: Object,
        default: {}
    },
    publish: {
        type: Boolean,
        default: true
    },
    // New bidding fields
    isBiddable: {
        type: Boolean,
        default: false
    },
    startingBid: {
        type: Number,
        default: null
    },
    currentBid: {
        type: Number,
        default: null
    },
    bidEndTime: {
        type: Date,
        default: null
    },
    bidStatus: {
        type: String,
        enum: ['active', 'ended', 'not_started'],
        default: 'not_started'
    },
    winningBid: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bid',
        default: null
    }
}, {
    timestamps: true
})

// Create a text index with weights
productSchema.index({
    name: "text",
    description: "text",
}, {
    weights: {
        name: 10,
        description: 5,
    },
});

const ProductModel = mongoose.model('product', productSchema)

export default ProductModel