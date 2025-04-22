import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ProtectedRoute = ({ children }) => {
    const { authUser, loading } = useSelector(store => store.auth);
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Add a small delay to prevent rapid checks
        const timer = setTimeout(() => {
            setIsChecking(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    // Show loading state while checking
    if (isChecking || loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>;
    }

    // Allow access to login, signup, jobs, and browse pages for unauthenticated users
    if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/jobs' || location.pathname === '/browse') {
        if (authUser) {
            // If user is already logged in, redirect based on role
            if (authUser.role === 'recruiter') {
                return <Navigate to="/admin/companies" replace />;
            }
            return <Navigate to="/" replace />;
        }
        return children;
    }

    // Handle protected routes
    if (!authUser) {
        // Store the attempted URL for redirect after login
        localStorage.setItem('redirectAfterLogin', location.pathname);
        return <Navigate to="/login" replace />;
    }

    // Role-based redirection
    if (authUser.role === 'recruiter' && location.pathname === '/') {
        return <Navigate to="/admin/companies" replace />;
    }

    if (authUser.role === 'student' && location.pathname.startsWith('/admin')) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;