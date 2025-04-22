import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add auth token here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.error('Unauthorized access:', error.response?.data?.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 