import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8080/api/user";  // Updated to match the backend

const AllUsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}`);
            if (response.data.success) {
                setUsers(response.data.data);
                console.log(response.data.data);
            } else {
                toast.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    // Delete user
    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(`${API_URL}/${userId}`);
            if (response.data.success) {
                setUsers(users.filter(user => user._id !== userId)); // Remove deleted user from state
                toast.success("User deleted successfully");
            } else {
                toast.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
    };

    // Update user role
    const updateUserRole = async (userId, newRole) => {
        try {
            const response = await axios.patch(`${API_URL}/${userId}/role`, { newRole });
            if (response.data.success) {
                // Update the user in the state with the new role
                setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
                toast.success("User role updated successfully");
            } else {
                toast.error("Failed to update user role");
            }
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Failed to update user role");
        }
    };

    if (loading) {
        return <p>Loading users...</p>; // You could replace this with a spinner or skeleton loader
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">All Users</h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="text-center">
                                <td className="border p-2">{user.name}</td>
                                <td className="border p-2 flex justify-center">{user.email}</td>
                                <td className="border p-2">
                                    <select
                                        value={user.role}
                                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                                        className="border p-1"
                                    >
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => deleteUser(user._id)}
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
        </div>
    );
};

export default AllUsersList;
