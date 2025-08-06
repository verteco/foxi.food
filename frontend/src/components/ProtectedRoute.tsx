import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOwner?: boolean; // If true, requires restaurant owner role
  fallbackPath?: string; // Custom redirect path
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOwner = false, 
  fallbackPath = '/login' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted location for redirecting after login
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (requireOwner && !user?.is_restaurant_owner) {
    return <Navigate to="/restaurants" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
