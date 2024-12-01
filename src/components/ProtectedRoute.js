import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, currentUser } = useSelector(state => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirigir a login guardando la ubicación para redirigir después
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si se requiere un rol específico y el usuario no lo tiene
    if (role && currentUser?.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;