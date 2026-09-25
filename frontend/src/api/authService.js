import API from './axiosConfig';

const authService = {
    // 1. Register a new user
    register: async (userData) => {
        try {
            const response = await API.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Registration failed";
        }
    },

    // 2. Login an existing user
    login: async (credentials) => {
        try {
            const response = await API.post('/auth/login', credentials);
            
            // If login is successful, save the token and user data to the browser
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Login failed";
        }
    },

    // 3. Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // 4. Forgot Password
    forgotPassword: async (email) => {
        try {
            const response = await API.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to send reset email";
        }
    }
};

export default authService;