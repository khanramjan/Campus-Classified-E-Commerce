import { Router } from 'express';
import { getMessages, getUnreadCount, markAsRead, sendMessage } from '../controllers/message.controller.js';
import auth from '../middleware/auth.js';

const messageRouter = Router();

// Send a message to the seller
messageRouter.post('/send', auth, sendMessage);

// Get all messages for a user
messageRouter.get('/', auth, getMessages);

// Mark a message as read
messageRouter.put('/read/:messageId', auth, markAsRead);

// Get unread message count
messageRouter.get('/unread-count', auth, getUnreadCount);

export default messageRouter; 