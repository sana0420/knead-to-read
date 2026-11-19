import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-booksdos">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-ktr-green border-t-transparent"></div>
            </div>
        );
    }

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    // If route requires a specific role (e.g. admin) and user doesn't have it
    if (role && user.role !== role) {
        // Customer trying to access admin dashboard -> redirect to customer profile
        return <Navigate to="/profile" replace />;
    }

    return children;
};

export default ProtectedRoute;

