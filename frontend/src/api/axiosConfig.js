import axios from 'axios';

// Create a central instance of axios
// Ask your friend what port their backend is running on (e.g., 5000 or 8000)
const API = axios.create({
    baseURL: 'http://localhost:8081/api', // Change this to match your friend's backend URL
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor: This runs before every single request leaves your frontend
API.interceptors.request.use(
    (config) => {
        // If the user is logged in, we will have a token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Attach the token to the request headers for backend security
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;