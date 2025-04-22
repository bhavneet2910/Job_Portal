import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from cookies
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (token) {
            const tokenValue = token.split('=')[1];
            config.headers.Authorization = `Bearer ${tokenValue}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // Only clear token and redirect if it's not a login/register request
            const isAuthRequest = originalRequest.url.includes('/user/login') || 
                                originalRequest.url.includes('/user/register');
            
            if (!isAuthRequest) {
                // Clear invalid token
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                
                // If we're not on an auth page, redirect to login
                const currentPath = window.location.pathname;
                const isAuthPage = currentPath.includes('/login') || 
                                  currentPath.includes('/register') ||
                                  currentPath.includes('/forgot-password') ||
                                  currentPath.includes('/reset-password');
                
                if (!isAuthPage) {
                    window.location.href = '/login';
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance; 