import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ProtectedRoute component that requires authentication to access
 * Can optionally require admin role
 * @param {React.ReactNode} children - The child components to render if authenticated
 * @param {boolean} adminOnly - Whether the route requires admin role (default: false)
 * @returns {JSX.Element} The protected route component
 */
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default React.memo(ProtectedRoute);
