import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  // If unauthenticated, redirect to dedicated admin login page
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  // If logged in but not admin, redirect to home
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AdminProtectedRoute;