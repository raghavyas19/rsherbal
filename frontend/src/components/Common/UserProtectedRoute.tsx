import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'user') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default UserProtectedRoute; 