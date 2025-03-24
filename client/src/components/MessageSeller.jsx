import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import PropTypes from 'prop-types';

const MessageSeller = ({ product }) => {
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector(state => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user._id) {
            toast.error('Please login to send a message');
            return;
        }

        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        if (!product || !product._id) {
            toast.error('Invalid product information');
            return;
        }

        try {
            setIsLoading(true);
            const response = await Axios({
                ...SummaryApi.sendMessage,
                data: {
                    productId: product._id,
                    content: message.trim()
                }
            });

            if (response.data.success) {
                toast.success('Message sent successfully');
                setMessage('');
                setIsOpen(false);
            } else {
                toast.error(response.data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message || 'Error sending message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user._id) {
        return (
            <button 
                onClick={() => toast.error('Please login to send a message')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Message Seller
            </button>
        );
    }

    return (
        <div>
            <button 
                onClick={() => setIsOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Message Seller
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Message Seller</h3>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here..."
                                className="w-full p-2 border rounded mb-4 h-32"
                                required
                                disabled={isLoading}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

MessageSeller.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired
    }).isRequired
};

export default MessageSeller; 