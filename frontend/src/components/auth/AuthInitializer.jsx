import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthUser, setLoading } from '@/redux/authSlice';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

const AuthInitializer = () => {
    const dispatch = useDispatch();
    const authInProgress = useRef(false);
    const welcomeShown = useRef(false);
    const lastAuthTime = useRef(0);
    const AUTH_COOLDOWN = 1000; // 1 second cooldown between auth attempts

    const showWelcomeMessage = useCallback((user) => {
        // Clear any existing welcome messages
        toast.dismiss('welcome-message');
        
        // Show new welcome message with unique ID and longer duration
        toast.success(`Welcome back ${user.fullname}`, {
            id: 'welcome-message',
            duration: 4000,
            position: 'top-center'
        });
    }, []);

    const validateToken = useCallback(async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            if (!token) {
                return { isValid: false, user: null };
            }

            const res = await axiosInstance.get('/user/current-user');
            if (res.data.success) {
                return { isValid: true, user: res.data.user };
            }
            return { isValid: false, user: null };
        } catch (error) {
            // Only clear token if it's not a network error
            if (error.response?.status === 401) {
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            }
            return { isValid: false, user: null };
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        let timeoutId;
        let retryCount = 0;
        const MAX_RETRIES = 3;

        const initializeAuth = async () => {
            const now = Date.now();
            
            // Prevent multiple simultaneous auth attempts and enforce cooldown
            if (authInProgress.current || (now - lastAuthTime.current) < AUTH_COOLDOWN) {
                return;
            }

            authInProgress.current = true;
            lastAuthTime.current = now;

            try {
                // Add a small delay to prevent rapid refreshes
                await new Promise(resolve => timeoutId = setTimeout(resolve, 300));
                
                if (!mounted) return;

                dispatch(setLoading(true));
                
                const { isValid, user } = await validateToken();
                
                if (!mounted) return;

                if (isValid && user) {
                    dispatch(setAuthUser(user));
                    
                    // Show welcome message only once and not on auth pages
                    const currentPath = window.location.pathname;
                    const isAuthPage = currentPath.includes('/login') || 
                                      currentPath.includes('/register') ||
                                      currentPath.includes('/forgot-password') ||
                                      currentPath.includes('/reset-password');
                    
                    if (!welcomeShown.current && !isAuthPage) {
                        showWelcomeMessage(user);
                        welcomeShown.current = true;
                    }
                } else {
                    // Only clear auth state if we've retried enough times
                    if (retryCount >= MAX_RETRIES) {
                        dispatch(setAuthUser(null));
                        // Clear any existing welcome messages if auth fails
                        toast.dismiss('welcome-message');
                    } else {
                        retryCount++;
                        // Retry after a delay
                        setTimeout(() => {
                            if (mounted) {
                                initializeAuth();
                            }
                        }, 1000);
                    }
                }
            } catch (error) {
                console.log('Authentication error:', error);
                if (mounted) {
                    // Only clear auth state if we've retried enough times
                    if (retryCount >= MAX_RETRIES) {
                        dispatch(setAuthUser(null));
                        // Clear any existing welcome messages on error
                        toast.dismiss('welcome-message');
                    } else {
                        retryCount++;
                        // Retry after a delay
                        setTimeout(() => {
                            if (mounted) {
                                initializeAuth();
                            }
                        }, 1000);
                    }
                }
            } finally {
                if (mounted) {
                    dispatch(setLoading(false));
                    authInProgress.current = false;
                }
            }
        };

        // Initialize auth
        initializeAuth();

        // Cleanup function
        return () => {
            mounted = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            authInProgress.current = false;
            // Clear any existing welcome messages on unmount
            toast.dismiss('welcome-message');
        };
    }, [dispatch, showWelcomeMessage, validateToken]);

    return null;
};

export default AuthInitializer; 