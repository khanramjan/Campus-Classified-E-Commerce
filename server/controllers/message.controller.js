import MessageModel from '../models/message.model.js';
import ProductModel from '../models/product.model.js';
import UserModel from '../models/user.model.js';

// Send a message to the seller
export async function sendMessage(request, response) {
    try {
        const { productId, content } = request.body;
        const senderId = request.userId; // from auth middleware

        // Get product and seller details
        const product = await ProductModel.findById(productId);
        if (!product) {
            return response.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        const sellerId = product.userId;
        if (sellerId.toString() === senderId) {
            return response.status(400).json({
                message: "Cannot send message to yourself",
                error: true,
                success: false
            });
        }

        // Create new message
        const message = new MessageModel({
            sender: senderId,
            receiver: sellerId,
            product: productId,
            content
        });

        const savedMessage = await message.save();

        return response.json({
            message: "Message sent successfully",
            error: false,
            success: true,
            data: savedMessage
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Get all messages for a user (both sent and received)
export async function getMessages(request, response) {
    try {
        const userId = request.userId; // from auth middleware

        const messages = await MessageModel.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .populate('product', 'name image')
        .sort({ createdAt: -1 });

        return response.json({
            message: "Messages retrieved successfully",
            error: false,
            success: true,
            data: messages
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Mark messages as read
export async function markAsRead(request, response) {
    try {
        const { messageId } = request.params;
        const userId = request.userId; // from auth middleware

        const message = await MessageModel.findOne({
            _id: messageId,
            receiver: userId,
            read: false
        });

        if (!message) {
            return response.status(404).json({
                message: "Message not found or already read",
                error: true,
                success: false
            });
        }

        message.read = true;
        await message.save();

        return response.json({
            message: "Message marked as read",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Get unread message count
export async function getUnreadCount(request, response) {
    try {
        const userId = request.userId; // from auth middleware

        const count = await MessageModel.countDocuments({
            receiver: userId,
            read: false
        });

        return response.json({
            message: "Unread count retrieved successfully",
            error: false,
            success: true,
            data: { count }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
} 