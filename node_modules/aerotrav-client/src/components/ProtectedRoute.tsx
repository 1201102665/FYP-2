import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  if (!isAuthenticated) {
    // Show a notification that the user needs to log in
    toast({
      title: "Authentication Required",
      description: "Please log in to continue.",
      variant: "destructive"
    });

    // Redirect to login, but remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location }} replace data-id="d1o4y89k5" data-path="src/components/ProtectedRoute.tsx" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;