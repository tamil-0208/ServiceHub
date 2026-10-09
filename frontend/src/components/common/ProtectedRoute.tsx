import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
        <p style={{ color: 'var(--text-muted)' }}>Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to /login preserving the return location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User does not have the required role
    return (
      <div className="card" style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
        <h2 className="card-title" style={{ color: 'var(--danger)' }}>Access Denied</h2>
        <p className="card-subtitle">
          Your account role (<strong>{user.role}</strong>) does not have permission to view this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
