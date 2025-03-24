import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { format } from 'date-fns';

const MessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector(state => state.user);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setError(null);
            const response = await Axios({
                ...SummaryApi.getMessages
            });

            console.log('Messages response:', response.data); // Debug log

            if (response.data.success) {
                if (Array.isArray(response.data.data)) {
                    setMessages(response.data.data);
                } else {
                    console.error('Messages data is not an array:', response.data.data);
                    toast.error('Invalid messages data format');
                }
            } else {
                setError(response.data.message || 'Failed to fetch messages');
                toast.error(response.data.message || 'Failed to fetch messages');
            }
        } catch (error) {
            console.error('Error fetching messages:', error.response || error);
            const errorMessage = error.response?.data?.message || error.message || 'Error loading messages';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        
        if (!replyContent.trim()) {
            toast.error('Please enter a message');
            return;
        }

        try {
            const response = await Axios({
                ...SummaryApi.sendMessage,
                data: {
                    productId: selectedMessage.product._id,
                    content: replyContent.trim()
                }
            });

            if (response.data.success) {
                toast.success('Reply sent successfully');
                setReplyContent('');
                fetchMessages(); // Refresh messages
            } else {
                toast.error(response.data.message || 'Failed to send reply');
            }
        } catch (error) {
            console.error('Error sending reply:', error.response || error);
            toast.error(error.response?.data?.message || 'Error sending reply');
        }
    };

    const markAsRead = async (messageId) => {
        try {
            const response = await Axios({
                ...SummaryApi.markMessageAsRead,
                url: `${SummaryApi.markMessageAsRead.url}/${messageId}`
            });

            if (response.data.success) {
                fetchMessages(); // Refresh messages
            }
        } catch (error) {
            console.error('Error marking message as read:', error.response || error);
        }
    };

    if (!user._id) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                Please log in to view your messages
            </div>
        );
    }

    if (isLoading) {
        return <div className="container mx-auto px-4 py-8">Loading messages...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-red-600">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="md:col-span-1 border rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Conversations</h2>
                    <div className="space-y-2">
                        {messages.length === 0 ? (
                            <div className="text-gray-500 text-center">No messages yet</div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message._id}
                                    className={`p-3 rounded cursor-pointer ${
                                        selectedMessage?._id === message._id
                                            ? 'bg-green-100'
                                            : message.read
                                            ? 'bg-white'
                                            : 'bg-blue-50'
                                    }`}
                                    onClick={() => {
                                        setSelectedMessage(message);
                                        if (!message.read) {
                                            markAsRead(message._id);
                                        }
                                    }}
                                >
                                    <div className="font-medium">
                                        {message.sender._id === user._id ? 'You' : message.sender.name}
                                    </div>
                                    <div className="text-sm text-gray-600 truncate">
                                        {message.content}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Details */}
                <div className="md:col-span-2 border rounded-lg p-4">
                    {selectedMessage ? (
                        <div>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">
                                    Conversation about: {selectedMessage.product.name}
                                </h3>
                                <div className="space-y-4">
                                    {messages
                                        .filter(m => 
                                            (m.sender._id === selectedMessage.sender._id && m.receiver._id === selectedMessage.receiver._id) ||
                                            (m.sender._id === selectedMessage.receiver._id && m.receiver._id === selectedMessage.sender._id)
                                        )
                                        .map((message) => (
                                            <div
                                                key={message._id}
                                                className={`p-3 rounded ${
                                                    message.sender._id === user._id
                                                        ? 'bg-green-100 ml-auto'
                                                        : 'bg-gray-100'
                                                } max-w-[80%]`}
                                            >
                                                <div className="text-sm text-gray-600">
                                                    {message.content}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {format(new Date(message.createdAt), 'h:mm a')}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Reply Form */}
                            <form onSubmit={handleReply} className="mt-4">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="w-full p-2 border rounded mb-2 h-24"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Send Reply
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            Select a conversation to view messages
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;