import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import PropTypes from 'prop-types';

const BiddingSection = ({ product }) => {
    const [bidAmount, setBidAmount] = useState('');
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.user);
    const [timeLeft, setTimeLeft] = useState('');

    // Fetch bids for the product
    const fetchBids = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getProductBids,
                url: `${SummaryApi.getProductBids.url}/${product._id}`
            });
            if (response.data.success) {
                setBids(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching bids:', error);
        }
    };

    // Calculate time left for bidding
    useEffect(() => {
        if (!product.bidEndTime) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(product.bidEndTime).getTime();
            const distance = end - now;

            if (distance < 0) {
                setTimeLeft('Bidding ended');
                clearInterval(timer);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [product.bidEndTime]);

    // Place a bid
    const handleBid = async (e) => {
        e.preventDefault();
        if (!user._id) {
            toast.error('Please login to place a bid');
            return;
        }

        if (!bidAmount || isNaN(bidAmount)) {
            toast.error('Please enter a valid bid amount');
            return;
        }

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.placeBid,
                data: {
                    productId: product._id,
                    amount: parseFloat(bidAmount)
                }
            });

            if (response.data.success) {
                toast.success('Bid placed successfully');
                setBidAmount('');
                fetchBids();
            } else {
                toast.error(response.data.message || 'Failed to place bid');
            }
        } catch (error) {
            console.error('Bid error:', error);
            if (error.response?.status === 401) {
                toast.error('Please login again to place a bid');
                // Optionally redirect to login page
                // window.location.href = '/login';
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error placing bid. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (product._id) {
            fetchBids();
        }
    }, [product._id]);

    if (!product.isBiddable) {
        return null;
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow mt-4">
            <h3 className="text-xl font-semibold mb-4">Bidding Section</h3>
            
            {/* Bidding Status */}
            <div className="mb-4">
                <p className="text-gray-600">Current Bid: ${product.currentBid || product.startingBid}</p>
                <p className="text-gray-600">Time Left: {timeLeft}</p>
            </div>

            {/* Place Bid Form */}
            {product.bidStatus === 'active' && (
                <form onSubmit={handleBid} className="mb-6">
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder="Enter bid amount"
                            className="flex-1 p-2 border rounded"
                            min={product.currentBid ? product.currentBid + 1 : product.startingBid}
                            step="0.01"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {loading ? 'Placing Bid...' : 'Place Bid'}
                        </button>
                    </div>
                </form>
            )}

            {/* Bid History */}
            <div>
                <h4 className="font-semibold mb-2">Bid History</h4>
                {bids.length > 0 ? (
                    <ul className="space-y-2">
                        {bids.map((bid) => (
                            <li key={bid._id} className="flex justify-between items-center text-sm">
                                <span>{bid.user.name}</span>
                                <span>${bid.amount}</span>
                                <span className="text-gray-500">
                                    {new Date(bid.bidTime).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No bids yet</p>
                )}
            </div>
        </div>
    );
};

BiddingSection.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        isBiddable: PropTypes.bool.isRequired,
        bidStatus: PropTypes.string,
        currentBid: PropTypes.number,
        startingBid: PropTypes.number,
        bidEndTime: PropTypes.string
    }).isRequired
};

export default BiddingSection; 