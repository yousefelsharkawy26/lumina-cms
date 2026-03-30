import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
  restricted?: boolean;
}

export const PublicRoute = ({ children, restricted = false }: PublicRouteProps) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!(isAuthenticated && restricted)) {
    return <>{children}</>;
  }
  
  const from = location.state?.from?.pathname || "/";
  return <Navigate to={from} replace />;
};
