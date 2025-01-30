import axios from 'axios';
import { PRODUCTION_API } from "@/utils/constant";
import Cookies from 'js-cookie';
import { getStorageItem } from './useLocalStorage';

// Create a public Axios instance for private requests
export const axiosPublic = axios.create({
    baseURL: PRODUCTION_API, // Your API base URL
});

// Create an Axios instance for private requests (with credentials)
const axiosPrivate = axios.create({
    baseURL: PRODUCTION_API, // Your API base URL
    withCredentials: true, // Always include cookies in requests
});

// Request Interceptor
axiosPrivate.interceptors.request.use(
    (config) => {
        // Get the token from cookies
        const token = Cookies.get('token') || getStorageItem('token'); // Assumes the cookie name is 'token'

        // If token is available, add it to Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor (Handles 401 Unauthorized)
axiosPrivate.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Check for 401 (Unauthorized) status
        if (error.response && error.response.status === 401) {
            console.log('Token expired or invalid');
            // You could redirect to login page or refresh token logic here
            // window.location.href = "/login"; 
            // Or implement refresh token logic if necessary
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default axiosPrivate;
