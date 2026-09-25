import API from './axiosConfig';

const userService = {
    // 1. Get all users (Admin only)
    getAllUsers: async () => {
        try {
            const response = await API.get('/users');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to fetch users";
        }
    },

    // 2. Update a user's role (e.g., promote a student to examiner)
    updateUserRole: async (userId, newRole) => {
        try {
            const response = await API.put(`/users/${userId}/role`, { role: newRole });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to update user role";
        }
    },

    // 3. Update a user's status (Active, Suspended, Pending)
    updateUserStatus: async (userId, newStatus) => {
        try {
            const response = await API.put(`/users/${userId}/status`, { status: newStatus });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to update user status";
        }
    },

    // 4. Delete a user completely from the platform
    deleteUser: async (userId) => {
        try {
            const response = await API.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to delete user";
        }
    }
};

export default userService;