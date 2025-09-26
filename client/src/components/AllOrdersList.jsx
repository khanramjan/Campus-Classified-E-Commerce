import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "https://campus-classified-e-commerce-3.onrender.com/api/order";

const AllOrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); // Store single order details

    useEffect(() => {
        fetchOrders();
    }, []);

    // Fetch all orders
    const fetchOrders = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch single order details
    const deleteOrder = async (orderId) => {
        try {
            const response = await axios.delete(`${API_URL}/${orderId}`);
            if (response.data.success) {
                setOrders(orders.filter(order => order._id !== orderId)); // Remove deleted order from state
              toast.success("Order deleted successfully");
            } else {
                console.error("Error deleting order:", response.data.message);
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Failed to delete order");
        }
    };
    
    

    // Delete order
    const fetchSingleOrder = async (orderId) => {
        try {
            console.log("Fetching order with ID:", orderId); // Add this to log the orderId
            const response = await axios.get(`${API_URL}/${orderId}`);
            if (response.data.success) {
                setSelectedOrder(response.data.data); // Update state with order data
                console.log(response.data.data);
            } else {
                console.error("Order not found", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };
    
    

    if (loading) {
        return <p>Loading orders...</p>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">All Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Order ID</th>
                            <th className="border p-2">User</th>
                            <th className="border p-2">Product</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Payment Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="text-center">
                                <td className="border p-2">{order.orderId}</td>
                                <td className="border p-2">{order.userId?.name || "N/A"}</td>
                                <td className="border p-2">{order.product_details?.name || "N/A"}</td>
                                <td className="border p-2">${order.totalAmt}</td>
                                <td className="border p-2">{order.payment_status || "Pending"}</td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => fetchSingleOrder(order._id)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => deleteOrder(order._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Single Order Details Modal */}
            {selectedOrder && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Order Details</h2>
                        <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                        <p><strong>User:</strong> {selectedOrder.userId?.name || "N/A"}</p>
                        <p><strong>Product:</strong> {selectedOrder.product_details?.name || "N/A"}</p>
                        <p><strong>Amount:</strong> ${selectedOrder.totalAmt}</p>
                        <p><strong>Payment Status:</strong> {selectedOrder.payment_status || "Pending"}</p>
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllOrdersList;
