import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // Base API URL
});

// Interceptor to handle expired JWT tokens
axiosInstance.interceptors.response.use(
    (response) => {
        // Return response if it's successful
        return response;
    },
    (error) => {
        // If the error response is 401 (Unauthorized), log out the user
        if (error.response && error.response.status === 401) {
            // Clear JWT from local storage or state
            localStorage.removeItem('token');

            // Use a centralized error handling mechanism to handle navigation
            if (typeof window !== 'undefined') {
                window.location.href = '/login'; // Redirect to login page
            }

            // Return a rejection with the error message
            return Promise.reject('Session expired. Please log in again.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
