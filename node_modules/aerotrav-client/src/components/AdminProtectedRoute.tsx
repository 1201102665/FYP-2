import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const location = useLocation();

  // Show loading if we're still checking authentication
  if (!user && isAuthenticated === false) {
    return <LoadingSpinner />;
  }

  // Redirect to admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Redirect to home if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render the protected component if user is admin
  return <>{children}</>;
};

export default AdminProtectedRoute; 